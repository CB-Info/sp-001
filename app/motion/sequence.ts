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

/** a6 §3.5 : un élément entre quand son haut passe à 85 % de la hauteur de l'écran. */
const ENTRY_LINE = 0.85;

/**
 * Entrée d'une section ou d'un élément : son haut à 85 % de l'écran, une seule fois,
 * jamais rejouée. Un élément trop près du bas du document pour atteindre cette ligne
 * entre juste avant la butée, au lieu de rester dans son état initial : ScrollTrigger
 * ne recale ce cas qu'à un rafraîchissement global, pas pour un déclencheur créé
 * plus tard, comme les nôtres.
 */
export const ENTRY = {
  start: ({ trigger }: { trigger?: Element }) => {
    if (!trigger) return `top ${ENTRY_LINE * 100}%`;
    const line = trigger.getBoundingClientRect().top + scrollY - innerHeight * ENTRY_LINE;
    return Math.min(line, document.documentElement.scrollHeight - innerHeight - 1);
  },
  once: true,
} as const;

/**
 * Déjà à l'écran, ou dépassé, quand GSAP arrive (ancre, rechargement, défilement
 * très vif) : l'entrée ne se joue pas et l'état final reste. On ne retire jamais
 * un contenu visible pour le rejouer.
 */
export const reached = (element: Element, edge: 'top' | 'bottom' = 'top'): boolean =>
  element.getBoundingClientRect()[edge] < innerHeight;
