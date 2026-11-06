import { defineParams } from '@sveltejs/kit/params';
import { isPageSlug } from '#lib/content/slugs.ts';

export const params = defineParams({
  lang: (value) => value === 'en' || value === 'es' ? value : undefined,
  page: (value) => isPageSlug(value) ? value : undefined
});
