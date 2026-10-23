import { BASE_PATH, PUBLIC_QUOTE_ENDPOINT, PUBLIC_SITE_URL } from '$app/env/public';

export const site = {
  brand: 'Vitreva',
  phoneDisplay: '819 209-8023',
  phoneHref: 'tel:+18192098023',
  email: 'contact@vitreva.ca',
  emailHref: 'mailto:contact@vitreva.ca',
  creditUrl: 'https://yesid.dev',
  quoteEndpoint: PUBLIC_QUOTE_ENDPOINT,
  origin: PUBLIC_SITE_URL,
  basePath: BASE_PATH,
  homeUrl: `${PUBLIC_SITE_URL}${BASE_PATH}/`
} as const;

export const absoluteUrl = (path: string) => `${site.origin}${site.basePath}/${path.replace(/^\//, '')}`;
