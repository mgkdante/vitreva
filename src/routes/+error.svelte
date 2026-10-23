<script lang="ts">
  import { page } from '$app/state';
  import { site } from '#lib/config/site.ts';
  import { getLocaleFromPath } from '#lib/content/index.ts';
  import ErrorPage from '#lib/components/ErrorPage.svelte';

  const locale = $derived(getLocaleFromPath(page.url.pathname.slice(site.basePath.length)));
</script>

<ErrorPage {locale} status={page.status} />
