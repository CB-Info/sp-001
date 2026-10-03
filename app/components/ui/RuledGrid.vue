<script setup lang="ts">
/**
 * Trame « tableur » : 11 colonnes, filets horizontaux au pas de ≈ 6,7 px.
 * - strip : séparateur de section en pleine largeur, ancré au viewport
 *   (mêmes verticales d'une section à l'autre), à peine visible comme dans la
 *   référence ; `fade` la prolonge d'un fondu de 12 px (About, Programs,
 *   Transformation) ;
 * - panel : aplat décoratif de 107 px de haut (16 rangées) dans le conteneur.
 */
withDefaults(defineProps<{ variant?: 'strip' | 'panel'; fade?: boolean }>(), {
  variant: 'panel',
  fade: false,
});
</script>

<template>
  <div
    class="ruled-grid"
    :class="[`ruled-grid--${variant}`, { 'ruled-grid--fade': fade }]"
    aria-hidden="true"
  />
</template>

<style scoped>
.ruled-grid {
  --columns: 11;
  --row: 6.7px;
  --line: var(--pattern-line);

  background-image:
    repeating-linear-gradient(
      to right,
      var(--line) 0 1px,
      transparent 1px calc(100% / var(--columns))
    ),
    repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px var(--row));
  border-inline-end: 1px solid var(--line);
  border-block-end: 1px solid var(--line);
}

.ruled-grid--strip {
  --band: 3.2rem;
  /* Mesuré : filets à ≈ 97 % de blanc sur le papier, verticales presque invisibles. */
  --line: color-mix(in srgb, var(--pattern-line) 55%, transparent);

  block-size: var(--band);
  inline-size: 100%;
  border-inline-end: 0;
}

.ruled-grid--fade {
  block-size: calc(var(--band) + 0.75rem);
  border-block-end: 0;
  mask-image: linear-gradient(to bottom, #000 var(--band), transparent);
}

.ruled-grid--panel {
  block-size: 6.7rem;
}
</style>
