import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'bun:test';
import sharp from 'sharp';
import { cmsConfig, contentGroups } from '../src/lib/content/cms.ts';
import { photosContract } from '../src/lib/content/contract.ts';
import { locales } from '../src/lib/content/locales.ts';
import { makePhotos } from '../scripts/make-photos.ts';

// Otherwise sharp keeps files open, and Windows then refuses to delete the test folders.
sharp.cache(false);

const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const none = { van: '', installation: '', aftercare: '', quote: '' };
const folders: string[] = [];

/** A throwaway copy of the folders the build reads, with the given choices saved. */
function site(chosen: Partial<typeof none> = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'vitreva-photos-'));
  folders.push(root);
  mkdirSync(path.join(root, 'src/lib/content'), { recursive: true });
  mkdirSync(path.join(root, 'static/images/uploads'), { recursive: true });
  writeFileSync(path.join(root, 'src/lib/content/photos.fr.json'), JSON.stringify({ ...none, ...chosen }));
  return root;
}
const upload = (root: string, name: string, width: number, height: number) =>
  sharp({ create: { width, height, channels: 3, background: '#336699' } }).jpeg().toFile(path.join(root, 'static/images/uploads', name));
const made = (root: string) => readdirSync(path.join(root, 'static/images/photos')).sort();

afterEach(() => {
  for (const folder of folders.splice(0)) rmSync(folder, { recursive: true, force: true });
});

test('with no photo chosen, nothing is made and the site keeps its own photos', async () => {
  const root = site();
  assert.deepEqual(await makePhotos(root), {});
  assert.deepEqual(made(root), []);
  assert.equal(read('src/lib/content/photos.fr.json').includes('uploads'), false);
});

test('a chosen photo is made in the sizes its place needs, with its real size noted', async () => {
  const root = site({ van: '/images/uploads/camion.jpg' });
  await upload(root, 'camion.jpg', 2048, 1024);
  const { van } = await makePhotos(root);
  assert.deepEqual(van, {
    files: ['images/photos/van-768.webp', 'images/photos/van-960.webp', 'images/photos/van-1672.webp'],
    widths: [768, 960, 1672],
    height: 836
  });
  const largest = await sharp(path.join(root, 'static/images/photos/van-1672.webp')).metadata();
  assert.equal(largest.format, 'webp');
  assert.equal(largest.width, 1672);
});

test('a small photo is never enlarged', async () => {
  const root = site({ installation: '/images/uploads/petite.jpg' });
  await upload(root, 'petite.jpg', 700, 500);
  const { installation } = await makePhotos(root);
  assert.deepEqual(installation, { files: ['images/photos/installation-700.webp'], widths: [700], height: 500 });
});

test('location data does not reach the published copies, and a sideways phone photo stands up', async () => {
  const root = site({ aftercare: '/images/uploads/telephone.jpg' });
  await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#336699' } })
    .withExif({ IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '45/1 28/1 0/1' } })
    .withMetadata({ orientation: 6 })
    .jpeg()
    .toFile(path.join(root, 'static/images/uploads/telephone.jpg'));
  const before = await sharp(path.join(root, 'static/images/uploads/telephone.jpg')).metadata();
  assert.ok(before.exif, 'the test photo should start with location data');

  const { aftercare } = await makePhotos(root);
  assert.deepEqual(aftercare?.widths, [768, 800]);
  assert.equal(aftercare?.height, 1200);
  for (const file of made(root)) assert.equal((await sharp(path.join(root, 'static/images/photos', file)).metadata()).exif, undefined, file);
});

test('the form background is softened, so the text over it stays readable', async () => {
  const root = site({ quote: '/images/uploads/fond.png' });
  const half = await sharp({ create: { width: 500, height: 800, channels: 3, background: '#000' } }).png().toBuffer();
  await sharp({ create: { width: 1000, height: 800, channels: 3, background: '#fff' } })
    .composite([{ input: half, left: 0, top: 0 }])
    .png()
    .toFile(path.join(root, 'static/images/uploads/fond.png'));
  await makePhotos(root);
  const { data, info } = await sharp(path.join(root, 'static/images/photos/quote-960.webp')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const edge = data[(info.height >> 1) * info.width * info.channels + (info.width >> 1) * info.channels];
  assert.ok(edge > 20 && edge < 235, `the edge should be blurred, got ${edge}`);
});

test('a photo that is gone stops the build and names it, so the live site stays as it is', async () => {
  await assert.rejects(makePhotos(site({ van: '/images/uploads/parti.jpg' })), /parti\.jpg/);
});

test('only the upload folder can be read', async () => {
  for (const van of ['/images/uploads/../../../secret.jpg', '/etc/passwd', 'images/uploads/a.jpg']) {
    await assert.rejects(makePhotos(site({ van })), /van/);
  }
});

test('a removed photo leaves nothing behind', async () => {
  const root = site({ van: '/images/uploads/camion.jpg' });
  await upload(root, 'camion.jpg', 1000, 500);
  await makePhotos(root);
  writeFileSync(path.join(root, 'src/lib/content/photos.fr.json'), JSON.stringify(none));
  assert.deepEqual(await makePhotos(root), {});
  assert.deepEqual(made(root), []);
});

test('every language has the same photos, and leaving them empty is allowed', () => {
  const fr = JSON.parse(read('src/lib/content/photos.fr.json'));
  for (const locale of locales) assert.deepEqual(photosContract.parse(JSON.parse(read(`src/lib/content/photos.${locale}.json`))), fr);
  assert.ok(photosContract.safeParse(none).success);
});

test('in the editor, each photo is one choice for every language and takes only photo formats', () => {
  const entry = contentGroups.flatMap((group) => cmsConfig().collections.find((item) => item.name === group.name)?.files ?? []).find((file) => file.name === 'photos');
  assert.ok(entry, 'no Photos entry in the editor');
  const fields = entry.fields as { name: string; widget: string; i18n: unknown; required?: boolean; accept?: string }[];
  assert.deepEqual(fields.map((field) => field.name), ['van', 'installation', 'aftercare', 'quote']);
  for (const field of fields) {
    assert.equal(field.widget, 'image');
    assert.equal(field.i18n, 'duplicate');
    assert.equal(field.required, false);
    assert.ok(field.accept?.includes('image/heic'), `${field.name} should take phone photos`);
  }
});

test('the build makes photos before the cards that use them, and publishes no original', () => {
  const { scripts } = JSON.parse(read('package.json'));
  assert.equal(scripts.build, 'bun run photos && bun run share-images && vite build && rm -rf build/images/uploads');
  const ignored = read('.gitignore').split('\n');
  assert.ok(ignored.includes('/static/images/photos/') && ignored.includes('/src/lib/generated/'));
  assert.ok(!existsSync(new URL('../static/images/photos/.gitkeep', import.meta.url)));
  assert.ok(read('src/lib/content/files.ts').includes("'!./photos.*.json'"), 'the names of uploads would reach the pages');
});
