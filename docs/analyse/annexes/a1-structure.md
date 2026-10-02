> **Annexe brute** : rapport de l’agent `a1-structure`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

# VYRON — Analyse structurelle (lentille a1 : structure, architecture d'information, grille, espacement)

> Référentiel Impeccable v4.5 : `layout.md` (évaluation de la mise en page + thèse spatiale), `shape.md` (brief et questions), `mode-persuade.md` (landing page), `craft-floor.md` (seulement pour signaler les tensions).
> Mode visiteur : **Persuade**, sur une page qui est aussi une pièce de portfolio jugée sur le craft. Règle « the brief wins » : l'utilisateur a épinglé l'univers visuel de cette référence. Je présente donc chaque écart au craft-floor comme une **décision à prendre**, sans le corriger d'office.
> Note : le harness a refusé l'écriture de `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/work/a1-structure/report.md` (les sous-agents doivent rendre leur rapport en texte). Le rapport complet est donc uniquement ici. Les fichiers d'appui sont dans `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/work/a1-structure/` : `cross.png`, `hero-left.png`, `hero-right.png`, `btn.png`, `z1.png`, `z2.png` et `rows.txt`.

---

## 0. Méthode, échelles et conventions

**Légende des valeurs**
- **[M] MEASURED** : mesuré au pixel avec PIL/numpy (profils de lignes et de colonnes, détection des filets, boîtes englobantes, échantillonnage des couleurs).
- **[E] ESTIMATED** : déduit d'une mesure via une hypothèse, par exemple la conversion depuis 1.png (basse définition) ou le passage de la hauteur de capitale à la taille de police.
- **[I] INFERRED** : interprétation d'une intention, d'un comportement ou d'un état.

**Facteurs d'échelle**

| Source | Cadre du site mesuré | Facteur vers 1440 | Précision à 1440 |
|---|---|---|---|
| 2.png, 3.png, 4.png | x 100 → 1499, soit **1400 px** [M] | **× 1,0286** | ± 2 px |
| 1.png (page entière) | x 20,3 → 386,4, soit **366,1 px** [M] | **× 3,933** | ± 4 à 8 px (1 px source = 3,9 px) |
| s1 à s7 | agrandissements 4× Lanczos de 1.png | — | aucune information en plus, servent seulement à lire le texte |

- **La largeur de 1440 px est une hypothèse [E].** Les deux sources concordent : le hero mesure 1072 px dans 2.png, soit 1103 à 1440, et 280,2 px dans 1.png, soit 1102 à 1440 [M]. L'écart d'1 px valide les deux facteurs.
- **Point de départ de 3.png** : il commence exactement au haut de la section Services. Sa bande réglée de tête fait 50 px, soit 51 à 1440, la même que dans 1.png [M].
- **Point de départ de 4.png** : il est rogné environ 15 px sous le haut de la section Why. Je l'ai recalé sur trois repères communs avec 1.png (eyebrow, titre, haut des photos), avec un décalage constant de 84,5 px [M].
- Le fond gris clair (#E4E2E3) autour du cadre est le support Dribbble et ne fait pas partie du site.
- Les coordonnées « @1440 » sont relatives au bord gauche du site (x) et au **haut de la section** (y), sauf mention contraire.

---

## 1. Carte des sections

| # | Section | Rôle dans le récit de persuasion (comprendre / croire / faire) | Hauteur @1440 | % page | Fond | Densité |
|---|---|---|---|---|---|---|
| 0 | Header (posé sur le hero) | S'orienter : marque, menu, appel direct | ~86 [E] (rangée centrée à y = 43 [M]) | — | transparent sur photo | faible |
| 1 | **Hero** | Accroche : « salle de force, intensité ». Le visiteur doit ressentir l'énergie et comprendre l'offre. **Aucune action principale visible** (voir § 4.2-1) | **1102** [M] | 14,3 % | photo en duotone rouge, flou de mouvement, dégradé noir en bas | faible en éléments, maximale en intensité |
| 2 | **About** | Crédibilité : promesse (« We forge stronger… ») et preuves chiffrées (4.9/5, 480+ avis, 20 ans) avec un visage de coach. Il doit croire : sérieux et expérimenté. Il peut faire : « Learn More About Us » | **755** [E] | 9,8 % | blanc #FFFFFF [M] | moyenne |
| 3 | **Services** | Offre : les catégories d'entraînement (personal, strength, functional…). Il doit comprendre ce qu'on lui vend. Il peut faire : parcourir le carrousel | **1294** [E] | 16,8 % | gris clair #F5F5F5 [M] | en-tête calme puis rangée dense |
| 4 | **Programs** | Choix : trouver le programme adapté à son objectif (4 programmes, durée, tags, coach). Il peut faire : « View All Programs » | **1176** [E] | 15,3 % | blanc [M] | dense |
| 5 | **Why VYRON** | Différenciation et preuve humaine : 4 piliers (coachs, matériel, communauté, 24/7) et l'équipe. Il doit croire : « mieux qu'ailleurs, avec des vraies personnes ». Il peut faire : « Meet the Team » | **1219** [E] | 15,9 % | quasi-noir teinté vert #040F0E [M] | **la plus dense** |
| 6 | **Transformation** | Preuve sociale et émotion : une vidéo et un témoignage client. Il doit croire : « les résultats sont réels » | **1233** [E] | 16,0 % | blanc [M] | calme |
| 7 | **Marquee** | Respiration cinétique, transition vers la clôture (« Fitness Hub » répété) | **55** [E] | 0,7 % | rouge #F02B42 [M ±] | — |
| 8 | **Footer** | Clôture et relance : signature (« Redefining fitness culture »), navigation (dont « Join Now »), 3 panneaux, wordmark géant | **849** [E] | 11,0 % | photo rouge vers noir | dense |
| | **Total** | | **≈ 7684 px**, soit 8,5 écrans de 1440 × 900 [E] | 100 % | | |

**Arc narratif** [I] : Accroche → Crédibilité → Offre → Choix → Différenciation et équipe → Preuve → Relance.

**Manques pour un mode Persuade** [I] :
- une action principale dans le hero ;
- une offre concrète (abonnement, essai gratuit, tarifs) ;
- les infos pratiques d'une salle (adresse, horaires, planning) ;
- un appel final avant le footer.

Le seul « Join Now » de la page est un lien parmi d'autres dans la navigation du footer.

---

## 2. Spécification de mise en page, section par section

### 2.0 Constantes partagées par toutes les sections

| Constante | Valeur @1440 | Preuve |
|---|---|---|
| Zone de contenu | **60 → 1380 (1320 px)** | [M] 158 → 1442 sur 3.png et 4.png = 1284 px shot → 1320,7 ; filets, bords des grilles, eyebrows, logo |
| Marges latérales | **60 px** | [M] mêmes mesures. Les éléments en pleine largeur (hero, rangée des services, marquee, footer) vont de 0 à 1440 |
| Gouttière entre tuiles | **20 px** | [M] photos de l'équipe : 19 à 20 px shot ; cartes Services : 19 à 21 ; cartes About : 5 px dans 1.png, soit environ 20 [E] |
| Padding vertical des sections | **≈ 120 px en haut et en bas** | [E ± 8] About 120 / 116 ; Programs 124 / 120 ; Why 124 / 119 ; Transformation 124 / 114 ; Services 117 en bas |
| Bande réglée en tête des sections claires | **51 px** (+ ~12 px de fondu dans About, Programs et Transformation) | [M] sur 3.png : 11 cellules verticales sur toute la largeur du cadre (127,3 shot, soit 131 @1440) et un filet horizontal tous les ~6,5 px. Elle sert de séparateur |
| Eyebrow → titre | **48 px** | [M] Why 47,3 ; [E] Programs et Transformation 47 |
| Bloc titre → contenu | **48 px** | [M] Why 47,9 |
| Silhouette « en escalier » (motif de forme) | union de **2 rectangles identiques décalés** vers le bas et la droite. Décalage d'environ **12 px** sur les petits éléments : bouton 201 × 48 décalé de 12 × 4 à 10 [M], icône 91 × 91 décalée de 12 × 9 [M]. Environ **14 % de la largeur** sur les images : photo About ~65 px, photo Programs ~71 px [E] | 4.png, 3.png et 1.png |
| Rayons | **0 partout** [M], sauf les tags du programme (pilules) et l'avatar (cercle) [E] | |
| Couleurs structurantes | texte bleu nuit #0D1127, rouge #F02B42, carte noire #000, fond sombre #040F0E, filets sur fond sombre #1C2726 à #202B2A | [M] |

### 2.1 Header + Hero (1440 × 1102)

**Conteneur** : la photo va bord à bord. Le contenu respecte les marges de 60. Un **cadre de filets intérieur** est placé à **30 px des bords**, soit la moitié de la marge : verticales à x = 29,3 et 1409,7 [M], sur toute la hauteur du hero.

| Élément | x @1440 | y @1440 | Taille | Tag |
|---|---|---|---|---|
| Logo « VYRON™ » | 62 → 252 | 27 → 60 | 190 × 33 | [M] |
| Groupe « MENU » (icône grille de 9 points + libellé) | 1218 → 1289 | centre 43 | — | [M] |
| Bouton téléphone (carré blanc en escalier) | 1336 → 1374 | 24 → 62 | 38 × 38 | [M] |
| Astérisque blanc | 61 → 132 | 179 → 250 | 71 × 71 | [M] |
| Liste de slogans (4 rangées séparées par 5 filets) | 60 → 568 | filets à 308 / 366 / 425 / 483 / 542 | rangée de **58,5** | [M] |
| Mires « + » (4 marques) | centres 71 / 503,5 / 936 / 1369 | 656 | ~23 px, centre ajouré | [M] |
| Filets horizontaux du cadre | 30 → 1410 | **740** et **1048** | bande de 307 | [M] |
| « BUILD » | 57 → 552 | capitales 759 → 885 | capitale **125,5** | [M] |
| « STRENGTH » (en retrait) | 272 → 1123 | capitales 905 → 1030 | capitale 124,5 | [M] |
| « Redefine Your / Physical Potential » | 768 → 1047 | 812 → 879 | 2 lignes, pas de 40 | [M] |
| 3 flèches rouges → | 1031 → 1130 | 819 → 836 | — | [M] |

**Rythme interne**
- Le header est centré à y = 43 [M].
- Il y a exactement **une hauteur de rangée (58)** entre l'astérisque et le premier filet de la liste [M] : la liste est rythmée par son propre module.
- Le titre est centré verticalement dans la bande de filets 740 → 1048, avec 19 px au-dessus et 18 px en dessous [M]. Le bas du hero tombe 55 px sous le filet inférieur [M].
- Le pas de ligne du titre est de **146 px** [M]. J'estime la police à ~175 px avec un interlignage de ~0,84 [E].
- Le retrait de STRENGTH est de **215 px** [M]. Le sous-titre occupe le vide à droite de BUILD : la composition s'imbrique.

**Mires** : les pointes extérieures des deux mires extrêmes tombent **exactement sur les bords du contenu, 60 et 1380** [M ± 1]. Les 4 mires sont équidistantes, avec un pas de 432,7 [M]. C'est une vraie trace de grille (marques de repérage d'imprimerie).

**Couches (z, du fond vers l'avant)**
- z0 : photo de la sportive. Le visage occupe à peu près x 450 → 1250 [E].
- z1 : duotone rouge et flou de mouvement horizontal.
- z2 : bandes verticales façon **verre cannelé** sur le tiers droit, d'environ 80 px de large, avec des arêtes vers x ≈ 1123 / 1205 / 1287 / 1361 @1440 [M approx.]. Elles font peut-être partie de la photo [I].
- z3 : dégradé noir sur environ 35 % du bas [E].
- z4 : cadre de filets et mires.
- z5 : contenu.

Le titre passe **au-dessus** du bras et du gant, sans masquage [M visuel].

**Pli de page** : sur un écran de 1440 × 900, le bas de STRENGTH (y = 1030) tombe **sous le pli**. Seul BUILD (759 → 885) est visible [E].

**Texte, verbatim**
- `VYRON™` · `MENU`
- `PUMP. REPEAT.` · `LIFT. CRUSH IT.` · `PUSH YOUR LIMITS.` · `DIG DEEPER.`
- `BUILD` / `STRENGTH`
- `Redefine Your` / `Physical Potential`

### 2.2 About (1440 × 755)

**Structure** : une rangée d'en-tête en **2 colonnes**, puis une rangée de **3 cartes égales**.

| Élément | x @1440 | y @1440 | Tag |
|---|---|---|---|
| Bande réglée | 0 → 1440 | 0 → ~63 | [E] |
| Eyebrow « [ticks] About Us » | 58 → ~215 | 124 | [E] |
| Phrase-titre (3 lignes, capitale ~25, pas ~35) | **750** → 1363 | 120 → 222 | [E] |
| Bouton noir « Learn More About Us » (en escalier) | 746 → 986 | 266 → 317 | [E] |
| Carte 1 rouge (stat) | 54 → 487 | 391 → 639 | [E] |
| Carte 2 gris clair (stat + liste) | 506 → 931 | 391 → 639 | [E] |
| Carte 3 photo (en escalier) | 951 → 1379 | 391 → 639 | [E] |

**Colonnes**
- Dans l'en-tête, la colonne gauche ne contient que l'eyebrow. La colonne droite commence à 750 : c'est ce que donnent 2 colonnes séparées de 60, puisque (1320 − 60) / 2 = 630 et que la colonne droite commence alors à 750 [I].
- Les cartes ont 3 pistes de ~428 avec une gouttière de 20 [E]. Cela correspond **exactement** à 4 / 4 / 4 colonnes sur une grille de 12.

**Rythme interne** : 43 entre la phrase et le bouton, 75 entre le bouton et les cartes (≈ 80), 116 de padding en bas [E].

**Contenu des cartes**
- Carte 1 : « 4.9/5 » en grand en haut à gauche, padding ~28 [E], libellé dessous, 5 avatars carrés en bas (marge basse ~20) [E], texture bruitée ou tramée [E].
- Carte 2 : « 20 » et le libellé en haut, une liste à puces en bas.
- Carte 3 : photo d'un coach en polo rouge, silhouette en escalier (union décalée de ~65 × 13 à 27) [E].

**Texte** (lu sur un agrandissement flou, donc **lecture probable**)
- `About Us` ; le préfixe entre crochets est une série de traits rouges en code-barres.
- `WE FORGE STRONGER, HEALTHIER BODIES FOR A BETTER LIFE THROUGH EXPERT COACHING.`
- `Learn More About Us`
- `4.9/5` · `AVERAGE RATING FROM 480+ VERIFIED REVIEWS` (le « 480 » est **incertain**)
- `20` · `YEARS OF EXCELLENCE`
- `Expert certified personal trainers` · `State-of-the-art gym equipment` · `Personalized nutrition and training plans` (puces **lecture probable**)

### 2.3 Services (1440 × 1294), mesurée sur 3.png (haute définition)

| Élément | x @1440 | y @1440 | Tag |
|---|---|---|---|
| Bande réglée | 0 → 1440 | 0 → 51 | [M] |
| « SERVICES. » (rouge, glyphes) | 74 → 1352 | capitales 118 → 311 (**capitale 192**) | [M] |
| Filet 1 | 60 → 1380 | 390 | [M] |
| Titre (3 lignes, capitale ~40, pas 56) | 63 → 772 | 419 → 570 | [M] |
| Aparté en mono gris (2 lignes, pas 20,6) | 1070 → 1374 | 478 → 511 | [M] |
| Filet 2 | 60 → 1380 | 600 | [M] |
| Bloc de texture réglée (11 cellules de 120, filets horizontaux tous les 6,7) | 60 → 1380 | 620 → 727 | [M] |
| Rangée de cartes (pleine largeur) | 0 → 1440 | 807,5 → ~1178 (hauteur **~370** [E] d'après 1.png) | [M] / [E] |

- **Le mot géant remplit le conteneur** : 1278 / 1320 = 97 %, ce qui signale un texte ajusté à la largeur [M]. J'estime la police à ~275 px [E].
- **Rythme interne** [M] : 80 entre SERVICES et le filet 1, 28 entre le filet 1 et le titre, 30 entre le titre et le filet 2, 20 entre le filet 2 et la texture, 80 entre la texture et les cartes, ~117 de padding en bas [E].
- L'aparté est **centré verticalement** sur le bloc titre (centre 580,5 contre 581 dans le shot) [M].

**Rangée de cartes**, en positions visibles, gouttières de 20 [M] :

| Carte A (blanche) | Icône rouge en escalier | **Carte B (noire)** | Carte C (blanche) |
|---|---|---|---|
| 0 → 325 (coupée par le bord gauche) | 347 → 437 (91 × 91) | **458 → 1093 (636)** | 1113 → 1440 (coupée par le bord droit) |

- **L'unité active (icône + carte B) va de 347 à 1093. Son centre tombe à 720, soit exactement le centre de la page** [M ± 1]. J'en déduis un **carrousel centré** : la diapositive active au centre, les voisines à moitié visibles [I].
- La carte A montre la moitié **droite** d'une carte construite comme B : description en haut à droite et numéro « 01 » en bas à droite, avec les mêmes retraits depuis le bord droit (289 contre 290 shot) [M].
- La carte C montre la moitié **gauche** : image en haut à gauche avec un padding de 20 et titre en bas à gauche [M].
- Le titre de la carte A n'est pas visible ; ce serait probablement « Personal Training » [I].

**Intérieur de la carte B** [M]
- padding de 20 ;
- image de 218 × 122 en escalier en haut à gauche ;
- description en haut à droite (x 795 → 1068) ;
- filet médian à 184 px du haut de la carte ;
- titre « STRENGTH TRAINING » en bas à gauche, capitales à 290 depuis le haut de la carte ;
- numéro géant « 02 » en bas à droite, avec un **astérisque rouge qui chevauche le chiffre** (au-dessus du numéro).

**État des cartes** [I] : la carte noire est l'état actif (ou le survol) ; les cartes blanches sont inactives.

**Texte**
- `SERVICES.`
- `HIGH-INTENSITY TRAINING KEEPS YOU MOTIVATED AND POWERFUL`
- `Trusted by people who demand real fitness results.`
- Carte A : `One-on-one coaching built around your body, your goals, and your individual progress.` · `01`
- Carte B : `Build muscle, increase power, and master the fundamentals with structured strength training.` · `STRENGTH TRAINING` · `02`
- Carte C : `FUNCTIONAL TRAINING` (sa description est hors cadre)

### 2.4 Programs (1440 × 1176), mesures issues de 1.png donc [E ± 4–8]

**Structure** : 2 colonnes asymétriques, à gauche de **519** (58 → 577) et à droite de **727** (656 → 1383), séparées de ~78. Le rapport droite / gauche vaut **1,40 ≈ √2** [E].

| Élément | x @1440 | y @1440 |
|---|---|---|
| Eyebrow « Fitness Programs » | 58 | 128 |
| Titre (2 lignes) | 58 → 558 | 191 → 289 |
| Paragraphe (2 lignes) | 58 → 518 | 313 → 348 |
| Bouton rouge « View All Programs » (en escalier) | 54 → 278 | 387 → 439 |
| Photo en escalier : union de A (58 → 510 × 527 → 985) et de B (129 → 577 × 560 → 1056) | 58 → 577 | 525 → 1056 |
| Accordéon, filets | 656 → 1383 | **124 / 525 / 700 / 877 / 1052** |

**Alignements**
- Le haut de l'accordéon (124) s'aligne sur l'eyebrow (128).
- **Le bas de l'accordéon (1052) s'aligne sur le bas de la photo (1056).**
- Les deux colonnes partagent donc leurs bords haut et bas [E, à la résolution de 1.png].

**Hauteurs des items** [E] : l'item ouvert fait **401**, les items fermés **175 à 177**.
- Item fermé : numéro rouge (petit) et « + » sur la même ligne, à ~50 du filet ; titre ~30 plus bas ; ~42 jusqu'au filet suivant.
- Item ouvert : numéro et « — », titre, description sur 2 lignes, rangée de 4 tags pilules avec icône, rangée coach (avatar rond, nom, sous-ligne).

**Rythme** [E] : 24 entre le titre et le paragraphe, 40 entre le paragraphe et le bouton, ~86 entre le bouton et la photo, 120 de padding en bas.

**Texte**
- `Fitness Programs` (préfixe en traits rouges)
- `FIND THE RIGHT FITNESS PROGRAM.`
- `Whether you're looking to build strength, improve endurance, lose weight, or move better, choose a program designed around your goals.` (lecture probable)
- `View All Programs`
- `01 BUILD STRENGTH & GAIN POWER` : la description semble reprendre la même phrase (lecture probable). Tags en mono : `16 Days` (chiffre **illisible**, 14 ou 16), `Muscle Building`, `Power`, `Progressive Training`. Coach : `Marcus Roy`, sous-ligne `… Days Training` (chiffre **illisible**).
- `02 IMPROVE WITH FUNCTIONAL TRAINING`
- `03 STRENGTHEN YOUR CORE & STABILITY`
- `04 TRAIN HARD & REACH NEW LEVELS`

### 2.5 Why VYRON (1440 × 1219), mesurée sur 4.png (haute définition)

| Élément | x @1440 | y @1440 | Tag |
|---|---|---|---|
| Eyebrow : traits rouges (58 → 132) et « WHY VYRON » en mono (143 → 225) | 58 → 225 | 124 → 139 | [M] |
| Titre (2 lignes, capitale 41, pas 54,5) | 62 → 805 | 187 → 281 | [M] |
| Aparté (2 lignes, pas 20,6) | 1128 → 1376 | 251 → 287 | [M] |
| Bande de piliers, filets haut et bas | 60 → 1380 | **329 → 623 (294)** | [M] |
| Bloc gauche (accroche rouge et paragraphe) | 60 → 402 (**342**) | texte calé en bas, 475 → 601 | [M] |
| 4 cellules bordées, sans gouttière | **402 / 646,5 / 890 / 1135 / 1380** (**244,5** chacune) | 329 → 623 | [M] |
| Équipe : 5 pistes | **[61 → 289] [310 → 538] [558 → 883] [903 → 1131] [1151 → 1379]** | 664 → … | [M] |
| Portraits carrés | 228 × 229 | 664 → 893 | [M] |
| Portrait central (Marcus) | 325 × **409** | 664 → 1073 | [M] |
| Légendes : nom à gauche, numéro « 01 » à « 05 » à droite | — | photo + 12 | [M] |
| Bloc de texture réglée (11 cellules de 43, sous Alex et Sarah) | 62 → 538 | 962 → 1069 | [M] |
| CTA « Meet the Team » (en escalier) | 1179 → 1379 (201 × 48) | 1047 → 1092 | [M] |

**Alignements et rythme**
- **La dernière ligne de base de l'aparté coïncide avec celle du titre** (± 1 px) [M].
- 47 entre l'eyebrow et le titre, 48 entre le titre et les piliers, **41 entre les piliers et l'équipe**, **12 entre une photo et sa légende**, ~119 de padding en bas [M] / [E].

**Cellules des piliers** [M]
- libellé en haut, avec 25 px de padding en haut et 21,6 à gauche ;
- texte calé en bas, avec 22 px de padding en bas ;
- **~180 px de vide central**, voulu : il « charge » la ligne.

**Composition de l'équipe** [I] : le portrait central est 180 px plus haut. Le vide qu'il crée à gauche est comblé par la texture, celui de droite par le CTA, ce qui équilibre en diagonale.

**Proportions** [M] : la piste mise en avant vaut ~1,4 fois une piste standard. Dans les piliers, 342 / 244,5 = 1,40. Dans l'équipe, 325 / 228 = 1,42.

**Texte, verbatim et lisible**
- `WHY VYRON`
- `BUILT FOR THOSE WHO DON'T COMPROMISE ON FITNESS`
- `Designed to transform — consistently, precisely, without excuses.`
- `Results are built, not given.`
- `Every workout plan exists for a single reason: to push your limits when your body wants to quit.`
- `EXPERT COACHES` / `Real guidance from experienced professionals.`
- `PREMIUM EQUIPMENT` / `Everything you need to train harder and smarter.`
- `REAL COMMUNITY` / `A motivating environment where everyone belongs.`
- `24/7 ACCESS` / `Train whenever your schedule allows.`
- `Alex Vance 01` · `Sarah Jenkins 02` · `Marcus Roy 03` · `Elena Rostova 04` · `Drake Torres 05`
- `Meet the Team`

### 2.6 Transformation (1440 × 1233), mesures issues de 1.png donc [E ± 4–8]

| Élément | x @1440 | y @1440 |
|---|---|---|
| Eyebrow « TRANSFORMATION » | 58 | 124 |
| Titre (2 lignes) | 58 → 868 | 187 → 289 |
| Aparté (3 lignes, calé en bas sur le titre) | 1072 → 1363 | 234 → 285 |
| Filet vertical | **x 380** | 344 → 867 |
| Astérisque rouge | 70 → 176 (~106 px de côté) | 376 → 490 |
| Passe-partout clair de la vidéo (ombre douce [E]) | **428 → 1187** | 407 → 828 |
| Image vidéo (rapport ≈ 2,1 : 1) | ~449 → 1170 | ~429 → 767 |
| Barre de progression noire | ~494 → 1120 | ~791 → 806 |
| Pagination verticale (3 points, celui du milieu rouge) | 1222 | 597 → 632 |
| Filet horizontal | 60 → 1380 | **867** |
| Nom « Jordan Tucker » | **325** | 950 |
| Citation (3 lignes, ~716 px, environ 60 caractères par ligne) | **325** → 1041 | 1001 → 1119 |
| Index « 01 » rouge, calé sur la dernière ligne | 58 → 101 | 1084 → 1115 |
| Précédent (gris clair) et suivant (rouge) | 1273 → 1309 et 1332 → 1379 | 1067 → 1110 |

**Rythme** [E] : ~40 entre la vidéo et le filet, ~83 entre le filet et le nom, 114 de padding en bas.

**Axes** : il y a **trois axes presque alignés à moins de 100 px l'un de l'autre**, à 325 (citation), 380 (filet) et 428 (vidéo). C'est une faiblesse, voir § 4.2-5.

**Texte**
- `TRANSFORMATION`
- `REAL TRANSFORMATION THROUGH CLIENT EXPERIENCES`
- `Real people putting in the work, building stronger habits, and creating transformations they can truly feel and see.` (lecture probable)
- `Jordan Tucker`
- `"I came here wanting to get fit, but I stayed because, for the first time, I genuinely started enjoying every part of my training."`
- `01`

### 2.7 Marquee (1440 × 55)

- Bande rouge en pleine largeur, texte blanc `Fitness Hub` suivi d'un séparateur (petit glyphe carré ou astérisque, **illisible**), répété avec un pas de **~183** [E].
- Elle est collée au haut du footer et termine visuellement la section blanche.

### 2.8 Footer (1440 × 849), mesures issues de 1.png donc [E]

| Élément | x @1440 | y @1440 |
|---|---|---|
| Titre « REDEFINING FITNESS CULTURE. » (2 lignes) | 62 → 608 | 126 → 212 |
| Navigation en mono, 2 colonnes (3 liens + 2 liens) | 1061 et 1287 | 123 → 216 |
| Bande de 3 panneaux bordés de filets | **[58 → 328] [328 → 854] [854 → 1380]** (270 / 526 / 526, soit ≈ 1 : 2 : 2) | **266 → 615 (350)** |
| Onglet rouge « Back To Home » (en-tête du panneau 2) | 328 → 854 | 267 → 311 (43) |
| Astérisque rouge (panneau 3, en bas à droite) | 1257 → 1356 | 496 → 590 |
| Wordmark « VYRON™ » (capitale ~157) | 62 → 935 (dont ™ ~820 → 935) | 657 → 814 |
| Réseaux sociaux : 3 carrés de ~47 espacés de ~16 | 1186 → 1364 | 659 → 708 |

**Couches**
- photo d'un homme en pompes, rouge à gauche, fond noir à droite ;
- texture réglée en bas à droite ;
- panneaux transparents bordés de filets ;
- wordmark par-dessus la photo.

**Ancrage** : le wordmark finit **à ~30 px du bas du cadre** [E] et ancre la page. Il fait écho au titre géant du hero.

**Texte**
- `REDEFINING FITNESS CULTURE.`
- Navigation en mono : `Home` · `About Us` · `Programs` · `Join Now` · `Contact Us`
- Panneaux : `Strength Training` · `Back To Home` · `Explore Classes`
- Panneau 2 en bas : `Fitness is the art of self-transformation, converting dedication into physical strength that builds your resilience, shapes your lifestyle, and redefines the way you conquer every challenge.` (lecture probable)
- Panneau 3 : `PUSH BEYOND LIMITS.`
- `VYRON™`
- Réseaux sociaux : 3 icônes (glyphes **illisibles**, probablement Facebook, Instagram et X [I])
- **Pas de mention ©, d'adresse ni d'horaires.**

---

## 3. Hypothèse de grille globale

### 3.1 Les invariants (forte confiance)

| Rôle | Valeur @1440 | Statut |
|---|---|---|
| Largeur de référence | 1440 | [E] |
| Marges latérales / contenu | **60 / 1320** | [M] |
| Gouttière entre tuiles | **20** | [M] |
| Cadre de filets du hero | **30** depuis les bords, soit la moitié de la marge | [M] |
| Padding vertical des sections | **120** | [E ± 8] |
| Proportion de la piste mise en avant | **≈ 1,4 × (√2)** : bloc gauche de Why 1,40 ; portrait central 1,42 ; colonnes de Programs 1,40 | [M] / [E] |

### 3.2 Test des grilles candidates (mesurer, pas deviner)

**Méthode**
- J'ai pris 19 bords verticaux internes mesurés en haute définition (± 2 px), venant de Why, Services et du hero, et 19 bords mesurés sur 1.png (± 4 à 8), venant de About, Programs, Transformation et du footer. J'ai exclu les bords du conteneur et les approches de glyphes.
- Pour chaque grille, je compte les bords qui tombent à ± 6 px (haute définition) ou ± 8 px (1.png) d'un début ou d'une fin de colonne.
- Je compare ce compte au **hasard**, c'est-à-dire au nombre attendu si les bords étaient placés au hasard (part de la largeur couverte par les fenêtres de tolérance).

| Grille (marges de 60) | Colonne | Bords haute définition sur la grille | Hasard attendu | Bords de 1.png sur la grille | Hasard attendu |
|---|---|---|---|---|---|
| **16 colonnes, gouttière 20** | 63,75 | **13 / 19** | 5,5 | 5 / 19 | 7,3 |
| 16 colonnes, gouttière 24 | 60 | 13 / 19 | 5,6 | 6 / 19 | 7,4 |
| **12 colonnes, gouttière 20** | 91,67 | 4 / 19 | 4,0 | **10 / 19** | 5,3 |
| 12 colonnes, gouttière 24 | 88 | 5 / 19 | 4,1 | 11 / 19 | 5,5 |
| 24 colonnes, gouttière 20 | 35,8 | 11 / 19 | 8,2 | 13 / 19 | 10,9 |
| Texture à 11 cellules (120, sans gouttière) | 120 | 3 / 19 | 2,0 | 2 / 19 | 2,6 |

**Lecture**
- **Aucune grille unique n'explique toute la page.**
- **16 colonnes avec gouttière 20 explique les sections en haute définition.**
  - L'équipe de Why : les 8 bords tombent à 5,5 px ou moins de la grille, en spans 3-3-4-3-3, avec des gouttières de 20 conformes à la mesure.
  - Les cellules des piliers : bloc gauche sur 4 colonnes, puis 4 cellules égales sur les colonnes 5 à 16 (246 contre 244,5 mesuré).
  - L'aparté de Services (colonne 13), la fin de la liste du hero (≈ colonne 7) et le menu.
  - Par contre, cette grille ne fait pas mieux que le hasard sur les sections mesurées dans 1.png.
- **12 colonnes avec gouttière 20 explique About** (cartes en 4-4-4, exact), la navigation du footer et les apartés. Par contre, il ne fait **rien de mieux que le hasard sur Why**. Pour l'équipe, il faudrait un découpage 2-2-4-2-2, qui donne un rapport de 2,1 au lieu de 1,42.
- **La texture à 11 cellules est décorative** : elle ne prédit aucun bord de mise en page.

**Conclusion [I]** : le designer a composé sur un **cadre** fixe (marges 60, gouttière 20, padding 120), avec des **découpages propres à chaque section** plutôt qu'une grille de colonnes unique. Le seul rapport récurrent est la piste mise en avant à ~√2.

### 3.3 Système proposé pour la reconstruction

**Option A, fidèle** : une grille de page à lignes nommées (pleine largeur / contenu) et des gabarits en `fr` écrits composant par composant.

| Composant | Gabarit |
|---|---|
| Piliers de Why | `1.4fr` puis 4 × `1fr`, sans gouttière |
| Équipe | `1fr 1fr 1.42fr 1fr 1fr`, gouttière 20 |
| Cartes About | 3 × `1fr` |
| Footer | `1fr 2fr 2fr` |

Le rendu est fidèle au pixel près. En revanche, les axes restent différents d'une section à l'autre.

**Option B, régularisée** (ma recommandation, cohérente avec « l'adapter légèrement » et avec la clarté du code) :
- **une grille de page de 16 colonnes, gouttière 20, marges 60** (fluides en dessous de 1440) ;
- des lignes nommées pour sortir en pleine largeur (hero, carrousel, marquee, footer) ;
- **deux exceptions nommées** en `fr` : les tiers de About et le 1 : 2 : 2 du footer.

Pourquoi 16 colonnes :
- c'est la grille qui colle le mieux aux mesures haute définition ;
- elle se replie proprement en **16 → 8 → 4** (tablette, mobile) ;
- elle reproduit la proportion √2 avec des spans de 3 contre 4.

| Section | Placement proposé (colonnes sur 16) | Écart avec la référence |
|---|---|---|
| Hero : liste de slogans | 1–6 | fin à 542 au lieu de 568 (−25) |
| Hero : sous-titre | début colonne 9 (730) | −38. Ou le garder « libre » (décalage optique) |
| Hero : retrait de STRENGTH | début colonne 4 (311) | +39. À valider visuellement, c'est un retrait optique |
| About : phrase et bouton | 9–16 | début à 730 au lieu de 750 (−20) |
| About : cartes | exception `repeat(3, 1fr)` | 0 |
| Services : titre / aparté | 1–9 / 13–16 | 0 / −5 |
| Programs : gauche / droite | 1–6 / 8–16 | −35 / −10. La colonne 7 sert d'air |
| Why : bloc gauche / cellules | 1–4 / 5–16 en 4 parts égales | −7 / ≤ 6 |
| Why : équipe | 3 / 3 / 4 / 3 / 3 | ≤ 5,5 |
| Why : aparté | 14–16, aligné à la fin | +21 |
| Transformation : filet / vidéo / citation / aparté | gouttière 4–5 / 5–14 / 4–12 / 13–16 | +5 / −33 et +26 / −14 / −7 |
| Footer : panneaux | exception `1fr 2fr 2fr` | 0 |
| Footer : navigation | début colonne 13 / colonne 15 | +4 / −55 |

Le coût de la régularisation reste **sous 40 px partout, sauf la 2e colonne de navigation du footer**. Le gain est un **axe commun** pour About, Programs et Transformation (voir § 4.2-5).

### 3.4 Échelle d'espacement dérivée des mesures

**Base de 4.** Toutes les valeurs observées en sont des multiples. Elles s'organisent en **trois séries qui doublent** : 12 → 24 → 48, 20 → 40 → 80 et 60 → 120.

| Pas | @1440 | Occurrences mesurées | Nom de rôle proposé |
|---|---|---|---|
| 1 | 4 | décalage vertical de l'escalier sur les boutons (4 à 10) | `space-hair` |
| 2 | 8 | (implicite, espacement des icônes) | `space-3xs` |
| 3 | **12** | photo → légende (12) ; décalage de l'escalier (12) | `space-tight` |
| 4 | 16 | espace entre les réseaux sociaux (~16) | `space-xs` |
| 5 | **20** | gouttière ; padding des cartes ; filet → texture | `gutter` |
| 6 | **24** | padding haut des cellules (25) ; titre → paragraphe (24) | `stack` |
| 7 | 28–30 | filet ↔ titre dans Services (28 / 30), cadre du hero (30) | `space-sm` (32 conseillé) |
| 8 | **40** | piliers → équipe (41) ; vidéo → filet (40) ; paragraphe → bouton (40) | `stack-loose` |
| 9 | **48** | eyebrow → titre ; en-tête → contenu | `header-gap` |
| 10 | 56–60 | rangée de liste (58,5), marquee (55), hero bas (55), **marges (60)** | `margin-inline` |
| 11 | **80** | SERVICES → filet ; texture → cartes ; filet → témoignage (83) ; bouton → cartes (75) | `block-gap` |
| 12 | **120** | padding des sections | `section-pad` |

Adaptation : `margin-inline` 60 → 20, `section-pad` 120 → 72, `gutter` 20 → 16 en mobile, avec des valeurs fluides entre les bornes [I].

---

## 4. Rythme, cadence et faiblesses

### 4.1 Cadence

```
[PHOTO rouge/noir] → [BLANC] → [GRIS] → [BLANC] → [NOIR] → [BLANC] → [ROUGE] → [PHOTO rouge/noir]
   Hero 14 %         About 10 %  Serv. 17 %  Progr. 15 %  Why 16 %  Transf. 16 %  Marquee  Footer 11 %
```

**Ce qui fonctionne**
- **Les deux extrémités se répondent** : hero et footer partagent la photo en duotone rouge, le display géant et l'astérisque. La page se referme sur elle-même et finit **ancrée** par le wordmark posé à ~30 px du bas [E].
- **Le sombre de Why arrive à 56 % du défilement** [E] : c'est le point culminant du milieu de page.
- **Densité en alternance** : hero rare, About moyen, Services avec un en-tête calme (~600 px d'air autour d'un seul mot) puis une rangée dense, Programs dense, Why le plus dense, Transformation calme (une vidéo, une citation), footer dense. Une section calme avant la clôture est une bonne respiration.
- **Contrastes d'espacement réels** (12 / 20 / 48 / 80 / 120) : la page ne répète pas une seule valeur. La règle de `layout.md` « tight and generous intervals » est respectée.
- **Squint test réussi partout** :
  - Hero : BUILD STRENGTH, puis le visage.
  - About : le bloc rouge passe avant la phrase. C'est discutable, car la preuve domine la promesse.
  - Services : le mot rouge, puis la carte noire.
  - Programs : le titre et la photo, puis les titres de l'accordéon.
  - Why : le titre, puis le portrait central.
  - Transformation : l'astérisque et la vidéo.
  - Footer : le wordmark.

**Ce qui fonctionne moins** : About, Services et Programs forment une **longue plage claire de 3225 px, soit 42 % de la page**. Elle n'est cassée que par la teinte #F5F5F5, le mot rouge géant et la carte noire.

**Thèse spatiale proposée** (`layout.md`, « Set the spatial thesis »)
- **Parcours principal** : accroche → preuve → offre → choix → preuve humaine → action.
- **Ce qui mène** : le display géant, un par section (BUILD STRENGTH, SERVICES., le portrait central, le wordmark).
- **Ce qui accompagne** : les apartés et les eyebrows, alignés sur le bord droit et la dernière ligne de base.
- **Densité** : un pic dense par section, entouré d'air.

### 4.2 Faiblesses de mise en page

| # | Priorité | Constat | Règle Impeccable | Preuve | Recommandation |
|---|---|---|---|---|---|
| 1 | **P1** | **Aucune action principale dans le hero.** Il n'y a que MENU et le téléphone. Le premier bouton (« Learn More About Us », informatif) arrive à y ≈ 1367, soit 1,5 écran. « Join Now » n'existe que dans la navigation du footer | Persuade : « expose a clear action… in its working form » | [M] / [E] | Transformer **sur place** les 3 flèches rouges et le sous-titre en CTA principal (par exemple « Réserver une séance d'essai → »), sans déplacer la composition. Règle Persuade : faire fonctionner les éléments là où le monde visuel les a placés |
| 2 | **P1** | Le hero fait 1102 px de haut : **STRENGTH passe sous le pli** à 1440 × 900 | Adaptation, lecture | [E] | Hero en hauteur de viewport avec un minimum, titre calé sur le filet bas. La bande de filets reste ancrée en bas |
| 3 | **P1** | Pas d'offre (essai, abonnement, tarifs) ni d'infos pratiques (adresse, horaires) | Persuade : « the action the category's visitors came to take » | [I] | Ajouter un bloc « Join » avant le footer, ou réaffecter les 3 panneaux du footer (voir #14) |
| 4 | P2 | **4 modèles d'en-tête de section** : About en 2 colonnes, Services avec le mot géant entre filets, Why et Transformation empilés avec un aparté, Programs empilé dans une colonne. L'aparté est **centré** dans Services mais **calé sur la dernière ligne de base** dans Why et Transformation. Largeurs 305 / 248 / 292, débuts à 1070 / 1128 / 1072 | Cohérence du rythme, regroupement | [M] | Un composant d'en-tête de section avec des variantes déclarées. Aparté toujours sur les colonnes 13–16, calé sur la dernière ligne de base |
| 5 | P2 | **Axes presque alignés dans les sections claires** : la colonne de contenu commence à 750 (About), 656 (Programs), puis 380, 428 et 325 (Transformation). Cela fait 5 axes sur 425 px, sans colonne vertébrale commune | Structure, alignement | [E] | Caler ces axes sur la grille (colonnes 9, 8 et 4/5) ou choisir un axe unique, par exemple la colonne 8 |
| 6 | P2 | **Le carrousel des Services** : la carte A est coupée et son titre est invisible. Le seul contrôle est la flèche rouge. On ne sait pas si le noir signifie survol ou actif | États, affordance, focus | [M] / [I] | Choisir un comportement (voir questions). Contrôles précédent / suivant, clavier, focus visible, accrochage au centre |
| 7 | P2 | **Accordéon** : les items fermés font 176 px (4 items = 931). L'alignement du bas avec la photo (1052 / 1056) **casse dès qu'un autre item s'ouvre**, car les hauteurs varient | Cas extrêmes, contenu dynamique | [E] | Laisser la colonne gauche suivre au défilement (photo collante) au lieu d'un alignement du bas impossible à tenir |
| 8 | P3 | **Eyebrow et titre à 48, titre et contenu à 48** : l'eyebrow n'est pas plus proche de son titre que le titre de son contenu | Proximité : un groupe serré, une séparation généreuse | [M] | Si l'eyebrow reste, passer à 16–24 entre eyebrow et titre |
| 9 | P3 | Dans Services, le titre flotte entre deux filets (28 au-dessus, 30 en dessous) | « more space above a heading than below » | [M] | C'est acceptable ici, car la bande de filets est un cadre. Garder la symétrie mais la documenter comme exception |
| 10 | P3 | La composition asymétrique de l'équipe (portrait central de 409, vides compensés) n'a **aucun repli défini** entre 1440 et le mobile | Adaptation | [I] | Prévoir un repli (voir § 4.4) |
| 11 | P3 | Les panneaux du footer ont une architecture d'information confuse : « Back To Home » est l'onglet actif mis en avant, et les libellés (« Strength Training », « Explore Classes ») ressemblent à des liens alors que les panneaux contiennent un autre contenu | Clarté de l'architecture d'information | [I] | Réaffecter les panneaux : 1 = Contact et adresse, 2 = Join (CTA rouge), 3 = Horaires |

### 4.3 Tensions avec le craft-floor (décisions à prendre)

| Élément de la référence | Position du craft-floor | Lecture « the brief wins » | Option proposée |
|---|---|---|---|
| Eyebrows « [traits] About Us / WHY VYRON / … » | **Interdit** (« no brief earns it back ») | Le motif code-barres fait partie de l'univers | (a) supprimer et laisser le titre porter la section ; (b) le garder comme signature, **un seul composant**, traits décoratifs masqués aux lecteurs d'écran |
| Numéros 01 → 05 (équipe), 01 → 04 (accordéon), 01 / 02 (cartes), 01 (témoignage) | À refuser « unless the sequence carries information » | Utiles pour le carrousel et le témoignage (position), décoratifs pour l'équipe | Les garder là où ils indiquent une position, les retirer ou les assumer ailleurs |
| Stats « 4.9/5 », « 20 Years » | Modèle « hero-metric » par défaut | Ici ce sont des preuves sociales | Garder, avec des chiffres sourcés ou plausibles |
| Silhouettes en escalier | Proches des « hard offset shadows » | Ce n'est pas une ombre : c'est une **forme** de même couleur, signature du monde (effet de mauvais repérage d'impression) | Garder, implémenter comme **forme** et non comme ombre, avec une règle de décalage unique (12 px sur les contrôles, 14 % sur les images) |
| Cartes égales (piliers, cartes About) | « Same-size cards » par défaut | Les piliers sont des cellules de tableau sans icône, les cartes About sont hétérogènes | Acceptable tel quel |

### 4.4 Adaptation (la référence ne montre que le desktop)

| Section | ≤ 1024 (8 colonnes) | ≤ 640 (4 colonnes) |
|---|---|---|
| Hero | retrait de STRENGTH réduit, liste conservée | titre empilé à gauche, sans retrait. Liste de slogans en 2 lignes ou masquée. CTA sous le sous-titre |
| About | phrase sur toute la largeur, cartes 2 + 1 | cartes en colonne, ou rangée défilante avec accrochage |
| Services | carrousel avec une carte à ~70 vw | une carte à ~85 vw, contrôles sous la rangée |
| Programs | 2 colonnes conservées (5 + 3) | titre, accordéon, puis photo ou photo masquée |
| Why | lead sur toute la largeur et piliers en 2 × 2. Équipe : portrait central en pleine largeur, puis 2 × 2 | piliers en colonne. Équipe en rangée défilante |
| Transformation | filet et astérisque masqués, vidéo sur toute la largeur | citation sous la vidéo, contrôles sous la citation |
| Footer | panneaux en 1 + 2 | panneaux empilés, wordmark ajusté à la largeur |

---

## 5. Plan HTML sémantique (arborescence uniquement)

```
body
├─ a.skip-link → #contenu
├─ header (banner) ........................ posé sur le hero ; collant au défilement ? [I]
│  ├─ a (logo « VYRON™ », lien accueil, nom accessible)
│  ├─ button « Menu » [aria-expanded, aria-controls → #menu]
│  ├─ a[href=tel:…] (icône + nom accessible « Appeler VYRON »)
│  └─ nav#menu (aria-label « Navigation principale ») ... panneau du menu, absent de la référence [I]
├─ main#contenu
│  ├─ section#hero (aria-labelledby → h1)
│  │  ├─ h1 « Build Strength » ............. 2 lignes visuelles (BUILD / STRENGTH)
│  │  ├─ p « Redefine Your Physical Potential »
│  │  ├─ a (CTA principal, proposé, porte les 3 flèches)
│  │  ├─ ul (4 slogans)
│  │  └─ décor (astérisque, filets, mires, verre cannelé) .. aria-hidden
│  ├─ section#about
│  │  ├─ p.eyebrow « About Us » (option)
│  │  ├─ h2 « We forge stronger, healthier bodies… »
│  │  ├─ a « Learn More About Us »
│  │  └─ ul (3 cartes)
│  │     ├─ li : p (4.9/5) + p (libellé) + ul (avatars)
│  │     ├─ li : p (20 Years of Excellence) + ul (3 atouts)
│  │     └─ li : figure > img (coach, alt descriptif)
│  ├─ section#services
│  │  ├─ h2 « Services. » .................. mot géant
│  │  ├─ p (« High-intensity training… ») + p (aparté)
│  │  └─ div (aria-roledescription « carrousel », aria-label « Services »)
│  │     ├─ boutons Précédent / Suivant
│  │     └─ ul > li (aria-roledescription « diapositive », aria-label « 2 sur N »)
│  │        └─ article : h3 (« Strength Training ») · p · img · numéro décoratif (aria-hidden)
│  ├─ section#programs
│  │  ├─ p.eyebrow (option) · h2 « Find the right fitness program. » · p · a « View All Programs »
│  │  ├─ figure > img
│  │  └─ div (accordéon), 4 ×
│  │     ├─ h3 > button[aria-expanded, aria-controls] (« Build Strength & Gain Power »)
│  │     └─ div[role=region] : p · ul (tags) · p (coach + durée)
│  ├─ section#why ........................... thème sombre
│  │  ├─ p.eyebrow (option) · h2 « Built for those who don't compromise on fitness » · p (aparté)
│  │  ├─ p (accroche « Results are built, not given. ») + p
│  │  ├─ ul (4 piliers) > li : h3 (« Expert Coaches ») + p
│  │  ├─ h3 (« L'équipe », masqué visuellement)
│  │  ├─ ul (5 coachs) > li > figure : img + figcaption (nom) .. numéro décoratif
│  │  └─ a « Meet the Team »
│  ├─ section#transformation
│  │  ├─ p.eyebrow (option) · h2 « Real transformation through client experiences » · p (aparté)
│  │  └─ div (carrousel de témoignages)
│  │     ├─ figure : video (ou img + bouton lecture, sous-titres) + barre de progression
│  │     ├─ figure : blockquote > p (citation) + figcaption > cite « Jordan Tucker »
│  │     └─ contrôles Précédent / Suivant + pagination (aria-current)
└─ footer (contentinfo)
   ├─ div.marquee (aria-hidden, texte répété) ....... la phrase existe une fois ailleurs, en clair
   ├─ h2 « Redefining fitness culture. »
   ├─ nav (aria-label « Pied de page ») > ul (Home, About Us, Programs, Join Now, Contact Us)
   ├─ ul (3 panneaux) ......................... contenu à redéfinir (#11)
   ├─ ul (réseaux sociaux : liens avec nom accessible)
   ├─ p (wordmark « VYRON™ », aria-hidden : le logo existe déjà dans le header)
   └─ p (© + mentions, à ajouter)
```

**Niveaux de titre** : un seul `h1` (hero) ; un `h2` par section (5 dans main et 1 dans le footer) ; des `h3` pour les cartes de service, les items de l'accordéon, les piliers et l'équipe.

**Ordre du DOM** : il suit l'ordre visuel partout, de gauche à droite et de haut en bas. Dans About, l'eyebrow à gauche précède la phrase à droite. Dans l'équipe, l'ordre 01 → 05 se lit de gauche à droite.

---

## 6. Questions de cadrage (Impeccable `shape`, un tour)

1. **Langue et marque** : faut-il garder « VYRON » et le texte anglais, ou adapter en français avec votre propre nom ? Le français fait des mots 15 à 20 % plus longs. Cela touche directement les mots géants ajustés à la largeur (« SERVICES. »), le titre en escalier du hero et les items de l'accordéon.
2. **Persuasion** : acceptez-vous d'ajouter **un CTA principal dans le hero**, posé sur les flèches existantes, et **un bloc « Join / essai »** avant le footer ? Ou voulez-vous une fidélité stricte ?
3. **Grille** : **option B** (16 colonnes, gouttière 20, axes unifiés, écarts sous 40 px) ou **option A** (fidélité au pixel, gabarits `fr` par section) ?

**Décisions qui en découlent** (à trancher ensuite ou en même temps)
- Le comportement de la rangée Services : carrousel centré, défilement horizontal libre avec accrochage, ou grille statique.
- Le sort des 4 tensions du craft-floor (eyebrows, numéros, stats, escaliers).
- La réaffectation des panneaux du footer (Contact, Join, Horaires).
- Le mobile, absent de la référence : je propose les replis du § 4.4.