<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Hero : photo pleine page (élément LCP), cadre de filets, repères de calage,
 * astérisque, slogans et titre calé en bas entre deux filets.
 *
 * Hauteur : max(100svh, 40rem) au lieu des 1 102 px de la référence, pour que
 * « FORGE / TA FORCE » soit entièrement visible au chargement (correctif P1) :
 * les écarts verticaux se resserrent avec la hauteur de la fenêtre.
 */
const props = defineProps<{ content: HomeContent['hero'] }>();

const titleId = 'hero-titre';

/*
 * Largeur réellement affichée : la photo couvre max(100vw, hauteur × 1,31). En
 * portrait, elle déborde donc largement de la fenêtre (≈ 2,8 × sur un téléphone).
 * Clés = largeur minimale de fenêtre (@nuxt/image).
 */
const photoSizes = {
  390: '280vw',
  sm: '200vw',
  md: '175vw',
  lg: '100vw',
  xl: '100vw',
  '2xl': '100vw',
};
</script>

<template>
  <section class="hero" data-surface="hot" :aria-labelledby="titleId">
    <div class="hero__media" data-motion="hero-photo">
      <NuxtPicture
        :src="props.content.image.src"
        :alt="props.content.image.alt"
        :width="props.content.image.width"
        :height="props.content.image.height"
        format="avif,webp"
        :sizes="photoSizes"
        loading="eager"
        :preload="{ fetchPriority: 'high' }"
        :img-attrs="{
          class: 'hero__photo',
          fetchpriority: 'high',
          style: { objectPosition: props.content.image.focal },
        }"
      />
    </div>

    <span class="hero__rule hero__rule--start" data-motion="hero-rule" aria-hidden="true" />
    <span class="hero__rule hero__rule--end" data-motion="hero-rule" aria-hidden="true" />

    <div class="hero__top container">
      <Asterisk class="hero__asterisk" size="var(--hero-asterisk)" data-motion="hero-asterisk" />
      <HeroSlogans class="hero__slogans" :slogans="props.content.slogans" />
    </div>

    <CrosshairRow class="hero__marks container" motion="hero-crosshair" />

    <div class="hero__band">
      <span class="hero__rule hero__rule--top" data-motion="hero-rule" aria-hidden="true" />
      <HeroHeadline
        class="container"
        :title-id="titleId"
        :title-lines="props.content.titleLines"
        :lead-lines="props.content.leadLines"
      />
      <span class="hero__rule hero__rule--bottom" data-motion="hero-rule" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  /*
   * Mesures @1440 sur la hauteur de référence de 1 102 px (a1 §2.1) :
   * astérisque de 71 px à y 179, rangées de slogans de 58,5, repères 72 px
   * au-dessus de la bande du titre, 54 px sous son filet bas. Les valeurs en
   * svh resserrent la composition sur les fenêtres plus basses.
   */
  --hero-title: min(var(--text-hero), max(20svh, 3.5rem));
  --hero-pad-top: 5.5rem;
  --hero-pad-bottom: clamp(1.5rem, 5svh, 3.375rem);
  --hero-asterisk: min(clamp(2.5rem, 1.6rem + 3.2vw, 4.4375rem), 8svh);
  --hero-marks-gap: clamp(1.5rem, 6svh, 4.5rem);

  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-rows: auto minmax(var(--space-16), 1fr) auto auto;
  grid-template-areas: 'top' '.' 'marks' 'band';
  min-block-size: max(100svh, 40rem);
  padding-block: var(--hero-pad-top) var(--hero-pad-bottom);
  padding-inline: env(safe-area-inset-left, 0px) env(safe-area-inset-right, 0px);
  overflow: clip;
}

.hero__media {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero__media :deep(picture),
.hero__media :deep(.hero__photo) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.hero__media :deep(.hero__photo) {
  object-fit: cover;
}

/* Filets du cadre : blanc ≈ 18 % (--rule de la surface « hot »), 1 px. */
.hero__rule {
  position: absolute;
  background: var(--rule);
  pointer-events: none;
}

.hero__rule--start,
.hero__rule--end {
  inset-block: 0;
  inline-size: 1px;
}

.hero__rule--start {
  inset-inline-start: var(--frame-inset);
}

.hero__rule--end {
  inset-inline-end: var(--frame-inset);
}

.hero__rule--top,
.hero__rule--bottom {
  inset-inline: var(--frame-inset);
  block-size: 1px;
}

.hero__rule--top {
  inset-block-start: 0;
}

.hero__rule--bottom {
  inset-block-end: 0;
}

.hero__top {
  grid-area: top;
  display: grid;
  justify-items: start;
  gap: var(--space-24);
}

.hero__slogans {
  justify-self: stretch;
}

.hero > .hero__marks {
  grid-area: marks;
  display: none;
  margin-block-end: var(--hero-marks-gap);
}

.hero__band {
  grid-area: band;
  position: relative;
  isolation: isolate;
  padding-block: calc(var(--hero-title) * 0.0456) var(--space-20);
}

/*
 * Voile de sécurité ancré sur la bande (et non sur la hauteur du hero) : il
 * reprend le fondu mesuré (transparent → noir 60 % → noir) et garantit au moins
 * 0,6 de noir sous le sous-titre, donc un contraste ≥ 3:1 même sur une zone
 * claire de la photo. Repères : 79 px au-dessus du filet haut, noir 60 % à
 * 53 px sous lui, noir plein sur la ligne de base de la première ligne.
 */
.hero__band::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block: calc(var(--hero-title) * -0.44) calc(var(--hero-pad-bottom) * -1);
  z-index: -1;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, var(--black) 60%, transparent) calc(var(--hero-title) * 0.73),
    var(--black) calc(var(--hero-title) * 1.23)
  );
  pointer-events: none;
}

/* Paysage mobile : le titre doit tenir dans la fenêtre, le plancher de 40rem saute. */
@media (height < 30em) {
  .hero {
    --hero-pad-top: 4.5rem;

    min-block-size: 100svh;
  }
}

@media (width >= 64em) {
  .hero {
    --hero-pad-top: clamp(
      6.5rem,
      21.8svh - 3.8rem,
      11.1875rem
    ); /* 135 px à 900 de haut, 179 à 1102 */
    --hero-row: clamp(2.5rem, 5.4svh, 3.65625rem);
  }

  .hero__top {
    gap: var(--hero-row);
  }

  .hero__slogans {
    justify-self: start;
  }

  .hero > .hero__marks {
    display: flex;
  }

  /* mesuré : 19 px entre le filet et les capitales, 18 px sous la ligne de base (à 180 px) */
  .hero__band {
    padding-block-end: calc(var(--hero-title) * 0.04);
  }
}
</style>
