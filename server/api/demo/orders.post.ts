import {
  createError,
  defineEventHandler,
} from "h3";
import type { CartLine, DemoOrder } from "#shared/types/storefront";
import { MAX_CART_LINES, MAX_LINE_QUANTITY, parseEntityId } from "#shared/utils/limits";
import { isRecord } from "../../utils/fakestore";
import { getSessionUser } from "../../utils/session";
import { readBoundedJsonBody } from "../../utils/request-body";

type DemoOrderInput = {
  lines: CartLine[];
};

function invalidOrderInput() {
  return createError({ statusCode: 400, statusMessage: "Invalid order input" });
}

function parseQuantity(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 1 ||
    value > MAX_LINE_QUANTITY
  ) {
    throw invalidOrderInput();
  }
  return value;
}

function parseDemoOrderInput(value: unknown): DemoOrderInput {
  if (
    !isRecord(value) ||
    !Array.isArray(value.lines) ||
    value.lines.length === 0 ||
    value.lines.length > MAX_CART_LINES
  ) {
    throw invalidOrderInput();
  }

  const productIds = new Set<number>();
  const lines = value.lines.map((line): CartLine => {
    if (!isRecord(line)) {
      throw invalidOrderInput();
    }

    // JSON ids must be numbers; numeric strings are rejected.
    const productId = typeof line.productId === "number" ? parseEntityId(line.productId) : null;
    const quantity = parseQuantity(line.quantity);
    if (productId === null || productIds.has(productId)) throw invalidOrderInput();

    productIds.add(productId);
    return { productId, quantity };
  });

  return { lines };
}

export default defineEventHandler(async (event): Promise<DemoOrder> => {
  const user = await getSessionUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Authentication is required" });
  }

  const { lines } = parseDemoOrderInput(await readBoundedJsonBody(event));
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

  return {
    id: `demo_${crypto.randomUUID()}`,
    userId: user.id,
    createdAt: new Date().toISOString(),
    lines,
    itemCount,
  };
});
