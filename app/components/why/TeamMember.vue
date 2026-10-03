<script setup lang="ts">
import type { Coach } from '~/types/content';

/**
 * Membre de l'équipe : portrait, nom et index dans une <figure>.
 * Le portrait est décoratif (alt vide) : la légende nomme la personne et donne sa
 * spécialité aux lecteurs d'écran. L'index « 01 » est un décor (aria-hidden).
 *
 * Le composant ne décide d'aucun état : il rend celui que TeamGrid lui pose.
 *   --member-open   0 → 1 : portrait carré → portrait vedette (4:5) ;
 *   --member-dim    0 → 1 : luminosité 100 → 70 % ;
 *   --member-index  couleur de l'index ;
 *   --member-delay  délai des changements d'état (retour différé) ;
 *   --member-photo-max  plafond de hauteur du portrait (mise en page mobile).
 */
defineProps<{
  coach: Coach;
  number: string;
  featured: boolean;
  sizes: Record<string, string>;
}>();
</script>

<template>
  <li class="member" :class="{ 'member--featured': featured }" data-motion="why-member">
    <figure class="member__figure">
      <div class="member__photo">
        <NuxtPicture
          :src="coach.portrait.src"
          :width="coach.portrait.width"
          :height="coach.portrait.height"
          alt=""
          format="avif,webp"
          :sizes="sizes"
          loading="lazy"
          decoding="async"
          :img-attrs="{
            class: 'member__img',
            style: { objectPosition: coach.portrait.focal ?? '50% 25%' },
          }"
        />
      </div>
      <figcaption class="member__caption">
        <span class="member__name">
          {{ coach.name }}<span class="visually-hidden">, {{ coach.specialty }}</span>
        </span>
        <span class="member__number" aria-hidden="true">{{ number }}</span>
      </figcaption>
    </figure>
  </li>
</template>

<style scoped>
/* Typée pour être interpolée : TeamGrid l'anime, la largeur et la hauteur en découlent. */
@property --member-open {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}

.member {
  --member-open: 0;
}

.member--featured {
  --member-open: 1;
}

/*
 * Le portrait s'allonge avec --member-open : carré au repos, 25,85 % plus haut en
 * vedette (mesuré : 325 × 409). L'image recadre en continu (object-fit), sans
 * clip-path : celui-ci reste libre pour la révélation de la chorégraphie.
 */
.member__photo {
  aspect-ratio: 1 / calc(1 + var(--member-stretch, 0.2585) * var(--member-open));
  max-block-size: var(--member-photo-max, none);
  overflow: hidden;
  background: var(--surface);
  filter: brightness(calc(1 - 0.3 * var(--member-dim, 0)));
  transition: filter var(--dur-state) var(--ease-out-soft) var(--member-delay, 0s);
}

.member__photo :deep(picture),
.member__photo :deep(.member__img) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.member__photo :deep(.member__img) {
  object-fit: cover;
}

/* Mesuré : capitales du nom à 13 px sous la photo, ligne de base à 25 px. */
.member__caption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-8);
  margin-block-start: var(--member-caption-gap, 0.4375rem);
  line-height: 1.5;
}

.member__name {
  min-inline-size: 0;
  color: var(--ink-secondary);
}

/* Index : 14 px au lieu de 12 et #788382 (4,97:1), correctifs de lisibilité. */
.member__number {
  flex: none;
  font-family: var(--font-display);
  font-size: var(--text-micro);
  font-weight: 500;
  line-height: 1;
  color: var(--member-index, var(--night-500));
  transition: color var(--dur-state) var(--ease-out-soft) var(--member-delay, 0s);
}

@media (prefers-reduced-motion: reduce) {
  .member__photo,
  .member__number {
    transition: none;
  }
}
</style>
