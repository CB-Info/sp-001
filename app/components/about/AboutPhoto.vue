<script setup lang="ts">
import type { ImageAsset } from '~/types/content';

/**
 * Photo du coach dans un cadre à gradin. Elle remplit toujours sa case : la
 * hauteur vient de la rangée de cartes sur desktop, d'un ratio en dessous.
 */
defineProps<{ image: ImageAsset }>();

/*
 * Pleine largeur du conteneur sous 64em, un tiers au-delà (427 px au plus).
 * Clés = largeur minimale de fenêtre (@nuxt/image).
 */
const sizes = { 390: '92vw', sm: '92vw', lg: '31vw', xl: '430px' };
</script>

<template>
  <div class="about-photo step-frame">
    <NuxtPicture
      :src="image.src"
      :width="image.width"
      :height="image.height"
      :alt="image.alt"
      format="avif,webp"
      :sizes="sizes"
      loading="lazy"
      decoding="async"
      :img-attrs="{
        class: 'about-photo__img',
        style: { objectPosition: image.focal ?? 'center' },
      }"
    />
  </div>
</template>

<style scoped>
.about-photo {
  /* Mesuré : encoches de ≈ 55 × 12 px (haut droit) et 65 × 28 px (bas gauche) sur 427 × 241. */
  --fx: 13%;
  --ft: 4%;
  --fb: 11%;

  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--surface);
}

.about-photo :deep(.about-photo__img) {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

@media (width >= 40em) {
  .about-photo {
    aspect-ratio: 16 / 9;
  }
}

/* Dans la rangée de trois, la photo s'étire à la hauteur des cartes voisines. */
@media (width >= 64em) {
  .about-photo {
    aspect-ratio: auto;
  }
}

/*
 * Grammaire de la plaque appliquée au média : au survol, la trace s'allonge
 * (les encoches s'ouvrent) et la photo avance d'un rien dans son cadre.
 */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .about-photo {
    transition:
      --fx var(--dur-layout) var(--ease-out),
      --ft var(--dur-layout) var(--ease-out),
      --fb var(--dur-layout) var(--ease-out);
  }

  .about-photo :deep(.about-photo__img) {
    transition: scale var(--dur-focal) var(--ease-out);
  }

  .about-photo:hover {
    --fx: 15%;
    --ft: 6%;
    --fb: 14%;
  }

  .about-photo:hover :deep(.about-photo__img) {
    scale: 1.04;
  }
}
</style>
