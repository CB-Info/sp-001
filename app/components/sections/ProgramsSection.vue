<script setup lang="ts">
import type { Coach, HomeContent } from '~/types/content';

/**
 * Section Programmes : en-tête empilé, bouton et photo à encoche à gauche,
 * accordéon exclusif à droite (pistes dans le rapport √2 : 519 / 727 @1440).
 *
 * Correctif de la référence : son alignement « bas de photo = bas de l'accordéon »
 * casse dès qu'un autre élément s'ouvre. Ici la photo est collante dans sa colonne :
 * elle accompagne la lecture de l'accordéon et rejoint son bas en fin de course.
 */
const props = defineProps<{ content: HomeContent['programs']; coaches: Coach[] }>();

const titleId = 'programmes-titre';
/** Programme ouvert ; le 01 par défaut (état figé de la référence). */
const openId = ref<string | null>(props.content.items[0]?.id ?? null);

/*
 * Bandeau pleine largeur sous 64em, puis colonne gauche (≈ 36 % de la fenêtre,
 * 519 px au plus). Clés = largeur minimale de fenêtre (@nuxt/image).
 */
const photoSizes = { 390: '100vw', sm: '100vw', md: '100vw', lg: '36vw', '2xl': '520px' };
</script>

<template>
  <section id="programmes" class="programs" data-surface="paper" :aria-labelledby="titleId">
    <RuledGrid class="programs__strip" variant="strip" />

    <div class="programs__inner container">
      <div class="programs__aside">
        <SectionHeader :id="titleId" :eyebrow="content.eyebrow" :title="content.title" />
        <p class="programs__intro">{{ content.intro }}</p>
        <StepButton class="programs__cta" :href="content.cta.href">
          {{ content.cta.label }}
        </StepButton>
        <div
          class="programs__photo step-frame"
          :style="{ '--ratio': `${content.image.width} / ${content.image.height}` }"
          :data-program="openId ?? undefined"
          data-motion="programs-photo"
        >
          <NuxtPicture
            :src="content.image.src"
            :width="content.image.width"
            :height="content.image.height"
            :alt="content.image.alt"
            format="avif,webp"
            :sizes="photoSizes"
            loading="lazy"
            decoding="async"
            :img-attrs="{
              class: 'programs__img',
              style: { objectPosition: content.image.focal ?? 'center' },
            }"
          />
        </div>
      </div>

      <ProgramAccordion v-model="openId" :items="content.items" :coaches="coaches" />
    </div>
  </section>
</template>

<style scoped>
.programs {
  padding-block-end: var(--section-pad);
}

/*
 * Bande réglée de 51 px (hauteur de RuledGrid « strip ») prolongée d'un fondu de
 * 12 px, mesuré en tête d'About, de Programs et de Transformation.
 */
.programs > .programs__strip {
  block-size: calc(3.2rem + 0.75rem);
  mask-image: linear-gradient(to bottom, black 3.2rem, transparent);
}

.programs__inner {
  /* Mesuré : filet haut de l'accordéon à 124 px du haut de section, soit 61 px sous le fondu. */
  --programs-offset: clamp(2rem, 1.327rem + 2.762vw, 3.8125rem);
  /* Mesuré : 86 px du bouton à la photo @1440. */
  --photo-gap: clamp(2.5rem, 1.432rem + 4.381vw, 5.375rem);

  display: grid;
  row-gap: var(--block-gap);
  margin-block-start: var(--programs-offset);
}

.programs__aside {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/*
 * SectionHeader sans note garde, à ≥ 64em, la gouttière de 80 px de sa piste de
 * note vide : le titre perdrait une ligne entière (voir Demandes).
 */
.programs__aside :deep(.section-header__row) {
  column-gap: 0;
}

.programs__intro {
  /* Mesuré : 24 px sous le titre ; ≈ 460 px en anglais, la colonne entière en français. */
  max-inline-size: 34rem;
  margin-block-start: var(--space-24);
  color: var(--ink-muted);
}

.programs__cta {
  margin-block-start: var(--space-40);
}

/*
 * Photo à encoche (mesurée sur s4 : 519 × 528, encoches de 69 et 71 px, décalages
 * haut 6,3 % et bas 13,2 %). Sous 64em, bandeau 16:9 recadré sur le point focal.
 */
.programs__photo {
  --fx: 13.5%;
  --ft: 6%;
  --fb: 13%;

  align-self: stretch;
  aspect-ratio: 16 / 9;
  margin-block-start: var(--photo-gap);
  background: var(--surface);
}

.programs__photo :deep(.programs__img) {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

@media (width >= 64em) {
  /* Pistes 1 : √2 (519 et 727 @1440), séparées par 78–80 px. */
  .programs__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    column-gap: var(--block-gap);
  }

  .programs__photo {
    position: sticky;
    inset-block-start: var(--space-32);
    aspect-ratio: var(--ratio);
  }
}
</style>
