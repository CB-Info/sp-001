<script setup lang="ts">
/**
 * Rangée de l'en-tête : wordmark à gauche ; déclencheur (slot) et tuile téléphone
 * à droite. Partagée par l'en-tête de page et par le menu, pour que le bouton
 * « Fermer » du dialog tombe exactement à la place de « Menu ».
 */
</script>

<template>
  <div class="header-bar container">
    <a class="header-bar__home" href="#haut" aria-label="CLUSEM, retour en haut">
      <Wordmark />
    </a>
    <div class="header-bar__actions">
      <slot />
      <IconButton
        class="header-bar__contact"
        icon="phone"
        label="Contacter CLUSEM"
        href="#contact"
        variant="white"
        size="sm"
      />
    </div>
  </div>
</template>

<style scoped>
.header-bar {
  /* mesuré : rangée centrée à y = 43 @1440 (barre de 86) ; barre de 64 en mobile (a7 §3.1) */
  --header-bar: clamp(4rem, 3.489rem + 2.095vw, 5.375rem);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
  min-block-size: var(--header-bar);
}

.header-bar__home {
  display: inline-flex;
  align-items: center;
  min-block-size: 2.75rem;
  font-size: var(--text-logo);
  color: var(--ink);
  text-decoration: none;
}

.header-bar__actions {
  display: flex;
  align-items: center;
  /* mesuré : 47 px du libellé MENU à la tuile, moins l'écart réservé à « Fermer » */
  gap: clamp(1rem, 0.6rem + 1vw, 1.875rem);
}

/* La marge basse de la plaque arrière est compensée : la tuile reste centrée sur la rangée. */
.header-bar__contact {
  margin-block-start: var(--step-sm-b);
}

/* Le combiné sonne une fois au survol (oscillation de ± 8°, a4 §2.2). */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .header-bar__contact:hover :deep(.icon) {
    animation: ring var(--dur-layout) var(--ease-out-soft);
  }
}

@keyframes ring {
  20%,
  60% {
    rotate: -8deg;
  }

  40%,
  80% {
    rotate: 8deg;
  }
}
</style>
