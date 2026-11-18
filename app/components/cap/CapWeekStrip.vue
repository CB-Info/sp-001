<script setup lang="ts">
import { cap } from '~/data/cap';
import type { Day } from '~/types/cap';
import { formatHeure, type ParisNow } from '~/utils/cap-time';
import { complexAtR, path, R_AT, SPAN_RATIO } from '~/utils/ecg';
import type { WeekDay, WeekSlot } from './CapWeek.vue';

/**
 * La bande de la semaine, à partir de 64em : cinq dérivations, du lundi au
 * vendredi, comme un tracé à plusieurs pistes (brief docs/brief/v2.md, §4.5).
 *
 * Axe : les jours sur les colonnes 1 et 2, la bande sur les colonnes 3 à 12, en
 * deux fenêtres. Midi (11 h 30 → 14 h) et soir (17 h → 20 h) ; entre les deux, la
 * coupure, comptée comme un quart d'heure d'axe (48 px à 1440, ligne de base en
 * pointillés 2/4). L'axe fait donc 345 minutes : 190,6 px par heure à 1440, et
 * chaque position est un pourcentage de la bande, juste à toutes les largeurs.
 * Papier ECG sous les fenêtres : petits carreaux de 6 min, gros de 30 min (5:1).
 *
 * Pistes : 128 px, ligne de base à +72, tracé « instrument » craie de 2 px. À
 * chaque créneau, un complexe d'amplitude 48 (la même pour tous : le planning ne
 * dit rien de l'intensité), dont le pic R tombe exactement sur l'heure de début.
 * La géométrie est calculée ici, au rendu serveur (ecg.ts) : le complexe est
 * dessiné en pixels autour de son pic, placé en pourcentage (un `<svg x="…%">`
 * imbriqué), donc jamais déformé. La ligne de base est coupée sous chaque
 * complexe par un masque : le tracé reste une seule ligne, comme sur le papier.
 *
 * Étiquettes : texte réel, à x_R + 31 px. L'heure et le nom forment le lien de
 * réservation (vers #reserver ; il enregistre le choix dans « cap-choix ») ; le
 * lien « agenda » télécharge le .ics du créneau. Sous 1432 px de large, la bande
 * se resserre : l'étiquette du créneau suivi de près (lun. 18 h 15) passe à
 * gauche de son pic. L'ordre du DOM est l'ordre jour puis heure.
 *
 * Temps réel (après le montage) : piste du jour sur fond carbone, libellé citron
 * et « aujourd'hui » écrit ; tracé craie jusqu'à maintenant puis --cf-passe (deux
 * calques, le craie découpé à x(maintenant)) ; prochain cours en citron 2,5 px,
 * « prochain cours » au-dessus de son heure ; curseur « maintenant » vertical,
 * en pointillés dans la coupure, masqué avant 11 h 30, après 20 h et le week-end.
 *
 * O1 (CapWeek) pilote la variable --cursor posée sur `.cap-strip` : elle découpe
 * les cinq pistes pendant l'écriture et place le curseur.
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

/* ── L'axe : deux fenêtres et la coupure, en minutes d'axe ─────────────────── */
const MIDI = [690, 840] as const; // 11 h 30 → 14 h 00
const SOIR = [1020, 1200] as const; // 17 h 00 → 20 h 00
/** La coupure compte pour 15 minutes d'axe : 47,6 px à 1440 (48 au brief). */
const CUT = 15;
const MIDI_LENGTH = MIDI[1] - MIDI[0];
const AXIS = MIDI_LENGTH + CUT + (SOIR[1] - SOIR[0]);

const round = (value: number) => Math.round(value * 1e4) / 1e4;

/** Minutes depuis minuit → minutes d'axe ; dans la coupure, son milieu. */
function axis(minutes: number): number {
  if (minutes <= MIDI[1]) return minutes - MIDI[0];
  if (minutes >= SOIR[0]) return MIDI_LENGTH + CUT + (minutes - SOIR[0]);
  return MIDI_LENGTH + CUT / 2;
}

/** Position sur la bande, en % de sa largeur. */
const pct = (minutes: number) => round((axis(minutes) / AXIS) * 100);
const MIDI_END = round((MIDI_LENGTH / AXIS) * 100);
const SOIR_START = round(((MIDI_LENGTH + CUT) / AXIS) * 100);

/* ── Une piste : 128 px, ligne de base à +72, amplitude 48 ─────────────────── */
const TRACK = 128;
const BASE = 72;
const AMP = 48;
const SPAN = round(SPAN_RATIO * AMP);
/** Le complexe, dessiné autour de son pic R (x = 0) : R à +24, S à +116. */
const QRS = path(complexAtR(0, BASE, AMP));
/** La coupure de la ligne de base sous un complexe : de son début à sa fin. */
const GAP_X = round(-R_AT * SPAN);

/* ── Rangée d'heures ───────────────────────────────────────────────────────── */
const heureRonde = (hour: number) => formatHeure(`${hour}:00`).replace(/\s00$/u, '');
/** Demi-largeurs approximatives (px), pour écarter une heure du libellé « maintenant ». */
const hours = [
  { key: '12', label: heureRonde(12), at: pct(720), half: 15 },
  { key: '13', label: heureRonde(13), at: pct(780), half: 15 },
  { key: 'coupure', label: w.coupure, at: round((MIDI_END + SOIR_START) / 2), half: 36 },
  { key: '18', label: heureRonde(18), at: pct(1080), half: 15 },
  { key: '19', label: heureRonde(19), at: pct(1140), half: 15 },
  { key: '20', label: heureRonde(20), at: 100, half: 15, end: true },
];

/* ── Maintenant ────────────────────────────────────────────────────────────── */
const NOW_HALF = 64; // demi-largeur de la boîte « maintenant 18 h 20 » (8rem)

const nowState = computed(() => {
  const now = props.now;
  // Week-end : ni piste du jour, ni curseur.
  if (!now || now.day > 4) return undefined;
  const minutes = now.minutes;
  const hh = Math.floor(minutes / 60);
  const mm = String(minutes % 60).padStart(2, '0');
  return {
    visible: minutes >= MIDI[0] && minutes <= SOIR[1],
    coupure: minutes > MIDI[1] && minutes < SOIR[0],
    x: pct(minutes),
    /** Découpe du calque craie de la piste du jour : rien avant 11 h 30, tout après 20 h. */
    clip: minutes < MIDI[0] ? 0 : minutes > SOIR[1] ? 100 : pct(minutes),
    label: `${w.maintenant} ${formatHeure(`${hh}:${mm}`)}`,
  };
});

/** Largeur de la bande (px), suivie pour écarter les heures que couvre « maintenant ». */
const hoursRow = useTemplateRef<HTMLElement>('hoursRow');
const bandWidth = ref(0);
let resize: ResizeObserver | undefined;
onMounted(() => {
  if (!hoursRow.value) return;
  resize = new ResizeObserver(([entry]) => {
    bandWidth.value = entry?.contentRect.width ?? 0;
  });
  resize.observe(hoursRow.value);
});
onBeforeUnmount(() => resize?.disconnect());

const masked = computed(() => {
  const state = nowState.value;
  const width = bandWidth.value;
  if (!state?.visible || !width) return new Set<string>();
  const center = Math.min(Math.max((state.x / 100) * width, NOW_HALF), width - NOW_HALF);
  return new Set(
    hours
      .filter((hour) => {
        const at = hour.end ? width - hour.half : (hour.at / 100) * width;
        return Math.abs(at - center) < NOW_HALF + hour.half + 8;
      })
      .map((hour) => hour.key),
  );
});

/* ── Pistes ────────────────────────────────────────────────────────────────── */
const x = (slot: WeekSlot) => `${pct(slot.minutes)}%`;
const isToday = (day: Day) => nowState.value !== undefined && props.today === day;
/** Piste du jour : un calque --cf-passe dessous, le calque craie découpé à maintenant. */
const layers = (day: Day) => (isToday(day) ? (['passe', 'encre'] as const) : (['encre'] as const));
const gapId = (day: Day) => `semaine-bande-trou-${day}`;
const beforeId = (day: Day) => `semaine-bande-avant-${day}`;
/** « aujourd'hui », écrit sous le jour : la couleur n'est jamais le seul signal. */
const todayVisible = w.aujourdhui.replace(/[()]/g, '');
const startedText = (slot: WeekSlot) => `, ${w.commenceA.replace('{heure}', slot.heure)}`;

/** Piste Bien-être : « Pilates, Yoga, Stretching » et « créneaux à confirmer » (CapPending). */
const wellness = (() => {
  const at = w.bienEtre.indexOf(':');
  return at === -1
    ? { before: w.bienEtre, pending: '' }
    : { before: w.bienEtre.slice(0, at), pending: w.bienEtre.slice(at + 1).trim() };
})();

/* Le lien de réservation enregistre le créneau pour #reserver (CapBook). */
const choice = useState<string | null>('cap-choix', () => null);
const choose = (slot: WeekSlot) => {
  choice.value = slot.id;
};
</script>

<template>
  <div
    class="cap-strip"
    data-motion="semaine-bande"
    :data-now="nowState?.visible ? (nowState.coupure ? 'coupure' : 'ligne') : undefined"
    :style="{ '--now-x': nowState?.visible ? `${nowState.x}%` : undefined }"
  >
    <!-- Rangée d'heures -->
    <div ref="hoursRow" class="cap-strip__hours" aria-hidden="true">
      <span
        v-for="hour in hours"
        :key="hour.key"
        class="cap-strip__hour"
        :class="{ 'cap-strip__hour--end': hour.end }"
        :style="{ '--x': `${hour.at}%` }"
        :data-masque="masked.has(hour.key) || undefined"
        >{{ hour.label }}</span
      >
      <span v-if="nowState?.visible" class="cap-strip__now">{{ nowState.label }}</span>
    </div>

    <!-- Fond carbone de la piste du jour, puis le papier ECG des deux fenêtres -->
    <div
      v-if="today !== undefined && nowState"
      class="cap-strip__today"
      :style="{ '--row': today }"
      aria-hidden="true"
    />
    <div class="cap-strip__paper" aria-hidden="true">
      <span class="cap-strip__window cap-strip__window--midi" />
      <span class="cap-strip__window cap-strip__window--soir" />
    </div>

    <ol class="cap-strip__days" role="list">
      <li
        v-for="day in days"
        :key="day.day"
        class="cap-strip__day"
        :data-today="isToday(day.day) || undefined"
      >
        <h3 class="cap-strip__label">
          <span class="cap-strip__jour">{{ day.long }}</span>
          <span v-if="isToday(day.day)" class="cap-strip__auj">
            <span aria-hidden="true">{{ todayVisible }}</span>
            <span class="visually-hidden">{{ ' ' }}{{ w.aujourdhui }}</span>
          </span>
        </h3>

        <div class="cap-strip__track">
          <svg
            class="cap-strip__trace"
            width="100%"
            :height="TRACK"
            aria-hidden="true"
            focusable="false"
            data-ecg
          >
            <defs v-if="day.slots.length || isToday(day.day)">
              <mask
                v-if="day.slots.length"
                :id="gapId(day.day)"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="100%"
                height="100%"
              >
                <rect width="100%" height="100%" fill="#fff" />
                <svg v-for="slot in day.slots" :key="slot.id" :x="x(slot)" overflow="visible">
                  <rect :x="GAP_X" :y="BASE - 4" :width="SPAN" height="8" fill="#000" />
                </svg>
              </mask>
              <clipPath v-if="isToday(day.day)" :id="beforeId(day.day)">
                <rect :width="`${nowState?.clip ?? 0}%`" height="100%" />
              </clipPath>
            </defs>

            <g
              v-for="layer in layers(day.day)"
              :key="layer"
              :class="`cap-strip__layer cap-strip__layer--${layer}`"
              :clip-path="
                layer === 'encre' && isToday(day.day) ? `url(#${beforeId(day.day)})` : undefined
              "
            >
              <g :mask="day.slots.length ? `url(#${gapId(day.day)})` : undefined">
                <line class="cap-strip__base" x1="0" :x2="`${MIDI_END}%`" :y1="BASE" :y2="BASE" />
                <line
                  class="cap-strip__base"
                  :x1="`${SOIR_START}%`"
                  x2="100%"
                  :y1="BASE"
                  :y2="BASE"
                />
              </g>
              <svg v-for="slot in day.slots" :key="slot.id" :x="x(slot)" overflow="visible">
                <path
                  class="cap-qrs"
                  :d="QRS"
                  vector-effect="non-scaling-stroke"
                  :data-tags="slot.tags"
                  :data-next="slot.id === nextId || undefined"
                />
              </svg>
            </g>
            <line
              class="cap-strip__cut"
              :x1="`${MIDI_END}%`"
              :x2="`${SOIR_START}%`"
              :y1="BASE"
              :y2="BASE"
            />
          </svg>

          <p v-if="!day.slots.length" class="cap-strip__none">{{ w.jeudi }}</p>
          <ol v-else class="cap-strip__slots" role="list">
            <li
              v-for="slot in day.slots"
              :key="slot.id"
              class="cap-slot"
              :data-tags="slot.tags"
              :data-next="slot.id === nextId || undefined"
              :data-serre="slot.serre || undefined"
              :style="{ '--x': x(slot) }"
            >
              <a class="cap-slot__book" href="#reserver" @click="choose(slot)">
                <span v-if="slot.id === nextId" class="cap-slot__next">{{ w.prochainCours }}</span>
                <time class="cap-slot__time cap-data" :datetime="slot.start">{{ slot.heure }}</time>
                {{ ' ' }}
                <span class="cap-slot__name"
                  >{{ slot.nom
                  }}<template v-if="slot.id === choice"
                    ><span class="cap-slot__check" aria-hidden="true">{{ ' ' }}✓</span
                    ><span class="visually-hidden">, {{ w.choisi }}</span></template
                  ></span
                >
                <span class="visually-hidden"
                  >{{ slot.suffixe
                  }}<template v-if="slot.id === startedId">{{ startedText(slot) }}</template></span
                >
                <span class="cap-slot__hors visually-hidden">{{ ' ' }}{{ w.focus.hors }}</span>
              </a>
              <a
                class="cap-slot__agenda cap-link"
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

    <!-- Le curseur unique : écriture (O1), puis « maintenant » -->
    <div class="cap-strip__lane" aria-hidden="true">
      <span class="cap-strip__cursor" data-motion="semaine-curseur" />
    </div>

    <!-- Piste Bien-être : pas d'heure, donc aucun complexe -->
    <div class="cap-strip__wellness" data-tags="reprends solide">
      <p class="cap-strip__label cap-strip__label--wellness">{{ w.bienEtreJour }}</p>
      <div class="cap-strip__track cap-strip__track--wellness">
        <svg
          class="cap-strip__trace"
          width="100%"
          height="64"
          aria-hidden="true"
          focusable="false"
          data-ecg
        >
          <line class="cap-strip__dots" x1="0" x2="100%" y1="44" y2="44" />
        </svg>
        <p class="cap-strip__wellness-text">
          {{ wellness.before
          }}<template v-if="wellness.pending"
            >:{{ ' ' }}<CapPending :text="wellness.pending"
          /></template>
          <span class="cap-slot__hors visually-hidden">{{ ' ' }}{{ w.focus.hors }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cap-strip {
  display: none;
}

@media (min-width: 64em) {
  .cap-strip {
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    grid-template-rows: 32px auto auto;
    column-gap: var(--gap);
    isolation: isolate;
  }
}

/* ── Rangée d'heures (32 px) ───────────────────────────────────────────────── */
.cap-strip__hours {
  position: relative;
  grid-area: 1 / 3 / 2 / -1;
}

.cap-strip__hour,
.cap-strip__now {
  position: absolute;
  inset-block-start: 9px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 14px;
  white-space: nowrap;
}

.cap-strip__hour {
  left: var(--x);
  color: var(--cf-gris);
  translate: -50% 0;
}

.cap-strip__hour--end {
  translate: -100% 0;
}

/* Pendant l'écriture, « maintenant » attend : les heures qu'il couvrira restent. */
.cap-strip:not([data-ecriture]) .cap-strip__hour[data-masque] {
  visibility: hidden;
}

/* « maintenant 18 h 20 » : centré sur le curseur, jamais hors de la bande. */
.cap-strip__now {
  left: clamp(4rem, var(--now-x), 100% - 4rem);
  inline-size: 8rem;
  color: var(--cf-citron);
  text-align: center;
  translate: -50% 0;
  transition: opacity var(--dur-state) var(--ease-out-soft);
}

.cap-strip[data-ecriture] .cap-strip__now {
  opacity: 0;
}

/* ── Fond du jour et papier ECG ────────────────────────────────────────────── */
.cap-strip__today {
  z-index: 0;
  grid-area: 2 / 1 / 3 / -1;
  align-self: start;
  block-size: 128px;
  margin-block-start: calc(var(--row) * 128px);
  margin-inline: calc(-1 * var(--gap));
  background: var(--cf-carbone);
}

/*
 * Papier ECG : petits carreaux de 6 min (1 px --cf-quadrillage), gros de 30 min
 * (--cf-graphite), ancrés au début de chaque fenêtre. Le pas vient de la largeur
 * de la bande (345 minutes d'axe, unités cqi) : de vrais carrés à toute largeur.
 */
.cap-strip__paper {
  position: relative;
  z-index: 1;
  grid-area: 2 / 3 / 4 / -1;
  container-type: inline-size;
  pointer-events: none;
}

.cap-strip__window {
  --small: calc(100cqi * 6 / 345);
  --big: calc(100cqi * 30 / 345);

  position: absolute;
  inset-block: 0;
  background-image:
    linear-gradient(to left, var(--cf-graphite) 0 1px, transparent 1px),
    linear-gradient(to top, var(--cf-graphite) 0 1px, transparent 1px),
    repeating-linear-gradient(to right, var(--cf-graphite) 0 1px, transparent 1px var(--big)),
    repeating-linear-gradient(to bottom, var(--cf-graphite) 0 1px, transparent 1px var(--big)),
    repeating-linear-gradient(to right, var(--cf-quadrillage) 0 1px, transparent 1px var(--small)),
    repeating-linear-gradient(to bottom, var(--cf-quadrillage) 0 1px, transparent 1px var(--small));
}

.cap-strip__window--midi {
  inset-inline-start: 0;
  inline-size: calc(100% * 150 / 345);
}

.cap-strip__window--soir {
  inset-inline: calc(100% * 165 / 345) 0;
}

/* ── Cinq pistes de 128 px ─────────────────────────────────────────────────── */
.cap-strip__days {
  display: grid;
  grid-area: 2 / 1 / 3 / -1;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cap-strip__day,
.cap-strip__wellness {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  column-gap: var(--gap);
  block-size: 128px;
}

/*
 * Libellé du jour : donnée 80 %, 24 px, capitales, sa ligne de base posée sur
 * celle du tracé (+72), comme le nom d'une dérivation sur le papier.
 */
.cap-strip__label {
  position: relative;
  z-index: 4;
  grid-column: 1 / 3;
  align-self: start;
  margin: 53px 0 0;
  color: var(--slot-ink, var(--cf-craie));
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-stretch: 80%;
  font-weight: 900;
  line-height: 24px;
  text-transform: uppercase;
}

.cap-strip__day[data-today] .cap-strip__label {
  color: var(--cf-citron);
}

.cap-strip__jour {
  display: block;
}

.cap-strip__auj {
  display: block;
  margin-block-start: 8px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-stretch: 100%;
  font-style: italic;
  font-weight: 500;
  line-height: 1.2;
  text-transform: none;
}

.cap-strip__track {
  position: relative;
  grid-column: 3 / -1;
}

.cap-strip__trace {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: visible;
  fill: none;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  /* Pointes vives, comme le logo : le pic R (≈ 10°) demande un onglet de 11,3 (15 étiré par O2). */
  stroke-miterlimit: 20;
}

/* O1 : chaque piste découverte jusqu'au curseur, le temps de l'écriture. */
.cap-strip[data-ecriture='scrub'] .cap-strip__days .cap-strip__trace {
  clip-path: inset(0 calc(100% - var(--cursor, 100%)) 0 0);
}

.cap-strip__base {
  stroke: var(--cf-craie);
  stroke-width: 2px;
}

.cap-strip__layer--passe {
  --qrs-base: var(--cf-passe);
}

.cap-strip__layer--passe .cap-strip__base {
  stroke: var(--cf-passe);
}

/* La coupure : ligne de base en pointillés 2/4, --cf-filet. */
.cap-strip__cut {
  stroke: var(--cf-filet);
  stroke-dasharray: 2 4;
  stroke-width: 2px;
}

/*
 * Le complexe : instrument craie de 2 px ; prochain cours en citron 2,5 px. Hors
 * sélection (CapWeek, `:has()`), il s'aplatit sur sa ligne de base et passe en
 * --cf-passe. L'épaisseur ne bouge pas (non-scaling-stroke).
 */
.cap-qrs {
  stroke: var(--qrs-ink, var(--qrs-base, var(--cf-craie)));
  stroke-width: var(--qrs-width, var(--qrs-base-width, 2px));
  transform: scaleY(var(--qrs-scale, 1));
  transform-box: view-box;
  transform-origin: 0 72px;
  transition:
    transform var(--dur-state) var(--ease-out-soft),
    stroke var(--dur-state) var(--ease-out-soft);
}

.cap-qrs[data-next] {
  --qrs-base: var(--cf-citron);
  --qrs-base-width: 2.5px;
}

/* ── Étiquettes : le lien de réservation, puis « agenda » ──────────────────── */
.cap-strip__slots {
  margin: 0;
  padding: 0;
}

.cap-slot {
  position: absolute;
  inset-block: 0;
  inset-inline-start: calc(var(--x) + 31px);
  z-index: 4;
}

.cap-slot__book,
.cap-slot__agenda {
  position: absolute;
  inset-inline-start: 0;
  white-space: nowrap;
}

/* Heure (ligne de base à +40), nom (+60) ; « prochain cours » au-dessus (+22). */
.cap-slot__book {
  inset-block-start: 24px;
  display: grid;
  justify-items: start;
  color: var(--cf-craie);
  text-decoration: none;
}

.cap-slot[data-next] .cap-slot__book {
  inset-block-start: 10px;
}

.cap-slot__next {
  color: var(--cf-citron);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-style: italic;
  font-weight: 500;
  line-height: 14px;
}

.cap-slot__time {
  color: var(--slot-ink, var(--slot-base, var(--cf-craie)));
  font-size: 1.25rem;
  line-height: 20px;
}

.cap-slot[data-next] {
  --slot-base: var(--cf-citron);
}

.cap-slot__name {
  margin-block-start: 4px;
  color: var(--slot-ink, var(--cf-craie));
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: var(--slot-weight, 600);
  line-height: 14px;
  text-decoration: underline;
  text-decoration-color: var(--cf-citron);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  transition:
    color var(--dur-state) var(--ease-out-soft),
    font-weight var(--dur-state) var(--ease-out-soft),
    text-decoration-thickness var(--dur-feedback) var(--ease-out-soft);
}

.cap-slot__book:hover .cap-slot__name {
  text-decoration-thickness: 2px;
}

.cap-slot__hors {
  display: var(--hors-display, none);
}

/* « agenda » sous la ligne de base (+98), dans une boîte de 24 px. */
.cap-slot__agenda {
  inset-block-start: 81px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 24px;
}

/*
 * Bande resserrée (sous 1432 px, soit moins de 1089 px de bande) : 45 minutes ne
 * suffisent plus à « Cardio Jump ». L'étiquette passe à gauche du pic, à la même
 * distance du complexe.
 */
@media (max-width: 89.49em) {
  .cap-slot[data-serre] {
    inset-inline-start: calc(var(--x) - 35px);
  }

  .cap-slot[data-serre] .cap-slot__book,
  .cap-slot[data-serre] .cap-slot__agenda {
    inset-inline: auto 0;
    justify-items: end;
    text-align: end;
  }
}

/* Jeudi : la ligne plate, et sa mention (ligne de base à +60). */
.cap-strip__none {
  position: absolute;
  inset-block-start: 47px;
  inset-inline-start: 16px;
  z-index: 4;
  margin: 0;
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-style: italic;
  line-height: 15px;
}

/* ── Le curseur : 1 px citron sur toute la hauteur des cinq pistes ─────────── */
.cap-strip__lane {
  position: relative;
  z-index: 3;
  grid-area: 2 / 3 / 3 / -1;
  overflow: clip;
  pointer-events: none;
}

.cap-strip__cursor {
  position: absolute;
  inset: 0;
  border-inline-start: 1px solid var(--cf-citron);
  translate: min(var(--cursor, var(--now-x, 0%)), 100% - 1px) 0;
  visibility: hidden;
}

.cap-strip:is([data-now], [data-ecriture]) .cap-strip__cursor {
  visibility: visible;
}

.cap-strip[data-now='coupure']:not([data-ecriture]) .cap-strip__cursor {
  border-inline-start-style: dashed;
}

/* ── Piste Bien-être (64 px) : ligne de base pointillée, aucun complexe ────── */
.cap-strip__wellness {
  grid-area: 3 / 1 / 4 / -1;
  block-size: 64px;
}

.cap-strip__label--wellness {
  margin-block-start: 22px;
}

.cap-strip__dots {
  stroke: var(--qrs-ink, var(--cf-pointille));
  stroke-dasharray: 2 4;
  stroke-width: 2px;
}

.cap-strip__wellness-text {
  position: absolute;
  inset-block-start: 14px;
  inset-inline-start: 16px;
  z-index: 4;
  margin: 0;
  color: var(--slot-ink, var(--cf-craie));
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: var(--slot-weight, 500);
  line-height: 18px;
  white-space: nowrap;
}

.cap-strip__wellness-text :deep(.cap-pending) {
  color: inherit;
  font-weight: inherit;
}

/* Mouvement réduit ou JS absent : les changements d'état se font sur place. */
html:not(.has-motion) .cap-qrs,
html:not(.has-motion) .cap-slot__name,
html:not(.has-motion) .cap-strip__now {
  transition: none;
}

@media (forced-colors: active) {
  .cap-qrs,
  .cap-strip__base,
  .cap-strip__cut,
  .cap-strip__dots {
    stroke: CanvasText;
  }

  /* « Pas encore » : le texte grisé du système. */
  .cap-strip__layer--passe .cap-strip__base {
    stroke: GrayText;
  }

  .cap-strip__cursor {
    border-inline-start-color: CanvasText;
  }
}
</style>
