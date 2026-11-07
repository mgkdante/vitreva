import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'bun:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('code that depends on list position keeps one value per item', () => {
  const content = JSON.parse(read('src/lib/content/home.fr.json'));
  const count = (source: string, name: string) => source.match(new RegExp(`const ${name} = \\[([^\\]]*)\\]`))?.[1].split(',').length;
  assert.equal(count(read('src/lib/components/InstrumentPanel.svelte'), 'levels'), content.panel.items.length);
  assert.equal(count(read('src/lib/components/Situations.svelte'), 'targets'), content.situations.cards.length);
});
