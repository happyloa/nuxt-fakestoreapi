import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodePlaygroundPath,
  isAllowedPlaygroundOperation,
  redactSecrets,
  toUpstreamPath,
} from '../server/utils/playground.ts';

const upstream = raw => {
  const segments = decodePlaygroundPath(raw);
  return segments && toUpstreamPath(segments);
};

test('category names already encoded by the client are encoded exactly once upstream', () => {
  assert.equal(upstream("products/category/men's%20clothing"), "products/category/men's%20clothing");
  assert.equal(upstream('products/category/jewelery'), 'products/category/jewelery');
  assert.equal(upstream('products/1'), 'products/1');
});

test('dot segments, encoded separators, control characters and bad escapes are rejected', () => {
  for (const raw of ['', 'products/', '/products', 'products//1', 'products/..', 'products/category/%2e%2e',
    'products/category/.%2e', 'products/category/a%2F..', 'products/category/a%5C..', 'products/%00', 'products/%E0%A4%A']) {
    assert.equal(decodePlaygroundPath(raw), null, raw);
  }
});

test('only the documented demo operations are allowed', () => {
  const allowed = [
    ['GET', 'products'], ['GET', 'users/3'], ['GET', 'products/categories'], ['GET', "products/category/men's clothing"],
    ['GET', 'carts/user/2'], ['POST', 'carts'], ['PUT', 'products/7'], ['PATCH', 'users/1'], ['DELETE', 'carts/5'],
  ];
  const rejected = [
    ['GET', 'auth/login'], ['POST', 'products/1'], ['PUT', 'products'], ['DELETE', 'products/categories'],
    ['GET', 'products/0'], ['GET', 'products/1234567'], ['HEAD', 'products'], ['GET', `products/category/${'x'.repeat(121)}`],
  ];
  for (const [method, path] of allowed) assert.equal(isAllowedPlaygroundOperation(method, path), true, `${method} ${path}`);
  for (const [method, path] of rejected) assert.equal(isAllowedPlaygroundOperation(method, path), false, `${method} ${path}`);
});

test('credentials and internal fields are removed at every depth', () => {
  const input = [{ id: 1, password: 'x', Token: 'y', __v: 0, address: { city: 'A', password: 'z' }, list: [{ token: 't', ok: true }] }];
  assert.deepEqual(redactSecrets(input), [{ id: 1, address: { city: 'A' }, list: [{ ok: true }] }]);
  assert.equal(redactSecrets(null), null);
  assert.equal(redactSecrets('text'), 'text');
});
