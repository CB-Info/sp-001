<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Carte de note : « 4,9/5 » et son libellé en haut, avatars des avis en bas, sur
 * le rouge marbré (la seule masse rouge de la section).
 */
const props = defineProps<{ rating: HomeContent['about']['rating'] }>();

/* « 4,9 » et « /5 » se lisent « 4,9 sur 5 » plutôt que « 4,9 barre oblique 5 ». */
const spoken = computed(() => `${props.rating.value} sur ${props.rating.scale.replace('/', '')}`);
</script>

<template>
  <MaterialCard material="grain" class="rating-card">
    <StatFigure
      :value="rating.value"
      :suffix="rating.scale"
      :spoken="spoken"
      :label="rating.label"
      motion="about-rating-value"
    />
    <AvatarStack class="rating-card__reviewers" :images="rating.reviewers" />
  </MaterialCard>
</template>

<style scoped>
/* Les avatars tombent en bas de la carte, quelle que soit sa hauteur. */
.rating-card__reviewers {
  margin-block-start: auto;
  padding-block-start: var(--space-24);
}
</style>
