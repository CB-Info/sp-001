<script setup lang="ts">
/**
 * Points de pagination du deck : un vrai bouton par témoignage (cible de 24 px),
 * le courant porte `aria-current` et s'allonge en barre rouge (forme + couleur :
 * l'état ne repose pas sur la seule couleur).
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
  <div class="dots" role="group" aria-label="Choisir un témoignage">
    <button
      v-for="index in count"
      :key="index"
      ref="buttons"
      type="button"
      class="dots__button"
      :aria-label="`Témoignage ${index} sur ${count}`"
      :aria-current="index - 1 === current || undefined"
      :data-index="index - 1"
      data-dot
      @click="emit('select', index - 1)"
    />
  </div>
</template>

<style scoped>
.dots {
  /* Mesuré : points de 5 à 8 px ; la barre active vaut 3 points. */
  --dot: 0.375rem;
  --dot-bar: 1.125rem;

  display: flex;
}

.dots__button {
  display: grid;
  place-items: center;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  cursor: pointer;
}

.dots__button::before {
  content: '';
  inline-size: var(--dot-inline, var(--dot));
  block-size: var(--dot-block, var(--dot));
  border-radius: var(--dot);
  /* Gris remonté à ≥ 3:1 sur le papier : le point identifie un contrôle (WCAG 1.4.11). */
  background-color: color-mix(in srgb, var(--ink-muted) 75%, var(--bg));
  transition:
    inline-size var(--dur-state) var(--ease-out),
    block-size var(--dur-state) var(--ease-out),
    background-color var(--dur-feedback) var(--ease-out-soft);
}

.dots__button[aria-current='true'] {
  --dot-inline: var(--dot-bar);

  cursor: default;
}

.dots__button[aria-current='true']::before {
  background-color: var(--accent);
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

@media (width >= 64em) {
  .dots {
    flex-direction: column;
  }

  .dots__button[aria-current='true'] {
    --dot-inline: var(--dot);
    --dot-block: var(--dot-bar);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dots__button::before {
    transition: none;
  }
}

@media (forced-colors: active) {
  .dots__button::before {
    background-color: GrayText;
  }

  .dots__button[aria-current='true']::before {
    background-color: Highlight;
  }
}
</style>
