<script lang="ts">
  import { asset, resolve } from '$app/paths';
  import { getContent, type Locale } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import LanguageSwitch from '#lib/components/LanguageSwitch.svelte';

  let { locale = 'fr', status = 404 }: { locale?: Locale; status?: number } = $props();
  const content = $derived(getContent(locale));
  const copy = $derived(content.error);
  const message = $derived(status === 404 ? copy.notFound : copy.unavailable);
  const home = $derived(locale === 'fr'
    ? `${resolve('/[[lang=lang]]', {}).replace(/\/$/, '')}/`
    : `${resolve('/[[lang=lang]]', { lang: locale })}/`);
</script>

<svelte:head>
  <title>{status} — {message.title} | {site.brand}</title>
  <meta name="robots" content="noindex, follow" />
  <meta name="description" content={message.body} />
</svelte:head>

<div class="error-page" lang={locale}>
  <a class="skip-link" href="#main">{content.navigation.skip}</a>
  <header class="error-header">
    <a class="wordmark" href={home} aria-label={content.navigation.home}>{site.brand.toUpperCase()}</a>
    <LanguageSwitch {locale} label={content.navigation.language} />
  </header>

  <main id="main">
    <div class="illustration">
      <p class="status" aria-label={`${copy.statusLabel} ${status}`}>{status}</p>
      <img src={asset('images/transit-connect-404.svg')} width="960" height="480" alt={copy.illustrationAlt} fetchpriority="high" />
    </div>
    <div class="message">
      <p class="eyebrow">{message.eyebrow}</p>
      <h1>{message.title}</h1>
      <p class="description">{message.body}</p>
      <div class="actions">
        <a class="button home-button" href={home}>{copy.home}</a>
        <a class="email-link" href={site.emailHref}>{copy.email}</a>
      </div>
    </div>
  </main>

  <footer>{copy.footer}</footer>
</div>

<style>
  .error-page { min-height: 100svh; display: flex; flex-direction: column; color: #141a1e; background: #f6f7f6; }
  .error-header { width: min(calc(100% - 64px), 1320px); margin-inline: auto; display: flex; justify-content: space-between; align-items: center; padding-block: 28px; }
  .wordmark { font-size: 26px; line-height: 1.5; font-weight: 700; letter-spacing: 3px; text-decoration: none; }
  main { width: min(calc(100% - 48px), 960px); margin: auto; padding: 10px 0 68px; text-align: center; }
  .illustration { position: relative; isolation: isolate; width: min(100%, 750px); margin: 0 auto 14px; padding-top: 88px; }
  .status { position: absolute; top: -18px; left: 0; z-index: -1; width: 100%; color: #dce1e3; font-size: clamp(130px, 22vw, 230px); line-height: 1; font-weight: 800; letter-spacing: -.075em; padding-right: .075em; }
  img { width: 100%; height: auto; }
  .message { position: relative; margin-top: -28px; }
  .eyebrow { font-size: 13px; font-weight: 700; letter-spacing: .035em; color: #58666e; }
  h1 { margin: 14px auto 16px; font-size: clamp(30px, 4.2vw, 46px); line-height: 1.15; letter-spacing: -.045em; font-weight: 800; }
  .description { max-width: 480px; margin-inline: auto; color: #59636a; font-size: 16px; line-height: 1.65; }
  .actions { display: flex; align-items: center; justify-content: center; gap: 28px; margin-top: 28px; }
  .home-button { min-height: 54px; gap: 24px; color: white; background: linear-gradient(145deg, #303b42, #11181c); border: 1px solid #404b52; box-shadow: 0 5px 14px rgb(16 24 30 / 12%), inset 0 1px 0 rgb(255 255 255 / 15%); }
  .home-button:hover { background: #35434c; }
  .email-link { font-size: 14px; font-weight: 600; text-underline-offset: 5px; }
  footer { padding: 0 24px 26px; text-align: center; color: #6a757c; font-size: 12px; line-height: 1.6; }
  @media (max-width: 599px) {
    .error-header { width: calc(100% - 48px); padding-block: 24px; }
    .wordmark { font-size: 27px; }
    main { padding-top: 40px; padding-bottom: 48px; }
    .illustration { padding-top: 60px; margin-bottom: 22px; }
    .status { top: -36px; }
    .message { margin-top: 0; }
    .eyebrow { max-width: 290px; margin-inline: auto; line-height: 1.6; }
    h1 { max-width: 360px; }
    .description { font-size: 15px; }
    .actions { flex-direction: column; gap: 22px; }
  }
</style>
