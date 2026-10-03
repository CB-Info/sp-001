import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('aucune animation en boucle', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeVisible();
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
