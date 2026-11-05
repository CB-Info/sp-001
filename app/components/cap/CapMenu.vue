<script setup lang="ts">
import { cap } from '~/data/cap';
import { pauseScroll, resumeScroll } from '~/motion/scroll';
import {
  compteARebours,
  formatHeure,
  jourCourt,
  prochainCours,
  sortSessions,
  useParisClock,
} from '~/utils/cap-time';
import { complexAtR, path } from '~/utils/ecg';

/**
 * Menu plein écran (brief §4.1) : un <dialog> natif ouvert avec showModal(), qui
 * fournit le piège du focus, la touche Échap et l'inertie du reste de la page.
 * Le déclencheur vit dans l'en-tête (CapHeader) ; l'état ouvert est partagé
 * (useState 'cap-menu'), comme le chapitre courant ('cap-section').
 *
 * - La barre du menu se cale sur celle de l'en-tête au moment d'ouvrir : « Fermer »
 *   tombe exactement à la place de « Menu ».
 * - Un lien suivi ferme d'abord le dialog (et rend le défilement), puis la
 *   navigation native vers l'ancre a lieu. Échap ou « Fermer » rendent le focus
 *   au déclencheur.
 * - Sans JS (`enhanced` faux), le dialog s'affiche par :target (#menu) ;
 *   « Fermer » est un lien vers #haut.
 * - Mouvement, en CSS seulement et sous html.has-motion : rideau qui monte du sol
 *   (clip-path, 480 ms, --ease-in-out ; la fermeture en 0,65 × ce temps), puis les
 *   lignes en fondu avec une montée de 12 px, à 60 ms d'écart (@starting-style).
 *   En mouvement réduit, le menu s'ouvre et se ferme d'un coup.
 *
 * La ligne « Prochain cours » suit l'heure de Paris ; le rendu serveur (et le
 * premier rendu client) montrent le premier cours de la semaine.
 */
const MENU_ID = 'menu';
/** Au-delà, l'en-tête montre ses chapitres : un menu resté ouvert se referme. */
const DESKTOP = '(min-width: 64em)';
const NBSP = ' ';
/** Mini-complexe du bouton principal (20 × 14), comme dans l'en-tête ; au repos, la fente est vide. */
const PULSE_BASELINE = 7.2;
const PULSE = path([
  [0, PULSE_BASELINE],
  ...complexAtR(10, PULSE_BASELINE, 6.2),
  [20, PULSE_BASELINE],
]);

const open = useState<boolean>('cap-menu', () => false);
const current = useState<string | null>('cap-section', () => null);
const enhanced = ref(false);
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const clock = useParisClock();

const first = sortSessions(cap.sessions)[0];
const courseName = (slug: string) =>
  cap.courses.find((course) => course.slug === slug)?.nom ?? slug;

/** Prochain cours à Paris ; sans horloge (rendu serveur), le premier de la semaine. */
const next = computed(() => {
  const found = clock.value && prochainCours(cap.sessions, clock.value);
  const session = found ? found.session : first;
  return {
    label: found ? cap.ui.nextLabel : cap.ui.firstLabel,
    when: session ? `${jourCourt(session.day)}${NBSP}${formatHeure(session.start)}` : '',
    course: session ? courseName(session.course) : '',
    countdown: found ? compteARebours(found.inMinutes) : undefined,
  };
});

/** Le défilement de la page s'arrête sous le menu, Lenis compris. */
function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (locked) pauseScroll();
  else resumeScroll();
}

/** La barre du menu reprend la place et la hauteur de celle de l'en-tête (bandeau, compactage). */
function alignBar(el: HTMLDialogElement) {
  const bar = document.querySelector('[data-cap-header-bar]')?.getBoundingClientRect();
  if (!bar) return;
  el.style.setProperty('--menu-bar-top', `${Math.max(0, bar.top)}px`);
  el.style.setProperty('--menu-bar-height', `${bar.height}px`);
}

function show() {
  const el = dialog.value;
  if (!el || el.open) return;
  alignBar(el);
  // Avant showModal() : un dialog encore inerte ne recevrait pas le focus.
  el.inert = false;
  el.showModal();
  lockScroll(true);
}

function hide(reason: 'link' | 'dismiss') {
  const el = dialog.value;
  if (!el?.open) return;
  el.close();
  release(reason);
}

/** Le dialog est fermé : la page est rendue tout de suite, seul le rideau finit de redescendre. */
function release(reason: 'link' | 'dismiss') {
  if (dialog.value) dialog.value.inert = true;
  lockScroll(false);
  open.value = false;
  // L'en-tête est collant : il est déjà à l'écran, la page ne doit pas bouger.
  if (reason === 'dismiss') {
    document.querySelector<HTMLElement>('[data-cap-menu-trigger]')?.focus({ preventScroll: true });
  }
}

// Après le rendu : à l'hydratation, le bouton « Fermer » doit exister avant showModal() (autofocus).
watch(open, (value) => (value ? show() : hide('dismiss')), { flush: 'post' });

/** Échap : on ferme nous-mêmes, pour rendre le focus au déclencheur. */
function onCancel(event: Event) {
  event.preventDefault();
  hide('dismiss');
}

/** Fermeture par le navigateur seul (geste retour) : on resynchronise l'état. */
function onNativeClose() {
  if (open.value) release('dismiss');
}

/** Tout lien interne du menu (chapitres, logo, réservation) ferme avant de naviguer. */
function onClick(event: MouseEvent) {
  if ((event.target as Element).closest('a[href^="#"]')) hide('link');
}

let desktop: MediaQueryList | undefined;
const onDesktop = (event: MediaQueryListEvent) => {
  if (event.matches) hide('link');
};

onMounted(() => {
  enhanced.value = true;
  // Lien #menu suivi avant l'hydratation : on bascule sur le vrai dialog modal.
  if (location.hash === `#${MENU_ID}`) {
    history.replaceState(history.state, '', location.pathname + location.search);
    open.value = true;
  }
  desktop = matchMedia(DESKTOP);
  desktop.addEventListener('change', onDesktop);
});

onBeforeUnmount(() => {
  desktop?.removeEventListener('change', onDesktop);
  if (dialog.value?.open) lockScroll(false);
});
</script>

<template>
  <!--
    Le clic est délégué aux liens qu'il contient : le dialog lui-même n'est pas interactif.
    data-lenis-prevent : Lenis, arrêté sous le menu, laisse la molette au dialog (s'il défile).
  -->
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <dialog
    :id="MENU_ID"
    ref="dialog"
    class="cap-menu"
    data-surface="nuit"
    :aria-label="cap.ui.menuTitle"
    :data-enhanced="enhanced || undefined"
    data-lenis-prevent
    @cancel="onCancel"
    @close="onNativeClose"
    @click="onClick"
  >
    <div class="cap-menu__bar">
      <a class="cap-menu__home" href="#haut" :aria-label="cap.ui.home">
        <CapLogo variant="reduit" decorative />
      </a>
      <!--
        autofocus est le moyen prévu par HTML pour choisir le focus initial d'un dialog :
        il arrive sur « Fermer », à l'endroit même où l'on vient d'appuyer sur « Menu ».
      -->
      <!-- eslint-disable vuejs-accessibility/no-autofocus -->
      <button v-if="enhanced" type="button" class="cap-menu__close" autofocus @click="open = false">
        <span class="cap-menu__close-label">{{ cap.ui.close }}</span>
      </button>
      <!-- eslint-enable vuejs-accessibility/no-autofocus -->
      <a v-else class="cap-menu__close" href="#haut">
        <span class="cap-menu__close-label">{{ cap.ui.close }}</span>
      </a>
    </div>

    <div class="cap-menu__body">
      <nav class="cap-menu__nav">
        <ul role="list" class="cap-menu__list">
          <li
            v-for="(link, index) in cap.nav"
            :key="link.href"
            class="cap-menu__line"
            :style="{ '--i': index }"
          >
            <a
              class="cap-menu__link cap-display"
              :href="link.href"
              :aria-current="current === link.href ? 'true' : undefined"
              >{{ link.label }}</a
            >
          </li>
        </ul>
      </nav>

      <div class="cap-menu__end">
        <p class="cap-menu__line cap-menu__action" :style="{ '--i': cap.nav.length }">
          <a class="cap-button cap-button--l cap-button--fente cap-menu__cta" href="#reserver">
            <span class="cap-button__libelle">
              <svg
                class="cap-button__pulse"
                viewBox="0 0 20 14"
                aria-hidden="true"
                focusable="false"
              >
                <path :d="PULSE" />
              </svg>
              {{ cap.ui.reserve }}
            </span>
          </a>
        </p>

        <p class="cap-menu__line cap-menu__next" :style="{ '--i': cap.nav.length + 1 }">
          <span class="cap-menu__chunk">
            <span class="cap-menu__label">{{ next.label }}</span>
            <span class="cap-menu__dot">·</span>
            <span class="cap-menu__when cap-data">{{ next.when }}</span>
          </span>
          <span class="cap-menu__dot cap-menu__dot--join">·</span>
          <span class="cap-menu__chunk">
            <span class="cap-menu__course">{{ next.course }}</span>
            <template v-if="next.countdown">
              <span class="cap-menu__dot">·</span>
              <span class="cap-menu__countdown">{{ next.countdown }}</span>
            </template>
          </span>
        </p>

        <p class="cap-menu__line cap-menu__note" :style="{ '--i': cap.nav.length + 1 }">
          {{ cap.banner.short }}
          <a class="cap-link" :href="cap.ui.otherDirection.href">{{
            cap.ui.otherDirection.label
          }}</a>
        </p>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.cap-menu {
  position: fixed;
  inset: 0;
  z-index: 60;
  inline-size: 100%;
  block-size: 100%;
  max-inline-size: none;
  max-block-size: none;
  margin: 0;
  padding: 0 env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px)
    env(safe-area-inset-left, 0px);
  border: 0;
  background: var(--cf-noir);
  color: var(--cf-craie);
  grid-template-rows: auto 1fr;
  overflow-x: clip;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* `display` seulement quand il est ouvert : la feuille UA masque le dialog fermé. */
.cap-menu[open],
.cap-menu:not([data-enhanced]):target {
  display: grid;
}

/* Le rideau découvre la page elle-même, pas un voile. */
.cap-menu::backdrop {
  background: transparent;
}

/* Fermé, le dialog reste affiché le temps que le rideau redescende, sans capter le pointeur. */
.cap-menu[data-enhanced]:not([open]) {
  pointer-events: none;
}

/* ── Barre : la place exacte de celle de l'en-tête ──────────────────────── */
.cap-menu__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  block-size: var(--menu-bar-height, var(--header-height));
  margin-block-start: var(--menu-bar-top, 0px);
  padding-inline: max(var(--page-gutter), (100% - var(--content-max)) / 2);
}

.cap-menu__home {
  display: block;
  flex: none;
  inline-size: min(220px, 100% - 64px);
}

.cap-menu__close {
  display: inline-grid;
  align-items: center;
  justify-items: end;
  min-inline-size: 44px;
  min-block-size: 44px;
  margin-inline-end: -2px;
  padding: 0 2px;
  border: 0;
  background: none;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
}

.cap-menu__close-label {
  position: relative;
}

/* Le soulignement citron des liens de l'en-tête, écrit au survol. */
.cap-menu__close-label::after {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% + 3px);
  block-size: 1px;
  background: var(--cf-citron);
  content: '';
  scale: 0 1;
  transform-origin: left center;
}

@media (hover: hover) {
  .cap-menu__close:hover .cap-menu__close-label::after {
    scale: 1 1;
  }
}

/* ── Corps : les chapitres en haut, l'action et les mentions au pouce ─────── */
.cap-menu__body {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 3rem;
  padding: clamp(1.5rem, 6svh, 3.5rem) max(var(--page-gutter), (100% - var(--content-max)) / 2) 2rem;
}

.cap-menu__nav {
  container-type: inline-size;
}

.cap-menu__list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

/*
 * Plein 80 %, 48 px : « Tarifs & infos » mesure 6,65 em ; sous 350 px de large
 * (zoom), la taille suit la colonne au lieu de déborder.
 */
.cap-menu__link {
  display: inline-block;
  color: var(--cf-craie);
  font-size: min(3rem, 100cqi / 6.75);
  font-stretch: 80%;
  line-height: 1;
  letter-spacing: -0.005em;
  text-decoration: none;
  transition: color var(--dur-feedback) var(--ease-out-soft);
}

.cap-menu__link:is(:hover, :focus-visible) {
  color: var(--cf-citron);
}

/* Chapitre courant : le soulignement citron de l'en-tête, à l'échelle de l'affiche. */
.cap-menu__link[aria-current='true'] {
  text-decoration: underline var(--cf-citron);
  text-decoration-thickness: 0.06em;
  text-underline-offset: 0.12em;
}

.cap-menu__end {
  display: grid;
  align-content: end;
  gap: 1.5rem;
}

.cap-menu__action {
  margin: 0;
}

/* Bouton à fente (v2.css), marges de 20 px comme dans l'en-tête. */
.cap-menu__cta {
  --button-pad: 20px;
}

/* Prochain cours : deux lignes sur mobile, une seule dès 48em. */
.cap-menu__next {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 0.4em;
  row-gap: 0.35rem;
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.3;
}

.cap-menu__chunk {
  display: flex;
  flex-basis: 100%;
  align-items: baseline;
  gap: 0.4em;
  white-space: nowrap;
}

.cap-menu__dot--join {
  display: none;
}

.cap-menu__label {
  color: var(--cf-citron);
  font-style: italic;
}

.cap-menu__when {
  font-size: var(--text-data-s);
}

.cap-menu__course {
  font-size: var(--text-ui);
  font-weight: 600;
}

.cap-menu__note {
  margin: 0;
  padding-block-start: 1.5rem;
  border-block-start: 1px solid var(--cf-graphite);
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.cap-menu__note .cap-link {
  display: inline-block;
  padding-block: 4px;
  color: var(--cf-craie);
}

@media (min-width: 48em) {
  .cap-menu__chunk {
    flex-basis: auto;
  }

  .cap-menu__dot--join {
    display: inline;
  }
}

/* ── Mouvement : rideau, puis les lignes (uniquement sous html.has-motion) ── */
html.has-motion .cap-menu[data-enhanced] {
  --menu-exit: calc(var(--dur-overlay) * 0.65);

  clip-path: inset(100% 0 0 0);
  transition:
    clip-path var(--menu-exit) var(--ease-in-out),
    display var(--menu-exit) allow-discrete,
    overlay var(--menu-exit) allow-discrete;
}

html.has-motion .cap-menu[data-enhanced][open] {
  clip-path: inset(0);
  transition-duration: var(--dur-overlay);
}

/* Les lignes partent quand le rideau a passé le tiers de l'écran, du haut vers le bas. */
html.has-motion .cap-menu[data-enhanced][open] .cap-menu__line {
  transition:
    opacity var(--dur-layout) var(--ease-out),
    translate var(--dur-layout) var(--ease-out);
  transition-delay: calc(var(--dur-overlay) * 0.4 + min(var(--i), 5) * var(--stagger-list));
}

@starting-style {
  html.has-motion .cap-menu[data-enhanced][open] {
    clip-path: inset(100% 0 0 0);
  }

  html.has-motion .cap-menu[data-enhanced][open] .cap-menu__line {
    opacity: 0;
    translate: 0 var(--move-s);
  }
}

@media (forced-colors: active) {
  .cap-menu {
    border: 1px solid CanvasText;
  }

  .cap-menu__close-label::after {
    background: CanvasText;
    forced-color-adjust: none;
  }
}
</style>
