import { expect, test } from '@playwright/test';
import { gotoClub, isNarrow, TIMEZONE } from './club';

test.use({ timezoneId: TIMEZONE });

test.beforeEach(async ({ page }) => {
  await gotoClub(page);
});

test('le lien d’évitement mène au contenu', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('jours du calendrier : flèches, Début et Fin', async ({ page }) => {
  const wednesday = page.getByRole('tab', { name: /Mercredi/ });
  await wednesday.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Jeudi/ })).toBeFocused();
  await expect(page.getByRole('tab', { name: /Jeudi/ })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: /Dimanche/ })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Lundi/ })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: /Lundi/ })).toBeVisible();
  await expect(page.getByRole('tabpanel', { name: /Mercredi/ })).toBeHidden();
});

test('disciplines : la liste pilote la photo au clavier', async ({ page }) => {
  test.skip(isNarrow(page), 'Sur mobile, les disciplines sont des cartes.');
  const force = page.getByRole('tab', { name: /Force/ });
  await force.focus();
  await page.keyboard.press('ArrowDown');
  const crossTraining = page.getByRole('tab', { name: /Cross-training/ });
  await expect(crossTraining).toBeFocused();
  await expect(crossTraining).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#discipline-panneau')).toContainText('Poussée de traîneau');
});

test('carte d’un coach : le bouton la retourne, la face cachée est inerte', async ({ page }) => {
  const flip = page.getByRole('button', { name: /Voir la fiche : Elena/ });
  await flip.focus();
  await page.keyboard.press('Enter');
  const back = page.getByRole('button', { name: /Retourner la carte : Elena/ });
  await expect(back).toBeFocused();
  const card = page.locator('article', { has: back });
  await expect(card.locator('.card__front')).toHaveAttribute('inert', '');
  await expect(card.locator('.card__back')).not.toHaveAttribute('inert', '');
  await expect(card).toContainText('Mobilité');
});

test('tiroir vestiaire : Échap le ferme, un lien suivi aussi', async ({ page }) => {
  test.skip(!isNarrow(page), 'Sur grand écran, la navigation est visible : pas de tiroir.');
  const trigger = page.getByRole('button', { name: 'Vestiaire' });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'Menu du club' });
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();

  await trigger.click();
  await drawer.getByRole('link', { name: /Effectif/ }).click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/#effectif$/);
});

test('questions : un seul panneau ouvert à la fois', async ({ page }) => {
  const questions = page.locator('#questions summary');
  await questions.nth(0).click();
  await questions.nth(1).click();
  await expect(page.locator('#questions details[open]')).toHaveCount(1);
});
