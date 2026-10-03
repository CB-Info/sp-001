<script setup lang="ts">
/**
 * Compteur « 01 / 03 », en odomètre : chaque rang (dizaines, unités) est une
 * bande de chiffres qui défile dans sa fenêtre. Seul le rang qui change tourne,
 * vers le haut en avançant, vers le bas en reculant ; un saut fait défiler les
 * chiffres intermédiaires. Chiffres tabulaires : la largeur ne bouge pas.
 *
 * Décoratif pour les lecteurs d'écran : la position est déjà donnée par
 * l'étiquette de chaque témoignage et par `aria-current` sur les points.
 */
const props = defineProps<{ current: number; total: number }>();

const pad = (value: number) => String(value).padStart(2, '0');
const values = Array.from({ length: props.total }, (_, index) => pad(index + 1));

/** Par rang, les chiffres qu'il prend d'un témoignage à l'autre, dans l'ordre. */
const wheels = Array.from({ length: pad(props.total).length }, (_, place) => [
  ...new Set(values.map((value) => value.charAt(place))),
]);

const shown = computed(() => pad(props.current + 1));
</script>

<template>
  <p class="counter" aria-hidden="true">
    <span class="counter__value">
      <span
        v-for="(digits, place) in wheels"
        :key="place"
        class="counter__wheel"
        :style="{ '--at': digits.indexOf(shown.charAt(place)) }"
      >
        <span class="counter__strip">
          <span v-for="digit in digits" :key="digit">{{ digit }}</span>
        </span>
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

.counter__value {
  display: inline-flex;
  font-size: var(--text-subheading);
  letter-spacing: var(--tracking-heading);
  color: var(--accent-ink);
}

/*
 * Fenêtre d'une ligne : la bande la déborde et le masque (clip-path) n'en montre
 * qu'un chiffre. La ligne de base reste celle du premier chiffre de la bande :
 * le décalage (translate) ne touche pas la mise en page.
 */
.counter__wheel {
  display: inline-grid;
  grid-template-rows: 1lh;
  clip-path: inset(0);
}

/* Une seule couche animée par rang, quel que soit le nombre de chiffres. */
.counter__strip {
  display: grid;
  align-self: start;
  translate: 0 calc(var(--at) * -1lh);
  transition: translate var(--dur-layout) var(--ease-out);
}

.counter__total {
  font-size: var(--text-ui);
  color: var(--ink-muted);
}

@media (prefers-reduced-motion: reduce) {
  .counter__strip {
    transition: none;
  }
}
</style>
