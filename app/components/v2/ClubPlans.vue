<script setup lang="ts">
import { club } from '~/data/club';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

/**
 * Abonnements : trois cartes de saison à talon détachable.
 *
 * La bascule « Au mois / À la saison » est un groupe de boutons radio natifs ;
 * tout le reste suit en CSS (:has), donc sans JS aussi : les prix roulent d'un
 * cran sur leur tambour, le total de la saison apparaît, et le macaron
 * « 2 mois offerts » se pose sur chaque carte. Les lecteurs d'écran lisent le
 * prix courant (texte masqué qui suit le même sélecteur), pas le tambour.
 */
const titleId = 'abonnements-titre';
const content = club.plans;
const total = (plan: (typeof content.items)[number]) =>
  content.seasonalTotal.replace('{total}', String(plan.seasonal * 12));

const root = useTemplateRef<HTMLElement>('root');
useMotion(root, ({ gsap, ScrollTrigger }, element) => {
  const cards = element.querySelectorAll('.ticket__card');
  if (!cards.length || reached(cards[0]!, 'bottom')) return undefined;
  gsap.set(cards, { opacity: 0, y: length('--move-xl') });
  ScrollTrigger.create({
    trigger: cards[0],
    ...ENTRY,
    onEnter: () =>
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: duration('--dur-focal'),
        stagger: capped(stagger('--stagger-lines')),
      }),
  });
  return undefined;
});
</script>

<template>
  <section
    id="abonnements"
    ref="root"
    class="club-section plans"
    data-surface="mist"
    :aria-labelledby="titleId"
  >
    <div class="container">
      <ClubSectionHead
        :number="7"
        :kicker="content.kicker"
        :title="content.title"
        :title-id="titleId"
        :lead="content.lead"
      />

      <fieldset class="cycle">
        <legend class="visually-hidden">{{ content.cycle }}</legend>
        <label class="cycle__option">
          <input class="cycle__radio" type="radio" name="formule" value="mois" checked />
          <span>{{ content.monthly }}</span>
        </label>
        <label class="cycle__option">
          <input
            id="formule-saison"
            class="cycle__radio"
            type="radio"
            name="formule"
            value="saison"
          />
          <span>{{ content.seasonal }}</span>
        </label>
        <span class="cycle__badge club-label">{{ content.badge }}</span>
      </fieldset>

      <ul class="plans__list" role="list">
        <li
          v-for="plan in content.items"
          :key="plan.id"
          class="ticket"
          :class="{ 'ticket--featured': plan.featured }"
        >
          <article
            class="ticket__card"
            :data-surface="plan.featured ? 'pitch' : undefined"
            :aria-labelledby="`formule-${plan.id}`"
          >
            <header class="ticket__head">
              <p class="ticket__kind club-label">
                <span class="ticket__crest"><ClubCrest /></span>
                {{ content.stub }}
              </p>
              <p v-if="plan.featured" class="ticket__featured club-label">{{ content.featured }}</p>
              <h3 :id="`formule-${plan.id}`" class="ticket__name">{{ plan.name }}</h3>
              <p class="ticket__pitch">{{ plan.pitch }}</p>
            </header>

            <div class="ticket__price">
              <span class="ticket__sticker club-label" aria-hidden="true">{{ content.badge }}</span>
              <p class="ticket__amount">
                <span class="ticket__drum club-number" aria-hidden="true">
                  <span class="ticket__digits">
                    <span>{{ plan.monthly }}</span>
                    <span>{{ plan.seasonal }}</span>
                  </span>
                </span>
                <span class="ticket__unit" aria-hidden="true">{{ content.perMonth }}</span>
                <span class="visually-hidden ticket__said ticket__said--month">
                  {{ plan.monthly }} {{ content.perMonth }}, {{ content.monthlyNote }}
                </span>
                <span class="visually-hidden ticket__said ticket__said--season">
                  {{ plan.seasonal }} {{ content.perMonth }}, {{ total(plan) }}
                </span>
              </p>
              <p class="ticket__terms" aria-hidden="true">
                <span class="ticket__term ticket__term--month">{{ content.monthlyNote }}</span>
                <span class="ticket__term ticket__term--season">{{ total(plan) }}</span>
              </p>
            </div>

            <ul class="ticket__perks" role="list">
              <li v-for="perk in plan.perks" :key="perk">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                {{ perk }}
              </li>
            </ul>

            <footer class="ticket__stub">
              <p class="ticket__serial club-number" aria-hidden="true">
                {{ club.season.label }} · N°
                {{ String(content.items.indexOf(plan) + 1).padStart(4, '0') }}
              </p>
              <a
                class="club-action"
                :class="{ 'club-action--outline': !plan.featured }"
                href="#essai"
              >
                {{ content.choose.replace('{name}', plan.name) }}
              </a>
            </footer>
          </article>
        </li>
      </ul>
      <p class="club-note plans__note">{{ content.note }}</p>
    </div>
  </section>
</template>

<style scoped>
/* Le macaron agrandi (état caché) ne doit pas élargir la page. */
.plans {
  overflow-x: clip;
}

/* ── Bascule mois / saison ───────────────────────────────────────────────── */
.cycle {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  align-items: center;
  margin: var(--header-gap) 0 0;
  padding: 0;
  border: 0;
}

.cycle__option {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-block-size: 3rem;
  padding: 0.5rem 1.25rem;
  border: var(--line-pitch) solid var(--pitch-800);
  border-radius: var(--radius-pill);
  color: var(--pitch-800);
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color var(--dur-state) var(--ease-out-soft),
    color var(--dur-state) var(--ease-out-soft);
}

.cycle__radio {
  position: absolute;
  inset: 0;
  margin: 0;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}

.cycle__option:has(.cycle__radio:checked) {
  background: var(--pitch-800);
  color: var(--kit-white);
}

.cycle__option:has(.cycle__radio:focus-visible) {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
}

/* Le macaron : il ne signale que ce qui change. */
.cycle__badge {
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-pill);
  background: var(--canary-400);
  color: var(--pitch-950);
  opacity: 0;
  scale: 0.6;
  rotate: -6deg;
  transition:
    opacity var(--dur-state) var(--ease-out-soft),
    scale var(--dur-strike) var(--ease-strike);
}

.plans:has(#formule-saison:checked) .cycle__badge {
  opacity: 1;
  scale: 1;
}

/* ── Les cartes de saison ────────────────────────────────────────────────── */
.plans__list {
  display: grid;
  gap: var(--space-40) var(--gap);
  margin-block-start: var(--space-40);
}

.ticket {
  --notch: 0.875rem;
  --stub-bg: var(--mist-100);

  position: relative;
  display: grid;
}

.ticket__card {
  position: relative;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: var(--space-20);
  padding: var(--space-24) var(--space-24) 0;
  border-radius: var(--radius-card);
  background: var(--kit-white);
  box-shadow: var(--shadow-card);
}

.ticket--featured .ticket__card {
  background: var(--pitch-800);
  box-shadow: var(--shadow-lift);
}

.ticket__head {
  display: grid;
  gap: var(--space-8);
  padding-block-end: var(--space-20);
  border-block-end: var(--line-pitch) solid var(--accent);
}

.ticket__kind {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color: var(--ink-secondary);
  font-size: 0.75rem;
}

.ticket__crest {
  display: block;
  flex: none;
  aspect-ratio: 64 / 76;
  block-size: 1.375rem;
}

.ticket__featured {
  position: absolute;
  inset-block-start: var(--space-24);
  inset-inline-end: var(--space-24);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  background: var(--canary-400);
  color: var(--pitch-950);
  font-size: 0.75rem;
}

.ticket__name {
  font-size: clamp(2.25rem, 1.8rem + 1.5vw, 3rem);
  font-weight: 900;
  line-height: 0.95;
}

.ticket__pitch {
  color: var(--ink-secondary);
}

/* Le prix sur son tambour : un cran vers le haut à la saison. */
.ticket__amount {
  display: flex;
  gap: 0.375rem;
  align-items: flex-end;
}

.ticket__drum {
  display: block;
  block-size: 1em;
  overflow: hidden;
  color: var(--accent);
  font-size: clamp(4.5rem, 3.5rem + 3vw, 6rem);
  line-height: 1;
}

.ticket__digits {
  display: grid;
  justify-items: end;
  transition: translate var(--dur-overlay) var(--ease-strike);
}

.ticket__digits > span {
  display: block;
  block-size: 1em;
}

.plans:has(#formule-saison:checked) .ticket__digits {
  translate: 0 -1em;
}

.ticket:nth-child(2) .ticket__digits {
  transition-delay: 60ms;
}

.ticket:nth-child(3) .ticket__digits {
  transition-delay: 120ms;
}

.ticket__unit {
  padding-block-end: 0.5rem;
  color: var(--ink-secondary);
  font-family: var(--font-display);
  font-weight: 700;
  font-stretch: var(--stretch-semi);
}

.ticket__terms {
  color: var(--ink-secondary);
  font-size: var(--text-label);
}

.ticket__term--season,
.ticket__said--season {
  display: none;
}

.plans:has(#formule-saison:checked) .ticket__term--season,
.plans:has(#formule-saison:checked) .ticket__said--season {
  display: inline;
}

.plans:has(#formule-saison:checked) .ticket__term--month,
.plans:has(#formule-saison:checked) .ticket__said--month {
  display: none;
}

.ticket__perks {
  display: grid;
  gap: var(--space-12);
  align-content: start;
}

.ticket__perks li {
  display: grid;
  grid-template-columns: 1.25rem 1fr;
  gap: var(--space-8);
}

.ticket__perks svg {
  inline-size: 1.25rem;
  block-size: 1.25rem;
  margin-block-start: 0.125rem;
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Le talon, séparé par une ligne perforée et deux encoches. */
.ticket__stub {
  position: relative;
  display: grid;
  gap: var(--space-16);
  margin-inline: calc(-1 * var(--space-24));
  padding: var(--space-24);
  border-block-start: 2px dashed var(--rule);
}

.ticket__stub::before,
.ticket__stub::after {
  position: absolute;
  inset-block-start: calc(-1 * var(--notch) - 1px);
  inline-size: calc(2 * var(--notch));
  block-size: calc(2 * var(--notch));
  border-radius: 50%;
  background: var(--stub-bg);
  content: '';
}

.ticket__stub::before {
  inset-inline-start: calc(-1 * var(--notch));
}

.ticket__stub::after {
  inset-inline-end: calc(-1 * var(--notch));
}

.ticket__serial {
  color: var(--ink-secondary);
  font-size: 1rem;
  letter-spacing: 0.06em;
}

.ticket__stub .club-action {
  inline-size: 100%;
}

/* Le macaron posé sur la carte, à côté du prix, quand on passe à la saison. */
.ticket__price {
  position: relative;
}

.ticket__sticker {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: 0;
  translate: 0 -50%;
  z-index: 1;
  display: grid;
  place-items: center;
  inline-size: 5.5rem;
  block-size: 5.5rem;
  padding: 0.5rem;
  border: 3px solid var(--kit-white);
  border-radius: 50%;
  background: var(--canary-400);
  color: var(--pitch-950);
  font-size: 0.75rem;
  line-height: 1.1;
  text-align: center;
  box-shadow: var(--shadow-card);
  opacity: 0;
  scale: 1.6;
  rotate: 12deg;
  pointer-events: none;
}

.plans:has(#formule-saison:checked) .ticket__sticker {
  opacity: 1;
  scale: 1;
  rotate: -8deg;
}

html.has-motion .ticket__sticker {
  transition:
    opacity var(--dur-press) linear,
    scale var(--dur-strike) var(--ease-strike),
    rotate var(--dur-strike) var(--ease-strike);
}

html.has-motion .plans:has(#formule-saison:checked) .ticket:nth-child(2) .ticket__sticker {
  transition-delay: 80ms;
}

html.has-motion .plans:has(#formule-saison:checked) .ticket:nth-child(3) .ticket__sticker {
  transition-delay: 160ms;
}

html:not(.has-motion) .ticket__digits {
  transition: none;
}

@media (min-width: 64rem) {
  .plans__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
  }

  .ticket--featured {
    translate: 0 calc(-1 * var(--space-16));
  }
}

.plans__note {
  margin-block-start: var(--space-32);
}
</style>
