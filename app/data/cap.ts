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

/**
 * Espace insécable, écrite en clair là où `typesetDeep` ne la pose pas seule :
 * entre un nombre (ou un tiret d'attente) et son unité, « 14 h », « — € »
 * (brief §2.4 : les heures s'écrivent toujours avec U+00A0).
 */
const NBSP = '\u00a0';

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
  /*
   * Point focal haut (10 %) : sur un écran plus large que 5:3 (navigateur avec
   * ses barres), la photo garde son plafond sous l'en-tête et la tête de la
   * coach sous le bouton ; sur une tablette en portrait, la coach reste entière.
   */
  couverture: photo('cap-couverture', 2880, 1728, '', '90% 10%', { width: 864, height: 1728 }),
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
    'Cours de Step : les jambes de quatre personnes qui montent ensemble sur des steps.',
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
    'Un homme âgé, assis jambes tendues sur un tapis, se penche doucement vers ses pieds.',
    '35% 60%',
  ),
  famille: photo(
    'cap-famille',
    2880,
    1620,
    'Après un cours, un groupe de tous âges rit ensemble, assis au sol et sur des bancs ; un homme, debout, s’étire.',
    '55% 40%',
    { width: 1296, height: 1620 },
  ),
  lieu: photo(
    'cap-lieu',
    2880,
    1234,
    'Une salle de biking vide, la nuit, éclairée par la lumière de la rue.',
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

/*
 * Contenu d'un cours (fiche) : l'accroche, une seule description (ce que c'est),
 * puis quatre repères au plus, dans l'ordre des questions d'un premier visiteur :
 * pour qui, ce qu'on y gagne, le matériel, les précautions. Les inconnues (durée,
 * nombre de places, style de yoga) ne sont pas écrites dans la fiche : elles
 * sont listées au pied de page (« Ce qui reste à confirmer par le club »).
 */
const courses: Course[] = [
  {
    slug: 'pound',
    nom: 'Pound',
    groupe: 'cardio',
    intensite: { valeur: 4, mot: 'soutenue', statut: 'repere' },
    accroche: 'Tape le rythme, baguettes en main.',
    texte:
      'Du cardio et du renforcement en musique : tu frappes le sol et l’air en rythme, comme un batteur, pendant que squats, fentes et gainage s’enchaînent.',
    champs: [
      field(
        'Pour qui',
        'Tous niveaux, surtout si le cardio classique t’ennuie. Les sauts sont facultatifs.',
      ),
      field('Tu y gagnes', 'Cardio, coordination, épaules, bras, gainage. Et un vrai défouloir.'),
      field('Matériel', 'Baguettes et tapis, fournis.'),
    ],
  },
  {
    slug: 'cardio-jump',
    nom: 'Cardio Jump',
    groupe: 'cardio',
    intensite: { valeur: 5, mot: 'intense', statut: 'repere' },
    accroche: 'Rebondis jusqu’au dernier refrain.',
    texte:
      'Des chorégraphies de rebonds en musique, chacun sur son mini-trampoline. Ça monte vite dans le cœur, et ça rit beaucoup.',
    champs: [
      field('Pour qui', 'Dès le niveau débutant motivé : le trampoline amortit les chocs.'),
      field('Tu y gagnes', 'Cardio, endurance, jambes et fessiers, gainage profond.'),
      field('Matériel', 'Un trampoline par personne.'),
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
      'De l’aérobic sur une marche réglable : on apprend les pas par blocs, puis tout s’enchaîne en musique.',
    champs: [
      field('Pour qui', 'Tous niveaux : l’intensité se règle avec la hauteur du step.'),
      field('Tu y gagnes', 'Cardio, coordination, mémoire, jambes et fessiers, avec peu d’impact.'),
      field('Matériel', 'Step réglable.'),
    ],
  },
  {
    slug: 'cross-training',
    nom: 'Cross training',
    groupe: 'force',
    intensite: { valeur: 5, mot: 'intense', statut: 'repere' },
    accroche: 'Court, intense, jamais pareil.',
    texte:
      'Un entraînement en circuit : échauffement, technique, puis le défi du jour, chronométré. Ta charge reste la tienne, le groupe t’emmène jusqu’au bout.',
    champs: [
      field('Pour qui', 'Tous niveaux : charges et mouvements sont adaptés à chacun.'),
      field('Tu y gagnes', 'Force, cardio, explosivité, polyvalence.'),
      field('Matériel', 'Kettlebells et matériel du club.'),
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
      'Du renforcement ciblé du bas du corps et de la sangle abdominale : squats, fentes, ponts et gainage, en séries.',
    champs: [
      field('Pour qui', 'Tous niveaux.'),
      field('Tu y gagnes', 'Jambes et fessiers toniques, gainage, stabilité du bassin, posture.'),
      field('Matériel', 'Poids du corps, élastiques, lests, tapis.'),
      field('Précautions', 'Après une grossesse, demande au coach d’adapter le travail des abdos.'),
    ],
  },
  {
    slug: 'pilates',
    nom: 'Pilates',
    groupe: 'calme',
    intensite: { valeur: 2, mot: 'douce', statut: 'repere' },
    accroche: 'Lent, précis, et pourtant tout travaille.',
    texte:
      'La méthode Pilates : renforcer les muscles profonds du centre du corps, en mouvements lents guidés par la respiration.',
    phrase: 'Renforce, tonifie et améliore ta posture.',
    champs: [
      field('Pour qui', 'Tous niveaux, et un bon complément aux cours intenses.'),
      field('Tu y gagnes', 'Posture, dos, gainage profond, contrôle.'),
      field('Matériel', 'Tapis, petit matériel possible.'),
    ],
  },
  {
    slug: 'yoga',
    nom: 'Yoga',
    groupe: 'calme',
    intensite: { valeur: 1, mot: 'calme', statut: 'repere' },
    accroche: 'Un moment rien que pour toi.',
    texte: 'Des postures, de la respiration, et une relaxation pour finir.',
    phrase: 'Respire, relâche les tensions et retrouve ton équilibre.',
    champs: [
      field('Pour qui', 'Tous niveaux.'),
      field('Tu y gagnes', 'Souplesse, équilibre, apaisement.'),
      field('Matériel', 'Tapis.'),
    ],
  },
  {
    slug: 'stretching',
    nom: 'Stretching',
    groupe: 'calme',
    intensite: { valeur: 1, mot: 'calme', statut: 'repere' },
    accroche: 'Le complément de tes cours intenses.',
    texte: 'Des étirements et de la mobilité, au calme, en respirant : pour bouger plus librement.',
    phrase: 'Gagne en souplesse, récupère mieux.',
    champs: [
      field('Pour qui', 'Tous niveaux.'),
      field(
        'Tu y gagnes',
        'Souplesse et récupération, surtout après le Cross training ou le Cardio Jump.',
      ),
      field('Matériel', 'Tapis.'),
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
    title: 'CAP Fitness by EBC Sport : cours collectifs, planning et réservation (maquette)',
    description:
      'Maquette non officielle de site pour CAP Fitness by EBC Sport : cours collectifs, planning de la saison d’après le flyer du club, réservation dans l’appli ou à l’accueil.',
    /** Texte de remplacement de l'image de partage (public/v2/og.png). */
    imageAlt: 'Logo CAP Fitness by EBC Sport, avec la mention « Maquette non officielle »',
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
    /** Lien vers le fichier .ics d'un créneau (nom complet en aria-label). */
    agenda: '＋ Agenda',
    /**
     * « mer. prochain 18 h 00 » : le créneau du jour déjà commencé ne revient que
     * dans sept jours ; sans ce mot, on lirait « aujourd'hui, déjà passé ».
     */
    jourProchain: 'prochain',
    /**
     * La direction 1 (/) est une autre maquette, pour une salle fictive : le
     * libellé le dit, pour que le club n'y lise pas une première proposition.
     */
    otherDirection: { label: 'Voir un autre projet : CLUSEM, salle fictive', href: '/' },
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
    /** Une seule idée sous les slogans : pas de chiffres (ils sont dans « Ta semaine »). */
    texte:
      'Ici, on vient pour bouger, et on revient pour les gens. Que tu débutes ou non, tu trouves ta place dès le premier cours, avec des coachs diplômés pour t’accompagner.',
  },

  courseSection: {
    delie: 'Fais monter',
    plein: 'le cœur.',
    signature: 'Puis redescends en douceur.',
    groupes: {
      cardio: 'cardio en musique',
      force: 'force et intensité',
      calme: 'retour au calme',
    },
    intensite: 'Intensité',
    surCinq: 'sur 5',
    fiche: ' : la fiche',
    /** Ligne d'action visible sous chaque cours : la fiche s'ouvre et se ferme. */
    voir: 'Voir le cours',
    fermer: 'Fermer',
    creneaux: 'Créneaux',
    prochain: 'Prochain créneau',
    creneau: 'Créneau',
    aConfirmer: 'Créneaux à confirmer',
    reserver: 'Réserver ce cours',
    agenda: 'Ajouter à mon agenda',
    ajouter: 'Ajouter le {cours} du {jour}, {heure} à mon agenda',
    enchainement: 'Le mercredi soir, enchaîne CAF puis Cross training.',
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
      legende: 'Filtrer les cours',
      options: [
        { id: 'tout', label: 'Toute la semaine' },
        { id: 'cardio', label: 'Cardio en musique' },
        { id: 'force', label: 'Force et intensité' },
        { id: 'midi', label: 'Pause de midi' },
      ],
      idees: 'Plus d’idées',
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
    coupure: `14${NBSP}h → 17${NBSP}h`,
    maintenant: 'maintenant',
    aujourdhui: '(aujourd’hui)',
    prochainCours: 'prochain cours',
    commenceA: 'commencé à {heure}',
    reserverSuffixe: ' — choisir, {jour}',
    /** Ce que fait un créneau quand on le touche (visible au-dessus du planning). */
    astuce: 'Touche un créneau pour le choisir, puis réserve-le.',
    choisir: 'Choisir',
    choisi: 'Choisi',
    jeudi: 'Pas de cours collectif au planning ce jour-là.',
    bienEtre: 'Pilates, Yoga, Stretching : créneaux à confirmer',
    bienEtreJour: 'Retour au calme',
    weekend: 'Samedi et dimanche : pas de cours collectif au planning.',
    mentions: 'Planning de la saison, susceptible d’évoluer pendant les vacances.',
    jours: ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.'],
  },

  book: {
    /**
     * « Réserve ta place » mène ici : la section dit comment réserver, en trois
     * étapes. La réservation elle-même se fait dans l'appli ou à l'accueil ;
     * l'agenda n'est qu'un rappel.
     */
    titre: 'Comment réserver',
    etapes: ['Choisis ton cours', 'Réserve ta place', 'Ajoute-le à ton agenda'],
    choisi: 'Tu as choisi :',
    prochain: 'Prochain cours :',
    premier: 'Premier cours de la semaine :',
    changer: { label: 'Changer de cours', href: '#semaine' },
    reserver: 'Dans l’appli CAP Fitness, ou à l’accueil : on s’en occupe avec toi.',
    appli: { titre: 'Appli CAP Fitness', pending: 'liens App Store et Google Play à venir' },
    accueil: {
      titre: 'À l’accueil',
      adresse: 'adresse à confirmer',
      lien: { label: 'Voir les infos pratiques', href: '#infos' },
    },
    bouton: 'Ajouter ce cours à mon agenda',
    /**
     * Suite du nom du bouton, en texte masqué. Elle commence par une espace et un
     * mot, jamais par une virgule : Chromium entoure d'un séparateur le texte
     * d'un élément hors flux, ce qui donnerait « agenda , Pound ».
     */
    boutonSuite: ' pour {cours}, {quand}',
    semaine: { label: 'ou toute la semaine (8 créneaux)', href: '/v2/agenda/semaine.ics' },
    /** Les trois questions d'un premier visiteur, sans attendre la FAQ du bas de page. */
    premiereFois: {
      titre: 'Première fois ?',
      items: [
        {
          question: 'Je débute, c’est pour moi ?',
          reponse: 'Oui : tous les cours sont ouverts à tous les niveaux, le coach adapte.',
        },
        {
          question: 'Qu’est-ce que j’apporte ?',
          reponse: 'Une tenue confortable, des baskets propres, une gourde et une serviette.',
        },
        {
          question: 'Un cours d’essai ?',
          reponse: 'Passe à l’accueil : on en parle avec toi.',
        },
      ],
    },
  },

  family: {
    delie: 'Plus qu’une salle,',
    plein: 'une famille.',
    chapeau:
      'On se dépasse ensemble, dans la bonne humeur. Ceux qui reprennent, ceux qui s’y mettent, ceux qui ne ratent pas un mercredi soir : tout le monde a sa place.',
    avis: 'Avis Google : à venir',
    coachs: {
      titre: 'Tes coachs.',
      texte: 'Diplômés, pour t’accompagner et te motiver.',
      cadre: 'Portraits et diplômes de l’équipe : à venir',
    },
  },

  practical: {
    plein: 'Viens nous',
    delie: 'voir.',
    /** Une seule note pour le chapitre : ce que signifie le tiret. */
    note: 'Les infos marquées « — » sont à confirmer par le club.',
    acces: {
      titre: 'Accès et contact',
      lignes: [
        { label: 'Adresse', valeur: 'adresse à confirmer' },
        { label: 'Parking et accès PMR', valeur: 'à confirmer' },
        { label: 'Téléphone', valeur: 'à confirmer' },
        { label: 'E-mail', valeur: 'à confirmer' },
        { label: 'Instagram, Facebook', valeur: 'liens à confirmer' },
      ],
    },
    accueil: {
      titre: 'Accueil',
      vide: 'horaires à confirmer',
    },
    formules: {
      titre: 'Formules',
      legende: 'Formules',
      colonnes: ['Formule', 'Prix'],
      lignes: [
        { nom: 'Cours collectifs', detail: 'les cours du planning' },
        { nom: 'Salle et cours', detail: '' },
        { nom: 'Séance à l’unité', detail: '' },
      ],
      pending: 'tarif à confirmer',
      note: 'Demande les tarifs à l’accueil.',
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
        'Commune, adresse, parking et accès PMR, plan d’accès',
        'Téléphone, e-mail, Instagram, Facebook, fiche Google',
        'Horaires de la salle et de l’accueil, libre-service',
        'Durée de chaque cours, nombre de places, matériel fourni',
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
