import { createError, defineEventHandler, setResponseHeader } from "h3";
import type { PublicUser } from "~/types/storefront";
import { getSessionUser } from "../../utils/session";

export default defineEventHandler(async (event): Promise<PublicUser> => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const user = getSessionUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Authentication is required" });
  }

  return user;
});
