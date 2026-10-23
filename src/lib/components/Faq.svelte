<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  let { content }: { content: Content['faq'] } = $props();
</script>

<section id="faq" class="faq-section" aria-labelledby="faq-title">
  <div class="container">
    <h2 id="faq-title">{content.title}</h2>
    <div class="questions">
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
  .faq-section { background: var(--paper); padding-block: 72px; }
  details { border-top: 1px solid var(--line); padding-block: 20px; }
  summary { list-style: none; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; font-size: 18px; line-height: 27px; font-weight: 700; cursor: pointer; }
  summary::-webkit-details-marker { display: none; }
  .faq-toggle { flex: 0 0 24px; font-size: 22px; line-height: 24px; font-weight: 400; }
  .faq-toggle::before { content: '+'; }
  details[open] .faq-toggle::before { content: '−'; }
  details p { margin-top: 12px; font-size: 16px; line-height: 24px; }
  @media (max-width: 599px) { .faq-section { padding-block: 52px; } }
</style>
