<script setup lang="ts">
import { cap } from '~/data/cap';

/**
 * Le sélecteur « Mettre en avant » de la semaine (brief docs/brief/v2.md, §4.5).
 *
 * Un `<fieldset>` de radios natives, toutes du même `name` : les flèches passent
 * d'une option à l'autre, sans une ligne de JS. La mise en avant elle-même est
 * en CSS seul (CapWeek, `:has()`) : elle marche aussi sans JS. Rangée 1, les
 * rythmes du club ; rangée 2, trois idées de semaine, annoncées comme telles
 * (« Idées de semaine, pas un programme du club »), dans leur propre groupe.
 *
 * Chaque option est une pastille : contour au repos, fond citron et graisse 700
 * une fois cochée (« un changement d'état est un remplissage », §5.1). La
 * largeur est réservée pour la graisse 700 : cocher ne décale pas les voisines.
 * La couleur n'est jamais le seul signal (fond plein, graisse).
 *
 * Avec JS, une zone aria-live polie annonce « 3 créneaux mis en avant », après
 * une action seulement (elle est vide au chargement).
 */
const f = cap.week.focus;
const NAME = 'semaine-focus';
const DEFAULT = 'tout';
const ideesId = 'semaine-focus-idees';

/** La piste Bien-être n'est pas un créneau : elle s'ajoute à l'annonce. */
const WELLNESS = ['reprends', 'solide'];

const message = ref('');
let pending: ReturnType<typeof setTimeout> | undefined;

function announce(event: Event) {
  const option = (event.target as HTMLInputElement).value;
  const count =
    option === DEFAULT
      ? cap.sessions.length
      : cap.sessions.filter((session) => session.tags.includes(option)).length;
  const text = (count === 1 ? f.annonceUn : f.annonce).replace('{n}', String(count));
  // Vider puis réécrire : deux choix de même compte sont annoncés tous les deux.
  message.value = '';
  clearTimeout(pending);
  pending = setTimeout(() => {
    message.value = WELLNESS.includes(option) ? `${text}${f.annoncePlus}` : text;
  }, 120);
}

onBeforeUnmount(() => clearTimeout(pending));
</script>

<template>
  <fieldset class="cap-focus">
    <legend class="cap-focus__legend">{{ f.legende }}</legend>

    <div class="cap-focus__row">
      <label v-for="option in f.options" :key="option.id" class="cap-focus__option">
        <!--
          L'option par défaut porte un attribut `checked` statique, jamais lié :
          dans un v-for, Vue réécrit les props liées à l'hydratation, et un choix
          fait avant elle (les radios marchent sans JS) serait perdu.
        -->
        <input
          v-if="option.id === DEFAULT"
          :id="`focus-${option.id}`"
          class="cap-focus__input"
          type="radio"
          :name="NAME"
          :value="option.id"
          checked
          @change="announce"
        />
        <input
          v-else
          :id="`focus-${option.id}`"
          class="cap-focus__input"
          type="radio"
          :name="NAME"
          :value="option.id"
          @change="announce"
        />
        <span class="cap-focus__text" :data-label="option.label">
          <span>{{ option.label }}</span>
        </span>
      </label>
    </div>

    <div class="cap-focus__row cap-focus__row--idees" role="group" :aria-labelledby="ideesId">
      <p :id="ideesId" class="cap-focus__idees">{{ f.idees }}</p>
      <label v-for="option in f.ideesOptions" :key="option.id" class="cap-focus__option">
        <input
          :id="`focus-${option.id}`"
          class="cap-focus__input"
          type="radio"
          :name="NAME"
          :value="option.id"
          @change="announce"
        />
        <span class="cap-focus__text" :data-label="option.label">
          <span>{{ option.label }}</span>
        </span>
      </label>
    </div>

    <p class="visually-hidden" aria-live="polite">{{ message }}</p>
  </fieldset>
</template>

<style scoped>
/*
 * La légende flotte : elle n'est plus la « légende rendue » du fieldset et devient
 * un élément de la grille comme un autre. Sur ordinateur, elle tient les
 * colonnes 1 et 2 (au-dessus des jours), les options partent de la colonne 3
 * (au-dessus de la bande).
 */
.cap-focus {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  column-gap: var(--gap);
  min-inline-size: 0;
  /* La marge du haut appartient à la section (CapWeek) : aucune ici. */
  margin-inline: 0;
  margin-block-end: 0;
  padding: 0;
  border: 0;
}

.cap-focus__legend {
  float: inline-start;
  grid-column: 1 / -1;
  padding: 0;
  color: var(--ink-muted);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 44px;
}

.cap-focus__row {
  display: flex;
  flex-wrap: wrap;
  grid-column: 1 / -1;
  align-items: center;
  gap: 8px;
}

.cap-focus__idees {
  flex-basis: 100%;
  margin: 12px 0 0;
  color: var(--ink-muted);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-style: italic;
  line-height: 1.4;
}

/*
 * ── Une option : une pastille de 44 px ─────────────────────────────────────
 * Bord au contour = non cochée, fond citron = cochée (le code du carré et des
 * cours) : la rangée se lit comme un filtre, pas comme du texte. La radio native
 * couvre toute la pastille. La largeur est réservée pour la graisse 700.
 */
.cap-focus__option {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-block-size: 44px;
  padding: 0 16px;
  border: 1px solid var(--cf-filet);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition:
    background-color var(--dur-feedback) var(--ease-out-soft),
    border-color var(--dur-feedback) var(--ease-out-soft),
    color var(--dur-feedback) var(--ease-out-soft);
}

.cap-focus__input {
  position: absolute;
  inset: 0;
  z-index: 1;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  appearance: none;
}

/* Largeur réservée pour la graisse 700 : les deux textes partagent une cellule. */
.cap-focus__text {
  position: relative;
  display: inline-grid;
}

.cap-focus__text > span,
.cap-focus__text::before {
  grid-area: 1 / 1;
}

.cap-focus__text::before {
  block-size: 0;
  overflow: hidden;
  font-weight: 700;
  visibility: hidden;
  content: attr(data-label);
}

@media (hover: hover) and (pointer: fine) {
  .cap-focus__option:hover:not(:has(:checked)) {
    border-color: var(--cf-citron);
  }
}

.cap-focus__option:has(:checked) {
  border-color: var(--cf-citron);
  background: var(--cf-citron);
  color: var(--cf-noir);
}

.cap-focus__option:has(:checked) .cap-focus__text {
  font-weight: 700;
}

.cap-focus__option:has(:focus-visible) {
  outline: 2px solid var(--cf-citron);
  outline-offset: 2px;
}

html:not(.has-motion) .cap-focus__option {
  transition: none;
}

@media (min-width: 64em) {
  .cap-focus__legend {
    grid-column: 1 / 3;
    grid-row: 1;
  }

  .cap-focus__row {
    grid-column: 3 / -1;
  }
}

/* Rangée 2 : la mention, puis les trois idées, sur la même ligne dès qu'elles y tiennent. */
@media (min-width: 80em) {
  .cap-focus__idees {
    flex-basis: auto;
    margin: 0 8px 0 0;
  }
}

@media (forced-colors: active) {
  .cap-focus__option {
    border-color: CanvasText;
  }

  .cap-focus__option:has(:checked) {
    border-color: Highlight;
    background: Highlight;
    color: HighlightText;
  }

  .cap-focus__option:has(:focus-visible) {
    outline-color: CanvasText;
  }
}
</style>
