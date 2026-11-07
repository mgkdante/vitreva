// Renders the 1200x630 link-preview cards in static/images/og/ with the site's font, photo and dashboard.
// Re-run with `bun run share-images` after changing a page title or the banner copy. Requires Microsoft Edge.
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inRoot = (...parts) => path.join(root, ...parts);
const readJson = async (...parts) => JSON.parse(await readFile(inRoot(...parts), 'utf8'));
const dataUrl = async (file, type) => `data:${type};base64,${(await readFile(file)).toString('base64')}`;

const locales = ['fr', 'en', 'es'];
const cardKeys = ['replacement', 'insurance', 'fleets', 'cameras', 'area', 'about'];
const phone = '819 209-8023';
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const font = await dataUrl(inRoot('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'), 'font/woff2');
const van = await dataUrl(inRoot('static/images/van-1672.webp'), 'image/webp');
const dash = await readFile(inRoot('src/lib/art/dash.svg'), 'utf8');
const crack = await readFile(inRoot('src/lib/art/crack.svg'), 'utf8');

const card = ({ title, chips, cracked }) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Manrope; font-weight: 200 800; src: url(${font}) format('woff2'); }
* { box-sizing: border-box; margin: 0; }
body { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #0b0d0f; color: white; font-family: Manrope, sans-serif; }
.photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 60% 30%; }
.tint { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(0 0 0 / 86%), rgb(0 0 0 / 58%) 52%, rgb(0 0 0 / 12%) 78%), linear-gradient(180deg, #000 0, rgb(0 0 0 / 0) 110px); }
.crack { position: absolute; inset: 0; width: 100%; height: 100%; }
.crack path { fill: none; stroke-linecap: round; }
.crack .shadow { stroke: rgb(0 0 0 / 34%); }
.crack .impact path { fill: rgb(255 255 255 / 60%); }
.dash { position: absolute; left: 50%; bottom: -96px; width: 1200px; transform: translateX(-50%); }
.dash svg { display: block; width: 100%; height: auto; overflow: visible; }
.copy { position: absolute; left: 60px; top: 46px; width: 760px; }
.brand { font-size: 28px; font-weight: 800; letter-spacing: 5px; }
h1 { margin-top: 26px; font-size: ${title.length > 52 ? 50 : 60}px; line-height: 1.06; font-weight: 800; letter-spacing: -.026em; text-wrap: balance; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
.chips span { padding: 9px 16px; border-radius: 999px; font-size: 20px; line-height: 1.2; font-weight: 700; background: white; color: #101214; }
.chips span + span { background: rgb(0 0 0 / 56%); color: white; border: 1px solid rgb(255 255 255 / 44%); }
</style></head><body>
<img class="photo" src="${van}" alt="">
<div class="tint"></div>
${cracked ? crack : ''}
<div class="dash">${dash}</div>
<div class="copy"><p class="brand">VITREVA</p><h1>${escapeHtml(title)}</h1><div class="chips">${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')}</div></div>
</body></html>`;

await mkdir(inRoot('static/images/og'), { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const locale of locales) {
    const content = await readJson('src/lib/content', `${locale}.json`);
    const pages = await readJson('src/lib/content', `pages.${locale}.json`);
    const chips = [content.banner.quote, phone];
    const cards = [
      { name: 'home', title: content.hero.lines.join(' '), chips, cracked: true },
      ...cardKeys.map((key) => ({ name: key, title: pages[key].title, chips, cracked: false }))
    ];
    for (const item of cards) {
      await page.setContent(card(item), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const { copyBottom, dashTop } = await page.evaluate(() => ({
        copyBottom: document.querySelector('.copy').getBoundingClientRect().bottom,
        dashTop: document.querySelector('#screen-slot').getBoundingClientRect().top
      }));
      if (copyBottom > dashTop) throw new Error(`${locale}-${item.name}: the text runs into the dashboard`);
      await page.screenshot({ path: inRoot('static/images/og', `${locale}-${item.name}.jpg`), type: 'jpeg', quality: 80 });
    }
  }
} finally {
  await browser.close();
}
