<script setup lang="ts">
import type { Testimonial } from '~/types/content';
import { ui } from '~/data/ui';
import { loadSplitText } from '~/motion/gsap';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, stagger } from '~/motion/tokens';

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
    announcement.value = ui.testimonials.announce(index + 1, total, item.author, item.quote);
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

/*
 * ── Mouvement (docs/analyse/annexes/a6-motion.md §4.6) ─────────────────────
 * Les poses de repos restent celles du CSS (TestimonialSlide) : GSAP ne joue que
 * le passage de l'une à l'autre, puis rend la main (clearProps).
 *
 * - Entrée, une fois : la pile se donne. Chaque carte visible part de la place de
 *   celle qui la suit et monte d'un cran, la plus haute d'abord.
 * - Changement, en deux temps (« vitesse → arrêt ») : ce qui part accélère
 *   (--ease-in, --dur-state), puis ce qui arrive se pose (--ease-out, --dur-layout).
 *   Chaque carte qui change de place part de la pose qu'elle affiche (au repos ou
 *   en vol) : une commande en cours de route reprend chaque carte où elle en est,
 *   sans file d'attente.
 * - Citation : ses lignes sortent par le haut de leur masque, puis celles de la
 *   suivante montent ; en reculant, tout descend.
 * - Compteur et points glissent en CSS, dès l'appui (TestimonialCounter, TestimonialDots).
 */
const deck = useTemplateRef<HTMLElement>('deck');

/** Ce que le CSS de la pile fait varier d'une carte à l'autre. */
const POSE = 'transform,opacity,visibility,--print-shade';

interface Pose {
  x: number;
  y: number;
  scale: number;
  autoAlpha: number;
  '--print-shade': number;
}

/** La pose qu'une carte affiche : son repos, ou le point où en est son passage. */
function readPose(card: HTMLElement): Pose {
  const style = getComputedStyle(card);
  const { m41: x, m42: y, a: scale } = new DOMMatrixReadOnly(style.transform);
  return {
    x,
    y,
    scale,
    autoAlpha: Number(style.opacity),
    '--print-shade': Number(style.getPropertyValue('--print-shade')),
  };
}

type SplitTextClass = Awaited<ReturnType<typeof loadSplitText>>;

useMotion(deck, ({ gsap }, root) => {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-motion="testimonial-slide"]')];
  const cards = [...root.querySelectorAll<HTMLElement>('[data-motion="testimonial-card"]')];
  const quotes = [...root.querySelectorAll<HTMLElement>('[data-motion="testimonial-quote"]')];
  const layout = duration('--dur-layout');
  const cascade = capped(stagger('--stagger-list'));

  /* ── Entrée : la pile se donne, une fois ─────────────────────────────── */
  // Déjà à l'écran quand GSAP arrive (ancre, rechargement) : l'état final reste.
  if (!reached(root)) {
    const rest = cards.map(readPose);
    const deal = gsap.timeline({ scrollTrigger: { trigger: root, ...ENTRY } });
    const focal = duration('--dur-focal');
    let dealt = 0;
    cards.forEach((card, index) => {
      const deeper = rest[index + 1];
      if (!deeper || !rest[index]?.autoAlpha) return;
      deal.from(card, { ...deeper, duration: focal, clearProps: POSE }, cascade(dealt++));
    });
  }

  /* ── Cartes : de la pose affichée à la nouvelle pose de repos ─────────── */
  /** Premier temps d'un changement : ce qui part a quitté la vue. */
  const exit = duration('--dur-state');
  let shown: Pose[] = [];
  let places: (string | undefined)[] = [];

  function moveCards(to: number, forward: boolean) {
    // En avançant, la carte du dessus part d'abord : celles qui montent attendent
    // qu'elle ait quitté la pile, sinon elle couvrirait leur montée. Sur un saut, la
    // nouvelle courante vient d'en dessous, invisible : elle monte aussitôt, sous les
    // cartes qui partent (la pile ne reste jamais vide). En reculant, la carte revient
    // par-dessus : rien n'attend.
    const wait = forward && shown[to]?.autoAlpha ? exit : 0;
    cards.forEach((card, index) => {
      const from = shown[index];
      if (!from || slides[index]?.dataset.state === places[index]) return;
      gsap.killTweensOf(card);
      gsap.set(card, { clearProps: POSE });
      const rest = readPose(card);
      const leaves = rest.autoAlpha === 0;
      gsap.fromTo(card, from, {
        ...rest,
        duration: leaves ? exit : layout,
        ease: leaves ? 'in' : 'out',
        delay: leaves ? 0 : wait,
        clearProps: POSE,
      });
    });
  }

  /* ── Citation : ligne à ligne, dans des masques ──────────────────────── */
  // Chargé à part ; tant qu'il manque, la citation change sans animation.
  let SplitText: SplitTextClass | undefined;
  loadSplitText().then((loaded) => (SplitText = loaded));
  /** Le changement de citation en cours, jusqu'à ce que ses lignes soient recollées. */
  let quoteChange: gsap.core.Timeline | undefined;

  /** Le nom et le texte d'une citation, en lignes masquées, le temps d'un passage. */
  function splitLines(Split: SplitTextClass, figure: HTMLElement) {
    const split = Split.create(figure.querySelectorAll('figcaption, p'), {
      type: 'lines',
      mask: 'lines',
      linesClass: 'quote-line',
      // En <span> : contenu valide d'un <p>, et les mots se mesurent tels qu'ils sont posés.
      tag: 'span',
      // Les insécables (« à ma place ») restent insécables : mêmes coupures qu'au repos.
      reduceWhiteSpace: false,
      // Le texte reste dans le DOM, dans l'ordre : il se lit d'un seul tenant. Un
      // aria-label sur <p> serait ignoré (rôle paragraph) et masquerait la citation.
      aria: 'none',
    });
    // Le masque ne coupe qu'en hauteur : le guillemet ouvrant déborde à gauche.
    gsap.set(split.masks, { overflowX: 'visible' });
    return split;
  }

  function changeQuote(from: number, to: number, forward: boolean) {
    // Un changement en cours va au bout. S'il n'avait pas fini, la citation qu'il
    // amenait s'efface d'un coup et la suivante entre aussitôt : jamais d'attente.
    const interrupted = quoteChange !== undefined;
    quoteChange?.progress(1);
    const leaving = quotes[from];
    const arriving = quotes[to];
    if (!SplitText || !leaving || !arriving) return;

    // En avançant, les lignes sortent par le haut et les suivantes montent ; l'inverse en reculant.
    const away = forward ? -100 : 100;
    const into = splitLines(SplitText, arriving);
    const splits = [into];
    const timeline = gsap.timeline({
      onComplete: () => {
        for (const split of splits) split.revert();
        gsap.set(leaving, { clearProps: 'opacity,visibility' });
        quoteChange = undefined;
      },
    });
    let entry = 0;
    if (!interrupted) {
      const out = splitLines(SplitText, leaving);
      splits.push(out);
      // Elle n'est plus la courante (cachée en CSS) : visible le temps de sortir.
      gsap.set(leaving, { autoAlpha: 1 });
      timeline.to(out.lines, { yPercent: away, duration: exit, ease: 'in' }, 0);
      entry = exit;
    }
    timeline.from(into.lines, { yPercent: -away, duration: layout, stagger: cascade }, entry);
    quoteChange = timeline;
  }

  /* ── Branchement sur l'index courant ─────────────────────────────────── */
  // Avant le rendu : ce que chaque carte affiche, et sa place dans la pile.
  const stopBefore = watch(
    current,
    () => {
      shown = cards.map(readPose);
      places = slides.map((slide) => slide.dataset.state);
    },
    { flush: 'pre' },
  );
  // Après : les places ont changé, le CSS donne les nouvelles poses de repos.
  const stopAfter = watch(
    current,
    (to, from) => {
      const forward = to > from;
      moveCards(to, forward);
      changeQuote(from, to, forward);
    },
    { flush: 'post' },
  );

  // Mouvement réduit ou démontage : tout revient à l'état de repos, sur-le-champ.
  return () => {
    stopBefore();
    stopAfter();
    quoteChange?.progress(1);
    for (const card of cards) gsap.killTweensOf(card);
    gsap.set(cards, { clearProps: POSE });
  };
});
</script>

<template>
  <!--
    Délégation : les touches viennent des contrôles focalisables du carrousel (points,
    précédent / suivant) ; le balayage double ces mêmes contrôles au doigt.
  -->
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <div
    ref="deck"
    class="deck"
    role="region"
    :aria-roledescription="ui.carousel"
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
          :label="ui.testimonials.previous"
          variant="grey"
          size="sm"
          :disabled="isFirst"
          :aria-controls="slideIds"
          @click="goTo(current - 1)"
        />
        <IconButton
          class="deck__arrow deck__arrow--next"
          icon="arrow-bend"
          :label="ui.testimonials.next"
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
  --deck-exit: calc(var(--step-xl) * -1);
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
  /*
   * Balayage : le navigateur garde le défilement vertical et le zoom, et laisse le
   * geste horizontal au deck (sinon il le prend pour un défilement : pointercancel).
   */
  touch-action: pan-y pinch-zoom;
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
