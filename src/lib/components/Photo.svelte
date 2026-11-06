<script lang="ts">
  import { asset } from '$app/paths';

  let { image, alt = '', class: className = '', sizes = '100vw', priority = false }: {
    image: string;
    alt?: string;
    class?: string;
    sizes?: string;
    priority?: boolean;
  } = $props();

  // The largest file's name and its real width can differ: installation-1440.webp is 1422 px wide.
  const sources = {
    van: { urls: [asset('images/van-768.webp'), asset('images/van-960.webp'), asset('images/van-1672.webp')], largestWidth: 1672, height: 940 },
    installation: { urls: [asset('images/installation-768.webp'), asset('images/installation-960.webp'), asset('images/installation-1440.webp')], largestWidth: 1422, height: 1106 },
    bokeh: { urls: [asset('images/bokeh-768.webp'), asset('images/bokeh-960.webp'), asset('images/bokeh-1200.webp')], largestWidth: 1200, height: 672 },
    aftercare: { urls: [asset('images/aftercare-768.webp'), asset('images/aftercare-960.webp'), asset('images/aftercare-1440.webp')], largestWidth: 1440, height: 960 }
  };
  let source = $derived(sources[image as keyof typeof sources]);
  let urls = $derived(source.urls);
</script>

<img
  class={className}
  src={urls[2]}
  srcset={`${urls[0]} 768w, ${urls[1]} 960w, ${urls[2]} ${source.largestWidth}w`}
  {sizes}
  {alt}
  width={source.largestWidth}
  height={source.height}
  loading={priority ? 'eager' : 'lazy'}
  fetchpriority={priority ? 'high' : 'auto'}
  decoding="async"
/>
