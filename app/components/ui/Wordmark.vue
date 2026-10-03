<script setup lang="ts">
/** Wordmark CLUSEM™ en Tektur 700 (graisse et tracking vérifiés sur la référence). */
withDefaults(defineProps<{ as?: 'span' | 'p' }>(), { as: 'span' });
</script>

<template>
  <component :is="as" class="wordmark">CLUSEM<span class="wordmark__tm">™</span></component>
</template>

<style scoped>
.wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: 0;
  white-space: nowrap;
}

/* Le ™ natif de Tektur s'aligne déjà sur la ligne des capitales. */
.wordmark__tm {
  font-weight: 600;
}
</style>
