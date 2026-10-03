<script setup lang="ts">
import { ui } from '~/data/ui';

/**
 * Déclencheur du menu : grille de 9 points (15 × 15, points de 3 au pas de 6,
 * mesurés) suivie du libellé.
 * - `cross` : les 4 points des milieux glissent d'un demi-pas sur les diagonales,
 *   les 9 points forment un « × » dont chaque branche est un petit escalier
 *   (écho de la silhouette à gradin).
 * - `closes` : le libellé devient « Fermer ». Le déclencheur de l'en-tête garde
 *   toujours « Menu » : son nom accessible ne change pas quand le focus y revient.
 *
 * Les deux libellés partagent la même cellule de grille : la largeur ne change
 * pas entre « Menu » et « Fermer », donc la grille de points ne bouge pas d'un
 * pixel et le bouton de fermeture du dialog se superpose exactement à celui-ci.
 *
 * Rend un lien tant que `href` est fourni (repli sans JS), un bouton sinon.
 */
const props = withDefaults(defineProps<{ cross?: boolean; closes?: boolean; href?: string }>(), {
  cross: false,
  closes: false,
  href: undefined,
});

const root = useTemplateRef<HTMLElement>('root');

defineExpose({ focus: () => root.value?.focus() });
</script>

<template>
  <component
    :is="props.href ? 'a' : 'button'"
    ref="root"
    :href="props.href"
    :type="props.href ? undefined : 'button'"
    class="menu-trigger"
    :class="{ 'menu-trigger--cross': props.cross, 'menu-trigger--closes': props.closes }"
  >
    <span class="menu-trigger__grid" aria-hidden="true">
      <span v-for="n in 9" :key="n" class="menu-trigger__dot" />
    </span>
    <span class="menu-trigger__labels">
      <span class="menu-trigger__label menu-trigger__label--menu">{{ ui.menu.open }}</span>
      <span class="menu-trigger__label menu-trigger__label--close">{{ ui.menu.close }}</span>
    </span>
  </component>
</template>

<style scoped>
.menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.9375rem; /* mesuré : 15 px entre la grille et le libellé */
  min-block-size: 2.75rem; /* cible tactile de 44 px */
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: var(--tracking-label);
  text-align: start;
  text-transform: uppercase;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.menu-trigger__grid {
  position: relative;
  flex: none;
  inline-size: 15px;
  block-size: 15px;
  transition: scale var(--dur-press) linear;
}

.menu-trigger__dot {
  position: absolute;
  inset-inline-start: calc(var(--c) * 6px);
  inset-block-start: calc(var(--r) * 6px);
  inline-size: 3px;
  block-size: 3px;
  background: currentColor;
  translate: calc(var(--dx, 0) * 1px) calc(var(--dy, 0) * 1px);
  transition: translate var(--dur-state) var(--ease-strike);
}

/*
 * Position (--c, --r), écart des coins au survol (--spread-x, --spread-y) et glissement des
 * milieux vers les diagonales à l'ouverture (--cross-x, --cross-y), en pas de 1 px.
 */
.menu-trigger__dot:nth-child(1) {
  --c: 0;
  --r: 0;
  --spread-x: -1;
  --spread-y: -1;
}

.menu-trigger__dot:nth-child(2) {
  --c: 1;
  --r: 0;
  --cross-x: 3;
  --cross-y: 3;
}

.menu-trigger__dot:nth-child(3) {
  --c: 2;
  --r: 0;
  --spread-x: 1;
  --spread-y: -1;
}

.menu-trigger__dot:nth-child(4) {
  --c: 0;
  --r: 1;
  --cross-x: 3;
  --cross-y: -3;
}

.menu-trigger__dot:nth-child(5) {
  --c: 1;
  --r: 1;
}

.menu-trigger__dot:nth-child(6) {
  --c: 2;
  --r: 1;
  --cross-x: -3;
  --cross-y: 3;
}

.menu-trigger__dot:nth-child(7) {
  --c: 0;
  --r: 2;
  --spread-x: -1;
  --spread-y: 1;
}

.menu-trigger__dot:nth-child(8) {
  --c: 1;
  --r: 2;
  --cross-x: -3;
  --cross-y: -3;
}

.menu-trigger__dot:nth-child(9) {
  --c: 2;
  --r: 2;
  --spread-x: 1;
  --spread-y: 1;
}

/* La grille « respire » : les 4 coins s'écartent d'un pixel. */
.menu-trigger:focus-visible .menu-trigger__dot {
  --dx: var(--spread-x, var(--crossed-x, 0));
  --dy: var(--spread-y, var(--crossed-y, 0));
}

@media (hover: hover) and (pointer: fine) {
  .menu-trigger:hover .menu-trigger__dot {
    --dx: var(--spread-x, var(--crossed-x, 0));
    --dy: var(--spread-y, var(--crossed-y, 0));
  }
}

.menu-trigger:active .menu-trigger__grid {
  scale: 0.86;
}

/* Les milieux rejoignent les diagonales, la grille devient un « × ». */
.menu-trigger--cross .menu-trigger__dot {
  --crossed-x: var(--cross-x, 0);
  --crossed-y: var(--cross-y, 0);
  --dx: var(--crossed-x);
  --dy: var(--crossed-y);
}

/* Le bouton de fermeture du dialog naît en grille et se replie en « × ». */
@starting-style {
  .menu-trigger--cross .menu-trigger__dot {
    translate: 0 0;
  }
}

.menu-trigger__labels {
  display: grid;
}

.menu-trigger__label {
  grid-area: 1 / 1;
}

.menu-trigger--closes .menu-trigger__label--menu,
.menu-trigger:not(.menu-trigger--closes) .menu-trigger__label--close {
  visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .menu-trigger__grid,
  .menu-trigger__dot {
    transition: none;
  }
}

@media (forced-colors: active) {
  .menu-trigger__dot {
    background: CanvasText;
  }
}
</style>
