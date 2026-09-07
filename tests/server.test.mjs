import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

const product = { id: 1, title: 'Regression backpack', price: 12.34, description: 'A test product', category: 'bags', image: 'https://fakestoreapi.com/test.jpg', rating: { rate: 4, count: 10 } };
const user = { id: 1, username: 'demo', password: 'secret-must-not-leak', email: 'demo@example.com', name: { firstname: 'Demo', lastname: 'User' }, address: { city: 'Taipei', street: 'Test', number: 1, zipcode: '100', geolocation: { lat: '0', long: '0' } }, phone: '123' };
let app, upstream, base, serverOutput = '', cookie;

before(async () => {
  upstream = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('Content-Type', 'application/json');
    let result;
    if (url.pathname === '/products') result = [product];
    else if (url.pathname === '/products/categories') result = ['bags'];
    else if (url.pathname === '/products/1') result = product;
    else if (url.pathname === '/products/2') result = null;
    else if (url.pathname === '/users/1') result = user;
    else if (url.pathname === '/users') result = [user];
    else if (url.pathname === '/carts') result = [];
    else if (url.pathname === '/auth/login') {
      let raw = ''; for await (const chunk of req) raw += chunk;
      const input = JSON.parse(raw);
      if (input.username !== 'demo' || input.password !== 'demo-password') { res.statusCode = 401; result = {}; }
      else result = { token: `header.${Buffer.from(JSON.stringify({ sub: 1 })).toString('base64url')}.signature` };
    } else { res.statusCode = 404; result = {}; }
    res.end(JSON.stringify(result));
  });
  upstream.listen(0, '127.0.0.1'); await once(upstream, 'listening');
  // Reserve an ephemeral port before starting the production server.
  const reservation = createServer(); reservation.listen(0, '127.0.0.1'); await once(reservation, 'listening');
  const port = reservation.address().port; await new Promise((done) => reservation.close(done));
  base = `http://127.0.0.1:${port}`;
  app = spawn(process.execPath, ['.output/server/index.mjs'], { windowsHide: true,
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', NUXT_FAKE_STORE_API_BASE: `http://127.0.0.1:${upstream.address().port}` }, stdio: ['ignore', 'pipe', 'pipe'] });
  app.stdout.on('data', (data) => { serverOutput += data; }); app.stderr.on('data', (data) => { serverOutput += data; });
  for (let attempt = 0; attempt < 100; attempt++) {
    try { const response = await fetch(`${base}/api/auth/me`); if (response.ok) return; } catch {}
    if (app.exitCode !== null) throw new Error(serverOutput);
    await delay(100);
  }
  throw new Error(`Server did not start: ${serverOutput}`);
});

after(async () => {
  if (app && app.exitCode === null) { app.kill(); await once(app, 'exit'); }
  if (upstream) { upstream.closeAllConnections(); await new Promise((done) => upstream.close(done)); }
});

const jsonRequest = (path, body, extra = {}) => fetch(base + path, {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...extra }, body: JSON.stringify(body),
});

test('public session response and forged cookie cannot impersonate a user', async () => {
  const response = await fetch(`${base}/api/auth/me`, { headers: { cookie: 'auth_token=fake; storefront_session=00000000-0000-0000-0000-000000000000' } });
  assert.deepEqual(await response.json(), { authenticated: false, user: null });
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal((await jsonRequest('/api/demo/orders', { lines: [] })).status, 401);
});

test('login rejects invalid bodies, cross-origin requests, and bad credentials', async () => {
  assert.equal((await jsonRequest('/api/auth/session', { username: '', password: '' })).status, 400);
  assert.equal((await jsonRequest('/api/auth/session', {}, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await fetch(`${base}/api/auth/session`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{}' })).status, 415);
  assert.equal((await jsonRequest('/api/auth/session', { username: 'demo', password: 'wrong' })).status, 401);
});

test('login creates an opaque HttpOnly session and strips upstream credentials', async () => {
  const response = await jsonRequest('/api/auth/session', { username: 'demo', password: 'demo-password' });
  assert.equal(response.status, 200);
  const text = await response.text();
  assert.doesNotMatch(text, /password|token|signature|geolocation/);
  assert.equal(JSON.parse(text).user.name.firstName, 'Demo');
  const header = response.headers.get('set-cookie');
  assert.match(header, /HttpOnly/i); assert.match(header, /Secure/i); assert.match(header, /SameSite=Lax/i);
  cookie = header.split(';')[0];
  const me = await fetch(`${base}/api/auth/me`, { headers: { cookie } });
  assert.equal((await me.json()).user.id, 1);
});

test('demo order validates lines and derives identity from the session', async () => {
  for (const lines of [[], [{ productId: 1, quantity: 100 }], [{ productId: 1, quantity: 1 }, { productId: 1, quantity: 1 }]]) {
    assert.equal((await jsonRequest('/api/demo/orders', { lines }, { cookie })).status, 400);
  }
  const response = await jsonRequest('/api/demo/orders', { userId: 999, lines: [{ productId: 1, quantity: 2 }] }, { cookie });
  assert.equal(response.status, 200);
  const order = await response.json(); assert.equal(order.userId, 1); assert.equal(order.itemCount, 2); assert.match(order.id, /^demo_/);
});

test('catalog, product validation and restricted playground work through BFF', async () => {
  const response = await fetch(`${base}/api/catalog`);
  assert.equal(response.status, 200); assert.deepEqual((await response.json()).products, [product]);
  assert.equal((await fetch(`${base}/api/products/invalid`)).status, 400);
  assert.equal((await fetch(`${base}/api/products/2`)).status, 404);
  const users = await fetch(`${base}/api/playground/users`); assert.equal(users.status, 200);
  assert.doesNotMatch(await users.text(), /password|secret-must-not-leak/);
  assert.equal((await fetch(`${base}/api/playground/auth/login`)).status, 404);
  assert.equal((await fetch(`${base}/api/playground/users?limit=-1`)).status, 400);
});

test('both locales render SSR product content, canonical, metadata and security headers', async () => {
  for (const path of ['/', '/en', '/product/1', '/en/product/1', '/cart', '/en/cart', '/login', '/en/login', '/api', '/en/api', '/users', '/en/users', '/products/new', '/en/products/new', '/account', '/en/account']) {
    const headers = { 'Accept-Language': path.startsWith('/en') ? 'en' : 'zh-TW' };
    if (!path.includes('/login')) headers.cookie = cookie;
    const response = await fetch(base + path, { headers, redirect: 'manual' });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<html[^>]+lang="(?:zh-TW|en-US)"/, path);
    assert.match(html, /rel="canonical"/, path);
    assert.match(html, /https:\/\/nuxt-fakestoreapi.worksbyaaron.com/, path);
    assert.equal((html.match(/id="main-content"/g) || []).length, 1, path);
    assert.doesNotMatch(html, /secret-must-not-leak|auth_token/, path);
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    if (path === '/' || path.includes('/product/')) assert.match(html, /Regression backpack/);
    if (path.includes('/cart')) assert.match(html, /noindex/);
    if (path.includes('/users') || path.includes('/account')) assert.match(html, /demo@example.com/);
  }
});

test('sitemap includes dynamic locale products and excludes private pages', async () => {
  const robots = await fetch(`${base}/robots.txt`);
  assert.match(await robots.text(), /Sitemap: https:\/\/nuxt-fakestoreapi.worksbyaaron.com\/sitemap.xml/);
  const response = await fetch(`${base}/sitemap.xml`);
  assert.equal(response.status, 200);
  let xml = await response.text();
  if (xml.includes('<sitemapindex')) {
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
    xml = (await Promise.all(locs.map(async (path) => (await fetch(base + path)).text()))).join('');
  }
  assert.match(xml, /\/product\/1/); assert.match(xml, /\/en\/product\/1/);
  assert.doesNotMatch(xml, /<loc>[^<]*\/(account|cart|login|users|api|products\/new)<\/loc>/);
});

test('logout revokes the server session and protected page redirects', async () => {
  const logout = await fetch(`${base}/api/auth/session`, { method: 'DELETE', headers: { cookie } });
  assert.equal(logout.status, 200);
  assert.equal((await (await fetch(`${base}/api/auth/me`, { headers: { cookie } })).json()).authenticated, false);
  const response = await fetch(`${base}/account`, { redirect: 'manual' });
  assert.equal(response.status, 302); assert.match(response.headers.get('location'), /login\?redirect=/);
});
