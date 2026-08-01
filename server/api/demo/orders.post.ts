import {
  createError,
  defineEventHandler,
  readValidatedBody,
  setResponseHeader,
} from "h3";
import type { CartLine, DemoOrder } from "~/types/storefront";
import { getSessionUser } from "../../utils/session";

type DemoOrderInput = {
  lines: CartLine[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidOrderInput() {
  return createError({ statusCode: 400, statusMessage: "Invalid order input" });
}

function parsePositiveInteger(value: unknown, maximum: number): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 1 ||
    value > maximum
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
    value.lines.length > 50
  ) {
    throw invalidOrderInput();
  }

  const productIds = new Set<number>();
  const lines = value.lines.map((line): CartLine => {
    if (!isRecord(line)) {
      throw invalidOrderInput();
    }

    const productId = parsePositiveInteger(line.productId, 1_000_000);
    const quantity = parsePositiveInteger(line.quantity, 99);
    if (productIds.has(productId)) throw invalidOrderInput();

    productIds.add(productId);
    return { productId, quantity };
  });

  return { lines };
}

export default defineEventHandler(async (event): Promise<DemoOrder> => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const user = getSessionUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Authentication is required" });
  }

  const { lines } = await readValidatedBody(event, parseDemoOrderInput);
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

  return {
    id: `demo_${crypto.randomUUID()}`,
    userId: user.id,
    createdAt: new Date().toISOString(),
    lines,
    itemCount,
  };
});
