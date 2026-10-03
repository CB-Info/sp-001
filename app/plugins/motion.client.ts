import { motionAllowed } from '~/motion/env';
import { loadGsap } from '~/motion/gsap';
import { startScroll } from '~/motion/scroll';

/**
 * Démarre le système de défilement (Lenis, vitesse, cliquet des astérisques)
 * quand le navigateur est libre, après l'hydratation : rien de tout cela ne
 * retarde le premier rendu ni l'intro du hero, qui est en CSS.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    if (!motionAllowed()) return;
    const start = () => loadGsap().then(startScroll);
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 200);
  });
});
