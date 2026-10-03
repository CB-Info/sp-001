/**
 * Tracés du jeu d'icônes (grille de 24). Source unique, consommée par Icon.vue.
 */
export const iconPaths = {
  phone: [
    'M5 3h4l1.5 4L8 8.5A11 11 0 0 0 15.5 16l1.5-2.5 4 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z',
    'M15 3a6 6 0 0 1 6 6',
    'M15 6.5A2.5 2.5 0 0 1 17.5 9',
  ],
  'arrow-bend': ['M4 20v-7a4 4 0 0 1 4-4h11', 'M15 5l4 4-4 4'],
  'arrow-bend-back': ['M20 20v-7a4 4 0 0 0-4-4H5', 'M9 5 5 9l4 4'],
  'arrow-right': ['M3 12h17', 'M14 6l6 6-6 6'],
  plus: ['M12 4v16', 'M4 12h16'],
  minus: ['M4 12h16'],
  close: ['M5 5l14 14', 'M19 5 5 19'],
  calendar: ['M4 6h16v14H4Z', 'M4 10h16', 'M8 3v4', 'M16 3v4'],
  dumbbell: ['M2 12h20', 'M5 8v8', 'M8 6v12', 'M16 6v12', 'M19 8v8'],
  bolt: ['M13 2 4 14h7l-1 8 9-12h-7l1-8Z'],
  progress: ['M3 21h18', 'M6 21v-6', 'M11 21V9', 'M16 21V4'],
  play: ['M7 4v16l13-8L7 4Z'],
  pause: ['M7 4v16', 'M17 4v16'],
  instagram: ['M3 3h18v18H3Z', 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z', 'M17 6.5h.01'],
  facebook: ['M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z'],
  x: ['M4 4l16 16', 'M20 4 4 20'],
} as const;

export type IconName = keyof typeof iconPaths;
