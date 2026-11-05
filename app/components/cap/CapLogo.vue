<script setup lang="ts">
import { defineAsyncComponent, h, markRaw, type Component } from 'vue';
import reduit from '~/assets/brand/cap-reduit.svg?raw';

/**
 * Logo CAP Fitness by EBC Sport, reconstruit en vectoriel
 * (art/v2/logo/build_logo.py). Inséré en ligne : ses parties suivent la page
 * (contrastes forcés). Image nommée par défaut ; décoratif dans un lien qui
 * porte déjà le nom (`decorative`).
 *
 * Règles d'emploi (brief §2.10) : sur noir, carbone ou zone photo sombre
 * seulement ; jamais sous sa taille minimale (horizontal 400 px, réduit 180 px).
 *
 * Seul le logo réduit (en-tête et menu, hydratés avec la page) est dans le JS du
 * premier chargement. Les autres déclinaisons (horizontal et carré du pied de
 * page, monogramme, ECG : 9,6 Ko gzip à elles toutes) sont des modules à part,
 * chargés avec le composant qui les montre : rendues au serveur comme les autres,
 * hydratées une fois leur balisage arrivé.
 */
type Variant = 'horizontal' | 'reduit' | 'carre' | 'monogramme' | 'ecg';

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    label?: string;
    decorative?: boolean;
  }>(),
  { variant: 'reduit', label: 'CAP Fitness by EBC Sport', decorative: false },
);

const LAZY = import.meta.glob<string>(
  ['../../assets/brand/cap-*.svg', '!../../assets/brand/cap-reduit.svg'],
  { query: '?raw', import: 'default' },
);

/** Le <title> du fichier est retiré : le nom vient de aria-label (un seul nom). */
const clean = (svg: string) =>
  svg
    .replace(/<title>[^<]*<\/title>/, '')
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" ');

/** Le balisage, rendu dans l'élément racine : classes et attributs viennent du parent. */
const markup = (svg: string): Component => {
  const html = clean(svg);
  return markRaw({ name: 'CapLogoMarkup', render: () => h('span', { innerHTML: html }) });
};

const Body = computed(() => {
  const variant = props.variant;
  if (variant === 'reduit') return markup(reduit);
  return markRaw(
    defineAsyncComponent(async () => {
      const load = LAZY[`../../assets/brand/cap-${variant}.svg`];
      if (!load) throw new Error(`Logo inconnu : ${variant}`);
      return markup(await load());
    }),
  );
});
</script>

<template>
  <component
    :is="Body"
    class="cap-logo"
    :class="`cap-logo--${variant}`"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : label"
    :aria-hidden="decorative ? 'true' : undefined"
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
