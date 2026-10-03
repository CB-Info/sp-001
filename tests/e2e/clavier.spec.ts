import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeVisible();
});

test('le lien d’évitement mène au contenu', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('menu : focus sur Fermer, Échap rend le focus au déclencheur', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Menu', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('dialog', { name: 'Menu principal' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fermer le menu' })).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Menu principal' })).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('programmes : un seul panneau ouvert à la fois', async ({ page }) => {
  const heads = page.locator('[data-accordion-head]');
  await expect(heads.first()).toHaveAttribute('aria-expanded', 'true');
  await expect(heads.nth(1)).toHaveAttribute('aria-expanded', 'false');

  await heads.nth(1).click();
  await expect(heads.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(heads.first()).toHaveAttribute('aria-expanded', 'false');
});
