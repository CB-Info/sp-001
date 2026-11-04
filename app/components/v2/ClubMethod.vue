<script setup lang="ts">
import { club } from '~/data/club';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

/**
 * La méthode : trois temps (bilan, plan de jeu, saison), puis une séance de
 * force en chiffres : la photo du squat annotée de valeurs réelles, chaque
 * valeur épinglée sur la photo par une ligne de rappel.
 *
 * Les épingles et les étiquettes portent le même numéro : sans JS (ou sur
 * mobile, où les étiquettes passent sous la photo), le lien reste lisible. Les
 * lignes de rappel sont tracées en JS (positions réelles, recalculées au
 * redimensionnement), en mouvement réduit compris ; GSAP ne fait que les dessiner.
 */
const titleId = 'methode-titre';
const content = club.method;
const left = content.annotations.filter(({ side }) => side === 'left');
const right = content.annotations.filter(({ side }) => side === 'right');
const ordered = [...left, ...right];

const root = useTemplateRef<HTMLElement>('root');
const figure = useTemplateRef<HTMLElement>('figure');
const lines = ref<{ id: number; d: string }[]>([]);
const box = ref({ width: 0, height: 0 });

/** Une ligne par étiquette visible à côté de la photo : étiquette → bord → épingle. */
function trace() {
  const frame = figure.value;
  if (!frame) return;
  const origin = frame.getBoundingClientRect();
  box.value = { width: origin.width, height: origin.height };
  const photo = frame.querySelector('.figure__photo')?.getBoundingClientRect();
  const next: { id: number; d: string }[] = [];
  for (const label of frame.querySelectorAll<HTMLElement>('[data-annotation]')) {
    const id = Number(label.dataset.annotation);
    const pin = frame.querySelector(`[data-pin="${id}"]`)?.getBoundingClientRect();
    const rect = label.getBoundingClientRect();
    // Étiquettes passées sous la photo (mobile) : pas de ligne.
    if (!photo || !pin || rect.top >= photo.bottom - 1) continue;
    const isLeft = rect.right <= photo.left + 1;
    const startX = (isLeft ? rect.right + 8 : rect.left - 8) - origin.left;
    const y = rect.top + 28 - origin.top;
    const edgeX = (isLeft ? photo.left + 24 : photo.right - 24) - origin.left;
    const pinX = pin.left + pin.width / 2 - origin.left;
    const pinY = pin.top + pin.height / 2 - origin.top;
    next.push({ id, d: `M${startX} ${y}H${edgeX}L${pinX} ${pinY}` });
  }
  lines.value = next;
}

let observer: ResizeObserver | undefined;
onMounted(() => {
  trace();
  observer = new ResizeObserver(() => trace());
  if (figure.value) observer.observe(figure.value);
});
onBeforeUnmount(() => observer?.disconnect());

useMotion(root, ({ gsap, ScrollTrigger }, element) => {
  const steps = element.querySelectorAll('.method__step');
  const frame = element.querySelector('.figure');
  if (!frame) return undefined;
  if (!reached(steps[0] ?? element, 'bottom')) {
    gsap.set(steps, { opacity: 0, y: length('--move-l') });
    ScrollTrigger.create({
      trigger: steps[0],
      ...ENTRY,
      onEnter: () =>
        gsap.to(steps, {
          opacity: 1,
          y: 0,
          duration: duration('--dur-focal'),
          stagger: capped(stagger('--stagger-lines')),
        }),
    });
  }
  if (reached(frame, 'bottom')) return undefined;
  const pins = frame.querySelectorAll('.figure__pin');
  const labels = frame.querySelectorAll('.figure__label');
  gsap.set(pins, { scale: 0 });
  gsap.set(labels, { opacity: 0, y: length('--move-s') });
  // Les lignes : tracées du bord de l'étiquette vers l'épingle.
  frame.classList.add('figure--drawing');
  ScrollTrigger.create({
    trigger: frame,
    ...ENTRY,
    onEnter: () => {
      const timeline = gsap.timeline();
      timeline
        .to(pins, {
          scale: 1,
          duration: duration('--dur-strike'),
          ease: 'strike',
          stagger: capped(stagger('--stagger-list')),
        })
        .to(
          frame,
          { '--draw': 1, duration: duration('--dur-focal'), ease: 'in-out' },
          `-=${duration('--dur-state')}`,
        )
        .to(
          labels,
          {
            opacity: 1,
            y: 0,
            duration: duration('--dur-layout'),
            stagger: capped(stagger('--stagger-list')),
          },
          '<+=0.12',
        );
    },
  });
  return () => frame.classList.remove('figure--drawing');
});
</script>

<template>
  <section ref="root" class="club-section method" data-surface="mist" :aria-labelledby="titleId">
    <div class="container">
      <ClubSectionHead
        :number="3"
        :kicker="content.kicker"
        :title="content.title"
        :title-id="titleId"
        :lead="content.lead"
      />

      <ol class="method__steps" role="list">
        <li v-for="step in content.steps" :key="step.number" class="method__step">
          <span class="method__number club-number" aria-hidden="true">{{ step.number }}</span>
          <h3 class="method__title">{{ step.title }}</h3>
          <p class="method__text">{{ step.text }}</p>
        </li>
      </ol>

      <figure ref="figure" class="figure" aria-labelledby="methode-figure">
        <figcaption id="methode-figure" class="figure__caption club-label">
          {{ content.figureTitle }}
        </figcaption>

        <div class="figure__photo">
          <NuxtPicture
            :src="content.photo.src"
            :width="content.photo.width"
            :height="content.photo.height"
            :alt="content.photo.alt"
            format="avif,webp"
            sizes="100vw md:70vw lg:520px"
            loading="lazy"
            decoding="async"
            :img-attrs="{ class: 'figure__img' }"
          />
          <span
            v-for="(note, index) in ordered"
            :key="note.value"
            class="figure__pin club-number"
            :data-pin="index + 1"
            :style="{ left: `${note.x * 100}%`, top: `${note.y * 100}%` }"
            aria-hidden="true"
            >{{ index + 1 }}</span
          >
        </div>

        <ul class="figure__labels figure__labels--left" role="list">
          <li
            v-for="(note, index) in left"
            :key="note.value"
            class="figure__label"
            :data-annotation="index + 1"
          >
            <span class="figure__index club-number" aria-hidden="true">{{ index + 1 }}</span>
            <strong class="figure__value club-number">{{ note.value }}</strong>
            <span class="figure__text">{{ note.label }}</span>
          </li>
        </ul>
        <ul class="figure__labels figure__labels--right" role="list">
          <li
            v-for="(note, index) in right"
            :key="note.value"
            class="figure__label"
            :data-annotation="left.length + index + 1"
          >
            <span class="figure__index club-number" aria-hidden="true">{{
              left.length + index + 1
            }}</span>
            <strong class="figure__value club-number">{{ note.value }}</strong>
            <span class="figure__text">{{ note.label }}</span>
          </li>
        </ul>

        <svg
          v-if="lines.length"
          class="figure__lines"
          :viewBox="`0 0 ${box.width} ${box.height}`"
          aria-hidden="true"
          focusable="false"
        >
          <path v-for="line in lines" :key="line.id" :d="line.d" pathLength="1" />
        </svg>
      </figure>
    </div>
  </section>
</template>

<style scoped>
/* ── Trois temps ─────────────────────────────────────────────────────────── */
.method__steps {
  display: grid;
  gap: var(--space-24);
  margin-block-start: var(--header-gap);
  counter-reset: none;
}

.method__step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4) var(--space-20);
  align-content: start;
  padding-block-start: var(--space-20);
  border-block-start: var(--line-pitch) solid var(--pitch-800);
}

.method__number {
  grid-row: span 2;
  color: var(--pitch-800);
  font-size: 3.5rem;
  line-height: 0.8;
}

.method__title {
  font-size: var(--text-subheading);
  font-weight: 800;
  line-height: 1.1;
}

.method__text {
  max-inline-size: 30rem;
  color: var(--ink-secondary);
}

@media (min-width: 48rem) {
  .method__steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap);
  }

  .method__step {
    grid-template-columns: 1fr;
  }

  .method__number {
    grid-row: auto;
    font-size: 4.5rem;
  }
}

/* ── La séance annotée ───────────────────────────────────────────────────── */
.figure {
  --draw: 1;

  position: relative;
  display: grid;
  gap: var(--space-20);
  margin-block-start: var(--block-gap);
}

.figure--drawing {
  --draw: 0;
}

.figure__caption {
  color: var(--accent-ink);
}

.figure__photo {
  position: relative;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.figure__photo :deep(.figure__img) {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-card);
  object-fit: cover;
}

.figure__pin {
  position: absolute;
  display: grid;
  place-items: center;
  inline-size: 1.875rem;
  block-size: 1.875rem;
  /* Centré par ses marges, pas par translate : GSAP anime son échelle. */
  margin: -0.9375rem 0 0 -0.9375rem;
  border: var(--line-pitch) solid var(--pitch-800);
  border-radius: 50%;
  background: var(--canary-400);
  color: var(--pitch-950);
  font-size: 1rem;
  box-shadow: 0 0 0 4px rgb(255 255 255 / 0.55);
}

.figure__labels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-16);
}

.figure__label {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 var(--space-12);
  align-items: baseline;
}

.figure__index {
  grid-row: span 2;
  display: grid;
  place-items: center;
  inline-size: 1.625rem;
  block-size: 1.625rem;
  border-radius: 50%;
  background: var(--pitch-800);
  color: var(--kit-white);
  font-size: 0.9375rem;
  align-self: start;
  margin-block-start: 0.375rem;
}

.figure__value {
  color: var(--pitch-800);
  font-size: clamp(2.25rem, 1.8rem + 1.6vw, 3.25rem);
  line-height: 1;
}

.figure__text {
  color: var(--ink-secondary);
  font-size: var(--text-label);
  line-height: 1.35;
}

.figure__lines {
  display: none;
}

@media (min-width: 64rem) {
  .figure {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: var(--gap);
    align-items: stretch;
  }

  .figure__caption {
    grid-column: 1 / -1;
    justify-self: center;
  }

  .figure__photo {
    grid-column: 4 / span 6;
    grid-row: 2;
  }

  .figure__labels {
    grid-row: 2;
    grid-template-columns: 1fr;
    align-content: space-around;
    gap: var(--space-40);
  }

  .figure__labels--left {
    grid-column: 1 / span 3;
    text-align: end;
  }

  .figure__labels--right {
    grid-column: 10 / span 3;
  }

  .figure__labels--left .figure__label {
    grid-template-columns: 1fr auto;
  }

  .figure__labels--left .figure__index {
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  .figure__labels--left .figure__value,
  .figure__labels--left .figure__text {
    grid-column: 1;
  }

  .figure__lines {
    position: absolute;
    inset: 0;
    display: block;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
    pointer-events: none;
    fill: none;
    stroke: var(--pitch-800);
    stroke-width: 1.5;
    stroke-dasharray: 1;
    stroke-dashoffset: calc(1 - var(--draw));
  }
}

@media (forced-colors: active) {
  .figure__pin,
  .figure__index {
    border-color: CanvasText;
    forced-color-adjust: none;
  }
}
</style>
