<script setup lang="ts">
import carre from '~/assets/brand/cap-carre.svg?raw';
import ecg from '~/assets/brand/cap-ecg.svg?raw';
import horizontal from '~/assets/brand/cap-horizontal.svg?raw';
import monogramme from '~/assets/brand/cap-monogramme.svg?raw';
import reduit from '~/assets/brand/cap-reduit.svg?raw';

/**
 * Logo CAP Fitness by EBC Sport, reconstruit en vectoriel
 * (art/v2/logo/build_logo.py). Inséré en ligne : ses parties suivent la page
 * (contrastes forcés). Image nommée par défaut ; décoratif dans un lien qui
 * porte déjà le nom (`decorative`).
 *
 * Règles d'emploi (brief §2.10) : sur noir, carbone ou zone photo sombre
 * seulement ; jamais sous sa taille minimale (horizontal 400 px, réduit 180 px).
 */
const props = withDefaults(
  defineProps<{
    variant?: 'horizontal' | 'reduit' | 'carre' | 'monogramme' | 'ecg';
    label?: string;
    decorative?: boolean;
  }>(),
  { variant: 'reduit', label: 'CAP Fitness by EBC Sport', decorative: false },
);

const SOURCES = { horizontal, reduit, carre, monogramme, ecg };
/** Le <title> du fichier est retiré : le nom vient de aria-label (un seul nom). */
const markup = computed(() =>
  SOURCES[props.variant]
    .replace(/<title>[^<]*<\/title>/, '')
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" '),
);
</script>

<template>
  <span
    class="cap-logo"
    :class="`cap-logo--${variant}`"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : label"
    :aria-hidden="decorative ? 'true' : undefined"
    v-html="markup"
  />
</template>

<style scoped>
.cap-logo {
  display: block;
  line-height: 0;
}

.cap-logo :deep(svg) {
  display: block;
  inline-size: 100%;
  block-size: auto;
  overflow: visible;
}

@media (forced-colors: active) {
  .cap-logo :deep(path) {
    fill: CanvasText;
  }
}
</style>
