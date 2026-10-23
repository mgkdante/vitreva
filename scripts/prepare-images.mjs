import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'static', 'images');
const sources = {
  van: 'ford-transit-connect-2010-color-concept.png',
  installation: 'outdoor-installation-color-concept.png',
  aftercare: 'outdoor-final-check-color-concept.png',
};

await mkdir(output, { recursive: true });
for (const [name, file] of Object.entries(sources)) {
  const input = path.join(root, 'assets', 'source', file);
  for (const width of [768, 960, 1440]) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(output, `${name}-${width}.webp`));
  }
}

await sharp(path.join(root, 'assets', 'source', sources.van))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85 })
  .toFile(path.join(output, 'social.jpg'));
