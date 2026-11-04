<script setup lang="ts">
import { club } from '~/data/club';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

/**
 * Tribune : la parole aux membres, en grandes citations, comme la page sport
 * d'un journal local. Une citation à la une, deux en colonnes. Avis fictifs,
 * et la section le dit.
 */
const titleId = 'tribune-titre';
const content = club.tribune;
const [lead, ...rest] = content.items;

const root = useTemplateRef<HTMLElement>('root');
useMotion(root, ({ gsap, ScrollTrigger }, element) => {
  const quotes = element.querySelectorAll('.quote');
  if (!quotes.length || reached(quotes[0]!, 'bottom')) return undefined;
  gsap.set(quotes, { opacity: 0, y: length('--move-l') });
  ScrollTrigger.create({
    trigger: quotes[0],
    ...ENTRY,
    onEnter: () =>
      gsap.to(quotes, {
        opacity: 1,
        y: 0,
        duration: duration('--dur-focal'),
        stagger: capped(stagger('--stagger-lines')),
      }),
  });
  return undefined;
});
</script>

<template>
  <section ref="root" class="club-section tribune" :aria-labelledby="titleId">
    <div class="container">
      <ClubSectionHead :number="8" :title="content.title" :title-id="titleId" />

      <div class="tribune__grid">
        <figure v-if="lead" class="quote quote--lead">
          <span class="quote__mark" aria-hidden="true">«</span>
          <blockquote class="quote__text">
            <p>{{ lead.quote }}</p>
          </blockquote>
          <figcaption class="quote__author">
            <NuxtPicture
              :src="lead.portrait.src"
              :width="lead.portrait.width"
              :height="lead.portrait.height"
              alt=""
              format="avif,webp"
              sizes="96px"
              densities="x1 x2"
              loading="lazy"
              decoding="async"
              :img-attrs="{
                class: 'quote__portrait',
                style: { objectPosition: lead.portrait.focal },
              }"
            />
            <span class="quote__who">
              <strong class="quote__name">{{ lead.author }}</strong>
              <span class="quote__detail">{{ lead.detail }}</span>
            </span>
          </figcaption>
        </figure>

        <figure v-for="item in rest" :key="item.id" class="quote">
          <span class="quote__mark" aria-hidden="true">«</span>
          <blockquote class="quote__text">
            <p>{{ item.quote }}</p>
          </blockquote>
          <figcaption class="quote__author">
            <NuxtPicture
              :src="item.portrait.src"
              :width="item.portrait.width"
              :height="item.portrait.height"
              alt=""
              format="avif,webp"
              sizes="72px"
              densities="x1 x2"
              loading="lazy"
              decoding="async"
              :img-attrs="{
                class: 'quote__portrait',
                style: { objectPosition: item.portrait.focal },
              }"
            />
            <span class="quote__who">
              <strong class="quote__name">{{ item.author }}</strong>
              <span class="quote__detail">{{ item.detail }}</span>
            </span>
          </figcaption>
        </figure>
      </div>
      <p class="club-note tribune__note">{{ content.note }}</p>
    </div>
  </section>
</template>

<style scoped>
.tribune__grid {
  display: grid;
  gap: var(--block-gap) var(--gap);
  margin-block-start: var(--header-gap);
}

.quote {
  position: relative;
  display: grid;
  gap: var(--space-24);
  align-content: start;
  margin: 0;
  padding-block-start: var(--space-24);
  border-block-start: var(--line-pitch) solid var(--pitch-800);
}

.quote__mark {
  position: absolute;
  inset-block-start: -0.12em;
  inset-inline-start: -0.04em;
  color: var(--canary-400);
  font-family: var(--font-display);
  font-size: 7rem;
  font-weight: 900;
  line-height: 1;
  translate: 0 -40%;
  -webkit-text-stroke: 2px var(--pitch-800);
  paint-order: stroke fill;
}

.quote__text {
  margin: 0;
}

.quote__text p {
  font-size: var(--text-subheading);
  font-weight: 500;
  line-height: 1.35;
  text-wrap: pretty;
}

.quote--lead .quote__text p {
  max-inline-size: 34ch;
  font-size: var(--text-quote);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.quote__author {
  display: flex;
  gap: var(--space-12);
  align-items: center;
}

.quote__author :deep(.quote__portrait) {
  display: block;
  inline-size: 3.5rem;
  block-size: 3.5rem;
  border: 3px solid var(--canary-400);
  border-radius: 50%;
  object-fit: cover;
}

.quote--lead .quote__author :deep(.quote__portrait) {
  inline-size: 4.5rem;
  block-size: 4.5rem;
}

.quote__who {
  display: grid;
}

.quote__name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 800;
  font-stretch: var(--stretch-wide);
  text-transform: uppercase;
}

.quote__detail {
  color: var(--ink-secondary);
  font-size: var(--text-label);
}

.tribune__note {
  margin-block-start: var(--space-40);
}

@media (min-width: 64rem) {
  .tribune__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .quote--lead {
    grid-column: 1 / -1;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: var(--gap);
    align-items: end;
  }

  .quote--lead .quote__text {
    grid-column: 2 / span 8;
  }

  .quote--lead .quote__author {
    grid-column: 10 / -1;
  }

  .quote:not(.quote--lead) {
    grid-column: span 6;
  }

  .quote:nth-child(2) {
    grid-column: 2 / span 5;
  }

  .quote:nth-child(3) {
    grid-column: 8 / span 5;
  }
}
</style>
