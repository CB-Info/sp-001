<script setup lang="ts">
import type { Service } from '~/types/content';

/**
 * Carrousel des services (motif APG « carousel », sans rotation automatique).
 *
 * Un rail natif à aimantation, bord à bord : la carte la plus proche de l'axe est
 * active. Sur bureau, l'unité « tuile + carte active » est centrée sur la page
 * (mesuré : centre à 720 px sur 1440) et les cartes qui précèdent l'active glissent
 * d'un cran pour lui ouvrir la fente où se loge la tuile « Service suivant ».
 * Sur mobile, cartes à 84 % calées au début, précédent / suivant et compteur dessous.
 *
 * Clavier : ← → (et Début / Fin) dès que le focus est dans le carrousel.
 * Pointeur : un clic sur une carte voisine l'amène au centre.
 */
const props = withDefaults(defineProps<{ items: Service[]; initial?: number }>(), { initial: 1 });

const total = props.items.length;
const trackId = useId();
const scroller = useTemplateRef<HTMLElement>('scroller');
const { active, goTo, next, previous } = useSnapRail(scroller, {
  count: total,
  initial: props.initial,
  slideSelector: '[data-slide]',
});

const pad = (value: number) => String(value).padStart(2, '0');
const counter = computed(() => `${pad(active.value + 1)} / ${pad(total)}`);

/* Annonce polie, seulement après une action (l'index initial ne déclenche rien). */
const announcement = ref('');
let announceTimer: ReturnType<typeof setTimeout> | undefined;
watch(active, (index) => {
  clearTimeout(announceTimer);
  // Un défilement rapide traverse plusieurs cartes : on n'annonce que l'arrêt.
  announceTimer = setTimeout(() => {
    announcement.value = `Service ${index + 1} sur ${total} : ${props.items[index]?.title}`;
  }, 250);
});
onBeforeUnmount(() => clearTimeout(announceTimer));

/*
 * La fente ne s'anime que pendant un changement de carte. Une transition
 * permanente sur le décalage fait perdre à Chromium sa position d'aimantation
 * lors d'un redimensionnement brusque (bascule de point de rupture, capture).
 */
const moving = ref(false);
let movingTimer: ReturnType<typeof setTimeout> | undefined;
watch(active, () => {
  moving.value = true;
  clearTimeout(movingTimer);
  movingTimer = setTimeout(() => (moving.value = false), 1000);
});
onBeforeUnmount(() => clearTimeout(movingTimer));

const keyMoves: Record<string, () => number> = {
  ArrowRight: () => active.value + 1,
  ArrowLeft: () => active.value - 1,
  Home: () => 0,
  End: () => total - 1,
};

function onKeydown(event: KeyboardEvent) {
  const move = keyMoves[event.key];
  if (!move || event.altKey || event.ctrlKey || event.metaKey) return;
  event.preventDefault();
  goTo(move());
}

function onClick(event: MouseEvent) {
  const slide = (event.target as Element).closest<HTMLElement>('[data-slide]');
  const index = Number(slide?.dataset.slide ?? active.value);
  if (index !== active.value) goTo(index);
}
</script>

<template>
  <div
    class="service-carousel"
    role="region"
    aria-roledescription="carrousel"
    aria-label="Services"
    :data-moving="moving || undefined"
    @keydown="onKeydown"
    @click="onClick"
  >
    <IconButton
      class="service-carousel__tile"
      icon="arrow-bend"
      label="Service suivant"
      variant="red"
      size="lg"
      :aria-controls="trackId"
      :style="{ '--tile': 'var(--rail-tile)' }"
      data-motion="services-arrow"
      @click="next"
    />

    <div
      ref="scroller"
      class="service-carousel__viewport"
      role="group"
      aria-label="Liste des services"
      tabindex="0"
    >
      <div :id="trackId" class="service-carousel__track">
        <div
          v-for="(service, index) in items"
          :key="service.id"
          class="service-carousel__slide"
          role="group"
          aria-roledescription="service"
          :aria-label="`${index + 1} sur ${total}`"
          :aria-current="index === active || undefined"
          :data-slide="index"
          data-motion="services-card"
        >
          <ServiceCard
            class="service-carousel__card"
            :class="{ 'service-carousel__card--before': index < active }"
            :service="service"
            :active="index === active"
          />
        </div>
      </div>
    </div>

    <div class="service-carousel__pager">
      <IconButton
        icon="arrow-bend-back"
        label="Service précédent"
        variant="grey"
        :aria-controls="trackId"
        @click="previous"
      />
      <p class="service-carousel__counter" aria-hidden="true">{{ counter }}</p>
      <IconButton
        icon="arrow-bend"
        label="Service suivant"
        variant="red"
        :aria-controls="trackId"
        @click="next"
      />
    </div>

    <p class="visually-hidden" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
  </div>
</template>

<style scoped>
.service-carousel {
  /*
   * Géométrie du rail (mesurée à 1440) : cartes de 634 px, tuile de 77 px
   * (+ son gradin), fente de 134 px entre la carte précédente et l'active.
   * La fente vaut la tuile, son gradin et une gouttière de part et d'autre.
   */
  --rail-card: 84cqi;
  --rail-tile: clamp(3.5rem, 2.54rem + 2.53vw, 4.8125rem);
  --rail-slot: calc(var(--rail-tile) + var(--step-lg-x) + var(--gap));
  /* Réserve autour des cartes pour l'anneau de focus du rail. */
  --rail-ring: var(--space-8);

  container-type: inline-size;
  position: relative;
}

.service-carousel__viewport {
  position: relative;
  overflow: auto hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--page-gutter);
  scrollbar-width: none;
  margin-block: calc(-1 * var(--rail-ring));
  padding-block: var(--rail-ring);
}

.service-carousel__viewport::-webkit-scrollbar {
  display: none;
}

.service-carousel__viewport:focus-visible {
  outline-offset: -2px;
}

.service-carousel__track {
  display: flex;
  /* Mobile : gouttière de page entre les cartes, la précédente sort entièrement du cadre. */
  gap: var(--page-gutter);
  inline-size: max-content;
  /* Fin : assez de place pour que la dernière carte se cale au début. */
  padding-inline: var(--page-gutter) calc(100cqi - var(--rail-card) - var(--page-gutter));
}

.service-carousel__slide {
  display: flex;
  flex: none;
  inline-size: var(--rail-card);
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.service-carousel__slide:not([aria-current]) {
  cursor: pointer;
}

.service-carousel__card {
  flex: 1;
}

.service-carousel[data-moving] .service-carousel__card {
  transition: translate var(--dur-layout) var(--ease-out);
}

.service-carousel__tile {
  display: none;
}

.service-carousel__pager {
  display: flex;
  align-items: center;
  gap: var(--space-16);
  margin-block-start: var(--space-24);
  padding-inline: var(--page-gutter);
}

.service-carousel__counter {
  min-inline-size: 7ch;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: center;
  color: var(--ink);
}

@media (width >= 48em) {
  .service-carousel {
    --rail-card: clamp(26rem, 44cqi, 39.625rem);
  }

  .service-carousel__viewport {
    scroll-padding-inline: 0;
  }

  .service-carousel__track {
    gap: var(--gap);
    padding-inline:
      calc(50cqi + (var(--rail-slot) - var(--rail-card)) / 2)
      calc(50cqi - (var(--rail-slot) + var(--rail-card)) / 2);
  }

  /* La zone d'aimantation inclut la fente : l'unité tuile + carte est centrée. */
  .service-carousel__slide {
    scroll-margin-inline-start: var(--rail-slot);
    scroll-snap-align: center;
  }

  /* Les cartes qui précèdent l'active glissent d'un cran : la fente s'ouvre. */
  .service-carousel__card--before {
    translate: calc(-1 * var(--rail-slot)) 0;
  }

  /* La tuile reste dans la fente, à gauche de la carte active, alignée en haut. */
  .service-carousel__tile {
    display: inline-flex;
    position: absolute;
    z-index: 1;
    inset-block-start: 0;
    inset-inline-start: calc(50cqi - (var(--rail-slot) + var(--rail-card)) / 2);
  }

  .service-carousel__pager {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-carousel[data-moving] .service-carousel__card {
    transition: none;
  }
}
</style>
