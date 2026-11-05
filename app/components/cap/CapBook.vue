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
  useParisClock,
} from '~/utils/cap-time';
import { complexAtR, path } from '~/utils/ecg';

/**
 * Réserver (#reserver) : le sous-bloc de « Ta semaine » où mène chaque « Réserve
 * ta place » de la page (brief docs/brief/v2.md, §4.5). Ce n'est pas un
 * chapitre : un H3, sur une bande carbone pleine largeur entre deux filets.
 *
 * Une réponse honnête, en trois voies :
 * - l'agenda : un vrai fichier .ics pour le cours affiché (le cours choisi dans
 *   une fiche, sinon le prochain cours à l'heure de Paris), et un pour les huit
 *   créneaux ; il marche sans JS ;
 * - l'appli CAP Fitness : ses liens de store ne sont pas connus, ce sont deux
 *   cadres pointillés, ni liens ni focalisables (aucun lien mort) ;
 * - l'accueil : l'adresse est à confirmer, le lien mène aux infos pratiques.
 *
 * Rendu serveur et premier rendu client : l'horloge vaut undefined, d'où la
 * ligne neutre « Premier cours de la semaine : Pound, lun. 13 h 00 » et le .ics
 * de ce créneau. Le choix d'une fiche (état partagé « cap-choix ») ne s'affiche
 * qu'après le montage, lui aussi : l'hydratation ne voit jamais de différence.
 *
 * Mouvement, une seule entrée (fondu et montée, occurrence n° 2 de la page) :
 * les colonnes Appli et Accueil montent de 12 px en fondu à leur entrée,
 * 430 ms --ease-out, à 60 ms d'écart. L'état initial n'est posé que pour une
 * colonne encore hors de l'écran ; le focus clavier la montre aussitôt.
 */

const titleId = 'reserver-titre';

/** Espace insécable (U+00A0) : « mer. 19 h 00 » ne se coupe pas. */
const NBSP = ' ';

const courseName = (slug: string) => cap.courses.find((course) => course.slug === slug)?.nom ?? '';

/** Le cours affiché : de quoi écrire la ligne de choix et viser son .ics. */
function shown(label: string, session: Session) {
  const heure = formatHeure(session.start);
  const name = courseName(session.course);
  return {
    label,
    name,
    when: `${jourCourt(session.day)}${NBSP}${heure}`,
    /**
     * Suite masquée du nom du bouton : « Ajouter ce cours à mon agenda pour Cross
     * training, mercredi 19 h 00 ». Elle s'ouvre sur une espace et un mot
     * (cap.book.boutonSuite), jamais sur une virgule.
     */
    suite: cap.book.boutonSuite
      .replace('{cours}', name)
      .replace('{quand}', `${jourLong(session.day)}${NBSP}${heure}`),
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
    if (chosen) return shown(cap.book.choisi, chosen);
    const next = prochainCours(cap.sessions, clock.value);
    if (next) return shown(cap.book.prochain, next.session);
  }
  return first ? shown(cap.book.premier, first) : undefined;
});

/*
 * La note se termine par « à confirmer. » : ce bout passe par CapPending
 * (pointillé), le code d'état de toute la page pour ce qui attend le club.
 */
const note = (() => {
  const text = cap.book.note;
  const pending = cap.ui.pending;
  const at = text.lastIndexOf(pending);
  return at < 0
    ? { lead: text, pending: '', tail: '' }
    : { lead: text.slice(0, at), pending, tail: text.slice(at + pending.length) };
})();

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
      <!-- L'agenda : la voie qui marche dès maintenant, sans JS. -->
      <div class="cap-book__main">
        <h3 :id="titleId" class="cap-book__title cap-display is-plein">{{ cap.book.titre }}</h3>

        <p v-if="current" class="cap-book__choix">
          <span class="cap-book__choix-label">{{ current.label }}</span>
          {{ ' ' }}
          <span class="cap-book__choix-valeur">
            <span class="cap-book__choix-cours">{{ current.name }},</span>
            {{ ' ' }}
            <span class="cap-book__choix-quand cap-data">{{ current.when }}</span>
          </span>
        </p>

        <div v-if="current" class="cap-book__actions">
          <a
            class="cap-book__cta cap-button cap-button--l cap-button--fente"
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

        <p class="cap-book__note">
          {{ note.lead }}<CapPending v-if="note.pending" :text="note.pending" />{{ note.tail }}
        </p>
      </div>

      <!-- L'appli : liens de store inconnus, donc ni liens ni focalisables. -->
      <div class="cap-book__col cap-book__col--appli" data-motion="book-col">
        <h4 class="cap-book__col-titre">{{ cap.book.appli.titre }}</h4>
        <p class="cap-book__col-texte">{{ cap.book.appli.texte }}</p>
        <ul class="cap-book__stores" role="list">
          <li v-for="store in cap.book.appli.stores" :key="store" class="cap-book__store">
            {{ store }}
          </li>
        </ul>
      </div>

      <!-- L'accueil : précédé d'un filet vertical. -->
      <div class="cap-book__col cap-book__col--accueil" data-motion="book-col">
        <h4 class="cap-book__col-titre">{{ cap.book.accueil.titre }}</h4>
        <p class="cap-book__col-texte">{{ cap.book.accueil.texte }}</p>
        <p class="cap-book__adresse">
          <CapPending :text="cap.book.accueil.adresse" />
        </p>
        <p class="cap-book__infos">
          <a class="cap-link" :href="cap.book.accueil.lien.href">{{
            cap.book.accueil.lien.label
          }}</a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Cotes @1440 (brief §4.5) : bande carbone pleine largeur, filets graphite en
 * haut et en bas, 64 px de marge intérieure ; colonnes 1 à 6 (x 60 à 708) pour
 * le titre (72 px, 611 px de large) et l'agenda, 7 à 9 (x 732 à 1044) pour
 * l'appli, 10 à 12 (x 1068 à 1380) pour l'accueil, le filet vertical au milieu
 * de la gouttière (x 1056). @390 : tout est empilé, titre à 40 px, bouton
 * pleine largeur.
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
  row-gap: clamp(2.5rem, 2.214rem + 1.172vw, 3rem); /* 40 → 48 */
  align-items: start;
  padding-inline: max(var(--page-gutter), (100cqi - var(--content-max)) / 2);
}

.cap-book__body > * {
  grid-column: 1 / -1;
}

/* ── L'agenda ─────────────────────────────────────────────────────────────── */
.cap-book__title {
  margin: 0;
  font-size: var(--text-h3); /* 40 → 72 */
  line-height: 0.92;
  text-wrap: balance;
}

/*
 * La ligne de choix change d'état après le montage (neutre, prochain cours,
 * cours choisi) : aucun état ne doit pousser le bouton. Sur mobile, le libellé
 * et le cours tiennent chacun leur ligne, réservées.
 */
.cap-book__choix {
  min-block-size: 2lh;
  margin: clamp(1.25rem, 1.064rem + 0.762vw, 1.75rem) 0 0; /* 20 → 28 */
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-body); /* 16 → 18 */
  font-weight: 500;
  line-height: 1.5;
}

.cap-book__choix-label {
  display: block;
}

.cap-book__choix-valeur {
  white-space: nowrap;
}

.cap-book__choix-quand {
  font-size: var(--text-data-s); /* 16 → 20 */
}

.cap-book__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: center;
  margin-block-start: clamp(1rem, 0.814rem + 0.762vw, 1.5rem); /* 16 → 24 */
}

/* Mobile : le bouton prend toute la largeur. */
.cap-book__cta {
  inline-size: 100%;
}

/* Lien secondaire : une cible de 44 px, alignée sur le bouton. */
.cap-book__semaine {
  display: inline-flex;
  align-items: center;
  min-block-size: 44px;
  font-family: var(--font-body);
  font-size: var(--text-body); /* 16 → 18 */
  font-weight: 500;
}

.cap-book__note {
  margin: 0.75rem 0 0;
  color: var(--cf-gris);
  font-family: var(--font-body);
  font-size: var(--text-small); /* 14 → 15 */
  font-weight: 500;
  line-height: 1.4;
  text-wrap: pretty;
}

/* ── Appli et accueil ─────────────────────────────────────────────────────── */
.cap-book__col {
  position: relative;
}

.cap-book__col-titre {
  margin: 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-body); /* 16 → 18 */
  font-weight: 600;
  line-height: 1.3;
}

.cap-book__col-texte {
  margin: 0.5rem 0 0;
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: var(--leading-body);
  text-wrap: pretty;
}

/* Cadres « à venir » : filet pointillé ; ni liens, ni focalisables. */
.cap-book__stores {
  display: grid;
  gap: 0.5rem;
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
}

.cap-book__store {
  display: flex;
  align-items: center;
  min-block-size: 44px;
  padding: 0.5rem 1rem;
  border: 1px dashed var(--cf-pointille);
  color: var(--cf-craie);
  font-family: var(--font-body);
  font-size: var(--text-small); /* 14 → 15 */
  font-weight: 500;
  line-height: 1.3;
}

.cap-book__adresse {
  margin: 1.25rem 0 0;
  font-size: var(--text-small);
  line-height: 1.4;
}

.cap-book__infos {
  margin: 0.5rem 0 0;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
}

.cap-book__infos .cap-link {
  display: inline-block;
  padding-block: 0.625rem;
}

/* Mobile : l'accueil se sépare de l'appli par un filet horizontal. */
.cap-book__col--accueil {
  padding-block-start: clamp(2.5rem, 2.214rem + 1.172vw, 3rem);
  border-block-start: 1px solid var(--cf-filet);
}

/* ── Tablette : agenda en tête, appli et accueil côte à côte ──────────────── */
@media (min-width: 48em) {
  /*
   * Une seule ligne : la plus longue (« Premier cours de la semaine : Cross
   * training, mer. 12 h 15 ») mesure 435 px, la colonne 450 px à 1024.
   */
  .cap-book__choix {
    min-block-size: 1lh;
  }

  .cap-book__choix-label {
    display: inline;
  }

  .cap-book__cta {
    inline-size: auto;
  }

  .cap-book__body > .cap-book__col--appli {
    grid-column: 1 / 5;
  }

  .cap-book__body > .cap-book__col--accueil {
    grid-column: 5 / -1;
  }

  /* Filet vertical, au milieu de la gouttière qui précède la colonne. */
  .cap-book__col--accueil {
    align-self: stretch;
    padding-block-start: 0;
    border-block-start: 0;
  }

  .cap-book__col--accueil::before {
    position: absolute;
    inset-block: 0;
    inset-inline-start: calc(var(--gap) / -2);
    inline-size: 1px;
    background: var(--cf-filet);
    content: '';
  }
}

/* ── Ordinateur : colonnes 1 à 6, 7 à 9, 10 à 12 ──────────────────────────── */
@media (min-width: 64em) {
  .cap-book__body > .cap-book__main {
    grid-column: 1 / 7;
  }

  .cap-book__body > .cap-book__col--appli {
    grid-column: 7 / 10;
  }

  .cap-book__body > .cap-book__col--accueil {
    grid-column: 10 / -1;
  }
}

@media (forced-colors: active) {
  .cap-book__store,
  .cap-book__col--accueil {
    border-color: CanvasText;
  }

  .cap-book__col--accueil::before {
    background: CanvasText;
  }
}
</style>
