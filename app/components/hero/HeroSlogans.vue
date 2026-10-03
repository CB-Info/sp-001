<script setup lang="ts">
/**
 * Liste des 4 slogans du hero, séparés par 5 filets (mesuré @1440 : rangées de
 * 58,5 px, liste de 508 px). En dessous de 64em : grille 2 × 2 compacte ; masquée
 * quand la fenêtre est trop basse (paysage mobile).
 */
defineProps<{ slogans: string[] }>();
</script>

<template>
  <ul class="hero-slogans">
    <li
      v-for="slogan in slogans"
      :key="slogan"
      class="hero-slogans__item"
      data-motion="hero-slogan"
    >
      {{ slogan }}
    </li>
  </ul>
</template>

<style scoped>
.hero-slogans {
  --slogan-rule: color-mix(in srgb, var(--ink) 50%, transparent); /* mesuré : blanc ≈ 50 % */

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-inline-size: 36rem;
  padding: 0;
  list-style: none;
  border-block-end: 1px solid var(--slogan-rule);
  font-family: var(--font-lead);
  font-size: var(--text-micro);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--ink);
}

.hero-slogans__item {
  display: flex;
  align-items: center;
  min-block-size: var(--hero-row, 2.75rem);
  padding-block: var(--space-8);
  padding-inline-end: var(--space-8);
  border-block-start: 1px solid var(--slogan-rule);
}

@media (width >= 64em) {
  .hero-slogans {
    grid-template-columns: minmax(0, 1fr);
    /* mesuré : 508 px sur 1320 (≈ 38,5 % du conteneur) */
    inline-size: clamp(18rem, 38.5%, 31.75rem);
    font-size: clamp(1rem, 0.93rem + 0.3vw, 1.1875rem);
  }

  .hero-slogans__item {
    padding-block: 0;
  }
}

@media (height < 30em) {
  .hero-slogans {
    display: none;
  }
}
</style>
