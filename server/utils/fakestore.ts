import type { Product } from "#shared/types/fakestore";
import { createError, type H3Event } from "h3";
import type {
  CatalogPayload,
  PublicUser,
} from "#shared/types/storefront";
import { MAX_ENTITY_ID, MAX_PRICE, parseEntityId } from "#shared/utils/limits";

const DEFAULT_FAKE_STORE_API_URL = "https://fakestoreapi.com";
const REQUEST_TIMEOUT_MS = 8_000;
const STALE_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1_000;

/**
 * Shared options for every upstream request. Redirects are not followed (the
 * allow-list only covers the first hop; "manual" also works on Workers), and
 * bodies must be JSON so text or HTML is never relayed. Fake Store answers
 * unknown ids with an empty body, which becomes null.
 */
export const UPSTREAM_FETCH_OPTIONS = {
  redirect: "manual",
  parseResponse: (text: string): unknown => (text === "" ? null : JSON.parse(text)),
} as const;

type UnknownRecord = Record<string, unknown>;

interface UpstreamRequestOptions {
  method?: "POST";
  body?: Record<string, string>;
  notFoundMessage?: string;
  unauthorizedMessage?: string;
}

interface CacheEntry<T> {
  value: T;
  cachedAt: number;
}

// This is deliberately process-local: it never persists customer data, but it
// lets a warm Nuxt/Nitro instance continue serving a previously validated
// catalogue during a short upstream outage.
let catalogCache: CacheEntry<CatalogPayload> | null = null;
const productCache = new Map<number, CacheEntry<Product>>();

function cacheValue<T>(value: T): CacheEntry<T> {
  return { value, cachedAt: Date.now() };
}

function getStaleValue<T>(entry: CacheEntry<T> | null | undefined): T | null {
  if (!entry || Date.now() - entry.cachedAt > STALE_CACHE_MAX_AGE_MS) {
    return null;
  }
  return entry.value;
}

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Upstream base URL without a trailing slash; falls back when the env value is empty. */
export function getFakeStoreBaseUrl(event: H3Event): string {
  const configuredBaseUrl = useRuntimeConfig(event).fakeStoreApiBase;
  return typeof configuredBaseUrl === "string" && configuredBaseUrl.length > 0
    ? configuredBaseUrl.replace(/\/+$/, "")
    : DEFAULT_FAKE_STORE_API_URL;
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
    id: requireInteger(product.id, 1, MAX_ENTITY_ID),
    title: requireText(product.title),
    price: requireNumber(product.price, 0, MAX_PRICE),
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
    id: requireInteger(user.id, 1, MAX_ENTITY_ID),
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
  event: H3Event,
  path: string,
  options: UpstreamRequestOptions = {},
): Promise<unknown> {
  try {
    return await $fetch<unknown>(`${getFakeStoreBaseUrl(event)}${path}`, {
      ...UPSTREAM_FETCH_OPTIONS,
      method: options.method,
      body: options.body,
      // Retrying a GET masks brief DNS/network failures without retrying
      // mutations or credential submissions.
      retry: options.method ? 0 : 1,
      retryDelay: 300,
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

    return parseEntityId(payload.sub);
  } catch {
    return null;
  }
}

export async function getCatalog(event: H3Event): Promise<CatalogPayload> {
  try {
    const [products, categories] = await Promise.all([
      requestFakeStore(event, "/products"),
      requestFakeStore(event, "/products/categories"),
    ]);
    const catalog = {
      products: normalizeProducts(products),
      categories: normalizeCategories(categories),
    };

    catalogCache = cacheValue(catalog);
    for (const product of catalog.products) {
      productCache.set(product.id, cacheValue(product));
    }
    return catalog;
  } catch (error) {
    const staleCatalog = getStaleValue(catalogCache);
    if (staleCatalog) return staleCatalog;
    throw error;
  }
}

export async function getProduct(event: H3Event, id: number): Promise<Product> {
  try {
    const response = await requestFakeStore(event, `/products/${id}`, {
      notFoundMessage: "Product not found",
    });
    // Fake Store answers unknown ids with 200 and an empty body, which ofetch
    // resolves to "" on Node and to undefined/null on other runtimes.
    if (response === null || response === undefined || response === "") {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }
    const product = normalizeProduct(response);

    if (product.id !== id) throw upstreamResponseError();
    productCache.set(product.id, cacheValue(product));
    return product;
  } catch (error) {
    if (getErrorStatus(error) === 404) throw error;
    const staleProduct = getStaleValue(productCache.get(id));
    if (staleProduct) return staleProduct;
    throw error;
  }
}

export async function authenticateWithFakeStore(
  event: H3Event,
  username: string,
  password: string,
): Promise<string> {
  const response = requireRecord(
    await requestFakeStore(event, "/auth/login", {
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
  event: H3Event,
  token: string,
): Promise<PublicUser> {
  const userId = getUserIdFromTrustedLoginToken(token);
  if (!userId) throw unauthorizedError("Your session is invalid or expired");

  try {
    return normalizePublicUser(
      await requestFakeStore(event, `/users/${userId}`, {
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
