<script lang="ts">
  import { onMount } from 'svelte';
  import type { Content, Locale } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import { getPages, servicePageKeys, companyPageKeys, type PageKey } from '#lib/content/pages.ts';
  import { localHref } from '#lib/links.ts';
  import LanguageSwitch from './LanguageSwitch.svelte';
  import rearviewArt from '../art/rearview.svg?raw';

  let { content, locale, pageKey, hasQuote = true }: { content: Content; locale: Locale; pageKey?: PageKey; hasQuote?: boolean } = $props();

  let pages = $derived(getPages(locale));
  // The quote form is on the home page and on service pages. Other sections live on the home page.
  let quoteHref = $derived(hasQuote ? '#quote' : `${localHref(locale)}#quote`);
  let homeAnchor = $derived((id: string) => pageKey ? `${localHref(locale)}#${id}` : `#${id}`);

  let dockVisible = $state(false);
  let menu = $state<HTMLDetailsElement>();

  function closeMenu() {
    if (menu) menu.open = false;
  }

  function onDocumentClick(event: MouseEvent) {
    if (menu?.open && !menu.contains(event.target as Node)) closeMenu();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !menu?.open) return;
    closeMenu();
    menu.querySelector('summary')?.focus();
  }

  onMount(() => {
    const hero = document.getElementById('hero-pin');

    let frame = 0;

    const update = () => {
      frame = 0;
      dockVisible = hero ? hero.getBoundingClientRect().bottom <= innerHeight * 0.9 : scrollY > 160;
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();

    addEventListener('scroll', scheduleUpdate, { passive: true });
    addEventListener('resize', scheduleUpdate);

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleUpdate);
    if (hero) observer?.observe(hero);

    return () => {
      removeEventListener('scroll', scheduleUpdate);
      removeEventListener('resize', scheduleUpdate);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  });
</script>

<svelte:document onclick={onDocumentClick} onkeydown={onKeydown} />

<a class="skip-link" href="#main">{content.navigation.skip}</a>

<div class="shade" role="note">
  <p><span class="wide-only">{content.banner.mobile}</span><span><strong>{content.banner.quote}</strong></span></p>
  <p><span>{content.banner.reply}</span><span class="wide-only">{content.banner.hours}</span></p>
</div>

<header class="rear">
  <div class="rear-art">{@html rearviewArt}</div>
  <div class="rear-bar">
    <a class="wordmark" href={pageKey ? localHref(locale) : '#top'} aria-label={content.navigation.home}>{site.brand.toUpperCase()}</a>
    <LanguageSwitch {locale} {pageKey} label={content.navigation.language} />
    <details class="menu" bind:this={menu}>
      <summary aria-label={content.navigation.menu}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></summary>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
      <nav class="menu-panel" aria-label={content.navigation.menu} onclick={closeMenu}>
        <a href={homeAnchor('process')}>{content.navigation.process}</a>
        {#each [...servicePageKeys, ...companyPageKeys] as key}<a href={localHref(locale, key)} aria-current={key === pageKey ? 'page' : undefined}>{pages[key].label}</a>{/each}
        <a href={homeAnchor('faq')}>{content.navigation.faq}</a>
        <a href={quoteHref}>{content.hero.freeQuote}</a>
        <a class="button button-white" href={site.phoneHref}>{site.phoneDisplay}</a>
      </nav>
    </details>
  </div>
</header>

<aside
  class="dock"
  class:visible={dockVisible}
  aria-label={content.navigation.contact}
  aria-hidden={!dockVisible}
  inert={!dockVisible}
>
  <a href={site.phoneHref}>{content.navigation.call}</a>
  <a href={site.smsHref}>{content.navigation.text}</a>
  <a href={quoteHref}>{content.hero.freeQuote}</a>
</aside>

<style>
  /* Marketing banner, styled as the tinted band across the top of a windshield. */
  .shade { position: fixed; z-index: 30; inset: 0 0 auto; height: calc(var(--strip) * 3.1); display: grid; grid-template-columns: 1fr 1fr; align-items: start; column-gap: clamp(40px, 3.4vw, 110px); padding: calc(var(--strip) * .24) 12px 0; color: white; font-size: clamp(12.5px, .8vw, 26px); line-height: 1.45; font-weight: 700; letter-spacing: .04em; white-space: nowrap; pointer-events: none; text-shadow: 0 1px 6px rgb(0 0 0 / 60%); background: linear-gradient(180deg, #000 0%, rgb(0 0 0 / 96%) 24%, rgb(0 0 0 / 82%) 38%, rgb(0 0 0 / 56%) 54%, rgb(0 0 0 / 30%) 69%, rgb(0 0 0 / 12%) 84%, rgb(0 0 0 / 0%) 100%); }
  .shade strong { font-weight: 800; }
  .shade p { display: flex; gap: 1.7em; min-width: 0; }
  .shade p:first-child { justify-content: flex-end; }
  .shade .wide-only + span::before, .shade span + .wide-only::before { content: '·'; margin-right: 1.7em; opacity: .55; }

  /* Rearview mirror: the site navigation. */
  .rear { position: fixed; z-index: 32; top: calc(var(--strip) - 6px); left: 50%; width: clamp(288px, 19vw, 720px); transform: translateX(-50%); color: var(--ink); }
  .rear-art { pointer-events: none; }
  .rear-art :global(svg) { display: block; width: 100%; height: auto; overflow: visible; }
  .rear-bar { position: absolute; left: 5%; right: 4%; top: 33%; bottom: 7%; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-left: 3%; }
  .wordmark { font-size: clamp(16px, 1.1vw, 38px); letter-spacing: 2.5px; font-weight: 800; text-decoration: none; line-height: 1.5; }
  .rear-bar :global(.language-switch) { gap: .55em; font-size: clamp(13px, .72vw, 24px); }
  .rear-bar :global(.language-switch span) { display: none; }
  .rear-bar :global(.language-switch a:not([aria-current])) { opacity: .66; }
  .menu { position: relative; }
  .menu summary { list-style: none; display: flex; align-items: center; justify-content: center; width: clamp(44px, 2.4vw, 84px); height: clamp(44px, 2.4vw, 84px); border-radius: 50%; cursor: pointer; transition: background 160ms; }
  .menu summary::-webkit-details-marker { display: none; }
  .menu summary svg { width: 46%; height: auto; }
  .menu summary:hover, .menu[open] summary { background: rgb(0 0 0 / 12%); }
  .menu-panel { position: absolute; top: calc(100% + 14px); right: -4px; width: max-content; padding: 6px; border-radius: 14px; display: grid; max-height: calc(100vh - 130px); max-height: calc(100dvh - 130px); overflow-y: auto; background: #121517; color: white; border: 1px solid rgb(255 255 255 / 16%); box-shadow: 0 14px 30px rgb(0 0 0 / 38%); }
  .menu-panel a { padding: .5em .8em; border-radius: 9px; font-size: clamp(14px, .8vw, 26px); line-height: 1.4; font-weight: 600; text-decoration: none; white-space: nowrap; }
  .menu-panel a:not(.button):hover, .menu-panel a[aria-current] { background: rgb(255 255 255 / 12%); }
  .menu-panel .button { min-height: 0; margin-top: 4px; font-weight: 800; }

  /* Contact buttons once the hero has scrolled away. */
  .dock { position: fixed; z-index: 28; left: 50%; bottom: 16px; width: 480px; display: flex; gap: 10px; transform: translate(-50%, 180%); visibility: hidden; pointer-events: none; }
  .dock.visible { transform: translate(-50%, 0); visibility: visible; pointer-events: auto; }
  .dock a { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 54px; padding-inline: 8px; color: white; font-size: 15px; font-weight: 800; text-align: center; text-decoration: none; background: linear-gradient(120deg, #22272b, #07090a 72%); border: 1px solid rgb(255 255 255 / 34%); box-shadow: 0 12px 26px rgb(0 0 0 / 40%); border-radius: 14px; }
  .dock a:first-child { flex: .7; border-radius: 26px 14px 14px 22px; }
  .dock a:nth-child(2) { flex: .7; }
  .dock a:last-child { border-radius: 14px 26px 22px 14px; background: white; color: var(--ink); }
  @media (prefers-reduced-motion: no-preference) {
    .dock { transition: transform 260ms ease-out, visibility 0s linear 260ms; }
    .dock.visible { transition: transform 260ms ease-out; }
  }

  @media (max-width: 1040px) {
    .shade .wide-only { display: none; }
    .shade .wide-only + span::before, .shade span + .wide-only::before { content: none; }
  }
  @media (max-width: 1099px) {
    .dock { left: 12px; right: 12px; width: auto; bottom: max(12px, env(safe-area-inset-bottom)); transform: translateY(180%); }
    .dock.visible { transform: translateY(0); }
  }
  @media (max-width: 720px) {
    .shade { font-size: 11.5px; column-gap: 34px; padding-inline: 6px; }
    .rear { width: 288px; top: calc(var(--strip) - 4px); }
  }
  @media (max-height: 480px) {
    .rear { width: 250px; top: calc(var(--strip) - 8px); }
  }
</style>
