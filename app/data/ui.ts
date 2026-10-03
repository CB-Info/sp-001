import { typeset, typesetDeep } from '~/utils/typography';

/**
 * Textes d'interface : noms accessibles, libellés des contrôles et annonces.
 * Le contenu éditorial est dans home.ts ; ici, ce que l'interface dit d'elle-même.
 * Aucun texte n'est écrit en dur dans les composants.
 */

/** Position dans une série : « 2 sur 4 » (index à partir de 1). */
const position = (index: number, total: number) => `${index} sur ${total}`;

export const ui = typesetDeep({
  skipLink: 'Aller au contenu',
  header: {
    home: 'CLUSEM, retour en haut',
    contact: 'Contacter CLUSEM',
  },
  menu: {
    open: 'Menu',
    close: 'Fermer',
    closeLabel: 'Fermer le menu',
    dialog: 'Menu principal',
    sections: 'Sections de la page',
  },
  socials: 'Réseaux sociaux',
  carousel: 'carrousel',
  services: {
    region: 'Services',
    slide: 'service',
    list: 'Liste des services',
    previous: 'Service précédent',
    next: 'Service suivant',
    position,
    announce: (index: number, total: number, title: string) =>
      typeset(`Service ${position(index, total)} : ${title}`),
  },
  programs: { coach: 'Coach : ' },
  team: { heading: "L'équipe" },
  testimonials: {
    region: 'Témoignages de membres',
    slide: 'témoignage',
    choose: 'Choisir un témoignage',
    previous: 'Témoignage précédent',
    next: 'Témoignage suivant',
    position,
    dot: (index: number, total: number) => `Témoignage ${position(index, total)}`,
    announce: (index: number, total: number, author: string, quote: string) =>
      typeset(`Témoignage ${position(index, total)}, ${author} : « ${quote} »`),
  },
  marquee: { pause: 'Mettre en pause le bandeau défilant' },
  footer: { nav: 'Pied de page' },
});
