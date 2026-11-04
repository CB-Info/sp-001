<script setup lang="ts">
import { club } from '~/data/club';

/**
 * Questions : accordéon natif (<details name>), exclusif dans les navigateurs
 * qui le gèrent, ouvrable sans JS partout. Le signe « + » bascule d'un quart de
 * tour à l'ouverture.
 */
const titleId = 'questions-titre';
const content = club.faq;
</script>

<template>
  <section id="questions" class="club-section faq" :aria-labelledby="titleId">
    <div class="container faq__grid">
      <ClubSectionHead
        :number="10"
        :kicker="content.kicker"
        :title="content.title"
        :title-id="titleId"
      />
      <div class="faq__list">
        <details
          v-for="(item, index) in content.items"
          :key="item.question"
          class="faq__item"
          name="questions"
        >
          <summary class="faq__question">
            <span class="faq__number club-number" aria-hidden="true">{{
              String(index + 1).padStart(2, '0')
            }}</span>
            <span class="faq__label">{{ item.question }}</span>
            <span class="faq__sign" aria-hidden="true" />
          </summary>
          <p class="faq__answer">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq__grid {
  display: grid;
  gap: var(--header-gap) var(--gap);
}

.faq__list {
  border-block-start: var(--line-pitch) solid var(--pitch-800);
}

.faq__item {
  border-block-end: 1px solid var(--rule);
}

.faq__question {
  display: grid;
  grid-template-columns: 2.5rem 1fr 2.75rem;
  gap: var(--space-12);
  align-items: center;
  min-block-size: 4rem;
  padding-block: var(--space-16);
  cursor: pointer;
  list-style: none;
}

.faq__question::-webkit-details-marker {
  display: none;
}

.faq__number {
  color: var(--ink-muted);
  font-size: 1.375rem;
}

.faq__label {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
}

.faq__sign {
  position: relative;
  display: grid;
  place-items: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border: var(--line-pitch) solid var(--pitch-800);
  border-radius: 50%;
  transition:
    background-color var(--dur-state) var(--ease-out-soft),
    rotate var(--dur-layout) var(--ease-strike);
}

.faq__sign::before,
.faq__sign::after {
  position: absolute;
  inline-size: 0.875rem;
  block-size: var(--line-pitch);
  background: var(--pitch-800);
  content: '';
  transition: background-color var(--dur-state) var(--ease-out-soft);
}

.faq__sign::after {
  rotate: 90deg;
}

.faq__item[open] .faq__sign {
  background: var(--pitch-800);
  rotate: 135deg;
}

.faq__item[open] .faq__sign::before,
.faq__item[open] .faq__sign::after {
  background: var(--canary-400);
}

.faq__question:hover .faq__sign {
  background: var(--mist-200);
}

.faq__item[open] .faq__question:hover .faq__sign {
  background: var(--pitch-900);
}

.faq__answer {
  max-inline-size: 44rem;
  padding: 0 3.25rem var(--space-24) 3.25rem;
  color: var(--ink-secondary);
}

html.has-motion .faq__item[open] .faq__answer {
  animation: faq-open var(--dur-layout) var(--ease-out) both;
}

@keyframes faq-open {
  from {
    opacity: 0;
    translate: 0 calc(-1 * var(--move-s));
  }
}

@media (min-width: 64rem) {
  .faq__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .faq__grid > :first-child {
    grid-column: 1 / span 4;
    align-self: start;
    position: sticky;
    inset-block-start: calc(var(--header-height-compact) + var(--space-32));
  }

  .faq__list {
    grid-column: 6 / -1;
  }
}

@media (forced-colors: active) {
  .faq__sign::before,
  .faq__sign::after {
    background: CanvasText;
  }
}
</style>
