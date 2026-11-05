<script setup lang="ts">
/**
 * Une donnée que le club doit encore fournir, présentée discrètement : jamais
 * soulignée (elle ne doit pas ressembler à un lien), en gris.
 *
 * - Par défaut, le texte (« Créneaux à confirmer », « À confirmer avec le
 *   club. ») ;
 * - `dash` : une valeur seule (adresse, téléphone, prix, horaires) s'écrit « — »,
 *   et le texte est lu par les lecteurs d'écran. Une seule note par chapitre dit
 *   ce que signifie le tiret (brief §8).
 *
 * La liste complète reste au pied de page (« Ce qui reste à confirmer par le
 * club »). Style : `.cap-pending` dans app/assets/css/v2.css.
 */
withDefaults(defineProps<{ text?: string; dash?: boolean }>(), {
  text: 'à confirmer',
  dash: false,
});
</script>

<template>
  <span v-if="dash" class="cap-pending cap-pending--dash"
    ><span aria-hidden="true">—</span><span class="visually-hidden">{{ text }}</span></span
  >
  <span v-else class="cap-pending">{{ text }}</span>
</template>
