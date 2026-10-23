import { getContent, locales } from '#lib/content/index.ts';
import type { PageLoad } from './$types';

export const entries = () => locales.map((lang) => ({ lang }));

export const load: PageLoad = ({ params }) => {
  const locale = params.lang === 'en' ? 'en' : 'fr';
  return { locale: locale as 'fr' | 'en', content: getContent(locale) };
};
