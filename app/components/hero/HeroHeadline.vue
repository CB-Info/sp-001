<script setup lang="ts">
/**
 * Titre du hero et sous-titre.
 *
 * - H1 unique « Forge ta force », rendu en deux lignes (espace réel entre les
 *   deux spans : le nom lu reste une seule phrase). Seconde ligne en retrait de
 *   1,19em à partir de 64em (mesuré : 215 px à 180 px).
 * - Sous-titre à droite de la première ligne (début à 53,6 % du conteneur,
 *   mesuré : x 768 @1440), sa DERNIÈRE ligne de base sur celle de « FORGE » :
 *   alignement de grille sur la première ligne de base, puis remontée d'une
 *   ligne (1lh).
 * - Trois flèches rouges après la première ligne du sous-titre (pas de 40 px).
 * - Intro (a6 §2.2) : chaque ligne du titre arrive avec deux échos rouges qui la
 *   rattrapent et s'éteignent. Le H1 est l'élément LCP : il est peint dès la
 *   première image, seules ses lignes glissent (jamais d'opacité ni de masque).
 */
defineProps<{
  titleId: string;
  titleLines: [string, string];
  leadLines: [string, string];
}>();
</script>

<template>
  <div class="hero-headline">
    <!--
      Échos de l'intro : décoratifs et hors du H1, dont le texte reste « Forge ta
      force ». Même typographie, même cellule de grille : ils tombent pile sous
      les lignes. Masqués hors de l'intro.
    -->
    <div class="hero-headline__echoes" aria-hidden="true">
      <span
        v-for="(line, index) in titleLines"
        :key="line"
        class="hero-headline__line"
        :class="{ 'hero-headline__line--indent': index > 0 }"
        :style="{ '--i': index }"
        data-motion="hero-title-line"
      >
        <span v-for="n in 2" :key="n" class="hero-headline__echo">{{ line }}</span>
      </span>
    </div>
    <!-- Une espace réelle sépare les lignes : le titre se lit « Forge ta force ». -->
    <h1 :id="titleId" class="hero-headline__title">
      <template v-for="(line, index) in titleLines" :key="line">
        <span
          class="hero-headline__line"
          :class="{ 'hero-headline__line--indent': index > 0 }"
          :style="{ '--i': index }"
          data-motion="hero-title-line"
          >{{ line }}</span
        >
        <template v-if="index === 0">{{ ' ' }}</template>
      </template>
    </h1>
    <p class="hero-headline__lead" data-motion="hero-lead">
      <template v-for="(line, index) in leadLines" :key="line">
        <span class="hero-headline__lead-line" :style="{ '--i': index }">
          <span class="hero-headline__lead-text">
            {{ line }}
            <span
              v-if="index === 0"
              class="hero-headline__arrows"
              aria-hidden="true"
              data-motion="hero-arrows"
            >
              <Icon
                v-for="n in 3"
                :key="n"
                name="arrow-right"
                size="0.7em"
                :style="{ '--i': n - 1 }"
              />
            </span>
          </span>
        </span>
        <template v-if="index === 0">{{ ' ' }}</template>
      </template>
    </p>
  </div>
</template>

<style scoped>
.hero-headline {
  /* Course d'arrivée des lignes du titre (a6 §3.3 : seule exception aux pas mesurés). */
  --title-travel: 0.4em;

  display: grid;
  gap: var(--space-16);
}

/*
 * Tektur : capitale 0,70em, ascendante 1,0em, descendante 0,3em (fontTools).
 * Interligne 0,82 : la ligne de base tombe à 0,76em du haut de chaque ligne,
 * le haut des capitales à 0,06em. Typographie partagée par le H1 et ses échos.
 */
.hero-headline__title,
.hero-headline__echoes {
  grid-area: 1 / 1;
  /* Alignement optique : l'approche gauche du F (0,056em) est rattrapée. */
  margin-inline-start: -0.056em;
  font-family: var(--font-display);
  font-size: var(--hero-title, var(--text-hero));
  font-weight: 500;
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  text-wrap: wrap;
  color: var(--ink);
}

.hero-headline__line {
  display: block;
}

.hero-headline__echoes {
  pointer-events: none;
  user-select: none;
}

/* Les deux échos d'une ligne se superposent dans sa cellule. */
.hero-headline__echoes .hero-headline__line {
  display: grid;
}

.hero-headline__echo {
  --echo-offset: calc(var(--move-l) * -1);
  --echo-opacity: 0.6;

  grid-area: 1 / 1;
  visibility: hidden;
  color: var(--red-500);
}

.hero-headline__echo:nth-child(2) {
  --echo-offset: calc(var(--move-l) * -2);
  --echo-opacity: 0.3;
}

.hero-headline__lead {
  font-family: var(--font-lead);
  font-size: var(--text-lead);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.01em;
  /* mesuré : blanc ≈ 92 % ; lisibilité garantie par le voile de la bande (HeroSection) */
  color: color-mix(in srgb, var(--ink) 92%, transparent);
}

.hero-headline__lead-line,
.hero-headline__lead-text {
  display: block;
}

.hero-headline__arrows {
  display: inline-flex;
  gap: 0.3em; /* mesuré : flèches au pas de 40 px pour un sous-titre de 40 px */
  margin-inline-start: 0.3em; /* + l'espace du texte : ≈ 26 px avant la première flèche */
  vertical-align: middle;
  color: var(--red-500);
}

@media (width >= 64em) {
  .hero-headline {
    grid-template-columns: 53.6% minmax(0, 1fr);
    align-items: first baseline;
    gap: 0;
  }

  .hero-headline__title,
  .hero-headline__echoes {
    grid-area: 1 / 1 / 2 / -1;
  }

  .hero-headline__line--indent {
    margin-inline-start: 1.19em;
  }

  .hero-headline__lead {
    grid-area: 1 / 2;
    position: relative;
    inset-block-start: -1lh;
  }
}

/*
 * Sortie du hero (GSAP, HeroSection) : --hero-drift passe de 0 à 1 et les deux
 * lignes s'écartent. `translate` se compose avec le `transform` de l'intro.
 */
html.has-motion .hero-headline__line {
  translate: calc(var(--hero-drift, 0) * -4vw) 0;
}

html.has-motion .hero-headline__line--indent {
  translate: calc(var(--hero-drift, 0) * 4vw) 0;
}

/* ── Intro (partition dans HeroSection) ──────────────────────────────────── */

/* Les lignes du titre arrivent lancées, la seconde --stagger-lines plus tard. */
html.hero-intro .hero-headline__title > .hero-headline__line {
  animation: hero-arrive var(--dur-focal) var(--ease-out)
    calc(var(--intro-title) + var(--i) * var(--stagger-lines)) backwards var(--intro-state);
}

/*
 * Échos : partis en retrait d'un et deux pas (--move-l), ils rattrapent la ligne
 * sur une courbe plus douce (la traînée s'étire puis se résorbe) et s'éteignent
 * avant de la rejoindre : pas de liseré rouge résiduel (lecture « glitch »).
 */
html.hero-intro .hero-headline__echo {
  animation:
    hero-echo-catch var(--dur-focal) var(--ease-out-soft)
      calc(var(--intro-title) + var(--i) * var(--stagger-lines)) backwards var(--intro-state),
    hero-echo-fade var(--dur-overlay) var(--ease-in-out)
      calc(var(--intro-title) + var(--i) * var(--stagger-lines)) backwards var(--intro-state);
}

/* Sous-titre : chaque ligne monte dans son masque (marge basse pour les jambages). */
html.hero-intro .hero-headline__lead-line {
  --mask-bleed: 0.25em;

  clip-path: inset(-1em -1em calc(var(--mask-bleed) * -1));
}

html.hero-intro .hero-headline__lead-text {
  animation: hero-rise var(--dur-layout) var(--ease-out)
    calc(var(--intro-lead) + var(--i) * var(--stagger-lines)) backwards var(--intro-state);
}

/* Les flèches partent l'une après l'autre, comme un départ de sprint. */
html.hero-intro .hero-headline__arrows > * {
  animation: hero-sprint var(--dur-state) var(--ease-out)
    calc(var(--intro-arrows) + var(--i) * var(--stagger-list)) backwards var(--intro-state);
}

@keyframes hero-arrive {
  from {
    transform: translateX(calc(var(--title-travel) * -1));
  }
}

@keyframes hero-echo-catch {
  from {
    transform: translateX(calc(var(--title-travel) * -1 + var(--echo-offset)));
  }
}

@keyframes hero-echo-fade {
  from {
    visibility: visible;
    opacity: var(--echo-opacity);
  }

  to {
    visibility: visible;
    opacity: 0;
  }
}

@keyframes hero-rise {
  from {
    transform: translateY(calc(100% + var(--mask-bleed)));
  }
}

@keyframes hero-sprint {
  from {
    opacity: 0;
    transform: translateX(calc(var(--move-s) * -1));
  }
}
</style>
