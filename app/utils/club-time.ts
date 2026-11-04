import type { OpeningHours, Session, Weekday } from '~/types/club';

/**
 * Le temps du club : jour courant, prochain cours, ouverture. Tout se calcule
 * dans le navigateur, à l'heure du visiteur, après l'hydratation : la page
 * statique ne sait pas quel jour on est. Le rendu serveur montre un état neutre
 * (la semaine entière, sans « maintenant »).
 */

/** Jour du calendrier français : 0 = lundi … 6 = dimanche. */
export const weekdayOf = (date: Date): Weekday => ((date.getDay() + 6) % 7) as Weekday;

/** « 18:30 » → minutes depuis minuit. */
export const toMinutes = (time: string): number => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/** Minutes écoulées depuis minuit, à l'heure locale. */
export const minutesOf = (date: Date): number => date.getHours() * 60 + date.getMinutes();

/** « 18:30 » → « 18 h 30 » ; « 07:00 » → « 7 h ». Espaces insécables. */
export function formatTime(time: string): string {
  const [hours = '0', minutes = '00'] = time.split(':');
  const h = String(Number(hours));
  return minutes === '00' ? `${h}\u00A0h` : `${h}\u00A0h\u00A0${minutes}`;
}

/** Heure et minutes séparées, pour l'affichage en tableau de match (« 18 » « 30 »). */
export function splitTime(time: string): { hours: string; minutes: string } {
  const [hours = '0', minutes = '00'] = time.split(':');
  return { hours: String(Number(hours)), minutes };
}

export const endOf = (session: Session): number => toMinutes(session.start) + session.minutes;

export type SessionState = 'done' | 'live' | 'next' | 'later';

/**
 * État des cours d'une journée à un instant donné : terminés, en cours, le
 * prochain (un seul), puis les suivants. `minutes` absent : journée à venir.
 */
export function sessionStates(daySessions: Session[], minutes?: number): SessionState[] {
  if (minutes === undefined) return daySessions.map(() => 'later');
  let nextGiven = false;
  return daySessions.map((session) => {
    const start = toMinutes(session.start);
    if (endOf(session) <= minutes) return 'done';
    if (start <= minutes) return 'live';
    if (!nextGiven) {
      nextGiven = true;
      return 'next';
    }
    return 'later';
  });
}

/** Cours triés par jour puis par heure. */
export const sortSessions = (sessions: Session[]): Session[] =>
  [...sessions].sort((a, b) => a.day - b.day || toMinutes(a.start) - toMinutes(b.start));

/**
 * Prochain cours à partir de `now` : celui en cours s'il a commencé il y a moins
 * de 15 minutes, sinon le prochain à commencer, en parcourant la semaine.
 * `inDays` : 0 aujourd'hui, 1 demain…
 */
export function nextSession(
  sessions: Session[],
  now: Date,
): { session: Session; inDays: number; live: boolean } | undefined {
  const today = weekdayOf(now);
  const minutes = minutesOf(now);
  const sorted = sortSessions(sessions);
  for (let offset = 0; offset < 8; offset++) {
    const day = ((today + offset) % 7) as Weekday;
    for (const session of sorted) {
      if (session.day !== day) continue;
      const start = toMinutes(session.start);
      if (offset === 0) {
        if (start <= minutes && minutes < start + 15) return { session, inDays: 0, live: true };
        if (start <= minutes) continue;
      }
      return { session, inDays: offset, live: false };
    }
  }
  return undefined;
}

/** Horaires du jour donné. */
export const hoursOf = (hours: OpeningHours[], day: Weekday): OpeningHours | undefined =>
  hours.find(({ days: [first, last] }) => day >= first && day <= last);

export type OpenStatus =
  { open: true; closes: string } | { open: false; opens: string; inDays: number; day: Weekday };

/** Ouvert ou fermé à `now`, et la prochaine bascule. */
export function openStatus(hours: OpeningHours[], now: Date): OpenStatus | undefined {
  const today = weekdayOf(now);
  const minutes = minutesOf(now);
  const current = hoursOf(hours, today);
  if (current && toMinutes(current.open) <= minutes && minutes < toMinutes(current.close)) {
    return { open: true, closes: current.close };
  }
  for (let offset = 0; offset < 8; offset++) {
    const day = ((today + offset) % 7) as Weekday;
    const slot = hoursOf(hours, day);
    if (!slot) continue;
    if (offset === 0 && minutes >= toMinutes(slot.open)) continue;
    return { open: false, opens: slot.open, inDays: offset, day };
  }
  return undefined;
}

/**
 * L'heure du visiteur, posée après l'hydratation puis tenue à la minute : le
 * rendu serveur et le premier rendu client restent identiques (`now` vide).
 */
export function useClubClock() {
  const now = shallowRef<Date>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const tick = () => {
    now.value = new Date();
    // Prochaine minute pleine : le « maintenant » change avec l'horloge du visiteur.
    timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
  };
  onMounted(tick);
  onBeforeUnmount(() => clearTimeout(timer));
  return now;
}
