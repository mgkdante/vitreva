// Turns the photos chosen in the editor into the sizes the site serves. `bun run build` runs this first.
// sharp keeps no metadata unless told to, so location data from a phone never reaches a published copy.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { photosContract } from '../src/lib/content/contract.ts';
import type { PhotoFiles, PhotoSlot } from '../src/lib/photos.ts';

// The same sizes and quality as the site's own photos, in scripts/prepare-images.mjs.
const slots: Record<PhotoSlot, { widths: number[]; quality: number; blur?: number }> = {
  van: { widths: [768, 960, 1672], quality: 85 },
  installation: { widths: [768, 960, 1440], quality: 85 },
  aftercare: { widths: [768, 960, 1440], quality: 85 },
  quote: { widths: [768, 960, 1200], quality: 72, blur: 6 }
};

const UPLOAD = /^\/images\/uploads\/([^/\\]+)$/;

function uploadedFile(root: string, slot: PhotoSlot, value: string) {
  const name = UPLOAD.exec(value)?.[1];
  if (!name || name.startsWith('.')) throw new Error(`The ${slot} photo must be in the upload folder, not "${value}"`);
  const file = path.join(root, 'static/images/uploads', name);
  if (!existsSync(file)) throw new Error(`The ${slot} photo "${value}" is not in the upload folder`);
  return file;
}

async function makeSizes(root: string, slot: PhotoSlot, input: string): Promise<PhotoFiles> {
  const { widths, quality, blur } = slots[slot];
  const { autoOrient } = await sharp(input).metadata();
  const sizes = [...new Set(widths.map((width) => Math.min(width, autoOrient.width)))];
  const made = await Promise.all(sizes.map(async (width) => {
    const file = `images/photos/${slot}-${width}.webp`;
    const resized = sharp(input).autoOrient().resize({ width });
    const info = await (blur ? resized.blur(blur) : resized).webp({ quality }).toFile(path.join(root, 'static', file));
    return { file, height: info.height };
  }));
  return { files: made.map(({ file }) => file), widths: sizes, height: made[made.length - 1].height };
}

/** Starts from an empty folder each time, so a removed photo leaves nothing behind. Returns what was made. */
export async function makePhotos(root: string): Promise<Partial<Record<PhotoSlot, PhotoFiles>>> {
  const chosen = photosContract.parse(JSON.parse(readFileSync(path.join(root, 'src/lib/content/photos.fr.json'), 'utf8')));
  rmSync(path.join(root, 'static/images/photos'), { recursive: true, force: true });
  mkdirSync(path.join(root, 'static/images/photos'), { recursive: true });
  const entries = (Object.keys(slots) as PhotoSlot[]).filter((slot) => chosen[slot]);
  const made = await Promise.all(entries.map(async (slot) => [slot, await makeSizes(root, slot, uploadedFile(root, slot, chosen[slot]))] as const));
  return Object.fromEntries(made);
}

if (import.meta.main) {
  const root = path.resolve(import.meta.dir, '..');
  const manifest = await makePhotos(root);
  mkdirSync(path.join(root, 'src/lib/generated'), { recursive: true });
  writeFileSync(path.join(root, 'src/lib/generated/photos.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}
