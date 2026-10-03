/**
 * Modèle du contenu de la page. Les sections ne font qu'afficher ces données :
 * aucun texte n'est écrit en dur dans les composants.
 */

export interface ImageAsset {
  src: string;
  /** Texte alternatif ; chaîne vide si l'image est purement décorative. */
  alt: string;
  width: number;
  height: number;
  /** Point focal CSS (object-position), pour les recadrages responsives. */
  focal?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  image: ImageAsset;
}

export interface ProgramTag {
  icon: 'calendar' | 'dumbbell' | 'bolt' | 'progress';
  label: string;
}

export interface Coach {
  id: string;
  name: string;
  /** Spécialité affichée dans le texte alternatif et le menu (donnée fictive). */
  specialty: string;
  portrait: ImageAsset;
}

export interface Program {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: ProgramTag[];
  coachId: string;
  coachMeta: string;
}

export interface Pillar {
  title: string;
  text: string;
}

export interface Testimonial {
  id: string;
  author: string;
  quote: string;
  image: ImageAsset;
}

export interface HomeContent {
  meta: { title: string; description: string };
  nav: NavLink[];
  hero: {
    slogans: string[];
    titleLines: [string, string];
    leadLines: [string, string];
    image: ImageAsset;
    /** La même photo recadrée en 3:4, servie aux écrans verticaux (scripts/build-images.mjs). */
    portrait: Omit<ImageAsset, 'alt'>;
  };
  about: {
    eyebrow: string;
    statement: string;
    cta: NavLink;
    /** `scale` est la note maximale (« 5 ») ; la barre oblique relève de l'affichage. */
    rating: { value: string; scale: string; label: string; reviewers: ImageAsset[] };
    years: { value: string; label: string; points: string[] };
    image: ImageAsset;
  };
  services: {
    display: string;
    title: string;
    note: string;
    items: Service[];
  };
  programs: {
    eyebrow: string;
    title: string;
    intro: string;
    cta: NavLink;
    image: ImageAsset;
    items: Program[];
  };
  why: {
    eyebrow: string;
    title: string;
    note: string;
    statement: string;
    text: string;
    pillars: Pillar[];
    coaches: Coach[];
    featuredCoachId: string;
    cta: NavLink;
  };
  transformation: {
    eyebrow: string;
    title: string;
    note: string;
    items: Testimonial[];
  };
  marquee: { text: string; lang: string };
  footer: {
    title: string;
    nav: NavLink[];
    panels: { title: string; href: string }[];
    manifesto: string;
    motto: string;
    socials: { label: string; href: string; icon: 'facebook' | 'instagram' | 'x' }[];
    disclaimer: string;
    credit: string;
    image: ImageAsset;
  };
}
