import { defineEventHandler, setResponseHeader } from "h3";
import type { SessionResponse } from "#shared/types/storefront";
import { getSessionUser } from "../../utils/session";

export default defineEventHandler((event): SessionResponse => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const user = getSessionUser(event);
  return { authenticated: user !== null, user };
});
