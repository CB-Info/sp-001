import { expect, test } from '@playwright/test';
import { axeViolations } from '../axe';
import { gotoClub, isNarrow, scrollThrough, TIMEZONE } from './club';

test.use({ timezoneId: TIMEZONE });

test.describe('direction B : axe, WCAG 2.2 AA', () => {
  test('page au repos, après le défilement', async ({ page }) => {
    await gotoClub(page);
    await scrollThrough(page);
    await page.waitForTimeout(1500);
    expect(await axeViolations(page)).toEqual([]);
  });

  test('tiroir vestiaire ouvert', async ({ page }) => {
    test.skip(!isNarrow(page), 'Sur grand écran, la navigation est visible : pas de tiroir.');
    await gotoClub(page);
    await page.getByRole('button', { name: 'Vestiaire' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu du club' })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });

  test('carte retournée, saison choisie, formulaire en erreur puis billet', async ({ page }) => {
    // Les clics font défiler la page : sans mouvement, aucune entrée n'est en cours
    // quand axe mesure les contrastes (le mouvement a ses propres tests).
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoClub(page);
    await page.getByRole('button', { name: /Voir la fiche : Alex/ }).click();
    await page.getByLabel('À la saison').check();
    await page.getByRole('button', { name: /Réserver ma séance/ }).click();
    await expect(page.getByText('Écris ton prénom.')).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);

    await page.getByLabel('Prénom').fill('Léa');
    await page.getByLabel('E-mail').fill('lea@exemple.fr');
    await page.getByLabel('Discipline').selectOption('boxe');
    await page.getByRole('button', { name: /Réserver ma séance/ }).click();
    await expect(page.getByRole('heading', { name: 'Billet d’essai' })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });
});
