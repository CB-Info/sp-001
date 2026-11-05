<script setup lang="ts">
import { cap } from '~/data/cap';
import { capped, ENTRY, reached } from '~/motion/sequence';
import { duration, length, stagger } from '~/motion/tokens';
import type { Session } from '~/types/cap';
import {
  formatHeure,
  jourCourt,
  jourLong,
  prochainCours,
  sortSessions,
  semaineProchaine,
  useParisClock,
  type ParisNow,
} from '~/utils/cap-time';
import { complexAtR, path } from '~/utils/ecg';

/**
 * Comment réserver (#reserver) : le sous-bloc de « Ta semaine » où mène chaque
 * « Réserve ta place » de la page (brief docs/brief/v2.md, §4.5 et §8). Ce
 * n'est pas un chapitre : un H3, sur une bande carbone pleine largeur entre deux
 * filets.
 *
 * Trois étapes numérotées, dans l'ordre réel d'une réservation :
 * 1. choisis ton cours : le cours choisi dans une fiche ou la semaine, sinon le
 *    prochain cours à l'heure de Paris ; un lien « Changer de cours » ;
 * 2. réserve ta place : dans l'appli CAP Fitness ou à l'accueil (liens et
 *    adresse à confirmer, écrits discrètement, aucun lien mort) ;
 * 3. ajoute-le à ton agenda : un vrai fichier .ics, en action secondaire, et un
 *    pour toute la semaine ; il marche sans JS.
 * Puis « Première fois ? » : trois réponses courtes, sans attendre la FAQ.
 *
 * Rendu serveur et premier rendu client : l'horloge vaut undefined, d'où la
 * ligne neutre « Premier cours de la semaine : Pound, lun. 13 h 00 » et le .ics
 * de ce créneau. Le choix d'une fiche (état partagé « cap-choix ») ne s'affiche
 * qu'après le montage, lui aussi : l'hydratation ne voit jamais de différence.
 *
 * Mouvement, une seule entrée (fondu et montée) : les étapes 2 et 3 et
 * « Première fois ? » montent de 12 px en fondu à leur entrée, 430 ms
 * --ease-out, à 60 ms d'écart. L'état initial n'est posé que pour un bloc encore
 * hors de l'écran ; le focus clavier le montre aussitôt.
 */

const titleId = 'reserver-titre';

/** Espace insécable (U+00A0) : « mer. 19 h 00 » ne se coupe pas. */
const NBSP = ' ';

const courseOf = (slug: string) => cap.courses.find((course) => course.slug === slug);
const courseName = (slug: string) => courseOf(slug)?.nom ?? '';
/** « CAF · cuisses, abdos, fessiers » : un sigle n'est jamais seul. */
const courseLabel = (slug: string) => {
  const course = courseOf(slug);
  return course?.sousTitre ? `${course.nom} · ${course.sousTitre}` : (course?.nom ?? '');
};

/**
 * Le cours affiché : de quoi écrire la ligne de choix et viser son .ics. `now`
 * n'est passé que pour le cours choisi : le prochain cours et le premier de la
 * semaine ne retombent jamais sur un créneau déjà commencé.
 */
function shown(label: string, session: Session, now?: ParisNow) {
  const heure = formatHeure(session.start);
  const name = courseName(session.course);
  // « mer. prochain 18 h 00 », « mercredi prochain 18 h 00 » (le .ics, hebdomadaire, ne change pas).
  const prochain = semaineProchaine(session, now) ? `${NBSP}${cap.ui.jourProchain}` : '';
  return {
    label,
    name: courseLabel(session.course),
    when: `${jourCourt(session.day)}${prochain}${NBSP}${heure}`,
    /**
     * Suite masquée du nom du bouton : « Ajouter ce cours à mon agenda pour Cross
     * training, mercredi 19 h 00 ». Elle s'ouvre sur une espace et un mot
     * (cap.book.boutonSuite), jamais sur une virgule.
     */
    suite: cap.book.boutonSuite
      .replace('{cours}', name)
      .replace('{quand}', `${jourLong(session.day)}${prochain}${NBSP}${heure}`),
    href: `/v2/agenda/${session.id}.ics`,
  };
}

const first = sortSessions(cap.sessions)[0];
const clock = useParisClock();
const choice = useState<string | null>('cap-choix', () => null);

const current = computed(() => {
  if (clock.value) {
    const chosen = choice.value
      ? cap.sessions.find((session) => session.id === choice.value)
      : undefined;
    if (chosen) return shown(cap.book.choisi, chosen, clock.value);
    const next = prochainCours(cap.sessions, clock.value);
    if (next) return shown(cap.book.prochain, next.session);
  }
  return first ? shown(cap.book.premier, first) : undefined;
});

/*
 * Mini-complexe du bouton (20 × 14, style « instrument »), comme ceux de la
 * couverture et de la fin : il s'écrit au survol et au focus dans la fente
 * réservée à gauche du libellé (.cap-button--fente, v2.css). Au repos, la fente
 * est vide.
 */
const PULSE_BASELINE = 7.2;
const pulse = path([
  [0, PULSE_BASELINE],
  ...complexAtR(10, PULSE_BASELINE, 6.2),
  [20, PULSE_BASELINE],
]);

/* ── Mouvement : les colonnes Appli et Accueil ─────────────────────────────── */
const section = useTemplateRef<HTMLElement>('section');

useMotion(section, ({ gsap, ScrollTrigger }, root) => {
  const columns = [...root.querySelectorAll<HTMLElement>('[data-motion="book-col"]')];
  // Déjà à l'écran (ou dépassées) : elles restent posées.
  const waiting = columns.filter((column) => !reached(column));
  if (!waiting.length) return undefined;

  const rise = length('--move-s');
  gsap.set(waiting, { opacity: 0, y: rise });

  const revealed = new Set<HTMLElement>();
  const reveal = (batch: HTMLElement[], instant = false) => {
    const fresh = batch.filter((column) => !revealed.has(column));
    for (const column of fresh) revealed.add(column);
    if (!fresh.length) return;
    gsap.to(fresh, {
      opacity: 1,
      y: 0,
      duration: instant ? 0 : duration('--dur-layout'),
      ease: 'out',
      stagger: instant ? 0 : capped(stagger('--stagger-list')),
      clearProps: 'opacity,transform',
    });
  };

  ScrollTrigger.batch(waiting, {
    ...ENTRY,
    onEnter: (batch) => reveal(batch as HTMLElement[]),
  });

  // Le clavier arrive avant le défilement : ce qui reçoit le focus est déjà là.
  const onFocus = () => reveal(waiting, true);
  root.addEventListener('focusin', onFocus);

  return () => root.removeEventListener('focusin', onFocus);
});
</script>

<template>
  <section
    id="reserver"
    ref="section"
    class="cap-book"
    data-surface="carbone"
    :aria-labelledby="titleId"
  >
    <div class="cap-book__body cap-grid">
      <h3 :id="titleId" class="cap-book__title cap-display is-plein">{{ cap.book.titre }}</h3>

      <ol class="cap-book__steps" role="list">
        <!-- 1. Choisis ton cours -->
        <li class="cap-book__step">
          <span class="cap-book__num cap-data" aria-hidden="true">1</span>
          <h4 class="cap-book__step-titre">{{ cap.book.etapes[0] }}</h4>
          <p v-if="current" class="cap-book__choix">
            <span class="cap-book__choix-label">{{ current.label }}</span>
            {{ ' ' }}
            <span class="cap-book__choix-cours">{{ current.name }},</span>
            {{ ' ' }}
            <span class="cap-book__choix-quand cap-data">{{ current.when }}</span>
          </p>
          <p class="cap-book__lien">
            <a class="cap-link" :href="cap.book.changer.href">{{ cap.book.changer.label }}</a>
          </p>
        </li>

        <!-- 2. Réserve ta place : l'appli ou l'accueil -->
        <li class="cap-book__step" data-motion="book-col">
          <span class="cap-book__num cap-data" aria-hidden="true">2</span>
          <h4 class="cap-book__step-titre">{{ cap.book.etapes[1] }}</h4>
          <p class="cap-book__texte">{{ cap.book.reserver }}</p>
          <dl class="cap-book__voies">
            <div class="cap-book__voie">
              <dt>{{ cap.book.appli.titre }}</dt>
              <dd><CapPending :text="cap.book.appli.pending" /></dd>
            </div>
            <div class="cap-book__voie">
              <dt>{{ cap.book.accueil.titre }}</dt>
              <dd>
                <CapPending :text="cap.book.accueil.adresse" />{{ ' · '
                }}<a class="cap-link" :href="cap.book.accueil.lien.href">{{
                  cap.book.accueil.lien.label
                }}</a>
              </dd>
            </div>
          </dl>
        </li>

        <!-- 3. Ajoute-le à ton agenda : un rappel, en action secondaire. -->
        <li class="cap-book__step" data-motion="book-col">
          <span class="cap-book__num cap-data" aria-hidden="true">3</span>
          <h4 class="cap-book__step-titre">{{ cap.book.etapes[2] }}</h4>
          <div v-if="current" class="cap-book__actions">
            <a
              class="cap-book__cta cap-button cap-button--secondaire cap-button--fente"
              :href="current.href"
              download
            >
              <span class="cap-button__libelle">
                <svg
                  class="cap-button__pulse"
                  viewBox="0 0 20 14"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path :d="pulse" />
                </svg>
                {{ cap.book.bouton }}
              </span>
              <span class="visually-hidden">{{ current.suite }}</span>
            </a>
            <a class="cap-book__semaine cap-link" :href="cap.book.semaine.href" download>
              {{ cap.book.semaine.label }}
            </a>
          </div>
        </li>
      </ol>

      <!-- Première fois ? Les trois questions d'un premier visiteur. -->
      <div class="cap-book__first" data-motion="book-col">
        <h4 class="cap-book__first-titre">{{ cap.book.premiereFois.titre }}</h4>
        <dl class="cap-book__first-list">
          <div
            v-for="item in cap.book.premiereFois.items"
            :key="item.question"
            class="cap-book__first-item"
          >
            <dt>{{ item.question }}</dt>
            <dd>{{ item.reponse }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Bande carbone pleine largeur, filets graphite en haut et en bas. Titre, puis
 * trois étapes numérotées (empilées sur mobile, trois colonnes à partir de 64em,
 * séparées par un filet), puis « Première fois ? » sur toute la largeur.
 *
 * Rendu par CapWeek : la bande prend toute la largeur de son parent, qui ne
 * doit donc pas avoir de marge intérieure horizontale.
 */
.cap-book {
  container-type: inline-size;
  padding-block: var(--pad-s);
  border-block: 1px solid var(--cf-graphite);
  background: var(--cf-carbone);
  color: var(--cf-craie);
}

.cap-book__body {
  row-gap: clamp(2rem, 1.629rem + 1.524vw, 3rem); /* 32 → 48 */
  align-items: start;
  padding-inline: max(var(--page-gutter), (100cqi - var(--content-max)) / 2);
}

.cap-book__body > * {
  grid-column: 1 / -1;
}

.cap-book__title {
  margin: 0;
  font-size: var(--text-h3); /* 40 → 72 */
  line-height: 0.92;
  text-wrap: balance;
}

/* ── Les trois étapes ─────────────────────────────────────────────────────── */
.cap-book__steps {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cap-book__step {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 1rem;
  align-content: start;
  padding-block: 1.5rem;
  border-block-start: 1px solid var(--cf-filet);
}

.cap-book__step > :not(.cap-book__num) {
  grid-column: 2;
}

/* Le numéro, en donnée citron : l'ordre se lit d'un coup d'œil. */
.cap-book__num {
  grid-row: 1 / span 4;
  color: var(--cf-citron);
  font-size: clamp(2.5rem, 2.129rem + 1.524vw, 3.5rem); /* 40 → 56 */
  line-height: 0.85;
}

.cap-book__step-titre {
  margin: 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: clamp(1.125rem, 1.032rem + 0.381vw, 1.375rem); /* 18 → 22 */
  font-weight: 600;
  line-height: 1.25;
}

/*
 * La ligne de choix change d'état après le montage (neutre, prochain cours,
 * cours choisi) : deux lignes réservées, aucun état ne pousse la suite.
 */
.cap-book__choix {
  min-block-size: 3lh;
  margin: 0.5rem 0 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-body); /* 16 → 18 */
  font-weight: 400;
  line-height: 1.5;
}

.cap-book__choix-label {
  display: block;
  color: var(--cf-gris);
}

.cap-book__choix-cours {
  font-weight: 600;
}

.cap-book__choix-quand {
  font-size: var(--text-data-s); /* 16 → 20 */
  white-space: nowrap;
}

.cap-book__lien,
.cap-book__texte {
  margin: 0.25rem 0 0;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: var(--leading-body);
}

.cap-book__lien .cap-link {
  display: inline-block;
  padding-block: 0.625rem;
  font-weight: 500;
}

.cap-book__texte {
  margin-block-start: 0.5rem;
  color: var(--cf-craie);
  text-wrap: pretty;
}

/* Les deux voies : l'appli, l'accueil. */
.cap-book__voies {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0 0;
}

.cap-book__voie dt {
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
}

.cap-book__voie dd {
  margin: 0.125rem 0 0;
  font-family: var(--font-body);
  font-size: var(--text-small);
  line-height: 1.5;
}

.cap-book__voie .cap-link {
  display: inline-block;
  padding-block: 0.625rem;
  color: var(--cf-craie);
  font-weight: 500;
}

.cap-book__actions {
  display: grid;
  gap: 0.25rem;
  justify-items: start;
  margin-block-start: 1rem;
}

.cap-book__semaine {
  display: inline-flex;
  align-items: center;
  min-block-size: 44px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
}

/* ── Première fois ? ──────────────────────────────────────────────────────── */
.cap-book__first {
  padding: clamp(1.25rem, 0.971rem + 1.143vw, 2rem);
  border: 1px solid var(--cf-filet);
}

.cap-book__first-titre {
  margin: 0;
  color: var(--cf-citron);
  font-family: var(--font-body);
  font-size: clamp(1.125rem, 1.032rem + 0.381vw, 1.375rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1.25;
}

.cap-book__first-list {
  display: grid;
  gap: 1rem var(--gap);
  margin: 1rem 0 0;
}

.cap-book__first-item dt {
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
}

.cap-book__first-item dd {
  margin: 0.25rem 0 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: var(--leading-body);
  text-wrap: pretty;
}

/* ── Ordinateur : trois étapes en colonnes, « Première fois ? » en trois ──── */
@media (min-width: 64em) {
  .cap-book__steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--gap);
  }

  .cap-book__step {
    padding-block: 1.5rem 0;
  }

  .cap-book__first-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (forced-colors: active) {
  .cap-book__step,
  .cap-book__first {
    border-color: CanvasText;
  }
}
</style>
