<script lang="ts">
  import { onMount } from 'svelte';
  import { asset } from '$app/paths';
  import type { Content, Locale } from '#lib/content/index.ts';
  import { site } from '#lib/config/site.ts';
  import { glassHighlight } from '#lib/glass.ts';
  import LanguageSwitch from './LanguageSwitch.svelte';

  let { content, locale }: { content: Content; locale: Locale } = $props();

  let dockVisible = $state(false);

  onMount(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const isPast = () => hero.getBoundingClientRect().bottom <= 0;
    dockVisible = isPast();

    if (typeof IntersectionObserver === 'undefined') {
      const update = () => (dockVisible = isPast());
      addEventListener('scroll', update, { passive: true });
      addEventListener('resize', update);
      return () => {
        removeEventListener('scroll', update);
        removeEventListener('resize', update);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => (dockVisible = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0)
    );
    observer.observe(hero);
    return () => observer.disconnect();
  });
</script>

<a class="skip-link" href="#main">{content.navigation.skip}</a>
<img class="mirror-arm" src={asset('icons/mirror-arm.svg')} alt="" aria-hidden="true" />
<header class="site-header glass glass-dark" use:glassHighlight>
  <a class="wordmark" href="#top" aria-label={content.navigation.home}>{site.brand.toUpperCase()}</a>
  <nav aria-label={content.navigation.home}>
    <a href="#service">{content.navigation.service}</a>
    <a class="full-menu" href="#process">{content.navigation.process}</a>
    <a class="full-menu" href="#faq">{content.navigation.faq}</a>
    <a href="#quote">{content.navigation.contact}</a>
  </nav>
  <LanguageSwitch {locale} label={content.navigation.language} />
</header>

<aside
  class="contact-dock glass glass-dark"
  class:dock-visible={dockVisible}
  aria-label={content.navigation.contact}
  aria-hidden={!dockVisible}
  inert={!dockVisible}
>
  <a class="button button-white" href={site.phoneHref}>{content.navigation.call}</a>
  <a class="button button-clear" href="#quote">{content.navigation.contact}</a>
</aside>

<style>
  .mirror-arm { position: fixed; z-index: 19; top: 0; left: 50%; width: 68px; height: 36px; transform: translateX(-50%); pointer-events: none; }
  .site-header { position: fixed; z-index: 20; top: 26px; left: 50%; transform: translateX(-50%); width: min(calc(100% - 112px), 1488px); min-height: 76px; border-radius: 22px; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; color: white; --glass-border: rgb(255 255 255 / 58%); }
  .wordmark { font-size: 26px; letter-spacing: 3px; font-weight: 700; text-decoration: none; line-height: 1.5; }
  nav { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; gap: 32px; white-space: nowrap; }
  nav a { font-size: 14px; font-weight: 500; padding-block: 12px; text-decoration: none; text-underline-offset: 5px; }
  nav a:hover { text-decoration: underline; }
  .contact-dock { display: none; }
  @media (max-width: 1099px) {
    .site-header { width: calc(100% - 48px); }
    .full-menu { display: none; }
    .contact-dock { position: fixed; z-index: 20; --dock-bottom: max(16px, env(safe-area-inset-bottom)); bottom: var(--dock-bottom); left: 50%; transform: translate(-50%, calc(100% + var(--dock-bottom))); display: flex; gap: 10px; padding: 10px; border-radius: 22px; width: min(calc(100% - 32px), 480px); color: white; opacity: 0; visibility: hidden; pointer-events: none; }
    .contact-dock.dock-visible { transform: translate(-50%, 0); opacity: 1; visibility: visible; pointer-events: auto; }
    .contact-dock .button { flex: 1; min-width: 0; padding-inline: 12px; min-height: 48px; font-size: 14px; }
  }
  @media (max-width: 1099px) and (prefers-reduced-motion: no-preference) {
    .contact-dock { transition: transform 240ms ease-out, opacity 240ms ease-out, visibility 0s linear 240ms; }
    .contact-dock.dock-visible { transition: transform 240ms ease-out, opacity 240ms ease-out; }
  }
  @media (max-width: 599px) {
    .mirror-arm { width: 50px; height: 28px; }
    .site-header { top: 18px; width: calc(100% - 32px); min-height: 66px; padding: 10px 16px; }
    .wordmark { font-size: 22px; }
    nav { display: none; }
  }
</style>
