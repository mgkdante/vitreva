<script lang="ts">
  import type { Content, Locale } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import LanguageSwitch from './LanguageSwitch.svelte';

  let { content, locale, onLegal }: { content: Content; locale: Locale; onLegal: (kind: 'privacy' | 'terms') => void } = $props();
</script>

<footer class="site-footer">
  <div class="container footer-content">
    <a class="footer-brand" href="#top" aria-label={content.navigation.home}>{site.brand.toUpperCase()}</a>
    <p class="description">{content.footer.description}</p>
    <a class="phone" href={site.phoneHref}>{content.navigation.call}</a>
    <a class="email" href={site.emailHref}>{site.email}</a>
    <div class="footer-links">
      <button class="text-button" type="button" onclick={() => onLegal('privacy')}>{content.footer.privacy}</button>
      <button class="text-button" type="button" onclick={() => onLegal('terms')}>{content.footer.terms}</button>
      <LanguageSwitch {locale} label={content.navigation.language} />
    </div>
    <p class="copyright">© {new Date().getFullYear()} {site.brand}</p>
    <p class="credit">{content.footer.creditPrefix} <a href={site.creditUrl}>yesid.dev</a></p>
  </div>
</footer>

<style>
  .site-footer { background: var(--ink); color: white; padding-block: 48px; }
  .footer-content { display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; }
  .footer-brand { font-size: 24px; line-height: 36px; font-weight: 700; text-decoration: none; }
  .description { font-size: 15px; line-height: 23px; }
  .phone { font-size: 17px; line-height: 26px; font-weight: 600; text-decoration: none; }
  .email { font-size: 16px; line-height: 24px; text-decoration: none; }
  .footer-links { align-self: center; display: flex; align-items: center; flex-wrap: wrap; gap: 28px; }
  .footer-links .text-button { font-size: 14px; line-height: 21px; text-decoration: none; }
  .copyright, .credit { font-size: 12px; line-height: 18px; }
  .credit { color: rgb(255 255 255 / 72%); }
  .credit a { text-underline-offset: 2px; }
  @media (max-width: 1099px) { .site-footer { padding-bottom: 148px; } }
  @media (max-width: 599px) { .site-footer { padding-top: 38px; padding-bottom: 138px; } .footer-links { flex-direction: column; align-items: center; gap: 14px; } }
</style>
