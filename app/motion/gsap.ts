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
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  // Mêmes noms et mêmes courbes qu'en CSS : ease: 'out' = var(--ease-out).
  for (const name of EASES) CustomEase.create(name, bezier(`--ease-${name}`));
  gsap.defaults({ ease: 'out', duration: duration('--dur-state') });
  // La barre d'adresse mobile qui se replie ne doit pas tout recalculer.
  ScrollTrigger.config({ ignoreMobileResize: true });
  return { gsap, ScrollTrigger };
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
