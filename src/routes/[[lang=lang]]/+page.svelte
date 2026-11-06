<script lang="ts">
  import type { PageData } from './$types';
  import { getSeo } from '#lib/seo.ts';
  import { localHref } from '#lib/links.ts';
  import PageHead from '#lib/components/PageHead.svelte';
  import SiteHeader from '#lib/components/SiteHeader.svelte';
  import Hero from '#lib/components/Hero.svelte';
  import InstrumentPanel from '#lib/components/InstrumentPanel.svelte';
  import ProcessRoute from '#lib/components/ProcessRoute.svelte';
  import ServiceInformation from '#lib/components/ServiceInformation.svelte';
  import Situations from '#lib/components/Situations.svelte';
  import ServiceArea from '#lib/components/ServiceArea.svelte';
  import Faq from '#lib/components/Faq.svelte';
  import QuoteSection from '#lib/components/QuoteSection.svelte';
  import SiteFooter from '#lib/components/SiteFooter.svelte';

  let { data }: { data: PageData } = $props();
  let content = $derived(data.content);
  let locale = $derived(data.locale);
  let seo = $derived(getSeo(locale));
</script>

<PageHead {seo} />

<div id="top"></div>
<SiteHeader {content} {locale} />
<main id="main">
  <Hero {content} />
  <InstrumentPanel content={content.panel} />
  <ProcessRoute content={content.process} />
  <ServiceInformation content={content.information} alt={content.images.installation} />
  <Situations content={content.situations} {locale} />
  <ServiceArea content={content.area} {locale} />
  <Faq content={content.faq} />
  <QuoteSection content={content.quote} {locale} privacyHref={localHref(locale, 'privacy')} />
</main>
<SiteFooter {content} {locale} />
