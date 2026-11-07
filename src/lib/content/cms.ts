/** The site's editor setup, from the Content Contract. Used at build time only. */
import { cmsConfig as buildCmsConfig, type ContentFile, type ContentFileGroup } from '@yesid/content-contract';
import { errorContract, footerContract, homeContract, menuContract, pageContract, quoteContract } from './contract.ts';
import { locales } from './locales.ts';

export const CMS_CONFIG_PATH = 'cms/config.yml';

const contentFile = (name: string, label: string, contract: ContentFile['contract']): ContentFile => ({
  name,
  label,
  file: `src/lib/content/${name}.{{locale}}.json`,
  contract
});

/** Laid out like the site, so people find text where they see it. Every content file is listed here. */
export const contentGroups: readonly ContentFileGroup[] = [
  {
    name: 'pages',
    label: 'Pages',
    icon: 'web',
    files: [
      contentFile('home', 'Accueil', homeContract),
      contentFile('replacement', 'Remplacement de pare-brise', pageContract),
      contentFile('insurance', 'Assurance', pageContract),
      contentFile('fleets', 'Flottes', pageContract),
      contentFile('cameras', 'Caméras et ADAS', pageContract),
      contentFile('area', 'Zone desservie', pageContract),
      contentFile('about', 'À propos', pageContract)
    ]
  },
  {
    name: 'everywhere',
    label: 'Partout sur le site',
    icon: 'public',
    files: [
      contentFile('menu', 'Menu et bandeau', menuContract),
      contentFile('quote', 'Formulaire de soumission', quoteContract),
      contentFile('footer', 'Pied de page', footerContract),
      contentFile('error', 'Page d’erreur', errorContract)
    ]
  },
  {
    name: 'legal',
    label: 'Textes légaux',
    icon: 'gavel',
    files: [contentFile('privacy', 'Confidentialité', pageContract), contentFile('terms', 'Conditions d’utilisation', pageContract)]
  }
];

export const cmsConfig = ({ branch }: { branch?: string } = {}) =>
  buildCmsConfig({
    repo: 'mgkdante/vitreva',
    loginOrigin: 'https://login.yesid.dev',
    siteSlug: 'vitreva',
    branch,
    locales,
    defaultLocale: 'fr',
    fileGroups: contentGroups
  });
