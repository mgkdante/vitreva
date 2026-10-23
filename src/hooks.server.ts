import type { Handle } from '@sveltejs/kit/hooks';
import { getLocaleFromPath } from '#lib/content/index.ts';
import { site } from '#lib/config/site.ts';

export const handle: Handle = ({ event, resolve }) => resolve(event, {
  transformPageChunk: ({ html }) => html.replace('%lang%', getLocaleFromPath(event.url.pathname.slice(site.basePath.length)))
});
