<script setup lang="ts">
import type { HomeContent, NavLink } from '~/types/content';
import { home } from '~/data/home';

/**
 * En-tête posé sur le hero (absolu, pas encore collant) et menu plein écran.
 *
 * Amélioration progressive : rendu serveur, MENU est un lien vers #menu (le
 * menu s'ouvre alors par :target, sans JS) ; une fois l'app montée, c'est un
 * bouton aria-expanded qui ouvre le <dialog> en modal.
 *
 * `socials` et `note` viennent par défaut du pied de page : les pages ne passent
 * encore que `nav` (voir le rapport, « Demandes »).
 */
withDefaults(
  defineProps<{
    nav: NavLink[];
    socials?: HomeContent['footer']['socials'];
    note?: string;
  }>(),
  {
    socials: () => home.footer.socials,
    note: home.footer.disclaimer,
  },
);

const menuId = 'menu';
const open = ref(false);
const enhanced = ref(false);
const trigger = useTemplateRef<{ focus: () => void }>('trigger');

onMounted(() => {
  enhanced.value = true;
  // Lien #menu suivi avant l'hydratation : on bascule sur le vrai dialog modal.
  if (location.hash === `#${menuId}`) {
    history.replaceState(history.state, '', location.pathname + location.search);
    open.value = true;
  }
});

/** Échap ou « Fermer » : le focus revient sur le déclencheur. */
function onClosed(reason: 'link' | 'dismiss') {
  if (reason === 'dismiss') trigger.value?.focus();
}
</script>

<template>
  <header class="site-header" data-surface="hot">
    <HeaderBar>
      <MenuTrigger
        ref="trigger"
        :cross="open"
        :href="enhanced ? undefined : `#${menuId}`"
        :aria-expanded="enhanced ? open : undefined"
        :aria-controls="enhanced ? menuId : undefined"
        @click="open = true"
      />
    </HeaderBar>
  </header>
  <MenuDialog
    :id="menuId"
    v-model:open="open"
    :nav="nav"
    :socials="socials"
    :note="note"
    :enhanced="enhanced"
    @closed="onClosed"
  />
</template>

<style scoped>
.site-header {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 10;
  padding-block-start: env(safe-area-inset-top, 0px);
  padding-inline: env(safe-area-inset-left, 0px) env(safe-area-inset-right, 0px);
  /* La surface « hot » fournit l'encre et le focus blancs, pas de fond : l'en-tête est posé sur la photo. */
  background-color: transparent;
}
</style>
