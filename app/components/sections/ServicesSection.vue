<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Section Services : le mot géant « SERVICES. » ajusté à la largeur du contenu,
 * l'en-tête entre deux filets, la trame qui « mesure », puis le rail de cartes
 * en pleine largeur.
 */
defineProps<{ content: HomeContent['services'] }>();

const titleId = 'services-titre';
</script>

<template>
  <section id="services" class="services" data-surface="paper-alt" :aria-labelledby="titleId">
    <RuledGrid variant="strip" />

    <div class="services__inner container">
      <p class="services__display" data-motion="services-display">{{ content.display }}</p>
      <div class="services__rule" aria-hidden="true" data-motion="services-rule" />
      <SectionHeader
        :id="titleId"
        class="services__header"
        :title="content.title"
        :note="content.note"
        note-mono
      />
      <div class="services__rule" aria-hidden="true" data-motion="services-rule" />
      <div class="services__panel">
        <RuledGrid variant="panel" data-motion="services-panel" />
      </div>
    </div>

    <!-- Brief : la carte 02 est active et centrée au chargement. -->
    <ServiceCarousel class="services__rail" :items="content.items" :initial="1" />
  </section>
</template>

<style scoped>
.services {
  padding-block-end: var(--section-pad);
}

/* Conteneur de requête : le mot géant se dimensionne en `cqi` sur la largeur du contenu. */
.services__inner {
  container-type: inline-size;
}

.services__display {
  /* Mesuré : capitales à 118 px du haut de section, sous une bande de 51 px. */
  --display-offset: calc(var(--block-gap) * 0.84);

  /*
   * Interligne 0,8 : le haut des capitales tombe 0,05 em sous la boîte et la ligne
   * de base 0,05 em au-dessus (Tektur : ascendante 1, descendante 0,3, capitales 0,7).
   * Les marges compensent pour poser les capitales au pixel près.
   */
  margin-block: calc(var(--display-offset) - 0.05em) calc(var(--block-gap) - 0.05em);
  /* Approche gauche des fûts droits de Tektur : la lettre s'aligne sur le filet. */
  margin-inline-start: -0.056em;
  font-family: var(--font-display);
  font-weight: 500;
  /* Mesuré : 1 278 px d'encre sur 1 320, soit 97 % du contenu. */
  font-size: 20.6cqi;
  line-height: 0.8;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--accent);
}

.services__rule {
  block-size: 1px;
  background-color: var(--rule);
}

/* Mesuré : 28 px du filet au haut des capitales du titre, 30 px de sa ligne de base au filet. */
.services__header {
  padding-block: var(--gap);
}

.services__panel {
  margin-block-start: var(--gap);
}

.services__rail {
  margin-block-start: var(--block-gap);
}

/* Mobile : la trame garde ses 11 colonnes mais seulement 8 rangées (moitié du panneau). */
@media (width < 48em) {
  .services__panel {
    block-size: calc(6.7rem / 2 + 1px);
    overflow: hidden;
  }
}
</style>
