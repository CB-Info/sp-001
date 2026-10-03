<script setup lang="ts">
/**
 * Ligne de repères de calage : marques équidistantes dont les pointes extrêmes
 * tombent exactement sur les bords du conteneur (mesuré : 60 et 1380 @1440).
 * `motion` nomme la cible de la chorégraphie pour chaque repère.
 */
withDefaults(defineProps<{ count?: number; motion?: string }>(), {
  count: 4,
  motion: undefined,
});
</script>

<template>
  <div class="crosshair-row" aria-hidden="true">
    <Crosshair v-for="n in count" :key="n" :data-motion="motion" />
  </div>
</template>

<style scoped>
.crosshair-row {
  display: flex;
  justify-content: space-between;
  /* mesuré : blanc ≈ 55 % sur la photo */
  color: color-mix(in srgb, var(--ink) 55%, transparent);
}
</style>
