<script setup lang="ts">
import { cap } from '~/data/cap';
import { capFit, type CapFitKey } from '~/data/cap-fit';
import { followScroll, scroll } from '~/motion/scroll';
import { approach, intensity } from '~/motion/speed';
import type { Session } from '~/types/cap';
import {
  compteARebours,
  formatHeure,
  jourCourt,
  prochainCours,
  sortSessions,
  useParisClock,
} from '~/utils/cap-time';
import { complexAtR, complexFrom, path, SPAN_RATIO, taperedStart, type Point } from '~/utils/ecg';

/**
 * Chapitre 1, la couverture (#haut) : la marque reconnue en cinq secondes, le
 * prochain cours réel, une seule action (brief docs/brief/v2.md, §4.2).
 *
 * Gabarit G1, le logo carré éclaté : « Chacun » délié citron au-dessus de
 * « son rythme. » plein craie, à la même largeur (justifiés), « Tous ensemble. »
 * en signature craie ferrée à droite. Le tracé blanc plein naît au bord gauche de
 * l'écran, avec sa pointe effilée, et se raccorde au pied du C sur la ligne de
 * base du délié, comme dans le logo. La photo remonte sous l'en-tête transparent.
 *
 * Plan B LCP (§7.1), actif sous 48em : le premier écran ne porte que le texte, sur
 * noir, et la photo passe dessous en 4:5, hors de l'écran. Le H1, peint dès la
 * première image, devient l'élément LCP (voir la règle « Plan B LCP » plus bas).
 *
 * Ordre du DOM = ordre visuel = ordre du focus : H1, chapeau, bouton, lien,
 * prochain cours.
 *
 * Mouvement :
 * - intro « écrire, frapper, se poser » en keyframes CSS, sous html.hero-intro
 *   et html.hero-ready (app/motion/boot.inline.js) : elle n'attend ni
 *   l'hydratation ni GSAP. Sans JS, en mouvement réduit, sur une arrivée par
 *   ancre ou au retour arrière, la page est déjà dans son état final ;
 * - O2 (§5.4) : l'amplitude du complexe suit la vitesse de défilement, sous
 *   html.has-motion seulement et tant que le tracé est à l'écran.
 */

const titleId = 'couverture-titre';

/* ── Mesures des mots ajustés ────────────────────────────────────────────────
 * Mêmes calculs que CapFitWord (largeur mesurée en em, plus l'approche par
 * lettre) : la taille de chaque ligne est connue en CSS, en unités de conteneur
 * du H1, pour caler les lignes sur leurs lignes de base et dimensionner le tracé.
 */
type Style = 'delie' | 'plein';
const TRACKING: Record<Style, number> = { delie: 0.01, plein: -0.005 };

function fitEm(key: CapFitKey, text: string, style: Style) {
  // Chasses de la plus large (ordinateur) à la plus étroite (mobile).
  const widths = Object.entries(capFit[key].em)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([, em]) => em);
  const extra = [...text].length * TRACKING[style];
  const desktop = (widths[0] ?? 1) + extra;
  return { desktop, mobile: (widths[1] ?? desktop - extra) + extra };
}

/** « Chacun » reste délié à toutes les largeurs (100 % de chasse sous 48em, 64 px au moins). */
const DELIE_STYLES: [Style, Style] = ['delie', 'delie'];

const delie = fitEm('cover.delie', cap.cover.delie, 'delie');
const plein = fitEm('cover.plein', cap.cover.plein, 'plein');

/** Plancher du délié (CapFitWord) : en dessous, il deviendrait plein (R2). */
const DELIE_FLOOR_REM = 4;

/*
 * Repli du délié (CapFitWord, `cap-fit--repli`) : quand la ligne est plus étroite
 * que « Chacun » à son plancher (zoom à 400 %, police agrandie), le mot passe
 * plein en chasse 75 %, mesurée à part dans cap-fit.ts. Sa largeur en em sert à
 * recaler --fs-delie, qui place le plein sous lui.
 */
const REPLI_WDTH = 75;
const delieRepli = (capFit['cover.delie'].em as Record<string, number>)[REPLI_WDTH];
const repliEm =
  delieRepli === undefined
    ? delie.mobile
    : delieRepli + [...cap.cover.delie].length * TRACKING.plein;

const titleStyle = {
  '--em-delie-d': delie.desktop.toFixed(4),
  '--em-delie-m': delie.mobile.toFixed(4),
  '--em-delie-r': repliEm.toFixed(4),
  '--em-plein-d': plein.desktop.toFixed(4),
  '--em-plein-m': plein.mobile.toFixed(4),
};

/*
 * Sur mobile, le délié tient à 64 px au moins : la largeur minimale de sa ligne
 * fixe le retrait du titre (la marge du pouls) sur les écrans de 360 à 390 px.
 */
const bodyStyle = { '--fit-min': `${(delie.mobile * DELIE_FLOOR_REM + 0.0625).toFixed(4)}rem` };

/* ── Tracé blanc plein (§2.8, style « plein ») ───────────────────────────────
 * Unités : la capitale du délié vaut 100. Amplitude R = 1,1 capitale (R6), empan
 * 0,9 × l'amplitude, trait de 0,08 capitale. L'origine x = 0 est le bord gauche
 * du H1 ; y = 0 est la ligne de base (l'origine de la mise à l'échelle O2).
 * Le SVG est calé à droite et rogné à gauche : la ligne plate s'étire jusqu'au
 * bord de l'écran, quelle que soit sa largeur, sans calcul côté client.
 */
const CAP = 100;
const AMP = 1.1 * CAP;
const SPAN = SPAN_RATIO * AMP;
const STROKE = 0.08 * CAP;
/** Plat entre le complexe et le bord du H1 : le complexe reste dans la marge du pouls. */
const TAIL = 28;
/** Longueur de la ligne plate tracée vers la gauche : plus large que toute marge. */
const REACH = 10000;

const tracePoints: Point[] = [[-REACH, 0], ...complexFrom(-(TAIL + SPAN), 0, AMP, SPAN), [0, 0]];
const trace = {
  d: path(tracePoints),
  viewBox: `${-REACH} ${-STROKE} ${REACH} ${2 * STROKE}`,
  tip: taperedStart(0, 0, STROKE),
  tipViewBox: `0 ${-STROKE} ${3 * STROKE} ${2 * STROKE}`,
};

/*
 * Mini-complexe du bouton (20 × 14, style « instrument ») : il s'écrit au survol
 * et au focus dans la fente réservée à gauche du libellé (.cap-button--fente,
 * v2.css). Au repos, la fente est vide.
 */
const PULSE_BASELINE = 7.2;
const pulse = path([
  [0, PULSE_BASELINE],
  ...complexAtR(10, PULSE_BASELINE, 6.2),
  [20, PULSE_BASELINE],
]);

/* ── Prochain cours, à l'heure de Paris ──────────────────────────────────────
 * Rendu serveur et premier rendu client : `now` vaut undefined, d'où le libellé
 * neutre (« Premier cours de la semaine »). L'horloge démarre après le montage et
 * recalcule la ligne à chaque minute. La boîte a la même hauteur dans les deux
 * états : aucun saut.
 */
/** Espace insécable (U+00A0) : « mer. 19 h 00 » ne se coupe pas. */
const NBSP = '\u00a0';
/**
 * Séparateur typographique de la ligne (point médian, lié au mot qui précède).
 * Il reste dans l'arbre d'accessibilité : c'est la seule espace entre les mots
 * (Vue condense les blancs du gabarit), sans lui la ligne se lirait soudée.
 */
const SEP = `${NBSP}· `;

const courseName = (slug: string) => cap.courses.find((course) => course.slug === slug)?.nom ?? '';
const when = (session: Session) => `${jourCourt(session.day)}${NBSP}${formatHeure(session.start)}`;

const first = sortSessions(cap.sessions)[0];
const firstLine = first && { when: when(first), name: courseName(first.course) };

const clock = useParisClock();
const next = computed(() => {
  const found = clock.value && prochainCours(cap.sessions, clock.value);
  if (!found) return undefined;
  return {
    when: when(found.session),
    name: courseName(found.session.course),
    countdown: compteARebours(found.inMinutes),
  };
});

/* ── O2 : amplitude liée à la vitesse (§5.4) ─────────────────────────────────
 * scaleY(1 + 0,35 × intensité), origine sur la ligne de base, lissé par
 * `approach` (retour au calme en ≈ 300 ms). L'intensité est prise en valeur
 * absolue : l'effort monte l'amplitude, quel que soit le sens du défilement.
 * Le trait garde son épaisseur (vector-effect: non-scaling-stroke).
 */
const AMPLIFY = 0.35;

const cover = useTemplateRef<HTMLElement>('cover');

useMotion(cover, ({ gsap, ScrollTrigger }, root) => {
  const line = root.querySelector<HTMLElement>('[data-motion="cover-line"]');
  const beat = root.querySelector<SVGPathElement>('[data-motion="cover-beat"]');
  if (!line || !beat) return undefined;

  let level = 0;
  const paint = (value: number) => {
    if (value === 0) beat.style.removeProperty('transform');
    else beat.style.transform = `scaleY(${(1 + AMPLIFY * value).toFixed(4)})`;
  };
  /** Une image de l'effet ; `true` tant qu'il n'est pas revenu au repos. */
  const follow = () => {
    const target = Math.abs(intensity(scroll.velocity));
    if (target === 0 && level === 0) return false;
    level = approach(level, target, gsap.ticker.deltaRatio(60));
    paint(level);
    return level > 0;
  };

  // Rien ne tourne quand le tracé est hors de l'écran.
  let following: (() => void) | undefined;
  const rest = () => {
    following?.();
    following = undefined;
    level = 0;
    paint(0);
  };
  ScrollTrigger.create({
    trigger: line,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => {
      rest();
      if (isActive) following = followScroll(follow);
    },
  });

  return rest;
});
</script>

<template>
  <section id="haut" ref="cover" class="cap-cover" data-surface="photo" :aria-labelledby="titleId">
    <CapPhoto
      class="cap-cover__photo"
      :photo="cap.photos.couverture"
      sizes="100vw"
      sizes-mobile="100vw"
      loading="eager"
      priority
      intro-media
    >
      <!-- Voiles : sécurité de contraste (le haut sous l'en-tête, le bas sous le texte), puis l'intro. -->
      <span class="cap-cover__veil cap-cover__veil--top" />
      <span class="cap-cover__veil cap-cover__veil--bottom" />
      <span class="cap-cover__veil cap-cover__veil--title" />
      <span class="cap-cover__veil cap-cover__veil--intro" />
    </CapPhoto>

    <div class="cap-cover__body cap-grid" :style="bodyStyle">
      <h1 :id="titleId" class="cap-cover__title" :style="titleStyle">
        <span class="cap-cover__line cap-cover__line--delie" data-motion="cover-line">
          <span class="cap-cover__trace" data-ecg aria-hidden="true">
            <svg
              class="cap-cover__trace-tip"
              :viewBox="trace.tipViewBox"
              preserveAspectRatio="none"
              focusable="false"
            >
              <path :d="trace.tip" />
            </svg>
            <svg
              class="cap-cover__trace-line"
              :viewBox="trace.viewBox"
              preserveAspectRatio="xMaxYMid slice"
              focusable="false"
            >
              <path class="cap-cover__beat" :d="trace.d" data-motion="cover-beat" />
            </svg>
            <svg
              class="cap-cover__trace-join"
              viewBox="0 -8 1 16"
              preserveAspectRatio="none"
              focusable="false"
            >
              <path d="M0 0H1" />
            </svg>
          </span>
          <CapFitWord
            class="cap-cover__delie"
            fit-key="cover.delie"
            :text="cap.cover.delie"
            :styles="DELIE_STYLES"
            color="citron"
          />
        </span>
        {{ ' ' }}
        <span class="cap-cover__line cap-cover__line--plein">
          <CapFitWord class="cap-cover__plein" fit-key="cover.plein" :text="cap.cover.plein" />
          <!-- Copie pleine de l'intro : elle se découvre depuis la ligne de base (la frappe). -->
          <span class="cap-cover__strike" aria-hidden="true">
            <CapFitWord fit-key="cover.plein" :text="cap.cover.plein" />
          </span>
        </span>
        {{ ' ' }}
        <span class="cap-cover__signature">
          <span class="cap-cover__signature-text cap-signature">{{ cap.cover.signature }}</span>
        </span>
      </h1>

      <div class="cap-cover__chapeau">
        <p class="cap-cover__chapeau-text cap-cover__chapeau-text--long">{{ cap.cover.chapeau }}</p>
        <p class="cap-cover__chapeau-text cap-cover__chapeau-text--short">
          {{ cap.cover.chapeauMobile }}
        </p>
      </div>

      <div class="cap-cover__actions">
        <a
          class="cap-cover__cta cap-button cap-button--l cap-button--fente"
          href="#reserver"
          data-cover-cta
        >
          <span class="cap-button__libelle">
            <svg class="cap-button__pulse" viewBox="0 0 20 14" aria-hidden="true" focusable="false">
              <path :d="pulse" />
            </svg>
            {{ cap.ui.reserve }}
          </span>
        </a>
        <a class="cap-cover__planning cap-link" :href="cap.cover.planning.href">
          {{ cap.cover.planning.label }}
        </a>
      </div>

      <p class="cap-cover__next">
        <template v-if="next">
          <span class="cap-cover__next-row">
            <span class="cap-cover__next-label">{{ cap.ui.nextLabel }}</span>
            <span class="cap-cover__sep">{{ SEP }}</span>
            <span class="cap-cover__next-when cap-data">{{ next.when }}</span>
          </span>
          <span class="cap-cover__sep cap-cover__sep--rows">{{ SEP }}</span>
          <span class="cap-cover__next-row">
            <span class="cap-cover__next-name">{{ next.name }}</span>
            <template v-if="next.countdown">
              <span class="cap-cover__sep">{{ SEP }}</span>
              <span class="cap-cover__next-countdown">{{ next.countdown }}</span>
            </template>
          </span>
        </template>
        <template v-else-if="firstLine">
          <span class="cap-cover__next-row">
            <span class="cap-cover__next-label">{{ cap.ui.firstLabel }}</span>
          </span>
          <span class="cap-cover__sep cap-cover__sep--rows">{{ SEP }}</span>
          <span class="cap-cover__next-row">
            <span class="cap-cover__next-when cap-data">{{ firstLine.when }}</span>
            <span class="cap-cover__sep">{{ SEP }}</span>
            <span class="cap-cover__next-name">{{ firstLine.name }}</span>
          </span>
        </template>
      </p>
    </div>
  </section>
</template>

<style scoped>
/*
 * Distance du bord gauche de l'écran au bord gauche du H1 : la longueur du tracé.
 * Enregistrée en <length> pour être résolue là où elle est déclarée (unités de
 * conteneur de la section), puis héritée en pixels jusque dans le H1, qui est
 * lui-même un conteneur.
 */
@property --cap-cover-edge {
  syntax: '<length>';
  inherits: true;
  initial-value: 0px;
}

/*
 * Cotes @1440 × 900 (brief §4.2) : photo de y 36 à 900 ; « Chacun » capitale de
 * y 330 à 428 ; « son rythme. » de 433 à 544 ; signature, ligne de base à 592 ;
 * chapeau de 632 à 716 ; action de 740 à 792 ; prochain cours de 816 à 844, soit
 * 56 px au-dessus du bord bas. @390 × 844 : « Chacun » de 470 à 515, action de
 * 695 à 747, prochain cours de 767 à 812, sur noir ; photo 4:5 de 844 à 1332
 * (Plan B LCP).
 */
.cap-cover {
  /* Partition de l'intro, comptée depuis html.hero-ready ; fin à 1 240 ms (< --seq-max). */
  --intro-veil: 0ms;
  --intro-trace: 120ms;
  --intro-strike: 568ms; /* le pic R passe : « son rythme. » s'imprime */
  --intro-chapeau: 680ms;
  --intro-signature: 780ms;
  --intro-word: 920ms; /* le tracé entre dans « Chacun » */
  --intro-word-duration: 320ms;
  --intro-next: 1000ms;
  --intro-state: running;

  /* Boîte de l'en-tête transparent sous laquelle la photo remonte (§4.1 : 72 px à toutes largeurs). */
  --cover-under: var(--header-height);
  --cover-pad-bottom: clamp(2rem, 1.443rem + 2.286vw, 3.5rem); /* 32 → 56 */
  --cover-gap-signature: clamp(1.5rem, 1.129rem + 1.524vw, 2.5rem); /* 24 → 40 */
  --cover-gap-next: clamp(1.25rem, 1.157rem + 0.381vw, 1.5rem); /* 20 → 24 */

  position: relative;
  isolation: isolate;
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-block-size: max(100svh - var(--banner-height), 40rem);
  margin-block-start: calc(var(--cover-under) * -1);
  /*
   * Rien ne déborde en largeur au rendu normal (vérifié de 320 à 1920 px) : la
   * section ne rogne qu'en hauteur. Avec un espacement du texte élargi (WCAG
   * 1.4.12), « son rythme. » peut dépasser le bord droit : il reste lisible.
   */
  overflow: visible clip;
  background: var(--cf-noir);
  color: var(--cf-craie);
}

/* ── Photo et voiles ──────────────────────────────────────────────────────── */
.cap-cover__photo {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.cap-cover__veil {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Sous l'en-tête : la navigation craie garde sa marge, même sur le plafond. */
.cap-cover__veil--top {
  background: linear-gradient(to bottom, rgb(12 12 11 / 0.5), rgb(12 12 11 / 0) 10rem);
}

/* Voile ancré sous le bloc de texte. */
.cap-cover__veil--bottom {
  background: linear-gradient(to top, rgb(12 12 11 / 0.55) 0, rgb(12 12 11 / 0) 42%);
}

/*
 * Sous le titre, à droite (≥ 48em, paysage) : le bas des fenêtres et les têtes
 * du groupe passent derrière « CUN » et « ME. ». Une bande sombre et douce,
 * fondue sur ses quatre bords, garde le délié citron à 3:1 au moins (mesuré :
 * 0,3 % des pixels du contour en dessous à 1440, contre 6,5 % sans elle).
 */
.cap-cover__veil--title {
  display: none;
  background: linear-gradient(
    to bottom,
    rgb(12 12 11 / 0) 26%,
    rgb(12 12 11 / 0.6) 37%,
    rgb(12 12 11 / 0.6) 56%,
    rgb(12 12 11 / 0) 70%
  );
  mask-image: linear-gradient(to right, transparent 38%, #000 58%, #000 82%, transparent 96%);
}

/* Calque noir de l'intro : n'existe que pendant elle. La photo n'est jamais animée. */
.cap-cover__veil--intro {
  display: none;
  background: var(--cf-noir);
  opacity: 0;
}

/* ── Grille : colonnes 2 à 10 pour le titre (≥ 64em), 2 à 7 (48–64em) ─────── */
.cap-cover__body {
  --pad: max(var(--page-gutter), (100cqi - var(--content-max)) / 2);
  /*
   * Mobile : le H1 va de x 64 à 370 à 390 px. Plus étroit, le délié garde ses
   * 64 px (R2) : la marge de droite cède d'abord (jusqu'à 8 px), puis le retrait
   * (la marge du pouls, jusqu'à la gouttière), puis le reste de la marge.
   */
  --cover-end: clamp(8px, 100cqi - 4rem - var(--fit-min), var(--page-gutter));
  --cap-cover-edge: clamp(var(--page-gutter), 100cqi - var(--fit-min) - var(--cover-end), 4rem);

  align-items: start;
  /*
   * Le bloc est ancré en bas ; s'il grandit (espacement du texte élargi, WCAG
   * 1.4.12, police agrandie), il pousse la couverture au lieu de remonter sous
   * l'en-tête. Au rendu normal, il n'atteint jamais cette marge.
   */
  padding-block: calc(var(--header-height) + 1rem) var(--cover-pad-bottom);
  padding-inline: var(--pad);
}

.cap-cover__body > * {
  grid-column: 1 / -1;
}

/* ── H1 : délié, plein, signature ─────────────────────────────────────────── */
.cap-cover__title {
  /* Tailles des deux lignes (CapFitWord), en unités du H1 : il sert de conteneur. */
  --fs-delie: max(4rem, 100cqi / var(--em-delie-m));
  --fs-plein: max(2.75rem, 100cqi / var(--em-plein-m));

  margin-inline: calc(var(--cap-cover-edge) - var(--page-gutter))
    calc(
      clamp(0px, 100cqi - var(--cap-cover-edge) - var(--fit-min), var(--cover-end)) -
        var(--page-gutter)
    );
  container-type: inline-size;
  margin-block: 0;
}

/*
 * Repli du délié (sous 48em) : quand le H1 est plus étroit que « Chacun » à son
 * plancher (--repli-at), CapFitWord le passe plein en chasse 75 %, à la taille
 * qui remplit la ligne ; --fs-delie suit, pour que le plein reste calé 0,05
 * capitale sous sa ligne de base. round(down, …) vaut 0 sous le seuil et le seuil
 * lui-même au-delà : il y annule le terme du repli. Même seuil que CapFitWord
 * (largeur < plancher × em), sans calcul côté client.
 */
@supports (inline-size: round(down, 1px, 1px)) {
  @media (max-width: 47.99em) {
    .cap-cover__title {
      --repli-at: calc(4rem * var(--em-delie-m));
      --fs-delie: max(
        100cqi / var(--em-delie-m),
        max(2.75rem, 100cqi / var(--em-delie-r)) - 10 *
          round(down, min(100cqi, var(--repli-at)), var(--repli-at))
      );
    }
  }
}

.cap-cover__line {
  position: relative;
  display: block;
}

/*
 * Métriques de CAP Display (interligne 0,86) : ligne de base à 0,7075 em du haut
 * de la ligne, capitale de 0,675 em. Le plein commence 0,05 capitale du délié
 * sous sa ligne de base (l'écart CAP / FITNESS du logo carré).
 */
.cap-cover__line--plein {
  margin-block-start: calc(var(--fs-delie) * -0.11875 - var(--fs-plein) * 0.0325);
}

/* Le texte réel reste sélectionnable ; la copie de la frappe ne l'est pas. */
.cap-cover__strike {
  position: absolute;
  inset: 0;
  display: none;
  pointer-events: none;
  user-select: none;
}

/*
 * R4. Signature ferrée à droite, haut de ses capitales à 0,18 capitale du plein
 * sous sa ligne de base. Figtree (interligne 1,1) : capitale à 0,2 em du haut de
 * la ligne. Le masque de l'intro laisse passer la jambe des lettres et la pente
 * de l'italique.
 */
.cap-cover__signature {
  display: block;
  margin-block-start: calc(var(--fs-plein) * -0.031 - var(--text-signature) * 0.2);
  text-align: end;
}

/* ── Tracé : de x 0 au pied du C, sur la ligne de base du délié ───────────── */
.cap-cover__trace {
  --w: 0.054em; /* trait : 0,08 capitale */
  /* Pointe : trois fois le trait, raccourcie si la marge ne la laisse pas (complexe à 127 u = 0,857 em). */
  --tip: clamp(0px, var(--cap-cover-edge) - 0.85725em - 2px, 0.162em);
  /*
   * Raccord : la ligne passe le bord du H1 et vient se glisser sous le contour du
   * C, là où sa courbe basse croise la ligne de base (mesuré sur CAP Display).
   */
  --join: 0.305em;

  position: absolute;
  inset-block-start: calc(0.7075em - var(--w));
  inset-inline-end: calc(100% - var(--join));
  inline-size: calc(var(--cap-cover-edge) + var(--join));
  block-size: calc(var(--w) * 2);
  font-size: var(--fs-delie);
  color: var(--cf-blanc);
}

.cap-cover__trace svg {
  position: absolute;
  inset-block: 0;
  block-size: 100%;
  overflow: visible;
}

.cap-cover__trace path {
  fill: none;
  stroke: currentcolor;
  stroke-width: var(--w);
  stroke-linejoin: miter;
  stroke-miterlimit: 4;
  stroke-linecap: butt;
  vector-effect: non-scaling-stroke;
}

/* Pointe effilée : de largeur 0 à celle du trait, sur trois fois sa largeur. */
.cap-cover__trace-tip {
  inset-inline-start: 0;
  inline-size: var(--tip);
}

.cap-cover__trace .cap-cover__trace-tip path {
  fill: currentcolor;
  stroke: none;
}

/* La ligne : rognée à son bord gauche (la pointe prend le relais), libre en hauteur. */
.cap-cover__trace-line {
  --start: max(var(--tip) - 1px, 0px);

  inset-inline-start: var(--start);
  inline-size: calc(100% - var(--start) - var(--join));
  clip-path: inset(-3em 0);
}

/* Le plat du raccord, du bord du H1 au contour du C (1 px de recouvrement : aucun jour). */
.cap-cover__trace-join {
  inset-inline-end: 0;
  inline-size: calc(var(--join) + 1px);
}

/* Le contour du C passe par-dessus le bout du tracé. */
.cap-cover__delie {
  position: relative;
  z-index: 1;
}

.cap-cover__beat {
  transform-box: view-box;
  transform-origin: 0 0;
}

/* ── Chapeau, action, prochain cours ──────────────────────────────────────── */
.cap-cover__chapeau {
  margin-block-start: calc(var(--cover-gap-signature) - var(--text-signature) * 0.2);
}

.cap-cover__chapeau-text {
  max-inline-size: 36rem;
  margin: 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-data-s); /* 16 → 20 */
  font-weight: 400;
  line-height: clamp(1.5rem, 1.407rem + 0.381vw, 1.75rem); /* 24 → 28 */
  text-wrap: pretty;
}

.cap-cover__chapeau-text--long {
  display: none;
}

/*
 * Le lien suit le bouton : 16 px sur mobile (la ligne tient de 375 px à 390 px,
 * même le temps que Figtree arrive), 24 px au-delà. Plus étroit, il passe dessous.
 */
.cap-cover__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: center;
  margin-block-start: 1.5rem;
}

/* Marges de 20 px sur mobile (bouton à fente, v2.css) : la ligne du lien tient à 375 px. */
.cap-cover__cta {
  --button-pad: 20px;
}

.cap-cover__planning {
  display: inline-flex;
  align-items: center;
  min-block-size: 44px;
  font-family: var(--font-body);
  font-size: var(--text-ui);
  font-weight: 500;
}

.cap-cover__next {
  display: flex;
  flex-direction: column;
  min-block-size: calc(2 * 1.375rem);
  margin-block: var(--cover-gap-next) 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.375rem;
}

.cap-cover__next-row {
  white-space: nowrap;
}

/*
 * Sur deux rangées, le point médian entre elles n'est pas affiché, mais il reste
 * lu : la ligne s'entend « mer. 19 h 00 · Cross training » à toutes les largeurs.
 */
.cap-cover__sep--rows {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.cap-cover__next-label {
  font-style: italic;
}

.cap-cover__next-when {
  font-size: 1.0625rem;
}

.cap-cover__next-name {
  font-weight: 600;
}

/* ── Tablette et ordinateur ───────────────────────────────────────────────── */
@media (min-width: 48em) {
  .cap-cover__body {
    --cap-cover-edge: calc(
      var(--pad) + (100cqi - 2 * var(--pad) - (var(--grid-columns) - 1) * var(--gap)) /
        var(--grid-columns) + var(--gap)
    );
  }

  .cap-cover__body > * {
    grid-column: 2 / -1;
  }

  .cap-cover__body > .cap-cover__title {
    grid-column: 2 / 8;
    margin-inline: 0;
  }

  .cap-cover__body > .cap-cover__chapeau {
    grid-column: 2 / 7;
  }

  .cap-cover__title {
    --fs-delie: max(4rem, 100cqi / var(--em-delie-d));
    --fs-plein: max(2.75rem, 100cqi / var(--em-plein-d));
  }

  /* Colonnes 2 à 6 : trois lignes à 1440 ; la mesure ne s'allonge pas au-delà. */
  .cap-cover__chapeau-text {
    max-inline-size: 34rem;
  }

  .cap-cover__chapeau-text--long {
    display: block;
  }

  .cap-cover__chapeau-text--short {
    display: none;
  }

  .cap-cover__actions {
    column-gap: 1.5rem;
  }

  .cap-cover__cta {
    --button-pad: 24px;
  }

  /* Une seule ligne de 28 px : « Prochain cours · mer. 19 h 00 · Cross training · dans 40 min ». */
  .cap-cover__next {
    display: block;
    min-block-size: 1.75rem;
    line-height: 1.75rem;
    white-space: nowrap;
  }

  .cap-cover__sep--rows {
    position: static;
    inline-size: auto;
    block-size: auto;
    overflow: visible;
    clip-path: none;
  }

  .cap-cover__next-when {
    font-size: 1.5rem;
  }

  .cap-cover__next-name {
    font-size: var(--text-ui);
  }
}

@media (min-width: 64em) {
  .cap-cover__body > .cap-cover__title {
    grid-column: 2 / 11;
  }
}

/* Paysage, à partir de 48em : le titre croise le bas des fenêtres. */
@media (min-width: 48em) and (min-aspect-ratio: 1/1) {
  .cap-cover__veil--title {
    display: block;
  }
}

/*
 * Tablette en portrait : la photo d'ordinateur, recadrée au centre, met les
 * jambes du groupe sous le chapeau. Le voile monte plus haut et plus dense
 * (mesuré : texte courant à 8:1 au moins, contre 4:1 avec le voile d'ordinateur).
 */
@media (min-width: 48em) and (max-aspect-ratio: 1/1) {
  .cap-cover__veil--bottom {
    background: linear-gradient(
      to top,
      rgb(12 12 11 / 0.7) 0,
      rgb(12 12 11 / 0.6) 30%,
      rgb(12 12 11 / 0) 58%
    );
  }
}

/* Sous 358 px, la marge ne peut plus porter le complexe entier : le tracé se retire. */
@media (max-width: 22.4em) {
  .cap-cover__trace {
    display: none;
  }
}

/*
 * ── Mobile : Plan B LCP (brief §7.1) ─────────────────────────────────────────
 * Le simulateur de Lighthouse compte, pour une image LCP, tout ce qui a fini de
 * charger avant elle, JS compris : la photo plein cadre manquait P3 (LCP mobile
 * simulé de 2,8 à 3,1 s). Un texte peint dès la première image n'est compté que
 * jusqu'au FCP (≈ 1,2 s). Le premier écran ne porte donc que le bloc de texte,
 * sur noir, ancré en bas aux mêmes cotes que sur la photo ; la photo vient
 * dessous, en 4:5, et commence au bas de l'écran. Aucun de ses pixels ne doit
 * être visible au chargement : elle redeviendrait l'élément LCP (mesuré : la
 * moindre bande de photo dépasse la surface d'une ligne du H1).
 */
@media (max-width: 47.99em) {
  .cap-cover {
    justify-content: flex-start;
    min-block-size: 0;
  }

  /* Un écran, depuis le bas du bandeau : le texte reste ancré en bas, à 32 px du bord. */
  .cap-cover__body {
    align-content: end;
    min-block-size: calc(100svh - var(--banner-height));
  }

  /*
   * La photo suit le texte. Elle est décorative (alt vide) et jamais focalisable :
   * `order` ne change ni la lecture ni l'ordre du focus. En paysage, un écran au
   * plus. Sans min-block-size: 0, l'image (1:2) imposerait sa hauteur au 4:5.
   */
  .cap-cover__photo {
    position: relative;
    inset: auto;
    z-index: 0;
    order: 1;
    aspect-ratio: 4 / 5;
    min-block-size: 0;
    max-block-size: 100svh;
  }

  /* Le recadrage 1:2, vu en 4:5 : de la tête aux hanches. */
  .cap-cover .cap-cover__photo :deep(.cap-photo__img) {
    object-position: 50% 0;
  }

  /* Plus aucun texte sur la photo : ses voiles de contraste n'ont plus d'objet. */
  .cap-cover__veil--top,
  .cap-cover__veil--bottom {
    display: none;
  }

  /* À chasse 100 %, la courbe basse du C rejoint la ligne de base plus tôt. */
  .cap-cover__trace {
    --join: 0.165em;
  }
}

/* Paysage mobile : le bloc reprend le flux depuis le haut (y 120). */
@media (max-height: 30em) {
  .cap-cover {
    justify-content: flex-start;
  }

  .cap-cover__body {
    padding-block-start: calc(120px - var(--banner-height));
  }
}

/*
 * ── Intro « écrire, frapper, se poser » ──────────────────────────────────────
 * Sous html.hero-intro seulement : sans elle (mouvement réduit, JS absent,
 * arrivée par ancre, retour du bfcache), tout est dans l'état final. Les
 * animations n'ont qu'un remplissage « backwards » : finies, elles ne retiennent
 * rien. Avant hero-ready, tout attend en pause sur sa première image clé. Le
 * bouton et le lien ne sont jamais animés.
 */
html.hero-intro:not(.hero-ready) .cap-cover {
  --intro-state: paused;
}

html.hero-intro .cap-cover__veil--intro {
  display: block;
  animation: cap-cover-veil var(--dur-focal) var(--ease-out) var(--intro-veil) backwards
    var(--intro-state);
}

/* Écrire : le tracé avance à vitesse de papier constante, de gauche à droite. */
html.hero-intro .cap-cover__trace {
  animation: cap-cover-write var(--dur-beat) var(--ease-trace) var(--intro-trace) backwards
    var(--intro-state);
}

/* Le tracé entre dans « Chacun » : le mot se découvre de gauche à droite. */
html.hero-intro .cap-cover__delie {
  animation: cap-cover-enter var(--intro-word-duration) var(--ease-out) var(--intro-word) backwards
    var(--intro-state);
}

/*
 * Frapper : « son rythme. » part au contour craie (le texte réel), et sa copie
 * pleine se découvre en montant depuis la ligne de base, au passage du pic R.
 * Les deux finissent ensemble : le texte réel redevient plein, la copie s'efface.
 */
html.hero-intro .cap-cover__plein :deep(.cap-fit__word) {
  animation: cap-cover-ghost calc(var(--intro-strike) + var(--dur-strike)) linear backwards
    var(--intro-state);
}

html.hero-intro .cap-cover__strike {
  display: block;
  visibility: hidden;
}

html.hero-intro .cap-cover__strike :deep(.cap-fit__word) {
  animation: cap-cover-strike var(--dur-strike) var(--ease-strike) var(--intro-strike) backwards
    var(--intro-state);
}

/* Se poser : chapeau et signature montent dans leur masque, le prochain cours apparaît. */
html.hero-intro .cap-cover__chapeau {
  overflow-y: clip;
}

html.hero-intro .cap-cover__chapeau-text {
  animation: cap-cover-rise-step var(--dur-layout) var(--ease-out) var(--intro-chapeau) backwards
    var(--intro-state);
}

html.hero-intro .cap-cover__signature {
  clip-path: inset(-1em -1em -0.3em);
}

html.hero-intro .cap-cover__signature-text {
  animation: cap-cover-rise var(--dur-layout) var(--ease-out) var(--intro-signature) backwards
    var(--intro-state);
}

html.hero-intro .cap-cover__next {
  animation: cap-cover-fade var(--dur-state) var(--ease-out-soft) var(--intro-next) backwards
    var(--intro-state);
}

@keyframes cap-cover-veil {
  from {
    opacity: 0.45;
  }

  to {
    opacity: 0;
  }
}

@keyframes cap-cover-write {
  from {
    clip-path: inset(-3em 100% -3em 0);
  }

  to {
    clip-path: inset(-3em 0 -3em 0);
  }
}

@keyframes cap-cover-enter {
  from {
    clip-path: inset(-0.2em 100% -0.2em -0.2em);
  }

  to {
    clip-path: inset(-0.2em -0.2em -0.2em -0.2em);
  }
}

@keyframes cap-cover-ghost {
  from,
  to {
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: max(2px, 0.04em) currentcolor;
  }
}

/*
 * De la ligne de base, à 82,3 % de la hauteur de ligne (0,7075 / 0,86), au haut
 * de la boîte (§4.2 : inset(0)) : juste au-dessus du contour fantôme, dont le
 * trait dépasse de 0,02 em le haut des capitales. Finir plus haut balaierait du
 * vide : le remplissage visible s'arrêterait net vers 127 ms, à pleine vitesse,
 * au lieu de se poser sur les 230 ms de --ease-strike.
 */
@keyframes cap-cover-strike {
  from {
    visibility: visible;
    clip-path: inset(82.3% -0.2em 0 -0.2em);
  }

  to {
    visibility: visible;
    clip-path: inset(0 -0.2em 0 -0.2em);
  }
}

/*
 * Le texte monte d'un pas (--move-s) dans son masque, en fondu : les trois lignes
 * arrivent ensemble, dans l'ordre de lecture (un balayage depuis le bas montrait
 * la dernière ligne d'abord). Départ à 0,01 et non 0, invisible sur le noir : un
 * texte d'opacité nulle n'est pas peint, donc pas candidat LCP au premier rendu.
 * Il le deviendrait en apparaissant, vers 1,3 s, et sous 400 px (Plan B) il est
 * plus grand que les lignes du H1 (mesuré : LCP observé de 0,2 à 1,3 s).
 */
@keyframes cap-cover-rise-step {
  from {
    opacity: 0.01;
    transform: translateY(var(--move-s));
  }
}

@keyframes cap-cover-rise {
  from {
    transform: translateY(calc(100% + 0.3em));
  }
}

@keyframes cap-cover-fade {
  from {
    opacity: 0;
  }
}

/* ── Contrastes forcés : tracé en CanvasText, voiles et frappe retirés ─────── */
@media (forced-colors: active) {
  .cap-cover__veil {
    display: none;
  }

  .cap-cover__trace {
    color: CanvasText;
  }

  .cap-cover__trace .cap-cover__trace-tip path {
    fill: CanvasText;
  }

  /* Le fond de lecture du délié ne doit pas couvrir le haut du plein. */
  .cap-cover__delie {
    z-index: auto;
  }

  html.hero-intro .cap-cover__plein :deep(.cap-fit__word) {
    animation: none;
  }

  html.hero-intro .cap-cover__strike {
    display: none;
  }
}
</style>
