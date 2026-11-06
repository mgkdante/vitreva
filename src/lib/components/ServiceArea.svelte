<script lang="ts">
  import type { Content, Locale } from '#lib/content/index.ts';
  import { localHref } from '#lib/links.ts';
  import { site } from '#lib/config/site.ts';
  import { glassEntrance, glassHighlight } from '#lib/glass.ts';
  import Photo from './Photo.svelte';

  let { content, locale }: { content: Content['area']; locale: Locale } = $props();
</script>

<section id="area" class="service-area" aria-labelledby="area-title" use:glassEntrance>
  <Photo image="aftercare" class="area-photo" />
  <div class="area-tint"></div>
  <div class="container area-container">
    <div class="glass area-pane" use:glassHighlight>
      <h2 id="area-title">{content.title}</h2>
      <p class="body">{content.body}</p>
      <ul>
        {#each site.serviceArea.locations as town}<li>{town}</li>{/each}
        {#each site.serviceArea.boundaryLocations as town}<li class="edge">{town}<span class="visually-hidden"> ({content.boundaryHint})</span></li>{/each}
      </ul>
      <p class="note">{content.note}</p>
      <p class="more"><a href={localHref(locale, 'area')}>{content.link} →</a></p>
    </div>
  </div>
</section>

<style>
  .service-area { position: relative; overflow: hidden; background: var(--ink); color: white; }
  .service-area :global(.area-photo) { position: absolute; inset: 0; height: 100%; width: 100%; object-fit: cover; object-position: 80% 20%; }
  .area-tint { position: absolute; inset: 0; background: rgb(6 10 13 / 48%); }
  .area-container { position: relative; padding-block: 96px; }
  .area-pane { padding: 52px; border-radius: 26px; --glass-border: rgb(255 255 255 / 65%); }
  .area-pane > * { position: relative; z-index: 1; }
  h2 { font-size: clamp(34px, 4vw, 60px); line-height: 1.12; filter: blur(0.425px); }
  .body { margin-top: 18px; max-width: 760px; font-size: 18px; line-height: 28px; color: rgb(255 255 255 / 94%); }
  ul { display: flex; flex-wrap: wrap; gap: 8px; margin: 32px 0 0; padding: 0; list-style: none; }
  li { padding: 6px 13px; border: 1px solid rgb(255 255 255 / 34%); border-radius: 999px; font-size: 14px; line-height: 20px; font-weight: 600; background: rgb(0 0 0 / 16%); }
  .edge { border-style: dashed; }
  .note { margin-top: 18px; font-size: 14px; line-height: 21px; color: rgb(255 255 255 / 86%); }
  .more { margin-top: 14px; font-size: 15px; line-height: 22px; font-weight: 700; }
  .more a { text-underline-offset: 4px; }
  @media (prefers-reduced-motion: no-preference) {
    :global(.glass-entered) .area-pane::after { animation: glass-sweep 1100ms ease-out both; }
  }
  @media (max-width: 720px) {
    .area-container { padding-block: 40px; }
    .area-pane { padding: 26px; }
  }
</style>
