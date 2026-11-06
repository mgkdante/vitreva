// Kept free of JSON imports: the route matcher in src/params.ts loads this file directly in Node.
export const servicePageKeys = ['replacement', 'insurance', 'fleets', 'cameras'] as const;
export const companyPageKeys = ['area', 'about'] as const;
export const legalPageKeys = ['privacy', 'terms'] as const;
export const pageKeys = [...servicePageKeys, ...companyPageKeys, ...legalPageKeys] as const;

export type PageKey = (typeof pageKeys)[number];

export const slugs = {
  fr: { replacement: 'remplacement-pare-brise', insurance: 'assurance', fleets: 'flottes', cameras: 'cameras-adas', area: 'zone-desservie', about: 'a-propos', privacy: 'confidentialite', terms: 'conditions' },
  en: { replacement: 'windshield-replacement', insurance: 'insurance', fleets: 'fleets', cameras: 'cameras-adas', area: 'service-area', about: 'about', privacy: 'privacy', terms: 'terms' },
  es: { replacement: 'reemplazo-parabrisas', insurance: 'seguro', fleets: 'flotas', cameras: 'camaras-adas', area: 'zona-de-servicio', about: 'acerca-de', privacy: 'privacidad', terms: 'condiciones' }
} satisfies Record<string, Record<PageKey, string>>;

export const isPageSlug = (value: string) => Object.values(slugs).some((localeSlugs) => (Object.values(localeSlugs) as string[]).includes(value));
