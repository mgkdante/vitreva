import { absoluteUrl } from '#lib/config/site.ts';
import { languagePages } from '#lib/seo.ts';

export const prerender = true;

export const GET = () => {
  const fr = absoluteUrl('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${languagePages.map(({ href }) => `  <url>
    <loc>${href}</loc>
${languagePages.map((page) => `    <xhtml:link rel="alternate" hreflang="${page.locale}-CA" href="${page.href}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${fr}" />
  </url>`).join('\n')}
</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
