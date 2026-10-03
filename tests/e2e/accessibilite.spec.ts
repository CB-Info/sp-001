import { expect, test } from '@playwright/test';
import { axeViolations } from './axe';

test.describe('axe, WCAG 2.2 AA', () => {
  test('page au repos', async ({ page }) => {
    await page.goto('/');
    // Le bouton Menu n'existe qu'après l'hydratation : on audite la page montée.
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test('menu ouvert', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Menu principal' })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });
});
