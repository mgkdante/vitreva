<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import { reveal } from '#lib/reveal.ts';

  let { content }: { content: Content['process'] } = $props();
</script>

<section id="process" class="route" aria-labelledby="process-title" use:reveal>
  <div class="container">
    <div class="head">
      <div>
        <p class="eyebrow">{content.eyebrow}</p>
        <h2 id="process-title">{content.title}</h2>
      </div>
      <div class="actions">
        <a class="button button-ink" href={site.smsHref}>{content.textCta}</a>
        <a class="button button-outline" href="#quote">{content.quoteCta}</a>
      </div>
    </div>
    <div class="track">
      <span class="progress" aria-hidden="true"></span>
      <ol class="stops">
      {#each content.steps as step, index}
        <li class="stop">
          <span class="dot" aria-hidden="true">{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </li>
      {/each}
      </ol>
    </div>
  </div>
</section>

<style>
  .route { background: white; padding-block: 104px; }
  .head { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
  h2 { margin-top: 14px; max-width: 760px; }
  .actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .track { position: relative; margin-top: 72px; }
  .stops { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 36px; margin: 0; padding: 0; list-style: none; }
  .track::before, .progress { content: ''; position: absolute; top: 15px; left: 15px; right: 15px; height: 2px; }
  .track::before { background: var(--line); }
  .progress { z-index: 1; background: var(--ink); transform-origin: left center; }
  :global(html.hero-motion) .route:not(:global(.revealed)) .progress { transform: scaleX(0); }
  .stop { position: relative; }
  .dot { position: relative; z-index: 2; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--ink); color: white; font-size: 13px; font-weight: 800; }
  h3 { margin-top: 24px; font-size: 22px; line-height: 1.22; font-weight: 800; letter-spacing: -.012em; }
  .stop p { margin-top: 12px; font-size: 16px; line-height: 25px; color: var(--muted); }
  @media (prefers-reduced-motion: no-preference) {
    .progress { transition: transform 1400ms cubic-bezier(.3, .6, .2, 1) 150ms; }
  }
  @media (max-width: 1099px) {
    .track { margin-top: 52px; }
    .stops { grid-template-columns: 1fr; gap: 0; }
    .track::before, .progress { top: 16px; bottom: 16px; left: 15px; right: auto; width: 2px; height: auto; }
    .progress { transform-origin: center top; }
    :global(html.hero-motion) .route:not(:global(.revealed)) .progress { transform: scaleY(0); }
    .stop { padding: 0 0 36px 56px; }
    .stop:last-child { padding-bottom: 0; }
    .dot { position: absolute; left: 0; top: 0; }
    h3 { margin-top: 2px; }
  }
  @media (max-width: 720px) {
    .route { padding-block: 68px; }
    .actions, .actions .button { width: 100%; }
  }
</style>
