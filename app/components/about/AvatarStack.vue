<script setup lang="ts">
import type { ImageAsset } from '~/types/content';

/**
 * Rangée d'avatars carrés des auteurs d'avis (carrés comme tout le monde du site,
 * sans chevauchement). Décoratifs : le nombre d'avis est déjà dit dans le libellé.
 */
defineProps<{ images: ImageAsset[] }>();
</script>

<template>
  <div class="avatar-stack">
    <NuxtPicture
      v-for="image in images"
      :key="image.src"
      class="avatar-stack__item"
      data-motion="about-reviewer"
      :src="image.src"
      :width="image.width"
      :height="image.height"
      :alt="image.alt"
      format="avif,webp"
      sizes="40px"
      loading="lazy"
      decoding="async"
      :img-attrs="{
        class: 'avatar-stack__img',
        style: { objectPosition: image.focal ?? 'center' },
      }"
    />
  </div>
</template>

<style scoped>
.avatar-stack {
  /* Mesuré : vignettes de 39 px @1440, 36 px sur mobile ; pas de 8 px. */
  --avatar: clamp(2.25rem, 10.6cqi, 2.4375rem);

  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.avatar-stack__item {
  display: block;
  inline-size: var(--avatar);
  block-size: var(--avatar);
  background: var(--red-700);
}

.avatar-stack__item :deep(.avatar-stack__img) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
</style>
