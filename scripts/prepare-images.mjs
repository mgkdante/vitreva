import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'static', 'images');
const source = (file) => path.join(root, 'assets', 'source', file);

// Public images never show the maker's badge: a neighbouring stretch of the same grille is copied over it.
async function vanWithoutBadge() {
  const file = source('ford-transit-connect-2010-color-concept.png');
  const badge = { left: 1412, top: 553, width: 66, height: 36 };
  const patch = await sharp(file)
    .extract({ left: badge.left - 74, top: badge.top, width: badge.width, height: badge.height })
    .png()
    .toBuffer();
  const feather = await sharp(Buffer.from(`<svg width="${badge.width}" height="${badge.height}"><defs><filter id="f"><feGaussianBlur stdDeviation="3"/></filter></defs><rect x="5" y="4" width="${badge.width - 10}" height="${badge.height - 8}" rx="8" fill="#fff" filter="url(#f)"/></svg>`))
    .png()
    .toBuffer();
  const softPatch = await sharp(patch).ensureAlpha().composite([{ input: feather, blend: 'dest-in' }]).png().toBuffer();
  return sharp(file).composite([{ input: softPatch, left: badge.left, top: badge.top }]).png().toBuffer();
}

const van = await vanWithoutBadge();
const images = [
  { name: 'van', input: van, widths: [768, 960, 1672] },
  { name: 'installation', input: source('outdoor-installation-color-concept.png'), widths: [768, 960, 1440] },
  { name: 'aftercare', input: source('outdoor-final-check-color-concept.png'), widths: [768, 960, 1440] }
];

await mkdir(output, { recursive: true });
for (const { name, input, widths } of images) {
  for (const width of widths) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(output, `${name}-${width}.webp`));
  }
}

// Soft background for the quote form, cropped from the same scene so no vehicle shows.
for (const width of [768, 960, 1200]) {
  await sharp(van)
    .extract({ left: 0, top: 380, width: 1000, height: 560 })
    .resize({ width })
    .blur(6)
    .webp({ quality: 72 })
    .toFile(path.join(output, `bokeh-${width}.webp`));
}

for (const size of [32, 96, 180]) {
  const name = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`;
  await sharp(path.join(root, 'static', 'favicon.svg')).resize(size, size).png().toFile(path.join(root, 'static', name));
}
