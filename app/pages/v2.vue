<script setup lang="ts">
import '~/assets/css/v2.css';
import { capSrcset } from '~/components/cap/CapPhoto.vue';
import { cap } from '~/data/cap';

/**
 * V2 : maquette non officielle de site pour CAP Fitness by EBC Sport, direction
 * « Pleins & Déliés ». Brief : docs/brief/v2.md ; analyse : docs/v2/analyse/.
 *
 * <html data-site="v2"> active les tokens de app/assets/css/v2.css : mêmes rôles
 * que la V1, autres valeurs, lus aussi par le JS du mouvement. La V1 et la V2 ne
 * se lient que par des liens pleine page : chacune charge les siens.
 *
 * Les chapitres sous la ligne de flottaison s'hydratent à l'approche (ou jamais,
 * pour les infos pratiques, tout en HTML natif) : le JS du premier chargement
 * reste léger.
 */
/*
 * Aperçu de partage. og:image reste relative (brief §4.0) : le domaine de
 * production n'est pas connu du dépôt. Les robots stricts (LinkedIn, X,
 * WhatsApp) veulent une URL absolue et un og:url ; à poser quand le domaine
 * sera fixé, par une URL de site lue au build (runtimeConfig).
 */
useSeoMeta({
  title: cap.meta.title,
  description: cap.meta.description,
  ogTitle: cap.meta.title,
  ogDescription: cap.meta.description,
  ogImage: '/v2/og.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogImageAlt: cap.meta.imageAlt,
  ogLocale: 'fr_FR',
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

/**
 * Les chapitres s'hydratent un écran avant d'entrer : leur mouvement d'entrée peut
 * encore poser son état initial (reached() faux), et leur JS reste hors du
 * premier chargement.
 */
const EARLY = { rootMargin: '0px 0px 100% 0px' };

const cover = cap.photos.couverture;

useHead({
  // data-intro-font : l'intro de la couverture attend CAP Display (boot.inline.js), au plus 1,2 s.
  htmlAttrs: { 'data-site': 'v2', 'data-intro-font': '900 1em "CAP Display"' },
  meta: [{ name: 'theme-color', content: '#0c0c0b' }],
  link: [
    { key: 'icon', rel: 'icon', type: 'image/svg+xml', href: '/v2/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/v2/apple-touch-icon.png' },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/cap-display-900.woff2',
      crossorigin: '',
    },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/figtree-latin-wght-normal.woff2',
      crossorigin: '',
    },
    // La photo de la couverture, dans le cadrage que l'écran choisira : jamais les deux.
    ...[
      { media: '(max-width: 47.99em)', src: cover.mobile?.src ?? cover.src },
      { media: '(min-width: 48em)', src: cover.src },
    ].map(({ media, src }) => ({
      rel: 'preload' as const,
      as: 'image' as const,
      type: 'image/avif',
      fetchpriority: 'high' as const,
      media,
      imagesrcset: capSrcset(src, 'avif'),
      imagesizes: '100vw',
    })),
  ],
});
</script>

<template>
  <div class="cap-page">
    <a class="cap-skip" href="#contenu">{{ cap.ui.skip }}</a>
    <CapMockBanner />
    <CapHeader />
    <CapMenu />
    <main id="contenu" tabindex="-1">
      <CapCover />
      <LazyCapEdito :hydrate-on-visible="EARLY" />
      <LazyCapCourses :hydrate-on-visible="EARLY" />
      <LazyCapWeek :hydrate-on-visible="EARLY" />
      <LazyCapFamily :hydrate-on-visible="EARLY" />
      <LazyCapPractical hydrate-never />
      <LazyCapFinale :hydrate-on-visible="EARLY" />
    </main>
    <LazyCapFooter :hydrate-on-visible="EARLY" />
    <ClientOnly><CapNextBar /></ClientOnly>
  </div>
</template>

<style scoped>
.cap-page {
  background: var(--cf-noir);
  color: var(--cf-craie);
}

main:focus {
  outline: none;
}

.cap-skip {
  position: fixed;
  inset-block-start: 8px;
  inset-inline-start: 8px;
  z-index: 100;
  padding: 12px 20px;
  background: var(--cf-citron);
  color: var(--cf-noir);
  font-family: var(--font-body);
  font-weight: 600;
  translate: 0 -200%;
}

.cap-skip:focus-visible {
  translate: 0 0;
}

@media (max-width: 63.99em) {
  :global(html.js[data-site='v2'] main) {
    padding-block-end: calc(64px + env(safe-area-inset-bottom));
  }
}
</style>
