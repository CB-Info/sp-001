<script setup lang="ts">
import type { ClubContent } from '~/data/club';

/**
 * Champ « Floque ton maillot ». Le prénom saisi se floque sur le maillot du
 * hero et revient dans le formulaire d'essai (état partagé `club-flock`).
 *
 * Sans JS, un champ qui ne ferait rien tromperait : le rendu serveur montre un
 * lien de même gabarit vers le formulaire, remplacé par le champ au montage.
 */
const props = defineProps<{ content: ClubContent['hero']['jersey'] }>();
const model = defineModel<string>({ required: true });

/** Douze caractères au plus : lettres (accents compris), espace, trait d'union, apostrophe. */
const MAX = 12;
const clean = (value: string) =>
  value
    .replace(/[^\p{L}\s'’-]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, MAX);

function onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = clean(input.value);
  if (value !== input.value) input.value = value;
  model.value = value;
}

const inputId = 'flocage';
const hintId = 'flocage-aide';
</script>

<template>
  <div class="flock">
    <ClientOnly>
      <label class="flock__label club-label" :for="inputId">{{ props.content.label }}</label>
      <div class="flock__field">
        <input
          :id="inputId"
          class="flock__input"
          type="text"
          name="prenom-maillot"
          :value="model"
          :maxlength="MAX"
          autocomplete="given-name"
          autocapitalize="words"
          spellcheck="false"
          enterkeyhint="done"
          :placeholder="props.content.inputPlaceholder"
          :aria-describedby="hintId"
          @input="onInput"
        />
        <span class="flock__count club-number" aria-hidden="true"
          >{{ model.length }}/{{ MAX }}</span
        >
      </div>
      <p :id="hintId" class="flock__hint">{{ props.content.hint }}</p>

      <template #fallback>
        <span class="flock__label club-label" aria-hidden="true">{{ props.content.label }}</span>
        <a class="flock__field flock__field--link" href="#essai">
          {{ props.content.fallback }}
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" />
          </svg>
        </a>
        <p class="flock__hint">{{ props.content.hint }}</p>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.flock {
  display: grid;
  gap: var(--space-8);
  inline-size: min(100%, 22rem);
}

.flock__label {
  color: var(--accent);
}

.flock__field {
  position: relative;
  display: flex;
  align-items: center;
  min-block-size: 3.5rem;
  border-radius: var(--radius-pill);
  background: var(--kit-white);
  color: var(--pitch-950);
  box-shadow: inset 0 0 0 var(--line-pitch) var(--kit-white);
  transition: box-shadow var(--dur-feedback) var(--ease-out-soft);
}

.flock__field:focus-within {
  box-shadow:
    inset 0 0 0 var(--line-pitch) var(--kit-white),
    0 0 0 3px var(--canary-400);
}

.flock__input {
  inline-size: 100%;
  min-block-size: 3.5rem;
  padding: 0 4.25rem 0 1.375rem;
  border: 0;
  border-radius: inherit;
  background: transparent;
  color: inherit;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  font-stretch: var(--stretch-wide);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.flock__input::placeholder {
  color: var(--slate-600);
  font-weight: 600;
  opacity: 1;
}

.flock__input:focus-visible {
  outline: none;
}

.flock__count {
  position: absolute;
  inset-inline-end: 1.25rem;
  color: var(--slate-600);
  font-size: var(--text-label);
}

.flock__field--link {
  gap: var(--space-12);
  justify-content: space-between;
  padding-inline: 1.375rem;
  font-family: var(--font-display);
  font-size: var(--text-ui);
  font-weight: 800;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.04em;
  text-decoration: none;
  text-transform: uppercase;
}

.flock__field--link:focus-visible {
  outline: 3px solid var(--canary-400);
  outline-offset: 3px;
}

.flock__field--link svg {
  inline-size: 1.25rem;
  block-size: 1.25rem;
  flex: none;
}

.flock__hint {
  color: var(--ink-secondary);
  font-size: var(--text-label);
}
</style>
