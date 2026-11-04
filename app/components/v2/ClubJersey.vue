<script setup lang="ts">
/**
 * Le maillot du club, de dos, sur son cintre : le moment signature de la V2.
 *
 * Le tissu est un SVG ; le flocage (nom et numéro) est du texte HTML posé
 * dessus, pour que chaque lettre soit un élément qu'on presse au fer :
 * - chaque lettre nouvelle se pose (surpression, écrasement d'un cheveu, repos)
 *   puis prend son reflet de vinyle. Une lettre inchangée ne bouge pas ;
 * - le corps du nom se règle sur sa longueur (unités de conteneur), sans JS ;
 * - mouvement réduit ou sans JS : les lettres sont là, sans pression.
 *
 * Le maillot est une image nommée (role="img") : son nom dit ce qui est floqué.
 */
const props = defineProps<{
  name: string;
  number: number;
  placeholder: string;
  label: string;
}>();

const id = useId();
const clip = `jersey-clip-${id}`;
const shade = `jersey-shade-${id}`;
const sheen = `jersey-sheen-${id}`;

const shown = computed(() => (props.name.trim() || props.placeholder).toLocaleUpperCase('fr'));
const letters = computed(() => [...shown.value]);
const empty = computed(() => !props.name.trim());
const accessibleName = computed(() => `${props.label} : ${shown.value}, ${props.number}`);

/** Corps du nom : large pour un prénom court, resserré au-delà de six lettres. */
const nameSize = computed(
  () => `min(9cqi, ${(52 / Math.max(letters.value.length, 4)).toFixed(2)}cqi)`,
);

/** Silhouette du maillot (dos, manches courtes), dans un repère de 400 × 480. */
const BODY =
  'M163 66Q200 80 237 66L322 94Q356 110 380 170L334 199Q318 189 303 182L299 450Q200 468 101 450L97 182Q82 189 66 199L20 170Q44 110 78 94Z';
</script>

<template>
  <div class="jersey" :class="{ 'jersey--empty': empty }" role="img" :aria-label="accessibleName">
    <svg class="jersey__cloth" viewBox="0 0 400 480" aria-hidden="true" focusable="false">
      <defs>
        <clipPath :id="clip"><path :d="BODY" /></clipPath>
        <linearGradient :id="shade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity="0.18" />
          <stop offset="0.22" stop-color="#000" stop-opacity="0.04" />
          <stop offset="0.55" stop-color="#fff" stop-opacity="0.05" />
          <stop offset="0.8" stop-color="#000" stop-opacity="0.06" />
          <stop offset="1" stop-color="#000" stop-opacity="0.2" />
        </linearGradient>
        <radialGradient :id="sheen" cx="0.42" cy="0.3" r="0.6">
          <stop offset="0" stop-color="#fff" stop-opacity="0.1" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Cintre : crochet métallique et barre en bouleau. -->
      <path class="jersey__hook" d="M200 62V44c0-6 4-9 9-11s10-7 10-14-6-13-14-13-13 5-14 11" />
      <path class="jersey__hanger" d="M74 104 194 60a14 14 0 0 1 12 0l120 44" />

      <path class="jersey__body" :d="BODY" />
      <g :clip-path="`url(#${clip})`">
        <!-- La bande canari du maillot, à hauteur de poitrine, qui fait le tour. -->
        <rect class="jersey__band" x="0" y="206" width="400" height="40" />
        <!-- Plis du tissu sous les bras et à l'ourlet. -->
        <path class="jersey__fold" d="M112 196q14 120 4 250M288 196q-14 120-4 250" />
        <path class="jersey__fold jersey__fold--soft" d="M150 440q50-16 100 0" />
        <rect x="0" y="0" width="400" height="480" :fill="`url(#${shade})`" />
        <rect x="0" y="0" width="400" height="480" :fill="`url(#${sheen})`" />
      </g>
      <!-- Col et cerclages des manches : bord-côte souligné d'un filet blanc. -->
      <path class="jersey__collar" d="M163 66Q200 80 237 66" />
      <path class="jersey__cuff" d="M27 172 64 196M373 172l-37 24" />
    </svg>

    <div class="jersey__print" aria-hidden="true">
      <span class="jersey__name" :style="{ '--name-size': nameSize }">
        <span
          v-for="(letter, index) in letters"
          :key="`${index}-${letter}-${empty}`"
          class="jersey__letter"
          :class="{ 'jersey__letter--space': letter === ' ' }"
          :style="{ '--letter-index': index }"
          >{{ letter }}</span
        >
      </span>
      <span class="jersey__number">{{ number }}</span>
    </div>
  </div>
</template>

<style scoped>
.jersey {
  position: relative;
  container-type: inline-size;
  inline-size: 100%;
  aspect-ratio: 400 / 480;
}

.jersey__cloth {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  overflow: visible;
  filter: drop-shadow(0 28px 32px rgb(3 20 11 / 0.45)) drop-shadow(0 4px 6px rgb(3 20 11 / 0.3));
}

.jersey__hook {
  fill: none;
  stroke: #c8d2cc;
  stroke-width: 4;
  stroke-linecap: round;
}

.jersey__hanger {
  fill: none;
  stroke: #d8b98c;
  stroke-width: 9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.jersey__body {
  fill: #0a3a24;
}

.jersey__band {
  fill: var(--canary-400);
}

.jersey__fold {
  fill: none;
  stroke: #000;
  stroke-opacity: 0.16;
  stroke-width: 10;
  stroke-linecap: round;
  filter: blur(6px);
}

.jersey__fold--soft {
  stroke-opacity: 0.1;
}

.jersey__collar,
.jersey__cuff {
  fill: none;
  stroke: var(--chalk);
  stroke-width: 3;
  stroke-linecap: round;
}

/* ── Flocage : nom au-dessus de la bande, numéro dessous ─────────────────── */
.jersey__print {
  position: absolute;
  inset: 0;
  color: var(--kit-white);
  font-family: var(--font-display);
  font-weight: 800;
  pointer-events: none;
}

.jersey__name {
  position: absolute;
  inset-inline: 0;
  inset-block-start: 26.5%;
  display: flex;
  justify-content: center;
  font-size: var(--name-size);
  font-stretch: var(--stretch-wide);
  letter-spacing: 0.04em;
  line-height: 1;
  translate: 0 -50%;
}

.jersey--empty .jersey__name {
  opacity: 0.5;
}

.jersey__letter {
  display: inline-block;
  white-space: pre;
}

.jersey__number {
  position: absolute;
  inset-inline: 0;
  inset-block-start: 69%;
  font-size: 46cqi;
  font-stretch: var(--stretch-narrow);
  line-height: 0.8;
  text-align: center;
  font-variant-numeric: lining-nums;
  translate: 0 -50%;
}

/* Vinyle : un relief d'un cheveu sur le tissu. */
.jersey__letter,
.jersey__number {
  filter: drop-shadow(0 0.012em 0 rgb(0 0 0 / 0.28));
}

/*
 * Le flocage au fer à transfert, lettre par lettre (CSS : il suit la saisie sans
 * attendre GSAP). Une lettre arrive au-dessus du tissu, se pose avec une légère
 * surpression, s'écrase d'un cheveu puis revient au repos ; son reflet passe
 * ensuite une fois. Décalage plafonné : un nom collé d'un coup se pose en vague.
 */
html.has-motion .jersey:not(.jersey--empty) .jersey__letter:not(.jersey__letter--space) {
  background: linear-gradient(100deg, var(--kit-white) 38%, #cfe0d5 48%, var(--kit-white) 58%) 0 0 /
    300% 100% no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    jersey-press var(--dur-strike) var(--ease-strike) both,
    jersey-sheen var(--dur-focal) var(--ease-out) both;
  animation-delay:
    calc(min(var(--letter-index), 5) * var(--stagger-tight)),
    calc(min(var(--letter-index), 5) * var(--stagger-tight) + var(--dur-strike));
}

@keyframes jersey-press {
  0% {
    opacity: 0;
    transform: translateY(-0.22em) scale(1.22);
  }

  55% {
    opacity: 1;
    transform: translateY(0.02em) scale(1.05, 0.9);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes jersey-sheen {
  from {
    background-position: 100% 0;
  }

  to {
    background-position: 0 0;
  }
}

@media (forced-colors: active) {
  .jersey__print {
    color: CanvasText;
  }

  .jersey__body {
    fill: Canvas;
    stroke: CanvasText;
    stroke-width: 2;
  }
}
</style>
