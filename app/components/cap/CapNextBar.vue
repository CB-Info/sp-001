<script setup lang="ts">
import { cap } from '~/data/cap';
import {
  formatHeure,
  jourCourt,
  prochainCours,
  sortSessions,
  useParisClock,
} from '~/utils/cap-time';

/**
 * Barre mobile « Prochain cours » (brief §4.1) : sous 64em, et seulement avec JS
 * (rendue dans <ClientOnly> par la page). Fond carbone, filet haut graphite,
 * 64 px plus la zone de sécurité du bas.
 *
 * Elle prend le relais du bouton de la couverture : elle monte quand celui-ci est
 * sorti par le haut de l'écran, et redescend quand une autre action citron est
 * là (#reserver, #fin et au-delà) ou que le menu est ouvert. Jamais deux aplats
 * citron d'action à l'écran. Cachée, elle est inerte : rien n'y reçoit le focus.
 *
 * Le bouton n'a pas la fente du mini-complexe : la ligne du cours garde ses
 * 18 px dans 390 px de large (mesuré : « mer. 19 h 00 · Cross training »,
 * 227 px), et la barre ne vit que sous 64em, là où le survol est rare.
 */
const NBSP = ' ';
/** Marge laissée au-dessus de la barre à un élément focalisé qu'elle aurait masqué (px). */
const FOCUS_CLEARANCE = 16;
/** Place de l'en-tête collant au-dessus d'un élément focalisé (px) : celle des ancres. */
const HEADER_ROOM = 88;

const open = useState<boolean>('cap-menu', () => false);
const clock = useParisClock();
/** Le bouton de la couverture est passé au-dessus de l'écran. */
const coverPassed = ref(false);
/** #reserver à l'écran, ou #fin à l'écran ou dépassé. */
const relayed = ref(false);
const shown = computed(() => coverPassed.value && !relayed.value && !open.value);

const first = sortSessions(cap.sessions)[0];
const courseName = (slug: string) =>
  cap.courses.find((course) => course.slug === slug)?.nom ?? slug;

const next = computed(() => {
  const found = clock.value && prochainCours(cap.sessions, clock.value);
  const session = found ? found.session : first;
  const when = session ? `${jourCourt(session.day)}${NBSP}${formatHeure(session.start)}` : '';
  const course = session ? courseName(session.course) : '';
  return {
    label: found ? cap.ui.nextLabel : cap.ui.firstLabel,
    when,
    course,
    /** Nombre de signes de la ligne « mer. 19 h 00 · Cross training » (taille, voir le CSS). */
    signs: when.length + course.length + 3,
  };
});

const root = useTemplateRef<HTMLElement>('root');
const observers: IntersectionObserver[] = [];

/**
 * La barre ne masque jamais le focus (critère 2.4.11) : le navigateur a déjà
 * amené l'élément dans la fenêtre ; s'il passe sous la barre, on le remonte.
 */
function onFocusIn(event: FocusEvent) {
  const target = event.target;
  const box = root.value?.getBoundingClientRect();
  // Barre non rendue (≥ 64em, display: none) : rien ne peut masquer le focus.
  if (!shown.value || !box || box.height === 0 || !(target instanceof Element)) return;
  // Seulement le focus clavier : un clic souris ne doit jamais faire défiler la page
  // entre l'appui et le relâchement (le clic serait perdu).
  if (!target.matches(':focus-visible')) return;
  const edge = box.top;
  if (root.value?.contains(target) || target.closest('dialog')) return;
  const { top, bottom } = target.getBoundingClientRect();
  if (bottom <= edge) return;
  // Un élément plus haut que la place libre garde son haut sous l'en-tête (88 px, comme les ancres).
  const shift = Math.min(bottom - edge + FOCUS_CLEARANCE, top - HEADER_ROOM);
  if (shift > 0) scrollBy({ top: shift, behavior: 'instant' });
}

onMounted(() => {
  document.addEventListener('focusin', onFocusIn);

  const cover = document.querySelector('[data-cover-cta]');
  if (cover) {
    const observer = new IntersectionObserver(([entry]) => {
      coverPassed.value = Boolean(
        entry && !entry.isIntersecting && entry.boundingClientRect.top < 0,
      );
    });
    observer.observe(cover);
    observers.push(observer);
  } else {
    coverPassed.value = true;
  }

  const zones = ['reserver', 'fin']
    .map((id) => document.getElementById(id))
    .filter((zone): zone is HTMLElement => zone !== null);
  if (!zones.length) return;
  const inZone = new Set<Element>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      // La fin et le pied de page qui la suit gardent la barre baissée.
      const past = entry.target.id === 'fin' && entry.boundingClientRect.bottom < 0;
      if (entry.isIntersecting || past) inZone.add(entry.target);
      else inZone.delete(entry.target);
    }
    relayed.value = inZone.size > 0;
  });
  for (const zone of zones) observer.observe(zone);
  observers.push(observer);
});

onBeforeUnmount(() => {
  document.removeEventListener('focusin', onFocusIn);
  for (const observer of observers) observer.disconnect();
});
</script>

<template>
  <aside
    ref="root"
    class="cap-next"
    :class="{ 'is-shown': shown }"
    :aria-label="cap.ui.nextLabel"
    :inert="!shown"
  >
    <p class="cap-next__text">
      <span class="cap-next__label">{{ next.label }}</span>
      <span class="cap-next__data cap-data" :style="{ '--signs': next.signs }">
        <span class="cap-next__nowrap">{{ next.when }} ·</span>
        {{ ' ' }}
        <span class="cap-next__nowrap">{{ next.course }}</span>
      </span>
    </p>
    <a class="cap-button cap-next__cta" href="#reserver">{{ cap.ui.reserveShort }}</a>
  </aside>
</template>

<style scoped>
.cap-next {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-block-size: calc(64px + env(safe-area-inset-bottom, 0px));
  padding-block: 8px calc(8px + env(safe-area-inset-bottom, 0px));
  padding-inline: max(var(--page-gutter), env(safe-area-inset-left, 0px))
    max(var(--page-gutter), env(safe-area-inset-right, 0px));
  border-block-start: 1px solid var(--cf-graphite);
  background: var(--cf-carbone);
  color: var(--cf-craie);
  container-type: inline-size;
  translate: 0 100%;
  visibility: hidden;
}

.cap-next.is-shown {
  translate: 0 0;
  visibility: visible;
}

/* Elle monte en 240 ms et redescend plus vite (0,65 ×), sans jamais rebondir. */
html.has-motion .cap-next {
  --next-exit: calc(var(--dur-state) * 0.65);

  transition:
    translate var(--next-exit) var(--ease-in),
    visibility 0s linear var(--next-exit);
}

html.has-motion .cap-next.is-shown {
  transition:
    translate var(--dur-state) var(--ease-out-soft),
    visibility 0s;
}

.cap-next__text {
  display: grid;
  gap: 4px;
  min-inline-size: 0;
  margin: 0;
}

.cap-next__label {
  color: var(--cf-citron);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-style: italic;
  font-weight: 500;
  line-height: 1.2;
}

/*
 * 18 px tant que la ligne tient à côté du bouton (12 px d'écart, bouton de 118 px).
 * Sa largeur est estimée à 0,45 em par signe (mesuré : 0,41 à 0,434 em) ; 15 px au
 * plus petit, puis (zoom) elle passe à la ligne au « · ».
 */
.cap-next__data {
  font-size: clamp(0.9375rem, (100cqi - 130px) / (var(--signs) * 0.45), 1.125rem);
  line-height: 1.1;
}

.cap-next__nowrap {
  white-space: nowrap;
}

.cap-next__cta {
  flex: none;
}

@media (min-width: 64em) {
  .cap-next {
    display: none;
  }
}

@media (forced-colors: active) {
  .cap-next {
    border-block-start-color: CanvasText;
  }
}
</style>
