<script setup lang="ts">
import '~/assets/css/v2.css';
import { club } from '~/data/club';

/**
 * Direction B « Le Club » : CLUSEM traité comme un club sportif, en plein jour
 * et en couleurs de club. Brief : docs/brief/v2.md ; analyse de la V1 qui en
 * fait le contrepoint : docs/v2/analyse-v1.md.
 *
 * <html data-site="v2"> active les tokens de la V2 (app/assets/css/v2.css) : mêmes
 * rôles que la V1, autres valeurs, lus aussi par le JS du mouvement. La V1 et la
 * V2 ne se lient que par des liens pleine page : chacune charge les siens.
 */
useSeoMeta({
  title: club.meta.title,
  description: club.meta.description,
  ogTitle: club.meta.title,
  ogDescription: club.meta.description,
  ogLocale: 'fr_FR',
  ogType: 'website',
});

useHead({
  // data-intro-font : l'intro du hero attend Saira (boot.inline.js), au plus 1,2 s.
  htmlAttrs: { 'data-site': 'v2', 'data-intro-font': '800 1em Saira' },
  meta: [{ name: 'theme-color', content: '#0f5233' }],
  link: [
    // Le titre du hero est l'élément LCP (pas de photo) : sa police part dès le HTML.
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/saira-latin-standard-normal.woff2',
      crossorigin: '',
    },
  ],
});

const disciplines = club.disciplines.items;
const coaches = club.squad.coaches;
const sessions = club.schedule.sessions;
</script>

<template>
  <div id="haut" class="club-page">
    <a class="club-skip" href="#contenu">{{ club.ui.skipLink }}</a>
    <ClubHeader :name="club.name" :nav="club.nav" :cta="club.cta" :labels="club.ui" />
    <main id="contenu" tabindex="-1">
      <ClubHero
        :content="club.hero"
        :season="club.season"
        :sessions="sessions"
        :disciplines="disciplines"
        :coaches="coaches"
      />
      <ClubStats />
      <ClubMethod />
      <ClubDisciplines />
      <ClubSchedule />
      <ClubSquad />
      <ClubPlans />
      <ClubTribune />
      <ClubScarf />
      <ClubFaq />
      <ClubHouse />
      <ClubTrial />
    </main>
    <ClubFooter />
  </div>
</template>

<style scoped>
.club-page {
  background: var(--bg);
}

main:focus {
  outline: none;
}

.club-skip {
  position: fixed;
  inset-block-start: var(--space-12);
  inset-inline-start: var(--space-12);
  z-index: 100;
  padding: var(--space-12) var(--space-20);
  border-radius: var(--radius-pill);
  background: var(--canary-400);
  color: var(--pitch-950);
  font-family: var(--font-display);
  font-weight: 800;
  text-transform: uppercase;
  translate: 0 -200%;
}

.club-skip:focus-visible {
  translate: 0 0;
}
</style>
