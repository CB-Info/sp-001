<script setup lang="ts">
import type { ImageAsset } from '~/types/content';

/**
 * « Tirage » d'un témoignage : passe-partout clair autour de la photo, sans gradin
 * ni ombre (construction propre à cette section dans la référence).
 *
 * API de style pour le deck :
 * - `--print-ratio` impose un cadrage (16:9 en mobile) ; sinon, celui de l'image ;
 * - `--print-shade` (0 → 1) assombrit la photo : la carte qui attend dans la pile.
 *
 * Tailles servies : pleine largeur sous 1024 px, ≈ 50 % de la fenêtre jusqu'à
 * 1280 px, puis 726 px au plus (colonne de la pile à 1440). Clés = largeur
 * d'écran en dessous de laquelle la taille s'applique (@nuxt/image).
 */
defineProps<{ image: ImageAsset }>();

const sizes = { sm: '100vw', md: '100vw', lg: '100vw', xl: '52vw', '2xl': '730px' };
</script>

<template>
  <div class="print" data-print>
    <div class="print__frame" :style="{ '--ratio': `${image.width} / ${image.height}` }">
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
          class: 'print__img',
          style: { objectPosition: image.focal ?? 'center' },
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.print {
  /* Mesuré : passe-partout de 18 px à 1440 (≈ #F0F1F4, soit la surface claire du papier). */
  --print-mat: clamp(0.625rem, 0.4393rem + 0.762vw, 1.125rem);

  padding: var(--print-mat);
  background-color: var(--surface);
}

.print__frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: var(--print-ratio, var(--ratio));
  /* Teinte d'attente tant que la photo n'est pas décodée. */
  background-color: var(--rule);
}

.print__frame :deep(.print__img) {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

/* Voile de profondeur : opacité pilotée par le deck, transition composée sur le GPU. */
.print__frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--surface-inverse);
  opacity: var(--print-shade, 0);
  transition: opacity var(--dur-layout) var(--ease-out-soft);
}

@media (prefers-reduced-motion: reduce) {
  .print__frame::after {
    transition: none;
  }
}

@media (forced-colors: active) {
  .print {
    border: 1px solid CanvasText;
  }
}
</style>
