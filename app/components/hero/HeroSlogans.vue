<script setup lang="ts">
/**
 * Liste des 4 slogans du hero, séparés par 5 filets (mesuré @1440 : rangées de
 * 58,5 px, liste de 508 px). En dessous de 64em : grille 2 × 2 compacte ; masquée
 * quand la fenêtre est trop basse (paysage mobile).
 *
 * Intro (a6 §2.2, partition dans HeroSection) : les filets se tracent depuis la
 * gauche et chaque slogan monte dans son masque, une rangée après l'autre.
 */
defineProps<{ slogans: string[] }>();
</script>

<template>
  <ul role="list" class="hero-slogans">
    <li
      v-for="(slogan, index) in slogans"
      :key="slogan"
      class="hero-slogans__item"
      :style="{ '--i': index }"
      data-motion="hero-slogan"
    >
      <span class="hero-slogans__mask">
        <span class="hero-slogans__text">{{ slogan }}</span>
      </span>
    </li>
  </ul>
</template>

<style scoped>
.hero-slogans {
  --slogan-rule: color-mix(in srgb, var(--ink) 50%, transparent); /* mesuré : blanc ≈ 50 % */

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-inline-size: 36rem;
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

.hero-slogans__text {
  display: block;
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

/*
 * ── Intro ──────────────────────────────────────────────────────────────────
 * Les bordures deviennent des calques de 1 px posés exactement sur elles, qu'on
 * peut tracer en scaleX ; le 5e filet (bas de liste) ferme la marche.
 */
html.hero-intro .hero-slogans,
html.hero-intro .hero-slogans__item {
  position: relative;
  border-color: transparent;
}

html.hero-intro .hero-slogans::after,
html.hero-intro .hero-slogans__item::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  block-size: 1px;
  background: var(--slogan-rule);
  transform-origin: left;
  animation: hero-slogan-trace var(--dur-overlay) var(--ease-out)
    calc(var(--intro-slogans) + var(--i) * var(--stagger-list)) backwards var(--intro-state);
}

html.hero-intro .hero-slogans__item::before {
  inset-block-start: -1px;
}

html.hero-intro .hero-slogans::after {
  --i: 4;

  inset-block-end: -1px;
}

/* Masque à la ligne de texte (marges latérales et hautes pour les accents). */
html.hero-intro .hero-slogans__mask {
  clip-path: inset(-0.5em -0.5em 0);
}

html.hero-intro .hero-slogans__text {
  animation: hero-slogan-rise var(--dur-overlay) var(--ease-out)
    calc(var(--intro-slogans) + var(--i) * var(--stagger-list)) backwards var(--intro-state);
}

@keyframes hero-slogan-trace {
  from {
    transform: scaleX(0);
  }
}

@keyframes hero-slogan-rise {
  from {
    transform: translateY(100%);
  }
}
</style>
