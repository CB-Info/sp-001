<script setup lang="ts">
import type { ClubContent } from '~/data/club';
import type { Session } from '~/types/club';

/**
 * Hero de la V2 : le terrain du club. Un champ vert bouteille cerclé de bandes
 * de tissu, un cadre de touche blanc, le rond central derrière le maillot.
 *
 * À gauche : le bandeau de programme, « REJOINS / LE CLUB. », le texte et deux
 * actions. À droite : le maillot de dos, que le visiteur floque à son prénom.
 * Sous le pli : la ligne de touche porte le prochain cours, en direct.
 *
 * Pas de photo : l'élément LCP est le titre, en Saira préchargée. L'intro (CSS)
 * suit les classes de app/motion/boot.inline.js, comme celle de la V1.
 */
const props = defineProps<{
  content: ClubContent['hero'];
  season: ClubContent['season'];
  sessions: Session[];
  disciplines: ClubContent['disciplines']['items'];
  coaches: ClubContent['squad']['coaches'];
}>();

const titleId = 'hero-titre';
const name = useState<string>('club-flock', () => '');
</script>

<template>
  <section class="club-hero" data-surface="pitch" :aria-labelledby="titleId">
    <div class="club-hero__field" aria-hidden="true">
      <span class="club-hero__frame" />
      <svg class="club-hero__circle" viewBox="0 0 200 200" focusable="false">
        <circle cx="100" cy="100" r="98" />
        <circle class="club-hero__spot" cx="100" cy="100" r="2.2" />
      </svg>
    </div>

    <div class="container club-hero__grid">
      <div class="club-hero__copy">
        <p class="club-hero__programme club-label">
          <template v-for="(item, index) in props.content.programme" :key="item">
            <span v-if="index" class="club-hero__dot" aria-hidden="true" />
            <span>{{ item }}</span>
          </template>
        </p>
        <h1 :id="titleId" class="club-hero__title">
          <span
            v-for="(line, index) in props.content.titleLines"
            :key="line"
            class="club-hero__line"
            :class="{ 'club-hero__line--canary': index === 1 }"
            :style="{ '--line-index': index }"
            >{{ line }}</span
          >
        </h1>
        <p class="club-hero__lead">{{ props.content.lead }}</p>
        <div class="club-hero__actions">
          <a class="club-action" :href="props.content.primary.href">
            {{ props.content.primary.label }}
            <svg
              class="club-action__arrow"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4 12h15M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
              />
            </svg>
          </a>
          <a class="club-action club-action--outline" :href="props.content.secondary.href">
            {{ props.content.secondary.label }}
          </a>
        </div>
      </div>

      <div class="club-hero__kit">
        <div class="club-hero__jersey">
          <ClubJersey
            :name="name"
            :number="season.number"
            :placeholder="props.content.jersey.placeholder"
            :label="props.content.jersey.label"
          />
        </div>
        <ClubFlockField v-model="name" :content="props.content.jersey" />
      </div>
    </div>

    <ClubNextSession
      class="club-hero__touchline"
      :content="props.content.next"
      :sessions="sessions"
      :disciplines="disciplines"
      :coaches="coaches"
    />
  </section>
</template>

<style scoped>
.club-hero {
  position: relative;
  display: grid;
  grid-template-rows: 1fr auto;
  min-block-size: calc(100svh - var(--header-height));
  overflow: clip;
  isolation: isolate;
}

/* ── Le terrain : bandes de tonte (et de tissu), cadre de touche, rond central ── */
.club-hero__field {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: repeating-linear-gradient(
    to bottom,
    var(--pitch-800) 0 clamp(3.5rem, 2.6rem + 3.7vw, 6rem),
    var(--pitch-700) clamp(3.5rem, 2.6rem + 3.7vw, 6rem) clamp(7rem, 5.2rem + 7.4vw, 12rem)
  );
}

.club-hero__frame {
  position: absolute;
  inset: var(--space-12) calc(var(--page-gutter) / 2) 0;
  border: var(--line-pitch) solid var(--chalk);
  border-block-end: 0;
}

.club-hero__circle {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: min(150vw, 54rem);
  translate: -50% -38%;
  fill: none;
  stroke: var(--chalk);
}

.club-hero__circle circle {
  stroke-width: var(--line-pitch);
  vector-effect: non-scaling-stroke;
}

.club-hero__spot {
  fill: var(--chalk);
}

/* ── Grille : une colonne sur mobile, 7 + 5 colonnes sur ordinateur ─────── */
.club-hero__grid {
  display: grid;
  gap: var(--space-40);
  align-content: center;
  padding-block: clamp(2.25rem, 1.2rem + 4.3vw, 5rem) var(--space-32);
}

.club-hero__copy {
  display: grid;
  gap: var(--space-24);
  justify-items: start;
}

.club-hero__programme {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  align-items: center;
  color: var(--accent);
}

.club-hero__dot {
  inline-size: 0.375rem;
  block-size: 0.375rem;
  border-radius: 50%;
  background: currentcolor;
}

.club-hero__title {
  display: grid;
  /* Une colonne : le titre suit la largeur de l'écran (« LE CLUB. » ≈ 4,75 em). */
  font-size: clamp(3rem, 13.5vw, 6rem);
  font-weight: 900;
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
}

.club-hero__line {
  display: block;
}

.club-hero__line--canary {
  color: var(--accent);
}

.club-hero__lead {
  max-inline-size: 34rem;
  color: var(--ink-secondary);
  font-size: var(--text-lead);
  line-height: 1.45;
}

.club-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  margin-block-start: var(--space-8);
}

.club-hero__kit {
  display: grid;
  gap: var(--space-20);
  justify-items: center;
  inline-size: min(100%, 26rem);
  justify-self: center;
}

.club-hero__jersey {
  inline-size: min(100%, 22rem);
}

@media (min-width: 64rem) {
  .club-hero__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: var(--gap);
    align-items: center;
  }

  .club-hero__copy {
    grid-column: 1 / span 7;
  }

  /* Sept colonnes : le titre tient dans les siennes, de 1 024 à 1 440 px et au-delà. */
  .club-hero__title {
    font-size: var(--text-hero);
  }

  .club-hero__kit {
    grid-column: 8 / -1;
    inline-size: 100%;
  }

  .club-hero__jersey {
    inline-size: min(100%, 27rem);
  }

  .club-hero__circle {
    inset-inline-start: 75%;
    inline-size: min(52vw, 46rem);
    translate: -50% -52%;
  }
}

/* ── Intro : le titre se pose, le maillot descend sur son cintre ─────────── */
html.hero-intro .club-hero__line,
html.hero-intro .club-hero__programme,
html.hero-intro .club-hero__lead,
html.hero-intro .club-hero__actions,
html.hero-intro .club-hero__jersey {
  opacity: 0;
}

html.hero-ready .club-hero__programme,
html.hero-ready .club-hero__lead,
html.hero-ready .club-hero__actions {
  animation: club-rise var(--dur-focal) var(--ease-out) both;
}

html.hero-ready .club-hero__programme {
  animation-delay: 0ms;
}

html.hero-ready .club-hero__line {
  animation: club-press-line var(--dur-overlay) var(--ease-strike) both;
  animation-delay: calc(120ms + var(--line-index) * var(--stagger-lines));
}

html.hero-ready .club-hero__lead {
  animation-delay: 380ms;
}

html.hero-ready .club-hero__actions {
  animation-delay: 460ms;
}

html.hero-ready .club-hero__jersey {
  transform-origin: 50% 2%;
  animation: club-hang var(--seq-max) var(--ease-out) 200ms both;
}

@keyframes club-rise {
  from {
    opacity: 0;
    translate: 0 var(--move-l);
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* Un titre floqué : il arrive un peu grand et se pose, sans flou ni écho. */
@keyframes club-press-line {
  0% {
    opacity: 0;
    transform: scale(1.08);
  }

  60% {
    opacity: 1;
    transform: scale(0.985, 0.97);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

/* Le maillot descend sur son cintre et oscille deux fois avant de se figer. */
@keyframes club-hang {
  0% {
    opacity: 0;
    transform: translateY(calc(-1 * var(--move-xl))) rotate(-4deg);
  }

  35% {
    opacity: 1;
    transform: translateY(0) rotate(2.4deg);
  }

  60% {
    transform: rotate(-1.2deg);
  }

  80% {
    transform: rotate(0.5deg);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}
</style>
