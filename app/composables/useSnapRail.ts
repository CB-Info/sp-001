import type { Ref } from 'vue';

interface SnapRailOptions {
  /** Nombre de diapositives. */
  count: number;
  /** Diapositive active au montage. */
  initial: number;
  /** Sélecteur des diapositives à l'intérieur du rail (ordre du DOM). */
  slideSelector: string;
}

type Timer = ReturnType<typeof setTimeout> | undefined;

/**
 * Rail horizontal à aimantation native (`scroll-snap`) : suit la diapositive
 * active d'après la position de défilement et sait s'y rendre.
 *
 * - La position d'arrêt de chaque diapositive est calculée comme le fait le
 *   navigateur, à partir de `scroll-snap-align`, `scroll-margin` et
 *   `scroll-padding` lus dans le CSS : la même fonction sert à aller vers une
 *   diapositive et à trouver la plus proche. Le CSS reste la seule source de la
 *   géométrie (centre ou début, fente comprise).
 * - Pendant un défilement programmé, l'index reste verrouillé sur la cible : les
 *   diapositives traversées ne s'activent pas au passage.
 * - Pendant un redimensionnement, l'index est tenu et le rail recalé dessus : les
 *   positions d'arrêt bougent, la carte active ne doit pas changer pour autant.
 * - Navigation en boucle : après la dernière, on revient à la première.
 */
export function useSnapRail(scroller: Readonly<Ref<HTMLElement | null>>, options: SnapRailOptions) {
  const { count, initial, slideSelector } = options;
  const active = ref(initial);

  /** Cible d'un défilement programmé en cours. */
  let target: number | null = null;
  /** Index tenu pendant un redimensionnement. */
  let held: number | null = null;
  let frame = 0;
  let releaseTimer: Timer;
  let holdTimer: Timer;
  let resizeObserver: ResizeObserver | undefined;

  const wrap = (index: number) => ((index % count) + count) % count;
  const px = (value: string) => Number.parseFloat(value) || 0;
  const slidesOf = (el: HTMLElement) => [...el.querySelectorAll<HTMLElement>(slideSelector)];

  /** Position d'arrêt : zone d'aimantation (boîte + scroll-margin) alignée dans le snapport. */
  function snapPosition(el: HTMLElement, slide: HTMLElement): number {
    const port = getComputedStyle(el);
    const area = getComputedStyle(slide);
    const portStart = px(port.scrollPaddingInlineStart);
    const portEnd = el.clientWidth - px(port.scrollPaddingInlineEnd);
    const areaStart = slide.offsetLeft - px(area.scrollMarginInlineStart);
    const areaEnd = slide.offsetLeft + slide.offsetWidth + px(area.scrollMarginInlineEnd);
    // `scroll-snap-align` vaut « bloc ligne » ou une seule valeur pour les deux axes.
    const align = area.scrollSnapAlign.split(' ').at(-1);
    let position = areaStart - portStart;
    if (align === 'center') position = (areaStart + areaEnd - portStart - portEnd) / 2;
    else if (align === 'end') position = areaEnd - portEnd;
    return Math.min(Math.max(position, 0), el.scrollWidth - el.clientWidth);
  }

  function positionOf(index: number): number | undefined {
    const el = scroller.value;
    const slide = el && slidesOf(el)[index];
    return el && slide ? snapPosition(el, slide) : undefined;
  }

  function nearest(): number {
    const el = scroller.value;
    if (!el) return active.value;
    let best = active.value;
    let bestDistance = Number.POSITIVE_INFINITY;
    slidesOf(el).forEach((slide, index) => {
      const distance = Math.abs(snapPosition(el, slide) - el.scrollLeft);
      if (distance < bestDistance) {
        best = index;
        bestDistance = distance;
      }
    });
    return best;
  }

  /**
   * Écart, en px, entre le défilement courant et la position d'arrêt de la
   * diapositive active : positif tant qu'elle est encore à droite de sa place.
   */
  function drift(): number {
    const el = scroller.value;
    const position = positionOf(active.value);
    return el && position !== undefined ? position - el.scrollLeft : 0;
  }

  /** Recale le rail sur une diapositive, sans animation, s'il s'en est écarté. */
  function align(index: number) {
    const el = scroller.value;
    const position = positionOf(index);
    if (el && position !== undefined && Math.abs(el.scrollLeft - position) > 1) {
      el.scrollTo({ left: position, behavior: 'instant' });
    }
  }

  function release() {
    clearTimeout(releaseTimer);
    if (held !== null) return;
    target = null;
    // Si l'utilisateur a repris la main pendant le défilement, on suit sa position.
    active.value = nearest();
  }

  /** Libère le verrou quand le défilement s'arrête (repli si `scrollend` manque). */
  function armRelease(delay: number) {
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(release, delay);
  }

  function hold() {
    held ??= target ?? active.value;
    target = null;
    align(held);
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => (held = null), 300);
  }

  function onScroll() {
    if (held !== null) {
      align(held);
      return;
    }
    if (target !== null) {
      armRelease(160);
      return;
    }
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      active.value = nearest();
    });
  }

  function goTo(index: number, { instant = false } = {}) {
    const next = wrap(index);
    active.value = next;
    const position = positionOf(next);
    if (position === undefined) return;
    held = null;
    clearTimeout(holdTimer);
    target = next;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.value?.scrollTo({
      left: position,
      behavior: instant || reduced ? 'instant' : 'smooth',
    });
    armRelease(instant ? 60 : 400);
  }

  onMounted(() => {
    const el = scroller.value;
    if (!el) return;
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('scrollend', release);
    window.addEventListener('resize', hold);
    goTo(active.value, { instant: true });
    // La largeur du rail change aussi sans redimensionner la fenêtre (barre de défilement).
    resizeObserver = new ResizeObserver(hold);
    resizeObserver.observe(el);
  });

  onBeforeUnmount(() => {
    scroller.value?.removeEventListener('scroll', onScroll);
    scroller.value?.removeEventListener('scrollend', release);
    window.removeEventListener('resize', hold);
    resizeObserver?.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(releaseTimer);
    clearTimeout(holdTimer);
  });

  return {
    active: readonly(active),
    drift,
    goTo,
    next: () => goTo(active.value + 1),
    previous: () => goTo(active.value - 1),
  };
}
