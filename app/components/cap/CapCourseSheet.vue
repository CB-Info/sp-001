<script setup lang="ts">
import { cap } from '~/data/cap';
import type { Course, Session } from '~/types/cap';
import {
  formatHeure,
  jourCourt,
  jourLong,
  parisNow,
  prochainCours,
  toMinutes,
  type ParisNow,
} from '~/utils/cap-time';

/**
 * La fiche d'un cours (brief §4.4, « Contenu d'une fiche ») : le panneau de
 * l'accordéon, piloté par CapCourseItem (motif APG : role="region", nommé par
 * le bouton de son en-tête).
 *
 * États :
 * - sans JS, toutes les fiches sont ouvertes (aucune règle ne les ferme) ;
 * - avec JS, une fiche fermée n'a pas de boîte dès le premier rendu, avant même
 *   l'hydratation (html.js) : aucun saut de mise en page, aucun lien caché qui
 *   recevrait le focus. Une fois hydratée, elle porte `hidden="until-found"` :
 *   la recherche dans la page la trouve, et `beforematch` l'ouvre ;
 * - l'ouverture fait passer la rangée de grille de 0fr à 1fr (aucune mesure en
 *   JS), puis les éléments suivent en fondu, décalés ; la fermeture va plus vite
 *   (0,65 × l'ouverture). En mouvement réduit, tout change sur place.
 *
 * Données temps réel : le prochain créneau est calculé à l'heure de Paris
 * (`now`, posé après le montage). Au rendu serveur, la ligne est neutre
 * (« Créneau : mar. 17 h 15 »), identique au premier rendu client.
 *
 * Accessibilité : fermée (`hidden="until-found"`), la fiche n'a ni rôle ni nom.
 * Chromium garde la boîte d'un panneau `until-found` dans l'arbre : avec son
 * rôle, chaque fiche fermée resterait un repère « region » vide.
 */
const props = defineProps<{
  course: Course;
  /** Créneaux du cours, triés (jour puis heure). */
  sessions: Session[];
  /** Heure de Paris ; undefined au rendu serveur et au premier rendu client. */
  now?: ParisNow;
  headId: string;
  panelId: string;
  open: boolean;
  /** La fiche se referme : elle reste rendue jusqu'à la fin de sa transition. */
  closing: boolean;
  /** Fermée et transition finie : `hidden="until-found"`. */
  concealed: boolean;
  /** Changement immédiat (montage, recherche dans la page) : pas de transition. */
  instant: boolean;
}>();

const emit = defineEmits<{ reveal: [] }>();

const cs = cap.courseSection;
const NBSP = '\u00a0';
/** Séparateur des créneaux : le point médian reste lié à ce qui le précède. */
const SEP = `${NBSP}· `;

/** Intitulé de la rangée : singulier pour un seul créneau, pluriel sinon (« Créneaux à confirmer »). */
const slotsLabel = props.sessions.length === 1 ? cs.creneau : cs.creneaux;

const when = (session: Session) => `${jourCourt(session.day)}${NBSP}${formatHeure(session.start)}`;

/** « Intensité indicative : calme · 1 sur 5 », suivie du repère (§6). */
const intensity = `${cs.intensite}${NBSP}: ${props.course.intensite.mot}${SEP}${props.course.intensite.valeur}${NBSP}${cs.surCinq.replaceAll(' ', NBSP)}`;

/**
 * Une valeur « à confirmer » : le segment inconnu (« Durée à confirmer »,
 * « nombre de places à confirmer ») passe dans CapPending, souligné en
 * pointillé ; le reste de la phrase garde son style.
 */
const PENDING = new RegExp(`[^.;:()]*${cap.ui.pending}`);
function parts(value: string) {
  const match = PENDING.exec(value);
  if (!match) return { before: value, pending: '', after: '' };
  const lead = match[0].length - match[0].trimStart().length;
  const start = match.index + lead;
  const end = match.index + match[0].length;
  return {
    before: value.slice(0, start),
    pending: value.slice(start, end),
    after: value.slice(end),
  };
}

const fields = computed(() =>
  props.course.champs.map((field) => ({
    ...field,
    parts: field.statut === 'a-confirmer' ? parts(field.valeur) : undefined,
  })),
);

/** « Ajouter le Step du mardi, 17 h 15 à mon agenda » : le nom accessible complet du lien. */
const agendaName = (session: Session) =>
  cs.ajouter
    .replace('{cours}', props.course.nom)
    .replace('{jour}', jourLong(session.day))
    .replace('{heure}', formatHeure(session.start));

/**
 * Prochain créneau, à l'heure de Paris : « Prochain créneau : mardi 17 h 15 ».
 * Au rendu serveur : « Créneau : mar. 17 h 15 » (ou tous les créneaux, s'il y en
 * a plusieurs).
 *
 * Quand le prochain créneau retombe sur le jour même, mais la semaine suivante
 * (le dernier du jour a déjà commencé), « mercredi 18 h 00 » se lirait
 * « aujourd'hui, déjà passé » : la ligne écrit « mercredi prochain 18 h 00 »,
 * comme la ligne de choix de #reserver (CapBook).
 */
const next = computed(() => {
  const now = props.now;
  const found = now && prochainCours(props.sessions, now);
  if (found && now) {
    const { session } = found;
    const nextWeek = session.day === now.day && toMinutes(session.start) <= now.minutes;
    const prochain = nextWeek ? `${NBSP}${cap.ui.jourProchain}` : '';
    return {
      label: cs.prochain,
      value: `${jourLong(session.day)}${prochain}${NBSP}${formatHeure(session.start)}`,
    };
  }
  return {
    label: props.sessions.length > 1 ? cs.creneaux : cs.creneau,
    value: props.sessions.map(when).join(SEP),
  };
});

/*
 * « Réserver ce cours » enregistre le choix pour #reserver (CapBook) : la
 * prochaine occurrence du cours, calculée au moment du clic. Le lien garde son
 * comportement natif (ancre), avec ou sans JS.
 */
const choice = useState<string | null>('cap-choix', () => null);
function choose() {
  const found = prochainCours(props.sessions, parisNow());
  choice.value = (found?.session ?? props.sessions[0])?.id ?? null;
}
</script>

<template>
  <div
    class="cap-sheet"
    :data-open="open || undefined"
    :data-closing="closing || undefined"
    :data-instant="instant || undefined"
  >
    <div
      :id="panelId"
      class="cap-sheet__panel"
      :role="concealed ? undefined : 'region'"
      :aria-labelledby="concealed ? undefined : headId"
      :hidden.attr="concealed ? 'until-found' : undefined"
      @beforematch="emit('reveal')"
    >
      <div class="cap-sheet__body">
        <p class="cap-sheet__accroche cap-sheet__el" style="--i: 0">{{ course.accroche }}</p>
        <p class="cap-sheet__texte cap-sheet__el" style="--i: 1">{{ course.texte }}</p>

        <dl class="cap-sheet__fields cap-sheet__el" style="--i: 2">
          <div v-for="field in fields" :key="field.label" class="cap-sheet__field">
            <dt class="cap-sheet__label">{{ field.label }}</dt>
            <dd v-if="field.parts" class="cap-sheet__value">
              {{ field.parts.before }}<CapPending :text="field.parts.pending" />{{
                field.parts.after
              }}
            </dd>
            <dd v-else class="cap-sheet__value">{{ field.valeur }}</dd>
          </div>
          <div class="cap-sheet__field">
            <dt class="cap-sheet__label">{{ slotsLabel }}</dt>
            <dd class="cap-sheet__value">
              <ul v-if="sessions.length" role="list" class="cap-sheet__slots">
                <li v-for="session in sessions" :key="session.id" class="cap-sheet__slot">
                  <span class="cap-sheet__when cap-data">{{ when(session) }}</span>
                  <a
                    class="cap-sheet__agenda cap-link"
                    :href="`/v2/agenda/${session.id}.ics`"
                    download
                    :aria-label="agendaName(session)"
                    >{{ cap.ui.agenda }}</a
                  >
                </li>
              </ul>
              <CapPending v-else :text="cap.ui.pending" />
            </dd>
          </div>
        </dl>

        <p class="cap-sheet__intensite cap-sheet__el" style="--i: 3">
          {{ intensity }}{{ SEP }}<CapPending :text="cs.repere" />
        </p>

        <div v-if="sessions.length" class="cap-sheet__actions cap-sheet__el" style="--i: 4">
          <p class="cap-sheet__next">
            <span class="cap-sheet__next-label">{{ next.label }}{{ NBSP }}:</span>
            {{ ' ' }}
            <span class="cap-sheet__next-value cap-data">{{ next.value }}</span>
          </p>
          <a class="cap-sheet__reserve cap-link" href="#reserver" @click="choose"
            >{{ cs.reserver }}<span class="visually-hidden">, {{ course.nom }}</span></a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * Hauteur : grille 0fr → 1fr. Sans JS, 1fr : la fiche est ouverte. Avec JS (dès
 * le premier rendu, avant l'hydratation), une fiche fermée passe à 0fr et son
 * panneau n'a pas de boîte tant que l'hydratation ne lui a pas donné
 * `hidden="until-found"` (qui le garde trouvable par la recherche).
 */
.cap-sheet {
  --sheet-open: var(--dur-layout);
  --sheet-close: calc(var(--dur-layout) * 0.65);

  display: grid;
  grid-template-rows: 1fr;
}

html.js .cap-sheet:not([data-open]) {
  grid-template-rows: 0fr;
}

html.js .cap-sheet:not([data-open], [data-closing]) > .cap-sheet__panel:not([hidden]) {
  display: none;
}

.cap-sheet__panel {
  min-block-size: 0;
  overflow: hidden;
}

/* Conteneur de requête : la fiche se compose selon sa propre largeur (56rem au plus). */
.cap-sheet__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  max-inline-size: 56rem;
  gap: clamp(1.25rem, 1.064rem + 0.762vw, 1.75rem);
  justify-items: start;
  padding-block: clamp(1.25rem, 0.971rem + 1.143vw, 2rem) clamp(0.5rem, 0.314rem + 0.762vw, 1rem);
  container-type: inline-size;
}

.cap-sheet__accroche {
  margin: 0;
  max-inline-size: 32ch;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: var(--text-lead);
  font-weight: 500;
  line-height: 1.3;
  text-wrap: balance;
}

.cap-sheet__texte {
  margin: 0;
  max-inline-size: 60ch;
  color: var(--ink);
  font-size: var(--text-body);
  line-height: var(--leading-body);
  text-wrap: pretty;
}

/* ── Champs : intitulé Figtree 600 14 px, valeur 17 px, craie ─────────────── */
.cap-sheet__fields {
  display: grid;
  inline-size: 100%;
  margin: 0;
  border-block-start: 1px solid var(--rule);
}

.cap-sheet__field {
  display: grid;
  gap: 4px;
  padding-block: 12px;
  border-block-end: 1px solid var(--rule);
}

.cap-sheet__label {
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.cap-sheet__value {
  margin: 0;
  max-inline-size: 60ch;
  color: var(--ink);
  font-size: 1.0625rem;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Assez large : intitulés dans une colonne, valeurs dans l'autre. */
@container (min-width: 34rem) {
  .cap-sheet__field {
    grid-template-columns: 11rem minmax(0, 1fr);
    column-gap: var(--gap);
    align-items: baseline;
  }
}

/* ── Créneaux : la donnée, puis le lien « agenda » (cible de 24 px au moins) ── */
.cap-sheet__slots {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cap-sheet__slot {
  display: flex;
  gap: 16px;
  align-items: baseline;
}

.cap-sheet__when {
  min-inline-size: 7.5em;
  font-size: 1.125rem;
  white-space: nowrap;
}

.cap-sheet__agenda {
  display: inline-block;
  padding-block: 4px;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.2;
}

/* Intensité : la valeur, puis la mention du repère (soulignée en pointillé, §6). */
.cap-sheet__intensite {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
}

/* ── Prochain créneau et action ────────────────────────────────────────────── */
.cap-sheet__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
  align-items: baseline;
}

.cap-sheet__next {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.3;
}

.cap-sheet__next-label {
  font-weight: 500;
}

.cap-sheet__next-value {
  font-size: 1.25rem;
}

/* Cible de 44 px : commande principale de la fiche. */
.cap-sheet__reserve {
  display: inline-flex;
  align-items: center;
  min-block-size: 44px;
  font-family: var(--font-body);
  font-size: var(--text-ui);
  font-weight: 600;
}

/* ── Mouvement (html.has-motion seulement : sinon, tout change sur place) ──── */
html.has-motion .cap-sheet {
  transition: grid-template-rows var(--sheet-close) var(--ease-in-out);
}

html.has-motion .cap-sheet[data-open] {
  transition: grid-template-rows var(--sheet-open) var(--ease-in-out);
}

/* Les éléments suivent la hauteur : 140 ms plus tard, 60 ms d'écart (six au plus). */
html.has-motion .cap-sheet__el {
  transition: opacity var(--dur-state) var(--ease-out-soft)
    calc(var(--dur-feedback) + min(var(--i), 5) * var(--stagger-list));
}

html.has-motion .cap-sheet:not([data-open]) .cap-sheet__el {
  opacity: 0;
  transition: opacity calc(var(--sheet-close) * 0.5) var(--ease-in);
}

/* Le panneau sort de `hidden` : ses éléments partent d'un fondu à 0. */
@starting-style {
  html.has-motion .cap-sheet[data-open] .cap-sheet__el {
    opacity: 0;
  }
}

/* Même poids que les règles ci-dessus, placé après : il l'emporte. */
html.js .cap-sheet[data-instant],
html.js .cap-sheet[data-instant] .cap-sheet__el {
  transition: none;
}
</style>
