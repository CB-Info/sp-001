<script setup lang="ts">
/**
 * Panneau du footer : une rangée d'en-tête (le titre est un lien qui la couvre
 * entièrement), puis un corps optionnel calé en bas.
 *
 * L'en-tête se remplit de rouge depuis la gauche au survol et au focus, puis se
 * rétracte vers la droite en sortie : c'est l'état figé de « Back To Home » dans
 * la référence, rendu interactif. Le panneau mis en avant (`featured`) porte ce
 * rouge au repos, et son survol le fonce d'un ton (même geste).
 *
 * Filets partagés, jamais doublés : le panneau trace son filet du haut et son
 * filet de droite, la liste parente ferme la gauche et le bas. Le filet du haut est
 * un trait (::before) et non une bordure, pour pouvoir se tracer à l'entrée
 * (`--rule-trace`, `--rule-heat` : FooterPanels).
 * `--panel-active` (0 → 1 quand l'en-tête est survolé ou focalisé) est exposé au
 * contenu du corps, qui peut y répondre (cran de l'astérisque).
 */
withDefaults(
  defineProps<{
    title: string;
    href: string;
    featured?: boolean;
    /** Sens de la flèche d'affordance : « up » pour un retour en haut de page. */
    arrow?: 'right' | 'up';
  }>(),
  { featured: false, arrow: 'right' },
);
</script>

<template>
  <li
    class="footer-panel"
    :class="{ 'footer-panel--featured': featured }"
    data-motion="footer-panel"
  >
    <a :href="href" class="footer-panel__head" data-motion="footer-panel-head">
      <span class="footer-panel__title" data-motion="footer-panel-title">{{ title }}</span>
      <Icon
        name="arrow-right"
        size="1.25rem"
        class="footer-panel__arrow"
        :class="`footer-panel__arrow--${arrow}`"
      />
    </a>
    <div v-if="$slots.default" class="footer-panel__body">
      <slot />
    </div>
  </li>
</template>

<style scoped>
.footer-panel {
  /* Filets fournis par le footer (--footer-rule), sinon ceux de la matière. */
  --panel-rule: var(--footer-rule, var(--rule));
  --head-fill: var(--accent-fill);
  /* Filet du haut : part tracée depuis la gauche, chaleur de sa pointe (au repos : 1 et 0). */
  --rule-trace: 1;
  --rule-heat: 0;

  position: relative;
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  /* La rangée du filet du haut, que trace ::before. */
  padding-block-start: 1px;
  border-inline-end: 1px solid var(--panel-rule);
}

/* Tracé depuis la gauche ; tant qu'il file, sa pointe est rouge (même geste que Programmes). */
.footer-panel::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-start: 0;
  block-size: 1px;
  background: linear-gradient(
      to right,
      transparent 55%,
      color-mix(in srgb, var(--red-500) calc(var(--rule-heat) * 100%), transparent)
    )
    var(--panel-rule);
  scale: var(--rule-trace) 1;
  transform-origin: 0 0;
  pointer-events: none;
}

.footer-panel:has(> .footer-panel__head:focus-visible) {
  --panel-active: 1;
}

/* ── En-tête : rangée de 62 px fermée par un filet (mesuré) ─────────────── */
.footer-panel__head {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  min-block-size: 3.875rem;
  padding-block: var(--space-12);
  padding-inline: var(--gap);
  border-block-end: 1px solid var(--panel-rule);
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
  text-decoration: none;
}

/* Le remplissage : se trace depuis la gauche, se rétracte vers la droite. */
.footer-panel__head::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--head-fill);
  scale: 0 1;
  transform-origin: right center;
  transition: scale var(--dur-feedback) var(--ease-in);
}

.footer-panel--featured .footer-panel__head {
  --head-fill: var(--accent-fill-hover);

  background: var(--accent-fill);
}

.footer-panel__head:focus-visible {
  outline-offset: -6px;
}

.footer-panel__head:is(:focus-visible, :active)::before {
  scale: 1 1;
  transform-origin: left center;
  transition: scale var(--dur-state) var(--ease-out);
}

/*
 * Flèche d'affordance : visible au repos sur un écran tactile (rien ne dépend du
 * survol), elle glisse d'un pas de gradin (12 px) au survol avec un pointeur fin.
 */
.footer-panel__arrow {
  --arrow-from: calc(var(--step-md-x) * -1) 0;

  transition:
    translate var(--dur-state) var(--ease-out),
    opacity var(--dur-feedback) var(--ease-out-soft);
}

.footer-panel__arrow--up {
  --arrow-from: 0 var(--step-md-x);

  rotate: -90deg;
}

@media (hover: hover) and (pointer: fine) {
  .footer-panel:has(> .footer-panel__head:hover) {
    --panel-active: 1;
  }

  .footer-panel__arrow {
    opacity: 0;
    translate: var(--arrow-from);
  }

  .footer-panel__head:hover::before {
    scale: 1 1;
    transform-origin: left center;
    transition: scale var(--dur-state) var(--ease-out);
  }

  .footer-panel__head:is(:hover, :focus-visible) .footer-panel__arrow {
    opacity: 1;
    translate: 0 0;
  }
}

/* ── Corps : contenu calé en bas à gauche ───────────────────────────────── */
.footer-panel__body {
  position: relative;
  isolation: isolate;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--gap);
  min-block-size: 6.25rem;
  padding: var(--gap);
}

/*
 * Voile local : le corps peut passer sur la photo (panneau central). À 65 % de noir
 * sur la moitié basse, le texte secondaire tient 4,5:1 même sur un blanc pur.
 */
.footer-panel__body::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--black) 65%, transparent) 0 55%,
    transparent
  );
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .footer-panel__head::before,
  .footer-panel__head:is(:hover, :focus-visible, :active)::before,
  .footer-panel__arrow {
    transition: none;
  }

  .footer-panel__arrow {
    translate: 0 0;
  }
}

@media (forced-colors: active) {
  .footer-panel::before {
    forced-color-adjust: none;
    background: CanvasText;
  }

  .footer-panel__head::before {
    display: none;
  }
}
</style>
