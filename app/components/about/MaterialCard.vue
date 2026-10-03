<script setup lang="ts">
/**
 * Carte « matière » d'About : un aplat texturé en CSS pur (aucune image), sur
 * lequel la carte de note ou de stat pose son contenu. Deux matières mesurées :
 *  - grain : rouge de remplissage marbré, qui fonce vers le bas à droite et ne
 *    s'éclaircit jamais (le texte blanc garde au moins 4,62:1) ;
 *  - concrete : béton clair, marbrures entre #ECECEC et #FFF (le gris de texte
 *    garde au moins 4,65:1).
 * La surface (data-surface) bascule les rôles de couleur, focus compris.
 */
const props = defineProps<{ material: 'grain' | 'concrete' }>();

const surface = computed(() => (props.material === 'grain' ? 'signal' : 'paper-alt'));
</script>

<template>
  <div class="material-card" :class="`material-card--${material}`" :data-surface="surface">
    <slot />
  </div>
</template>

<style scoped>
.material-card {
  /* Mesuré : 28 px de marge intérieure, 20 px sous les avatars, carte de 241 px @1440 (200 px à 390). */
  --card-pad: clamp(1.25rem, 1.0643rem + 0.7619vw, 1.75rem);

  container-type: inline-size;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-block-size: clamp(12.5rem, 11.5714rem + 3.8095vw, 15rem);
  padding: var(--card-pad) var(--card-pad) var(--space-20);
  background-color: var(--bg);
  color: var(--ink);
}

/*
 * Grain rouge : un grain fin (bruit fractal, uniquement des points sombres), des
 * nuages de --red-700 et une ombre de --red-800 vers le bas à droite. Toutes les
 * couches assombrissent : aucun pixel n'est plus clair que --red-600.
 */
.material-card--grain {
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .6 0 0 0 -.27'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E"),
    radial-gradient(
      120% 110% at 100% 100%,
      color-mix(in oklab, var(--red-800) 22%, transparent),
      transparent 70%
    ),
    radial-gradient(
      34% 44% at 80% 24%,
      color-mix(in oklab, var(--red-700) 30%, transparent),
      transparent
    ),
    radial-gradient(
      28% 40% at 48% 62%,
      color-mix(in oklab, var(--red-700) 20%, transparent),
      transparent
    ),
    radial-gradient(
      24% 36% at 8% 96%,
      color-mix(in oklab, var(--red-700) 22%, transparent),
      transparent
    ),
    radial-gradient(
      22% 30% at 30% 8%,
      color-mix(in oklab, var(--red-700) 14%, transparent),
      transparent
    );
}

/*
 * Béton clair : sol #F5F5F5, nuées de --grey-200, éclaircies blanches (surtout en
 * bas à gauche, sous les puces) et grain blanc. Rien ne descend sous #ECECEC : le
 * gris de texte y garde 4,65:1.
 */
.material-card--concrete {
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.6 0 0 0 -.68'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E"),
    radial-gradient(42% 58% at 92% 46%, var(--grey-200), transparent),
    radial-gradient(30% 40% at 66% 10%, var(--grey-200), transparent),
    radial-gradient(22% 30% at 40% 38%, var(--grey-200), transparent),
    radial-gradient(14% 22% at 78% 78%, var(--grey-200), transparent),
    radial-gradient(
      18% 26% at 56% 56%,
      color-mix(in oklab, var(--grey-200) 70%, transparent),
      transparent
    ),
    radial-gradient(16% 24% at 84% 16%, var(--paper-0), transparent),
    radial-gradient(46% 60% at 14% 22%, var(--paper-0), transparent),
    radial-gradient(60% 46% at 26% 100%, var(--paper-0), transparent);
}

/* Contrastes forcés : les fonds disparaissent, la carte garde un contour. */
@media (forced-colors: active) {
  .material-card {
    background-image: none;
    border: 1px solid CanvasText;
  }
}
</style>
