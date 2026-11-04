// Fichiers d'agenda (.ics) de la V2 : un par créneau du planning, plus la semaine
// entière. Ce sont les seules actions réelles de la maquette : elles marchent sans
// JS et sans compte. Les créneaux viennent du flyer du club (à confirmer) ; la
// durée d'une heure est provisoire et le fichier le dit.
//
// Sortie : public/v2/agenda/{id}.ics et semaine.ics (non versionnés).
// Usage : node scripts/build-ics.mjs (lancé par `build` et `generate`).
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadCap, root } from './fit-words.mjs';

const cap = await loadCap();
const out = join(root, 'public/v2/agenda');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Paris',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

/** Lundi de la semaine de génération (date civile, sans heure). */
const today = new Date();
const monday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
const pad = (n) => String(n).padStart(2, '0');
const stamp = `${today.getUTCFullYear()}${pad(today.getUTCMonth() + 1)}${pad(today.getUTCDate())}T000000Z`;

/** Texte iCalendar : antislash, virgule et point-virgule échappés ; lignes pliées à 75 octets. */
const escape = (text) => text.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`);
function fold(line) {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const parts = [];
  let current = '';
  for (const char of line) {
    if (Buffer.byteLength(current + char, 'utf8') > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = char;
    } else current += char;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

const courses = Object.fromEntries(cap.courses.map((c) => [c.slug, c]));
function event(session) {
  const date = new Date(monday);
  date.setUTCDate(monday.getUTCDate() + session.day);
  const [h, m] = session.start.split(':');
  const start = `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${h}${m}00`;
  const name = courses[session.course]?.nom ?? session.course;
  return [
    'BEGIN:VEVENT',
    `UID:${session.id}@cap-fitness-maquette`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Paris:${start}`,
    'DURATION:PT1H',
    'RRULE:FREQ=WEEKLY',
    `SUMMARY:${escape(`${name} · CAP Fitness (maquette)`)}`,
    `LOCATION:${escape('CAP Fitness by EBC Sport, adresse à confirmer')}`,
    `DESCRIPTION:${escape("Créneau d'après le flyer du club, à confirmer. Durée provisoire d'une heure, à confirmer.")}`,
    'END:VEVENT',
  ];
}

const calendar = (events) =>
  [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAP Fitness maquette//FR',
    'CALSCALE:GREGORIAN',
    ...VTIMEZONE,
    ...events.flat(),
    'END:VCALENDAR',
  ]
    .map(fold)
    .join('\r\n') + '\r\n';

for (const session of cap.sessions) {
  await writeFile(join(out, `${session.id}.ics`), calendar([event(session)]));
}
await writeFile(join(out, 'semaine.ics'), calendar(cap.sessions.map(event)));
console.log(`agenda : ${cap.sessions.length + 1} fichiers .ics → public/v2/agenda`);
