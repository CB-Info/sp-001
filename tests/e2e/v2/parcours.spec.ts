import { expect, test } from '@playwright/test';
import { attendreArrivee, ouvrirV2, parcourir, relever } from './outils';

/** Les quatre chapitres de l'en-tête et du menu (cap.nav), et leur cible. */
const CHAPITRES = [
  { label: 'Cours', id: 'cours' },
  { label: 'Semaine', id: 'semaine' },
  { label: 'Famille', id: 'famille' },
  { label: 'Tarifs & infos', id: 'infos' },
];

test('chaque section a un titre visible', async ({ page }) => {
  await ouvrirV2(page);
  const sections = page.locator('main section[aria-labelledby]');
  // Couverture, Bouge, Cours, Semaine, Réserver, Famille, Infos, Fin.
  await expect(sections).toHaveCount(8);
  for (const section of await sections.all()) {
    const titleId = await section.getAttribute('aria-labelledby');
    await expect(page.locator(`[id="${titleId}"]`)).toBeVisible();
  }
});

test('le bandeau « maquette non officielle » est visible au chargement', async ({ page }) => {
  await page.goto('/v2');
  const bandeau = page.getByRole('complementary', { name: 'Maquette non officielle' });
  await expect(bandeau).toBeInViewport();
  await expect(bandeau).toContainText(/maquette non officielle/i);

  await bandeau.getByRole('link', { name: 'Ce qui reste à confirmer' }).click();
  await attendreArrivee(page, 'a-confirmer');
});

test('en-tête : chaque chapitre mène à sa section', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'les chapitres de l’en-tête vivent dès 64em');
  await ouvrirV2(page);
  const nav = page.getByRole('banner').getByRole('navigation');
  for (const { label, id } of CHAPITRES) {
    const link = nav.getByRole('link', { name: label, exact: true });
    await link.click();
    await attendreArrivee(page, id);
    await expect(link).toHaveAttribute('aria-current', 'true');
  }

  await page.getByRole('banner').getByRole('link', { name: 'Réserve ta place' }).click();
  await attendreArrivee(page, 'reserver');
});

test('menu : chaque chapitre mène à sa section et ferme le menu', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'bureau', 'le menu vit sous 64em');
  await ouvrirV2(page);
  const trigger = page.locator('button[data-cap-menu-trigger]');
  const menu = page.getByRole('dialog', { name: 'Menu' });
  for (const { label, id } of [...CHAPITRES, { label: 'Réserve ta place', id: 'reserver' }]) {
    await trigger.click();
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: label, exact: true }).click();
    await expect(menu).toBeHidden();
    await attendreArrivee(page, id);
  }
});

test('« Réserve ta place » de la couverture mène à #reserver', async ({ page }) => {
  await ouvrirV2(page);
  await page.locator('#haut').getByRole('link', { name: 'Réserve ta place' }).click();
  await attendreArrivee(page, 'reserver');
  await expect(
    page.locator('#reserver').getByRole('heading', { name: 'Ta place t’attend.' }),
  ).toBeVisible();
});

test('barre « Prochain cours » : elle monte après la couverture et mène à #reserver', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'bureau', 'barre mobile, sous 64em');
  await ouvrirV2(page);
  const barre = page.locator('aside.cap-next');
  // Cachée, elle est inerte : rien n'y reçoit le focus.
  await expect(barre).not.toHaveClass(/is-shown/);
  await expect(barre).toHaveAttribute('inert');

  await page.locator('#cours').scrollIntoViewIfNeeded();
  await expect(barre).toHaveClass(/is-shown/);
  await expect(barre).not.toHaveAttribute('inert');
  await expect(barre).toContainText(/Prochain cours|Premier cours de la semaine/);

  const lien = barre.getByRole('link', { name: 'Réserver', exact: true });
  await expect(lien).toBeInViewport();
  await lien.click();
  await attendreArrivee(page, 'reserver');
  // #reserver porte déjà l'action citron : la barre redescend.
  await expect(barre).not.toHaveClass(/is-shown/);
});

test('aucune erreur de console sur tout le parcours', async ({ page }) => {
  const erreurs = relever(page);
  await ouvrirV2(page);
  await parcourir(page);
  await expect(page.getByRole('contentinfo')).toBeInViewport();
  // Les chapitres hydratés à l'approche ont chargé leur code.
  await page.waitForLoadState('networkidle');
  expect(erreurs).toEqual([]);
});
