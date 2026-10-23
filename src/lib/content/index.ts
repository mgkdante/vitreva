import fr from './fr.json';
import en from './en.json';

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export type Content = typeof fr;

const content: Record<Locale, Content> = { fr, en };

export function getContent(locale: Locale): Content {
  return content[locale];
}
