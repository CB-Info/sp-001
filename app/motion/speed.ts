/**
 * Effets liés à la vitesse (filé du hero, échos de la typo géante) : une même
 * lecture de la vitesse et un même retour au repos, pour qu'ils répondent ensemble.
 */

/** En deçà (px par image), un déplacement compte pour nul : un défilement de lecture ne file rien. */
const DEADZONE = 2;
/** Vitesse (px par image à 60 i/s) à laquelle un effet est à son plein : un défilement vif. */
export const FULL_SPEED = 37;
/** Rapprochement d'un effet vers sa cible, par image à 60 i/s : retour au repos en ≈ 300 ms. */
const FOLLOW = 0.15;
/** En dessous, un effet est éteint. */
export const REST = 0.02;

/** Intensité signée d'un déplacement (px par image), dans [−1, 1]. */
export function intensity(pixels: number, full = FULL_SPEED): number {
  const magnitude = Math.max(Math.abs(pixels) - DEADZONE, 0) / full;
  return Math.sign(pixels) * Math.min(magnitude, 1);
}

/**
 * Un pas de lissage de `level` vers `target`, indépendant de la cadence d'affichage
 * (`frames` : images à 60 i/s écoulées, gsap.ticker.deltaRatio(60)). Rend 0 une
 * fois l'effet éteint.
 */
export function approach(level: number, target: number, frames: number): number {
  const next = level + (target - level) * (1 - (1 - FOLLOW) ** frames);
  return target === 0 && Math.abs(next) < REST ? 0 : next;
}
