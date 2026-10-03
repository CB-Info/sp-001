<script setup lang="ts">
/**
 * Bouton à gradin (silhouette en escalier). Rend un lien si `href` est fourni,
 * sinon un <button>. Le libellé nomme l'action ; la largeur suit le contenu
 * (les textes français sont 15 à 45 % plus longs que la référence).
 */
withDefaults(
  defineProps<{
    href?: string;
    variant?: 'red' | 'black';
    type?: 'button' | 'submit';
  }>(),
  { href: undefined, variant: 'red', type: 'button' },
);
</script>

<template>
  <a v-if="href" :href="href" class="step step-button" :class="`step--${variant}`">
    <slot />
  </a>
  <button v-else :type="type" class="step step-button" :class="`step--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.step-button {
  min-block-size: 2.75rem;
  padding: 0.6875rem 1.75rem 0.75rem;
  font-family: var(--font-display);
  font-size: var(--text-ui);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
</style>
