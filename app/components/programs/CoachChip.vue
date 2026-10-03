<script setup lang="ts">
import type { Coach } from '~/types/content';

/**
 * Coach d'un programme : avatar rond (seul cercle du monde, gardé par fidélité),
 * nom et durée. Le portrait vient de la fiche du coach : un seul visage par coach
 * sur toute la page (correctif de cohérence).
 */
defineProps<{ coach: Coach; meta: string }>();
</script>

<template>
  <div class="coach-chip">
    <NuxtPicture
      class="coach-chip__avatar"
      :src="coach.portrait.src"
      :width="coach.portrait.width"
      :height="coach.portrait.height"
      alt=""
      format="avif,webp"
      sizes="48px"
      loading="lazy"
      decoding="async"
      :img-attrs="{
        class: 'coach-chip__img',
        style: { objectPosition: coach.portrait.focal ?? '50% 25%' },
      }"
    />
    <p class="coach-chip__text">
      <span class="visually-hidden">Coach : </span>
      <span class="coach-chip__name">{{ coach.name }}</span>
      <span class="coach-chip__meta">{{ meta }}</span>
    </p>
  </div>
</template>

<style scoped>
.coach-chip {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

/* Mesuré : avatar de 47 px, nom à 16 px de son bord. */
.coach-chip__avatar {
  flex: none;
  inline-size: 2.9375rem;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 50%;
  background: var(--surface);
}

.coach-chip__avatar :deep(.coach-chip__img) {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.coach-chip__text {
  display: grid;
  gap: var(--space-4);
  line-height: 1.3;
}

.coach-chip__name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--ink);
}

.coach-chip__meta {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--ink-muted);
}
</style>
