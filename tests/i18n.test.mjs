import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const load = locale => JSON.parse(readFileSync(new URL(`../i18n/locales/${locale}.json`, import.meta.url), 'utf8'));
const flatten = (value, prefix = '') => Object.entries(value).flatMap(([key, child]) =>
  child && typeof child === 'object' ? flatten(child, `${prefix}${key}.`) : [`${prefix}${key}`]);

// i18n.config.ts disables fallbackLocale, so every key must exist in both locales.
test('zh and en locale files define the same message keys', () => {
  const zh = flatten(load('zh')).sort();
  const en = flatten(load('en')).sort();
  assert.deepEqual(zh.filter(key => !en.includes(key)), [], 'keys missing from en.json');
  assert.deepEqual(en.filter(key => !zh.includes(key)), [], 'keys missing from zh.json');
});

test('every locale message is a non-empty string', () => {
  for (const locale of ['zh', 'en']) {
    const messages = load(locale);
    for (const key of flatten(messages)) {
      const value = key.split('.').reduce((node, part) => node[part], messages);
      assert.equal(typeof value, 'string', `${locale}: ${key}`);
      assert.notEqual(value.trim(), '', `${locale}: ${key}`);
    }
  }
});
