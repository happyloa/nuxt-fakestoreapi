import assert from "node:assert/strict";
import test from "node:test";
import { safeRedirectPath } from "../app/utils/redirect.ts";
import { catalogNumber } from "../app/utils/catalog.ts";
import { MAX_ENTITY_ID, parseEntityId } from "../shared/utils/limits.ts";

test("login redirects only accept same-site paths", () => {
  for (const ok of ["/", "/cart", "/en/users?tab=1#top"]) assert.equal(safeRedirectPath(ok), ok);
  for (const bad of ["//evil.example", "/\\evil.example", "https://evil.example", "cart", "/a\nb", "/a\u0000", "", null, ["/cart"]]) {
    assert.equal(safeRedirectPath(bad), null, JSON.stringify(bad));
  }
});

test("entity ids accept 1-6 digit numbers or digit strings only", () => {
  assert.equal(parseEntityId(1), 1);
  assert.equal(parseEntityId("42"), 42);
  assert.equal(parseEntityId(MAX_ENTITY_ID), MAX_ENTITY_ID);
  for (const bad of [0, -1, 1.5, MAX_ENTITY_ID + 1, "007", "1e3", " 1", "1000000", null, undefined, {}]) {
    assert.equal(parseEntityId(bad), null, String(bad));
  }
});

test("catalogue numbers are zero-padded", () => {
  assert.equal(catalogNumber(7), "No. 007");
  assert.equal(catalogNumber(1234), "No. 1234");
});
