// Images de partage et icône de la V2 (CAP Fitness), rastérisées depuis les SVG
// produits par art/v2/logo/build_logo.py. Les PNG sont versionnés : ce script ne
// tourne que quand le logo change.
// Usage : node scripts/build-og.mjs
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public/v2');

const og = await readFile(join(root, 'art/v2/logo/og.svg'));
await sharp(og, { density: 72 }).png({ compressionLevel: 9 }).toFile(join(out, 'og.png'));

// Icône tactile : le complexe citron sur carré noir, 180 × 180.
const icon = await readFile(join(out, 'favicon.svg'));
await sharp(icon, { density: 72 * (180 / 32) })
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(join(out, 'apple-touch-icon.png'));

console.log('public/v2/og.png et public/v2/apple-touch-icon.png écrits');
