<script setup lang="ts">
import { cap } from '~/data/cap';
import { motionAllowed } from '~/motion/env';
import { duration } from '~/motion/tokens';
import type { Course, Session } from '~/types/cap';
import { formatHeure, jourCourt, toMinutes, type ParisNow } from '~/utils/cap-time';

/**
 * Un cours (brief §4.4) : `<article id="cours-{slug}">`, en-tête d'accordéon et
 * fiche (motif APG « accordion » : `<h4><button aria-expanded aria-controls>`,
 * panneau role="region").
 *
 * Le nom se compose selon le rythme du cours : plein craie pour le cardio et la
 * force, délié craie pour le retour au calme (plein sous 64em : un délié de
 * moins de 64 px est interdit). C'est un renfort visuel : l'intensité est
 * toujours écrite en texte, sous le nom.
 *
 * Le carré de 10 px qui suit le nom, centré sur la hauteur de ses capitales,
 * porte le code d'état du logo : contour = fiche fermée, plein citron = ouverte.
 * Ce n'est pas le seul indice : une ligne d'action visible, « Voir le cours + »
 * (« Fermer − » une fois ouvert), dit que la fiche s'ouvre, et toute la rangée
 * (nom, créneaux, intensité, action) l'ouvre au toucher. Le bouton du titre
 * reste la commande au clavier et pour les lecteurs d'écran ; la ligne d'action
 * le double à la souris et au doigt, elle est masquée aux technologies d'aide.
 *
 * Intensité : une jauge de cinq traits (pleins ou en contour, comme le carré),
 * puis le mot (« soutenue ») ; « 4 sur 5 » est lu par les lecteurs d'écran.
 *
 * Accordéon non exclusif : chaque fiche s'ouvre et se ferme seule.
 * - Sans JS : toutes les fiches ouvertes (CapCourseSheet) ; le HTML servi le dit
 *   (`aria-expanded="true"`, carré plein). Avec JS, un script en ligne de
 *   CapCourses repasse l'attribut à `false` avant l'hydratation, différée : le
 *   serveur ne peut pas savoir si le JS est actif.
 * - Avec JS : fermées dès le premier rendu ; à l'hydratation, une fiche fermée
 *   reçoit `hidden="until-found"` (recherche dans la page), sans transition.
 * - Fermeture : la fiche reste rendue le temps de sa transition (0,65 ×
 *   l'ouverture), puis repasse en `hidden="until-found"`.
 *
 * Emplacements : `media` (la photo pleine largeur d'un cours cardio, hors scène
 * collante) et `baseline` (un tracé posé sur la ligne de base du nom : sa
 * position verticale est celle de la ligne de base ; ses bords sont ceux du
 * premier ancêtre positionné, le bloc du groupe).
 */
const props = defineProps<{
  course: Course;
  /** Créneaux du cours, triés (jour puis heure) ; vide : « à confirmer ». */
  sessions: Session[];
  /** Heure de Paris, partagée par la section ; undefined au rendu serveur. */
  now?: ParisNow;
  /**
   * Ouvert au premier rendu : le premier cours de chaque groupe, pour montrer
   * d'emblée qu'une fiche existe et ce qu'elle contient.
   */
  initialOpen?: boolean;
}>();

const cs = cap.courseSection;
const NBSP = '\u00a0';
const SEP = `${NBSP}· `;
/** Une sortie va plus vite que l'entrée qu'elle défait (§5.2). */
const EXIT = 0.65;

const headId = `cours-${props.course.slug}-bouton`;
const panelId = `cours-${props.course.slug}-fiche`;
const calme = props.course.groupe === 'calme';

/** Écart au plus, en minutes, entre deux créneaux qui s'enchaînent (Cardio Jump : 45 min). */
const CHAINED = 120;

/**
 * Créneaux à droite du nom, en donnée : « lun. 18 h 15 · 19 h 00 ». Le jour
 * n'est pas répété pour deux créneaux qui s'enchaînent, à 2 h au plus ; midi et
 * soir le répètent : « mer. 12 h 15 · mer. 19 h 00 · ven. 19 h 00 » (§4.4 3b).
 */
const slots = props.sessions
  .map((session, index) => {
    const time = formatHeure(session.start);
    const prev = props.sessions[index - 1];
    const follows =
      prev?.day === session.day && toMinutes(session.start) - toMinutes(prev.start) <= CHAINED;
    return follows ? time : `${jourCourt(session.day)}${NBSP}${time}`;
  })
  .join(SEP);

/** Intensité : jauge visuelle, le mot en texte, la valeur pour les lecteurs d'écran (WCAG 1.4.1). */
const { valeur, mot } = props.course.intensite;
const GAUGE = [1, 2, 3, 4, 5] as const;

/* ── État de l'accordéon ─────────────────────────────────────────────────── */
const open = ref(props.initialOpen ?? false);
const enhanced = ref(false);
const closing = ref(false);
/** Coupe les transitions le temps d'un changement immédiat (montage, recherche). */
const instant = ref(true);
const concealed = computed(() => enhanced.value && !open.value && !closing.value);
/**
 * État annoncé par le bouton. Avant le montage, la fiche est ouverte sans JS
 * (rien ne la ferme) : `true`. Avec JS, le script en ligne l'a déjà ramené à
 * `false` dans le DOM ; l'écart avec ce premier rendu est attendu
 * (`data-allow-mismatch`), et `enhanced` le résorbe au montage.
 */
const expanded = computed(() => open.value || !enhanced.value);
let closeTimer: ReturnType<typeof setTimeout> | undefined;

/** Le changement suivant se fait sans transition, puis elles reviennent. */
async function withoutTransition(change: () => void) {
  instant.value = true;
  change();
  await nextTick();
  // Le style est recalculé avec les transitions coupées, avant de les rétablir.
  document.body.getBoundingClientRect();
  instant.value = false;
}

function toggle() {
  clearTimeout(closeTimer);
  if (!open.value) {
    closing.value = false;
    open.value = true;
    return;
  }
  open.value = false;
  const hold = motionAllowed() ? duration('--dur-layout') * EXIT * 1000 : 0;
  if (!hold) return;
  closing.value = true;
  closeTimer = setTimeout(() => (closing.value = false), hold);
}

/**
 * Toute la rangée ouvre la fiche au pointeur. Le bouton du titre se gère seul ;
 * un lien de la rangée garde son rôle.
 */
function onRowClick(event: MouseEvent) {
  if ((event.target as Element).closest('button, a')) return;
  toggle();
}

/** `beforematch` : la recherche dans la page a trouvé un mot de la fiche fermée. */
function reveal() {
  clearTimeout(closeTimer);
  withoutTransition(() => {
    closing.value = false;
    open.value = true;
  });
}

// À l'hydratation, une fiche fermée passe de « sans boîte » (CSS) à `hidden="until-found"` :
// rien ne s'anime, les transitions peuvent revenir aussitôt.
onMounted(() => {
  enhanced.value = true;
  instant.value = false;
});
onBeforeUnmount(() => clearTimeout(closeTimer));
</script>

<template>
  <article
    :id="`cours-${course.slug}`"
    class="cap-course"
    :class="[`cap-course--${course.groupe}`, { 'is-open': open }]"
    :data-slug="course.slug"
  >
    <slot name="media" />

    <!--
      La rangée entière ouvre la fiche au pointeur (onRowClick). Au clavier et pour
      les lecteurs d'écran, la commande est le bouton du titre : la rangée n'est
      pas focalisable, d'où l'exception aux deux règles ci-dessous.
    -->
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
    <div class="cap-course__summary" @click="onRowClick">
      <div class="cap-course__head">
        <h4 class="cap-course__heading">
          <button
            :id="headId"
            type="button"
            class="cap-course__button"
            :aria-expanded="expanded"
            :aria-controls="panelId"
            data-accordion-head
            data-allow-mismatch="attribute"
            @click="toggle"
          >
            <span class="cap-course__name cap-display">{{ course.nom }}</span>
            <span
              class="cap-course__square cap-square"
              :class="{ 'is-on': open }"
              aria-hidden="true"
            />
            <span class="visually-hidden">{{ cs.fiche }}</span>
          </button>
        </h4>
        <span v-if="$slots.baseline" class="cap-course__baseline"><slot name="baseline" /></span>
        <span v-if="course.sousTitre" class="cap-course__sub">{{ course.sousTitre }}</span>
        <p v-if="sessions.length && !calme" class="cap-course__slots cap-data">{{ slots }}</p>
      </div>

      <p v-if="course.phrase" class="cap-course__phrase">{{ course.phrase }}</p>
      <p class="cap-course__intensity">
        <span class="cap-course__intensity-label">{{ cs.intensite }}</span>
        <span class="cap-course__gauge" aria-hidden="true"
          ><span
            v-for="step in GAUGE"
            :key="step"
            class="cap-course__gauge-step"
            :class="{ 'is-on': step <= valeur }"
        /></span>
        <span class="cap-course__intensity-word">{{ mot }}</span
        ><span class="visually-hidden">, {{ valeur }} {{ cs.surCinq }}</span>
      </p>
      <p v-if="!sessions.length" class="cap-course__pending">
        <CapPending :text="cs.aConfirmer" />
      </p>
      <p class="cap-course__toggle" aria-hidden="true">
        <span class="cap-course__toggle-text">{{ open ? cs.fermer : cs.voir }}</span>
        <span class="cap-course__toggle-sign">{{ open ? '−' : '+' }}</span>
      </p>
    </div>

    <CapCourseSheet
      class="cap-course__sheet"
      :course="course"
      :sessions="sessions"
      :now="now"
      :head-id="headId"
      :panel-id="panelId"
      :open="open"
      :closing="closing"
      :concealed="concealed"
      :instant="instant"
      @reveal="reveal"
    />
  </article>
</template>

<style scoped>
/*
 * Aucun ancêtre positionné ici : le tracé de l'emplacement `baseline` prend
 * pour bords ceux du bloc du groupe (CapCourses), au bord de l'écran.
 */
.cap-course {
  --name-size: var(--text-h3);

  display: block;
}

/* ── En-tête : nom (bouton), puis données sur la même ligne de base ───────── */
.cap-course__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px clamp(1rem, 0.629rem + 1.524vw, 2rem);
}

.cap-course__heading {
  margin: 0;
  min-inline-size: 0;
}

.cap-course__button {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: baseline;
  gap: max(6px, 0.11em);
  max-inline-size: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  color: var(--ink);
  font-size: var(--name-size);
  text-align: start;
  cursor: pointer;
}

.cap-course__name {
  font-stretch: 75%;
  letter-spacing: -0.005em;
  line-height: 0.92;
  /*
   * Chaque nom tient sur une ligne à toutes les largeurs ; s'il s'élargit
   * (espacement du texte, WCAG 1.4.12), « Cross training » revient à la ligne
   * entre ses deux mots au lieu de déborder.
   */
  white-space: normal;
}

/* Survol : le contour du carré passe au citron (le remplissage reste l'état ouvert). */
@media (hover: hover) and (pointer: fine) {
  .cap-course__summary:hover .cap-course__square:not(.is-on) {
    border-color: var(--cf-citron);
  }
}

/*
 * Centré sur la hauteur de capitale (0,68 em) : la boîte du bouton est plus
 * haute que les capitales, d'où la remontée de 0,06 em (calée sur --name-size,
 * dont le carré hérite). Posé sur la ligne de base, il se lisait comme un point.
 */
.cap-course__square {
  align-self: center;
  translate: 0 -0.06em;
}

/* Sans JS, toutes les fiches sont ouvertes : le carré le dit (plein citron). */
html:not(.js) .cap-course__square {
  border-color: var(--cf-citron);
  background: var(--cf-citron);
}

/* Ancre de ligne de base : un point sans taille, aligné sur celle du nom. */
.cap-course__baseline {
  display: block;
  flex: none;
  inline-size: 0;
  block-size: 0;
  align-self: baseline;
}

.cap-course__sub {
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.2;
}

/* Chaque créneau est lié par des espaces insécables ; la ligne ne se coupe qu'après un « · ». */
.cap-course__slots {
  margin: 0;
  min-inline-size: 0;
  color: var(--ink);
  font-size: clamp(1.25rem, 1.064rem + 0.762vw, 1.75rem);
  line-height: 1.1;
}

.cap-course__phrase {
  margin: 12px 0 0;
  max-inline-size: 40ch;
  color: var(--ink-muted);
  font-size: var(--text-body);
  line-height: var(--leading-body);
  text-wrap: pretty;
}

/* Avec JS, toute la rangée ouvre la fiche : le pointeur le dit. */
html.js .cap-course__summary {
  cursor: pointer;
}

/* Intensité : « Intensité », la jauge (5 traits, pleins jusqu'à la valeur), le mot. */
.cap-course__intensity {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  align-items: center;
  margin: 10px 0 0;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 500;
  line-height: 1.4;
}

.cap-course__intensity-label {
  color: var(--ink-muted);
}

.cap-course__gauge {
  display: inline-flex;
  gap: 3px;
}

.cap-course__gauge-step {
  inline-size: 14px;
  block-size: 6px;
  border: 1px solid var(--cf-filet);
}

.cap-course__gauge-step.is-on {
  border-color: var(--cf-citron);
  background: var(--cf-citron);
}

/*
 * Ligne d'action, visible : « Voir le cours + » / « Fermer − », au style des liens
 * (souligné citron), sur une cible de 44 px. Sans JS, toutes les fiches sont
 * ouvertes et rien ne les ferme : la ligne n'a pas lieu d'être.
 */
.cap-course__toggle {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  min-block-size: 44px;
  margin: 4px 0 0;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

html:not(.js) .cap-course__toggle {
  display: none;
}

.cap-course__toggle-text {
  text-decoration: underline;
  text-decoration-color: var(--cf-citron);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

.cap-course__toggle-sign {
  display: inline-grid;
  place-items: center;
  inline-size: 22px;
  block-size: 22px;
  border: 1px solid var(--cf-citron);
  color: var(--cf-citron);
  font-size: 1rem;
  line-height: 1;
}

@media (hover: hover) and (pointer: fine) {
  .cap-course__summary:hover .cap-course__toggle-text {
    text-decoration-thickness: 2px;
  }
}

@media (forced-colors: active) {
  .cap-course__gauge-step.is-on {
    background: CanvasText;
  }

  .cap-course__toggle-sign {
    border-color: CanvasText;
    color: CanvasText;
  }
}

.cap-course__pending {
  margin: 6px 0 0;
  font-size: var(--text-small);
  line-height: 1.4;
}

/* Force : la colonne est étroite, les créneaux passent sous le nom. */
.cap-course--force .cap-course__slots {
  flex-basis: 100%;
}

/*
 * Le nom tient toujours dans sa colonne : sa taille est bornée par la largeur de
 * l'article (conteneur), au même pas pour tout le groupe. Mesuré en plein 80 % :
 * « Cardio Jump » 5,96 em, « Cross training » 7,40 em, plus le carré (0,11 em
 * d'écart et 10 px). Pas de conteneur pour le calme : son tracé prend pour bords
 * ceux du bloc du groupe.
 */
.cap-course--cardio,
.cap-course--force {
  container-type: inline-size;
}

.cap-course--cardio {
  --name-size: min(var(--text-h3), (100cqi - 12px) / 6.1);
}

.cap-course--force {
  --name-size: min(var(--text-h3), (100cqi - 12px) / 7.55);
}

@media (min-width: 48em) {
  .cap-course__name {
    font-stretch: var(--wdth-plein);
  }
}

/* ── Retour au calme : délié craie 150 %, 80 px (plein 75 %, 44 px sur mobile) ── */
.cap-course--calme {
  --name-size: clamp(2.75rem, 1.914rem + 3.429vw, 5rem);
}

@media (max-width: 47.99em) {
  .cap-course--calme {
    --name-size: min(
      clamp(2.75rem, 1.914rem + 3.429vw, 5rem),
      (100vw - 2 * var(--page-gutter)) / 5.3
    );
  }
}

@media (min-width: 64em) {
  .cap-course--calme .cap-course__name {
    color: var(--cf-craie);
    font-stretch: var(--wdth-delie);
    letter-spacing: 0.01em;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: max(2px, 0.04em) currentcolor;
    paint-order: stroke fill;
  }
}

/*
 * À partir de 48em, le tracé posé sur la ligne de base passe derrière le nom :
 * le bouton, au fond de la surface, l'interrompt à 8 px de chaque bord du mot.
 */
@media (min-width: 48em) {
  .cap-course--calme .cap-course__button {
    /* La borne rend les 16 px des marges négatives : le fond couvre aussi le carré. */
    max-inline-size: calc(100% + 16px);
    margin-inline: -8px;
    padding-inline: 8px;
    background: var(--bg);
  }
}

@media (forced-colors: active) {
  .cap-course--calme .cap-course__name {
    -webkit-text-fill-color: CanvasText;
    -webkit-text-stroke: 0;
  }

  html:not(.js) .cap-course__square {
    border-color: CanvasText;
    background: CanvasText;
  }
}
</style>
