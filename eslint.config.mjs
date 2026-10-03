// Configuration ESLint (flat config) : règles Nuxt + accessibilité des templates Vue.
import vueA11y from 'eslint-plugin-vuejs-accessibility';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(...vueA11y.configs['flat/recommended'], {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'error',
    // Prettier écrit les éléments vides `<img />` : la règle suit Prettier.
    'vue/html-self-closing': ['warn', { html: { void: 'always' } }],
    // Les libellés de formulaire sont imbriqués ou reliés par id selon le cas.
    'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
    // role="list" n'est pas redondant sur une liste sans puces : WebKit (VoiceOver) en
    // retire alors la sémantique. Le reset s'appuie sur ce rôle pour retirer les puces.
    'vuejs-accessibility/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
  },
});
