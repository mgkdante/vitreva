<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import Photo from './Photo.svelte';

  let { content }: { content: Content } = $props();
</script>

<section class="hero" id="hero" aria-labelledby="hero-title">
  <Photo image="van" alt={content.images.van} class="hero-photo" priority sizes="(max-width: 599px) 1500px, 100vw" />
  <div class="hero-content container">
    <h1 id="hero-title">{#each content.hero.lines as line}<span>{line}</span>{/each}</h1>
    <p>{content.hero.subtitle}</p>
    <div class="hero-actions">
      <a class="button button-white" href={site.phoneHref}>{content.navigation.call}</a>
      <a class="button button-clear glass" href="#quote">{content.hero.quote}</a>
    </div>
    <a class="email-link" href={site.emailHref}>{content.hero.email}</a>
  </div>
</section>

<style>
  .hero { position: relative; min-height: 800px; background: var(--ink); color: white; overflow: hidden; }
  .hero :global(.hero-photo) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgb(0 0 0 / 84%), rgb(0 0 0 / 12%) 76%, rgb(0 0 0 / 7%)); pointer-events: none; }
  .hero-content { position: relative; z-index: 1; padding-top: 230px; padding-bottom: 100px; }
  h1 { font-size: 72px; font-weight: 800; line-height: 79px; max-width: 800px; }
  h1 span { display: block; }
  p { font-size: 23px; line-height: 35px; margin-top: 28px; max-width: 760px; }
  .hero-actions { display: flex; gap: 14px; margin-top: 28px; }
  .hero-actions .button-white { min-width: 210px; }
  .hero-actions .button-clear { min-width: 280px; }
  .email-link { display: inline-block; font-size: 15px; font-weight: 500; margin-top: 28px; text-underline-offset: 4px; }
  @media (prefers-reduced-motion: no-preference) {
    .hero-content { animation: hero-enter 650ms ease-out both; }
    @keyframes hero-enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  }
  @media (min-width: 600px) and (max-width: 1099px) {
    .hero { min-height: 740px; }
    .hero-content { padding-top: 210px; }
    h1 { font-size: 56px; line-height: 1.1; max-width: 650px; }
  }
  @media (max-width: 599px) {
    .hero { min-height: 840px; }
    .hero :global(.hero-photo) { object-position: right center; }
    .hero::after { background: linear-gradient(180deg, rgb(0 0 0 / 84%), rgb(0 0 0 / 12%) 65%, rgb(0 0 0 / 7%)); }
    .hero-content { padding-top: 142px; padding-bottom: 60px; }
    h1 { font-size: 38px; line-height: 42px; }
    p { font-size: 18px; line-height: 27px; margin-top: 22px; }
    .hero-actions { flex-direction: column; margin-top: 22px; }
    .hero-actions .button { width: 100%; min-width: 0; }
    .email-link { margin-top: 22px; }
  }
  @media (max-width: 374px) { h1 { font-size: 35px; line-height: 40px; } }
</style>
