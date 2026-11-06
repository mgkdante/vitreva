import { resolve } from '$app/paths';
import type { Locale } from '#lib/content/index.ts';
import { slugs, type PageKey } from '#lib/content/pages.ts';

/** A language's home page or one of its pages, including the site's base path. */
export function localHref(locale: Locale, key?: PageKey) {
  const lang = locale === 'fr' ? undefined : locale;
  if (key) return `${resolve('/[[lang=lang]]/[page=page]', { lang, page: slugs[locale][key] })}/`;
  return lang ? `${resolve('/[[lang=lang]]', { lang })}/` : `${resolve('/[[lang=lang]]', {}).replace(/\/$/, '')}/`;
}
