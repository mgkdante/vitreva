<script lang="ts">
  import type { PageData } from './$types';
  import { site } from '#lib/config/site.ts';
  import { getSeo } from '#lib/seo.ts';
  import { getPages, legalPageKeys, pageKeys, type PageKey } from '#lib/content/pages.ts';
  import { localHref } from '#lib/links.ts';
  import PageHead from '#lib/components/PageHead.svelte';
  import SiteHeader from '#lib/components/SiteHeader.svelte';
  import SiteFooter from '#lib/components/SiteFooter.svelte';
  import QuoteSection from '#lib/components/QuoteSection.svelte';
  import Photo from '#lib/components/Photo.svelte';

  let { data }: { data: PageData } = $props();
  let content = $derived(data.content);
  let locale = $derived(data.locale);
  let key = $derived(data.key);
  let page = $derived(data.page);
  let seo = $derived(getSeo(locale, key));
  let isLegal = $derived((legalPageKeys as readonly PageKey[]).includes(key));
  let related = $derived(pageKeys.filter((other) => other !== key && !(legalPageKeys as readonly PageKey[]).includes(other)).slice(0, 5));
  let pages = $derived(getPages(locale));

  const photos: Partial<Record<PageKey, string>> = { replacement: 'installation', insurance: 'aftercare', fleets: 'van', cameras: 'aftercare', area: 'aftercare', about: 'van' };
</script>

<PageHead {seo} />

<div id="top"></div>
<SiteHeader {content} {locale} pageKey={key} hasQuote={!isLegal} />
<main id="main">
  <header class="page-hero" class:plain={isLegal}>
    {#if photos[key]}<Photo image={photos[key]} class="page-hero-photo" priority sizes="100vw" />{/if}
    <div class="page-hero-tint"></div>
    <div class="container page-hero-content">
      <nav class="crumbs" aria-label={content.pagesUi.breadcrumb}><a href={localHref(locale)}>{site.brand}</a><span aria-hidden="true">/</span><span aria-current="page">{page.label}</span></nav>
      <p class="kicker">{page.eyebrow}</p>
      <h1>{page.title}</h1>
      {#if page.intro}<p class="intro">{page.intro}</p>{/if}
      {#if !isLegal}
        <div class="actions">
          <a class="button button-white" href={site.phoneHref}>{content.navigation.call} {site.phoneDisplay}</a>
          <a class="button button-clear" href={site.smsHref}>{content.quote.ways.text}</a>
          <a class="button button-clear" href="#quote">{content.hero.freeQuote}</a>
        </div>
      {/if}
    </div>
  </header>

  <section class="sections" aria-label={page.label}>
    <div class="container">
      {#each page.sections as section}
        <div class="block">
          <h2>{section.title}</h2>
          <div class="block-body">
            {#each section.body as paragraph}<p>{paragraph}</p>{/each}
            {#if section.list.length}
              <ul>{#each section.list as item}<li>{item}</li>{/each}</ul>
            {/if}
          </div>
        </div>
      {/each}

      {#if key === 'area'}
        <div class="block">
          <h2>{content.pagesUi.communities}</h2>
          <div class="block-body groups">
            {#each site.serviceArea.groups as group}
              <div>
                <h3>{group.name}</h3>
                <ul class="towns">{#each group.towns as town}<li>{town}</li>{/each}</ul>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </section>

  {#if !isLegal}
    <section class="related" aria-labelledby="related-title">
      <div class="container">
        <h2 id="related-title">{content.pagesUi.related}</h2>
        <div class="related-grid">
          {#each related as other}
            <a href={localHref(locale, other)}>
              <strong>{pages[other].label}</strong>
              <span>{pages[other].summary}</span>
            </a>
          {/each}
        </div>
      </div>
    </section>
    <QuoteSection content={content.quote} {locale} privacyHref={localHref(locale, 'privacy')} />
  {/if}
</main>
<SiteFooter {content} {locale} pageKey={key} hasQuote={!isLegal} />

<style>
  .page-hero { position: relative; overflow: hidden; background: var(--ink); color: white; }
  .page-hero :global(.page-hero-photo) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 40%; }
  .page-hero-tint { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(4 6 8 / 86%), rgb(4 6 8 / 62%) 55%, rgb(4 6 8 / 34%)); }
  .page-hero-content { position: relative; padding-top: clamp(170px, 13vw, 300px); padding-bottom: 76px; }
  .plain .page-hero-content { padding-bottom: 52px; }
  .crumbs { display: flex; flex-wrap: wrap; gap: 8px; font-size: 13px; line-height: 20px; font-weight: 600; color: rgb(255 255 255 / 80%); }
  .crumbs a { text-underline-offset: 3px; }
  .kicker { margin-top: 26px; font-size: 12.5px; line-height: 18px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgb(255 255 255 / 80%); }
  h1 { margin-top: 12px; max-width: 900px; font-size: clamp(34px, 4.4vw, 68px); line-height: 1.06; font-weight: 800; letter-spacing: -.026em; }
  .intro { margin-top: 20px; max-width: 720px; font-size: clamp(17px, 1.35vw, 21px); line-height: 1.5; }
  .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

  .sections { background: white; padding-block: 44px 72px; }
  .block { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.4fr); gap: 56px; padding-block: 44px; border-top: 1px solid var(--line); }
  .block:first-child { border-top: 0; }
  .block h2 { font-size: clamp(24px, 2.2vw, 34px); line-height: 1.15; }
  .block-body p { max-width: 720px; font-size: 17px; line-height: 27px; color: #3d444a; }
  .block-body p + p { margin-top: 14px; }
  .block-body ul { display: grid; gap: 10px; max-width: 720px; margin: 18px 0 0; padding: 0; list-style: none; }
  .block-body > ul li { position: relative; padding-left: 24px; font-size: 16px; line-height: 25px; color: #3d444a; }
  .block-body > ul li::before { content: ''; position: absolute; left: 2px; top: 10px; width: 7px; height: 7px; border-radius: 50%; background: var(--ink); }
  .block-body > :first-child { margin-top: 0; }
  .groups { display: grid; gap: 28px; }
  .groups h3 { font-size: 16px; line-height: 24px; font-weight: 800; }
  .block-body .towns { display: flex; flex-wrap: wrap; gap: 8px; max-width: none; margin-top: 12px; }
  .towns li { padding: 5px 12px; border: 1px solid var(--line); border-radius: 999px; font-size: 14px; line-height: 20px; font-weight: 600; }

  .related { background: var(--paper); padding-block: 72px; }
  .related h2 { font-size: clamp(26px, 2.6vw, 38px); }
  .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-top: 28px; }
  .related-grid a { display: flex; flex-direction: column; gap: 8px; padding: 22px; border: 1px solid var(--line); border-radius: 16px; background: white; text-decoration: none; transition: background 180ms, color 180ms; }
  .related-grid strong { font-size: 17px; line-height: 1.3; font-weight: 800; }
  .related-grid span { font-size: 14.5px; line-height: 22px; color: var(--muted); transition: color 180ms; }
  .related-grid a:hover { background: var(--ink); color: white; }
  .related-grid a:hover span { color: rgb(255 255 255 / 74%); }

  @media (max-width: 899px) {
    .block { grid-template-columns: 1fr; gap: 16px; padding-block: 32px; }
  }
  @media (max-width: 720px) {
    .page-hero-tint { background: linear-gradient(180deg, rgb(4 6 8 / 82%), rgb(4 6 8 / 68%)); }
    .page-hero-content { padding-top: 132px; padding-bottom: 52px; }
    .actions .button { width: 100%; }
    .related { padding-block: 52px; }
  }
</style>
