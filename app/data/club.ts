import type {
  Annotation,
  Coach,
  CoachId,
  Discipline,
  DisciplineId,
  NavLink,
  OpeningHours,
  Plan,
  Question,
  Session,
  Testimonial,
} from '~/types/club';
import { typesetDeep } from '~/utils/typography';

/**
 * Contenu de la direction B « Le Club » (/v2), en français, au tutoiement.
 *
 * Projet conceptuel : le club, les personnes, les chiffres, les tarifs, les avis,
 * l'adresse et les horaires sont fictifs, et la page le dit (bandeau du pied de
 * page, mentions sous les chiffres, les prix et les avis). Le formulaire d'essai
 * n'envoie rien.
 *
 * Les coachs sont ceux de la V1 (mêmes visages, générés comme éléments
 * Higgsfield), en kit du club : un client réel remplacera tout le contenu.
 */

const image = (src: string, width: number, height: number, alt: string, focal?: string) => ({
  src,
  width,
  height,
  alt,
  focal,
});

const disciplines: Discipline[] = [
  {
    id: 'force',
    name: 'Force',
    tagline: 'Barre, racks et progression mesurée.',
    description:
      'Squat, soulevé de terre, développé : les mouvements de base, appris proprement puis chargés semaine après semaine. Chaque séance a sa charge cible, notée dans ton carnet.',
    facts: ['60 min', 'Groupes de 8', 'Tous niveaux'],
    image: image(
      '/images/v2/disciplines/discipline-force.jpg',
      1200,
      1500,
      'Un membre en maillot du club tient une barre chargée au départ d’un soulevé de terre.',
      '50% 45%',
    ),
  },
  {
    id: 'cross-training',
    name: 'Cross-training',
    tagline: 'Des circuits variés, en équipe.',
    description:
      "Poussée de traîneau, sauts, rameur, charges légères : un circuit différent à chaque séance, adapté à ton niveau, et l'énergie d'un groupe qui finit ensemble.",
    facts: ['45 à 60 min', 'Groupes de 12', 'Tous niveaux'],
    image: image(
      '/images/v2/disciplines/discipline-cross-training.jpg',
      1200,
      1500,
      'Une membre pousse un traîneau sur le sol en caoutchouc, devant les grandes fenêtres.',
      '45% 55%',
    ),
  },
  {
    id: 'boxe',
    name: 'Boxe',
    tagline: 'Technique, pattes d’ours et cardio.',
    description:
      "Garde, déplacements, enchaînements sur pattes d'ours avec Drake. Pas de combat imposé : tu travailles la technique et le souffle, à ton rythme.",
    facts: ['60 min', 'Gants prêtés', 'Débutants bienvenus'],
    image: image(
      '/images/v2/disciplines/discipline-boxe.jpg',
      1200,
      1500,
      'Drake tient les pattes d’ours pendant qu’une membre gantée frappe un direct.',
      '50% 40%',
    ),
  },
  {
    id: 'mobilite',
    name: 'Mobilité',
    tagline: 'Bouger mieux, plus longtemps.',
    description:
      'Hanches, épaules, chevilles : Elena corrige les positions une à une. La séance qui rend toutes les autres plus faciles, et qui protège tes articulations.',
    facts: ['45 min', 'Groupes de 10', 'Tous niveaux'],
    image: image(
      '/images/v2/disciplines/discipline-mobilite.jpg',
      1200,
      1500,
      'Elena corrige la fente d’un membre agenouillé sur le tapis.',
      '50% 55%',
    ),
  },
  {
    id: 'cardio',
    name: 'Cardio',
    tagline: 'Rameurs et intervalles, côte à côte.',
    description:
      'Des intervalles sur rameur et sur vélo, chronométrés au tableau. On rame ensemble, on souffle ensemble, et chacun règle sa propre résistance.',
    facts: ['45 min', '12 postes', 'Tous niveaux'],
    image: image(
      '/images/v2/disciplines/discipline-cardio.jpg',
      1200,
      1500,
      'Deux membres rament côte à côte sur des rameurs, en plein effort.',
      '50% 50%',
    ),
  },
  {
    id: 'recuperation',
    name: 'Récupération',
    tagline: 'Bain froid, étirements, retour au calme.',
    description:
      "Étirements guidés, respiration, bain froid pour qui le souhaite. La séance du dimanche matin, et celle qu'on oublie le plus souvent : pas ici.",
    facts: ['45 à 60 min', 'Bain froid en option', 'Tous niveaux'],
    image: image(
      '/images/v2/disciplines/discipline-recuperation.jpg',
      1200,
      1500,
      'Un membre, une serviette sur les épaules, se repose sur un banc à côté d’un bain froid.',
      '50% 50%',
    ),
  },
];

const coaches: Coach[] = [
  {
    id: 'alex-vance',
    firstName: 'Alex',
    name: 'Alex Vance',
    number: 9,
    role: 'Capitaine · Force',
    since: 'Au club depuis 2019',
    specialties: ['Force athlétique', 'Haltérophilie', 'Bilans d’entrée'],
    quote: 'Une barre bien placée vaut mieux que dix kilos de plus.',
    portrait: image(
      '/images/v2/squad/squad-alex-vance.jpg',
      960,
      1200,
      'Portrait officiel d’Alex, en maillot du club, sur fond gris-vert.',
      '50% 30%',
    ),
  },
  {
    id: 'sarah-jenkins',
    firstName: 'Sarah',
    name: 'Sarah Jenkins',
    number: 7,
    role: 'Coach · Cross-training',
    since: 'Au club depuis 2020',
    specialties: ['Cross-training', 'Cardio', 'Reprise après une pause'],
    quote: 'Personne ne finit seul un circuit chez nous.',
    portrait: image(
      '/images/v2/squad/squad-sarah-jenkins.jpg',
      960,
      1200,
      'Portrait officiel de Sarah, en maillot du club, sur fond gris-vert.',
      '50% 30%',
    ),
  },
  {
    id: 'marcus-roy',
    firstName: 'Marcus',
    name: 'Marcus Roy',
    number: 4,
    role: 'Coach · Préparation physique',
    since: 'Au club depuis 2021',
    specialties: ['Préparation physique', 'Force', 'Sports collectifs'],
    quote: 'On mesure, on ajuste, on recommence.',
    portrait: image(
      '/images/v2/squad/squad-marcus-roy.jpg',
      960,
      1200,
      'Portrait officiel de Marcus, en maillot du club, sur fond gris-vert.',
      '50% 30%',
    ),
  },
  {
    id: 'elena-rostova',
    firstName: 'Elena',
    name: 'Elena Rostova',
    number: 11,
    role: 'Coach · Mobilité',
    since: 'Au club depuis 2019',
    specialties: ['Mobilité', 'Gainage', 'Récupération'],
    quote: 'La souplesse, ça s’entraîne comme le reste.',
    portrait: image(
      '/images/v2/squad/squad-elena-rostova.jpg',
      960,
      1200,
      'Portrait officiel d’Elena, en maillot du club, sur fond gris-vert.',
      '50% 30%',
    ),
  },
  {
    id: 'drake-torres',
    firstName: 'Drake',
    name: 'Drake Torres',
    number: 5,
    role: 'Coach · Boxe',
    since: 'Au club depuis 2022',
    specialties: ['Boxe anglaise', 'Conditionnement', 'Cardio'],
    quote: 'Garde haute, menton rentré, et on respire.',
    portrait: image(
      '/images/v2/squad/squad-drake-torres.jpg',
      960,
      1200,
      'Portrait officiel de Drake, en maillot du club, sur fond gris-vert.',
      '50% 30%',
    ),
  },
];

/**
 * Semaine type (fictive). Le nombre de cours affiché au tableau des scores et les
 * créneaux de chaque coach en sont tirés : rien n'est compté à la main.
 */
const s = (
  day: Session['day'],
  start: string,
  minutes: number,
  discipline: DisciplineId,
  coach: CoachId,
  room: string,
  level = 'Tous niveaux',
): Session => ({ day, start, minutes, discipline, coach, room, level });

const sessions: Session[] = [
  s(0, '07:00', 60, 'force', 'alex-vance', 'Plateau'),
  s(0, '12:15', 45, 'cross-training', 'sarah-jenkins', 'Plateau'),
  s(0, '18:00', 60, 'boxe', 'drake-torres', 'Ring'),
  s(0, '19:15', 45, 'mobilite', 'elena-rostova', 'Studio'),
  s(0, '20:15', 60, 'force', 'marcus-roy', 'Plateau', 'Confirmés'),
  s(1, '07:00', 45, 'cardio', 'sarah-jenkins', 'Plateau'),
  s(1, '12:15', 45, 'mobilite', 'elena-rostova', 'Studio'),
  s(1, '18:00', 60, 'cross-training', 'marcus-roy', 'Plateau'),
  s(1, '19:15', 60, 'boxe', 'drake-torres', 'Ring'),
  s(1, '20:30', 45, 'recuperation', 'elena-rostova', 'Studio'),
  s(2, '07:00', 60, 'force', 'marcus-roy', 'Plateau'),
  s(2, '12:15', 45, 'boxe', 'drake-torres', 'Ring'),
  s(2, '17:30', 45, 'cardio', 'sarah-jenkins', 'Plateau'),
  s(2, '18:30', 60, 'force', 'alex-vance', 'Plateau', 'Débutants'),
  s(2, '19:45', 60, 'cross-training', 'sarah-jenkins', 'Plateau'),
  s(3, '07:00', 60, 'cross-training', 'sarah-jenkins', 'Plateau'),
  s(3, '12:15', 45, 'force', 'alex-vance', 'Plateau'),
  s(3, '18:00', 45, 'mobilite', 'elena-rostova', 'Studio'),
  s(3, '19:00', 60, 'boxe', 'drake-torres', 'Ring', 'Confirmés'),
  s(3, '20:15', 45, 'cardio', 'marcus-roy', 'Plateau'),
  s(4, '07:00', 45, 'mobilite', 'elena-rostova', 'Studio'),
  s(4, '12:15', 45, 'cardio', 'sarah-jenkins', 'Plateau'),
  s(4, '18:00', 60, 'force', 'alex-vance', 'Plateau'),
  s(4, '19:15', 60, 'cross-training', 'marcus-roy', 'Plateau'),
  s(5, '09:00', 75, 'force', 'alex-vance', 'Plateau', 'Atelier technique'),
  s(5, '10:30', 60, 'cross-training', 'sarah-jenkins', 'Plateau'),
  s(5, '12:00', 60, 'boxe', 'drake-torres', 'Ring', 'Débutants'),
  s(5, '16:00', 60, 'mobilite', 'elena-rostova', 'Studio'),
  s(6, '09:30', 60, 'recuperation', 'elena-rostova', 'Studio'),
  s(6, '11:00', 45, 'cardio', 'marcus-roy', 'Plateau'),
];

const hours: OpeningHours[] = [
  { days: [0, 4], label: 'Lundi – vendredi', open: '06:30', close: '22:00' },
  { days: [5, 5], label: 'Samedi', open: '08:00', close: '20:00' },
  { days: [6, 6], label: 'Dimanche', open: '09:00', close: '13:00' },
];

const plans: Plan[] = [
  {
    id: 'libre',
    name: 'Libre',
    pitch: 'Le plateau, à tes horaires.',
    monthly: 36,
    seasonal: 30,
    perks: [
      'Accès au plateau aux heures d’ouverture',
      'Bilan d’entrée avec un coach',
      'Vestiaires et casiers',
    ],
  },
  {
    id: 'club',
    name: 'Club',
    pitch: 'Tous les cours, toute la saison.',
    monthly: 54,
    seasonal: 45,
    perks: [
      'Tout l’abonnement Libre',
      `Les ${sessions.length} cours de la semaine, sans limite`,
      'Le maillot du club floqué à ton nom',
    ],
    featured: true,
  },
  {
    id: 'coaching',
    name: 'Coaching',
    pitch: 'Un coach qui suit ta saison.',
    monthly: 108,
    seasonal: 90,
    perks: [
      'Tout l’abonnement Club',
      'Deux séances individuelles par mois',
      'Un bilan toutes les six semaines',
    ],
  },
];

const nav: NavLink[] = [
  { label: 'Disciplines', href: '#disciplines' },
  { label: 'Calendrier', href: '#calendrier' },
  { label: 'Effectif', href: '#effectif' },
  { label: 'Abonnements', href: '#abonnements' },
  { label: 'Club-house', href: '#club-house' },
];

const annotations: Annotation[] = [
  { x: 0.34, y: 0.42, side: 'left', value: '4 × 6', label: 'Séries × répétitions' },
  { x: 0.36, y: 0.7, side: 'left', value: '3 s', label: 'Pour descendre, sous contrôle' },
  { x: 0.8, y: 0.44, side: 'right', value: '50 kg', label: 'Sur la barre : 70 % de son maximum' },
  { x: 0.68, y: 0.81, side: 'right', value: '90°', label: 'Au genou, cuisses parallèles au sol' },
];

const testimonials: Testimonial[] = [
  {
    id: 'camille',
    quote:
      "Je venais pour perdre du poids. Je reste pour le jeudi soir, la boxe, et les gens qui m'attendent à l'entrée.",
    author: 'Camille',
    detail: 'Membre depuis la saison 24/25',
    portrait: image('/images/v2/tribune/tribune-camille.jpg', 720, 720, '', '50% 35%'),
  },
  {
    id: 'bernard',
    quote: "À 58 ans, j'ai soulevé mon premier 100 kilos. Alex avait noté la date dans mon carnet.",
    author: 'Bernard',
    detail: 'Membre depuis la saison 23/24',
    portrait: image('/images/v2/tribune/tribune-bernard.jpg', 720, 720, '', '50% 35%'),
  },
  {
    id: 'yanis',
    quote:
      "Le calendrier est affiché, les coachs connaissent mon prénom. C'est tout ce qu'il me fallait.",
    author: 'Yanis',
    detail: 'Membre depuis la saison 25/26',
    portrait: image('/images/v2/tribune/tribune-yanis.jpg', 720, 720, '', '50% 35%'),
  },
];

const questions: Question[] = [
  {
    question: 'Je n’ai jamais fait de sport en salle. C’est pour moi ?',
    answer:
      "Oui. La séance d'essai commence par un bilan avec un coach, et chaque cours a une version pour débuter. Personne ne te demande de suivre le rythme des confirmés.",
  },
  {
    question: 'Comment se passe la séance d’essai ?',
    answer:
      "Tu choisis un créneau, tu viens avec une tenue de sport et une bouteille d'eau. Un coach t'accueille, fait le point sur tes objectifs, puis tu suis le cours de ton choix. C'est gratuit et sans engagement.",
  },
  {
    question: 'Faut-il réserver les cours ?',
    answer:
      "Oui, depuis l'application du club, jusqu'à dix minutes avant le début. Les groupes sont petits : une place réservée et non utilisée est rendue à la liste d'attente.",
  },
  {
    question: 'Puis-je suspendre mon abonnement ?',
    answer:
      "L'abonnement mensuel se résilie à tout moment, avec un mois de préavis. La saison se suspend jusqu'à deux mois pour une blessure, un congé ou un déménagement.",
  },
  {
    question: 'Le maillot est-il compris ?',
    answer:
      "Avec l'abonnement Club et l'abonnement Coaching, oui : floqué à ton prénom, avec le numéro de la saison. Avec l'abonnement Libre, il est proposé à l'accueil.",
  },
  {
    question: 'Y a-t-il des douches et des casiers ?',
    answer:
      'Oui : deux vestiaires avec douches, casiers à code et sèche-cheveux. Pense juste à ta serviette.',
  },
];

export const club = typesetDeep({
  meta: {
    title: 'CLUSEM — Rejoins le club',
    description:
      'CLUSEM, club de force et de forme à Lyon : calendrier des cours, coachs, abonnements et séance d’essai. Projet conceptuel, contenus fictifs.',
  },
  name: 'CLUSEM',
  season: { label: 'Saison 26/27', number: 26 },
  nav,
  cta: { label: 'Séance d’essai', href: '#essai' },

  hero: {
    programme: ['Saison 26/27', 'Club de force et de forme', 'Lyon'],
    titleLines: ['Rejoins', 'le club.'],
    lead: `Un plateau en plein jour, ${coaches.length} coachs qui t’appellent par ton prénom et ${sessions.length} cours par semaine. Ta première séance est offerte.`,
    primary: { label: 'Prendre ma séance d’essai', href: '#essai' },
    secondary: { label: 'Voir le calendrier', href: '#calendrier' },
    jersey: {
      placeholder: 'Ton nom',
      label: 'Floque ton maillot',
      hint: 'Écris ton prénom : il se floque au dos du maillot.',
      inputPlaceholder: 'Ton prénom',
      fallback: 'Floque ton maillot à l’essai',
      announce: 'Maillot floqué au nom de',
    },
    next: {
      label: 'Prochain cours',
      fallback: `${sessions.length} cours par semaine, du lundi au dimanche`,
      link: 'Tout le calendrier',
    },
  },

  stats: {
    kicker: 'Le club en chiffres',
    title: 'Le tableau du club',
    note: 'Chiffres fictifs : ce club est un projet conceptuel.',
    members: { value: '412', label: 'Membres cette saison' },
    coaches: 'Coachs à plein temps',
    sessions: 'Cours par semaine',
    hours: 'D’ouverture par jour en semaine, de {open} à {close}',
  },

  method: {
    kicker: 'La méthode',
    title: 'Un plan de jeu pour ta saison',
    lead: 'Pas de programme recopié d’un magazine : un bilan, un plan, et une saison pour le tenir.',
    steps: [
      {
        number: '01',
        title: 'Le bilan',
        text: "Quarante-cinq minutes avec un coach : tes objectifs, tes contraintes, et quelques mouvements simples pour savoir d'où tu pars.",
      },
      {
        number: '02',
        title: 'Le plan de jeu',
        text: 'Douze semaines écrites pour toi : quels cours, quelles charges, quel rythme. Il tient dans ton carnet et dans l’application.',
      },
      {
        number: '03',
        title: 'La saison',
        text: 'Toutes les six semaines, on refait le point et on ajuste. Tes progrès sont mesurés, pas devinés.',
      },
    ],
    photo: image(
      '/images/v2/method/method-squat.jpg',
      1280,
      1600,
      'Une membre en maillot du club descend en squat, la barre sur les épaules, dans le rack.',
      '50% 50%',
    ),
    figureTitle: 'Une séance de force, en chiffres',
    annotations,
  },

  disciplines: {
    kicker: 'Disciplines',
    title: 'Six façons de jouer',
    lead: 'Toutes les disciplines sont comprises dans l’abonnement Club. Choisis-en une pour ta séance d’essai.',
    items: disciplines,
    cta: 'Voir les créneaux',
  },

  schedule: {
    sessions,
    kicker: 'Calendrier',
    title: 'La semaine du club',
    lead: 'Chaque cours se joue comme un match : une heure, un coach, un terrain. Les places sont limitées, réserve depuis l’application.',
    days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    short: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    filters: 'Filtrer par discipline',
    all: 'Toutes',
    empty: 'Aucun cours de cette discipline ce jour-là.',
    today: 'Aujourd’hui',
    now: 'Maintenant',
    live: 'En cours',
    next: 'Prochain',
    done: 'Terminé',
    with: 'avec',
    note: 'Planning fictif, donné à titre d’exemple.',
  },

  squad: {
    kicker: 'L’effectif',
    title: 'Cinq coachs, une équipe',
    lead: 'Retourne une carte pour lire la fiche du coach.',
    teamPhoto: image(
      '/images/v2/squad/team-photo.jpg',
      2880,
      1222,
      'Photo d’équipe : Sarah, Marcus, Elena, Alex et Drake, debout côte à côte en maillot du club.',
      '50% 52%',
    ),
    teamCaption: 'De gauche à droite : Sarah, Marcus, Elena, Alex et Drake.',
    /** Position de chacun sur la photo d'équipe, en fraction de sa largeur. */
    teamPositions: [
      { id: 'sarah-jenkins', x: 0.125 },
      { id: 'marcus-roy', x: 0.32 },
      { id: 'elena-rostova', x: 0.5 },
      { id: 'alex-vance', x: 0.685 },
      { id: 'drake-torres', x: 0.885 },
    ] as { id: CoachId; x: number }[],
    flip: 'Voir la fiche',
    flipBack: 'Retourner la carte',
    specialties: 'Spécialités',
    sessions: 'Ses cours',
    perWeek: 'cours par semaine',
    coaches,
  },

  plans: {
    kicker: 'Abonnements',
    title: 'Choisis ta carte de saison',
    lead: 'Au mois, sans engagement. À la saison, douze mois pour le prix de dix.',
    cycle: 'Formule',
    monthly: 'Au mois',
    seasonal: 'À la saison',
    badge: '2 mois offerts',
    perMonth: '€ / mois',
    monthlyNote: 'Sans engagement',
    seasonalNote: 'Payé à la saison',
    seasonalTotal: 'soit {total} € la saison',
    featured: 'Le plus choisi',
    choose: 'Choisir {name}',
    stub: 'Carte de saison',
    note: 'Tarifs fictifs, donnés à titre d’exemple.',
    items: plans,
  },

  tribune: {
    kicker: 'Tribune',
    title: 'La parole aux membres',
    note: 'Avis fictifs : personnes et propos imaginés pour ce modèle.',
    items: testimonials,
  },

  scarf: {
    words: ['Allez', 'CLUSEM'],
    label: 'Allez CLUSEM',
  },

  faq: {
    kicker: 'Questions',
    title: 'Avant de venir',
    items: questions,
  },

  clubhouse: {
    kicker: 'Club-house',
    title: 'Où et quand venir',
    hoursTitle: 'Horaires',
    hours,
    open: 'Ouvert maintenant',
    closed: 'Fermé maintenant',
    closesAt: 'jusqu’à {time}',
    opensAt: 'ouvre {day} à {time}',
    todayLabel: 'aujourd’hui',
    tomorrowLabel: 'demain',
    addressTitle: 'Adresse',
    address: ['12 rue des Canaris', '69000 Lyon'],
    addressNote: 'Adresse fictive.',
    access: [
      'Métro : station Les Canaris, à 4 minutes à pied',
      'Vélos : arceaux couverts devant l’entrée',
      'Accès de plain-pied, ascenseur vers les vestiaires',
    ],
    mapLabel:
      'Plan stylisé du quartier, avec le club au croisement de la rue des Canaris et du cours du Stade (lieux fictifs).',
    mapStreets: { main: 'Rue des Canaris', cross: 'Cours du Stade', park: 'Parc', metro: 'M' },
    photos: [
      image(
        '/images/v2/clubhouse/clubhouse-floor.jpg',
        2400,
        1350,
        'Le plateau d’entraînement en plein jour : racks, plateformes et grandes fenêtres d’atelier.',
        '50% 60%',
      ),
      image(
        '/images/v2/clubhouse/clubhouse-accueil.jpg',
        1200,
        1500,
        'À l’accueil, une membre rit avec un coach derrière le comptoir en bois clair.',
        '45% 50%',
      ),
      image(
        '/images/v2/clubhouse/clubhouse-vestiaire.jpg',
        1200,
        1500,
        'Le vestiaire : des maillots du club suspendus au-dessus d’un banc en bois clair.',
        '50% 45%',
      ),
    ],
  },

  trial: {
    kicker: 'Séance d’essai',
    title: 'Ta première séance est offerte',
    lead: 'Laisse ton prénom et ton e-mail : un coach te répond pour fixer ton créneau.',
    demo: 'Formulaire de démonstration : rien n’est envoyé ni enregistré.',
    noScript: 'Ce formulaire de démonstration a besoin de JavaScript pour s’afficher en action.',
    fields: {
      firstName: { label: 'Prénom', autocomplete: 'given-name' },
      email: { label: 'E-mail', hint: 'Pour confirmer ton créneau.', autocomplete: 'email' },
      discipline: { label: 'Discipline', placeholder: 'Choisis une discipline' },
      moment: { label: 'Plutôt', options: ['Le matin', 'Le midi', 'Le soir', 'Le week-end'] },
    },
    errors: {
      firstName: 'Écris ton prénom.',
      email: 'Écris une adresse e-mail valide, par exemple prenom@exemple.fr.',
      discipline: 'Choisis une discipline.',
      summary: 'Le formulaire contient {count} erreur(s).',
    },
    submit: 'Réserver ma séance',
    ticket: {
      title: 'Billet d’essai',
      season: 'Saison 26/27',
      admit: 'Valable pour une séance',
      holder: 'Au nom de',
      discipline: 'Discipline',
      moment: 'Créneau',
      number: 'N°',
      footer: 'Présente ce billet à l’accueil. Démonstration : aucun billet n’a été émis.',
      again: 'Modifier ma demande',
      announce: 'Ton billet d’essai est prêt.',
    },
  },

  footer: {
    tagline: 'Club de force et de forme, Lyon.',
    nav: 'Le club',
    infos: 'Infos pratiques',
    infoLinks: [
      { label: 'Horaires et accès', href: '#club-house' },
      { label: 'Questions fréquentes', href: '#questions' },
      { label: 'Séance d’essai', href: '#essai' },
    ],
    concept:
      'Projet conceptuel : CLUSEM n’existe pas. Club, personnes, chiffres, tarifs, avis, adresse et horaires sont fictifs ; le formulaire n’envoie rien. Photographies générées par IA.',
    otherDirection: { label: 'Voir la direction A', href: '/' },
    credit: 'Modèle de site pour salle de quartier, direction B « Le Club ».',
    top: 'Retour en haut',
  },

  ui: {
    skipLink: 'Aller au contenu',
    home: 'CLUSEM, retour en haut',
    menu: 'Vestiaire',
    menuLabel: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    menuTitle: 'Menu du club',
  },
});

export type ClubContent = typeof club;
