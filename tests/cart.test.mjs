import assert from "node:assert/strict";
import test from "node:test";
import { createPinia, disposePinia, setActivePinia } from "pinia";
import { computed, ref } from "vue";
// Loaded through tests/support/register.mjs: the real stores, without booting Nuxt.
import { useCartStore } from "../app/stores/cart.ts";
import { useAuthStore } from "../app/stores/auth.ts";

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

test("addItem enforces the 99-quantity and 50-line limits and refuses changes during checkout", async (t) => {
  const request = deferred();
  const { cart } = createStores(t, () => request.promise);
  for (let i = 0; i < 99; i++) assert.equal(cart.addItem(product(1)), "added");
  assert.equal(cart.addItem(product(1)), "limit");
  assert.equal(cart.items[0].quantity, 99);
  for (let id = 2; id <= 50; id++) assert.equal(cart.addItem(product(id)), "added");
  assert.equal(cart.addItem(product(51)), "limit");
  assert.equal(cart.items.length, 50);
  const pending = cart.checkout();
  assert.equal(cart.addItem(product(2)), "busy");
  assert.equal(cart.items[1].quantity, 1);
  request.resolve({ id: "demo_limits" });
  await pending;
});

test("restored cart data is bounded, deduplicated and stripped of unknown fields", (t) => {
  const { cart } = createStores(t, async () => null);
  const valid = { ...product(1), quantity: 2 };
  cart.restore(JSON.stringify([
    { ...valid, extra: "dropped" },
    { ...valid, quantity: 5 },
    { ...product(2), image: "javascript:alert(1)", quantity: 1 },
    { ...product(3), quantity: 100 },
  ]));
  assert.deepEqual(cart.items, [valid]);
  cart.items = [];
  cart.restore(JSON.stringify(Array.from({ length: 51 }, (_, index) => ({ ...product(index + 1), quantity: 1 }))));
  assert.deepEqual(cart.items, []);
  cart.restore("not json");
  assert.deepEqual(cart.items, []);
});

test("items added before the stored cart is read are kept", (t) => {
  const { cart } = createStores(t, async () => null);
  cart.addItem(product(2));
  cart.addItem(product(3));
  cart.restore(JSON.stringify([{ ...product(1), quantity: 4 }, { ...product(2), quantity: 7 }]));
  // Stored lines win for duplicates; new lines are appended.
  assert.deepEqual(cart.items.map(({ id, quantity }) => [id, quantity]), [[1, 4], [2, 7], [3, 1]]);
});

test("clearing the cart keeps the last order, and the completed banner ends when shopping resumes", async (t) => {
  const { cart } = createStores(t, async () => ({ id: "demo_banner" }));
  cart.addItem(product(1));
  await cart.checkout();
  assert.equal(cart.justCheckedOut, true);
  cart.addItem(product(2));
  assert.equal(cart.justCheckedOut, false);
  cart.clear();
  assert.deepEqual(cart.items, []);
  assert.deepEqual(cart.lastOrderItems, [{ ...product(1), quantity: 1 }]);
  cart.reset();
  assert.deepEqual(cart.lastOrderItems, []);
});
