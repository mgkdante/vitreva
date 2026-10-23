import { absoluteUrl, site } from '#lib/config/site.ts';
import type { Locale } from '#lib/content/index.ts';

export function getSeo(locale: Locale, content: { meta: { title: string; description: string } }) {
  const canonical = absoluteUrl(locale === 'en' ? 'en/' : '');
  const ogImage = absoluteUrl('images/social.jpg');
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.brand,
    url: canonical,
    image: ogImage,
    telephone: '+18192098023',
    email: site.email,
    description: content.meta.description,
    areaServed: site.serviceArea.locations.map((name) => ({
      '@type': 'Place',
      name,
      containedInPlace: { '@type': 'AdministrativeArea', name: site.serviceArea.province }
    }))
  };

  return {
    title: content.meta.title,
    description: content.meta.description,
    canonical,
    alternates: [
      { locale: 'fr-CA', href: absoluteUrl('') },
      { locale: 'en-CA', href: absoluteUrl('en/') },
      { locale: 'x-default', href: absoluteUrl('') }
    ],
    ogLocale: locale === 'fr' ? 'fr_CA' : 'en_CA',
    ogImage,
    jsonLd: JSON.stringify(structuredData).replace(/</g, '\\u003c')
  };
}
