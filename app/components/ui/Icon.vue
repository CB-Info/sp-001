<script setup lang="ts">
import { iconPaths, type IconName } from '~/utils/icons';

/**
 * Jeu d'icônes unique, dessiné pour le site : grille de 24, trait de 1,5,
 * bouts et angles carrés (cohérent avec un monde sans arrondi). Toujours
 * décoratif : le nom accessible est porté par le contrôle parent.
 */

withDefaults(defineProps<{ name: IconName; size?: string }>(), { size: '1.5rem' });
</script>

<template>
  <svg
    class="icon"
    viewBox="0 0 24 24"
    :style="{ inlineSize: size, blockSize: size }"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="d in iconPaths[name]" :key="d" :d="d" />
  </svg>
</template>

<style scoped>
.icon {
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: square;
  stroke-linejoin: miter;
}
</style>
