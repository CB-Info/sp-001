/**
 * Conditions du mouvement, lues dans le navigateur.
 *
 * Règle de la page : l'état par défaut du DOM et du CSS est l'état FINAL. Le
 * mouvement n'existe que sous html.has-motion, posé par app/motion/boot.inline.js
 * (JS actif et pas de mouvement réduit), et suit les changements en direct.
 */
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export const motionAllowed = (): boolean =>
  document.documentElement.classList.contains('has-motion');

export const hasFinePointer = (): boolean => matchMedia(FINE_POINTER).matches;

let intro: Promise<void> | undefined;

/**
 * Fin de l'intro de la couverture de la V2 (keyframes CSS, CapCover.vue). Tant
 * qu'elle joue, GSAP et Lenis attendent : leur chargement et leur mise en place
 * gelaient sinon l'écriture du tracé (clip-path animé sur le fil principal).
 *
 * Résout tout de suite hors de la V2, ou sans intro (mouvement réduit, arrivée
 * par ancre, bfcache) : la V1 ne change pas. Filet : 2,6 s après le premier
 * appel (hero-ready au plus 1,2 s après le script de tête, qui précède tout
 * appel, puis 1,3 s d'intro au plus).
 */
export function introDone(): Promise<void> {
  intro ??= new Promise<void>((resolve) => {
    const html = document.documentElement;
    if (html.dataset.site !== 'v2' || !html.classList.contains('hero-intro')) return resolve();
    // En pause avant hero-ready, finies sans rien retenir (remplissage backwards).
    const running = document
      .getAnimations()
      .filter((a) => 'animationName' in a && String(a.animationName).startsWith('cap-cover-'));
    if (running.length === 0) return resolve();
    setTimeout(resolve, 2600);
    Promise.all(running.map((a) => a.finished.catch(() => undefined))).then(() => resolve());
  });
  return intro;
}
