<script setup lang="ts">
import { iconPaths, type IconName } from '~/utils/icons';

/**
 * Jeu d'icônes unique, dessiné pour le site : grille de 24, trait de 1,5,
 * bouts et angles carrés (cohérent avec un monde sans arrondi). Toujours
 * décoratif : le nom accessible est porté par le contrôle parent.
 *
 * Taille : prop `size`, sinon la propriété héritée `--icon-size` (1,5rem par
 * défaut). Un contrôle peut ainsi dimensionner son icône sans `:deep`.
 */
defineProps<{ name: IconName; size?: string }>();
</script>

<template>
  <svg
    class="icon"
    viewBox="0 0 24 24"
    :style="size ? { '--icon-size': size } : undefined"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="d in iconPaths[name]" :key="d" :d="d" />
  </svg>
</template>

<style scoped>
.icon {
  flex: none;
  inline-size: var(--icon-size, 1.5rem);
  block-size: var(--icon-size, 1.5rem);
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: square;
  stroke-linejoin: miter;
}
</style>
