<script setup lang="ts">
import type { HomeContent, NavLink } from '~/types/content';
import { ui } from '~/data/ui';
import type { Motion } from '~/motion/gsap';
import { pauseScroll, resumeScroll } from '~/motion/scroll';
import { capped } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';

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
 * - Mouvement : voir withMotion(). Sans lui, le menu apparaît et disparaît d'un coup.
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
const trace = useTemplateRef<HTMLElement>('trace');

const items = computed(() =>
  props.nav.map((link, index) => ({ ...link, index: String(index + 1).padStart(2, '0') })),
);

/**
 * Le bouton du dialog suit l'état : pendant que le rideau remonte, il redevient
 * « Menu », comme le déclencheur qu'il recouvre. Sans JS, le dialog n'est
 * visible qu'ouvert (:target) : toujours « Fermer ».
 */
const showsClose = computed(() => open.value || !props.enhanced);

/** Le défilement de la page s'arrête sous le menu, Lenis compris. */
function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (locked) pauseScroll();
  else resumeScroll();
}

/** Rideau du menu : présent seulement quand le mouvement est actif (voir withMotion). */
let curtain: { halt: () => void; lower: () => void; raise: () => void } | undefined;

function show() {
  const el = dialog.value;
  if (!el || el.open) return;
  // Avant showModal() : un dialog encore inerte ne recevrait pas le focus.
  curtain?.halt();
  el.showModal();
  // Le rideau mesure tant que la mise en page est propre, avant que la page ne se fige.
  curtain?.lower();
  lockScroll(true);
}

function hide(reason: 'link' | 'dismiss') {
  const el = dialog.value;
  if (!el?.open) return;
  el.close();
  release(reason);
}

/** Le dialog est fermé : la page est rendue tout de suite, seul le rideau finit de remonter. */
function release(reason: 'link' | 'dismiss') {
  lockScroll(false);
  curtain?.raise();
  open.value = false;
  emit('closed', reason);
}

// Après le rendu : à l'hydratation, le bouton « Fermer » doit exister avant showModal() (autofocus).
watch(open, (value) => (value ? show() : hide('dismiss')), { flush: 'post' });

/** Échap : on ferme nous-mêmes, dans l'événement, pour que le rideau remonte sans image vide avant. */
function onCancel(event: Event) {
  event.preventDefault();
  hide('dismiss');
}

/** Fermeture par le navigateur seul (Échap répété, geste retour) : on resynchronise l'état. */
function onNativeClose() {
  if (open.value) release('dismiss');
}

/** Tout lien interne du menu (sections, logo, téléphone) ferme avant de naviguer. */
function onClick(event: MouseEvent) {
  const link = (event.target as Element).closest('a[href^="#"]');
  if (link) hide('link');
}

onBeforeUnmount(() => lockScroll(false));

/** Masques de ligne : on entre par la gauche, on sort par la droite (le vecteur de la marque). */
const BEFORE = 'inset(0% 100% 0% 0%)';
const SHOWN = 'inset(0% 0% 0% 0%)';
const AFTER = 'inset(0% 0% 0% 100%)';

/**
 * Mouvement du menu, branché par SiteHeader via useMotion() : fermé, le dialog
 * n'occupe pas l'écran, c'est l'en-tête qui annonce son approche.
 *
 * - Rideau : le dialog est découpé par un polygone dont le bord bas porte une
 *   marche de --move-xl au droit de la colonne des libellés, la silhouette en
 *   escalier à l'échelle de l'écran (la partie droite mène, comme la plaque
 *   arrière). Une trace rouge borde ce bord, d'autant plus longue que le rideau
 *   est loin de son arrêt : elle se résorbe quand il se pose (« Vitesse → Arrêt »).
 * - Une seule valeur, `cover` (0 fermé, 1 couvert), dessine les deux : chaque
 *   commande repart de la valeur courante, sans file d'attente ni état bâtard.
 * - Fermer rend la page tout de suite (focus, inertie, aria-expanded) : le
 *   dialog fermé reste seulement affiché, inerte, le temps que le rideau remonte.
 */
function withMotion({ gsap }: Motion) {
  const el = dialog.value;
  const band = trace.value;
  if (!el || !band) return undefined;

  const hook = (name: string) => el.querySelectorAll(`[data-motion="menu-${name}"]`);
  const movers = el.querySelectorAll('[data-motion^="menu-"]');

  // Tokens lus une fois : une commande (ouvrir, fermer) ne force aucun recalcul de plus.
  const step = length('--move-xl');
  const shift = length('--move-l');
  const nudge = length('--move-s');
  const enter = duration('--dur-overlay');
  const exit = enter * 0.65; // a6 §3.2 : la sortie va plus vite que l'entrée
  const layout = duration('--dur-layout');
  const brief = duration('--dur-state');
  const quick = duration('--dur-feedback');
  const strike = duration('--dur-strike');
  const lines = stagger('--stagger-lines');
  const tight = stagger('--stagger-tight');

  /** Abscisse de la marche : le début des libellés, mesuré sur un contenu au repos. */
  const labelColumn = () => el.querySelector('.menu__label')?.getBoundingClientRect().left ?? 0;
  const state = { cover: el.open ? 1 : 0 };
  let edge = el.open ? labelColumn() : 0;
  // Hauteur du dialog (plein écran) gardée à jour : le dessin ne lit jamais la mise en page.
  let height = innerHeight;
  const measure = () => (height = innerHeight);
  addEventListener('resize', measure, { passive: true });
  let curtainTween: gsap.core.Tween | undefined;
  let content: gsap.core.Animation | undefined;
  let departing = false;

  const draw = () => {
    const front = state.cover * (height + step); // bord, à droite de la marche
    const back = front - step; // bord, à gauche de la marche
    const tail = step * (1 - state.cover); // longueur de la trace
    el.style.clipPath = `polygon(0 0, 100% 0, 100% ${front}px, ${edge}px ${front}px, ${edge}px ${back}px, 0 ${back}px)`;
    band.style.clipPath = `polygon(0 ${back - tail}px, ${edge}px ${back - tail}px, ${edge}px ${front - tail}px, 100% ${front - tail}px, 100% ${front}px, ${edge}px ${front}px, ${edge}px ${back}px, 0 ${back}px)`;
  };

  const move = (cover: 0 | 1, seconds: number, ease: 'out' | 'in', onComplete: () => void) => {
    curtainTween?.kill();
    band.hidden = false;
    draw();
    curtainTween = gsap.to(state, { cover, duration: seconds, ease, onUpdate: draw, onComplete });
  };

  /** Rideau posé ou reparti : plus de découpe ni de trace. */
  const unclip = () => {
    el.style.removeProperty('clip-path');
    band.style.removeProperty('clip-path');
    band.hidden = true;
  };

  /** Rideau remonté : le dialog fermé disparaît, son contenu retrouve son état final. */
  const vanish = () => {
    el.inert = false;
    el.classList.remove('menu--leaving');
    unclip();
    content?.kill();
    content = undefined;
    gsap.set(movers, { clearProps: 'transform,clipPath' });
  };

  /** Derrière le rideau : les repères se verrouillent, les liens arrivent ligne à ligne, puis les réseaux. */
  const arrive = () =>
    gsap
      .timeline({ defaults: { duration: layout } })
      .fromTo(
        hook('mark'),
        { rotation: 45, scale: 0.6 },
        {
          rotation: 0,
          scale: 1,
          stagger: capped(tight),
          clearProps: 'transform',
        },
        0,
      )
      // Au quart de sa course (--ease-out), le rideau a couvert l'essentiel de l'écran.
      .fromTo(
        hook('link'),
        { x: -shift, clipPath: BEFORE },
        {
          x: 0,
          clipPath: SHOWN,
          stagger: capped(lines),
          clearProps: 'transform,clipPath',
        },
        enter / 4,
      )
      .fromTo(
        hook('social'),
        { x: -nudge, clipPath: BEFORE },
        {
          x: 0,
          clipPath: SHOWN,
          duration: brief,
          stagger: capped(tight),
          clearProps: 'transform,clipPath',
        },
        `>-${brief}`,
      )
      // L'astérisque avance d'un cran : le point d'arrêt de la séquence.
      .fromTo(
        hook('asterisk'),
        { rotation: -45 },
        { rotation: 0, duration: strike, ease: 'strike', clearProps: 'transform' },
        '<',
      );

  /**
   * Les liens repartent vers la droite, du bas vers le haut comme le rideau qui
   * les rattrape : la fermeture répond tout de suite, pendant que --ease-in prend son élan.
   */
  const depart = () =>
    gsap.to(hook('link'), {
      x: nudge,
      clipPath: AFTER,
      duration: quick,
      ease: 'in',
      stagger: capped(tight, true),
    });

  curtain = {
    halt() {
      el.inert = false;
      el.classList.remove('menu--leaving');
    },
    lower() {
      // Rideau parti, contenu au repos : avant le décalage d'entrée des liens.
      if (state.cover === 0) edge = labelColumn();
      if (state.cover === 0 || departing) {
        content?.kill();
        content = arrive();
      }
      departing = false;
      move(1, enter * (1 - state.cover), 'out', unclip);
    },
    raise() {
      el.inert = true;
      el.classList.add('menu--leaving');
      content?.kill();
      content = depart();
      departing = true;
      move(0, exit * state.cover, 'in', vanish);
    },
  };

  return () => {
    curtain = undefined;
    removeEventListener('resize', measure);
    curtainTween?.kill();
    vanish();
  };
}

defineExpose({ withMotion });
</script>

<template>
  <!--
    Le clic est délégué aux liens qu'il contient : le dialog lui-même n'est pas interactif.
    data-lenis-prevent : Lenis, arrêté sous le menu, laisse la molette au dialog (s'il défile).
  -->
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <dialog
    :id="id"
    ref="dialog"
    class="menu"
    data-surface="hot"
    data-motion="menu-panel"
    :aria-label="ui.menu.dialog"
    :data-enhanced="enhanced || undefined"
    data-lenis-prevent
    @cancel="onCancel"
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
        :cross="showsClose"
        :closes="showsClose"
        autofocus
        :href="enhanced ? undefined : '#haut'"
        :aria-label="ui.menu.closeLabel"
        @click="open = false"
      />
      <!-- eslint-enable vuejs-accessibility/no-autofocus -->
    </HeaderBar>

    <div class="menu__body container">
      <CrosshairRow class="menu__marks" motion="menu-mark" />

      <nav class="menu__nav" :aria-label="ui.menu.sections">
        <ol role="list" class="menu__list">
          <li v-for="item in items" :key="item.href" class="menu__item">
            <a class="menu__link" :href="item.href" data-motion="menu-link">
              <span class="menu__index" aria-hidden="true">{{ item.index }}</span>
              <span class="menu__label">{{ item.label }}</span>
              <span class="menu__figure" aria-hidden="true">{{ item.index }}</span>
            </a>
          </li>
        </ol>
        <!-- Le support tourne à l'ouverture, l'astérisque garde son cran (Asterisk.vue). -->
        <span class="menu__mark" data-motion="menu-asterisk">
          <Asterisk class="menu__asterisk" size="var(--menu-mark)" />
        </span>
      </nav>

      <div class="menu__footer">
        <p class="menu__note">{{ note }}</p>
        <ul role="list" class="menu__socials" :aria-label="ui.socials">
          <li v-for="social in socials" :key="social.icon" data-motion="menu-social">
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

    <!-- Trace rouge du rideau en mouvement (withMotion) : absente au repos. -->
    <span ref="trace" class="menu__trace" aria-hidden="true" hidden />
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

/* Fermé, le dialog reste affiché le temps que le rideau remonte (withMotion), sans capter le pointeur. */
.menu--leaving {
  display: grid;
  pointer-events: none;
}

/* Au-dessus du contenu : là où passe la trace, le rideau n'a pas encore tout couvert. */
.menu__trace {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: var(--red-500);
  pointer-events: none;
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
  }

  /* Le cran de l'astérisque (Asterisk.vue) et le passage au rouge. */
  .menu__asterisk {
    transition:
      rotate var(--dur-strike) var(--ease-strike),
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
  /* Sans rideau : un fondu bref à l'ouverture, la fermeture est immédiate. */
  .menu[open] {
    transition: opacity var(--dur-feedback) linear;
  }

  @starting-style {
    .menu[open] {
      opacity: 0;
    }
  }

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
