import { BASE_PATH, PUBLIC_WEB3FORMS_ACCESS_KEY, PUBLIC_SITE_URL } from '$app/env/public';

export const site = {
  brand: 'Vitreva',
  phoneDisplay: '819 209-8023',
  phoneHref: 'tel:+18192098023',
  email: 'contact@vitreva.ca',
  emailHref: 'mailto:contact@vitreva.ca',
  creditUrl: 'https://yesid.dev',
  web3formsAccessKey: PUBLIC_WEB3FORMS_ACCESS_KEY,
  origin: PUBLIC_SITE_URL,
  basePath: BASE_PATH,
  homeUrl: `${PUBLIC_SITE_URL}${BASE_PATH}/`,
  serviceArea: {
    province: 'Québec',
    locations: [
      'Gatineau', 'Hull', 'Aylmer', 'Buckingham', 'Masson-Angers',
      'Cantley', 'Chelsea', 'L’Ange-Gardien', 'Val-des-Monts',
      'Perkins', 'Saint-Pierre-de-Wakefield', 'Poltimore',
      'La Pêche', 'Wakefield', 'Sainte-Cécile-de-Masham', 'Lascelles', 'Duclos', 'Lac-des-Loups',
      'Pontiac', 'Luskville', 'Quyon', 'Notre-Dame-de-la-Salette',
      'Thurso', 'Mayo', 'Lochaber', 'Lochaber-Partie-Ouest',
      'Denholm', 'Low', 'Saint-Sixte', 'Bowman', 'Mulgrave-et-Derry', 'Plaisance'
    ],
    boundaryLocations: ['Val-des-Bois'],
    approximateRadiusKm: 50
  }
} as const;

export const absoluteUrl = (path: string) => `${site.origin}${site.basePath}/${path.replace(/^\//, '')}`;
