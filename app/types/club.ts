/**
 * Modèle du contenu de la direction B « Le Club » (/v2). Les zones ne font
 * qu'afficher ces données : aucun texte n'est écrit en dur dans les composants.
 */
import type { ImageAsset, NavLink } from './content';

export type { ImageAsset, NavLink };

export type DisciplineId =
  'force' | 'cross-training' | 'boxe' | 'mobilite' | 'cardio' | 'recuperation';

export type CoachId =
  'alex-vance' | 'sarah-jenkins' | 'marcus-roy' | 'elena-rostova' | 'drake-torres';

/** Jour de la semaine, 0 = lundi … 6 = dimanche (ordre du calendrier français). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Discipline {
  id: DisciplineId;
  name: string;
  /** Une ligne, dans la liste et sur les cartes de séance. */
  tagline: string;
  description: string;
  /** Repères concrets : durée, intensité, matériel. */
  facts: string[];
  image: ImageAsset;
}

export interface Coach {
  id: CoachId;
  firstName: string;
  name: string;
  /** Numéro d'effectif, floqué sur la carte. */
  number: number;
  /** Poste, au sens d'une carte à collectionner. */
  role: string;
  since: string;
  specialties: string[];
  quote: string;
  portrait: ImageAsset;
}

export interface Session {
  day: Weekday;
  /** Heure de début, « HH:MM ». */
  start: string;
  /** Durée en minutes. */
  minutes: number;
  discipline: DisciplineId;
  coach: CoachId;
  level: string;
  room: string;
}

export interface OpeningHours {
  /** Jours concernés, du premier au dernier inclus. */
  days: [Weekday, Weekday];
  label: string;
  open: string;
  close: string;
}

export interface Plan {
  id: string;
  name: string;
  pitch: string;
  /** Prix mensuel sans engagement, en euros. */
  monthly: number;
  /** Prix mensuel équivalent à la saison (12 mois payés 10), en euros. */
  seasonal: number;
  perks: string[];
  featured?: boolean;
}

export interface Annotation {
  /** Point épinglé sur la photo, en fraction de sa largeur et de sa hauteur. */
  x: number;
  y: number;
  /** Côté où se pose l'étiquette (ordinateur). */
  side: 'left' | 'right';
  value: string;
  label: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  detail: string;
  portrait: ImageAsset;
}

export interface Question {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  unit?: string;
  label: string;
}
