<script setup lang="ts">
import { club } from '~/data/club';
import type { DisciplineId, Session, Weekday } from '~/types/club';

/**
 * Le calendrier du club : la semaine type, chaque cours présenté comme un match
 * (coup d'envoi, discipline, terrain, coach).
 *
 * - Sans JS : les sept jours s'empilent, chacun sous son titre ; ni onglets ni
 *   filtres (ils ne feraient rien).
 * - Avec JS : onglets des jours (motif APG : flèches, Début, Fin), le jour du
 *   visiteur sélectionné au montage ; filtres par discipline (boutons radio
 *   natifs), partagés avec « Voir les créneaux » des disciplines.
 * - Aujourd'hui : les cours terminés s'éteignent, celui en cours montre sa
 *   progression, le prochain est désigné, et la ligne « Maintenant » passe entre
 *   les deux. Tout est tenu à la minute (useClubClock).
 *
 * Le rendu serveur sélectionne lundi ; html.js masque d'emblée les autres jours
 * (aucun saut de mise en page à l'hydratation, même en arrivant par une ancre).
 */
const titleId = 'calendrier-titre';
const content = club.schedule;
const disciplines = club.disciplines.items;
const coaches = club.squad.coaches;

const now = useClubClock();
const today = computed<Weekday | undefined>(() => (now.value ? weekdayOf(now.value) : undefined));
const minutesNow = computed(() => (now.value ? minutesOf(now.value) : undefined));

const enhanced = ref(false);
const selected = ref<Weekday>(0);
const filter = useState<DisciplineId | 'all'>('club-filter', () => 'all');

onMounted(() => {
  enhanced.value = true;
  selected.value = weekdayOf(new Date());
});

const sorted = sortSessions(content.sessions);
const days = content.days.map((name, index) => {
  const day = index as Weekday;
  return {
    day,
    name,
    short: content.short[day] ?? name,
    sessions: sorted.filter((s) => s.day === day),
  };
});

const visible = (sessions: Session[]) =>
  filter.value === 'all'
    ? sessions
    : sessions.filter(({ discipline }) => discipline === filter.value);

const disciplineName = (id: DisciplineId) => disciplines.find((d) => d.id === id)?.name ?? id;
const coachOf = (id: Session['coach']) => coaches.find((c) => c.id === id);

/** États des cours d'un jour : seulement aujourd'hui, à la minute. */
const statesOf = (day: Weekday, sessions: Session[]) =>
  sessionStates(sessions, day === today.value ? minutesNow.value : undefined);

/** Progression d'un cours en cours (0 → 1). */
const progressOf = (session: Session) => {
  if (minutesNow.value === undefined) return 0;
  return Math.min(1, Math.max(0, (minutesNow.value - toMinutes(session.start)) / session.minutes));
};

const nowLabel = computed(() => {
  if (!now.value) return '';
  const hh = String(now.value.getHours()).padStart(2, '0');
  const mm = String(now.value.getMinutes()).padStart(2, '0');
  return formatTime(`${hh}:${mm}`);
});

/** Où passe la ligne « Maintenant » : avant le premier cours non terminé. */
const nowIndex = (day: Weekday, sessions: Session[]) => {
  if (day !== today.value) return -1;
  const states = statesOf(day, sessions);
  const index = states.findIndex((state) => state !== 'done');
  return index === -1 ? sessions.length : index;
};

const tabRefs = ref<HTMLButtonElement[]>([]);
const tabId = (day: number) => `jour-onglet-${day}`;
const panelId = (day: number) => `jour-panneau-${day}`;

function onKey(event: KeyboardEvent, index: number) {
  const moves: Record<string, number> = {
    ArrowRight: index + 1,
    ArrowLeft: index - 1,
    Home: 0,
    End: 6,
  };
  const target = moves[event.key];
  if (target === undefined) return;
  event.preventDefault();
  selected.value = (((target % 7) + 7) % 7) as Weekday;
  tabRefs.value[selected.value]?.focus();
}

const filterOptions = computed(() => [
  { id: 'all' as const, name: content.all },
  ...disciplines.map(({ id, name }) => ({ id, name })),
]);
</script>

<template>
  <section
    id="calendrier"
    class="club-section schedule"
    :class="{ 'schedule--enhanced': enhanced }"
    data-surface="pitch"
    :aria-labelledby="titleId"
  >
    <div class="schedule__lines" aria-hidden="true" />
    <div class="container">
      <ClubSectionHead
        :number="5"
        :kicker="content.kicker"
        :title="content.title"
        :title-id="titleId"
        :lead="content.lead"
      />

      <div class="schedule__controls">
        <div class="schedule__tabs" role="tablist" :aria-label="content.kicker">
          <button
            v-for="item in days"
            :id="tabId(item.day)"
            :key="item.day"
            ref="tabRefs"
            class="schedule__tab"
            :class="{ 'schedule__tab--today': item.day === today }"
            type="button"
            role="tab"
            :aria-selected="item.day === selected"
            :aria-controls="panelId(item.day)"
            :tabindex="item.day === selected ? 0 : -1"
            @click="selected = item.day"
            @keydown="onKey($event, item.day)"
          >
            <span class="schedule__tab-short" aria-hidden="true">{{ item.short }}</span>
            <span class="schedule__tab-name">{{ item.name }}</span>
            <span class="schedule__tab-count club-number" aria-hidden="true">{{
              visible(item.sessions).length
            }}</span>
            <span v-if="item.day === today" class="schedule__tab-today">{{ content.today }}</span>
          </button>
        </div>

        <fieldset class="schedule__filters">
          <legend class="visually-hidden">{{ content.filters }}</legend>
          <label v-for="option in filterOptions" :key="option.id" class="schedule__chip">
            <input
              v-model="filter"
              class="schedule__radio"
              type="radio"
              name="discipline"
              :value="option.id"
            />
            <span>{{ option.name }}</span>
          </label>
        </fieldset>
      </div>

      <div class="schedule__days">
        <div
          v-for="item in days"
          :id="panelId(item.day)"
          :key="item.day"
          class="day"
          :class="{ 'day--selected': item.day === selected }"
          :role="enhanced ? 'tabpanel' : undefined"
          :aria-labelledby="enhanced ? tabId(item.day) : undefined"
          :hidden="enhanced && item.day !== selected"
        >
          <h3 class="day__title">{{ item.name }}</h3>
          <ol v-if="visible(item.sessions).length" class="day__matches" role="list">
            <template
              v-for="(session, index) in visible(item.sessions)"
              :key="session.start + session.discipline"
            >
              <li
                v-if="index === nowIndex(item.day, visible(item.sessions))"
                class="day__now"
                aria-hidden="true"
              >
                <span class="day__now-label club-label">{{ content.now }} · {{ nowLabel }}</span>
              </li>
              <li
                class="match"
                :class="`match--${statesOf(item.day, visible(item.sessions))[index]}`"
                :style="{ '--i': index, '--progress': progressOf(session) }"
              >
                <time class="match__time club-number" :datetime="session.start">
                  {{ splitTime(session.start).hours
                  }}<span class="match__min">h{{ splitTime(session.start).minutes }}</span>
                </time>
                <div class="match__main">
                  <p class="match__discipline">{{ disciplineName(session.discipline) }}</p>
                  <p class="match__meta">
                    {{ session.room }} · {{ session.minutes }} min · {{ session.level }}
                  </p>
                </div>
                <p class="match__coach">
                  <NuxtPicture
                    v-if="coachOf(session.coach)"
                    :src="coachOf(session.coach)!.portrait.src"
                    width="96"
                    height="96"
                    alt=""
                    format="avif,webp"
                    sizes="48px"
                    densities="x1 x2"
                    loading="lazy"
                    decoding="async"
                    :img-attrs="{ class: 'match__portrait' }"
                  />
                  <span>{{ content.with }} {{ coachOf(session.coach)?.firstName }}</span>
                </p>
                <p
                  v-if="statesOf(item.day, visible(item.sessions))[index] !== 'later'"
                  class="match__state club-label"
                >
                  {{
                    {
                      done: content.done,
                      live: content.live,
                      next: content.next,
                      later: '',
                    }[statesOf(item.day, visible(item.sessions))[index]!]
                  }}
                </p>
                <span class="match__progress" aria-hidden="true" />
              </li>
            </template>
            <li
              v-if="nowIndex(item.day, visible(item.sessions)) === visible(item.sessions).length"
              class="day__now"
              aria-hidden="true"
            >
              <span class="day__now-label club-label">{{ content.now }} · {{ nowLabel }}</span>
            </li>
          </ol>
          <p v-else class="day__empty">{{ content.empty }}</p>
        </div>
      </div>

      <p class="club-note schedule__note">{{ content.note }}</p>
    </div>
  </section>
</template>

<style scoped>
.schedule {
  overflow: clip;
}

/* Filets du terrain : la ligne médiane et un arc de surface de réparation. */
.schedule__lines {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(
        circle at 100% 0,
        transparent 0 13.9rem,
        var(--chalk) 13.9rem calc(13.9rem + 2px),
        transparent calc(13.9rem + 2px)
      )
      no-repeat,
    repeating-linear-gradient(
      to right,
      transparent 0 clamp(4rem, 3rem + 5vw, 8rem),
      rgb(255 255 255 / 0.03) clamp(4rem, 3rem + 5vw, 8rem) clamp(8rem, 6rem + 10vw, 16rem)
    );
  opacity: 0.6;
  pointer-events: none;
}

.schedule > .container {
  position: relative;
}

/* ── Contrôles ───────────────────────────────────────────────────────────── */
.schedule__controls {
  display: none;
  gap: var(--space-20);
  margin-block-start: var(--header-gap);
}

html.js .schedule__controls {
  display: grid;
}

.schedule__tabs {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border: var(--line-pitch) solid var(--chalk);
  border-radius: var(--radius-card);
  overflow: hidden;
}

.schedule__tab {
  position: relative;
  display: grid;
  gap: 0.125rem;
  justify-items: center;
  min-block-size: 4.25rem;
  padding: var(--space-8) 0.125rem var(--space-12);
  border: 0;
  border-inline-end: 1px solid var(--rule);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-display);
  cursor: pointer;
  transition:
    background-color var(--dur-state) var(--ease-out-soft),
    color var(--dur-state) var(--ease-out-soft);
}

.schedule__tab:last-child {
  border-inline-end: 0;
}

.schedule__tab:hover {
  background: var(--pitch-900);
}

.schedule__tab[aria-selected='true'] {
  background: var(--canary-400);
  color: var(--pitch-950);
}

.schedule__tab-short {
  font-size: 1rem;
  font-weight: 800;
  font-stretch: var(--stretch-semi);
  text-transform: uppercase;
}

.schedule__tab-name {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.schedule__tab-count {
  font-size: 1.5rem;
  line-height: 1;
}

.schedule__tab-today {
  position: absolute;
  inset-block-start: 0.375rem;
  inset-inline-end: 0.375rem;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  overflow: hidden;
  border-radius: 50%;
  background: var(--canary-400);
  color: transparent;
  font-size: 0;
}

.schedule__tab[aria-selected='true'] .schedule__tab-today {
  background: var(--pitch-800);
}

@media (min-width: 48rem) {
  .schedule__tab-short {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .schedule__tab-name {
    position: static;
    inline-size: auto;
    block-size: auto;
    overflow: visible;
    clip-path: none;
    font-size: 1rem;
    font-weight: 800;
    font-stretch: var(--stretch-semi);
    text-transform: uppercase;
  }

  .schedule__tab-today {
    position: static;
    inline-size: auto;
    block-size: auto;
    padding: 0 0.5rem;
    border-radius: var(--radius-pill);
    color: var(--pitch-950);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .schedule__tab[aria-selected='true'] .schedule__tab-today {
    color: var(--kit-white);
  }
}

.schedule__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  margin: 0;
  padding: 0;
  border: 0;
}

.schedule__chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-block-size: 2.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  color: var(--ink);
  font-size: var(--text-label);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color var(--dur-feedback) var(--ease-out-soft),
    border-color var(--dur-feedback) var(--ease-out-soft);
}

.schedule__chip:hover {
  border-color: var(--chalk);
}

.schedule__radio {
  position: absolute;
  inset: 0;
  margin: 0;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}

.schedule__chip:has(.schedule__radio:checked) {
  border-color: var(--kit-white);
  background: var(--kit-white);
  color: var(--pitch-950);
}

.schedule__chip:has(.schedule__radio:focus-visible) {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
}

/* ── Les jours ───────────────────────────────────────────────────────────── */
.schedule__days {
  display: grid;
  gap: var(--block-gap);
  margin-block-start: var(--space-32);
}

html.js .schedule__days {
  gap: 0;
}

/* Avant l'hydratation, seul le jour sélectionné par le serveur reste visible. */
html.js .schedule:not(.schedule--enhanced) .day:not(.day--selected) {
  display: none;
}

.day__title {
  margin-block-end: var(--space-16);
  font-size: var(--text-subheading);
}

html.js .day__title {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.day__matches {
  display: grid;
  gap: var(--space-8);
}

.day__empty {
  padding: var(--space-32) var(--space-24);
  border: 1px dashed var(--rule);
  border-radius: var(--radius-card);
  color: var(--ink-secondary);
}

/* ── Un cours, présenté comme un match ───────────────────────────────────── */
.match {
  position: relative;
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: var(--space-4) var(--space-16);
  align-items: center;
  padding: var(--space-16) var(--space-16) var(--space-16) var(--space-12);
  border-radius: var(--radius-card);
  background: var(--pitch-900);
  overflow: hidden;
  transition: opacity var(--dur-state) var(--ease-out-soft);
}

.match__time {
  grid-row: span 2;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: var(--accent);
  font-size: 2.75rem;
  line-height: 0.9;
}

.match__min {
  margin-block-start: 0.15em;
  font-size: 0.42em;
  font-stretch: var(--stretch-semi);
}

.match__discipline {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  font-stretch: var(--stretch-wide);
  line-height: 1.05;
  text-transform: uppercase;
}

.match__meta {
  color: var(--ink-secondary);
  font-size: var(--text-label);
}

.match__coach {
  grid-column: 2;
  display: flex;
  gap: var(--space-8);
  align-items: center;
  color: var(--ink);
  font-size: var(--text-label);
}

.match__coach :deep(.match__portrait) {
  display: block;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: 50%;
  background: var(--mist-200);
  object-fit: cover;
  object-position: 50% 22%;
}

.match__state {
  position: absolute;
  inset-block-start: var(--space-12);
  inset-inline-end: var(--space-12);
  padding: 0.125rem 0.625rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
}

.match__progress {
  position: absolute;
  inset-inline-start: 0;
  inset-block-end: 0;
  inline-size: 100%;
  block-size: 3px;
  background: var(--canary-400);
  scale: var(--progress) 1;
  transform-origin: left;
  transition: scale var(--dur-layout) var(--ease-out);
}

.match--done {
  opacity: 0.55;
}

.match--done .match__state {
  border: 1px solid var(--rule);
  color: var(--ink-secondary);
}

.match--live {
  background: var(--kit-white);
  color: var(--pitch-950);
  --accent: var(--pitch-800);
  --ink: var(--pitch-950);
  --ink-secondary: var(--slate-600);
}

.match--live .match__state {
  background: var(--pitch-800);
  color: var(--kit-white);
}

.match--next {
  box-shadow: inset 0 0 0 var(--line-pitch) var(--canary-400);
}

.match--next .match__state {
  background: var(--canary-400);
  color: var(--pitch-950);
}

/* La ligne « Maintenant » : le temps avance entre les cours. */
.day__now {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  margin-block: var(--space-4);
}

.day__now::before,
.day__now::after {
  flex: 1;
  block-size: var(--line-pitch);
  background: var(--canary-400);
  content: '';
}

.day__now::before {
  flex: 0 0 var(--space-24);
}

.day__now-label {
  color: var(--canary-400);
}

@media (min-width: 48rem) {
  .match {
    grid-template-columns: 6rem minmax(0, 1.4fr) minmax(0, 1fr) 7rem;
    padding: var(--space-16) var(--space-24) var(--space-16) var(--space-16);
  }

  .match__time {
    grid-row: auto;
    font-size: 3.25rem;
  }

  .match__main {
    display: grid;
    gap: 0.125rem;
  }

  .match__coach {
    grid-column: auto;
  }

  .match__state {
    position: static;
    justify-self: end;
  }

  .match__discipline {
    font-size: 1.5rem;
  }
}

/* Changer de jour : les matchs avancent depuis la droite, en cascade plafonnée. */
html.has-motion .schedule--enhanced .day--selected .match {
  animation: match-in var(--dur-layout) var(--ease-out) both;
  animation-delay: calc(min(var(--i), 5) * var(--stagger-tight));
}

@keyframes match-in {
  from {
    opacity: 0;
    translate: var(--move-l) 0;
  }
}

.schedule__note {
  margin-block-start: var(--space-24);
}
</style>
