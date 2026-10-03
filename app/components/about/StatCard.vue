<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Carte d'ancienneté : « 20 » et son libellé en haut, trois atouts en liste à
 * puces carrées en bas, sur le béton clair.
 */
defineProps<{ years: HomeContent['about']['years'] }>();
</script>

<template>
  <MaterialCard material="concrete" class="stat-card">
    <StatFigure
      class="stat-card__figure"
      :value="years.value"
      :label="years.label"
      motion="about-years-value"
    />
    <ul class="stat-card__points">
      <li v-for="point in years.points" :key="point" class="stat-card__point">{{ point }}</li>
    </ul>
  </MaterialCard>
</template>

<style scoped>
/* Chiffre en noir pur (rôle des gros chiffres), libellé à l'encre des titres. */
.stat-card__figure {
  --stat-ink: var(--ink-strong);
}

/* La liste tombe en bas de la carte ; mesuré : puces à 10 px du bord du texte, pas de 21 px. */
.stat-card__points {
  margin-block-start: auto;
  padding-block-start: var(--space-24);
  padding-inline-start: 1.5em;
  list-style: square;
  font-size: var(--text-micro);
  line-height: 1.5;
  color: var(--ink-muted);
}

.stat-card__point::marker {
  color: var(--ink);
}
</style>
