import { expect, test } from '@playwright/test';
import { ouvrirV2, parcourir } from './outils';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('ni intro ni mouvement : html.js seul', async ({ page }) => {
  await ouvrirV2(page);
  const html = page.locator('html');
  await expect(html).toHaveClass(/\bjs\b/);
  await expect(html).not.toHaveClass(/hero-intro/);
  await expect(html).not.toHaveClass(/hero-ready/);
  await expect(html).not.toHaveClass(/has-motion/);
});

test('aucune animation en boucle', async ({ page }) => {
  await ouvrirV2(page);
  await parcourir(page);
  const looping = await page.evaluate(() =>
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.playState === 'running' &&
          animation.effect?.getTiming().iterations === Infinity,
      )
      .map((animation) => String((animation as CSSAnimation).animationName ?? animation.id)),
  );
  expect(looping).toEqual([]);
});

test('la couverture est entière dès le premier rendu', async ({ page }) => {
  await page.goto('/v2', { waitUntil: 'domcontentloaded' });
  const cover = page.locator('#haut');
  const animated = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((animation) =>
          String((animation as CSSAnimation).animationName ?? '').startsWith('cap-cover-'),
        ).length,
  );
  expect(animated).toBe(0);

  for (const part of [
    cover.getByRole('heading', { level: 1 }),
    cover.locator('.cap-cover__chapeau-text').filter({ visible: true }),
    cover.getByRole('link', { name: 'Réserve ta place' }),
    cover.getByRole('link', { name: 'Voir le planning' }),
    cover.locator('.cap-cover__next'),
  ]) {
    await expect(part).toBeVisible();
    await expect(part).toHaveCSS('opacity', '1');
  }
  // Le tracé est écrit, les mots découverts : aucune découpe d'intro.
  for (const selector of ['.cap-cover__trace', '.cap-cover__delie']) {
    await expect(cover.locator(selector)).toHaveCSS('clip-path', 'none');
  }
  await expect(cover.locator('.cap-cover__veil--intro')).toBeHidden();
});

test('ni GSAP ni Lenis ne sont chargés', async ({ page }) => {
  const scripts: string[] = [];
  page.on('response', async (response) => {
    if (response.request().resourceType() !== 'script') return;
    const body = await response.text().catch(() => '');
    // Signatures du cœur de GSAP, de ScrollTrigger et de Lenis (noms de fichiers hachés).
    if (/GreenSockGlobals|_gsapAllow|lenis-autoToggle/.test(body)) scripts.push(response.url());
  });
  await ouvrirV2(page);
  await parcourir(page);
  await page.waitForLoadState('networkidle');
  expect(scripts).toEqual([]);
});
