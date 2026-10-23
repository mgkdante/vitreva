import { absoluteUrl } from '#lib/config/site.ts';

export const prerender = true;

export const GET = () => {
  const fr = absoluteUrl('');
  const en = absoluteUrl('en/');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[fr, en].map((url) => `  <url>
    <loc>${url}</loc>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${fr}" />
    <xhtml:link rel="alternate" hreflang="en-CA" href="${en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${fr}" />
  </url>`).join('\n')}
</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
