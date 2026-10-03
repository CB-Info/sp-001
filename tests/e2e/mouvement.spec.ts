import { expect, test, type Page } from '@playwright/test';

/**
 * Le mouvement ne doit jamais coûter le contenu : chaque entrée finit à l'état
 * final, et passer en mouvement réduit en cours de visite défait tout.
 */
test.use({ contextOptions: { reducedMotion: 'no-preference' } });

/** Styles qu'une animation pose en ligne (GSAP) et qui doivent disparaître à l'arrêt. */
const MOTION_STYLE =
  /opacity|transform|translate|rotate|scale|clip-path|visibility|will-change|--fx|--ft|--fb|--sink|--rule|--follow|--rise|--number-turn|--hero-drift/;

/** Parcourt toute la page par tiers d'écran : chaque zone charge et joue son entrée. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 3) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/has-motion/);
});

test('chaque élément animé visible finit opaque', async ({ page }) => {
  await scrollThrough(page);
  // Plus long que la plus longue séquence (--seq-max).
  await page.waitForTimeout(1500);
  const faded = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((element) => element.style.opacity !== '')
      .filter((element) => element.checkVisibility({ visibilityProperty: true }))
      .filter((element) => Number(getComputedStyle(element).opacity) < 1)
      .map((element) => element.className),
  );
  expect(faded).toEqual([]);
});

test('passer en mouvement réduit en cours de visite rend l’état final', async ({ page }) => {
  await scrollThrough(page);
  // Des animations nées après coup : changement de programme, de service.
  await page.locator('[data-accordion-head]').nth(2).click();
  await page.getByRole('button', { name: 'Service suivant' }).click();

  await page.emulateMedia({ reducedMotion: 'reduce' });

  const html = page.locator('html');
  await expect(html).not.toHaveClass(/has-motion/);
  await expect(html).not.toHaveClass(/\blenis/);
  // Le minuteur de fin de défilement de Lenis ne doit pas remettre ses classes.
  await page.waitForTimeout(600);
  await expect(html).not.toHaveClass(/\blenis/);
  const leftovers = await page.evaluate(
    (pattern) =>
      [...document.querySelectorAll<HTMLElement>('body *')]
        .filter((element) => new RegExp(pattern).test(element.getAttribute('style') ?? ''))
        .map((element) => `${element.className} → ${element.getAttribute('style')}`),
    MOTION_STYLE.source,
  );
  expect(leftovers).toEqual([]);
});
