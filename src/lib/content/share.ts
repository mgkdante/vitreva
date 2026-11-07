/** Which link-preview cards exist and what they say. Also read by scripts/generate-share-images.ts, so nothing here needs the build. */
import type { Locale } from './locales.ts';
import { legalPageKeys, pageKeys, type PageKey } from './slugs.ts';

export interface ShareCard {
  file: string;
  title: string;
  chips: string[];
  cracked: boolean;
}

export interface ShareCardText {
  heroLines: readonly string[];
  quote: string;
  phone: string;
  titleOf: (key: PageKey) => string;
}

const isLegal = (key?: PageKey) => (legalPageKeys as readonly string[]).includes(key ?? '');

/** Legal pages share the home page's card; every other page has one per language. */
export const shareImagePath = (locale: Locale, key?: PageKey): string => `images/og/${locale}-${key && !isLegal(key) ? key : 'home'}.jpg`;

export function shareCards(locale: Locale, { heroLines, quote, phone, titleOf }: ShareCardText): ShareCard[] {
  const chips = [quote, phone];
  return [
    { file: shareImagePath(locale), title: heroLines.join(' '), chips, cracked: true },
    ...pageKeys.filter((key) => !isLegal(key)).map((key) => ({ file: shareImagePath(locale, key), title: titleOf(key), chips, cracked: false }))
  ];
}
