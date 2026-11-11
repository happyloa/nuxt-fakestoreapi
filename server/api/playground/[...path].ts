import { createError, defineEventHandler, getQuery, getRouterParam, setResponseHeader } from "h3";
import { getFakeStoreBaseUrl, isRecord } from "../../utils/fakestore";
import {
  decodePlaygroundPath,
  isAllowedPlaygroundOperation,
  redactSecrets,
  toUpstreamPath,
} from "../../utils/playground";
import { readBoundedJsonBody } from "../../utils/request-body";

/** Restricted public mock API playground. Never forward cookies or upstream secrets. */
export default defineEventHandler(async (event): Promise<unknown> => {
  setResponseHeader(event, "Cache-Control", "no-store");
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
  try {
    const result = await $fetch<unknown>(`${getFakeStoreBaseUrl(event)}/${toUpstreamPath(segments)}`, {
      method: method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE", query, body, timeout: 8000, retry: 0,
    });
    return redactSecrets(result);
  } catch {
    throw createError({ statusCode: 502, statusMessage: "The demo service is temporarily unavailable" });
  }
});
