import { createError, defineEventHandler, getQuery, getRouterParam, readBody, setResponseHeader } from "h3";
import { $fetch } from "ofetch";

/** Restricted public mock API playground. Never forward cookies or upstream secrets. */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const path = getRouterParam(event, "path") || "";
  const method = event.method;
  const collection = /^(products|users|carts)$/.test(path);
  const item = /^(products|users|carts)\/[1-9]\d{0,5}$/.test(path);
  const queryPath = /^(products\/categories|products\/category\/[^/]{1,120}|carts\/user\/[1-9]\d{0,5})$/.test(path);
  if (!((method === "GET" && (collection || item || queryPath))
    || (method === "POST" && collection)
    || (["PUT", "PATCH", "DELETE"].includes(method) && item))) {
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
    const input: unknown = await readBody(event);
    if (!input || typeof input !== "object" || Array.isArray(input) || JSON.stringify(input).length > 32_768) {
      throw createError({ statusCode: 400, statusMessage: "Invalid demo input" });
    }
    body = input as Record<string, unknown>;
  }
  try {
    const base = String(useRuntimeConfig().fakeStoreApiBase).replace(/\/+$/, "");
    const result = await $fetch<unknown>(`${base}/${path.split("/").map(encodeURIComponent).join("/")}`, {
      method: method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE", query, body, timeout: 8000, retry: 0,
    });
    return redactSecrets(result);
  } catch {
    throw createError({ statusCode: 502, statusMessage: "The demo service is temporarily unavailable" });
  }
});

function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) =>
    !["password", "token", "__v"].includes(key.toLowerCase()),
  ).map(([key, entry]) => [key, redactSecrets(entry)]));
}
