import { expect, test } from '@playwright/test';
import { ouvrirV2 } from './outils';

/**
 * Une maquette non officielle pour un vrai club : elle le dit, elle ne
 * s'indexe pas, n'invente aucune donnée et ne reprend rien de l'ancienne V2.
 */

test('le HTML servi : noindex, une seule icône, aperçu de partage', async ({ request }) => {
  const html = await (await request.get('/v2')).text();
  expect(html).toMatch(/<html[^>]*\sdata-site="v2"/);
  expect(html.match(/<meta name="robots"[^>]*>/g)).toEqual([
    expect.stringMatching(/content="[^"]*noindex/),
  ]);
  expect(html.match(/<link[^>]*rel="icon"[^>]*>/g)).toEqual([
    expect.stringContaining('href="/v2/favicon.svg"'),
  ]);
  // Aucun sponsor de l'ancienne V2.
  expect(html).not.toMatch(/alvar|rylor/i);
});

test('la page montée : mêmes balises, sans doublon', async ({ page, request }) => {
  await ouvrirV2(page);
  await expect(page.locator('html')).toHaveAttribute('data-site', 'v2');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  const icon = page.locator('link[rel="icon"]');
  await expect(icon).toHaveCount(1);
  await expect(icon).toHaveAttribute('href', '/v2/favicon.svg');

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    /CAP Fitness by EBC Sport/,
  );
  const ogImage = page.locator('meta[property="og:image"]');
  await expect(ogImage).toHaveAttribute('content', '/v2/og.png');
  const image = await request.get('/v2/og.png');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toBe('image/png');

  expect(await page.content()).not.toMatch(/alvar|rylor/i);
});

test('ce qui reste à confirmer est écrit, et listé au pied de page', async ({ page }) => {
  await ouvrirV2(page);
  // Le cours, l'agenda et la semaine portent déjà des mentions « à confirmer ».
  await expect(page.locator('.cap-pending').filter({ hasText: 'à confirmer' })).not.toHaveCount(0);

  const liste = page.locator('#a-confirmer');
  await liste.scrollIntoViewIfNeeded();
  await expect(
    liste.getByRole('heading', { name: 'Ce qui reste à confirmer par le club' }),
  ).toBeVisible();
  await expect(liste.getByRole('listitem')).toHaveCount(14);
  for (const item of await liste.getByRole('listitem').all()) await expect(item).toBeVisible();
});

test('le lien vers la V1 dit qu’il s’agit d’un autre projet', async ({ page }) => {
  await ouvrirV2(page);
  const link = page
    .getByRole('contentinfo')
    .getByRole('link', { name: 'Voir un autre projet : CLUSEM, salle fictive', exact: true });
  await link.scrollIntoViewIfNeeded();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/');
});

test('aucun numéro de téléphone inventé', async ({ page }) => {
  await ouvrirV2(page);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  const text = await page.locator('body').innerText();
  // 01 23 45 67 89, 0123456789, 01.23.45.67.89, +33 1 23 45 67 89.
  expect(text).not.toMatch(/(?:0|\+33\s?)[1-9](?:[\s.-]?\d\d){4}/);
});
