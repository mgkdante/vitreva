<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { asset } from '$app/paths';
  import { site } from '#lib/config/site.ts';
  import type { Snippet } from 'svelte';
  import manrope from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url';

  let { children }: { children: Snippet } = $props();

  $effect(() => {
    document.documentElement.lang = page.url.pathname.slice(site.basePath.length).split('/')[1] === 'en' ? 'en' : 'fr';
  });
</script>

<svelte:head>
  <link rel="icon" type="image/png" sizes="32x32" href={asset('favicon-32.png')} />
  <link rel="icon" type="image/png" sizes="96x96" href={asset('favicon-96.png')} />
  <link rel="icon" type="image/svg+xml" href={asset('favicon.svg')} />
  <link rel="apple-touch-icon" sizes="180x180" href={asset('apple-touch-icon.png')} />
  <link rel="preload" href={manrope} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
