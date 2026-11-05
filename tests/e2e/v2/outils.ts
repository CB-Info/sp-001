import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Outils communs des tests de la V2 (/v2, CAP Fitness by EBC Sport, maquette).
 */

/** Marge haute des ancres (v2.css : `[data-site='v2'] [id] { scroll-margin-top: 88px }`). */
export const MARGE_ANCRE = 88;

/**
 * Ouvre /v2 et attend l'app montée : le bouton « Menu » (CapHeader) n'existe
 * qu'après l'hydratation ; sans JS, c'est un lien vers #menu.
 */
export async function ouvrirV2(page: Page, fragment = '') {
  await page.goto(`/v2${fragment}`);
  await expect(page.locator('button[data-cap-menu-trigger]')).toBeAttached();
}

/** Parcourt toute la page par tiers d'écran : chaque zone s'hydrate et joue son entrée. */
export async function parcourir(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 3) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  });
}

/** Haut d'un élément dans la fenêtre, en pixels arrondis. */
export const hautDe = (locator: Locator) =>
  locator.evaluate((element) => Math.round(element.getBoundingClientRect().top));

/**
 * La cible d'une ancre est arrivée sous l'en-tête, à sa marge (course de Lenis
 * comprise) ; trop près du bas du document pour monter jusque-là, elle est à
 * l'écran, la page en butée.
 */
export async function attendreArrivee(page: Page, id: string) {
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await expect
    .poll(() =>
      page.locator(`[id="${id}"]`).evaluate((element, marge) => {
        const { top } = element.getBoundingClientRect();
        const butee =
          Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 1;
        if (Math.abs(top - marge) <= 2) return 'arrivée';
        return butee && top > marge && top < innerHeight ? 'arrivée' : `haut à ${top} px`;
      }, MARGE_ANCRE),
    )
    .toBe('arrivée');
}

/** Plus aucune animation finie (CSS, transition ou Web Animations) ne tourne. */
export async function animationsFinies(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation.playState === 'running' &&
                animation.effect?.getTiming().iterations !== Infinity,
            ).length,
      ),
    )
    .toBe(0);
}

/** Erreurs de console et exceptions non rattrapées, relevées pendant tout le test. */
export function relever(page: Page): string[] {
  const erreurs: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') erreurs.push(`console : ${message.text()}`);
  });
  page.on('pageerror', (error) => erreurs.push(`pageerror : ${error.message}`));
  return erreurs;
}

/**
 * Décale l'heure du navigateur : `Date` part de `instant` (UTC) et avance avec
 * l'heure réelle. Jamais d'horloge figée (page.clock) : GSAP lit Date.now et se
 * figerait avec elle.
 */
export async function deplacerHeure(page: Page, instant: string) {
  await page.addInitScript((cible) => {
    const Reelle = Date;
    const ecart = Reelle.parse(cible) - Reelle.now();
    const maintenant = () => Reelle.now() + ecart;
    globalThis.Date = new Proxy(Reelle, {
      construct: (Cible, args: unknown[]) =>
        Reflect.construct(Cible, args.length ? args : [maintenant()]),
      get: (Cible, cle, recepteur) =>
        cle === 'now' ? maintenant : Reflect.get(Cible, cle, recepteur),
    });
  }, instant);
}

/**
 * Ouvre la fiche d'un cours (accordéon de #cours). La section s'hydrate à
 * l'approche : une fiche fermée et hydratée porte `hidden="until-found"`, son
 * bouton répond alors.
 */
export async function ouvrirFiche(page: Page, slug: string) {
  const bouton = page.locator(`#cours-${slug}-bouton`);
  const fiche = page.locator(`#cours-${slug}-fiche`);
  await bouton.scrollIntoViewIfNeeded();
  await expect(fiche).toHaveAttribute('hidden', 'until-found');
  await bouton.click();
  await expect(bouton).toHaveAttribute('aria-expanded', 'true');
  await expect(fiche).toBeVisible();
  return fiche;
}
