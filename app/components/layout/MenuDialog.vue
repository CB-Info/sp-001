<script setup lang="ts">
import type { HomeContent, NavLink } from '~/types/content';

/**
 * Menu plein écran : un <dialog> natif ouvert avec showModal(), qui fournit le
 * piège de focus, la touche Échap et l'inertie du reste de la page.
 *
 * - Le bouton « Fermer » reprend la rangée de l'en-tête (HeaderBar) : il tombe
 *   exactement à la place de « Menu ».
 * - Un lien suivi ferme d'abord le dialog (synchroniquement), puis la navigation
 *   native vers l'ancre a lieu.
 * - Sans JS (`enhanced` faux), le dialog s'affiche par :target (#menu) et se
 *   referme dès qu'un lien change la cible.
 */
const props = defineProps<{
  id: string;
  nav: NavLink[];
  socials: HomeContent['footer']['socials'];
  note: string;
  enhanced: boolean;
}>();

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  /** `link` : fermé par un lien suivi ; `dismiss` : par Échap ou « Fermer ». */
  closed: [reason: 'link' | 'dismiss'];
}>();

const dialog = useTemplateRef<HTMLDialogElement>('dialog');

const items = computed(() =>
  props.nav.map((link, index) => ({ ...link, index: String(index + 1).padStart(2, '0') })),
);

function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

function show() {
  const el = dialog.value;
  if (!el || el.open) return;
  el.showModal();
  lockScroll(true);
}

function hide(reason: 'link' | 'dismiss') {
  const el = dialog.value;
  if (!el?.open) return;
  el.close();
  lockScroll(false);
  open.value = false;
  emit('closed', reason);
}

// Après le rendu : à l'hydratation, le bouton « Fermer » doit exister avant showModal() (autofocus).
watch(open, (value) => (value ? show() : hide('dismiss')), { flush: 'post' });

/** Échap : le dialog est déjà fermé par le navigateur, on resynchronise l'état. */
function onNativeClose() {
  if (!open.value) return;
  lockScroll(false);
  open.value = false;
  emit('closed', 'dismiss');
}

/** Tout lien interne du menu (sections, logo, téléphone) ferme avant de naviguer. */
function onClick(event: MouseEvent) {
  const link = (event.target as Element).closest('a[href^="#"]');
  if (link) hide('link');
}

onBeforeUnmount(() => lockScroll(false));
</script>

<template>
  <!-- Le clic est délégué aux liens qu'il contient : le dialog lui-même n'est pas interactif. -->
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <dialog
    :id="id"
    ref="dialog"
    class="menu"
    data-surface="hot"
    data-motion="menu-panel"
    aria-label="Menu principal"
    :data-enhanced="enhanced || undefined"
    @close="onNativeClose"
    @click="onClick"
  >
    <span class="menu__rule menu__rule--start" aria-hidden="true" />
    <span class="menu__rule menu__rule--end" aria-hidden="true" />

    <HeaderBar>
      <!--
        autofocus est le moyen prévu par HTML pour choisir le focus initial d'un dialog :
        il arrive sur « Fermer », à l'endroit même où l'on vient d'appuyer sur « Menu ».
      -->
      <!-- eslint-disable vuejs-accessibility/no-autofocus -->
      <MenuTrigger
        cross
        closes
        autofocus
        :href="enhanced ? undefined : '#haut'"
        aria-label="Fermer le menu"
        @click="open = false"
      />
      <!-- eslint-enable vuejs-accessibility/no-autofocus -->
    </HeaderBar>

    <div class="menu__body container">
      <CrosshairRow class="menu__marks" />

      <nav class="menu__nav" aria-label="Sections de la page">
        <ol class="menu__list">
          <li v-for="item in items" :key="item.href" class="menu__item" data-motion="menu-link">
            <a class="menu__link" :href="item.href">
              <span class="menu__index" aria-hidden="true">{{ item.index }}</span>
              <span class="menu__label">{{ item.label }}</span>
              <span class="menu__figure" aria-hidden="true">{{ item.index }}</span>
            </a>
          </li>
        </ol>
        <Asterisk class="menu__mark" size="var(--menu-mark)" />
      </nav>

      <div class="menu__footer">
        <p class="menu__note">{{ note }}</p>
        <ul class="menu__socials" aria-label="Réseaux sociaux">
          <li v-for="social in socials" :key="social.icon">
            <IconButton
              :icon="social.icon"
              :label="social.label"
              :href="social.href"
              variant="grey"
              size="sm"
            />
          </li>
        </ul>
      </div>
    </div>

    <RuledGrid class="menu__strip" variant="strip" />
  </dialog>
</template>

<style scoped>
.menu {
  /* Index mono réservé à gauche des liens, puis taille d'affichage. */
  --menu-index: 2.25rem;
  /*
   * Spécifiée : clamp(2.5rem, 8vw, 4.5rem). Bornée par la largeur réelle
   * (« TRANSFORMATIONS » ≈ 9,6em plaque comprise) et par la hauteur : les six
   * liens et le reste du menu (≈ 23rem) tiennent dans la fenêtre.
   */
  --menu-link: min(
    clamp(2.5rem, 8vw, 4.5rem),
    (100cqi - var(--menu-index) - var(--space-12)) / 9.6,
    max((100svh - 23rem) / 7.4, 2rem)
  );

  position: fixed;
  inset: 0;
  z-index: 100;
  inline-size: 100%;
  block-size: 100%;
  max-inline-size: none;
  max-block-size: none;
  margin: 0;
  padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px)
    env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
  border: 0;
  grid-template-rows: auto 1fr auto;
  overflow-x: clip;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* `display` seulement quand il est ouvert : la feuille UA masque le dialog fermé. */
.menu[open],
.menu:not([data-enhanced]):target {
  display: grid;
}

.menu::backdrop {
  background: transparent;
}

/* Cadre de filets à --frame-inset des bords, comme dans le hero. */
.menu__rule {
  position: absolute;
  inset-block: 0;
  inline-size: 1px;
  background: var(--rule);
  pointer-events: none;
}

.menu__rule--start {
  inset-inline-start: var(--frame-inset);
}

.menu__rule--end {
  inset-inline-end: var(--frame-inset);
}

.menu__body {
  display: grid;
  align-content: center;
  gap: var(--space-32);
  padding-block: var(--space-16) var(--space-32);
}

.menu__nav {
  container-type: inline-size;
}

.menu__list {
  display: grid;
  gap: clamp(0.25rem, 1.2svh, 0.875rem);
  padding: 0;
  list-style: none;
}

.menu__link {
  display: inline-grid;
  grid-template-columns: var(--menu-index) auto;
  align-items: start;
  column-gap: var(--space-12);
  color: var(--ink);
  text-decoration: none;
  outline-offset: 6px;
  -webkit-tap-highlight-color: transparent;
}

.menu__index {
  /* Haut des capitales aligné : 0,21em sous le haut du libellé (Tektur, plaque comprise),
     0,18em sous le haut de l'index (IBM Plex Mono). */
  padding-block-start: calc(var(--menu-link) * 0.21 - 0.18em);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  line-height: 1;
  color: var(--ink-muted);
  transition: color var(--dur-feedback) var(--ease-out-soft);
}

/*
 * Libellé et plaque à gradin rouge : deux plaques de même couleur (avant, et
 * arrière décalée de --step-md-*), dépliées de gauche à droite au survol.
 */
.menu__label {
  position: relative;
  isolation: isolate;
  padding: 0.06em 0.12em;
  font-family: var(--font-display);
  font-size: var(--menu-link);
  font-weight: 600;
  line-height: 1;
  letter-spacing: var(--tracking-heading);
  text-transform: uppercase;
  transition: translate var(--dur-state) var(--ease-out);
}

.menu__label::before,
.menu__label::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--accent-fill);
  transform-origin: left center;
  scale: 0 1;
  transition: scale var(--dur-state) var(--ease-out);
}

.menu__label::before {
  block-size: calc(100% + var(--step-md-b) - var(--step-md-t));
  translate: var(--step-md-x) var(--step-md-t);
  transition-delay: 40ms;
}

.menu__link:focus-visible .menu__label,
.menu__link:active .menu__label {
  translate: var(--step-md-x) 0;
}

.menu__link:focus-visible .menu__label::before,
.menu__link:focus-visible .menu__label::after,
.menu__link:active .menu__label::before,
.menu__link:active .menu__label::after {
  scale: 1 1;
}

.menu__link:focus-visible .menu__index,
.menu__link:active .menu__index {
  color: var(--ink);
}

@media (hover: hover) and (pointer: fine) {
  .menu__link:hover .menu__label {
    translate: var(--step-md-x) 0;
  }

  .menu__link:hover .menu__label::before,
  .menu__link:hover .menu__label::after {
    scale: 1 1;
  }

  .menu__link:hover .menu__index {
    color: var(--ink);
  }
}

/*
 * Chiffre-affiche du lien survolé ou focalisé, avec l'astérisque qui avance d'un
 * cran de 45° et passe au rouge : le « 01✱ » des services, rejoué dans le menu.
 * Décoratif, à partir de 80em seulement (place libre à droite des liens).
 */
.menu__figure,
.menu__nav > .menu__mark {
  display: none;
}

.menu__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-24);
}

.menu__note {
  max-inline-size: 46ch;
  font-size: var(--text-micro);
  line-height: 1.5;
  color: var(--ink-muted);
}

.menu__socials {
  display: flex;
  gap: var(--space-12);
  padding: 0;
  list-style: none;
}

.menu__strip {
  align-self: end;
}

@media (width >= 80em) {
  .menu__nav {
    --menu-figure: min(var(--text-figure), 22svh);
    --menu-mark: calc(
      var(--menu-figure) * 0.41
    ); /* mesuré : astérisque de 74 px pour des chiffres de 180 */

    position: relative;
  }

  .menu__figure {
    display: block;
    position: absolute;
    inset-inline-end: calc(var(--menu-mark) * 0.62);
    inset-block-end: calc(var(--menu-mark) * 0.28);
    font-family: var(--font-display);
    font-size: var(--menu-figure);
    font-weight: 500;
    line-height: 0.72;
    letter-spacing: -0.03em;
    color: var(--ink);
    opacity: 0;
    translate: calc(var(--step-lg-x) * -2) 0;
    transition:
      opacity var(--dur-feedback) var(--ease-out-soft),
      translate var(--dur-state) var(--ease-out);
    pointer-events: none;
  }

  .menu__link:focus-visible .menu__figure {
    opacity: 1;
    translate: 0 0;
  }

  .menu__nav > .menu__mark {
    --accent: var(--ink);

    display: block;
    position: absolute;
    inset-inline-end: 0;
    inset-block-end: 0;
    /* Le cran de l'astérisque (Asterisk.vue) et le passage au rouge. */
    transition:
      rotate 220ms var(--ease-strike),
      fill var(--dur-feedback) var(--ease-out-soft);
  }

  .menu__nav:has(.menu__link:focus-visible) .menu__mark {
    --ratchet: 1;
    --accent: var(--red-500);
  }
}

@media (width >= 80em) and (hover: hover) and (pointer: fine) {
  .menu__link:hover .menu__figure {
    opacity: 1;
    translate: 0 0;
  }

  .menu__nav:has(.menu__link:hover) .menu__mark {
    --ratchet: 1;
    --accent: var(--red-500);
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu__figure {
    translate: none;
    transition: none;
  }

  .menu__label,
  .menu__label::before,
  .menu__label::after,
  .menu__index {
    transition: none;
  }

  .menu__link:is(:hover, :focus-visible, :active) .menu__label {
    translate: none;
  }
}

@media (forced-colors: active) {
  .menu__label::before,
  .menu__label::after {
    display: none;
  }

  .menu__link:is(:hover, :focus-visible) .menu__label {
    text-decoration: underline;
  }
}
</style>
