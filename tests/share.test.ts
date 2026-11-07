import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'bun:test';
import { locales } from '../src/lib/content/locales.ts';
import { shareCards, shareImagePath } from '../src/lib/content/share.ts';
import { legalPageKeys, pageKeys } from '../src/lib/content/slugs.ts';
import { cardsFor } from '../scripts/generate-share-images.ts';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const text = {
  heroLines: ['Ligne un', 'ligne deux'],
  quote: 'Soumission',
  phone: '819 555-0100',
  titleOf: (key: string) => `Titre ${key}`
};

test('every language gets its home card and one card per page, without the legal pages', () => {
  const cards = shareCards('en', text);
  const legal = new Set<string>(legalPageKeys);
  assert.equal(cards.length, 1 + pageKeys.filter((key) => !legal.has(key)).length);
  assert.equal(new Set(cards.map((card) => card.file)).size, cards.length);
  assert.deepEqual(cards[0], { file: 'images/og/en-home.jpg', title: 'Ligne un ligne deux', chips: ['Soumission', '819 555-0100'], cracked: true });
});

test('every page points to a card that the build makes', () => {
  for (const locale of locales) {
    const made = new Set(cardsFor(locale).map((card) => card.file));
    for (const key of [undefined, ...pageKeys]) assert.ok(made.has(shareImagePath(locale, key)), `${locale} ${key ?? 'home'}`);
  }
});

test('cards carry the saved phone number and page titles, with no placeholder left', () => {
  const { phone } = JSON.parse(read('src/lib/content/business.fr.json'));
  const { title } = JSON.parse(read('src/lib/content/about.fr.json'));
  for (const locale of locales) {
    for (const card of cardsFor(locale)) {
      assert.equal(card.chips[1], phone);
      assert.ok(![card.title, ...card.chips].join(' ').includes('{'), `${card.file} has a placeholder left`);
    }
  }
  assert.ok(cardsFor('fr').some((card) => card.title === title));
});

test('cards are made by each build, so they are not kept in the repository', () => {
  const { scripts } = JSON.parse(read('package.json'));
  assert.match(scripts.build, /bun run share-images && vite build/);
  assert.ok(read('.gitignore').split('\n').includes('/static/images/og/'));
});
