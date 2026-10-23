import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  PUBLIC_SITE_URL: {
    public: true,
    static: true,
    schema: (value) => {
      const url = new URL(value || 'https://vitreva.ca');
      if (!['https:', 'http:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash) {
        throw new Error('PUBLIC_SITE_URL must be an HTTP(S) origin without a path');
      }
      return url.origin;
    }
  },
  BASE_PATH: {
    public: true,
    static: true,
    schema: (value) => {
      const path = value?.replace(/\/$/, '') || '';
      if (path && (!path.startsWith('/') || path.startsWith('//') || /[?#]/.test(path))) {
        throw new Error('BASE_PATH must be empty or a root-relative path such as /vitreva');
      }
      return path;
    }
  },
  PUBLIC_WEB3FORMS_ACCESS_KEY: {
    public: true,
    static: true,
    schema: (value) => {
      return value?.trim() || '';
    }
  }
});
