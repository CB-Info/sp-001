<script setup lang="ts">
/**
 * Statistique d'About : un chiffre en Tektur et son libellé en capitales.
 *
 * Le chiffre reste du vrai texte (visible sans JS). Chaque caractère est posé dans
 * son propre <span> pour le futur compteur à rouleaux, accroché par `motion`
 * (data-motion) ; ce découpage est masqué aux lecteurs d'écran, qui lisent à la
 * place `spoken`, la valeur entière, une seule fois.
 */
const props = withDefaults(
  defineProps<{
    value: string;
    label: string;
    /** Échelle accolée au chiffre, en petit sur la ligne de base (« /5 »). */
    suffix?: string;
    /** Forme lue par les lecteurs d'écran (« 4,9 sur 5 ») ; par défaut, le texte affiché. */
    spoken?: string;
    motion?: string;
  }>(),
  { suffix: '', spoken: undefined, motion: undefined },
);

const glyphs = computed(() =>
  Array.from(props.value, (char) => ({ char, isDigit: /\d/.test(char) })),
);
</script>

<template>
  <div class="stat-figure">
    <p class="stat-figure__value">
      <span class="visually-hidden">{{ spoken ?? `${value}${suffix}` }}</span>
      <span class="stat-figure__glyphs" aria-hidden="true" :data-motion="motion">
        <span
          v-for="(glyph, index) in glyphs"
          :key="index"
          :class="glyph.isDigit ? 'stat-figure__digit' : 'stat-figure__mark'"
          >{{ glyph.char }}</span
        >
      </span>
      <span v-if="suffix" class="stat-figure__suffix" aria-hidden="true">{{ suffix }}</span>
    </p>
    <p class="stat-figure__label">{{ label }}</p>
  </div>
</template>

<style scoped>
.stat-figure__value {
  font-family: var(--font-display);
  font-size: var(--text-stat);
  font-weight: 600;
  /* Boîte de ligne serrée sur les capitales (capitale 0,7 em) : le libellé se cale dessous. */
  line-height: 0.82;
  letter-spacing: var(--tracking-heading);
  color: var(--stat-ink, currentColor);
}

/*
 * Chiffres qui changeront (rouleaux) : tabulaires, pour qu'ils ne sautillent pas.
 * Chaque glyphe est un bloc en ligne (transformable) ; jamais un élément flex, qui
 * ferait copier « 4,9 » sur trois lignes.
 */
.stat-figure__glyphs {
  font-variant-numeric: tabular-nums;
}

.stat-figure__digit,
.stat-figure__mark {
  display: inline-block;
}

/* Mesuré : « /5 » à ≈ 40 % du chiffre, posé sur la même ligne de base. */
.stat-figure__suffix {
  margin-inline-start: 0.06em;
  font-size: 0.4em;
  letter-spacing: 0;
}

.stat-figure__label {
  /* Mesuré : le libellé de la note passe sur 2 lignes de ≈ 255 px. */
  max-inline-size: 16rem;
  /* Mesuré : ≈ 20 px de la ligne de base du chiffre aux capitales du libellé. */
  margin-block-start: var(--space-12);
  font-size: var(--text-micro);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  text-wrap: balance;
}
</style>
