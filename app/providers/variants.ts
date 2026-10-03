import { defineProvider } from '@nuxt/image/runtime';
import variants from '../data/image-variants.json';

/**
 * Provider @nuxt/image des variantes pré-générées par scripts/build-images.mjs.
 *
 * NuxtPicture calcule les largeurs utiles (sizes × densités) ; on renvoie la plus
 * petite variante au moins aussi large, plafonnée à la largeur du master. Les URL
 * restent simples (/img/hero/hero-athlete-1440.avif) : aucune redirection côté
 * Cloudflare, contrairement aux URL IPX (voir le script).
 */
type Entry = { width: number; height: number; widths: number[] };
const manifest = variants as Record<string, Entry>;
const EXTENSIONS: Record<string, string> = { avif: 'avif', webp: 'webp', jpeg: 'jpg', jpg: 'jpg' };

export default defineProvider({
  getImage(src, { modifiers }) {
    const entry = manifest[src];
    if (!entry) throw new Error(`Image sans variantes : ${src} (lancer scripts/build-images.mjs)`);
    const wanted = Number(modifiers.width) || entry.width;
    const width = entry.widths.find((w) => w >= wanted) ?? entry.width;
    const extension = EXTENSIONS[String(modifiers.format)] ?? 'jpg';
    const base = src.replace(/^\/images\//, '/img/').replace(/\.jpg$/, '');
    return { url: `${base}-${width}.${extension}` };
  },
});
