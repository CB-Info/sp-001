import type { Ref } from 'vue';
import { motionAllowed } from '~/motion/env';
import { loadGsap, type Motion } from '~/motion/gsap';

type Setup = (motion: Motion, root: HTMLElement) => (() => void) | undefined;

/**
 * Mouvement d'un composant, isolé dans son propre périmètre :
 *
 * - rien ne se charge ni ne s'exécute hors de html.has-motion : l'état du DOM
 *   est déjà l'état final ;
 * - GSAP n'est chargé qu'à l'approche de la section (marge de 50 % de l'écran),
 *   donc ses états initiaux (`from`) sont posés avant qu'elle soit visible ;
 * - `setup` tourne dans un gsap.context() limité à `root`, sous un matchMedia
 *   « mouvement autorisé » : passer en mouvement réduit en cours de visite défait
 *   tout ; démonter le composant aussi.
 */
export function useMotion(scope: Readonly<Ref<HTMLElement | null>>, setup: Setup) {
  let revert: (() => void) | undefined;
  let observer: IntersectionObserver | undefined;

  onMounted(() => {
    const root = scope.value;
    if (!root || !motionAllowed()) return;
    observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer?.disconnect();
        const motion = await loadGsap();
        const context = motion.gsap.context(() => {
          motion.gsap
            .matchMedia()
            .add('(prefers-reduced-motion: no-preference)', () => setup(motion, root));
        }, root);
        revert = () => context.revert();
      },
      { rootMargin: '50% 0px' },
    );
    observer.observe(root);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    revert?.();
  });
}
