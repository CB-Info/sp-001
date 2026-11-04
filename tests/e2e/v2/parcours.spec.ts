import { expect, test } from '@playwright/test';
import { gotoClub, TIMEZONE } from './club';

/**
 * Le parcours d'un visiteur : son prénom floqué, le calendrier du jour, les
 * prix à la saison, puis l'essai qui reprend son prénom. Rien n'est envoyé.
 */
test.use({ timezoneId: TIMEZONE });

test.beforeEach(async ({ page }) => {
  await gotoClub(page);
});

test('le prénom se floque sur le maillot et revient dans le formulaire', async ({ page }) => {
  const jersey = page.getByRole('img', { name: /Floque ton maillot/ });
  await expect(jersey).toHaveAccessibleName(/TON NOM, 26/);

  // Les chiffres et symboles ne se floquent pas ; douze caractères au plus.
  await page.locator('#flocage').pressSequentially('Léa-Rose 42!');
  await expect(page.locator('#flocage')).toHaveValue('Léa-Rose ');
  await expect(jersey).toHaveAccessibleName(/LÉA-ROSE, 26/);

  await expect(page.getByLabel('Prénom')).toHaveValue('Léa-Rose');
});

test('le hero annonce le prochain cours, à l’heure du visiteur', async ({ page }) => {
  const touchline = page.locator('.club-hero__touchline');
  await expect(touchline).toContainText('Prochain cours');
  await expect(touchline).toContainText('Force');
  await expect(touchline).toContainText('aujourd’hui, 18 h 30');
  await expect(touchline).toContainText('avec Alex');
});

test('calendrier : aujourd’hui sélectionné, la ligne « Maintenant » avant le prochain cours', async ({
  page,
}) => {
  await expect(page.getByRole('tab', { name: /Mercredi/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  const panel = page.getByRole('tabpanel', { name: /Mercredi/ });
  await expect(panel.locator('.match--done')).toHaveCount(3);
  await expect(panel.locator('.match--next')).toContainText('Force');
  await expect(panel.locator('.day__now')).toContainText('18 h 20');

  // Le filtre « Boxe » vide le reste de la semaine ; « Voir les créneaux » le pose aussi.
  await page.getByLabel('Boxe', { exact: true }).check();
  await page.getByRole('tab', { name: /Vendredi/ }).click();
  await expect(
    page.getByRole('tabpanel', { name: /Vendredi/ }).getByText('Aucun cours de cette discipline'),
  ).toBeVisible();
});

test('club-house : la ligne du jour et « Ouvert maintenant »', async ({ page }) => {
  const house = page.locator('#club-house');
  await expect(house.getByText('Ouvert maintenant')).toBeVisible();
  await expect(house.getByText('jusqu’à 22 h')).toBeVisible();
  await expect(house.locator('tr[aria-current="date"]')).toContainText('Lundi – vendredi');
});

test('abonnements : à la saison, les prix roulent et le macaron se pose', async ({ page }) => {
  const plans = page.locator('#abonnements');
  await expect(plans.getByText('54 € / mois, Sans engagement')).toBeAttached();
  await plans.getByLabel('À la saison').check();
  await expect(plans.getByText('45 € / mois, soit 540 € la saison')).toBeAttached();
  await expect(plans.locator('.cycle__badge')).toHaveCSS('opacity', '1');
});

test('essai : validation, puis billet ; aucune requête ne part', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' || /lea%40|lea@/i.test(request.url())) sent.push(request.url());
  });

  const submit = page.getByRole('button', { name: /Réserver ma séance/ });
  await submit.click();
  await expect(page.getByLabel('Prénom')).toBeFocused();
  await expect(page.getByLabel('Prénom')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText(/adresse e-mail valide/)).toBeVisible();

  await page.getByLabel('Prénom').fill('Léa');
  await page.getByLabel('E-mail').fill('lea@exemple.fr');
  await page.getByLabel('Discipline').selectOption('boxe');
  await page.getByLabel('Le soir').check();
  await submit.click();

  const ticket = page.getByRole('group', { name: 'Billet d’essai' });
  await expect(ticket).toContainText('Léa');
  await expect(ticket).toContainText('Boxe');
  await expect(ticket).toContainText('Le soir');
  await expect(page.getByRole('heading', { name: 'Billet d’essai' })).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('Ton billet d’essai est prêt.');
  expect(sent).toEqual([]);

  await page.getByRole('button', { name: 'Modifier ma demande' }).click();
  await expect(page.getByLabel('Prénom')).toHaveValue('Léa');
});

test('la direction A est un lien pleine page', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Voir la direction A' })).toHaveAttribute(
    'href',
    '/',
  );
});
