<script setup lang="ts">
/**
 * Astérisque de marque à 8 branches : 4 barres à bouts carrés, épaisseur ≈ 19,5 %
 * du diamètre, diagonales légèrement plus courtes (mesures de la référence).
 * Purement décoratif : toujours masqué aux lecteurs d'écran.
 */
withDefaults(defineProps<{ size?: string }>(), { size: '4.5rem' });
</script>

<template>
  <svg
    class="asterisk"
    viewBox="0 0 100 100"
    :style="{ inlineSize: size }"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="0" y="40.25" width="100" height="19.5" />
    <rect x="40.25" y="0" width="19.5" height="100" />
    <rect x="6.5" y="40.25" width="87" height="19.5" transform="rotate(45 50 50)" />
    <rect x="6.5" y="40.25" width="87" height="19.5" transform="rotate(-45 50 50)" />
  </svg>
</template>

<style scoped>
.asterisk {
  display: block;
  block-size: auto;
  aspect-ratio: 1;
  fill: var(--accent);
  rotate: calc(var(--ratchet, 0) * 45deg);
  transition: rotate var(--dur-strike) var(--ease-strike);
}

@media (prefers-reduced-motion: reduce) {
  .asterisk {
    rotate: 0deg;
    transition: none;
  }
}
</style>
