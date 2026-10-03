<script setup lang="ts">
import type { IconName } from '~/utils/icons';

/**
 * Tuile carrée à gradin portant une seule icône. `label` est obligatoire :
 * c'est le nom accessible du contrôle (l'icône est décorative).
 *
 * `surface` prend la couleur de surface de la matière (le carré carbone du
 * footer sur le noir).
 */
withDefaults(
  defineProps<{
    icon: IconName;
    label: string;
    href?: string;
    variant?: 'red' | 'black' | 'white' | 'grey' | 'surface';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
  }>(),
  { href: undefined, variant: 'red', size: 'md', disabled: false },
);
</script>

<template>
  <a
    v-if="href"
    :href="href"
    class="step icon-button"
    :class="[`step--${variant}`, `step--${size}`, `icon-button--${size}`]"
    :aria-label="label"
  >
    <Icon :name="icon" />
  </a>
  <button
    v-else
    type="button"
    class="step icon-button"
    :class="[`step--${variant}`, `step--${size}`, `icon-button--${size}`]"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
  >
    <Icon :name="icon" />
  </button>
</template>

<style scoped>
.icon-button {
  inline-size: var(--tile);
  block-size: var(--tile);
}

.icon-button--sm {
  --tile: 2.5rem;
}

.icon-button--md {
  --tile: 2.75rem;
}

.icon-button--lg {
  --tile: clamp(4rem, 3.4rem + 2.4vw, 5.5rem);
  /* Mesuré : flèche de 39 px dans une plaque de 77, la moitié de la tuile. */
  --icon-size: 50%;
}

/*
 * Une icône n'est pas du texte : 3:1 suffit (WCAG 1.4.11). Blanc sur #F02B42 fait
 * 4,09:1, la tuile garde donc le rouge mesuré de la référence.
 */
.icon-button.step--red {
  --step-fill: var(--red-500);
}

/* Une cible tactile d'au moins 44 px, même si la tuile visible est plus petite. */
.icon-button::after {
  content: '';
  position: absolute;
  inset: 50% auto auto 50%;
  inline-size: max(100%, 2.75rem);
  block-size: max(100%, 2.75rem);
  translate: -50% -50%;
}
</style>
