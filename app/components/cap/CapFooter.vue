<script setup lang="ts">
import { cap } from '~/data/cap';
import { motionAllowed } from '~/motion/env';
import { scrollToTarget } from '~/motion/scroll';
import { ENTRY, reached } from '~/motion/sequence';
import { duration } from '~/motion/tokens';

/**
 * Pied de page (brief docs/brief/v2.md, §4.9) : surface nuit, le logo complet
 * en serre-livre, les liens de la page, puis, sous un filet graphite, ce qui
 * reste à confirmer par le club (#a-confirmer, la cible du bandeau maquette) et
 * les mentions (#mentions, mot pour mot). L'ourlet ferme la page : le seul
 * dégradé du site, du noir au lime de la tenue, décoratif et sans texte.
 *
 * Logo : horizontal de 872 px (colonnes 1 à 8) dès 48em ; carré de 350 px
 * en dessous, où l'horizontal passerait sous sa taille minimale (400 px).
 *
 * « Haut de page » : avec le mouvement, la page remonte en une course de
 * --dur-travel (--ease-in-out), puis le focus passe au contenu principal, comme
 * après « Aller au contenu ». Sinon (sans JS, mouvement réduit, clic modifié),
 * l'ancre native fait tout.
 *
 * Mouvement, serre-livre : quand le logo franchit ENTRY, ou au premier focus
 * clavier dans le pied de page, il se découvre de gauche à droite (clip-path,
 * --dur-focal, --ease-in-out), une seule fois, comme un tracé qui s'écrit.
 * L'état initial n'est posé que si le logo est encore sous l'écran : hydraté à
 * la vue (v2.vue), le pied de page arrive souvent avec son logo déjà visible,
 * qui reste alors tel quel.
 */

const titleId = 'a-confirmer-titre';

/** Haut de page, et cible du lien d'évitement (pages/v2.vue). */
const PAGE_TOP = '#haut';
const SKIP_TARGET = '#contenu';

/** Relevé de fin de course : tous les combien (ms), et marge au-delà de --dur-travel (ms). */
const SETTLE_STEP = 100;
const SETTLE_MARGIN = 1500;
let settling: ReturnType<typeof setTimeout> | undefined;

/**
 * Le focus suit la course au lieu de la précéder : déplacé au départ, il ferait
 * défiler la page d'un coup (l'en-tête redescend tout élément focalisé qu'il
 * couvre) et casserait le trajet. Il passe au contenu une fois la page arrivée
 * en haut ; si le visiteur reprend la main en route, il reste sur le lien.
 */
function focusOnArrival(content: HTMLElement) {
  clearTimeout(settling);
  const deadline = performance.now() + duration('--dur-travel') * 1000 + SETTLE_MARGIN;
  const check = () => {
    if (scrollY < 1) content.focus({ preventScroll: true });
    else if (performance.now() < deadline) settling = setTimeout(check, SETTLE_STEP);
  };
  settling = setTimeout(check, SETTLE_STEP);
}

function toTop(event: MouseEvent) {
  const modified =
    event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  if (event.defaultPrevented || modified || !motionAllowed()) return;
  const content = document.querySelector<HTMLElement>(SKIP_TARGET);
  if (!content || !document.querySelector(PAGE_TOP)) return;
  event.preventDefault();
  scrollToTarget(PAGE_TOP, { travel: true });
  focusOnArrival(content);
}

onBeforeUnmount(() => clearTimeout(settling));

/*
 * Masques de la découverte. Ils débordent en haut, en bas et à gauche : la
 * pointe effilée du tracé et les pics de l'ECG ne sont jamais rognés.
 */
const HIDDEN = 'inset(-12% 100% -12% -2%)';
const SHOWN = 'inset(-12% -2% -12% -2%)';

/** Une seule découverte par visite : un retour du mouvement (matchMedia) ne la rejoue pas. */
let revealed = false;

const footer = useTemplateRef<HTMLElement>('footer');

useMotion(footer, ({ gsap, ScrollTrigger }, root) => {
  const brand = root.querySelector<HTMLElement>('[data-motion="footer-logo"]');
  // Déjà découvert, ou déjà à l'écran quand GSAP arrive : l'état final reste.
  if (revealed || !brand || reached(brand)) return undefined;

  gsap.set(brand, { clipPath: HIDDEN });
  const reveal = gsap.to(brand, {
    clipPath: SHOWN,
    duration: duration('--dur-focal'),
    ease: 'in-out',
    paused: true,
    clearProps: 'clipPath',
    onComplete: () => {
      revealed = true;
    },
  });

  const play = () => {
    if (!reveal.isActive() && reveal.progress() < 1) reveal.play();
  };
  ScrollTrigger.create({ trigger: brand, ...ENTRY, onEnter: play });
  // Le clavier arrive avant le défilement : le logo se découvre au premier focus.
  root.addEventListener('focusin', play, { once: true });

  return () => root.removeEventListener('focusin', play);
});
</script>

<template>
  <footer ref="footer" class="cap-footer" data-surface="nuit">
    <div class="cap-footer__top cap-grid">
      <div class="cap-footer__brand" data-motion="footer-logo">
        <CapLogo
          class="cap-footer__logo cap-footer__logo--h"
          variant="horizontal"
          :label="cap.brand"
        />
        <CapLogo class="cap-footer__logo cap-footer__logo--c" variant="carre" :label="cap.brand" />
      </div>

      <div class="cap-footer__links">
        <ul class="cap-footer__list" role="list">
          <li v-for="link in cap.nav" :key="link.href">
            <a class="cap-footer__link cap-link" :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
        <ul class="cap-footer__list cap-footer__list--page" role="list">
          <li>
            <a class="cap-footer__link cap-link" :href="cap.ui.otherDirection.href">{{
              cap.ui.otherDirection.label
            }}</a>
          </li>
          <li>
            <a class="cap-footer__link cap-link" :href="PAGE_TOP" @click="toTop">{{
              cap.ui.top
            }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="cap-footer__rows cap-grid">
      <!-- Pour le gérant : la liste de ce qui manque, cible du bandeau maquette. -->
      <section id="a-confirmer" class="cap-footer__pending" :aria-labelledby="titleId">
        <h2 :id="titleId" class="cap-footer__title">{{ cap.footer.aConfirmer.titre }}</h2>
        <p class="cap-footer__intro">{{ cap.footer.aConfirmer.intro }}</p>
        <ul class="cap-footer__todo" role="list">
          <li v-for="item in cap.footer.aConfirmer.liste" :key="item" class="cap-footer__item">
            <span class="cap-footer__square cap-square" aria-hidden="true" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <p id="mentions" class="cap-footer__mentions">{{ cap.footer.mentions }}</p>
    </div>

    <!-- L'ourlet : le seul dégradé de la page, sans aucun texte. -->
    <div class="cap-footer__ourlet" aria-hidden="true" />
  </footer>
</template>

<style scoped>
/*
 * Cotes @1440 (brief §4.9) : 96 px de marge en haut ; logo horizontal de
 * 872 px (x 60 à 932, colonnes 1 à 8) ; liens colonnes 10 à 12 (x 1068), en
 * Figtree 500 18 px. Rangée sous un filet graphite, 48 px de marge : la liste
 * « à confirmer » colonnes 1 à 8, sur 2 colonnes ; les mentions colonnes 9 à
 * 12, en Figtree 500 14 px gris. Puis l'ourlet de 160 px. @390 : logo carré de
 * 350 px à x 20, liens, liste sur une colonne, mentions, ourlet de 120 px.
 */
.cap-footer {
  --pad: max(var(--page-gutter), (100cqi - var(--content-max)) / 2);

  container-type: inline-size;
  padding-block-start: clamp(4rem, 3.257rem + 3.048vw, 6rem); /* 64 → 96 */
  background: var(--cf-noir);
  color: var(--cf-craie);
}

/* ── Logo et liens ────────────────────────────────────────────────────────── */
.cap-footer__top {
  row-gap: clamp(2.5rem, 2.214rem + 1.172vw, 3rem); /* 40 → 48 */
  align-items: start;
  padding-inline: var(--pad);
}

.cap-footer__top > * {
  grid-column: 1 / -1;
}

.cap-footer__brand {
  min-inline-size: 0;
}

/*
 * Carré : 350 px à 390, toute la largeur en dessous (280 px à 320). Sélecteurs
 * précédés du bloc : ils doivent passer devant le `display: block` de CapLogo,
 * de même spécificité, quel que soit l'ordre des feuilles.
 */
.cap-footer__brand .cap-footer__logo--c {
  inline-size: min(100%, 350px);
}

.cap-footer__brand .cap-footer__logo--h {
  display: none;
}

.cap-footer__links {
  /*
   * Les liens du chapitre, puis ceux de la page, côte à côte tant qu'ils tiennent
   * (à 320 px comme dans les colonnes 10 à 12) : la colonne ne dépasse pas le logo.
   */
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem calc(var(--gap) * 2);
  align-items: start;
}

.cap-footer__list {
  display: grid;
  margin: 0;
}

/*
 * Les liens de la page prennent la place qui reste à droite (8rem au moins),
 * quitte à passer sur deux ou trois lignes : à sa largeur naturelle, le libellé
 * du lien vers l'autre projet renverrait la liste sous celle du chapitre, et le
 * pied de page grandirait de 117 px à 1440 (de 112 px à 390).
 */
.cap-footer__list--page {
  flex: 1 1 8rem;
  text-wrap: balance;
}

/*
 * Cibles de 44 px : chaque lien occupe sa rangée. Le retrait haut et bas, pris
 * sur ces 44 px, garde la première ligne d'un libellé sur deux ou trois lignes
 * alignée sur celle d'un lien d'une ligne.
 */
.cap-footer__link {
  display: inline-flex;
  align-items: center;
  min-block-size: 44px;
  padding-block: max(0px, (44px - 1lh) / 2);
  font-family: var(--font-body);
  font-size: clamp(1rem, 0.954rem + 0.19vw, 1.125rem); /* 16 → 18 */
  font-weight: 500;
  line-height: 1.3;
}

/* ── Ce qui reste à confirmer, mentions ───────────────────────────────────── */
/*
 * 32 px du bas du logo et des liens jusqu'au filet, à toutes les largeurs : cet
 * écart n'est pas coté au §4.9, et la page doit tenir sous 13 000 px (V9).
 */
.cap-footer__rows {
  row-gap: clamp(2.5rem, 2.214rem + 1.172vw, 3rem); /* 40 → 48 */
  align-items: start;
  margin: 2rem var(--pad) 0;
  padding-block: clamp(2.5rem, 2.214rem + 1.172vw, 3rem); /* 40 → 48 */
  border-block-start: 1px solid var(--cf-graphite);
}

.cap-footer__rows > * {
  grid-column: 1 / -1;
  min-inline-size: 0;
}

.cap-footer__title {
  margin: 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: clamp(1.125rem, 1.079rem + 0.19vw, 1.25rem); /* 18 → 20 */
  font-weight: 600;
  line-height: 1.3;
  text-wrap: balance;
}

.cap-footer__intro {
  margin: 0.5rem 0 0;
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

.cap-footer__todo {
  display: grid;
  gap: 0.625rem var(--gap);
  margin: 1.5rem 0 0;
}

/* Puce : le carré au contour, l'état « à venir » du code du logo. */
.cap-footer__item {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  gap: 0.75rem;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Centré sur la hauteur d'x de la première ligne. */
.cap-footer__square {
  margin-block-start: calc((1lh - 10px) / 2 + 0.05em);
}

.cap-footer__mentions {
  max-inline-size: 34em;
  margin: 0;
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  text-wrap: pretty;
}

/* ── L'ourlet ─────────────────────────────────────────────────────────────── */
.cap-footer__ourlet {
  block-size: 120px;
  background: var(--cf-ourlet);
}

/* ── Tablette : le logo horizontal, la liste sur deux colonnes ──────────────── */
@media (min-width: 48em) {
  .cap-footer__brand .cap-footer__logo--c {
    display: none;
  }

  .cap-footer__brand .cap-footer__logo--h {
    display: block;
    inline-size: min(100%, 872px);
  }

  .cap-footer__todo {
    grid-template-rows: repeat(7, auto);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-flow: column;
  }

  .cap-footer__ourlet {
    block-size: 160px;
  }
}

/* ── Ordinateur : colonnes 1 à 8 et 10 à 12 ; 1 à 8 et 9 à 12 ─────────────── */
@media (min-width: 64em) {
  .cap-footer__top > .cap-footer__brand {
    grid-column: 1 / 9;
  }

  .cap-footer__top > .cap-footer__links {
    grid-column: 10 / -1;
  }

  .cap-footer__rows > .cap-footer__pending {
    grid-column: 1 / 9;
  }

  .cap-footer__rows > .cap-footer__mentions {
    grid-column: 9 / -1;
  }
}

/* ── Contrastes forcés : pas d'ourlet ─────────────────────────────────────── */
@media (forced-colors: active) {
  .cap-footer__ourlet {
    display: none;
  }

  .cap-footer__rows {
    border-color: CanvasText;
  }
}
</style>
