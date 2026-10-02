> **Annexe brute** : rapport de l’agent `a8-imagery`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

# VYRON : direction artistique des images et plan de production Higgsfield (lentille a8-imagery)

> Périmètre : chaque photo et vidéo de la page, la cohérence du casting et de l'étalonnage, le choix des modèles Higgsfield, les gabarits de prompts, la livraison web et la provenance. Rien n'a été généré : je n'ai appelé que des outils Higgsfield en lecture seule (`balance`, `get_preferences`, `models_explore`, `transactions`, liste des reference elements). Référentiel : Impeccable v4.5, `visualize.md` (« Plates and provenance »), `new-work.md` §6 et `craft-floor.md`.

---

## 0. Synthèse

1. **J'ai trouvé 22 emplacements raster** : 19 photos, 3 vidéos ou boucles, et 2 textures nommées dans les cartes de stats. Le socle minimal tient en **19 plates finales**. Il passe à 25 si les images de programmes changent à l'ouverture de chaque item de l'accordéon (option).
2. **Le hero n'est pas un duotone rouge.** La mesure le montre : le décor est monochrome cramoisi (#721213 à #9A1214, saturation 0,88), mais la peau garde sa couleur naturelle chaude (saturation 0,41 à 0,56). Le flou de mouvement horizontal touche la queue de cheval et le décor, jamais le visage. Rapport d'anisotropie |dI/dy|/|dI/dx| : 1,91 sur les cheveux contre 1,07 sur le visage.
3. **La référence n'est pas cohérente.** Le « Marcus Roy » de la grille équipe n'a pas le même visage que le « Marcus Roy » en avatar dans l'accordéon des programmes. Les portraits d'équipe mélangent aussi des dominantes froides (#343C4B) et chaudes (#3F3530). Notre version doit corriger ces deux points avec un casting récurrent fixe et une famille d'étalonnage par contexte.
4. **L'étalonnage des cartes services porte l'état.** Une carte inactive est en noir et blanc pur (saturation 0,06). La carte active (fond noir) est en rouge orangé (saturation 0,87). J'en tire une micro-interaction : passer du N&B au duotone cramoisi au survol ou à l'activation. On peut la faire avec **une seule plate N&B et un duotone en CSS ou SVG**. C'est une décision à prendre.
5. **Modèles recommandés** :
   - Nano Banana Pro ou Cinema Studio Image 2.5 pour les stills, avec des **reference elements** pour fixer les visages.
   - Kling 3.0 (image de début = image de fin, son coupé) pour une boucle hero.
   - Seedance 2.0 en 21:9 pour les extraits de témoignages.
   - Soldes lus : **694,5 crédits, plan Plus**. Seul coût réellement observé : GPT Image 2.5 Flare à 2,75 ou 4,25 crédits par image.
   - Estimation : environ 250 à 400 crédits pour toutes les images fixes. Le coût des vidéos n'est pas lisible en lecture seule.
6. **Éthique et méthode.**
   - Aucune image du shot Dribbble ne sert de référence ou d'img2img. C'est une dérogation consciente à la recette « crop du comp comme référence » d'Impeccable, parce que ce comp appartient à un tiers.
   - Aucune marque : swoosh Nike sur le débardeur des programmes, lettrage sur le gant du hero et sur la ceinture du boxeur du témoignage.
   - Les témoignages et les avis sont fictifs : il faut l'indiquer, et il ne faut **aucun** « talking head » synthétique.
   - Il faut créditer le designer d'origine dans l'étude de cas.

---

## 1. Méthode de mesure et conventions

| Source | Cadre du site mesuré | Facteur vers une maquette 1440 px | Statut |
|---|---|---|---|
| `2.png`, `3.png`, `4.png` (1600×1200) | x = 100 → 1499, soit **1400 px** de large (le fond gris #E3E3E3 est le passe-partout Dribbble) | **× 1,0286** | MEASURED |
| `1.png` (407×2000) | x = 20 → 386, soit **≈ 366 px** de large | **× 3,93** (±1 px dans le shot = ±4 px à 1440) | MEASURED |

- Hauteurs de section dans `1.png` converties en 1440 :
  - hero 22→302, soit ≈ 1 105 px (contre 1 101 px depuis `2.png` : cohérent) ;
  - why 1123→1433, soit ≈ 1 220 px ;
  - bandeau marquee 1747→1759, soit ≈ 51 px ;
  - footer 1760→1976, soit ≈ 850 px.
- Marges de contenu : 158 → 1441 dans `3.png` et `4.png`, soit **60 px de chaque côté à 1440** et un contenu de 1 320 px (MEASURED).
- Couleurs de référence échantillonnées (MEASURED, valeur la plus fréquente) :
  - rouge de marque **#F02B42** (titre SERVICES., tuile flèche, bouton « Meet the Team ») ;
  - fond clair **#F5F5F5** ;
  - fond de la section sombre **#040F0E**, un noir légèrement teinté vert-teal, qui compte pour l'étalonnage des portraits.
- Les tailles **mobiles** sont toutes ESTIMATED. Il n'existe aucune maquette mobile. J'ai pris un viewport de 390 px avec 16 px de gouttière, soit 358 px de contenu.
- Statuts utilisés dans ce rapport :
  - **MEASURED** : lu sur les pixels avec PIL ;
  - **ESTIMATED** : extrapolé ou converti ;
  - **INFERRED** : déduit de la lecture visuelle et du contexte, non mesurable.

---

## 2. Inventaire des emplacements image

### 2.1 Table récapitulative

| ID | Emplacement | Mesuré dans le shot | Taille CSS à 1440 | Ratio | Mobile (ESTIMATED) | Média recommandé | Statut des cotes |
|---|---|---|---|---|---|---|---|
| H1 | Hero : boxeuse, plein cadre | 1400×1070 (`2.png`) | **1440×1101** | 1,31 (≈ 4:3) | 390×≈800, recadrage 9:16 | Still (LCP), plus une boucle optionnelle | MEASURED |
| A1 | À propos : coach en haut rouge (3e carte stat) | 108×62 (`1.png`) | **≈ 425×244** | 1,74 (≈ 16:9) | 358×204 (ou 4:5) | Still, coins crantés | MEASURED ±4 px |
| A2 | À propos : rangée de 5 avatars dans la carte rouge « 4.9/5 » | 10×10 chacun, pas de 12 | **≈ 39×39**, écart ≈ 8 | 1:1 carré | 36–40 | Still (recadrage de headshot) | MEASURED ±4 px |
| S1 | Service 01 « One-on-one coaching » | non visible dans le shot | (≈ 220×124 par symétrie) | 16:9 | ≈ 268×151 | Still | INFERRED |
| S2 | Service 02 « Strength Training » (carte active noire) | 214×121 (`3.png`) | **220×124** | 1,77 | ≈ 268×151 | Still N&B, plus un état rouge | MEASURED |
| S3 | Service 03 « Functional Training » | 214×120 (`3.png`) | **220×124** | 1,78 | ≈ 268×151 | Still N&B | MEASURED |
| P1 | Programmes : homme en débardeur entre des cordes ondulatoires | 132×135 (`1.png`) | **≈ 519×531** | 0,98 (≈ 1:1) | 358×366 | Still, coins crantés (option : 4 images, une par programme) | MEASURED ±4 px |
| P2 | Programmes : avatar du coach « Marcus Roy · 16 Days Training » | 12×12, rond | **≈ 47** Ø | 1:1 cercle | 40 | Recadrage de T3 ou de son ancre | MEASURED ±4 px |
| T1, T2, T4, T5′ | Équipe : Alex Vance, Sarah Jenkins, Elena Rostova, Drake Torres | 223×224 (`4.png`) | **229×230** | 1:1 | 171 (grille 2 colonnes) ou 260 (carrousel) | Still | MEASURED |
| T3 | Équipe : « Marcus Roy », grand format (curl d'haltère) | 317×398 (`4.png`) | **326×409** | 0,80 (4:5) | 358×448 | Still (option : détourage, l'haltère sort du cadre) | MEASURED |
| V1 | Témoignage « Jordan Tucker » (carte vidéo) | 184×86 (`1.png`) | **≈ 724×338** | ≈ 2,14:1 (±0,05) | 358×201, passage en 16:9 | Poster et boucle muette | MEASURED |
| V2, V3 | Témoignages 02 et 03 (cartes empilées derrière V1) | barre visible 158×3 | ≈ 621 de large | idem V1 | idem | Poster et boucle | INFERRED |
| F1 | Footer : homme en pompes, éclairage rouge, fondu au noir à droite | 366×216 (`1.png`) | **1440×≈850** | 1,69 (≈ 16:9) | 390×≈420, bandeau haut | Still (boucle optionnelle) | MEASURED |
| X1 | Texture grain de la carte rouge « 4.9/5 » | écart-type R = 6,9 sur fond #E22B40 | tuile | — | — | Texture raster tuilable | MEASURED (présence) / INFERRED (nature) |
| X2 | Texture béton ou demi-teinte de la carte grise « 20 Years » | écart-type = 9,9 sur #F2F2F2 (fond blanc voisin : 1,9) | tuile | — | — | Texture raster tuilable | MEASURED / INFERRED |

### 2.2 Fiches détaillées

#### H1 : Hero « BUILD STRENGTH »
- **Sujet et pose** (INFERRED, lecture de `2.png`) :
  - femme, la fin de la vingtaine, en fin de coup de poing, l'épaule tournée vers l'objectif, le regard hors champ à droite ;
  - débardeur blanc à dos nageur, gants de boxe sombres ;
  - queue de cheval qui fouette vers l'arrière, sueur visible sur le bras et le cou.
- **Point focal** (MEASURED, ±2 %) :
  - centre du visage ≈ **74 % x / 35 % y** du cadre hero, ligne des yeux ≈ 34 % y ;
  - queue de cheval de 20 à 54 % x et de 8 à 47 % y ;
  - gant en bas à droite, de 57 à 86 % x et de 70 à 100 % y.
- **Zones réservées à l'UI**, qui doivent rester calmes dans la plate (MEASURED sur `2.png`) :
  - logo de 4 à 18 % x et de 2 à 7 % y ; menu et tuile téléphone de 84 à 96 % x ;
  - liste « PUMP. REPEAT… » de 4 à 39 % x et de 28 à 50 % y ;
  - titre « BUILD / STRENGTH » de 4 à 78 % x et de 69 à 94 % y ;
  - accroche « Redefine Your Physical Potential » de 53 à 74 % x et de 73 à 81 % y.
- **Étalonnage** (MEASURED) :
  - décor cramoisi, moyenne #721213 en haut à gauche et #9A1214 à droite, saturation 0,88 ;
  - peau : visage #8F5644, bras #CF947D ;
  - **tiers inférieur écrasé au noir**, #0A0909 en bas à gauche, luminance p95 = 0,04.
  - Ce dégradé noir peut être soit dans la photo, soit un calque CSS. Je recommande les deux : une photo déjà sombre en bas et un léger dégradé de sécurité en CSS.
- **Flou de mouvement** (MEASURED) : horizontal sur la queue de cheval et la moitié gauche du décor. À droite, des bandes verticales douces.
- **Bande verticale plus claire à x ≈ 1190–1265** (bord net, R 179 contre 145 autour). C'est probablement un panneau translucide de la maquette, pas de la photo (INFERRED). Il faut le dessiner en code et ne pas le cuire dans la plate.
- Les filets de 1 px (x ≈ 130 et 1470, y ≈ 820 et 1118) et les croix « + » à y ≈ 738 sont du **chrome dessiné en code**, à exclure de la plate.
- ⚠️ **Tension avec craft-floor (contraste)**, contraste calculé en luminance relative (MEASURED) :
  - sous l'accroche fine, la médiane est à 5,1:1, mais 10 % du fond tombe à **≤ 1,5:1** (avant-bras et gant clairs) ;
  - sous « BUILD/STRENGTH », 90 % du fond est à ≥ 6,3:1, mais quelques pourcents descendent à 1,8:1.
  - **Décision pour l'utilisateur** : soit le prompt garde l'avant-bras hors de la zone de l'accroche (ma recommandation), soit on ajoute un voile local.
- **Média** : still obligatoire (élément LCP). Boucle vidéo de 4 à 6 s optionnelle, chargée après le LCP (voir §6.6). Variante « hero en couches » optionnelle : plate du décor flou plus le sujet détouré via `remove_background`, pour une parallaxe au scroll. Craft-floor l'exige : on dérive un vrai alpha, jamais un masque géométrique.
- **Mobile** : recadrage art-dirigé 9:16 dans le master. Il suppose de composer le sujet (visage, épaule, gant) dans la **colonne centre-droite de 40 %** du master 3:2. Calcul : à la largeur 4k, un recadrage 9:16 fait ≈ 1 536 px de large, ce qui suffit pour 390 px en 2x.

#### A1 : Coach de la section À propos
- Homme d'environ 35 ans, barbe courte, demi-zip rouge (le rouge sert d'uniforme de marque), regard hors champ à gauche, sourire léger. Décor : rack de squat et barre, gris anthracite (INFERRED).
- Point focal ≈ **55 % x / 35 % y** (ESTIMATED sur `1.png`).
- Étalonnage : neutre sombre, moyenne #483333, saturation 0,28. Le haut rouge est la seule couleur forte (MEASURED).
- **Coins crantés**, géométriques : cran en haut à droite ≈ 51×12, cran en bas à gauche ≈ 63×24 à 1440 (MEASURED ±4 px, faible confiance). Ces zones ne doivent rien contenir d'important.

#### A2 : Rangée de 5 avatars (preuve sociale « 480+ verified reviews »)
- Cinq carrés d'environ 39 px, visages variés, dominante chaude (moyenne #7A4C4B, MEASURED).
- À 40 px, l'identité est illisible. Je recommande d'utiliser **les 3 clients des témoignages plus 2 nouveaux visages**. Le casting reste ainsi bouclé et on économise 3 générations.

#### S1–S3 : Images des cartes services
- **S2** (MEASURED) : torse masculin très musclé, débardeur rouge, haltère au premier plan en bas à gauche. Le visage est coupé au-dessus du menton : corps anonyme. Éclairage gélatine rouge-orange, moyenne #AE2D18, saturation 0,87.
- **S3** (MEASURED) : boxeur de profil, tête baissée, épaule nue, débardeur clair. **N&B pur** : moyenne #444645, saturation 0,06, contraste fort (p5 0,05 / p95 0,80).
- **Lecture d'état** (INFERRED) : la carte active est noire avec une image rouge, les cartes inactives sont blanches avec une image N&B. L'étalonnage encode donc l'état.
- **S1** n'est pas visible : la carte 01 n'affiche que du texte et une tuile flèche. Pour l'homogénéité du carrousel, je recommande de produire une image « coaching individuel » (INFERRED).
- Les cartes touchent les deux bords du cadre (x = 100 et 1500) : c'est très probablement un **carrousel horizontal**. S'il compte plus de 3 cartes, il faut ajouter une plate par carte (INFERRED).
- **Coins crantés** (MEASURED dans `3.png`) : en haut à droite **26×10 px**, en bas à gauche **27×26 px** (≈ 27×10 et 28×27 à 1440).

#### P1 : Image des programmes
- Homme d'environ 28 ans, débardeur marine **avec swoosh Nike, à supprimer**. Mains sur des cordes ondulatoires. Le premier plan est fait de cordes verticales très floues (occlusion par profondeur de champ).
- Point focal : visage ≈ 50 % x / 22 % y.
- Étalonnage froid et bas en clés : moyenne #2E313C, peau chaude (MEASURED).
- Crans (MEASURED ±4 px à 1440) : en haut à droite ≈ 67×31, en bas à gauche ≈ 71×71, soit environ 13 % de la largeur.
- Recommandation narrative : l'image montre **le coach du programme ouvert**, Marcus Roy, ce qui recolle avec l'avatar P2. Option : 4 images, une par item de l'accordéon, avec une transition de masque au changement. Cela fait 3 plates de plus.

#### P2 : Avatar du coach dans l'accordéon
- Rond d'environ 47 px. Dans la référence, c'est un homme noir au crâne rasé, alors que le « Marcus Roy » de l'équipe est un autre homme. **C'est une incohérence à corriger** : P2 doit être un recadrage du même personnage que T3 (même element Higgsfield).

#### T1–T5 : Grille équipe (section sombre « Why VYRON »)
- **Carrés T1, T2, T4, T5′** :
  - portrait épaules et tête, de face, sourire franc, regard caméra ;
  - fond de salle (racks, câbles) flou, yeux ≈ 35–40 % y.
- **T3 grand format** :
  - curl incliné vers l'objectif, haltère chromé au premier plan à gauche ;
  - sueur, regard intense, clé chaude tungstène sur fond sombre.
- **Étalonnage mesuré, incohérent** : T1 #343C4B (bleu froid), T2 #2D2E2D, T4 #1B1B1B, T5′ #373541 (froid), T3 #3F3530 (chaud). Saturations de 0,29 à 0,51.
- Le bas des portraits a un léger fondu vers le fond #040F0E (y 952–955, MEASURED).
- Recommandation : une seule famille « Teal night » (§3.2) pour les 5 portraits. T3 garde une clé chaude sur la peau, mais avec les mêmes ombres et le même fond.

#### V1–V3 : Témoignages « Real transformation »
- **V1** (INFERRED, `1.png` est trop basse résolution pour la ceinture et le visage) :
  - boxeur torse nu, gants, short clair avec une ceinture dorée lettrée (**lettrage à exclure**) ;
  - flou de mouvement fort, sac de frappe rouge au bord droit, lumière du jour en haut à gauche.
- **Étalonnage « film chaud »** (MEASURED) : moyenne #6E5B3C, saturation 0,55, **noirs relevés** (luminance p5 = 0,12) et canal bleu poussé au jaune (min B = 0).
- **Cadre** : passe-partout clair d'environ 4 px dans `1.png` (≈ 16 px à 1440). C'est du code, pas de la plate.
- Sous la carte apparaît une barre noire de 158×3 px, puis un liseré clair. Je les lis comme **des cartes empilées** (le témoignage suivant dépasse), cohérent avec les 3 points de pagination verticaux et les flèches précédent/suivant (INFERRED). Il faut donc 3 stills, et 3 boucles si l'option vidéo est retenue.
- Sur mobile, un 2,14:1 à 358 px ne fait plus que 167 px de haut, trop mince. Je recommande un recadrage art-dirigé en 16:9 (358×201).

#### F1 : Footer « REDEFINING FITNESS CULTURE. / VYRON™ »
- **Sujet** (INFERRED) :
  - homme musclé en position de pompe, bras tendus, tête baissée ;
  - caméra basse, trois-quarts face ;
  - deux tubes fluorescents rouges en haut à gauche, sol caoutchouc teinté de rouge.
- **Répartition** (MEASURED) : le sujet occupe **les 0–60 % gauches**, la luminance tombe au noir à partir de 60 % x (moyenne #070404 sur la partie droite). Le grand mot-symbole « VYRON™ » chevauche le sol en bas à gauche.
- Étalonnage : monochrome cramoisi (#89060E dans les tons moyens), noirs à #000.
- Toute la navigation du footer (liens, tuile « Back To Home », astérisque, icônes sociales) est du code.

#### X1–X2 : Textures des cartes de stats
- Carte rouge : grain marbré discret (écart-type R = 6,9). Carte grise : marbrure béton ou demi-teinte (écart-type 9,9, contre 1,9 sur le blanc voisin) (MEASURED).
- Selon Impeccable, une texture nommée est une région `texture` et part en **raster** (pas un bruit SVG improvisé). On l'adapte en tuile de 512 px en miroir.

### 2.3 Ce qui n'est pas une image (dessiné en code)
- Logo et mot-symbole VYRON™, astérisques rouges et blancs, flèches, icônes (menu, téléphone, réseaux sociaux).
- Filets et croix de la grille, blocs de lignes en « tramé » (services, why), bandeau marquee « Fitness Hub ».
- Boutons à rectangle décalé, tuiles rouges, passe-partout du témoignage.
- **Les crans des images** : un `clip-path` polygonal à 8 sommets. C'est géométrique et c'est un motif de marque, pas un faux contour organique, donc c'est conforme à craft-floor. Les crans se règlent en px fixes, en tokens.
- Les colonnes vides de « Why VYRON » (Expert coaches, Premium equipment…) n'ont **aucune image** dans la référence. Option d'adaptation : une image révélée au survol, soit 4 plates de plus. C'est une décision pour l'utilisateur.

### 2.4 Pièges relevés dans la référence (à ne pas reproduire)
| Problème | Où | Correction |
|---|---|---|
| Marque visible (swoosh) | P1, débardeur | Prompt : vêtement uni sans logo, contrôle qualité au zoom 200 % |
| Lettrage sur le gant (« …UG… ») | H1, gant en bas à droite | « unbranded gloves, no lettering » |
| Ceinture lettrée dorée | V1 | « plain waistband, no text » |
| Même nom, deux visages (« Marcus Roy ») | T3 et P2 | Element de personnage unique |
| Étalonnages hétérogènes dans une même grille | T1–T5 | Famille unique « Teal night » |
| Texte blanc fin sur peau claire | Accroche du hero | Composition du prompt ou voile local |

---

## 3. Stratégie de cohérence

### 3.1 Casting récurrent (proposition à valider)
Les noms reprennent la référence. Les identités sont **nouvelles et fictives** : on ne reproduit pas les modèles du shot.

| Réf. | Nom | Rôle | Identité proposée | Apparitions |
|---|---|---|---|---|
| A | (anonyme) | Athlète du hero | Femme, ≈ 28 ans, est-asiatique, boxeuse | H1 desktop et mobile, boucle hero |
| C1 | Alex Vance | Head coach | Homme, ≈ 38 ans, méditerranéen, barbe courte | T1, **A1** (demi-zip rouge), avatar programme 02 |
| C2 | Sarah Jenkins | Coach HIIT | Femme, ≈ 32 ans, métisse (Asie du Sud-Est et Amérique latine) | T2, avatar programme 03 |
| C3 | Marcus Roy | Coach force | Homme, ≈ 30 ans, est-asiatique, très musclé | **T3, P1, P2** |
| C4 | Elena Rostova | Coach mobilité | Femme, ≈ 35 ans, identité à aligner sur le nom ou nom à changer (voir les questions) | T4, avatar programme 04 |
| C5 | Drake Torres | Coach conditioning | Homme, ≈ 45 ans, noir, tempes grisonnantes | T5′, F1 (optionnel) |
| K1 | Jordan Tucker | Client | Homme, ≈ 30 ans, noir, boxeur | V1, A2 |
| K2, K3 | Clients 02 et 03 | Clients | Une femme d'environ 40 ans, un homme d'environ 50 ans (diversité d'âges et de morphologies) | V2, V3, A2 |
| K4, K5 | Avis | Clients | Deux visages en plus | A2 seulement |
| — | Corps anonymes | — | Torse (S2), profil (S3), coaching (S1), pompes (F1 si ce n'est pas C5) | S1–S3, F1 |

- Répartition : 3 femmes et 3 hommes chez les coachs nommés et l'athlète, au moins 5 origines, de 28 à 50 ans et plus.
- Il faut varier les morphologies, pas seulement des corps « secs ».
- Les descriptions restent factuelles : âge, cheveux, morphologie, vêtements. On évite les adjectifs stéréotypés.

### 3.2 Familles d'étalonnage
| Famille | Slots | Constantes (MEASURED sur la référence, puis normalisées) |
|---|---|---|
| **Crimson velocity** | H1, F1, état actif de S1–S3 | Environnement monochrome #6E0F12 → #9A1214 ; **peau naturelle chaude conservée** ; noirs à #0A0909 ; flou horizontal sur le décor seulement ; grain 35 mm fin |
| **Teal night** | T1–T5, P1, A1 | Bas en clés ; fond désaturé gris ardoise ; **ombres tirées vers #040F0E** (le fond de section, pour que l'image s'y fonde) ; peau naturelle ; léger fondu du bas ; même objectif (85 mm), même hauteur de caméra, même schéma de lumière |
| **Mono** | État inactif de S1–S3 | N&B vrai (saturation inférieure à 0,05), contraste fort, noirs denses |
| **Warm film** | V1–V3, A2 | Noirs relevés (luminance p5 ≈ 0,10–0,12), hautes lumières chaudes, jaune poussé dans les ombres, grain marqué, flou de mouvement. Fonction narrative : « images de vrais clients » face aux « images de marque ». Ce sont pourtant aussi des images de synthèse, d'où l'obligation de les étiqueter (§7) |

- **Constantes partagées** par les 4 familles :
  - un seul grain (même taille et même intensité) ;
  - même politique de point noir ;
  - même rouge accent (#F02B42) réservé à l'UI ;
  - aucune autre couleur saturée dans les images, hors du rouge et des peaux.

### 3.3 Pipeline : la lumière dans le prompt, l'étalonnage en post
1. **Prompter la lumière physique**, jamais la couleur finale. Une gélatine rouge sur la peau, des tubes rouges ou une clé tungstène ne se rajoutent pas de façon crédible en post. Ils se décrivent dans le prompt (§5).
2. **Générer légèrement « plat »** : pas de noirs écrasés ni de grain lourd dans le prompt, pour garder de la latitude.
3. **Étalonner en post par famille** avec un script versionné (sharp ou ImageMagick, plus un LUT `.cube` par famille appliqué aussi aux vidéos via `ffmpeg -vf lut3d`). Une même famille reçoit donc exactement la même courbe, le même grain et la même teinte d'ombre. C'est la garantie de cohérence que le prompting seul ne donne pas.
4. **Cas S1–S3** :
   - option A (recommandée) : une seule plate N&B, et l'état actif rouge en CSS. Couche `mix-blend-mode` sur #8F0F14, ou filtre SVG `feColorMatrix` duotone ombres #120203 / hautes lumières #FF5A3C. C'est animable, avec un seul fichier par carte.
   - option B : deux plates précuites et un fondu enchaîné. Plus fidèle (la peau orangée de S2), mais deux fois plus de fichiers.
5. **Contrôle qualité visuel par famille** : une planche-contact de chaque famille côte à côte avant validation.

### 3.4 Reference elements Higgsfield (cohérence des visages)
- **Lecture du compte** : 2 elements existent déjà (« Nino », « joy-1 »), sans rapport avec ce projet. → Préfixer tous les nouveaux en `vyron-…`.
- Préférence `auto_create_project: false`. → Créer explicitement un projet ou dossier « VYRON – Portfolio » au moment de la production (action d'écriture, non faite ici).
- **Méthode** :
  1. Générer une **ancre d'identité** par personnage récurrent (A, C1–C5, K1–K3) : portrait trois-quarts, fond gris neutre, lumière douce, vêtement uni.
  2. Une fois l'ancre validée par l'utilisateur, la sauvegarder en element de catégorie `character` depuis l'id de job de l'image, sans upload.
  3. Chaque prompt qui montre ce personnage insère son element.
- **Element `environment` « vyron-gym »** : racks noirs mats, sol caoutchouc, tubes rouges, béton. Il unifie les décors de T1–T5, A1, P1 et F1.
- **Elements `prop`** : gants sans marque, haltères chromés lisses sans chiffres.
- **Compatibilité** (description de l'outil, MEASURED) :
  - les elements fonctionnent avec Nano Banana Pro, Nano Banana 2, GPT Image 2, Seedream 4.5 et 5 lite, Cinema Studio Image 2.5, Cinema Studio Video 2 et 3.0, Seedance 2.0, Kling 3.0 ;
  - **Kling 3.0 exige une `start_image`** pour honorer un element ;
  - Soul 2.0 et Soul Cinema ne prennent **pas** les elements, seulement un `soul_id` entraîné sur 5 à 20 photos.
- **Plan B si un visage dérive** sur C3 (3 apparitions) : entraîner un Soul à partir de 6 à 10 variantes validées de l'ancre, puis l'utiliser avec Soul 2.0 ou Soul Cinema.

---

## 4. Modèles Higgsfield et budget

### 4.1 État du compte (lecture seule, MEASURED le 2026-10-02)
- Solde **694,5 crédits**, plan **Plus**. Pas d'« unlimited » actif (`unlim.available: false`).
- Historique `transactions` : uniquement **GPT Image 2.5 Flare**, à **2,75 crédits** par image ou **4,25 crédits** (probablement le palier de résolution ou de qualité supérieur, INFERRED). C'est le seul coût observé.
- `models_explore` n'expose aucun tarif. Le coût des autres modèles et des vidéos n'est donc pas lisible sans générer.

### 4.2 Recommandations par usage (issues de `models_explore` recommend/get)
| Usage | Choix principal | Pourquoi | Alternatives |
|---|---|---|---|
| Ancres d'identité et portraits équipe (T, A1, A2, P2) | **Nano Banana Pro** (`2k`, 1:1 et 4:5) | Photoréaliste, accepte des références multiples et les elements, ratios 4:5 et 21:9, jusqu'à 4k | GPT Image 2.5 (coût connu de 2,75 à 4,25, références, 4:5, 4k) ; Higgsfield Soul 2.0 (éditorial réaliste, sans 4:5 ni elements) ; Soul Cast (« consistent cinematic character identity », **16:9 seulement**, à explorer pour une première planche de casting) |
| Action et flou de mouvement (H1, F1, S1–S3, V1–V3) | **Cinema Studio Image 2.5** (`4k`) | Rendu cinéma, 4k, 21:9 et 4:5, compatible elements | Soul Cinema (éclairage dramatique, 2k, sans elements) ; Nano Banana Pro |
| Boucle hero (4–6 s) | **Kling 3.0** (`pro`, `sound: off`, start_image = end_image = plate validée) | Image de début et de fin identiques, donc boucle propre ; son coupé, moins de crédits | Cinema Studio Video 3.0 (premium, start et end, 21:9, genre `action`, audio coupé par défaut) |
| Extraits de témoignages | **Seedance 2.0** (`std`, 1080p, `generate_audio: false`, 21:9) | Identité stable via les références, 21:9 natif, start et end frame | Cinema Studio Video 2 (`speedramp: impact` ou `slowmo`, intéressant pour la boxe, mais sans 21:9) ; Kling 3.0 Turbo (budget) |
| Détourage (hero en couches, T3 qui sort du cadre) | Outil `remove_background` | Vrai alpha, conforme à craft-floor | — |
| Changer de ratio sans regénérer | `reframe` ou `outpaint_image` | Le mobile 9:16 du hero, le passage de V1 en 16:9 | — |
| 2x final | `upscale_image` | Si un master sort en 2k pour une cible de 2 880 px | — |

> Kling 3.0 ne propose que 16:9, 9:16 et 1:1. Pour le hero (ratio 1,31), on génère en 16:9 puis on recadre. Avec `object-position: 75%`, le visage reste à ≈ 74 % du cadre visible (ESTIMATED).

### 4.3 Estimation de crédits (ESTIMATED, à calibrer par un pilote)
| Poste | Volume | Hypothèse de coût unitaire | Crédits |
|---|---|---|---|
| Ancres d'identité | 9 personnages × 3 essais = 27 | Brouillons en 1k à ≈ 2,75 (coût observé) | ≈ 75 |
| Plates, brouillons de composition en 1k | 19 × 3 = 57 | ≈ 2,75 | ≈ 157 |
| Plates finales en 2k ou 4k (modèle premium) | 19 | 4 à 8 (inconnu, ordre de grandeur) | ≈ 76 à 152 |
| Agrandissements (H1, F1, V1–V3, T3) | ≈ 6 | inconnu | ≈ 10 à 30 |
| **Sous-total images** | ≈ 109 générations | | **≈ 320 à 415** |
| Vidéo : boucle hero | 1 × 2 prises | inconnu, à mesurer par un pilote de 5 s | ? |
| Vidéo : 3 témoignages | 3 × 2 prises | inconnu | ? |
| Option : 3 images de programmes de plus, 4 images « why » | 7 × 3 | ≈ 2,75 à 8 | ≈ 60 à 170 |

- Le palier **« Stills essentiels »** tient dans le solde actuel.
- Le palier **« Complet »** (4 à 5 vidéos et les options) le dépassera probablement. Il faudra recharger ou réduire, par exemple à la seule vidéo V1.
- **Méthode de calibrage** :
  1. Générer une image par modèle retenu.
  2. Lire `transactions` pour obtenir le coût réel.
  3. Faire de même avec un seul clip de 5 s.
  4. Seulement ensuite, lancer les lots (`generate_image_batch`, puis `jobs_wait`).

---

## 5. Gabarit de prompt et 3 prompts complets

### 5.1 Gabarit (dirigé par la structure, en anglais)
Les modèles ciblés (Nano Banana Pro, GPT Image, Cinema Studio) **n'ont pas de champ de prompt négatif** : les exclusions vont dans un bloc `AVOID:` final.

```
[PURPOSE] Photorealistic <genre> photograph for <slot> of a gym website, <aspect ratio>.
[FRAMING] <shot size>, <camera height/angle>; subject at <x%> width / <y%> height;
          <zones that must stay calm/dark, in % of frame, and why (headline, nav, cards)>;
          <safe column for alternate crops>.
[SUBJECT] <element placeholder or description: age, build, hair, expression, gaze>;
          wardrobe: <plain, unbranded, colour>.
[ACTION]  <pose / movement phase>.
[SETTING] <environment element or description>, <depth/blur of background>.
[LIGHT]   <key: direction, colour, quality>; <rim/fill>; <practicals>.
[CAMERA]  <focal length>, <aperture>, <shutter for motion>, <what is sharp vs blurred>.
[GRADE]   <family name + numeric constants>; grain; contrast; consistency note for the series.
[AVOID]   text, letters, numbers, logos, brand marks, swooshes, watermarks, signatures,
          signage; <slot-specific artefacts>; plastic/airbrushed skin; extra or fused fingers;
          duplicated limbs; CGI/illustration look; HDR halos.
```

### 5.2 Exemple 1 : H1 Hero (Cinema Studio Image 2.5, 3:2, 4k)
```
Photorealistic editorial sports photograph for the full-bleed hero of a gym website, 3:2 landscape.
FRAMING: medium close-up at shoulder height. The subject sits right of centre: her face at about 72% of the
frame width and 33% of its height, eyes on the upper-third line. Her extended punching arm enters from the left
edge between 55% and 70% of the frame height and ends before the horizontal centre, so the area from 50% to 75%
width at 70–82% height stays dark and calm. The bottom 28% of the frame falls off into near-black shadow
(reserved for a very large white headline). The upper-left 40% is soft, low-detail background (reserved for a
short text list). Face, shoulder and glove all stay inside the central-right 40% column so a 9:16 vertical crop
still works.
SUBJECT: <<<vyron-athlete-A>>>, a woman around 28, athletic and lean, focused intense expression, lips closed,
looking past the camera toward frame right; dark brown hair in a high ponytail whipping backwards with the
movement; glistening sweat on shoulders and forearm. Wardrobe: plain white racerback training tank, dark
unbranded boxing gloves with no lettering.
ACTION: follow-through of a straight punch, shoulder rotated toward camera, torso twisting.
SETTING: indoor boxing gym abstracted into streaks: strong horizontal speed blur across the whole background,
soft out-of-focus vertical light columns at far right.
LIGHT: warm white key from frame right sculpting the face; saturated crimson red gel wash filling the background
and rim-lighting hair, ear and shoulder; deep natural shadows.
CAMERA: 85mm lens, f/2, 1/30 s panning shot: face and eyes tack sharp, hair ends and background smeared
horizontally.
GRADE: background monochrome crimson from #6E0F12 to #9A1214, skin keeps natural warm tones (not red-washed),
lower frame crushed toward #0A0909, fine 35mm film grain, no haze, no bloom.
AVOID: any text, letters, numbers, logos, brand marks, swooshes, watermarks, signatures; lettering or stitching
logos on gloves; extra or fused fingers inside gloves; duplicated arms; plastic or airbrushed skin; beauty
filter; HDR halos; CGI or illustration look.
```

### 5.3 Exemple 2 : T2 Portrait équipe « Sarah Jenkins » (Nano Banana Pro, 1:1, 2k)
```
Photorealistic environmental headshot of a fitness coach for a five-person team grid, 1:1 square.
FRAMING: head and shoulders, camera at eye level, subject centred; eyes on a line about 38% from the top,
roughly 10% headroom, shoulders cropped by the bottom edge; the bottom 8% darker so it can fade into a
near-black page background.
SUBJECT: <<<vyron-coach-C2-sarah>>>, a woman in her early 30s, long dark hair tied back, natural warm genuine
smile with slightly visible teeth, looking straight into the lens, relaxed confident posture. Wardrobe: plain
black sports top with thin straps, no logos, small stud earrings only.
SETTING: <<<vyron-gym>>> after hours: black squat racks and cable machines far out of focus behind her,
cool ambient light.
LIGHT: soft key from 45 degrees camera left, gentle fill, subtle cool rim light from behind separating hair
from the background.
CAMERA: 85mm lens, f/1.8, shallow depth of field, eyes critically sharp.
GRADE (series "Teal night"): low-key exposure; background desaturated toward slate blue-grey; shadows tinted
toward teal-black #040F0E; skin natural and warm but never orange; same exposure, contrast, lens, camera height
and lighting setup as the four other coach portraits of this series; fine film grain.
AVOID: text, letters, logos, brand marks, gym signage with lettering, watermarks; beauty-filter or waxy skin;
heavy makeup; asymmetric or melted earrings; extra fingers; tilted horizon.
```

### 5.4 Exemple 3 : F1 Footer (Cinema Studio Image 2.5, 16:9, 4k)
```
Photorealistic cinematic sports photograph used as a website footer background, 16:9 landscape.
FRAMING: camera at floor level, three-quarter front view. The athlete occupies the left 55% of the frame; the
right 45% is pure deep black negative space with no detail at all (reserved for navigation links and text);
the bottom-left 25% is dark rubber gym floor (a huge white wordmark will overlap it). Head at about 35% width,
30% height.
SUBJECT: a muscular man around 30, mid push-up with arms locked, head slightly lowered, intense focus, sweat on
shoulders and upper back. Wardrobe: plain dark sleeveless training top, no logos.
SETTING: <<<vyron-gym>>> functional training zone, black rubber floor, two red fluorescent tube lights mounted
overhead at the top-left of the frame, faint haze catching the light.
LIGHT: monochrome crimson practical light from above and behind; strong red rim on shoulders, arms and back;
face mostly in shadow; no fill on the right side.
CAMERA: 35mm lens, f/2.8, slight natural vignette, shallow depth of field on the far background.
GRADE (series "Crimson velocity"): crimson monochrome with midtones around #89060E, blacks crushed to pure
black, smooth falloff into black toward the right edge, fine 35mm grain.
AVOID: text, letters, numbers, logos, signage, watermarks; warped hands or extra fingers on the floor; extra
limbs; distorted elbows; CGI look; visible light banding.
```

> **Provenance** : on enregistre la chaîne **exacte** envoyée à l'outil, avec le jeton d'element tel qu'il a été transmis. Le serveur le réécrit en `@nom`, et le manifeste garde la correspondance id ↔ nom (§6.5).

---

## 6. Spécification de livraison web

### 6.1 Tailles cibles
La densité est plafonnée à **2x** sauf pour le hero : au-delà, le gain visuel est nul et le poids s'envole.

| Slot | CSS à 1440 | 1x | 2x | CSS mobile | Master à générer | Largeurs `srcset` |
|---|---|---|---|---|---|---|
| H1 | 1440×1101 | 1440 | 2880 | 390×≈800 | 3:2 en 4k (≥ 3 840 px de long) | 640, 960, 1280, 1600, 1920, 2560, 2880 |
| H1 mobile | — | — | — | 390×≈800 | Recadrage 9:16 du master (≥ 1 536×2 731) | 390, 780, 1170 |
| A1 | ≈ 425×244 | 440 | 880 | 358×204 | 16:9 en 2k | 440, 720, 880 |
| A2 ×5 | 40×40 | 48 | 96 | 40 | Recadrage d'un headshot 1:1 en 2k | 48, 96 |
| S1–S3 | 220×124 | 240 | 480 (720 si zoom au survol ×1,5) | ≈ 268×151 | 16:9 en 2k | 240, 480, 720 |
| P1 | ≈ 520×531 | 540 | 1080 | 358×366 | 1:1 en 2k | 360, 540, 720, 1080 |
| P2 | 47 Ø | 48 | 96 | 40 | Recadrage de l'ancre C3 | 48, 96 |
| T1, T2, T4, T5′ | 229×230 | 240 | 480 | 171 à 260 | 1:1 en 2k | 240, 360, 480 |
| T3 | 326×409 | 340 | 680 | 358×448 | 4:5 en 2k | 340, 680, 720 |
| V1–V3 | ≈ 724×338 | 740 | 1480 | 358×201 (16:9) | 21:9 en 4k, recadré à 2,14:1 et à 16:9 | 740, 1110, 1480 |
| F1 | 1440×850 | 1440 | 2880 | 390×≈420 | 16:9 en 4k | 768, 1280, 1440, 1920, 2880 |
| X1, X2 | tuile | 512 | 1024 | — | 1:1 en 1k, rendu tuilable en miroir | — |

Chaque master fait au moins **1,5 fois la région affichée**, comme l'exige la porte « plates » d'Impeccable. Les cibles 2x le garantissent.

### 6.2 Formats et encodage
- **AVIF** en premier et **WebP** en repli, dans un `<picture>`. Le JPEG n'est plus nécessaire en 2026.
- Réglages sharp :
  - AVIF : qualité 50–60, effort 6 ;
  - WebP : qualité 76–82.
  - **Famille Crimson velocity (rouges saturés)** : AVIF en `chromaSubsampling: '4:4:4'` et WebP `smartSubsample: true`, sinon les contours rouges bavent.
- Budgets indicatifs (ESTIMATED) :
  - H1 en 1440w AVIF : ≤ 220 Ko ;
  - F1 en 1440w : ≤ 160 Ko (majoritairement noir) ;
  - carré d'équipe en 480w : ≤ 40 Ko ;
  - carte service en 480w : ≤ 35 Ko.
- Le grain est partie intégrante de l'étalonnage : il masque le banding des dégradés sombres, mais il coûte des octets. Il reste fin et identique partout.
- Attributs `width` et `height` toujours posés (aucun CLS).
- H1 : `fetchpriority="high"`, sans lazy-loading, et preload du `srcset` AVIF.
- Tout le reste : `loading="lazy" decoding="async"` avec un `sizes` exact. Exemples :
  - équipe : `(min-width: 1024px) 229px, (min-width: 640px) 45vw, 260px` ;
  - services : `(min-width: 1024px) 220px, 75vw`.
- Le **point focal** de chaque image est stocké dans le manifeste (`focal: {x, y}` en %) et sert de source unique pour `object-position`. Desktop H1 : `74% 35%`.

### 6.3 Recadrages art-dirigés par breakpoint
| Slot | ≥ 1024 px | 640–1023 px | < 640 px |
|---|---|---|---|
| H1 | Master 3:2 en `cover`, `object-position: 74% 35%` | Idem, focal à 70 % | **Fichier recadré 9:16** (`<source media>`), visage à ≈ 55 % x / 30 % y |
| A1 | 16:9 cranté | 16:9 | Option 4:5 (plus d'impact en colonne) : recadrage du master, prévoir de l'air au-dessus de la tête |
| V1–V3 | 2,14:1 | 2,14:1 | **16:9** (sinon 167 px de haut) |
| F1 | 16:9, sujet à gauche, noir à droite | Idem | Bandeau 390×420 centré sur le sujet, puis fond noir uni sous la navigation |
| T1–T5 | Grille 5 colonnes, T3 en 4:5 | 3 colonnes | Carrousel scroll-snap (≈ 260 px) ou grille 2 colonnes, T3 en pleine largeur |
| S1–S3 | 16:9 | 16:9 | 16:9 (carrousel) |

Les zones des **crans** (≈ 27×10 et 28×27 px sur les cartes services, ≈ 67×31 et 71×71 px sur P1) sont des zones de sécurité : aucun visage, aucune main ni aucun objet important n'y passe.

### 6.4 Convention de nommage et arborescence
```
src/assets/images/                 # masters versionnés (source de vérité, provenance intégrée)
  hero/hero-athlete--desktop-3x2.png
  hero/hero-athlete--mobile-9x16.png
  about/about-coach-c1-alex-vance--16x9.png
  about/about-reviewer-01--1x1.png … -05
  services/services-01-personal-coaching--16x9.png   # N&B ; l'état rouge est fait en CSS
  programs/programs-01-strength-c3-marcus-roy--1x1.png
  team/team-01-alex-vance--1x1.png … team-03-marcus-roy--4x5.png
  testimonials/testimonial-01-jordan-tucker--21x9.png
  footer/footer-pushup--16x9.png
  textures/texture-grain-red--tile.png, texture-concrete-light--tile.png
public/media/video/
  hero-athlete--loop-720p.{mp4,webm}, testimonial-01-jordan-tucker--loop-1080p.{mp4,webm}
art/                                # non livré
  anchors/cast-c3-marcus-roy--anchor.png
  prompts/<même-basename>.prompt.txt
  luts/crimson-velocity.cube, teal-night.cube, mono.cube, warm-film.cube
assets.manifest.json
```
- Règle : `<section>-<slot>[-<ref-casting>-<sujet>]--<variante>-<ratio>.<ext>`, en kebab-case ASCII.
- Les dérivés sont produits au build (pipeline image d'Astro/sharp) sous la forme `<basename>-<w>w.<avif|webp>` et ne sont pas versionnés.
- **`assets.manifest.json`**, une entrée par asset, avec les champs suivants :
  - `id`, `file`, `section`, `kind` (`plate`, `texture` ou `video`), `model`, `params` (ratio, résolution, mode) ;
  - `promptFile`, `elements` (id → nom), `jobId`, `date`, `creditsSpent`, `gradeFamily`, `lut` ;
  - `focal`, `crops` (par breakpoint), `alt.fr`, `alt.en`, `status` (`draft`, `approved` ou `rejected`).

### 6.5 Provenance (Impeccable `embed-prompt`)
- Après **chaque** génération, lancer :
  `"<skill-base-dir>/scripts/impeccable" embed-prompt <master.png> --prompt-file art/prompts/<basename>.prompt.txt`
  avec la chaîne **exacte** reçue par l'outil Higgsfield.
  - `--read` relit le prompt ;
  - `--scan src/assets/images public/media` liste les rasters sans provenance, avant chaque revue ;
  - un raster abandonné est supprimé dans le même lot.
- ⚠️ Le moteur Impeccable n'est **pas installé** dans ce bac à sable. Le lanceur v0.1.11 doit le télécharger dans `~/.impeccable/bin` et il faut un accès réseau. À prévoir au début de la phase « plates ».
- ⚠️ sharp **retire les métadonnées** des dérivés par défaut. La provenance vit donc sur les **masters versionnés** et dans le manifeste. Si l'on livre des fichiers précompilés, il faut les ré-embarquer.
- **Vidéos** : la prise en charge de la vidéo par `embed-prompt` n'est pas confirmée (INFERRED). On utilise un fichier compagnon `.prompt.txt` et le manifeste.
- **Marquage IA standard**, recommandé sur les masters : IPTC `DigitalSourceType = http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia` (exiftool, non installé ici). Vérifier aussi si Higgsfield fournit des Content Credentials (C2PA) et les conserver le cas échéant.

### 6.6 Vidéo
- **Générer depuis la plate validée**, en image-to-video avec start frame = plate : le poster et la première image coïncident et le changement ne flashe pas.
- **Boucle** :
  - Kling 3.0 avec start = end ;
  - sinon fondu des 0,5 dernières secondes dans ffmpeg (`xfade`) ;
  - durée de 4 à 6 s.
- **Encodage** :
  - `-an` (pas de piste son) ;
  - H.264 en MP4 : `-crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart` ;
  - AV1 en WebM : `libsvtav1 -crf 35`.
- **Définitions et budgets** (ESTIMATED) :
  - fond hero en 720p : ≤ 2,5 Mo ;
  - témoignage en 1080p : ≤ 4 Mo.
- **Attributs** : `muted playsinline loop preload="none"`, poster AVIF. La boucle démarre après le LCP. Pause hors écran (IntersectionObserver).
- **Repli** : `prefers-reduced-motion: reduce` ou Save-Data affichent le poster seul.
- **Pas de piste audio générée** : on coupe le son sur Kling et on désactive `generate_audio` sur Seedance. C'est plus léger, et aucune parole synthétique n'est attribuée à un « client ».

### 6.7 Contrôle qualité par plate (au zoom 200 %)
- Mains : cinq doigts, prise crédible sur l'haltère et les cordes.
- Équipement : géométrie des disques, barres droites, **aucun chiffre ni lettrage**.
- Yeux et reflets cohérents avec la source de lumière ; dents ; oreilles ; boucles d'oreilles.
- Mèches cohérentes avec le sens du flou.
- Peau texturée, sans effet cireux.
- Aucun logo.
- Les zones UI réservées sont réellement calmes : vérifier le **contraste mesuré** sous chaque texte posé sur image (≥ 3:1 en grand corps, ≥ 4,5:1 en petit).
- Cohérence de la famille d'étalonnage sur la planche-contact.

---

## 7. Éthique et transparence
1. **Aucune image du shot Dribbble n'entre dans Higgsfield** : ni upload, ni img2img, ni element, ni référence de visage, ni « dans le style de » ce shot.
   - Seuls des prompts texte, nos propres ancres et, au besoin, nos propres croquis de pose en masses grises servent de références.
   - C'est une **dérogation consciente** à la recette « comp-led » d'Impeccable (`comp-spec --crop` comme référence de plate) : le comp appartient à un tiers et peut contenir des photos de banque sous licence ou des personnes réelles.
2. **On ne reproduit pas la ressemblance** des modèles du shot. Les identités sont nouvelles, aucun nom de personne réelle n'apparaît dans les prompts.
3. **Aucune marque** : swoosh, lettrage de gants et de ceintures, enseignes. Règle `AVOID` systématique et contrôle qualité.
4. **Allégations fictives à étiqueter** : « 4.9/5, 480+ verified reviews », « Real transformation through client experiences » et les citations de clients sont fictifs. Impeccable le rappelle : *« generated imagery is a material, not a claim »*. Il faut l'indiquer :
   - sur le site, une ligne discrète dans le footer, par exemple « Projet concept : marque, personnes et avis fictifs ; visuels générés par IA » ;
   - dans l'étude de cas, une section « Images » : modèles utilisés, méthode (ancres, elements, LUT), prompts disponibles, crédits dépensés.
5. **Pas de faux témoignage vidéo parlant** : les extraits sont des plans d'entraînement muets, la citation reste du texte.
6. **Créditer le designer d'origine** du shot Dribbble (nom et lien) dans l'étude de cas, en distinguant clairement « structure inspirée de » et « réalisation, animation et images : moi ».
7. **Alt text descriptifs** qui ne présentent pas les personnes comme réelles. Exemple : « Portrait d'une coach souriante dans une salle de musculation sombre ». Le fond du footer est décoratif, donc `alt=""`.
8. **Droits d'usage** : vérifier les conditions du plan Higgsfield Plus pour une diffusion publique en portfolio.

---

## 8. Décisions à trancher (questions pour l'utilisateur)
1. **Étalonnage** : garder 4 familles (fidélité à la référence, rôle narratif du « film chaud » des témoignages), ou réduire à 2 (Crimson et Teal night) pour plus d'unité ? *Ma recommandation : 4 familles avec des constantes partagées.*
2. **Hero** :
   - (a) still et motion CSS/GSAP (zoom arrière, couches de vitesse) ;
   - (b) still et boucle vidéo Kling chargée après le LCP ;
   - (c) hero en couches (décor et sujet détouré) pour la parallaxe.
   - *Ma recommandation : (a) ou (c) d'abord, (b) seulement si le budget le permet.*
3. **Accroche du hero** : on recompose l'image pour que l'avant-bras sorte de la zone de texte (recommandé), ou on garde la composition d'origine avec un voile local ?
4. **Programmes** : une image (Marcus Roy) ou 4 images, une par item de l'accordéon, avec une transition de masque (3 plates de plus) ?
5. **Services** : un état rouge en CSS à partir d'une plate N&B (1 fichier, animable), ou deux plates précuites ? Le carrousel compte-t-il plus de 3 cartes ?
6. **Casting** :
   - valider le tableau §3.1 ;
   - qui est le coach de la section À propos ? (proposé : C1 Alex Vance) ;
   - « Elena Rostova » : on aligne l'identité sur le nom, ou on change le nom ?
7. **Témoignages** : 3 extraits vidéo muets ou 3 stills seulement ? Ce choix pèse lourd sur les crédits.
8. **Colonnes « Why VYRON »** : ajouter 4 images révélées au survol (adaptation), ou garder des colonnes texte seul comme la référence ?
9. **Budget** : 694,5 crédits. On accepte le palier « Stills essentiels » d'abord, avec un pilote de calibrage d'une image et d'un clip ?
10. **Crédit** : quel nom et quel lien utiliser pour le designer d'origine du shot ?

**Ordre de production proposé**, avec un seul point d'approbation par étape :
1. Mise en place : projet Higgsfield, manifeste, LUT.
2. Ancres du casting, puis **validation**.
3. Pilote d'une plate par famille en 1k (H1, T2, V1, F1) et calibrage des coûts, puis **validation** de l'étalonnage.
4. Lots par famille.
5. Post-production : LUT, grain, agrandissement, contrôle qualité.
6. Vidéos à partir des plates validées.
7. Encodage, `embed-prompt --scan`, puis revue.

---

*Note pour le script appelant : `report.md` n'a pas été écrit. Le harness a refusé l'écriture du fichier de rapport par un sous-agent, donc ce texte est la version complète. Les recadrages de travail (`svc_imgs.png`, `about_zoom.png`, `prog_zoom.png`, `footer_zoom.png`, `hero_glove.png`, `cards_tex.png`) se trouvent dans `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/work/a8-imagery/`.*