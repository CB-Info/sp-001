<script setup lang="ts">
import type { ProgramTag } from '~/types/content';

/**
 * Pastille de donnée d'un programme (durée, objectif…). Non interactive : aucune
 * affordance de survol. Seul élément arrondi du monde avec l'avatar, gardé par
 * fidélité à la référence.
 */
defineProps<{ tag: ProgramTag }>();
</script>

<template>
  <span class="tag-pill">
    <Icon class="tag-pill__icon" :name="tag.icon" size="1rem" />
    {{ tag.label }}
  </span>
</template>

<style scoped>
/* Mesuré : ≈ 36 px de haut, texte mono, fond et bord très pâles. */
.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  min-block-size: 2.25rem;
  padding: var(--space-4) var(--space-16);
  border: 1px solid var(--rule);
  border-radius: 999px;
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  line-height: 1.3;
  color: var(--ink-muted);
  white-space: nowrap;
}

.tag-pill__icon {
  color: var(--ink);
}
</style>
