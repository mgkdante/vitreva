import fr from './fr.json';
import en from './en.json';
import es from './es.json';

export const locales = ['fr', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export type Content = typeof fr;

const content: Record<Locale, Content> = { fr, en, es };

export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1];
  return locales.find((locale) => locale === segment) ?? 'fr';
}

export function getContent(locale: Locale): Content {
  return content[locale];
}
