import { createError, defineEventHandler, getRouterParam } from "h3";
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

export default defineEventHandler(async (event) => {
  const id = parseProductId(getRouterParam(event, "id"));
  return getProduct(id);
});
