<script setup lang="ts">
import { club } from '~/data/club';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

/**
 * Le club en chiffres : un tableau des scores. Membres (fictif), coachs, cours
 * par semaine et amplitude d'ouverture ; les trois derniers sont tirés des
 * données (effectif, calendrier, horaires) : rien n'est compté à la main.
 *
 * Mouvement : les chiffres défilent jusqu'à leur valeur quand le tableau entre,
 * comme un afficheur de stade. L'état final (les vraies valeurs) est dans le HTML.
 */
const titleId = 'chiffres-titre';
const content = club.stats;

const weekday = club.clubhouse.hours[0];
const amplitude = weekday ? toMinutes(weekday.close) - toMinutes(weekday.open) : 0;

const stats = [
  { value: content.members.value, unit: '', label: content.members.label },
  { value: String(club.squad.coaches.length), unit: '', label: content.coaches },
  { value: String(club.schedule.sessions.length), unit: '', label: content.sessions },
  {
    value: String(Math.floor(amplitude / 60)),
    unit: amplitude % 60 ? `h${String(amplitude % 60).padStart(2, '0')}` : 'h',
    label: weekday
      ? content.hours
          .replace('{open}', formatTime(weekday.open))
          .replace('{close}', formatTime(weekday.close))
      : '',
  },
];

const root = useTemplateRef<HTMLElement>('root');

useMotion(root, ({ gsap, ScrollTrigger }, element) => {
  const figures = [...element.querySelectorAll<HTMLElement>('[data-count]')];
  const board = element.querySelector('.board');
  if (!board || reached(board, 'bottom')) return undefined;
  const counters = figures.map((figure) => ({ figure, target: Number(figure.dataset.count) }));
  gsap.set(element.querySelectorAll('.board__cell'), { opacity: 0, y: length('--move-s') });
  ScrollTrigger.create({
    trigger: board,
    ...ENTRY,
    onEnter: () => {
      gsap.to(element.querySelectorAll('.board__cell'), {
        opacity: 1,
        y: 0,
        duration: duration('--dur-layout'),
        stagger: capped(stagger('--stagger-list')),
      });
      counters.forEach(({ figure, target }, index) => {
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: duration('--seq-max') - 0.2,
          delay: index * stagger('--stagger-list'),
          ease: 'out',
          onUpdate: () => {
            figure.textContent = String(Math.round(state.value));
          },
        });
      });
    },
  });
  return () => {
    for (const { figure, target } of counters) figure.textContent = String(target);
  };
});
</script>

<template>
  <section ref="root" class="club-section stats" :aria-labelledby="titleId">
    <div class="container">
      <ClubSectionHead
        :number="2"
        :kicker="content.kicker"
        :title="content.title"
        :title-id="titleId"
      />
      <div class="board" data-surface="pitch">
        <div class="board__top club-label" aria-hidden="true">
          <span>{{ club.name }}</span>
          <span class="board__season">{{ club.season.label }}</span>
        </div>
        <dl class="board__cells">
          <div v-for="stat in stats" :key="stat.label" class="board__cell">
            <dt class="board__label">{{ stat.label }}</dt>
            <dd class="board__value club-number">
              <span :data-count="stat.value">{{ stat.value }}</span
              ><span v-if="stat.unit" class="board__unit">{{ stat.unit }}</span>
            </dd>
          </div>
        </dl>
      </div>
      <p class="club-note stats__note">{{ content.note }}</p>
    </div>
  </section>
</template>

<style scoped>
.board {
  margin-block-start: var(--header-gap);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.board__top {
  display: flex;
  justify-content: space-between;
  padding: var(--space-12) var(--space-24);
  border-block-end: var(--line-pitch) solid var(--chalk);
  background: var(--pitch-900);
  color: var(--accent);
}

.board__season {
  color: var(--ink);
}

.board__cells {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.board__cell {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--space-8);
  justify-content: flex-end;
  padding: var(--space-24) var(--space-20) var(--space-32);
  border-inline-end: 1px solid var(--rule);
  border-block-end: 1px solid var(--rule);
}

.board__cell:nth-child(2n) {
  border-inline-end: 0;
}

.board__value {
  display: flex;
  align-items: baseline;
  color: var(--ink);
  font-size: var(--text-figure);
  line-height: 0.85;
}

.board__unit {
  margin-inline-start: 0.08em;
  color: var(--accent);
  font-size: 0.42em;
  font-stretch: var(--stretch-semi);
}

.board__label {
  max-inline-size: 16rem;
  color: var(--ink-secondary);
  font-size: var(--text-label);
  line-height: 1.35;
}

.stats__note {
  margin-block-start: var(--space-16);
}

@media (min-width: 64rem) {
  .board__cells {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .board__cell {
    padding: var(--space-32) var(--space-32) var(--space-40);
    border-block-end: 0;
  }

  .board__cell:nth-child(2n) {
    border-inline-end: 1px solid var(--rule);
  }

  .board__cell:last-child {
    border-inline-end: 0;
  }
}
</style>
