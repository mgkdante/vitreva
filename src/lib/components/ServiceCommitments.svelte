<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  let { content }: { content: Content['commitment'] } = $props();
</script>

<section class="commitment-section" aria-labelledby="commitment-title">
  <div class="container">
    <h2 id="commitment-title">{content.title}</h2>
    <div class="commitments">
      {#each content.items as item}
        <div><h3>{item.title}</h3><p>{item.body}</p></div>
      {/each}
    </div>
  </div>
</section>

<style>
  .commitment-section { background: white; padding-block: 58px; }
  h2 { font-size: 42px; line-height: 46px; }
  .commitments { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; margin-top: 28px; }
  h3 { font-size: 19px; line-height: 29px; font-weight: 700; }
  p { color: var(--muted); font-size: 15px; line-height: 23px; margin-top: 8px; }
  @media (max-width: 599px) {
    .commitment-section { padding-block: 44px; }
    h2 { font-size: 30px; line-height: 33px; }
    .commitments { grid-template-columns: 1fr; gap: 22px; }
  }
</style>
