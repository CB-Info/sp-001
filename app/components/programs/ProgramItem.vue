<script setup lang="ts">
import type { Coach, Program } from '~/types/content';

/**
 * Un élément de l'accordéon (motif APG) : `<h3><button>` qui pilote une région.
 *
 * Composant de présentation : l'état (ouvert, masqué) vient de ProgramAccordion.
 * Un panneau fermé porte `hidden="until-found"` une fois sa fermeture animée :
 * la recherche dans la page (Ctrl+F) le trouve et émet `beforematch`, relayé ici
 * en `reveal`.
 *
 * La hauteur s'anime par une grille 0fr → 1fr (aucune mesure en JS) ; le contenu
 * arrive ensuite en cascade : description, pastilles, coach.
 */
const props = defineProps<{
  program: Program;
  coach?: Coach;
  expanded: boolean;
  /** Panneau retiré du rendu (fermé et transition terminée). */
  concealed: boolean;
}>();

const emit = defineEmits<{ toggle: []; reveal: [] }>();

const headId = `programme-${props.program.id}-titre`;
const panelId = `programme-${props.program.id}-panneau`;
</script>

<template>
  <div class="program-item" :class="{ 'program-item--open': expanded }">
    <h3 class="program-item__heading">
      <button
        :id="headId"
        type="button"
        class="program-item__head"
        :aria-expanded="expanded"
        :aria-controls="panelId"
        data-accordion-head
        @click="emit('toggle')"
      >
        <span class="program-item__index" aria-hidden="true">{{ program.number }}</span>
        <span class="program-item__icon" aria-hidden="true">
          <Icon class="program-item__glyph" name="plus" size="1.75rem" />
        </span>
        <span class="program-item__title">{{ program.title }}</span>
      </button>
    </h3>

    <div class="program-item__collapse">
      <div
        :id="panelId"
        class="program-item__panel"
        role="region"
        :aria-labelledby="headId"
        :hidden.attr="concealed ? 'until-found' : undefined"
        data-motion="programs-panel"
        @beforematch="emit('reveal')"
      >
        <div class="program-item__content">
          <p class="program-item__description">{{ program.description }}</p>
          <ul class="program-item__tags">
            <li
              v-for="(tag, index) in program.tags"
              :key="tag.label"
              class="program-item__tag"
              :style="{ '--order': index + 1 }"
            >
              <TagPill :tag="tag" />
            </li>
          </ul>
          <CoachChip
            v-if="coach"
            class="program-item__coach"
            :coach="coach"
            :meta="program.coachMeta"
            :style="{ '--order': program.tags.length + 1 }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * Mesures @1440 (a1 §2.4, relevées sur s4) : index et « + » à ≈ 48 px du filet,
 * titre ≈ 54 px plus bas (hauts des capitales), 40 px du titre au filet suivant
 * quand l'élément est fermé ; ouvert : description, pastilles et coach espacés
 * de 40 px, 40 px du coach au filet.
 */
.program-item {
  --item-pad-start: var(--header-gap);
  --item-title-gap: clamp(1rem, 0.814rem + 0.762vw, 1.5rem);
  --item-rhythm: clamp(1.5rem, 1.129rem + 1.524vw, 2.5rem);

  position: relative;
  border-block-end: 1px solid var(--rule);
}

/* Le filet du bas se trace en rouge depuis la gauche (survol, focus clavier). */
.program-item::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-end: -1px;
  block-size: 1px;
  background: var(--accent);
  scale: 0 1;
  transform-origin: 0 0;
  pointer-events: none;
}

.program-item:has(.program-item__head:focus-visible)::after {
  scale: 1 1;
}

/* ── En-tête : toute la ligne est cliquable ──────────────────────────────── */
.program-item__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    'index icon'
    'title title';
  align-items: start;
  inline-size: 100%;
  padding-block: var(--item-pad-start) var(--item-rhythm);
  text-align: start;
  transition: padding-block-end var(--accordion-duration) var(--ease-in-out);
}

/* Ouvert : le titre se rapproche de sa description. */
.program-item--open .program-item__head {
  padding-block-end: var(--item-title-gap);
}

.program-item__head:focus-visible {
  outline-offset: var(--space-4);
}

.program-item__index {
  grid-area: index;
  font-size: var(--text-micro);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  color: var(--accent-ink);
}

/*
 * Zone d'icône de 44 × 44 (cible tactile du plan mobile). Les marges négatives
 * calent le haut du « + » sur le haut des chiffres de l'index sans agrandir la
 * rangée : la zone déborde, invisible, dans l'air autour.
 */
.program-item__icon {
  grid-area: icon;
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  margin-block: -0.75rem -0.5rem;
  color: var(--ink);
}

/* Le premier tracé de « plus » est la barre verticale : elle s'écrase en « − ». */
.program-item__glyph :deep(path:first-child) {
  transform-box: fill-box;
  transform-origin: center;
}

.program-item--open .program-item__glyph :deep(path:first-child) {
  scale: 1 0;
}

.program-item__head:active .program-item__glyph {
  scale: 0.86;
}

.program-item__title {
  grid-area: title;
  margin-block-start: var(--item-title-gap);
  /* Plafond : le token des H3 ; en colonne étroite, le titre suit son conteneur. */
  font-size: clamp(1.25rem, 6cqi, var(--text-subheading));
  line-height: var(--leading-tight);
  text-transform: uppercase;
  text-wrap: balance;
  color: var(--ink);
}

/* ── Panneau : hauteur 0fr → 1fr, puis contenu ─────────────────────────────── */
.program-item__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--accordion-duration) var(--ease-in-out);
}

.program-item--open .program-item__collapse {
  grid-template-rows: 1fr;
}

.program-item__panel {
  min-block-size: 0;
  overflow: hidden;
}

.program-item__content {
  --order: 0;

  display: grid;
  justify-items: start;
  gap: var(--item-rhythm);
  padding-block-end: var(--item-rhythm);
}

.program-item__description {
  max-inline-size: 60ch;
  color: var(--ink-muted);
}

.program-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  padding: 0;
  list-style: none;
}

/* Fermeture : le contenu s'efface vite, avant que la hauteur ne se replie. */
.program-item__description,
.program-item__tag,
.program-item__coach {
  opacity: 0;
  transition: opacity var(--dur-feedback) var(--ease-in);
}

.program-item--open :is(.program-item__description, .program-item__tag, .program-item__coach) {
  opacity: 1;
  transition: opacity 150ms linear;
}

@media (hover: hover) and (pointer: fine) {
  .program-item:has(.program-item__head:hover)::after {
    scale: 1 1;
  }
}

/* Tout ce qui bouge ; en mouvement réduit, les états changent sur place. */
@media (prefers-reduced-motion: no-preference) {
  .program-item::after {
    transition: scale var(--dur-state) var(--ease-out);
  }

  /* Le contour « se verrouille » : il se resserre en apparaissant. */
  .program-item__head {
    outline-offset: var(--space-12);
    transition:
      padding-block-end var(--accordion-duration) var(--ease-in-out),
      outline-offset var(--dur-feedback) var(--ease-out);
  }

  .program-item__glyph {
    transition:
      rotate var(--dur-state) var(--ease-strike),
      scale var(--dur-press) linear;
  }

  .program-item__glyph :deep(path:first-child) {
    transition: scale var(--dur-state) var(--ease-in-out);
  }

  .program-item__title {
    transition: translate var(--dur-state) var(--ease-out);
  }

  /* Cascade d'arrivée : la description, puis chaque pastille, puis le coach. */
  .program-item__description,
  .program-item__tag,
  .program-item__coach {
    translate: 0 var(--step-md-b);
    transition:
      opacity var(--dur-feedback) var(--ease-in),
      translate var(--dur-feedback) var(--ease-in);
  }

  .program-item--open :is(.program-item__description, .program-item__tag, .program-item__coach) {
    translate: 0 0;
    transition-duration: var(--dur-state);
    transition-timing-function: var(--ease-out);
    /* Mesuré au brief : 120 ms après le début de l'ouverture, pas de 40 ms. */
    transition-delay: calc(120ms + var(--order) * 40ms);
  }
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .program-item__head:hover .program-item__title {
    translate: var(--step-sm-x) 0;
  }

  /* Un cran de 90° (le « + » reste un « + ») ; ouvert, un demi-tour (le « − » reste un « − »). */
  .program-item__head:hover .program-item__glyph {
    rotate: 90deg;
  }

  .program-item--open .program-item__head:hover .program-item__glyph {
    rotate: 180deg;
  }
}

/* Impression : tous les panneaux, même ceux que le navigateur garde masqués. */
@media print {
  .program-item__collapse {
    grid-template-rows: 1fr;
  }

  .program-item__panel[hidden] {
    display: block;
    content-visibility: visible;
  }

  .program-item__description,
  .program-item__tag,
  .program-item__coach {
    opacity: 1;
    translate: none;
  }
}
</style>
