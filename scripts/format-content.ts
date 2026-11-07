// Rewrites the content files in the Content Contract's order, which is the order the CMS saves them in.
// Run after reordering the contract, so the next editor save only shows what really changed.
import { readFileSync, writeFileSync } from 'node:fs';
import { canonicalJson } from '@yesid/content-contract';
import { contentGroups } from '../src/lib/content/cms.ts';
import { locales } from '../src/lib/content/locales.ts';

for (const { file, contract } of contentGroups.flatMap((group) => group.files)) {
  for (const locale of locales) {
    const path = file.replace('{{locale}}', locale);
    writeFileSync(path, canonicalJson(contract, readFileSync(path, 'utf8')));
  }
}
