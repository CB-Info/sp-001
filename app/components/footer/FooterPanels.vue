<script setup lang="ts">
import type { HomeContent } from '~/types/content';

/**
 * Bande des trois panneaux de la référence, dans l'ordre de lecture :
 *   1. lien seul (corps vide, comme dans la référence) ;
 *   2. mis en avant (en-tête rouge) : le manifeste en bas à gauche ;
 *   3. la devise en bas à gauche et l'astérisque rouge en bas à droite.
 *
 * Gabarit mesuré @1440 : 58 → 328 → 854 → 1380, soit 1fr 2fr 2fr, 350 px de haut.
 * Entre 40em et 64em : le panneau 1 (en-tête seul) en pleine largeur, puis 2 et 3
 * côte à côte ; l'ordre du DOM reste l'ordre visuel.
 */
const props = defineProps<{
  panels: HomeContent['footer']['panels'];
  manifesto: string;
  motto: string;
}>();

const FEATURED = 1;
/* Le lien vers le haut de page reçoit une flèche montante. */
const TOP_ANCHOR = '#haut';

const bodies = ['empty', 'manifesto', 'motto'] as const;
const kindOf = (index: number) => bodies[index] ?? 'empty';
</script>

<template>
  <ul role="list" class="footer-panels">
    <FooterPanel
      v-for="(panel, index) in props.panels"
      :key="panel.title"
      :title="panel.title"
      :href="panel.href"
      :featured="index === FEATURED"
      :arrow="panel.href === TOP_ANCHOR ? 'up' : 'right'"
    >
      <template v-if="kindOf(index) === 'manifesto'" #default>
        <p class="footer-panels__manifesto">{{ props.manifesto }}</p>
      </template>
      <template v-else-if="kindOf(index) === 'motto'" #default>
        <p class="footer-panels__motto">{{ props.motto }}</p>
        <Asterisk class="footer-panels__asterisk" size="var(--panel-asterisk)" />
      </template>
    </FooterPanel>
  </ul>
</template>

<style scoped>
.footer-panels {
  --panel-rule: var(--footer-rule, var(--rule));

  display: grid;
  border-block-start: 1px solid var(--panel-rule);
  border-inline-start: 1px solid var(--panel-rule);
}

.footer-panels__manifesto {
  /* mesuré : 454 px de texte dans un panneau de 526. */
  max-inline-size: 28.5rem;
  font-size: var(--text-body);
  line-height: 1.5;
  color: var(--ink-secondary);
}

.footer-panels__motto {
  max-inline-size: 8em;
  font-family: var(--font-display);
  font-size: var(--text-body);
  font-weight: 600;
  line-height: 1.15;
  text-transform: uppercase;
  color: var(--ink);
}

/* mesuré : ≈ 100 px dans un panneau de 526 (≈ 19 % de sa largeur). */
.footer-panels__asterisk {
  --accent: var(--red-500);
  --panel-asterisk: clamp(3.5rem, 19cqi, 6.25rem);

  flex: none;
  /* mesuré : 24 px du bord droit, 25 du bas (le corps en donne 20). */
  margin: 0 var(--space-4) var(--space-4) auto;
}

/* Survol ou focus de l'en-tête : l'astérisque avance d'un cran de 45° (grammaire). */
@media (prefers-reduced-motion: no-preference) {
  .footer-panels .footer-panels__asterisk {
    rotate: calc((var(--scroll-step, 0) + var(--ratchet, 0) + var(--panel-active, 0)) * 45deg);
  }
}

@media (width >= 40em) {
  .footer-panels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-panels > :first-child {
    grid-column: 1 / -1;
  }
}

@media (width >= 64em) {
  .footer-panels {
    grid-template-columns: 1fr 2fr 2fr;
    grid-auto-rows: 21.875rem;
  }

  .footer-panels > :first-child {
    grid-column: auto;
  }
}
</style>
