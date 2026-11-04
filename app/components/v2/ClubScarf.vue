<script setup lang="ts">
import { club } from '~/data/club';

/**
 * L'écharpe du club : un bandeau tricoté en jacquard, « ALLEZ CLUSEM », qui
 * avance avec le défilement.
 *
 * Le motif est une grille de mailles : une police bitmap 5 × 7 (seulement les
 * lettres utiles) et un losange, codés en lignes de mailles canari sur fond
 * vert. Un seul motif est tracé (≈ 100 mailles de large), puis répété par un
 * <pattern> SVG sur toute la largeur ; une seconde trame dessine la maille en V
 * par-dessus. Le défilement ne fait que translater le SVG (compositeur).
 */
const GLYPHS: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '◆': ['0001000', '0011100', '0111110', '1111111', '0111110', '0011100', '0001000'],
};

/** Hauteur de l'écharpe, en mailles : lisière, damier, champ, texte, champ, damier, lisière. */
const ROWS = 15;
const TEXT_TOP = 4;

const words = club.scarf.words.map((word) => word.toLocaleUpperCase('fr'));
const sequence = [words[0] ?? '', '◆', words[1] ?? '', '◆'];

/** Colonnes du motif : chaque colonne est une liste de 7 mailles (texte). */
function columns(): boolean[][] {
  const cols: boolean[][] = [];
  const gap = (n: number) => {
    for (let i = 0; i < n; i++) cols.push(Array(7).fill(false));
  };
  for (const part of sequence) {
    gap(4);
    const letters = part === '◆' ? ['◆'] : [...part];
    letters.forEach((letter, index) => {
      if (index) gap(1);
      const glyph = GLYPHS[letter] ?? GLYPHS.A!;
      const width = glyph[0]!.length;
      for (let x = 0; x < width; x++) cols.push(glyph.map((row) => row[x] === '1'));
    });
  }
  gap(4);
  return cols;
}

const cols = columns();
const WIDTH = cols.length % 2 ? cols.length + 1 : cols.length;

/** Mailles canari du motif, en courses horizontales (une sous-trajectoire par course). */
const motif = (() => {
  const cell = (x: number, y: number): boolean => {
    if (y === 0 || y === ROWS - 1) return true; // lisières
    if (y === 2 || y === ROWS - 3) return (x + y) % 2 === 0; // damier
    const row = y - TEXT_TOP;
    if (row >= 0 && row < 7) return cols[x]?.[row] ?? false;
    return false;
  };
  let d = '';
  for (let y = 0; y < ROWS; y++) {
    let x = 0;
    while (x < WIDTH) {
      if (!cell(x, y)) {
        x++;
        continue;
      }
      const start = x;
      while (x < WIDTH && cell(x, y)) x++;
      d += `M${start} ${y}h${x - start}v1h${start - x}z`;
    }
  }
  return d;
})();

const id = useId();
const patternId = `scarf-motif-${id}`;
const stitchId = `scarf-maille-${id}`;
/** Le motif répété : assez pour couvrir un écran de 2 560 px et sa course. */
const REPEAT = 5;

const root = useTemplateRef<HTMLElement>('root');
useMotion(root, ({ gsap }, element) => {
  const band = element.querySelector<SVGElement>('.scarf__band');
  if (!band) return undefined;
  // Une longueur de motif sur toute la traversée de l'écran : l'écharpe avance.
  gsap.fromTo(
    band,
    { xPercent: 0 },
    {
      xPercent: -100 / REPEAT,
      ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
  return undefined;
});
</script>

<template>
  <div ref="root" class="scarf" role="img" :aria-label="club.scarf.label">
    <div class="scarf__strip">
      <svg
        class="scarf__band"
        :viewBox="`0 0 ${WIDTH * REPEAT} ${ROWS}`"
        :style="{ '--cols': WIDTH * REPEAT, '--rows': ROWS }"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern :id="stitchId" width="1" height="1" patternUnits="userSpaceOnUse">
            <!-- Une maille jersey : deux jambes en V, ombre au creux, reflet sur le bord. -->
            <path d="M0.06 0.04Q0.2 0.6 0.5 0.98" class="scarf__leg scarf__leg--shade" />
            <path d="M0.94 0.04Q0.8 0.6 0.5 0.98" class="scarf__leg scarf__leg--shade" />
            <path d="M0.16 0.02Q0.28 0.5 0.5 0.86" class="scarf__leg scarf__leg--light" />
            <path d="M0.84 0.02Q0.72 0.5 0.5 0.86" class="scarf__leg scarf__leg--light" />
          </pattern>
          <pattern :id="patternId" :width="WIDTH" :height="ROWS" patternUnits="userSpaceOnUse">
            <rect :width="WIDTH" :height="ROWS" class="scarf__field" />
            <path :d="motif" class="scarf__yarn" />
          </pattern>
        </defs>
        <rect :width="WIDTH * REPEAT" :height="ROWS" :fill="`url(#${patternId})`" />
        <rect :width="WIDTH * REPEAT" :height="ROWS" :fill="`url(#${stitchId})`" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.scarf {
  --stitch: clamp(6px, 0.3rem + 0.35vw, 10px);

  position: relative;
  padding-block: var(--space-48);
  overflow: clip;
  background: var(--mist-100);
}

/* L'écharpe, tendue de travers sur la largeur, comme dans les tribunes. */
.scarf__strip {
  rotate: -2deg;
  margin-inline: -4vw;
  box-shadow: 0 18px 30px -18px rgb(11 36 24 / 0.55);
}

.scarf__band {
  display: block;
  inline-size: calc(var(--cols) * var(--stitch));
  block-size: calc(var(--rows) * var(--stitch));
  max-inline-size: none;
}

.scarf__field {
  fill: var(--pitch-800);
}

.scarf__yarn {
  fill: var(--canary-400);
}

.scarf__leg {
  fill: none;
  stroke-linecap: round;
}

.scarf__leg--shade {
  stroke: rgb(0 0 0 / 0.28);
  stroke-width: 0.16;
}

.scarf__leg--light {
  stroke: rgb(255 255 255 / 0.18);
  stroke-width: 0.08;
}

@media (forced-colors: active) {
  .scarf__field {
    fill: Canvas;
  }

  .scarf__yarn {
    fill: CanvasText;
  }
}
</style>
