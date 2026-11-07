import type { Pages } from './contract.ts';
import { readContent } from './files.ts';
import { locales, type Locale } from './locales.ts';
import { pageKeys, slugs, type PageKey } from './slugs.ts';

export { companyPageKeys, legalPageKeys, pageKeys, servicePageKeys, slugs, type PageKey } from './slugs.ts';

export type PageContent = Pages[PageKey];

const pagesFor = (locale: Locale) => Object.fromEntries(pageKeys.map((key) => [key, readContent<PageContent>(key, locale)])) as Pages;

const pages = Object.fromEntries(locales.map((locale) => [locale, pagesFor(locale)])) as Record<Locale, Pages>;

export const findPageKey = (locale: Locale, slug: string) => pageKeys.find((key) => slugs[locale][key] === slug);

export const getPage = (locale: Locale, key: PageKey) => pages[locale][key];

export const getPages = (locale: Locale) => pages[locale];

/** The path of a page after the site's base path, such as `en/insurance/`. An absent key is the language's home page. */
export function pagePath(locale: Locale, key?: PageKey) {
  const prefix = locale === 'fr' ? '' : `${locale}/`;
  return key ? `${prefix}${slugs[locale][key]}/` : prefix;
}
