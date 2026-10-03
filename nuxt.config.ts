// Configuration Nuxt : génération statique d'une page unique.
// Les décisions de stack sont documentées dans docs/adr/0001-stack-nuxt-gsap.md.
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',

  modules: ['@nuxt/eslint', '@nuxt/image'],

  // Composants auto-importés sans préfixe de dossier (<StepButton>, pas <UiStepButton>).
  components: [{ path: '~/components', pathPrefix: false }],

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'CLUSEM — Forge ta force',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content:
            "CLUSEM, salle de force et de coaching (projet conceptuel). Reconstruction animée d'une landing page, réalisée pour un portfolio.",
        },
        { name: 'theme-color', content: '#600305' },
        { name: 'robots', content: 'noindex' },
      ],
      // Icône déclarée : sans elle, le navigateur demande /favicon.ico (404 en console).
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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
    prerender: { routes: ['/'] },
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: { stylistic: false },
  },
});
