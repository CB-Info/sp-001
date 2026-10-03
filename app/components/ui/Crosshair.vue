<template>
  <!-- Repère de calage d'imprimerie : 4 bras courts autour d'un vide central. -->
  <svg class="crosshair" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 0v9.5M12 14.5V24M0 12h9.5M14.5 12H24" />
  </svg>
</template>

<style scoped>
.crosshair {
  inline-size: 1.5rem;
  block-size: 1.5rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  shape-rendering: crispEdges;
}
</style>
