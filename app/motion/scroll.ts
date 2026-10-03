import type Lenis from 'lenis';
import { FINE_POINTER, motionAllowed, REDUCED_MOTION } from './env';
import type { Motion } from './gsap';

/**
 * Défilement : une seule source de vérité pour toute la page.
 *
 * - Lenis (défilement lissé) seulement sur ordinateur à pointeur fin et hors
 *   mouvement réduit, en direct : passer en mouvement réduit le retire, revenir
 *   le remet. Le tactile, le clavier et la recherche restent natifs.
 * - Un seul rappel par image (gsap.ticker) pilote Lenis, ScrollTrigger, la mesure
 *   et les effets liés à la vitesse (followScroll). Il ne tourne que pendant un
 *   défilement, puis tant qu'un effet n'est pas revenu au repos : page immobile,
 *   le fil principal dort et les animations CSS restent au compositeur.
 * - `scroll.velocity` (px par image, signée) sert au bandeau et aux stries du
 *   hero, avec ou sans Lenis : Lenis fait défiler la fenêtre elle-même. La
 *   position n'est lue qu'aux événements `scroll` : lire scrollY force un calcul
 *   de style et de mise en page, à ne pas payer à chaque image.
 * - Cliquet global des astérisques : `--scroll-step` avance d'un cran tous les
 *   RATCHET_STEP px ; chaque astérisque tourne de 45° par cran (Asterisk.vue).
 * - Les déclencheurs se recalent quand la page change de hauteur (accordéon,
 *   colonnes de l'équipe…) : aucune zone n'a à appeler ScrollTrigger.refresh().
 */
const RATCHET_STEP = 320;
/** Calme exigé avant de recaler les déclencheurs (s) : une seule fois, après l'animation. */
const SETTLE = 0.2;
/**
 * Images immobiles avant de lâcher le ticker. Réveillé par un événement, GSAP fait
 * un premier passage aussitôt, avant que l'événement n'ait produit son effet.
 */
const IDLE_FRAMES = 2;
/** Plus long pas de temps donné à Lenis (ms) : pas de saut au réveil ni après un à-coup. */
const LENIS_MAX_STEP = 1000 / 30;

export const scroll = { velocity: 0, direction: 1 as 1 | -1 };

let lenis: Lenis | undefined;
/** Pause demandée (menu ouvert), mémorisée même avant que Lenis n'existe. */
let paused = false;
/** Cran courant ; 0 est celui du CSS : rien à écrire en haut de page. */
let ratchet = 0;
/** Effets liés à la vitesse : chacun dit s'il lui reste du mouvement à rendre. */
const followers = new Set<() => boolean>();
/** Relance le rappel par image ; sans effet avant startScroll(). */
let wake = () => {};

/**
 * Le cran est posé sur chaque astérisque, pas sur :root : une propriété héritée
 * changée à la racine recalculerait le style de toute la page (≈ 1 100 éléments)
 * à chaque cran. Les astérisques sont tous dans le HTML rendu côté serveur.
 */
function updateRatchet(y: number, asterisks: Iterable<Element>) {
  const step = Math.floor(y / RATCHET_STEP);
  if (step === ratchet) return;
  ratchet = step;
  for (const asterisk of asterisks) {
    (asterisk as SVGElement).style.setProperty('--scroll-step', String(step));
  }
}

export async function startScroll({ gsap, ScrollTrigger }: Motion) {
  if (!motionAllowed()) return;
  const reduce = matchMedia(REDUCED_MOTION);
  const fine = matchMedia(FINE_POINTER);
  const wanted = () => fine.matches && !reduce.matches;
  const asterisks = document.getElementsByClassName('asterisk');
  let LenisClass: typeof Lenis | undefined;
  let position = scrollY;
  let last = position;
  // Lenis a défilé : ScrollTrigger se met à jour dans la même image, jamais en
  // dehors du ticker (stop() et start() émettent aussi un défilement).
  let moved = false;
  let ticking = false;
  let idle = 0;
  // Horloge de Lenis : elle n'avance que lorsqu'il tourne, les veilles n'y comptent pas.
  let clock = 0;

  function tick(_time: number, deltaTime: number) {
    clock += Math.min(deltaTime, LENIS_MAX_STEP);
    lenis?.raf(clock);
    if (moved) {
      moved = false;
      ScrollTrigger.update();
    }
    scroll.velocity = position - last;
    if (scroll.velocity !== 0) {
      scroll.direction = scroll.velocity > 0 ? 1 : -1;
      last = position;
      updateRatchet(position, asterisks);
    }
    let busy = scroll.velocity !== 0 || Boolean(lenis?.isScrolling);
    for (const follower of followers) busy = follower() || busy;
    if (busy) idle = 0;
    // Plus rien ne bouge : le rappel se retire, le ticker de GSAP peut s'endormir.
    if (busy || ++idle < IDLE_FRAMES) return;
    gsap.ticker.remove(tick);
    ticking = false;
  }

  wake = () => {
    if (ticking) return;
    ticking = true;
    idle = 0;
    gsap.ticker.add(tick);
  };

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
    lenis.on('scroll', () => {
      moved = true;
      wake();
    });
    // La molette ne fait rien défiler tant que le ticker dort : elle le réveille.
    lenis.on('virtual-scroll', () => wake());
    if (paused) lenis.stop();
  }

  // Arrivée plus bas dans la page (ancre, rechargement) : les astérisques prennent leur cran.
  updateRatchet(position, asterisks);
  addEventListener(
    'scroll',
    () => {
      position = scrollY;
      wake();
    },
    { passive: true },
  );
  // Un lien d'ancre lance un défilement lissé de Lenis : il lui faut le ticker.
  addEventListener('click', () => wake(), { passive: true, capture: true });

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

/**
 * Effet lié à la vitesse (scroll.velocity) : `follower` est appelé à chaque image
 * pendant un défilement, puis tant qu'il rend `true` (retour au repos en cours).
 * Rend la fonction qui le retire.
 */
export function followScroll(follower: () => boolean): () => void {
  followers.add(follower);
  wake();
  return () => followers.delete(follower);
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
  if (lenis) {
    lenis.scrollTo(target);
    wake();
  } else if (typeof target === 'number') scrollTo({ top: target });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView();
}
