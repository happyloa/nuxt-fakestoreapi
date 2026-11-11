// Pure helpers for the API playground proxy. Kept free of Nitro auto-imports
// so tests can load this module directly.
import { ENTITY_ID_SOURCE } from "#shared/utils/limits";

const COLLECTION = /^(products|users|carts)$/;
const ITEM = new RegExp(`^(products|users|carts)/${ENTITY_ID_SOURCE}$`);
const QUERY_PATH = new RegExp(
  `^(products/categories|products/category/[^/]{1,120}|carts/user/${ENTITY_ID_SOURCE})$`,
);
const UNSAFE_SEGMENT = /[\\/\u0000-\u001f\u007f]/;
const SECRET_KEYS = new Set(["password", "token", "__v"]);

/**
 * Decode each route segment exactly once. The client already URL-encodes
 * values such as "men's clothing"; encoding again would query a different
 * category. Dot segments and encoded separators are rejected, so decoding can
 * never let URL normalization re-target another upstream path.
 */
export function decodePlaygroundPath(raw: string): string[] | null {
  const segments: string[] = [];
  for (const segment of raw.split("/")) {
    let value: string;
    try {
      value = decodeURIComponent(segment);
    } catch {
      return null;
    }
    if (!value || value === "." || value === ".." || UNSAFE_SEGMENT.test(value)) {
      return null;
    }
    segments.push(value);
  }
  return segments;
}

export function isAllowedPlaygroundOperation(method: string, path: string): boolean {
  if (method === "GET") return COLLECTION.test(path) || ITEM.test(path) || QUERY_PATH.test(path);
  if (method === "POST") return COLLECTION.test(path);
  if (method === "PUT" || method === "PATCH" || method === "DELETE") return ITEM.test(path);
  return false;
}

export function toUpstreamPath(segments: string[]): string {
  return segments.map(encodeURIComponent).join("/");
}

/** Drop credentials and internal fields from upstream responses at any depth. */
export function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !SECRET_KEYS.has(key.toLowerCase()))
      .map(([key, entry]) => [key, redactSecrets(entry)]),
  );
}
