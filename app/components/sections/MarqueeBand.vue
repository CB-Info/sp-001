<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Bandeau défilant « Fitness Hub ✱ » : la charnière rouge avant le footer.
 *
 * - La bande visible est un décor répété : entièrement `aria-hidden`.
 * - Deux groupes identiques sur une piste ; la piste glisse de −50 %, donc d'un
 *   groupe exact, en boucle sans couture. Chaque groupe couvre plus de 2 560 px.
 * - Arrêt au survol (pointeur fin) et bouton Pause / Lecture (WCAG 2.2.2, brief :
 *   « marquee arrêtable »). Le bouton n'est rendu qu'après l'hydratation : sans
 *   JavaScript, il ne serait qu'un contrôle mort.
 * - `data-paused` est le contrat d'état : la couche de mouvement (vitesse liée au
 *   défilement) le lira pour rester à l'arrêt.
 * - Mouvement réduit : bande immobile, bouton retiré.
 */
defineProps<{ content: HomeContent['marquee'] }>();

/* mesuré : un motif tous les ≈ 183 px à 1440 ; 14 motifs = 2 562 px par groupe. */
const ITEMS_PER_GROUP = 14;

const paused = ref(false);
const hydrated = ref(false);
onMounted(() => (hydrated.value = true));
</script>

<template>
  <div
    class="marquee"
    data-surface="signal"
    data-motion="marquee"
    :data-paused="paused ? '' : undefined"
  >
    <div class="marquee__viewport" aria-hidden="true">
      <div class="marquee__track" data-motion="marquee-track">
        <div v-for="group in 2" :key="group" class="marquee__group">
          <span v-for="item in ITEMS_PER_GROUP" :key="item" class="marquee__item">
            <span :lang="content.lang">{{ content.text }}</span>
            <Asterisk class="marquee__asterisk" size="0.6em" />
          </span>
        </div>
      </div>
    </div>

    <button
      v-if="hydrated"
      type="button"
      class="marquee__toggle"
      :aria-pressed="paused"
      @click="paused = !paused"
    >
      <Icon :name="paused ? 'play' : 'pause'" size="1.25rem" />
      <span class="visually-hidden">Mettre en pause le bandeau défilant</span>
    </button>
  </div>
</template>

<style scoped>
.marquee {
  /*
   * mesuré @1440 : bande de ≈ 50 px, « Fitness Hub » en Tektur 500 ≈ 20 px, astérisque
   * de ≈ 12 px, pas de ≈ 183 px (115,8 de texte + 12 + 2 × 27,5). 44 px minimum en
   * mobile : la bande porte la cible tactile du bouton.
   */
  --marquee-size: clamp(2.75rem, 2.5714rem + 0.7143vw, 3.125rem);
  --marquee-text: clamp(1rem, 0.9071rem + 0.381vw, 1.25rem);
  /* 70 px/s à 1440 : 2 562 px par groupe / 70 = 36,6 s (plus lent en mobile, voulu). */
  --marquee-duration: 36.6s;

  position: relative;
  overflow: clip;
  block-size: var(--marquee-size);
  padding-inline: env(safe-area-inset-left, 0px) env(safe-area-inset-right, 0px);
}

.marquee__viewport {
  block-size: 100%;
}

.marquee__track {
  display: flex;
  inline-size: max-content;
  block-size: 100%;
  animation: marquee-scroll var(--marquee-duration) linear infinite;
}

.marquee__group {
  display: flex;
  flex: none;
}

.marquee__item {
  display: flex;
  align-items: center;
  gap: 1.375em;
  padding-inline-end: 1.375em;
  font-family: var(--font-display);
  font-size: var(--marquee-text);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.marquee__asterisk {
  flex: none;
}

.marquee[data-paused] .marquee__track {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  to {
    translate: -50% 0;
  }
}

/* Le bouton coiffe l'extrémité de la bande ; le texte s'efface sous un fondu. */
.marquee__toggle {
  position: absolute;
  inset-block: 0;
  inset-inline-end: env(safe-area-inset-right, 0px);
  display: grid;
  place-items: center;
  inline-size: var(--marquee-size);
  background: var(--bg);
  color: var(--ink);
  cursor: pointer;
  transition: background-color var(--dur-feedback) var(--ease-out-soft);
}

.marquee__toggle::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-end: 100%;
  inline-size: 2.5rem;
  background: linear-gradient(to right, transparent, var(--bg));
  pointer-events: none;
}

.marquee__toggle :deep(.icon) {
  transition: scale var(--dur-press) linear;
}

.marquee__toggle:active :deep(.icon) {
  scale: 0.85;
}

.marquee__toggle:focus-visible {
  outline-offset: -6px;
}

@media (hover: hover) and (pointer: fine) {
  .marquee__viewport:hover .marquee__track {
    animation-play-state: paused;
  }

  .marquee__toggle:hover {
    background: var(--accent-fill-hover);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
  }

  .marquee__toggle {
    display: none;
  }
}

@media (forced-colors: active) {
  .marquee__toggle {
    border-inline-start: 1px solid ButtonText;
  }
}
</style>
