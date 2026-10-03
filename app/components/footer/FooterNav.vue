<script setup lang="ts">
import type { NavLink } from '~/types/content';

/**
 * Navigation du footer : liens en mono, répartis en colonnes de haut en bas
 * (3 + 2 dans la référence). Le soulignement se trace depuis la gauche au survol
 * et au focus, puis se rétracte vers la droite.
 *
 * Le parent règle les colonnes avec `--footer-nav-columns` (alignement sur sa grille).
 */
const props = defineProps<{ links: NavLink[] }>();

const rows = Math.ceil(props.links.length / 2);
</script>

<template>
  <nav class="footer-nav" aria-label="Pied de page">
    <ul class="footer-nav__list" :style="{ '--footer-nav-rows': rows }">
      <li v-for="link in props.links" :key="link.label">
        <a :href="link.href" class="footer-nav__link">
          <span class="footer-nav__label">{{ link.label }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.footer-nav__list {
  /* 44 px en tactile ; mesuré : une ligne tous les ≈ 41 px à 1440. */
  --footer-nav-row: 2.75rem;

  display: grid;
  grid-template-columns: var(--footer-nav-columns, repeat(2, minmax(0, 1fr)));
  grid-template-rows: repeat(var(--footer-nav-rows), var(--footer-nav-row));
  grid-auto-flow: column;
  column-gap: var(--gap);
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-nav__link {
  display: flex;
  align-items: center;
  block-size: 100%;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  line-height: 1.2;
  color: var(--ink);
  text-decoration: none;
}

.footer-nav__link:focus-visible {
  outline-offset: 2px;
}

.footer-nav__label {
  /* a6 §5 : tracé en 200 ms depuis la gauche, rétraction en 160 ms vers la droite. */
  --underline-in: 200ms;
  --underline-out: 160ms;

  position: relative;
}

.footer-nav__label::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% + 0.25em);
  block-size: 1px;
  background: var(--red-500);
  scale: 0 1;
  transform-origin: right center;
  transition: scale var(--underline-out) var(--ease-in);
}

.footer-nav__link:is(:focus-visible, :active) .footer-nav__label::after {
  scale: 1 1;
  transform-origin: left center;
  transition: scale var(--underline-in) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .footer-nav__link:hover .footer-nav__label::after {
    scale: 1 1;
    transform-origin: left center;
    transition: scale var(--underline-in) var(--ease-out);
  }
}

@media (width >= 64em) {
  .footer-nav__list {
    --footer-nav-row: 2.5625rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-nav__label::after,
  .footer-nav__link:is(:hover, :focus-visible, :active) .footer-nav__label::after {
    transition: none;
  }
}

@media (forced-colors: active) {
  .footer-nav__label::after {
    background: LinkText;
  }
}
</style>
