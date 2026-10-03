<script setup lang="ts">
import type { Testimonial } from '~/types/content';
import { ui } from '~/data/ui';

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
 * cachée (> 1), sortie à gauche (< 0). Ces poses de repos sont l'état final ; le
 * deck anime le passage de l'une à l'autre (TestimonialDeck).
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
    :aria-roledescription="ui.testimonials.slide"
    :aria-label="ui.testimonials.position(position, total)"
    :data-state="state"
    :style="{ '--offset': offset }"
    data-motion="testimonial-slide"
  >
    <TestimonialPrint
      class="testimonial__print"
      :image="testimonial.image"
      data-motion="testimonial-card"
    />

    <figure class="testimonial__body" data-motion="testimonial-quote">
      <figcaption class="testimonial__author">{{ testimonial.author }}</figcaption>
      <blockquote class="testimonial__quote">
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

/*
 * ── Tirage : la pile ────────────────────────────────────────────────────────
 * Poses en `transform` : celle de GSAP la remplace le temps d'un passage, puis
 * s'efface (clearProps) et rend la main à la pose de repos.
 */
.testimonial__print {
  --print-shade: 0;

  grid-area: deck;
  /*
   * La plus haute de la pile passe devant ; les cartes sorties, devant elle, la
   * première sortie en tête : un saut de plusieurs témoignages garde son ordre.
   */
  z-index: calc(2 - var(--offset));
  /* La carte réduite reste posée sur le bas de la pile et centrée. */
  transform-origin: 50% 100%;
}

/* Mesuré : la carte suivante dépasse sous la courante, 12,5 % plus étroite, photo dans l'ombre. */
.testimonial[data-state='next'] .testimonial__print {
  --print-shade: 0.72;

  transform: translateY(var(--deck-peek)) scale(var(--deck-scale));
}

/* Plus bas dans la pile : prête à remonter d'un cran, invisible. */
.testimonial[data-state='queued'] .testimonial__print {
  --print-shade: 1;

  transform: translateY(calc(2 * var(--deck-peek)))
    scale(calc(var(--deck-scale) * var(--deck-scale)));
  opacity: 0;
  visibility: hidden;
}

/* Sortie : la carte a quitté la pile vers la gauche. */
.testimonial[data-state='past'] .testimonial__print {
  transform: translateX(var(--deck-exit));
  opacity: 0;
  visibility: hidden;
}

/* ── Citation : seule la courante se lit ; elles partagent la même cellule ── */
.testimonial__body {
  grid-area: quote;
  align-self: start;
}

.testimonial:not([data-state='current']) .testimonial__body {
  opacity: 0;
  visibility: hidden;
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

/*
 * Changement de citation : le temps du passage, le nom et le texte sont découpés
 * en lignes masquées (SplitText, voir TestimonialDeck). Les guillemets suivent alors
 * la première et la dernière ligne au lieu de rester sur place ; les mêmes glyphes
 * aux mêmes endroits, la mise en ligne ne bouge pas.
 */
.testimonial__body :deep(.quote-line),
.testimonial__body :deep(.quote-line-mask) {
  display: block;
}

.testimonial__text :deep(.quote-line) {
  position: relative;
}

.testimonial__text:has(.quote-line)::before,
.testimonial__text:has(.quote-line)::after {
  content: none;
}

.testimonial__text :deep(.quote-line-mask:first-child .quote-line)::before {
  content: open-quote;
  position: absolute;
  inset-inline-end: 100%;
}

.testimonial__text :deep(.quote-line-mask:last-child .quote-line)::after {
  content: close-quote;
}

@media (width >= 64em) {
  /* Le compteur et les contrôles se calent en bas : la citation aussi. */
  .testimonial__body {
    align-self: end;
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
    transform: none;
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
