<script setup lang="ts">
import { canBlur, createMotionBlur, type MotionBlur } from '~/motion/motion-blur';
import { followScroll, requestTick, scroll } from '~/motion/scroll';
import { duration } from '~/motion/tokens';
import type { HomeContent } from '~/types/content';

/**
 * Hero : photo pleine page (élément LCP), cadre de filets, repères de calage,
 * astérisque, slogans et titre calé en bas entre deux filets.
 *
 * Hauteur : max(100svh, 40rem) au lieu des 1 102 px de la référence, pour que
 * « FORGE / TA FORCE » soit entièrement visible au chargement (correctif P1) :
 * les écarts verticaux se resserrent avec la hauteur de la fenêtre.
 *
 * Mouvement (docs/analyse/annexes/a6-motion.md §2.2 et §4.1) :
 * - intro « Vitesse → Arrêt » en keyframes CSS, pilotée par les classes que pose
 *   app/motion/boot.inline.js : elle n'attend ni l'hydratation ni GSAP ;
 * - au défilement (GSAP) : la photo se file avec la vitesse, et FORGE / TA FORCE
 *   s'écartent pendant que le hero sort de l'écran. Le filé est un vrai flou de
 *   bougé en WebGL (overdrive O1, qui suit aussi le pointeur) sur les appareils
 *   qui le portent, la plaque de stries ailleurs.
 */
const props = defineProps<{ content: HomeContent['hero'] }>();

const titleId = 'hero-titre';

/** Plaque de stries : la photo étalée à l'horizontale (scripts/build-images.mjs). */
const STREAKS = '/images/hero/hero-streaks.jpg';
const streaksUrl = useImage()(STREAKS, { format: 'webp' });

/** Filé lié à la vitesse, de 0 à 1 : plein à partir de FULL_SPEED px/image (défilement vif). */
const FULL_SPEED = 37;
/** En dessous (px/image), la photo ne se file pas : un défilement de lecture la laisse nette. */
const DEADZONE = 2;
/** Le pointeur file la photo (flou WebGL seulement) : plein à POINTER_FULL_SPEED px/image. */
const POINTER_FULL_SPEED = 60;
/** Opacité de la plaque de stries à plein filé. */
const STREAK_MAX = 0.55;
const STREAK_LERP = 0.15; // rapprochement par image à 60 i/s : retour à 0 en ≈ 300 ms
/** En dessous, le filé est éteint. */
const REST = 0.02;

const hero = useTemplateRef<HTMLElement>('hero');

useMotion(hero, ({ gsap, ScrollTrigger }, root) => {
  const media = root.querySelector<HTMLElement>('.hero__media');
  const photo = root.querySelector<HTMLImageElement>('.hero__photo');
  const plate = root.querySelector<HTMLImageElement>('.hero__streaks');
  if (!media || !photo || !plate) return undefined;

  /** Rendu du filé : le flou WebGL quand il existe, sinon la plaque de stries. */
  let blur: MotionBlur | undefined;
  const paint = (amount: number) => {
    if (blur) {
      blur.draw(amount);
      return;
    }
    if (amount === 0) {
      plate.style.removeProperty('opacity');
      plate.style.removeProperty('will-change');
      return;
    }
    // Calque promu seulement le temps de l'effet.
    plate.style.willChange = 'opacity';
    plate.style.opacity = (amount * STREAK_MAX).toFixed(3);
  };

  let level = 0;
  /** Déplacement horizontal du pointeur depuis la dernière image, en px. */
  let pointer = 0;
  let pointerX: number | undefined;
  /** Une image de l'effet ; `true` tant que le filé n'est pas éteint. */
  const follow = () => {
    const speed = Math.max(
      (Math.abs(scroll.velocity) - DEADZONE) / FULL_SPEED,
      blur ? (Math.abs(pointer) - DEADZONE) / POINTER_FULL_SPEED : 0,
      0,
    );
    pointer = 0;
    const target = Math.min(speed, 1);
    if (target === 0 && level === 0) return false;
    // Lissage indépendant de la cadence d'affichage.
    level += (target - level) * (1 - (1 - STREAK_LERP) ** gsap.ticker.deltaRatio(60));
    if (target === 0 && level < REST) level = 0;
    paint(level);
    return level > 0;
  };

  // Rien ne tourne quand le hero est hors de l'écran.
  let following: (() => void) | undefined;
  const rest = () => {
    following?.();
    following = undefined;
    level = 0;
    paint(0);
  };
  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => {
      rest();
      if (isActive) following = followScroll(follow);
    },
  });
  // Écarts de clientX plutôt que movementX, dont l'échelle varie selon les navigateurs.
  const onPointer = (event: PointerEvent) => {
    if (!blur || !following || event.pointerType !== 'mouse') return;
    if (pointerX !== undefined) pointer += event.clientX - pointerX;
    pointerX = event.clientX;
    requestTick();
  };
  const onLeave = () => (pointerX = undefined);
  root.addEventListener('pointermove', onPointer, { passive: true });
  root.addEventListener('pointerleave', onLeave, { passive: true });

  // O1 : le flou WebGL se prépare quand le navigateur est libre, photo décodée.
  let disposed = false;
  const prepare = async () => {
    await photo.decode().catch(() => {});
    if (disposed) return;
    const instance = await createMotionBlur(photo, media, {
      focal: props.content.image.focal ?? '50% 50%',
      // Contexte perdu (pilote, mémoire) : retour à la plaque de stries.
      onLost: () => {
        blur?.destroy();
        blur = undefined;
      },
    });
    if (!instance) return;
    if (disposed) {
      instance.destroy();
      return;
    }
    // Relais en plein filé : la plaque s'efface, le flou reprend au niveau courant.
    paint(0);
    blur = instance;
  };
  if (canBlur()) requestIdleCallback(() => void prepare(), { timeout: 2000 });

  // Sortie : les deux lignes du titre (et leurs échos) s'écartent de 4vw. La
  // valeur suit la progression avec un léger amorti (quickTo) : si l'on a déjà
  // défilé quand GSAP arrive, le titre rejoint sa place au lieu de sauter.
  const lines = root.querySelectorAll('[data-motion="hero-title-line"]');
  gsap.set(lines, { '--hero-drift': 0 });
  const drift = gsap.quickTo(lines, '--hero-drift', { duration: duration('--dur-state') });
  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom top',
    onUpdate: ({ progress }) => drift(progress),
    onRefresh: ({ progress }) => drift(progress),
  });

  return () => {
    disposed = true;
    rest();
    root.removeEventListener('pointermove', onPointer);
    root.removeEventListener('pointerleave', onLeave);
    blur?.destroy();
    blur = undefined;
  };
});

/*
 * Largeur réellement affichée : la photo couvre max(100vw, hauteur × 1,31). En
 * portrait, elle déborde donc largement de la fenêtre (≈ 2,8 × sur un téléphone).
 * Clés = largeur minimale de fenêtre (@nuxt/image).
 */
const photoSizes = {
  390: '280vw',
  sm: '200vw',
  md: '175vw',
  lg: '100vw',
  xl: '100vw',
  '2xl': '100vw',
};
</script>

<template>
  <section ref="hero" class="hero" data-surface="hot" :aria-labelledby="titleId">
    <div
      class="hero__media"
      data-motion="hero-photo"
      :style="{ '--streaks': `url(${streaksUrl})`, '--focal': props.content.image.focal }"
    >
      <NuxtPicture
        :src="props.content.image.src"
        :alt="props.content.image.alt"
        :width="props.content.image.width"
        :height="props.content.image.height"
        format="avif,webp"
        :sizes="photoSizes"
        loading="eager"
        :preload="{ fetchPriority: 'high' }"
        :img-attrs="{
          class: 'hero__photo',
          fetchpriority: 'high',
          style: { objectPosition: props.content.image.focal },
        }"
      />
      <!--
        Décorative. Priorité par défaut, découverte après le préchargement de la
        photo (LCP) : jamais devant elle, mais promue à l'affichage pour être là
        quand l'intro démarre.
      -->
      <NuxtImg
        class="hero__streaks"
        :src="STREAKS"
        format="webp"
        densities="x1"
        alt=""
        decoding="async"
      />
    </div>

    <span class="hero__rule hero__rule--start" data-motion="hero-rule" aria-hidden="true" />
    <span class="hero__rule hero__rule--end" data-motion="hero-rule" aria-hidden="true" />

    <div class="hero__top container">
      <Asterisk class="hero__asterisk" size="var(--hero-asterisk)" data-motion="hero-asterisk" />
      <HeroSlogans class="hero__slogans" :slogans="props.content.slogans" />
    </div>

    <CrosshairRow class="hero__marks container" motion="hero-crosshair" />

    <div class="hero__band">
      <span class="hero__rule hero__rule--top" data-motion="hero-rule" aria-hidden="true" />
      <HeroHeadline
        class="container"
        :title-id="titleId"
        :title-lines="props.content.titleLines"
        :lead-lines="props.content.leadLines"
      />
      <span class="hero__rule hero__rule--bottom" data-motion="hero-rule" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  /*
   * Mesures @1440 sur la hauteur de référence de 1 102 px (a1 §2.1) :
   * astérisque de 71 px à y 179, rangées de slogans de 58,5, repères 72 px
   * au-dessus de la bande du titre, 54 px sous son filet bas. Les valeurs en
   * svh resserrent la composition sur les fenêtres plus basses.
   */
  --hero-title: min(var(--text-hero), max(20svh, 3.5rem));
  --hero-pad-top: 5.5rem;
  --hero-pad-bottom: clamp(1.5rem, 5svh, 3.375rem);
  --hero-asterisk: min(clamp(2.5rem, 1.6rem + 3.2vw, 4.4375rem), 8svh);
  --hero-marks-gap: clamp(1.5rem, 6svh, 4.5rem);

  /*
   * Partition de l'intro (a6 §2.2) : départs comptés depuis html.hero-ready,
   * lus aussi par HeroHeadline et HeroSlogans. La dernière couche (5e filet des
   * slogans) finit à 1 240 ms, sous --seq-max. Avant hero-ready, tout attend en
   * pause sur sa première image clé.
   */
  --intro-title: 120ms;
  --intro-frame: 450ms;
  --intro-slogans: 520ms;
  --intro-asterisk: 600ms;
  --intro-lead: 700ms;
  --intro-arrows: 800ms;
  --intro-state: running;

  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-rows: auto minmax(var(--space-16), 1fr) auto auto;
  grid-template-areas: 'top' '.' 'marks' 'band';
  min-block-size: max(100svh, 40rem);
  padding-block: var(--hero-pad-top) var(--hero-pad-bottom);
  padding-inline: env(safe-area-inset-left, 0px) env(safe-area-inset-right, 0px);
  overflow: clip;
}

.hero__media {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero__media :deep(picture),
.hero__media :deep(.hero__photo) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.hero__media :deep(.hero__photo) {
  object-fit: cover;
}

/* Calque de stries : n'existe qu'avec le mouvement ; invisible au repos. */
.hero__streaks {
  position: absolute;
  inset: 0;
  display: none;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: var(--focal);
  opacity: 0;
  pointer-events: none;
}

html.has-motion .hero__streaks {
  display: block;
}

/* Flou WebGL (motion-blur.ts) : posé sur la photo, visible seulement quand il file. */
.hero__media :deep(.hero__blur) {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  visibility: hidden;
  pointer-events: none;
}

.hero__media :deep(.hero__blur[data-visible]) {
  visibility: visible;
}

/*
 * Sous 64em, les slogans (14 px, donc 4,5:1 exigé) passent sur le front de
 * l'athlète, où la peau claire tombe à 2,6:1. Voile haut local, mesuré sur la
 * photo définitive : il ramène le pire cas (p95) au-dessus de 4,5:1.
 */
@media (width < 64em) {
  .hero__media::after {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    block-size: 42%;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--black) 55%, transparent) 55%,
      transparent
    );
    pointer-events: none;
  }
}

/* Filets du cadre : blanc ≈ 18 % (--rule de la surface « hot »), 1 px. */
.hero__rule {
  position: absolute;
  background: var(--rule);
  pointer-events: none;
}

.hero__rule--start,
.hero__rule--end {
  inset-block: 0;
  inline-size: 1px;
}

.hero__rule--start {
  inset-inline-start: var(--frame-inset);
}

.hero__rule--end {
  inset-inline-end: var(--frame-inset);
}

.hero__rule--top,
.hero__rule--bottom {
  inset-inline: var(--frame-inset);
  block-size: 1px;
}

.hero__rule--top {
  inset-block-start: 0;
}

.hero__rule--bottom {
  inset-block-end: 0;
}

.hero__top {
  grid-area: top;
  display: grid;
  justify-items: start;
  gap: var(--space-24);
}

.hero__slogans {
  justify-self: stretch;
}

.hero > .hero__marks {
  grid-area: marks;
  display: none;
  margin-block-end: var(--hero-marks-gap);
}

.hero__band {
  grid-area: band;
  position: relative;
  isolation: isolate;
  padding-block: calc(var(--hero-title) * 0.0456) var(--space-20);
}

/*
 * Voile de sécurité ancré sur la bande (et non sur la hauteur du hero) : il
 * reprend le fondu mesuré (transparent → noir 60 % → noir) et garantit au moins
 * 0,6 de noir sous le sous-titre, donc un contraste ≥ 3:1 même sur une zone
 * claire de la photo. Repères : 79 px au-dessus du filet haut, noir 60 % à
 * 53 px sous lui, noir plein sur la ligne de base de la première ligne.
 */
.hero__band::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block: calc(var(--hero-title) * -0.44) calc(var(--hero-pad-bottom) * -1);
  z-index: -1;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, var(--black) 60%, transparent) calc(var(--hero-title) * 0.73),
    var(--black) calc(var(--hero-title) * 1.23)
  );
  pointer-events: none;
}

/* Paysage mobile : le titre doit tenir dans la fenêtre, le plancher de 40rem saute. */
@media (height < 30em) {
  .hero {
    --hero-pad-top: 4.5rem;

    min-block-size: 100svh;
  }
}

@media (width >= 64em) {
  .hero {
    --hero-pad-top: clamp(
      6.5rem,
      21.8svh - 3.8rem,
      11.1875rem
    ); /* 135 px à 900 de haut, 179 à 1102 */
    --hero-row: clamp(2.5rem, 5.4svh, 3.65625rem);
  }

  .hero__top {
    gap: var(--hero-row);
  }

  .hero__slogans {
    justify-self: start;
  }

  .hero > .hero__marks {
    display: flex;
  }

  /* mesuré : 19 px entre le filet et les capitales, 18 px sous la ligne de base (à 180 px) */
  .hero__band {
    padding-block-end: calc(var(--hero-title) * 0.04);
  }
}

/*
 * ── Intro « Vitesse → Arrêt » ────────────────────────────────────────────────
 * Sous html.hero-intro seulement : sans elle (mouvement réduit, arrivée par une
 * ancre, retour du bfcache, JS absent), la page est déjà dans son état final.
 * Remplissage « backwards » seul : une animation finie ne retient plus rien.
 */
html.hero-intro:not(.hero-ready) .hero {
  --intro-state: paused;
}

/*
 * Les stries se compriment et s'éteignent, comme au freinage. Courbe douce : la
 * vitesse reste lisible pendant que le titre arrive (≈ 300 ms), puis tout se fige.
 */
html.hero-intro .hero__streaks {
  transform-origin: left;
  animation: hero-brake var(--dur-focal) var(--ease-out-soft) backwards var(--intro-state);
}

/*
 * La photo nette (LCP) reste visible dès la première image : elle ne fait que
 * glisser. Son bord droit découvre alors la plaque de stries, aux mêmes couleurs,
 * jamais le fond noir.
 */
html.hero-intro .hero__media {
  background: var(--streaks) var(--focal) / cover no-repeat;
}

html.hero-intro .hero__media :deep(picture) {
  animation: hero-settle var(--dur-focal) var(--ease-out) backwards var(--intro-state);
}

/*
 * Le cadre se trace depuis les repères : les filets verticaux depuis leur
 * hauteur, les horizontaux depuis le premier repère (centre à 0,75rem du bord du
 * conteneur). Hauteur des repères, depuis le bas : marge basse, bande du titre
 * (2 lignes de 0,82 + marges de 0,0456 et 0,04 = 1,7256 × le titre), écart des
 * repères, demi-repère. Sous 64em, sans repères, le point tombe dans le titre.
 */
html.hero-intro .hero__rule--start,
html.hero-intro .hero__rule--end {
  transform-origin: 50%
    calc(
      100% - var(--hero-pad-bottom) - 1.7256 * var(--hero-title) - var(--hero-marks-gap) - 0.75rem
    );
  animation: hero-trace-y var(--dur-focal) var(--ease-out) var(--intro-frame) backwards
    var(--intro-state);
}

html.hero-intro .hero__rule--top,
html.hero-intro .hero__rule--bottom {
  transform-origin: calc(
      max(var(--page-gutter) - var(--frame-inset), (100% - var(--content-max)) / 2) + 0.75rem
    )
    50%;
  animation: hero-trace-x var(--dur-focal) var(--ease-out) var(--intro-frame) backwards
    var(--intro-state);
}

/* Les repères se « verrouillent » pendant que les filets en partent. */
html.hero-intro .hero__marks :deep([data-motion='hero-crosshair']) {
  animation: hero-lock var(--dur-layout) var(--ease-out) var(--intro-frame) backwards
    var(--intro-state);
}

/*
 * Un cran de l'astérisque. −45° est identique à 0° (8 branches) : seul le clic se
 * voit. `transform` se compose avec `rotate`, qui porte le cliquet global
 * (--ratchet) : les deux mouvements ne se contrarient pas.
 */
html.hero-intro .hero__asterisk {
  animation: hero-strike var(--dur-strike) var(--ease-strike) var(--intro-asterisk) backwards
    var(--intro-state);
}

@keyframes hero-brake {
  from {
    opacity: 1;
    transform: scaleX(1.12);
  }
}

@keyframes hero-settle {
  from {
    transform: translateX(calc(var(--move-l) * -1));
  }
}

@keyframes hero-trace-x {
  from {
    transform: scaleX(0);
  }
}

@keyframes hero-trace-y {
  from {
    transform: scaleY(0);
  }
}

@keyframes hero-lock {
  from {
    transform: rotate(45deg) scale(0.6);
  }
}

@keyframes hero-strike {
  from {
    transform: rotate(-45deg);
  }
}
</style>
