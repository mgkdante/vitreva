<script lang="ts">
  import { asset } from '$app/paths';

  let { image, alt = '', class: className = '', sizes = '100vw', priority = false }: {
    image: string;
    alt?: string;
    class?: string;
    sizes?: string;
    priority?: boolean;
  } = $props();

  const sources = {
    van: [asset('images/van-768.webp'), asset('images/van-960.webp'), asset('images/van-1440.webp')],
    installation: [asset('images/installation-768.webp'), asset('images/installation-960.webp'), asset('images/installation-1440.webp')],
    aftercare: [asset('images/aftercare-768.webp'), asset('images/aftercare-960.webp'), asset('images/aftercare-1440.webp')]
  };
  let source = $derived(sources[image as keyof typeof sources]);
</script>

<img
  class={className}
  src={source[2]}
  srcset={`${source[0]} 768w, ${source[1]} 960w, ${source[2]} ${image === 'installation' ? 1422 : 1440}w`}
  {sizes}
  {alt}
  width={image === 'installation' ? 1422 : 1440}
  height={image === 'van' ? 810 : image === 'installation' ? 1106 : 960}
  loading={priority ? 'eager' : 'lazy'}
  fetchpriority={priority ? 'high' : 'auto'}
  decoding="async"
/>
