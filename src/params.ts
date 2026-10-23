import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
  lang: (value) => value === 'fr' || value === 'en' ? value : undefined
});
