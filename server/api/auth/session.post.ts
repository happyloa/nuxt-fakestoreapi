import {
  createError,
  defineEventHandler,
  readValidatedBody,
  setResponseHeader,
} from "h3";
import type { SessionResponse } from "#shared/types/storefront";
import {
  authenticateWithFakeStore,
  getPublicUserAfterUpstreamLogin,
} from "../../utils/fakestore";
import { createSession } from "../../utils/session";

type LoginInput = {
  username: string;
  password: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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
  const { username, password } = await readValidatedBody(event, parseLoginInput);
  const token = await authenticateWithFakeStore(username, password);
  const user = await getPublicUserAfterUpstreamLogin(token);

  createSession(event, user);
  return { authenticated: true, user };
});
