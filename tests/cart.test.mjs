import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { createPinia, setActivePinia } from 'pinia';
import { parseStoredCart } from '../app/utils/cart.ts';

await mkdir('.cache/tests', { recursive: true });
await build({ entryPoints: ['app/stores/cart.ts'], outfile: '.cache/tests/cart.mjs', bundle: true,
  platform: 'node', format: 'esm', external: ['pinia'], alias: { '~': fileURLToPath(new URL('../app', import.meta.url)) } });
const { useCartStore } = await import('../.cache/tests/cart.mjs');
const product = { id: 1, title: 'Test product', price: 0.1, image: 'https://fakestoreapi.com/test.jpg' };

test('storage rejects invalid JSON, oversized lists, invalid quantities and duplicate IDs', () => {
  assert.deepEqual(parseStoredCart('{'), []);
  assert.deepEqual(parseStoredCart(JSON.stringify(Array(51).fill({ ...product, quantity: 1 }))), []);
  for (const quantity of [0, -1, 100, 1.5, '2']) {
    assert.deepEqual(parseStoredCart(JSON.stringify([{ ...product, quantity }])), []);
  }
  assert.deepEqual(parseStoredCart(JSON.stringify([{ ...product, image: 'javascript:alert(1)', quantity: 1 }])), []);
  const item = { ...product, quantity: 2 };
  assert.deepEqual(parseStoredCart(JSON.stringify([item, item])), [item]);
});

test('cart keeps money precise, enforces quantity limits and removes the final unit', () => {
  setActivePinia(createPinia());
  const cart = useCartStore();
  cart.addItem(product); cart.addItem(product); cart.addItem(product);
  assert.equal(cart.total, 0.3);
  for (let i = 0; i < 100; i++) cart.increment(1);
  assert.equal(cart.count, 99);
  cart.restore(JSON.stringify([{ ...product, quantity: 1 }]));
  cart.decrement(1);
  assert.equal(cart.count, 0);
});

test('failed checkout preserves the cart; concurrent checkout sends one request', async () => {
  setActivePinia(createPinia());
  const cart = useCartStore(); cart.addItem(product);
  globalThis.$fetch = async () => { throw new Error('offline'); };
  await assert.rejects(cart.checkout(), /offline/);
  assert.equal(cart.count, 1); assert.equal(cart.loading, false);
  let resolve, calls = 0;
  globalThis.$fetch = (_url, options) => {
    calls++;
    assert.deepEqual(options.body, { lines: [{ productId: 1, quantity: 1 }] });
    return new Promise((done) => { resolve = done; });
  };
  const pending = cart.checkout();
  assert.equal(await cart.checkout(), null);
  cart.increment(1); cart.clear();
  assert.equal(cart.count, 1);
  resolve({ id: 'demo_test' }); await pending;
  assert.equal(calls, 1); assert.equal(cart.count, 0);
  assert.equal(cart.lastOrderItems[0].quantity, 1);
  cart.clear(); assert.deepEqual(cart.lastOrderItems, []);
  delete globalThis.$fetch;
});
