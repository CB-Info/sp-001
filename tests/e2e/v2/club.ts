import { expect, type Page } from '@playwright/test';

/**
 * Aides communes aux tests de la direction B (/v2).
 *
 * Le temps du club (jour, prochain cours, ouverture) se calcule chez le
 * visiteur : les tests le figent au mercredi 4 novembre 2026, 18 h 20 à Paris.
 * Ce jour-là : force à 7 h, boxe à 12 h 15 et cardio à 17 h 30 sont terminés ;
 * force à 18 h 30 avec Alex est le prochain cours ; le club ferme à 22 h.
 */
export const WEDNESDAY_EVENING = new Date('2026-11-04T18:20:00+01:00');
export const TIMEZONE = 'Europe/Paris';

/**
 * Décale l'horloge de la page sur WEDNESDAY_EVENING sans l'arrêter : GSAP mesure
 * le temps avec Date.now, qu'une horloge figée (page.clock.setFixedTime) gèlerait.
 */
const SHIFT_CLOCK = `(() => {
  const RealDate = Date;
  const offset = ${WEDNESDAY_EVENING.getTime()} - RealDate.now();
  class ClubDate extends RealDate {
    constructor(...args) { super(...(args.length ? args : [RealDate.now() + offset])); }
    static now() { return RealDate.now() + offset; }
  }
  globalThis.Date = ClubDate;
})();`;

/** Ouvre /v2 et attend l'hydratation (le champ de flocage n'existe qu'après). */
export async function gotoClub(page: Page, hash = '') {
  await page.addInitScript({ content: SHIFT_CLOCK });
  await page.goto(`/v2${hash}`);
  await expect(page.locator('#flocage')).toBeVisible();
}

/** Parcourt toute la page par tiers d'écran : chaque zone charge et joue son entrée. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 3) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  });
}

/** Vrai sur le projet « mobile » (390 px) : le tiroir remplace la navigation. */
export const isNarrow = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1200;
