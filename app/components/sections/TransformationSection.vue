<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Section Transformation : en-tête scindé (titre, note calée sur sa dernière ligne),
 * puis le deck de témoignages. Le deck compose toute la grille du corps : colonne
 * gauche et son filet, pile de cartes, filet horizontal, compteur, citation et
 * contrôles. La section ne lui confie que l'astérisque de la colonne gauche.
 */
defineProps<{ content: HomeContent['transformation'] }>();

const titleId = 'transformations-titre';
</script>

<template>
  <section
    id="transformations"
    class="transformation"
    data-surface="paper"
    :aria-labelledby="titleId"
  >
    <RuledGrid class="transformation__strip" variant="strip" />

    <div class="transformation__inner container">
      <SectionHeader
        :id="titleId"
        :eyebrow="content.eyebrow"
        :title="content.title"
        :note="content.note"
      />

      <TestimonialDeck class="section__body" :items="content.items" label="Témoignages de membres">
        <template #aside>
          <!-- Mesuré : ≈ 106 px à 1440, ≈ 80 px à 1024 (a7 §3.7). -->
          <Asterisk
            class="transformation__asterisk"
            size="clamp(5rem, 1rem + 6.25vw, 6.625rem)"
            data-motion="transformation-asterisk"
          />
        </template>
      </TestimonialDeck>
    </div>
  </section>
</template>

<style scoped>
.transformation {
  padding-block-end: var(--section-pad);
}

/*
 * Bande réglée de 51 px (hauteur de RuledGrid « strip ») prolongée d'un fondu de
 * 12 px, mesuré en tête d'About, de Programs et de Transformation.
 */
.transformation > .transformation__strip {
  block-size: calc(3.2rem + 0.75rem);
  mask-image: linear-gradient(to bottom, black 3.2rem, transparent);
}

/* Mesuré : eyebrow à 124 px du haut de section, soit 61 px sous le fondu (même pas que Programs). */
.transformation__inner {
  container-type: inline-size;
  margin-block-start: clamp(2rem, 1.327rem + 2.762vw, 3.8125rem);
}

/*
 * Le mot le plus long du titre (« TRANSFORMATIONS, », ≈ 9,5 em) doit tenir dans
 * 280 px à 320 de large : la taille est plafonnée à la largeur du conteneur.
 */
.transformation__inner :deep(.section-header__title) {
  font-size: min(var(--text-heading), 10.5cqi);
}
</style>
