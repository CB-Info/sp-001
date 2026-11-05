// Fichier généré par scripts/measure-fit.mjs : ne pas modifier à la main.
// Largeur en em (capitales, CAP Display 900) de chaque mot d'affiche ajusté, par
// chasse (font-stretch en %). L'empreinte sha1 du texte est contrôlée par
// scripts/check-fit.mjs : tout changement de texte impose une nouvelle mesure.
export const capFit = {
  'cover.delie': {
    sha1: '13a2a0777a4c',
    em: {
      '75': 3.446,
      '100': 4.558,
      '150': 6.787,
    },
  },
  'cover.plein': {
    sha1: '2ab6db78c276',
    em: {
      '75': 5.609,
      '80': 5.967,
    },
  },
  'edito.bouge': {
    sha1: '1bc23d8857b8',
    em: {
      '75': 3.113,
      '100': 4.167,
      '150': 6.279,
    },
  },
  'edito.lignes': {
    sha1: '14a6e3a176d3',
    em: {
      '75': 9.872,
      '80': 10.559,
    },
  },
  'famille.delie': {
    sha1: '83a78f6dc99b',
    em: {
      '75': 8.017,
      '125': 13.516,
    },
  },
  'famille.plein': {
    sha1: '581f4d683387',
    em: {
      '75': 5.336,
      '80': 5.691,
    },
  },
  'fin.plein': {
    sha1: 'e583830fb582',
    em: {
      '75': 4.558,
      '80': 4.86,
    },
  },
} as const;

export type CapFitKey = keyof typeof capFit;
