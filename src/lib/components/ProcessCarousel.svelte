<script lang="ts">
  import { asset } from '$app/paths';
  import type { Content } from '#lib/content/index.ts';
  import Photo from './Photo.svelte';

  let { content, images }: { content: Content['process']; images: Content['images'] } = $props();
  let current = $state(0);
  let step = $derived(content.steps[current]);

  function change(direction: number) {
    current = (current + direction + content.steps.length) % content.steps.length;
  }
</script>

<section id="process" class="process-section" aria-labelledby="process-title">
  <div class="container">
    <h2 id="process-title">{content.title}</h2>
    <div class="carousel" role="region" aria-label={content.regionLabel} aria-roledescription="carousel">
        <div class="process-slide">
          <Photo image={step.image} alt={images[step.image as keyof typeof images]} class="process-photo" sizes="(max-width: 1099px) 90vw, 50vw" />
          <div class="process-copy">
            <div class="step-content" aria-live="polite" aria-atomic="true">
              {#each content.steps as item, index}
                <div class="step-text" hidden={index !== current}>
                  <p class="step-label">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p class="step-description">{item.body}</p>
                </div>
              {/each}
            </div>
            <div class="carousel-controls">
              <div class="step-indicator">
                <p>{String(current + 1).padStart(2, '0')} / {String(content.steps.length).padStart(2, '0')}</p>
                <div class="progress" aria-hidden="true">{#each content.steps as _, position}<span class:active={position === current}></span>{/each}</div>
              </div>
              <div class="arrows">
                <button type="button" aria-label={content.previous} onclick={() => change(-1)}><img src={asset('icons/arrow-left.svg')} width="20" height="20" alt="" /></button>
                <button type="button" aria-label={content.next} onclick={() => change(1)}><img src={asset('icons/arrow-right.svg')} width="20" height="20" alt="" /></button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</section>

<style>
  .process-section { padding-block: 72px; background: white; }
  .carousel { margin-top: 32px; }
  .process-slide { display: grid; grid-template-columns: minmax(0, 704fr) minmax(0, 552fr); gap: 56px; align-items: center; }
  .step-text[hidden] { display: none; }
  .process-slide :global(.process-photo) { width: 100%; height: 472px; object-fit: cover; border-radius: 8px; }
  .process-copy { display: flex; flex-direction: column; justify-content: space-between; min-height: 342px; gap: 28px; }
  .step-text { display: flex; flex-direction: column; gap: 18px; }
  .step-label { font-size: 13px; line-height: 20px; font-weight: 500; }
  h3 { font-size: 40px; line-height: 47px; font-weight: 800; letter-spacing: -0.8px; }
  .step-description { font-size: 18px; line-height: 28px; }
  .carousel-controls { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .step-indicator p { font-size: 13px; line-height: 18px; font-weight: 600; }
  .progress { display: flex; gap: 5px; margin-top: 9px; width: 112px; }
  .progress span { flex: 1; height: 3px; border-radius: 2px; background: rgb(0 0 0 / 16%); }
  .progress .active { background: var(--ink); }
  .arrows { display: flex; gap: 8px; }
  button { width: 48px; height: 48px; border: 1px solid rgb(0 0 0 / 16%); border-radius: 50%; display: grid; place-items: center; background: rgb(255 255 255 / 72%); transition: background 150ms, transform 150ms; }
  button:hover { background: #edf0f2; transform: translateY(-2px); }
  @media (prefers-reduced-motion: no-preference) {
    .step-text:not([hidden]) { animation: step-in 250ms ease-out both; }
    @keyframes step-in { from { opacity: 0.5; transform: translateX(5px); } to { opacity: 1; transform: translateX(0); } }
  }
  @media (min-width: 600px) and (max-width: 1099px) {
    .process-slide { gap: 32px; grid-template-columns: 1fr 1fr; }
    .process-slide :global(.process-photo) { height: 400px; }
    h3 { font-size: 32px; line-height: 38px; }
    .step-description { font-size: 16px; line-height: 25px; }
  }
  @media (max-width: 749px) {
    .process-slide { grid-template-columns: 1fr; gap: 28px; }
    .process-slide :global(.process-photo) { aspect-ratio: 3 / 2; height: auto; max-height: 400px; }
  }
  @media (max-width: 599px) {
    .process-section { padding-block: 48px; }
    .process-copy { min-height: 358px; }
    h3 { font-size: 30px; line-height: 36px; letter-spacing: -0.6px; }
    .step-description { font-size: 16px; line-height: 25px; }
  }
</style>
