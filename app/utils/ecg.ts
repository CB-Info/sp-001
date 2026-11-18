/**
 * Le tracé ECG du logo CAP, reconstruit au point près (brief §2.8).
 *
 * Fonctions pures, sans DOM : elles tournent au rendu serveur, le navigateur ne
 * calcule aucune géométrie. Le même complexe sert partout (logo, couverture,
 * semaine, fin) ; seuls le style de trait et l'amplitude changent.
 */

/** Complexe canonique : x en fraction de l'empan, y en fraction de l'amplitude R (haut positif). */
export const ECG = [
  [0, 0],
  [0.115, 0.435],
  [0.3, -0.375],
  [0.54, 1],
  [0.59, -0.92],
  [0.85, 0.295],
  [1, 0],
] as const;

/** Position du pic R dans le complexe, et rapport empan / amplitude. */
export const R_AT = 0.54;
export const SPAN_RATIO = 0.9;

export type Point = readonly [number, number];

const round = (value: number) => Math.round(value * 100) / 100;

/** Les 7 points d'un complexe dont le pic R tombe en `xR` (y vers le bas, comme en SVG). */
export function complexAtR(xR: number, baseline: number, amp: number): Point[] {
  const span = SPAN_RATIO * amp;
  const start = xR - R_AT * span;
  return ECG.map(([fx, fy]) => [round(start + fx * span), round(baseline - fy * amp)] as const);
}

/** Les mêmes points, à partir du début du complexe plutôt que de son pic. */
export function complexFrom(
  xStart: number,
  baseline: number,
  amp: number,
  span = SPAN_RATIO * amp,
): Point[] {
  return ECG.map(([fx, fy]) => [round(xStart + fx * span), round(baseline - fy * amp)] as const);
}

/** Chemin SVG d'une suite de points. */
export function path(points: readonly Point[]): string {
  return points.map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join('');
}

/**
 * Une bande : la ligne de base continue, plus un chemin par complexe (chacun peut
 * s'aplatir seul, par son `transform-origin` posé sur la ligne de base).
 */
export function strip(
  width: number,
  baseline: number,
  beats: { xR: number; amp: number }[],
): { line: string; complexes: string[] } {
  const sorted = [...beats].sort((a, b) => a.xR - b.xR);
  const complexes = sorted.map(({ xR, amp }) => path(complexAtR(xR, baseline, amp)));
  return { line: `M0 ${baseline}H${width}`, complexes };
}

/** Pointe effilée d'un tracé plein : de largeur 0 à `w` sur 3 × `w`. */
export function taperedStart(x0: number, y: number, w: number): string {
  return `M${x0} ${y}L${x0 + 3 * w} ${round(y - w / 2)}L${x0 + 3 * w} ${round(y + w / 2)}Z`;
}
