<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  let { content }: { content: Content['information'] } = $props();
</script>

<section id="service" class="information-section" aria-labelledby="information-title">
  <div class="container">
    <h2 id="information-title">{content.title}</h2>
    <div class="information-grid">
      {#each content.items as item}
        <div><h3>{item.title}</h3><p>{item.body}</p></div>
      {/each}
    </div>
    <p class="closing">{content.closing}</p>
  </div>
</section>

<style>
  .information-section { padding-block: 76px; background: white; }
  .information-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px; margin-top: 30px; }
  h3 { font-size: 25px; line-height: 38px; font-weight: 700; }
  .information-grid p { margin-top: 10px; font-size: 16px; line-height: 24px; color: var(--muted); }
  .closing { margin-top: 30px; font-size: 16px; line-height: 24px; font-weight: 500; }
  @media (max-width: 749px) { .information-grid { grid-template-columns: 1fr; gap: 26px; } }
  @media (max-width: 599px) { .information-section { padding-block: 52px; } h3 { font-size: 22px; line-height: 33px; } }
</style>
