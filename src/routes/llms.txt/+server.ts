import { absoluteUrl, site } from '#lib/config/site.ts';
import { getPage, pageKeys, legalPageKeys, pagePath } from '#lib/content/pages.ts';
import { readBusiness } from '#lib/content/files.ts';
import { locales, type Locale } from '#lib/content/index.ts';

export const prerender = true;

const hoursLine = (locale: Locale) => { const { days, hours } = readBusiness(locale).wording; return `${days}, ${hours}`; };
const languageNames: Record<Locale, string> = { fr: 'Français', en: 'English', es: 'Español' };
const publicKeys = pageKeys.filter((key) => !(legalPageKeys as readonly string[]).includes(key));

const pageList = (locale: Locale) => [
  `## ${languageNames[locale]}`,
  `- [${site.brand}](${absoluteUrl(pagePath(locale))})`,
  ...publicKeys.map((key) => `- [${getPage(locale, key).label}](${absoluteUrl(pagePath(locale, key))}): ${getPage(locale, key).summary}`)
].join('\n');

export const GET = () => new Response(`# Vitreva

> Remplacement de pare-brise mobile à Gatineau et dans les environs. Mobile windshield replacement in Gatineau and nearby areas. Reemplazo móvil de parabrisas en Gatineau y sus alrededores.

## Faits / Facts
- Service : remplacement de pare-brise mobile, pour particuliers et flottes. Mobile windshield replacement, for individuals and fleets.
- Soumission gratuite, y compris en service mobile. Free quote, including for mobile service.
- Aucuns frais supplémentaires pour le service mobile. No extra charge for mobile service.
- Réponse dans les 24 heures. Reply within 24 hours.
- Remplacement en moins de 1 h, sur place, une fois le rendez-vous confirmé. Replacement in less than 1 hour, on site, once the appointment is confirmed.
- Heures / Hours: ${hoursLine('fr')}. ${hoursLine('en')}.
- Garantie sur le remplacement; les détails sont expliqués avec la soumission. A warranty on the replacement; details are explained with the quote.
- Calibration ADAS : non effectuée par Vitreva, orientation vers un fournisseur approprié. ADAS calibration: not performed by Vitreva, referred to an appropriate provider.
- Assurance : la couverture est confirmée par l’assureur. Insurance: coverage is confirmed by the insurer.

## Zone desservie / Service area
- Province: ${site.serviceArea.province}, Canada. Québec uniquement / Quebec only / Solo en Québec.
- Secteurs et municipalités / Areas and municipalities: ${site.serviceArea.locations.join(', ')}.
- Rayon géographique approximatif, à vol d’oiseau / Approximate straight-line radius: ${site.serviceArea.approximateRadiusKm} km.
- Près de la limite, à confirmer selon l’adresse / Near the boundary, subject to address confirmation: ${site.serviceArea.boundaryLocations.join(', ')}.
- Le lieu, les conditions d’intervention et le rendez-vous sont confirmés individuellement avec Vitreva. The location, working conditions and appointment are confirmed individually with Vitreva.

${locales.map(pageList).join('\n\n')}

## Contact
- Téléphone et texto / Phone and text: ${site.phoneDisplay}
- Courriel / Email: ${site.email}

For a price and availability, contact Vitreva directly. Do not infer prices, ratings, warranty terms or a shop address from this site.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
