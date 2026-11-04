<script setup lang="ts">
import { ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

/**
 * Tête de section du club : numéro de programme (un écusson de numéro, comme
 * sur une feuille de match), libellé, titre en Saira large, texte d'appui.
 * Le numéro est un décor : le titre suffit aux lecteurs d'écran.
 */
withDefaults(
  defineProps<{
    number: number;
    kicker: string;
    title: string;
    titleId: string;
    lead?: string;
    align?: 'start' | 'center';
  }>(),
  { lead: undefined, align: 'start' },
);

/*
 * Entrée : le numéro se pose, puis le titre arrive un peu grand et se tasse,
 * comme un flocage (même geste que le hero, en plus court).
 */
const root = useTemplateRef<HTMLElement>('root');
useMotion(root, ({ gsap, ScrollTrigger }, element) => {
  if (reached(element, 'bottom')) return undefined;
  const kicker = element.querySelector('.head__kicker');
  const title = element.querySelector('.head__title');
  const lead = element.querySelector('.head__lead');
  gsap.set(kicker, { opacity: 0, x: -length('--move-s') });
  gsap.set(title, { opacity: 0, scale: 1.05, transformOrigin: '0% 100%' });
  if (lead) gsap.set(lead, { opacity: 0, y: length('--move-s') });
  ScrollTrigger.create({
    trigger: element,
    ...ENTRY,
    onEnter: () => {
      const timeline = gsap.timeline();
      timeline
        .to(kicker, { opacity: 1, x: 0, duration: duration('--dur-layout') })
        .to(
          title,
          { opacity: 1, scale: 1, duration: duration('--dur-overlay'), ease: 'strike' },
          stagger('--stagger-lines'),
        );
      if (lead)
        timeline.to(lead, { opacity: 1, y: 0, duration: duration('--dur-layout') }, '<+=0.12');
    },
  });
  return undefined;
});
</script>

<template>
  <header ref="root" class="head" :class="`head--${align}`">
    <p class="head__kicker club-label">
      <span class="head__number club-number" aria-hidden="true">{{
        String(number).padStart(2, '0')
      }}</span>
      {{ kicker }}
    </p>
    <h2 :id="titleId" class="head__title">{{ title }}</h2>
    <p v-if="lead" class="head__lead">{{ lead }}</p>
    <slot />
  </header>
</template>

<style scoped>
.head {
  display: grid;
  gap: var(--space-16);
  justify-items: start;
  max-inline-size: 52rem;
}

.head--center {
  justify-items: center;
  margin-inline: auto;
  text-align: center;
}

.head__kicker {
  display: inline-flex;
  gap: 0.625rem;
  align-items: center;
  color: var(--accent-ink);
}

/* Le numéro de programme : un petit écusson plein, couleur de la surface. */
.head__number {
  display: inline-grid;
  place-items: center;
  min-inline-size: 2.125rem;
  block-size: 1.75rem;
  padding-inline: 0.375rem;
  border-radius: 6px;
  background: var(--accent);
  color: var(--bg);
  font-size: 1rem;
  letter-spacing: 0.02em;
}

.head__title {
  font-size: var(--text-display);
  font-weight: 800;
  line-height: var(--leading-heading);
  letter-spacing: var(--tracking-display);
  text-wrap: balance;
}

.head__lead {
  max-inline-size: 38rem;
  color: var(--ink-secondary);
  font-size: var(--text-lead);
  line-height: 1.5;
}
</style>
