<script lang="ts">
  import type { Content } from '#lib/content/index.ts';
  import { reveal } from '#lib/reveal.ts';

  let { content }: { content: Content['panel'] } = $props();
</script>

<section class="panel" aria-label={content.label} use:reveal>
  <div class="container panel-grid">
    {#each content.items as item}
      <div class="gauge">
        <svg viewBox="0 0 104 60" aria-hidden="true">
          <path class="track" d="M6 54a46 46 0 0 1 92 0" />
          <path class="level" pathLength="1" d="M6 54a46 46 0 0 1 92 0" style={`--level: ${item.level}`} />
        </svg>
        <p class="value">{item.value}</p>
        <h2>{item.title}</h2>
        <p class="note">{item.body}</p>
      </div>
    {/each}
  </div>
</section>

<style>
  .panel { background: var(--ink); color: white; padding-block: 72px 76px; }
  .panel-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .gauge { padding: 8px 32px; border-left: 1px solid var(--line-dark); }
  .gauge:first-child { border-left: 0; padding-left: 0; }
  svg { display: block; width: 104px; height: 60px; }
  .track, .level { fill: none; stroke-width: 5; stroke-linecap: round; }
  .track { stroke: rgb(255 255 255 / 16%); }
  .level { stroke: white; stroke-dasharray: var(--level) 1; }
  :global(html.hero-motion) .panel:not(:global(.revealed)) .level { stroke-dasharray: 0 1; }
  .value { margin-top: 14px; font-size: clamp(32px, 3.2vw, 48px); line-height: 1.05; font-weight: 800; letter-spacing: -.025em; font-variant-numeric: tabular-nums; }
  h2 { margin-top: 10px; font-size: 15px; line-height: 22px; font-weight: 700; letter-spacing: 0; }
  .note { margin-top: 4px; font-size: 14px; line-height: 21px; color: rgb(255 255 255 / 70%); }
  @media (prefers-reduced-motion: no-preference) {
    .level { transition: stroke-dasharray 1200ms cubic-bezier(.2, .7, .2, 1); }
  }
  @media (max-width: 1099px) {
    .panel-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .gauge:nth-child(odd) { border-left: 0; padding-left: 0; }
    .gauge:nth-child(n + 3) { margin-top: 44px; }
  }
  @media (max-width: 720px) {
    .panel { padding-block: 52px; }
    .gauge { padding-inline: 16px; }
  }
</style>
