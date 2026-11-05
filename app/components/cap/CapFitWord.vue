<script setup lang="ts">
import { capFit, type CapFitKey } from '~/data/cap-fit';

/**
 * Un mot d'affiche ajusté à la largeur de sa ligne (brief §2.4) : la taille vient
 * de la largeur mesurée du mot en em (app/data/cap-fit.ts, généré par
 * scripts/measure-fit.mjs), rapportée à la largeur du conteneur (unités cqi).
 * Aucun JS : la ligne a sa taille au premier rendu, sans saut.
 *
 * Le mot est délié (au contour) ou plein ; la chasse et le style peuvent changer
 * sous 48em (un délié de moins de 64 px y devient plein). Sous 30em (zoom à
 * 400 %), une ligne de plusieurs mots peut revenir à la ligne, jamais au milieu
 * d'un mot : un délié qui ne tient plus à son plancher passe plein (R2), mesuré
 * en chasse 75 % (`cap-fit--repli`).
 */
type Style = 'delie' | 'plein';
const props = withDefaults(
  defineProps<{
    fitKey: CapFitKey;
    text: string;
    /** Style sur ordinateur, puis sous 48em. */
    styles?: [Style, Style];
    /** Couleur du mot : citron ou craie. */
    color?: 'citron' | 'craie';
    colorMobile?: 'citron' | 'craie';
    /** Part de la ligne occupée par le mot, ordinateur puis mobile. */
    part?: [number, number];
    /** Plancher de taille (rem) : 4 pour un délié, 2,75 pour un plein. */
    floor?: number;
  }>(),
  {
    styles: () => ['plein', 'plein'],
    color: 'craie',
    colorMobile: undefined,
    part: () => [1, 1],
    floor: undefined,
  },
);

const TRACKING: Record<Style, number> = { delie: 0.01, plein: -0.005 };
/** Chasse du plein de repli d'un délié trop étroit (R3 : 75 % sous 48em). */
const REPLI_WDTH = 75;

const metrics = computed(() => {
  const entry = capFit[props.fitKey];
  // Chasse d'ordinateur ≥ chasse mobile pour chaque mot mesuré (scripts/fit-words.mjs) ;
  // un délié mobile a en plus sa mesure en plein 75 %, pour le repli.
  const [desktopWdth = 80, mobileWdth = desktopWdth] = Object.keys(entry.em)
    .map(Number)
    .sort((a, b) => b - a);
  const em = entry.em as Record<string, number>;
  const length = [...props.text].length;
  const [desktopStyle, mobileStyle] = props.styles;
  const repli = mobileStyle === 'delie' && mobileWdth !== REPLI_WDTH ? em[REPLI_WDTH] : undefined;
  return {
    desktop: { wdth: desktopWdth, em: (em[desktopWdth] ?? 1) + length * TRACKING[desktopStyle] },
    mobile: { wdth: mobileWdth, em: (em[mobileWdth] ?? 1) + length * TRACKING[mobileStyle] },
    repli: repli === undefined ? undefined : repli + length * TRACKING.plein,
  };
});

const floor = computed(() => props.floor ?? (props.styles[0] === 'delie' ? 4 : 2.75));

const classes = computed(() => [
  `cap-fit--d-${props.styles[0]}`,
  `cap-fit--m-${props.styles[1]}`,
  `cap-fit--c-${props.color}`,
  `cap-fit--cm-${props.colorMobile ?? props.color}`,
  { 'cap-fit--repli': metrics.value.repli !== undefined },
]);
</script>

<template>
  <span
    class="cap-fit"
    :class="classes"
    :style="{
      '--em-d': metrics.desktop.em,
      '--em-m': metrics.mobile.em,
      '--w-d': `${metrics.desktop.wdth}%`,
      '--w-m': `${metrics.mobile.wdth}%`,
      '--part-d': part[0],
      '--part-m': part[1],
      '--floor': `${floor}rem`,
      '--em-r': metrics.repli,
    }"
  >
    <span class="cap-fit__word cap-display">{{ text }}</span>
  </span>
</template>

<style scoped>
.cap-fit {
  display: block;
  container-type: inline-size;
}

.cap-fit__word {
  --stroke-color: var(--cf-craie);

  display: block;
  font-size: max(var(--floor), calc(var(--part-m) * 100cqi / var(--em-m)));
  font-stretch: var(--w-m);
  line-height: 0.86;
  /*
   * Une ligne : la taille vient de la largeur mesurée. Rien n'est rogné : si
   * l'utilisateur élargit l'espacement du texte (WCAG 1.4.12), le mot déborde de
   * sa ligne au lieu d'être coupé.
   */
  white-space: nowrap;
}

/* Styles : délié (contour) ou plein ; couleur citron ou craie. */
.cap-fit--cm-citron .cap-fit__word {
  --stroke-color: var(--cf-citron);
}

.cap-fit--m-delie .cap-fit__word {
  color: var(--stroke-color);
  letter-spacing: 0.01em;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: max(2px, 0.04em) currentcolor;
}

.cap-fit--m-plein .cap-fit__word {
  color: var(--stroke-color);
  letter-spacing: -0.005em;
}

@media (min-width: 48em) {
  .cap-fit__word {
    --stroke-color: var(--cf-craie);

    font-size: max(var(--floor), calc(var(--part-d) * 100cqi / var(--em-d)));
    font-stretch: var(--w-d);
  }

  .cap-fit--c-citron .cap-fit__word {
    --stroke-color: var(--cf-citron);
  }

  .cap-fit--d-delie .cap-fit__word {
    color: var(--stroke-color);
    letter-spacing: 0.01em;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: max(2px, 0.04em) currentcolor;
  }

  .cap-fit--d-plein .cap-fit__word {
    color: var(--stroke-color);
    letter-spacing: -0.005em;
    -webkit-text-fill-color: currentcolor;
    -webkit-text-stroke: 0;
  }
}

/*
 * R2 : sous 64 px, un délié devient plein dans sa couleur. Quand la ligne est
 * plus étroite que le délié à son plancher (zoom à 400 %, police agrandie), le
 * mot passe plein, en chasse 75 %, à la taille qui remplit la ligne. Le seuil
 * est posé en font-size sur le conteneur : une requête de conteneur lit ses
 * unités relatives sur le conteneur lui-même, « 1em » y vaut donc le seuil.
 */
@media (max-width: 47.99em) {
  .cap-fit--repli {
    font-size: calc(var(--floor) * var(--em-m) / var(--part-m));
  }

  @container (width < 1em) {
    .cap-fit--repli .cap-fit__word {
      font-size: max(2.75rem, calc(var(--part-m) * 100cqi / var(--em-r)));
      font-stretch: 75%;
      letter-spacing: -0.005em;
      -webkit-text-fill-color: currentcolor;
      -webkit-text-stroke: 0;
    }
  }
}

/* Zoom à 400 % : une ligne de plusieurs mots revient à la ligne, entre deux mots. */
@media (max-width: 30em) {
  .cap-fit__word {
    white-space: normal;
  }
}

@media (forced-colors: active) {
  .cap-fit .cap-fit__word {
    -webkit-text-fill-color: CanvasText;
    -webkit-text-stroke: 0;
  }
}
</style>
