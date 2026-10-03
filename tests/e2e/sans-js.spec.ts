import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('chaque section et son titre sont visibles', async ({ page }) => {
  const sections = page.locator('main section[aria-labelledby]');
  expect(await sections.count()).toBeGreaterThan(0);
  for (const section of await sections.all()) {
    const titleId = await section.getAttribute('aria-labelledby');
    await expect(page.locator(`[id="${titleId}"]`)).toBeVisible();
  }
});

test('tous les panneaux de programmes sont ouverts', async ({ page }) => {
  const heads = page.locator('[data-accordion-head]');
  expect(await heads.count()).toBeGreaterThan(1);
  for (const head of await heads.all()) {
    const panelId = await head.getAttribute('aria-controls');
    await expect(page.locator(`[id="${panelId}"]`)).toBeVisible();
  }
});

test('tous les témoignages sont lisibles', async ({ page }) => {
  const slides = page.locator('[aria-roledescription="témoignage"]');
  expect(await slides.count()).toBeGreaterThan(1);
  for (const slide of await slides.all()) await expect(slide).toBeVisible();
});

test('le menu s’ouvre par son ancre', async ({ page }) => {
  await page.getByRole('link', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Sections de la page' })).toBeVisible();
});
