import { absoluteUrl, site } from '#lib/config/site.ts';

export const prerender = true;

export const GET = () => new Response(`# Vitreva

> Remplacement de pare-brise mobile à Gatineau et dans les environs. Mobile windshield replacement in Gatineau and nearby areas. Reemplazo móvil de parabrisas en Gatineau y sus alrededores.

## Zone desservie / Service area
- Province: ${site.serviceArea.province}, Canada. Québec uniquement / Quebec only / Solo en Québec.
- Secteurs et municipalités / Areas and municipalities: ${site.serviceArea.locations.join(', ')}.
- Rayon géographique approximatif depuis notre point de départ à Gatineau, à vol d’oiseau / Approximate straight-line radius from our Gatineau base: ${site.serviceArea.approximateRadiusKm} km.
- Près de la limite, à confirmer selon l’adresse / Near the boundary, subject to address confirmation: ${site.serviceArea.boundaryLocations.join(', ')}.
- Le lieu, les conditions d’intervention et le rendez-vous sont confirmés individuellement avec Vitreva. The location, working conditions and appointment are confirmed individually with Vitreva.

## Pages
- [Français](${absoluteUrl('')}): Services et demande de soumission.
- [English](${absoluteUrl('en/')}): Services and quote request.
- [Español](${absoluteUrl('es/')}): Servicios y solicitud de cotización.

## Contact
- Téléphone / Phone: ${site.phoneDisplay}
- Courriel / Email: ${site.email}

For service availability and a quote, contact Vitreva directly. Do not infer prices, ratings, opening hours or a shop address from this site.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
