<script setup lang="ts">
/**
 * Titre du hero et sous-titre.
 *
 * - H1 unique « Forge ta force », rendu en deux lignes (espace réel entre les
 *   deux spans : le nom lu reste une seule phrase). Seconde ligne en retrait de
 *   1,19em à partir de 64em (mesuré : 215 px à 180 px).
 * - Sous-titre à droite de la première ligne (début à 53,6 % du conteneur,
 *   mesuré : x 768 @1440), sa DERNIÈRE ligne de base sur celle de « FORGE » :
 *   alignement de grille sur la première ligne de base, puis remontée d'une
 *   ligne (1lh).
 * - Trois flèches rouges après la première ligne du sous-titre (pas de 40 px).
 */
defineProps<{
  titleId: string;
  titleLines: [string, string];
  leadLines: [string, string];
}>();
</script>

<template>
  <div class="hero-headline">
    <!-- Une espace réelle sépare les lignes : le titre se lit « Forge ta force ». -->
    <h1 :id="titleId" class="hero-headline__title">
      <template v-for="(line, index) in titleLines" :key="line">
        <span
          class="hero-headline__line"
          :class="{ 'hero-headline__line--indent': index > 0 }"
          data-motion="hero-title-line"
          >{{ line }}</span
        >
        <template v-if="index === 0">{{ ' ' }}</template>
      </template>
    </h1>
    <p class="hero-headline__lead" data-motion="hero-lead">
      <template v-for="(line, index) in leadLines" :key="line">
        <span class="hero-headline__lead-line">
          {{ line }}
          <span
            v-if="index === 0"
            class="hero-headline__arrows"
            aria-hidden="true"
            data-motion="hero-arrows"
          >
            <Icon v-for="n in 3" :key="n" name="arrow-right" size="0.7em" />
          </span>
        </span>
        <template v-if="index === 0">{{ ' ' }}</template>
      </template>
    </p>
  </div>
</template>

<style scoped>
.hero-headline {
  display: grid;
  gap: var(--space-16);
}

/*
 * Tektur : capitale 0,70em, ascendante 1,0em, descendante 0,3em (fontTools).
 * Interligne 0,82 : la ligne de base tombe à 0,76em du haut de chaque ligne,
 * le haut des capitales à 0,06em.
 */
.hero-headline__title {
  /* Alignement optique : l'approche gauche du F (0,056em) est rattrapée. */
  margin-inline-start: -0.056em;
  font-size: var(--hero-title, var(--text-hero));
  font-weight: 500;
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  text-wrap: wrap;
  color: var(--ink);
}

.hero-headline__line {
  display: block;
}

.hero-headline__lead {
  font-family: var(--font-lead);
  font-size: var(--text-lead);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.01em;
  /* mesuré : blanc ≈ 92 % ; lisibilité garantie par le voile de la bande (HeroSection) */
  color: color-mix(in srgb, var(--ink) 92%, transparent);
}

.hero-headline__lead-line {
  display: block;
}

.hero-headline__arrows {
  display: inline-flex;
  gap: 0.3em; /* mesuré : flèches au pas de 40 px pour un sous-titre de 40 px */
  margin-inline-start: 0.3em; /* + l'espace du texte : ≈ 26 px avant la première flèche */
  vertical-align: middle;
  color: var(--red-500);
}

@media (width >= 64em) {
  .hero-headline {
    grid-template-columns: 53.6% minmax(0, 1fr);
    align-items: first baseline;
    gap: 0;
  }

  .hero-headline__title {
    grid-area: 1 / 1 / 2 / -1;
  }

  .hero-headline__line--indent {
    margin-inline-start: 1.19em;
  }

  .hero-headline__lead {
    grid-area: 1 / 2;
    position: relative;
    inset-block-start: -1lh;
  }
}
</style>
