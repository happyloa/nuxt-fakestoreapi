// Limits shared by the browser cart, page routes and server validation, so
// the client never accepts something the server would reject.

export const MAX_CART_LINES = 50;
export const MAX_LINE_QUANTITY = 99;
export const MAX_PRICE = 1_000_000;
/** Product and user ids are 1–6 digits. */
export const MAX_ENTITY_ID = 999_999;
export const ENTITY_ID_SOURCE = "[1-9]\\d{0,5}";

const ENTITY_ID_STRING = new RegExp(`^${ENTITY_ID_SOURCE}$`);

/** Returns a valid id from a number or a route/query string, otherwise null. */
export function parseEntityId(value: unknown): number | null {
  const id =
    typeof value === "string" && ENTITY_ID_STRING.test(value) ? Number(value) : value;
  return typeof id === "number" && Number.isSafeInteger(id) && id >= 1 && id <= MAX_ENTITY_ID
    ? id
    : null;
}
