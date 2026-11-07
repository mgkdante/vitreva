// Rewrites the content files in the Content Contract's order, which is the order the CMS saves them in.
// Run after reordering the contract, so the next editor save only shows what really changed.
import { readFileSync, writeFileSync } from 'node:fs';
import { canonicalJson } from '@yesid/content-contract';
import { pagesContract, siteTextContract } from '../src/lib/content/contract.ts';
import { locales } from '../src/lib/content/index.ts';

for (const locale of locales) {
  for (const [file, contract] of [[`${locale}.json`, siteTextContract], [`pages.${locale}.json`, pagesContract]] as const) {
    const path = `src/lib/content/${file}`;
    writeFileSync(path, canonicalJson(contract, readFileSync(path, 'utf8')));
  }
}
