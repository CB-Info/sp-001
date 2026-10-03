import type { Ref } from 'vue';
import { motionAllowed } from '~/motion/env';
import { loadGsap, type Motion } from '~/motion/gsap';

/**
 * Rend sûre une fonction appelée plus tard (watch, événement, rappel) : les
 * animations qu'elle crée rejoignent le contexte de la zone et sont défaites avec lui.
 */
export type ContextSafe = <A extends unknown[], R>(
  callback: (...args: A) => R,
) => (...args: A) => R;

/** `context.add(fn)` exécute fn dans le contexte : tout ce qu'elle anime y est enregistré. */
const safeIn =
  (context: gsap.Context): ContextSafe =>
  (callback) =>
  (...args) =>
    context.add(() => callback(...args));

/**
 * Rend la main au navigateur : les zones qui approchent ensemble préparent chacune
 * leur mouvement dans leur propre tâche, au lieu d'une seule tâche longue.
 */
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve));

type Setup = (
  motion: Motion,
  root: HTMLElement,
  contextSafe: ContextSafe,
) => (() => void) | undefined;

/**
 * Mouvement d'un composant, isolé dans son propre périmètre :
 *
 * - rien ne se charge ni ne s'exécute hors de html.has-motion : l'état du DOM
 *   est déjà l'état final ;
 * - GSAP n'est chargé qu'à l'approche de la section (marge de 50 % de l'écran),
 *   donc ses états initiaux (`from`) sont posés avant qu'elle soit visible ;
 * - `setup` tourne dans un gsap.context() limité à `root`, sous un matchMedia
 *   « mouvement autorisé » : passer en mouvement réduit en cours de visite défait
 *   tout (et revenir le rejoue) ; démonter le composant aussi.
 *
 * Pièges connus :
 * - une animation créée après `setup` (watch, clic) échappe au contexte : passer
 *   son créateur par `contextSafe`, ou l'arrêter soi-même dans le nettoyage ;
 * - `gsap.killTweensOf([a, b])` ne tue pas un tween dont les cibles ne sont
 *   qu'une partie de la liste : garder une référence au tween ;
 * - ne jamais animer `x`, `y` ou `rotation` (GSAP) sur un `.step` ou un
 *   `<Asterisk>` : GSAP écrase leur `translate` (survol, appui) ou leur `rotate`
 *   (cliquet). Passer par une propriété CSS qui alimente leur `transform`.
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
        await nextTask();
        if (!scope.value) return;
        const context = motion.gsap.context(() => {
          motion.gsap
            .matchMedia()
            .add('(prefers-reduced-motion: no-preference)', (media) =>
              setup(motion, root, safeIn(media)),
            );
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
