<script setup lang="ts">
import type { HomeContent } from '~/types/content';
import { ui } from '~/data/ui';
import { hasFinePointer } from '~/motion/env';
import { followScroll, requestTick, scroll } from '~/motion/scroll';

/**
 * Bandeau défilant « Fitness Hub ✱ » : la charnière rouge avant le footer.
 *
 * - La bande visible est un décor répété : entièrement `aria-hidden`.
 * - Deux groupes identiques sur une piste ; la piste glisse de −50 %, donc d'un
 *   groupe exact, en boucle sans couture. Chaque groupe couvre plus de 2 560 px.
 * - Arrêt au survol (pointeur fin) et bouton Pause / Lecture (WCAG 2.2.2, brief :
 *   « marquee arrêtable »). Le bouton n'est rendu qu'après l'hydratation : sans
 *   JavaScript, il ne serait qu'un contrôle mort.
 * - `data-paused` est le contrat d'état de la boucle CSS ; la couche de mouvement
 *   lit le même état (`paused`), qui l'emporte sur tout le reste.
 * - Mouvement réduit : bande immobile, bouton retiré.
 *
 * Mouvement (a6 §4.7) : la boucle CSS tient la bande tant que la couche de
 * mouvement n'a pas pris la main. Ensuite, la bande repart de la phase où la
 * boucle l'a laissée et sa vitesse suit celle du défilement :
 * base × (1 + min(|v| × gain, 4)), soit ×5 au plus, dans le sens du défilement,
 * lissée. Le bouton Pause l'arrête de tout ; le survol n'arrête que la base (le
 * défilement l'entraîne encore). Rien ne tourne hors de l'écran ni dans un onglet
 * masqué. Pas d'inclinaison : elle déformerait la typo carrée.
 */
defineProps<{ content: HomeContent['marquee'] }>();

/* mesuré : un motif tous les ≈ 183 px à 1440 ; 14 motifs = 2 562 px par groupe. */
const ITEMS_PER_GROUP = 14;

/** Gain sur la vitesse du défilement, par px/image à 60 i/s : ×5 vers 40 px/image (défilement vif). */
const SCROLL_GAIN = 0.1;
/** Plafond du surcroît de vitesse : 4 fois la base en plus, soit ×5. */
const BOOST_MAX = 4;
/** Rapprochement de la vitesse vers sa cible, par image à 60 i/s (a6 §4.7). */
const LERP = 0.1;
/** En deçà (en fraction de la base), la bande est arrêtée : plus rien à rendre. */
const REST = 0.001;
/** Plus long pas pris en compte, en images à 60 i/s : pas de saut au réveil. */
const MAX_FRAMES = 2;

const paused = ref(false);
const hydrated = ref(false);
onMounted(() => (hydrated.value = true));

const band = useTemplateRef<HTMLElement>('band');

/** Relance la bande après une pause ou un survol ; branché seulement quand elle est liée. */
let resume: (() => void) | undefined;
watch(paused, (value) => {
  if (!value) resume?.();
});

useMotion(band, ({ gsap }, root) => {
  const viewport = root.querySelector<HTMLElement>('[data-motion="marquee-viewport"]');
  const track = root.querySelector<HTMLElement>('[data-motion="marquee-track"]');
  const group = track?.firstElementChild;
  if (!viewport || !track || !(group instanceof HTMLElement)) return undefined;

  /** Durée d'un tour de la boucle CSS (un groupe), en secondes : même vitesse de base. */
  const loop = Number.parseFloat(getComputedStyle(track).animationDuration);
  if (!loop) return undefined;
  /** Largeur d'un groupe (px), la période de la boucle. */
  let period = group.getBoundingClientRect().width;
  /** Décalage de la piste (px, dans [0, period)) et vitesse (en bases, signée). */
  let offset = 0;
  let speed = 0;
  let linked = false;
  let moving = false;
  let hovered = hasFinePointer() && viewport.matches(':hover');

  // Le pas des motifs suit la taille du texte (clamp) : la phase est gardée.
  const resizer = new ResizeObserver(([entry]) => {
    const next = entry?.contentRect.width;
    if (!next) return;
    offset *= next / period;
    period = next;
  });
  resizer.observe(group);

  /** La bande reprend là où la boucle CSS l'a laissée, à sa vitesse : pas de saut. */
  const link = () => {
    linked = true;
    offset = viewport.getBoundingClientRect().left - track.getBoundingClientRect().left;
    speed = paused.value || hovered ? 0 : 1;
    root.dataset.scrollLinked = '';
  };

  const settle = () => {
    moving = false;
    track.style.removeProperty('will-change');
  };

  /** Une image ; `true` tant que la bande a du mouvement à rendre. */
  const drive = () => {
    if (!linked) link();
    const ratio = gsap.ticker.deltaRatio(60);
    const frames = Math.min(ratio, MAX_FRAMES);
    const boost = Math.min((Math.abs(scroll.velocity) / ratio) * SCROLL_GAIN, BOOST_MAX);
    const target = paused.value ? 0 : scroll.direction * ((hovered ? 0 : 1) + boost);
    speed += (target - speed) * (1 - (1 - LERP) ** frames);
    if (target === 0 && Math.abs(speed) < REST) {
      speed = 0;
      settle();
      return false;
    }
    // Calque promu seulement pendant le mouvement.
    if (!moving) {
      moving = true;
      track.style.willChange = 'transform';
    }
    offset += ((speed * period) / loop) * (frames / 60);
    offset = ((offset % period) + period) % period;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    return true;
  };

  let unfollow: (() => void) | undefined;
  // Inscrite (à l'écran), la bande n'a qu'à réveiller le rappel par image.
  resume = () => {
    if (unfollow) requestTick();
  };

  /** Rien ne tourne hors de l'écran ni dans un onglet masqué. */
  let onScreen = false;
  const sync = () => {
    const run = onScreen && document.visibilityState === 'visible';
    if (run === Boolean(unfollow)) return;
    if (run) unfollow = followScroll(drive);
    else {
      unfollow?.();
      unfollow = undefined;
      settle();
    }
  };
  const watcher = new IntersectionObserver(([entry]) => {
    onScreen = Boolean(entry?.isIntersecting);
    sync();
  });
  watcher.observe(root);
  document.addEventListener('visibilitychange', sync);

  // Survol au pointeur fin (comme la règle CSS) : la base s'arrête, le défilement entraîne encore.
  const enter = (event: PointerEvent) => {
    hovered = hasFinePointer() && event.pointerType !== 'touch';
  };
  const leave = () => {
    hovered = false;
    resume?.();
  };
  viewport.addEventListener('pointerenter', enter, { passive: true });
  viewport.addEventListener('pointerleave', leave, { passive: true });

  return () => {
    resume = undefined;
    unfollow?.();
    watcher.disconnect();
    resizer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    viewport.removeEventListener('pointerenter', enter);
    viewport.removeEventListener('pointerleave', leave);
    delete root.dataset.scrollLinked;
    track.style.removeProperty('transform');
    track.style.removeProperty('will-change');
  };
});
</script>

<template>
  <div
    ref="band"
    class="marquee"
    data-surface="signal"
    data-motion="marquee"
    :data-paused="paused ? '' : undefined"
  >
    <div class="marquee__viewport" aria-hidden="true" data-motion="marquee-viewport">
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
      <span class="visually-hidden">{{ ui.marquee.pause }}</span>
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

/* La couche de mouvement mène la bande (vitesse liée au défilement) : la boucle CSS s'efface. */
.marquee[data-scroll-linked] .marquee__track {
  animation: none;
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
