import { createError, defineEventHandler, getHeader, getRequestURL, setResponseHeader } from "h3";

export default defineEventHandler((event) => {
  if (!event.path.startsWith("/api/")) return;
  if (event.path.startsWith("/api/auth/") || event.path.startsWith("/api/demo/")) {
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
  if (Number(getHeader(event, "content-length")) > 32_768) {
    throw createError({ statusCode: 413, statusMessage: "Request body is too large" });
  }
});
