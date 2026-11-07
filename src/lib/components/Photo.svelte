<script lang="ts">
  import { asset } from '$app/paths';
  import { photoFiles, type PhotoSlot } from '#lib/photos.ts';

  let { image, alt = '', class: className = '', sizes = '100vw', priority = false }: {
    image: PhotoSlot;
    alt?: string;
    class?: string;
    sizes?: string;
    priority?: boolean;
  } = $props();

  let source = $derived(photoFiles(image));
  // A chosen photo's files are made during the build, so they are not among the paths known to `asset`.
  let urls = $derived(source.files.map((file) => asset(file as Parameters<typeof asset>[0])));
  let largest = $derived(source.widths[source.widths.length - 1]);
</script>

<img
  class={className}
  src={urls[urls.length - 1]}
  srcset={urls.map((url, index) => `${url} ${source.widths[index]}w`).join(', ')}
  {sizes}
  {alt}
  width={largest}
  height={source.height}
  loading={priority ? 'eager' : 'lazy'}
  fetchpriority={priority ? 'high' : 'auto'}
  decoding="async"
/>
