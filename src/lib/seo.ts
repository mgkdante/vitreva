import { absoluteUrl, site } from '#lib/config/site.ts';
import type { Locale } from '#lib/content/index.ts';

export function getSeo(locale: Locale, content: { meta: { title: string; description: string } }) {
  const canonical = absoluteUrl(`${locale}/`);
  const ogImage = absoluteUrl('images/social.jpg');
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.brand,
    url: canonical,
    image: ogImage,
    telephone: '+18192098023',
    email: site.email,
    areaServed: 'Gatineau'
  };

  return {
    title: content.meta.title,
    description: content.meta.description,
    canonical,
    alternates: [
      { locale: 'fr-CA', href: absoluteUrl('fr/') },
      { locale: 'en-CA', href: absoluteUrl('en/') },
      { locale: 'x-default', href: absoluteUrl('fr/') }
    ],
    ogLocale: locale === 'fr' ? 'fr_CA' : 'en_CA',
    ogImage,
    jsonLd: JSON.stringify(structuredData).replace(/</g, '\\u003c')
  };
}
