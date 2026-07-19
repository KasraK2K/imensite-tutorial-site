import assert from 'node:assert/strict';
import test from 'node:test';

import { createSlug } from './slug.js';

test('creates a Persian-safe slug', () => {
  assert.equal(createSlug('  آموزش TypeScript در سال ۲۰۲۶  '), 'آموزش-typescript-در-سال-۲۰۲۶');
});

test('collapses punctuation and separators', () => {
  assert.equal(createSlug('Hello, --- world!'), 'hello-world');
});
