// Variantes responsive des images (AVIF, WebP, JPEG), générées au build.
//
// Pourquoi pas IPX : ses URL combinent les modificateurs avec « & » ou « , »
// (/_ipx/f_avif&q_72&s_…/…). Cloudflare (static assets) canonicalise ces
// caractères et répond par une redirection 307 vers « %26 » ou « %2C » : un aller-
// retour de plus par image, image LCP comprise. Ici, des noms simples :
// /img/hero/hero-athlete-1440.3f9a1c2e.avif.
//
// Entrée  : art/masters/**/*.jpg (masters étalonnés, provenance embarquée).
// Sorties : public/img/**/<nom>-<largeur>.<empreinte>.<avif|webp|jpg> (non
//           versionnées) et app/data/image-variants.json (largeurs et empreinte par
//           image, lu par le provider @nuxt/image de app/providers/variants.ts).
// L'empreinte dépend du master et des réglages d'encodage : une URL ne change de
// contenu jamais, d'où un cache « immutable » (public/_headers). Incrémental : une
// variante déjà présente n'est pas refaite ; les variantes orphelines sont supprimées.
//
// Usage : node scripts/build-images.mjs [--force]
import { createHash } from 'node:crypto';
import { glob, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MASTERS = join(root, 'art/masters');
const OUTPUT = join(root, 'public/img');
const MANIFEST = join(root, 'app/data/image-variants.json');
const force = process.argv.includes('--force');

/** Échelle de largeurs commune ; chaque image s'arrête à sa propre largeur. */
const LADDER = [160, 320, 480, 640, 800, 960, 1280, 1600, 1920, 2400, 2880];

/** Famille d'étalonnage par master (art/production.json) : les rouges saturés gardent leur chroma. */
const production = JSON.parse(await readFile(join(root, 'art/production.json'), 'utf8'));
const family = Object.fromEntries(production.map((p) => [p.target, p.family]));
const jobs = JSON.parse(await readFile(join(root, 'art/manifest.json'), 'utf8')).production.jobs;

/** Version des réglages ci-dessous : à incrémenter pour réencoder toutes les variantes. */
const ENCODING = 1;

function encoders(master) {
  const crimson = family[relative(root, master)] === 'crimson';
  return {
    // 4:4:4 sur la famille cramoisie : en 4:2:0, les contours rouges bavent.
    avif: (img) =>
      img.avif({ quality: 55, effort: 5, chromaSubsampling: crimson ? '4:4:4' : '4:2:0' }),
    webp: (img) => img.webp({ quality: 78, effort: 5, smartSubsample: crimson }),
    jpg: (img) => img.jpeg({ quality: 80, mozjpeg: true, progressive: true }),
  };
}

/** XMP des variantes : marqueur IPTC « image générée par IA » et renvoi vers le master. */
function xmpFor(master) {
  const rel = relative(root, master);
  const job = jobs.find((j) => j.target === rel && !String(j.status ?? '').startsWith('rejet'));
  return (
    '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
    '<rdf:Description rdf:about="" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/">' +
    '<Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia' +
    '</Iptc4xmpExt:DigitalSourceType>' +
    `<dc:source>${rel}${job ? ` (Higgsfield ${job.model}, job ${job.job_id}, prompt ${job.prompt})` : ''}</dc:source>` +
    '</rdf:Description></rdf:RDF></x:xmpmeta>'
  );
}

async function fingerprint(master) {
  const settings = JSON.stringify({ ENCODING, family: family[relative(root, master)] ?? null });
  return createHash('sha1')
    .update(await readFile(master))
    .update(settings)
    .digest('hex')
    .slice(0, 8);
}

async function processMaster(master) {
  const { width, height } = await sharp(master).metadata();
  const widths = [...LADDER.filter((w) => w < width), width];
  const rel = relative(MASTERS, master).replace(/\.jpg$/, '');
  const hash = await fingerprint(master);
  const xmp = xmpFor(master);
  const files = [];
  let written = 0;
  for (const w of widths) {
    for (const [ext, encode] of Object.entries(encoders(master))) {
      const output = join(OUTPUT, `${rel}-${w}.${hash}.${ext}`);
      files.push(output);
      if (!force && (await stat(output).catch(() => null))) continue;
      await mkdir(dirname(output), { recursive: true });
      await encode(sharp(master).resize({ width: w }).withXmp(xmp)).toFile(output);
      written++;
    }
  }
  // Clé = chemin logique utilisé par le contenu (app/data/home.ts).
  return { src: `/images/${rel}.jpg`, width, height, widths, hash, files, written };
}

const masters = [];
for await (const file of glob('**/*.jpg', { cwd: MASTERS })) masters.push(join(MASTERS, file));
masters.sort();

// Quelques masters en parallèle ; libvips parallélise déjà chaque encodage.
const pool = Math.max(1, Math.min(4, Math.floor(availableParallelism() / 2)));
const results = [];
for (let i = 0; i < masters.length; i += pool) {
  results.push(...(await Promise.all(masters.slice(i, i + pool).map(processMaster))));
}

// Variantes orphelines (master modifié ou supprimé, réglages changés) : supprimées.
const expected = new Set(results.flatMap((r) => r.files));
let removed = 0;
for await (const file of glob('**/*.{avif,webp,jpg}', { cwd: OUTPUT })) {
  if (!expected.has(join(OUTPUT, file))) {
    await rm(join(OUTPUT, file));
    removed++;
  }
}

const manifest = Object.fromEntries(
  results.map(({ src, width, height, widths, hash }) => [src, { width, height, widths, hash }]),
);
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
const written = results.reduce((n, r) => n + r.written, 0);
console.log(
  `images : ${masters.length} masters, ${written} variantes écrites, ${removed} supprimées → public/img`,
);
