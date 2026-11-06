<script lang="ts">
  import type { Locale } from '#lib/content/index.ts';
  import type { PageKey } from '#lib/content/pages.ts';
  import { localHref } from '#lib/links.ts';

  let { locale, label, pageKey }: { locale: Locale; label: string; pageKey?: PageKey } = $props();
</script>

<div class="language-switch" role="group" aria-label={label}>
  <a href={localHref('fr', pageKey)} lang="fr" hreflang="fr-CA" aria-current={locale === 'fr' ? 'page' : undefined}>FR</a>
  <span aria-hidden="true">|</span>
  <a href={localHref('en', pageKey)} lang="en" hreflang="en-CA" aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
  <span aria-hidden="true">|</span>
  <a href={localHref('es', pageKey)} lang="es" hreflang="es-CA" aria-current={locale === 'es' ? 'page' : undefined}>ES</a>
</div>

<style>
  .language-switch { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; white-space: nowrap; }
  a { padding-block: 10px; text-decoration: none; text-underline-offset: 4px; }
  a[aria-current], a:hover { text-decoration: underline; }
  span { opacity: 0.6; }
</style>
