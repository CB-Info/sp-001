/**
 * Les valeurs de mouvement ne sont écrites qu'une fois, dans tokens.css. Le JS
 * les relit ici (getComputedStyle) au lieu de les recopier : une courbe ou une
 * durée changée en CSS change aussi les timelines GSAP.
 *
 * Chaque lecture force un calcul de style (et de mise en page pour une longueur) :
 * les valeurs sont gardées, les longueurs jusqu'au prochain redimensionnement
 * (rem, clamp() et vw en dépendent).
 */
const rootStyle = () => getComputedStyle(document.documentElement);
const times = new Map<string, number>();
const lengths = new Map<string, number>();
let lengthsWatched = false;

/** Temps d'un token (« 240ms » ou « 0.24s ») en secondes, l'unité de GSAP. */
function seconds(token: `--${string}`): number {
  const known = times.get(token);
  if (known !== undefined) return known;
  const value = rootStyle().getPropertyValue(token).trim();
  const amount = Number.parseFloat(value);
  const result = value.endsWith('ms') ? amount / 1000 : amount;
  times.set(token, result);
  return result;
}

/** Durée d'un token (--dur-*, ou --seq-max, le plafond d'une séquence), en secondes. */
export const duration = (token: `--dur-${string}` | '--seq-max'): number => seconds(token);

/** Décalage entre les éléments d'une cascade (--stagger-*), en secondes. */
export const stagger = (token: `--stagger-${string}`): number => seconds(token);

/** Points de contrôle d'un token « cubic-bezier(x1, y1, x2, y2) ». */
export function bezier(token: `--ease-${string}`): string {
  const value = rootStyle().getPropertyValue(token);
  const points = /cubic-bezier\(([^)]+)\)/.exec(value)?.[1];
  if (!points) throw new Error(`${token} n'est pas une courbe cubic-bezier : « ${value} »`);
  return points.replaceAll(' ', '');
}

/**
 * Longueur d'un token, résolue en pixels (rem, clamp() et calc() compris). Avec un
 * `context`, elle est résolue dans ce conteneur (unités locales) et jamais gardée.
 */
export function length(token: `--${string}`, context?: Element): number {
  const known = context ? undefined : lengths.get(token);
  if (known !== undefined) return known;
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;inline-size:var(${token})`;
  (context ?? document.documentElement).append(probe);
  const px = probe.getBoundingClientRect().width;
  probe.remove();
  if (!context) {
    if (!lengthsWatched) {
      lengthsWatched = true;
      addEventListener('resize', () => lengths.clear(), { passive: true });
    }
    lengths.set(token, px);
  }
  return px;
}

/** Noms des courbes enregistrées dans CustomEase : les mêmes qu'en CSS (--ease-<nom>). */
export const EASES = ['out', 'out-soft', 'in', 'in-out', 'strike'] as const;
