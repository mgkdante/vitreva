<script lang="ts">
  import type { Content, Locale } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import { glassHighlight } from '#lib/glass.ts';
  import { quoteEndpoint, sendQuote } from '#lib/quote.ts';
  import Photo from './Photo.svelte';

  let { content, locale, privacyHref }: { content: Content['quote']; locale: Locale; privacyHref: string } = $props();
  let status = $state<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!site.web3formsAccessKey || status === 'sending') return;
    const form = event.currentTarget as HTMLFormElement;
    status = 'sending';
    try {
      await sendQuote(new FormData(form));
      status = 'success';
      form.reset();
    } catch {
      status = 'error';
    }
  }
</script>

<section id="quote" class="quote-section" aria-labelledby="quote-title">
  <Photo image="bokeh" class="quote-photo" sizes="100vw" />
  <div class="quote-tint"></div>
  <div class="container quote-layout">
    <div class="quote-introduction">
      <p class="eyebrow">{content.eyebrow}</p>
      <h2 id="quote-title">{content.title}</h2>
      <p class="intro">{content.intro}</p>
      <div class="ways">
        <a href={site.smsHref}><b>{content.ways.text}</b><small>{content.ways.textNote}</small></a>
        <a href={site.phoneHref}><b>{content.call}</b><small>{site.phoneDisplay}</small></a>
        <a href={site.emailHref}><b>{content.ways.email}</b><small>{site.email}</small></a>
      </div>
    </div>
    <form class="quote-form glass" action={quoteEndpoint} method="POST" onsubmit={submit} use:glassHighlight aria-busy={status === 'sending'}>
      <input type="hidden" name="access_key" value={site.web3formsAccessKey} />
      <input type="hidden" name="subject" value={content.subject} />
      <input type="hidden" name="language" value={locale} />
      <input class="honeypot" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <label>{content.fields.name}<input name="name" autocomplete="name" maxlength="100" required /></label>
      <label>{content.fields.contact}<input name="contact" maxlength="254" minlength="5" required /></label>
      <label>{content.fields.vehicle}<input name="vehicle" maxlength="160" required /></label>
      <label>{content.fields.location}<input name="location" maxlength="160" required /></label>
      <div class="wide vin-field"><label>{content.fields.vin}<input name="vin" maxlength="17" aria-describedby="vin-help" autocapitalize="characters" spellcheck="false" /></label><p id="vin-help" class="vin-help">{content.vinHelp}</p></div>
      <label class="wide">{content.fields.message}<textarea name="message" rows="2" maxlength="3000" required></textarea></label>
      <label class="consent wide"><input type="checkbox" name="consent" value="yes" required /><span>{content.consent}</span></label>
      <button class="button button-white wide" type="submit" disabled={!site.web3formsAccessKey || status === 'sending'}>{status === 'sending' ? content.submitting : content.submit}</button>
      {#if !site.web3formsAccessKey}<p class="form-message wide" role="status">{content.unconfigured}</p>{/if}
      {#if status === 'success'}<p class="form-message wide" role="status">{content.success}</p>{/if}
      {#if status === 'error'}<p class="form-message wide" role="alert">{content.error}</p>{/if}
      <p class="form-note wide">{content.note}</p>
      <p class="form-note wide">{content.privacyNote} <a href={privacyHref}>{content.privacyLabel}</a></p>
    </form>
  </div>
</section>

<style>
  .quote-section { position: relative; background: var(--ink); color: white; overflow: hidden; }
  .quote-section :global(.quote-photo) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .quote-tint { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(7 10 12 / 74%), rgb(7 10 12 / 34%)); }
  .quote-layout { position: relative; display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 72px; padding-block: 112px; align-items: center; }
  .eyebrow { color: rgb(255 255 255 / 78%); }
  h2 { margin-top: 14px; font-size: clamp(34px, 4.2vw, 62px); line-height: 1.08; }
  .intro { margin-top: 18px; max-width: 480px; font-size: 18px; line-height: 28px; }
  .ways { display: grid; gap: 10px; max-width: 440px; margin-top: 32px; }
  .ways a { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 20px; border: 1px solid rgb(255 255 255 / 34%); border-radius: 14px; text-decoration: none; background: rgb(0 0 0 / 22%); transition: background 180ms; }
  .ways a:hover { background: rgb(255 255 255 / 12%); }
  .ways b { font-size: 16px; font-weight: 800; white-space: nowrap; }
  .ways small { font-size: 13px; line-height: 18px; color: rgb(255 255 255 / 84%); text-align: right; }
  .quote-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 34px; border-radius: 26px; --glass-border: rgb(255 255 255 / 65%); }
  .quote-form > :not(.honeypot) { position: relative; z-index: 1; }
  .wide { grid-column: 1 / -1; }
  label { display: flex; flex-direction: column; gap: 7px; font-size: 14px; line-height: 20px; font-weight: 600; }
  input:not([type='checkbox']), textarea { width: 100%; min-height: 46px; border-radius: 10px; border: 1px solid #c4c7c9; background: white; color: var(--ink); padding: 10px 13px; font-size: 16px; line-height: 22px; font-weight: 400; }
  textarea { resize: vertical; }
  .vin-help { margin-top: 7px; font-size: 12px; line-height: 17px; font-weight: 500; }
  .consent { flex-direction: row; align-items: flex-start; gap: 10px; font-size: 13px; line-height: 19px; font-weight: 500; }
  .consent input { flex: 0 0 17px; width: 17px; height: 17px; margin-top: 2px; accent-color: var(--ink); }
  .form-note { font-size: 13px; line-height: 20px; }
  .form-note a { text-underline-offset: 3px; }
  .form-message { padding: 12px; border: 1px solid rgb(255 255 255 / 50%); border-radius: 10px; background: rgb(0 0 0 / 36%); font-size: 14px; line-height: 21px; }
  .honeypot { display: none; }
  @media (max-width: 1099px) { .quote-layout { grid-template-columns: 1fr; gap: 44px; } }
  @media (max-width: 720px) {
    .quote-layout { padding-block: 72px; }
    .quote-form { grid-template-columns: 1fr; padding: 22px; }
  }
</style>
