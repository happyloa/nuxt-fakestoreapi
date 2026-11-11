import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { once } from 'node:events';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ZipArchive } from 'archiver';
import { verifyPatchedDependencies, reviewAudit } from '../scripts/audit-security.mjs';

const require = createRequire(import.meta.url);
const forge = require('node-forge');

test('Nitro glob and archive helpers still match and archive files with the security overrides', { timeout: 5000 }, async () => {
  const directory = mkdtempSync(join(tmpdir(), 'storefront-archive-'));
  const archive = new ZipArchive();
  try {
    mkdirSync(join(directory, 'nested'));
    for (const path of ['first.txt', 'nested/second.txt', 'nested/skip.txt', 'other.json']) {
      writeFileSync(join(directory, path), 'fixture');
    }
    const expected = ['first.txt', 'nested/second.txt'];
    const matches = require('glob').globSync('**/*.txt', { cwd: directory, nodir: true, ignore: ['**/skip.txt'] });
    assert.deepEqual(matches.map(path => path.replace(/\\/g, '/')).sort(), expected);
    const entries = [];
    archive.on('entry', entry => entries.push(entry.name));
    const ended = once(archive, 'end');
    archive.resume();
    archive.glob('**/*.txt', { cwd: directory, ignore: ['**/skip.txt'] });
    await Promise.all([archive.finalize(), ended]);
    assert.deepEqual(entries.sort(), expected);
  } finally {
    archive.abort();
    rmSync(directory, { recursive: true, force: true });
  }
});

for (const entry of ['deepmerge', 'deepmerge/dist/umd.js']) {
  const merge = require(entry);
  test(`${entry} rejects prototype poisoning from either merge operand`, () => {
    const malicious = () => JSON.parse('{"__proto__":{"polluted":true},"safe":1}');
    for (const [target, source] of [
      [malicious(), {}],
      [{}, malicious()],
      [Object.create(null), malicious()],
      [malicious(), malicious()],
    ]) {
      const result = merge(target, source);
      assert.equal(Object.getPrototypeOf(result), Object.prototype);
      assert.equal(Object.hasOwn(result, '__proto__'), false);
      assert.equal(result.polluted, undefined);
      assert.equal(result.safe, 1);
    }
    const result = merge({ nested: malicious(), list: [malicious()] }, { nested: { next: 2 } });
    assert.deepEqual(result, { nested: { safe: 1, next: 2 }, list: [{ safe: 1 }] });
    assert.equal(Object.prototype.polluted, undefined);
  });
  test(`${entry} preserves normal merge options, arrays and symbols`, () => {
    const symbol = Symbol('option');
    const target = { nested: { a: 1 }, values: [1], [symbol]: { a: 1 } };
    const source = { nested: { b: 2 }, values: [2], [symbol]: { b: 2 } };
    assert.deepEqual(merge(target, source), { nested: { a: 1, b: 2 }, values: [1, 2], [symbol]: { a: 1, b: 2 } });
    assert.deepEqual(merge(target, source, { arrayMerge: (_, incoming) => incoming }).values, [2]);
    assert.equal(merge({}, target, { clone: false }).nested, target.nested);
    assert.deepEqual(merge({ value: { a: 1 } }, { value: { b: 2 } }, {
      customMerge: key => key === 'value' ? (a, b) => ({ ...a, ...b, custom: true }) : undefined,
    }), { value: { a: 1, b: 2, custom: true } });
    assert.deepEqual(merge.all([{ a: 1 }, { b: 2 }]), { a: 1, b: 2 });
    assert.deepEqual(target, { nested: { a: 1 }, values: [1], [symbol]: { a: 1 } });
  });
}

test('all lockfile copies contain the reviewed patches', () => verifyPatchedDependencies());
test('patch verification accepts LF and CRLF but rejects changed or missing source in every copy', () => {
  const directory = mkdtempSync(join(tmpdir(), 'storefront-patch-'));
  const root = pathToFileURL(directory + sep);
  const source = 'const depth = 128;\nthrow new SyntaxError();\n';
  const locations = ['node_modules/example', 'node_modules/parent/node_modules/example'];
  const write = (path, content) => writeFileSync(new URL(path, root), content);
  try {
    mkdirSync(new URL('scripts/', root));
    write('scripts/security-patches.json', JSON.stringify({ example: {
      version: '1.0.0',
      files: { 'index.js': createHash('sha256').update(source).digest('hex') },
    } }));
    write('package-lock.json', JSON.stringify({ packages: Object.fromEntries(locations.map(path => [path, { version: '1.0.0' }])) }));
    for (const path of locations) {
      mkdirSync(new URL(`${path}/`, root), { recursive: true });
      write(`${path}/package.json`, JSON.stringify({ version: '1.0.0' }));
    }
    for (const content of [source, source.replace(/\n/g, '\r\n')]) {
      for (const path of locations) write(`${path}/index.js`, content);
      assert.doesNotThrow(() => verifyPatchedDependencies(root));
    }
    write(`${locations[1]}/index.js`, source.replace('128', '999'));
    assert.throws(() => verifyPatchedDependencies(root), /Missing or changed security patch/);
    rmSync(new URL(`${locations[1]}/index.js`, root));
    assert.throws(() => verifyPatchedDependencies(root), /ENOENT/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
test('RSA accepts valid signatures and rejects extra DigestAlgorithm elements', () => {
  const keys = generateKeyPairSync('rsa', { modulusLength: 1024, publicExponent: 3, privateKeyEncoding: { type: 'pkcs1', format: 'pem' }, publicKeyEncoding: { type: 'pkcs1', format: 'pem' } });
  const privateKey = forge.pki.privateKeyFromPem(keys.privateKey);
  const publicKey = forge.pki.publicKeyFromPem(keys.publicKey);
  const md = forge.md.sha256.create().update('security regression');
  const digest = md.digest().getBytes();
  assert.equal(publicKey.verify(digest, privateKey.sign(md)), true);
  const { asn1 } = forge;
  const node = (type, value, constructed = false) => asn1.create(asn1.Class.UNIVERSAL, type, constructed, value);
  const algorithm = () => [node(asn1.Type.OID, asn1.oidToDer(forge.oids.sha256).getBytes()), node(asn1.Type.NULL, '')];
  for (const values of [algorithm(), algorithm().slice(0, 1)]) {
    const info = node(asn1.Type.SEQUENCE, [node(asn1.Type.SEQUENCE, values, true), node(asn1.Type.OCTETSTRING, digest)], true);
    assert.equal(publicKey.verify(digest, privateKey.sign(asn1.toDer(info).getBytes(), 'NONE')), true);
  }
  for (const extra of [node(asn1.Type.OCTETSTRING, 'garbage'), node(asn1.Type.SEQUENCE, [], true)]) {
    const info = node(asn1.Type.SEQUENCE, [node(asn1.Type.SEQUENCE, [...algorithm(), extra], true), node(asn1.Type.OCTETSTRING, digest)], true);
    const signature = privateKey.sign(asn1.toDer(info).getBytes(), 'NONE');
    assert.throws(() => publicKey.verify(digest, signature), /valid RSASSA-PKCS1/);
  }
});
test('audit review rejects unrelated or incomplete vulnerability reports', () => {
  const patches = verifyPatchedDependencies();
  assert.throws(() => reviewAudit({}, patches), /complete report/);
  assert.throws(() => reviewAudit({ metadata: { vulnerabilities: {} }, vulnerabilities: { example: { via: ['missing'] } } }, patches), /Unresolved/);
  assert.throws(() => reviewAudit({ metadata: { vulnerabilities: {} }, vulnerabilities: { deepmerge: { via: [{ name: 'deepmerge', url: 'https://github.com/advisories/GHSA-new-unknown' }] } } }, patches), /Unmitigated/);
});
