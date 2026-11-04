<script setup lang="ts">
/**
 * Une donnée que le club doit encore fournir. Toujours un texte visible
 * (« à confirmer », « à venir »…), souligné en pointillé : la couleur n'est
 * jamais le seul signal (WCAG 1.4.1). Code d'état du logo : le contour (le
 * pointillé) dit l'inconnu.
 */
withDefaults(defineProps<{ text?: string }>(), { text: 'à confirmer' });
</script>

<template>
  <span class="cap-pending">{{ text }}</span>
</template>

<style scoped>
.cap-pending {
  color: var(--ink);
  font-family: var(--font-body);
  font-weight: 500;
  text-decoration: underline dashed var(--cf-pointille);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}
</style>
