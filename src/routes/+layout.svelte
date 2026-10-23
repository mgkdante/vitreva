<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';
  import manrope from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url';

  let { children }: { children: Snippet } = $props();

  $effect(() => {
    document.documentElement.lang = page.params.lang === 'en' ? 'en' : 'fr';
  });
</script>

<svelte:head>
  <link rel="preload" href={manrope} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
