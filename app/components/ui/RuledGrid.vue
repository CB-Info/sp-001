<script setup lang="ts">
/**
 * Trame « tableur » : 11 colonnes, filets horizontaux au pas de ≈ 6,7 px.
 * - strip : séparateur de section en pleine largeur, ancré au viewport
 *   (mêmes verticales d'une section à l'autre) ;
 * - panel : aplat décoratif de 107 px de haut (16 rangées) dans le conteneur.
 */
withDefaults(defineProps<{ variant?: 'strip' | 'panel' }>(), { variant: 'panel' });
</script>

<template>
  <div class="ruled-grid" :class="`ruled-grid--${variant}`" aria-hidden="true" />
</template>

<style scoped>
.ruled-grid {
  --columns: 11;
  --row: 6.7px;

  background-image:
    repeating-linear-gradient(
      to right,
      var(--pattern-line) 0 1px,
      transparent 1px calc(100% / var(--columns))
    ),
    repeating-linear-gradient(to bottom, var(--pattern-line) 0 1px, transparent 1px var(--row));
  border-inline-end: 1px solid var(--pattern-line);
  border-block-end: 1px solid var(--pattern-line);
}

.ruled-grid--strip {
  block-size: 3.2rem;
  inline-size: 100%;
  border-inline-end: 0;
}

.ruled-grid--panel {
  block-size: 6.7rem;
}
</style>
