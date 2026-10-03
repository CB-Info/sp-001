<script setup lang="ts">
/**
 * En-tête de section : eyebrow, titre H2 et note latérale.
 * La note s'aligne toujours sur la DERNIÈRE ligne de base du titre (correctif de
 * cohérence : la référence la centrait dans Services et l'alignait en bas ailleurs).
 */
withDefaults(
  defineProps<{
    id: string;
    eyebrow?: string;
    title: string;
    note?: string;
    noteMono?: boolean;
  }>(),
  { eyebrow: undefined, note: undefined, noteMono: false },
);
</script>

<template>
  <header class="section-header">
    <Eyebrow v-if="eyebrow" class="section-header__eyebrow" :label="eyebrow" />
    <div class="section-header__row">
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
.section-header__eyebrow {
  margin-block-end: var(--header-gap);
}

.section-header__row {
  display: grid;
  gap: var(--space-24);
}

.section-header__title {
  max-inline-size: 15em;
  font-size: var(--text-heading);
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

@media (width >= 64em) {
  .section-header__row {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: last baseline;
    column-gap: var(--space-80);
  }
}
</style>
