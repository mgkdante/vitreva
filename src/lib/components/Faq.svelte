<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';

  let { content }: { content: Content['faq'] } = $props();
</script>

<section id="faq" class="faq-section" aria-labelledby="faq-title">
  <div class="container grid">
    <div class="side">
      <p class="eyebrow">{content.eyebrow}</p>
      <h2 id="faq-title">{content.title}</h2>
      <p class="intro">{content.intro}</p>
      <a class="button button-ink" href={site.smsHref}>{content.cta}</a>
    </div>
    <div>
      {#each content.items as item, index}
        <details name="questions" open={index === 0}>
          <summary>{item.question}<span class="faq-toggle" aria-hidden="true"></span></summary>
          <p>{item.answer}</p>
        </details>
      {/each}
    </div>
  </div>
</section>

<style>
  .faq-section { background: var(--paper); padding-block: 104px; }
  .grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.4fr); gap: 72px; align-items: start; }
  .side { position: sticky; top: max(150px, 10vw); }
  h2 { margin-top: 14px; }
  .intro { margin-top: 18px; max-width: 380px; font-size: 16px; line-height: 25px; color: var(--muted); }
  .side .button { margin-top: 24px; }
  details { border-top: 1px solid var(--line); padding-block: 22px; }
  details:last-child { border-bottom: 1px solid var(--line); }
  summary { list-style: none; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; font-size: 18px; line-height: 27px; font-weight: 700; cursor: pointer; }
  summary::-webkit-details-marker { display: none; }
  .faq-toggle { flex: 0 0 24px; font-size: 22px; line-height: 24px; font-weight: 400; }
  .faq-toggle::before { content: '+'; }
  details[open] .faq-toggle::before { content: '−'; }
  details p { margin-top: 12px; max-width: 720px; font-size: 16px; line-height: 25px; color: #3d444a; }
  @supports (interpolate-size: allow-keywords) and (transition-behavior: allow-discrete) {
    details { interpolate-size: allow-keywords; }
    details::details-content {
      block-size: 0;
      overflow: clip;
      opacity: 0;
      transition: block-size 240ms ease, opacity 180ms ease, content-visibility 240ms allow-discrete;
    }
    details[open]::details-content { block-size: auto; opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    details::details-content { transition: none; }
  }
  @media (max-width: 1099px) {
    .grid { grid-template-columns: 1fr; gap: 44px; }
    .side { position: static; }
  }
  @media (max-width: 720px) { .faq-section { padding-block: 68px; } }
</style>
