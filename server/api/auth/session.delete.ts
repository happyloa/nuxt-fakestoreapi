import { defineEventHandler, setResponseHeader } from "h3";
import type { SessionResponse } from "#shared/types/storefront";
import { clearStorefrontSession } from "../../utils/session";

export default defineEventHandler((event): SessionResponse => {
  setResponseHeader(event, "Cache-Control", "no-store");
  clearStorefrontSession(event);
  return { authenticated: false, user: null };
});
