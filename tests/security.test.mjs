import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { createRequire } from 'node:module';
import { verifyPatchedDependencies, reviewAudit } from '../scripts/audit-security.mjs';

const require = createRequire(import.meta.url);
const braces = require('braces');
const forge = require('node-forge');

test('all lockfile copies contain the reviewed patches', () => verifyPatchedDependencies());
test('ordinary braces, ranges, escaped and literal patterns still work', () => {
  assert.deepEqual(braces.expand('app/{pages,components}/*.{ts,vue}'), ['app/pages/*.ts', 'app/pages/*.vue', 'app/components/*.ts', 'app/components/*.vue']);
  assert.deepEqual(braces.expand('{1..3}'), ['1', '2', '3']);
  assert.equal(braces.compile('{a,{b,c}}'), '(a|(b|c))');
  assert.equal(braces.stringify(braces.parse('a/{b,c}/d')), 'a/{b,c}/d');
  assert.deepEqual(braces.expand('\\{a,b\\}'), ['{a,b}']);
  assert.deepEqual(braces.expand('${literal}'), ['${literal}']);
});
test('deep braces, parentheses, mixed and unbalanced input fail with a bounded error', () => {
  for (const input of ['{'.repeat(4000) + 'a,b' + '}'.repeat(4000), '('.repeat(4000) + 'a' + ')'.repeat(4000), '{('.repeat(2000) + 'a,b' + ')}'.repeat(2000), '{'.repeat(4000)]) {
    for (const operation of [braces.parse, braces.compile, braces.expand, braces.stringify]) {
      assert.throws(() => operation(input), { name: 'SyntaxError', message: /safe depth limit/ });
    }
  }
});
test('direct AST operations also reject excessive depth and cycles', () => {
  let deep = { type: 'text', value: 'a' };
  for (let i = 0; i < 5000; i++) deep = { type: 'root', nodes: [deep] };
  const cycle = { type: 'root', nodes: [] }; cycle.nodes.push(cycle);
  for (const operation of [braces.compile, braces.expand, braces.stringify]) {
    for (const ast of [deep, cycle]) assert.throws(() => operation(ast), { name: 'SyntaxError' });
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
  assert.throws(() => reviewAudit({ metadata: { vulnerabilities: {} }, vulnerabilities: { example: { via: [{ name: 'braces', url: 'https://github.com/advisories/GHSA-new-unknown' }] } } }, patches), /Unmitigated/);
});
