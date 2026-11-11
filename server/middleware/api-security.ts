import { createError, defineEventHandler, getCookie, getHeader, getRequestURL, setResponseHeader } from "h3";
import { MAX_API_BODY_BYTES } from "../utils/request-body";
import { SESSION_COOKIE_NAME } from "../utils/session";

const PRIVATE_API = /^\/api\/(auth|demo|playground)\//;

export default defineEventHandler((event) => {
  if (!event.path.startsWith("/api/")) {
    // Pages rendered for a signed-in visitor embed their profile in the
    // payload, so keep them out of shared caches.
    if (getCookie(event, SESSION_COOKIE_NAME)) {
      setResponseHeader(event, "Cache-Control", "private, no-store");
    }
    return;
  }
  if (PRIVATE_API.test(event.path)) {
    setResponseHeader(event, "Cache-Control", "no-store");
  }
  if (["GET", "HEAD", "OPTIONS"].includes(event.method)) return;
  const origin = getHeader(event, "origin");
  if (getHeader(event, "sec-fetch-site") === "cross-site"
    || (origin && origin !== getRequestURL(event).origin)) {
    throw createError({ statusCode: 403, statusMessage: "Cross-origin requests are not allowed" });
  }
  if (!getHeader(event, "content-type")?.toLowerCase().startsWith("application/json") && event.method !== "DELETE") {
    throw createError({ statusCode: 415, statusMessage: "JSON input is required" });
  }
  if (Number(getHeader(event, "content-length")) > MAX_API_BODY_BYTES) {
    throw createError({ statusCode: 413, statusMessage: "Request body is too large" });
  }
});
