import { expect, test } from '@playwright/test';
import { axeViolations } from '../axe';
import { animationsFinies, attendreSemaine, ouvrirFiche, ouvrirV2 } from './outils';

/**
 * axe, WCAG 2.2 AA, sur la page montée et au repos : les contrastes ne se
 * mesurent pas au milieu d'un fondu (intro de la couverture, ouverture d'une
 * fiche ou du menu).
 */
test.describe('axe, WCAG 2.2 AA', () => {
  test('page au repos', async ({ page }) => {
    await ouvrirV2(page);
    await animationsFinies(page);
    expect(await axeViolations(page)).toEqual([]);
  });

  test('menu ouvert', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'le menu vit sous 64em');
    await ouvrirV2(page);
    await page.locator('button[data-cap-menu-trigger]').click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    await animationsFinies(page);
    expect(await axeViolations(page)).toEqual([]);
  });

  test('fiche Cross training ouverte', async ({ page }) => {
    await ouvrirV2(page);
    await ouvrirFiche(page, 'cross-training');
    await animationsFinies(page);
    expect(await axeViolations(page)).toEqual([]);
  });

  test('option « Tu veux du solide » cochée', async ({ page }) => {
    await ouvrirV2(page);
    // Hydratée d'abord : un choix fait avant est perdu (voir clavier.spec.ts).
    await attendreSemaine(page);
    const option = page.getByRole('radio', { name: 'Tu veux du solide' });
    await option.check();
    await expect(option).toBeChecked();
    await animationsFinies(page);
    expect(await axeViolations(page)).toEqual([]);
  });

  test('une question de la FAQ ouverte', async ({ page }) => {
    await ouvrirV2(page);
    const item = page.locator('#infos details[name="faq"]').first();
    await item.locator('summary').click();
    await expect(item).toHaveAttribute('open');
    await expect(item.locator('.cap-practical__answer')).toBeVisible();
    await animationsFinies(page);
    expect(await axeViolations(page)).toEqual([]);
  });
});
