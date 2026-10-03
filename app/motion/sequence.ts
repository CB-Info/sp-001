/**
 * Règles d'écriture communes à toutes les chorégraphies
 * (docs/analyse/annexes/a6-motion.md §3).
 */

/** a6 §3.4 : six éléments en cascade au plus ; les suivants partagent le dernier délai. */
const CASCADE_LIMIT = 6;

/**
 * Décalage plafonné, en fonction GSAP (`stagger: capped(each)`) ou appelé à la main
 * (`capped(each)(index)`). `fromEnd` fait partir la cascade du dernier élément ; il
 * lui faut la liste, que GSAP fournit.
 */
export const capped =
  (each: number, fromEnd = false) =>
  (index: number, _target?: unknown, list: ArrayLike<unknown> = []) =>
    Math.min(fromEnd ? list.length - 1 - index : index, CASCADE_LIMIT - 1) * each;

/** Entrée d'une section ou d'un élément : à 85 % de l'écran, une seule fois, jamais rejouée. */
export const ENTRY = { start: 'top 85%', once: true } as const;

/**
 * Déjà à l'écran, ou dépassé, quand GSAP arrive (ancre, rechargement, défilement
 * très vif) : l'entrée ne se joue pas et l'état final reste. On ne retire jamais
 * un contenu visible pour le rejouer.
 */
export const reached = (element: Element, edge: 'top' | 'bottom' = 'top'): boolean =>
  element.getBoundingClientRect()[edge] < innerHeight;
