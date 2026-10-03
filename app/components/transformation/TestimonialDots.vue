<script setup lang="ts">
import { ui } from '~/data/ui';

/**
 * Points de pagination du deck : un vrai bouton par témoignage (cible de 24 px),
 * le courant porte `aria-current` et une barre rouge le recouvre (forme + couleur :
 * l'état ne repose pas sur la seule couleur). La barre glisse d'un point à l'autre
 * dès l'appui (une seule couche animée, en `translate`), au même pas que le compteur.
 *
 * Verticaux à côté de la pile (≥ 64em, même palier que le deck), horizontaux sous
 * l'image en dessous.
 */
const props = defineProps<{ count: number; current: number }>();
const emit = defineEmits<{ select: [index: number] }>();

const buttons = useTemplateRef<HTMLButtonElement[]>('buttons');

/** Le focus suit le témoignage affiché quand on le change au clavier depuis un point. */
function focusCurrent() {
  buttons.value?.find((button) => Number(button.dataset.index) === props.current)?.focus();
}

defineExpose({ focusCurrent });
</script>

<template>
  <div
    class="dots"
    role="group"
    :aria-label="ui.testimonials.choose"
    :style="{ '--current': current }"
  >
    <button
      v-for="index in count"
      :key="index"
      ref="buttons"
      type="button"
      class="dots__button"
      :aria-label="ui.testimonials.dot(index, count)"
      :aria-current="index - 1 === current || undefined"
      :data-index="index - 1"
      data-dot
      @click="emit('select', index - 1)"
    />
    <span class="dots__bar" aria-hidden="true" />
  </div>
</template>

<style scoped>
.dots {
  /* Mesuré : points de 5 à 8 px ; la barre active vaut 3 points. */
  --dot: 0.375rem;
  --dot-bar: 1.125rem;
  --dot-cell: 1.5rem;

  position: relative;
  display: flex;
}

.dots__button {
  display: grid;
  place-items: center;
  inline-size: var(--dot-cell);
  block-size: var(--dot-cell);
  cursor: pointer;
}

.dots__button::before {
  content: '';
  inline-size: var(--dot);
  block-size: var(--dot);
  border-radius: var(--dot);
  /* Gris remonté à ≥ 3:1 sur le papier : le point identifie un contrôle (WCAG 1.4.11). */
  background-color: color-mix(in srgb, var(--ink-muted) 75%, var(--bg));
  transition: background-color var(--dur-feedback) var(--ease-out-soft);
}

.dots__button[aria-current='true'] {
  cursor: default;
}

.dots__button:focus-visible {
  outline-offset: 0;
}

.dots__button:not([aria-current='true']):focus-visible::before {
  background-color: var(--ink);
}

@media (hover: hover) and (pointer: fine) {
  .dots__button:not([aria-current='true']):hover::before {
    background-color: var(--ink);
  }
}

/* Barre du point courant : une cellule de bouton, décalée d'autant de cellules que l'index. */
.dots__bar {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  display: grid;
  place-items: center;
  inline-size: var(--dot-cell);
  block-size: var(--dot-cell);
  pointer-events: none;
  translate: calc(var(--current) * 100%) 0;
  transition: translate var(--dur-layout) var(--ease-out);
}

.dots__bar::before {
  content: '';
  inline-size: var(--dot-bar);
  block-size: var(--dot);
  border-radius: var(--dot);
  background-color: var(--accent);
}

@media (width >= 64em) {
  .dots {
    flex-direction: column;
  }

  .dots__bar {
    translate: 0 calc(var(--current) * 100%);
  }

  .dots__bar::before {
    inline-size: var(--dot);
    block-size: var(--dot-bar);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dots__button::before,
  .dots__bar {
    transition: none;
  }
}

@media (forced-colors: active) {
  .dots__button::before {
    background-color: GrayText;
  }

  .dots__bar::before {
    background-color: Highlight;
  }
}
</style>
