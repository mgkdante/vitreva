/** Every content file, read at build time. Each place on the site has one file per language. */
import type { Locale } from './locales.ts';

const files = import.meta.glob<unknown>('./*.json', { eager: true, import: 'default' });

export function readContent<T>(name: string, locale: Locale): T {
  const file = files[`./${name}.${locale}.json`];
  if (file === undefined) throw new Error(`The content file "${name}.${locale}.json" is missing`);
  return file as T;
}
