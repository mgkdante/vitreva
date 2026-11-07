// Renders the 1200x630 link-preview cards with the site's font, photo and dashboard. `bun run build`
// runs this first, so the cards always match the saved titles, banner and phone number. Needs Microsoft
// Edge or Google Chrome, which GitHub's build machines already have.
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { chromium, type Browser } from 'playwright-core';
import { factTokens, fillFacts, type BusinessFacts } from '../src/lib/content/facts.ts';
import { locales, type Locale } from '../src/lib/content/locales.ts';
import { shareCards, type ShareCard } from '../src/lib/content/share.ts';

const root = path.resolve(import.meta.dir, '..');
const inRoot = (...parts: string[]) => path.join(root, ...parts);
const contentFile = <T>(name: string, locale: Locale) => JSON.parse(readFileSync(inRoot('src/lib/content', `${name}.${locale}.json`), 'utf8')) as T;
const dataUrl = (file: string, type: string) => `data:${type};base64,${readFileSync(inRoot(file)).toString('base64')}`;
const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function cardsFor(locale: Locale): ShareCard[] {
  const business = contentFile<BusinessFacts>('business', locale);
  const filled = <T>(name: string) => fillFacts(contentFile<T>(name, locale), factTokens(business), `${name}.${locale}`);
  const { hero } = filled<{ hero: { lines: string[] } }>('home');
  const { banner } = filled<{ banner: { quote: string } }>('menu');
  return shareCards(locale, {
    heroLines: hero.lines,
    quote: banner.quote,
    phone: business.phone,
    titleOf: (key) => filled<{ title: string }>(key).title
  });
}

const cardHtml = ({ title, chips, cracked }: ShareCard, art: { font: string; van: string; dash: string; crack: string }) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Manrope; font-weight: 200 800; src: url(${art.font}) format('woff2'); }
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
h1 { margin-top: 26px; font-size: var(--title); line-height: 1.06; font-weight: 800; letter-spacing: -.026em; text-wrap: balance; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
.chips span { padding: 9px 16px; border-radius: 999px; font-size: 20px; line-height: 1.2; font-weight: 700; background: white; color: #101214; }
.chips span + span { background: rgb(0 0 0 / 56%); color: white; border: 1px solid rgb(255 255 255 / 44%); }
</style></head><body>
<img class="photo" src="${art.van}" alt="">
<div class="tint"></div>
${cracked ? art.crack : ''}
<div class="dash">${art.dash}</div>
<div class="copy"><p class="brand">VITREVA</p><h1>${escapeHtml(title)}</h1><div class="chips">${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')}</div></div>
</body></html>`;

/** The van photo chosen in the editor, or the site's own. */
function vanPhoto() {
  const manifest = inRoot('src/lib/generated/photos.json');
  const chosen: string | undefined = existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')).van?.files.at(-1) : undefined;
  return `static/${chosen ?? 'images/van-1672.webp'}`;
}

/** Sizes to try for a title, largest first. What the owner writes is never refused: a long title gets smaller type. */
const titleSizes = (title: string) => [title.length > 52 ? 50 : 60, 44, 38, 32, 26];

async function openBrowser(): Promise<Browser> {
  for (const channel of ['msedge', 'chrome']) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // Not installed here, so try the next one.
    }
  }
  throw new Error('Share cards need Microsoft Edge or Google Chrome installed');
}

async function main() {
  const art = {
    font: dataUrl('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'font/woff2'),
    van: dataUrl(vanPhoto(), 'image/webp'),
    dash: readFileSync(inRoot('src/lib/art/dash.svg'), 'utf8'),
    crack: readFileSync(inRoot('src/lib/art/crack.svg'), 'utf8')
  };
  // Starting empty means a card for a removed page cannot linger.
  rmSync(inRoot('static/images/og'), { recursive: true, force: true });
  mkdirSync(inRoot('static/images/og'), { recursive: true });

  const browser = await openBrowser();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    for (const locale of locales) {
      for (const card of cardsFor(locale)) {
        await page.setContent(cardHtml(card, art), { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        for (const size of titleSizes(card.title)) {
          const fits = await page.evaluate((px) => {
            document.documentElement.style.setProperty('--title', `${px}px`);
            return document.querySelector('.copy')!.getBoundingClientRect().bottom <= document.querySelector('#screen-slot')!.getBoundingClientRect().top;
          }, size);
          if (fits) break;
        }
        await page.screenshot({ path: inRoot('static', card.file), type: 'jpeg', quality: 80 });
      }
    }
  } finally {
    await browser.close();
  }
}

if (import.meta.main) await main();
