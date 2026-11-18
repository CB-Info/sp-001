// Mesure, dans Chromium et avec la police servie, la largeur en em de chaque mot
// d'affiche ajusté de la V2 (en capitales, comme à l'écran), et écrit
// app/data/cap-fit.ts. À relancer après tout changement d'un de ces textes :
// scripts/check-fit.mjs fait échouer `pnpm check` sinon.
// Usage : node scripts/measure-fit.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { FIT, loadCap, root, sha1 } from './fit-words.mjs';

const cap = await loadCap();
const font = (await readFile(join(root, 'public/fonts/cap-display-900.woff2'))).toString('base64');

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const page = await browser.newPage();
await page.setContent(`<!doctype html><html><head><style>
  @font-face { font-family: 'CAP Display'; font-weight: 900; font-stretch: 75% 150%;
    src: url(data:font/woff2;base64,${font}) format('woff2'); }
  span { font: 900 100px/1 'CAP Display'; text-transform: uppercase; white-space: pre;
    font-kerning: normal; position: absolute; }
</style></head><body></body></html>`);
await page.evaluate(() => document.fonts.ready);

const out = {};
for (const { key, get, widths } of FIT) {
  const text = get(cap);
  const em = {};
  for (const wdth of widths) {
    em[wdth] = await page.evaluate(
      async ([value, stretch]) => {
        const span = document.createElement('span');
        span.style.fontStretch = `${stretch}%`;
        span.textContent = value;
        document.body.append(span);
        await document.fonts.load(`900 100px 'CAP Display'`, value);
        const width = span.getBoundingClientRect().width;
        span.remove();
        return Math.round((width / 100) * 1000) / 1000;
      },
      [text, wdth],
    );
  }
  out[key] = { sha1: sha1(text), em };
  console.log(`${key.padEnd(16)} ${JSON.stringify(text).padEnd(26)} ${JSON.stringify(em)}`);
}
await browser.close();

const body = `// Fichier généré par scripts/measure-fit.mjs : ne pas modifier à la main.
// Largeur en em (capitales, CAP Display 900) de chaque mot d'affiche ajusté, par
// chasse (font-stretch en %). L'empreinte sha1 du texte est contrôlée par
// scripts/check-fit.mjs : tout changement de texte impose une nouvelle mesure.
export const capFit = ${JSON.stringify(out, null, 2)} as const;

export type CapFitKey = keyof typeof capFit;
`;
await writeFile(join(root, 'app/data/cap-fit.ts'), body);
console.log('app/data/cap-fit.ts écrit');
