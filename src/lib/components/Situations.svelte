<script lang="ts">
  import type { Content, Locale } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import { localHref } from '#lib/links.ts';

  let { content, locale }: { content: Content['situations']; locale: Locale } = $props();

  const href = (target: string) => target === 'insurance' || target === 'fleets' || target === 'cameras' ? localHref(locale, target) : site.smsHref;
</script>

<section class="situations" aria-labelledby="situations-title">
  <div class="container">
    <p class="eyebrow">{content.eyebrow}</p>
    <h2 id="situations-title">{content.title}</h2>
    <div class="cards">
      {#each content.cards as card}
        <a class="card" href={href(card.target)}>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          <span class="link">{card.cta} →</span>
        </a>
      {/each}
    </div>
  </div>
</section>

<style>
  .situations { background: white; padding-block: 104px; }
  h2 { margin-top: 14px; max-width: 760px; }
  .cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 52px; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
  .card { display: flex; flex-direction: column; padding: 30px 28px; min-height: 290px; text-decoration: none; border-left: 1px solid var(--line); transition: background 200ms, color 200ms; }
  .card:first-child { border-left: 0; }
  h3 { font-size: 20px; line-height: 1.25; font-weight: 800; }
  .card p { margin-top: 12px; font-size: 15px; line-height: 23px; color: var(--muted); transition: color 200ms; }
  .link { margin-top: auto; padding-top: 22px; font-size: 14px; font-weight: 800; }
  .card:hover { background: var(--ink); color: white; }
  .card:hover p { color: rgb(255 255 255 / 72%); }
  @media (max-width: 1099px) {
    .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .card:nth-child(odd) { border-left: 0; }
    .card:nth-child(n + 3) { border-top: 1px solid var(--line); }
  }
  @media (max-width: 720px) {
    .situations { padding-block: 68px; }
    .cards { grid-template-columns: 1fr; }
    .card, .card:nth-child(odd) { min-height: 0; border-left: 0; border-top: 1px solid var(--line); }
    .card:first-child { border-top: 0; }
  }
</style>
