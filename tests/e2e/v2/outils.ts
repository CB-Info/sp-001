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
        const butee = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 1;
        if (Math.abs(top - marge) <= 2) return 'arrivée';
        return butee && top > marge && top < innerHeight ? 'arrivée' : `haut à ${top} px`;
      }, MARGE_ANCRE),
    )
    .toBe('arrivée');
}

/**
 * Clique un lien d'ancre hors de l'écran comme le ferait un visiteur : amené à
 * l'écran d'abord, puis cliqué une image plus tard. Le clic de Playwright fait
 * défiler et clique dans la même image, avant l'événement `scroll` : Lenis
 * partirait alors d'une position périmée.
 */
export async function suivreLien(link: Locator) {
  await link.scrollIntoViewIfNeeded();
  await link.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  await link.click();
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
 * La section des cours s'hydrate à l'approche : une fois montée, chaque fiche
 * perd `data-instant` (CapCourseItem), et ses commandes répondent.
 */
export async function attendreCours(page: Page, slug: string) {
  await page.locator(`#cours-${slug}-bouton`).scrollIntoViewIfNeeded();
  await expect(page.locator(`#cours-${slug} .cap-sheet:not([data-instant])`)).toHaveCount(1);
}

/** Ouvre la fiche d'un cours (accordéon de #cours) ; rien à cliquer si elle l'est déjà. */
export async function ouvrirFiche(page: Page, slug: string) {
  const bouton = page.locator(`#cours-${slug}-bouton`);
  const fiche = page.locator(`#cours-${slug}-fiche`);
  await attendreCours(page, slug);
  if ((await bouton.getAttribute('aria-expanded')) !== 'true') {
    await expect(fiche).toHaveAttribute('hidden', 'until-found');
    await bouton.click();
  }
  await expect(bouton).toHaveAttribute('aria-expanded', 'true');
  await expect(fiche).toBeVisible();
  // La fiche a fini de s'ouvrir (rangée de grille 0fr → 1fr, puis fondus) : la
  // page en dessous ne bouge plus, une ancre suivie depuis elle arrive juste.
  await expect
    .poll(() =>
      page
        .locator(`#cours-${slug}`)
        .evaluate(
          (article) =>
            article
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === 'running').length,
        ),
    )
    .toBe(0);
  return fiche;
}

/**
 * Amène « Ta semaine » à l'écran et attend son hydratation : les onglets des
 * jours (CapWeekDay) ne prennent leurs rôles qu'au montage, à toutes les
 * largeurs (masqués par le CSS dès 64em).
 */
export async function attendreSemaine(page: Page) {
  await page.locator('#semaine').scrollIntoViewIfNeeded();
  await expect(page.locator('#semaine [role="tablist"]')).toBeAttached();
}
