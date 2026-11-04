<script setup lang="ts">
import { club, type ClubContent } from '~/data/club';
import type { Session } from '~/types/club';

/**
 * La ligne de touche du hero : le prochain cours, à l'heure du visiteur.
 * Rendu serveur (et sans JS) : la semaine en une phrase et le lien du calendrier.
 * Après l'hydratation : « En cours » ou « Prochain cours », discipline, jour,
 * heure et coach, tenus à la minute.
 */
const props = defineProps<{
  content: ClubContent['hero']['next'];
  sessions: Session[];
  disciplines: ClubContent['disciplines']['items'];
  coaches: ClubContent['squad']['coaches'];
}>();

const now = useClubClock();
const days = club.schedule.days;

const next = computed(() => {
  if (!now.value) return undefined;
  const found = nextSession(props.sessions, now.value);
  if (!found) return undefined;
  const { session, inDays, live } = found;
  const discipline = props.disciplines.find(({ id }) => id === session.discipline)?.name ?? '';
  const coach = props.coaches.find(({ id }) => id === session.coach)?.firstName ?? '';
  const when =
    inDays === 0
      ? club.schedule.today.toLocaleLowerCase('fr')
      : inDays === 1
        ? club.clubhouse.tomorrowLabel
        : (days[session.day] ?? '').toLocaleLowerCase('fr');
  return { live, discipline, coach, when, time: formatTime(session.start) };
});
</script>

<template>
  <div class="next">
    <div class="container next__bar">
      <p class="next__text">
        <span class="next__label club-label">
          <span
            class="next__pulse"
            :class="{ 'next__pulse--live': next?.live }"
            aria-hidden="true"
          />
          {{ next?.live ? club.schedule.live : content.label }}
        </span>
        <span v-if="next" class="next__session">
          <strong class="next__discipline">{{ next.discipline }}</strong>
          <span>{{ next.when }}, {{ next.time }}</span>
          <span class="next__coach">{{ club.schedule.with }} {{ next.coach }}</span>
        </span>
        <span v-else class="next__session">{{ content.fallback }}</span>
      </p>
      <a class="next__link" href="#calendrier">
        {{ content.link }}
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" />
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
/* La ligne de touche : un filet blanc pleine largeur qui porte le direct. */
.next {
  position: relative;
  border-block-start: var(--line-pitch) solid var(--chalk);
  background: rgb(5 34 20 / 0.42);
}

.next__bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12) var(--space-24);
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-16);
}

.next__text {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8) var(--space-16);
  align-items: center;
}

.next__label {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color: var(--accent);
}

.next__pulse {
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 50%;
  background: currentcolor;
}

html.has-motion .next__pulse--live {
  animation: next-pulse 1.6s var(--ease-out) infinite;
}

@keyframes next-pulse {
  0% {
    box-shadow: 0 0 0 0 rgb(255 216 61 / 0.6);
  }

  100% {
    box-shadow: 0 0 0 0.6rem rgb(255 216 61 / 0);
  }
}

.next__session {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.625rem;
  align-items: baseline;
  color: var(--ink);
}

.next__discipline {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 800;
  font-stretch: var(--stretch-wide);
  text-transform: uppercase;
}

.next__coach {
  color: var(--ink-secondary);
}

.next__link {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  min-block-size: 2.75rem;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-label);
  font-weight: 700;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.06em;
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-decoration-thickness: var(--line-pitch);
  text-underline-offset: 0.35em;
  text-transform: uppercase;
}

.next__link svg {
  inline-size: 1.125rem;
  block-size: 1.125rem;
}
</style>
