import type { Course, FaqItem, NavLink, Photo, Session } from '~/types/cap';
import { typesetDeep } from '~/utils/typography';

/**
 * Contenu de la V2 : maquette non officielle de site pour CAP Fitness by EBC
 * Sport (brief docs/brief/v2.md, §4).
 *
 * Repris des supports du club (flyer de rentrée, logo, tenue, bannière) : le
 * planning, les slogans, les valeurs, les disciplines et la réservation par
 * l'appli ou l'accueil. Tout le reste (adresse, horaires, tarifs, coachs,
 * durées…) est inconnu et s'affiche « à confirmer ». Aucun texte n'est écrit en
 * dur dans les composants ; `typesetDeep` pose la typographie française.
 */

const photo = (
  id: string,
  width: number,
  height: number,
  alt: string,
  focal: string,
  mobile?: { width: number; height: number },
): Photo => ({
  src: `/images/v2/${id}.jpg`,
  width,
  height,
  alt,
  focal,
  mobile: mobile && { src: `/images/v2/${id}-mobile.jpg`, ...mobile },
});

const photos = {
  couverture: photo('cap-couverture', 2880, 1728, '', '80% 45%', { width: 864, height: 1728 }),
  pound: photo(
    'cap-pound',
    2880,
    1800,
    'Cours de Pound : une jeune femme en fente, baguettes levées, frappe en rythme.',
    '70% 50%',
    { width: 1440, height: 1800 },
  ),
  jump: photo(
    'cap-jump',
    2880,
    1800,
    'Cours de Cardio Jump : un homme saute au-dessus de son mini-trampoline.',
    '68% 50%',
    { width: 1440, height: 1800 },
  ),
  step: photo(
    'cap-step',
    2880,
    1800,
    'Cours de Step : trois paires de pieds montent ensemble sur les steps.',
    '66% 60%',
    { width: 1440, height: 1800 },
  ),
  force: photo(
    'cap-force',
    1240,
    1654,
    'Deux mains couvertes de magnésie se referment sur la poignée d’une kettlebell.',
    '45% 45%',
  ),
  calme: photo(
    'cap-calme',
    960,
    1200,
    'Un homme âgé, assis sur un tapis, en flexion avant, les yeux fermés.',
    '35% 60%',
  ),
  famille: photo(
    'cap-famille',
    2880,
    1620,
    'Après le cours, six membres de tous âges rient ensemble, assis sur le sol et sur un banc.',
    '55% 40%',
    { width: 1296, height: 1620 },
  ),
  lieu: photo(
    'cap-lieu',
    2880,
    1234,
    'La salle de biking vide, la nuit, éclairée par la lumière de la rue.',
    '55% 50%',
    { width: 987, height: 1234 },
  ),
};

/** Planning de la saison, d'après le flyer du club (à confirmer). */
const sessions: Session[] = [
  {
    id: 'lun-1300-pound',
    day: 0,
    start: '13:00',
    course: 'pound',
    tags: ['cardio', 'midi', 'defouler'],
    statut: 'flyer',
  },
  {
    id: 'lun-1815-cardio-jump',
    day: 0,
    start: '18:15',
    course: 'cardio-jump',
    tags: ['cardio', 'defouler'],
    statut: 'flyer',
  },
  {
    id: 'lun-1900-cardio-jump',
    day: 0,
    start: '19:00',
    course: 'cardio-jump',
    tags: ['cardio', 'defouler'],
    statut: 'flyer',
  },
  {
    id: 'mar-1715-step',
    day: 1,
    start: '17:15',
    course: 'step',
    tags: ['cardio', 'reprends'],
    statut: 'flyer',
  },
  {
    id: 'mer-1215-cross-training',
    day: 2,
    start: '12:15',
    course: 'cross-training',
    tags: ['force', 'midi'],
    statut: 'flyer',
  },
  {
    id: 'mer-1800-caf',
    day: 2,
    start: '18:00',
    course: 'caf',
    tags: ['force', 'solide'],
    statut: 'flyer',
  },
  {
    id: 'mer-1900-cross-training',
    day: 2,
    start: '19:00',
    course: 'cross-training',
    tags: ['force', 'solide'],
    statut: 'flyer',
  },
  {
    id: 'ven-1900-cross-training',
    day: 4,
    start: '19:00',
    course: 'cross-training',
    tags: ['force', 'solide'],
    statut: 'flyer',
  },
];

const field = (label: string, valeur: string, statut?: Course['champs'][number]['statut']) =>
  statut ? { label, valeur, statut } : { label, valeur };

const courses: Course[] = [
  {
    slug: 'pound',
    nom: 'Pound',
    groupe: 'cardio',
    intensite: { valeur: 4, mot: 'soutenue', statut: 'repere' },
    accroche: 'Tape le rythme, baguettes en main.',
    texte:
      'Tu tiens le rythme baguettes en main, sur des morceaux qui envoient. Cardio, gainage et coordination : le défouloir de la pause de midi.',
    champs: [
      field(
        'Ce que c’est',
        'Un cours de cardio et de renforcement en musique : tu frappes le sol et l’air en rythme, comme un batteur. Squats, fentes et gainage s’enchaînent. Durée à confirmer.',
        'a-confirmer',
      ),
      field('Matériel', 'Baguettes et tapis.'),
      field(
        'Pour qui',
        'Tous niveaux, surtout si le cardio classique t’ennuie. Les sauts sont facultatifs.',
      ),
      field(
        'Ce que tu y gagnes',
        'Cardio, coordination, épaules, bras, gainage. Et un vrai défouloir.',
      ),
    ],
  },
  {
    slug: 'cardio-jump',
    nom: 'Cardio Jump',
    groupe: 'cardio',
    intensite: { valeur: 5, mot: 'intense', statut: 'repere' },
    accroche: 'Rebondis jusqu’au dernier refrain.',
    texte:
      'Tu rebondis en musique sur ton propre trampoline. Ça monte vite dans le cœur, ça rit beaucoup, et les jambes s’en souviennent.',
    champs: [
      field(
        'Ce que c’est',
        'Des chorégraphies de rebonds en musique, sur un mini-trampoline individuel. Durée à confirmer.',
        'a-confirmer',
      ),
      field(
        'Matériel',
        'Un trampoline par personne (nombre de places à confirmer).',
        'a-confirmer',
      ),
      field('Pour qui', 'Dès le niveau débutant motivé : le trampoline amortit les chocs.'),
      field('Ce que tu y gagnes', 'Cardio, endurance, jambes et fessiers, gainage profond.'),
      field(
        'Précautions',
        'Grossesse, fuites urinaires, vertiges ou entorse récente : parles-en au coach avant le cours, et à ton médecin si besoin.',
      ),
    ],
  },
  {
    slug: 'step',
    nom: 'Step',
    groupe: 'cardio',
    intensite: { valeur: 3, mot: 'modérée', statut: 'repere' },
    accroche: 'Monte, descends, recommence.',
    texte:
      'Une chorégraphie qui se construit pas à pas, jusqu’au moment où tout s’enchaîne en musique.',
    champs: [
      field(
        'Ce que c’est',
        'De l’aérobic sur une plateforme de step réglable : on apprend les pas par blocs, puis on les enchaîne. Durée à confirmer.',
        'a-confirmer',
      ),
      field('Matériel', 'Step réglable.'),
      field('Pour qui', 'Tous niveaux : l’intensité se règle avec la hauteur du step.'),
      field(
        'Ce que tu y gagnes',
        'Cardio, coordination, mémoire, jambes et fessiers, avec peu d’impact.',
      ),
    ],
  },
  {
    slug: 'cross-training',
    nom: 'Cross training',
    groupe: 'force',
    intensite: { valeur: 5, mot: 'intense', statut: 'repere' },
    accroche: 'Court, intense, jamais pareil.',
    texte:
      'Chaque séance a son défi, ta charge reste la tienne, et c’est le groupe qui t’emmène jusqu’au bout.',
    champs: [
      field(
        'Ce que c’est',
        'Un entraînement fonctionnel en circuit : échauffement, technique, puis l’entraînement du jour, chronométré. Durée à confirmer.',
        'a-confirmer',
      ),
      field('Matériel', 'Kettlebells ; le reste du matériel est à confirmer.', 'a-confirmer'),
      field('Pour qui', 'Tous niveaux : charges et mouvements sont adaptés à chacun.'),
      field('Ce que tu y gagnes', 'Force, cardio, explosivité, polyvalence.'),
    ],
  },
  {
    slug: 'caf',
    nom: 'CAF',
    sousTitre: 'cuisses, abdos, fessiers',
    groupe: 'force',
    intensite: { valeur: 3, mot: 'modérée', statut: 'repere' },
    accroche: 'Le trio qui tient tout.',
    texte:
      'Squats, fentes, ponts, gainage : le trio cuisses, abdos, fessiers, travaillé en séries qui brûlent juste ce qu’il faut. Le socle de tout le reste.',
    champs: [
      field(
        'Ce que c’est',
        'Du renforcement ciblé du bas du corps et de la sangle abdominale, en séries. Durée à confirmer.',
        'a-confirmer',
      ),
      field('Matériel', 'Poids du corps, élastiques, lests, tapis.'),
      field('Pour qui', 'Tous niveaux.'),
      field(
        'Ce que tu y gagnes',
        'Jambes et fessiers toniques, gainage, stabilité du bassin, posture.',
      ),
      field('Précautions', 'Après une grossesse, demande au coach d’adapter le travail des abdos.'),
    ],
  },
  {
    slug: 'pilates',
    nom: 'Pilates',
    groupe: 'calme',
    intensite: { valeur: 2, mot: 'douce', statut: 'repere' },
    accroche: 'Renforce, tonifie, redresse-toi.',
    texte:
      'Des mouvements lents, précis, guidés par le souffle. Rien de spectaculaire, et pourtant tout travaille.',
    phrase: 'Renforce, tonifie et améliore ta posture.',
    champs: [
      field(
        'Ce que c’est',
        'La méthode Pilates : renforcer les muscles profonds du centre du corps, en mouvements lents synchronisés avec la respiration.',
      ),
      field('Matériel', 'Tapis ; petit matériel possible.'),
      field('Pour qui', 'Tous niveaux, et un bon complément aux cours intenses.'),
      field('Ce que tu y gagnes', 'Posture, dos, gainage profond, contrôle.'),
    ],
  },
  {
    slug: 'yoga',
    nom: 'Yoga',
    groupe: 'calme',
    intensite: { valeur: 1, mot: 'calme', statut: 'repere' },
    accroche: 'Respire et retrouve ton équilibre.',
    texte: 'Respire, relâche les tensions et retrouve ton équilibre.',
    phrase: 'Respire, relâche les tensions et retrouve ton équilibre.',
    champs: [
      field(
        'Ce que c’est',
        'Postures, respiration et relaxation finale. Style de yoga à confirmer.',
        'a-confirmer',
      ),
      field('Matériel', 'Tapis.'),
      field('Pour qui', 'Tous niveaux.'),
      field('Ce que tu y gagnes', 'Souplesse, équilibre, apaisement.'),
    ],
  },
  {
    slug: 'stretching',
    nom: 'Stretching',
    groupe: 'calme',
    intensite: { valeur: 1, mot: 'calme', statut: 'repere' },
    accroche: 'Gagne en souplesse, récupère mieux.',
    texte: 'Des étirements et de la mobilité, au calme, en respirant : pour bouger plus librement.',
    phrase: 'Gagne en souplesse, récupère mieux.',
    champs: [
      field('Ce que c’est', 'Étirements et mobilité articulaire.'),
      field('Matériel', 'Tapis.'),
      field('Pour qui', 'Tous niveaux.'),
      field(
        'Ce que tu y gagnes',
        'Souplesse, récupération. Le complément naturel du Cross training et du Cardio Jump.',
      ),
    ],
  },
];

const faq: FaqItem[] = [
  {
    question: 'Je débute, c’est pour moi ?',
    reponse:
      'Oui. Tous les cours sont ouverts à tous les niveaux, et le coach adapte chaque exercice.',
  },
  {
    question: 'Comment je réserve ?',
    reponse:
      'Dans l’appli CAP Fitness ou directement à l’accueil. Tu peux aussi ajouter un créneau à ton agenda depuis le planning.',
  },
  {
    question: 'Quel cours choisir ?',
    reponse:
      'Regarde l’intensité indiquée sur chaque cours et les idées de semaine du planning. En cas de doute, demande au coach.',
    lien: { label: 'Voir le planning', href: '#semaine' },
  },
  {
    question: 'Qu’est-ce que j’apporte ?',
    reponse:
      'Une tenue confortable, des baskets propres, une gourde et une serviette. Serviette obligatoire : à confirmer.',
  },
  {
    question: 'Cardio Jump : grossesse, genoux, fuites ?',
    reponse: 'Parles-en au coach avant le cours : il te proposera une variante.',
  },
  {
    question: 'Les cours sont-ils compris dans l’abonnement ?',
    reponse: 'À confirmer avec le club.',
  },
  {
    question: 'Peut-on faire un cours d’essai ?',
    reponse: 'À confirmer avec le club. En attendant, passe à l’accueil.',
  },
  {
    question: 'Faut-il un certificat médical ?',
    reponse: 'Selon le règlement du club : à confirmer.',
  },
];

const nav: NavLink[] = [
  { label: 'Cours', href: '#cours' },
  { label: 'Semaine', href: '#semaine' },
  { label: 'Famille', href: '#famille' },
  { label: 'Tarifs & infos', href: '#infos' },
];

export const cap = typesetDeep({
  meta: {
    title: 'CAP Fitness by EBC Sport : cours collectifs à [Commune] (maquette)',
    description:
      'Maquette non officielle de site pour CAP Fitness by EBC Sport : cours collectifs, planning de la saison d’après le flyer du club, réservation dans l’appli ou à l’accueil.',
  },
  brand: 'CAP Fitness by EBC Sport',
  nav,
  photos,
  sessions,
  courses,
  faq,

  ui: {
    skip: 'Aller au contenu',
    home: 'CAP Fitness by EBC Sport, haut de page',
    reserve: 'Réserve ta place',
    reserveShort: 'Réserver',
    menu: 'Menu',
    close: 'Fermer',
    menuTitle: 'Menu',
    nextLabel: 'Prochain cours',
    firstLabel: 'Premier cours de la semaine',
    pending: 'à confirmer',
    upcoming: 'à venir',
    agenda: 'agenda',
    otherDirection: { label: 'Voir la direction 1', href: '/' },
    top: 'Haut de page',
  },

  banner: {
    /** Nom du repère (aside) : le bandeau est un avertissement, pas un titre. */
    label: 'Maquette non officielle',
    long: 'Maquette non officielle : proposition de site pour CAP Fitness by EBC Sport, non validée par le club.',
    short: 'Maquette non officielle ·',
    link: { label: 'Ce qui reste à confirmer', href: '#a-confirmer' },
  },

  cover: {
    delie: 'Chacun',
    plein: 'son rythme.',
    signature: 'Tous ensemble.',
    chapeau:
      'Pound, Cardio Jump, Cross training, Pilates… Huit disciplines, des coachs diplômés et une salle où l’on se dépasse ensemble, dans la bonne humeur.',
    chapeauMobile:
      'Huit disciplines, des coachs diplômés et une salle où l’on se dépasse ensemble, dans la bonne humeur.',
    planning: { label: 'Voir le planning', href: '#semaine' },
  },

  edito: {
    bouge: 'Bouge !',
    lignes: ['Dépasse-toi.', 'Prends du plaisir.', 'Atteins tes objectifs.'],
    faits: '8 créneaux sur 4 jours, dont 2 à la pause de midi.',
    source: 'd’après le flyer de rentrée du club, à confirmer',
    texte: [
      {
        t: 'Ici, on vient pour bouger, et on revient pour les gens. Que tu débutes ou que tu t’entraînes depuis des années, tu trouves ta place dès le premier cours. Des ',
      },
      { t: 'coachs diplômés', strong: true },
      { t: ' t’accompagnent et te motivent, l’' },
      { t: 'ambiance', strong: true },
      { t: ' te porte, et ton corps comme ton mental nous tiennent à cœur : ' },
      { t: 'sport santé et bien-être', strong: true },
      { t: '.' },
    ],
  },

  courseSection: {
    delie: 'Fais monter',
    plein: 'le cœur.',
    signature: 'puis redescends en douceur.',
    groupes: {
      cardio: 'cardio en musique',
      force: 'force et intensité',
      calme: 'retour au calme',
    },
    intensite: 'Intensité indicative',
    surCinq: 'sur 5',
    repere: 'repère à valider avec les coachs',
    fiche: ' : la fiche',
    creneaux: 'Créneaux',
    prochain: 'Prochain créneau',
    creneau: 'Créneau',
    aConfirmer: 'Créneaux à confirmer',
    reserver: 'Réserver ce cours',
    ajouter: 'Ajouter le {cours} du {jour}, {heure} à mon agenda',
    enchainement: {
      titre: 'l’enchaînement du mercredi',
      lignes: [
        { heure: '18:00', cours: 'CAF' },
        { heure: '19:00', cours: 'Cross training' },
      ],
    },
  },

  week: {
    delie: 'Ta',
    plein: 'semaine.',
    chapeau:
      'Huit créneaux sur quatre jours, dont deux à la pause de midi. Réserve ta place dans l’appli CAP Fitness ou à l’accueil.',
    etat: {
      commence: 'Commencé à {heure} : {cours}.',
      prochain: 'Prochain cours',
      premier: 'Premier cours de la semaine',
    },
    focus: {
      legende: 'Mettre en avant',
      options: [
        { id: 'tout', label: 'Toute la semaine' },
        { id: 'cardio', label: 'Cardio en musique' },
        { id: 'force', label: 'Force et intensité' },
        { id: 'midi', label: 'Pause de midi' },
      ],
      idees: 'Idées de semaine, pas un programme du club',
      ideesOptions: [
        { id: 'reprends', label: 'Tu reprends' },
        { id: 'defouler', label: 'Tu veux te défouler' },
        { id: 'solide', label: 'Tu veux du solide' },
      ],
      hors: '(hors sélection)',
      annonce: '{n} créneaux mis en avant',
      annonceUn: '{n} créneau mis en avant',
      annoncePlus: ', plus la piste Bien-être',
    },
    coupure: '14 h → 17 h',
    maintenant: 'maintenant',
    aujourdhui: '(aujourd’hui)',
    prochainCours: 'prochain cours',
    commenceA: 'commencé à {heure}',
    reserverSuffixe: ', réserver, {jour}',
    jeudi: 'Pas de cours collectif au planning ce jour-là.',
    bienEtre: 'Pilates, Yoga, Stretching : créneaux à confirmer',
    bienEtreJour: 'Bien-être',
    weekend: 'Samedi et dimanche : pas de cours collectif au planning.',
    mentions:
      'Planning de la saison, en place depuis la rentrée, d’après le flyer du club : à confirmer. Susceptible d’évoluer pendant les vacances.',
    jours: ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.'],
  },

  book: {
    titre: 'Ta place t’attend.',
    choisi: 'Tu as choisi :',
    prochain: 'Prochain cours :',
    premier: 'Premier cours de la semaine :',
    bouton: 'Ajouter ce cours à mon agenda',
    semaine: { label: 'ou les huit créneaux de la semaine', href: '/v2/agenda/semaine.ics' },
    note: 'Fichier .ics : durée provisoire d’une heure, à confirmer.',
    appli: {
      titre: 'Dans l’appli CAP Fitness',
      texte: 'Ouvre l’appli, choisis ton cours, viens comme tu es.',
      stores: ['App Store · lien à venir', 'Google Play · lien à venir'],
    },
    accueil: {
      titre: 'À l’accueil',
      texte: 'Tu préfères en parler ? Passe à l’accueil, on s’en occupe avec toi.',
      adresse: 'Adresse à confirmer',
      lien: { label: 'Voir les infos pratiques', href: '#infos' },
    },
  },

  family: {
    delie: 'Plus qu’une salle,',
    plein: 'une famille.',
    chapeau:
      'On se dépasse ensemble, dans la bonne humeur. Ceux qui reprennent, ceux qui s’y mettent, ceux qui ne ratent pas un mercredi soir : tout le monde a sa place.',
    avis: 'Avis Google à intégrer : lien vers la fiche à confirmer',
    coachs: {
      titre: 'Tes coachs.',
      texte: 'Diplômés, pour t’accompagner et te motiver.',
      cadre: 'Portraits, prénoms et diplômes de l’équipe : à fournir par le club',
    },
  },

  practical: {
    plein: 'Viens nous voir',
    delie: 'à [Commune].',
    commune: 'commune à confirmer',
    acces: {
      titre: 'Accès et contact',
      lignes: [
        { label: 'Adresse', valeur: 'adresse à confirmer, [Commune]' },
        { label: 'Parking et accès PMR', valeur: 'à confirmer' },
        { label: 'Plan d’accès', valeur: 'à venir' },
        { label: 'Téléphone', valeur: 'à confirmer' },
        { label: 'E-mail', valeur: 'à confirmer' },
        { label: 'Instagram, Facebook', valeur: 'liens à confirmer' },
        { label: 'Avis Google', valeur: 'fiche à confirmer' },
      ],
    },
    accueil: {
      titre: 'Accueil',
      vide: '— h — à — h —',
      note: 'Horaires de la salle et de l’accueil : à confirmer. Accès en libre-service : à confirmer.',
    },
    formules: {
      titre: 'Formules',
      legende: 'Formules',
      colonnes: ['Formule', 'Prix'],
      lignes: [
        { nom: 'Cours collectifs', detail: 'les cours du planning' },
        { nom: 'Salle et cours', detail: 'si un plateau existe' },
        { nom: 'Séance à l’unité', detail: '' },
      ],
      prix: '— €',
      pending: 'tarif à confirmer',
      note: 'Frais d’inscription, engagement et réductions : à confirmer. Demande les tarifs à l’accueil.',
    },
    faqTitre: ['Avant ton', 'premier', 'cours.'],
  },

  finale: {
    plein: 'Ensemble,',
    signature: 'allons plus loin.',
    attente: 'On t’attend',
    /** Ferme la question après l'horaire : « On t'attend mer. 19 h 00 ? ». */
    attenteFin: ' ?',
    attenteNeutre: 'On t’attend au prochain cours ?',
  },

  footer: {
    aConfirmer: {
      titre: 'Ce qui reste à confirmer par le club',
      intro: 'Ces informations attendent le club :',
      liste: [
        'Commune, adresse, parking et accès PMR',
        'Téléphone, e-mail, Instagram, Facebook, fiche Google',
        'Horaires de la salle et de l’accueil, libre-service',
        'Durée de chaque cours',
        'Créneaux de Pilates, Yoga et Stretching ; style de yoga',
        'Planning pendant les vacances ; année de la saison',
        'Formules, tarifs, frais d’inscription, engagement, réductions',
        'Séance d’essai',
        'Coachs : prénoms, photos, diplômes, cours encadrés',
        'Nom exact et liens de l’appli CAP Fitness',
        'Mentions légales : raison sociale, SIRET, hébergeur',
        'Licence POUND',
        'Intensités indicatives des cours',
        'Vraies photos de la salle',
      ],
    },
    mentions:
      'Maquette non officielle, réalisée pour proposition et non validée par le club. Planning et slogans repris des supports du club ; les autres informations sont à confirmer. Visuels d’illustration générés par IA, personnes fictives. Mentions légales à compléter.',
  },
});

export type CapContent = typeof cap;
