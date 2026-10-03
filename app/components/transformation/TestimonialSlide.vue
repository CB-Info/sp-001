<script setup lang="ts">
import type { Testimonial } from '~/types/content';

/**
 * Un témoignage du deck (diapositive APG) : le tirage photo et la citation signée.
 *
 * Toutes les diapositives occupent les mêmes cellules : chacune est une sous-grille
 * qui couvre la grille du deck et range son tirage dans la zone `deck`, sa citation
 * dans la zone `quote`. La hauteur suit donc le témoignage le plus long et ne
 * change jamais d'une diapositive à l'autre (CLS nul).
 *
 * `offset` = position relative à la diapositive courante ; il fixe la place dans
 * la pile : courante (0), suivante visible derrière (1), en attente plus bas,
 * cachée (> 1), sortie à gauche (< 0).
 */
const props = defineProps<{
  testimonial: Testimonial;
  position: number;
  total: number;
  offset: number;
}>();

const state = computed(() => {
  if (props.offset === 0) return 'current';
  if (props.offset === 1) return 'next';
  return props.offset < 0 ? 'past' : 'queued';
});
</script>

<template>
  <div
    class="testimonial"
    role="group"
    aria-roledescription="témoignage"
    :aria-label="`${position} sur ${total}`"
    :data-state="state"
  >
    <TestimonialPrint
      class="testimonial__print"
      :image="testimonial.image"
      data-motion="testimonial-card"
    />

    <figure class="testimonial__body">
      <figcaption class="testimonial__author">{{ testimonial.author }}</figcaption>
      <blockquote class="testimonial__quote" data-motion="testimonial-quote">
        <p class="testimonial__text">{{ testimonial.quote }}</p>
      </blockquote>
    </figure>
  </div>
</template>

<style scoped>
.testimonial {
  display: grid;
  grid-row: 1 / -1;
  grid-column: 1 / -1;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  /* La sous-grille couvre tout le deck : seuls ses contenus captent le pointeur. */
  pointer-events: none;
}

.testimonial > * {
  pointer-events: auto;
}

/* ── Tirage : la pile ────────────────────────────────────────────────────── */
.testimonial__print {
  grid-area: deck;
  /* La carte réduite reste posée sur le bas de la pile et centrée. */
  transform-origin: 50% 100%;
  transition:
    translate var(--dur-layout) var(--ease-out),
    scale var(--dur-layout) var(--ease-out),
    opacity var(--dur-layout) var(--ease-out-soft),
    visibility 0s;
}

.testimonial[data-state='current'] .testimonial__print {
  z-index: 2;
}

/* Mesuré : la carte suivante dépasse sous la courante, 12,5 % plus étroite, photo dans l'ombre. */
.testimonial[data-state='next'] .testimonial__print {
  --print-shade: 0.72;

  z-index: 1;
  translate: 0 var(--deck-peek);
  scale: var(--deck-scale);
}

/* Plus bas dans la pile : prête à remonter d'un cran, invisible. */
.testimonial[data-state='queued'] .testimonial__print {
  --print-shade: 1;

  z-index: 0;
  translate: 0 calc(2 * var(--deck-peek));
  scale: calc(var(--deck-scale) * var(--deck-scale));
  opacity: 0;
  visibility: hidden;
  transition-delay: 0s, 0s, 0s, var(--dur-layout);
}

/* Sortie : la carte quitte la pile vers la gauche, plus vite qu'une arrivée. */
.testimonial[data-state='past'] .testimonial__print {
  z-index: 3;
  translate: var(--deck-exit) 0;
  opacity: 0;
  visibility: hidden;
  transition:
    translate var(--dur-state) var(--ease-in),
    opacity var(--dur-state) var(--ease-in),
    visibility 0s linear var(--dur-state);
}

/*
 * ── Citation : fondu enchaîné, décalée d'un pas dans le sens de la lecture ──
 * Les citations partagent la même cellule : la sortante s'efface d'abord (140 ms),
 * l'entrante attend ce délai pour ne jamais se superposer à elle.
 */
.testimonial__body {
  grid-area: quote;
  align-self: start;
  transition:
    opacity var(--dur-layout) var(--ease-out-soft) var(--dur-feedback),
    translate var(--dur-layout) var(--ease-out) var(--dur-feedback),
    visibility 0s;
}

.testimonial:not([data-state='current']) .testimonial__body {
  opacity: 0;
  translate: 0 var(--step-md-x);
  visibility: hidden;
  transition:
    opacity var(--dur-feedback) var(--ease-out-soft),
    translate var(--dur-state) var(--ease-in),
    visibility 0s linear var(--dur-state);
}

.testimonial[data-state='past'] .testimonial__body {
  translate: 0 calc(-1 * var(--step-md-x));
}

.testimonial__author {
  font-family: var(--font-display);
  font-size: var(--text-body);
  font-weight: 600;
  line-height: 1.2;
  color: var(--ink);
}

/* Mesuré : ≈ 40 px de la ligne de base du nom au haut des capitales de la citation. */
.testimonial__quote {
  margin-block-start: var(--space-32);
}

/* Mesuré : 716 px pour 28 px de corps, soit ≈ 26 em ; guillemets français, l'ouvrant en retrait. */
.testimonial__text {
  position: relative;
  max-inline-size: 26em;
  font-size: var(--text-quote);
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: var(--ink-muted);
  quotes: '«\202F' '\202F»';
}

.testimonial__text::before {
  content: open-quote;
  position: absolute;
  inset-inline-end: 100%;
}

.testimonial__text::after {
  content: close-quote;
}

@media (width >= 64em) {
  /* Le compteur et les contrôles se calent en bas : la citation aussi. */
  .testimonial__body {
    align-self: end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .testimonial .testimonial__print,
  .testimonial .testimonial__body {
    transition: none;
  }
}

/*
 * Sans JavaScript, les témoignages se lisent les uns sous les autres, tous visibles
 * (sélecteurs à `[data-state]` : ils doivent l'emporter sur chaque état de la pile).
 */
@media (scripting: none) {
  .testimonial {
    grid-template-rows: none;
    grid-template-columns: none;
    gap: var(--space-24) var(--block-gap);
  }

  .testimonial[data-state] .testimonial__print,
  .testimonial[data-state] .testimonial__body {
    --print-shade: 0;

    grid-area: auto;
    translate: none;
    scale: none;
    opacity: 1;
    visibility: visible;
  }
}

/* Sur grand écran : le tirage à gauche, la citation à droite, calée en bas. */
@media (scripting: none) and (width >= 64em) {
  .testimonial {
    grid-template-columns: minmax(0, 762fr) minmax(0, 558fr);
    align-items: end;
  }
}
</style>
