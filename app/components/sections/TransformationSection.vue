<script setup lang="ts">
import type { HomeContent } from '~/types/content';
import { ui } from '~/data/ui';

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
    <RuledGrid variant="strip" fade />

    <div class="transformation__inner container">
      <SectionHeader
        :id="titleId"
        :eyebrow="content.eyebrow"
        :title="content.title"
        :note="content.note"
      />

      <TestimonialDeck class="section__body" :items="content.items" :label="ui.testimonials.region">
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

.transformation__inner {
  margin-block-start: var(--strip-gap);
}
</style>
