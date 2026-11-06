import { error } from '@sveltejs/kit';
import { getContent, locales, type Locale } from '#lib/content/index.ts';
import { findPageKey, getPage, pageKeys, slugs } from '#lib/content/pages.ts';
import type { PageLoad } from './$types';

export const entries = () => locales.flatMap((locale) => pageKeys.map((key) => (
  locale === 'fr' ? { page: slugs.fr[key] } : { lang: locale, page: slugs[locale][key] }
)));

export const load: PageLoad = ({ params }) => {
  const locale: Locale = params.lang ?? 'fr';
  const key = findPageKey(locale, params.page);
  if (!key) error(404);
  return { locale, key, content: getContent(locale), page: getPage(locale, key) };
};
