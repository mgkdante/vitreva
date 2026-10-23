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
  homeUrl: `${PUBLIC_SITE_URL}${BASE_PATH}/`
} as const;

export const absoluteUrl = (path: string) => `${site.origin}${site.basePath}/${path.replace(/^\//, '')}`;
