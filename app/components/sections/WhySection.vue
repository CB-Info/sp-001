<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Section « Pourquoi CLUSEM » sur la surface nuit : en-tête, tableau des piliers,
 * puis l'équipe et son bouton. C'est la section la plus dense de la page et le seul
 * sombre du milieu de parcours (synthèse §2).
 */
defineProps<{ content: HomeContent['why'] }>();

const titleId = 'pourquoi-titre';
</script>

<template>
  <section id="pourquoi" class="why section" data-surface="night" :aria-labelledby="titleId">
    <div class="container">
      <SectionHeader
        :id="titleId"
        :eyebrow="content.eyebrow"
        :title="content.title"
        :note="content.note"
      />
      <FeatureTable
        class="why__table"
        :statement="content.statement"
        :text="content.text"
        :pillars="content.pillars"
      />
      <TeamGrid
        class="why__team"
        :coaches="content.coaches"
        :featured-id="content.featuredCoachId"
        :cta="content.cta"
      />
    </div>
  </section>
</template>

<style scoped>
/* Corps clair sur fond sombre : un peu plus d'interligne (synthèse §4.3). */
.why {
  line-height: 1.5;
}

/* Mesuré : 48 px entre le titre et le tableau, 41 px entre le tableau et l'équipe. */
.why__table {
  margin-block-start: var(--header-gap);
}

.why__team {
  margin-block-start: var(--space-40);
}
</style>
