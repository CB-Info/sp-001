import type Lenis from 'lenis';
import { FINE_POINTER, motionAllowed, REDUCED_MOTION } from './env';
import type { Motion } from './gsap';

/**
 * Défilement : une seule source de vérité pour toute la page.
 *
 * - Lenis (défilement lissé) seulement sur ordinateur à pointeur fin et hors
 *   mouvement réduit, en direct : passer en mouvement réduit le retire, revenir
 *   le remet. Le tactile, le clavier et la recherche restent natifs.
 * - Un seul ticker (gsap.ticker) pilote Lenis, ScrollTrigger et la mesure.
 * - `scroll.velocity` (px par image, signée) sert au bandeau et aux stries du
 *   hero, avec ou sans Lenis : Lenis fait défiler la fenêtre elle-même.
 * - Cliquet global des astérisques : `--ratchet` sur :root avance d'un cran tous
 *   les RATCHET_STEP px ; chaque astérisque tourne de 45° par cran (Asterisk.vue).
 * - Les déclencheurs se recalent quand la page change de hauteur (accordéon,
 *   colonnes de l'équipe…) : aucune zone n'a à appeler ScrollTrigger.refresh().
 */
const RATCHET_STEP = 320;
/** Calme exigé avant de recaler les déclencheurs (s) : une seule fois, après l'animation. */
const SETTLE = 0.2;

export const scroll = { velocity: 0, direction: 1 as 1 | -1 };

let lenis: Lenis | undefined;
/** Pause demandée (menu ouvert), mémorisée même avant que Lenis n'existe. */
let paused = false;
let ratchet = -1;

function updateRatchet(y: number) {
  const step = Math.floor(y / RATCHET_STEP);
  if (step === ratchet) return;
  ratchet = step;
  document.documentElement.style.setProperty('--ratchet', String(step));
}

export async function startScroll({ gsap, ScrollTrigger }: Motion) {
  if (!motionAllowed()) return;
  const reduce = matchMedia(REDUCED_MOTION);
  const fine = matchMedia(FINE_POINTER);
  const wanted = () => fine.matches && !reduce.matches;
  let LenisClass: typeof Lenis | undefined;
  // Lenis a défilé : ScrollTrigger se met à jour dans la même image, jamais en
  // dehors du ticker (stop() et start() émettent aussi un défilement).
  let moved = false;

  async function syncLenis() {
    if (!wanted()) {
      // stop() d'abord : il remet l'état de défilement à zéro. Sans lui, le minuteur
      // de fin de défilement natif de Lenis remettrait ses classes sur <html> après
      // destroy() (et lenis-stopped bloque le défilement).
      lenis?.stop();
      lenis?.destroy();
      lenis = undefined;
      return;
    }
    LenisClass ??= (await import('lenis')).default;
    // Les conditions ont pu changer pendant le chargement.
    if (lenis || !wanted()) return;
    lenis = new LenisClass({ lerp: 0.12, anchors: true, autoRaf: false, syncTouch: false });
    lenis.on('scroll', () => (moved = true));
    if (paused) lenis.stop();
  }

  let last = scrollY;
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
    if (moved) {
      moved = false;
      ScrollTrigger.update();
    }
    const y = scrollY;
    scroll.velocity = y - last;
    if (y !== last) scroll.direction = y > last ? 1 : -1;
    last = y;
    updateRatchet(y);
  });
  // Le temps de GSAP suit l'horloge réelle, comme celui de Lenis qu'il pilote.
  gsap.ticker.lagSmoothing(0);

  let settle: gsap.core.Tween | undefined;
  let height: number | undefined;
  new ResizeObserver(([entry]) => {
    const next = entry?.contentRect.height;
    // Le premier relevé (à l'observation) n'est qu'une référence.
    if (height !== undefined && next !== height) {
      settle?.kill();
      settle = gsap.delayedCall(SETTLE, () => ScrollTrigger.refresh());
    }
    height = next;
  }).observe(document.body);

  reduce.addEventListener('change', syncLenis);
  fine.addEventListener('change', syncLenis);
  await syncLenis();
}

/** Overlays (menu) : le défilement de la page s'arrête pendant qu'ils sont ouverts. */
export function pauseScroll() {
  paused = true;
  lenis?.stop();
}

export function resumeScroll() {
  paused = false;
  lenis?.start();
}

/** Défilement programmatique, lissé si Lenis tourne (ancres, « Retour en haut »). */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) lenis.scrollTo(target);
  else if (typeof target === 'number') scrollTo({ top: target });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView();
}
