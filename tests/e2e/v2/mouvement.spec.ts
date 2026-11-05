import { expect, test } from '@playwright/test';
import { ouvrirFiche, ouvrirV2, parcourir } from './outils';

/**
 * Le mouvement ne doit jamais coûter le contenu : l'intro de la couverture
 * finit dans sa partition, chaque entrée finit à l'état final, et passer en
 * mouvement réduit en cours de visite défait tout.
 *
 * Pas d'horloge Playwright ici : GSAP lit Date.now, une horloge figée le fige.
 */
test.use({ contextOptions: { reducedMotion: 'no-preference' } });

/**
 * Styles qu'une animation des composants cap/ pose en ligne (GSAP, O2) et qui
 * doivent disparaître à l'arrêt : opacité et montée (CapBook), échelle de la
 * photo Force et clip-path de la ligne du calme (CapCourses), clip-path du logo
 * (CapFooter), autoAlpha et --cursor de la bande (CapWeek), --frappe (CapEdito,
 * CapFamily), --fin-beat et --fin-amp (CapFinale), transform du tracé (CapCover).
 * Les variables de mise en page (--i, --x, --y, --em-*, --signs…) ne bougent pas.
 */
const MOTION_STYLE =
  /(?:^|;)\s*(?:opacity|transform|translate|rotate|scale|clip-path|visibility|will-change|--cursor|--frappe|--fin-beat|--fin-amp)\s*:/;

/** Fin de la partition de l'intro (CapCover.vue : 1 240 ms), plus une marge, sous --seq-max. */
const INTRO_MAX = 1400;

test('l’intro de la couverture joue, puis finit dans sa partition', async ({ page }) => {
  // Relevé posé avant tout script de la page : les animations de l'intro sont
  // saisies dès hero-ready, avant qu'aucune ne finisse (remplissage backwards,
  // finies elles disparaissent de getAnimations()).
  await page.addInitScript(() => {
    const win = window as typeof window & { __intro?: Promise<Animation[]> };
    win.__intro = new Promise((resolve) => {
      // <html> n'existe pas encore quand ce script s'exécute : on observe le document.
      const observer = new MutationObserver(() => {
        if (!document.documentElement?.classList.contains('hero-ready')) return;
        observer.disconnect();
        resolve(
          document
            .getAnimations()
            .filter((animation) =>
              String((animation as CSSAnimation).animationName ?? '').startsWith('cap-cover-'),
            ),
        );
      });
      observer.observe(document, { subtree: true, attributes: true, attributeFilter: ['class'] });
    });
  });
  await page.goto('/v2', { waitUntil: 'commit' });
  const html = page.locator('html');
  await expect(html).toHaveClass(/\bhero-intro\b/);
  // Le bouton n'est jamais animé : cliquable et opaque dès le départ.
  await expect(page.locator('[data-cover-cta]')).toHaveCSS('opacity', '1');
  await expect(html).toHaveClass(/\bhero-ready\b/);

  const intro = await page.evaluate(async () => {
    const win = window as typeof window & { __intro?: Promise<Animation[]> };
    const animations = (await win.__intro) ?? [];
    await Promise.all(animations.map((animation) => animation.ready));
    const name = (animation: Animation) => String((animation as CSSAnimation).animationName);
    const veil = animations.find((animation) => name(animation).startsWith('cap-cover-veil'));
    const start = Number(veil?.startTime ?? Number.NaN);
    const ends = animations.map((animation) => ({
      name: name(animation).replace(/-[\w]+$/, ''),
      end: Math.round(
        Number(animation.startTime) + Number(animation.effect?.getComputedTiming().endTime) - start,
      ),
    }));
    await Promise.all(animations.map((animation) => animation.finished));
    return {
      names: [...new Set(ends.map(({ name }) => name))].sort(),
      last: Math.max(...ends.map(({ end }) => end)),
      finished: Math.round(Number(document.timeline.currentTime) - start),
      left: document
        .getAnimations()
        .filter((animation) => name(animation).startsWith('cap-cover-'))
        .map(name),
    };
  });

  // Écrire, frapper, se poser : toutes les voix de la partition ont joué.
  expect(intro.names).toEqual(
    expect.arrayContaining([
      'cap-cover-enter',
      'cap-cover-fade',
      'cap-cover-ghost',
      'cap-cover-rise',
      'cap-cover-rise-step',
      'cap-cover-strike',
      'cap-cover-veil',
      'cap-cover-write',
    ]),
  );
  expect(intro.last).toBeGreaterThanOrEqual(1200);
  expect(intro.last).toBeLessThanOrEqual(INTRO_MAX);
  expect(intro.left).toEqual([]);
  // Finies pour de bon, pas seulement sur le papier (une image de retard tolérée).
  expect(intro.finished).toBeLessThanOrEqual(INTRO_MAX + 100);
});

test('après un parcours complet, aucun élément visible ne reste à demi effacé', async ({
  page,
}) => {
  await ouvrirV2(page);
  await expect(page.locator('html')).toHaveClass(/has-motion/);
  await parcourir(page);
  // Une opacité posée en ligne doit être revenue à l'état final du CSS : pour un
  // voile (Famille), cet état est transparent.
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>('body *')]
            .filter((element) => element.style.opacity !== '')
            .filter((element) => element.checkVisibility({ visibilityProperty: true }))
            .filter((element) => {
              const now = Number(getComputedStyle(element).opacity);
              if (now >= 1) return false;
              const inline = element.style.opacity;
              element.style.removeProperty('opacity');
              const rest = Number(getComputedStyle(element).opacity);
              element.style.opacity = inline;
              return now < rest;
            })
            .map((element) => `${element.className} → ${element.style.opacity}`),
        ),
      { timeout: 10_000 },
    )
    .toEqual([]);
});

test('passer en mouvement réduit en cours de visite rend l’état final', async ({ page }) => {
  await ouvrirV2(page);
  await parcourir(page);
  // Des animations nées après coup : une fiche, une option de la semaine.
  await ouvrirFiche(page, 'caf');
  await page.getByRole('radio', { name: 'Force et intensité' }).check();
  await page.locator('#fin').scrollIntoViewIfNeeded();

  await page.emulateMedia({ reducedMotion: 'reduce' });

  const html = page.locator('html');
  await expect(html).not.toHaveClass(/has-motion/);
  await expect(html).not.toHaveClass(/hero-intro/);
  await expect(html).not.toHaveClass(/\blenis/);
  // Le minuteur de fin de défilement de Lenis ne doit pas remettre ses classes.
  await page.waitForTimeout(600);
  await expect(html).not.toHaveClass(/\blenis/);
  const leftovers = await page.evaluate(
    (pattern) =>
      [...document.querySelectorAll<HTMLElement>('body *')]
        .filter((element) => new RegExp(pattern).test(element.getAttribute('style') ?? ''))
        .map((element) => `${element.className} → ${element.getAttribute('style')}`),
    MOTION_STYLE.source,
  );
  expect(leftovers).toEqual([]);
});
