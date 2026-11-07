import { absoluteUrl, site } from '#lib/config/site.ts';
import { locales, getContent, type Locale } from '#lib/content/index.ts';
import { getPage, pagePath, type PageKey } from '#lib/content/pages.ts';
import { shareImagePath } from '#lib/content/share.ts';

const langTag = (locale: Locale) => `${locale}-CA`;
const ogLocaleOf = (locale: Locale) => locale === 'es' ? 'es_LA' : `${locale}_CA`;

export interface Seo {
  title: string;
  description: string;
  canonical: string;
  alternates: { locale: string; href: string }[];
  ogLocale: string;
  ogLocaleAlternates: string[];
  ogImage: string;
  jsonLd: string;
}

export const languagePages = (key?: PageKey) => locales.map((locale) => ({
  locale,
  href: absoluteUrl(pagePath(locale, key))
}));

function businessNode(locale: Locale, description: string) {
  return {
    '@type': 'AutoRepair',
    '@id': `${absoluteUrl('')}#business`,
    name: site.brand,
    url: absoluteUrl(pagePath(locale)),
    image: absoluteUrl(shareImagePath(locale)),
    telephone: site.phoneE164,
    email: site.email,
    description,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: site.hours.days,
      opens: site.hours.opens,
      closes: site.hours.closes
    },
    areaServed: site.serviceArea.locations.map((name) => ({
      '@type': 'Place',
      name,
      containedInPlace: { '@type': 'AdministrativeArea', name: site.serviceArea.province }
    }))
  };
}

export function getSeo(locale: Locale, key?: PageKey): Seo {
  const content = getContent(locale);
  const meta = key ? getPage(locale, key).meta : content.meta;
  const canonical = absoluteUrl(pagePath(locale, key));
  const ogImage = absoluteUrl(shareImagePath(locale, key));
  const serviceNodes = !key || key === 'replacement' ? [{
    '@type': 'Service',
    name: getPage(locale, 'replacement').label,
    description: getPage(locale, 'replacement').summary,
    provider: { '@id': `${absoluteUrl('')}#business` },
    url: absoluteUrl(pagePath(locale, 'replacement'))
  }] : [];

  return {
    title: meta.title,
    description: meta.description,
    canonical,
    alternates: [
      ...languagePages(key).map((page) => ({ locale: langTag(page.locale), href: page.href })),
      { locale: 'x-default', href: absoluteUrl(pagePath('fr', key)) }
    ],
    ogLocale: ogLocaleOf(locale),
    ogLocaleAlternates: locales.filter((other) => other !== locale).map(ogLocaleOf),
    ogImage,
    jsonLd: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [businessNode(locale, content.meta.description), ...serviceNodes]
    }).replace(/</g, '\\u003c')
  };
}
