import { expect, test } from '@playwright/test';
import { gotoClub, scrollThrough, TIMEZONE } from './club';

/**
 * Le mouvement de la V2 ne coûte jamais le contenu : chaque entrée finit à
 * l'état final, et passer en mouvement réduit en cours de visite défait tout.
 */
test.use({ timezoneId: TIMEZONE, contextOptions: { reducedMotion: 'no-preference' } });

/** Styles qu'une animation pose en ligne (GSAP) et qui doivent disparaître à l'arrêt. */
const MOTION_STYLE = /opacity|transform|translate|rotate|scale|clip-path|visibility|--draw/;

test.beforeEach(async ({ page }) => {
  await gotoClub(page);
  await expect(page.locator('html')).toHaveClass(/has-motion/);
});

test('chaque élément animé visible finit opaque', async ({ page }) => {
  await scrollThrough(page);
  await page.waitForTimeout(1800);
  const faded = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((element) => element.style.opacity !== '')
      .filter((element) => element.checkVisibility({ visibilityProperty: true }))
      .filter((element) => Number(getComputedStyle(element).opacity) < 1)
      .map((element) => element.className),
  );
  expect(faded).toEqual([]);
});

test('le flocage presse chaque lettre, puis la laisse au repos', async ({ page }) => {
  await page.locator('#flocage').pressSequentially('Léa');
  const letters = page.locator('.jersey__letter');
  await expect(letters).toHaveCount(3);
  // Après la pose (--dur-strike) et le reflet (--dur-focal), plus rien ne tourne.
  await page.waitForTimeout(1400);
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((animation) => animation.playState === 'running')
        .filter((animation) =>
          (animation.effect as KeyframeEffect | null)?.target?.classList?.contains(
            'jersey__letter',
          ),
        ).length,
  );
  expect(running).toBe(0);
});

test('passer en mouvement réduit en cours de visite rend l’état final', async ({ page }) => {
  await scrollThrough(page);
  await page.getByRole('button', { name: /Voir la fiche : Drake/ }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await expect(page.locator('html')).not.toHaveClass(/has-motion/);
  await page.waitForTimeout(600);
  const leftovers = await page.evaluate(
    (pattern) =>
      [...document.querySelectorAll<HTMLElement>('body *')]
        .filter((element) => new RegExp(pattern).test(element.getAttribute('style') ?? ''))
        .map((element) => `${element.className} → ${element.getAttribute('style')}`),
    MOTION_STYLE.source,
  );
  expect(leftovers).toEqual([]);
  // La carte retournée le reste, sans rotation.
  await expect(page.getByRole('button', { name: /Retourner la carte : Drake/ })).toBeVisible();
});

test('mouvement réduit : aucune animation en boucle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('#flocage')).toBeVisible();
  const looping = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === 'running' &&
            animation.effect?.getTiming().iterations === Infinity,
        ).length,
  );
  expect(looping).toBe(0);
});
