// Contrôle de build (pnpm check) : les mots d'affiche ajustés de la V2 ont-ils été
// mesurés sur leur texte actuel ? Compare l'empreinte de chaque texte de
// app/data/cap.ts à celle de app/data/cap-fit.ts.
// Usage : node scripts/check-fit.mjs
import { join } from 'node:path';
import { createJiti } from 'jiti';
import { FIT, loadCap, root, sha1 } from './fit-words.mjs';

const cap = await loadCap();
const jiti = createJiti(import.meta.url);
const { capFit } = await jiti.import(join(root, 'app/data/cap-fit.ts'));

const stale = FIT.filter(({ key, get }) => capFit[key]?.sha1 !== sha1(get(cap))).map((f) => f.key);
if (stale.length) {
  console.error(`Mots ajustés à remesurer (node scripts/measure-fit.mjs) : ${stale.join(', ')}`);
  process.exit(1);
}
console.log(`Mots ajustés : ${FIT.length} à jour.`);
