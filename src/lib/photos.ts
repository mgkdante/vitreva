/**
 * The site's four photos. Each one shows the photo chosen in the editor when there is one, and the
 * site's own otherwise. scripts/make-photos.ts writes src/lib/generated/photos.json during the build;
 * without that file, as in a fresh copy, the site's own photos are used.
 */
export type PhotoSlot = 'van' | 'installation' | 'aftercare' | 'quote';

export interface PhotoFiles {
  files: string[];
  widths: number[];
  height: number;
}

// A file's name and its real width can differ: installation-1440.webp is 1422 px wide.
const ownPhotos: Record<PhotoSlot, PhotoFiles> = {
  van: { files: ['images/van-768.webp', 'images/van-960.webp', 'images/van-1672.webp'], widths: [768, 960, 1672], height: 940 },
  installation: { files: ['images/installation-768.webp', 'images/installation-960.webp', 'images/installation-1440.webp'], widths: [768, 960, 1422], height: 1106 },
  aftercare: { files: ['images/aftercare-768.webp', 'images/aftercare-960.webp', 'images/aftercare-1440.webp'], widths: [768, 960, 1440], height: 960 },
  quote: { files: ['images/bokeh-768.webp', 'images/bokeh-960.webp', 'images/bokeh-1200.webp'], widths: [768, 960, 1200], height: 672 }
};

const generated = import.meta.glob<Partial<Record<PhotoSlot, PhotoFiles>>>('./generated/photos.json', { eager: true, import: 'default' });
const chosen = Object.values(generated)[0] ?? {};

export const photoFiles = (slot: PhotoSlot): PhotoFiles => chosen[slot] ?? ownPhotos[slot];
