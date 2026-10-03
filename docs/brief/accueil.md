# Brief de surface : page d'accueil CLUSEM (Impeccable `shape`)

> **Statut** : **validé le 2026-10-03**. Langue : français. Styles : CSS scopé et tokens. Overdrive : complet. Construction : code-first.
> Le contrat de direction est dans `.impeccable/surfaces/app-pages-index-vue.md`.
> **Cible** : la route unique `/` (Nuxt 4.5, génération statique).
> **Sources** : [`PRODUCT.md`](../../PRODUCT.md), [ADR 0001](../adr/0001-stack-nuxt-gsap.md), [analyse](../analyse/00-synthese.md).

## 1. Mission et public

- **Mode visiteur** : **Persuade** (une landing page). Impeccable choisit le mode d'après la surface demandée, pas d'après le produit.
- **Le vrai public juge l'exécution** : recruteurs et directeurs de création qui passent 30 à 90 s sur la page, d'abord sur desktop, puis en redimensionnant ou sur mobile.
- **Le public fictif** (prospect de salle de sport) donne sa crédibilité à la démo.
- **Ce que le visiteur doit vivre** :
  - **en 5 s**, l'énergie et la marque : le moment signature du hero ;
  - **en 60 s**, une page qui répond partout : défilement, survols, carrousel, accordéon, équipe, témoignages, menu ;
  - **et qui tient** quand on la redimensionne, quand on la parcourt au clavier, et en mouvement réduit.

## 2. Résultat attendu et preuves

- **Résultat** : « je suis impressionné ». C'est la phrase de l'auteur, et elle sert de critère d'acceptation.
- **Preuves livrées avec la page** :
  - la fidélité mesurée à la référence ;
  - 0 violation axe en WCAG 2.2 AA ;
  - Lighthouse 13 : Performance ≥ 90 sur mobile, 100 dans les trois autres catégories ;
  - un parcours complet en mouvement réduit, et la page lisible sans JS ;
  - un README et des ADR.
- **La conversion est fictive** : tous les liens mènent à des ancres de la page. Aucun lien mort, aucune promesse présentée comme réelle. La mention « Projet conceptuel » et le crédit au designer sont visibles dans le footer.

## 3. Direction retenue

- **Autorité visuelle : la référence, épinglée.**
  - Impeccable dit qu'une direction épinglée par le brief l'emporte sur le tirage de concepts (`new-work.md`). Il n'y a donc **pas de tirage de concepts** ; le monde est celui de la référence, rebaptisé CLUSEM.
  - `DESIGN.md` sera écrit à la fin, à partir du monde construit.
- **Thèse** :
  - **ce que la page possède** : la puissance arrêtée net. Le flou de vitesse de la photo se fige et devient la silhouette en escalier des contrôles ;
  - **ce qu'elle refuse** : l'entrée « fondu vers le haut » répétée sur chaque section.
- **Moment signature : « Vitesse → Arrêt »**, au chargement, en 1,3 s au plus, avec une page cliquable dès t = 0 :
  1. stries de vitesse sur la photo, qui se compriment ;
  2. BUILD / STRENGTH arrivent avec deux échos rouges, qui se résorbent ;
  3. les filets se tracent depuis les repères « + », qui se verrouillent ;
  4. l'astérisque avance d'un cran de 45°.
- **Grammaire de mouvement**, reprise partout :
  - **la plaque** se soulève à l'entrée, sa trace s'allonge au survol, elle s'enfonce à l'appui ;
  - **les filets** se tracent ;
  - **l'astérisque** avance d'un cran de 45° tous les ≈ 320 px de défilement ;
  - les distances sont toujours **le pas mesuré** de l'escalier (5, 12, 27 ou 70 px).
  - Courbes : `cubic-bezier(.16,1,.3,1)` pour les arrivées et `(.87,0,.13,1)` pour les crans.
- **Écho de fin** : le wordmark CLUSEM du footer rejoue le geste du hero en arrivant.
- **Conséquence technique** :
  - GSAP pour tout ce qui est séquencé ou lié au scroll ;
  - CSS (transitions, `@property --step`) pour les micro-interactions, qui fonctionnent avant le JS ;
  - tout le mouvement part d'un **état final déjà visible**, les états initiaux n'existant que sous `html.has-motion`.

## 4. Périmètre et limites

### Ce qui est reproduit tel quel (fidélité)

- L'ordre et la structure des 8 zones : header, hero, About, Services, Programs, Why, Transformation, marquee, footer.
- Les contenus, avec « VYRON » remplacé par « CLUSEM ».
- Les eyebrows (règle graduée et label mono), les numéros (01✱/02✱, index de l'accordéon, de l'équipe et du témoignage).
- Les cartes de stats « 4.9/5 » et « 20 Years », étiquetées fictives.
- Les pastilles arrondies, l'avatar rond, le marquee « Fitness Hub ».
- L'onglet rouge « Back To Home » du footer, qui remonte en haut de page.
- Les proportions mesurées : marges de 60, contenu de 1 320, gouttière de 20, sections de 120, cadre de 30, piste mise en avant à √2.

### Correctifs (et seulement eux)

| Domaine            | Correctif                                                                                                                                                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contraste          | Rouge en 4 rôles : `#F02B42` pour le display et les surfaces sans texte, `#E41E3A` pour les remplissages sous texte blanc, `#C2152C` pour le petit texte rouge sur clair, `#F64D57` pour le texte rouge sur nuit. Gris remontés (`#68696C`, `#788382`). Sous-titre du hero posé sur une **zone sombre prévue dans l'image** |
| Lisibilité         | Micro-textes à 14 px au minimum. Corps en Inter 400 à 16 px, interligne de 1,45 à 1,5                                                                                                                                                                                                                                       |
| Mobile et tablette | Recomposition section par section (synthèse §10.1). Hero en `100svh`, avec le H1 entièrement visible au chargement                                                                                                                                                                                                          |
| États              | Survol, focus visible, appui et désactivé sur chaque contrôle. Cibles de 44 px au tactile                                                                                                                                                                                                                                   |
| Accessibilité      | Menu en `<dialog>` ; accordéon et carrousels au pattern APG ; marquee arrêtable ; parcours en mouvement réduit ; contenu complet sans JS                                                                                                                                                                                    |
| Cohérence interne  | Une seule encre de titre (`#171A32`) ; H3 unifiés ; une seule règle de casse et de ponctuation ; compteur du témoignage aligné sur les points ; un visage unique par coach                                                                                                                                                  |

### Ce qu'on ne fait pas

- de nouvelle section, ni de bouton d'action ajouté dans le hero (fidélité) ;
- de changement stylistique ;
- de préchargeur, ni de curseur personnalisé ;
- de défilement détourné (scroll-jacking), ni d'effet glitch ou RVB ;
- de rotation automatique des carrousels ;
- de fiction présentée comme réelle.

## 5. États et plages de contenu

| Bloc          | Plage retenue (défaut, à corriger si besoin)                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services      | **4 cartes** : 01 Personal Training, 02 Strength Training, 03 Functional Training, 04 Conditioning. La carte 02 est active au chargement, centrée ; défilement borné ; précédent / suivant plus le clavier                         |
| Programs      | 4 items, le 01 ouvert par défaut, un seul ouvert à la fois. Chaque item porte une description, 4 tags et un coach. Contenu des items 02 à 04 à écrire (fictif)                                                                     |
| Équipe        | 5 coachs, le 03 en vedette par défaut. Sur desktop, la vedette suit le survol et le focus ; sur mobile, disposition en bento « 1 + 4 »                                                                                             |
| Témoignages   | Pile de **3 cartes**, compteur « 01 / 03 » et points synchronisés, pas d'autoplay                                                                                                                                                  |
| Menu          | Plein écran : ancres des 6 sections, téléphone fictif, réseaux sociaux, mention « concept » et crédit                                                                                                                              |
| Langue        | **Français**, au tutoiement. Le display passe à un interligne ≥ 0,9 si une capitale accentuée tombe en 2ᵉ ligne. Les masques de révélation ont un débord vertical. Les composants sont testés avec des textes 15 à 40 % plus longs |
| États globaux | Polices et images en chargement (pas de décalage de mise en page), sans JS, mouvement réduit, pause globale des animations. Pas de formulaire, donc pas d'état d'erreur                                                            |

## 6. Interaction et mise en page

- **Grille** : cadre de page (marges de 60, contenu de 1 320, gouttière de 20) avec des **gabarits en `fr` par section**, au plus près des proportions mesurées (option A de la synthèse, pour la fidélité). Pleine largeur pour le hero, le rail des services, le marquee et le footer.
- **Paliers** : moins de 40em, puis 40, 48, 64 et 80em, avec des requêtes de conteneur sur les cartes. Les mots géants s'ajustent en `cqi`, sans jamais déborder.
- **Les interactions phares**, au-delà du moment signature :

| Section        | Interaction                                                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services       | « SERVICES. » se remplit au défilement, en même temps que la trame qui « mesure ». La carte active s'inverse en noir et sa photo passe du N&B au rouge. La tuile ↪ suit la carte active |
| Programs       | La hauteur s'anime en `grid-rows`. Le contenu arrive en cascade. L'image se « ré-encoche » au changement d'item                                                                         |
| Why            | Les filets du tableau se tracent. La vedette de l'équipe se déplace au survol                                                                                                           |
| Transformation | La carte suivante sort de la pile. La citation change ligne par ligne. Le compteur tourne comme un rouleau                                                                              |
| Marquee        | Sa vitesse suit celle du défilement, avec une pause possible                                                                                                                            |
| Global         | Les astérisques avancent tous d'un cran selon une loi unique ; menu en rideau au bord en escalier ; soulignés qui se tracent ; focus qui se verrouille                                  |

## 7. Contraintes et décisions ouvertes

- **Contraintes** :
  - Nuxt 4.5 en SSG, budget JS de 110 Ko gzip au plus au premier chargement ;
  - LCP de 1,8 s au plus en labo, CLS de 0,05 au plus, 60 fps sur un mobile milieu de gamme ;
  - WCAG 2.2 AA ;
  - images Higgsfield sans aucune image du shot en entrée.
- **Ouvert** :
  - l'hébergeur ;
  - le crédit (nom et lien du designer) ;
  - les témoignages en vidéo ou en images fixes, ce qui pèse sur les crédits Higgsfield.

## Suite après validation

1. **Contrat de direction** : écrit dans le surface brief officiel (`impeccable surface-brief write`).
2. **Images** :
   - ancres de casting à valider ;
   - pilote de calibrage des crédits ;
   - production par lots.
3. **Construction par jalons**, chacun clos par les tests, axe, Lighthouse et `impeccable detect` :
   - **v0.1** : tokens et sections statiques responsive ;
   - **v0.2** : interactions et accessibilité ;
   - **v0.3** : motion.
4. **Fin de construction** :
   - revue de fin par un relecteur indépendant ;
   - `document`, qui écrit `DESIGN.md` ;
   - `audit` ;
   - `polish`.
