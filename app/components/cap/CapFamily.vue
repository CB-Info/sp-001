<script setup lang="ts">
import { cap } from '~/data/cap';
import { capFit, type CapFitKey } from '~/data/cap-fit';
import { reached } from '~/motion/sequence';
import { duration } from '~/motion/tokens';

/**
 * Chapitre 5, la famille (#famille) : « Plus qu'une salle, une famille. », la
 * preuve humaine d'une salle de village (brief docs/brief/v2.md, §4.6). Surface
 * photo, puis nuit ; aucune photo n'est cliquable.
 *
 * Gabarit G5, à cheval : « Plus qu'une salle, » en délié citron sur toute la
 * largeur, sa ligne de base posée exactement sur le bord bas de la photo (on voit
 * la photo à travers les lettres) ; « une famille. » en plein craie géant, ferré
 * à droite, sur le noir, juste sous la rupture. Pas de tracé : le chapitre de
 * l'humain est le seul titre sans signe.
 *
 * Dessous, honnêtement : le chapeau, puis deux cadres pointillés qui attendent
 * le club (les avis Google, puis l'équipe). Ni cartes de coach, ni faux avis.
 *
 * Mouvement, rien d'autre que :
 * - le voile : un calque noir sur la photo, lié au défilement, de 0,5 à 0 quand
 *   le haut de la section monte du bas au milieu de l'écran (opacité seule) ;
 * - la frappe de « une famille. » quand sa ligne de base passe à 70 % de
 *   l'écran : contour craie, puis plein, rempli depuis la ligne de base (230 ms,
 *   --ease-strike).
 * Les deux états initiaux ne sont posés par le JS que si leur élément est encore
 * hors de l'écran : sans JS, en mouvement réduit, sur une arrivée par ancre ou au
 * retour arrière, la photo est nette et le mot plein.
 */

const titleId = 'famille-titre';

/* ── Mesures des mots ajustés ────────────────────────────────────────────────
 * Mêmes calculs que CapFitWord (largeur mesurée en em, plus l'approche par
 * lettre) : la taille des deux lignes est connue en CSS, pour poser la ligne de
 * base du délié sur le bord de la photo et caler le plein et le chapeau.
 */
type Style = 'delie' | 'plein';
const TRACKING: Record<Style, number> = { delie: 0.01, plein: -0.005 };

function fitEm(key: CapFitKey, text: string, styles: [Style, Style]) {
  // Chasses de la plus large (ordinateur) à la plus étroite (mobile).
  const widths = Object.entries(capFit[key].em)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([, em]) => em);
  const letters = [...text].length;
  const desktop = (widths[0] ?? 1) + letters * TRACKING[styles[0]];
  const mobile = (widths[1] ?? widths[0] ?? 1) + letters * TRACKING[styles[1]];
  return { desktop, mobile };
}

/**
 * « Plus qu'une salle, » : délié citron 125 % sur ordinateur ; plein citron 75 %
 * en dessous, où il mesurerait moins de 64 px (R2).
 */
const DELIE_STYLES: [Style, Style] = ['delie', 'plein'];
/** Plancher (rem) : le mot plein mobile fait 44 px à 390, 35 px à 320 ; il ne bute jamais. */
const DELIE_FLOOR = 1.5;
/** « une famille. » occupe 86,23 % de la ligne sur ordinateur (200 px à 1440), toute la ligne en dessous. */
const PLEIN_PART: [number, number] = [0.8623, 1];

const delie = fitEm('famille.delie', cap.family.delie, DELIE_STYLES);
const plein = fitEm('famille.plein', cap.family.plein, ['plein', 'plein']);

const sectionStyle = {
  '--em-delie-d': delie.desktop.toFixed(4),
  '--em-delie-m': delie.mobile.toFixed(4),
  '--em-plein-d': plein.desktop.toFixed(4),
  '--em-plein-m': plein.mobile.toFixed(4),
  '--delie-floor': `${DELIE_FLOOR}rem`,
  '--plein-part': PLEIN_PART[0],
};

/* ── Mouvement ───────────────────────────────────────────────────────────────
 * Ligne de base de CAP Display dans une ligne d'interligne 0,86 (CapFitWord) :
 * à 0,7075 em du haut, soit 82,27 % de la boîte.
 */
const BASELINE = 0.7075 / 0.86;
/** Ligne de partage de la frappe, au repos : la ligne de base. */
const STRIKE_FROM = `${(BASELINE * 100).toFixed(2)}%`;
/** Fin de la frappe : au-dessus des capitales (aucun accent dans « une famille. »). */
const STRIKE_TO = '-20%';
/** La ligne de base de « une famille. » frappe en passant à 70 % de la hauteur de l'écran. */
const STRIKE_LINE = 0.7;
/** Opacité de départ du voile, rendue à 0 par le défilement. */
const VEIL_FROM = 0.5;

/**
 * Déclencheur de la frappe, sur le modèle d'ENTRY (app/motion/sequence.ts) mais
 * mesuré sur la ligne de base du mot, pas sur le haut de sa boîte. Une ligne trop
 * près du bas du document pour atteindre la ligne frappe juste avant la butée,
 * au lieu de rester au contour.
 */
const STRIKE = {
  start: ({ trigger }: { trigger?: Element }) => {
    if (!trigger) return `top ${STRIKE_LINE * 100}%`;
    const box = trigger.getBoundingClientRect();
    const line = box.top + box.height * BASELINE + scrollY - innerHeight * STRIKE_LINE;
    return Math.min(line, document.documentElement.scrollHeight - innerHeight - 1);
  },
  once: true,
} as const;

/** Une seule frappe par visite : un retour du mouvement (matchMedia) ne la rejoue pas. */
let struck = false;

const section = useTemplateRef<HTMLElement>('section');

useMotion(section, ({ gsap, ScrollTrigger }, root) => {
  /*
   * Le voile : lié au défilement, du bas de l'écran (100 %) à son milieu (50 %).
   * Il n'est posé que si la section est encore sous l'écran. Hydratée « à la
   * vue » sans marge (v2.vue), elle y est déjà quand ce code tourne : le voile
   * n'existe alors qu'avec une marge d'hydratation (rootMargin) d'un écran.
   */
  const veil = root.querySelector<HTMLElement>('[data-motion="famille-voile"]');
  if (veil && !reached(root)) {
    gsap.fromTo(
      veil,
      { opacity: VEIL_FROM },
      {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'top center', scrub: true },
      },
    );
  }

  // ── La frappe de « une famille. ».
  const word = root.querySelector<HTMLElement>('[data-motion="famille-plein"]');
  // Déjà à l'écran (ou dépassé) : le mot reste plein.
  if (struck || !word || reached(word)) return undefined;

  const disarm = () => {
    delete word.dataset.frappe;
    word.style.removeProperty('--frappe');
  };

  word.dataset.frappe = '';
  gsap.set(word, { '--frappe': STRIKE_FROM });

  const strike = gsap.to(word, {
    '--frappe': STRIKE_TO,
    duration: duration('--dur-strike'),
    ease: 'strike',
    paused: true,
    onComplete: () => {
      struck = true;
      disarm();
    },
  });

  ScrollTrigger.create({ trigger: word, ...STRIKE, onEnter: () => strike.play() });

  // Retour en mouvement réduit ou démontage en pleine frappe : état final.
  return disarm;
});
</script>

<template>
  <section
    id="famille"
    ref="section"
    class="cap-family"
    data-surface="nuit"
    :aria-labelledby="titleId"
    :style="sectionStyle"
  >
    <CapPhoto
      class="cap-family__photo"
      :photo="cap.photos.famille"
      sizes="100vw"
      sizes-mobile="100vw"
    >
      <!-- Voile lié au défilement : transparent par défaut (état final). -->
      <span class="cap-family__voile" data-motion="famille-voile" aria-hidden="true" />
    </CapPhoto>

    <h2 :id="titleId" class="cap-family__title">
      <span class="cap-family__line cap-family__line--delie">
        <CapFitWord
          fit-key="famille.delie"
          :text="cap.family.delie"
          :styles="DELIE_STYLES"
          color="citron"
          :floor="DELIE_FLOOR"
        />
      </span>
      {{ ' ' }}
      <span class="cap-family__line cap-family__line--plein" data-motion="famille-plein">
        <CapFitWord
          class="cap-family__plein"
          fit-key="famille.plein"
          :text="cap.family.plein"
          :part="PLEIN_PART"
        />
        <!-- Copie pleine de la frappe : elle s'imprime depuis la ligne de base. -->
        <span class="cap-family__strike" aria-hidden="true">
          <CapFitWord fit-key="famille.plein" :text="cap.family.plein" :part="PLEIN_PART" />
        </span>
      </span>
    </h2>

    <div class="cap-family__body cap-grid">
      <p class="cap-family__chapeau">{{ cap.family.chapeau }}</p>

      <!-- Aucun lien mort : le cadre pointillé dit ce qui manque. -->
      <p class="cap-family__avis cap-family__cadre">{{ cap.family.avis }}</p>

      <div class="cap-family__coachs">
        <h3 class="cap-family__coachs-titre cap-display is-plein">
          {{ cap.family.coachs.titre }}
        </h3>
        <p class="cap-family__coachs-texte">{{ cap.family.coachs.texte }}</p>
        <div class="cap-family__equipe cap-family__cadre">
          <p class="cap-family__equipe-texte">{{ cap.family.coachs.cadre }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Cotes @1440 × 900 (brief §4.6) : photo de 720 px (max(80svh, 35rem)) ;
 * « Plus qu'une salle, » délié citron 125 %, ≈ 97 px sur 1320 px (x 60 à 1380),
 * ligne de base sur le bord bas de la photo ; « une famille. » plein craie 80 %,
 * ≈ 200 px sur 1138 px, ferré à droite sur x 1380, haut des capitales 7 px sous
 * la rupture ; chapeau 64 px sous sa ligne de base. @390 : photo 4:5 (390 × 488),
 * ligne 1 en plein citron 75 % (44 px), « une famille. » plein 75 % (66 px).
 */
.cap-family {
  /*
   * Résolues là où elles servent (le titre, le corps) : 100cqi y vaut la largeur
   * de la section, qui est leur conteneur.
   */
  --pad: max(var(--page-gutter), (100cqi - var(--content-max)) / 2);
  /* Largeur des lignes du titre : celle des conteneurs de CapFitWord. */
  --measure: calc(100cqi - 2 * var(--pad));
  /* Tailles des deux mots, mêmes formules que CapFitWord (mobile ici). */
  --fs-delie: max(var(--delie-floor), var(--measure) / var(--em-delie-m));
  --fs-plein: max(2.75rem, var(--measure) / var(--em-plein-m));

  container-type: inline-size;
  padding-block: 0 var(--pad-l);
  background: var(--cf-noir);
  color: var(--cf-craie);
}

/* ── Photo plein cadre et voile ───────────────────────────────────────────── */
.cap-family__photo {
  inline-size: 100%;
  aspect-ratio: 4 / 5;
}

.cap-family__voile {
  position: absolute;
  inset: 0;
  background: var(--cf-noir);
  opacity: 0;
  pointer-events: none;
}

/* ── H2 à cheval sur la rupture photo/noir ────────────────────────────────── */
.cap-family__title {
  position: relative;
  z-index: 1;
  /*
   * Métriques de CAP Display dans une ligne d'interligne 0,86 : ligne de base à
   * 0,7075 em du haut, capitale de 0,675 em. Remonter le titre de 0,7075 fois la
   * taille du délié pose sa ligne de base sur le bord bas de la photo.
   */
  margin: calc(var(--fs-delie) * -0.7075) 0 0;
  padding-inline: var(--pad);
}

.cap-family__line {
  display: block;
}

/*
 * « une famille. » : haut des capitales à 0,035 fois sa taille sous la rupture
 * (7 px pour 200 px). La ligne 1 déborde de 0,1525 fois sa taille sous sa ligne
 * de base ; les capitales de la ligne 2 commencent à 0,0325 em du haut de sa boîte.
 */
.cap-family__line--plein {
  position: relative;
  margin-block-start: calc(var(--fs-plein) * 0.0025 - var(--fs-delie) * 0.1525);
  text-align: end;
}

/* La copie de la frappe : posée sur le texte réel, ni lue, ni sélectionnable. */
.cap-family__strike {
  position: absolute;
  inset: 0;
  display: none;
  pointer-events: none;
  user-select: none;
}

/*
 * Frappe armée (posée par le JS, hors écran seulement) : au-dessus de la ligne
 * de partage, le texte réel au contour craie ; en dessous, la copie pleine. La
 * ligne de partage monte de la ligne de base au-dessus des capitales : le mot
 * s'imprime par le bas, sans jamais doubler son contour.
 */
.cap-family__line--plein[data-frappe] .cap-family__plein :deep(.cap-fit__word) {
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: max(2px, 0.04em) currentcolor;
  clip-path: inset(-20% -0.2em calc(100% - var(--frappe)) -0.2em);
}

.cap-family__line--plein[data-frappe] .cap-family__strike {
  display: block;
  clip-path: inset(var(--frappe) -0.2em 0 -0.2em);
}

/* ── Sous le titre : chapeau, avis, coachs ────────────────────────────────── */
.cap-family__body {
  padding-inline: var(--pad);
  /*
   * 64 px (48 px à 390) sous la ligne de base de « une famille. », qui déborde de
   * 0,1525 fois sa taille sous sa ligne de base.
   */
  margin-block-start: calc(var(--pad-s) - var(--fs-plein) * 0.1525);
}

.cap-family__body > * {
  grid-column: 1 / -1;
  margin: 0;
}

.cap-family__chapeau {
  max-inline-size: 34em;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-lead); /* 18 → 22 */
  font-weight: 400;
  line-height: clamp(1.6875rem, 1.571rem + 0.476vw, 2rem); /* 27 → 32 */
  text-wrap: pretty;
}

/* Cadres « à confirmer » : filet pointillé, jamais un lien. */
.cap-family__cadre {
  border: 1px dashed var(--cf-pointille);
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
}

.cap-family__body > .cap-family__avis {
  margin-block-start: clamp(2rem, 1.629rem + 1.524vw, 3rem); /* 32 → 48 */
  padding: 0.875rem 1.25rem;
  text-wrap: pretty;
}

.cap-family__body > .cap-family__coachs {
  margin-block-start: clamp(4rem, 3.257rem + 3.048vw, 6rem); /* 64 → 96 */
}

.cap-family__coachs-titre {
  margin: 0;
  font-size: var(--text-h3); /* 40 → 72 */
  line-height: 0.92;
  text-wrap: balance;
}

.cap-family__coachs-texte {
  margin: clamp(0.75rem, 0.611rem + 0.571vw, 1.125rem) 0 0; /* 12 → 18 */
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-body); /* 16 → 18 */
  line-height: var(--leading-body);
  text-wrap: pretty;
}

/* Un seul cadre 16:9 pour l'équipe : la place des portraits, pas de faux visage. */
.cap-family__equipe {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  margin-block-start: clamp(1.5rem, 1.129rem + 1.524vw, 2.5rem); /* 24 → 40 */
  padding: 1.5rem;
  background: var(--cf-quadrillage);
}

.cap-family__equipe-texte {
  max-inline-size: 22em;
  margin: 0;
  text-align: center;
  text-wrap: balance;
}

/* ── Tablette : ligne 1 encore pleine (le délié y ferait moins de 64 px) ──── */
@media (min-width: 48em) {
  .cap-family__photo {
    aspect-ratio: auto;
    block-size: max(80svh, 35rem);
  }

  .cap-family {
    --fs-plein: max(2.75rem, var(--plein-part) * var(--measure) / var(--em-plein-d));
  }

  /*
   * CapFitWord passe au délié dès 48em ; entre 48 et 64em, 125 % de chasse
   * donnerait moins de 64 px (52 px à 768) : la ligne garde le plein citron 75 %
   * et sa taille mobile (R2).
   */
  .cap-family__title .cap-family__line--delie :deep(.cap-fit__word) {
    font-size: max(var(--floor), calc(var(--part-m) * 100cqi / var(--em-m)));
    font-stretch: var(--w-m);
    letter-spacing: -0.005em;
    -webkit-text-fill-color: currentcolor;
    -webkit-text-stroke: 0;
  }

  .cap-family__body > .cap-family__chapeau,
  .cap-family__body > .cap-family__avis {
    grid-column: 1 / 5;
  }

  .cap-family__body > .cap-family__coachs {
    grid-row: 1 / span 3;
    grid-column: 5 / -1;
  }

  .cap-family__body {
    grid-template-rows: auto auto 1fr;
    align-items: start;
  }
}

/* ── Ordinateur : le délié citron, colonnes 2 à 6 et 8 à 12 ───────────────── */
@media (min-width: 64em) {
  .cap-family {
    --fs-delie: max(var(--delie-floor), var(--measure) / var(--em-delie-d));
  }

  .cap-family__title .cap-family__line--delie :deep(.cap-fit__word) {
    font-size: max(var(--floor), calc(var(--part-d) * 100cqi / var(--em-d)));
    font-stretch: var(--w-d);
    letter-spacing: 0.01em;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: max(2px, 0.04em) currentcolor;
  }

  .cap-family__body > .cap-family__chapeau,
  .cap-family__body > .cap-family__avis {
    grid-column: 2 / 7;
  }

  .cap-family__body > .cap-family__coachs {
    grid-column: 8 / -1;
  }
}

/* ── Contrastes forcés : pas de voile, le plein reste plein ───────────────── */
@media (forced-colors: active) {
  .cap-family__voile,
  .cap-family__line--plein[data-frappe] .cap-family__strike {
    display: none;
  }

  .cap-family__line--plein[data-frappe] .cap-family__plein :deep(.cap-fit__word) {
    -webkit-text-fill-color: CanvasText;
    -webkit-text-stroke: 0;
    clip-path: none;
  }

  .cap-family__title .cap-family__line--delie :deep(.cap-fit__word) {
    -webkit-text-fill-color: CanvasText;
    -webkit-text-stroke: 0;
  }

  /*
   * Le fond posé derrière chaque texte couvre toute la hauteur de la police
   * (1,035 em), plus que l'interligne de 0,86 : les deux lignes s'écartent pour
   * que celui de « une famille. » ne masque pas le bas de la ligne 1.
   */
  .cap-family__line--plein {
    margin-block-start: calc((var(--fs-delie) + var(--fs-plein)) * 0.0875);
  }

  .cap-family__cadre {
    border-color: CanvasText;
  }
}
</style>
