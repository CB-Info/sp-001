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
