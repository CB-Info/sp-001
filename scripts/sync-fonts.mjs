// Copie les fichiers de police (Fontsource, licence OFL) dans public/fonts
// et génère app/assets/css/fonts.css avec des @font-face auto-hébergées.
// Usage : node scripts/sync-fonts.mjs (à relancer après une mise à jour des paquets).
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'fonts');
mkdirSync(outDir, { recursive: true });

/** Familles servies : nom CSS, paquet, motif de fichier par sous-ensemble, graisses. */
const families = [
  {
    family: 'Tektur',
    pkg: '@fontsource-variable/tektur',
    file: (s) => `tektur-${s}-wght-normal.woff2`,
    weight: '400 900',
  },
  {
    family: 'Inter Tight',
    pkg: '@fontsource-variable/inter-tight',
    file: (s) => `inter-tight-${s}-wght-normal.woff2`,
    weight: '100 900',
  },
  {
    family: 'Inter',
    pkg: '@fontsource-variable/inter',
    file: (s) => `inter-${s}-wght-normal.woff2`,
    weight: '100 900',
  },
  {
    family: 'IBM Plex Mono',
    pkg: '@fontsource/ibm-plex-mono',
    file: (s) => `ibm-plex-mono-${s}-400-normal.woff2`,
    weight: '400',
  },
];
const subsets = ['latin-ext', 'latin'];

/** Lit l'unicode-range d'un sous-ensemble dans le CSS fourni par le paquet. */
function unicodeRange(pkg, fileName) {
  const css = ['index.css', '400.css']
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
for (const { family, pkg, file, weight } of families) {
  for (const subset of subsets) {
    const name = file(subset);
    copyFileSync(join(root, 'node_modules', pkg, 'files', name), join(outDir, name));
    css += `
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-display: swap;
  font-weight: ${weight};
  src: url('/fonts/${name}') format('woff2');
  unicode-range: ${unicodeRange(pkg, name)};
}
`;
  }
}
writeFileSync(join(root, 'app', 'assets', 'css', 'fonts.css'), css);
copyFileSync(
  join(root, 'node_modules', '@fontsource-variable/tektur', 'LICENSE'),
  join(outDir, 'OFL-Tektur.txt'),
);
copyFileSync(
  join(root, 'node_modules', '@fontsource-variable/inter', 'LICENSE'),
  join(outDir, 'OFL-Inter.txt'),
);
copyFileSync(
  join(root, 'node_modules', '@fontsource-variable/inter-tight', 'LICENSE'),
  join(outDir, 'OFL-Inter-Tight.txt'),
);
copyFileSync(
  join(root, 'node_modules', '@fontsource/ibm-plex-mono', 'LICENSE'),
  join(outDir, 'OFL-IBM-Plex-Mono.txt'),
);
console.log('Polices synchronisées dans public/fonts.');
