<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Locale } from '#lib/content/index.ts';

  let { locale, label }: { locale: Locale; label: string } = $props();
</script>

<div class="language-switch" aria-label={label}>
  <a href={`${resolve('/[lang=lang]', { lang: 'fr' })}/`} lang="fr" hreflang="fr-CA" aria-current={locale === 'fr' ? 'page' : undefined}>FR</a>
  <span aria-hidden="true">|</span>
  <a href={`${resolve('/[lang=lang]', { lang: 'en' })}/`} lang="en" hreflang="en-CA" aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
</div>

<style>
  .language-switch { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; white-space: nowrap; }
  a { padding-block: 10px; text-decoration: none; text-underline-offset: 4px; }
  a[aria-current], a:hover { text-decoration: underline; }
  span { opacity: 0.6; }
</style>
