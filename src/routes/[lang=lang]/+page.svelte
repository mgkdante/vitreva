<script lang="ts">
  import type { PageData } from './$types';
  import { getSeo } from '#lib/seo.ts';
  import { site } from '#lib/config/site.ts';
  import SiteHeader from '#lib/components/SiteHeader.svelte';
  import Hero from '#lib/components/Hero.svelte';
  import ServiceCommitments from '#lib/components/ServiceCommitments.svelte';
  import ProcessCarousel from '#lib/components/ProcessCarousel.svelte';
  import ServiceArea from '#lib/components/ServiceArea.svelte';
  import ServiceInformation from '#lib/components/ServiceInformation.svelte';
  import Faq from '#lib/components/Faq.svelte';
  import QuoteSection from '#lib/components/QuoteSection.svelte';
  import SiteFooter from '#lib/components/SiteFooter.svelte';
  import LegalDialog from '#lib/components/LegalDialog.svelte';

  let { data }: { data: PageData } = $props();
  let content = $derived(data.content);
  let locale = $derived(data.locale);
  let seo = $derived(getSeo(locale, content));
  let legal = $state<'privacy' | 'terms' | null>(null);
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
  <meta property="og:image" content={seo.ogImage} />
  <meta name="twitter:card" content="summary_large_image" />
  {@html `<script type="application/ld+json">${seo.jsonLd}</script>`}
</svelte:head>

<div id="top"></div>
<SiteHeader {content} {locale} />
<main id="main">
  <Hero {content} />
  <ServiceCommitments content={content.commitment} />
  <ProcessCarousel content={content.process} images={content.images} />
  <ServiceArea content={content.area} />
  <ServiceInformation content={content.information} />
  <Faq content={content.faq} />
  <QuoteSection content={content.quote} {locale} onPrivacy={() => legal = 'privacy'} />
</main>
<SiteFooter {content} {locale} onLegal={(kind) => legal = kind} />
<LegalDialog kind={legal} content={content.legal} onClose={() => legal = null} />
