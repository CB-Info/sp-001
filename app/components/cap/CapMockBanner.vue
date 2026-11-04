<script setup lang="ts">
import { cap } from '~/data/cap';

/**
 * Bandeau « maquette non officielle » (brief §4.1 et §6) : la première ligne de
 * la page dit ce qu'elle est, avant le logo. Surface carbone de 36 px, filet bas
 * graphite ; il défile avec la page (seul l'en-tête est collant).
 *
 * Phrase entière quand elle tient sur une ligne avec le lien (mesuré : 625 +
 * 152 px en Figtree 500 14 px, soit 60em de fenêtre au moins), forme courte en
 * dessous ; sous 20em (zoom à 400 %), le lien passe à la ligne au lieu de déborder.
 * Le lien mène à la liste « Ce qui reste à confirmer » du pied de page.
 */
const { banner } = cap;
</script>

<template>
  <aside class="cap-banner" data-surface="carbone" :aria-label="banner.label">
    <p class="cap-banner__line">
      <span class="cap-banner__long">{{ banner.long }}</span>
      <span class="cap-banner__short">{{ banner.short }}</span>
      <a class="cap-link cap-banner__link" :href="banner.link.href">{{ banner.link.label }}</a>
    </p>
  </aside>
</template>

<style scoped>
.cap-banner {
  min-block-size: var(--banner-height);
  /* Contenu plafonné à 1760 px, marges de la grille en deçà. */
  padding-inline: max(var(--page-gutter), (100% - var(--content-max)) / 2);
  border-block-end: 1px solid var(--cf-graphite);
  background: var(--cf-carbone);
  color: var(--cf-craie);
}

.cap-banner__line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.3em;
  min-block-size: calc(var(--banner-height) - 1px);
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.cap-banner__long {
  display: none;
}

/* Cible de 32 px pour le lien (critère 2.5.8), sans grandir le bandeau. */
.cap-banner__link {
  display: inline-block;
  padding-block: 6px;
  white-space: nowrap;
}

@media (min-width: 60em) {
  .cap-banner__line {
    flex-wrap: nowrap;
    justify-content: space-between;
    column-gap: 2rem;
  }

  .cap-banner__long {
    display: inline;
  }

  .cap-banner__short {
    display: none;
  }
}
</style>
