import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const readJson = (name: string) => JSON.parse(readFileSync(new URL(`../src/lib/content/${name}`, import.meta.url), 'utf8'));
const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const pages = { fr: readJson('pages.fr.json'), en: readJson('pages.en.json'), es: readJson('pages.es.json') };
const inventedClaims = /\b(certifi|lifetime|à vie|de por vida|garantie à vie|years of experience|ans d’expérience|años de experiencia|same[- ]day|même jour|mismo día|direct billing|facturation directe|facturación directa)/i;

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  return typeof value;
}

for (const [locale, content] of Object.entries(pages)) {
  test(`${locale} pages share the French structure`, () => {
    assert.deepEqual(shape(content), shape(pages.fr));
  });

  test(`${locale} pages have complete metadata, and copy free of unsourced claims`, () => {
    for (const [key, page] of Object.entries<{ label: string; summary: string; title: string; meta: { title: string; description: string } }>(content)) {
      assert.ok(page.label.trim(), `${key} label`);
      assert.ok(page.title.trim(), `${key} title`);
      assert.ok(page.meta.title.includes('Vitreva'), `${key} meta title names the brand`);
      assert.ok(page.meta.description.length >= 50 && page.meta.description.length <= 175, `${key} description length is ${page.meta.description.length}`);
    }
    assert.ok(!inventedClaims.test(JSON.stringify(content)), 'copy contains an unsourced claim');
  });
}

test('every language promises the same confirmed facts on the about page', () => {
  for (const content of Object.values(pages)) assert.equal(content.about.sections[0].list.length, 5);
});

test('24 hours is promised for a reply, never for the finished quote', () => {
  const claims = /(free quote|quote gratuit|soumission gratuite|cotización gratis) (within|dans les|en) 24/i;
  for (const content of Object.values(pages)) assert.ok(!claims.test(JSON.stringify(content)));
});

test('public copy does not tie the service radius to a starting point', () => {
  const copy = ['fr.json', 'en.json', 'es.json'].map((name) => read(`src/lib/content/${name}`)).join(' ') + read('src/routes/llms.txt/+server.ts');
  assert.ok(!/Gatineau base|base en Gatineau|point de départ/i.test(copy.replace(/con base en Gatineau y un solo enfoque/g, '')));
});

test('the gauges promise a replacement in less than 1 hour in every language', () => {
  for (const name of ['fr.json', 'en.json', 'es.json']) {
    const panel = JSON.parse(read(`src/lib/content/${name}`)).panel;
    assert.ok(panel.items.some((item: { value: string }) => item.value === '1 h'));
    assert.ok(!panel.items.some((item: { value: string }) => item.value === '50 km'));
  }
});

test('ADAS calibration stays a referral in every language', () => {
  assert.match(pages.en.cameras.sections[1].body[0], /does not perform ADAS calibration/);
  assert.match(pages.fr.cameras.sections[1].body[0], /n’effectue pas la calibration ADAS/);
  assert.match(pages.es.cameras.sections[1].body[0], /no realiza la calibración ADAS/);
});

test('service area groups list exactly the configured communities', () => {
  const site = read('src/lib/config/site.ts');
  const quoted = (block: string) => [...block.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  const locations = quoted(site.match(/locations: \[([\s\S]*?)\]/)?.[1] ?? '');
  const groups = site.match(/groups: \[([\s\S]*?)\n    \],/)?.[1] ?? '';
  const towns = [...groups.matchAll(/towns: \[([^\]]*)\]/g)].flatMap((match) => quoted(match[1]));
  assert.deepEqual([...towns].sort(), [...locations].sort());
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
  assert.ok(!/latitude|longitude|geoMidpoint|GeoCircle/i.test(site + read('src/lib/seo.ts')));
});
