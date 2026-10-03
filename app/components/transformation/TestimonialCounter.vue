<script setup lang="ts">
/**
 * Compteur « 01 / 03 ». Le numéro courant tourne comme un rouleau : tous les
 * numéros partagent la même cellule, décalés d'une hauteur de ligne chacun, et
 * un masque ne laisse voir que le courant (chiffres tabulaires : largeur fixe).
 *
 * Décoratif pour les lecteurs d'écran : la position est déjà donnée par
 * l'étiquette de chaque témoignage et par `aria-current` sur les points.
 */
defineProps<{ current: number; total: number }>();

const pad = (value: number) => String(value).padStart(2, '0');
</script>

<template>
  <p class="counter" aria-hidden="true">
    <span class="counter__reel" :style="{ '--current': current }">
      <span
        v-for="index in total"
        :key="index"
        class="counter__value"
        :style="{ '--index': index - 1 }"
      >
        {{ pad(index) }}
      </span>
    </span>
    <span class="counter__total">/ {{ pad(total) }}</span>
  </p>
</template>

<style scoped>
.counter {
  display: flex;
  align-items: baseline;
  gap: var(--space-8);
  font-family: var(--font-display);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;
}

/* Grille d'une cellule : sa ligne de base reste celle du premier numéro, malgré les décalages. */
.counter__reel {
  display: inline-grid;
  clip-path: inset(0);
  font-size: var(--text-subheading);
  letter-spacing: var(--tracking-heading);
  color: var(--accent-ink);
}

.counter__value {
  grid-area: 1 / 1;
  translate: 0 calc((var(--index) - var(--current)) * 100%);
  transition: translate var(--dur-layout) var(--ease-out);
}

.counter__total {
  font-size: var(--text-ui);
  color: var(--ink-muted);
}

@media (prefers-reduced-motion: reduce) {
  .counter__value {
    transition: none;
  }
}
</style>
