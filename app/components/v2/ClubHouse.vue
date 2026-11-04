<script setup lang="ts">
import { club } from '~/data/club';
import type { Weekday } from '~/types/club';

/**
 * Club-house : où et quand venir. Horaires (la ligne du jour soulignée, et
 * « Ouvert maintenant » ou la prochaine ouverture, à l'heure du visiteur),
 * adresse et accès, plan stylisé du quartier, photos du lieu.
 *
 * Tout ce qui dépend de l'heure n'existe qu'après l'hydratation ; le rendu
 * serveur montre les horaires seuls. L'adresse et le plan sont fictifs, et la
 * page le dit.
 */
const titleId = 'club-house-titre';
const content = club.clubhouse;

const now = useClubClock();
const today = computed<Weekday | undefined>(() => (now.value ? weekdayOf(now.value) : undefined));

const status = computed(() => {
  if (!now.value) return undefined;
  const state = openStatus(content.hours, now.value);
  if (!state) return undefined;
  if (state.open) {
    return {
      open: true,
      text: content.open,
      detail: content.closesAt.replace('{time}', formatTime(state.closes)),
    };
  }
  const day =
    state.inDays === 0
      ? content.todayLabel
      : state.inDays === 1
        ? content.tomorrowLabel
        : (club.schedule.days[state.day] ?? '').toLocaleLowerCase('fr');
  return {
    open: false,
    text: content.closed,
    detail: content.opensAt.replace('{day}', day).replace('{time}', formatTime(state.opens)),
  };
});

const isToday = (days: [Weekday, Weekday]) =>
  today.value !== undefined && today.value >= days[0] && today.value <= days[1];

const [floor, ...portraits] = content.photos;
</script>

<template>
  <section
    id="club-house"
    class="club-section house"
    data-surface="mist"
    :aria-labelledby="titleId"
  >
    <div class="container">
      <ClubSectionHead :number="11" :title="content.title" :title-id="titleId" />

      <div class="house__grid">
        <div class="house__info">
          <div class="house__block">
            <div class="house__row">
              <h3 class="house__heading club-label">{{ content.hoursTitle }}</h3>
              <p
                v-if="status"
                class="house__status"
                :class="{ 'house__status--open': status.open }"
              >
                <span class="house__dot" aria-hidden="true" />
                <strong>{{ status.text }}</strong>
                <span>{{ status.detail }}</span>
              </p>
            </div>
            <table class="hours">
              <caption class="visually-hidden">
                {{
                  content.hoursTitle
                }}
              </caption>
              <tbody>
                <tr
                  v-for="slot in content.hours"
                  :key="slot.label"
                  :class="{ 'hours__row--today': isToday(slot.days) }"
                  :aria-current="isToday(slot.days) ? 'date' : undefined"
                >
                  <th scope="row" class="hours__day">
                    {{ slot.label }}
                    <span v-if="isToday(slot.days)" class="hours__today club-label">{{
                      club.schedule.today
                    }}</span>
                  </th>
                  <td class="hours__time club-number">
                    {{ formatTime(slot.open) }} – {{ formatTime(slot.close) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="house__block">
            <h3 class="house__heading club-label">{{ content.addressTitle }}</h3>
            <address class="house__address">
              <span v-for="line in content.address" :key="line">{{ line }}</span>
            </address>
            <p class="club-note">{{ content.addressNote }}</p>
            <ul class="house__access" role="list">
              <li v-for="line in content.access" :key="line">{{ line }}</li>
            </ul>
          </div>
        </div>

        <figure class="map">
          <svg class="map__svg" viewBox="0 0 640 480" role="img" :aria-label="content.mapLabel">
            <rect class="map__ground" width="640" height="480" rx="14" />
            <!-- Îlots du quartier. -->
            <g class="map__blocks">
              <rect x="24" y="24" width="150" height="120" rx="10" />
              <rect x="194" y="24" width="120" height="120" rx="10" />
              <rect x="24" y="214" width="150" height="104" rx="10" />
              <rect x="194" y="214" width="120" height="104" rx="10" />
              <rect x="24" y="338" width="290" height="118" rx="10" />
              <rect x="398" y="338" width="218" height="118" rx="10" />
              <rect x="398" y="24" width="100" height="120" rx="10" />
            </g>
            <!-- Le parc, avec ses allées. -->
            <rect class="map__park" x="518" y="24" width="98" height="294" rx="10" />
            <path class="map__path" d="M530 60q40 40 30 120t40 120" />
            <path class="map__park-block" d="M398 214h100v104H408a10 10 0 0 1-10-10Z" />
            <!-- Les rues : la rue des Canaris (horizontale), le cours du Stade (verticale). -->
            <path class="map__street" d="M0 179h640" />
            <path class="map__street" d="M356 0v480" />
            <path class="map__street map__street--small" d="M184 0v480M0 328h640M508 0v330" />
            <text class="map__label" x="40" y="172">{{ content.mapStreets.main }}</text>
            <text class="map__label" x="349" y="460" transform="rotate(-90 349 460)">
              {{ content.mapStreets.cross }}
            </text>
            <text class="map__label map__label--park" x="567" y="300" text-anchor="middle">
              {{ content.mapStreets.park }}
            </text>
            <!-- Métro. -->
            <g class="map__metro" transform="translate(250 179)">
              <circle r="15" />
              <text y="5.5" text-anchor="middle">{{ content.mapStreets.metro }}</text>
            </g>
            <!-- Le club : l'écusson au croisement. -->
            <g class="map__club" transform="translate(356 179)">
              <circle class="map__ring" r="34" />
              <circle class="map__pin" r="22" />
              <path class="map__crest" d="M-9-11h18v10c0 6-4 10-9 12.5C-5 9-9 5-9-1Z" />
              <rect class="map__crest-band" x="-9" y="-4" width="18" height="4.5" />
            </g>
          </svg>
        </figure>
      </div>

      <div class="house__photos">
        <NuxtPicture
          v-if="floor"
          :src="floor.src"
          :width="floor.width"
          :height="floor.height"
          :alt="floor.alt"
          format="avif,webp"
          sizes="100vw lg:840px"
          loading="lazy"
          decoding="async"
          class="house__photo house__photo--wide"
          :img-attrs="{ class: 'house__img', style: { objectPosition: floor.focal } }"
        />
        <NuxtPicture
          v-for="photo in portraits"
          :key="photo.src"
          :src="photo.src"
          :width="photo.width"
          :height="photo.height"
          :alt="photo.alt"
          format="avif,webp"
          sizes="50vw lg:420px"
          loading="lazy"
          decoding="async"
          class="house__photo"
          :img-attrs="{ class: 'house__img', style: { objectPosition: photo.focal } }"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.house__grid {
  display: grid;
  gap: var(--block-gap) var(--gap);
  margin-block-start: var(--header-gap);
}

.house__info {
  display: grid;
  gap: var(--space-40);
  align-content: start;
}

.house__block {
  display: grid;
  gap: var(--space-12);
}

.house__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8) var(--space-16);
  align-items: center;
  justify-content: space-between;
}

.house__heading {
  color: var(--accent-ink);
}

.house__status {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-pill);
  background: var(--kit-white);
  font-size: var(--text-label);
}

.house__status--open {
  background: var(--pitch-800);
  color: var(--kit-white);
}

.house__dot {
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--slate-600);
}

.house__status--open .house__dot {
  background: var(--canary-400);
}

.hours {
  inline-size: 100%;
  border-collapse: collapse;
  border-block-start: var(--line-pitch) solid var(--pitch-800);
}

.hours tr {
  border-block-end: 1px solid var(--rule);
}

.hours__day,
.hours__time {
  padding-block: var(--space-16);
  text-align: start;
}

.hours__day {
  font-weight: 600;
}

.hours__time {
  color: var(--pitch-800);
  font-size: 1.5rem;
  text-align: end;
  white-space: nowrap;
}

.hours__row--today {
  background: var(--kit-white);
}

.hours__row--today .hours__day {
  padding-inline-start: var(--space-12);
  box-shadow: inset 4px 0 0 var(--canary-400);
}

.hours__row--today .hours__time {
  padding-inline-end: var(--space-12);
}

.hours__today {
  display: inline-block;
  margin-inline-start: var(--space-8);
  padding: 0 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--canary-400);
  color: var(--pitch-950);
  font-size: 0.6875rem;
  vertical-align: middle;
}

.house__address {
  display: grid;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 800;
  font-stretch: var(--stretch-semi);
  line-height: 1.15;
  text-transform: uppercase;
}

.house__access {
  display: grid;
  gap: var(--space-8);
  margin-block-start: var(--space-8);
  color: var(--ink-secondary);
}

.house__access li {
  padding-inline-start: 1.25rem;
  background: linear-gradient(var(--pitch-800), var(--pitch-800)) 0 0.7em / 0.5rem 2px no-repeat;
}

/* ── Plan stylisé ────────────────────────────────────────────────────────── */
.map {
  display: grid;
  gap: var(--space-12);
  margin: 0;
}

.map__svg {
  display: block;
  inline-size: 100%;
  block-size: auto;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.map__ground {
  fill: #d7e1da;
}

.map__blocks rect {
  fill: var(--kit-white);
}

.map__park,
.map__park-block {
  fill: #b9d3c1;
}

.map__path {
  fill: none;
  stroke: var(--kit-white);
  stroke-width: 4;
  stroke-dasharray: 2 8;
  stroke-linecap: round;
}

.map__street {
  fill: none;
  stroke: #c4d2c8;
  stroke-width: 14;
}

.map__street--small {
  stroke-width: 6;
}

.map__label {
  fill: var(--slate-600);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  font-stretch: 112.5%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.map__label--park {
  fill: var(--pitch-800);
}

.map__metro circle {
  fill: var(--pitch-950);
}

.map__metro text {
  fill: var(--kit-white);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 800;
}

.map__ring {
  fill: rgb(15 82 51 / 0.16);
  stroke: var(--pitch-800);
  stroke-width: 2;
  stroke-dasharray: 4 5;
}

html.has-motion .map__ring {
  transform-box: fill-box;
  transform-origin: center;
  animation: map-ring 2.4s var(--ease-out) infinite;
}

@keyframes map-ring {
  0% {
    opacity: 1;
    scale: 0.7;
  }

  100% {
    opacity: 0;
    scale: 1.5;
  }
}

.map__pin {
  fill: var(--canary-400);
  stroke: var(--kit-white);
  stroke-width: 4;
}

.map__crest {
  fill: var(--pitch-800);
}

.map__crest-band {
  fill: var(--canary-400);
}

/* ── Photos du lieu ──────────────────────────────────────────────────────── */
.house__photos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gap);
  margin-block-start: var(--block-gap);
}

.house__photo {
  display: block;
  border-radius: var(--radius-card);
  overflow: hidden;
}

.house__photo--wide {
  grid-column: 1 / -1;
}

.house__photo :deep(.house__img) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.house__photo--wide :deep(.house__img) {
  aspect-ratio: 16 / 9;
}

@media (min-width: 64rem) {
  .house__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .house__info {
    grid-column: 1 / span 5;
  }

  .map {
    grid-column: 7 / -1;
  }

  .house__photos {
    grid-template-columns: 2fr 1fr 1fr;
  }

  .house__photo--wide {
    grid-column: auto;
  }

  .house__photo--wide :deep(.house__img),
  .house__photo :deep(.house__img) {
    aspect-ratio: auto;
    block-size: 26rem;
  }
}
</style>
