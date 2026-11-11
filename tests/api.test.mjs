import assert from "node:assert/strict";
import test from "node:test";
import { createApp, createRouter, toNodeListener } from "h3";
import { fetchNodeRequestHandler } from "node-mock-http";
import apiSecurity from "../server/middleware/api-security.ts";
import sessionPost from "../server/api/auth/session.post.ts";
import sessionDelete from "../server/api/auth/session.delete.ts";
import me from "../server/api/auth/me.get.ts";
import orders from "../server/api/demo/orders.post.ts";
import { MAX_API_BODY_BYTES } from "../server/utils/request-body.ts";

// Nitro auto-imports used by the handlers, stubbed with a fake upstream.
const runtimeConfig = { fakeStoreApiBase: "https://upstream.test", sessionPassword: "a".repeat(32) };
const token = (payload) => ["header", Buffer.from(JSON.stringify(payload)).toString("base64url"), "signature"].join(".");
const upstreamUser = {
  id: 2, username: "mor_2314", email: "morrison@example.com", password: "upstream-secret", __v: 0,
  name: { firstname: "david", lastname: "morrison" },
  address: { city: "kilcoole", street: "Lovers Ln", number: 7267, zipcode: "12926-3874" },
  phone: "1-570-236-7033",
};
globalThis.useRuntimeConfig = () => runtimeConfig;
globalThis.$fetch = async (url, options = {}) => {
  if (url === "https://upstream.test/auth/login") {
    if (options.body?.password === "correct") return { token: token({ sub: 2 }) };
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }
  if (url === "https://upstream.test/users/2") return upstreamUser;
  throw new Error(`Unexpected upstream request: ${url}`);
};

const app = createApp({
  // Mirror Nitro's Pages adapter so request bodies arrive pre-buffered.
  onRequest(event) {
    event.context.cloudflare = event.node.req.__unenv__?._platform?.cloudflare;
  },
});
app.use(apiSecurity);
app.use(createRouter()
  .post("/api/auth/session", sessionPost)
  .delete("/api/auth/session", sessionDelete)
  .get("/api/auth/me", me)
  .post("/api/demo/orders", orders));
const listener = toNodeListener(app);

function request(path, { method = "GET", headers = {}, body, cookie } = {}) {
  const raw = body === undefined ? undefined : Buffer.from(typeof body === "string" ? body : JSON.stringify(body));
  return fetchNodeRequestHandler(listener, path, {
    method,
    headers: {
      ...(raw ? { "content-type": "application/json", "content-length": String(raw.length) } : {}),
      ...(cookie ? { cookie } : {}),
      ...headers,
    },
    body: raw,
    context: { _platform: { cloudflare: {} } },
  });
}

const sessionCookie = (response) => response.headers.getSetCookie().find((value) => value.startsWith("storefront_session="));
const cookiePair = (setCookie) => setCookie.split(";")[0];

async function login() {
  const response = await request("/api/auth/session", { method: "POST", body: { username: "mor_2314", password: "correct" } });
  assert.equal(response.status, 200);
  return { response, cookie: cookiePair(sessionCookie(response)) };
}

test("cross-site, non-JSON and oversized writes are rejected before any handler runs", async () => {
  const body = { username: "mor_2314", password: "correct" };
  assert.equal((await request("/api/auth/session", { method: "POST", body, headers: { origin: "https://evil.example" } })).status, 403);
  assert.equal((await request("/api/auth/session", { method: "POST", body, headers: { "sec-fetch-site": "cross-site" } })).status, 403);
  assert.equal((await request("/api/auth/session", { method: "POST", body, headers: { "content-type": "text/plain" } })).status, 415);
  const oversized = JSON.stringify({ value: "x".repeat(MAX_API_BODY_BYTES) });
  assert.equal((await request("/api/auth/session", { method: "POST", body: oversized })).status, 413);
});

test("login seals only the public profile into a hardened cookie", async () => {
  const { response, cookie } = await login();
  const text = await response.text();
  assert.equal(JSON.parse(text).user.username, "mor_2314");
  assert.doesNotMatch(text, /upstream-secret|password|token/);
  const setCookie = sessionCookie(response);
  for (const attribute of ["HttpOnly", "Secure", "SameSite=Lax", "Path=/", "Max-Age=604800"]) {
    assert.match(setCookie, new RegExp(`; ${attribute}(;|$)`), attribute);
  }
  // The profile is encrypted, not merely encoded.
  assert.doesNotMatch(decodeURIComponent(cookie), /mor_2314|morrison/);

  const session = await (await request("/api/auth/me", { cookie })).json();
  assert.equal(session.authenticated, true);
  assert.equal(session.user.id, 2);
  assert.equal((await request("/api/auth/session", { method: "POST", body: { username: "mor_2314", password: "wrong" } })).status, 401);
});

test("anonymous, tampered and foreign-key sessions are treated as signed out", async () => {
  const anonymous = await request("/api/auth/me");
  assert.deepEqual(await anonymous.json(), { authenticated: false, user: null });
  assert.equal(anonymous.headers.getSetCookie().length, 0, "anonymous visitors must not receive a session cookie");

  const { cookie } = await login();
  const tampered = `${cookie.slice(0, -4)}AAAA`;
  const rejected = await request("/api/auth/me", { cookie: tampered });
  assert.equal((await rejected.json()).authenticated, false);
  assert.match(sessionCookie(rejected), /Max-Age=0/);

  const previous = runtimeConfig.sessionPassword;
  runtimeConfig.sessionPassword = "b".repeat(32);
  try {
    assert.equal((await (await request("/api/auth/me", { cookie })).json()).authenticated, false);
  } finally {
    runtimeConfig.sessionPassword = previous;
  }
});

test("without NUXT_SESSION_PASSWORD sessions still work on the instance that created them", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const previous = runtimeConfig.sessionPassword;
  runtimeConfig.sessionPassword = "";
  try {
    const { cookie } = await login();
    assert.equal((await (await request("/api/auth/me", { cookie })).json()).authenticated, true);
  } finally {
    runtimeConfig.sessionPassword = previous;
  }
  assert.ok(warn.mock.callCount() <= 1);
});

test("demo orders require a session and validate every line", async () => {
  const valid = { lines: [{ productId: 1, quantity: 2 }, { productId: 5, quantity: 1 }] };
  assert.equal((await request("/api/demo/orders", { method: "POST", body: valid })).status, 401);

  const { cookie } = await login();
  const invalid = [
    {},
    { lines: [] },
    { lines: [{ productId: 1, quantity: 100 }] },
    { lines: [{ productId: 0, quantity: 1 }] },
    { lines: [{ productId: 1, quantity: 1 }, { productId: 1, quantity: 2 }] },
    { lines: Array.from({ length: 51 }, (_, index) => ({ productId: index + 1, quantity: 1 })) },
    { lines: [{ productId: "1", quantity: 1 }] },
  ];
  for (const body of invalid) {
    assert.equal((await request("/api/demo/orders", { method: "POST", body, cookie })).status, 400, JSON.stringify(body).slice(0, 80));
  }
  const order = await (await request("/api/demo/orders", { method: "POST", body: valid, cookie })).json();
  assert.equal(order.userId, 2);
  assert.equal(order.itemCount, 3);
  assert.deepEqual(order.lines, valid.lines);
  assert.match(order.id, /^demo_/);
});

test("logout clears the session cookie", async () => {
  const { cookie } = await login();
  const response = await request("/api/auth/session", { method: "DELETE", cookie });
  assert.equal(response.status, 200);
  assert.match(sessionCookie(response), /Max-Age=0/);
});
