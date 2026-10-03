<script setup lang="ts">
import { ui } from '~/data/ui';
</script>

<template>
  <a class="skip-link" href="#contenu">{{ ui.skipLink }}</a>
</template>

<style scoped>
.skip-link {
  position: fixed;
  inset-block-start: var(--space-12);
  inset-inline-start: var(--space-12);
  z-index: 100;
  padding: var(--space-12) var(--space-16);
  background: var(--paper-0);
  color: var(--ink-900);
  font-family: var(--font-display);
  translate: 0 -200%;
}

.skip-link:focus-visible {
  translate: 0 0;
}
</style>
