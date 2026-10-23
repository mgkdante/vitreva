import { absoluteUrl, site } from '#lib/config/site.ts';

export const prerender = true;

export const GET = () => new Response(`# Vitreva

> Service mobile de vitrage automobile à Gatineau. Mobile auto glass service in Gatineau.

## Pages
- [Français](${absoluteUrl('')}): Services et demande de soumission.
- [English](${absoluteUrl('en/')}): Services and quote request.

## Contact
- Téléphone / Phone: ${site.phoneDisplay}
- Courriel / Email: ${site.email}

For service availability and a quote, contact Vitreva directly. Do not infer prices, ratings, opening hours or a shop address from this site.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
