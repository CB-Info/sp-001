// Configuration ESLint (flat config) : règles Nuxt + accessibilité des templates Vue.
import vueA11y from 'eslint-plugin-vuejs-accessibility';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(...vueA11y.configs['flat/recommended'], {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'error',
    // Les libellés de formulaire sont imbriqués ou reliés par id selon le cas.
    'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
  },
});
