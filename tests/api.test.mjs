import assert from "node:assert/strict";
import test from "node:test";
import { createApp, createRouter, toNodeListener } from "h3";
import { fetchNodeRequestHandler } from "node-mock-http";
import apiSecurity from "../server/middleware/api-security.ts";
import sessionPost from "../server/api/auth/session.post.ts";
import sessionDelete from "../server/api/auth/session.delete.ts";
import me from "../server/api/auth/me.get.ts";
import orders from "../server/api/demo/orders.post.ts";
import playground from "../server/api/playground/[...path].ts";
import { getProduct, UPSTREAM_FETCH_OPTIONS } from "../server/utils/fakestore.ts";
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
const upstreamCalls = [];
globalThis.$fetch = async (url, options = {}) => {
  upstreamCalls.push({ url, options });
  if (url === "https://upstream.test/products/1") return { id: 1, title: "Bag", token: "secret" };
  // Fake Store answers unknown ids with an empty body (parsed to null).
  if (url === "https://upstream.test/products/999") return null;
  if (url === "https://upstream.test/products/category/html") return "<script>alert(1)</script>";
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
  .post("/api/demo/orders", orders)
  .use("/api/playground/**:path", playground)
  .get("/account", () => "page"));
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

// Outside dev the cookie carries the __Host- prefix.
const sessionCookie = (response) => response.headers.getSetCookie().find((value) => value.startsWith("__Host-storefront_session="));
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
  assert.equal(warn.mock.callCount(), 1, "the missing key is reported once per instance");
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

test("the playground relays only JSON objects or arrays and never follows redirects", async () => {
  upstreamCalls.length = 0;
  const ok = await request("/api/playground/products/1");
  assert.equal(ok.status, 200);
  assert.deepEqual(await ok.json(), { id: 1, title: "Bag" });
  assert.equal(ok.headers.get("cache-control"), "no-store");
  assert.equal(upstreamCalls[0].options.redirect, "manual");
  assert.equal(upstreamCalls[0].options.parseResponse, UPSTREAM_FETCH_OPTIONS.parseResponse);
  assert.equal((await request("/api/playground/products/999")).status, 404);
  assert.equal((await request("/api/playground/products/category/html")).status, 502);
});

test("upstream bodies must be JSON; an empty body means not found", async () => {
  const parse = UPSTREAM_FETCH_OPTIONS.parseResponse;
  assert.equal(parse(""), null);
  assert.deepEqual(parse('{"id":1}'), { id: 1 });
  assert.throws(() => parse("<html></html>"));
  await assert.rejects(getProduct({}, 999), (error) => error.statusCode === 404);
});

test("pages rendered for a signed-in visitor are kept out of shared caches", async () => {
  assert.equal((await request("/account")).headers.get("cache-control"), null);
  const { cookie } = await login();
  assert.equal((await request("/account", { cookie })).headers.get("cache-control"), "private, no-store");
});
