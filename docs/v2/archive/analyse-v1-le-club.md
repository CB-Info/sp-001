# Analyse de la V1 avant la direction B

> **Objet** : inventorier ce que la V1 (route `/`) possède, pour que la direction B (route `/v2`) en soit le contrepoint, pas une variante. Une salle de sport qui choisit entre les deux doit voir deux propositions, pas deux habillages.
> **Sources** : le code de la V1, [`PRODUCT.md`](../../PRODUCT.md), le [brief V1](../brief/accueil.md), la [vérification v0.3](../verification/v0.3.md).

## 1. Ce que la V1 est

La V1 reproduit fidèlement un shot Dribbble (« VYRON »), corrigé et animé. Son monde vient de la référence, pas du produit : c'est sa force (une exécution mesurée au pixel) et sa limite comme modèle pour un client (elle ne parle qu'à une salle de force « dure »).

| Axe           | V1 (direction A)                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Promesse      | La puissance arrêtée net : « Forge ta force »                                                                                             |
| Public client | Salle orientée force et coaching, clientèle confirmée, ambiance nocturne                                                                  |
| Palette       | Rouge de marque `#F02B42`, noir, nuit sarcelle, papier blanc ; photos étalonnées en familles (cramoisi, sarcelle, N&B, chaud)             |
| Typographie   | Tektur (display techno à pans coupés), Inter Tight, Inter, IBM Plex Mono pour les labels                                                  |
| Motifs        | Silhouette en escalier (deux plaques décalées), astérisque à 8 branches, trames « tableur » à 11 colonnes, repères « + », numéraux géants |
| Mise en page  | Grille mesurée de 1 320 px, gabarits en `fr`, display au-delà de 6rem, eyebrows mono, cartes de stats                                     |
| Mouvement     | « Vitesse → Arrêt » : stries, échos rouges, filets tracés, cran de 45° ; flou WebGL et échos de vitesse en overdrive                      |
| Photographie  | Nuit, contre-jour, sueur, flou de bougé ; un seul athlète par image ; coachs en portraits low-key                                         |
| Conversion    | Fictive et discrète : tous les liens mènent à des ancres, aucun bouton ajouté dans le hero (fidélité)                                     |

## 2. Sections et éléments

1. **Hero** plein écran : photo cramoisie, slogans, titre géant, filets et repères.
2. **À propos** : déclaration, note 4,9/5, ancienneté, portrait du coach.
3. **Services** : mot géant « SERVICES. », trame qui mesure, carrousel de 4 cartes.
4. **Programmes** : accordéon exclusif, photo à encoche, pastilles, coach.
5. **Pourquoi** : tableau des piliers, équipe de 5 avec vedette au survol.
6. **Transformation** : pile de 3 témoignages, compteur, points.
7. **Bandeau** défilant, puis **footer** : panneaux, wordmark géant, crédit.

Ce qui manque à la V1 pour un vrai client, parce que la référence ne le montrait pas : **horaires, planning des cours, tarifs, adresse, FAQ, formulaire d'essai**. Un gérant de salle les demande en premier.

## 3. Qualités à garder (le niveau d'exigence, pas l'apparence)

- **L'état final par défaut** : sans JS, en mouvement réduit, au retour arrière, tout est visible.
- **Les fondations du mouvement** : `useMotion`, `ENTRY`, `capped`, `followScroll`, ticker endormi au repos, tokens lus dans le CSS. La V2 les réutilise telles quelles.
- **La chaîne d'images** : prompts versionnés, provenance embarquée, variantes pré-générées, recadrages dirigés.
- **La preuve** : tests e2e, axe, Lighthouse, `impeccable detect`, documents de vérification.
- **La transparence** : fiction étiquetée, crédit, aucune donnée réelle inventée.

## 4. Ce que la direction B doit refuser

Tout ce qui ferait de la V2 une V1 repeinte :

- **Le noir et le rouge**, la nuit, le contre-jour, les photos teintées.
- **Le display techno** et les labels mono ; les eyebrows à règle graduée.
- **La silhouette en escalier**, l'astérisque, les trames tableur, les repères de calage.
- **Le mouvement « vitesse »** comme thèse (stries, échos, flou) : la V1 le possède.
- **Le hero photo plein écran** avec un titre géant posé dessus.
- **La conversion absente** : la V2 assume un parcours d'inscription (essai, planning, tarifs), puisque c'est ce qu'un client de salle de quartier achète.

## 5. Le contrepoint retenu

Une salle de quartier se vit comme **un club** : on y a une carte, un horaire, des coachs qu'on appelle par leur prénom, des habitués. La direction B traite CLUSEM comme un club sportif (maillot, écusson, numéros d'effectif, calendrier, carte de saison), en plein jour et en couleurs de club. Le détail est dans le [brief de la direction B](../brief/v2.md).
