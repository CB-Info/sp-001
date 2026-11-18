<script setup lang="ts">
import { cap } from '~/data/cap';
import { capFit } from '~/data/cap-fit';
import { followScroll, scroll } from '~/motion/scroll';
import { approach, intensity } from '~/motion/speed';
import { duration } from '~/motion/tokens';
import {
  formatHeure,
  jourCourt,
  prochainCours,
  semaineProchaine,
  useParisClock,
} from '~/utils/cap-time';
import { complexAtR, complexFrom, path, SPAN_RATIO, type Point } from '~/utils/ecg';

/**
 * Chapitre 7, la fin (#fin) : le dernier battement et la dernière action, en écho
 * à la couverture (brief docs/brief/v2.md, §4.8). Surface nuit, filet graphite en
 * haut (après le carbone des infos pratiques). Ni épinglage, ni dégradé.
 *
 * Gabarit G7 : « Ensemble, » plein craie géant sur les colonnes 1 à 8, la
 * signature craie « allons plus loin. » ferrée à droite dessous (le tube est
 * citron : R4). Le tube citron repose sur la ligne de base du plein et sort à
 * droite jusqu'au bord de l'écran, avec son complexe (R5 : un tube accompagne un
 * plein). La donnée est posée sur sa ligne plate : « On t'attend mer. 19 h 00 ? ».
 * Sous 64em, le plein prend la largeur, et le tube passe dessous, d'un bord de
 * l'écran à l'autre.
 *
 * Ordre du DOM = ordre de lecture : H2, donnée, bouton. Le tracé est décoratif
 * (aria-hidden).
 *
 * Mouvement (html.has-motion seulement ; sinon, le tube est dessiné, immobile) :
 * - O3, « dernier battement » : une seule fois, quand le haut de la section
 *   passe à 40 % de l'écran, le complexe s'aplatit (scaleY 1 → 0,06, 430 ms,
 *   --ease-in-out), puis bat (0,06 → 1, 230 ms, --ease-strike). Le H2 ne bouge
 *   pas ;
 * - O2 : l'amplitude du même complexe suit la vitesse de défilement, tant que le
 *   tube est à l'écran.
 */

const titleId = 'fin-titre';

/* ── Mesure du plein ajusté ──────────────────────────────────────────────────
 * Même calcul que CapFitWord (largeur mesurée en em, plus l'approche par lettre) :
 * la taille de « Ensemble, » est connue en CSS, pour poser le tube sur sa ligne de
 * base et le dimensionner (amplitude R = 0,8 capitale, aiguille comprise ≈ 1,1).
 */
const TRACKING_PLEIN = -0.005;
const fit = (() => {
  // Chasses de la plus large (ordinateur) à la plus étroite (mobile).
  const widths = Object.entries(capFit['fin.plein'].em)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([, em]) => em);
  const extra = [...cap.finale.plein].length * TRACKING_PLEIN;
  const desktop = (widths[0] ?? 1) + extra;
  return { desktop, mobile: (widths[1] ?? desktop - extra) + extra };
})();

const bodyStyle = {
  '--em-d': fit.desktop.toFixed(4),
  '--em-m': fit.mobile.toFixed(4),
};

/* ── Le tube citron (§2.8, style « tube ») ───────────────────────────────────
 * Unités : la capitale du plein vaut 100 ; y = 0 est la ligne de base (l'origine
 * des mises à l'échelle O2 et O3), x = 0 le départ du tube. Amorce plate de
 * 0,1 capitale, complexe d'amplitude 80 et d'empan 99, puis ligne plate jusqu'au
 * bord de l'écran (rognée par la section). Sous 64em, une amorce part aussi vers
 * la gauche, jusqu'au bord de l'écran.
 *
 * Masque : trait blanc de 8 (0,08 capitale), moins trait noir de 3,6 : il reste
 * deux parois de 2,2, l'intérieur est réellement transparent. Le trait noir part
 * 2,2 unités après le blanc : le départ du tube est fermé par une paroi. Le rect
 * citron passe par ce masque. Extrémités droites (butt).
 *
 * Pointes vives, comme le logo : le tube fin finit chaque pic en aiguille (onglet
 * de 20). L'aiguille prolonge le pic R d'environ 33 unités : l'amplitude de 80
 * garde la hauteur visible d'avant (≈ 113, contre 110 + le sommet coupé), et
 * l'empan de 99 garde la largeur du complexe, donc la place de la donnée.
 *
 * Tout le tracé (lignes plates comprises) est mis à l'échelle autour de la ligne
 * de base : les plats restent en place, seul le complexe change d'amplitude, et
 * le contour reste d'un seul tenant (vector-effect: non-scaling-stroke garde
 * l'épaisseur des parois).
 */
const CAP = 100;
const AMP = 0.8 * CAP;
/** Empan d'avant (0,9 × 110) : la donnée posée sur le tube garde sa place. */
const SPAN = SPAN_RATIO * 1.1 * CAP;
const LEAD = 0.1 * CAP;
const WALL = 0.022 * CAP;
/** Longueurs des plats, vers la gauche (mobile) et vers la droite : plus que tout écran. */
const BLEED = 10 * CAP;
const REACH = 20 * CAP;
/** Marges verticales : le complexe à 1,35 fois son amplitude (O2), plus l'aiguille du pic (≈ 44). */
const RISE = 1.6 * CAP;
const FALL = 1.5 * CAP;

const complex = complexFrom(LEAD, 0, AMP, SPAN);
const outer: Point[] = [[0, 0], ...complex, [REACH, 0]];
const inner: Point[] = [[WALL, 0], ...complex, [REACH, 0]];
const box = { x: -BLEED, y: -RISE, width: BLEED + REACH, height: RISE + FALL };
const tube = {
  viewBox: `${box.x} ${box.y} ${box.width} ${box.height}`,
  outer: path(outer),
  inner: path(inner),
  bleedOuter: `M${-BLEED} 0H0`,
  bleedInner: `M${-BLEED} 0H${WALL}`,
};
const maskId = useId();

/*
 * Mini-complexe du bouton (20 × 14, style « instrument »), comme celui de la
 * couverture : il s'écrit au survol et au focus dans la fente réservée à gauche
 * du libellé (.cap-button--fente, v2.css). Au repos, la fente est vide.
 */
const PULSE_BASELINE = 7.2;
const pulse = path([
  [0, PULSE_BASELINE],
  ...complexAtR(10, PULSE_BASELINE, 6.2),
  [20, PULSE_BASELINE],
]);

/* ── La donnée posée sur le tube, à l'heure de Paris ──────────────────────────
 * Rendu serveur et premier rendu client : l'horloge vaut undefined, d'où la
 * phrase neutre (« On t'attend au prochain cours ? »). Après le montage : le
 * cours choisi dans une fiche (état partagé « cap-choix »), sinon le prochain
 * cours réel. La ligne garde la même boîte dans les deux états : aucun saut.
 * Un créneau choisi déjà commencé aujourd'hui garde la phrase neutre : « On
 * t'attend mer. 18 h 00 ? » à 18 h 20 inviterait à un cours en cours, et
 * « mer. prochain » ne tient pas dans la boîte posée sur le tube.
 */
const NBSP = ' ';
const clock = useParisClock();
const choice = useState<string | null>('cap-choix', () => null);
const when = computed(() => {
  if (!clock.value) return undefined;
  const chosen = choice.value
    ? cap.sessions.find((session) => session.id === choice.value)
    : undefined;
  if (chosen && semaineProchaine(chosen, clock.value)) return undefined;
  const session = chosen ?? prochainCours(cap.sessions, clock.value)?.session;
  return session && `${jourCourt(session.day)}${NBSP}${formatHeure(session.start)}`;
});

/* ── Mouvement : O3 puis O2 sur le même complexe ─────────────────────────────
 * Les deux effets se composent dans une seule mise à l'échelle verticale
 * (--fin-beat × --fin-amp), origine sur la ligne de base.
 */
/** O2 : scaleY(1 + 0,35 × intensité), lissé par `approach` (retour au calme en ≈ 300 ms). */
const AMPLIFY = 0.35;
/** O3 : le complexe aplati garde 6 % de son amplitude. */
const FLAT = 0.06;
/** O3 : le haut de la section passe à 40 % de la hauteur de l'écran. */
const LAST_BEAT_LINE = 0.4;

/**
 * Déclencheur du dernier battement, sur le modèle d'ENTRY (app/motion/sequence.ts) :
 * une section trop près du bas du document pour atteindre la ligne bat juste
 * avant la butée.
 */
const LAST_BEAT = {
  start: ({ trigger }: { trigger?: Element }) => {
    if (!trigger) return `top ${LAST_BEAT_LINE * 100}%`;
    const line = trigger.getBoundingClientRect().top + scrollY - innerHeight * LAST_BEAT_LINE;
    return Math.min(line, document.documentElement.scrollHeight - innerHeight - 1);
  },
  end: 'max',
  once: true,
} as const;

/** Une seule occurrence par visite, jamais rejouée (même au retour du mouvement). */
let beaten = false;

const section = useTemplateRef<HTMLElement>('section');

useMotion(section, ({ gsap, ScrollTrigger }, root) => {
  const trace = root.querySelector<SVGSVGElement>('[data-motion="fin-tube"]');
  const beat = root.querySelector<SVGGElement>('[data-motion="fin-beat"]');
  if (!trace || !beat) return undefined;

  // ── O2 : amplitude liée à la vitesse ───────────────────────────────────────
  let level = 0;
  const paint = (value: number) => {
    if (value === 0) beat.style.removeProperty('--fin-amp');
    else beat.style.setProperty('--fin-amp', (1 + AMPLIFY * value).toFixed(4));
  };
  /** Une image de l'effet ; `true` tant qu'il n'est pas revenu au repos. */
  const follow = () => {
    const target = Math.abs(intensity(scroll.velocity));
    if (target === 0 && level === 0) return false;
    level = approach(level, target, gsap.ticker.deltaRatio(60));
    paint(level);
    return level > 0;
  };

  // Rien ne tourne quand le tube est hors de l'écran.
  let following: (() => void) | undefined;
  const rest = () => {
    following?.();
    following = undefined;
    level = 0;
    paint(0);
  };
  ScrollTrigger.create({
    trigger: trace,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => {
      rest();
      if (isActive) following = followScroll(follow);
    },
  });

  // ── O3 : dernier battement, si la section n'a pas déjà passé la ligne ──────
  const settle = () => beat.style.removeProperty('--fin-beat');
  const passed = root.getBoundingClientRect().top < innerHeight * LAST_BEAT_LINE;
  if (!beaten && !passed) {
    const lastBeat = gsap
      .timeline({ paused: true, onComplete: settle })
      .fromTo(
        beat,
        { '--fin-beat': 1 },
        { '--fin-beat': FLAT, duration: duration('--dur-layout'), ease: 'in-out' },
      )
      .to(beat, { '--fin-beat': 1, duration: duration('--dur-strike'), ease: 'strike' });
    ScrollTrigger.create({
      trigger: root,
      ...LAST_BEAT,
      onEnter: () => {
        beaten = true;
        lastBeat.play();
      },
    });
  }

  return () => {
    rest();
    settle();
  };
});
</script>

<template>
  <section id="fin" ref="section" class="cap-finale" data-surface="nuit" :aria-labelledby="titleId">
    <div class="cap-finale__body" :style="bodyStyle">
      <div class="cap-finale__lockup">
        <h2 :id="titleId" class="cap-finale__title">
          <CapFitWord fit-key="fin.plein" :text="cap.finale.plein" />
          {{ ' ' }}
          <span class="cap-finale__signature cap-signature">{{ cap.finale.signature }}</span>
        </h2>

        <!-- La ligne plate du tube : sa base est la ligne de base du tracé. -->
        <div class="cap-finale__ligne">
          <span class="cap-finale__tube" data-ecg aria-hidden="true">
            <svg :viewBox="tube.viewBox" focusable="false" data-motion="fin-tube">
              <mask :id="maskId" maskUnits="userSpaceOnUse" v-bind="box">
                <g class="cap-finale__beat" data-motion="fin-beat">
                  <path class="cap-finale__wall cap-finale__bleed" :d="tube.bleedOuter" />
                  <path class="cap-finale__wall" :d="tube.outer" />
                  <path class="cap-finale__hollow cap-finale__bleed" :d="tube.bleedInner" />
                  <path class="cap-finale__hollow" :d="tube.inner" />
                </g>
              </mask>
              <rect class="cap-finale__tube-fill" v-bind="box" :mask="`url(#${maskId})`" />
            </svg>
          </span>

          <p class="cap-finale__attente">
            <template v-if="when">
              <span class="cap-finale__mot">{{ cap.finale.attente }}</span>
              {{ ' ' }}
              <span class="cap-finale__quand cap-data">{{ when }}</span>
              <span class="cap-finale__mot">{{ cap.finale.attenteFin }}</span>
            </template>
            <span v-else class="cap-finale__mot">{{ cap.finale.attenteNeutre }}</span>
          </p>
        </div>
      </div>

      <a class="cap-finale__cta cap-button cap-button--l cap-button--fente" href="#reserver">
        <span class="cap-button__libelle">
          <svg class="cap-button__pulse" viewBox="0 0 20 14" aria-hidden="true" focusable="false">
            <path :d="pulse" />
          </svg>
          {{ cap.ui.reserve }}
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
/*
 * Cotes @1440 (brief §4.8) : « Ensemble, » sur les colonnes 1 à 8 (872 px),
 * 181 px, capitale de 122 px, ligne de base Y ; signature de 40 px ferrée à
 * droite sur x 932, haut des capitales à Y + 22 ; tube de x 956 au bord de
 * l'écran, complexe de x 968 à 1088 (amplitude 98, aiguille comprise ≈ 138), tube
 * de 10 px et parois de 2,7 px ; donnée de x 1112 à 1380, ligne de base à Y − 14 ; bouton à x 60,
 * 48 px sous la ligne de base de la signature. @390 : « Ensemble, » à 78 px,
 * signature à gauche, tube pleine largeur (complexe de x 20 à 71, tube de
 * 7,8 px), donnée dès x 88, bouton pleine largeur.
 */
.cap-finale {
  container-type: inline-size;
  overflow-x: clip;
  padding-block: var(--pad-xl) var(--pad-l);
  border-block-start: 1px solid var(--cf-graphite);
  background: var(--cf-noir);
  color: var(--cf-craie);
}

/*
 * Le corps est le conteneur de mesure : 100cqi y vaut la largeur du contenu.
 * --title-w : largeur du H2 (le conteneur de CapFitWord) ; --fs : taille de
 * « Ensemble, » ; --cap : sa capitale (0,675 em), l'unité du tube.
 */
.cap-finale__body {
  --pad: max(var(--page-gutter), (100cqi - var(--content-max)) / 2);
  --title-w: 100cqi;
  --fs: max(2.75rem, var(--title-w) / var(--em-m));
  --cap: calc(var(--fs) * 0.675);

  container-type: inline-size;
  padding-inline: var(--pad);
}

.cap-finale__lockup {
  position: relative;
}

/* ── H2 : plein, puis signature ───────────────────────────────────────────── */
.cap-finale__title {
  inline-size: var(--title-w);
  margin: 0;
}

/*
 * R4. Signature : haut de ses capitales à 0,18 capitale du plein sous sa ligne de
 * base. CAP Display (interligne 0,86) : la ligne finit 0,1525 em sous la ligne de
 * base ; Figtree (interligne 1,1) : capitale à 0,2 em du haut de la ligne.
 */
.cap-finale__signature {
  margin-block-start: calc(var(--fs) * -0.031 - var(--text-signature) * 0.2);
}

/* ── Ligne du tube : sa base est la ligne de base du tracé ─────────────────── */
/*
 * Mobile et tablette : une rangée pleine largeur sous la signature, d'un bord de
 * l'écran à l'autre. --x0 : départ du tube (son amorce), pour que le complexe
 * commence sur la marge de gauche.
 */
.cap-finale__ligne {
  --x0: calc(var(--page-gutter) - var(--cap) * 0.1);

  position: relative;
  block-size: calc(var(--cap) * 1.1);
  margin-block-start: calc(var(--pad-s) - var(--text-signature) * 0.2);
  margin-inline: calc(var(--page-gutter) * -1);
}

.cap-finale__tube {
  position: absolute;
  inset: 0;
  font-size: var(--cap);
  pointer-events: none;
}

/* 30 capitales de large sur 3,1 de haut (viewBox -1000 -160 3000 310), ligne de base en bas de la rangée. */
.cap-finale__tube svg {
  position: absolute;
  inset-block-start: calc(100% - 1.6em);
  inset-inline-start: calc(var(--x0) - 10em);
  inline-size: 30em;
  max-inline-size: none;
  block-size: 3.1em;
  overflow: visible;
}

.cap-finale__tube-fill {
  fill: var(--cf-citron);
}

.cap-finale__beat {
  transform: scaleY(calc(var(--fin-beat, 1) * var(--fin-amp, 1)));
  transform-box: view-box;
  transform-origin: 0 0;
}

.cap-finale__beat path {
  fill: none;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  /* Pointes vives, comme le logo : le pic R (≈ 10°) demande un onglet de 11,3 (15 étiré par O2). */
  stroke-miterlimit: 20;
  vector-effect: non-scaling-stroke;
}

/* Paroi extérieure (0,08 capitale), puis le creux (0,036) : deux parois de 0,022. */
.cap-finale__beat .cap-finale__wall {
  stroke: #fff;
  stroke-width: 0.08em;
}

.cap-finale__beat .cap-finale__hollow {
  stroke: #000;
  stroke-width: 0.036em;
}

/*
 * La donnée posée sur la ligne plate : sa ligne de base 5 px au-dessus du tube.
 * La boîte de ligne est celle de la donnée (CAP Display, interligne 0,9 : elle
 * finit 0,1725 em sous la ligne de base, au-dessus de la paroi du tube, même
 * sous la plaque de lecture des contrastes forcés) dans les deux états, neutre
 * ou à l'heure : aucun saut. Ancrée par le bas, elle monte sur deux lignes quand
 * la place manque.
 */
.cap-finale__attente {
  position: absolute;
  inset-block-end: calc(var(--cap) * 0.04 + 5px - 0.1725em);
  inset-inline: calc(var(--x0) + var(--cap) * 1.09 + var(--gap)) var(--page-gutter);
  margin: 0;
  color: var(--cf-craie);
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 1.236rem + 0.571vw, 1.75rem); /* 22 → 28 */
  font-stretch: var(--wdth-donnee);
  font-weight: 900;
  font-feature-settings: 'tnum';
  line-height: 0.9;
}

.cap-finale__mot {
  font-family: var(--font-body);
  font-size: var(--text-body); /* 16 → 18 */
  font-stretch: normal;
  font-weight: 500;
}

/* ── Bouton : sous le creux du complexe (mobile), sous la signature (ordinateur) ── */
.cap-finale__cta {
  display: flex;
  inline-size: 100%;
  margin-block-start: calc(var(--cap) * 1.01 + var(--pad-s));
}

/* ── Tablette : le plein sur les colonnes 1 à 6, signature ferrée à droite ── */
@media (min-width: 48em) {
  .cap-finale__body {
    --title-w: calc(0.75 * 100cqi - 0.25 * var(--gap));
    --fs: max(2.75rem, var(--title-w) / var(--em-d));
  }

  /*
   * Ferrée à droite sur le E, pas sur la virgule : la queue de la virgule
   * descend sous la ligne de base et toucherait le point du i de « loin ».
   * La virgule pend, comme une ponctuation suspendue (chasse mesurée de « , »
   * en CAP Display à 80 % : 0,2875 em, approche comprise).
   */
  .cap-finale__signature {
    padding-inline-end: calc(var(--fs) * 0.2875);
    text-align: end;
  }

  .cap-finale__cta {
    inline-size: fit-content;
  }
}

/*
 * Ordinateur : le plein sur les colonnes 1 à 8 ; le tube part une gouttière
 * après lui, sur sa ligne de base, et sort à droite jusqu'au bord de l'écran.
 */
@media (min-width: 64em) {
  .cap-finale__body {
    --title-w: calc((2 * 100cqi - var(--gap)) / 3);
  }

  .cap-finale__ligne {
    --x0: 0px;

    position: absolute;
    inset-block-start: 0;
    inset-inline: calc(var(--title-w) + var(--gap)) 0;
    block-size: calc(var(--fs) * 0.7075);
    margin: 0;
  }

  .cap-finale__bleed {
    display: none;
  }

  .cap-finale__attente {
    inset-inline-end: 0;
  }

  .cap-finale__cta {
    margin-block-start: calc(3rem - var(--text-signature) * 0.2);
  }
}

/* ── Contrastes forcés : le tube en CanvasText, son masque intact ──────────── */
@media (forced-colors: active) {
  .cap-finale__tube {
    forced-color-adjust: none;
  }

  .cap-finale__tube-fill {
    fill: CanvasText;
  }
}
</style>
