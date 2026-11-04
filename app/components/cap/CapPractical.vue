<script setup lang="ts">
import { cap } from '~/data/cap';
import type { Day } from '~/types/cap';
import { jourCourt } from '~/utils/cap-time';

/**
 * Chapitre 6, tarifs et infos (#infos) : le lieu, l'accueil, les formules, puis
 * la FAQ (brief docs/brief/v2.md, §4.7). Tout ce qui est inconnu est dit
 * honnêtement : les valeurs manquantes passent par CapPending (texte visible,
 * soulignement pointillé), aucun lien mort, ni « ouvert maintenant » ni tarif
 * inventé. Les prix et l'accès se trouvent en moins d'une minute.
 *
 * Hydraté jamais (v2.vue, hydrate-never) : tout est HTML et CSS natifs. La FAQ
 * est faite de <details name="faq"> (accordéon exclusif natif) ; elle s'ouvre en
 * douceur par ::details-content là où le navigateur sait animer vers `auto`,
 * instantanément ailleurs. Aucune entrée animée.
 *
 * Gabarit G6, sur photo : « Viens nous voir » en plein craie, puis « à
 * [Commune]. » en délié craie, dont le contour signale l'inconnu (code d'état du
 * logo), suivi de la mention « commune à confirmer ». Sous 64em, ce délié ferait
 * moins de 64 px : il devient plein, souligné en pointillé (R2).
 *
 * Ordre du DOM = ordre de lecture et ordre visuel à toutes les largeurs : photo
 * et titre, fiche pratique (accès, accueil, formules), puis la FAQ.
 */

const titleId = 'infos-titre';
const p = cap.practical;

/** Les sept jours de l'accueil, du lundi au dimanche. */
const DAYS: Day[] = [0, 1, 2, 3, 4, 5, 6];

/*
 * Chaque « à confirmer » d'une phrase (notes, réponses de la FAQ) passe par
 * CapPending : le pointillé est le code d'état de toute la page pour ce qui
 * attend le club. La casse de la phrase est gardée (« À confirmer avec… »).
 */
const PENDING = new RegExp(`(${cap.ui.pending.replace(/^à/u, '[àÀ]')})`, 'u');
type Part = { text: string; pending: boolean };
const parts = (text: string): Part[] =>
  text
    .split(PENDING)
    .map((chunk, index) => ({ text: chunk, pending: index % 2 === 1 }))
    .filter((part) => part.text);

/*
 * Les notes de la fiche : une phrase par ligne, comme sur une fiche imprimée
 * (et jamais « libre- / service » coupé en fin de ligne).
 */
const sentences = (text: string): Part[][] => text.split(/(?<=\.)\s+/u).map(parts);
const notes = {
  accueil: sentences(p.accueil.note),
  formules: sentences(p.formules.note),
};
const faq = cap.faq.map((item) => ({ ...item, parts: parts(item.reponse) }));
</script>

<template>
  <section id="infos" class="cap-practical" data-surface="carbone" :aria-labelledby="titleId">
    <!-- ── Photo d'ouverture et titre (gabarit G6) ────────────────────────── -->
    <div class="cap-practical__cover">
      <CapPhoto
        class="cap-practical__photo"
        :photo="cap.photos.lieu"
        sizes="100vw"
        sizes-mobile="100vw"
      />
      <div class="cap-practical__head" data-surface="photo">
        <h2 :id="titleId" class="cap-practical__title">
          <span class="cap-practical__line cap-practical__line--plein cap-display">{{
            p.plein
          }}</span>
          {{ ' ' }}
          <span class="cap-practical__line cap-practical__line--commune cap-display">{{
            p.delie
          }}</span>
        </h2>
        <p class="cap-practical__commune"><CapPending :text="p.commune" /></p>
      </div>
    </div>

    <div class="cap-practical__body">
      <!-- ── Fiche pratique : trois blocs, colonnes 1-4, 5-8, 9-12 ────────── -->
      <div class="cap-practical__sheet cap-grid">
        <div class="cap-practical__block cap-practical__block--acces">
          <h3 class="cap-practical__block-title cap-display">{{ p.acces.titre }}</h3>
          <!-- Aucun lien mort : chaque valeur attend le club. -->
          <dl class="cap-practical__rows">
            <div v-for="line in p.acces.lignes" :key="line.label" class="cap-practical__row">
              <dt class="cap-practical__label">{{ line.label }}</dt>
              <dd class="cap-practical__value"><CapPending :text="line.valeur" /></dd>
            </div>
          </dl>
        </div>

        <div class="cap-practical__block cap-practical__block--accueil">
          <h3 class="cap-practical__block-title cap-display">{{ p.accueil.titre }}</h3>
          <dl class="cap-practical__rows">
            <div v-for="day in DAYS" :key="day" class="cap-practical__row">
              <dt class="cap-practical__label cap-practical__day cap-data">{{ jourCourt(day) }}</dt>
              <dd class="cap-practical__value cap-practical__hours cap-data">
                <!-- Les tirets montrent la place des horaires ; la synthèse vocale lit « à confirmer ». -->
                <span aria-hidden="true">{{ p.accueil.vide }}</span>
                <span class="visually-hidden">{{ cap.ui.pending }}</span>
              </dd>
            </div>
          </dl>
          <p class="cap-practical__note">
            <template v-for="(sentence, line) in notes.accueil" :key="line"
              >{{ line ? ' ' : ''
              }}<span class="cap-practical__sentence"
                ><template v-for="(part, index) in sentence" :key="index"
                  ><CapPending v-if="part.pending" :text="part.text" /><template v-else>{{
                    part.text
                  }}</template></template
                ></span
              ></template
            >
          </p>
        </div>

        <div class="cap-practical__block cap-practical__block--formules">
          <h3 class="cap-practical__block-title cap-display">{{ p.formules.titre }}</h3>
          <!-- Un vrai tableau de 3 rangées et 2 colonnes : ni cartes, ni « le plus choisi ». -->
          <table class="cap-practical__table">
            <caption class="visually-hidden">
              {{
                p.formules.legende
              }}
            </caption>
            <thead>
              <tr>
                <th scope="col" class="cap-practical__th">{{ p.formules.colonnes[0] }}</th>
                <th scope="col" class="cap-practical__th cap-practical__th--prix">
                  {{ p.formules.colonnes[1] }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line in p.formules.lignes" :key="line.nom" class="cap-practical__tr">
                <th scope="row" class="cap-practical__formule">
                  <span class="cap-practical__nom">{{ line.nom }}</span>
                  <span v-if="line.detail" class="cap-practical__detail">{{ line.detail }}</span>
                </th>
                <td class="cap-practical__prix">
                  <span class="cap-practical__montant cap-data">{{ p.formules.prix }}</span>
                  {{ ' ' }}
                  <CapPending class="cap-practical__tarif" :text="p.formules.pending" />
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Sous 30em (zoom à 400 %), le même contenu en liste de définitions. -->
          <dl class="cap-practical__formules-dl">
            <div v-for="line in p.formules.lignes" :key="line.nom" class="cap-practical__tr">
              <dt class="cap-practical__formule">
                <span class="cap-practical__nom">{{ line.nom }}</span>
                <span v-if="line.detail" class="cap-practical__detail">{{ line.detail }}</span>
              </dt>
              <dd class="cap-practical__prix">
                <span class="cap-practical__montant cap-data">{{ p.formules.prix }}</span>
                {{ ' ' }}
                <CapPending class="cap-practical__tarif" :text="p.formules.pending" />
              </dd>
            </div>
          </dl>
          <!-- Du texte, pas un lien : l'accueil n'a encore ni adresse ni téléphone. -->
          <p class="cap-practical__note">
            <template v-for="(sentence, line) in notes.formules" :key="line"
              >{{ line ? ' ' : ''
              }}<span class="cap-practical__sentence"
                ><template v-for="(part, index) in sentence" :key="index"
                  ><CapPending v-if="part.pending" :text="part.text" /><template v-else>{{
                    part.text
                  }}</template></template
                ></span
              ></template
            >
          </p>
        </div>
      </div>

      <!-- ── Avant ton premier cours : titre collant, FAQ native ──────────── -->
      <div class="cap-practical__faq cap-grid">
        <h3 class="cap-practical__faq-title cap-display">
          <template v-for="(line, index) in p.faqTitre" :key="line"
            ><span class="cap-practical__faq-line">{{ line }}</span
            >{{ index < p.faqTitre.length - 1 ? ' ' : '' }}</template
          >
        </h3>

        <div class="cap-practical__faq-list">
          <details v-for="item in faq" :key="item.question" name="faq" class="cap-practical__item">
            <summary class="cap-practical__question">
              <span class="cap-practical__question-text">{{ item.question }}</span>
              <span class="cap-practical__square cap-square" aria-hidden="true" />
            </summary>
            <div class="cap-practical__answer">
              <p class="cap-practical__answer-text">
                <template v-for="(part, index) in item.parts" :key="index"
                  ><CapPending v-if="part.pending" :text="part.text" /><template v-else>{{
                    part.text
                  }}</template></template
                ><template v-if="item.lien"
                  >{{ ' '
                  }}<a class="cap-link" :href="item.lien.href">{{ item.lien.label }}</a></template
                >
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Cotes @1440 (brief §4.7) : photo cap-lieu plein cadre en 21:9 (1440 × 617) ;
 * « Viens nous voir » plein craie 80 %, 120 px (913 px), x 60 ; « à [Commune]. »
 * délié craie 125 %, 96 px (935 px), ligne de base à 48 px du bas de la photo ;
 * la mention « commune à confirmer » (15 px) sur la même ligne de base, à
 * droite. Fiche pratique sur carbone, 96 px sous la photo : colonnes 1-4, 5-8,
 * 9-12 (x 60, 508, 956 ; 424 px chacune). FAQ 120 px plus bas : titre collant
 * colonnes 1-4 (72 px ; lignes de 327, 290 et 225 px), questions colonnes 6-12
 * (x 620 à 1380). @390 : photo 4:5 (390 × 488), titre en plein 44 px.
 */
.cap-practical {
  --pad: max(var(--page-gutter), (100cqi - var(--content-max)) / 2);
  /* Titre : 44 px à 390 → 120 px à 1440 (39 px à 320 : la ligne tient). */
  --fs-plein: clamp(2.25rem, 0.986rem + 7.238vw, 7.5rem);
  /* « à [Commune]. » : plein à la même taille, puis délié à 0,8 (96 px à 1440). */
  --fs-commune: var(--fs-plein);
  /* Ligne de base finale à 48 px du bas de la photo (24 px à 390). */
  --title-bottom: clamp(1.5rem, 0.943rem + 2.286vw, 3rem);

  container-type: inline-size;
  background: var(--cf-carbone);
  color: var(--cf-craie);
}

/* ── Photo d'ouverture ────────────────────────────────────────────────────── */
.cap-practical__cover {
  display: grid;
}

.cap-practical__cover > * {
  grid-area: 1 / 1;
}

.cap-practical__photo {
  inline-size: 100%;
  aspect-ratio: 4 / 5;
}

/* Posé sur la zone sombre du bas de la photo (p95 de Y ≤ 0,12 sous le titre). */
.cap-practical__head {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: last baseline;
  align-self: end;
  gap: 0.75rem var(--gap);
  padding-inline: var(--pad);
  padding-block-end: var(--title-bottom);
}

.cap-practical__title {
  margin: 0;
  color: var(--cf-craie);
}

.cap-practical__line {
  display: block;
}

.cap-practical__line--plein {
  font-size: var(--fs-plein);
  font-stretch: 75%;
  line-height: 0.86;
  letter-spacing: -0.005em;
}

/*
 * L'inconnu, sous 64em : plein craie souligné en pointillé. La capitale
 * accentuée (À) demande un interligne de 0,92.
 */
.cap-practical__line--commune {
  font-size: var(--fs-commune);
  font-stretch: 75%;
  line-height: 0.92;
  letter-spacing: -0.005em;
  text-decoration: underline dashed var(--cf-pointille);
  text-decoration-thickness: 2px;
  text-decoration-skip-ink: none;
  text-underline-offset: 0.08em;
}

.cap-practical__commune {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-small); /* 14 → 15 */
  font-weight: 500;
  line-height: 1.4;
}

/* ── Corps, sur carbone ───────────────────────────────────────────────────── */
.cap-practical__body {
  /* 64 px à 390 → 96 px à 1440 sous la photo ; --pad-l en bas. */
  padding: clamp(4rem, 3.257rem + 3.048vw, 6rem) var(--pad) var(--pad-l);
}

.cap-practical__sheet {
  row-gap: clamp(3rem, 2.629rem + 1.524vw, 4rem); /* 48 → 64 */
  align-items: start;
}

.cap-practical__block {
  grid-column: 1 / -1;
  min-inline-size: 0;
}

/* Titre de bloc : CAP Display 80 %, 24 → 32 px, capitales sans approche ajoutée. */
.cap-practical__block-title {
  margin: 0 0 clamp(1.25rem, 1.157rem + 0.381vw, 1.5rem); /* 20 → 24 */
  font-size: var(--text-block);
  font-stretch: var(--wdth-plein);
  line-height: 1;
  letter-spacing: 0;
}

/* Rangées de fiche : filets graphite, étiquette en gris, valeur en craie. */
.cap-practical__rows {
  margin: 0;
  border-block-start: 1px solid var(--cf-graphite);
}

.cap-practical__row {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  min-block-size: 3rem;
  padding-block: 0.625rem;
  border-block-end: 1px solid var(--cf-graphite);
}

.cap-practical__label {
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: var(--text-small); /* 14 → 15 */
  font-weight: 500;
  line-height: 1.4;
}

.cap-practical__value {
  margin: 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 500;
  line-height: 1.4;
  text-align: end;
}

/* Accueil : jours et horaires en donnée, 16 → 18 px, chiffres tabulaires. */
.cap-practical__day,
.cap-practical__hours {
  font-family: var(--font-display);
  font-size: clamp(1rem, 0.954rem + 0.19vw, 1.125rem);
  font-weight: 900;
  line-height: 1;
}

.cap-practical__hours {
  white-space: nowrap;
  /* Les tirets de CAP Display 75 % sont serrés : la place vide se lit mieux aérée. */
  word-spacing: 0.3em;
}

.cap-practical__sentence {
  display: block;
}

.cap-practical__note {
  max-inline-size: 34em;
  margin: 1rem 0 0;
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 500;
  line-height: 1.5;
  text-wrap: pretty;
}

/* ── Formules : tableau (dl sous 30em) ────────────────────────────────────── */
.cap-practical__table {
  inline-size: 100%;
  border-collapse: collapse;
}

.cap-practical__th {
  padding: 0 0 0.625rem;
  border-block-end: 1px solid var(--cf-graphite);
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 500;
  line-height: 1.4;
  text-align: start;
}

.cap-practical__th--prix {
  text-align: end;
}

.cap-practical__table .cap-practical__tr > * {
  padding-block: 1rem;
  border-block-end: 1px solid var(--cf-graphite);
  vertical-align: top;
}

.cap-practical__formule {
  padding-inline-end: 1rem;
  text-align: start;
}

.cap-practical__nom {
  display: block;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-body); /* 16 → 18 */
  font-weight: 600;
  line-height: 1.3;
}

.cap-practical__detail {
  display: block;
  margin-block-start: 0.25rem;
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: var(--text-small); /* 14 → 15 */
  font-weight: 400;
  line-height: 1.4;
}

.cap-practical__prix {
  margin: 0;
  text-align: end;
  white-space: nowrap;
}

.cap-practical__montant {
  display: block;
  color: var(--cf-craie);
  font-size: var(--text-data); /* 20 → 32 */
}

.cap-practical__tarif {
  display: inline-block;
  margin-block-start: 0.5rem;
  font-size: var(--text-small);
  line-height: 1.4;
}

.cap-practical__formules-dl {
  display: none;
  margin: 0;
  border-block-start: 1px solid var(--cf-graphite);
}

/* ── Avant ton premier cours ──────────────────────────────────────────────── */
.cap-practical__faq {
  row-gap: clamp(1.5rem, 1.129rem + 1.524vw, 2.5rem); /* 24 → 40 */
  align-items: start;
  margin-block-start: var(--pad-l); /* 64 → 120 */
}

.cap-practical__faq > * {
  grid-column: 1 / -1;
}

/* Le seul titre en minuscules de la page : plein craie, 44 → 72 px. */
.cap-practical__faq-title {
  margin: 0;
  color: var(--cf-craie);
  font-size: clamp(2.75rem, 2.1rem + 2.667vw, 4.5rem);
  font-stretch: 75%;
  line-height: 0.92;
  letter-spacing: -0.005em;
  text-transform: none;
}

.cap-practical__faq-line {
  display: block;
}

.cap-practical__faq-list {
  border-block-start: 1px solid var(--cf-graphite);
}

.cap-practical__item {
  border-block-end: 1px solid var(--cf-graphite);
}

.cap-practical__question {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  min-block-size: 72px;
  padding-block: 1rem;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: clamp(1.125rem, 1.079rem + 0.19vw, 1.25rem); /* 18 → 20 */
  font-weight: 600;
  line-height: 1.3;
  list-style: none;
  cursor: pointer;
}

.cap-practical__question::-webkit-details-marker {
  display: none;
}

.cap-practical__question-text {
  text-wrap: pretty;
}

/* Carré indicateur : contour fermé, plein citron ouvert (code d'état du logo). */
.cap-practical__item[open] .cap-practical__square {
  border-color: var(--cf-citron);
  background: var(--cf-citron);
}

@media (hover: hover) {
  .cap-practical__question:hover .cap-practical__square {
    border-color: var(--cf-citron);
  }
}

.cap-practical__answer {
  padding-block-end: 1.5rem;
}

.cap-practical__answer-text {
  max-inline-size: 34em;
  margin: 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-body); /* 16 → 18 */
  font-weight: 400;
  line-height: 1.5; /* 18/27 */
  text-wrap: pretty;
}

/*
 * Ouverture douce, là où le navigateur anime vers `auto` (::details-content et
 * interpolate-size) ; ailleurs, sans JS ou en mouvement réduit : instantanée.
 * Fermeture en 0,65 × l'ouverture. Un navigateur qui connaît interpolate-size
 * sans ::details-content ignore simplement les deux dernières règles.
 * (Pas de `selector(::details-content)` dans la condition : autoprefixer ne
 * sait pas l'analyser et fait échouer la feuille.)
 */
@supports (interpolate-size: allow-keywords) {
  html.has-motion .cap-practical__item {
    interpolate-size: allow-keywords;
  }

  html.has-motion .cap-practical__item::details-content {
    block-size: 0;
    overflow-y: clip;
    transition:
      block-size calc(var(--dur-layout) * 0.65) var(--ease-in-out),
      content-visibility calc(var(--dur-layout) * 0.65) allow-discrete;
  }

  html.has-motion .cap-practical__item[open]::details-content {
    block-size: auto;
    transition-duration: var(--dur-layout);
  }
}

/* ── Tablette : accès et accueil côte à côte, formules dessous ────────────── */
@media (min-width: 48em) {
  .cap-practical__photo {
    aspect-ratio: 21 / 9;
    min-block-size: 24rem;
  }

  .cap-practical__line--plein,
  .cap-practical__line--commune,
  .cap-practical__faq-title {
    font-stretch: var(--wdth-plein);
  }

  .cap-practical__sheet > .cap-practical__block--acces {
    grid-column: 1 / 5;
  }

  .cap-practical__sheet > .cap-practical__block--accueil {
    grid-column: 5 / -1;
  }
}

/* ── Ordinateur : trois colonnes, titre de la FAQ collant ─────────────────── */
@media (min-width: 64em) {
  /* Le délié : 125 %, 0,8 fois le plein (96 px à 1440), au contour craie. */
  .cap-practical {
    --fs-commune: calc(var(--fs-plein) * 0.8);
  }

  .cap-practical__line--commune {
    font-stretch: 125%;
    line-height: 0.92;
    letter-spacing: 0.01em;
    text-decoration: none;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: max(2px, 0.04em) currentcolor;
  }

  /*
   * Ligne de base de « à [Commune]. » : 0,191 em au-dessus du bas de sa ligne
   * (interligne 0,92, mesuré dans Chromium avec le fichier servi).
   */
  .cap-practical__head {
    padding-block-end: calc(var(--title-bottom) - var(--fs-commune) * 0.191);
  }

  .cap-practical__sheet > .cap-practical__block--acces {
    grid-column: 1 / 5;
  }

  .cap-practical__sheet > .cap-practical__block--accueil {
    grid-column: 5 / 9;
  }

  .cap-practical__sheet > .cap-practical__block--formules {
    grid-column: 9 / -1;
  }

  .cap-practical__faq {
    margin-block-start: var(--pad-l);
  }

  .cap-practical__faq > .cap-practical__faq-title {
    position: sticky;
    inset-block-start: 120px;
    grid-column: 1 / 5;
  }

  .cap-practical__faq > .cap-practical__faq-list {
    grid-column: 6 / -1;
  }
}

/* ── Zoom à 400 % (320 px) : le tableau devient une liste de définitions ──── */
@media (max-width: 30em) {
  .cap-practical__table {
    display: none;
  }

  .cap-practical__formules-dl {
    display: block;
  }

  .cap-practical__formules-dl .cap-practical__tr {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    justify-content: space-between;
    padding-block: 1rem;
    border-block-end: 1px solid var(--cf-graphite);
  }

  .cap-practical__formules-dl .cap-practical__formule {
    padding-inline-end: 0;
  }
}

/* ── Contrastes forcés : le délié devient plein, les filets restent ───────── */
@media (forced-colors: active) {
  .cap-practical__line--commune {
    -webkit-text-fill-color: CanvasText;
    -webkit-text-stroke: 0;
    text-decoration-color: CanvasText;
  }

  .cap-practical__item[open] .cap-practical__square {
    border-color: CanvasText;
    background: CanvasText;
  }
}
</style>
