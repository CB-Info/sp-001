import { expect, test } from '@playwright/test';
import { attendreSemaine, deplacerHeure, ouvrirV2 } from './outils';

test('le lien d’évitement mène au contenu', async ({ page }) => {
  await ouvrirV2(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test.describe('menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'le menu vit sous 64em');

  test('ouvert au clavier : focus sur Fermer et gardé dans le dialogue', async ({ page }) => {
    await ouvrirV2(page);
    const trigger = page.locator('button[data-cap-menu-trigger]');
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('aria-controls', 'menu');

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Fermer' })).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Le dialog modal rend le reste de la page inerte : la tabulation fait le tour
    // du dialogue (passant, après le dernier lien, par l'interface du navigateur :
    // document.body), sans jamais toucher la page dessous.
    const stops = (await menu.getByRole('link').count()) + 1;
    const visited: string[] = [];
    for (let step = 0; step < stops + 2; step++) {
      await page.keyboard.press('Tab');
      visited.push(
        await menu.evaluate((dialog) => {
          const active = document.activeElement;
          if (!active || active === document.body) return 'navigateur';
          return dialog.contains(active) ? 'menu' : `page : ${active.outerHTML.slice(0, 80)}`;
        }),
      );
    }
    expect(visited.filter((stop) => stop.startsWith('page'))).toEqual([]);
    // Le tour revient dans le dialogue.
    expect(visited.at(-1)).toBe('menu');
  });

  test('Échap ferme le menu et rend le focus au déclencheur', async ({ page }) => {
    await ouvrirV2(page);
    const trigger = page.locator('button[data-cap-menu-trigger]');
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('fiches des cours', () => {
  test.beforeEach(async ({ page }) => {
    await ouvrirV2(page);
    await page.locator('#cours').scrollIntoViewIfNeeded();
    // Hydratée, une fiche fermée porte hidden="until-found" : les en-têtes répondent.
    await expect(page.locator('#cours-pound-fiche')).toHaveAttribute('hidden', 'until-found');
  });

  test('Entrée et Espace ouvrent la fiche, liée à son en-tête', async ({ page }) => {
    const pound = page.getByRole('button', { name: /^Pound\s:\sla fiche$/ });
    await expect(pound).toHaveAttribute('aria-expanded', 'false');
    await expect(pound).toHaveAttribute('aria-controls', 'cours-pound-fiche');
    // L'en-tête est un bouton dans un titre (motif APG « accordion »).
    await expect(page.locator('h4 > #cours-pound-bouton')).toHaveCount(1);

    await pound.focus();
    await page.keyboard.press('Enter');
    await expect(pound).toHaveAttribute('aria-expanded', 'true');
    const fiche = page.getByRole('region', { name: /^Pound\s:\sla fiche$/ });
    await expect(fiche).toBeVisible();
    await expect(fiche).toHaveAttribute('id', 'cours-pound-fiche');
    await expect(fiche).toHaveAttribute('aria-labelledby', 'cours-pound-bouton');

    // Accordéon non exclusif : Espace ouvre la suivante, la première reste ouverte.
    const jump = page.getByRole('button', { name: /^Cardio Jump\s:\sla fiche$/ });
    await jump.focus();
    await page.keyboard.press(' ');
    await expect(jump).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#cours-cardio-jump-fiche')).toBeVisible();
    await expect(pound).toHaveAttribute('aria-expanded', 'true');

    // Entrée referme.
    await pound.focus();
    await page.keyboard.press('Enter');
    await expect(pound).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#cours-pound-fiche')).toBeHidden();
  });

  test('↑ ↓ Début Fin passent d’un en-tête à l’autre', async ({ page }) => {
    const heads = page.locator('#cours [data-accordion-head]');
    await expect(heads).toHaveCount(8);
    await heads.first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(heads.nth(1)).toBeFocused();
    await page.keyboard.press('End');
    await expect(heads.last()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(heads.first()).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(heads.last()).toBeFocused();
    await page.keyboard.press('Home');
    await expect(heads.first()).toBeFocused();
  });
});

test.describe('semaine en onglets', () => {
  test.skip(({ isMobile }) => !isMobile, 'les onglets des jours vivent sous 64em');

  test('flèches, Début et Fin déplacent le focus ; Entrée active', async ({ page }) => {
    await ouvrirV2(page);
    await page.locator('#semaine').scrollIntoViewIfNeeded();
    const tablist = page.getByRole('tablist', { name: 'Ta semaine.' });
    await expect(tablist).toBeVisible();
    const tabs = tablist.getByRole('tab');
    await expect(tabs).toHaveCount(5);

    // Un seul onglet sélectionné, seul dans l'ordre de tabulation.
    const selected = tablist.getByRole('tab', { selected: true });
    await expect(selected).toHaveCount(1);
    await expect(tablist.locator('[role="tab"]:not([tabindex="-1"])')).toHaveCount(1);
    const start = await tabs.evaluateAll((list) =>
      list.findIndex((tab) => tab.getAttribute('aria-selected') === 'true'),
    );

    await tabs.nth(start).focus();
    await page.keyboard.press('ArrowRight');
    const next = tabs.nth((start + 1) % 5);
    await expect(next).toBeFocused();
    // Activation manuelle : la flèche ne sélectionne pas.
    await expect(next).toHaveAttribute('aria-selected', 'false');
    await page.keyboard.press('Enter');
    await expect(next).toHaveAttribute('aria-selected', 'true');
    const panelId = await next.getAttribute('aria-controls');
    const panel = page.locator(`[id="${panelId}"]`);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('role', 'tabpanel');
    await expect(panel).toHaveAttribute('aria-labelledby', (await next.getAttribute('id')) ?? '');

    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press('End');
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press(' ');
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
  });

  /*
   * Onglet ouvert au montage : le jour courant à Paris ; le week-end, lundi ; un
   * jour sans cours (jeudi), le jour de cours suivant, l'onglet du jour gardant
   * sa marque « aujourd'hui » (CapWeekDay).
   */
  for (const { quand, instant, attendu, jour } of [
    { quand: 'mercredi 18 h 20', instant: '2026-11-04T17:20:00Z', attendu: 'Mer.', jour: 'Mer.' },
    { quand: 'jeudi 12 h 00', instant: '2026-11-05T11:00:00Z', attendu: 'Ven.', jour: 'Jeu.' },
    { quand: 'samedi 10 h 00', instant: '2026-11-07T09:00:00Z', attendu: 'Lun.', jour: null },
  ]) {
    test(`onglet ouvert au montage, ${quand} à Paris : ${attendu}`, async ({ page }) => {
      await deplacerHeure(page, instant);
      await ouvrirV2(page);
      await page.locator('#semaine').scrollIntoViewIfNeeded();
      const tablist = page.getByRole('tablist', { name: 'Ta semaine.' });
      await expect(tablist.getByRole('tab', { selected: true })).toHaveText(
        new RegExp(`^${attendu.replace('.', '\\.')}`),
      );
      // L'onglet du jour garde sa marque, même quand un autre est ouvert.
      const today = tablist.locator('[data-today]');
      if (jour) await expect(today).toHaveText(new RegExp(`^${jour.replace('.', '\\.')}`));
      else await expect(today).toHaveCount(0);
    });
  }
});

test.describe('semaine : mettre en avant', () => {
  test('les flèches passent d’une option à l’autre, l’annonce suit', async ({ page }) => {
    await ouvrirV2(page);
    await attendreSemaine(page);
    const tout = page.getByRole('radio', { name: 'Toute la semaine' });
    await expect(tout).toBeChecked();
    await tout.focus();
    await page.keyboard.press('ArrowRight');
    const cardio = page.getByRole('radio', { name: 'Cardio en musique' });
    await expect(cardio).toBeChecked();
    await expect(cardio).toBeFocused();
    // cardio : lun. 13 h 00, 18 h 15, 19 h 00 et mar. 17 h 15.
    await expect(page.locator('.cap-focus [aria-live="polite"]')).toHaveText(
      /^4\scréneaux mis en avant$/,
    );
  });

  // Les radios marchent avant l'hydratation (mise en avant en CSS) : Vue ne doit pas
  // réécrire `checked` en hydratant (attribut statique dans CapWeekFocus).
  test('un choix fait avant l’hydratation de la semaine lui survit', async ({ page }) => {
    await ouvrirV2(page);
    // Le code de la semaine arrive en retard, comme sur un réseau lent.
    await page.route('**/_nuxt/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });
    await expect(page.locator('#semaine [role="tablist"]')).toHaveCount(0);
    const solide = page.getByRole('radio', { name: 'Tu veux du solide' });
    await solide.check();
    await attendreSemaine(page);
    await expect(solide).toBeChecked();
    await expect(page.getByRole('radio', { name: 'Toute la semaine' })).not.toBeChecked();
  });
});

test('FAQ : un « details » s’ouvre au clavier, un seul reste ouvert', async ({ page }) => {
  await ouvrirV2(page);
  const items = page.locator('#infos details[name="faq"]');
  await expect(items).toHaveCount(8);
  await expect(page.locator('#infos details[name="faq"][open]')).toHaveCount(0);

  const first = items.nth(0);
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('open');
  await expect(first.locator('.cap-practical__answer')).toBeVisible();

  const second = items.nth(1);
  await second.locator('summary').focus();
  await page.keyboard.press(' ');
  await expect(second).toHaveAttribute('open');
  await expect(first).not.toHaveAttribute('open');
  await expect(page.locator('#infos details[name="faq"][open]')).toHaveCount(1);
});
