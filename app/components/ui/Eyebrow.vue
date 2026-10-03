<script setup lang="ts">
/** Eyebrow de section : règle graduée + label mono (conservé par fidélité, PRODUCT.md). */
defineProps<{ label: string }>();
</script>

<template>
  <p class="eyebrow">
    <TickRuler />
    <span class="eyebrow__label">{{ label }}</span>
  </p>
</template>

<style scoped>
.eyebrow {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.eyebrow__label {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  line-height: 1;
  text-transform: uppercase;
  color: var(--ink-muted);
}
</style>
