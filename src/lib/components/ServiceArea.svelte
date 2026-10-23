<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  import { glassEntrance, glassHighlight } from '#lib/glass.ts';
  import Photo from './Photo.svelte';
  let { content }: { content: Content['area'] } = $props();
</script>

<section class="service-area" aria-labelledby="area-title" use:glassEntrance>
  <Photo image="aftercare" class="area-photo" />
  <div class="area-tint"></div>
  <div class="container area-container">
    <div class="glass area-pane" use:glassHighlight>
      <h2 id="area-title">{content.title}</h2>
      <p>{content.body}</p>
    </div>
  </div>
</section>

<style>
  .service-area { position: relative; display: grid; align-items: center; min-height: 380px; overflow: hidden; background: var(--ink); color: white; }
  .service-area :global(.area-photo) { position: absolute; inset: 0; height: 100%; width: 100%; object-fit: cover; }
  .area-tint { position: absolute; inset: 0; background: rgb(6 10 13 / 48%); }
  .area-container { position: relative; padding-block: 40px; }
  .area-pane { min-height: 300px; display: flex; flex-direction: column; justify-content: center; gap: 20px; padding: 40px; border-radius: 26px; --glass-border: rgb(255 255 255 / 65%); }
  h2 { position: relative; z-index: 1; font-size: 52px; line-height: 1.12; filter: blur(0.425px); }
  p { position: relative; z-index: 1; max-width: 860px; font-size: 17px; line-height: 26px; color: rgb(255 255 255 / 94%); }
  @media (prefers-reduced-motion: no-preference) {
    :global(.glass-entered) .area-pane::after { animation: glass-sweep 1100ms ease-out both; }
  }
  @media (min-width: 600px) and (max-width: 1099px) { h2 { font-size: 44px; } }
  @media (max-width: 599px) {
    .service-area { min-height: 450px; }
    .area-container { padding-block: 32px; }
    .area-pane { min-height: 386px; padding: 24px; }
    h2 { font-size: 34px; }
  }
</style>
