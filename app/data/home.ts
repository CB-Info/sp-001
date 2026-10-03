import type { HomeContent } from '~/types/content';
import { typesetDeep } from '~/utils/typography';

/**
 * Contenu de la page d'accueil CLUSEM, en français (tutoiement, ton direct de la
 * référence). Projet conceptuel : la marque, les personnes, les chiffres et les
 * avis sont fictifs, ce que le pied de page indique explicitement.
 *
 * Les images sont pour l'instant des visuels provisoires générés localement
 * (scripts/placeholders.py) : elles seront remplacées par les images Higgsfield
 * aux mêmes chemins et aux mêmes formats.
 *
 * Le texte s'écrit au clavier : `typesetDeep` pose la typographie française
 * (apostrophes, espaces insécables) en un seul endroit.
 */
export const home: HomeContent = typesetDeep<HomeContent>({
  meta: {
    title: 'CLUSEM — Forge ta force',
    description:
      "CLUSEM, salle de force et de coaching. Projet conceptuel : reconstruction animée d'une landing page, réalisée pour un portfolio.",
  },

  nav: [
    { label: 'À propos', href: '#a-propos' },
    { label: 'Services', href: '#services' },
    { label: 'Programmes', href: '#programmes' },
    { label: 'Pourquoi CLUSEM', href: '#pourquoi' },
    { label: 'Transformations', href: '#transformations' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    slogans: ['Pousse. Répète.', 'Soulève. Domine.', 'Repousse tes limites.', 'Va plus loin.'],
    titleLines: ['Forge', 'ta force'],
    leadLines: ['Redéfinis ton', 'potentiel physique'],
    image: {
      src: '/images/hero/hero-athlete.jpg',
      alt: '',
      width: 2880,
      height: 2204,
      focal: '56% 32%',
    },
  },

  about: {
    eyebrow: 'À propos',
    statement:
      "Nous forgeons des corps plus forts et plus sains, pour une vie meilleure, grâce à un coaching d'expert.",
    cta: { label: 'En savoir plus sur nous', href: '#pourquoi' },
    rating: {
      value: '4,9',
      scale: '5',
      label: 'Note moyenne sur plus de 480 avis',
      reviewers: [1, 2, 3, 4, 5].map((n) => ({
        src: `/images/about/reviewer-0${n}.jpg`,
        alt: '',
        width: 160,
        height: 160,
      })),
    },
    years: {
      value: '20',
      label: "Ans d'excellence",
      points: [
        'Coachs experts et diplômés',
        'Équipements de dernière génération',
        'Plans nutrition et entraînement personnalisés',
      ],
    },
    image: {
      src: '/images/about/coach-alex-vance.jpg',
      alt: 'Alex Vance, coach principal, dans la salle de musculation.',
      width: 1280,
      height: 736,
      focal: '50% 29%',
    },
  },

  services: {
    display: 'Services.',
    title: 'Un entraînement intense qui te garde motivé et puissant',
    note: 'Choisi par celles et ceux qui exigent de vrais résultats.',
    items: [
      {
        id: 'coaching',
        number: '01',
        title: 'Coaching personnel',
        description:
          'Un accompagnement individuel construit autour de ton corps, de tes objectifs et de ta progression.',
        image: {
          src: '/images/services/service-01-coaching.jpg',
          alt: '',
          width: 880,
          height: 496,
        },
      },
      {
        id: 'force',
        number: '02',
        title: 'Entraînement de force',
        description:
          'Prends du muscle, gagne en puissance et maîtrise les fondamentaux avec un entraînement de force structuré.',
        image: { src: '/images/services/service-02-force.jpg', alt: '', width: 880, height: 496 },
      },
      {
        id: 'fonctionnel',
        number: '03',
        title: 'Entraînement fonctionnel',
        description:
          'Mobilité, gainage et coordination : bouge mieux au quotidien, dans chaque geste.',
        image: {
          src: '/images/services/service-03-fonctionnel.jpg',
          alt: '',
          width: 880,
          height: 496,
        },
      },
      {
        id: 'conditioning',
        number: '04',
        title: 'Préparation physique',
        description:
          'Endurance, explosivité et récupération : des circuits pensés pour tenir plus longtemps.',
        image: {
          src: '/images/services/service-04-conditioning.jpg',
          alt: '',
          width: 880,
          height: 496,
        },
      },
    ],
  },

  programs: {
    eyebrow: 'Programmes',
    title: 'Trouve ton programme.',
    intro:
      'Que tu veuilles gagner en force, en endurance, perdre du poids ou mieux bouger, choisis un programme pensé pour tes objectifs.',
    cta: { label: 'Rejoindre un programme', href: '#contact' },
    image: {
      src: '/images/programs/program-marcus-roy.jpg',
      alt: 'Marcus Roy, coach de force, entre deux cordes ondulatoires.',
      width: 1040,
      height: 1064,
      focal: '50% 15%',
    },
    items: [
      {
        id: 'force-puissance',
        number: '01',
        title: 'Prends de la force et de la puissance',
        description:
          'Un cycle progressif pour soulever plus lourd, plus vite, avec une technique solide à chaque séance.',
        tags: [
          { icon: 'calendar', label: '16 jours' },
          { icon: 'dumbbell', label: 'Prise de muscle' },
          { icon: 'bolt', label: 'Puissance' },
          { icon: 'progress', label: 'Progression' },
        ],
        coachId: 'marcus-roy',
        coachMeta: "16 jours d'entraînement",
      },
      {
        id: 'fonctionnel',
        number: '02',
        title: "Progresse avec l'entraînement fonctionnel",
        description:
          'Des mouvements complets qui renforcent tout le corps et améliorent ta mobilité au quotidien.',
        tags: [
          { icon: 'calendar', label: '12 jours' },
          { icon: 'dumbbell', label: 'Mobilité' },
          { icon: 'bolt', label: 'Coordination' },
          { icon: 'progress', label: 'Tous niveaux' },
        ],
        coachId: 'sarah-jenkins',
        coachMeta: "12 jours d'entraînement",
      },
      {
        id: 'gainage',
        number: '03',
        title: 'Renforce ton gainage et ta stabilité',
        description:
          'Un centre solide pour mieux transmettre la force, protéger ton dos et tenir la posture plus longtemps.',
        tags: [
          { icon: 'calendar', label: '10 jours' },
          { icon: 'dumbbell', label: 'Gainage' },
          { icon: 'bolt', label: 'Stabilité' },
          { icon: 'progress', label: 'Débutant' },
        ],
        coachId: 'elena-rostova',
        coachMeta: "10 jours d'entraînement",
      },
      {
        id: 'intensif',
        number: '04',
        title: 'Entraîne-toi dur, vise plus haut',
        description:
          'Des circuits intenses et mesurés pour franchir un palier, sans sacrifier la récupération.',
        tags: [
          { icon: 'calendar', label: '20 jours' },
          { icon: 'dumbbell', label: 'Conditioning' },
          { icon: 'bolt', label: 'Intensité' },
          { icon: 'progress', label: 'Confirmé' },
        ],
        coachId: 'drake-torres',
        coachMeta: "20 jours d'entraînement",
      },
    ],
  },

  why: {
    eyebrow: 'Pourquoi CLUSEM',
    title: 'Pensé pour ceux qui ne transigent pas sur leur forme',
    note: 'Conçu pour transformer : avec constance, avec précision, sans excuses.',
    statement: 'Les résultats se construisent, ils ne se donnent pas.',
    text: "Chaque séance existe pour une seule raison : te pousser plus loin quand ton corps veut s'arrêter.",
    pillars: [
      {
        title: 'Coachs experts',
        text: 'Un vrai accompagnement par des professionnels expérimentés.',
      },
      {
        title: 'Équipement premium',
        text: "Tout ce qu'il faut pour t'entraîner plus dur et plus intelligemment.",
      },
      { title: 'Vraie communauté', text: 'Un environnement motivant où chacun a sa place.' },
      { title: 'Accès 24/7', text: 'Entraîne-toi quand ton emploi du temps le permet.' },
    ],
    coaches: [
      {
        id: 'alex-vance',
        name: 'Alex Vance',
        specialty: 'Coach principal',
        portrait: {
          src: '/images/team/team-01-alex-vance.jpg',
          alt: '',
          width: 720,
          height: 904,
          focal: '50% 30%',
        },
      },
      {
        id: 'sarah-jenkins',
        name: 'Sarah Jenkins',
        specialty: 'Coach HIIT et fonctionnel',
        portrait: {
          src: '/images/team/team-02-sarah-jenkins.jpg',
          alt: '',
          width: 720,
          height: 904,
          focal: '50% 30%',
        },
      },
      {
        id: 'marcus-roy',
        name: 'Marcus Roy',
        specialty: 'Coach de force',
        portrait: {
          src: '/images/team/team-03-marcus-roy.jpg',
          alt: '',
          width: 720,
          height: 904,
          focal: '50% 30%',
        },
      },
      {
        id: 'elena-rostova',
        name: 'Elena Rostova',
        specialty: 'Coach mobilité et gainage',
        portrait: {
          src: '/images/team/team-04-elena-rostova.jpg',
          alt: '',
          width: 720,
          height: 904,
          focal: '50% 30%',
        },
      },
      {
        id: 'drake-torres',
        name: 'Drake Torres',
        specialty: 'Coach conditioning',
        portrait: {
          src: '/images/team/team-05-drake-torres.jpg',
          alt: '',
          width: 720,
          height: 904,
          focal: '50% 30%',
        },
      },
    ],
    featuredCoachId: 'marcus-roy',
    cta: { label: "Rencontrer l'équipe", href: '#contact' },
  },

  transformation: {
    eyebrow: 'Transformation',
    title: 'De vraies transformations, vécues par nos membres',
    note: "Des personnes qui s'investissent, prennent de meilleures habitudes et vivent des transformations qu'elles ressentent et qu'elles voient.",
    items: [
      {
        id: 'jordan-tucker',
        author: 'Jordan Tucker',
        quote:
          "Je suis venu pour me remettre en forme, mais je suis resté parce que, pour la première fois, j'ai vraiment aimé chaque partie de mon entraînement.",
        image: {
          src: '/images/testimonials/testimonial-01-jordan-tucker.jpg',
          alt: "Jordan Tucker à l'entraînement de boxe.",
          width: 1600,
          height: 748,
          focal: '41% 29%',
        },
      },
      {
        id: 'nadia-benali',
        author: 'Nadia Benali',
        quote:
          "À 41 ans, je soulève plus lourd qu'à 25. Les coachs m'ont appris à progresser sans me blesser, séance après séance.",
        image: {
          src: '/images/testimonials/testimonial-02-nadia-benali.jpg',
          alt: 'Nadia Benali pendant une séance de force.',
          width: 1600,
          height: 748,
          focal: '48% 18%',
        },
      },
      {
        id: 'paul-mercier',
        author: 'Paul Mercier',
        quote:
          "J'avais peur de ne pas être à ma place. Ici, chacun avance à son rythme, et personne ne lâche personne.",
        image: {
          src: '/images/testimonials/testimonial-03-paul-mercier.jpg',
          alt: 'Paul Mercier, deux kettlebells en main, pendant un circuit de préparation physique.',
          width: 1600,
          height: 748,
          focal: '50% 20%',
        },
      },
    ],
  },

  marquee: { text: 'Fitness Hub', lang: 'en' },

  footer: {
    title: 'Redéfinir la culture du fitness.',
    nav: [
      { label: 'Accueil', href: '#haut' },
      { label: 'À propos', href: '#a-propos' },
      { label: 'Programmes', href: '#programmes' },
      { label: 'Rejoindre', href: '#programmes' },
      { label: 'Contact', href: '#contact' },
    ],
    panels: [
      { title: 'Musculation', href: '#services' },
      { title: 'Retour en haut', href: '#haut' },
      { title: 'Découvrir les cours', href: '#programmes' },
    ],
    manifesto:
      "Le fitness est l'art de se transformer : convertir l'engagement en force physique, bâtir sa résilience, façonner son mode de vie et redéfinir sa façon de relever chaque défi.",
    motto: 'Repousse tes limites.',
    socials: [
      { label: 'CLUSEM sur Facebook (lien de démonstration)', href: '#contact', icon: 'facebook' },
      {
        label: 'CLUSEM sur Instagram (lien de démonstration)',
        href: '#contact',
        icon: 'instagram',
      },
      { label: 'CLUSEM sur X (lien de démonstration)', href: '#contact', icon: 'x' },
    ],
    disclaimer:
      'Projet conceptuel : marque, personnes, chiffres et avis fictifs ; visuels générés par IA. Aucune salle réelle, aucune ligne téléphonique.',
    credit:
      "Design d'origine : shot Dribbble « VYRON » (crédit à compléter). Adaptation, développement et animation pour un portfolio.",
    image: {
      src: '/images/footer/footer-pushup.jpg',
      alt: '',
      width: 2880,
      height: 1700,
      focal: '45% 32%',
    },
  },
});
