<script setup lang="ts">
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, stagger } from '~/motion/tokens';
import type { HomeContent } from '~/types/content';

/**
 * Bande des trois panneaux de la référence, dans l'ordre de lecture :
 *   1. lien seul (corps vide, comme dans la référence) ;
 *   2. mis en avant (en-tête rouge) : le manifeste en bas à gauche ;
 *   3. la devise en bas à gauche et l'astérisque rouge en bas à droite.
 *
 * Gabarit mesuré @1440 : 58 → 328 → 854 → 1380, soit 1fr 2fr 2fr, 350 px de haut.
 * Entre 40em et 64em : le panneau 1 (en-tête seul) en pleine largeur, puis 2 et 3
 * côte à côte ; l'ordre du DOM reste l'ordre visuel.
 *
 * Entrée (la grille se trace, puis se remplit) : à 85 % de l'écran, le filet du
 * haut de chaque panneau se trace depuis la gauche, pointe rouge tant qu'il file ;
 * puis son titre monte dans la rangée d'en-tête, depuis le filet qui la ferme.
 */
const props = defineProps<{
  panels: HomeContent['footer']['panels'];
  manifesto: string;
  motto: string;
}>();

const FEATURED = 1;
/* Le lien vers le haut de page reçoit une flèche montante. */
const TOP_ANCHOR = '#haut';

const bodies = ['empty', 'manifesto', 'motto'] as const;
const kindOf = (index: number) => bodies[index] ?? 'empty';

const list = useTemplateRef<HTMLElement>('list');

const hooks = (scope: ParentNode, name: string) => [
  ...scope.querySelectorAll<HTMLElement>(`[data-motion="footer-${name}"]`),
];

useMotion(list, ({ gsap, ScrollTrigger }, root) => {
  const trace = duration('--dur-focal');
  const rise = duration('--dur-layout');
  const beat = duration('--dur-feedback');
  const cascade = capped(stagger('--stagger-list'));

  /** Entrée d'un panneau : son filet du haut se trace, puis son titre monte. */
  const entryOf = (panel: HTMLElement) => {
    const [head] = hooks(panel, 'panel-head');
    const [title] = hooks(panel, 'panel-title');
    if (!head || !title) return undefined;
    // Le titre attend sous sa rangée d'en-tête, qui le masque.
    gsap.set(head, { clipPath: 'inset(0px)' });
    return (
      gsap
        .timeline({
          paused: true,
          defaults: { duration: trace },
          onComplete: () => gsap.set(head, { clearProps: 'clipPath' }),
        })
        .fromTo(panel, { '--rule-trace': 0 }, { '--rule-trace': 1, clearProps: '--rule-trace' }, 0)
        // La pointe reste chaude pendant la course et refroidit à l'arrêt.
        .fromTo(
          panel,
          { '--rule-heat': 1 },
          { '--rule-heat': 0, ease: 'in-out', clearProps: '--rule-heat' },
          0,
        )
        // Le titre suit son filet d'un battement.
        .fromTo(
          title,
          { y: () => head.offsetHeight },
          { y: 0, duration: rise, clearProps: 'transform' },
          beat,
        )
    );
  };

  // Un panneau déjà à l'écran quand GSAP arrive (ancre, rechargement) garde son état final.
  const pending = new Map<Element, gsap.core.Timeline>();
  for (const panel of hooks(root, 'panel')) {
    const entry = reached(panel) ? undefined : entryOf(panel);
    if (entry) pending.set(panel, entry);
  }
  if (!pending.size) return undefined;

  /** Une entrée ne se joue qu'une fois, quel que soit son déclencheur. */
  const start = (panel: Element, delay = 0) => {
    pending.get(panel)?.delay(delay).restart(true);
    pending.delete(panel);
  };

  // Les panneaux d'une même rangée arrivent ensemble, en cascade ; empilés, un à un.
  ScrollTrigger.batch([...pending.keys()], {
    ...ENTRY,
    onEnter: (batch) => batch.forEach((panel, index) => start(panel, cascade(index))),
  });

  // Clavier : un en-tête focalisé avant son déclencheur (bas de l'écran) montre aussitôt son titre.
  const reveal = () => [...pending.keys()].forEach((panel) => start(panel));
  root.addEventListener('focusin', reveal, { once: true });
  return () => root.removeEventListener('focusin', reveal);
});
</script>

<template>
  <ul ref="list" role="list" class="footer-panels">
    <FooterPanel
      v-for="(panel, index) in props.panels"
      :key="panel.title"
      :title="panel.title"
      :href="panel.href"
      :featured="index === FEATURED"
      :arrow="panel.href === TOP_ANCHOR ? 'up' : 'right'"
    >
      <template v-if="kindOf(index) === 'manifesto'" #default>
        <p class="footer-panels__manifesto">{{ props.manifesto }}</p>
      </template>
      <template v-else-if="kindOf(index) === 'motto'" #default>
        <p class="footer-panels__motto">{{ props.motto }}</p>
        <Asterisk class="footer-panels__asterisk" size="var(--panel-asterisk)" />
      </template>
    </FooterPanel>
  </ul>
</template>

<style scoped>
.footer-panels {
  --panel-rule: var(--footer-rule, var(--rule));

  display: grid;
  /* Chaque panneau trace son filet du haut et de droite ; la liste ferme le bas et la gauche. */
  border-block-end: 1px solid var(--panel-rule);
  border-inline-start: 1px solid var(--panel-rule);
}

.footer-panels__manifesto {
  /* mesuré : 454 px de texte dans un panneau de 526. */
  max-inline-size: 28.5rem;
  font-size: var(--text-body);
  line-height: 1.5;
  color: var(--ink-secondary);
}

.footer-panels__motto {
  max-inline-size: 8em;
  font-family: var(--font-display);
  font-size: var(--text-body);
  font-weight: 600;
  line-height: 1.15;
  text-transform: uppercase;
  color: var(--ink);
}

/*
 * mesuré : ≈ 100 px dans un panneau de 526 (≈ 19 % de sa largeur). Survol ou focus
 * de l'en-tête : un cran local de 45° de plus que le cliquet du défilement (Asterisk).
 */
.footer-panels__asterisk {
  --accent: var(--red-500);
  --panel-asterisk: clamp(3.5rem, 19cqi, 6.25rem);
  --ratchet: var(--panel-active, 0);

  flex: none;
  /* mesuré : 24 px du bord droit, 25 du bas (le corps en donne 20). */
  margin: 0 var(--space-4) var(--space-4) auto;
}

@media (width >= 40em) {
  .footer-panels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-panels > :first-child {
    grid-column: 1 / -1;
  }
}

@media (width >= 64em) {
  .footer-panels {
    grid-template-columns: 1fr 2fr 2fr;
    grid-auto-rows: 21.875rem;
  }

  .footer-panels > :first-child {
    grid-column: auto;
  }
}
</style>
