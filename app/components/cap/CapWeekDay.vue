<script setup lang="ts">
import { cap } from '~/data/cap';
import type { Day } from '~/types/cap';
import { formatHeure, parisNow, type ParisNow } from '~/utils/cap-time';
import { complexAtR, path, R_AT, SPAN_RATIO } from '~/utils/ecg';
import type { WeekDay, WeekSlot } from './CapWeek.vue';

/**
 * La semaine jour par jour, sous 64em (brief docs/brief/v2.md, §4.5, « Mobile »).
 *
 * Avec JS : onglets (motif APG, activation manuelle). Cinq onglets « Lun. … Ven. »
 * de 48 px ; flèches gauche et droite, Début, Fin déplacent le focus, Entrée ou
 * Espace activent. Le jour courant est choisi au montage (lundi le week-end ; le
 * jour de cours suivant si le jour courant n'en a pas).
 * Les panneaux partagent une même cellule de grille, à hauteur fixe de 560 px,
 * et changent par `visibility` : aucun saut. La mise en page en onglets suit
 * html.js dès le premier rendu ; les rôles ARIA n'arrivent qu'au montage, quand
 * les onglets répondent. Seul le panneau sans lien (jeudi) entre dans l'ordre de
 * tabulation : les autres commencent par leurs liens.
 *
 * Panneau : axe vertical à 96 px par heure (midi sur 240 px, coupure de 32 px,
 * soir sur 288 px), tracé sur x 36, les pics partent vers la droite (amplitude
 * 40), comme l'ECG sur la jambe du short. Géométrie calculée au rendu serveur
 * (ecg.ts). Étiquettes à x 100 : l'heure et le nom forment le lien de
 * réservation, « agenda » à droite.
 *
 * Sans JS : les cinq jours empilés, chacun son H3, en rangées de 56 px
 * « 18 h 15 · Cardio Jump · Réserver · agenda ». Pas d'axe dessiné ; même texte.
 *
 * Temps réel (après le montage) : onglet du jour en citron et « aujourd'hui »
 * écrit dans son panneau ; tracé craie jusqu'à maintenant puis --cf-passe ;
 * prochain cours en citron 2,5 px ; trait « maintenant » sur le papier.
 */
const props = defineProps<{
  days: WeekDay[];
  /** Heure de Paris ; undefined au rendu serveur et au premier rendu client. */
  now?: ParisNow;
  today?: Day;
  nextId?: string;
  startedId?: string;
}>();

const w = cap.week;
const NBSP = ' ';
/** Séparateur des rangées sans JS (point médian lié à ce qui le précède). */
const SEP = `${NBSP}· `;
/** Le titre du chapitre nomme la liste d'onglets. */
const LABELLED_BY = 'semaine-titre';

/* ── L'axe vertical : 96 px par heure, coupure de 32 px ────────────────────── */
const MIDI = [690, 840] as const; // 11 h 30 → 14 h 00
const SOIR = [1020, 1200] as const; // 17 h 00 → 20 h 00
const PX_PER_MINUTE = 96 / 60;
const CUT = 32;
const MIDI_END = (MIDI[1] - MIDI[0]) * PX_PER_MINUTE; // 240
const SOIR_START = MIDI_END + CUT; // 272
const PANEL = SOIR_START + (SOIR[1] - SOIR[0]) * PX_PER_MINUTE; // 560

const round = (value: number) => Math.round(value * 100) / 100;

/** Minutes depuis minuit → ordonnée dans le panneau ; dans la coupure, son milieu. */
function y(minutes: number): number {
  if (minutes <= MIDI[1]) return round((minutes - MIDI[0]) * PX_PER_MINUTE);
  if (minutes >= SOIR[0]) return round(SOIR_START + (minutes - SOIR[0]) * PX_PER_MINUTE);
  return MIDI_END + CUT / 2;
}

/* ── Le tracé : ligne de base sur x 36, pics vers la droite ────────────────── */
const BASE_X = 36;
const AMP = 40;
const SPAN = SPAN_RATIO * AMP; // 36 px de temps
const RIBBON = 96;

/** Le complexe canonique couché : le temps descend, l'amplitude part vers la droite. */
const complex = (minutes: number) =>
  path(complexAtR(y(minutes), -BASE_X, AMP).map(([t, v]) => [-v, t] as const));

/** Ligne de base des deux fenêtres, coupée sous chaque complexe. */
function baseline(slots: WeekSlot[]): string {
  const gaps = slots.map((slot) => {
    const at = y(slot.minutes);
    return [round(at - R_AT * SPAN), round(at + (1 - R_AT) * SPAN)] as const;
  });
  return (
    [
      [0, MIDI_END],
      [SOIR_START, PANEL],
    ] as const
  )
    .map(([from, to]) => {
      let cursor = from;
      let d = '';
      for (const [start, end] of gaps.filter(([start]) => start >= from && start < to)) {
        d += `M${BASE_X} ${cursor}V${start}`;
        cursor = end;
      }
      return `${d}M${BASE_X} ${cursor}V${to}`;
    })
    .join('');
}

const tracks = computed(() =>
  props.days.map((day) => ({
    ...day,
    base: baseline(day.slots),
    complexes: day.slots.map((slot) => ({ slot, d: complex(slot.minutes), at: y(slot.minutes) })),
  })),
);

/* ── Heures, à gauche du tracé, écartées des complexes qui les couvriraient ── */
const heureRonde = (hour: number) => formatHeure(`${hour}:00`).replace(/\s00$/u, '');
const HOURS = [
  { key: '12', label: heureRonde(12), at: y(720) },
  { key: '13', label: heureRonde(13), at: y(780) },
  { key: '14', label: heureRonde(14), at: MIDI_END },
  { key: '17', label: heureRonde(17), at: SOIR_START },
  { key: '18', label: heureRonde(18), at: y(1080) },
  { key: '19', label: heureRonde(19), at: y(1140) },
  { key: '20', label: heureRonde(20), at: PANEL, end: true },
];
const hoursOf = (slots: WeekSlot[]) =>
  HOURS.filter(({ at }) =>
    slots.every((slot) => {
      const peak = y(slot.minutes);
      return at + 7 < peak - R_AT * SPAN - 4 || at - 7 > peak + (1 - R_AT) * SPAN + 4;
    }),
  );

/* ── Maintenant (piste du jour) ────────────────────────────────────────────── */
const nowState = computed(() => {
  const now = props.now;
  if (!now || now.day > 4) return undefined;
  const minutes = now.minutes;
  const hh = Math.floor(minutes / 60);
  const mm = String(minutes % 60).padStart(2, '0');
  return {
    visible: minutes >= MIDI[0] && minutes <= SOIR[1],
    coupure: minutes > MIDI[1] && minutes < SOIR[0],
    at: y(Math.min(Math.max(minutes, MIDI[0]), SOIR[1])),
    /** Découpe du calque craie : rien avant 11 h 30, tout après 20 h. */
    clip: minutes < MIDI[0] ? 0 : minutes > SOIR[1] ? PANEL : y(minutes),
    label: `${w.maintenant} ${formatHeure(`${hh}:${mm}`)}`,
  };
});

/** Le libellé « maintenant » à x 100, seulement s'il ne couvre aucune étiquette. */
function nowLabelFree(slots: WeekSlot[]): boolean {
  const state = nowState.value;
  if (!state?.visible) return false;
  const top = state.at - 9;
  const bottom = state.at + 9;
  const boxes: [number, number][] = slots.map((slot) => {
    const peak = y(slot.minutes);
    return [peak - 22 - (slot.id === props.nextId ? 18 : 0), peak + 22];
  });
  // L'étiquette « aujourd'hui » (en haut) et la mention du jeudi.
  boxes.push([0, 20]);
  if (!slots.length) boxes.push([38, 60]);
  return boxes.every(([from, to]) => bottom + 4 < from || top - 4 > to);
}

const isToday = (day: Day) => nowState.value !== undefined && props.today === day;
const layers = (day: Day) => (isToday(day) ? (['passe', 'encre'] as const) : (['encre'] as const));
const todayVisible = w.aujourdhui.replace(/[()]/g, '');
const startedText = (slot: WeekSlot) => `, ${w.commenceA.replace('{heure}', slot.heure)}`;

/* ── Onglets (APG, activation manuelle) ────────────────────────────────────── */
const selected = ref(0);
/** Rôles ARIA posés au montage : sans JS, une liste de jours, pas des onglets inertes. */
const enhanced = ref(false);
const tabs = useTemplateRef<HTMLButtonElement[]>('tabs');
const tabId = (day: Day) => `semaine-onglet-${day}`;
const panelId = (day: Day) => `semaine-jour-${day}`;
const beforeId = (day: Day) => `semaine-jour-avant-${day}`;

onMounted(() => {
  // Le jour courant à Paris ; le week-end, lundi. Un jour sans cours (jeudi)
  // ouvrirait un panneau vide : on montre le jour de cours suivant, l'onglet du
  // jour garde sa marque « aujourd'hui ».
  const { day } = parisNow();
  const start = Math.max(
    props.days.findIndex((entry) => entry.day === (day <= 4 ? day : 0)),
    0,
  );
  const count = props.days.length;
  const withSlots = Array.from({ length: count }, (_, step) => (start + step) % count).find(
    (index) => props.days[index]?.slots.length,
  );
  selected.value = withSlots ?? start;
  enhanced.value = true;
});

const KEYS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

function onKeydown(event: KeyboardEvent, index: number) {
  const move = KEYS[event.key];
  if (!move || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  event.preventDefault();
  tabs.value?.[move(index, props.days.length)]?.focus();
}

/* ── Piste Bien-être et choix du créneau ───────────────────────────────────── */
const wellness = (() => {
  const at = w.bienEtre.indexOf(':');
  return at === -1
    ? { before: w.bienEtre, pending: '' }
    : { before: w.bienEtre.slice(0, at), pending: w.bienEtre.slice(at + 1).trim() };
})();

const choice = useState<string | null>('cap-choix', () => null);
const choose = (slot: WeekSlot) => {
  choice.value = slot.id;
};
</script>

<template>
  <div class="cap-wd">
    <!-- Onglets : visibles avec JS seulement ; rôles posés au montage. -->
    <div
      class="cap-wd__tabs"
      :role="enhanced ? 'tablist' : undefined"
      :aria-labelledby="enhanced ? LABELLED_BY : undefined"
    >
      <button
        v-for="(day, index) in days"
        :id="tabId(day.day)"
        ref="tabs"
        :key="day.day"
        type="button"
        class="cap-wd__tab cap-data"
        :class="{ 'is-selected': selected === index }"
        :data-today="isToday(day.day) || undefined"
        :role="enhanced ? 'tab' : undefined"
        :aria-selected="enhanced ? selected === index : undefined"
        :aria-controls="enhanced ? panelId(day.day) : undefined"
        :tabindex="enhanced && selected !== index ? -1 : undefined"
        @click="selected = index"
        @keydown="onKeydown($event, index)"
      >
        {{ day.short
        }}<span v-if="isToday(day.day)" class="visually-hidden">{{ ' ' }}{{ w.aujourdhui }}</span>
      </button>
    </div>

    <div class="cap-wd__stage">
      <!-- Le papier ECG du ruban, commun aux cinq panneaux -->
      <div class="cap-wd__paper" aria-hidden="true">
        <span class="cap-wd__window cap-wd__window--midi" />
        <span class="cap-wd__window cap-wd__window--soir" />
      </div>

      <ol class="cap-wd__days" :role="enhanced ? 'none' : 'list'">
        <li
          v-for="(track, index) in tracks"
          :key="track.day"
          class="cap-wd__day"
          :class="{ 'is-selected': selected === index }"
          :role="enhanced ? 'none' : undefined"
        >
          <div
            :id="panelId(track.day)"
            class="cap-wd__panel"
            :role="enhanced ? 'tabpanel' : undefined"
            :aria-labelledby="enhanced ? tabId(track.day) : undefined"
            :tabindex="enhanced && !track.slots.length ? 0 : undefined"
          >
            <h3 class="cap-wd__title">
              {{ track.long
              }}<span v-if="isToday(track.day)" class="visually-hidden"
                >{{ ' ' }}{{ w.aujourdhui }}</span
              >
            </h3>
            <p v-if="isToday(track.day)" class="cap-wd__auj" aria-hidden="true">
              {{ todayVisible }}
            </p>

            <div class="cap-wd__hours" aria-hidden="true">
              <span
                v-for="hour in hoursOf(track.slots)"
                :key="hour.key"
                class="cap-wd__hour"
                :class="{ 'cap-wd__hour--end': hour.end }"
                :style="{ '--y': `${hour.at}px` }"
                >{{ hour.label }}</span
              >
            </div>

            <svg
              class="cap-wd__trace"
              :width="RIBBON"
              :height="PANEL"
              :viewBox="`0 0 ${RIBBON} ${PANEL}`"
              aria-hidden="true"
              focusable="false"
              data-ecg
            >
              <defs v-if="isToday(track.day)">
                <clipPath :id="beforeId(track.day)">
                  <rect :width="RIBBON" :height="nowState?.clip ?? 0" />
                </clipPath>
              </defs>
              <g
                v-for="layer in layers(track.day)"
                :key="layer"
                :class="`cap-wd__layer cap-wd__layer--${layer}`"
                :clip-path="
                  layer === 'encre' && isToday(track.day)
                    ? `url(#${beforeId(track.day)})`
                    : undefined
                "
              >
                <path class="cap-wd__base" :d="track.base" />
                <path
                  v-for="{ slot, d } in track.complexes"
                  :key="slot.id"
                  class="cap-wd__qrs"
                  :d="d"
                  vector-effect="non-scaling-stroke"
                  :data-tags="slot.tags"
                  :data-next="slot.id === nextId || undefined"
                />
              </g>
              <path class="cap-wd__cut" :d="`M${BASE_X} ${MIDI_END}V${SOIR_START}`" />
              <line
                v-if="isToday(track.day) && nowState?.visible"
                class="cap-wd__now-line"
                :class="{ 'is-coupure': nowState.coupure }"
                x1="0"
                :x2="RIBBON"
                :y1="nowState.at"
                :y2="nowState.at"
              />
            </svg>

            <span
              v-if="isToday(track.day) && nowState?.visible && nowLabelFree(track.slots)"
              class="cap-wd__now"
              aria-hidden="true"
              :style="{ '--y': `${nowState.at}px` }"
              >{{ nowState.label }}</span
            >

            <p v-if="!track.slots.length" class="cap-wd__none">{{ w.jeudi }}</p>
            <ol v-else class="cap-wd__slots" role="list">
              <li
                v-for="{ slot, at } in track.complexes"
                :key="slot.id"
                class="cap-wd__slot"
                :data-tags="slot.tags"
                :data-next="slot.id === nextId || undefined"
                :style="{ '--y': `${at}px` }"
              >
                <a class="cap-wd__book" href="#reserver" @click="choose(slot)">
                  <span v-if="slot.id === nextId" class="cap-wd__next">{{ w.prochainCours }}</span>
                  <time class="cap-wd__time cap-data" :datetime="slot.start">{{ slot.heure }}</time>
                  <span class="cap-wd__sep" aria-hidden="true">{{ SEP }}</span>
                  <span class="cap-wd__name">{{ slot.nom }}</span>
                  <span class="cap-wd__cta"
                    ><span class="cap-wd__sep" aria-hidden="true">{{ SEP }}</span
                    >{{ cap.ui.reserveShort }}</span
                  >
                  <span class="cap-wd__suffix visually-hidden"
                    >{{ slot.suffixe
                    }}<template v-if="slot.id === startedId">{{
                      startedText(slot)
                    }}</template></span
                  >
                  <span class="cap-wd__hors visually-hidden">{{ ' ' }}{{ w.focus.hors }}</span>
                </a>
                <span class="cap-wd__sep cap-wd__sep--agenda" aria-hidden="true">{{ SEP }}</span>
                <a
                  class="cap-wd__agenda cap-link"
                  :href="slot.ics"
                  download
                  :aria-label="slot.agenda"
                  >{{ cap.ui.agenda }}</a
                >
              </li>
            </ol>
          </div>
        </li>
      </ol>
    </div>

    <!-- Piste Bien-être : pas d'heure, une ligne pointillée -->
    <p class="cap-wd__wellness" data-tags="reprends solide">
      <span class="cap-wd__wellness-label cap-data">{{ w.bienEtreJour }}</span>
      <span class="cap-wd__wellness-text"
        >{{ wellness.before
        }}<template v-if="wellness.pending"
          >:{{ ' ' }}<CapPending :text="wellness.pending" /></template
      ></span>
      <span class="cap-wd__hors visually-hidden">{{ ' ' }}{{ w.focus.hors }}</span>
    </p>
  </div>
</template>

<style scoped>
.cap-wd {
  --wd-panel: 560px;
}

@media (min-width: 64em) {
  .cap-wd {
    display: none;
  }
}

/* ── Sans JS : jours empilés, rangées de 56 px ─────────────────────────────── */
.cap-wd__tabs,
.cap-wd__paper,
.cap-wd__hours,
.cap-wd__trace,
.cap-wd__auj,
.cap-wd__now {
  display: none;
}

.cap-wd__days {
  display: grid;
  gap: 32px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cap-wd__title {
  margin: 0 0 4px;
  padding-block-end: 8px;
  border-block-end: 1px solid var(--cf-graphite);
  color: var(--cf-craie);
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-stretch: 80%;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
}

.cap-wd__slots {
  margin: 0;
  padding: 0;
}

.cap-wd__slot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-block-size: 56px;
  border-block-end: 1px solid var(--cf-graphite);
  font-family: var(--font-body);
  font-size: 1rem;
}

.cap-wd__book {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  min-block-size: 44px;
  align-content: center;
  color: var(--cf-craie);
  text-decoration: none;
}

.cap-wd__time {
  color: var(--slot-ink, var(--slot-base, var(--cf-craie)));
  font-size: 1.25rem;
}

.cap-wd__slot[data-next] {
  --slot-base: var(--cf-citron);
}

.cap-wd__name {
  color: var(--slot-ink, var(--cf-craie));
  font-weight: var(--slot-weight, 600);
  transition:
    color var(--dur-state) var(--ease-out-soft),
    font-weight var(--dur-state) var(--ease-out-soft);
}

.cap-wd__cta {
  color: var(--cf-craie);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: var(--cf-citron);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

.cap-wd__cta .cap-wd__sep {
  display: inline-block;
  color: var(--cf-gris);
}

.cap-wd__sep {
  color: var(--cf-gris);
  white-space: pre;
}

.cap-wd__suffix {
  display: none;
}

.cap-wd__hors {
  display: var(--hors-display, none);
}

.cap-wd__agenda {
  display: inline-block;
  padding-block: 10px;
  font-weight: 500;
  line-height: 24px;
}

.cap-wd__none {
  margin: 0;
  padding-block: 16px;
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-style: italic;
}

.cap-wd__next {
  display: block;
  flex-basis: 100%;
  color: var(--cf-citron);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-style: italic;
  font-weight: 500;
  line-height: 18px;
}

/* ── Piste Bien-être : un filet pointillé 2/4 au-dessus ────────────────────── */
.cap-wd__wellness {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  align-items: baseline;
  margin: 32px 0 0;
  padding-block-start: 16px;
  background: repeating-linear-gradient(
      to right,
      var(--qrs-ink, var(--cf-pointille)) 0 2px,
      transparent 2px 6px
    )
    top left / 100% 2px no-repeat;
  color: var(--slot-ink, var(--cf-craie));
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: var(--slot-weight, 500);
  line-height: 1.4;
}

.cap-wd__wellness-label {
  color: var(--slot-ink, var(--cf-craie));
  font-size: 1.25rem;
  font-stretch: 80%;
  text-transform: uppercase;
}

.cap-wd__wellness :deep(.cap-pending) {
  color: inherit;
  font-weight: inherit;
}

/* ── Avec JS : onglets, panneaux superposés, axe vertical ──────────────────── */
html.js .cap-wd__tabs {
  display: flex;
  border-block-end: 1px solid var(--cf-graphite);
}

/* Onglets de 66 × 48 px à 390 (la largeur se partage sous 330 px). */
.cap-wd__tab {
  position: relative;
  flex: 0 1 66px;
  min-inline-size: 44px;
  block-size: 48px;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--cf-gris);
  font-size: 1.25rem;
  cursor: pointer;
}

.cap-wd__tab.is-selected {
  color: var(--cf-craie);
}

.cap-wd__tab[data-today] {
  color: var(--cf-citron);
}

/* Onglet actif : un filet citron de 3 px qui se remplit (le code « plein = actif »). */
.cap-wd__tab::after {
  position: absolute;
  inset-inline: 8px;
  inset-block-end: -1px;
  border-block-end: 3px solid var(--cf-citron);
  content: '';
  scale: 0 1;
  transition: scale var(--dur-state) var(--ease-out-soft);
}

.cap-wd__tab.is-selected::after {
  scale: 1 1;
}

.cap-wd__tab:focus-visible {
  outline-offset: -2px;
}

html.js .cap-wd__stage {
  display: grid;
  margin-block-start: 24px;
}

html.js .cap-wd__paper,
html.js .cap-wd__days {
  grid-area: 1 / 1;
}

html.js .cap-wd__days {
  gap: 0;
}

html.js .cap-wd__day {
  grid-area: 1 / 1;
  visibility: hidden;
}

html.js .cap-wd__day.is-selected {
  visibility: visible;
}

html.js .cap-wd__panel {
  position: relative;
  block-size: var(--wd-panel);
}

/* Le titre du jour est porté par l'onglet ; il reste pour les lecteurs d'écran. */
html.js .cap-wd__title {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

html.js .cap-wd__auj {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  display: block;
  margin: 0;
  color: var(--cf-citron);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-style: italic;
  font-weight: 500;
  line-height: 18px;
}

/* Papier ECG du ruban (x 0–96) : carreaux de 6 min (9,6 px) et de 30 min (48 px). */
html.js .cap-wd__paper {
  position: relative;
  display: block;
  inline-size: 96px;
  block-size: var(--wd-panel);
}

.cap-wd__window {
  position: absolute;
  inset-inline: 0;
  background-image:
    linear-gradient(to left, var(--cf-graphite) 0 1px, transparent 1px),
    linear-gradient(to top, var(--cf-graphite) 0 1px, transparent 1px),
    repeating-linear-gradient(to right, var(--cf-graphite) 0 1px, transparent 1px 48px),
    repeating-linear-gradient(to bottom, var(--cf-graphite) 0 1px, transparent 1px 48px),
    repeating-linear-gradient(to right, var(--cf-quadrillage) 0 1px, transparent 1px 9.6px),
    repeating-linear-gradient(to bottom, var(--cf-quadrillage) 0 1px, transparent 1px 9.6px);
}

.cap-wd__window--midi {
  inset-block: 0 calc(100% - 240px);
}

.cap-wd__window--soir {
  inset-block: 272px 0;
}

html.js .cap-wd__hours {
  position: absolute;
  inset: 0 auto 0 0;
  display: block;
  inline-size: 30px;
}

.cap-wd__hour {
  position: absolute;
  inset-block-start: calc(var(--y) - 7px);
  inset-inline-end: 0;
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  line-height: 14px;
  white-space: nowrap;
}

.cap-wd__hour--end {
  inset-block-start: calc(var(--y) - 14px);
}

html.js .cap-wd__trace {
  position: absolute;
  inset: 0 auto auto 0;
  display: block;
  overflow: visible;
  fill: none;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-miterlimit: 4;
}

.cap-wd__base {
  stroke: var(--cf-craie);
  stroke-width: 2px;
}

.cap-wd__layer--passe {
  --qrs-base: var(--cf-passe);
}

.cap-wd__layer--passe .cap-wd__base {
  stroke: var(--cf-passe);
}

.cap-wd__cut {
  stroke: var(--cf-filet);
  stroke-dasharray: 2 4;
  stroke-width: 2px;
}

/* Hors sélection : le complexe s'aplatit sur sa ligne de base (x 36). */
.cap-wd__qrs {
  stroke: var(--qrs-ink, var(--qrs-base, var(--cf-craie)));
  stroke-width: var(--qrs-width, var(--qrs-base-width, 2px));
  transform: scaleX(var(--qrs-scale, 1));
  transform-box: view-box;
  transform-origin: 36px 0;
  transition:
    transform var(--dur-state) var(--ease-out-soft),
    stroke var(--dur-state) var(--ease-out-soft);
}

.cap-wd__qrs[data-next] {
  --qrs-base: var(--cf-citron);
  --qrs-base-width: 2.5px;
}

.cap-wd__now-line {
  stroke: var(--cf-citron);
  stroke-width: 1px;
}

.cap-wd__now-line.is-coupure {
  stroke-dasharray: 2 4;
}

html.js .cap-wd__now {
  position: absolute;
  inset-block-start: calc(var(--y) - 9px);
  inset-inline-start: 100px;
  display: block;
  color: var(--cf-citron);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
}

/* Étiquettes à x 100 : un bloc de 44 px centré sur le pic, « agenda » à droite. */
html.js .cap-wd__slot {
  position: absolute;
  inset-block-start: calc(var(--y) - 22px);
  inset-inline: 100px 0;
  flex-wrap: nowrap;
  gap: 20px;
  align-items: last baseline;
  min-block-size: 0;
  border: 0;
}

html.js .cap-wd__slot[data-next] {
  inset-block-start: calc(var(--y) - 40px);
}

html.js .cap-wd__book {
  display: grid;
  justify-items: start;
  min-block-size: 0;
  white-space: nowrap;
}

html.js .cap-wd__time {
  font-size: 1.75rem;
  line-height: 28px;
}

html.js .cap-wd__name {
  font-size: 1rem;
  line-height: 16px;
  text-decoration: underline;
  text-decoration-color: var(--cf-citron);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

html.js .cap-wd__sep,
html.js .cap-wd__cta {
  display: none;
}

html.js .cap-wd__suffix {
  display: inline;
}

/* « agenda » sur la ligne de base du nom, dans une boîte de 24 px. */
html.js .cap-wd__agenda {
  padding-block: 0;
  font-size: 0.875rem;
}

html.js .cap-wd__none {
  position: absolute;
  inset-block-start: 40px;
  inset-inline: 100px 0;
  padding: 0;
  line-height: 1.3;
}

/* Mouvement réduit ou JS absent : les changements d'état se font sur place. */
html:not(.has-motion) .cap-wd__qrs,
html:not(.has-motion) .cap-wd__name,
html:not(.has-motion) .cap-wd__tab::after {
  transition: none;
}

@media (forced-colors: active) {
  .cap-wd__qrs,
  .cap-wd__base,
  .cap-wd__cut,
  .cap-wd__now-line {
    stroke: CanvasText;
  }

  .cap-wd__layer--passe .cap-wd__base {
    stroke: GrayText;
  }

  .cap-wd__tab::after {
    border-block-end-color: CanvasText;
  }
}
</style>
