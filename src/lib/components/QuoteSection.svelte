<script lang="ts">
  import type { Content, Locale } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import { glassHighlight } from '#lib/glass.ts';
  import { sendQuote } from '#lib/quote.ts';
  import Photo from './Photo.svelte';

  let { content, locale, onPrivacy }: { content: Content['quote']; locale: Locale; onPrivacy: () => void } = $props();
  let status = $state<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!site.quoteEndpoint || status === 'sending') return;
    const form = event.currentTarget as HTMLFormElement;
    status = 'sending';
    try {
      await sendQuote(site.quoteEndpoint, new FormData(form));
      status = 'success';
      form.reset();
    } catch {
      status = 'error';
    }
  }
</script>

<section id="quote" class="quote-section" aria-labelledby="quote-title">
  <Photo image="van" class="quote-photo" sizes="(max-width: 599px) 2200px, 100vw" />
  <div class="quote-tint"></div>
  <div class="container quote-layout">
    <div class="quote-introduction">
      <h2 id="quote-title">{content.title}</h2>
      <p>{content.intro}</p>
      <div class="direct-actions">
        <a class="button button-white" href={site.phoneHref}>{content.call}</a>
        <a href={site.emailHref}>{site.email}</a>
      </div>
    </div>
    <form class="quote-form glass" action={site.quoteEndpoint || undefined} method="POST" onsubmit={submit} use:glassHighlight aria-busy={status === 'sending'}>
      <input type="hidden" name="_subject" value={content.subject} />
      <input type="hidden" name="language" value={locale} />
      <input class="honeypot" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <label>{content.fields.name}<input name="name" autocomplete="name" maxlength="100" required /></label>
      <label>{content.fields.contact}<input name="contact" autocomplete="email" maxlength="254" minlength="5" required /></label>
      <label>{content.fields.vehicle}<input name="vehicle" maxlength="160" required /></label>
      <label>{content.fields.vin}<input name="vin" maxlength="17" aria-describedby="vin-help" autocapitalize="characters" spellcheck="false" /></label>
      <p id="vin-help" class="vin-help">{content.vinHelp}</p>
      <label>{content.fields.location}<input name="location" autocomplete="postal-code" maxlength="160" required /></label>
      <label>{content.fields.message}<textarea name="message" rows="1" maxlength="3000" required></textarea></label>
      <label class="consent"><input type="checkbox" name="consent" value="yes" required /><span>{content.consent}</span></label>
      <button class="button button-white" type="submit" disabled={!site.quoteEndpoint || status === 'sending'}>{status === 'sending' ? content.submitting : content.submit}</button>
      {#if !site.quoteEndpoint}<p class="form-message" role="status">{content.unconfigured}</p>{/if}
      {#if status === 'success'}<p class="form-message" role="status">{content.success}</p>{/if}
      {#if status === 'error'}<p class="form-message" role="alert">{content.error}</p>{/if}
      <p class="form-note">{content.note}</p>
      <p class="form-note">{content.privacyNote}</p>
      <button class="text-button" type="button" onclick={onPrivacy}>{content.privacyLabel}</button>
    </form>
  </div>
</section>

<style>
  .quote-section { position: relative; background: var(--ink); color: white; overflow: hidden; }
  .quote-section :global(.quote-photo) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
  .quote-tint { position: absolute; inset: 0; background: rgb(16 18 20 / 25%); }
  .quote-layout { position: relative; display: grid; grid-template-columns: minmax(0, 520fr) minmax(0, 728fr); gap: 64px; padding-top: 128px; padding-bottom: 80px; }
  .quote-introduction { align-self: center; }
  .quote-introduction h2 { font-size: 50px; line-height: 55px; }
  .quote-introduction p { max-width: 470px; margin-top: 24px; font-size: 18px; line-height: 27px; }
  .direct-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 20px; margin-top: 24px; }
  .direct-actions .button { min-width: 210px; }
  .direct-actions > a:not(.button) { font-size: 16px; font-weight: 600; text-underline-offset: 4px; }
  .quote-form { display: flex; flex-direction: column; align-items: stretch; gap: 14px; padding: 32px; border-radius: 26px; --glass-border: rgb(255 255 255 / 65%); }
  .quote-form > :not(.honeypot) { position: relative; z-index: 1; }
  label { display: flex; flex-direction: column; gap: 8px; font-size: 14px; line-height: 21px; }
  input:not([type='checkbox']), textarea { width: 100%; min-height: 42px; border-radius: 8px; border: 1px solid #c4c7c9; background: white; color: var(--ink); padding: 9px 12px; font-size: 16px; line-height: 22px; }
  textarea { resize: vertical; }
  .vin-help { font-size: 12px; line-height: 18px; }
  .consent { display: flex; flex-direction: row; align-items: flex-start; gap: 10px; font-size: 12px; line-height: 18px; }
  .consent input { flex: 0 0 17px; width: 17px; height: 17px; margin-top: 2px; accent-color: var(--ink); }
  .form-note { font-size: 13px; line-height: 20px; }
  .form-message { padding: 12px; border: 1px solid rgb(255 255 255 / 50%); border-radius: 8px; background: rgb(0 0 0 / 32%); font-size: 14px; line-height: 21px; }
  .text-button { align-self: flex-start; font-size: 13px; line-height: 20px; }
  .honeypot { display: none; }
  @media (max-width: 1099px) {
    .quote-layout { grid-template-columns: 1fr; gap: 32px; }
    .quote-introduction h2 { max-width: 680px; }
  }
  @media (max-width: 599px) {
    .quote-section :global(.quote-photo) { object-position: right center; }
    .quote-layout { padding-top: 112px; }
    .quote-introduction h2 { font-size: 34px; line-height: 37px; }
    .quote-introduction p { max-width: none; }
    .quote-form { padding: 20px; }
  }
</style>
