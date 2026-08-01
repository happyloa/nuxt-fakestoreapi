import {
  deleteCookie,
  getCookie,
  setCookie,
  type H3Event,
} from "h3";
import type { PublicUser } from "~/types/storefront";

const SESSION_COOKIE_NAME = "storefront_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface StoredSession {
  expiresAt: number;
  user: PublicUser;
}

declare global {
  var __storefrontDemoSessions: Map<string, StoredSession> | undefined;
}

/**
 * This is intentionally an opaque, server-side demo session. The upstream JWT
 * is used only while handling a successful upstream login and is never stored
 * in the browser cookie or trusted on subsequent requests.
 */
const sessionStore =
  globalThis.__storefrontDemoSessions ??
  (globalThis.__storefrontDemoSessions = new Map<string, StoredSession>());

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: !import.meta.dev,
    path: "/",
  };
}

function copyPublicUser(user: PublicUser): PublicUser {
  return {
    ...user,
    name: { ...user.name },
    address: { ...user.address },
  };
}

function getSessionId(event: H3Event): string | null {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME);
  return sessionId && SESSION_ID_PATTERN.test(sessionId) ? sessionId : null;
}

function removeExpiredSessions(now = Date.now()): void {
  for (const [sessionId, session] of sessionStore) {
    if (session.expiresAt <= now) sessionStore.delete(sessionId);
  }
}

export function getSessionUser(event: H3Event): PublicUser | null {
  const sessionId = getSessionId(event);
  if (!sessionId) return null;

  const session = sessionStore.get(sessionId);
  if (!session || session.expiresAt <= Date.now()) {
    sessionStore.delete(sessionId);
    deleteCookie(event, SESSION_COOKIE_NAME, cookieOptions());
    return null;
  }

  return copyPublicUser(session.user);
}

export function createSession(event: H3Event, user: PublicUser): void {
  removeExpiredSessions();

  const previousSessionId = getSessionId(event);
  if (previousSessionId) sessionStore.delete(previousSessionId);

  const sessionId = crypto.randomUUID();
  sessionStore.set(sessionId, {
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1_000,
    user: copyPublicUser(user),
  });

  setCookie(event, SESSION_COOKIE_NAME, sessionId, {
    ...cookieOptions(),
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearStorefrontSession(event: H3Event): void {
  const sessionId = getSessionId(event);
  if (sessionId) sessionStore.delete(sessionId);
  deleteCookie(event, SESSION_COOKIE_NAME, cookieOptions());
}
