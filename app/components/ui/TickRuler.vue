<script setup lang="ts">
/**
 * Règle graduée des eyebrows : 13 graduations alignées par le haut, hauteurs
 * irrégulières et un pas resserré, reproduits tels que mesurés (fidélité).
 */
const heights = [12, 11, 10, 10, 10, 10, 12, 10, 8, 8, 8, 8, 12];
const gaps = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6];
const ticks = heights.map((h, i) => ({
  x: 0.5 + gaps.slice(0, i).reduce((sum, g) => sum + g, 0),
  h,
}));
const width = Math.ceil(ticks.at(-1)!.x + 1);
</script>

<template>
  <svg
    class="tick-ruler"
    :viewBox="`0 0 ${width} 12`"
    :width="width"
    height="12"
    aria-hidden="true"
    focusable="false"
  >
    <line v-for="tick in ticks" :key="tick.x" :x1="tick.x" :x2="tick.x" y1="0" :y2="tick.h" />
  </svg>
</template>

<style scoped>
.tick-ruler {
  flex: none;
  overflow: visible;
  stroke: var(--accent);
  stroke-width: 1;
  shape-rendering: crispEdges;
}
</style>
