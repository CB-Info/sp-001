<script setup lang="ts">
import { cap } from '~/data/cap';
import { capFit, type CapFitKey } from '~/data/cap-fit';
import { reached } from '~/motion/sequence';
import { duration, stagger } from '~/motion/tokens';

/**
 * Chapitre 2, l'édito « Bouge ! » (#bouge) : le slogan du club en crescendo, puis
 * les quatre valeurs fondues dans un paragraphe, sans cartes (brief
 * docs/brief/v2.md, §4.3). Surface nuit, aucune photo, aucun tracé : c'est le
 * premier vide noir après la couverture.
 *
 * Gabarit G2, l'affiche en triangle : « Bouge ! » délié citron géant sur toute
 * la largeur, puis trois lignes pleines craie ferrées à droite, toutes à la même
 * taille (celle qui fait tenir la plus longue sur 90 % de la ligne). Leur bord
 * gauche s'élargit vers le bas, comme la pente montante du complexe.
 *
 * Mouvement, une seule entrée : quand le haut du groupe des trois lignes passe à
 * 70 % de l'écran, chaque ligne frappe. Elle part au contour craie, puis se
 * remplit en montant depuis sa ligne de base (230 ms, --ease-strike), à 92 ms
 * d'écart. « Bouge ! » reste délié et ne bouge pas. L'état « au contour » n'est
 * posé par le JS que si le groupe est encore hors de l'écran : sans JS, en
 * mouvement réduit, sur une arrivée par ancre ou au retour arrière, les trois
 * lignes sont pleines.
 */

const titleId = 'bouge-titre';

/* ── Mesures des mots ajustés ────────────────────────────────────────────────
 * Mêmes calculs que CapFitWord (largeur mesurée en em, plus l'approche par
 * lettre) : la taille des deux mots est connue en CSS, pour caler les lignes sur
 * leurs lignes de base et poser le paragraphe sous le titre.
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

/** « Bouge ! » reste délié à toutes les largeurs (100 % de chasse sous 48em, 64 px au moins). */
const BOUGE_STYLES: [Style, Style] = ['delie', 'delie'];

/*
 * Les trois lignes prennent la taille de la plus longue (même choix que
 * scripts/fit-words.mjs pour la clé edito.lignes) : sur ordinateur, elle occupe
 * 90 % de la ligne ; sur mobile, toute la ligne.
 */
const longest = cap.edito.lignes.reduce((a, b) => (b.length > a.length ? b : a));
const bouge = fitEm('edito.bouge', cap.edito.bouge, 'delie');
const lignes = fitEm('edito.lignes', longest, 'plein');

const bodyStyle = {
  '--em-bouge-d': bouge.desktop.toFixed(4),
  '--em-bouge-m': bouge.mobile.toFixed(4),
  '--em-lignes-d': lignes.desktop.toFixed(4),
  '--em-lignes-m': lignes.mobile.toFixed(4),
};

/* ── La frappe des trois lignes ──────────────────────────────────────────────
 * Chaque ligne porte deux couches : le texte réel et, par-dessus, une copie
 * pleine en aria-hidden, masquée par défaut. Armée, la ligne montre le texte réel
 * au contour, rogné au-dessus d'une ligne de partage, et la copie pleine en
 * dessous. La frappe fait monter cette ligne de partage de la ligne de base
 * jusqu'au haut du contour : le mot s'imprime par le bas, sans jamais doubler son
 * contour. À la fin, le texte réel redevient plein et la copie s'efface : les
 * deux états sont identiques au pixel.
 *
 * Le JS ne pousse que l'avancée de la frappe (--frappe, de 0 à 1) ; le CSS en
 * tire la ligne de partage, ligne par ligne et à toutes les tailles. La course
 * s'arrête au haut réel du contour, accents compris, et pas plus haut : les
 * 230 ms de --ease-strike se passent sur le mot, qui ralentit et se pose
 * (§5.1), au lieu de finir à mi-courbe, coupé net, et de balayer du vide.
 */
/** Une ligne qui porte un accent (au-dessus des capitales) frappe plus haut. */
const ACCENT = /[àâäéèêëîïôöùûüÿ]/i;
/** Le haut du groupe frappe en passant à 70 % de la hauteur de l'écran. */
const STRIKE_LINE = 0.7;

/**
 * Déclencheur à 70 % de l'écran, sur le modèle d'ENTRY (app/motion/sequence.ts) :
 * un groupe trop près du bas du document pour atteindre la ligne frappe juste
 * avant la butée, au lieu de rester au contour.
 */
const STRIKE = {
  start: ({ trigger }: { trigger?: Element }) => {
    if (!trigger) return `top ${STRIKE_LINE * 100}%`;
    const line = trigger.getBoundingClientRect().top + scrollY - innerHeight * STRIKE_LINE;
    return Math.min(line, document.documentElement.scrollHeight - innerHeight - 1);
  },
  once: true,
} as const;

/** Une seule frappe par visite : un retour du mouvement (matchMedia) ne la rejoue pas. */
let struck = false;

const section = useTemplateRef<HTMLElement>('section');

useMotion(section, ({ gsap, ScrollTrigger }, root) => {
  const group = root.querySelector<HTMLElement>('[data-motion="edito-lignes"]');
  const lines = [...root.querySelectorAll<HTMLElement>('[data-motion="edito-ligne"]')];
  // Déjà à l'écran (ou dépassé) : les lignes restent pleines.
  if (struck || !group || !lines.length || reached(group)) return undefined;

  const disarm = () => {
    delete group.dataset.frappe;
    for (const line of lines) line.style.removeProperty('--frappe');
  };

  group.dataset.frappe = '';
  gsap.set(lines, { '--frappe': 0 });

  const strike = gsap.timeline({
    paused: true,
    onComplete: () => {
      struck = true;
      disarm();
    },
  });
  lines.forEach((line, index) =>
    strike.to(
      line,
      { '--frappe': 1, duration: duration('--dur-strike'), ease: 'strike' },
      index * stagger('--stagger-lines'),
    ),
  );

  ScrollTrigger.create({ trigger: group, ...STRIKE, onEnter: () => strike.play() });

  // Retour en mouvement réduit ou démontage en pleine frappe : état final.
  return disarm;
});
</script>

<template>
  <section
    id="bouge"
    ref="section"
    class="cap-edito"
    data-surface="nuit"
    :aria-labelledby="titleId"
  >
    <div class="cap-edito__body cap-grid" :style="bodyStyle">
      <h2 :id="titleId" class="cap-edito__title">
        <CapFitWord
          fit-key="edito.bouge"
          :text="cap.edito.bouge"
          :styles="BOUGE_STYLES"
          color="citron"
        />
        <span class="cap-edito__lignes" data-motion="edito-lignes">
          <template v-for="ligne in cap.edito.lignes" :key="ligne">
            {{ ' ' }}
            <span
              class="cap-edito__ligne"
              :data-accent="ACCENT.test(ligne) ? '' : undefined"
              data-motion="edito-ligne"
            >
              <span class="cap-edito__ligne-texte cap-display is-plein">{{ ligne }}</span>
              <!-- Copie pleine de la frappe : elle s'imprime depuis la ligne de base. -->
              <span class="cap-edito__ligne-frappe cap-display is-plein" aria-hidden="true">
                {{ ligne }}
              </span>
            </span>
          </template>
        </span>
      </h2>

      <p class="cap-edito__texte">{{ cap.edito.texte }}</p>
    </div>
  </section>
</template>

<style scoped>
/*
 * Cotes @1440 (brief §4.3) : « Bouge ! » sur 1320 px (x 60 à 1380), 208 px ;
 * trois lignes ferrées à droite sur x 1380, à 114 px, « Atteins tes objectifs. »
 * sur 1188 px (dès x 192) ; 148 px de la ligne de base de « Bouge ! » à celle de
 * la ligne 2, puis 0,92 em ; le paragraphe (une colonne, ferré à droite) 64 px sous la dernière ligne de
 * base. @390 : « Bouge ! » sur 350 px (83 px), lignes à 36 px.
 */
.cap-edito {
  container-type: inline-size;
  padding-block: var(--pad-xl) var(--pad-l);
  background: var(--cf-noir);
  color: var(--cf-craie);
}

.cap-edito__body {
  --pad: max(var(--page-gutter), (100cqi - var(--content-max)) / 2);
  /* Largeur de la ligne du titre : celle des conteneurs de CapFitWord. */
  --measure: calc(100cqi - 2 * var(--pad));
  /* Tailles des deux mots (CapFitWord) : plancher de 4 rem pour le délié (R2). */
  --fs-bouge: max(4rem, var(--measure) / var(--em-bouge-m));
  --fs-lignes: max(1.5rem, var(--measure) / var(--em-lignes-m));

  align-items: baseline;
  padding-inline: var(--pad);
}

.cap-edito__body > * {
  grid-column: 1 / -1;
}

/* ── H2 : « Bouge ! », puis trois pleins ferrés à droite ──────────────────── */
.cap-edito__title {
  margin: 0;
}

/*
 * Métriques de CAP Display : capitale 0,675 em ; ligne de base à 0,7075 em du
 * haut d'une ligne d'interligne 0,86 (« Bouge ! »), à 0,7375 em pour 0,92 (les
 * pleins : le É de « Dépasse » tombe en 2ᵉ ligne). De la ligne de base de
 * « Bouge ! » à celle de « Dépasse-toi. » : 0,7136 fois sa taille (150 px pour
 * 210 px au brief).
 */
.cap-edito__lignes {
  display: block;
  margin-block-start: calc(var(--fs-bouge) * 0.5611 - var(--fs-lignes) * 0.7375);
  font-size: var(--fs-lignes);
  text-align: end;
}

/*
 * Course de la frappe, en em pour valoir à toutes les tailles (pleins de CAP
 * Display en 75–80 %, interligne 0,92) :
 * - départ : la ligne de base, 0,1825 em au-dessus du bas de la boîte (celle de
 *   la dernière ligne si le texte revient à la ligne) ;
 * - arrivée : le haut du contour. Les capitales montent, rondes comprises,
 *   jusqu'à 0,055 em sous le haut de la boîte, les accents jusqu'à 0,08 em
 *   au-dessus. Le contour en déborde d'un demi-trait (max(1px, 0.02em)), plus
 *   2 px d'anticrénelage.
 * Finir plus haut (l'ancien −40 %) faisait balayer du vide à la moitié lente de
 * la courbe : le mot était plein en 120 ms, coupé net, sans se poser.
 */
.cap-edito__ligne {
  --frappe-depart: calc(100% - 0.1825em);
  --frappe-arrivee: calc(0.055em - max(1px, 0.02em) - 2px);

  position: relative;
  display: block;
}

.cap-edito__ligne[data-accent] {
  --frappe-arrivee: calc(-0.08em - max(1px, 0.02em) - 2px);
}

.cap-edito__ligne-texte,
.cap-edito__ligne-frappe {
  display: block;
  line-height: 0.92;
  white-space: nowrap;
}

/* La copie de la frappe : posée sur le texte réel, ni lue, ni sélectionnable. */
.cap-edito__ligne-frappe {
  position: absolute;
  inset: 0;
  display: none;
  pointer-events: none;
  user-select: none;
}

/*
 * Frappe armée (posée par le JS, hors écran seulement) : au-dessus de la ligne
 * de partage, le texte réel au contour craie ; en dessous, la copie pleine. La
 * ligne de partage va du départ à l'arrivée selon l'avancée --frappe (0 → 1) ;
 * ses % et ses em se résolvent sur chaque couche, qui a la boîte de la ligne.
 */
.cap-edito__lignes[data-frappe] .cap-edito__ligne {
  --partage: calc(
    var(--frappe-depart) + (var(--frappe-arrivee) - var(--frappe-depart)) * var(--frappe, 0)
  );
}

.cap-edito__lignes[data-frappe] .cap-edito__ligne-texte {
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: max(2px, 0.04em) currentcolor;
  clip-path: inset(-40% -0.2em calc(100% - var(--partage)) -0.2em);
}

.cap-edito__lignes[data-frappe] .cap-edito__ligne-frappe {
  display: block;
  clip-path: inset(var(--partage) -0.2em 0 -0.2em);
}

/* ── Faits et paragraphe : 64 px sous la dernière ligne de base ─────────────── */
.cap-edito__texte {
  max-inline-size: 36ch;
  margin-block: calc(var(--pad-s) - var(--fs-lignes) * 0.1825) 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-lead); /* 18 → 22 */
  font-weight: 400;
  line-height: clamp(1.6875rem, 1.571rem + 0.476vw, 2rem); /* 27 → 32 */
  text-wrap: pretty;
}

/* ── Tablette et ordinateur ───────────────────────────────────────────────── */
@media (min-width: 48em) {
  .cap-edito__body {
    --fs-bouge: max(4rem, var(--measure) / var(--em-bouge-d));
    --fs-lignes: max(1.5rem, 0.9 * var(--measure) / var(--em-lignes-d));
  }

  /* Le paragraphe, une seule colonne sous les lignes ferrées à droite. */
  .cap-edito__body > .cap-edito__texte {
    grid-column: 6 / -1;
    justify-self: end;
  }
}

/*
 * Les lignes tiennent sur une ligne jusqu'à 320 px (zoom à 400 %). Plus étroit,
 * ou avec une police par défaut agrandie, leur plancher de 1,5 rem (17,25 em
 * d'écran : 1,5 × 9,762 em, plus les marges) les ferait déborder : elles peuvent
 * alors revenir à la ligne.
 */
@media (max-width: 17.25em) {
  .cap-edito__ligne-texte,
  .cap-edito__ligne-frappe {
    white-space: normal;
  }
}

/* ── Contrastes forcés : les pleins restent pleins, la frappe disparaît ────── */
@media (forced-colors: active) {
  .cap-edito__lignes[data-frappe] .cap-edito__ligne-texte {
    -webkit-text-fill-color: CanvasText;
    -webkit-text-stroke: 0;
    clip-path: none;
  }

  .cap-edito__lignes[data-frappe] .cap-edito__ligne-frappe {
    display: none;
  }
}
</style>
