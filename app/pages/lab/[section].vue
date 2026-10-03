<script setup lang="ts">
/**
 * Laboratoire (dev uniquement, exclu du build de production) : affiche une seule
 * zone de la page pour la construire et la comparer à la référence isolément.
 * Exemple : /lab/hero, /lab/services, /lab/footer.
 */
import { home } from '~/data/home';

const route = useRoute();
const section = computed(() => String(route.params.section));
</script>

<template>
  <div class="lab">
    <SiteHeader
      v-if="section === 'header' || section === 'hero'"
      :nav="home.nav"
      :socials="home.footer.socials"
      :note="home.footer.disclaimer"
    />
    <HeroSection v-if="section === 'hero'" :content="home.hero" />
    <AboutSection v-else-if="section === 'about'" :content="home.about" />
    <ServicesSection v-else-if="section === 'services'" :content="home.services" />
    <ProgramsSection
      v-else-if="section === 'programs'"
      :content="home.programs"
      :coaches="home.why.coaches"
    />
    <WhySection v-else-if="section === 'why'" :content="home.why" />
    <TransformationSection
      v-else-if="section === 'transformation'"
      :content="home.transformation"
    />
    <SiteFooter v-else-if="section === 'footer'" :content="home.footer" :marquee="home.marquee" />
    <div v-else-if="section === 'header'" style="height: 150vh; background: #600305" />
    <p v-else>Section inconnue&nbsp;: {{ section }}</p>
  </div>
</template>
