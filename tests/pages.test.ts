import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'bun:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('pages have no breadcrumbs, visible or in structured data', () => {
  assert.ok(!read('src/routes/[[lang=lang]]/[page=page]/+page.svelte').includes('crumbs'));
  assert.ok(!read('src/lib/seo.ts').includes('BreadcrumbList'));
});

test('slugs are unique within each language', () => {
  const source = read('src/lib/content/slugs.ts');
  for (const line of source.match(/^\s+(fr|en|es): \{ replacement.*$/gm) ?? []) {
    const values = [...line.matchAll(/: '([^']+)'/g)].map((match) => match[1]);
    assert.equal(new Set(values).size, values.length);
  }
});

test('the private starting point is not published', () => {
  const site = read('src/lib/config/site.ts');
  assert.ok(!/latitude|longitude|geoMidpoint|GeoCircle/i.test(site + read('src/lib/seo.ts') + read('src/lib/content/business.fr.json')));
});
