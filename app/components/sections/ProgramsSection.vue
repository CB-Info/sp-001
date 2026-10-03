<script setup lang="ts">
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';
import type { Coach, HomeContent } from '~/types/content';

/**
 * Section Programmes : en-tête empilé, bouton et photo à encoche à gauche,
 * accordéon exclusif à droite (pistes dans le rapport √2 : 519 / 727 @1440).
 *
 * Correctif de la référence : son alignement « bas de photo = bas de l'accordéon »
 * casse dès qu'un autre élément s'ouvre. Ici la photo est collante dans sa colonne :
 * elle accompagne la lecture de l'accordéon et rejoint son bas en fin de course.
 *
 * Mouvement (docs/analyse/annexes/a6-motion.md §4.4). Le H2 ne bouge pas.
 * - Entrée, tirée des filets : chacun se trace depuis la gauche quand il arrive à
 *   85 % de l'écran (ceux qui arrivent ensemble, en cascade), pointe rouge tant
 *   qu'il file, gris une fois arrêté ; la photo se soulève de son socle, ses
 *   encoches s'ouvrent et l'image se pose dans le cadre.
 * - Changement de programme (la hauteur reste la grille 0fr → 1fr de l'accordéon) :
 *   les détails du panneau qui se ferme s'effacent ; ceux du panneau ouvert montent
 *   d'un pas, un à un. La photo se ré-encoche au même rythme : elle s'enfonce le
 *   temps du clic, s'arrête net, puis se relève avec les détails.
 */
const props = defineProps<{ content: HomeContent['programs']; coaches: Coach[] }>();

const titleId = 'programmes-titre';
/** Programme ouvert ; le 01 par défaut (état figé de la référence). */
const openId = ref<string | null>(props.content.items[0]?.id ?? null);

/*
 * Bandeau pleine largeur sous 64em, puis colonne gauche (≈ 36 % de la fenêtre,
 * 519 px au plus). Clés = largeur minimale de fenêtre (@nuxt/image).
 */
const photoSizes = { 390: '100vw', sm: '100vw', md: '100vw', lg: '36vw', '2xl': '520px' };

const section = useTemplateRef<HTMLElement>('section');

/** Accompagne le changement de programme ouvert ; branché seulement quand le mouvement tourne. */
let onSwitch: (() => void) | undefined;
// Après le rendu : les en-têtes portent déjà le nouvel état (aria-expanded).
watch(openId, () => onSwitch?.(), { flush: 'post' });

/** a6 §3.2 : une sortie va plus vite que l'entrée qu'elle défait. */
const EXIT = 0.65;
/** a6 §3.6 : en se soulevant, l'image se pose dans son cadre (échelle 1,06 → 1). */
const IMAGE_SETTLE = 1.06;
/** Cadre à plat : les deux plaques confondues, sans encoche. */
const FLAT = { '--fx': '0%', '--ft': '0%', '--fb': '0%' };
const NOTCH = '--fx,--ft,--fb';

const hooks = (scope: ParentNode, name: string) => [
  ...scope.querySelectorAll<HTMLElement>(`[data-motion="programs-${name}"]`),
];

useMotion(section, ({ gsap, ScrollTrigger }, root) => {
  const [photo] = hooks(root, 'photo');
  const [accordion] = hooks(root, 'accordion');
  if (!photo || !accordion) return undefined;
  const items = hooks(root, 'item');
  const details = (item: HTMLElement) => hooks(item, 'detail');
  const isOpen = (item: HTMLElement) => item.querySelector('[aria-expanded="true"]') !== null;

  const focal = duration('--dur-focal');
  const layout = duration('--dur-layout');
  const state = duration('--dur-state');
  const beat = duration('--dur-feedback');
  const rise = length('--move-s');
  const cascade = capped(stagger('--stagger-tight'));
  const rulesCascade = capped(stagger('--stagger-list'));

  /*
   * Filets : celui du haut est le bord haut de l'accordéon, celui de chaque élément
   * son bord bas. Un filet déjà à l'écran (ancre, rechargement) reste entier.
   */
  const edge = (owner: Element) => (owner === accordion ? 'top' : 'bottom');
  const rules = [accordion, ...items].filter((owner) => !reached(owner, edge(owner)));
  const traces = new Map<Element, gsap.core.Timeline>(
    rules.map((owner) => [
      owner,
      gsap
        .timeline({ paused: true, defaults: { duration: focal } })
        .fromTo(owner, { '--rule-trace': 0 }, { '--rule-trace': 1, clearProps: '--rule-trace' }, 0)
        // La pointe reste chaude pendant la course et refroidit à l'arrêt.
        .fromTo(
          owner,
          { '--rule-heat': 1 },
          { '--rule-heat': 0, ease: 'in-out', clearProps: '--rule-heat' },
          0,
        ),
    ]),
  );
  ScrollTrigger.batch(rules, {
    start: (self) => `${edge(self.trigger ?? accordion)} 85%`,
    once: true,
    onEnter: (batch) =>
      batch.forEach((owner, index) => traces.get(owner)?.delay(rulesCascade(index)).restart(true)),
  });

  // Les encoches de repos, lues sur le cadre : le mouvement y revient toujours.
  const frame = getComputedStyle(photo);
  const notch = {
    '--fx': frame.getPropertyValue('--fx'),
    '--ft': frame.getPropertyValue('--ft'),
    '--fb': frame.getPropertyValue('--fb'),
  };
  /** Mouvement en cours du cadre (entrée, puis ré-encoches) : une commande remplace la précédente. */
  let notching: gsap.core.Animation | undefined;
  if (!reached(photo)) {
    notching = gsap.fromTo(photo, FLAT, { ...notch, duration: focal, clearProps: NOTCH });
    gsap
      .timeline({ scrollTrigger: { trigger: photo, ...ENTRY } })
      .add(notching, 0)
      .fromTo(
        photo.querySelector('img'),
        { scale: IMAGE_SETTLE },
        { scale: 1, duration: focal, clearProps: 'transform' },
        0,
      );
  }

  // Panneaux fermés : leurs détails attendent un pas plus bas, invisibles.
  gsap.set(items.filter((item) => !isOpen(item)).flatMap(details), { opacity: 0, y: rise });

  /** Mouvement en cours des détails de chaque élément. */
  const settling = new Map<HTMLElement, gsap.core.Tween>();

  /*
   * Chaque commande repart de l'état courant et remplace la précédente (jamais de
   * file d'attente) : après une rafale de clics, seul l'état demandé en dernier compte,
   * et le panneau ouvert finit toujours entièrement visible.
   */
  onSwitch = () => {
    for (const item of items) {
      const targets = details(item);
      settling.get(item)?.kill();
      settling.delete(item);
      if (isOpen(item)) {
        // Le contenu attend que la hauteur ait pris son élan (a6 : ≈ 120 ms).
        settling.set(
          item,
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: state,
            delay: beat,
            stagger: cascade,
            clearProps: 'opacity,transform',
          }),
        );
        continue;
      }
      const visible = targets.filter((detail) => Number(gsap.getProperty(detail, 'opacity')) > 0);
      if (visible.length) {
        settling.set(
          item,
          gsap.to(visible, { opacity: 0, y: rise, duration: state * EXIT, ease: 'in' }),
        );
      }
    }

    /*
     * La plaque s'enfonce d'un coup, le temps du clic, et s'arrête net ; elle se
     * relève ensuite posément, au pas de l'accordéon, pendant que les détails montent.
     */
    notching?.kill();
    notching = gsap
      .timeline()
      .to(photo, { ...FLAT, duration: beat, ease: 'in' })
      .to(photo, { ...notch, duration: layout, ease: 'in-out', clearProps: NOTCH });
  };

  return () => {
    onSwitch = undefined;
    notching?.kill();
    settling.forEach((tween) => tween.kill());
    gsap.set([photo, ...items.flatMap(details)], { clearProps: `opacity,transform,${NOTCH}` });
  };
});
</script>

<template>
  <section
    id="programmes"
    ref="section"
    class="programs"
    data-surface="paper"
    :aria-labelledby="titleId"
  >
    <RuledGrid variant="strip" fade />

    <div class="programs__inner container">
      <div class="programs__aside">
        <SectionHeader :id="titleId" :eyebrow="content.eyebrow" :title="content.title" />
        <p class="programs__intro">{{ content.intro }}</p>
        <StepButton class="programs__cta" :href="content.cta.href">
          {{ content.cta.label }}
        </StepButton>
        <div
          class="programs__photo step-frame"
          :style="{ '--ratio': `${content.image.width} / ${content.image.height}` }"
          :data-program="openId ?? undefined"
          data-motion="programs-photo"
        >
          <NuxtPicture
            :src="content.image.src"
            :width="content.image.width"
            :height="content.image.height"
            :alt="content.image.alt"
            format="avif,webp"
            :sizes="photoSizes"
            loading="lazy"
            decoding="async"
            :img-attrs="{
              class: 'programs__img',
              style: { objectPosition: content.image.focal ?? 'center' },
            }"
          />
        </div>
      </div>

      <ProgramAccordion v-model="openId" :items="content.items" :coaches="coaches" />
    </div>
  </section>
</template>

<style scoped>
.programs {
  padding-block-end: var(--section-pad);
}

.programs__inner {
  /* Mesuré : 86 px du bouton à la photo @1440. */
  --photo-gap: clamp(2.5rem, 1.432rem + 4.381vw, 5.375rem);

  display: grid;
  row-gap: var(--block-gap);
  margin-block-start: var(--strip-gap);
}

.programs__aside {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.programs__intro {
  /* Mesuré : 24 px sous le titre ; ≈ 460 px en anglais, la colonne entière en français. */
  max-inline-size: 34rem;
  margin-block-start: var(--space-24);
  color: var(--ink-muted);
}

.programs__cta {
  margin-block-start: var(--space-40);
}

/*
 * Photo à encoche (mesurée sur s4 : 519 × 528, encoches de 69 et 71 px, décalages
 * haut 6,3 % et bas 13,2 %). Sous 64em, bandeau 16:9 recadré sur le point focal.
 */
.programs__photo {
  --fx: 13.5%;
  --ft: 6%;
  --fb: 13%;

  align-self: stretch;
  aspect-ratio: 16 / 9;
  margin-block-start: var(--photo-gap);
  background: var(--surface);
}

.programs__photo :deep(.programs__img) {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

@media (width >= 64em) {
  /* Pistes 1 : √2 (519 et 727 @1440), séparées par 78–80 px. */
  .programs__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    column-gap: var(--block-gap);
  }

  .programs__photo {
    position: sticky;
    inset-block-start: var(--space-32);
    aspect-ratio: var(--ratio);
  }
}
</style>
