<script setup lang="ts">
import { duration } from '~/motion/tokens';
import type { HomeContent } from '~/types/content';

/**
 * Section Services : le mot géant « SERVICES. » ajusté à la largeur du contenu,
 * l'en-tête entre deux filets, la trame qui « mesure », puis le rail de cartes
 * en pleine largeur.
 *
 * Mouvement (docs/analyse/annexes/a6-motion.md §4.3) : la section se mesure. Le H2
 * ne bouge pas.
 * - « SERVICES. » reste lisible en contour rouge ; l'encre le remplit de gauche à
 *   droite au rythme du défilement, pendant que le filet du dessous se trace avec
 *   elle. Quand l'encre arrive au bout, le point frappe, d'un coup sec.
 * - À l'entrée de la trame, le second filet se trace à vitesse constante et chaque
 *   trait vertical tombe quand il passe : la règle gradue la largeur.
 */
defineProps<{ content: HomeContent['services'] }>();

const titleId = 'services-titre';
const section = useTemplateRef<HTMLElement>('section');

/** a6 §4.3 : le point arrive plus gros et se pose (échelle 1,35 → 1). */
const STRIKE_SCALE = 1.35;

function span(className: string, text = '') {
  const node = document.createElement('span');
  node.className = className;
  node.textContent = text;
  return node;
}

useMotion(section, ({ gsap }, root) => {
  const display = root.querySelector<HTMLElement>('[data-motion="services-display"]');
  const grid = root.querySelector<HTMLElement>('[data-motion="services-panel"]');
  const panel = grid?.parentElement;
  // Le filet sous le mot, puis celui qui surmonte la trame.
  const [wordRule, gridRule] = root.querySelectorAll<HTMLElement>('[data-motion="services-rule"]');
  if (!display || !grid || !panel || !wordRule || !gridRule) return undefined;

  /*
   * Encre : une copie décorative du mot posée sur l'original. Sa fenêtre entre par
   * la gauche pendant que le mot glisse en sens inverse : double translation,
   * composée sur le GPU (pas de découpe repeinte sur 1 300 px). Le point est à part.
   */
  const [, word = '', stop = ''] = /^(.*?)(\.?)$/.exec(display.textContent?.trim() ?? '') ?? [];
  const ink = span('services__ink');
  const sweep = span('services__ink-window');
  const letters = span('services__ink-word', word);
  const dot = span('services__ink-dot', stop);
  ink.setAttribute('aria-hidden', 'true');
  sweep.append(letters);
  ink.append(sweep, dot);
  display.append(ink);

  // Le point frappe en temps réel, pas au défilement : un coup sec, toujours le même.
  const strike = gsap.fromTo(
    dot,
    { scale: STRIKE_SCALE, autoAlpha: 0 },
    {
      scale: 1,
      autoAlpha: 1,
      duration: duration('--dur-strike'),
      ease: 'strike',
      paused: true,
      // Mot plein : l'original reprend la main, la copie s'efface (état final exact).
      onComplete: () => display.removeAttribute('data-filling'),
    },
  );
  const filling = () => {
    display.setAttribute('data-filling', '');
    strike.reverse();
  };
  const filled = () => {
    display.setAttribute('data-filling', '');
    strike.play();
  };

  // Unité de la timeline : toute la course du remplissage (le défilement en décide).
  const fill = gsap
    .timeline({
      defaults: { duration: 1, ease: 'none' },
      scrollTrigger: {
        trigger: display,
        start: 'top 90%',
        end: 'top 40%',
        scrub: true,
        onLeave: filled,
        onEnterBack: filling,
      },
    })
    .fromTo(sweep, { xPercent: -100 }, { xPercent: 0 }, 0)
    .fromTo(letters, { xPercent: 100 }, { xPercent: 0 }, 0)
    .fromTo(wordRule, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', force3D: false }, 0);

  // Déjà dépassé (ancre, rechargement plus bas) : le mot est plein, sans frappe.
  if (fill.scrollTrigger?.progress === 1) strike.progress(1);
  else display.setAttribute('data-filling', '');

  /*
   * Trame, mesurée en temps réel à l'entrée : le filet se trace à vitesse constante,
   * comme un traceur, et le trait n tombe quand il atteint sa colonne. Ses traits
   * verticaux deviennent des éléments à part le temps de tomber ; la trame d'origine
   * ne garde que ses filets horizontaux (l'appui). Déjà à l'écran quand GSAP arrive
   * (ancre, rechargement) : la trame reste entière.
   */
  const ticks = span('services__ticks');
  // Mesure finie : la trame d'origine reprend ses verticales (état final exact).
  const measured = () => {
    panel.removeAttribute('data-measuring');
    ticks.remove();
  };
  if (panel.getBoundingClientRect().top > innerHeight) {
    const style = getComputedStyle(grid);
    const columns = Number.parseInt(style.getPropertyValue('--columns'), 10);
    const trace = duration('--dur-focal');
    ticks.setAttribute('aria-hidden', 'true');
    ticks.style.setProperty('--columns', String(columns));
    ticks.style.setProperty('--line', style.getPropertyValue('--line'));
    for (let index = 0; index <= columns; index += 1) {
      const tick = span('services__tick');
      tick.style.setProperty('--i', String(index));
      ticks.append(tick);
    }
    panel.append(ticks);
    panel.setAttribute('data-measuring', '');

    gsap
      .timeline({
        defaults: { force3D: false },
        scrollTrigger: { trigger: panel, start: 'top 85%', once: true },
        onComplete: measured,
      })
      .fromTo(
        gridRule,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left',
          duration: trace,
          ease: 'none',
          clearProps: 'transform,transformOrigin',
        },
        0,
      )
      .fromTo(
        ticks.children,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          duration: duration('--dur-state'),
          stagger: trace / columns,
        },
        0,
      );
  }

  return () => {
    ink.remove();
    display.removeAttribute('data-filling');
    measured();
  };
});
</script>

<template>
  <section
    id="services"
    ref="section"
    class="services"
    data-surface="paper-alt"
    :aria-labelledby="titleId"
  >
    <RuledGrid variant="strip" />

    <div class="services__inner container">
      <p class="services__display" data-motion="services-display">{{ content.display }}</p>
      <div class="services__rule" aria-hidden="true" data-motion="services-rule" />
      <SectionHeader
        :id="titleId"
        class="services__header"
        :title="content.title"
        :note="content.note"
        note-mono
      />
      <div class="services__rule" aria-hidden="true" data-motion="services-rule" />
      <div class="services__panel">
        <RuledGrid variant="panel" data-motion="services-panel" />
      </div>
    </div>

    <!-- Brief : la carte 02 est active et centrée au chargement. -->
    <ServiceCarousel class="services__rail" :items="content.items" :initial="1" />
  </section>
</template>

<style scoped>
.services {
  padding-block-end: var(--section-pad);
}

/* Conteneur de requête : le mot géant se dimensionne en `cqi` sur la largeur du contenu. */
.services__inner {
  container-type: inline-size;
}

.services__display {
  /* Mesuré : capitales à 118 px du haut de section, sous une bande de 51 px. */
  --display-offset: calc(var(--block-gap) * 0.84);

  /*
   * Interligne 0,8 : le haut des capitales tombe 0,05 em sous la boîte et la ligne
   * de base 0,05 em au-dessus (Tektur : ascendante 1, descendante 0,3, capitales 0,7).
   * Les marges compensent pour poser les capitales au pixel près.
   */
  margin-block: calc(var(--display-offset) - 0.05em) calc(var(--block-gap) - 0.05em);
  /* Approche gauche des fûts droits de Tektur : la lettre s'aligne sur le filet. */
  margin-inline-start: -0.056em;
  font-family: var(--font-display);
  font-weight: 500;
  /* Mesuré : 1 278 px d'encre sur 1 320, soit 97 % du contenu. */
  font-size: 20.6cqi;
  line-height: 0.8;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--accent);
}

.services__rule {
  block-size: 1px;
  background-color: var(--rule);
}

/*
 * Mouvement (posé par le script, jamais sans lui) : pendant le remplissage, le mot
 * n'est plus qu'un contour ; sa copie encrée (décorative) le recouvre peu à peu.
 */
.services__display {
  position: relative;
}

.services__display[data-filling] {
  color: transparent;
  -webkit-text-stroke: 1px var(--accent);
}

.services__display :deep(.services__ink) {
  position: absolute;
  inset: 0;
  color: var(--accent);
  -webkit-text-stroke: 0;
  pointer-events: none;
  user-select: none;
}

.services__display:not([data-filling]) :deep(.services__ink) {
  visibility: hidden;
}

/* Trois boîtes sur la ligne du mot, calées en haut : le texte tombe au pixel près sur l'original. */
.services__display :deep(:is(.services__ink-window, .services__ink-word, .services__ink-dot)) {
  display: inline-block;
  vertical-align: top;
}

.services__display :deep(.services__ink-window) {
  overflow: hidden;
}

/* Le point se pose sur la ligne de base. */
.services__display :deep(.services__ink-dot) {
  transform-origin: 50% 100%;
}

/* Mesuré : 28 px du filet au haut des capitales du titre, 30 px de sa ligne de base au filet. */
.services__header {
  padding-block: var(--gap);
}

.services__panel {
  position: relative;
  margin-block-start: var(--gap);
}

/* Pendant la mesure, la trame d'origine ne garde que ses filets horizontaux (premier fond masqué). */
.services__panel[data-measuring] > [data-motion='services-panel'] {
  background-size:
    0 0,
    auto;
  border-inline-end-color: transparent;
}

.services__panel :deep(.services__ticks) {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Mêmes abscisses que les verticales de la trame (la dernière est sa bordure droite). */
.services__panel :deep(.services__tick) {
  position: absolute;
  inset-block: 0;
  inset-inline-start: calc(var(--i) * (100% - 1px) / var(--columns));
  inline-size: 1px;
  background-color: var(--line);
}

.services__rail {
  margin-block-start: var(--block-gap);
}

/* Mobile : la trame garde ses 11 colonnes mais seulement 8 rangées (moitié du panneau). */
@media (width < 48em) {
  .services__panel {
    block-size: calc(6.7rem / 2 + 1px);
    overflow: hidden;
  }
}
</style>
