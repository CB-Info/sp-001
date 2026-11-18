import { bezier, duration, EASES } from './tokens';

/**
 * GSAP, chargé à la demande : jamais dans le bundle du premier rendu. Le coeur et
 * ScrollTrigger arrivent quand une première section en a besoin ; SplitText et
 * Flip seulement pour les zones qui les utilisent.
 */
async function loadCore() {
  const [{ gsap }, { ScrollTrigger }, { CustomEase }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/CustomEase'),
  ]);
  const register = () => gsap.registerPlugin(ScrollTrigger, CustomEase);
  if (document.documentElement.dataset.site === 'v2') withoutIdleLoop(register);
  else register();
  // Mêmes noms et mêmes courbes qu'en CSS : ease: 'out' = var(--ease-out).
  for (const name of EASES) CustomEase.create(name, bezier(`--ease-${name}`));
  gsap.defaults({ ease: 'out', duration: duration('--dur-state') });
  // La barre d'adresse mobile qui se replie ne doit pas tout recalculer.
  ScrollTrigger.config({ ignoreMobileResize: true });
  return { gsap, ScrollTrigger };
}

/**
 * V2 : ScrollTrigger sans sa boucle de veille. Tant qu'il est actif, ScrollTrigger
 * entretient une boucle requestAnimationFrame vide (_rafBugFix). Elle contourne
 * des repeints irréguliers de Firefox quand aucune image n'est en file. Page
 * immobile, elle réveille le fil principal 60 fois par seconde, pour rien et aux
 * dépens de la batterie. Ici, tout défilement réveille déjà le ticker de GSAP
 * (scroll.ts), qui garde une image en file tant que la page bouge.
 *
 * La boucle part d'une seule demande d'image, faite pendant l'enregistrement du
 * plugin (ScrollTrigger.enable(), GSAP 3.15). Cette demande est annulée, et la
 * boucle ne démarre jamais. On la reconnaît à son rappel, le seul à appeler
 * requestAnimationFrame par son nom : le ticker de GSAP passe par sa propre
 * référence. Si une autre version de GSAP demande autre chose, rien n'est annulé.
 *
 * L'intercepteur ne vit que le temps de l'enregistrement. Si le ticker se
 * réveillait pendant ce temps, il garderait l'intercepteur comme référence : ce
 * n'est alors qu'un relais transparent, qui ne retient plus rien.
 *
 * La V1 garde la boucle : elle ne doit pas changer.
 */
function withoutIdleLoop(register: () => void) {
  const request = window.requestAnimationFrame;
  const asked: { id: number; callback: FrameRequestCallback }[] = [];
  let listening = true;
  window.requestAnimationFrame = (callback) => {
    const id = request.call(window, callback);
    if (listening) asked.push({ id, callback });
    return id;
  };
  try {
    register();
  } finally {
    listening = false;
    window.requestAnimationFrame = request;
  }
  const loops = asked.filter(({ callback }) => String(callback).includes('requestAnimationFrame('));
  if (loops.length === 1 && loops[0]) cancelAnimationFrame(loops[0].id);
}

let core: ReturnType<typeof loadCore> | undefined;
export const loadGsap = () => (core ??= loadCore());

export type Motion = Awaited<ReturnType<typeof loadCore>>;

let split: Promise<typeof import('gsap/SplitText').SplitText> | undefined;
export async function loadSplitText() {
  const { gsap } = await loadGsap();
  return (split ??= import('gsap/SplitText').then(({ SplitText }) => {
    gsap.registerPlugin(SplitText);
    return SplitText;
  }));
}

let flip: Promise<typeof import('gsap/Flip').Flip> | undefined;
export async function loadFlip() {
  const { gsap } = await loadGsap();
  return (flip ??= import('gsap/Flip').then(({ Flip }) => {
    gsap.registerPlugin(Flip);
    return Flip;
  }));
}
