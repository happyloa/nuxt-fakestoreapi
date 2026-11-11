import {
  createError,
  defineEventHandler,
  setResponseHeader,
} from "h3";
import type { LoginInput, SessionResponse } from "#shared/types/storefront";
import {
  authenticateWithFakeStore,
  getPublicUserAfterUpstreamLogin,
  isRecord,
} from "../../utils/fakestore";
import { createSession } from "../../utils/session";
import { readBoundedJsonBody } from "../../utils/request-body";

function parseLoginInput(value: unknown): LoginInput {
  if (
    !isRecord(value) ||
    typeof value.username !== "string" ||
    typeof value.password !== "string"
  ) {
    throw createError({ statusCode: 400, statusMessage: "Invalid login input" });
  }

  const username = value.username.trim();
  const password = value.password;
  if (
    !username ||
    username.length > 120 ||
    !password ||
    password.length > 256
  ) {
    throw createError({ statusCode: 400, statusMessage: "Invalid login input" });
  }

  return { username, password };
}

export default defineEventHandler(async (event): Promise<SessionResponse> => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const { username, password } = parseLoginInput(await readBoundedJsonBody(event));
  const token = await authenticateWithFakeStore(event, username, password);
  const user = await getPublicUserAfterUpstreamLogin(event, token);

  await createSession(event, user);
  return { authenticated: true, user };
});
