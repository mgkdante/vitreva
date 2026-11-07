/** The site's editor setup, from the Content Contract. Used at build time only. */
import { cmsConfig as buildCmsConfig } from '@yesid/content-contract';
import { pagesContract, siteTextContract } from './contract.ts';
import { locales } from './index.ts';

export const CMS_CONFIG_PATH = 'cms/config.yml';

export const cmsConfig = ({ branch }: { branch?: string } = {}) =>
  buildCmsConfig({
    repo: 'mgkdante/vitreva',
    loginOrigin: 'https://login.yesid.dev',
    siteSlug: 'vitreva',
    branch,
    locales,
    defaultLocale: 'fr',
    singletons: [
      { name: 'site-text', label: 'Texte du site', file: 'src/lib/content/{{locale}}.json', contract: siteTextContract },
      { name: 'pages', label: 'Pages', file: 'src/lib/content/pages.{{locale}}.json', contract: pagesContract }
    ]
  });
