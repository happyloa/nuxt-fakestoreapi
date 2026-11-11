import { createError, defineEventHandler, getQuery, getRouterParam } from "h3";
import { getFakeStoreBaseUrl, isRecord, UPSTREAM_FETCH_OPTIONS } from "../../utils/fakestore";
import {
  decodePlaygroundPath,
  isAllowedPlaygroundOperation,
  redactSecrets,
  toUpstreamPath,
} from "../../utils/playground";
import { readBoundedJsonBody } from "../../utils/request-body";

/**
 * Restricted public mock API playground. Never forwards cookies or upstream
 * secrets, and only relays JSON objects or arrays (never text or HTML).
 * Cache-Control: no-store is set by server/middleware/api-security.ts.
 */
export default defineEventHandler(async (event): Promise<unknown> => {
  const method = event.method;
  const segments = decodePlaygroundPath(getRouterParam(event, "path") || "");
  if (!segments || !isAllowedPlaygroundOperation(method, segments.join("/"))) {
    throw createError({ statusCode: 404, statusMessage: "Unsupported demo operation" });
  }
  const query = getQuery(event);
  for (const [key, value] of Object.entries(query)) {
    const valid = typeof value === "string" && (
      (key === "limit" && /^[1-9]\d?$/.test(value))
      || (key === "sort" && ["asc", "desc"].includes(value))
      || (["startDate", "endDate"].includes(key) && /^\d{4}-\d{2}-\d{2}$/.test(value)));
    if (!valid) throw createError({ statusCode: 400, statusMessage: "Invalid query" });
  }
  let body: Record<string, unknown> | undefined;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const input = await readBoundedJsonBody(event);
    if (!isRecord(input)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid demo input" });
    }
    body = input;
  }
  let result: unknown;
  try {
    result = await $fetch<unknown>(`${getFakeStoreBaseUrl(event)}/${toUpstreamPath(segments)}`, {
      ...UPSTREAM_FETCH_OPTIONS,
      method: method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE", query, body, timeout: 8000, retry: 0,
    });
  } catch {
    throw createError({ statusCode: 502, statusMessage: "The demo service is temporarily unavailable" });
  }
  // Fake Store answers unknown ids with an empty body.
  if (result === null) throw createError({ statusCode: 404, statusMessage: "Not found" });
  if (!Array.isArray(result) && !isRecord(result)) {
    throw createError({ statusCode: 502, statusMessage: "The demo service returned invalid data" });
  }
  return redactSecrets(result);
});
