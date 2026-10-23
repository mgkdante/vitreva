import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
  lang: (value) => value === 'en' || value === 'es' ? value : undefined
});
