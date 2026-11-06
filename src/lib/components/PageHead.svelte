<script lang="ts">
  import { site } from '#lib/config/site.ts';
  import type { Seo } from '#lib/seo.ts';

  let { seo }: { seo: Seo } = $props();
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <link rel="canonical" href={seo.canonical} />
  {#each seo.alternates as alternate}<link rel="alternate" hreflang={alternate.locale} href={alternate.href} />{/each}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={site.brand} />
  <meta property="og:title" content={seo.title} />
  <meta property="og:description" content={seo.description} />
  <meta property="og:url" content={seo.canonical} />
  <meta property="og:locale" content={seo.ogLocale} />
  {#each seo.ogLocaleAlternates as alternate}<meta property="og:locale:alternate" content={alternate} />{/each}
  <meta property="og:image" content={seo.ogImage} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={seo.title} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={seo.title} />
  <meta name="twitter:description" content={seo.description} />
  <meta name="twitter:image" content={seo.ogImage} />
  {@html `<script type="application/ld+json">${seo.jsonLd}</script>`}
</svelte:head>
