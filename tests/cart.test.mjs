import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createPinia, disposePinia, setActivePinia } from "pinia";
import { computed, ref } from "vue";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

// Run the real stores without booting Nuxt or copying their implementation.
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const loadSource = (path) => transpileModule(
  readFileSync(new URL(path, import.meta.url), "utf8"),
  { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ES2022 } },
).outputText;
const piniaUrl = import.meta.resolve("pinia");
const cartUtilsUrl = moduleUrl(loadSource("../app/utils/cart.ts"));
const { useCartStore } = await import(moduleUrl(
  loadSource("../app/stores/cart.ts")
    .replace('from "pinia"', `from ${JSON.stringify(piniaUrl)}`)
    .replace('from "~/utils/cart"', `from ${JSON.stringify(cartUtilsUrl)}`),
));
const { useAuthStore } = await import(moduleUrl(
  loadSource("../app/stores/auth.ts")
    .replace('from "pinia"', `from ${JSON.stringify(piniaUrl)}`),
));

const product = (id) => ({ id, title: `Product ${id}`, price: 12.34, image: `https://example.com/${id}.png` });
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
  return { promise, resolve, reject };
};

function createStores(t, fetch) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const globals = { ref, computed, useRequestFetch: () => fetch, useCartStore, $fetch: fetch };
  const previous = Object.fromEntries(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.assign(globalThis, globals);
  t.after(() => {
    disposePinia(pinia);
    setActivePinia(undefined);
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return { cart: useCartStore(), auth: useAuthStore() };
}

test("checkout succeeds normally and ordinary clear stays blocked while pending", async (t) => {
  const request = deferred();
  let input;
  const { cart } = createStores(t, (url, options) => { input = { url, options }; return request.promise; });
  cart.addItem(product(1));
  const pending = cart.checkout();
  cart.clear();
  assert.equal(cart.items.length, 1);
  assert.equal(cart.loading, true);
  assert.equal(await cart.checkout(), null);
  const order = { id: "demo_1" };
  request.resolve(order);
  assert.deepEqual(await pending, order);
  assert.deepEqual(cart.items, []);
  assert.deepEqual(cart.lastOrderItems, [{ ...product(1), quantity: 1 }]);
  assert.equal(cart.loading, false);
  assert.equal(input.url, "/api/demo/orders");
  assert.deepEqual(input.options.body, { lines: [{ productId: 1, quantity: 1 }] });
});

test("current checkout failure preserves cart and rejects for the page's error handler", async (t) => {
  const error = new Error("checkout failed");
  const { cart } = createStores(t, async () => { throw error; });
  cart.addItem(product(1));
  await assert.rejects(cart.checkout(), (received) => received === error);
  assert.deepEqual(cart.items, [{ ...product(1), quantity: 1 }]);
  assert.deepEqual(cart.lastOrderItems, []);
  assert.equal(cart.loading, false);
});

for (const outcome of ["success", "failure"]) {
  for (const oldFirst of [true, false]) {
    test(`logout invalidates old ${outcome}, settling ${oldFirst ? "before" : "after"} the next checkout`, async (t) => {
      const oldRequest = deferred();
      const newRequest = deferred();
      let checkoutCount = 0;
      const { cart, auth } = createStores(t, (url, options) => {
        if (url === "/api/auth/session" && options.method === "DELETE") return Promise.resolve();
        assert.equal(url, "/api/demo/orders");
        return checkoutCount++ === 0 ? oldRequest.promise : newRequest.promise;
      });
      auth.user = { id: 1, username: "previous-user" };
      cart.addItem(product(1));
      cart.lastOrderItems = [{ ...product(3), quantity: 1 }];
      const oldCheckout = cart.checkout();
      await auth.logoutUser();
      assert.equal(auth.isAuthenticated, false);
      assert.deepEqual(cart.items, []);
      assert.deepEqual(cart.lastOrderItems, []);
      assert.equal(cart.loading, false);

      auth.user = { id: 2, username: "next-user" };
      cart.addItem(product(2));
      const newCheckout = cart.checkout();
      const settleOld = async () => {
        if (outcome === "success") oldRequest.resolve({ id: "old-order" });
        else oldRequest.reject(new Error("old request failed"));
        // null prevents both success and error notifications from a stale request.
        assert.equal(await oldCheckout, null);
      };
      if (oldFirst) {
        await settleOld();
        assert.deepEqual(cart.items, [{ ...product(2), quantity: 1 }]);
        assert.deepEqual(cart.lastOrderItems, []);
        assert.equal(cart.loading, true);
      }
      const newOrder = { id: "new-order" };
      newRequest.resolve(newOrder);
      assert.deepEqual(await newCheckout, newOrder);
      if (!oldFirst) await settleOld();
      assert.deepEqual(cart.items, []);
      assert.deepEqual(cart.lastOrderItems, [{ ...product(2), quantity: 1 }]);
      assert.equal(cart.loading, false);
      assert.equal(auth.user.id, 2);
    });
  }
}
