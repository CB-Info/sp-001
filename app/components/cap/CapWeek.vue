<script lang="ts">
import { cap } from '~/data/cap';
import { reached } from '~/motion/sequence';
import { duration } from '~/motion/tokens';
import type { Day, Session } from '~/types/cap';
import {
  commence,
  formatHeure,
  jourCourt,
  jourLong,
  prochainCours,
  sortSessions,
  toMinutes,
  useParisClock,
} from '~/utils/cap-time';

/** Un créneau du planning, composé une fois pour toutes au rendu serveur. */
export interface WeekSlot {
  id: string;
  day: Day;
  /** « 18:15 », pour `<time datetime>`. */
  start: string;
  /** Minutes depuis minuit : la position sur l'axe. */
  minutes: number;
  /** « 18 h 15 ». */
  heure: string;
  nom: string;
  /** Étiquettes de mise en avant, séparées par des espaces (`[data-tags~=…]`). */
  tags: string;
  ics: string;
  /** Suffixe masqué du lien de réservation : « , réserver, lundi ». */
  suffixe: string;
  /** Nom accessible du lien agenda : « Ajouter le Cardio Jump du lundi, 18 h 15 à mon agenda ». */
  agenda: string;
  /** Le créneau suivant du même jour commence moins d'une heure après (lun. 18 h 15). */
  serre: boolean;
}

export interface WeekDay {
  day: Day;
  /** « lundi » (titre du jour). */
  long: string;
  /** « Lun. » (onglet mobile). */
  short: string;
  slots: WeekSlot[];
}
</script>

<script setup lang="ts">
/**
 * Chapitre 4, « Ta semaine » (#semaine) : la pièce maîtresse (brief
 * docs/brief/v2.md, §4.5). Les huit créneaux réels du flyer, tracés à l'heure de
 * Paris en cinq dérivations, du lundi au vendredi.
 *
 * Titre, gabarit G4 (l'horizontale) : « Ta » délié craie et « semaine. » plein
 * craie sur une seule ligne, à la même taille, comme CAPFITNESS dans le logo. Le
 * H2 ne bouge jamais. Sous 48em, les deux mots passent sur deux lignes : sur une
 * seule, « Ta » tomberait sous les 64 px d'un délié (R2).
 *
 * Composition :
 * - le chapeau et la ligne d'état temps réel (boîte de hauteur réservée : aucun
 *   saut quand l'horloge arrive) ;
 * - CapWeekFocus, le sélecteur « Mettre en avant » : des radios natives, et le
 *   CSS seul (`:has()`, plus bas) aplatit les créneaux hors sélection, avec ou
 *   sans JS ;
 * - CapWeekStrip (≥ 64em) : la bande, cinq pistes sur papier ECG ;
 * - CapWeekDay (< 64em) : la semaine jour par jour, en onglets avec JS, empilée
 *   sans JS ;
 * - la ligne du week-end, les mentions, puis CapBook (#reserver), le sous-bloc
 *   où mène chaque « Réserve ta place ».
 *
 * Temps réel : l'horloge (useParisClock) vaut undefined au rendu serveur et au
 * premier rendu client, d'où les libellés neutres ; les états (jour courant,
 * prochain cours, commencé, maintenant) n'apparaissent qu'après le montage,
 * sans différence d'hydratation.
 *
 * Mouvement : O1 « Cinq dérivations » (§5.4). Un curseur unique balaie la bande
 * au défilement (scrub de top 75 % à top 25 %) ; la variable --cursor, posée sur
 * la bande, pilote la découpe des cinq pistes et la position du curseur. À 1, le
 * scrub est tué et la bande reste écrite ; le curseur rejoint « maintenant »
 * (--dur-layout, --ease-in-out) ou s'efface hors des plages horaires. Un focus
 * clavier dans la section pousse aussitôt la progression à 1. L'état initial
 * n'est posé que si la bande est hors de l'écran à l'arrivée de GSAP ; sans JS
 * et en mouvement réduit, la bande est entièrement tracée.
 */
const w = cap.week;
const titleId = 'semaine-titre';
const NBSP = ' ';
/** Séparateur typographique (point médian lié à ce qui le précède). */
const SEP = `${NBSP}· `;

const courseName = (slug: string) => cap.courses.find((course) => course.slug === slug)?.nom ?? '';
const when = (session: Session) => `${jourCourt(session.day)}${NBSP}${formatHeure(session.start)}`;

/* ── Les cinq jours, composés au rendu serveur ─────────────────────────────── */
const sessions = sortSessions(cap.sessions);
/** Sous une heure d'écart, l'étiquette du premier créneau manque de place (bande étroite). */
const TIGHT = 60;
const WEEKDAYS = [0, 1, 2, 3, 4] as const;

const days: WeekDay[] = WEEKDAYS.map((day) => {
  const list = sessions.filter((session) => session.day === day);
  return {
    day,
    long: jourLong(day),
    short: w.jours[day] ?? jourCourt(day),
    slots: list.map((session, index) => {
      const minutes = toMinutes(session.start);
      const following = list[index + 1];
      const nom = courseName(session.course);
      const heure = formatHeure(session.start);
      return {
        id: session.id,
        day,
        start: session.start,
        minutes,
        heure,
        nom,
        tags: session.tags.join(' '),
        ics: `/v2/agenda/${session.id}.ics`,
        suffixe: w.reserverSuffixe.replace('{jour}', jourLong(day)),
        agenda: cap.courseSection.ajouter
          .replace('{cours}', nom)
          .replace('{jour}', jourLong(day))
          .replace('{heure}', heure),
        serre: following ? toMinutes(following.start) - minutes < TIGHT : false,
      };
    }),
  };
});

/* ── Temps réel, à l'heure de Paris ────────────────────────────────────────── */
const clock = useParisClock();
const first = sessions[0];

/** Jour courant, du lundi au vendredi (le week-end n'a pas de piste). */
const today = computed(() =>
  clock.value && clock.value.day <= 4 ? (clock.value.day as Day) : undefined,
);
const next = computed(() => (clock.value ? prochainCours(cap.sessions, clock.value) : undefined));
const started = computed(() => (clock.value ? commence(cap.sessions, clock.value) : undefined));

/**
 * Ligne d'état. Rendu serveur : « Premier cours de la semaine : lun. 13 h 00 ·
 * Pound ». Avec l'horloge : « Commencé à 18 h 00 : CAF. » s'il y a lieu, puis
 * « Prochain cours : mer. 19 h 00 · Cross training ».
 */
const etat = computed(() => {
  const found = next.value?.session ?? first;
  const begun = started.value;
  return {
    label: next.value ? w.etat.prochain : w.etat.premier,
    value: found ? `${when(found)}${SEP}${courseName(found.course)}` : '',
    started: begun
      ? w.etat.commence
          .replace('{heure}', formatHeure(begun.start))
          .replace('{cours}', courseName(begun.course))
      : undefined,
  };
});

/** Mentions : « à confirmer » passe par CapPending (le pointillé de l'inconnu). */
const mentions = (() => {
  const at = w.mentions.indexOf(cap.ui.pending);
  if (at === -1) return { before: w.mentions, pending: '', after: '' };
  return {
    before: w.mentions.slice(0, at),
    pending: cap.ui.pending,
    after: w.mentions.slice(at + cap.ui.pending.length),
  };
})();

/* ── O1 « Cinq dérivations » ───────────────────────────────────────────────── */
/** La bande n'existe qu'à partir de 64em (CapWeekStrip) ; en dessous, rien ne s'écrit. */
const BAND_MEDIA = '(min-width: 64em)';
const section = useTemplateRef<HTMLElement>('section');

useMotion(section, ({ gsap }, root, contextSafe) => {
  const band = root.querySelector<HTMLElement>('[data-motion="semaine-bande"]');
  const cursor = root.querySelector<HTMLElement>('[data-motion="semaine-curseur"]');
  // Déjà à l'écran à l'arrivée de GSAP (ancre, rechargement) : la bande reste écrite.
  if (!band || !cursor || !matchMedia(BAND_MEDIA).matches || reached(band)) return undefined;

  // État initial : le curseur à 11 h 30, les pistes découvertes jusqu'à lui seulement.
  band.dataset.ecriture = 'scrub';
  // Écrire : vitesse de papier constante, liée au défilement (ease 'none').
  const scrub = gsap.fromTo(
    band,
    { '--cursor': '0%' },
    {
      '--cursor': '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: band,
        start: 'top 75%',
        end: 'top 25%',
        scrub: true,
        onLeave: () => settle(),
      },
    },
  );

  let landing: gsap.core.Tween | undefined;
  /** Fin de l'écriture : la bande reste tracée, le curseur se pose. */
  const release = () => {
    delete band.dataset.ecriture;
    gsap.set(band, { clearProps: '--cursor' });
    gsap.set(cursor, { clearProps: 'opacity,visibility' });
  };

  let settled = false;
  /** Progression à 1, scrub tué ; puis le curseur rejoint « maintenant », ou s'efface. */
  const settle = contextSafe(() => {
    if (settled) return;
    settled = true;
    scrub.scrollTrigger?.kill();
    scrub.kill();
    gsap.set(band, { '--cursor': '100%' });
    band.dataset.ecriture = 'pose';
    const now = band.dataset.now ? band.style.getPropertyValue('--now-x').trim() : '';
    landing = now
      ? gsap.to(band, {
          '--cursor': now,
          duration: duration('--dur-layout'),
          ease: 'in-out',
          onComplete: release,
        })
      : gsap.to(cursor, {
          autoAlpha: 0,
          duration: duration('--dur-state'),
          ease: 'in',
          onComplete: release,
        });
  });

  // Clavier : un focus dans la section montre aussitôt la bande entière.
  root.addEventListener('focusin', settle);

  return () => {
    root.removeEventListener('focusin', settle);
    scrub.scrollTrigger?.kill();
    scrub.kill();
    landing?.kill();
    release();
  };
});
</script>

<template>
  <section
    id="semaine"
    ref="section"
    class="cap-week"
    data-surface="nuit"
    :aria-labelledby="titleId"
  >
    <div class="cap-week__inner">
      <div class="cap-week__head cap-grid">
        <!-- Titre G4 : l'horizontale -->
        <div class="cap-week__title-box">
          <h2 :id="titleId" class="cap-week__title">
            <span class="cap-week__delie cap-display is-delie is-delie--craie">{{ w.delie }}</span>
            {{ ' ' }}
            <span class="cap-week__plein cap-display is-plein">{{ w.plein }}</span>
          </h2>
        </div>

        <div class="cap-week__aside">
          <p class="cap-week__chapeau">{{ w.chapeau }}</p>
          <!-- Hauteur réservée : l'horloge arrive sans rien déplacer. -->
          <div class="cap-week__etat">
            <p v-if="etat.started" class="cap-week__commence">{{ etat.started }}</p>
            <p class="cap-week__prochain">
              <span class="cap-week__prochain-label">{{ etat.label }}{{ NBSP }}:</span>
              {{ ' ' }}
              <span class="cap-week__prochain-value cap-data">{{ etat.value }}</span>
            </p>
          </div>
        </div>
      </div>

      <CapWeekFocus class="cap-week__focus" />

      <CapWeekStrip
        class="cap-week__strip"
        :days="days"
        :now="clock"
        :today="today"
        :next-id="next?.session.id"
        :started-id="started?.id"
      />

      <CapWeekDay
        class="cap-week__days"
        :days="days"
        :now="clock"
        :today="today"
        :next-id="next?.session.id"
        :started-id="started?.id"
      />

      <div class="cap-week__foot cap-grid">
        <p class="cap-week__weekend">{{ w.weekend }}</p>
        <p class="cap-week__mentions">
          {{ mentions.before
          }}<CapPending
            v-if="mentions.pending"
            class="cap-week__pending"
            :text="mentions.pending"
          />{{ mentions.after }}
        </p>
      </div>
    </div>

    <CapBook />
  </section>
</template>

<style scoped>
.cap-week {
  background: var(--bg);
  color: var(--ink);
}

/* Colonne de contenu : marges de page, 1760 px au plus. */
.cap-week__inner {
  inline-size: min(100% - 2 * var(--page-gutter), var(--content-max));
  margin-inline: auto;
  padding-block: var(--pad-l) var(--pad-s);
}

/* ── Titre G4 ──────────────────────────────────────────────────────────────── */
.cap-week__head {
  row-gap: 24px;
  align-items: start;
}

.cap-week__title-box {
  grid-column: 1 / -1;
  container-type: inline-size;
}

/*
 * Mobile : deux lignes, « TA » délié (chasse 100 %) au-dessus de « SEMAINE. »
 * plein (75 %), qui remplit la largeur (3,93 em mesurés, marge comprise).
 */
.cap-week__title {
  --title-size: calc(100cqi / 3.96);

  margin: 0;
  font-family: var(--font-display);
  font-size: var(--title-size);
  font-stretch: 75%;
  font-weight: 900;
  line-height: var(--leading-heading);
}

.cap-week__delie,
.cap-week__plein {
  line-height: var(--leading-heading);
}

.cap-week__delie {
  display: inline-block;
  inline-size: 100%;
  font-stretch: 100%;
}

/*
 * À partir de 48em : une seule ligne, « Ta » délié 150 % et « semaine. » plein
 * 80 % à la même taille (120 px à 1440), séparés de 0,10 capitale (12 px). La
 * ligne fait 6,382 em (mesurés dans Chromium) : elle tient dans les colonnes 1 à
 * 7, plus un tiers de gouttière (120 px à 1440, au moins 16 px avant le chapeau
 * plus bas). L'espace du titre, en chasse 80 %, mesure 0,1975 em : l'approche
 * des mots la ramène à 0,10 em.
 */
@media (min-width: 48em) {
  .cap-week__title {
    --title-size: min(var(--text-h2), (100cqi + var(--gap) / 3) / 6.39);

    font-stretch: var(--wdth-plein);
    word-spacing: -0.0975em;
    white-space: nowrap;
  }

  .cap-week__delie {
    display: inline;
    inline-size: auto;
    font-stretch: var(--wdth-delie);
  }
}

/* ── Chapeau et ligne d'état ───────────────────────────────────────────────── */
.cap-week__aside {
  grid-column: 1 / -1;
  max-inline-size: 36rem;
}

/* 20/28 à 1440, 17 px à 390. */
.cap-week__chapeau {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: clamp(1.0625rem, 0.99rem + 0.3vw, 1.25rem);
  font-weight: 400;
  line-height: 1.4;
  text-wrap: pretty;
}

/*
 * Boîte réservée pour deux lignes d'état, contenu calé en bas : sans « commencé »,
 * le prochain cours garde sa place et l'espace libre reste au-dessus.
 */
.cap-week__etat {
  display: grid;
  align-content: end;
  gap: 6px;
  min-block-size: 5.5rem;
  margin-block-start: 16px;
}

.cap-week__commence {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
}

.cap-week__prochain {
  margin: 0;
  line-height: 1.25;
}

.cap-week__prochain-label {
  color: var(--cf-citron);
  font-family: var(--font-body);
  font-size: 1rem;
  font-style: italic;
  font-weight: 500;
}

.cap-week__prochain-value {
  color: var(--ink);
  font-size: clamp(1.25rem, 1.157rem + 0.381vw, 1.5rem);
  white-space: nowrap;
}

@media (min-width: 64em) {
  .cap-week__title-box {
    grid-column: 1 / 8;
  }

  /* Colonnes 8 à 12, la capitale du chapeau à hauteur de celle du titre. */
  .cap-week__aside {
    grid-column: 8 / -1;
    max-inline-size: none;
  }

  .cap-week__etat {
    min-block-size: 3.75rem;
    margin-block-start: 20px;
  }
}

/* ── Sélecteur, bande, jours ───────────────────────────────────────────────── */
.cap-week__focus {
  margin-block-start: 48px;
}

.cap-week__strip,
.cap-week__days {
  margin-block-start: 40px;
}

@media (min-width: 64em) {
  .cap-week__focus {
    margin-block-start: 72px;
  }

  .cap-week__strip {
    margin-block-start: 48px;
  }
}

/* ── Week-end et mentions ──────────────────────────────────────────────────── */
.cap-week__foot {
  row-gap: 12px;
  margin-block-start: 32px;
}

.cap-week__weekend,
.cap-week__mentions {
  grid-column: 1 / -1;
  margin: 0;
  font-family: var(--font-body);
  line-height: 1.45;
  text-wrap: pretty;
}

.cap-week__weekend {
  color: var(--ink-muted);
  font-size: 0.9375rem;
  font-style: italic;
}

.cap-week__mentions {
  max-inline-size: 44rem;
  color: var(--ink-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Au même alignement que la bande (colonne 3). */
@media (min-width: 64em) {
  .cap-week__weekend,
  .cap-week__mentions {
    grid-column: 3 / -1;
  }
}
</style>

<style>
/*
 * « Mettre en avant », en CSS seul (marche sans JS) : la radio cochée de
 * CapWeekFocus désigne une étiquette ; tout élément [data-tags] de la semaine qui
 * ne la porte pas passe hors sélection. Ces variables sont lues par la bande, les
 * jours et la piste Bien-être :
 * - le complexe s'aplatit (scaleY ou scaleX 0,06, origine sur la ligne de base)
 *   et son tracé passe en --cf-passe ;
 * - le libellé passe en gris, graisse 400 ;
 * - le suffixe masqué « (hors sélection) » apparaît pour les lecteurs d'écran.
 * Rien ne disparaît : le créneau reste dans la liste, lisible et focalisable.
 * Feuille non scopée : les radios et les créneaux vivent dans des composants
 * différents ; les noms de classe portent le préfixe de la section.
 */
[data-site='v2'] .cap-week:has(#focus-cardio:checked) [data-tags]:not([data-tags~='cardio']),
[data-site='v2'] .cap-week:has(#focus-force:checked) [data-tags]:not([data-tags~='force']),
[data-site='v2'] .cap-week:has(#focus-midi:checked) [data-tags]:not([data-tags~='midi']),
[data-site='v2'] .cap-week:has(#focus-reprends:checked) [data-tags]:not([data-tags~='reprends']),
[data-site='v2'] .cap-week:has(#focus-defouler:checked) [data-tags]:not([data-tags~='defouler']),
[data-site='v2'] .cap-week:has(#focus-solide:checked) [data-tags]:not([data-tags~='solide']) {
  --qrs-ink: var(--cf-passe);
  --qrs-width: 2px;
  --qrs-scale: 0.06;
  --slot-ink: var(--cf-gris);
  --slot-weight: 400;
  --hors-display: inline;
}
</style>
