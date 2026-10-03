<script setup lang="ts">
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';
import type { HomeContent } from '~/types/content';

/**
 * Section À propos (surface papier) : la promesse, puis ses preuves.
 * En-tête « décalé » : l'eyebrow seule à gauche, la phrase (le H2, à la taille
 * des H3 comme dans la référence) et le bouton noir à droite. Dessous, trois
 * cartes égales : note, ancienneté, photo du coach.
 *
 * Mouvement (docs/analyse/annexes/a6-motion.md §4.2), une seule entrée, tirée de
 * la plaque. Le H2 ne bouge pas.
 * - Les trois cartes se soulèvent de leur socle, en cascade : en montant, chacune
 *   s'ouvre en escalier (la trace de sa vitesse). La photo garde ses encoches ;
 *   les cartes de matière, plates au repos, les referment d'un coup sec à l'arrêt.
 * - « 4,9 » et « 20 » se posent comme un compteur : seule la roue des unités
 *   tourne, et redescend sur la valeur. La note reste entre 4,0 et 4,9 : elle ne
 *   grimpe jamais depuis 0 et ne dépasse jamais l'échelle.
 * - Les avatars des avis se remplissent de gauche à droite.
 * - Le bouton part posé sur sa plaque arrière et se soulève jusqu'à son pas.
 */
defineProps<{ content: HomeContent['about'] }>();

const titleId = 'a-propos-titre';
const section = useTemplateRef<HTMLElement>('section');

/** a6 §3.6 : en se soulevant, l'image se pose dans son cadre (échelle 1,06 → 1). */
const IMAGE_SETTLE = 1.06;
/** Crans parcourus par le rouleau avant de se poser sur la valeur. */
const REEL_TURNS = 6;
/** Volets des avatars : on entre par la gauche, le vecteur de la marque. */
const FACE_HIDDEN = 'inset(0% 100% 0% 0%)';
const FACE_SHOWN = 'inset(0% 0% 0% 0%)';
const FLAT = { '--fx': '0%', '--ft': '0%', '--fb': '0%' };
/** Les deux statistiques à rouleau : « 4,9 » et « 20 ». */
const FIGURES = '[data-motion="about-rating-value"], [data-motion="about-years-value"]';

useMotion(section, ({ gsap, ScrollTrigger }, root) => {
  const focal = duration('--dur-focal');
  const layout = duration('--dur-layout');
  const strike = duration('--dur-strike');
  const settlers: (() => void)[] = [];

  const cta = root.querySelector<HTMLElement>('[data-motion="about-cta"]');
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

  const photo = root.querySelector<HTMLElement>('[data-motion="about-photo"]');
  if (!photo) return undefined;
  // Les encoches de repos de la photo : la trace que montre toute plaque qui se soulève.
  const frame = getComputedStyle(photo);
  const notch = {
    '--fx': frame.getPropertyValue('--fx'),
    '--ft': frame.getPropertyValue('--ft'),
    '--fb': frame.getPropertyValue('--fb'),
  };

  /**
   * Rouleau d'un chiffre : des cases empilées au-dessus de lui, de valeur+n à
   * valeur, qui défilent vers le haut dans la fenêtre du chiffre (masqué le temps
   * du tour). Au repos, le rouleau montre déjà la valeur : rien de faux n'est lu
   * avant l'entrée. Il disparaît à l'arrêt.
   */
  function roll(digit: HTMLElement, turns: number) {
    const value = Number(digit.textContent);
    const reel = document.createElement('span');
    reel.className = 'about-reel';
    for (let step = turns; step >= 0; step -= 1) {
      const cell = document.createElement('span');
      cell.textContent = String((value + step) % 10);
      reel.append(cell);
    }
    digit.append(reel);
    digit.classList.add('has-reel');
    const settle = () => {
      reel.remove();
      digit.classList.remove('has-reel');
    };
    settlers.push(settle);
    // Pas de calque propre (force3D) : la carte qui le porte se repeint déjà à
    // chaque image, le temps que son escalier s'ouvre.
    return gsap.fromTo(
      reel,
      { y: () => reel.offsetHeight - digit.offsetHeight },
      { y: 0, duration: focal, force3D: false, immediateRender: false, onComplete: settle },
    );
  }

  /** Entrée d'une carte, en pause jusqu'à son passage à 85 % de l'écran. */
  function lift(card: HTMLElement) {
    const plate = card.firstElementChild as HTMLElement;
    const timeline = gsap.timeline({ paused: true });

    timeline.from(
      card,
      { x: length('--move-s'), y: length('--move-l'), duration: focal, clearProps: 'transform' },
      0,
    );

    if (plate === photo) {
      // Le survol transitionne aussi les encoches : il attendra la fin de l'entrée.
      gsap.set(plate, { transition: 'none' });
      timeline
        .fromTo(
          plate,
          FLAT,
          { ...notch, duration: layout, clearProps: '--fx,--ft,--fb,transition' },
          0,
        )
        .fromTo(
          plate.querySelector('img'),
          { scale: IMAGE_SETTLE },
          { scale: 1, duration: focal, clearProps: 'transform' },
          0,
        );
      return timeline;
    }

    // Carte de matière : le même découpage que les médias, le temps de l'entrée.
    plate.classList.add('step-frame');
    const flatten = () => plate.classList.remove('step-frame');
    settlers.push(flatten);
    timeline.fromTo(plate, FLAT, { ...notch, duration: layout }, 0).to(
      plate,
      {
        ...FLAT,
        duration: strike,
        ease: 'strike',
        clearProps: '--fx,--ft,--fb',
        onComplete: flatten,
      },
      layout,
    );

    card.querySelectorAll(FIGURES).forEach((figure) => {
      const units = [...figure.querySelectorAll<HTMLElement>('.stat-figure__digit')].at(-1);
      if (units) timeline.add(roll(units, REEL_TURNS), 0);
    });

    const faces = card.querySelectorAll('[data-motion="about-reviewer"] img');
    if (faces.length) {
      timeline.fromTo(
        faces,
        { clipPath: FACE_HIDDEN },
        {
          clipPath: FACE_SHOWN,
          duration: duration('--dur-state'),
          stagger: capped(stagger('--stagger-tight')),
          clearProps: 'clipPath',
        },
        layout + strike,
      );
    }
    return timeline;
  }

  const cards = [...root.querySelectorAll<HTMLElement>('[data-motion="about-card"]')].filter(
    (card) => !reached(card),
  );
  const lifts = new Map<Element, ReturnType<typeof lift>>(cards.map((card) => [card, lift(card)]));
  // Les cartes d'une même rangée entrent ensemble, en cascade ; empilées, chacune à son tour.
  const cascade = capped(stagger('--stagger-list'));
  ScrollTrigger.batch(cards, {
    ...ENTRY,
    onEnter: (batch) =>
      batch.forEach((card, index) => lifts.get(card)?.delay(cascade(index)).restart(true)),
  });

  return () => settlers.forEach((settle) => settle());
});
</script>

<template>
  <section
    id="a-propos"
    ref="section"
    class="about"
    data-surface="paper"
    :aria-labelledby="titleId"
  >
    <RuledGrid variant="strip" fade />

    <div class="about__inner container">
      <div class="about__intro">
        <SectionHeader
          :id="titleId"
          class="about__header"
          :eyebrow="content.eyebrow"
          :title="content.statement"
          size="sub"
          data-motion="about-statement"
        />
        <StepButton
          class="about__cta"
          variant="black"
          :href="content.cta.href"
          data-motion="about-cta"
        >
          {{ content.cta.label }}
        </StepButton>
      </div>

      <ul class="about__cards" role="list">
        <li class="about__card" data-motion="about-card">
          <RatingCard :rating="content.rating" />
        </li>
        <li class="about__card" data-motion="about-card">
          <StatCard :years="content.years" />
        </li>
        <li class="about__card about__card--photo" data-motion="about-card">
          <AboutPhoto :image="content.image" data-motion="about-photo" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding-block-end: var(--section-pad);
}

.about__inner {
  /* Mesuré : capitales de la phrase à 125 px du haut de section, soit 57 px sous le fondu. */
  margin-block-start: clamp(2rem, 1.4196rem + 2.381vw, 3.5625rem);
}

.about__intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Mesuré : 48 px des capitales de la dernière ligne au bouton, soit 40 px de boîte à boîte. */
.about__cta {
  margin-block-start: var(--space-40);
}

/*
 * Mesuré : 80 px du pied du bouton (plaque arrière comprise, c'est sa marge basse)
 * aux cartes.
 */
.about__cards {
  display: grid;
  gap: var(--gap);
  margin-block-start: var(--block-gap);
}

/* Chaque carte remplit sa case : même hauteur sur une rangée. */
.about__card {
  display: grid;
}

@media (width >= 40em) {
  /* Note et ancienneté côte à côte, photo en bandeau 16:9 dessous. */
  .about__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about__card--photo {
    grid-column: 1 / -1;
  }
}

@media (width >= 64em) {
  /*
   * En-tête en grille, partagée par l'eyebrow et le H2 (sous-grille), le bouton
   * sous le H2. De 64 à 80em, trois colonnes à la gouttière des cartes : la phrase
   * démarre pile sur l'axe de la 2e carte (à 50/50, elle ferait 5 lignes ou plus).
   */
  .about__intro {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--gap);
    align-items: start;
  }

  .about__header {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    align-items: start;
  }

  /*
   * L'eyebrow quitte la pile : plus de marge basse, et ses capitales s'alignent
   * sur celles de la 1re ligne du H2 (capitale à 0,175 em du haut de ligne en
   * Tektur à 1,05 d'interligne, à 0,177 em en Plex Mono à 1).
   */
  .about__header :deep(.section-header__eyebrow) {
    margin-block: calc(var(--text-subheading) * 0.175 - var(--text-label) * 0.177) 0;
  }

  /* Le H2 démarre sur l'axe de la 2e carte. */
  .about__header :deep(.section-header__row) {
    grid-column: 2 / -1;
  }

  .about__cta {
    grid-column: 2 / -1;
    justify-self: start;
  }

  .about__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .about__card--photo {
    grid-column: auto;
  }
}

/* Mesuré @1440 : deux colonnes égales séparées de 60, la phrase démarre à x 750. */
@media (width >= 80em) {
  .about__intro {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--space-60);
  }
}

/*
 * Entrée du bouton, pilotée par GSAP : --sink vaut 1 quand la plaque avant est
 * posée sur sa plaque arrière, 0 au repos. La plaque arrière compense : elle ne
 * bouge pas. Sans --sink (repos, mouvement réduit), ces déclarations sont
 * invalides et transform reste à none.
 */
.about__cta {
  transform: translate(calc(var(--sx) * var(--sink)), calc(var(--st) * var(--sink)));
}

.about__cta::before {
  transform: translate(calc(var(--sx) * var(--sink) * -1), calc(var(--st) * var(--sink) * -1));
}

/*
 * Compteur à rouleaux (créé par le script, le temps de l'entrée) : le chiffre
 * devient la fenêtre, masqué, et son rouleau défile dedans. Fenêtre élargie de
 * 0,1 em pour ne rogner aucun glyphe ; cases de 0,82 em (l'interligne du chiffre)
 * au pas de 1 em, si bien qu'aucune case voisine n'entre dans la fenêtre au repos.
 */
.about :deep(.has-reel) {
  position: relative;
  visibility: hidden;
  clip-path: inset(-0.1em 0);
}

.about :deep(.about-reel) {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  display: grid;
  row-gap: 0.18em;
  visibility: visible;
}
</style>
