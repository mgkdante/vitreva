// Generates src/lib/art/crack.svg: a seeded windshield crack with an irregular chip, uneven fractures and distance falloff.
// Run with `bun scripts/generate-crack.mjs` after changing the plan below. The seed keeps the output stable.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const output = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'lib', 'art', 'crack.svg');
const impact = { x: 1076, y: 276 };

let seed = 20261106;
const random = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const between = (min, max) => min + random() * (max - min);

// Glass fractures run in long, nearly straight arcs with an occasional sudden kink.
function fracture(startX, startY, angle, length) {
  const step = 16;
  const points = [[startX, startY]];
  const drift = between(-0.012, 0.012);
  let heading = angle;
  let x = startX;
  let y = startY;
  for (let travelled = 0; travelled < length; travelled += step) {
    heading += drift + between(-0.022, 0.022);
    if (random() < 0.07) heading += between(0.16, 0.42) * (random() > 0.5 ? 1 : -1);
    x += Math.cos(heading) * step;
    y += Math.sin(heading) * step;
    points.push([x, y]);
  }
  return points;
}

const toPath = (points) => `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`;

// Each entry is [angle in radians, length]. Long fractures run right and down, away from the headline.
const plan = [
  [-0.42, 760], [0.46, 620], [1.28, 560], [-1.42, 300], [2.5, 210], [-2.3, 130],
  [3.05, 96], [0.95, 170], [-0.95, 120], [1.92, 74], [-1.92, 54], [0.08, 88]
];

const hairlines = [];
const cores = [];
const forks = [];
const shadows = [];
for (const [angle, length] of plan) {
  const start = [impact.x + between(-3.5, 3.5), impact.y + between(-3, 3)];
  const points = fracture(start[0], start[1], angle + between(-0.06, 0.06), length * between(0.92, 1.08));
  hairlines.push(toPath(points));
  cores.push(toPath(points.slice(0, Math.max(3, Math.floor(points.length * 0.34)))));
  if (length > 280) shadows.push(toPath(points));
  if (length > 200) {
    const count = length > 500 ? 2 : 1;
    for (let index = 0; index < count; index += 1) {
      const from = points[Math.floor(between(points.length * 0.25, points.length * 0.8))];
      const side = random() > 0.5 ? 1 : -1;
      forks.push(toPath(fracture(from[0], from[1], angle + side * between(0.35, 0.7), between(36, 120))));
    }
  }
}

const draw = (items, className, width) => items
  .map((d) => `<path class="${className}" pathLength="1000" stroke-dasharray="1000" stroke="url(#crack-fade)" d="${d}" stroke-width="${width}"/>`)
  .join('');

const chip = Array.from({ length: 9 }, (_, index) => {
  const angle = (index / 9) * Math.PI * 2 + between(-0.18, 0.18);
  const radius = index % 2 ? between(1.4, 2.8) : between(3.4, 6.4);
  return [impact.x + Math.cos(angle) * radius * 1.2, impact.y + Math.sin(angle) * radius * 0.82];
});

const svg = `<svg class="crack" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="crack-fade" gradientUnits="userSpaceOnUse" cx="${impact.x}" cy="${impact.y}" r="760"><stop offset="0" stop-color="#fff" stop-opacity=".98"/><stop offset=".22" stop-color="#fff" stop-opacity=".74"/><stop offset=".6" stop-color="#fff" stop-opacity=".46"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></radialGradient></defs>${draw(shadows, 'shadow', 1.5)}${draw(forks, 'fork', 0.5)}${draw(hairlines, 'leg', 0.72)}${draw(cores, 'core', 1.15)}<g class="impact"><path d="${toPath(chip)}Z"/></g></svg>\n`;

await writeFile(output, svg);
