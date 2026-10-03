<script setup lang="ts">
import type { HomeContent } from '~/types/content';
import { ui } from '~/data/ui';

/**
 * Réseaux sociaux : tuiles carrées sombres (« dark-square » de la référence),
 * ramenées dans le système à gradin. Au survol et au focus, la tuile passe au
 * rouge, comme les autres contrôles. Le nom accessible vient du contenu.
 */
defineProps<{ socials: HomeContent['footer']['socials'] }>();
</script>

<template>
  <ul role="list" class="footer-socials" :aria-label="ui.socials">
    <li v-for="social in socials" :key="social.icon">
      <IconButton
        class="footer-socials__button"
        :icon="social.icon"
        :label="social.label"
        :href="social.href"
        variant="surface"
        size="md"
      />
    </li>
  </ul>
</template>

<style scoped>
.footer-socials {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-16);
}

.footer-socials__button,
.footer-socials__button::before {
  transition:
    translate var(--dur-feedback) var(--ease-out-soft),
    background-color var(--dur-feedback) var(--ease-out-soft);
}

.footer-socials__button:is(:focus-visible, :active) {
  --step-fill: var(--accent-fill);
}

@media (hover: hover) and (pointer: fine) {
  .footer-socials__button:hover {
    --step-fill: var(--accent-fill);
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-socials__button,
  .footer-socials__button::before {
    transition: none;
  }
}
</style>
