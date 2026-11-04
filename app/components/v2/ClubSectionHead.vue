<script setup lang="ts">
import { ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

/**
 * Tête de section du club : le titre en Saira large, précédé de son numéro de
 * programme (un écusson de numéro, comme sur une feuille de match), puis le
 * texte d'appui. Pas de surtitre : le titre porte la section. Le numéro est un
 * décor (aria-hidden) : le nom du titre reste « La semaine du club ».
 */
withDefaults(
  defineProps<{
    number: number;
    title: string;
    titleId: string;
    lead?: string;
    align?: 'start' | 'center';
  }>(),
  { lead: undefined, align: 'start' },
);

/*
 * Entrée : le titre arrive un peu grand et se tasse, comme un flocage (même
 * geste que le hero, en plus court), puis son numéro se pose.
 */
const root = useTemplateRef<HTMLElement>('root');
useMotion(root, ({ gsap, ScrollTrigger }, element) => {
  if (reached(element, 'bottom')) return undefined;
  const badge = element.querySelector('.head__number');
  const title = element.querySelector('.head__title');
  const lead = element.querySelector('.head__lead');
  gsap.set(badge, { opacity: 0, scale: 0.6 });
  gsap.set(title, { opacity: 0, scale: 1.05, transformOrigin: '0% 100%' });
  if (lead) gsap.set(lead, { opacity: 0, y: length('--move-s') });
  ScrollTrigger.create({
    trigger: element,
    ...ENTRY,
    onEnter: () => {
      const timeline = gsap.timeline();
      timeline
        .to(title, { opacity: 1, scale: 1, duration: duration('--dur-overlay'), ease: 'strike' })
        .to(
          badge,
          { opacity: 1, scale: 1, duration: duration('--dur-strike'), ease: 'strike' },
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
    <h2 :id="titleId" class="head__title">
      <span class="head__number club-number" aria-hidden="true">{{
        String(number).padStart(2, '0')
      }}</span>
      {{ title }}
    </h2>
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

/* Le numéro de programme : un écusson plein dans la première ligne du titre. */
.head__number {
  display: inline-grid;
  place-items: center;
  min-inline-size: 1.6em;
  block-size: 1.15em;
  margin-inline-end: 0.3em;
  padding-inline: 0.18em;
  border-radius: 0.16em;
  background: var(--accent);
  color: var(--bg);
  font-size: 0.5em;
  letter-spacing: 0.02em;
  line-height: 1;
  vertical-align: 0.38em;
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
