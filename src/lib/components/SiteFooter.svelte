<script lang="ts">
  import type { Content, Locale } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import { getPages, servicePageKeys, companyPageKeys, legalPageKeys, type PageKey } from '#lib/content/pages.ts';
  import { localHref } from '#lib/links.ts';
  import LanguageSwitch from './LanguageSwitch.svelte';

  let { content, locale, pageKey, hasQuote = true }: { content: Content; locale: Locale; pageKey?: PageKey; hasQuote?: boolean } = $props();

  let pages = $derived(getPages(locale));
  let quoteHref = $derived(hasQuote ? '#quote' : `${localHref(locale)}#quote`);
  let homeAnchor = $derived((id: string) => pageKey ? `${localHref(locale)}#${id}` : `#${id}`);
</script>

<footer class="site-footer">
  <div class="container">
    <div class="columns">
      <div>
        <a class="footer-brand" href={pageKey ? localHref(locale) : '#top'} aria-label={content.navigation.home}>{site.brand.toUpperCase()}</a>
        <p class="description">{content.footer.description}</p>
      </div>
      <div>
        <h2>{content.footer.serviceTitle}</h2>
        <ul>
          {#each servicePageKeys as key}<li><a href={localHref(locale, key)}>{pages[key].label}</a></li>{/each}
        </ul>
      </div>
      <div>
        <h2>{content.footer.companyTitle}</h2>
        <ul>
          <li><a href={homeAnchor('process')}>{content.navigation.process}</a></li>
          {#each companyPageKeys as key}<li><a href={localHref(locale, key)}>{pages[key].label}</a></li>{/each}
          <li><a href={homeAnchor('faq')}>{content.navigation.faq}</a></li>
        </ul>
      </div>
      <div>
        <h2>{content.footer.contactTitle}</h2>
        <ul>
          <li><a href={site.phoneHref}>{site.phoneDisplay}</a></li>
          <li><a href={site.smsHref}>{content.quote.ways.text}</a></li>
          <li><a href={site.emailHref}>{site.email}</a></li>
          <li><a href={quoteHref}>{content.hero.freeQuote}</a></li>
        </ul>
      </div>
      <div>
        <h2>{content.footer.hoursTitle}</h2>
        <ul>
          <li>{content.footer.days}</li>
          <li>{content.footer.hours}</li>
          <li>{content.banner.reply}</li>
        </ul>
      </div>
    </div>
    <div class="bottom">
      <div class="footer-links">
        {#each legalPageKeys as key}<a href={localHref(locale, key)}>{pages[key].label}</a>{/each}
        <LanguageSwitch {locale} {pageKey} label={content.navigation.language} />
      </div>
      <p class="copyright">© {new Date().getFullYear()} {site.brand}</p>
      <p class="credit">{content.footer.creditPrefix} <a href={site.creditUrl}>yesid.dev</a></p>
    </div>
  </div>
</footer>

<style>
  .site-footer { background: var(--ink); color: white; padding-block: 72px 104px; }
  .columns { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 40px; }
  .footer-brand { font-size: 26px; letter-spacing: 3px; font-weight: 800; line-height: 36px; text-decoration: none; }
  .description { margin-top: 12px; max-width: 340px; font-size: 15px; line-height: 23px; color: rgb(255 255 255 / 74%); }
  h2 { font-size: 12.5px; line-height: 18px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: rgb(255 255 255 / 62%); }
  ul { display: grid; gap: 10px; margin: 16px 0 0; padding: 0; list-style: none; font-size: 15px; line-height: 22px; }
  ul a { text-decoration: none; text-underline-offset: 4px; }
  ul a:hover { text-decoration: underline; }
  .bottom { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 56px; padding-top: 28px; border-top: 1px solid var(--line-dark); text-align: center; font-size: 13px; line-height: 19px; }
  .footer-links { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 22px; }
  .footer-links a { text-underline-offset: 3px; }
  .credit { color: rgb(255 255 255 / 74%); }
  .credit a { text-underline-offset: 3px; }
  @media (max-width: 1099px) {
    .columns { grid-template-columns: 1fr 1fr; }
    .columns > div:first-child { grid-column: 1 / -1; }
  }
  @media (max-width: 720px) { .columns { grid-template-columns: 1fr; gap: 32px; } }
</style>
