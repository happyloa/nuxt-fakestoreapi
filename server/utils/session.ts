import {
  deleteCookie,
  getCookie,
  sealSession,
  setCookie,
  unsealSession,
  type H3Event,
  type SessionConfig,
} from "h3";
import type { PublicUser } from "#shared/types/storefront";

// __Host- binds the cookie to this exact host over HTTPS, so a sibling
// subdomain cannot plant or override it. Dev runs without HTTPS.
export const SESSION_COOKIE_NAME = import.meta.dev
  ? "storefront_session"
  : "__Host-storefront_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const MIN_PASSWORD_LENGTH = 32;

interface SessionData {
  user?: PublicUser;
}

let instancePassword: string | undefined;

/**
 * Sessions are sealed (encrypted and signed) cookies, so every server
 * instance, including separate Cloudflare Workers isolates, can read them.
 * Only the public profile is stored; the upstream JWT never leaves the login
 * request. Without NUXT_SESSION_PASSWORD each instance uses its own random
 * key, which keeps login working but only on the instance that created it.
 */
function getSessionPassword(event: H3Event): string {
  const configured = useRuntimeConfig(event).sessionPassword;
  if (typeof configured === "string" && configured.length >= MIN_PASSWORD_LENGTH) {
    return configured;
  }
  if (!instancePassword) {
    instancePassword = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
      byte.toString(16).padStart(2, "0")).join("");
    console.warn(
      "[session] NUXT_SESSION_PASSWORD is missing or shorter than 32 characters; sessions are limited to this server instance.",
    );
  }
  return instancePassword;
}

function sessionConfig(event: H3Event): SessionConfig {
  return {
    name: SESSION_COOKIE_NAME,
    password: getSessionPassword(event),
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: !import.meta.dev,
    path: "/",
  };
}

export async function getSessionUser(event: H3Event): Promise<PublicUser | null> {
  const sealed = getCookie(event, SESSION_COOKIE_NAME);
  if (!sealed) return null;

  try {
    const session = await unsealSession(event, sessionConfig(event), sealed);
    const user = (session.data as SessionData | undefined)?.user;
    if (user) return user;
  } catch {
    // Tampered, expired, or sealed with a different password.
  }
  deleteCookie(event, SESSION_COOKIE_NAME, cookieOptions());
  return null;
}

export async function createSession(event: H3Event, user: PublicUser): Promise<void> {
  // Seal a fresh session directly. h3's useSession() would also create one for
  // anonymous visitors, which would set a cookie on every request.
  event.context.sessions ??= Object.create(null);
  event.context.sessions![SESSION_COOKIE_NAME] = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    data: { user } satisfies SessionData,
  };
  const sealed = await sealSession(event, sessionConfig(event));
  setCookie(event, SESSION_COOKIE_NAME, sealed, {
    ...cookieOptions(),
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Logout clears the browser cookie; sealed sessions have no server-side state to revoke. */
export function clearStorefrontSession(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE_NAME, cookieOptions());
}
