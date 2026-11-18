/**
 * Modèle du contenu de la V2 (maquette CAP Fitness by EBC Sport).
 *
 * Chaque donnée porte son statut : `flyer` (repris des supports du club),
 * `a-confirmer` (inconnue, affichée comme telle), `repere` (indication à valider
 * avec les coachs) ou `exemple`. Aucune donnée inventée n'est présentée comme réelle.
 */
import type { ImageAsset, NavLink } from './content';

export type { ImageAsset, NavLink };

export type Statut = 'flyer' | 'a-confirmer' | 'repere' | 'exemple';

/** Jour de la semaine, 0 = lundi … 6 = dimanche. */
export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Groupe = 'cardio' | 'force' | 'calme';

export interface CourseField {
  label: string;
  valeur: string;
  statut?: Statut;
}

export interface Course {
  slug: string;
  nom: string;
  /** Complément affiché sous le nom (« cuisses, abdos, fessiers »). */
  sousTitre?: string;
  groupe: Groupe;
  intensite: { valeur: 1 | 2 | 3 | 4 | 5; mot: string; statut: 'repere' };
  accroche: string;
  texte: string;
  /** Phrase courte du flyer (cours du retour au calme). */
  phrase?: string;
  champs: CourseField[];
}

export interface Session {
  id: string;
  day: Day;
  start: string;
  course: string;
  tags: string[];
  statut: 'flyer';
}

export interface FaqItem {
  question: string;
  reponse: string;
  lien?: NavLink;
}

export interface Photo extends ImageAsset {
  /** Recadrage dirigé pour les écrans étroits (scripts/build-images.mjs, CROPS). */
  mobile?: { src: string; width: number; height: number };
}
