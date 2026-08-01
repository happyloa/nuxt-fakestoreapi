import { createError } from "h3";
import { $fetch } from "ofetch";
import type {
  CatalogPayload,
  Product,
  PublicUser,
} from "~/types/storefront";

const DEFAULT_FAKE_STORE_API_URL = "https://fakestoreapi.com";
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_PRODUCT_ID = 1_000_000;

type UnknownRecord = Record<string, unknown>;

interface UpstreamRequestOptions {
  method?: "POST";
  body?: Record<string, string>;
  notFoundMessage?: string;
  unauthorizedMessage?: string;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorStatus(error: unknown): number | undefined {
  if (!isRecord(error)) return undefined;

  if (typeof error.statusCode === "number") return error.statusCode;

  const response = error.response;
  if (isRecord(response) && typeof response.status === "number") {
    return response.status;
  }

  return undefined;
}

function upstreamResponseError() {
  return createError({
    statusCode: 502,
    statusMessage: "The catalog service returned invalid data",
  });
}

function upstreamUnavailableError() {
  return createError({
    statusCode: 502,
    statusMessage: "The catalog service is temporarily unavailable",
  });
}

function unauthorizedError(message = "Authentication is required") {
  return createError({ statusCode: 401, statusMessage: message });
}

function requireRecord(value: unknown): UnknownRecord {
  if (!isRecord(value)) throw upstreamResponseError();
  return value;
}

function requireText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") throw upstreamResponseError();

  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw upstreamResponseError();
  }

  return normalized;
}

function requireNumber(
  value: unknown,
  minimum: number,
  maximum: number,
): number {
  const normalized =
    typeof value === "string" && value.trim() !== "" ? Number(value) : value;

  if (
    typeof normalized !== "number" ||
    !Number.isFinite(normalized) ||
    normalized < minimum ||
    normalized > maximum
  ) {
    throw upstreamResponseError();
  }

  return normalized;
}

function requireInteger(
  value: unknown,
  minimum: number,
  maximum: number,
): number {
  const normalized = requireNumber(value, minimum, maximum);
  if (!Number.isSafeInteger(normalized)) throw upstreamResponseError();
  return normalized;
}

function normalizeImage(value: unknown): string {
  const image = requireText(value, 2_000);

  try {
    const url = new URL(image);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Unsupported image protocol");
    }
    return url.toString();
  } catch {
    throw upstreamResponseError();
  }
}

function normalizeProduct(value: unknown): Product {
  const product = requireRecord(value);
  const rating = requireRecord(product.rating);

  return {
    id: requireInteger(product.id, 1, MAX_PRODUCT_ID),
    title: requireText(product.title),
    price: requireNumber(product.price, 0, 1_000_000),
    description: requireText(product.description, 10_000),
    category: requireText(product.category, 120),
    image: normalizeImage(product.image),
    rating: {
      rate: requireNumber(rating.rate, 0, 5),
      count: requireInteger(rating.count, 0, 10_000_000),
    },
  };
}

function normalizeProducts(value: unknown): Product[] {
  if (!Array.isArray(value) || value.length > 100) {
    throw upstreamResponseError();
  }

  return value.map(normalizeProduct);
}

function normalizeCategories(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 100) {
    throw upstreamResponseError();
  }

  return [...new Set(value.map((category) => requireText(category, 120)))];
}

function normalizePublicUser(value: unknown): PublicUser {
  const user = requireRecord(value);
  const name = requireRecord(user.name);
  const address = requireRecord(user.address);

  const email = requireText(user.email, 254);
  if (!email.includes("@")) throw upstreamResponseError();

  return {
    id: requireInteger(user.id, 1, MAX_PRODUCT_ID),
    username: requireText(user.username, 120),
    email,
    name: {
      firstName: requireText(name.firstname, 120),
      lastName: requireText(name.lastname, 120),
    },
    address: {
      city: requireText(address.city, 160),
      street: requireText(address.street, 160),
      number: requireInteger(address.number, 0, 1_000_000),
      zipcode: requireText(address.zipcode, 32),
    },
    phone: requireText(user.phone, 64),
  };
}

async function requestFakeStore(
  path: string,
  options: UpstreamRequestOptions = {},
): Promise<unknown> {
  try {
    const configuredBaseUrl = useRuntimeConfig().fakeStoreApiBase;
    const baseUrl =
      typeof configuredBaseUrl === "string" && configuredBaseUrl.length > 0
        ? configuredBaseUrl.replace(/\/+$/, "")
        : DEFAULT_FAKE_STORE_API_URL;

    return await $fetch<unknown>(`${baseUrl}${path}`, {
      method: options.method,
      body: options.body,
      retry: 0,
      timeout: REQUEST_TIMEOUT_MS,
    });
  } catch (error) {
    const status = getErrorStatus(error);

    if (status === 401 || status === 403) {
      throw unauthorizedError(options.unauthorizedMessage);
    }

    if (status === 404 && options.notFoundMessage) {
      throw createError({
        statusCode: 404,
        statusMessage: options.notFoundMessage,
      });
    }

    throw upstreamUnavailableError();
  }
}

function parsePositiveInteger(value: unknown): number | null {
  const normalized =
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;

  if (
    typeof normalized !== "number" ||
    !Number.isSafeInteger(normalized) ||
    normalized < 1 ||
    normalized > MAX_PRODUCT_ID
  ) {
    return null;
  }

  return normalized;
}

function getUserIdFromTrustedLoginToken(token: string): number | null {
  const payloadSegment = token.split(".")[1];
  if (!payloadSegment || payloadSegment.length > 4_096) return null;

  try {
    const normalizedPayload = payloadSegment
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadSegment.length / 4) * 4, "=");
    const payload: unknown = JSON.parse(atob(normalizedPayload));

    if (!isRecord(payload)) return null;

    if (typeof payload.exp === "number" && payload.exp * 1_000 <= Date.now()) {
      return null;
    }

    return parsePositiveInteger(payload.sub);
  } catch {
    return null;
  }
}

export async function getCatalog(): Promise<CatalogPayload> {
  const [products, categories] = await Promise.all([
    requestFakeStore("/products"),
    requestFakeStore("/products/categories"),
  ]);

  return {
    products: normalizeProducts(products),
    categories: normalizeCategories(categories),
  };
}

export async function getProduct(id: number): Promise<Product> {
  const product = normalizeProduct(
    await requestFakeStore(`/products/${id}`, {
      notFoundMessage: "Product not found",
    }),
  );

  if (product.id !== id) throw upstreamResponseError();
  return product;
}

export async function authenticateWithFakeStore(
  username: string,
  password: string,
): Promise<string> {
  const response = requireRecord(
    await requestFakeStore("/auth/login", {
      method: "POST",
      body: { username, password },
      unauthorizedMessage: "Invalid credentials",
    }),
  );

  const token = requireText(response.token, 4_096);
  if (token.includes(" ")) throw upstreamResponseError();
  return token;
}

/**
 * The token is read only from a successful HTTPS response of Fake Store's
 * login endpoint. It must never be accepted from a browser cookie or request.
 */
export async function getPublicUserAfterUpstreamLogin(
  token: string,
): Promise<PublicUser> {
  const userId = getUserIdFromTrustedLoginToken(token);
  if (!userId) throw unauthorizedError("Your session is invalid or expired");

  try {
    return normalizePublicUser(
      await requestFakeStore(`/users/${userId}`, {
        notFoundMessage: "User not found",
        unauthorizedMessage: "Your session is invalid or expired",
      }),
    );
  } catch (error) {
    if (getErrorStatus(error) === 404) {
      throw unauthorizedError("Your session is invalid or expired");
    }
    throw error;
  }
}
