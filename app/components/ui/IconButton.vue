<script setup lang="ts">
import type { IconName } from '~/utils/icons';

/**
 * Tuile carrée à gradin portant une seule icône. `label` est obligatoire :
 * c'est le nom accessible du contrôle (l'icône est décorative).
 */
withDefaults(
  defineProps<{
    icon: IconName;
    label: string;
    href?: string;
    variant?: 'red' | 'black' | 'white' | 'grey';
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
}

.icon-button--lg :deep(.icon) {
  inline-size: 2.25rem;
  block-size: 2.25rem;
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
