import type { Day, Session } from '~/types/cap';

/**
 * Le temps du club, toujours à l'heure de Paris, quel que soit le fuseau du
 * navigateur (brief §4.10). La page statique ne sait pas quel jour on est : le
 * rendu serveur montre un état neutre (« Premier cours de la semaine »), et
 * l'horloge ne démarre qu'après l'hydratation.
 *
 * Les durées des cours sont inconnues : il n'y a ni « en ce moment » ni
 * « terminé ». Seul « commencé à … » est montré, dans une fenêtre d'affichage
 * de 60 minutes qui n'est pas une durée de cours.
 */
export const STARTED_WINDOW = 60;

const NBSP = ' ';
const SHORT = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'] as const;
const LONG = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;
const WEEKDAYS: Record<string, Day> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

const parisFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export type ParisNow = { day: Day; minutes: number };

/** Jour (0 = lundi) et minutes depuis minuit, à Paris. */
export function parisNow(date = new Date()): ParisNow {
  const parts = Object.fromEntries(parisFormat.formatToParts(date).map((p) => [p.type, p.value]));
  return {
    day: WEEKDAYS[parts.weekday ?? 'Mon'] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** « 13:00 » → minutes depuis minuit. */
export const toMinutes = (time: string): number => {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return h * 60 + m;
};

/** « 13:00 » → « 13 h 00 » (espaces insécables, deux chiffres pour les minutes). */
export function formatHeure(time: string): string {
  const [h = '0', m = '00'] = time.split(':');
  return `${Number(h)}${NBSP}h${NBSP}${m.padStart(2, '0')}`;
}

export const jourCourt = (day: Day): string => SHORT[day];
export const jourLong = (day: Day): string => LONG[day];

/** Sessions triées par jour puis par heure. */
export const sortSessions = <T extends Session>(sessions: readonly T[]): T[] =>
  [...sessions].sort((a, b) => a.day - b.day || toMinutes(a.start) - toMinutes(b.start));

/**
 * Prochain cours : le premier début strictement après maintenant, en rebouclant
 * sur la semaine. `inMinutes` : délai avant son début.
 */
export function prochainCours<T extends Session>(
  sessions: readonly T[],
  now: ParisNow,
): { session: T; inMinutes: number } | undefined {
  const sorted = sortSessions(sessions);
  const nowAbs = now.day * 1440 + now.minutes;
  let best: { session: T; inMinutes: number } | undefined;
  for (const session of sorted) {
    let delta = session.day * 1440 + toMinutes(session.start) - nowAbs;
    if (delta <= 0) delta += 7 * 1440;
    if (!best || delta < best.inMinutes) best = { session, inMinutes: delta };
  }
  return best;
}

/** Dernière séance du jour commencée depuis moins de STARTED_WINDOW minutes. */
export function commence<T extends Session>(sessions: readonly T[], now: ParisNow): T | undefined {
  return sortSessions(sessions)
    .filter((s) => s.day === now.day)
    .filter((s) => {
      const start = toMinutes(s.start);
      return start <= now.minutes && now.minutes < start + STARTED_WINDOW;
    })
    .at(-1);
}

/** « dans 40 min », « dans 2 h 40 » ; au-delà de 24 h, rien. */
export function compteARebours(minutes: number): string | undefined {
  if (minutes < 60) return `dans${NBSP}${minutes}${NBSP}min`;
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m
      ? `dans${NBSP}${h}${NBSP}h${NBSP}${String(m).padStart(2, '0')}`
      : `dans${NBSP}${h}${NBSP}h`;
  }
  return undefined;
}

/**
 * L'heure de Paris, posée après le montage puis tenue à la minute. Rendu serveur
 * et premier rendu client restent identiques (`undefined`).
 */
export function useParisClock() {
  const now = shallowRef<ParisNow>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const tick = () => {
    now.value = parisNow();
    timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
  };
  onMounted(tick);
  onBeforeUnmount(() => clearTimeout(timer));
  return now;
}
