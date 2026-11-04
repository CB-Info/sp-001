import { expect, test } from '@playwright/test';

/** Sans JS, la V2 reste complète : tout le contenu est là, rien ne fait semblant. */
test.use({ javaScriptEnabled: false });

test.beforeEach(async ({ page }) => {
  await page.goto('/v2');
});

test('chaque section et son titre sont visibles', async ({ page }) => {
  const sections = page.locator('main section[aria-labelledby]');
  expect(await sections.count()).toBe(11);
  for (const section of await sections.all()) {
    const titleId = await section.getAttribute('aria-labelledby');
    await expect(page.locator(`[id="${titleId}"]`)).toBeVisible();
  }
});

test('le maillot montre « TON NOM » et le champ est un lien vers l’essai', async ({ page }) => {
  await expect(page.getByRole('img', { name: /TON NOM, 26/ })).toBeVisible();
  await expect(page.locator('#flocage')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Floque ton maillot à l’essai/ })).toHaveAttribute(
    'href',
    '#essai',
  );
});

test('la semaine entière s’affiche, sans onglets ni filtres', async ({ page }) => {
  await expect(page.getByRole('tab')).toHaveCount(0);
  for (const day of ['Lundi', 'Mercredi', 'Dimanche']) {
    await expect(page.getByRole('heading', { name: day, exact: true })).toBeVisible();
  }
  await expect(page.locator('.schedule__filters')).toBeHidden();
});

test('les cartes des coachs montrent recto et verso', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Voir la fiche/ })).toHaveCount(0);
  await expect(
    page.getByText('Une barre bien placée vaut mieux que dix kilos de plus.', { exact: false }),
  ).toBeVisible();
});

test('le formulaire ne prétend pas envoyer', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Réserver ma séance/ })).toBeDisabled();
  await expect(page.getByText(/besoin de JavaScript/)).toBeVisible();
});
