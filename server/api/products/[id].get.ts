import { createError, getRouterParam } from "h3";
import { getProduct } from "../../utils/fakestore";

function parseProductId(value: string | undefined): number {
  if (!value || !/^[1-9]\d*$/.test(value)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid product id" });
  }

  const id = Number(value);
  if (!Number.isSafeInteger(id) || id > 1_000_000) {
    throw createError({ statusCode: 400, statusMessage: "Invalid product id" });
  }

  return id;
}

// One cache entry per product id; the query string is ignored. Error
// responses (400/404/502) are never cached.
export default defineCachedEventHandler(
  (event) => getProduct(event, parseProductId(getRouterParam(event, "id"))),
  {
    name: "product",
    maxAge: 300,
    swr: true,
    getKey: (event) => getRouterParam(event, "id") ?? "",
  },
);
