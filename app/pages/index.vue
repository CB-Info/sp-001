<script setup lang="ts">
import { home } from '~/data/home';

useSeoMeta({
  title: home.meta.title,
  description: home.meta.description,
  ogTitle: home.meta.title,
  ogDescription: home.meta.description,
  ogLocale: 'fr_FR',
  ogType: 'website',
});

useHead({
  meta: [{ name: 'theme-color', content: '#600305' }],
  link: [
    // Le H1 du hero est l'élément LCP : sa police (Tektur, sous-ensemble latin) part
    // dès le HTML au lieu d'attendre la découverte de la feuille de style.
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/tektur-latin-wght-normal.woff2',
      crossorigin: '',
    },
  ],
});

const coaches = home.why.coaches;
</script>

<template>
  <div id="haut" class="page">
    <SkipLink />
    <SiteHeader :nav="home.nav" :socials="home.footer.socials" :note="home.footer.disclaimer" />
    <main id="contenu" tabindex="-1">
      <HeroSection :content="home.hero" />
      <AboutSection :content="home.about" />
      <ServicesSection :content="home.services" />
      <ProgramsSection :content="home.programs" :coaches="coaches" />
      <WhySection :content="home.why" />
      <TransformationSection :content="home.transformation" />
    </main>
    <SiteFooter :content="home.footer" :marquee="home.marquee" />
  </div>
</template>

<style scoped>
main:focus {
  outline: none;
}
</style>
