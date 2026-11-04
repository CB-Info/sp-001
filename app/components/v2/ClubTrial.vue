<script setup lang="ts">
import { club } from '~/data/club';
import type { DisciplineId } from '~/types/club';

/**
 * Séance d'essai : le formulaire de démonstration. Le prénom floqué sur le
 * maillot du hero y revient ; la discipline choisie dans le calendrier aussi.
 *
 * Validation à l'envoi (messages en français, liés aux champs, focus sur le
 * premier en erreur), puis un billet d'essai « s'imprime » à la place du
 * formulaire. Rien n'est transmis : il n'y a ni serveur ni requête, et la page
 * le dit. Sans JS, le bouton reste désactivé et une note l'explique : un envoi
 * réel mettrait les données dans l'URL.
 */
const titleId = 'essai-titre';
const content = club.trial;
const disciplines = club.disciplines.items;

const flock = useState<string>('club-flock', () => '');
const filter = useState<DisciplineId | 'all'>('club-filter', () => 'all');

const ready = ref(false);
const submitted = ref(false);
const form = reactive({
  firstName: '',
  email: '',
  discipline: '' as DisciplineId | '',
  moment: '',
});
const errors = reactive<Record<'firstName' | 'email' | 'discipline', string>>({
  firstName: '',
  email: '',
  discipline: '',
});

onMounted(() => {
  ready.value = true;
});

// Le prénom du maillot et la discipline du calendrier pré-remplissent le formulaire,
// tant que le visiteur n'y a rien écrit lui-même.
watch(
  () => flock.value.trim(),
  (name, previous) => {
    if (!form.firstName || form.firstName === previous) form.firstName = name;
  },
  { immediate: true },
);
watch(
  filter,
  (id) => {
    if (id !== 'all' && !form.discipline) form.discipline = id;
  },
  { immediate: true },
);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate() {
  errors.firstName = form.firstName.trim() ? '' : content.errors.firstName;
  errors.email = EMAIL.test(form.email.trim()) ? '' : content.errors.email;
  errors.discipline = form.discipline ? '' : content.errors.discipline;
  return !errors.firstName && !errors.email && !errors.discipline;
}

const ids = {
  firstName: 'essai-prenom',
  email: 'essai-email',
  discipline: 'essai-discipline',
} as const;
const ticketTitle = useTemplateRef<HTMLElement>('ticketTitle');

async function submit() {
  if (!validate()) {
    const first = (['firstName', 'email', 'discipline'] as const).find((key) => errors[key]);
    if (first) document.getElementById(ids[first])?.focus();
    return;
  }
  submitted.value = true;
  await nextTick();
  ticketTitle.value?.focus();
}

async function edit() {
  submitted.value = false;
  await nextTick();
  document.getElementById(ids.firstName)?.focus();
}

/** Numéro du billet : tiré du prénom, stable d'un essai à l'autre. */
const serial = computed(() => {
  let hash = 7;
  for (const char of form.firstName.toLocaleUpperCase('fr'))
    hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  return String(hash).padStart(4, '0');
});
const disciplineName = computed(
  () => disciplines.find(({ id }) => id === form.discipline)?.name ?? '',
);
</script>

<template>
  <section id="essai" class="club-section trial" data-surface="pitch" :aria-labelledby="titleId">
    <div class="trial__circle" aria-hidden="true" />
    <div class="container trial__grid">
      <div class="trial__intro">
        <ClubSectionHead
          :number="12"
          :kicker="content.kicker"
          :title="content.title"
          :title-id="titleId"
          :lead="content.lead"
        />
        <p class="trial__demo">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16.5v.5" />
          </svg>
          {{ content.demo }}
        </p>
      </div>

      <div class="trial__slot">
        <form v-if="!submitted" class="trial__form" novalidate @submit.prevent="submit">
          <div class="field" :class="{ 'field--error': errors.firstName }">
            <label class="field__label" :for="ids.firstName">{{
              content.fields.firstName.label
            }}</label>
            <input
              :id="ids.firstName"
              v-model="form.firstName"
              class="field__input"
              type="text"
              name="prenom"
              required
              maxlength="40"
              :autocomplete="content.fields.firstName.autocomplete"
              :aria-invalid="errors.firstName ? 'true' : undefined"
              :aria-describedby="errors.firstName ? `${ids.firstName}-erreur` : undefined"
            />
            <p v-if="errors.firstName" :id="`${ids.firstName}-erreur`" class="field__error">
              {{ errors.firstName }}
            </p>
          </div>

          <div class="field" :class="{ 'field--error': errors.email }">
            <label class="field__label" :for="ids.email">{{ content.fields.email.label }}</label>
            <input
              :id="ids.email"
              v-model="form.email"
              class="field__input"
              type="email"
              name="email"
              required
              inputmode="email"
              :autocomplete="content.fields.email.autocomplete"
              :aria-invalid="errors.email ? 'true' : undefined"
              :aria-describedby="`${ids.email}-aide${errors.email ? ` ${ids.email}-erreur` : ''}`"
            />
            <p :id="`${ids.email}-aide`" class="field__hint">{{ content.fields.email.hint }}</p>
            <p v-if="errors.email" :id="`${ids.email}-erreur`" class="field__error">
              {{ errors.email }}
            </p>
          </div>

          <div class="field" :class="{ 'field--error': errors.discipline }">
            <label class="field__label" :for="ids.discipline">{{
              content.fields.discipline.label
            }}</label>
            <select
              :id="ids.discipline"
              v-model="form.discipline"
              class="field__input field__select"
              name="discipline"
              required
              :aria-invalid="errors.discipline ? 'true' : undefined"
              :aria-describedby="errors.discipline ? `${ids.discipline}-erreur` : undefined"
            >
              <option value="" disabled>{{ content.fields.discipline.placeholder }}</option>
              <option v-for="item in disciplines" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
            <p v-if="errors.discipline" :id="`${ids.discipline}-erreur`" class="field__error">
              {{ errors.discipline }}
            </p>
          </div>

          <fieldset class="field field--choices">
            <legend class="field__label">{{ content.fields.moment.label }}</legend>
            <div class="choices">
              <label v-for="option in content.fields.moment.options" :key="option" class="choice">
                <input
                  v-model="form.moment"
                  class="choice__radio"
                  type="radio"
                  name="moment"
                  :value="option"
                />
                <span>{{ option }}</span>
              </label>
            </div>
          </fieldset>

          <button class="club-action trial__submit" type="submit" :disabled="!ready">
            {{ content.submit }}
            <svg
              class="club-action__arrow"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4 12h15M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
              />
            </svg>
          </button>
          <p class="field__hint trial__noscript">{{ content.noScript }}</p>
        </form>

        <div v-else class="ticket" role="group" :aria-labelledby="`${titleId}-billet`">
          <div class="ticket__paper">
            <div class="ticket__head">
              <span class="ticket__crest"><ClubCrest /></span>
              <div>
                <h3 :id="`${titleId}-billet`" ref="ticketTitle" class="ticket__title" tabindex="-1">
                  {{ content.ticket.title }}
                </h3>
                <p class="ticket__season club-label">
                  {{ club.name }} · {{ content.ticket.season }}
                </p>
              </div>
            </div>
            <dl class="ticket__lines">
              <div class="ticket__line ticket__line--name">
                <dt class="club-label">{{ content.ticket.holder }}</dt>
                <dd class="ticket__name">{{ form.firstName }}</dd>
              </div>
              <div class="ticket__line">
                <dt class="club-label">{{ content.ticket.discipline }}</dt>
                <dd>{{ disciplineName }}</dd>
              </div>
              <div v-if="form.moment" class="ticket__line">
                <dt class="club-label">{{ content.ticket.moment }}</dt>
                <dd>{{ form.moment }}</dd>
              </div>
              <div class="ticket__line">
                <dt class="club-label">{{ content.ticket.number }}</dt>
                <dd class="club-number ticket__serial">{{ serial }}</dd>
              </div>
            </dl>
            <p class="ticket__admit club-label">{{ content.ticket.admit }}</p>
            <p class="ticket__footer">{{ content.ticket.footer }}</p>
            <span class="ticket__bars" aria-hidden="true" />
          </div>
          <button class="club-action club-action--outline ticket__edit" type="button" @click="edit">
            {{ content.ticket.again }}
          </button>
        </div>
        <p class="visually-hidden" role="status">{{ submitted ? content.ticket.announce : '' }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trial {
  overflow: clip;
}

.trial__circle {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 0;
  inline-size: min(90vw, 44rem);
  aspect-ratio: 1;
  border: var(--line-pitch) solid var(--chalk);
  border-radius: 50%;
  translate: -62% -50%;
  opacity: 0.35;
  pointer-events: none;
}

.trial__grid {
  position: relative;
  display: grid;
  gap: var(--block-gap) var(--gap);
}

.trial__intro {
  display: grid;
  gap: var(--space-32);
  align-content: start;
}

.trial__demo {
  display: flex;
  gap: var(--space-12);
  max-inline-size: 30rem;
  padding: var(--space-16) var(--space-20);
  border: 1px solid var(--rule);
  border-radius: var(--radius-card);
  color: var(--ink-secondary);
  font-size: var(--text-label);
}

.trial__demo svg {
  inline-size: 1.25rem;
  block-size: 1.25rem;
  flex: none;
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
  stroke-linecap: round;
}

/* ── Le formulaire : une carte blanche sur le terrain ────────────────────── */
.trial__form {
  --bg: var(--kit-white);
  --ink: var(--pitch-950);
  --ink-secondary: var(--slate-600);
  --rule: rgb(11 36 24 / 0.2);
  --accent: var(--pitch-800);
  --accent-fill: var(--canary-400);
  --accent-fill-hover: var(--canary-300);
  --on-accent: var(--pitch-950);
  --focus: var(--pitch-800);
  --error: var(--alert-700);

  display: grid;
  gap: var(--space-24);
  padding: clamp(1.25rem, 0.8rem + 2vw, 2.5rem);
  border-radius: var(--radius-card);
  background: var(--bg);
  color: var(--ink);
  box-shadow: var(--shadow-lift);
}

.field {
  display: grid;
  gap: var(--space-8);
  margin: 0;
  padding: 0;
  border: 0;
}

.field__label {
  padding: 0;
  font-family: var(--font-display);
  font-size: var(--text-label);
  font-weight: 800;
  font-stretch: var(--stretch-semi);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.field__input {
  inline-size: 100%;
  min-block-size: 3.25rem;
  padding: 0.75rem 1rem;
  border: var(--line-pitch) solid var(--rule);
  border-radius: var(--radius-small);
  background: var(--mist-50);
  color: var(--ink);
  font: inherit;
  font-size: 1.0625rem;
  transition:
    border-color var(--dur-feedback) var(--ease-out-soft),
    background-color var(--dur-feedback) var(--ease-out-soft);
}

.field__input:hover {
  border-color: rgb(11 36 24 / 0.4);
}

.field__input:focus-visible {
  border-color: var(--pitch-800);
  background: var(--kit-white);
  outline: 3px solid var(--canary-400);
  outline-offset: 1px;
}

.field__select {
  appearance: none;
  padding-inline-end: 2.75rem;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--pitch-800) 50%),
    linear-gradient(135deg, var(--pitch-800) 50%, transparent 50%);
  background-position:
    calc(100% - 1.375rem) 55%,
    calc(100% - 1rem) 55%;
  background-size:
    0.375rem 0.375rem,
    0.375rem 0.375rem;
  background-repeat: no-repeat;
}

.field--error .field__input {
  border-color: var(--error);
}

.field__hint {
  color: var(--ink-secondary);
  font-size: var(--text-label);
}

.field__error {
  display: flex;
  gap: 0.375rem;
  color: var(--error);
  font-size: var(--text-label);
  font-weight: 600;
}

.field__error::before {
  content: '!';
  display: inline-grid;
  place-items: center;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  flex: none;
  border-radius: 50%;
  background: var(--error);
  color: var(--kit-white);
  font-size: 0.75rem;
  font-weight: 800;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.choice {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-block-size: 2.75rem;
  padding: 0.5rem 1rem;
  border: var(--line-pitch) solid var(--rule);
  border-radius: var(--radius-pill);
  font-size: var(--text-label);
  font-weight: 600;
  cursor: pointer;
}

.choice__radio {
  position: absolute;
  inset: 0;
  margin: 0;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}

.choice:has(.choice__radio:checked) {
  border-color: var(--pitch-800);
  background: var(--pitch-800);
  color: var(--kit-white);
}

.choice:has(.choice__radio:focus-visible) {
  outline: 3px solid var(--canary-400);
  outline-offset: 2px;
}

.trial__submit {
  justify-self: start;
}

/* Sans JS seulement : html.js est posé avant le premier rendu (boot.inline.js). */
html.js .trial__noscript {
  display: none;
}

.trial__submit:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ── Le billet d'essai ───────────────────────────────────────────────────── */
.ticket {
  display: grid;
  gap: var(--space-24);
  justify-items: start;
}

.ticket__paper {
  --ink: var(--pitch-950);
  --ink-secondary: var(--slate-600);

  position: relative;
  display: grid;
  gap: var(--space-20);
  inline-size: 100%;
  padding: var(--space-32) var(--space-32) var(--space-40);
  border-radius: var(--radius-card) var(--radius-card) 4px 4px;
  background:
    radial-gradient(circle at 50% 100%, var(--pitch-800) 0.5rem, transparent 0.55rem) 0 100% /
      1.5rem 1rem repeat-x,
    var(--kit-white);
  color: var(--ink);
  box-shadow: var(--shadow-lift);
}

html.has-motion .ticket__paper {
  animation: ticket-print var(--seq-max) var(--ease-out) both;
}

/* Le billet sort de la fente de haut en bas, par à-coups, comme d'une imprimante. */
@keyframes ticket-print {
  0% {
    clip-path: inset(0 0 100% 0);
    translate: 0 calc(-1 * var(--move-l));
  }

  30% {
    clip-path: inset(0 0 62% 0);
  }

  45% {
    clip-path: inset(0 0 58% 0);
  }

  75% {
    clip-path: inset(0 0 12% 0);
  }

  100% {
    clip-path: inset(0 0 0 0);
    translate: 0 0;
  }
}

.ticket__head {
  display: flex;
  gap: var(--space-16);
  align-items: center;
  padding-block-end: var(--space-20);
  border-block-end: 2px dashed var(--rule, rgb(11 36 24 / 0.2));
}

.ticket__crest {
  display: block;
  flex: none;
  aspect-ratio: 64 / 76;
  block-size: 3.5rem;
}

.ticket__title {
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem);
  line-height: 1;
}

.ticket__title:focus {
  outline: none;
}

.ticket__season {
  color: var(--pitch-800);
}

.ticket__lines {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-16) var(--space-24);
}

.ticket__line {
  display: grid;
  gap: 0.125rem;
}

.ticket__line dt {
  color: var(--slate-600);
  font-size: 0.75rem;
}

.ticket__line dd {
  margin: 0;
  font-weight: 600;
}

.ticket__line--name {
  grid-column: 1 / -1;
}

.ticket__line .ticket__name {
  font-family: var(--font-display);
  font-size: clamp(2rem, 1.6rem + 1.6vw, 3rem);
  font-weight: 900;
  font-stretch: var(--stretch-wide);
  line-height: 1;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.ticket__line .ticket__serial {
  font-size: 1.5rem;
}

.ticket__admit {
  justify-self: start;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-pill);
  background: var(--canary-400);
  color: var(--pitch-950);
}

.ticket__footer {
  color: var(--slate-600);
  font-size: var(--text-label);
}

.ticket__bars {
  display: block;
  block-size: 2.5rem;
  background: repeating-linear-gradient(
    90deg,
    var(--pitch-950) 0 2px,
    transparent 2px 5px,
    var(--pitch-950) 5px 6px,
    transparent 6px 9px,
    var(--pitch-950) 9px 12px,
    transparent 12px 14px
  );
  opacity: 0.85;
}

@media (min-width: 64rem) {
  .trial__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    align-items: start;
  }

  .trial__intro {
    grid-column: 1 / span 5;
    position: sticky;
    inset-block-start: calc(var(--header-height-compact) + var(--space-32));
  }

  .trial__slot {
    grid-column: 7 / -1;
  }
}
</style>
