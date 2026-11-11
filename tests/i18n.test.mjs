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

// vue-i18n reads `|` as a plural separator and `@:`/`@.` as linked messages, so
// a stray character silently truncates the text (it once cut the home title).
const PLURAL_KEYS = new Set(['products.resultsCount']);
const messages = locale => {
  const data = load(locale);
  return flatten(data).map(key => [key, key.split('.').reduce((node, part) => node[part], data)]);
};

test('only intended plural messages use the | separator, and none use linked-message syntax', () => {
  for (const locale of ['zh', 'en']) {
    for (const [key, value] of messages(locale)) {
      if (value.includes('|')) assert.ok(PLURAL_KEYS.has(key), `${locale}: ${key} has an unescaped |`);
      assert.doesNotMatch(value, /@[.:]/, `${locale}: ${key} looks like a linked message`);
    }
  }
});

test('zh and en use the same {placeholders} for every key', () => {
  // Plural forms repeat placeholders, so compare the distinct names.
  const placeholders = value => [...new Set([...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]))].sort().join(',');
  const en = new Map(messages('en'));
  for (const [key, value] of messages('zh')) {
    assert.equal(placeholders(value), placeholders(en.get(key)), key);
  }
});
