import { getContent, type Locale } from '#lib/content/index.ts';
import type { PageLoad } from './$types';

export const entries = () => [{}, { lang: 'en' }, { lang: 'es' }];

export const load: PageLoad = ({ params }) => {
  const locale: Locale = params.lang ?? 'fr';
  return { locale, content: getContent(locale) };
};
