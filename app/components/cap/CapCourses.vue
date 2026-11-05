<script setup lang="ts">
import { cap } from '~/data/cap';
import { ENTRY, reached } from '~/motion/sequence';
import { duration } from '~/motion/tokens';
import type { Groupe, Photo } from '~/types/cap';
import { formatHeure, sortSessions, useParisClock } from '~/utils/cap-time';

/**
 * Chapitre 3, les cours (#cours) : choisir son cours par l'intensité. Les huit
 * disciplines sont réparties en trois rythmes, sans grille de cartes (brief
 * docs/brief/v2.md, §4.4).
 *
 * Titre, gabarit G3 (la diagonale) : « Fais monter » délié craie pleine largeur,
 * « le cœur. » plein craie ferré à droite une ligne plus bas, « Puis redescends
 * en douceur. » en signature citron (aucun délié ni tube citron dans le lockup).
 * Le H2 ne bouge jamais.
 *
 * Trois rythmes, trois mises en page :
 * - 3a, cardio en musique (#cours-cardio) : scène collante. Les trois photos
 *   empilées tiennent l'écran (sticky, 100svh, voile à gauche) pendant que la
 *   liste défile ; un IntersectionObserver au milieu de l'écran désigne le cours
 *   actif et sa photo apparaît (transition d'opacité CSS). Seulement sous
 *   html.has-motion et à partir de 64em ; sinon chaque cours a sa propre photo
 *   pleine largeur, demandée à l'approche seulement. Les images masquées
 *   (display: none, chargement différé) ne sont pas téléchargées ;
 * - 3b, force et intensité (#cours-force) : la photo déborde à gauche jusqu'au
 *   bord de l'écran, la colonne de droite descend d'un cran ; l'enchaînement du
 *   mercredi (CAF puis Cross training) est relié par un filet vertical citron ;
 * - 3c, retour au calme (#cours-calme) : surface carbone, noms en délié craie,
 *   et la ligne plate (style « plat », §2.8) posée sur la ligne de base de
 *   STRETCHING : la respiration de la page. Filet graphite en haut et en bas :
 *   le carbone touche le noir de #semaine (1,14:1, §2.1).
 *
 * Mouvement (une seule entrée par bloc, états initiaux posés par le JS et
 * seulement hors écran, via reached()) :
 * - force : à ENTRY, l'image se pose de scale(1.04) à 1 en 680 ms (--ease-out) ;
 * - calme : à ENTRY, la ligne plate s'écrit de gauche à droite en 1200 ms,
 *   linéaire (« écrire » : le seul mouvement linéaire de la page) ;
 * - fiches : CapCourseItem et CapCourseSheet (CSS, sans GSAP).
 * Sans JS et en mouvement réduit : tout est posé, la ligne est tracée.
 */
const cs = cap.courseSection;
const titleId = 'cours-titre';

const clock = useParisClock();

const groupOf = (groupe: Groupe) =>
  cap.courses
    .filter((course) => course.groupe === groupe)
    .map((course) => ({
      course,
      sessions: sortSessions(cap.sessions.filter((session) => session.course === course.slug)),
    }));

const cardio = groupOf('cardio');
const force = groupOf('force');
const calme = groupOf('calme');

/** Photo de chaque cours cardio : scène collante (ordinateur) ou figure (ailleurs). */
const cardioPhotos: Record<string, Photo> = {
  pound: cap.photos.pound,
  'cardio-jump': cap.photos.jump,
  step: cap.photos.step,
};

/**
 * « Fais monter » se coupe en deux lignes sur mobile (« Fais / monter »). L'espace
 * est dans le mot qui la précède : un nœud texte entre deux spans serait entouré
 * de marqueurs de fragment (`<!--[-->`) par le rendu serveur, et Chromium le
 * retirerait du nom accessible (« FAISMONTER »). En fin de ligne (mobile), elle
 * disparaît.
 */
const delieWords = cs.delie
  .split(' ')
  .map((word, index, words) => (index < words.length - 1 ? `${word} ` : word));

/* ── 3a. Scène collante : le cours qui traverse le milieu de l'écran ───────── */
const active = ref(cardio[0]?.course.slug);
const cardioList = useTemplateRef<HTMLElement>('cardioList');
let middle: IntersectionObserver | undefined;

onMounted(() => {
  const items = cardioList.value?.querySelectorAll<HTMLElement>('[data-slug]');
  if (!items?.length) return;
  // Racine réduite à la ligne du milieu de l'écran : un seul cours la traverse.
  middle = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const slug = (entry.target as HTMLElement).dataset.slug;
        if (entry.isIntersecting && slug) active.value = slug;
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  for (const item of items) middle.observe(item);
});

onBeforeUnmount(() => middle?.disconnect());

/*
 * ── 3a hors scène : chaque photo n'est demandée qu'à l'approche ─────────────
 * `loading="lazy"` seul ne suffit pas : le seuil de distance de Chrome (jusqu'à
 * 2 500 px) fait partir les trois photos au premier chargement, en concurrence
 * avec la photo de la couverture (LCP mobile, P3). Avec JS, l'image d'une figure
 * n'a pas de boîte (CSS), donc n'est pas demandée, tant que l'observateur ne l'a
 * pas vue à moins d'un écran ; il ne commence qu'après `load`. Sans JS : chargement
 * natif.
 */
const near = ref<Record<string, boolean>>({});
let approach: IntersectionObserver | undefined;

function watchFigures() {
  const figures = cardioList.value?.querySelectorAll<HTMLElement>('.cardio__figure');
  if (!figures?.length) return;
  approach = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const slug = entry.target.closest<HTMLElement>('[data-slug]')?.dataset.slug;
        if (slug) near.value[slug] = true;
        approach?.unobserve(entry.target);
      }
    },
    { rootMargin: '100% 0px' },
  );
  for (const figure of figures) approach.observe(figure);
}

onMounted(() => {
  if (document.readyState === 'complete') watchFigures();
  else addEventListener('load', watchFigures, { once: true });
});
onBeforeUnmount(() => {
  removeEventListener('load', watchFigures);
  approach?.disconnect();
});

/*
 * ── Sans JS, les fiches sont ouvertes : le HTML servi dit aria-expanded="true" ──
 * Avec JS, html.js les ferme dès le premier rendu, mais la section ne s'hydrate
 * qu'à l'approche : ce script en ligne, exécuté pendant l'analyse du HTML (avant
 * tout bundle), ramène l'attribut à `false` sur chaque en-tête dont la fiche
 * n'est pas ouverte. Rejoué après l'hydratation, il ne change rien.
 */
const ARIA_BOOT = [
  "document.documentElement.classList.contains('js')&&",
  "document.querySelectorAll('#cours [data-accordion-head]').forEach(function(b){",
  "var p=document.getElementById(b.getAttribute('aria-controls'));",
  "if(!p||!p.closest('[data-open]'))b.setAttribute('aria-expanded','false')})",
].join('');

useHead({ script: [{ key: 'cap-cours-fiches', tagPosition: 'bodyClose', innerHTML: ARIA_BOOT }] });

/* ── Clavier : ↑ ↓ Début Fin entre les en-têtes des huit fiches (APG) ─────── */
const section = useTemplateRef<HTMLElement>('section');
const KEYS: Record<string, (index: number, count: number) => number> = {
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

function onKeydown(event: KeyboardEvent) {
  const move = KEYS[event.key];
  if (!move || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const heads = [...(section.value?.querySelectorAll<HTMLElement>('[data-accordion-head]') ?? [])];
  const index = heads.indexOf(event.target as HTMLElement);
  if (index === -1) return;
  event.preventDefault();
  heads[move(index, heads.length)]?.focus();
}

// Un seul écouteur, délégué : les touches n'agissent que sur un en-tête de fiche.
onMounted(() => section.value?.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => section.value?.removeEventListener('keydown', onKeydown));

/* ── Entrées : la photo de la force se pose, la ligne du calme s'écrit ─────── */
/** L'image se pose dans son cadre (§5.3, « Force »). */
const IMAGE_SETTLE = 1.04;

useMotion(section, ({ gsap }, root) => {
  const photo = root.querySelector<HTMLElement>('[data-motion="cours-force-photo"]');
  const image = photo?.querySelector('img');
  const line = root.querySelector<SVGElement>('[data-motion="cours-calme-ligne"]');
  const tweens: gsap.core.Tween[] = [];

  if (photo && image && !reached(photo)) {
    tweens.push(
      gsap.fromTo(
        image,
        { scale: IMAGE_SETTLE },
        {
          scale: 1,
          duration: duration('--dur-focal'),
          ease: 'out',
          clearProps: 'transform',
          scrollTrigger: { trigger: photo, ...ENTRY },
        },
      ),
    );
  }

  // Écrire : découverte de gauche à droite, à vitesse de papier constante.
  if (line && !reached(line)) {
    tweens.push(
      gsap.fromTo(
        line,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: duration('--dur-calm'),
          ease: 'none',
          clearProps: 'clip-path',
          scrollTrigger: { trigger: line, ...ENTRY },
        },
      ),
    );
  }

  return () => {
    for (const tween of tweens) tween.kill();
    const targets = [image, line].filter((target) => target != null);
    if (targets.length) gsap.set(targets, { clearProps: 'transform,clip-path' });
  };
});
</script>

<template>
  <section id="cours" ref="section" class="cours" data-surface="nuit" :aria-labelledby="titleId">
    <!-- Titre G3 : la diagonale -->
    <div class="cours__wrap">
      <h2 :id="titleId" class="cours__title">
        <span class="cours__delie cap-display">
          <span v-for="word in delieWords" :key="word" class="cours__delie-word">{{ word }}</span>
        </span>
        {{ ' ' }}
        <span class="cours__plein cap-display">{{ cs.plein }}</span>
        {{ ' ' }}
        <span class="cours__signature cap-signature cap-signature--citron">{{ cs.signature }}</span>
      </h2>
    </div>

    <!-- 3a. Cardio en musique : scène collante -->
    <div id="cours-cardio" class="cardio">
      <div ref="cardioList" class="cardio__list cours__wrap">
        <h3 class="cardio__title cours__group cap-signature cap-signature--citron">
          {{ cs.groupes.cardio }}
        </h3>
        <CapCourseItem
          v-for="{ course, sessions } in cardio"
          :key="course.slug"
          class="cardio__item"
          :course="course"
          :sessions="sessions"
          :now="clock"
          :data-active="active === course.slug || undefined"
        >
          <template v-if="cardioPhotos[course.slug]" #media>
            <CapPhoto
              tag="figure"
              class="cardio__figure"
              :photo="cardioPhotos[course.slug]!"
              sizes="100vw"
              :data-near="near[course.slug] || undefined"
            />
          </template>
        </CapCourseItem>
      </div>

      <div class="cardio__stage">
        <CapPhoto
          v-for="{ course } in cardio"
          :key="course.slug"
          class="cardio__shot"
          :class="{ 'is-on': active === course.slug }"
          :photo="cardioPhotos[course.slug]!"
          :mobile-crop="false"
          sizes="100vw"
        />
        <div class="cardio__veil" aria-hidden="true" />
      </div>
    </div>

    <!-- 3b. Force et intensité -->
    <div id="cours-force" class="force">
      <div class="force__inner cours__wrap">
        <CapPhoto
          class="force__photo"
          :photo="cap.photos.force"
          sizes="(min-width: 64em) 620px, 100vw"
          :mobile-crop="false"
          data-motion="cours-force-photo"
        />
        <div class="force__text">
          <h3 class="cours__group cap-signature cap-signature--citron">
            {{ cs.groupes.force }}
          </h3>
          <CapCourseItem
            v-for="{ course, sessions } in force"
            :key="course.slug"
            class="force__item"
            :course="course"
            :sessions="sessions"
            :now="clock"
          />

          <div class="chain">
            <p :id="`${titleId}-enchainement`" class="chain__title cap-signature">
              {{ cs.enchainement.titre }}
            </p>
            <ol class="chain__list" role="list" :aria-labelledby="`${titleId}-enchainement`">
              <li v-for="step in cs.enchainement.lignes" :key="step.heure" class="chain__step">
                <span class="chain__time cap-data">{{ formatHeure(step.heure) }}</span>
                {{ ' ' }}
                <span class="chain__course">{{ step.cours }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- 3c. Retour au calme -->
    <div id="cours-calme" class="calme" data-surface="carbone">
      <div class="calme__inner cours__wrap">
        <h3 class="calme__title cours__group cap-signature cap-signature--citron">
          {{ cs.groupes.calme }}
        </h3>
        <CapPhoto
          class="calme__photo"
          :photo="cap.photos.calme"
          sizes="(min-width: 64em) 312px, 100vw"
          :mobile-crop="false"
        />
        <div class="calme__list">
          <CapCourseItem
            v-for="({ course, sessions }, index) in calme"
            :key="course.slug"
            class="calme__item"
            :course="course"
            :sessions="sessions"
            :now="clock"
          >
            <!-- La ligne plate porte le dernier mot : la respiration de la page. -->
            <template v-if="index === calme.length - 1" #baseline>
              <svg
                class="calme__line"
                data-ecg
                data-motion="cours-calme-ligne"
                aria-hidden="true"
                focusable="false"
                preserveAspectRatio="none"
                viewBox="0 0 100 2"
              >
                <line x1="0" y1="1" x2="100" y2="1" vector-effect="non-scaling-stroke" />
              </svg>
            </template>
          </CapCourseItem>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cours {
  padding-block-start: var(--pad-l);
  background: var(--bg);
  color: var(--ink);
}

/* Colonne de contenu : marges de page, 1760 px au plus. */
.cours__wrap {
  inline-size: min(100% - 2 * var(--page-gutter), var(--content-max));
  margin-inline: auto;
}

/* ── Titre G3 ──────────────────────────────────────────────────────────────── */
.cours__title {
  --title-size: 4rem;

  display: block;
  margin: 0;
  container-type: inline-size;
  text-wrap: balance;
}

.cours__delie,
.cours__plein {
  display: block;
  font-size: var(--title-size);
  line-height: var(--leading-heading);
  white-space: nowrap;
}

/* « Fais monter » : délié craie. Mobile : chasse 100 %, une ligne par mot. */
.cours__delie {
  color: var(--cf-craie);
  font-stretch: 100%;
  letter-spacing: 0.01em;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: max(2px, 0.04em) currentcolor;
  paint-order: stroke fill;
}

.cours__delie-word {
  display: block;
}

/* « le cœur. » : plein craie, ferré à droite. */
.cours__plein {
  color: var(--cf-craie);
  font-stretch: 75%;
  letter-spacing: -0.005em;
  text-align: end;
}

/*
 * Signature ferrée à droite, le haut de ses capitales à 0,18 capitale (du plein)
 * sous la ligne de base du plein (R4). Mesuré dans Chromium : sans marge, l'écart
 * vaut 0,171 × la taille du plein + 0,246 × celle de la signature ; la marge
 * ramène cet écart à 0,18 × 0,675 = 0,1215 × la taille du plein.
 */
.cours__signature {
  margin-block-start: calc(-0.0495 * var(--title-size) - 0.246em);
  text-align: end;
}

/* 320 px (zoom 400 %) : « MONTER » ne tient plus à 64 px ; le délié passe plein (R2). */
@container (max-width: 18.9rem) {
  .cours__delie,
  .cours__plein {
    font-size: calc(100cqi / 4.75);
  }

  .cours__delie {
    font-stretch: 75%;
    letter-spacing: -0.005em;
    -webkit-text-fill-color: currentcolor;
    -webkit-text-stroke: 0;
  }
}

/*
 * À partir de 48em : « Fais monter » sur une ligne, 125 % de chasse, puis 150 %.
 * La taille l'y fait tenir ; la coupure reste permise entre les deux mots, pour
 * qu'un espacement de texte élargi (WCAG 1.4.12) passe « monter » à la ligne
 * au lieu de le pousser hors de l'écran.
 */
@media (min-width: 48em) {
  .cours__title {
    --title-size: min(var(--text-h2), 100cqi / 9.3);
  }

  .cours__delie {
    font-stretch: 125%;
    white-space: normal;
  }

  .cours__delie-word {
    display: inline;
  }

  .cours__plein {
    font-stretch: var(--wdth-plein);
  }
}

@media (min-width: 64em) {
  .cours__title {
    --title-size: min(var(--text-h2), 100cqi / 11);
  }

  .cours__delie {
    font-stretch: var(--wdth-delie);
  }
}

@media (forced-colors: active) {
  .cours__delie {
    -webkit-text-fill-color: CanvasText;
    -webkit-text-stroke: 0;
  }
}

/* Titres de groupe (H3) : signature citron, 40 px à 1440. */
.cours__group {
  margin: 0;
}

/* ── 3a. Cardio en musique ─────────────────────────────────────────────────── */
.cardio {
  margin-block-start: var(--pad-s);
}

.cardio__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--pad-s);
}

/* Photo pleine largeur au-dessus de chaque cours : 4:5 (recadrage) sous 48em, 16:10 au-delà. */
.cardio__figure {
  aspect-ratio: 4 / 5;
  margin: 0 calc(-1 * var(--page-gutter)) clamp(1.25rem, 0.971rem + 1.143vw, 2rem);
}

/* Avec JS, l'image attend l'approche (data-near) ; la figure garde son format et sa plaque. */
html.js .cardio__figure:not([data-near]) :deep(.cap-photo__img) {
  display: none;
}

@media (min-width: 48em) {
  .cardio__figure {
    aspect-ratio: 16 / 10;
    margin-inline: 0;
  }
}

.cardio__stage {
  display: none;
}

/*
 * Scène collante : une seule zone de grille (« stack ») pour la scène et la
 * liste. Mouvement autorisé et 64em au moins ; sinon, les figures ci-dessus.
 *
 * Cotes tenues sous le plafond de hauteur de page (V9, 13 000 px à 1440 × 900) ;
 * écart au §4.4 consigné : la marge de --pad-s au-dessus de la scène et le titre
 * « cardio en musique » sont pris dans les 30svh du haut au lieu de s'y ajouter
 * (le premier article reste à 30svh du bas du H2), et les articles font 42svh au
 * lieu de 50svh. La scène mesure environ 189svh, titre compris, plus sa marge.
 */
@media (min-width: 64em) {
  html.has-motion .cardio {
    display: grid;
    grid-template-areas: 'stack';
  }

  html.has-motion .cardio__stage {
    position: sticky;
    inset-block-start: 0;
    display: block;
    grid-area: stack;
    align-self: start;
    block-size: 100svh;
    overflow: clip;
  }

  html.has-motion .cardio__list {
    /* La liste est posée sur la photo : jamais de gris (surface « photo »). */
    --ink-muted: var(--cf-craie);
    --rule: rgb(242 241 236 / 0.28);
    --bg: transparent;

    position: relative;
    z-index: 1;
    grid-area: stack;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: var(--gap);
    row-gap: 0;
    align-content: start;
    /*
     * Le premier article reste à 30svh sous le H2 : la marge de la scène, le titre
     * (44 px) et sa marge (64 px) y sont pris. La marge reste au-dessus de la
     * scène : sans elle, la photo touchait la signature du H2.
     */
    padding-block: max(2rem, 30svh - 6.75rem - var(--pad-s)) 40svh;
  }

  html.has-motion .cardio__list > * {
    grid-column: 1 / 8;
  }

  html.has-motion .cardio__title {
    margin-block-end: var(--pad-s);
  }

  /*
   * Le cours actif est celui dont l'article traverse le milieu de l'écran : son
   * nom est posé à mi-hauteur de l'article (moins la demi-hauteur du nom), pour
   * que le nom le plus proche du milieu soit toujours celui de la photo. En tête
   * d'article, le nom suivant passait au milieu de l'écran sur la photo
   * précédente. Un décalage fixe : ouvrir la fiche ne déplace pas le nom.
   */
  html.has-motion .cardio__item {
    min-block-size: 42svh;
    padding-block-start: calc(21svh - 2rem);
  }

  html.has-motion .cardio__figure {
    display: none;
  }
}

/*
 * Fondu enchaîné sans creux : la photo entrante (au-dessus) passe de 0 à 1 en
 * 480 ms ; la sortante reste à 1 dessous, puis s'éteint d'un coup une fois
 * recouverte. Deux fondus croisés laissaient voir le fond à 25 % à mi-course
 * (photos grisées, superposées).
 */
.cardio__shot {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0s linear var(--dur-overlay);
}

.cardio__shot.is-on {
  z-index: 1;
  opacity: 1;
  transition: opacity var(--dur-overlay) var(--ease-in-out);
}

/* Voile de scène : la colonne de texte reste lisible (p95 ≤ 0,10 sous le texte, §3.3). */
.cardio__veil {
  position: absolute;
  /* Au-dessus de la photo active (z-index 1), sinon le voile passe dessous. */
  z-index: 2;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgb(12 12 11 / 0.55) 0,
    rgb(12 12 11 / 0.55) 45%,
    rgb(12 12 11 / 0) 62%
  );
  pointer-events: none;
}

/* ── 3b. Force et intensité ────────────────────────────────────────────────── */
.force {
  /* Débord jusqu'au bord de l'écran : la marge réelle de la page, en unités du bloc. */
  --bleed: calc((100cqi - min(100cqi - 2 * var(--page-gutter), var(--content-max))) / 2);

  padding-block: var(--pad-l);
  container-type: inline-size;
}

.force__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: clamp(2rem, 1.443rem + 2.286vw, 3.5rem);
}

/* Mobile : photo 4:5 pleine largeur, puis le texte. */
.force__photo {
  aspect-ratio: 4 / 5;
  margin-inline: calc(-1 * var(--bleed));
}

.force__text {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2.5rem, 2.129rem + 1.524vw, 3.5rem);
  align-content: start;
}

@media (min-width: 48em) {
  .force__inner {
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    column-gap: var(--gap);
  }

  /* La photo 3:4 déborde à gauche ; la colonne de texte descend de 120 px. */
  .force__photo {
    grid-column: 1 / 5;
    align-self: start;
    aspect-ratio: 3 / 4;
    margin-inline: calc(-1 * var(--bleed)) calc(-1 * var(--gap));
  }

  .force__text {
    grid-column: 5 / -1;
    padding-block-start: clamp(3rem, -2.143rem + 10.714vw, 7.5rem);
    padding-inline-start: var(--gap);
  }
}

@media (min-width: 64em) {
  .force__photo {
    grid-column: 1 / 6;
  }

  .force__text {
    grid-column: 7 / -1;
    padding-inline-start: 0;
  }
}

/* L'enchaînement du mercredi : deux lignes reliées par un filet citron de 2 × 64 px. */
.chain {
  --pitch: clamp(2.75rem, 2.286rem + 1.905vw, 4rem);
}

.chain__title {
  margin: 0 0 16px;
  font-size: 1.25rem;
}

.chain__list {
  position: relative;
  display: grid;
  margin: 0;
  padding: 0 0 0 22px;
  list-style: none;
}

.chain__list::before {
  position: absolute;
  inset-block-start: calc(var(--pitch) / 2);
  inset-inline-start: 0;
  inline-size: 2px;
  block-size: var(--pitch);
  background: var(--cf-citron);
  content: '';
}

.chain__step {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 16px;
  min-block-size: var(--pitch);
  align-content: center;
}

.chain__time {
  font-size: var(--text-data-l);
  white-space: nowrap;
}

.chain__course {
  font-family: var(--font-body);
  font-size: clamp(1.125rem, 1.032rem + 0.381vw, 1.375rem);
  font-weight: 600;
  line-height: 1.2;
}

@media (forced-colors: active) {
  .chain__list::before {
    background: CanvasText;
  }
}

/* ── 3c. Retour au calme ───────────────────────────────────────────────────── */
.calme {
  position: relative;
  padding-block: var(--pad-xl);
  border-block: 1px solid var(--cf-graphite);
  background: var(--cf-carbone);
  container-type: inline-size;
}

.calme__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: clamp(2rem, 1.443rem + 2.286vw, 3.5rem);
}

.calme__photo {
  aspect-ratio: 4 / 5;
  margin-inline: calc(-1 * var(--page-gutter));
}

.calme__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--pad-s);
}

@media (min-width: 48em) {
  .calme__inner {
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    column-gap: var(--gap);
    align-items: start;
  }

  .calme__title {
    grid-column: 1 / -1;
  }

  /* La photo est calée en haut sur le premier nom ; les noms passent à sa gauche. */
  .calme__photo {
    grid-row: 2;
    grid-column: 6 / -1;
    margin-inline: 0;
  }

  .calme__list {
    grid-row: 2;
    grid-column: 1 / 6;
  }
}

@media (min-width: 64em) {
  .calme__title {
    grid-column: 2 / -1;
  }

  .calme__photo {
    grid-column: 10 / -1;
  }

  /* Les noms vont jusqu'au bout (STRETCHING passe sous la photo) ; les fiches s'arrêtent à la colonne 9. */
  .calme__list {
    grid-column: 2 / -1;
  }

  .calme__list :deep(.cap-sheet) {
    max-inline-size: calc((100% - 10 * var(--gap)) / 11 * 8 + 7 * var(--gap));
  }

  .calme__list :deep(.cap-course__phrase) {
    max-inline-size: 40ch;
  }
}

/*
 * Ligne plate (style « plat », craie 1 px) : rendue dans l'ancre sans taille
 * posée sur la ligne de base de STRETCHING, positionnée par rapport au bloc
 * (bord à bord). À partir de 48em, le nom l'interrompt ; sur mobile, elle passe
 * sous le dernier nom, toute largeur.
 */
.calme__line {
  position: absolute;
  inset-inline: 0;
  display: block;
  /* Un SVG positionné ne s'étire pas entre ses bords : largeur explicite. */
  inline-size: 100%;
  block-size: 2px;
  margin-block-start: calc(var(--name-gap, 14px) - 1px);
  overflow: visible;
  pointer-events: none;
}

.calme__line line {
  stroke: var(--cf-craie);
  stroke-width: 1;
  shape-rendering: crispEdges;
}

@media (min-width: 48em) {
  .calme__line {
    --name-gap: 0px;
  }
}

@media (forced-colors: active) {
  .calme__line line {
    stroke: CanvasText;
  }
}
</style>
