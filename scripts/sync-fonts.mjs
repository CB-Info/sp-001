// Copie les fichiers de police (Fontsource, licence OFL) dans public/fonts
// et génère app/assets/css/fonts.css avec des @font-face auto-hébergées.
// Usage : node scripts/sync-fonts.mjs (à relancer après une mise à jour des paquets).
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'fonts');
mkdirSync(outDir, { recursive: true });

/**
 * Familles servies : nom CSS, paquet, motif de fichier par sous-ensemble, graisses,
 * chasses (axe `wdth`, facultatif), feuille du paquet où lire l'unicode-range, et
 * nom du fichier de licence copié. Saira et Schibsted Grotesk servent la direction B (/v2).
 */
const families = [
  {
    family: 'Tektur',
    pkg: '@fontsource-variable/tektur',
    file: (s) => `tektur-${s}-wght-normal.woff2`,
    weight: '400 900',
    license: 'OFL-Tektur.txt',
  },
  {
    family: 'Inter Tight',
    pkg: '@fontsource-variable/inter-tight',
    file: (s) => `inter-tight-${s}-wght-normal.woff2`,
    weight: '100 900',
    license: 'OFL-Inter-Tight.txt',
  },
  {
    family: 'Inter',
    pkg: '@fontsource-variable/inter',
    file: (s) => `inter-${s}-wght-normal.woff2`,
    weight: '100 900',
    license: 'OFL-Inter.txt',
  },
  {
    family: 'IBM Plex Mono',
    pkg: '@fontsource/ibm-plex-mono',
    file: (s) => `ibm-plex-mono-${s}-400-normal.woff2`,
    weight: '400',
    license: 'OFL-IBM-Plex-Mono.txt',
  },
  {
    family: 'Saira',
    pkg: '@fontsource-variable/saira',
    file: (s) => `saira-${s}-standard-normal.woff2`,
    weight: '100 900',
    stretch: '50% 125%',
    sheet: 'standard.css',
    license: 'OFL-Saira.txt',
  },
  {
    family: 'Schibsted Grotesk',
    pkg: '@fontsource-variable/schibsted-grotesk',
    file: (s) => `schibsted-grotesk-${s}-wght-normal.woff2`,
    weight: '400 900',
    license: 'OFL-Schibsted-Grotesk.txt',
  },
];
const subsets = ['latin-ext', 'latin'];

/** Lit l'unicode-range d'un sous-ensemble dans le CSS fourni par le paquet. */
function unicodeRange(pkg, fileName, sheet) {
  const css = [sheet, 'index.css', '400.css']
    .filter(Boolean)
    .map((name) => {
      try {
        return readFileSync(join(root, 'node_modules', pkg, name), 'utf8');
      } catch {
        return '';
      }
    })
    .join('\n');
  const block = css.split('@font-face').find((b) => b.includes(fileName));
  const match = block?.match(/unicode-range:\s*([^;]+);/);
  if (!match) throw new Error(`unicode-range introuvable pour ${fileName}`);
  return match[1].trim();
}

let css = '/* Fichier généré par scripts/sync-fonts.mjs. Ne pas modifier à la main. */\n';
for (const { family, pkg, file, weight, stretch, sheet, license } of families) {
  for (const subset of subsets) {
    const name = file(subset);
    copyFileSync(join(root, 'node_modules', pkg, 'files', name), join(outDir, name));
    css += `
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-display: swap;
  font-weight: ${weight};${stretch ? `\n  font-stretch: ${stretch};` : ''}
  src: url('/fonts/${name}') format('woff2');
  unicode-range: ${unicodeRange(pkg, name, sheet)};
}
`;
  }
  copyFileSync(join(root, 'node_modules', pkg, 'LICENSE'), join(outDir, license));
}
writeFileSync(join(root, 'app', 'assets', 'css', 'fonts.css'), css);
console.log('Polices synchronisées dans public/fonts.');
