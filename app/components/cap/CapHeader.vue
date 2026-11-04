<script setup lang="ts">
import { cap } from '~/data/cap';
import { complexAtR, path } from '~/utils/ecg';

/**
 * En-tête collant (brief §4.1) : logo réduit, quatre chapitres, « Réserve ta
 * place » sur ordinateur ; logo et bouton « Menu » sous 64em.
 *
 * - Transparent sur la couverture, qui remonte sous lui (-72 px) ; au-delà de
 *   120 px de défilement, il se compacte (72 → 56 px) et un volet noir opaque
 *   descend derrière lui, filet graphite au bas. Jamais de flou ni de transparence
 *   une fois posé. La boîte collante garde ses 72 px : la page ne bouge pas d'un
 *   pixel quand la barre se resserre.
 * - Passage de témoin : le bouton reste secondaire (filet craie) tant qu'un
 *   bouton citron est déjà à l'écran (couverture, #reserver, #fin), sinon il
 *   devient principal. Jamais deux aplats citron d'action à l'écran.
 * - Le chapitre qui coupe la ligne médiane de l'écran est souligné en citron
 *   (2 px) et porte aria-current ; l'état est partagé avec le menu.
 * - Le focus n'est jamais masqué par l'en-tête (critère 2.4.11) : un élément
 *   focalisé qui passerait dessous est ramené 16 px sous lui. Pas de
 *   scroll-padding sur la racine : Chrome recentre alors tout élément collant
 *   focalisé, et la page sauterait de 400 px à chaque retour dans l'en-tête.
 *   Pour la même raison, rien dans l'en-tête ne porte d'id (v2.css donne
 *   88 px de scroll-margin à tout [id]) : le déclencheur est repéré par
 *   [data-cap-menu-trigger].
 *
 * Amélioration progressive : sans JS, l'en-tête n'est pas collant (rien ne peut
 * masquer le focus), « Menu » est un lien vers #menu (le menu s'ouvre par
 * :target) et le bouton reste secondaire. Une fois l'app montée, « Menu » devient
 * un bouton qui ouvre le <dialog>.
 */

/** Repères qui portent déjà un bouton citron : tant qu'ils sont à l'écran, celui-ci s'efface. */
const RELAYS = '[data-cover-cta], #reserver, #fin';
const MENU_ID = 'menu';
/** Marge laissée sous l'en-tête à un élément focalisé qu'il aurait masqué (px). */
const FOCUS_CLEARANCE = 16;

/** Mini-complexe du bouton principal (20 × 14) : le tracé du logo, écrit au survol. */
const PULSE_BASELINE = 7.2;
const PULSE = path([
  [0, PULSE_BASELINE],
  ...complexAtR(10, PULSE_BASELINE, 6.2),
  [20, PULSE_BASELINE],
]);
/** Au repos, la fente porte la ligne plate (« se poser ») : même dessin que la couverture. */
const PULSE_REST = `M0 ${PULSE_BASELINE}H20`;

const open = useState<boolean>('cap-menu', () => false);
const current = useState<string | null>('cap-section', () => null);
const enhanced = ref(false);
const compact = ref(false);
/** Secondaire par défaut : c'est l'état sans JS et celui du haut de page. */
const relayed = ref(true);

const threshold = useTemplateRef<HTMLElement>('threshold');
const bar = useTemplateRef<HTMLElement>('bar');
const observers: IntersectionObserver[] = [];

function observe(
  targets: Element[],
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) {
  if (!targets.length) return;
  const observer = new IntersectionObserver(callback, options);
  for (const target of targets) observer.observe(target);
  observers.push(observer);
}

/** Un élément fixe (lien d'évitement, barre mobile) ne bouge pas quand la page défile. */
function isFixed(element: Element) {
  for (let node: Element | null = element; node; node = node.parentElement) {
    if (getComputedStyle(node).position === 'fixed') return true;
  }
  return false;
}

/**
 * Le navigateur a déjà amené l'élément focalisé dans la fenêtre ; s'il est sous
 * l'en-tête, on le redescend. L'en-tête lui-même, le menu (modal) et les
 * éléments fixes sont laissés où ils sont.
 */
function onFocusIn(event: FocusEvent) {
  const target = event.target;
  const edge = bar.value?.getBoundingClientRect().bottom;
  if (!(target instanceof Element) || edge === undefined) return;
  // Focus clavier seulement : un clic souris ne fait jamais défiler la page.
  if (!target.matches(':focus-visible')) return;
  if (bar.value?.contains(target) || target.closest('dialog')) return;
  const { top } = target.getBoundingClientRect();
  if (top >= edge || isFixed(target)) return;
  scrollBy({ top: top - edge - FOCUS_CLEARANCE, behavior: 'instant' });
}

onMounted(() => {
  enhanced.value = true;
  document.addEventListener('focusin', onFocusIn);

  // Sentinelle des 120 premiers pixels : sortie de l'écran, l'en-tête se compacte.
  if (threshold.value) {
    observe([threshold.value], ([entry]) => (compact.value = !entry?.isIntersecting));
  }

  // Passage de témoin du bouton.
  const relays = [...document.querySelectorAll(RELAYS)];
  const onScreen = new Set<Element>();
  // Aucun repère dans la page : rien ne prend le relais, le bouton est principal.
  if (!relays.length) relayed.value = false;
  observe(relays, (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    }
    relayed.value = onScreen.size > 0;
  });

  // Chapitre courant : celui qui coupe la ligne médiane de l'écran. Les chapitres
  // se suivent : au plus deux se touchent sur la ligne, le plus bas l'emporte.
  const sections = cap.nav
    .map((link) => document.getElementById(link.href.slice(1)))
    .filter((section): section is HTMLElement => section !== null);
  const crossing = new Set<string>();
  observe(
    sections,
    (entries) => {
      for (const entry of entries) {
        const href = `#${entry.target.id}`;
        if (entry.isIntersecting) crossing.add(href);
        else crossing.delete(href);
      }
      current.value = cap.nav.findLast((link) => crossing.has(link.href))?.href ?? null;
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
});

onBeforeUnmount(() => {
  document.removeEventListener('focusin', onFocusIn);
  for (const observer of observers) observer.disconnect();
});
</script>

<template>
  <div ref="threshold" class="cap-header__threshold" aria-hidden="true" />
  <header class="cap-header" :class="{ 'is-compact': compact }">
    <div ref="bar" class="cap-header__bar" data-cap-header-bar>
      <a class="cap-header__home" href="#haut" :aria-label="cap.ui.home">
        <CapLogo variant="reduit" decorative />
      </a>

      <nav class="cap-header__nav">
        <ul role="list" class="cap-header__list">
          <li v-for="link in cap.nav" :key="link.href">
            <a
              class="cap-header__link"
              :href="link.href"
              :aria-current="current === link.href ? 'true' : undefined"
            >
              <span class="cap-header__label">{{ link.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <a
        class="cap-button cap-header__cta"
        :class="{ 'cap-button--secondaire': relayed }"
        href="#reserver"
      >
        <svg class="cap-button__pulse" viewBox="0 0 20 14" aria-hidden="true" focusable="false">
          <path :d="PULSE" />
        </svg>
        <svg class="cap-header__rest" viewBox="0 0 20 14" aria-hidden="true" focusable="false">
          <path :d="PULSE_REST" />
        </svg>
        {{ cap.ui.reserve }}
      </a>

      <!-- Les deux libellés partagent une cellule : la largeur ne change pas entre « Menu » et « Fermer ». -->
      <button
        v-if="enhanced"
        data-cap-menu-trigger
        type="button"
        class="cap-header__menu"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-controls="MENU_ID"
        @click="open = true"
      >
        <span class="cap-header__label" :class="{ 'is-away': open }">{{ cap.ui.menu }}</span>
        <span class="cap-header__label" :class="{ 'is-away': !open }">{{ cap.ui.close }}</span>
      </button>
      <a v-else class="cap-header__menu" :href="`#${MENU_ID}`">
        <span class="cap-header__label">{{ cap.ui.menu }}</span>
        <span class="cap-header__label is-away">{{ cap.ui.close }}</span>
      </a>
    </div>
  </header>
</template>

<style scoped>
/* Sentinelle : les 120 premiers pixels du document (au-delà, l'en-tête se compacte). */
.cap-header__threshold {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 1px;
  block-size: 121px;
  visibility: hidden;
  pointer-events: none;
}

/*
 * La boîte collante garde 72 px : la couverture glisse dessous (-72 px) et rien
 * ne se décale quand la barre passe à 56 px. Seule la barre capte le pointeur.
 */
.cap-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 30;
  block-size: var(--header-height);
  color: var(--cf-craie);
  pointer-events: none;
}

.cap-header__bar {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap);
  block-size: var(--header-height);
  padding-inline: max(var(--page-gutter), (100% - var(--content-max)) / 2);
  pointer-events: auto;
}

/* Volet : noir opaque et filet graphite, qui descend du haut (jamais un fondu). */
.cap-header__bar::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-block-end: 1px solid var(--cf-graphite);
  background: var(--cf-noir);
  clip-path: inset(0 0 100% 0);
  content: '';
}

.is-compact .cap-header__bar {
  block-size: var(--header-height-compact);
}

.is-compact .cap-header__bar::before {
  clip-path: inset(0);
}

html.has-motion .cap-header__bar {
  transition: block-size var(--dur-state) var(--ease-out-soft);
}

html.has-motion .cap-header__bar::before {
  transition: clip-path var(--dur-state) var(--ease-out-soft);
}

/* Sans JS : posé sur la couverture, il défile avec elle (rien ne masque le focus). */
html:not(.js) .cap-header {
  position: relative;
}

.cap-header__home {
  display: block;
  flex: none;
  inline-size: 180px;
}

/* ── Chapitres et bouton : ordinateur seulement ─────────────────────────── */
.cap-header__nav,
.cap-header__cta {
  display: none;
}

.cap-header__list {
  display: flex;
  gap: 32px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cap-header__link,
.cap-header__menu {
  display: inline-grid;
  align-items: center;
  min-block-size: 44px;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
}

/* Soulignement citron écrit de gauche à droite : 1 px au survol, 2 px pour le chapitre courant. */
.cap-header__label {
  position: relative;
}

.cap-header__label::after {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% + 3px);
  block-size: 1px;
  background: var(--cf-citron);
  content: '';
  scale: 0 1;
  transform-origin: left center;
}

.cap-header__link[aria-current='true'] .cap-header__label::after {
  block-size: 2px;
  scale: 1 1;
}

@media (hover: hover) {
  :is(.cap-header__link, .cap-header__menu):hover .cap-header__label::after {
    scale: 1 1;
  }
}

html.has-motion .cap-header__label::after {
  transition: scale var(--dur-state) var(--ease-out-soft);
}

/* ── « Menu » / « Fermer » : une cellule de largeur fixe ─────────────────── */
.cap-header__menu {
  justify-items: end;
  min-inline-size: 44px;
  margin-inline-end: -2px;
  padding: 0 2px;
  border: 0;
  background: none;
  cursor: pointer;
}

.cap-header__menu > .cap-header__label {
  grid-area: 1 / 1;
}

.cap-header__menu > .is-away {
  visibility: hidden;
}

@media (min-width: 64em) {
  /*
   * Grille de la page : le logo en colonne 1, les chapitres ferrés à droite sur la
   * fin de la colonne 10 (le bord droit du titre de la couverture), le bouton sur
   * les colonnes 11 et 12 (il les déborde vers la gauche s'il est plus large).
   */
  .cap-header__bar {
    --col: calc((100% - 11 * var(--gap)) / 12);

    display: grid;
    grid-template-columns: 1fr auto minmax(calc(2 * var(--col) + var(--gap)), max-content);
    column-gap: var(--gap);
  }

  .cap-header__home {
    inline-size: 200px;
  }

  .cap-header__nav {
    display: block;
  }

  .cap-header__cta {
    display: inline-flex;
    justify-self: end;
  }

  .cap-header__menu {
    display: none;
  }
}

/* Fente du mini-complexe : la ligne plate au repos, effacée quand le complexe s'écrit. */
.cap-header__cta {
  padding-inline: 20px;
}

.cap-header__rest {
  position: absolute;
  inset-block-start: calc(50% - 7px);
  inset-inline-start: 20px;
  inline-size: 20px;
  block-size: 14px;
  fill: none;
  stroke: currentcolor;
  stroke-width: 1.5;
  clip-path: inset(0);
  transition: clip-path 160ms var(--ease-in);
}

.cap-header__cta:is(:hover, :focus-visible) .cap-header__rest {
  clip-path: inset(0 0 0 100%);
  transition: clip-path var(--dur-state) var(--ease-trace);
}

html:not(.has-motion) .cap-header__rest {
  transition: none;
}

/* Passage de témoin en 240 ms ; le survol garde sa réponse de 140 ms. */
html.has-motion .cap-header__cta {
  transition-duration: var(--dur-state), var(--dur-state), var(--dur-state), var(--dur-press);
}

html.has-motion .cap-header__cta:hover {
  transition-duration:
    var(--dur-feedback), var(--dur-feedback), var(--dur-feedback), var(--dur-press);
}

/* Contrastes forcés : le logo passe en CanvasText, il lui faut le fond Canvas dès le haut de page. */
@media (forced-colors: active) {
  .cap-header__bar::before {
    clip-path: inset(0);
  }

  .cap-header__label::after {
    background: CanvasText;
    forced-color-adjust: none;
  }
}
</style>
