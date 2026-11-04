<script setup lang="ts">
import type { NavLink } from '~/types/club';

/**
 * En-tête du club, sur le vert : écusson et nom, navigation, pilule « Séance
 * d'essai ». Collant ; il se resserre dès qu'on quitte le haut de la page.
 *
 * Sur mobile, la navigation passe dans le tiroir « vestiaire » : un popover
 * natif (bouton popovertarget), qui s'ouvre, se ferme à Échap et au clic
 * extérieur sans JS. Avec JS, suivre un lien le referme aussi.
 */
defineProps<{
  name: string;
  nav: NavLink[];
  cta: NavLink;
  labels: { home: string; menu: string; menuClose: string; menuTitle: string };
}>();

const drawerId = 'vestiaire';
const compact = ref(false);
const drawer = useTemplateRef<HTMLElement>('drawer');

let frame = 0;
const measure = () => {
  frame = 0;
  compact.value = scrollY > 24;
};
const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(measure);
};

onMounted(() => {
  measure();
  addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => {
  removeEventListener('scroll', onScroll);
  cancelAnimationFrame(frame);
});

/** Un lien suivi depuis le tiroir le referme (le popover ne le fait pas seul). */
function closeDrawer() {
  const element = drawer.value as (HTMLElement & { hidePopover?: () => void }) | null;
  if (element?.matches(':popover-open')) element.hidePopover?.();
}
</script>

<template>
  <header class="club-header" :class="{ 'club-header--compact': compact }" data-surface="pitch">
    <div class="container club-header__bar">
      <a class="club-header__brand" href="#haut" :aria-label="labels.home">
        <span class="club-header__crest"><ClubCrest /></span>
        <span class="club-header__name" aria-hidden="true">{{ name }}</span>
      </a>

      <nav class="club-header__nav" aria-label="Navigation principale">
        <ul class="club-header__links" role="list">
          <li v-for="link in nav" :key="link.href">
            <a class="club-header__link" :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <a class="club-action club-action--small club-header__cta" :href="cta.href">{{
        cta.label
      }}</a>

      <button
        class="club-header__menu"
        type="button"
        :popovertarget="drawerId"
        :aria-controls="drawerId"
      >
        <svg
          class="club-header__menu-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
        <span>{{ labels.menu }}</span>
      </button>
    </div>

    <div
      :id="drawerId"
      ref="drawer"
      class="club-drawer"
      popover
      data-surface="pitch"
      role="dialog"
      :aria-label="labels.menuTitle"
    >
      <div class="club-drawer__head">
        <p class="club-drawer__title club-label">{{ labels.menuTitle }}</p>
        <button
          class="club-drawer__close"
          type="button"
          :popovertarget="drawerId"
          popovertargetaction="hide"
          :aria-label="labels.menuClose"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <nav aria-label="Navigation du vestiaire">
        <ol class="club-drawer__links" role="list">
          <li v-for="(link, index) in nav" :key="link.href">
            <a class="club-drawer__link" :href="link.href" @click="closeDrawer">
              <span class="club-drawer__number club-number" aria-hidden="true">{{
                index + 1
              }}</span>
              {{ link.label }}
            </a>
          </li>
        </ol>
      </nav>
      <a class="club-action club-drawer__cta" :href="cta.href" @click="closeDrawer">{{
        cta.label
      }}</a>
    </div>
  </header>
</template>

<style scoped>
.club-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 40;
  border-block-end: 1px solid transparent;
  transition:
    border-color var(--dur-state) var(--ease-out-soft),
    box-shadow var(--dur-state) var(--ease-out-soft);
}

.club-header--compact {
  border-block-end-color: var(--rule);
  box-shadow: 0 10px 24px -18px rgb(0 0 0 / 0.6);
}

.club-header__bar {
  display: flex;
  gap: var(--space-24);
  align-items: center;
  block-size: var(--header-height);
  transition: block-size var(--dur-layout) var(--ease-out);
}

.club-header--compact .club-header__bar {
  block-size: var(--header-height-compact);
}

.club-header__brand {
  display: inline-flex;
  gap: 0.625rem;
  align-items: center;
  margin-inline-end: auto;
  color: var(--ink);
  text-decoration: none;
}

.club-header__crest {
  display: block;
  flex: none;
  aspect-ratio: 64 / 76;
  block-size: 2.625rem;
  transition: block-size var(--dur-layout) var(--ease-out);
}

.club-header--compact .club-header__crest {
  block-size: 2.25rem;
}

.club-header__name {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 800;
  font-stretch: var(--stretch-wide);
  letter-spacing: 0.02em;
  line-height: 1;
}

.club-header__nav {
  display: none;
}

.club-header__links {
  display: flex;
  gap: clamp(1rem, 0.2rem + 1.4vw, 2rem);
}

.club-header__link {
  position: relative;
  display: inline-block;
  padding-block: 0.5rem;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-label);
  font-weight: 700;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;
}

/* Souligné canari tracé depuis la gauche : le filet de touche sous le lien. */
.club-header__link::after {
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0.125rem;
  block-size: var(--line-pitch);
  background: var(--accent);
  content: '';
  scale: 0 1;
  transform-origin: right;
  transition: scale var(--dur-underline-out) var(--ease-in);
}

.club-header__link:hover::after,
.club-header__link:focus-visible::after {
  scale: 1 1;
  transform-origin: left;
  transition: scale var(--dur-underline-in) var(--ease-out);
}

.club-header__cta {
  display: none;
}

.club-header__menu {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  min-block-size: 2.75rem;
  padding: 0.5rem 1rem 0.5rem 0.75rem;
  border: var(--line-pitch) solid var(--chalk);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-label);
  font-weight: 700;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.club-header__menu-icon {
  inline-size: 1.25rem;
  block-size: 1.25rem;
  fill: none;
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
}

@media (min-width: 40rem) {
  .club-header__cta {
    display: inline-flex;
  }
}

@media (min-width: 75rem) {
  .club-header__nav {
    display: block;
  }

  .club-header__menu {
    display: none;
  }

  .club-header__brand {
    margin-inline-end: 0;
  }

  .club-header__nav {
    margin-inline: auto;
  }
}

/* ── Tiroir « vestiaire » (popover natif) ─────────────────────────────────── */
.club-drawer {
  position: fixed;
  inset: 0 0 0 auto;
  inline-size: min(24rem, 88vw);
  block-size: 100dvh;
  max-block-size: none;
  margin: 0;
  padding: var(--space-20) var(--page-gutter) var(--space-32);
  border: 0;
  border-inline-start: var(--line-pitch) solid var(--chalk);
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0 4.5rem,
      rgb(255 255 255 / 0.035) 4.5rem 9rem
    ),
    var(--bg);
  color: var(--ink);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.club-drawer:popover-open {
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
}

.club-drawer::backdrop {
  background: rgb(3 20 11 / 0.55);
}

html.has-motion .club-drawer:popover-open {
  animation: drawer-in var(--dur-overlay) var(--ease-out) both;
}

@keyframes drawer-in {
  from {
    translate: 100% 0;
  }
}

.club-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.club-drawer__title {
  color: var(--accent);
}

.club-drawer__close {
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border: var(--line-pitch) solid var(--chalk);
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.club-drawer__close svg {
  inline-size: 1.25rem;
  block-size: 1.25rem;
  fill: none;
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
}

.club-drawer__links {
  display: grid;
}

.club-drawer__link {
  display: flex;
  gap: var(--space-16);
  align-items: baseline;
  padding-block: var(--space-16);
  border-block-end: 1px solid var(--rule);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  font-stretch: var(--stretch-wide);
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
}

.club-drawer__number {
  min-inline-size: 1.5ch;
  color: var(--accent);
  font-size: 1.125rem;
}

.club-drawer__cta {
  margin-block-start: auto;
}
</style>
