<script setup lang="ts">
import type { ClubContent } from '~/data/club';
import type { Coach } from '~/types/club';

/**
 * Carte à collectionner d'un coach. Recto : portrait officiel sur fond
 * gris-vert, numéro d'effectif, nom sur la bande canari, poste. Verso : la
 * fiche (spécialités, ses cours de la semaine, sa phrase).
 *
 * Avec JS, la carte se retourne (bouton) ; la face cachée devient inerte, pour
 * le clavier comme pour les lecteurs d'écran. Sans JS : recto et verso
 * s'empilent, tout est lisible. Mouvement réduit : la face change sans rotation.
 */
const props = defineProps<{
  coach: Coach;
  season: string;
  sessions: { day: string; time: string; discipline: string }[];
  labels: Pick<ClubContent['squad'], 'flip' | 'flipBack' | 'specialties' | 'sessions' | 'perWeek'>;
}>();

const enhanced = ref(false);
const flipped = ref(false);
onMounted(() => {
  enhanced.value = true;
});

const button = useTemplateRef<HTMLButtonElement>('button');
function toggle() {
  flipped.value = !flipped.value;
  // Le bouton reste le point d'appui du clavier, d'une face à l'autre.
  button.value?.focus();
}
</script>

<template>
  <article
    class="card"
    :class="{ 'card--enhanced': enhanced, 'card--flipped': flipped }"
    :aria-labelledby="`carte-${props.coach.id}`"
  >
    <div class="card__inner">
      <div class="card__face card__front" :inert="enhanced && flipped ? true : undefined">
        <div class="card__photo">
          <NuxtPicture
            :src="coach.portrait.src"
            :width="coach.portrait.width"
            :height="coach.portrait.height"
            :alt="coach.portrait.alt"
            format="avif,webp"
            sizes="70vw sm:40vw lg:260px"
            loading="lazy"
            decoding="async"
            :img-attrs="{ class: 'card__img', style: { objectPosition: coach.portrait.focal } }"
          />
          <span class="card__number club-number" aria-hidden="true">{{ coach.number }}</span>
          <span class="card__season club-label" aria-hidden="true">{{ season }}</span>
        </div>
        <div class="card__band">
          <h3 :id="`carte-${props.coach.id}`" class="card__name">{{ coach.firstName }}</h3>
          <p class="card__role">{{ coach.role }}</p>
        </div>
      </div>

      <div
        class="card__face card__back"
        data-surface="pitch"
        :inert="enhanced && !flipped ? true : undefined"
      >
        <span class="card__watermark club-number" aria-hidden="true">{{ coach.number }}</span>
        <p class="card__fullname">
          {{ coach.name }} <span class="card__since">{{ coach.since }}</span>
        </p>
        <div class="card__block">
          <p class="card__heading club-label">{{ labels.specialties }}</p>
          <ul class="card__tags" role="list">
            <li v-for="item in coach.specialties" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="card__block">
          <p class="card__heading club-label">
            {{ labels.sessions }} · {{ sessions.length }} {{ labels.perWeek }}
          </p>
          <ul class="card__sessions" role="list">
            <li v-for="item in sessions" :key="item.day + item.time">
              <span class="card__day">{{ item.day }}</span> {{ item.time }} · {{ item.discipline }}
            </li>
          </ul>
        </div>
        <blockquote class="card__quote">
          <p>« {{ coach.quote }} »</p>
        </blockquote>
      </div>
    </div>

    <button
      v-if="enhanced"
      ref="button"
      class="card__flip"
      type="button"
      :aria-label="`${flipped ? labels.flipBack : labels.flip} : ${coach.firstName}`"
      @click="toggle"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />
      </svg>
      <span aria-hidden="true">{{ flipped ? labels.flipBack : labels.flip }}</span>
    </button>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: grid;
  block-size: 100%;
  padding-block-end: 1.375rem;
  perspective: 1400px;
}

.card__inner {
  display: grid;
  gap: var(--space-12);
}

.card__face {
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* ── Recto ───────────────────────────────────────────────────────────────── */
.card__front {
  display: grid;
  grid-template-rows: 1fr auto;
  border: 5px solid var(--kit-white);
  background: var(--mist-200);
}

.card__photo {
  position: relative;
  display: grid;
}

.card__photo :deep(picture) {
  display: grid;
}

/* Hauteur naturelle (4:5), ou toute la case si le verso est plus haut. */
.card__photo :deep(.card__img) {
  display: block;
  inline-size: 100%;
  block-size: auto;
  min-block-size: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.card__number {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-start: 0.75rem;
  color: var(--pitch-800);
  font-size: 3.25rem;
  line-height: 1;
}

.card__season {
  position: absolute;
  inset-block-start: 0.875rem;
  inset-inline-end: 0.75rem;
  color: var(--pitch-800);
  font-size: 0.6875rem;
}

.card__band {
  display: grid;
  gap: 0.125rem;
  align-content: start;
  min-block-size: 5.75rem;
  padding: var(--space-12) var(--space-16) 1.75rem;
  background: var(--canary-400);
  color: var(--pitch-950);
}

.card__name {
  font-size: 1.625rem;
  font-weight: 900;
  line-height: 1;
}

.card__role {
  font-size: var(--text-label);
  font-weight: 600;
}

/* ── Verso : la fiche ────────────────────────────────────────────────────── */
.card__back {
  position: relative;
  display: grid;
  gap: var(--space-16);
  align-content: start;
  padding: var(--space-20);
  border: 5px solid var(--kit-white);
}

.card__watermark {
  position: absolute;
  inset-block-end: -0.12em;
  inset-inline-end: 0.05em;
  color: rgb(255 255 255 / 0.07);
  font-size: 11rem;
  line-height: 1;
  pointer-events: none;
}

.card__fullname {
  display: grid;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  font-stretch: var(--stretch-wide);
  line-height: 1.1;
  text-transform: uppercase;
}

.card__since {
  color: var(--ink-secondary);
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 400;
  font-stretch: normal;
  text-transform: none;
}

.card__block {
  display: grid;
  gap: var(--space-8);
}

.card__heading {
  color: var(--accent);
  font-size: 0.75rem;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.card__tags li {
  padding: 0.125rem 0.625rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
}

.card__sessions {
  display: grid;
  gap: 0.125rem;
  font-size: 0.875rem;
}

.card__day {
  font-weight: 700;
}

.card__quote {
  margin: 0;
  color: var(--ink);
  font-size: 0.9375rem;
  font-style: normal;
  line-height: 1.4;
}

/* ── Bouton de bascule ───────────────────────────────────────────────────── */
.card__flip {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0.875rem;
  z-index: 2;
  display: inline-flex;
  gap: 0.375rem;
  align-items: center;
  min-block-size: 2.75rem;
  padding: 0.375rem 0.875rem 0.375rem 0.625rem;
  border: var(--line-pitch) solid var(--kit-white);
  border-radius: var(--radius-pill);
  background: var(--pitch-800);
  color: var(--kit-white);
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 700;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: background-color var(--dur-feedback) var(--ease-out-soft);
}

.card__flip:hover {
  background: var(--pitch-900);
}

.card__flip svg {
  inline-size: 1.125rem;
  block-size: 1.125rem;
  fill: none;
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ── Avec JS : les deux faces dans la même case, retournées en 3D ─────────── */
.card--enhanced .card__inner {
  gap: 0;
  transform-style: preserve-3d;
}

.card--enhanced .card__face {
  grid-area: 1 / 1;
  backface-visibility: hidden;
}

.card--enhanced .card__back {
  transform: rotateY(180deg);
}

.card--enhanced.card--flipped .card__inner {
  transform: rotateY(180deg);
}

html.has-motion .card--enhanced .card__inner {
  transition: transform var(--dur-overlay) var(--ease-in-out);
}

/* Sans mouvement (réduit, ou JS sans has-motion) : la face change sur place. */
html:not(.has-motion) .card--enhanced .card__inner,
html:not(.has-motion) .card--enhanced.card--flipped .card__inner,
html:not(.has-motion) .card--enhanced .card__back {
  transform: none;
}

html:not(.has-motion) .card--enhanced .card__face {
  backface-visibility: visible;
}

html:not(.has-motion) .card--enhanced:not(.card--flipped) .card__back,
html:not(.has-motion) .card--enhanced.card--flipped .card__front {
  visibility: hidden;
}
</style>
