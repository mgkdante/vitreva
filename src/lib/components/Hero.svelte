<script lang="ts">
  import { onMount } from 'svelte';
  import { navigating } from '$app/state';
  import type { Content } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import Photo from './Photo.svelte';
  import crackArt from '../art/crack.svg?raw';
  import dashArt from '../art/dash.svg?raw';
  import mirrorArt from '../art/mirror.svg?raw';

  let { content }: { content: Content } = $props();

  // Runs before first paint, so the pinned height exists from the start and browsers can restore
  // a scroll position or an #anchor natively. Without JavaScript the hero is a complete static page.
  const motionClass = 'hero-motion';
  const motionQuery = '(prefers-reduced-motion: no-preference)';
  const earlyScript = `<script>if(matchMedia('${motionQuery}').matches)document.documentElement.classList.add('${motionClass}')</` + 'script>';

  onMount(() => {
    const root = document.documentElement;
    const arrivedByLink = navigating.type !== null;
    let cancelled = false;
    let cleanup = () => {};

    const showStaticHero = () => root.classList.remove(motionClass);

    // On client navigation the early script does not run, and the page must be tall before scrolling to an #anchor.
    if (matchMedia(motionQuery).matches) root.classList.add(motionClass);

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        cleanup = () => media.revert();

        media.add(motionQuery, () => {
          root.classList.add(motionClass);
          ScrollTrigger.refresh();
          // The refresh restores the scroll position it measured from, which can undo a link's jump to an #anchor.
          if (arrivedByLink && location.hash) {
            document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
          }

          const cockpit = document.getElementById('cockpit');
          const pieces = gsap.utils.toArray<SVGPathElement>('.crack .shadow, .crack .leg, .crack .fork, .crack .core');
          const chip = document.querySelector<SVGGElement>('.crack .impact');

          // One state for the crack: the intro drawing it and the scroll clearing it can never disagree.
          const crack = { hiddenByIntro: 1, chipSize: 0, cleared: 0, chipCleared: 0 };
          const renderCrack = () => {
            const offset = 1000 * Math.max(crack.hiddenByIntro, crack.cleared);
            for (const piece of pieces) piece.style.strokeDashoffset = String(offset);
            if (chip) chip.style.transform = `scale(${crack.chipSize * (1 - crack.chipCleared)})`;
          };

          gsap.to(crack, { hiddenByIntro: 0, duration: 1.2, ease: 'power3.out', delay: 0.35, onUpdate: renderCrack });
          gsap.to(crack, { chipSize: 1, duration: 0.25, delay: 0.3, ease: 'back.out(3)', onUpdate: renderCrack });

          gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '#hero-pin',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.3,
              // Links that have started leaving the screen must also leave the keyboard order.
              onUpdate: ({ progress }) => { if (cockpit) cockpit.inert = progress > 0.66; }
            }
          })
            .to('.cue', { autoAlpha: 0, duration: 0.05 }, 0)
            .to(crack, { cleared: 1, duration: 0.23, onUpdate: renderCrack }, 0.03)
            .to(crack, { chipCleared: 1, duration: 0.04, ease: 'power1.in', onUpdate: renderCrack }, 0.26)
            .to('.haze', { opacity: 0, duration: 0.26 }, 0.06)
            .to('#telltale', { opacity: 0, duration: 0.04 }, 0.28)
            .to('.status .before', { autoAlpha: 0, duration: 0.05 }, 0.26)
            .fromTo('.status .after', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.3)
            .to('#cockpit', { yPercent: 112, ease: 'power2.in', duration: 0.3 }, 0.62)
            .set('#cockpit', { autoAlpha: 0 }, 0.93)
            .fromTo('.hero-photo', { scale: 1.1 }, { scale: 1, duration: 0.92 }, 0);

          return () => {
            if (cockpit) cockpit.inert = false;
            showStaticHero();
          };
        });
      })
      .catch(() => {
        // The animation is an enhancement: if its code fails, the static hero remains complete.
        cleanup();
        showStaticHero();
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  });
</script>

<svelte:head>{@html earlyScript}</svelte:head>

<div class="hero-pin" id="hero-pin">
  <section class="hero" aria-labelledby="hero-title">
    <Photo image="van" alt={content.images.van} class="hero-photo" priority sizes="(max-width: 599px) 1500px, 100vw" />
    <div class="scrim"></div>
    <div class="haze"></div>
    {@html crackArt}

    <div class="hero-copy">
      <p class="status" aria-hidden="true"><span class="before">{content.hero.status.before}</span><span class="after">{content.hero.status.after}</span></p>
      <h1 id="hero-title">{#each content.hero.lines as line}<span>{line}</span>{/each}</h1>
      <p class="hero-sub">{content.hero.subtitle}</p>
    </div>

    <div class="cockpit" id="cockpit">
      <a class="mirror mirror-left" href={site.phoneHref}>
        {@html mirrorArt}
        <span class="mirror-text"><span class="mirror-label">{content.navigation.call}</span><span class="mirror-sub">{site.phoneDisplay}</span></span>
      </a>
      <a class="mirror mirror-right" href="#quote">
        <svg viewBox="0 0 240 210" aria-hidden="true"><use href="#m-art" /></svg>
        <span class="mirror-text"><span class="mirror-label">{content.hero.freeQuote}</span><span class="mirror-sub">{content.hero.mirrorNote}</span></span>
      </a>
      <div class="dash-stage">
        <div class="dash-art" aria-hidden="true">{@html dashArt}</div>
        <a class="radio" href={site.smsHref}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="9" cy="11" r="1.6" /><path d="M21 16l-5-4.5L7 19" /></svg>
          <span><small>{content.hero.radio.label}</small><b>{content.hero.radio.text}</b></span>
        </a>
      </div>
      <div class="cue" aria-hidden="true">{content.hero.cue}</div>
    </div>
  </section>
</div>

<style>
  .hero-pin { position: relative; background: var(--ink); }
  :global(html.hero-motion) .hero-pin { height: 170svh; }
  .hero { position: relative; height: 100vh; height: 100svh; min-height: 340px; overflow: hidden; color: white; }
  :global(html.hero-motion) .hero { position: sticky; top: 0; }
  .hero :global(.hero-photo) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 60% center; transform-origin: 66% 58%; }
  .scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(0 0 0 / 76%), rgb(0 0 0 / 34%) 42%, transparent 66%); }
  .haze { position: absolute; inset: 0; display: none; background: linear-gradient(180deg, rgb(8 11 13 / 52%), rgb(30 34 36 / 32%) 55%, rgb(8 11 13 / 58%)), radial-gradient(70% 60% at 62% 34%, rgb(214 222 226 / 13%), transparent 72%); }
  :global(html.hero-motion) .haze { display: block; }

  .hero :global(.crack) { position: absolute; inset: 0; display: none; width: 100%; height: 100%; }
  :global(html.hero-motion) .hero :global(.crack) { display: block; }
  .hero :global(.crack path) { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-dashoffset: 1000; }
  .hero :global(.crack .fork) { stroke-opacity: .62; }
  .hero :global(.crack .shadow) { stroke: rgb(0 0 0 / 34%); transform: translate(.9px, 1.1px); }
  .hero :global(.crack .impact) { transform: scale(0); transform-box: fill-box; transform-origin: center; }
  .hero :global(.crack .impact path) { stroke-dashoffset: 0; fill: rgb(255 255 255 / 58%); stroke: rgb(255 255 255 / 85%); stroke-width: .5; }

  .hero-copy { position: absolute; z-index: 6; top: clamp(120px, max(15svh, 8.5vw), 400px); left: max(var(--gutter), 5vw); width: fit-content; max-width: 56vw; }
  .status { position: relative; display: block; height: 1.7em; font-size: clamp(13px, .9vw, 30px); line-height: 1.7; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; visibility: hidden; }
  :global(html.hero-motion) .status { visibility: visible; }
  .status span { position: absolute; left: 0; top: 0; white-space: nowrap; }
  .status .after { opacity: 0; }
  h1 { margin-top: .18em; font-size: clamp(34px, min(5.4vw, 8svh), 210px); line-height: 1.04; font-weight: 800; letter-spacing: -.028em; }
  h1 span { display: block; }
  .hero-sub { margin-top: .85em; font-size: clamp(16px, 1.35vw, 46px); line-height: 1.45; font-weight: 500; max-width: 36em; }

  /* One container, so the dashboard, mirrors and radio always leave together. */
  .cockpit { position: absolute; z-index: 5; inset: 0; pointer-events: none; will-change: transform; --dash-h: clamp(220px, 40svh, 400px); --w: max(100vw, calc(var(--dash-h) * 4)); --drop: min(0px, calc(42svh - var(--w) / 4)); }
  .dash-stage { position: absolute; z-index: 2; left: 50%; bottom: var(--drop); width: var(--w); height: calc(var(--w) / 4); transform: translateX(-50%); container-type: inline-size; }
  .dash-art, .dash-art :global(svg) { display: block; width: 100%; height: 100%; overflow: visible; }
  .radio { position: absolute; left: 39.0625%; top: 15.5%; width: 21.875%; height: 37.5%; display: flex; align-items: center; justify-content: center; gap: .9cqw; padding: 0 1.2cqw; border-radius: 8px; color: white; text-decoration: none; pointer-events: auto; transition: background 180ms; }
  .radio:hover { background: rgb(255 255 255 / 9%); }
  .radio svg { flex: none; width: clamp(20px, 2.3cqw, 90px); height: auto; }
  .radio small { display: block; font-size: clamp(10px, .72cqw, 34px); line-height: 1.3; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; opacity: .68; }
  .radio b { display: block; margin-top: 2px; font-size: clamp(13px, 1.1cqw, 50px); line-height: 1.22; font-weight: 700; }

  .mirror { position: absolute; z-index: 1; bottom: calc(var(--w) / 4 * .79 + var(--drop)); width: clamp(150px, calc(var(--w) * .125), 26svh); container-type: inline-size; color: var(--ink); text-decoration: none; pointer-events: auto; transition: transform 220ms ease, filter 220ms ease; }
  .mirror > :global(svg) { display: block; width: 100%; height: auto; overflow: visible; }
  .mirror-left { left: clamp(8px, 1.2vw, 26px); }
  .mirror-right { right: clamp(8px, 1.2vw, 26px); }
  .mirror-right > svg { transform: scaleX(-1); }
  .mirror:hover { transform: translateY(-3px); filter: brightness(1.06); }
  .mirror-text { position: absolute; inset: 0 0 18% 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-inline: 12%; text-align: center; }
  .mirror-label { font-size: clamp(14px, 10.5cqw, 60px); line-height: 1.1; font-weight: 800; letter-spacing: -.01em; }
  .mirror-sub { margin-top: .2em; font-size: clamp(9.5px, 5.4cqw, 30px); line-height: 1.2; font-weight: 700; color: #2f363b; }

  .cue { position: absolute; z-index: 3; left: 50%; bottom: calc(var(--w) / 4 * .86 + var(--drop) + 18px); transform: translateX(-50%); display: none; font-size: clamp(11px, .72vw, 24px); font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: white; white-space: nowrap; padding: .55em 1.05em; border-radius: 999px; background: rgb(0 0 0 / 56%); }
  :global(html.hero-motion) .cue { display: block; }

  @media (max-width: 1099px) {
    .hero :global(.crack) { left: -30%; width: 130%; }
    .hero-copy { max-width: 72vw; }
  }
  @media (max-width: 720px) {
    .hero :global(.crack) { left: -85%; top: 15%; width: 170%; -webkit-mask-image: linear-gradient(transparent 16%, #000 26%); mask-image: linear-gradient(transparent 16%, #000 26%); }
    .hero :global(.hero-photo) { object-position: 70% center; }
    .scrim { background: linear-gradient(180deg, rgb(0 0 0 / 74%) 8%, rgb(0 0 0 / 38%) 44%, transparent 62%); }
    .hero-copy { top: 122px; left: var(--gutter); right: var(--gutter); width: auto; max-width: none; }
    .status { font-size: 11.5px; }
    h1 { margin-top: 8px; font-size: clamp(32px, 10vw, 44px); }
    .hero-sub { margin-top: 10px; font-size: 16px; }
    .cockpit { --dash-h: 280px; }
    .mirror { width: min(43vw, 168px); }
    .mirror-left { left: 6px; }
    .mirror-right { right: 6px; }
    .cue { bottom: calc(var(--w) / 4 * .79 + 150px); font-size: 11px; }
  }
  @media (max-height: 700px) and (min-width: 721px) {
    .hero-copy { top: 112px; }
    h1 { margin-top: 4px; font-size: clamp(34px, 3.5vw, 48px); }
    .hero-sub { margin-top: 10px; font-size: 16px; }
  }
  @media (max-height: 700px) { :global(html.hero-motion) .cue { display: none; } }
  @media (max-height: 480px) {
    .hero-copy { top: 96px; left: 140px; max-width: 52vw; }
    h1 { margin-top: 2px; font-size: 28px; }
    .status { font-size: 11px; }
    .hero-sub, .mirror-sub { display: none; }
    .mirror { width: 118px; }
    .radio b { font-size: 12px; }
    .radio small { display: none; }
  }
</style>
