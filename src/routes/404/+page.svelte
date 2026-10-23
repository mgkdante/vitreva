<script lang="ts">
  import { page } from '$app/state';
  import { site } from '#lib/config/site.ts';
  import ErrorPage from '#lib/components/ErrorPage.svelte';

  // The static host serves this document at the original, possibly English URL.
  const locale = $derived(page.url.pathname.slice(site.basePath.length).split('/')[1] === 'en' ? 'en' : 'fr');
</script>

<ErrorPage {locale} />
