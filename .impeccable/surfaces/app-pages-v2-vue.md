---
version: 1
slug: "app-pages-v2-vue"
primary_target: "app/pages/v2.vue"
related_targets: []
---

# Surface : direction B « Le Club » (`/v2`)

Mode visiteur : Persuade. Une page d'inscription pour une salle de quartier, et un modèle que l'auteur proposera à des gérants de salle. Brief : `docs/brief/v2.md` ; analyse de la V1 : `docs/v2/analyse-v1.md`. Langue : français (tutoiement). Construction : code-led.

Audience et job : un habitant du quartier, sur mobile d'abord, qui hésite à s'inscrire ; il doit trouver cours, horaires, prix, adresse et essai gratuit en une minute. Action : la séance d'essai (formulaire de démonstration, rien n'est envoyé). Preuve : fiction étiquetée (chiffres, tarifs, avis, adresse), WCAG 2.2 AA, Lighthouse, mouvement réduit complet.

## Direction contract

THESIS: L'appartenance : CLUSEM est un club qu'on rejoint, pas une salle qu'on loue (maillot, numéro, calendrier, effectif). Refuse la landing de salle par défaut (hero photo sombre, néon, slogan martial) et l'éditorial crème à serif italique.

OWN-WORLD: Couleurs de club : vert bouteille #0F5233 en champs entiers (hero, calendrier, footer), jaune canari #FFD83D pour la bande du maillot et les actions, blanc maillot #FFF, gris-vert de fond photo #E3E9E4, encre vert-noir #0B2418. Saira variable (chasse 125 % et graisse 800-900 pour flocage et titres, chasse 75 % pour les numéros) ; Schibsted Grotesk pour le texte. Bandes de maillot, écusson, filets de terrain blancs de 2 px, arcs du rond central, cartes à collectionner, carte de saison à talon perforé, écharpe tricotée en jacquard. Coins de carte plastifiée à 14 px, pilules pour les actions.

STORY: Le visiteur se voit membre (son prénom floqué), comprend l'offre (disciplines, méthode), trouve son créneau (calendrier vivant), rencontre l'effectif, choisit sa carte de saison, entend les membres, sait où et quand venir, puis réserve son essai, qui reprend son prénom.

FIRST VIEWPORT: Champ vert bouteille plein écran, cerclé de bandes horizontales à peine plus claires (le tissu), cadre de touche blanc et arc du rond central derrière le maillot. En-tête sur le vert : écusson et CLUSEM en Saira large, quatre liens, pilule canari « Séance d'essai ». À gauche, « REJOINS / LE CLUB. » en Saira large très grasse (seconde ligne canari), texte d'appui, pilule « Prendre ma séance d'essai » et lien contour « Voir le calendrier », puis la ligne de programme « Saison 26/27 · Club de force et de forme · Lyon » en casse normale. Les titres de section portent leur numéro de programme dans leur première ligne, sans surtitre. À droite, le maillot de dos sur un cintre : nom floqué au-dessus du numéro 26, champ « Floque ton maillot » dessous. Sous le pli, la ligne de touche porte « Prochain cours » en direct. Interaction signature : le flocage lettre par lettre, au fer à transfert.

FORM: Seed concept-seed 0c909068b67cc679d1c72bd19228c542, candidat assigné 3 (le club sportif) parmi sept ancrés dans le monde des pratiquants. Relevé par les challengers : ligne « maintenant » (boîte à rythmes), grille stricte unique (ASCII), annotations à valeurs réelles épinglées (tenségrité, compétitif), ligne d'horizon continue (soleil intérieur), macaron qui signale le changement (céréales), sections différenciées par motif et non par anarchie (affiches suisses, compétitif). Landing à 13 zones, conversion assumée.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, the documented world, and every shipping raster carrying its provenance

## Open decisions

Nom et identité réels d'un futur client (remplacent CLUSEM, l'écusson, les couleurs et les contenus).
