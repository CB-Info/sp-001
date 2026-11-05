import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { attendreArrivee, deplacerHeure, ouvrirFiche, ouvrirV2, suivreLien } from './outils';

/** Identifiants des séances du planning (app/data/cap.ts, `const sessions`). */
const SESSIONS = (() => {
  const source = readFileSync(new URL('../../../app/data/cap.ts', import.meta.url), 'utf8');
  const block = /const sessions: Session\[\] = \[([\s\S]*?)\n\];/.exec(source)?.[1] ?? '';
  return [...block.matchAll(/\bid: '([a-z0-9-]+)'/g)].map((match) => match[1]);
})();

const JOURS: Record<string, number> = { lun: 1, mar: 2, mer: 3, jeu: 4, ven: 5, sam: 6, dim: 0 };

/** Lignes iCalendar dépliées (RFC 5545 : une ligne continuée commence par une espace). */
const lignes = (ics: string) => ics.replace(/\r\n[ \t]/g, '').split('\r\n');

test('le planning compte huit séances, toutes en lien .ics dans la page', async ({ page }) => {
  expect(SESSIONS).toHaveLength(8);
  await page.goto('/v2');
  const hrefs = await page
    .locator('a[href$=".ics"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const seances = new Set(hrefs.filter((href) => href !== '/v2/agenda/semaine.ics'));
  expect([...seances].sort()).toEqual(SESSIONS.map((id) => `/v2/agenda/${id}.ics`).sort());
});

test('chaque lien .ics répond en text/calendar, un cours hebdomadaire à l’heure de Paris', async ({
  page,
  request,
}) => {
  await page.goto('/v2');
  // Nom du cours, lu dans le nom accessible : « Ajouter le CAF du mercredi, 18 h 00 à mon agenda ».
  const links = await page.locator('a[href$=".ics"]').evaluateAll((elements) =>
    elements.map((link) => ({
      href: link.getAttribute('href') ?? '',
      label: link.getAttribute('aria-label') ?? '',
    })),
  );
  const cours = new Map<string, string>();
  for (const { href, label } of links) {
    const nom = /^Ajouter le (.+) du \p{L}+,/u.exec(label)?.[1];
    if (nom) cours.set(href, nom);
  }
  const hrefs = [...new Set(links.map(({ href }) => href))];
  expect(hrefs).toHaveLength(SESSIONS.length + 1);

  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
    expect(response.headers()['content-type'], href).toMatch(/^text\/calendar/);
    const ics = lignes(await response.text());
    expect(ics[0], href).toBe('BEGIN:VCALENDAR');
    expect(ics, href).toContain('END:VCALENDAR');
    expect(ics, href).toContain('BEGIN:VTIMEZONE');
    expect(ics, href).toContain('TZID:Europe/Paris');
    expect(ics, href).toContain('RRULE:FREQ=WEEKLY');
    expect(ics, href).toContain('DURATION:PT1H');
    if (href.endsWith('/semaine.ics')) continue;

    // Une séance : un seul événement, au jour et à l'heure de son identifiant.
    expect(
      ics.filter((line) => line === 'BEGIN:VEVENT'),
      href,
    ).toHaveLength(1);
    const [, jour, heure] = /\/([a-z]{3})-(\d{4})-[a-z-]+\.ics$/.exec(href) ?? [];
    const start = ics.find((line) => line.startsWith('DTSTART;TZID=Europe/Paris:')) ?? '';
    const [, date, time] = /:(\d{8})T(\d{6})$/.exec(start) ?? [];
    expect(time, href).toBe(`${heure}00`);
    const civil = new Date(
      Date.UTC(Number(date?.slice(0, 4)), Number(date?.slice(4, 6)) - 1, Number(date?.slice(6))),
    );
    expect(civil.getUTCDay(), href).toBe(JOURS[jour ?? '']);
    const nom = cours.get(href);
    expect(nom, href).toBeTruthy();
    expect(
      ics.find((line) => line.startsWith('SUMMARY:')),
      href,
    ).toContain(nom);
  }
});

test('semaine.ics réunit toutes les séances du planning', async ({ request }) => {
  const response = await request.get('/v2/agenda/semaine.ics');
  expect(response.status()).toBe(200);
  const ics = lignes(await response.text());
  expect(ics.filter((line) => line === 'BEGIN:VEVENT')).toHaveLength(SESSIONS.length);
  const uids = ics.filter((line) => line.startsWith('UID:'));
  expect(uids.sort()).toEqual(SESSIONS.map((id) => `UID:${id}@cap-fitness-maquette`).sort());
});

/*
 * La ligne de choix de #reserver (CapBook) : « Réserver ce cours » d'une fiche
 * enregistre la prochaine occurrence du cours (CapCourseSheet), à l'heure de
 * Paris. Navigateur à New York, pour prouver le fuseau ; Date décalée, jamais
 * figée.
 */
test.describe('choix d’un cours, mercredi 18 h 20 à Paris', () => {
  test.use({ timezoneId: 'America/New_York' });

  test.beforeEach(async ({ page }) => {
    await deplacerHeure(page, '2026-11-04T17:20:00Z');
    await ouvrirV2(page);
  });

  test('le CAF de 18 h 00, déjà commencé : « mer. prochain 18 h 00 »', async ({ page }) => {
    const fiche = await ouvrirFiche(page, 'caf');
    await expect(fiche.locator('.cap-sheet__next')).toHaveText(
      /^Prochain créneau\s+:\s+mercredi\s+prochain\s+18\s+h\s+00$/,
    );
    await suivreLien(fiche.getByRole('link', { name: /^Réserver ce cours/ }));
    await attendreArrivee(page, 'reserver');

    const reserver = page.locator('#reserver');
    await expect(reserver.locator('.cap-book__choix')).toHaveText(
      /^Tu as choisi\s+:\s+CAF,\s+mer\.\s+prochain\s+18\s+h\s+00$/,
    );
    const bouton = reserver.getByRole('link', { name: /^Ajouter ce cours à mon agenda/ });
    await expect(bouton).toHaveAttribute('href', '/v2/agenda/mer-1800-caf.ics');
    await expect(bouton).toHaveAccessibleName(/pour CAF,\s+mercredi\s+prochain\s+18\s+h\s+00$/);
  });

  test('le Cross training de 19 h 00, à venir : sans « prochain »', async ({ page }) => {
    const fiche = await ouvrirFiche(page, 'cross-training');
    await expect(fiche.locator('.cap-sheet__next')).toHaveText(
      /^Prochain créneau\s+:\s+mercredi\s+19\s+h\s+00$/,
    );
    await suivreLien(fiche.getByRole('link', { name: /^Réserver ce cours/ }));
    await attendreArrivee(page, 'reserver');

    const reserver = page.locator('#reserver');
    const choix = reserver.locator('.cap-book__choix');
    await expect(choix).toHaveText(/^Tu as choisi\s+:\s+Cross training,\s+mer\.\s+19\s+h\s+00$/);
    await expect(choix).not.toContainText('prochain');
    await expect(
      reserver.getByRole('link', { name: /^Ajouter ce cours à mon agenda/ }),
    ).toHaveAttribute('href', '/v2/agenda/mer-1900-cross-training.ics');
  });

  test('sans choix, le prochain cours à Paris', async ({ page }) => {
    const reserver = page.locator('#reserver');
    await reserver.scrollIntoViewIfNeeded();
    await expect(reserver.locator('.cap-book__choix')).toHaveText(
      /^Prochain cours\s+:\s+Cross training,\s+mer\.\s+19\s+h\s+00$/,
    );
  });
});
