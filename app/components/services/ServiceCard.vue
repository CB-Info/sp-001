<script setup lang="ts">
import type { Service } from '~/types/content';

/**
 * Carte de service : photo à gradin et description en haut, filet, puis titre et
 * numéro géant en bas. Deux états pilotés par le carrousel : inactive (blanche,
 * photo en N&B) et active (noire, photo en monochrome rouge). La carte ne gère
 * aucune interaction elle-même.
 *
 * Ordre du DOM : titre, description, puis photo, pour que le titre précède son
 * texte à la lecture ; la grille replace chaque bloc comme dans la référence.
 */
defineProps<{ service: Service; active: boolean }>();
</script>

<template>
  <div class="service-card" :class="{ 'service-card--active': active }">
    <div class="service-card__layout">
      <div class="service-card__bottom">
        <h3 class="service-card__title">{{ service.title }}</h3>
        <p class="service-card__figure" aria-hidden="true">
          <span class="service-card__number">{{ service.number }}</span>
          <Asterisk class="service-card__asterisk" size="0.41em" />
        </p>
      </div>
      <p class="service-card__text">{{ service.description }}</p>
      <div class="service-card__media step-frame">
        <NuxtPicture
          :src="service.image.src"
          :width="service.image.width"
          :height="service.image.height"
          :alt="service.image.alt"
          format="avif,webp"
          sizes="240px"
          loading="lazy"
          decoding="async"
          :img-attrs="{
            class: 'service-card__img',
            style: { objectPosition: service.image.focal ?? 'center' },
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-card {
  /* Rôles de la carte inactive : blanche sur le sol #F5F5F5, encre marine. */
  --card-bg: var(--surface);
  --card-ink: var(--ink);
  --card-text: var(--ink-muted);
  --card-figure: var(--ink-strong);
  --card-rule: var(--rule);
  --card-state: var(--dur-state) var(--ease-out-soft);

  container-type: inline-size;
  padding: var(--space-20);
  background-color: var(--card-bg);
  color: var(--card-ink);
  transition: background-color var(--card-state);
}

/* Carte active : inversée en noir (la référence n'a pas de surface « inverse » en token). */
.service-card--active {
  --card-bg: var(--surface-inverse);
  --card-ink: var(--paper-0);
  /* Mesuré : gris #999 (blanc à 60 % sur noir), soit 7,4:1. */
  --card-text: color-mix(in srgb, var(--paper-0) 60%, var(--black));
  --card-figure: var(--paper-0);
  --card-rule: var(--carbon-850);
}

/* Petite carte (mobile) : photo, texte, puis numéro et titre empilés. */
.service-card__layout {
  display: grid;
  grid-template-areas:
    'media'
    'text'
    'bottom';
  grid-template-rows: auto auto 1fr;
  row-gap: var(--space-16);
  block-size: 100%;
}

.service-card__media {
  /* Mesuré : photo de 219 × 123, gradin de 26 / 8 / 26 px, soit 12 % / 6,5 % / 21 %. */
  --fx: 12%;
  --ft: 6.5%;
  --fb: 21%;

  grid-area: media;
  position: relative;
  inline-size: 62%;
  aspect-ratio: 16 / 9;
  transition:
    --fx var(--dur-feedback) var(--ease-out-soft),
    --fb var(--dur-feedback) var(--ease-out-soft);
}

.service-card__media :deep(img) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.1);
  transition: filter var(--card-state);
}

/* Calque rouge en « produit » : le N&B devient un monochrome rouge (photo active). */
.service-card__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--red-600);
  mix-blend-mode: multiply;
  opacity: 0;
  transition: opacity var(--card-state);
}

.service-card--active .service-card__media :deep(img) {
  filter: grayscale(1) contrast(1.15) brightness(1.2);
}

.service-card--active .service-card__media::after {
  opacity: 1;
}

.service-card__text {
  grid-area: text;
  font-size: var(--text-body);
  line-height: 1.3;
  color: var(--card-text);
  transition: color var(--card-state);
}

.service-card__bottom {
  position: relative;
  grid-area: bottom;
  display: grid;
  grid-template-areas:
    'figure'
    'title';
  align-content: end;
  row-gap: var(--space-16);
  margin-block-start: var(--space-8);
  padding-block-start: var(--space-24);
  border-block-start: 1px solid var(--card-rule);
  transition: border-color var(--card-state);
}

.service-card__title {
  grid-area: title;
  font-size: var(--text-subheading);
  line-height: var(--leading-tight);
  text-transform: uppercase;
  /* La boîte s'arrête sur la ligne de base : le titre se pose sur celle du numéro. */
  text-box: trim-end cap alphabetic;
  color: var(--card-ink);
  transition:
    color var(--card-state),
    translate var(--dur-feedback) var(--ease-out-soft);
}

.service-card__figure {
  grid-area: figure;
  justify-self: end;
  display: flex;
  align-items: flex-end;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: min(var(--text-figure), 30.3cqi);
  line-height: 0.8;
  letter-spacing: -0.03em;
  color: var(--card-figure);
  transition: color var(--card-state);
}

/* Boîte réduite à la hauteur des chiffres (capitales Tektur : 0,7 em). */
.service-card__number {
  margin-block: -0.05em;
}

/* Mesuré : astérisque de 74 px pour des chiffres de 180, qui mord sur le dernier chiffre. */
.service-card__asterisk {
  flex: none;
  margin-inline-start: -0.1em;
}

/* Carte large (≥ 26rem, soit 23,5rem de contenu) : la composition de la référence. */
@container (inline-size >= 23.5rem) {
  .service-card__layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas:
      'media text'
      'bottom bottom';
    grid-template-rows: auto 1fr;
    column-gap: var(--space-32);
    row-gap: 0;
  }

  /* Mesuré : 219 px sur 594 de contenu. */
  .service-card__media {
    inline-size: 36.9cqi;
  }

  /* Mesuré : filet à 184 px du haut, chiffres à 40 px sous le filet. */
  .service-card__bottom {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: 'title figure';
    align-items: end;
    column-gap: var(--space-12);
    margin-block-start: var(--space-40);
    padding-block-start: var(--space-40);
  }

  .service-card__title {
    font-size: min(var(--text-subheading), 6.06cqi);
  }
}

/*
 * Survol d'une carte inactive (elle est cliquable) : la trace de la photo s'allonge,
 * le titre avance d'un pas et le filet se trace en rouge, puis se rétracte vers la droite.
 */
@media (hover: hover) and (pointer: fine) {
  .service-card__bottom::before {
    content: '';
    position: absolute;
    inset-block-start: -1px;
    inset-inline: 0;
    block-size: 1px;
    background-color: var(--accent);
    scale: 0 1;
    transform-origin: right;
    transition: scale var(--dur-state) var(--ease-out);
  }

  .service-card:not(.service-card--active):hover .service-card__bottom::before {
    scale: 1 1;
    transform-origin: left;
  }

  .service-card:not(.service-card--active):hover .service-card__media {
    --fx: 15%;
    --fb: 27%;
  }

  .service-card:not(.service-card--active):hover .service-card__title {
    translate: var(--step-sm-x) 0;
  }
}

/* Appui : la plaque s'enfonce, les marches se referment avant que la carte s'active. */
.service-card:not(.service-card--active):active .service-card__media {
  --fx: 0%;
  --fb: 0%;

  transition-duration: var(--dur-press);
}

/* Mouvement réduit : les états changent toujours, mais sans transition. */
@media (prefers-reduced-motion: reduce) {
  .service-card,
  .service-card__media,
  .service-card__media::after,
  .service-card__media :deep(img),
  .service-card__text,
  .service-card__bottom,
  .service-card__bottom::before,
  .service-card__title,
  .service-card__figure {
    transition: none;
  }
}

/* Contrastes forcés : les fonds disparaissent, l'état actif passe par un contour (sans décalage). */
@media (forced-colors: active) {
  .service-card {
    outline: 1px solid CanvasText;
    outline-offset: -1px;
  }

  .service-card--active {
    outline: 4px solid Highlight;
    outline-offset: -4px;
  }
}
</style>
