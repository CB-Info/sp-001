<script setup lang="ts">
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';
import type { HomeContent } from '~/types/content';

/**
 * Section « Pourquoi CLUSEM » sur la surface nuit : en-tête, tableau des piliers,
 * puis l'équipe et son bouton. C'est la section la plus dense de la page et le seul
 * sombre du milieu de parcours (synthèse §2).
 *
 * Mouvement (docs/analyse/annexes/a6-motion.md §4.5), une seule entrée, tirée de la
 * fiche technique. Le H2 ne bouge pas.
 * - Le tableau se dessine : chaque filet se trace depuis son origine (horizontaux
 *   depuis la gauche, bords des cellules depuis le haut), pointe rouge tant qu'il
 *   file, gris à l'arrêt. Puis les cellules se remplissent, colonne après colonne :
 *   libellés et textes montent d'un pas depuis le bas de leur boîte, qui leur sert
 *   de sol ; l'accroche rouge arrive par la gauche, le vecteur de la marque.
 * - L'équipe : chaque portrait monte de son socle en se découvrant depuis sa base,
 *   l'image se pose dans son cadre ; le bouton se soulève de sa plaque arrière.
 * Chaque élément entre en passant à 85 % de l'écran : les grandes cellules ne
 * jouent pas hors champ. Ceux qui arrivent ensemble entrent en cascade.
 * La vedette qui suit le survol reste en CSS (TeamGrid).
 */
defineProps<{ content: HomeContent['why'] }>();

const titleId = 'pourquoi-titre';
const section = useTemplateRef<HTMLElement>('section');

/** a6 §3.6 : en se soulevant, l'image se pose dans son cadre (échelle 1,06 → 1). */
const IMAGE_SETTLE = 1.06;

const hooks = (scope: ParentNode, name: string) => [
  ...scope.querySelectorAll<HTMLElement>(`[data-motion="why-${name}"]`),
];

const inDocumentOrder = (a: Element, b: Element) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/** Ordre de lecture à l'écran : sur mobile, la vedette (order: -1) passe en tête. */
function inReadingOrder(a: Element, b: Element) {
  const first = a.getBoundingClientRect();
  const second = b.getBoundingClientRect();
  return first.top - second.top || first.left - second.left;
}

/**
 * Sens du tracé d'un filet, lu sur ce qui est dessiné à ce palier : un bord de
 * cellule vertical se trace depuis le haut, tout trait horizontal depuis la
 * gauche ; une cellule sans bord (la première, sur mobile) n'a rien à tracer.
 */
function traceAxis(line: HTMLElement): 'x' | 'y' | undefined {
  const style = getComputedStyle(line);
  const border = (side: string) =>
    Number.parseFloat(style.getPropertyValue(`border-${side}-width`));
  if (border('left') || border('right')) return 'y';
  if (border('top') || line.offsetHeight <= 1) return 'x';
  return undefined;
}

useMotion(section, ({ gsap, ScrollTrigger }, root) => {
  const focal = duration('--dur-focal');
  const layout = duration('--dur-layout');
  const state = duration('--dur-state');
  // Les pas mesurés de l'escalier : 12 px pour un texte, 27 px pour une plaque.
  const shortStep = length('--move-s');
  const longStep = length('--move-l');
  const cascade = capped(stagger('--stagger-list'));
  /*
   * Pas de calque propre (force3D) pour ce qui se repeint de toute façon à chaque
   * image (découpe, dégradé) : seules les images des portraits, mises à l'échelle,
   * en ont un. Au plus 5 calques à la fois dans la section.
   */
  const painted = { paused: true, force3D: false };

  /** Filet : il se trace depuis son origine ; sa pointe, rouge en course, refroidit à l'arrêt. */
  function trace(line: HTMLElement, axis: 'x' | 'y') {
    const scale = axis === 'x' ? 'scaleX' : 'scaleY';
    gsap.set(line, { '--rule-tip': axis === 'x' ? 'to right' : 'to bottom' });
    return gsap
      .timeline({ paused: true, defaults: { duration: layout } })
      .fromTo(line, { [scale]: 0 }, { [scale]: 1, force3D: false, clearProps: 'transform' }, 0)
      .fromTo(
        line,
        { '--rule-heat': 1 },
        { '--rule-heat': 0, ease: 'in-out', clearProps: '--rule-heat,--rule-tip' },
        0,
      );
  }

  /** Texte de cellule : il monte d'un pas, découvert depuis le bas de sa boîte, son sol fixe. */
  function rise(text: HTMLElement) {
    return gsap.fromTo(
      text,
      { y: shortStep, clipPath: `inset(100% 0% ${shortStep}px 0%)` },
      {
        y: 0,
        clipPath: 'inset(0% 0% 0px 0%)',
        duration: layout,
        ...painted,
        clearProps: 'transform,clipPath',
      },
    );
  }

  /** L'accroche arrive par la gauche, découverte au même pas qu'elle avance. */
  function arrive(statement: HTMLElement) {
    return gsap.fromTo(
      statement,
      { x: -longStep, clipPath: 'inset(0% 100% 0% 0%)' },
      {
        x: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: focal,
        ...painted,
        clearProps: 'transform,clipPath',
      },
    );
  }

  // ── Tableau : les filets, puis les cellules ────────────────────────────────
  const table = new Map<Element, gsap.core.Animation>();
  for (const line of hooks(root, 'rule')) {
    const axis = traceAxis(line);
    if (axis && !reached(line)) table.set(line, trace(line, axis));
  }
  for (const statement of hooks(root, 'statement')) {
    if (!reached(statement)) table.set(statement, arrive(statement));
  }
  for (const text of hooks(root, 'text')) {
    if (!reached(text)) table.set(text, rise(text));
  }

  const isLine = (element: Element) => element.matches('[data-motion="why-rule"]');
  const cellOf = (element: Element) => element.closest('[data-motion="why-cell"]');

  ScrollTrigger.batch([...table.keys()], {
    ...ENTRY,
    onEnter: (batch) => {
      const lines = batch.filter(isLine).sort(inDocumentOrder);
      const texts = batch.filter((element) => !isLine(element)).sort(inDocumentOrder);
      lines.forEach((line, index) => table.get(line)?.delay(cascade(index)).restart(true));
      // Puis les cellules, colonne après colonne au même pas, leurs filets presque tracés.
      const after = lines.length ? state : 0;
      const cells = [...new Set(texts.map(cellOf))];
      for (const text of texts) {
        const column = cells.indexOf(cellOf(text));
        table
          .get(text)
          ?.delay(after + cascade(column))
          .restart(true);
      }
    },
  });

  // ── Équipe : les portraits montent de leur socle, le bouton se soulève ─────
  /** Portrait : il monte d'un grand pas, découvert depuis sa base ; l'image se pose dans le cadre. */
  function lift(portrait: HTMLElement) {
    const timeline = gsap
      .timeline({ paused: true, defaults: { duration: focal } })
      .fromTo(
        portrait,
        { y: longStep, clipPath: `inset(100% 0% ${longStep}px 0%)` },
        { y: 0, clipPath: 'inset(0% 0% 0px 0%)', force3D: false, clearProps: 'transform,clipPath' },
        0,
      );
    const image = portrait.querySelector('img');
    if (image) {
      timeline.fromTo(image, { scale: IMAGE_SETTLE }, { scale: 1, clearProps: 'transform' }, 0);
    }
    return timeline;
  }

  const portraits = hooks(root, 'portrait').filter((portrait) => !reached(portrait));
  const lifts = new Map<Element, ReturnType<typeof lift>>(
    portraits.map((portrait) => [portrait, lift(portrait)]),
  );
  ScrollTrigger.batch(portraits, {
    ...ENTRY,
    onEnter: (batch) =>
      batch
        .sort(inReadingOrder)
        .forEach((portrait, index) => lifts.get(portrait)?.delay(cascade(index)).restart(true)),
  });

  const [cta] = hooks(root, 'cta');
  if (cta && !reached(cta)) {
    gsap.fromTo(
      cta,
      { '--sink': 1 },
      {
        '--sink': 0,
        duration: layout,
        clearProps: '--sink',
        scrollTrigger: { trigger: cta, ...ENTRY },
      },
    );
  }

  return undefined;
});
</script>

<template>
  <section
    id="pourquoi"
    ref="section"
    class="why section"
    data-surface="night"
    :aria-labelledby="titleId"
  >
    <div class="container">
      <SectionHeader
        :id="titleId"
        :eyebrow="content.eyebrow"
        :title="content.title"
        :note="content.note"
      />
      <FeatureTable
        class="why__table"
        :statement="content.statement"
        :text="content.text"
        :pillars="content.pillars"
      />
      <TeamGrid
        class="why__team"
        :coaches="content.coaches"
        :featured-id="content.featuredCoachId"
        :cta="content.cta"
      />
    </div>
  </section>
</template>

<style scoped>
/* Corps clair sur fond sombre : un peu plus d'interligne (synthèse §4.3). */
.why {
  line-height: 1.5;
}

/* Mesuré : 48 px entre le titre et le tableau, 41 px entre le tableau et l'équipe. */
.why__table {
  margin-block-start: var(--header-gap);
}

.why__team {
  margin-block-start: var(--space-40);
}
</style>
