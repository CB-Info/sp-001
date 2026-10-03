<script setup lang="ts">
import type { Coach, NavLink } from '~/types/content';

/**
 * Équipe : un portrait par coach, celui de `featuredId` en vedette (piste √2,
 * portrait 4:5), une trame dans le vide de gauche et le bouton dans celui de droite.
 *
 * Sur ordinateur à pointeur fin, la vedette suit le survol, en CSS seul : TeamGrid
 * pose l'état de chaque membre (--member-open, --member-dim, --member-index) et
 * la largeur (flex-grow) comme la hauteur du portrait en découlent. La rangée a une
 * hauteur fixe : rien ne bouge en dehors d'elle. Les membres placés avant la
 * vedette (« lead ») et après (« trail ») libèrent leur vide quand ils s'ouvrent.
 *
 * Les portraits ne sont pas focalisables (pas de fiche) : les noms restent visibles,
 * le survol n'ajoute aucune information.
 */
const props = defineProps<{ coaches: Coach[]; featuredId: string; cta: NavLink }>();

const headingId = 'equipe-titre';

const featuredIndex = computed(() =>
  Math.max(
    0,
    props.coaches.findIndex((coach) => coach.id === props.featuredId),
  ),
);

/*
 * Clés = largeur minimale de fenêtre (@nuxt/image). Mobile : vedette en pleine
 * largeur, carrés en 2 colonnes ; tablette : bento ; ordinateur : tout portrait
 * peut passer en vedette (≈ 23vw, 323 px au plus), on sert donc cette taille à tous.
 */
const featuredSizes = { xs: '100vw', sm: '42vw', lg: '23vw', '2xl': '330px' };
const memberSizes = { xs: '50vw', sm: '24vw', lg: '23vw', '2xl': '330px' };
</script>

<template>
  <div class="team" :style="{ '--count': coaches.length, '--lead': featuredIndex }">
    <h3 :id="headingId" class="visually-hidden">L’équipe</h3>
    <div class="team__stage">
      <ul class="team__list" :aria-labelledby="headingId">
        <TeamMember
          v-for="(coach, i) in coaches"
          :key="coach.id"
          class="team__member"
          :class="{
            'team__member--lead': i < featuredIndex,
            'team__member--featured': i === featuredIndex,
            'team__member--trail': i > featuredIndex,
          }"
          :coach="coach"
          :number="String(i + 1).padStart(2, '0')"
          :featured="i === featuredIndex"
          :sizes="i === featuredIndex ? featuredSizes : memberSizes"
        />
      </ul>
      <div v-if="featuredIndex > 0" class="team__texture" aria-hidden="true">
        <div class="team__texture-frame">
          <RuledGrid class="team__panel" />
        </div>
      </div>
      <div class="team__cta-slot">
        <StepButton class="team__cta" :href="cta.href" data-motion="why-cta">
          {{ cta.label }}
        </StepButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team {
  /*
   * Géométrie mesurée @1440 (a1 §2.5) :
   * - pistes [229][229][325][229][229], gouttière 20 : la vedette vaut √2 ;
   * - portrait vedette 325 × 409, soit 25,85 % plus haut que large ;
   * - légende : 7 px, puis une ligne de 1,5rem (capitales du nom à 13 px de la photo) ;
   * - trame : filet à 46 px sous les petits portraits, panneau fini au bas
   *   de la vedette, 23 px sous le filet ;
   * - bouton : bas de sa plaque 5 px au-dessus de la ligne de base du nom de la vedette.
   */
  --member-stretch: 0.2585;
  --member-caption-gap: 0.4375rem;
  --caption: calc(var(--member-caption-gap) + 1.5rem);
  --texture-offset: 0.9375rem;
  --cta-lift: 0.6875rem;
  --texture-gap: 1.4375rem;

  /* Piste standard et hauteur de la vedette, déduites de la largeur de l'équipe. */
  --track: calc(
    (100cqi - (var(--count) - 1) * var(--gap)) / (var(--count) - 1 + var(--feature-ratio))
  );
  --featured-height: calc(var(--track) * var(--feature-ratio) * (1 + var(--member-stretch)));

  /* Ouverture à 420 ms ; retour plus court (≈ 0,7 ×), après 150 ms anti-scintillement. */
  --open-duration: var(--dur-layout);
  --close-duration: calc(var(--dur-layout) * 0.7);
  --fade-duration: var(--dur-state);
  --return-delay: 150ms;
  --refill-delay: calc(var(--return-delay) + var(--close-duration) * 0.5);

  container-type: inline-size;
}

/*
 * Mobile : « 1 + 4 », la vedette en pleine largeur (4:5), puis deux rangées de carrés.
 * Sa hauteur est plafonnée à 28rem : sur un grand téléphone, elle tient dans un écran.
 */
.team__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-24) var(--gap);
  padding: 0;
  list-style: none;
}

.team__member--featured {
  --member-photo-max: 28rem;

  grid-column: 1 / -1;
  order: -1;
}

.team__texture {
  display: none;
}

.team__cta-slot {
  display: flex;
  margin-block-start: var(--space-32);
}

.team__cta-slot > .team__cta {
  flex: 1;
}

/* Mobile : bouton en pleine largeur, 48 px de haut, sous le pouce. */
@media (width < 40em) {
  .team__cta-slot > .team__cta {
    min-block-size: 3rem;
  }
}

/* Tablette et plus : bouton calé à droite, à sa largeur. */
@media (width >= 40em) {
  .team__cta-slot {
    justify-content: flex-end;
  }

  .team__cta-slot > .team__cta {
    flex: none;
  }
}

/*
 * Bento : la vedette (4:5) occupe deux rangées de carrés. Avec r = 1 / 1,2585,
 * le côté q d'un carré vérifie : largeur = r (2q + légende + gouttière) + 2q + 2 gouttières.
 */
@media (40em <= width < 64em) {
  .team__list {
    --ratio: calc(1 / (1 + var(--member-stretch)));
    --square: calc(
      (100cqi - 2 * var(--gap) - var(--ratio) * (var(--caption) + var(--gap))) /
        (2 * (1 + var(--ratio)))
    );

    grid-template-columns:
      calc(var(--ratio) * (2 * var(--square) + var(--caption) + var(--gap)))
      repeat(2, minmax(0, 1fr));
    gap: var(--gap);
  }

  .team__member--featured {
    --member-photo-max: none;

    grid-column: 1;
    grid-row: 1 / span 2;
  }
}

/*
 * Ordinateur : une rangée de hauteur fixe où chaque piste vaut 1 + (√2 − 1) × ouverture.
 * La trame et le bouton se superposent à la rangée, dans les vides qu'elle laisse.
 */
@media (width >= 64em) {
  .team__stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }

  .team__list,
  .team__texture,
  .team__cta-slot {
    grid-area: 1 / 1;
  }

  .team__list {
    display: flex;
    align-items: flex-start;
    gap: var(--gap);
    block-size: calc(var(--featured-height) + var(--caption));
    /* Frontière de mise en page : l'animation des pistes ne relance pas la page. */
    contain: size layout;
  }

  .team__member {
    flex: calc(1 + (var(--feature-ratio) - 1) * var(--member-open)) 1 0%;
    min-inline-size: 0;
  }

  .team__member--featured {
    --member-photo-max: none;

    order: 0;
  }

  .team__texture {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    align-self: start;
    inline-size: calc(var(--lead) * var(--track) + (var(--lead) - 1) * var(--gap));
    block-size: calc(
      var(--featured-height) - var(--track) - var(--caption) - var(--texture-offset)
    );
    margin-block-start: calc(var(--track) + var(--caption) + var(--texture-offset));
    padding-block-start: var(--texture-gap);
    border-block-start: 1px solid var(--pattern-line);
    pointer-events: none;
  }

  /* Panneau de 107 px calé en bas ; s'il manque de place, ses rangées du haut sont rognées. */
  .team__texture-frame {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-block-size: 0;
    overflow: clip;
  }

  .team__panel {
    flex: none;
  }

  .team__cta-slot {
    align-self: end;
    justify-self: end;
    margin-block: 0 var(--cta-lift);
  }
}

/*
 * Survol (pointeur fin) : la vedette suit le membre survolé. Chaque état porte sa
 * durée et son délai : l'ouverture part tout de suite, le retour attend 150 ms
 * (passer d'un portrait à l'autre par la gouttière ne fait rien clignoter).
 */
@media (width >= 64em) and (hover: hover) and (pointer: fine) {
  .team__member {
    --member-delay: var(--return-delay);

    transition: --member-open var(--close-duration) var(--ease-in-out) var(--member-delay);
  }

  .team__list:has(.team__member:hover) .team__member {
    --member-open: 0;
    --member-dim: 1;
    --member-delay: 0s;

    transition-duration: var(--open-duration);
  }

  .team__list:has(.team__member:hover) .team__member:hover {
    --member-open: 1;
    --member-dim: 0;
    --member-index: var(--accent-ink);
  }

  /*
   * Les vides se referment : la trame cède sous la photo qui descend, le bouton
   * s'efface tant qu'un membre de droite occupe son coin. Ils reviennent une fois
   * le portrait à moitié refermé. Le bouton garde sa place et reste actif : y
   * amener le pointeur referme le membre et le fait réapparaître.
   */
  .team__texture {
    transition: clip-path var(--close-duration) var(--ease-in-out) var(--refill-delay);
  }

  .team__stage:has(.team__member--lead:hover) .team__texture {
    clip-path: inset(100% 0 0 0);
    transition-duration: var(--open-duration);
    transition-delay: 0s;
  }

  .team__cta-slot {
    transition: opacity var(--fade-duration) var(--ease-out-soft) var(--refill-delay);
  }

  .team__stage:has(.team__member--trail:hover) .team__cta-slot:not(:focus-within) {
    opacity: 0;
    transition-delay: 0s;
  }
}

/* Mouvement réduit : les états changent sans transition (le délai anti-scintillement reste). */
@media (prefers-reduced-motion: reduce) {
  .team {
    --open-duration: 0s;
    --close-duration: 0s;
    --fade-duration: 0s;
  }
}
</style>
