<script setup lang="ts">
import { club } from '~/data/club';

/**
 * Pied de page : le grand écusson sur le terrain, la navigation, les infos
 * pratiques, la mention « projet conceptuel » (tout est fictif, rien n'est
 * envoyé) et le lien vers la direction A, en lien pleine page : chaque
 * direction charge ses propres tokens.
 */
const content = club.footer;
const year = club.season.label;
</script>

<template>
  <footer class="footer" data-surface="pitch">
    <div class="footer__pitch" aria-hidden="true">
      <span class="footer__halfway" />
      <span class="footer__circle" />
    </div>
    <div class="container footer__grid">
      <div class="footer__brand">
        <span class="footer__crest"><ClubCrest detailed :label="club.name" /></span>
        <div>
          <p class="footer__name">{{ club.name }}</p>
          <p class="footer__tagline">{{ content.tagline }}</p>
          <p class="footer__season club-label">{{ year }}</p>
        </div>
      </div>

      <nav class="footer__col" :aria-label="content.nav">
        <p class="footer__heading club-label" aria-hidden="true">{{ content.nav }}</p>
        <ul role="list">
          <li v-for="link in club.nav" :key="link.href">
            <a class="footer__link" :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <nav class="footer__col" :aria-label="content.infos">
        <p class="footer__heading club-label" aria-hidden="true">{{ content.infos }}</p>
        <ul role="list">
          <li v-for="link in content.infoLinks" :key="link.href">
            <a class="footer__link" :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="footer__concept">
        <p>{{ content.concept }}</p>
        <p class="footer__credit">{{ content.credit }}</p>
        <a
          class="club-action club-action--outline club-action--small"
          :href="content.otherDirection.href"
        >
          {{ content.otherDirection.label }}
          <svg class="club-action__arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" />
          </svg>
        </a>
      </div>

      <a class="footer__top" href="#haut">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 20V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" />
        </svg>
        {{ content.top }}
      </a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  padding-block: var(--section-pad) var(--space-40);
  overflow: clip;
  background: var(--pitch-900);
}

/* Le terrain vu d'en haut : ligne médiane et rond central, à peine tracés. */
.footer__pitch {
  position: absolute;
  inset: var(--space-24) calc(var(--page-gutter) / 2);
  border: var(--line-pitch) solid rgb(255 255 255 / 0.16);
  pointer-events: none;
}

.footer__halfway {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 50%;
  inline-size: var(--line-pitch);
  background: rgb(255 255 255 / 0.16);
}

.footer__circle {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: min(60vw, 22rem);
  aspect-ratio: 1;
  border: var(--line-pitch) solid rgb(255 255 255 / 0.16);
  border-radius: 50%;
  translate: -50% -50%;
}

.footer__grid {
  position: relative;
  display: grid;
  gap: var(--space-48) var(--gap);
}

.footer__brand {
  display: flex;
  gap: var(--space-20);
  align-items: center;
}

.footer__crest {
  display: block;
  flex: none;
  block-size: clamp(7rem, 5rem + 8vw, 11rem);
}

.footer__name {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 1.8rem + 3vw, 4.5rem);
  font-weight: 900;
  font-stretch: var(--stretch-wide);
  line-height: 0.9;
}

.footer__tagline {
  margin-block-start: var(--space-8);
  color: var(--ink-secondary);
}

.footer__season {
  margin-block-start: var(--space-8);
  color: var(--accent);
}

.footer__col {
  display: grid;
  gap: var(--space-12);
  align-content: start;
}

.footer__heading {
  color: var(--accent);
}

.footer__col ul {
  display: grid;
  gap: var(--space-4);
}

.footer__link {
  display: inline-block;
  padding-block: 0.375rem;
  color: var(--ink);
  text-decoration: none;
}

.footer__link:hover {
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-decoration-thickness: var(--line-pitch);
  text-underline-offset: 0.3em;
}

.footer__concept {
  display: grid;
  gap: var(--space-16);
  align-content: start;
  justify-items: start;
  max-inline-size: 34rem;
  color: var(--ink-secondary);
  font-size: var(--text-label);
}

.footer__credit {
  color: var(--ink);
}

.footer__top {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  justify-self: start;
  min-block-size: 2.75rem;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-label);
  font-weight: 700;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;
}

.footer__top svg {
  inline-size: 1.125rem;
  block-size: 1.125rem;
}

@media (min-width: 64rem) {
  .footer__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .footer__brand {
    grid-column: 1 / span 5;
  }

  .footer__col:nth-of-type(1) {
    grid-column: 8 / span 2;
  }

  .footer__col:nth-of-type(2) {
    grid-column: 10 / span 3;
  }

  .footer__concept {
    grid-column: 1 / span 6;
  }

  .footer__top {
    grid-column: 10 / -1;
    justify-self: end;
    align-self: end;
    white-space: nowrap;
  }
}
</style>
