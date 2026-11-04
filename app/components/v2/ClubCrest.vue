<script setup lang="ts">
/**
 * Écusson du club : bouclier vert cerclé de canari, la bande du maillot en
 * travers, une kettlebell au-dessus. Version `detailed` (pied de page) : le nom
 * dans la bande, la ville et l'année dessous.
 *
 * Décoratif par défaut (aria-hidden) : le lien ou le titre qui le porte nomme le
 * club. Avec `label`, c'est une image nommée.
 */
const props = withDefaults(defineProps<{ detailed?: boolean; label?: string }>(), {
  detailed: false,
  label: undefined,
});

const id = useId();
const clip = `crest-clip-${id}`;
</script>

<template>
  <svg
    class="crest"
    viewBox="0 0 64 76"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label"
    :aria-hidden="props.label ? undefined : 'true'"
    focusable="false"
  >
    <defs>
      <clipPath :id="clip">
        <path d="M9 8h46v29c0 14-9.6 24-23 30.4C18.6 61 9 51 9 37Z" />
      </clipPath>
    </defs>
    <!-- Cerclage canari, puis le champ vert. -->
    <path
      class="crest__rim"
      d="M6.5 3h51A3.5 3.5 0 0 1 61 6.5V37c0 17.5-12.4 29.6-29 36.5C15.4 66.6 3 54.5 3 37V6.5A3.5 3.5 0 0 1 6.5 3Z"
    />
    <path class="crest__field" d="M9 8h46v29c0 14-9.6 24-23 30.4C18.6 61 9 51 9 37Z" />
    <g :clip-path="`url(#${clip})`">
      <rect
        class="crest__band"
        x="0"
        :y="detailed ? 29 : 31"
        width="64"
        :height="detailed ? 13 : 10"
      />
    </g>
    <!-- Kettlebell : anse et corps. -->
    <path class="crest__handle" d="M27.2 20.5v-3.2a4.8 4.8 0 0 1 9.6 0v3.2" />
    <circle class="crest__bell" cx="32" cy="23.4" r="5.6" />
    <template v-if="detailed">
      <text class="crest__name" x="32" y="38.6" text-anchor="middle">CLUSEM</text>
      <text class="crest__city" x="32" y="51" text-anchor="middle">LYON</text>
      <text class="crest__year" x="32" y="57.5" text-anchor="middle">2019</text>
    </template>
    <path
      v-else
      class="crest__star"
      d="m32 47.2 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5Z"
    />
  </svg>
</template>

<style scoped>
.crest {
  display: block;
  inline-size: auto;
  block-size: 100%;
  aspect-ratio: 64 / 76;
  overflow: visible;
}

.crest__rim {
  fill: var(--canary-400);
}

.crest__field {
  fill: var(--pitch-800);
}

.crest__band {
  fill: var(--canary-400);
}

.crest__handle {
  fill: none;
  stroke: var(--kit-white);
  stroke-width: 2.6;
  stroke-linecap: round;
}

.crest__bell,
.crest__star {
  fill: var(--kit-white);
}

.crest__name,
.crest__city,
.crest__year {
  font-family: var(--font-display);
  font-weight: 800;
}

.crest__name {
  fill: var(--pitch-950);
  font-size: 8.4px;
  font-stretch: 112.5%;
  letter-spacing: 0.02em;
}

.crest__city {
  fill: var(--kit-white);
  font-size: 5.4px;
  font-stretch: 125%;
  letter-spacing: 0.14em;
}

.crest__year {
  fill: var(--canary-400);
  font-size: 4.6px;
  font-stretch: 75%;
  letter-spacing: 0.1em;
}

@media (forced-colors: active) {
  .crest__rim,
  .crest__band,
  .crest__bell,
  .crest__star {
    fill: CanvasText;
  }

  .crest__field {
    fill: Canvas;
  }

  .crest__handle {
    stroke: CanvasText;
  }
}
</style>
