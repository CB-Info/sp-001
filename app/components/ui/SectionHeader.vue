<script setup lang="ts">
/**
 * En-tête de section : eyebrow, titre H2 et note latérale.
 * La note s'aligne toujours sur la DERNIÈRE ligne de base du titre (correctif de
 * cohérence : la référence la centrait dans Services et l'alignait en bas ailleurs).
 *
 * `size="sub"` dessine le H2 à la taille des H3 (la déclaration d'About).
 */
withDefaults(
  defineProps<{
    id: string;
    eyebrow?: string;
    title: string;
    note?: string;
    noteMono?: boolean;
    size?: 'heading' | 'sub';
  }>(),
  { eyebrow: undefined, note: undefined, noteMono: false, size: 'heading' },
);
</script>

<template>
  <header class="section-header" :class="`section-header--${size}`">
    <Eyebrow v-if="eyebrow" class="section-header__eyebrow" :label="eyebrow" />
    <div class="section-header__row" :class="{ 'section-header__row--noted': note }">
      <h2 :id="id" class="section-header__title">{{ title }}</h2>
      <p
        v-if="note"
        class="section-header__note"
        :class="{ 'section-header__note--mono': noteMono }"
      >
        {{ note }}
      </p>
    </div>
  </header>
</template>

<style scoped>
.section-header {
  /* Toute la piste, même dans une colonne flex alignée au début (About, Programs). */
  inline-size: 100%;
}

.section-header--heading {
  --title-size: var(--text-heading);
  --title-leading: var(--leading-heading);
  --title-measure: 15em;
}

.section-header--sub {
  --title-size: var(--text-subheading);
  --title-leading: var(--leading-tight);
  --title-measure: 20em;
}

.section-header__eyebrow {
  margin-block-end: var(--header-gap);
}

/*
 * Le titre se mesure à la largeur de sa rangée, pas à celle de la fenêtre. Le
 * conteneur est la rangée et non l'en-tête : un conteneur impose la containment
 * de mise en page, qui interdit à l'en-tête d'être une sous-grille (About).
 */
.section-header__row {
  container-type: inline-size;
  display: grid;
  gap: var(--space-24);
}

.section-header__title {
  max-inline-size: var(--title-measure);
  /*
   * Plafond à la largeur : le mot le plus long d'un titre français
   * (« TRANSFORMATIONS, » ≈ 9,5 em) tient dans 280 px à 320 de large.
   */
  font-size: min(var(--title-size), 10.5cqi);
  line-height: var(--title-leading);
  text-transform: uppercase;
  color: var(--ink);
}

.section-header__note {
  max-inline-size: 19rem;
  font-size: var(--text-body);
  line-height: 1.3;
  color: var(--ink-muted);
}

.section-header__note--mono {
  font-family: var(--font-mono);
  font-size: var(--text-label);
}

/* Deux pistes seulement s'il y a une note : sans elle, le titre garde toute la largeur. */
@media (width >= 64em) {
  .section-header__row--noted {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: last baseline;
    column-gap: var(--space-80);
  }
}
</style>
