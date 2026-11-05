// Configuration Nuxt : génération statique des deux directions (/ et /v2).
// Les décisions de stack sont documentées dans docs/adr/0001-stack-nuxt-gsap.md.
import { readFileSync } from 'node:fs';

// Amorce du mouvement (classes de <html>), exécutée avant le premier rendu. Le
// fichier source garde ses commentaires ; la version en ligne en est délestée.
const motionBoot = readFileSync(new URL('./app/motion/boot.inline.js', import.meta.url), 'utf8')
  .replace(/^\s*\/\/.*\n/gm, '')
  .trim();

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',

  modules: ['@nuxt/eslint', '@nuxt/image'],

  // Composants auto-importés sans préfixe de dossier (<StepButton>, pas <UiStepButton>).
  components: [{ path: '~/components', pathPrefix: false }],

  devtools: { enabled: false },

  css: ['lenis/dist/lenis.css', '~/assets/css/main.css'],

  features: {
    /*
     * Styles en ligne dans le HTML rendu (défaut de Nuxt), sauf ceux de la V2 :
     * ses feuilles étaient recopiées dans la page puis retéléchargées à
     * l'hydratation, et sa police redemandée par la seconde déclaration de
     * CAP Display. En <link>, elles ne passent qu'une fois et restent en cache
     * (/_nuxt immuable). La V1 garde ses styles en ligne.
     */
    inlineStyles: (id) =>
      !/\/app\/(pages\/v2\.vue|components\/cap\/|assets\/css\/v2\.css)/.test(id ?? ''),
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      // Titre, description, couleur du navigateur et police préchargée sont propres à
      // chaque direction : posés par leur page (pages/index.vue, pages/v2.vue).
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'robots', content: 'noindex' },
      ],
      // Icône déclarée : sans elle, le navigateur demande /favicon.ico (404 en console).
      // La clé laisse une page la remplacer (pages/v2.vue) : un seul rel="icon" servi.
      link: [{ key: 'icon', rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [{ innerHTML: motionBoot, tagPriority: 'critical' }],
    },
  },

  image: {
    // Variantes pré-générées (scripts/build-images.mjs) : pas d'IPX, dont les URL
    // à « & » coûtent une redirection 307 par image sur Cloudflare.
    provider: 'variants',
    providers: {
      variants: { provider: '~/providers/variants' },
    },
    format: ['avif', 'webp'],
  },

  hooks: {
    /*
     * Le mouvement se charge à la demande, et seulement s'il sert : GSAP pas en
     * mouvement réduit, Lenis et OGL pas sur mobile. Pas de préchargement spéculatif
     * de ces bibliothèques (≈ 73 Ko gzip) qui concurrence la photo du hero.
     */
    'build:manifest'(manifest) {
      for (const resource of Object.values(manifest)) {
        if (/\/node_modules\/(gsap|lenis|ogl)\//.test(resource.src ?? '')) {
          resource.prefetch = false;
        }
        /*
         * V2 : les chapitres sous la ligne de flottaison (composants cap/) et les
         * logos chargés à la demande (assets/brand/cap-*.svg) arrivent à
         * l'approche, un écran avant (pages/v2.vue). Leur préchargement
         * spéculatif, avant la photo de la couverture, retardait le LCP mobile.
         * La V1 n'utilise aucun de ces fichiers. `src` est relatif à app/.
         */
        if (/^(components\/cap\/|assets\/brand\/cap-)/.test(resource.src ?? '')) {
          resource.prefetch = false;
        }
      }
    },
    // Les pages de laboratoire (prévisualisation d'une section isolée) n'existent qu'en dev.
    'pages:extend'(pages) {
      if (process.env.NODE_ENV !== 'production') return;
      for (let i = pages.length - 1; i >= 0; i--) {
        if (pages[i]?.path.startsWith('/lab')) pages.splice(i, 1);
      }
    },
  },

  nitro: {
    // Sortie 100 % statique, y compris dans Workers Builds : sans preset explicite,
    // Nitro détecte WORKERS_CI=1 et bascule sur cloudflare-module (un Worker SSR),
    // en écrivant une config Wrangler qui court-circuite wrangler.jsonc.
    preset: 'static',
    prerender: { routes: ['/', '/v2'] },
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: { stylistic: false },
  },
});
