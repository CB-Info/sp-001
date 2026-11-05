import { expect, test } from '@playwright/test';

/**
 * Sans JS, la V2 est complète : HTML servi, état final, ancres et liens .ics
 * natifs.
 */
test.use({ javaScriptEnabled: false });

test.beforeEach(async ({ page }) => {
  await page.goto('/v2');
});

test('chaque section et son titre sont visibles', async ({ page }) => {
  const sections = page.locator('main section[aria-labelledby]');
  await expect(sections).toHaveCount(8);
  for (const section of await sections.all()) {
    await expect(section).toBeVisible();
    const titleId = await section.getAttribute('aria-labelledby');
    await expect(page.locator(`[id="${titleId}"]`)).toBeVisible();
  }
});

test('le HTML servi ouvre les huit fiches de cours', async ({ page, request }) => {
  const html = await (await request.get('/v2')).text();
  const buttons = html.match(/<button[^>]*data-accordion-head[^>]*>/g) ?? [];
  expect(buttons).toHaveLength(8);
  for (const button of buttons) expect(button).toContain('aria-expanded="true"');

  const heads = page.locator('[data-accordion-head]');
  await expect(heads).toHaveCount(8);
  for (const head of await heads.all()) {
    await expect(head).toHaveAttribute('aria-expanded', 'true');
    const panelId = await head.getAttribute('aria-controls');
    const panel = page.locator(`[id="${panelId}"]`);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('role', 'region');
  }
});

test('les cinq jours de la semaine sont visibles', async ({ page }) => {
  const semaine = page.locator('#semaine');
  for (const day of ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']) {
    await expect(semaine.getByRole('heading', { name: day, exact: true }).first()).toBeVisible();
  }
});

test('chaque réponse de la FAQ est atteignable', async ({ page }) => {
  const items = page.locator('#infos details[name="faq"]');
  await expect(items).toHaveCount(8);
  for (const item of await items.all()) {
    const answer = item.locator('.cap-practical__answer');
    await expect(answer).toBeHidden();
    await item.locator('summary').click();
    await expect(answer).toBeVisible();
    await expect(answer).not.toBeEmpty();
  }
});

test('le menu s’ouvre par son ancre, « Fermer » le referme', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'sous 64em seulement : au-delà, l’en-tête montre ses chapitres');
  const menu = page.locator('#menu');
  await expect(menu).toBeHidden();
  await page.getByRole('banner').getByRole('link', { name: 'Menu', exact: true }).click();
  await expect(page).toHaveURL(/#menu$/);
  await expect(menu).toBeVisible();
  for (const label of ['Cours', 'Semaine', 'Famille', 'Tarifs & infos', 'Réserve ta place']) {
    await expect(menu.getByRole('link', { name: label, exact: true })).toBeVisible();
  }

  await menu.getByRole('link', { name: 'Fermer' }).click();
  await expect(page).toHaveURL(/#haut$/);
  await expect(menu).toBeHidden();
});

test('les liens .ics sont dans la page', async ({ page }) => {
  const hrefs = await page
    .locator('a[href$=".ics"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
  const unique = new Set(hrefs);
  expect([...unique].every((href) => /^\/v2\/agenda\/[a-z0-9-]+\.ics$/.test(href))).toBe(true);
  // Huit créneaux, plus la semaine entière.
  expect(unique.size).toBe(9);
  expect(unique).toContain('/v2/agenda/semaine.ics');
  // Rendu neutre : le bouton de #reserver vise le premier cours de la semaine.
  await expect(
    page.locator('#reserver').getByRole('link', { name: /^Ajouter ce cours à mon agenda/ }),
  ).toHaveAttribute('href', '/v2/agenda/lun-1300-pound.ics');
  for (const link of await page.locator('a[href$=".ics"]').all()) {
    await expect(link).toHaveAttribute('download');
  }
});
