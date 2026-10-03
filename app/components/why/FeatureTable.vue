<script setup lang="ts">
import type { Pillar } from '~/types/content';

/**
 * Tableau des piliers : l'accroche rouge et son texte, puis une cellule bordée par
 * pilier, libellé en haut et texte en bas. Le vide central des cellules est voulu :
 * il « charge » la ligne comme une fiche technique (référence, a1 §2.5).
 *
 * Les filets sont des éléments à part (data-motion="why-rule") : la chorégraphie
 * pourra les tracer sans toucher au texte, qui reste lisible dès le départ.
 */
defineProps<{ statement: string; text: string; pillars: Pillar[] }>();
</script>

<template>
  <div class="feature-table" :style="{ '--pillars': pillars.length }">
    <span
      class="feature-table__rule feature-table__rule--top"
      data-motion="why-rule"
      aria-hidden="true"
    />
    <div class="feature-table__intro" data-motion="why-cell">
      <p class="feature-table__statement">{{ statement }}</p>
      <p class="feature-table__text">{{ text }}</p>
    </div>
    <ul role="list" class="feature-table__pillars">
      <li v-for="pillar in pillars" :key="pillar.title" class="pillar" data-motion="why-cell">
        <span class="pillar__edge" data-motion="why-rule" aria-hidden="true" />
        <h3 class="pillar__title">{{ pillar.title }}</h3>
        <p class="pillar__text">{{ pillar.text }}</p>
      </li>
    </ul>
    <span
      class="feature-table__rule feature-table__rule--bottom"
      data-motion="why-rule"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.feature-table {
  /*
   * Mesures @1440 (a1 §2.5) : cellules de 244,5 × 294, accroche sur 342 (1,4 ×),
   * libellé à 25 px du haut et 21,6 px du bord, texte à 22 px du bas.
   */
  --cell-pad-start: 1.5625rem;
  --cell-pad-inline: 1.35rem;
  --cell-pad-end: 1.375rem;

  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

/* Mobile : accroche, puis la liste des piliers entre deux filets. */
.feature-table__intro {
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding-block-end: var(--space-32);
}

.feature-table__rule {
  grid-column: 1 / -1;
  block-size: 1px;
  background: var(--rule);
}

.feature-table__rule--top {
  grid-row: 2;
}

.feature-table__pillars {
  grid-row: 3;
  display: grid;
}

.feature-table__rule--bottom {
  grid-row: 4;
}

.feature-table__statement {
  max-inline-size: 17rem;
  font-family: var(--font-display);
  font-size: var(--text-accent);
  font-weight: 500;
  line-height: var(--leading-snug);
  color: var(--accent-ink);
  text-wrap: balance;
}

.feature-table__text {
  max-inline-size: 34rem;
  color: var(--ink-muted);
}

.pillar {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding-block: var(--space-20);
}

/* Bordures de la cellule, posées par mise en page via --edge-* (1px ou 0). */
.pillar__edge {
  position: absolute;
  inset: 0;
  border: 0 solid var(--rule);
  border-block-start-width: var(--edge-top, 0);
  border-inline-start-width: var(--edge-start, 0);
  border-inline-end-width: var(--edge-end, 0);
  pointer-events: none;
}

/* Libellé de catégorie : Tektur 500 en capitales (rôle unifié, synthèse §4.3). */
.pillar__title {
  font-size: var(--text-label);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  /* #788382 sur nuit : 4,97:1 (le #6C7776 de la référence échouait). */
  color: var(--night-500);
}

.pillar__text {
  color: var(--ink-secondary);
}

/* Liste : un filet entre les piliers, sans vide central. */
@media (width < 40em) {
  .pillar:not(:first-child) {
    --edge-top: 1px;
  }
}

/* Grille 2 × 2 : boîtes complètes, le texte reste calé en bas. */
@media (40em <= width < 64em) {
  .feature-table__pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pillar {
    --edge-start: 1px;

    justify-content: space-between;
    gap: var(--space-40);
    padding: var(--cell-pad-start) var(--cell-pad-inline) var(--cell-pad-end);
  }

  .pillar:nth-child(2n),
  .pillar:last-child {
    --edge-end: 1px;
  }

  .pillar:nth-child(n + 3) {
    --edge-top: 1px;
  }
}

/* Une rangée de cellules ; la hauteur tend vers les 294 px mesurés à 1440. */
@media (width >= 64em) {
  .feature-table__pillars {
    grid-template-columns: repeat(var(--pillars), minmax(0, 1fr));
  }

  .pillar {
    --edge-start: 1px;

    justify-content: space-between;
    gap: var(--space-24);
    min-block-size: clamp(13rem, 20.4vw, 18.375rem);
    padding: var(--cell-pad-start) var(--cell-pad-inline) var(--cell-pad-end);
  }

  .pillar:last-child {
    --edge-end: 1px;
  }
}

/*
 * Composition complète : l'accroche prend la piste √2 à gauche, les cellules
 * s'alignent sur les colonnes de la racine (subgrid) et les deux filets
 * horizontaux courent sur toute la largeur du contenu.
 */
@media (width >= 80em) {
  .feature-table {
    grid-template-columns: minmax(0, 1.4fr) repeat(var(--pillars), minmax(0, 1fr));
  }

  .feature-table__rule--top {
    grid-row: 1;
  }

  .feature-table__intro {
    grid-row: 2;
    grid-column: 1;
    justify-content: flex-end;
    padding: var(--cell-pad-start) var(--space-40) var(--cell-pad-end) 0;
  }

  .feature-table__pillars {
    grid-row: 2;
    grid-column: 2 / -1;
    grid-template-columns: subgrid;
  }

  .feature-table__rule--bottom {
    grid-row: 3;
  }
}
</style>
