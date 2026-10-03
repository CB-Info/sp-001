<script setup lang="ts">
import { motionAllowed } from '~/motion/env';
import { scrollToTarget } from '~/motion/scroll';
import { ENTRY, reached } from '~/motion/sequence';
import { duration } from '~/motion/tokens';
import type { HomeContent } from '~/types/content';

/**
 * Pied de page : le bandeau défilant, puis la scène « hot » (photo rouge fondue
 * au noir), qui répond au hero : titre et navigation, trois panneaux, wordmark
 * géant et réseaux sociaux. Une ligne de mentions (concept, crédit) ferme la page :
 * ajout assumé par rapport à la référence, exigé par l'honnêteté du projet.
 *
 * Mesures @1440 (a1 §2.8, v2 §1.7), scène de 849 px : titre à y 126, panneaux de
 * 266 à 615, capitales du wordmark de 657 à 814 (157 px), à ≈ 32 px du bas.
 *
 * Mouvement (docs/analyse/annexes/a6-motion.md §2.3 et §4.8). Le H2 ne bouge pas.
 * - Serre-livre : à son entrée, CLUSEM™ rejoue le geste du hero. Le mot arrive
 *   lancé de 0,4 em, deux échos rouges le rattrapent et s'éteignent (HeroHeadline).
 * - Les liens vers le haut de page remontent en défilement lissé ; le focus passe
 *   à la cible du lien d'évitement.
 */
defineProps<{ content: HomeContent['footer']; marquee: HomeContent['marquee'] }>();

const titleId = 'footer-titre';

/*
 * Largeur affichée de la photo (couverture, ratio 1,69). Sous 64em, elle n'occupe
 * que le haut de la scène (36rem) : en portrait, elle déborde donc de la fenêtre.
 * Clés = largeur minimale de fenêtre (@nuxt/image).
 */
const photoSizes = {
  390: '250vw',
  sm: '155vw',
  md: '130vw',
  lg: '135vw',
  xl: '110vw',
  '2xl': '100vw',
};

/** Haut de page, et cible du lien d'évitement (pages/index.vue). */
const PAGE_TOP = '#haut';
const SKIP_TARGET = '#contenu';

/**
 * « Retour en haut » et « Accueil » : quand le mouvement est permis, la page remonte
 * en défilement lissé au lieu de sauter, et le focus va au contenu principal, comme
 * après « Aller au contenu ». Sinon (mouvement réduit, sans JS, clic modifié pour
 * un nouvel onglet), l'ancre native fait tout.
 */
function onClick(event: MouseEvent) {
  const modified =
    event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  if (event.defaultPrevented || modified || !motionAllowed()) return;
  const link = (event.target as Element).closest(`a[href="${PAGE_TOP}"]`);
  const content = document.querySelector<HTMLElement>(SKIP_TARGET);
  if (!link || !content || !document.querySelector(PAGE_TOP)) return;
  event.preventDefault();
  content.focus({ preventScroll: true });
  scrollToTarget(PAGE_TOP, { travel: true });
}

const footer = useTemplateRef<HTMLElement>('footer');

useMotion(footer, ({ gsap }, root) => {
  const wordmark = root.querySelector<HTMLElement>('[data-motion="footer-wordmark"]');
  const brand = root.querySelector<HTMLElement>('[data-motion="footer-brand"]');
  // Déjà à l'écran quand GSAP arrive (ancre, rechargement) : l'état final reste.
  if (!wordmark || !brand || reached(wordmark)) return undefined;

  /*
   * Échos : deux copies décoratives du mot (™ compris), posées sous lui le temps
   * de l'arrivée. Le mot est déjà masqué aux lecteurs d'écran ; les copies aussi.
   */
  const glyphs = [...wordmark.childNodes];
  let echoes: HTMLElement[] = [];
  const echo = () => {
    const copy = document.createElement('span');
    copy.className = 'site-footer__echo';
    copy.setAttribute('aria-hidden', 'true');
    copy.append(...glyphs.map((node) => node.cloneNode(true)));
    return copy;
  };
  const release = () => {
    echoes.forEach((copy) => copy.remove());
    echoes = [];
    delete wordmark.dataset.echoing;
  };

  /*
   * Le mot attend hors de vue, en retrait de sa course ; il apparaît lancé, comme
   * les lignes du hero à leur première image. Les variables tombent à 0 : le
   * retrait et les échos s'annulent (voir le CSS).
   */
  gsap.set(wordmark, { visibility: 'hidden' });
  const arrival = gsap
    .timeline({
      scrollTrigger: { trigger: wordmark, ...ENTRY },
      defaults: { duration: duration('--dur-focal') },
      onStart: () => {
        echoes = [echo(), echo()];
        wordmark.prepend(...echoes);
        wordmark.dataset.echoing = '';
        gsap.set(wordmark, { clearProps: 'visibility' });
      },
      onComplete: release,
    })
    .fromTo(wordmark, { '--arrive': 1 }, { '--arrive': 0, clearProps: '--arrive' }, 0)
    // Les échos rattrapent le mot sur une courbe plus douce : la traînée s'étire, puis se résorbe.
    .fromTo(
      wordmark,
      { '--echo-lag': 1 },
      { '--echo-lag': 0, ease: 'out-soft', clearProps: '--echo-lag' },
      0,
    )
    .fromTo(
      wordmark,
      { '--echo-fade': 1 },
      {
        '--echo-fade': 0,
        ease: 'in-out',
        duration: duration('--dur-overlay'),
        clearProps: '--echo-fade',
      },
      0,
    );

  // Clavier : un réseau focalisé avant le déclencheur (bas de l'écran) fait arriver le mot.
  const play = () => arrival.play();
  brand.addEventListener('focusin', play, { once: true });
  return () => {
    brand.removeEventListener('focusin', play);
    release();
  };
});
</script>

<template>
  <!--
    Le clic est délégué aux liens vers le haut de page (panneau et navigation) :
    le footer lui-même n'est pas interactif.
  -->
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <footer id="contact" ref="footer" class="site-footer" data-surface="hot" @click="onClick">
    <MarqueeBand :content="marquee" />

    <div class="site-footer__stage">
      <div class="site-footer__media">
        <NuxtPicture
          :src="content.image.src"
          :alt="content.image.alt"
          :width="content.image.width"
          :height="content.image.height"
          format="avif,webp"
          :sizes="photoSizes"
          loading="lazy"
          decoding="async"
          :img-attrs="{
            class: 'site-footer__photo',
            style: { objectPosition: content.image.focal },
          }"
        />
      </div>

      <div class="site-footer__inner container">
        <div class="site-footer__top">
          <h2 :id="titleId" class="site-footer__title" data-motion="footer-title">
            {{ content.title }}
          </h2>
          <FooterNav class="site-footer__nav" :links="content.nav" />
        </div>

        <FooterPanels
          class="site-footer__panels"
          :panels="content.panels"
          :manifesto="content.manifesto"
          :motto="content.motto"
        />

        <div class="site-footer__brand" data-motion="footer-brand">
          <Wordmark
            as="p"
            class="site-footer__wordmark"
            aria-hidden="true"
            data-motion="footer-wordmark"
          />
          <FooterSocials
            class="site-footer__socials"
            :socials="content.socials"
            data-motion="footer-socials"
          />
        </div>

        <RuledGrid variant="panel" class="site-footer__grid" />
      </div>
    </div>

    <div class="site-footer__legal container">
      <p>{{ content.disclaimer }}</p>
      <p>{{ content.credit }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  /* mesuré : filets de ≈ 12 % de blanc (#22201e sur noir), plus discrets que --rule. */
  --footer-rule: color-mix(in srgb, var(--rule) 66%, transparent);
  --footer-scrim: color-mix(in srgb, var(--black) 70%, transparent);
}

/* ── Scène : photo et contenu ────────────────────────────────────────────── */
.site-footer__stage {
  position: relative;
  isolation: isolate;
  padding-block-start: var(--section-pad);
  padding-inline: env(safe-area-inset-left, 0px) env(safe-area-inset-right, 0px);
  overflow: clip;
}

/* Sous 64em : la photo coiffe le haut de la scène et se fond au noir (recadrage portrait). */
.site-footer__media {
  position: absolute;
  inset: 0 0 auto;
  z-index: -1;
  block-size: min(100%, 36rem);
}

.site-footer__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--black) 25%, transparent),
    var(--footer-scrim) 55%,
    var(--black)
  );
}

.site-footer__media :deep(picture),
.site-footer__media :deep(.site-footer__photo) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.site-footer__media :deep(.site-footer__photo) {
  object-fit: cover;
}

.site-footer__inner {
  position: relative;
  isolation: isolate;
  container-type: inline-size;
  padding-block-end: var(--space-32);
}

/* ── Titre et navigation ─────────────────────────────────────────────────── */
.site-footer__top {
  display: grid;
  gap: var(--space-32);
}

.site-footer__title {
  max-inline-size: 11.5em;
  font-size: var(--text-heading);
  text-transform: uppercase;
  color: var(--ink);
}

.site-footer__nav {
  max-inline-size: 30rem;
}

.site-footer__panels {
  margin-block-start: var(--space-40);
}

/* ── Wordmark et réseaux ─────────────────────────────────────────────────── */
.site-footer__brand {
  display: grid;
  gap: var(--space-24);
  margin-block-start: var(--space-40);
}

/*
 * Le wordmark remplit la largeur en mobile (CLUSEM™ mesure 4,385 em). La boîte est
 * rognée aux capitales et à la ligne de base : réseaux et marge basse se calent
 * sur les lettres, pas sur l'interligne.
 */
.site-footer__wordmark {
  font-size: 22.5cqi;
  /* Alignement optique : l'approche gauche du C (0,045em, mesurée) est rattrapée. */
  margin-inline-start: -0.045em;
  color: var(--ink);
  text-box: trim-both cap alphabetic;
}

/*
 * Arrivée du wordmark (GSAP) : --arrive passe de 1 à 0. Sans la variable, la
 * déclaration est invalide et `translate` reste nul : rien ne bouge sans GSAP.
 */
.site-footer__wordmark {
  /* a6 §3.3 : seule course hors des pas mesurés, celle de la typo focale. */
  --wordmark-travel: 0.4em;

  translate: calc(var(--arrive) * var(--wordmark-travel) * -1) 0;
}

.site-footer__wordmark[data-echoing] {
  position: relative;
  isolation: isolate;
  will-change: translate;
}

/*
 * Échos (copies posées par le script) : rouges, sous le mot, partis un et deux pas
 * (--move-l) derrière lui. Même course que ceux du hero : leur translation compte
 * celle du mot qui les porte.
 */
.site-footer__wordmark :deep(.site-footer__echo) {
  --echo-offset: calc(var(--move-l) * -1);
  --echo-opacity: 0.6;

  position: absolute;
  inset: 0;
  z-index: -1;
  color: var(--red-500);
  text-box: inherit;
  translate: calc(
      var(--echo-lag, 0) * (var(--echo-offset) - var(--wordmark-travel)) + var(--arrive, 0) *
        var(--wordmark-travel)
    )
    0;
  opacity: calc(var(--echo-fade, 0) * var(--echo-opacity));
  pointer-events: none;
  user-select: none;
  will-change: translate, opacity;
}

.site-footer__wordmark :deep(.site-footer__echo + .site-footer__echo) {
  --echo-offset: calc(var(--move-l) * -2);
  --echo-opacity: 0.3;
}

.site-footer__grid {
  display: none;
}

/* ── Mentions ────────────────────────────────────────────────────────────── */
.site-footer__legal {
  display: grid;
  gap: var(--space-8) var(--space-40);
  padding-block: var(--space-20) max(var(--space-20), env(safe-area-inset-bottom));
  border-block-start: 1px solid var(--footer-rule);
  font-size: var(--text-micro);
  line-height: 1.5;
  color: var(--ink-muted);
}

@media (width >= 48em) {
  .site-footer__brand {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    column-gap: var(--space-16);
  }

  .site-footer__wordmark {
    font-size: 15cqi;
  }

  /* Trame pâle en bas à droite, posée sur le noir (mesuré : 804 → 1380, 107 px). */
  .site-footer__grid {
    position: absolute;
    inset-inline-end: 0;
    inset-block-end: 0;
    z-index: -1;
    display: block;
    inline-size: 43.6cqi;
    border-block-end: 0;
  }
}

@media (width >= 64em) {
  .site-footer__media {
    inset: 0;
    block-size: auto;
  }

  /* mesuré : photo nette jusqu'à 15 %, noir à 70 % à 45 %, noir plein dès 68 %. */
  .site-footer__media::after {
    background:
      linear-gradient(to top, var(--black), transparent var(--space-60)),
      linear-gradient(to right, transparent 15%, var(--footer-scrim) 45%, var(--black) 68%);
  }

  /* Grille de 12 colonnes : la navigation part de la 10e (x 1061) et de la 12e (x 1287). */
  .site-footer__top {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: var(--gap);
    align-items: start;
  }

  /* Première ligne la plus longue, comme la référence (« REDEFINING FITNESS / CULTURE. »). */
  .site-footer__title {
    grid-column: 1 / span 9;
    text-wrap: wrap;
  }

  .site-footer__nav {
    --footer-nav-columns: minmax(max-content, 1fr)
      minmax(max-content, calc((100% - 2 * var(--gap)) / 3));

    grid-column: 10 / -1;
    max-inline-size: none;
    margin-block-start: calc(var(--space-8) * -1);
  }

  .site-footer__panels {
    margin-block-start: var(--space-32);
  }

  /* Capitales de 157 px à 1440 (font-size 224 px), soit 74 % du contenu. */
  .site-footer__wordmark {
    font-size: min(17cqi, 14rem);
  }

  .site-footer__legal {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
