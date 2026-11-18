// Mots d'affiche ajustés de la V2 (brief §2.4) : chaque entrée dit où lire le texte
// dans app/data/cap.ts et à quelles chasses de CAP Display le mesurer. Partagé par
// scripts/measure-fit.mjs (mesure dans Chromium) et scripts/check-fit.mjs (contrôle).
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Lit le contenu de la V2 (TypeScript) sans passer par Nuxt. */
export async function loadCap() {
  const jiti = createJiti(import.meta.url, { alias: { '~': join(root, 'app') } });
  const { cap } = await jiti.import(join(root, 'app/data/cap.ts'));
  return cap;
}

/**
 * key : identifiant utilisé par <CapFitWord fit-key="…"> ; get : où lire le texte ;
 * widths : chasses mesurées (font-stretch, en %), dans l'ordre ordinateur puis mobile ;
 * un délié mobile y ajoute 75, son plein de repli quand la ligne est trop étroite
 * pour son plancher de 64 px (brief §2.5 R2, CapFitWord.vue).
 */
export const FIT = [
  { key: 'cover.delie', get: (c) => c.cover.delie, widths: [150, 100, 75] },
  { key: 'cover.plein', get: (c) => c.cover.plein, widths: [80, 75] },
  { key: 'edito.bouge', get: (c) => c.edito.bouge, widths: [150, 100, 75] },
  {
    key: 'edito.lignes',
    get: (c) => c.edito.lignes.reduce((a, b) => (b.length > a.length ? b : a)),
    widths: [80, 75],
  },
  { key: 'famille.delie', get: (c) => c.family.delie, widths: [125, 75] },
  { key: 'famille.plein', get: (c) => c.family.plein, widths: [80, 75] },
  { key: 'fin.plein', get: (c) => c.finale.plein, widths: [80, 75] },
];

export const sha1 = (text) => createHash('sha1').update(text).digest('hex').slice(0, 12);
