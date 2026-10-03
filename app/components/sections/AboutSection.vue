<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Section À propos (surface papier) : la promesse, puis ses preuves.
 * En-tête « décalé » : l'eyebrow seule à gauche, la phrase (le H2, à la taille
 * des H3 comme dans la référence) et le bouton noir à droite. Dessous, trois
 * cartes égales : note, ancienneté, photo du coach.
 */
defineProps<{ content: HomeContent['about'] }>();

const titleId = 'a-propos-titre';
</script>

<template>
  <section id="a-propos" class="about" data-surface="paper" :aria-labelledby="titleId">
    <RuledGrid variant="strip" fade />

    <div class="about__inner container">
      <div class="about__intro">
        <SectionHeader
          :id="titleId"
          class="about__header"
          :eyebrow="content.eyebrow"
          :title="content.statement"
          size="sub"
          data-motion="about-statement"
        />
        <StepButton
          class="about__cta"
          variant="black"
          :href="content.cta.href"
          data-motion="about-cta"
        >
          {{ content.cta.label }}
        </StepButton>
      </div>

      <ul class="about__cards" role="list">
        <li class="about__card" data-motion="about-card">
          <RatingCard :rating="content.rating" />
        </li>
        <li class="about__card" data-motion="about-card">
          <StatCard :years="content.years" />
        </li>
        <li class="about__card about__card--photo" data-motion="about-card">
          <AboutPhoto :image="content.image" data-motion="about-photo" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding-block-end: var(--section-pad);
}

.about__inner {
  /* Mesuré : capitales de la phrase à 125 px du haut de section, soit 57 px sous le fondu. */
  margin-block-start: clamp(2rem, 1.4196rem + 2.381vw, 3.5625rem);
}

.about__intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Mesuré : 48 px des capitales de la dernière ligne au bouton, soit 40 px de boîte à boîte. */
.about__cta {
  margin-block-start: var(--space-40);
}

/*
 * Mesuré : 80 px du pied du bouton (plaque arrière comprise, c'est sa marge basse)
 * aux cartes.
 */
.about__cards {
  display: grid;
  gap: var(--gap);
  margin-block-start: var(--block-gap);
}

/* Chaque carte remplit sa case : même hauteur sur une rangée. */
.about__card {
  display: grid;
}

@media (width >= 40em) {
  /* Note et ancienneté côte à côte, photo en bandeau 16:9 dessous. */
  .about__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about__card--photo {
    grid-column: 1 / -1;
  }
}

@media (width >= 64em) {
  /*
   * En-tête en grille, partagée par l'eyebrow et le H2 (sous-grille), le bouton
   * sous le H2. De 64 à 80em, trois colonnes à la gouttière des cartes : la phrase
   * démarre pile sur l'axe de la 2e carte (à 50/50, elle ferait 5 lignes ou plus).
   */
  .about__intro {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--gap);
    align-items: start;
  }

  .about__header {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    align-items: start;
  }

  /*
   * L'eyebrow quitte la pile : plus de marge basse, et ses capitales s'alignent
   * sur celles de la 1re ligne du H2 (capitale à 0,175 em du haut de ligne en
   * Tektur à 1,05 d'interligne, à 0,177 em en Plex Mono à 1).
   */
  .about__header :deep(.section-header__eyebrow) {
    margin-block: calc(var(--text-subheading) * 0.175 - var(--text-label) * 0.177) 0;
  }

  /* Le H2 démarre sur l'axe de la 2e carte. */
  .about__header :deep(.section-header__row) {
    grid-column: 2 / -1;
  }

  .about__cta {
    grid-column: 2 / -1;
    justify-self: start;
  }

  .about__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .about__card--photo {
    grid-column: auto;
  }
}

/* Mesuré @1440 : deux colonnes égales séparées de 60, la phrase démarre à x 750. */
@media (width >= 80em) {
  .about__intro {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--space-60);
  }
}
</style>
