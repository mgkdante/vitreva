import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.BASE_PATH?.replace(/\/$/, '') || '';
  if (base && (!base.startsWith('/') || base.startsWith('//') || /[?#]/.test(base))) {
    throw new Error('BASE_PATH must be empty or a root-relative path such as /vitreva');
  }

  return {
    plugins: [
      sveltekit({
        adapter: adapter({ strict: true }),
        paths: {
          base: base as '' | `/${string}`,
          origin: new URL(env.PUBLIC_SITE_URL || 'https://vitreva.ca').origin,
          relative: false
        },
        prerender: { entries: ['/', '/fr/', '/en/', '/robots.txt', '/sitemap.xml', '/llms.txt'] }
      })
    ]
  };
});
