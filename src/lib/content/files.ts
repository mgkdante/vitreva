/** Every content file, read at build time. Each place on the site has one file per language. */
import { factTokens, fillFacts, type BusinessFacts } from './facts.ts';
import type { Locale } from './locales.ts';

const files = import.meta.glob<unknown>('./*.json', { eager: true, import: 'default' });

const readFile = <T>(name: string, locale: Locale): T => {
  const file = files[`./${name}.${locale}.json`];
  if (file === undefined) throw new Error(`The content file "${name}.${locale}.json" is missing`);
  return file as T;
};

export const readBusiness = (locale: Locale) => readFile<BusinessFacts>('business', locale);

/** A content file with its business facts filled in. */
export const readContent = <T>(name: string, locale: Locale): T =>
  fillFacts(readFile<T>(name, locale), factTokens(readBusiness(locale)), `${name}.${locale}`);
