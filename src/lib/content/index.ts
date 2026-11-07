import type { SiteText } from './contract.ts';
import { readContent } from './files.ts';
import { locales, type Locale } from './locales.ts';

export { locales, type Locale };
export type Content = SiteText;

const contentFor = (locale: Locale): Content => ({
  ...readContent<Pick<Content, 'hero' | 'panel' | 'process' | 'information' | 'situations' | 'area' | 'faq' | 'images' | 'meta'>>('home', locale),
  ...readContent<Pick<Content, 'navigation' | 'banner' | 'pagesUi'>>('menu', locale),
  quote: readContent('quote', locale),
  footer: readContent('footer', locale),
  error: readContent('error', locale)
});

const content = Object.fromEntries(locales.map((locale) => [locale, contentFor(locale)])) as Record<Locale, Content>;

export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1];
  return locales.find((locale) => locale === segment) ?? 'fr';
}

export function getContent(locale: Locale): Content {
  return content[locale];
}
