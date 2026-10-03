<script setup lang="ts">
import type { Service } from '~/types/content';
import { ui } from '~/data/ui';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

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
 *
 * Mouvement (a6 §4.3) :
 * - première entrée : les cartes montent comme des plaques, en cascade, et leur
 *   photo s'ouvre en escalier ; la tuile monte avec la carte active ;
 * - changement de carte : la photo de la nouvelle active s'enfonce puis se soulève
 *   pendant que le rouge l'envahit (CSS), et l'astérisque de son numéro frappe ;
 * - la tuile suit la carte active, tenue en laisse (un pas L) : elle penche vers la
 *   carte qui arrive, l'accompagne quand on fait glisser le rail, et glisse vers sa
 *   nouvelle fente au lieu d'y sauter. Elle ne s'éloigne jamais de plus d'un pas :
 *   on peut la marteler sans la perdre sous le pointeur.
 */
const props = withDefaults(defineProps<{ items: Service[]; initial?: number }>(), { initial: 0 });

const total = props.items.length;
const trackId = useId();
const carousel = useTemplateRef<HTMLElement>('carousel');
const scroller = useTemplateRef<HTMLElement>('scroller');
const { active, drift, goTo, next, previous } = useSnapRail(scroller, {
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
    announcement.value = ui.services.announce(index + 1, total, props.items[index]?.title ?? '');
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

/** a6 §3.6 : en se soulevant, la photo se pose dans son cadre (échelle 1,06 → 1). */
const IMAGE_SETTLE = 1.06;
/** L'astérisque n'a que quatre axes de symétrie : un quart de tour le laisse identique. */
const NUMBER_STRIKE = '90deg';
/** Écart du rail, en pas de laisse, sur lequel la laisse se tend : la tuile revient en douceur. */
const SLACK = 2;
const FLAT = { '--fx': '0%', '--ft': '0%', '--fb': '0%' };
const NOTCH = ['--fx', '--ft', '--fb'] as const;

useMotion(carousel, ({ gsap }, root, contextSafe) => {
  const rail = scroller.value;
  const tile = root.querySelector<HTMLElement>('[data-motion="services-arrow"]');
  const slides = [...root.querySelectorAll<HTMLElement>('[data-motion="services-card"]')];
  const medias = [...root.querySelectorAll<HTMLElement>('[data-motion="services-media"]')];
  const asterisks = [...root.querySelectorAll<HTMLElement>('[data-motion="services-asterisk"]')];
  const focal = duration('--dur-focal');
  const layout = duration('--dur-layout');
  const press = duration('--dur-press');
  const cascade = capped(stagger('--stagger-list'));
  const leash = length('--move-l');

  // Encoches de repos des photos, lues sur la carte active (le survol ne la touche pas).
  const reference = getComputedStyle(medias[active.value] ?? root);
  const notch = Object.fromEntries(NOTCH.map((name) => [name, reference.getPropertyValue(name)]));
  /** Les encoches transitionnent en CSS (survol, appui) : pas pendant que GSAP les tient. */
  const hold = (media: HTMLElement) => gsap.set(media, { transition: 'none' });
  const release = [...NOTCH, 'transition'];

  /*
   * Tuile : suit la carte active, au bout d'une laisse d'un pas. Elle bouge par
   * --follow (sa transform, voir le CSS), jamais par `translate` : celui-ci reste
   * au soulèvement et à l'appui de la plaque.
   */
  const glide = { offset: 0 };
  let shown = 0;
  const setFollow = tile ? gsap.quickSetter(tile, '--follow', 'px') : undefined;
  const clampToLeash = gsap.utils.clamp(-leash, leash);
  // Plus le rail s'écarte, plus la laisse se tend, sans jamais dépasser un pas.
  const tether = () => leash * Math.tanh(drift() / (SLACK * leash));
  function place() {
    // Masquée (mobile) : rien à suivre.
    if (!tile?.offsetParent || !setFollow) return;
    // Jamais plus d'un pas, même quand la glissade s'ajoute à une laisse qui se détend.
    shown = clampToLeash(tether() + glide.offset);
    setFollow(shown);
  }
  /** La carte active change : la cible de la tuile saute, la tuile glisse. */
  function follow() {
    gsap.fromTo(
      glide,
      { offset: shown - tether() },
      { offset: 0, duration: layout, ease: 'in-out', overwrite: true, onUpdate: place },
    );
  }

  /* ── Nouvelle carte active : la plaque s'enfonce puis se soulève ─────────── */
  function activate(index: number) {
    const media = medias[index];
    const asterisk = asterisks[index];
    if (media) {
      gsap.killTweensOf(media);
      hold(media);
      gsap
        .timeline()
        .to(media, { ...FLAT, duration: press, ease: 'none' })
        .to(media, { ...notch, duration: layout, clearProps: release.join() });
    }
    // Une frappe en cours va au bout : jamais de file d'attente.
    if (asterisk && !gsap.isTweening(asterisk)) {
      gsap.fromTo(
        asterisk,
        { '--number-turn': '0deg' },
        {
          '--number-turn': NUMBER_STRIKE,
          duration: duration('--dur-strike'),
          ease: 'strike',
          delay: press,
          clearProps: '--number-turn',
        },
      );
    }
  }

  // Les animations nées d'un changement de carte rejoignent le contexte : un passage
  // en mouvement réduit ou un démontage les défait comme les autres.
  const stopWatching = watch(
    active,
    contextSafe((index: number) => {
      follow();
      activate(index);
    }),
  );

  rail?.addEventListener('scroll', place, { passive: true });
  window.addEventListener('resize', place, { passive: true });
  place();

  /* ── Première entrée : les plaques montent, en cascade ───────────────────── */
  // Déjà à l'écran quand GSAP arrive (ancre, rechargement) : l'état final reste.
  if (!reached(root)) {
    const rise = `${length('--move-l')}px`;
    const entry = gsap.timeline({
      scrollTrigger: { trigger: root, ...ENTRY },
    });
    slides.forEach((slide, index) => {
      const at = cascade(index);
      const media = medias[index];
      entry.from(slide, { y: rise, duration: focal, clearProps: 'transform' }, at);
      // La tuile monte avec la carte active : elles forment une unité.
      if (index === active.value && tile) {
        entry.fromTo(
          tile,
          { '--rise': rise },
          { '--rise': '0px', duration: focal, clearProps: '--rise' },
          at,
        );
      }
      if (!media) return;
      hold(media);
      entry
        .fromTo(media, FLAT, { ...notch, duration: layout, clearProps: release.join() }, at)
        .from(
          media.querySelector('img'),
          { scale: IMAGE_SETTLE, duration: focal, force3D: false, clearProps: 'transform' },
          at,
        );
    });
  }

  return () => {
    stopWatching();
    rail?.removeEventListener('scroll', place);
    window.removeEventListener('resize', place);
    // Posée sans tween (quickSetter) : GSAP ne la défait pas.
    tile?.style.removeProperty('--follow');
  };
});
</script>

<template>
  <!--
    Délégation : les touches et les clics viennent des contrôles focalisables du carrousel
    (tuile, rail, précédent / suivant) ou des cartes voisines, qui ont leur équivalent clavier.
  -->
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <div
    ref="carousel"
    class="service-carousel"
    role="region"
    :aria-roledescription="ui.carousel"
    :aria-label="ui.services.region"
    :data-moving="moving || undefined"
    @keydown="onKeydown"
    @click="onClick"
  >
    <IconButton
      class="service-carousel__tile"
      icon="arrow-bend"
      :label="ui.services.next"
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
      :aria-label="ui.services.list"
      tabindex="0"
    >
      <div :id="trackId" class="service-carousel__track">
        <div
          v-for="(service, index) in items"
          :key="service.id"
          class="service-carousel__slide"
          role="group"
          :aria-roledescription="ui.services.slide"
          :aria-label="ui.services.position(index + 1, total)"
          :aria-current="index === active || undefined"
          :data-slide="index"
          :data-initial="index === initial || undefined"
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
        :label="ui.services.previous"
        variant="grey"
        :aria-controls="trackId"
        @click="previous"
      />
      <p class="service-carousel__counter" aria-hidden="true">{{ counter }}</p>
      <IconButton
        icon="arrow-bend"
        :label="ui.services.next"
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

/*
 * Position de départ native : le rail s'ouvre sur la carte initiale avant
 * l'hydratation (et sans JavaScript), donc aucun saut quand le script prend la main.
 */
.service-carousel__slide[data-initial] {
  scroll-initial-target: nearest;
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
  /* Mouvement (posé par le script, nul au repos) : la tuile suit la carte active et monte avec elle. */
  transform: translate(var(--follow, 0px), var(--rise, 0px));
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
    padding-inline: calc(50cqi + (var(--rail-slot) - var(--rail-card)) / 2)
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

/* Au survol, la flèche avance d'un pas dans son sens pendant que la plaque se soulève. */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .service-carousel__tile :deep(.icon) {
    transition: translate var(--dur-feedback) var(--ease-out-soft);
  }

  .service-carousel__tile:hover :deep(.icon) {
    translate: var(--step-sm-x) 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-carousel[data-moving] .service-carousel__card {
    transition: none;
  }
}

/* Sans JavaScript, les boutons n'auraient rien à piloter : le rail reste défilable (clavier, doigt). */
@media (scripting: none) {
  .service-carousel__tile,
  .service-carousel__pager {
    display: none;
  }
}
</style>
