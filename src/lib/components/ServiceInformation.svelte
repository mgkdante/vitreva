<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  import Photo from './Photo.svelte';

  let { content, alt }: { content: Content['information']; alt: string } = $props();
</script>

<section id="service" class="expect" aria-labelledby="information-title">
  <div class="container grid">
    <figure>
      <Photo image="installation" {alt} class="expect-photo" sizes="(max-width: 1099px) 90vw, 50vw" />
      <figcaption>{content.caption}</figcaption>
    </figure>
    <div>
      <p class="eyebrow">{content.eyebrow}</p>
      <h2 id="information-title">{content.title}</h2>
      <ul>
        {#each content.items as item, index}
          <li>
            <span class="index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div><h3>{item.title}</h3><p>{item.body}</p></div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<style>
  .expect { background: var(--paper); padding-block: 104px; }
  .grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 72px; align-items: center; }
  figure { margin: 0; }
  figure :global(.expect-photo) { width: 100%; height: auto; aspect-ratio: 1.12; object-fit: cover; border-radius: 18px; }
  figcaption { margin-top: 12px; font-size: 13px; line-height: 19px; color: var(--muted); }
  h2 { margin-top: 14px; }
  ul { margin: 36px 0 0; padding: 0; list-style: none; }
  li { display: grid; grid-template-columns: 44px 1fr; padding-block: 20px; border-top: 1px solid var(--line); }
  li:last-child { border-bottom: 1px solid var(--line); }
  .index { font-size: 13px; line-height: 26px; font-weight: 800; color: var(--muted); font-variant-numeric: tabular-nums; }
  h3 { font-size: 18px; line-height: 26px; font-weight: 800; }
  li p { margin-top: 4px; font-size: 15.5px; line-height: 24px; color: var(--muted); }
  @media (max-width: 1099px) { .grid { grid-template-columns: 1fr; gap: 44px; } }
  @media (max-width: 720px) { .expect { padding-block: 68px; } }
</style>
