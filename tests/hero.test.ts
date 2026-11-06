import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const art = {
  dash: read('src/lib/art/dash.svg'),
  mirror: read('src/lib/art/mirror.svg'),
  rearview: read('src/lib/art/rearview.svg'),
  crack: read('src/lib/art/crack.svg')
};

for (const [name, svg] of Object.entries(art)) {
  test(`${name} art is pure inline SVG`, () => {
    for (const banned of ['<image', '<script', 'foreignObject', 'data:image', 'href="http']) {
      assert.ok(!svg.includes(banned), `${name} contains ${banned}`);
    }
  });
}

test('dashboard keeps the anchors the page relies on and has no wipers', () => {
  assert.ok(art.dash.includes('viewBox="0 0 1600 400"'));
  assert.ok(art.dash.includes('id="screen-slot"'));
  assert.ok(art.dash.includes('id="telltale"'));
  assert.ok(!art.dash.includes('id="wiper-'));
});

test('dashboard radio link sits exactly on the screen slot', () => {
  const hero = read('src/lib/components/Hero.svelte');
  const slot = art.dash.match(/id="screen-slot"[^>]*>/)?.[0] ?? '';
  const value = (name: string) => Number(slot.match(new RegExp(`\\b${name}="([\\d.]+)"`))?.[1]);
  const position = hero.match(/\.radio \{ position: absolute; left: ([\d.]+)%; top: ([\d.]+)%; width: ([\d.]+)%; height: ([\d.]+)%/);
  assert.ok(position, 'radio position not found');
  const [, left, top, width, height] = position.map(Number);
  assert.equal(left, (value('x') / 1600) * 100);
  assert.equal(top, (value('y') / 400) * 100);
  assert.equal(width, (value('width') / 1600) * 100);
  assert.equal(height, (value('height') / 400) * 100);
});

test('the right mirror reuses the left mirror drawing', () => {
  assert.ok(art.mirror.includes('id="m-art"'));
  assert.ok(art.mirror.includes('id="mirror-glass"'));
  assert.ok(read('src/lib/components/Hero.svelte').includes('href="#m-art"'));
});

test('crack has no circles and can retract smoothly', () => {
  assert.ok(!art.crack.includes('<circle'));
  assert.ok(art.crack.includes('pathLength="1000"'));
});

test('public images are generated without the maker badge', () => {
  assert.ok(read('scripts/prepare-images.mjs').includes('vanWithoutBadge'));
});

test('contact links expose call and text on the same number', () => {
  const site = read('src/lib/config/site.ts');
  assert.ok(site.includes("phoneHref: 'tel:+18192098023'"));
  assert.ok(site.includes("smsHref: 'sms:+18192098023'"));
});
