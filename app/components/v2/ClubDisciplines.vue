<script setup lang="ts">
import { club } from '~/data/club';
import { FINE_POINTER } from '~/motion/env';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';
import type { DisciplineId } from '~/types/club';

/**
 * Six disciplines. Deux présentations d'un même contenu :
 * - par défaut (mobile, tablette, sans JS) : des cartes, photo comprise ;
 * - sur ordinateur, une fois l'app montée : la liste pilote une grande photo
 *   (onglets verticaux, motif APG : flèches, Début, Fin ; activation au focus,
 *   et au survol avec un court délai d'intention sur pointeur fin).
 * La bascule se fait au montage, sous le pli : rien ne bouge à l'écran.
 *
 * « Voir les créneaux » mène au calendrier, filtré sur la discipline.
 */
const titleId = 'disciplines-titre';
const content = club.disciplines;
const items = content.items;

const DESKTOP = '(min-width: 64rem)';
const tabs = ref(false);
const active = ref(0);
const filter = useState<DisciplineId | 'all'>('club-filter', () => 'all');

let media: MediaQueryList | undefined;
const sync = () => {
  tabs.value = Boolean(media?.matches);
};
onMounted(() => {
  media = matchMedia(DESKTOP);
  sync();
  media.addEventListener('change', sync);
});
onBeforeUnmount(() => media?.removeEventListener('change', sync));

const tabId = (index: number) => `discipline-onglet-${index}`;
const panelId = 'discipline-panneau';
const tabRefs = ref<HTMLButtonElement[]>([]);

function select(index: number, focus = false) {
  active.value = (index + items.length) % items.length;
  if (focus) tabRefs.value[active.value]?.focus();
}

function onKey(event: KeyboardEvent, index: number) {
  const moves: Record<string, number> = {
    ArrowDown: index + 1,
    ArrowRight: index + 1,
    ArrowUp: index - 1,
    ArrowLeft: index - 1,
    Home: 0,
    End: items.length - 1,
  };
  const target = moves[event.key];
  if (target === undefined) return;
  event.preventDefault();
  select(target, true);
}

/** Survol : on change de photo après un court arrêt, pas en traversant la liste. */
let intent: ReturnType<typeof setTimeout> | undefined;
function onHover(index: number) {
  if (!matchMedia(FINE_POINTER).matches) return;
  clearTimeout(intent);
  intent = setTimeout(() => select(index), 110);
}
const cancelHover = () => clearTimeout(intent);
onBeforeUnmount(cancelHover);

const showSessions = (id: DisciplineId) => {
  filter.value = id;
};

const current = computed(() => items[active.value] ?? items[0]!);
const count = (id: DisciplineId) =>
  club.schedule.sessions.filter((s) => s.discipline === id).length;

const root = useTemplateRef<HTMLElement>('root');
useMotion(root, ({ gsap, ScrollTrigger }, element) => {
  const cards = element.querySelectorAll('.disc-card');
  if (!cards.length || reached(cards[0]!, 'bottom')) return undefined;
  gsap.set(cards, { opacity: 0, y: length('--move-l') });
  ScrollTrigger.create({
    trigger: cards[0],
    ...ENTRY,
    onEnter: () =>
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: duration('--dur-focal'),
        stagger: capped(stagger('--stagger-list')),
      }),
  });
  return undefined;
});
</script>

<template>
  <section id="disciplines" ref="root" class="club-section disciplines" :aria-labelledby="titleId">
    <div class="container">
      <ClubSectionHead
        :number="4"
        :title="content.title"
        :title-id="titleId"
        :lead="content.lead"
      />

      <!-- Ordinateur, app montée : la liste pilote la photo. -->
      <div v-if="tabs" class="stage" @pointerleave="cancelHover">
        <div
          class="stage__tabs"
          role="tablist"
          aria-orientation="vertical"
          :aria-labelledby="titleId"
        >
          <button
            v-for="(item, index) in items"
            :id="tabId(index)"
            :key="item.id"
            ref="tabRefs"
            class="stage__tab"
            type="button"
            role="tab"
            :aria-selected="index === active"
            :aria-controls="panelId"
            :tabindex="index === active ? 0 : -1"
            @click="select(index)"
            @focus="select(index)"
            @keydown="onKey($event, index)"
            @pointerenter="onHover(index)"
          >
            <span class="stage__number club-number" aria-hidden="true">{{
              String(index + 1).padStart(2, '0')
            }}</span>
            <span class="stage__name">{{ item.name }}</span>
            <span class="stage__tagline">{{ item.tagline }}</span>
          </button>
        </div>

        <div
          :id="panelId"
          class="stage__panel"
          role="tabpanel"
          :aria-labelledby="tabId(active)"
          tabindex="0"
        >
          <div class="stage__photos">
            <NuxtPicture
              v-for="(item, index) in items"
              :key="item.id"
              :src="item.image.src"
              :width="item.image.width"
              :height="item.image.height"
              :alt="index === active ? item.image.alt : ''"
              format="avif,webp"
              sizes="lg:620px"
              loading="lazy"
              decoding="async"
              :class="['stage__photo', { 'stage__photo--active': index === active }]"
              :img-attrs="{ class: 'stage__img', style: { objectPosition: item.image.focal } }"
            />
          </div>
          <div class="stage__card">
            <p class="stage__count club-label">{{ count(current.id) }} {{ club.squad.perWeek }}</p>
            <p class="stage__description">{{ current.description }}</p>
            <ul class="stage__facts" role="list">
              <li v-for="fact in current.facts" :key="fact">{{ fact }}</li>
            </ul>
            <a
              class="club-action club-action--small"
              href="#calendrier"
              @click="showSessions(current.id)"
            >
              {{ content.cta }}
            </a>
          </div>
        </div>
      </div>

      <!-- Par défaut : cartes. -->
      <ol v-else class="cards" role="list">
        <li v-for="(item, index) in items" :key="item.id" class="disc-card">
          <div class="disc-card__photo">
            <NuxtPicture
              :src="item.image.src"
              :width="item.image.width"
              :height="item.image.height"
              :alt="item.image.alt"
              format="avif,webp"
              sizes="100vw sm:50vw lg:400px"
              loading="lazy"
              decoding="async"
              :img-attrs="{ class: 'disc-card__img', style: { objectPosition: item.image.focal } }"
            />
            <span class="disc-card__number club-number" aria-hidden="true">{{
              String(index + 1).padStart(2, '0')
            }}</span>
          </div>
          <div class="disc-card__body">
            <h3 class="disc-card__name">{{ item.name }}</h3>
            <p class="disc-card__tagline">{{ item.tagline }}</p>
            <p class="disc-card__description">{{ item.description }}</p>
            <ul class="disc-card__facts" role="list">
              <li v-for="fact in item.facts" :key="fact">{{ fact }}</li>
            </ul>
            <a class="disc-card__link" href="#calendrier" @click="showSessions(item.id)">
              {{ content.cta }}<span class="visually-hidden"> : {{ item.name }}</span>
            </a>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* ── Cartes ──────────────────────────────────────────────────────────────── */
.cards {
  display: grid;
  gap: var(--gap);
  margin-block-start: var(--header-gap);
}

.disc-card {
  display: grid;
  grid-template-rows: auto 1fr;
  border-radius: var(--radius-card);
  background: var(--mist-100);
  overflow: hidden;
}

.disc-card__photo {
  position: relative;
}

.disc-card__photo :deep(.disc-card__img) {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.disc-card__number {
  position: absolute;
  inset-block-start: var(--space-12);
  inset-inline-start: var(--space-12);
  display: grid;
  place-items: center;
  min-inline-size: 2.5rem;
  block-size: 2rem;
  border-radius: 6px;
  background: var(--pitch-800);
  color: var(--kit-white);
  font-size: 1.125rem;
}

.disc-card__body {
  display: grid;
  gap: var(--space-8);
  align-content: start;
  padding: var(--space-20) var(--space-20) var(--space-24);
}

.disc-card__name {
  font-size: var(--text-subheading);
  line-height: 1;
}

.disc-card__tagline {
  color: var(--pitch-800);
  font-weight: 600;
}

.disc-card__description {
  color: var(--ink-secondary);
}

.disc-card__facts,
.stage__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  margin-block: var(--space-8);
}

.disc-card__facts li,
.stage__facts li {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  background: var(--kit-white);
  font-size: var(--text-label);
}

.disc-card__link {
  justify-self: start;
  min-block-size: 2.75rem;
  padding-block: 0.625rem;
  color: var(--pitch-800);
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.04em;
  text-decoration: underline;
  text-decoration-color: var(--canary-600);
  text-decoration-thickness: var(--line-pitch);
  text-underline-offset: 0.35em;
  text-transform: uppercase;
}

@media (min-width: 40rem) {
  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ── La liste pilote la photo (ordinateur) ────────────────────────────────── */
.stage {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--gap);
  margin-block-start: var(--header-gap);
}

.stage__tabs {
  grid-column: 1 / span 5;
  display: grid;
  align-content: start;
  border-block-start: var(--line-pitch) solid var(--pitch-800);
}

.stage__tab {
  position: relative;
  display: grid;
  grid-template-columns: 3rem 1fr;
  gap: 0.125rem var(--space-16);
  align-items: baseline;
  padding: var(--space-16) var(--space-16) var(--space-16) 0;
  border: 0;
  border-block-end: 1px solid var(--rule);
  background: none;
  color: var(--ink);
  text-align: start;
  cursor: pointer;
  transition: padding-inline-start var(--dur-state) var(--ease-out);
}

/* La bande canari du maillot marque l'onglet choisi. */
.stage__tab::before {
  position: absolute;
  inset-block: -1px;
  inset-inline-start: -0.75rem;
  inline-size: 0.375rem;
  border-radius: 3px;
  background: var(--canary-400);
  content: '';
  scale: 1 0;
  transition: scale var(--dur-state) var(--ease-strike);
}

.stage__tab[aria-selected='true']::before {
  scale: 1 1;
}

.stage__tab[aria-selected='true'] {
  padding-inline-start: var(--space-12);
}

.stage__number {
  grid-row: span 2;
  color: var(--ink-muted);
  font-size: 1.75rem;
  line-height: 1;
  transition: color var(--dur-state) var(--ease-out-soft);
}

.stage__tab[aria-selected='true'] .stage__number {
  color: var(--pitch-800);
}

.stage__name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1rem + 1vw, 2rem);
  font-weight: 800;
  font-stretch: var(--stretch-wide);
  line-height: 1;
  text-transform: uppercase;
}

.stage__tagline {
  color: var(--ink-secondary);
  font-size: var(--text-label);
}

.stage__panel {
  grid-column: 6 / -1;
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-self: start;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-lift);
}

.stage__photos {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  aspect-ratio: 3 / 2;
  overflow: hidden;
}

.stage__photo {
  grid-area: 1 / 1;
  min-block-size: 0;
  opacity: 0;
  transition: opacity var(--dur-layout) var(--ease-out-soft);
}

.stage__photo--active {
  opacity: 1;
}

.stage__photos :deep(.stage__img) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

html.has-motion .stage__photo--active :deep(.stage__img) {
  animation: stage-settle var(--dur-focal) var(--ease-out) both;
}

@keyframes stage-settle {
  from {
    scale: 1.04;
  }
}

.stage__card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-8) var(--space-24);
  align-items: end;
  padding: var(--space-24) var(--space-24) var(--space-24);
  background: var(--mist-100);
}

.stage__card > :not(.club-action) {
  grid-column: 1;
}

.stage__card > .club-action {
  grid-column: 2;
  grid-row: 1 / span 3;
  align-self: end;
}

.stage__count {
  color: var(--pitch-800);
}

.stage__description {
  color: var(--ink);
}

.stage__panel:focus-visible {
  outline-offset: 4px;
}
</style>
