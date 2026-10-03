<script setup lang="ts">
import type { Coach, Program } from '~/types/content';

/**
 * Accordéon exclusif des programmes (motif APG « accordion »).
 *
 * - Sans JS (et au rendu serveur), tous les panneaux sont ouverts : le contenu
 *   reste lisible. Au montage, on ferme les autres, sans animation.
 * - Un seul panneau ouvert à la fois ; le rouvrir le referme.
 * - Clavier : Entrée / Espace (bouton natif), ↑ ↓ Début Fin entre les en-têtes.
 * - Ctrl+F : un panneau fermé porte `hidden="until-found"` ; sur `beforematch`,
 *   il s'ouvre aussitôt (sans transition, le navigateur défile vers le résultat).
 * - Quand l'élément ouvert est sous celui qui se ferme, le défilement compense la
 *   hauteur perdue au-dessus : l'en-tête cliqué ne bouge pas sous le pointeur.
 *
 * La durée vient du CSS (`--accordion-duration`, 0 en mouvement réduit) : le JS la
 * lit au lieu de la recopier.
 */
const props = defineProps<{ items: Program[]; coaches: Coach[] }>();
const openId = defineModel<string | null>({ required: true });

const root = useTemplateRef<HTMLElement>('root');
const enhanced = ref(false);
/** Coupe les transitions le temps d'un changement immédiat (montage, recherche). */
const instant = ref(true);
/** Panneaux qui se referment : rendus jusqu'à la fin de leur transition. */
const closing = ref(new Set<string>());
const closeTimers = new Map<string, ReturnType<typeof setTimeout>>();
let followFrame = 0;

const coachOf = (program: Program) => props.coaches.find((coach) => coach.id === program.coachId);
const isExpanded = (id: string) => !enhanced.value || openId.value === id;
const isConcealed = (id: string) => !isExpanded(id) && !closing.value.has(id);
const heads = () => [...(root.value?.querySelectorAll<HTMLElement>('[data-accordion-head]') ?? [])];

function layoutDuration(): number {
  if (!root.value) return 0;
  const value = getComputedStyle(root.value).getPropertyValue('--accordion-duration').trim();
  const amount = Number.parseFloat(value) || 0;
  return value.endsWith('ms') ? amount : amount * 1000;
}

/** Garde le panneau qui se ferme dans le rendu jusqu'à la fin de sa transition. */
function holdWhileClosing(id: string, duration: number) {
  clearTimeout(closeTimers.get(id));
  if (duration === 0) return;
  closing.value.add(id);
  closeTimers.set(
    id,
    setTimeout(() => {
      closing.value.delete(id);
      closeTimers.delete(id);
    }, duration),
  );
}

/** Le changement suivant se fait sans transition (le style est recalculé avant de les rétablir). */
async function withoutTransition(change: () => void) {
  instant.value = true;
  change();
  await nextTick();
  root.value?.getBoundingClientRect();
  instant.value = false;
}

/** Image par image, pendant la transition, annule la dérive de `head` dans la fenêtre. */
function keepInPlace(head: HTMLElement, duration: number) {
  cancelAnimationFrame(followFrame);
  const anchor = head.getBoundingClientRect().top;
  const until = performance.now() + duration + 50;
  const follow = () => {
    const drift = head.getBoundingClientRect().top - anchor;
    if (Math.abs(drift) >= 0.5) window.scrollBy({ top: drift, behavior: 'instant' });
    if (performance.now() < until) followFrame = requestAnimationFrame(follow);
  };
  followFrame = requestAnimationFrame(follow);
}

function setOpen(id: string | null, duration: number) {
  const previous = openId.value;
  if (previous === id) return;
  if (previous) holdWhileClosing(previous, duration);
  if (id) closing.value.delete(id);
  openId.value = id;
}

function toggle(index: number) {
  const id = props.items[index]?.id;
  if (!id) return;
  const next = openId.value === id ? null : id;
  const duration = layoutDuration();
  const previousIndex = props.items.findIndex((program) => program.id === openId.value);
  const head = heads()[index];
  if (next && head && previousIndex !== -1 && previousIndex < index) keepInPlace(head, duration);
  setOpen(next, duration);
}

function reveal(id: string) {
  withoutTransition(() => setOpen(id, 0));
}

const keyTargets: Record<string, (index: number, count: number) => number> = {
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

function onKeydown(event: KeyboardEvent) {
  const target = keyTargets[event.key];
  if (!target || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const list = heads();
  const index = list.indexOf(event.target as HTMLElement);
  if (index === -1) return;
  event.preventDefault();
  list[target(index, list.length)]?.focus();
}

onMounted(() => withoutTransition(() => (enhanced.value = true)));

onBeforeUnmount(() => {
  cancelAnimationFrame(followFrame);
  closeTimers.forEach((timer) => clearTimeout(timer));
});
</script>

<template>
  <div ref="root" class="program-accordion" :data-instant="instant || undefined">
    <ProgramItem
      v-for="(program, index) in items"
      :key="program.id"
      :program="program"
      :coach="coachOf(program)"
      :expanded="isExpanded(program.id)"
      :concealed="isConcealed(program.id)"
      data-motion="programs-item"
      @keydown="onKeydown"
      @toggle="toggle(index)"
      @reveal="reveal(program.id)"
    />
  </div>
</template>

<style scoped>
.program-accordion {
  --accordion-duration: var(--dur-layout);

  /* Les titres s'ajustent à la largeur de la colonne (cqi). */
  container-type: inline-size;
  border-block-start: 1px solid var(--rule);
  /* La compensation de défilement est faite à la main : pas d'ancrage natif en plus. */
  overflow-anchor: none;
}

.program-accordion[data-instant] {
  --accordion-duration: 0ms;
}

@media (prefers-reduced-motion: reduce) {
  .program-accordion {
    --accordion-duration: 0ms;
  }
}
</style>
