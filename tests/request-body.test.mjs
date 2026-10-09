import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer, request } from "node:http";
import test from "node:test";
import { createApp, defineEventHandler, toNodeListener } from "h3";
import { fetchNodeRequestHandler } from "node-mock-http";
import { MAX_API_BODY_BYTES, readBoundedJsonBody } from "../server/utils/request-body.ts";

const app = createApp({
  // This is the platform context that Nitro adds before invoking handlers.
  onRequest(event) {
    event.context.cloudflare = event.node.req.__unenv__?._platform?.cloudflare;
  },
});
app.use(defineEventHandler(readBoundedJsonBody));
const listener = toNodeListener(app);

async function pagesPost(body) {
  // Nitro 2 uses this adapter and an already buffered body on Pages.
  return fetchNodeRequestHandler(listener, "/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: Buffer.from(body),
    context: { _platform: { cloudflare: {} } },
  });
}

test("Pages buffered JSON returns without waiting for Node stream events", { timeout: 2000 }, async () => {
  const response = await pagesPost('{"value":"繁體中文"}');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { value: "繁體中文" });
});

test("Pages rejects malformed and empty JSON", { timeout: 2000 }, async () => {
  for (const input of ["{", ""]) assert.equal((await pagesPost(input)).status, 400);
});

test("Pages enforces the byte limit without a Content-Length header", { timeout: 2000 }, async () => {
  const atLimit = JSON.stringify({ value: "x".repeat(MAX_API_BODY_BYTES - 12) });
  assert.equal(Buffer.byteLength(atLimit), MAX_API_BODY_BYTES);
  assert.equal((await pagesPost(atLimit)).status, 200);
  assert.equal((await pagesPost(atLimit + " ")).status, 413);
  assert.equal((await pagesPost(JSON.stringify({ value: "中".repeat(MAX_API_BODY_BYTES / 2) }))).status, 413);
});

test("Node accepts chunked JSON and rejects oversized chunked requests", { timeout: 4000 }, async () => {
  const server = createServer(listener);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  const post = (chunks) => new Promise((resolve, reject) => {
    const outgoing = request({ hostname: "127.0.0.1", port, method: "POST", headers: { "content-type": "application/json" } }, (response) => {
      const parts = [];
      response.on("data", (part) => parts.push(part));
      response.on("end", () => resolve({ status: response.statusCode, body: Buffer.concat(parts).toString() }));
    });
    outgoing.on("error", reject);
    for (const chunk of chunks) outgoing.write(chunk);
    outgoing.end();
  });
  try {
    const valid = await post(['{"value":', '"ok"}']);
    assert.equal(valid.status, 200);
    assert.deepEqual(JSON.parse(valid.body), { value: "ok" });
    assert.equal((await post(['{"value":"', "x".repeat(MAX_API_BODY_BYTES), '"}'])).status, 413);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
