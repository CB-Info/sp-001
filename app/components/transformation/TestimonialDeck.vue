<script setup lang="ts">
import type { Testimonial } from '~/types/content';

/**
 * Deck de témoignages (motif APG « carousel », sans rotation automatique).
 *
 * - Une pile de cartes : la suivante attend derrière la courante ; à l'avance, la
 *   courante sort à gauche et la suivante remonte de la pile. Navigation bornée,
 *   comme la référence : « précédent » désactivé sur le premier, « suivant » sur
 *   le dernier (`aria-disabled` : le bouton garde le focus).
 * - Points, précédent / suivant, ← → (et Début / Fin) quand le focus est dans le
 *   carrousel, balayage horizontal au doigt : tous pilotent le même index.
 * - Les diapositives inactives sont `inert`, posé seulement après l'hydratation :
 *   sans JavaScript, tous les témoignages restent lisibles.
 * - Une zone `aria-live` polie annonce le nouveau témoignage, uniquement après une
 *   action (jamais au chargement).
 *
 * Grille (≥ 64em), pistes en `fr` aux proportions mesurées à 1440 sur 1 320 px :
 * compteur 265 · citation 55 · filet vertical à 320 · écart 48 · pile 762 · points 70 · 120.
 */
const props = defineProps<{ items: Testimonial[]; label: string }>();

const total = props.items.length;
const uid = useId();
const slideIds = props.items.map((_, index) => `${uid}-${index}`).join(' ');

const current = ref(0);
const hydrated = ref(false);
onMounted(() => (hydrated.value = true));

const isFirst = computed(() => current.value === 0);
const isLast = computed(() => current.value === total - 1);

const dots = useTemplateRef<{ focusCurrent: () => void }>('dots');

/* ── Annonce ─────────────────────────────────────────────────────────────── */
const announcement = ref('');
let announceTimer: ReturnType<typeof setTimeout> | undefined;

function announce(index: number) {
  const item = props.items[index];
  if (!item) return;
  clearTimeout(announceTimer);
  // Des appuis rapprochés traversent plusieurs témoignages : on n'annonce que l'arrêt.
  announceTimer = setTimeout(() => {
    announcement.value = `Témoignage ${index + 1} sur ${total}, ${item.author}\u00a0: «\u202f${item.quote}\u202f»`;
  }, 250);
}
onBeforeUnmount(() => clearTimeout(announceTimer));

function goTo(index: number) {
  const target = Math.min(Math.max(index, 0), total - 1);
  if (target === current.value) return;
  current.value = target;
  announce(target);
}

/* ── Clavier ─────────────────────────────────────────────────────────────── */
const keyMoves: Record<string, () => number> = {
  ArrowRight: () => current.value + 1,
  ArrowLeft: () => current.value - 1,
  Home: () => 0,
  End: () => total - 1,
};

async function onKeydown(event: KeyboardEvent) {
  const move = keyMoves[event.key];
  if (!move || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  event.preventDefault();
  goTo(move());
  if ((event.target as Element).closest('[data-dot]')) {
    await nextTick();
    dots.value?.focusCurrent();
  }
}

/* ── Balayage (doigt ou stylet) sur la pile ─────────────────────────────── */
const SWIPE_MIN = 48;
let swipeStart: { x: number; y: number } | undefined;

function onPointerDown(event: PointerEvent) {
  const onPrint = (event.target as Element).closest('[data-print]');
  swipeStart =
    event.pointerType !== 'mouse' && onPrint ? { x: event.clientX, y: event.clientY } : undefined;
}

function onPointerUp(event: PointerEvent) {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  swipeStart = undefined;
  if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
  goTo(current.value + (dx < 0 ? 1 : -1));
}
</script>

<template>
  <!--
    Délégation : les touches viennent des contrôles focalisables du carrousel (points,
    précédent / suivant) ; le balayage double ces mêmes contrôles au doigt.
  -->
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <div
    class="deck"
    role="region"
    aria-roledescription="carrousel"
    :aria-label="label"
    data-motion="testimonial-deck"
    @keydown="onKeydown"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="swipeStart = undefined"
  >
    <div class="deck__aside" aria-hidden="true">
      <slot name="aside" />
    </div>

    <TestimonialSlide
      v-for="(item, index) in items"
      :id="`${uid}-${index}`"
      :key="item.id"
      :testimonial="item"
      :position="index + 1"
      :total="total"
      :offset="index - current"
      :inert="(hydrated && index !== current) || undefined"
    />

    <TestimonialDots
      ref="dots"
      class="deck__dots"
      :count="total"
      :current="current"
      @select="goTo"
    />

    <div class="deck__rule" aria-hidden="true" />

    <div class="deck__controls">
      <TestimonialCounter
        class="deck__counter"
        :current="current"
        :total="total"
        data-motion="testimonial-counter"
      />
      <div class="deck__arrows">
        <IconButton
          class="deck__arrow deck__arrow--prev"
          icon="arrow-bend-back"
          label="Témoignage précédent"
          variant="grey"
          size="sm"
          :disabled="isFirst"
          :aria-controls="slideIds"
          @click="goTo(current - 1)"
        />
        <IconButton
          class="deck__arrow deck__arrow--next"
          icon="arrow-bend"
          label="Témoignage suivant"
          variant="red"
          size="sm"
          :disabled="isLast"
          :aria-controls="slideIds"
          @click="goTo(current + 1)"
        />
      </div>
    </div>

    <p class="visually-hidden" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
  </div>
</template>

<style scoped>
.deck {
  /* Pile (mesurée à 1440) : la carte suivante dépasse de ≈ 40 px, 12,5 % plus étroite. */
  --deck-scale: 0.875;
  --deck-peek: var(--space-24);
  /* Sortie d'une carte : le grand pas de l'escalier (70 px, a6 §3.3). */
  --deck-exit: -4.375rem;
  /* Mobile et tablette : image en 16:9 pleine largeur (a7 §3.7). */
  --print-ratio: 16 / 9;

  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'deck'
    'dots'
    'rule'
    'quote'
    'controls';
  row-gap: var(--space-24);
}

.deck :deep(.testimonial__print) {
  margin-block-end: var(--deck-peek);
}

.deck__aside {
  display: none;
}

.deck__dots {
  grid-area: dots;
  justify-self: center;
}

.deck__rule {
  grid-area: rule;
  block-size: 1px;
  background-color: var(--rule);
}

/* Mobile : une rangée « [‹] 01 / 03 [›] » sous la citation. */
.deck__controls {
  grid-area: controls;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
}

.deck__arrows {
  display: contents;
}

.deck__arrow--prev {
  order: -1;
}

/* Au survol comme au focus, la flèche avance d'un pas dans son sens. */
@media (prefers-reduced-motion: no-preference) {
  .deck__arrow :deep(.icon) {
    transition: translate var(--dur-feedback) var(--ease-out-soft);
  }

  .deck__arrow--prev:not([aria-disabled='true']):focus-visible :deep(.icon) {
    translate: calc(-1 * var(--step-sm-x)) 0;
  }

  .deck__arrow--next:not([aria-disabled='true']):focus-visible :deep(.icon) {
    translate: var(--step-sm-x) 0;
  }
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .deck__arrow--prev:not([aria-disabled='true']):hover :deep(.icon) {
    translate: calc(-1 * var(--step-sm-x)) 0;
  }

  .deck__arrow--next:not([aria-disabled='true']):hover :deep(.icon) {
    translate: var(--step-sm-x) 0;
  }
}

@media (width >= 48em) {
  .deck {
    --deck-peek: var(--space-32);

    row-gap: var(--space-32);
  }
}

@media (width >= 64em) {
  .deck {
    --deck-peek: var(--space-40);
    --print-ratio: initial;

    grid-template-columns:
      minmax(0, 265fr) minmax(0, 55fr) minmax(0, 48fr) minmax(0, 762fr)
      minmax(0, 70fr) minmax(0, 120fr);
    /* Mesuré : ≈ 80 px du filet horizontal au nom. */
    grid-template-rows: auto 1px var(--block-gap) auto;
    grid-template-areas:
      'aside aside . deck dots .'
      'rule rule rule rule rule rule'
      '. . . . . .'
      'counter quote quote quote controls controls';
    row-gap: 0;
  }

  /* Mesuré : pile à ≈ 60 px sous le haut du filet vertical, ≈ 46 px au-dessus du filet horizontal. */
  .deck :deep(.testimonial__print) {
    margin-block: var(--space-60) calc(var(--deck-peek) + var(--space-48));
  }

  /* Colonne gauche : le filet vertical descend jusqu'au filet horizontal. */
  .deck__aside {
    display: block;
    grid-area: aside;
    padding-block-start: var(--space-32);
    border-inline-end: 1px solid var(--rule);
  }

  /* Points centrés sur la pile : carte courante et dépassement de la suivante. */
  .deck__dots {
    align-self: center;
    margin-block: var(--space-60) var(--space-48);
  }

  .deck__controls {
    display: contents;
  }

  .deck__counter {
    grid-area: counter;
    align-self: end;
  }

  .deck__arrows {
    display: flex;
    grid-area: controls;
    align-self: end;
    justify-self: end;
    gap: var(--space-16);
  }

  .deck__arrow--prev {
    order: 0;
  }
}

/* Sans JavaScript, les contrôles n'auraient rien à piloter : les témoignages s'empilent. */
@media (scripting: none) {
  .deck {
    display: flex;
    flex-direction: column;
    gap: var(--block-gap);
  }

  .deck .deck__aside,
  .deck .deck__dots,
  .deck .deck__rule,
  .deck .deck__controls {
    display: none;
  }

  .deck :deep(.testimonial__print) {
    margin: 0;
  }
}
</style>
