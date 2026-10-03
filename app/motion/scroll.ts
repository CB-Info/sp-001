import type Lenis from 'lenis';
import { hasFinePointer, motionAllowed } from './env';
import type { Motion } from './gsap';

/**
 * Défilement : une seule source de vérité pour toute la page.
 *
 * - Lenis (défilement lissé) seulement sur ordinateur à pointeur fin et hors
 *   mouvement réduit ; le tactile, le clavier et la recherche restent natifs.
 * - Un seul ticker (gsap.ticker) pilote Lenis et ScrollTrigger.
 * - `scroll.velocity` (px par image, signée) sert au bandeau et aux stries du
 *   hero, avec ou sans Lenis.
 * - Cliquet global des astérisques : `--ratchet` sur :root avance d'un cran tous
 *   les RATCHET_STEP px ; chaque astérisque tourne de 45° par cran (Asterisk.vue).
 */
const RATCHET_STEP = 320;

export const scroll = { velocity: 0, direction: 1 as 1 | -1 };

let lenis: Lenis | undefined;
let ratchet = -1;

function updateRatchet(y: number) {
  const step = Math.floor(y / RATCHET_STEP);
  if (step === ratchet) return;
  ratchet = step;
  document.documentElement.style.setProperty('--ratchet', String(step));
}

export async function startScroll({ gsap, ScrollTrigger }: Motion) {
  if (!motionAllowed()) return;

  if (hasFinePointer()) {
    const { default: LenisClass } = await import('lenis');
    lenis = new LenisClass({ lerp: 0.12, anchors: true, autoRaf: false, syncTouch: false });
    lenis.on('scroll', ({ scroll: y, velocity, direction }) => {
      scroll.velocity = velocity;
      scroll.direction = direction === -1 ? -1 : 1;
      updateRatchet(y);
      ScrollTrigger.update();
    });
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    let last = scrollY;
    gsap.ticker.add(() => {
      const y = scrollY;
      scroll.velocity = y - last;
      if (y !== last) scroll.direction = y > last ? 1 : -1;
      last = y;
      updateRatchet(y);
    });
  }
  updateRatchet(scrollY);
}

/** Overlays (menu) : le défilement de la page s'arrête pendant qu'ils sont ouverts. */
export const pauseScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();

/** Défilement programmatique, lissé si Lenis tourne (ancres, « Retour en haut »). */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) lenis.scrollTo(target);
  else if (typeof target === 'number') scrollTo({ top: target });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView();
}
