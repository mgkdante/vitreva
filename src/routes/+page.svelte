<script lang="ts">
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';

  const french = `${resolve('/[lang=lang]', { lang: 'fr' })}/`;
  const english = `${resolve('/[lang=lang]', { lang: 'en' })}/`;

  onMount(() => window.location.replace(french));
</script>

<svelte:head>
  <title>Vitreva</title>
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<main class="language-entry">
  <h1>Vitreva</h1>
  <p><a href={french} lang="fr">Continuer en français</a></p>
  <p><a href={english} lang="en">Continue in English</a></p>
</main>
