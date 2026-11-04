<script setup lang="ts">
import { club } from '~/data/club';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

/**
 * L'effectif : la photo d'équipe d'avant-saison (chacun repéré par son numéro),
 * puis cinq cartes à collectionner qui se retournent sur la fiche du coach.
 * Les cours de chaque coach sont tirés du calendrier.
 */
const titleId = 'effectif-titre';
const content = club.squad;

const sorted = sortSessions(club.schedule.sessions);
const disciplineName = (id: string) => club.disciplines.items.find((d) => d.id === id)?.name ?? id;
const sessionsOf = (id: string) =>
  sorted
    .filter(({ coach }) => coach === id)
    .map(({ day, start, discipline }) => ({
      day: club.schedule.short[day] ?? '',
      time: formatTime(start),
      discipline: disciplineName(discipline),
    }));

const tags = content.teamPositions.map(({ id, x }) => {
  const coach = content.coaches.find((c) => c.id === id);
  return { id, x, number: coach?.number ?? 0, name: coach?.firstName ?? '' };
});

const root = useTemplateRef<HTMLElement>('root');
useMotion(root, ({ gsap, ScrollTrigger }, element) => {
  const cards = element.querySelectorAll('.squad__card');
  const photo = element.querySelector('.squad__photo');
  if (photo && !reached(photo, 'bottom')) {
    const tagEls = photo.querySelectorAll('.squad__tag');
    gsap.set(tagEls, { opacity: 0, y: length('--move-s') });
    ScrollTrigger.create({
      trigger: photo,
      ...ENTRY,
      onEnter: () =>
        gsap.to(tagEls, {
          opacity: 1,
          y: 0,
          duration: duration('--dur-layout'),
          ease: 'strike',
          delay: duration('--dur-state'),
          stagger: capped(stagger('--stagger-list')),
        }),
    });
  }
  if (!cards.length || reached(cards[0]!, 'bottom')) return undefined;
  // Les cartes arrivent comme on les pose sur la table : légère rotation, puis à plat.
  gsap.set(cards, { opacity: 0, y: length('--move-xl'), rotation: (i) => (i % 2 ? 3 : -3) });
  ScrollTrigger.create({
    trigger: cards[0],
    ...ENTRY,
    onEnter: () =>
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: duration('--dur-focal'),
        ease: 'strike',
        stagger: capped(stagger('--stagger-list')),
      }),
  });
  return undefined;
});
</script>

<template>
  <section id="effectif" ref="root" class="club-section squad" :aria-labelledby="titleId">
    <div class="container">
      <ClubSectionHead
        :number="6"
        :kicker="content.kicker"
        :title="content.title"
        :title-id="titleId"
        :lead="content.lead"
      />

      <figure class="squad__photo">
        <div class="squad__frame">
          <NuxtPicture
            :src="content.teamPhoto.src"
            :width="content.teamPhoto.width"
            :height="content.teamPhoto.height"
            :alt="content.teamPhoto.alt"
            format="avif,webp"
            sizes="100vw xl:1280px"
            loading="lazy"
            decoding="async"
            :img-attrs="{ class: 'squad__img', style: { objectPosition: content.teamPhoto.focal } }"
          />
          <ul class="squad__tags" role="list" aria-hidden="true">
            <li
              v-for="tag in tags"
              :key="tag.id"
              class="squad__tag"
              :style="{ left: `${tag.x * 100}%` }"
            >
              <span class="squad__tag-number club-number">{{ tag.number }}</span>
              <span class="squad__tag-name">{{ tag.name }}</span>
            </li>
          </ul>
        </div>
        <figcaption class="club-note">{{ content.teamCaption }}</figcaption>
      </figure>

      <ul class="squad__cards" role="list">
        <li v-for="coach in content.coaches" :key="coach.id" class="squad__card">
          <ClubCoachCard
            :coach="coach"
            :season="club.season.label"
            :sessions="sessionsOf(coach.id)"
            :labels="content"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.squad__photo {
  display: grid;
  gap: var(--space-12);
  margin-block-start: var(--header-gap);
}

.squad__frame {
  position: relative;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.squad__frame :deep(.squad__img) {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 2880 / 1222;
  object-fit: cover;
}

.squad__tags {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.squad__tag {
  position: absolute;
  inset-block-end: 3%;
  display: none;
  gap: 0.375rem;
  align-items: center;
  padding: 0.25rem 0.75rem 0.25rem 0.375rem;
  border-radius: var(--radius-pill);
  background: var(--kit-white);
  color: var(--pitch-950);
  translate: -50% 0;
  box-shadow: var(--shadow-card);
}

.squad__tag-number {
  display: grid;
  place-items: center;
  min-inline-size: 1.75rem;
  block-size: 1.75rem;
  border-radius: 50%;
  background: var(--pitch-800);
  color: var(--kit-white);
  font-size: 1rem;
}

.squad__tag-name {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 800;
  font-stretch: var(--stretch-semi);
  text-transform: uppercase;
}

@media (min-width: 48rem) {
  .squad__tag {
    display: inline-flex;
  }
}

/* ── Les cartes : un rail sur mobile, cinq colonnes sur grand écran ──────── */
.squad__cards {
  display: grid;
  grid-auto-columns: min(72vw, 18rem);
  grid-auto-flow: column;
  gap: var(--gap);
  margin-block-start: var(--block-gap);
  margin-inline: calc(-1 * var(--page-gutter));
  padding: var(--space-8) var(--page-gutter) var(--space-32);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-padding-inline: var(--page-gutter);
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.squad__card {
  scroll-snap-align: start;
}

@media (min-width: 64rem) {
  .squad__cards {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-auto-flow: row;
    margin-inline: 0;
    padding-inline: 0;
    overflow: visible;
  }
}
</style>
