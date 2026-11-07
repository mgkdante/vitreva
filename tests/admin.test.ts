import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'bun:test';
import { cmsConfig } from '../src/lib/content/cms.ts';

const page = readFileSync(new URL('../static/admin/index.html', import.meta.url), 'utf8');
const editor = `${cmsConfig().backend.api_root}/`;

test('/admin leads to the editor on the login service, even without JavaScript', () => {
  assert.ok(page.includes(`content="0; url=${editor}"`), 'no refresh to the editor');
  assert.ok(page.includes(`href="${editor}"`), 'no visible link to the editor');
  assert.ok(!page.includes('<script'));
});

test('/admin stays out of search results', () => {
  assert.ok(page.includes('name="robots" content="noindex"'));
});
