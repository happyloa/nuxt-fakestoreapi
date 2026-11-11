import { defineEventHandler, setResponseHeader } from "h3";
import type { SessionResponse } from "#shared/types/storefront";
import { getSessionUser } from "../../utils/session";

export default defineEventHandler(async (event): Promise<SessionResponse> => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const user = await getSessionUser(event);
  return { authenticated: user !== null, user };
});
