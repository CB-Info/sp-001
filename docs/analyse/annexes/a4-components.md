> **Annexe brute** : rapport de l’agent `a4-components`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).


# VYRON — Inventaire exhaustif des composants et des détails signatures

*Lentille a4-components · vocabulaire Impeccable « extract » + « polish » + « craft-floor » · phase d'analyse uniquement, aucune ligne de code du site*

---

## 0. Méthode, échelles, conventions

**Statuts utilisés partout :**
- **[M]** : mesuré au pixel (PIL/numpy : échantillonnage, profils de lignes, boîtes englobantes).
- **[E]** : estimé (image basse résolution ou bord flou ; marge indiquée quand utile).
- **[I]** : inféré (déduction de design, pas directement visible).
- **[P]** : proposition. Les états d'interaction ci-dessous en relèvent tous : le shot ne montre aucun état, je les conçois.

| Source | Cadre du site dans l'image | Facteur vers une maquette 1440 | Précision |
|---|---|---|---|
| `2.png`, `3.png`, `4.png` (1600×1200) | x = 100 → 1499, soit **1 400 px** [M] ; fond Dribbble `#E4E2E3` autour [M] | **× 1,0286** [I : maquette supposée en 1440] | ±2 px dans le shot. Les images sont un upscale ×2 : 77 à 90 % des paires de pixels horizontales sont identiques [M]. La résolution effective du cadre est donc d'environ 700 px, et un filet de 1 px en maquette ressort comme une ligne pâle de ~2 px. |
| `1.png` (407×2000) | x ≈ 20,5 → 386, soit **≈ 366 px** [M] ; y = 22 → 1975 | **× 3,93** | ±4 px à 1440 ; texte < 16 px illisible |
| `sections/s*.png` | upscales ×4 de `1.png` | — | servent à la lecture, jamais à la mesure |

Les cotes « à 1440 » sont données depuis le bord gauche du cadre (x) et depuis le haut de la section ou du composant (y), sauf mention contraire.

**Illisible, donc non inventé :**
- l'index exact des items d'accordéon (petit, rouge) ;
- les icônes des tag pills ;
- l'icône du 1er bouton social ;
- le contenu de la barre noire sous la vidéo ;
- le nombre d'avis de la carte note (« 480+ » probable) ;
- le détail du séparateur du marquee (point ou mini-astérisque) ;
- les textes < 14 px du footer, lus seulement en partie.

### 0.1 Grille porteuse (le contexte de tous les composants)

| Élément | Valeur à 1440 | Statut |
|---|---|---|
| Gouttière latérale (logo, H2, règles) | **60** (58,5 shot) | [E] |
| Conteneur | **1 320** (x 60 → 1380 ; 1 283 shot) | [E] |
| Gap de grille (cartes services, team, about) | **20** (19–20 shot ; ~22 dans About, mesuré sur 1.png) | [E] |
| Cadre technique du hero : filets verticaux | à **30** des bords (x 128,5 et 1 470,5 shot) | [M] |
| Hauteur du hero | **1 100** (1 070 shot) | [M] |
| Hauteur totale de la page | **≈ 7 680** | [E] |

| Section | y début → fin (1440) | Fond | Statut |
|---|---|---|---|
| Hero | 0 → 1 100 | photo étalonnée rouge, fondu noir en bas | [M] |
| About | 1 106 → 1 861 | `#FFFFFF`, bande réglée en tête (1 106 → 1 157) | [E] |
| Services | 1 861 → 3 155 | `#F5F5F5` [M], bande réglée en tête (1 861 → 1 912) | [E] |
| Programs | 3 155 → 4 328 | `#FFFFFF`, bande réglée en tête (3 155 → 3 222) | [E] |
| Why VYRON | 4 332 → 5 548 | `#040F0E` [M] | [E] |
| Transformation | 5 551 → 6 783 | `#FFFFFF`, bande réglée en tête (5 551 → 5 610) | [E] |
| Marquee | 6 787 → ~6 835 (≈ 48–51 de haut) | `#F02B42` | [E] |
| Footer | ~6 835 → ~7 680 | photo rouge → `#010101` | [E] |

### 0.2 Fondations relevées (tokens candidats)

**Couleurs.** Le rouge est la seule teinte de la palette ; les neutres sombres de la section Why tirent vers le vert-bleu.

| Token proposé | Valeur | Statut | Où / rôle |
|---|---|---|---|
| `--red` | `#F02B42` | [M] mode 3.png (SERVICES., arrow tile, astérisques) ; `#EF2941` sur le bouton 4.png : même valeur, à la compression près | Surfaces, glyphes, display |
| `--red-on-text` | `#E3213A` | [P] | Variante pour les surfaces rouges qui portent du texte blanc : 4,62:1 contre 4,09:1 pour `#F02B42` |
| `--ink` | `#171A32` | [M] mode 3.png (H2 services, « FUNCTIONAL ») | Titres sur fond clair : un **bleu-nuit très sombre, pas du noir** |
| `--black` | `#000000` | [M] | Carte active, numéraux, bouton noir, fond footer |
| `--night` | `#040F0E` | [M] | Fond de Why |
| `--night-line` | `#202B2A` | [M] | Bordures des colonnes de Why (1,33:1, décoratif) |
| `--night-fg-1` | `#CBD5D4` (noms `#C7D2D1`) | [M] | Texte principal sur `--night` |
| `--night-fg-2` | `#9DA8A7` (label eyebrow `#94A09F`) | [M] | Notes, intro |
| `--night-fg-3` | `#6C7776` / `#5C6766` | [M] | Titres de colonnes, index team (contraste insuffisant, voir §8) |
| `--paper` / `--paper-2` | `#FFFFFF` / `#F5F5F5` | [M] | Alternance des sections claires |
| `--line` | `#ECECEC` sur blanc, `#E3E3E3` sur `#F5F5F5` ; `#171717` sur noir | [M] | Filets |
| `--fg-muted` | `#6C6E71` (mono `#6B6C6E`, citation `#6C6C6C`) | [M] | Body et notes sur fond clair |
| `--fg-on-black` | `#A1A1A1` | [M] | Description de la carte noire |
| `--chip` | `#E3E5E5` | [M] (1.png) | Bouton « précédent », gris |
| Photo du hero | `#660B0C` → `#B51114`, bas `#000000` | [M] | Étalonnage rouge et fondu noir |
| Fond du footer | `#990616` à gauche → `#010101` dès ~65 % de la largeur | [M] | Dégradé photo → noir |

**Rôles typographiques.** Les hauteurs de capitale sont mesurées ; les corps sont estimés avec un ratio cap/corps d'environ 0,72–0,75.

| Rôle | Où | Capitale à 1440 | Corps estimé | Caractère observé |
|---|---|---|---|---|
| `wordmark` | Header | **34** [M] | ~46 | Grotesque carrée, bold, « Y » dessiné en U + fût ; ™ de 14 de haut, aligné sur le haut des capitales [M] |
| `wordmark-xl` | Footer | ~153 [E] | ~205 | Idem |
| `display-hero` | BUILD / STRENGTH | **126** [M] | ~170–180 | Carrée, graisse regular ; interligne ≈ 0,8 (écart de 21 entre les lignes) [M] |
| `display-word` | SERVICES. | **193** [M] | ~260 | Carrée **chanfreinée** (coins coupés à 45°, S à barre médiane oblique) ; largeur 1 277 sur 1 320 [M], donc ajustée au conteneur |
| `numeral` | 01 / 02 (cartes services) | ~128 [E] | ~170 | Même famille chanfreinée |
| `h2` | About, Services, Why, Transformation, Footer | **39** [M] (38 shot) | ~52 ; interligne ~56 (≈ 1,08) | Grotesque large, carrée, bold, capitales ; même « Y » |
| `h3` | Titres d'accordéon | ~30 [E] | ~38–40 | Idem |
| `card-title` | « STRENGTH TRAINING » | **23** [M] | ~30 | Idem, sur 2 lignes |
| `statement` | « Results are built, not given. » | ~16 [E] | ~22 | Famille des titres en **casse phrase**, rouge |
| `lede` | « Redefine Your Physical Potential » | **29** [M] | ~40 | Néo-grotesque type Inter, light/regular, approche serrée, interligne ≈ 1,0 (pas de 39) [M] |
| `body` | Partout | — | ~16 [E] | Néo-grotesque, interligne ~1,3 |
| `tagline` | Liste du hero | **14,4** [M] | ~20 | Néo-grotesque, capitales |
| `ui-label` | MENU · libellés de bouton | 11 [M] · 14 [M] | ~15 · ~18 | MENU en néo-grotesque ; « Meet the Team » dans la famille carrée, casse mixte |
| `mono` | Eyebrows, notes latérales, tags, nav du footer, méta du coach | **11** [M] | ~14–15 | Monospace (genre Plex Mono / JetBrains Mono, à confirmer côté typo) |
| `index` | « 01 » de la team, compteur | ~10 / ~28 [E] | ~13 / ~36 | Famille carrée |

**Mouvement** : tokens proposés **[P]**, repris dans les états plus bas.
- Durées : `--dur-press: 90ms`, `--dur-hover: 180ms`, `--dur-reveal: 480ms`, `--dur-moment: 800ms`.
- Courbes : `--ease-out: cubic-bezier(.16,1,.3,1)` (exponentielle, conforme au craft-floor) et `--ease-snap: cubic-bezier(.7,0,.2,1)`, réservée aux bascules mécaniques.
- Toute animation a un repli `prefers-reduced-motion` : état final sans transition.

---

## 1. Primitives et motifs (atomes)

### 1.1 `StepShape` : la silhouette à gradin (LA primitive de l'identité)

- **Où** :
  - bouton téléphone ;
  - boutons « Learn More About Us » (noir), « View All Programs » et « Meet the Team » (rouges) ;
  - arrow tile des services ;
  - boutons précédent/suivant du témoignage ;
  - photos : About, carte services active et carte suivante, Programs.
- **Anatomie [M]** : ce n'est **pas une ombre portée**. C'est l'**union de deux rectangles de même couleur** décalés en diagonale. Le résultat a deux encoches, **toujours en haut à droite et en bas à gauche**, sur toutes les occurrences [M]. Polygone à 8 points pour une boîte W×H, avec `dx` le pas horizontal, `t` le décalage haut et `b` le décalage bas :
  `0,0 → W−dx,0 → W−dx,t → W,t → W,H → dx,H → dx,H−b → 0,H−b`.

  | Occurrence | Boîte (1440) | dx | t | b | Statut |
  |---|---|---|---|---|---|
  | Bouton téléphone | 39×39 | 5–6 | ~2 | ~5 | [M] |
  | « Meet the Team » | 202×45 | 13 | 4 | 11 | [M] |
  | Arrow tile | 92×92 | 12–14 | 6 | 14 | [M] |
  | « Learn More About Us » | 236×47 | ~12 | ~4 | ~12 | [E] |
  | « View All Programs » | 212×43 | ~12 | ~4 | ~11 | [E] |
  | Précédent / suivant | ~39–43 | ~4 | ~4 | ~4 | [E] |
  | Photo de carte service | 219×123 | 25–28 | 8 | 26 | [M] (identique sur les 2 cartes) |
  | Photo About | 425×244 | 51–63 | ~10 | ~28 | [E] |
  | Photo Programs | 519×531 | 67–71 | ~40 | ~60 | [E] |

  Sur les contrôles, le pas est fixe (~12/4/12). Sur les médias, il est proportionnel : environ 11 à 14 % de la largeur [E].
- **Variantes** : `control-sm` (tuiles de ~40), `control` (boutons et tuile de 92), `media` (proportionnel).
- **Mise en œuvre [P]** :
  - deux calques pilotés par custom properties (`--step-x`, `--step-t`, `--step-b`) : le fond de l'élément plus un `::before` de même couleur, déplacé par `transform`. Toute l'animation reste ainsi sur le compositeur ;
  - pour les images, `clip-path: polygon()` avec des longueurs `@property` animables ;
  - jamais `box-shadow`.
- **États [P]**, la grammaire de mouvement de tout le site :
  - **hover** : le calque arrière glisse de +4 px dans l'axe du pas (180 ms, `--ease-out`) ; le gradin « s'ouvre » ;
  - **active** : le gradin se referme à 0, les deux calques alignés, comme une plaque enfoncée (90 ms) ;
  - **focus-visible** : contour carré de 2 px en `--red` (ou noir/blanc sur fond rouge), décalé de 3 px, plus l'état hover ;
  - **disabled** : gradin à 0 (rectangle plat), fond `#D9D9D9`, texte `#8A8A8A`. La disparition du gradin signale la perte d'affordance.

### 1.2 `Asterisk` : glyphe à 8 branches

- **Où et taille** :

  | Occurrence | Couleur | Taille à 1440 | Statut |
  |---|---|---|---|
  | Hero, à gauche | blanc | 73×73, x 61 / y 179 | [M] |
  | Collé aux numéraux des cartes services | rouge | ~74 | [M] |
  | Section Transformation, colonne gauche | rouge | ~102 | [E] |
  | Footer, panneau 3 | rouge | ~102 | [E] |

- **Anatomie [M]** : 4 barres rectangulaires superposées à 0°, 45°, 90° et 135°. Bouts coupés d'équerre, sans arrondi. Épaisseur ≈ **19–20 % du diamètre**. Les branches diagonales sont un peu plus courtes et tiennent dans ~87 % de la boîte. Au contact des numéraux, l'astérisque **chevauche le coin bas-droit du dernier chiffre** et passe sous la ligne de base.
- **Variantes** : `white`, `red` ; tailles `md` (~74) et `lg` (~102).
- **États** : aucun, l'élément n'est pas interactif. **[P] mouvement** : rotation mécanique par crans de 45° (`--ease-snap`), liée au scroll ou en indicateur de chargement. À limiter à **un seul** usage fort pour ne pas disperser les effets.
- **Craft-floor** : en SVG dessiné, jamais le caractère Unicode « ✱ ».

### 1.3 `TickRuler` : la règle graduée des eyebrows

- **Où** : devant les labels « About Us », « Fitness Programs », « WHY VYRON », « TRANSFORMATION ».
- **Anatomie [M]** (4.png) :
  - largeur ~74, ~13 graduations au pas de **6** ;
  - graduations majeures (début, milieu, fin) de ~12 de haut, mineures de ~9 ;
  - trait de ~1 px ; rouge rendu `#934E65` au maximum sur fond sombre (trait fin anticrénelé, donc `--red` à pleine opacité ou ~70 %) ;
  - écart avec le label : **10**.
- **Variantes** : `light`, `dark`.
- **États** : aucun. **[P]** : remplissage séquentiel des graduations à l'entrée. C'est la piste pour lui donner une fonction : un indicateur de progression de section (voir §8).

### 1.4 `Crosshair` : repère de calage

- **Où** : hero uniquement [M]. 4 repères sur une ligne à **y = 657**, x ≈ **71 / 504 / 936 / 1 368**, au pas de 432 et symétriques autour du centre [M].
- **Anatomie [M]** : une croix d'environ 24×24 faite de 4 traits courts, avec un vide central d'environ 5. Blanc à ~40–50 % d'opacité, trait de ~1 px.
- **Variante [I]** : sombre, sur fond clair, si on l'étend à d'autres sections. Hors du hero, la résolution ne permet pas de dire s'il y en a.
- **États** : aucun. **[P]** : apparition avec léger décalage lors de l'arrivée du hero (cohérent avec un « calage » de mire).

### 1.5 `Hairline` et `FrameRules` : les filets techniques

- **Où** :
  - hero : filets verticaux à x 30 et x 1 410, sur toute la hauteur ; horizontaux à **y 741** et **y 1 047**, de x 30 à 1 410 [M]. Ils forment le cadre de la bande du H1 ;
  - Services : filets au-dessus et en dessous du H2 (y 390 / 600 de la section), sur toute la largeur du conteneur [M] ;
  - Programs : séparateurs d'accordéon ;
  - Why : cadre du tableau ;
  - Transformation : un filet vertical à x ≈ 384 et un horizontal sous la vidéo [E].
- **Anatomie** : 1 px.
  - Hero : blanc à ~15–20 % d'opacité.
  - Fond clair : `#ECECEC` ou `#E3E3E3`.
  - Carte noire : `#171717`.
  - Why : `#202B2A`.
- **Tokens** : `--line`, `--line-on-dark`, `--line-on-photo` (rgba blanc).
- **[P]** : tracé `scaleX` 0 → 1 depuis la gauche à l'entrée de section (480 ms). C'est le meilleur candidat pour le « moment » de transition entre sections.

### 1.6 `RuledGrid` : la texture « tableur » réglée

- **Où et variantes** :
  - `strip` (séparateur de section) : en tête d'About, de Services, de Programs et de Transformation, et visible au bas du shot du hero [M] ;
  - `panel` (aplat décoratif) :
    - sous le H2 de Services : x 60 → 1 380, h **111** [M] ;
    - sous les deux premiers coachs de Why : 478×109 [M] ;
    - footer, en bas à droite : très pâle [E].
- **Anatomie [M]** :
  - toujours **11 colonnes**. Pas de 131 sur la pleine largeur (strip), 120 sur le conteneur (panel services), ~43 sur 478 (panel Why) ;
  - filets horizontaux au pas de **≈ 6,6** ;
  - strip de **≈ 52** de haut (8 rangées), sauf Programs (~67) [E] ;
  - verticales légèrement plus marquées que les horizontales (sur clair, Δ luminance ≈ 10 contre 5) [M].
- **Couleurs** :
  - clair : lignes ≈ `#E7E7E7` sur `#F3F3F3`, ou ≈ `#F0F0F0` sur blanc [E] ;
  - sombre : lignes ≈ `#1C2726` sur `#040F0E` [E].
- **[P] implémentation** : deux `repeating-linear-gradient` (11 colonnes via `calc(100%/11)`), sans image. Les 11 colonnes ne coïncident pas avec la grille de contenu : c'est un motif, pas une grille.
- **[P] mouvement** : les colonnes se dessinent en cascade (verticales `scaleY`, puis horizontales), ou bien un balayage de lumière en `mask-position` au passage du scroll.

### 1.7 `ArrowTrail` : les trois flèches rouges

- **Où** : en fin de 1re ligne du sous-titre du hero.
- **Anatomie [M]** : 3 flèches « → » au trait fin, ~20×16 chacune, au pas de **40** (écart d'environ 20), même rouge pour les trois (pas de dégradé d'opacité). Centrées sur l'œil de la 1re ligne.
- **[P]** : défilement en vague (chaque flèche avance de 4 px avec un décalage de 80 ms), une seule fois à l'arrivée, puis au survol du bloc. En SVG, pas en caractère « → ».

### 1.8 Jeu d'icônes

| Icône | Où | Anatomie |
|---|---|---|
| Dot grid 3×3 | Déclencheur du menu | Carrés de 3, pas de 6, 15×15 au total, blanc [M] |
| Phone-call | Bouton téléphone | Combiné et 2 arcs, trait ~1,5, `--ink`, ~20 [M] |
| Flèche coudée (type « arrow bend up right ») | Arrow tile ; suivant/précédent du témoignage, en miroir | Trait blanc ~2, bouts arrondis, ~36 [M] |
| Plus / moins | Accordéon | Trait fin, ~16 [E] |
| Icônes des tag pills | Tags | Illisibles ; calendrier, haltère, éclair et graphique probables [I] |
| Réseaux sociaux | Footer | 3 icônes blanches ~20 ; la 2e ressemble à Instagram et la 3e est le « X » [E] ; la 1re est illisible |

Règle **[P]** : une seule famille au trait (Phosphor « regular » ou Lucide à 1,5 px), même grille de 24.

**Dérive relevée** : la flèche coudée a des bouts arrondis alors que tout le reste du monde est à angles vifs. C'est à décider.

### 1.9 `Wordmark`

- **Tailles** : `sm` (header) : 162×34 de capitale, x 61 / y 27 [M]. `xl` (footer) : ~873 de large ™ compris, capitale ~153, x ~65, avec ~35 sous la ligne de base jusqu'au bord du cadre [E].
- **Anatomie** : ™ en exposant, de la hauteur de 40 % de la capitale, collé au N.
- **États [P] (`sm`)** : c'est un lien vers l'accueil. Hover : rien d'autre que le curseur, ou un léger décalage du ™ de 2 px. Focus-visible : contour standard.

### 1.10 `NumeralMark` : numéral géant + astérisque

- **Où** : cartes services (« 01✱ » en noir, « 02✱ » en blanc sur la carte noire) [M].
- **Anatomie** :
  - numéral `numeral` (~128 de capitale), aligné à droite dans la carte (le bord droit de l'astérisque tombe à ~597 du bord gauche de la carte sur les deux cartes) [M] ;
  - astérisque rouge `md` qui chevauche le bas du dernier chiffre.
- **[P]** : à l'activation de la carte, l'astérisque fait un cran de 45° et le numéral monte depuis un masque (`clip-path` inset).

### 1.11 Textures et traitements d'image (direction artistique, à préserver)

- **Rouge « grunge »** : marbrure basse fréquence de faible contraste sur la carte note [E]. **[P]** : PNG de bruit en `mix-blend-mode: multiply` ou `soft-light`, à 8–12 %.
- **Trame claire** : grain ou demi-teinte sur la carte « 20 », `#F2F2F2`–`#F8F8F8` [E].
- **Photo du hero** : étalonnage rouge ; flou de bougé horizontal sur le fond ; peau en tons naturels ; fondu vers `#000` dès ~65 % de la hauteur [M].
- **Bandes verticales « verre cannelé »** à droite du hero, de x ≈ 1 125 à 1 410, en marches de luminance à x ≈ 1 162, 1 275 et 1 350 [M]. Je ne peux pas dire si c'est dans la photo (colonnes floues de la salle) ou une surcouche [I]. À trancher.
- **Photos selon l'état** :
  - carte service **active** : photo saturée rouge (saturation moyenne 217/255) [M] ;
  - carte **inactive** : **noir et blanc** (saturation 15/255) [M] ;
  - coachs : tons froids désaturés ;
  - témoignage : grade film chaud (sépia/orange) ;
  - footer : photo teintée rouge.

---

## 2. Composants partagés (molécules)

### 2.1 `StepButton`

- **Où** :
  - `black` : « Learn More About Us », 236×47 [E] ;
  - `red` : « View All Programs », 212×43 [E], et « Meet the Team », **202×45** [M].
- **Anatomie** :
  - silhouette `StepShape/control` ;
  - libellé dans la famille carrée (casse mixte), ~18 de corps (capitale 14 [M]), centré ;
  - remplissage `--black` ou `--red` ; texte blanc.
- **Variantes** : `black`, `red`. **[P]** : `white`, pour une éventuelle utilisation sur photo.
- **États [P]** : grammaire `StepShape` (hover : gradin qui s'ouvre ; active : gradin fermé ; disabled : plat gris), avec en plus :
  - **hover** : libellé décalé de 2 px vers la droite, ou une flèche qui entre depuis un masque ;
  - **loading**, si un jour le bouton déclenche une action : astérisque `sm` en rotation par crans à la place du libellé, `aria-busy`.
- **Accessibilité** : blanc sur `#F02B42` = **4,09:1**, sous AA pour un libellé de 18 px regular (voir §8). Hauteur de 45 : OK.

### 2.2 `IconButton` (tuile carrée)

| Variante | Où | Taille (1440) | Remplissage / icône | Gradin |
|---|---|---|---|---|
| `white` | Bouton téléphone (header) | **39** [M] | `#FFF` / phone-call `--ink` | Oui (5/2/5) |
| `red-lg` (« arrow tile ») | Services, à gauche de la carte active | **92** [M] | `--red` / flèche coudée blanche | Oui (12/6/14) |
| `red` | Témoignage « suivant » | ~39–43 [E] | `--red` / flèche blanche | Oui (petit) |
| `grey` | Témoignage « précédent » | ~39 [E] | `#E3E5E5` / flèche `--ink` | Oui (petit) [M] |
| `dark-square` | Réseaux sociaux du footer | ~48 [E], écart ~15 | gris très sombre / icône blanche | **Non** (incohérence) |

**États [P]** :
- **hover** : gradin qui s'ouvre, et l'icône bouge de 3 px dans son sens (flèche vers la droite ; téléphone : oscillation unique de ±8°) ;
- **focus-visible** : contour 2 px, décalé de 3 ;
- **active** : gradin fermé ;
- **disabled** : [I] le bouton « précédent » est gris **parce qu'on est sur le témoignage 01**, donc il montre déjà l'état désactivé. Je le formaliserais ainsi : `--chip`, icône à 40 %, `aria-disabled`.
- **`dark-square` hover [P]** : fond en `--red` et apparition du gradin, pour la ramener dans le système.

**Cibles tactiles** : 39–43 est sous les 44 recommandés. Zone cliquable étendue par pseudo-élément, sans changer le visuel.

### 2.3 `StepFrame` (média à gradin)

- **Où** : photo About (425×244), carte service active et carte suivante (219×123), Programs (519×531) [M/E].
- **Anatomie** : `StepShape/media` appliqué à l'image ; l'image est continue à travers les deux rectangles [M]. Aucune bordure, aucun rayon.
- **Variantes** : couleur ou N&B selon l'état du parent (voir ServiceCard).
- **États [P]** (non interactif seul ; sous le survol du parent) :
  - l'image zoome de 1,00 à 1,04 à l'intérieur du masque ;
  - le gradin s'ouvre de 4 px ;
  - entrée : révélation `clip-path` du rectangle A puis du rectangle B (décalage de 120 ms), ce qui « construit » le gradin.

### 2.4 `Eyebrow` (règle + label mono)

- **Où (4 occurrences)** :

  | Section | Label | Casse |
  |---|---|---|
  | About | « About Us » | casse titre |
  | Programs | « Fitness Programs » | casse titre |
  | Why | « WHY VYRON » | capitales |
  | Transformation | « TRANSFORMATION » | capitales |

  L'incohérence de casse est relevée en §6.
- **Anatomie [M]** (Why) :
  - `TickRuler` de 74, écart de 10, label mono de capitale 11 (~15 de corps) ;
  - couleur du label : `#94A09F` sur fond sombre, `#6B6C6E` [E] sur fond clair ;
  - position : x 58 de la section, y ~108 du haut de Why.
- **Variantes** : `light`, `dark`.
- **États** : aucun. Gros sujet de tension avec le craft-floor : voir §8.

### 2.5 `SectionHeader`

| Variante | Où | Composition |
|---|---|---|
| `split` | Services, Why, Transformation | H2 à gauche (max ~712–745 de large, 2–3 lignes) ; note à droite (~300 de large, alignée sur le bord droit du conteneur) |
| `offset` | About | Eyebrow seule dans la colonne gauche ; H2 et CTA dans la colonne droite, à partir de x ≈ 750 (H2 de 610 de large) [E] |
| `stacked` | Programs | Eyebrow, H2, body, CTA empilés dans la colonne gauche (~519) |

- **Note de `split`** : mono dans Services (`#6B6C6E`), sans dans Why (`#9DA8A7`) et dans Transformation.
- **Alignement vertical de la note** : centré dans Services [M], **aligné en bas** dans Why et Transformation [M]. C'est une dérive.
- **Anatomie du H2** : `h2`, capitale 39, interligne ~56, couleur `--ink` ou blanc.
- **[P]** : le H2 se révèle ligne par ligne par masque (translateY 100 % → 0, décalage de 60 ms) ; la note apparaît en fondu 120 ms après.

### 2.6 `RuledStrip` et `RuledPanel`

Voir 1.6. Deux usages de la même primitive : le strip pleine largeur, collé au bord du cadre, qui sépare les sections, et le panel décoratif qui tient dans le conteneur.

---

## 3. Composants par section (organismes)

### 3.1 Hero

#### `SiteHeader`

- **Wordmark `sm`** à gauche, x 61. À droite :
  - **`MenuTrigger`** : dot grid de 15 à x 1 217, écart de 15, puis « MENU » en néo-grotesque, capitale 11 (~15 de corps), blanc [M] ;
  - **`IconButton/white`** : téléphone, 39, bord droit à ~1 374–1 380 [M/E].
- Ligne de base du header à ~43 du haut [E]. Aucun fond : posé sur la photo.
- **[I]** : le header devient probablement sticky avec un fond au scroll. Ce n'est pas montré.
- **États [P]** :
  - `MenuTrigger` : en hover, les 4 points d'angle s'écartent de 1 px (la grille « respire ») ; à l'ouverture, les 9 points se réarrangent en ✕ (`--ease-snap`, 240 ms) ; `aria-expanded` et `aria-controls` ; le libellé passe à « CLOSE » ;
  - header : masqué au scroll vers le bas et révélé au scroll vers le haut ; fond `--black` à 85 % une fois le hero franchi.

#### `HeroTaglineList`

- 4 items en capitales (« PUMP. REPEAT. », « LIFT. CRUSH IT. », « PUSH YOUR LIMITS. », « DIG DEEPER. »).
- **5 filets** au pas de **58,6**, de x 61 à 569 (**508** de large), le 1er à y 308 [M].
- Texte : `tagline`, capitale 14,4, centré verticalement dans chaque bande ; blanc ~90 %.
- **Non interactif** (liste `ul`). **[P]** : les filets se dessinent de gauche à droite, chaque ligne de texte monte depuis un masque (stagger de 70 ms).

#### `HeroHeadline` (H1 décalé en escalier)

- « BUILD » à x 61 ; « STRENGTH » **en retrait de 215** (x ≈ 276) [M].
- Capitale 126, écart de 21 entre les lignes [M]. Les deux lignes tiennent dans la bande délimitée par les filets y 741 et y 1 047.
- **[P]** : c'est le « moment » du hero. Chaque ligne se révèle par masque, et « STRENGTH » glisse horizontalement jusqu'à son retrait (le décalage devient un geste). Ensuite, très légère parallaxe de la photo, pas du texte.

#### `HeroLede` + `ArrowTrail`

- x ≈ 768, y ≈ 812, 2 lignes de capitale 29, pas de 39 [M]. Blanc ~95 %. Les flèches suivent la 1re ligne (voir 1.7).

#### Cadre du hero (`FrameRules` + `Crosshair`) et média

- Voir 1.4, 1.5 et 1.11.
- **[P]** : la photo du hero en `<picture>` AVIF/WebP. Fondu noir et bandes en CSS si ce n'est pas dans l'image. Texte lisible garanti par le fondu (la liste de taglines repose sur une zone rouge moyenne : contraste à vérifier sur l'image réelle).

### 3.2 About

#### `RatingCard`

- **Taille** : 425×236, x 61 [E].
- **Contenu** :
  - « 4.9 » dans la famille carrée blanche (corps ~56 [E]), avec « /5 » réduit (~35 %) et aligné sur la ligne de base ;
  - libellé en capitales néo-grotesque blanc, ~14 de corps, sur 2 lignes (« AVERAGE RATING FROM 480+ VERIFIED REVIEWS », nombre incertain) ;
  - en bas : `AvatarStack`.
- **Fond** : `--red` avec la texture grunge.
- **Non interactif** [I]. **[P]** : si elle devient un lien vers les avis, hover sur la grammaire `StepShape`, mais la carte n'a pas de gradin aujourd'hui.

#### `AvatarStack`

- 5 vignettes **carrées** d'environ 36–39, écart d'environ 7–8, **sans chevauchement**, sans bordure [E].
- **Dérive** : l'avatar du coach (Programs) est **rond**.
- **[P]** : entrée en cascade, de gauche à droite.

#### `StatCard` (« 20 YEARS OF EXCELLENCE »)

- **Taille** : ~425×236 [E].
- **Contenu** :
  - « 20 » dans la famille carrée noire (corps ~56) ;
  - « YEARS OF EXCELLENCE » en capitales néo-grotesque ;
  - liste à puces de 3 items en bas : « Expert certified personal trainers », « State-of-the-art gym equipment », « Personalized nutrition and training plans ».
- **Fond** : `#F2F2F2`–`#F8F8F8` avec une trame grain [E].
- **[P]** : le « 20 » compte de 0 à 20 **une seule fois** à l'entrée (400 ms, ease-out), avec les chiffres en `tabular-nums`.

#### Média About

`StepFrame` de 425×244, x 954 → 1 379 : coach en haut rouge, fond de salle sombre [E].

### 3.3 Services

#### `DisplayWord` (« SERVICES. »)

- Rouge, capitale 193, de x 73 à 1 349 (1 277 sur les 1 320 du conteneur) [M]. Le point final fait partie du mot.
- **[P]** : taille calculée pour remplir le conteneur (`clamp` plus ajustement sur la largeur, ou unité `cqi`).
- **Mouvement [P]** : lettres masquées qui montent avec un léger décalage, ou balayage `clip-path` de gauche à droite, déclenché une fois.

#### Intro de section

`SectionHeader/split` avec des filets au-dessus et en dessous, puis le `RuledPanel` clair (voir 1.6).

#### `ServiceCarousel` [I fort]

- **Ce que montre le shot** : 3 cartes, dont la 1re **coupée par le bord gauche du cadre**, une carte active noire, et la suivante **coupée par le bord droit**.
- **Pourquoi c'est un carrousel** : la carte de gauche n'affiche que les éléments de la moitié droite d'une carte (description en haut à droite, numéral « 01✱ » en bas à droite). Son bord droit tombe à 416 (shot), et en retranchant 617 de largeur de carte, la description retombe à +325 du bord gauche, comme sur la carte noire (+325) [M]. Même raisonnement pour la carte de droite, qui ne montre que photo et titre (x +20, comme sur la carte noire) [M].
- **Géométrie à 1440 [M]** :
  - partie visible de la carte précédente : 0 → 326 ;
  - **emplacement de 134** contenant l'arrow tile de 92 (x 347 → 438, en haut) ;
  - **carte active de 634** (x 459 → 1 093) ;
  - gap de 21 ;
  - partie visible de la carte suivante : 1 113 → 1 440.
  - Le rang est **plein cadre** (de bord à bord), pas dans le conteneur.
- **États [P]** :
  - navigation au clic sur l'arrow tile, aux flèches du clavier quand le carrousel a le focus, et au glisser (drag) ;
  - la carte qui devient active s'inverse en noir avec un remplissage `clip-path` depuis le bas (480 ms) ; sa photo passe du N&B à la couleur ; son astérisque fait un cran de 45° ;
  - annonces `aria-live="polite"` du type « Service 2 sur N » ; `aria-roledescription="carousel"`.

#### `ServiceCard`

- **Anatomie (carte de 634×~366 à 1440)** :
  - padding de 20 ;
  - zone haute : `StepFrame` (219×123) à gauche, description `body` (~16, interligne ~21, largeur ~278) à x +334 ;
  - filet à **y +184** (`--line` ou `#171717`), inset de 20 [M] ;
  - zone basse : titre `card-title` (2 lignes, capitale 23) en bas à gauche, `NumeralMark` en bas à droite.
- **Variantes** :
  - `default` : fond `#FFFFFF`, titre `--ink`, numéral `#000`, photo en **N&B** [M] ;
  - `active` : fond `#000`, titre blanc, numéral blanc, description `#A1A1A1`, photo **couleur** [M].
- **États [P]** :
  - hover sur une carte inactive : pré-inversion partielle (filet rouge qui se dessine, photo à 40 % de saturation) ;
  - focus-visible : contour 2 px `--red` sur la carte entière ;
  - selected : `active`.

#### `CarouselArrowTile`

`IconButton/red-lg` (voir 2.2), `aria-label="Service suivant"`. Il est ancré dans l'emplacement de 134 à gauche de la carte active ; c'est une position inhabituelle, à confirmer. **[I]** : il pourrait aussi être un lien « voir le service ».

### 3.4 Programs

#### Colonne gauche

- `SectionHeader/stacked` : `StepButton/red` « View All Programs » (212×43), puis `StepFrame` de 519×531 [E].
- **[I]** : l'image correspond probablement au programme ouvert. **[P]** : fondu croisé avec révélation `clip-path` quand l'item ouvert change.

#### `ProgramAccordion` et `AccordionItem`

- **Colonne** : x ≈ 651 → 1 379 (~728) [E].
- **Item fermé** : hauteur ~177 [E]. Index rouge minuscule en haut à gauche (illisible : « 01 » à « 04 », mono ou carré), titre `h3` en dessous, icône « + » en haut à droite, filet bas `--line`.
- **Item ouvert** (le 1er, ~460 de haut [E]) :
  - index ;
  - titre ;
  - icône « − » ;
  - description `body` (2 lignes) ;
  - rangée de **`TagPill`** ;
  - **`CoachChip`** ;
  - filet.
- **États [P]** :
  - l'en-tête est un `<button>` pleine largeur, `aria-expanded`, panneau `role="region"` ;
  - hover : le titre glisse de 6 px vers la droite, l'index passe en `--red` plein ;
  - « + » → « − » : la barre verticale s'écrase (`scaleY` 0, 200 ms) ;
  - ouverture : `grid-template-rows: 0fr → 1fr` (400 ms `--ease-out`), puis contenu en cascade (description, tags, coach) ;
  - focus-visible : contour sur la ligne d'en-tête ;
  - un seul item ouvert à la fois (comportement exclusif) [I : le shot n'en montre qu'un].

#### `TagPill`

- 4 pastilles : « 14 Days », « Muscle Building », « Power », « Progressive Training ».
- Icône (illisible) + texte mono ~13–14 ; hauteur ~37 [E] ; **forme en pilule (rayon plein)** ; fond ou bord très pâle (`#F5F5F5` / `#ECECEC`) [E].
- **Non interactif** : ce sont des données. Donc **pas** de hover (polish : ne pas ajouter d'affordance à un élément non interactif).
- **Dérive** : seul élément arrondi du site, avec l'avatar rond et les points de pagination.

#### `CoachChip`

- Avatar **rond** ~47 [E], nom « Marcus Roy » (corps ~15, semi-gras, `--ink`), méta mono « 14 Days Training » en `--fg-muted`.
- **[P]** : si le nom mène au profil du coach, soulignement au survol avec `text-underline-offset` de 4.

### 3.5 Why VYRON (section sombre)

#### En-tête

`Eyebrow/dark` et `SectionHeader/split` (H2 blanc de capitale 39 à y ≈ 172 ; note `#9DA8A7` alignée en bas).

#### `IntroStatement`

- Colonne gauche de 343 de large (x 60 → 402) [M].
- « Results are built, not given. » en rouge, famille des titres en casse phrase (~22), suivi d'un body `#9EA8A8` (3 lignes, ~16). Le bloc est poussé en bas de la cellule.

#### `FeatureTable` et `FeatureColumn`

- **4 colonnes de 244** (x 402 → 1 379), **hauteur 294** [M].
- **Bordures** : boîte complète en `#202B2A` sur 1 px. Le filet haut et le filet bas s'étendent sur tout le conteneur, intro comprise [M].
- **Contenu d'une colonne** : titre en capitales de la famille carrée (« EXPERT COACHES », « PREMIUM EQUIPMENT », « REAL COMMUNITY », « 24/7 ACCESS »), capitale ~11 (~15 de corps), `#6C7776`, en haut ; description `#CBD5D4` (~16, 2 lignes) **en bas**, en `justify-content: space-between`. Padding de 20.
- **Non interactif**. **[P]** : à l'entrée, les verticales se dessinent de haut en bas (stagger de 80 ms), puis le texte apparaît.

#### `TeamGrid` et `TeamMember`

- **5 colonnes** : 229, 229, **325 (mise en avant)**, 229, 229, avec un gap de 20 [M]. Ordre 01, 02, **03 au centre**, 04, 05.
- **Membre standard** : portrait carré 229×229 à y +648 ; dessous, nom (`body` ~16, `#C7D2D1`) à gauche et index de la famille carrée (~13, `#5C6766`) à droite, sur la ligne de base à ~23 sous l'image [M].
- **Membre mis en avant** : 325×409, nom et index sous l'image [M].
- **Filet** sous la rangée de noms (y ~+999 shot), sur les 2 premières colonnes [M].
- **`RuledPanel/dark`** sous les membres 01 et 02 (478×109) [M].
- **[I]** : la colonne mise en avant ressemble à un état actif (photo plus lumineuse : V moyen 90 contre 33–77 pour les autres [M]).
- **États [P]** :
  - **hover / focus** sur un membre : sa colonne s'agrandit (`flex-grow` animé ou `grid-template-columns` en transition) pour devenir la colonne mise en avant ; l'index passe en `--red` ; les autres portraits baissent à 70 % de luminosité ;
  - au clavier : flèches gauche/droite ;
  - mobile : défilement horizontal avec `scroll-snap`.
- **Bouton** : `StepButton/red` « Meet the Team », 202×45, en bas à droite (x 1 179 → 1 379) [M].

### 3.6 Transformation (témoignages)

#### Mise en page

- `Eyebrow/light` et `SectionHeader/split`.
- Colonne gauche (jusqu'à x ≈ 384, marquée par un filet vertical) : `Asterisk` rouge `lg` (~102) en haut, à x 69 [E].
- Zone droite : `VideoFrame` et `VerticalPager`.
- Filet horizontal, puis rangée basse : `SlideCounter` à gauche, `QuoteBlock` au centre, `SliderControls` à droite.

#### `VideoFrame`

- Plaque gris très clair (`#EFEFEF`–`#F2F4F1`) de **~767×378**, x ≈ 423 [E], avec un **passe-partout d'environ 16** autour d'une image au grade film chaud.
- **En dessous** : une 2e plaque plus étroite (~668×45), centrée, qui contient une **barre noire de ~10 de haut** (`Scrubber` ou bande de vignettes ; contenu illisible) [E]. L'ensemble évoque un téléviseur ou un lecteur.
- **Pas de gradin** : c'est une construction ponctuelle.
- **États [P]** :
  - hover : un bouton lecture/pause apparaît (tuile `IconButton/red`) ;
  - clic : lecture ;
  - le scrubber est un `input[type=range]` stylé (piste noire, progression rouge) ;
  - pas de lecture automatique avec son ; `prefers-reduced-motion` : vignette fixe.

#### `VerticalPager`

- 3 points verticaux à droite du cadre (x ≈ 1 217), au pas de ~18. Actif rouge ~8, inactifs gris ~4–5 [E].
- **[P]** : de vrais boutons (`aria-label="Témoignage 2 sur 3"`, `aria-current`) avec une **cible de 24 minimum**. L'actif s'allonge en barre (8 → 20 de haut, 200 ms).

#### `SlideCounter`

- « 01 » rouge dans la famille carrée, capitale ~28 (~36 de corps) [E], x ~60.
- **[P]** : changement de chiffre par défilement vertical (style odomètre), `tabular-nums`.
- **Recommandation** : afficher « 01 / 05 » pour que le chiffre porte une information.

#### `QuoteBlock`

- x ≈ 325. Nom « Jordan Tucker » dans la famille des titres (~16, `#3E3E44`). Citation `body-lg` (~28, interligne ~39, `#6C6C6C`), 3 lignes, guillemets droits.
- **[P]** : guillemets typographiques (« … » ou “…”), fondu croisé avec décalage de 12 px entre les slides, `aria-live="polite"`.

#### `SliderControls`

Tuiles `grey` et `red` (voir 2.2), en bas à droite. « Précédent » est désactivé sur la 1re slide [I] ; « suivant » est le primaire.

### 3.7 `MarqueeBand`

- Bande `--red` pleine largeur du cadre, **~48–51 de haut** [E].
- Motif répété : « Fitness Hub » en néo-grotesque blanc (~16), puis un séparateur blanc de ~9–10 (point carré arrondi ou mini-astérisque, illisible). Pas de ~183 [E].
- La bande est posée à la jonction Transformation / Footer.
- **États [P]** :
  - défilement continu à 40–60 px/s, accéléré par la vitesse de scroll (multiplicateur plafonné à 3) ;
  - **pause** au survol et au focus ;
  - `prefers-reduced-motion` : statique ;
  - `aria-hidden` sur les répétitions, une seule occurrence lisible.
- **Craft-floor** : séparateur en SVG (astérisque `xs` [P], ce qui ramène le motif signature).

### 3.8 Footer

#### `SiteFooter`

- Photo d'un athlète en pompes teintée rouge à gauche, dégradé vers `#010101` dès ~65 % de la largeur [M].
- Haut : H2 blanc « REDEFINING FITNESS CULTURE. » (2 lignes, même style `h2`) à gauche ; `FooterNav` à droite.

#### `FooterNav`

- 2 colonnes mono blanc (~14, pas ~40) à x ≈ 1 060 (« Home », « About Us », « Programs ») et x ≈ 1 286 (« Join Now », « Contact Us ») [E].
- **États [P]** : hover avec un soulignement qui se dessine depuis la gauche (`background-size` 0 → 100 %, 1 px, `--red`), texte qui reste blanc ; focus-visible avec contour ; `aria-current` sur la page active.

#### `FooterPanel` (×3)

- **Panneaux bordés de 1 px** (ligne pâle, ~10 % de blanc), hauteur ~337 [E] :
  1. x ~65 → 325 : « Strength Training » en haut à gauche ;
  2. x 329 → 852 : **onglet rouge plein de 63 de haut** qui porte « Back To Home », plus un paragraphe `body` blanc ~70 % en bas (« Fitness is the art of self-transformation… ») ;
  3. x 852 → ~1 375 : « Explore Classes », « PUSH BEYOND LIMITS. » en bas à gauche (famille carrée, capitales, ~16), `Asterisk` rouge `lg` en bas à droite.
- **[I]** : l'onglet rouge du panneau 2 est vraisemblablement **l'état hover/actif** d'un en-tête de panneau, montré sur l'un d'eux.
- **États [P]** :
  - chaque en-tête est un lien ;
  - hover/focus : remplissage rouge de gauche à droite (`clip-path` inset, 240 ms) ;
  - « Back To Home » : remontée en haut de page, avec défilement doux si le mouvement est autorisé.

#### `FooterWordmark`

`Wordmark/xl` en bas à gauche, collé au bas du cadre. **[P]** : révélation lettre par lettre par masque quand le footer entre dans le viewport. C'est la conclusion visuelle naturelle, et un second « moment » autorisé seulement si le hero reste le principal.

#### `SocialLinks`

3 × `IconButton/dark-square` (~48, écart ~15) à droite, au niveau du haut du wordmark [E]. Libellés accessibles obligatoires.

---

## 4. Surfaces navigateur (craft-floor : « the parts you did not draw »)

Rien n'est visible dans le shot ; tout ce qui suit est **[P]** et tiré de la palette.

| Surface | Proposition |
|---|---|
| `::selection` | fond `--red`, texte `#FFF` ; dans Why, fond `--red`, texte `--night` |
| `caret-color` | `--red` |
| Anneau de focus | `outline: 2px solid var(--red); outline-offset: 3px`. Carré : pas de rayon, cohérent avec le monde. Sur les surfaces rouges : `--black`. Contraste non-texte ≥ 3:1 vérifié : rouge sur `#040F0E` = 4,75:1, rouge sur blanc = 4,09:1. |
| Barre de défilement | Fine (8 px), pouce `--ink` sur piste `--paper-2` ; `scrollbar-color` sous Firefox |
| Soulignements | `text-underline-offset: 4px`, épaisseur 1 px |
| Chiffres | `font-variant-numeric: tabular-nums` sur les compteurs, index, notes et durées |
| Médias | `aspect-ratio` posé sur chaque `StepFrame` (pas de décalage de mise en page), `alt` utile |

---

## 5. Réutilisable ou ponctuel (règle Impeccable : extraire à partir de 3 usages de même intention)

| Élément | Occurrences | Niveau | Décision |
|---|---|---|---|
| `--red`, `--ink`, `--black`, `--night`, `--paper(-2)`, `--line*`, `--fg-*` | partout | **Token** | Extraire (primitives et sémantiques) |
| Gouttière 60, conteneur 1 320, gap 20, inset du cadre 30 | partout | **Token** de mise en page | Extraire |
| Courbes et durées de mouvement | tous les états | **Token** | Extraire |
| `StepShape` | ≥ 11 | **Primitive** (utilitaire + custom properties) | Extraire : c'est le cœur du système |
| `Asterisk` | 6 (et plus) | **Primitive** (SVG, `size`, `tone`) | Extraire |
| `Hairline` / `FrameRules` | ≥ 8 | **Token et utilitaire** | Extraire |
| `RuledGrid` (`strip` / `panel`, `light` / `dark`) | 7 | **Composant** | Extraire |
| `TickRuler` | 4 | Sous-composant d'`Eyebrow` | Extraire avec Eyebrow (selon la décision du §8) |
| `Eyebrow` | 4 | **Composant** | Selon §8 |
| `SectionHeader` (`split` / `offset` / `stacked`) | 6 | **Composant** à variantes | Extraire |
| `StepButton` (`black` / `red`) | 3 | **Composant** | Extraire |
| `IconButton` (`white` / `red` / `red-lg` / `grey` / `dark-square`) | 7 | **Composant** | Extraire et unifier `dark-square` |
| `StepFrame` | 4–5 | **Composant** média | Extraire |
| `Wordmark` (`sm` / `xl`) | 2 | Composant (même intention de marque) | Extraire malgré seulement 2 usages : c'est l'identité |
| `NumeralMark` | 3 (une par carte) | Interne à `ServiceCard` | Ne pas extraire globalement |
| `ServiceCard` / `ServiceCarousel` | 1 section | Composant local | Local |
| `TagPill` | 4 par item d'accordéon | Composant local à Programs | Local |
| `CoachChip`, `AvatarStack` | 1 chacun | Ponctuel | Local, mais **unifier la forme d'avatar** |
| `RatingCard`, `StatCard` | 1 chacun | Ponctuel | Local |
| `FeatureTable` | 1 | Ponctuel | Local |
| `TeamGrid` / `TeamMember` | 5 membres | Composant local | Local |
| `VideoFrame`, `Scrubber`, `VerticalPager`, `SlideCounter`, `QuoteBlock` | 1 chacun | Ponctuels (organisme `TestimonialSlider`) | Local |
| `MarqueeBand` | 1 | Ponctuel | Local |
| `FooterPanel` | 3 | Composant local | Local |
| `DisplayWord` (ajusté à la largeur) | SERVICES., wordmark du footer | **Utilitaire** `fit-width` | Extraire l'utilitaire, pas un composant |
| Textures (grunge, trame, `RuledGrid`) | 3+ | **Assets et tokens** | Extraire en assets nommés |

---

## 6. Dérives relevées dans la référence (classement « polish »)

| Dérive | Classe polish | Où | Correction proposée |
|---|---|---|---|
| Pas du gradin variable (5/2/5 ; 13/4/11 ; 12/6/14 ; médias de 11 à 14 % de la largeur) | **missing token** | Tous les `StepShape` | 2 échelles : `--step-control` (12/4/12) et `--step-media` (12 % / 7 % / 20 %) |
| Deux encres de titre (`#171A32` bleu-nuit pour les H2, `#000` pour les numéraux et les boutons) | **missing token** | Sections claires | Assumer `--ink` et `--black` comme deux rôles distincts, ou tout passer en `--ink` (à décider) |
| Rouge mesuré `#F02B42` / `#EF2941` (même valeur à la compression près) | **missing token** | — | Un seul `--red`, plus `--red-on-text` si besoin |
| Boutons sociaux sans gradin | **one-off** | Footer | Les passer en `IconButton` avec gradin au survol |
| Cadre vidéo à passe-partout plutôt qu'un `StepFrame` | **one-off** (légitime : c'est un « lecteur ») | Transformation | À garder, mais documenter |
| Avatars carrés (About) contre avatar rond (Programs) | **conceptual mismatch** | About / Programs | Tout en carré, cohérent avec le monde |
| Tag pills et points de pagination arrondis dans un monde à angles vifs et chanfreins | **conceptual mismatch** | Programs, Transformation | Pastilles rectangulaires (rayon 0 ou 2) ; points carrés |
| Flèche coudée à bouts ronds | **conceptual mismatch** (léger) | Arrow tile, témoignage | `stroke-linecap: square` |
| Casse des eyebrows (« About Us » contre « WHY VYRON ») | **local defect** | Eyebrows | Une seule règle (capitales en mono) |
| Casse des CTA (« Learn More About Us », « Back To Home » contre « Meet the Team ») | **local defect** | Boutons, footer | Casse phrase partout (« Meet the team ») ou capitales |
| Alignement vertical de la note de `split` (centrée contre en bas) | **local defect** | Services contre Why et Transformation | Aligner en bas, sur la dernière ligne de base du H2 |
| Apostrophe droite « DON'T », guillemets droits | **local defect** | H2 de Why, citation | Typographie : ’ et « » ou “ ” |
| Blanc sur rouge à 4,09:1 pour des libellés de ~14–18 px | **local defect** (accessibilité) | Boutons rouges, carte note, marquee | Voir §8 |
| Index de la team `#5C6766` sur `#040F0E` = 3,32:1 ; titres de colonnes `#6C7776` = 4,2:1 (≈ 15 px) | **local defect** | Why | Remonter à `#7F8B8A` ou plus (≥ 4,5:1) |
| Index rouge des accordéons, minuscule (~12 px) : rouge sur blanc = 4,09:1 | **local defect** | Programs | Corps ≥ 14 et `--red-on-text`, ou passer en `--ink` |
| Cibles de 39–43 (téléphone, précédent/suivant) et points de ~5 | **local defect** | Header, témoignage | Zone cliquable ≥ 44 (ou ≥ 24 pour les points) |

---

## 7. Motifs signatures à préserver (sans eux, ce n'est plus VYRON)

Classés par poids identitaire.

1. **La silhouette à gradin `StepShape`**, avec ses encoches en haut à droite et en bas à gauche, sur les boutons, les tuiles et les photos. C'est la signature n° 1 ; c'est aussi elle qui porte toute la grammaire d'interaction proposée.
2. **L'astérisque à 8 branches d'équerre**, blanc dans le hero, rouge ailleurs, **collé aux numéraux géants** (« 01✱ »).
3. **La typographie carrée et chanfreinée à l'échelle géante** (BUILD/STRENGTH en escalier, SERVICES. ajusté à la largeur, 01/02, VYRON™ du footer) face à un H2 large en capitales au « Y » si particulier. La face doit être sourcée, pas approximée.
4. **La palette tri-ton stricte** : un seul rouge `#F02B42` ; des noirs (noir pur, bleu-nuit `#171A32`, noir vert-bleu `#040F0E`) ; le papier (`#FFF` / `#F5F5F5`). Aucune autre teinte en dehors de la photo.
5. **La texture « tableur » réglée** à 11 colonnes, en séparateurs et en panneaux, plus les **filets techniques** et les **repères de calage** du hero : le registre de la précision et de la mesure.
6. **La règle graduée (`TickRuler`)**, même motif « mesure » (à garder sous une forme ou une autre, voir §8).
7. **La direction photo** : étalonnage rouge, flou de bougé, fondus vers le noir, N&B pour les éléments inactifs et couleur pour l'actif.
8. **Le carrousel coupé net par le cadre**, avec la carte active inversée en noir.
9. **Les compositions asymétriques** : H1 en escalier, colonne d'intro de 343 face à 4 colonnes, colonne mise en avant au centre de la team.
10. **Le bandeau marquee rouge**, puis le **footer** avec wordmark géant et panneau à onglet rouge.

---

## 8. Tensions avec le craft-floor d'Impeccable

Rappel de la règle : *« A pinned brief or the committed visual world overrides anything here »*. Tu as épinglé ce monde visuel ; chaque point ci-dessous est donc **une décision à prendre**, pas un changement automatique. Exception explicite du craft-floor : l'**eyebrow**, déclarée « ban… no brief earns it back ». Les deux règles se contredisent ici : je te la soumets quand même, avec ma recommandation.

| # | Habitude refusée par le craft-floor | Où dans VYRON | Porteuse pour ce monde ? | Option fidèle | Option adaptée (ma recommandation en **gras**) |
|---|---|---|---|---|---|
| 1 | **Eyebrow / kicker au-dessus d'un titre** (interdit absolu) | About, Programs, Why, Transformation (4×) | **Moyenne**. La règle graduée est un motif (mesure) ; le **label** (« About Us ») ne dit rien que le H2 ne dise déjà. | Garder règle et label, tels quels, normalisés en capitales mono | **Garder la règle, supprimer le label, et rendre la règle fonctionnelle** : elle devient l'indicateur de progression de lecture de la section, ses graduations se remplissent au scroll. Variante : la sortir du titre pour en faire un index fixe de navigation dans la marge. |
| 2 | **Numéros de section 01 / 02 / 03** sans information | Numéraux des cartes services, index d'accordéon (01–04), index de la team (01–05), compteur du témoignage | **Forte** pour « 01✱ » et « 02✱ » (masse typographique et duo avec l'astérisque) ; **faible** pour les index d'accordéon et de team | Garder partout | **Garder là où la suite est une position** : carrousel de services et compteur du témoignage, en affichant « 01 / 05 ». **Supprimer** les index d'accordéon et de team, ou les remplacer par une donnée (durée « 14 J », niveau, spécialité). |
| 3 | **Gabarit « hero-metric »** (gros chiffre, petit libellé, stats d'appui) | Carte « 4.9/5 » + avatars, carte « 20 YEARS » | **Faible à moyenne** : la carte rouge est surtout la **masse rouge** de la section About | Garder les 2 cartes | **Garder la masse rouge, mais avec un contenu** : un extrait d'avis réel ou fictif assumé, avec auteur. Fondre « 20 ans » dans une phrase ou une mini-frise. Si tu gardes le chiffre, le relier à une source. |
| 4 | **Blocs décalés durs** (bloc à décalage sans flou) | `StepShape` partout | **Très forte** (signature n° 1). Nuance : ce n'est **pas une ombre** mais une silhouette d'une seule couleur, donc pas le « costume néo-brutaliste » visé, même si c'est la même famille. | Garder partout, à l'identique | **Garder**, mais en **silhouette** (clip-path ou pseudo-élément, jamais `box-shadow`), avec des tokens et un **sens** : le gradin s'ouvre au survol et se ferme à l'appui. Le réserver aux éléments interactifs et aux médias, ne pas l'étendre aux cartes de texte. |
| 5 | **Mono comme déguisement « tech »** | Labels d'eyebrow, note « Trusted by people… », nav du footer ; tags et méta du coach | **Moyenne** : il donne la texture « fiche technique » | Mono partout, comme la référence | **Mono uniquement pour les données** : tags, durées, index, compteurs, timecodes vidéo. Phrases et liens de nav en néo-grotesque. |
| 6 | **Cartes de même taille comme structure** | 4 colonnes de Why (titre + texte), 3 cartes About, portraits de la team (4 identiques) | Colonnes de Why : **moyenne** (aspect tableau technique) ; team : faible (la colonne mise en avant casse déjà la répétition) | Garder | **Assumer un vrai tableau de specs** : chaque colonne porte une donnée (« 12 coachs certifiés », « 24/7 », « 3 200 m² », ou du fictif assumé), sans icône. Garder la colonne mise en avant de la team et la rendre interactive (le survol déplace la mise en avant). |
| 7 | **Display maximum 6rem (96 px)** | H1 (~175 px), SERVICES. (~260 px), numéraux (~170 px), wordmark du footer (~205 px) | **Très forte** : l'échelle est l'identité | **Garder les tailles** (le brief gagne), avec `clamp()`, ajustement à la largeur et tests de débordement à chaque point de rupture | Réduire à ~6rem, ce qui trahit le monde. Je ne le recommande pas. |
| 8 | **Police système en display** | Face carrée et chanfreinée, et H2 au « Y » en U | Très forte | — | **Sourcer et auto-héberger** une face au même caractère (l'analyse typo tranchera). Jamais Impact, Arial Black ni « la plus proche installée ». |
| 9 | **Glyphes Unicode à la place d'icônes** | Astérisques, flèches du hero, + et −, points du marquee | Forte (l'astérisque est une signature) | — | **Tout en SVG dessiné** : un set, un trait, une grille. |
| 10 | **Verre et flou décoratifs** | Bandes verticales à droite du hero (si surcouche) ; flou de bougé (photographique, OK) | Faible | Reproduire en `backdrop-filter` | **Intégrer les bandes à l'image** (génération Higgsfield) ou les supprimer. Pas de `backdrop-filter` décoratif. |
| 11 | **Contraste** (§ Verify) | Blanc sur `#F02B42` = 4,09:1 (boutons rouges ~18 px, marquee ~16 px, libellés de la carte note ~14 px) ; index de la team à 3,32:1 ; titres de colonnes à 4,2:1 | — | Garder `#F02B42` et passer les libellés en ≥ 18,66 px bold ou ≥ 24 px | **Deux rouges** : `--red` `#F02B42` pour les glyphes, le display et les grandes surfaces, `--red-on-text` `#E3213A` (4,62:1) pour les surfaces qui portent du texte. Écart visuel minime. |
| 12 | **Mouvement : un moment signé, pas des effets dispersés** | — (ta demande d'animations riches) | — | Animer chaque section de la même façon (ce qui est explicitement refusé) | **Un moment** : le H1 du hero en escalier qui « se cale » sur ses filets et ses repères. **Une grammaire** : le gradin qui s'ouvre et se ferme sur tous les contrôles, les filets qui se dessinent comme transitions de section. Le reste en micro-états discrets. Courbes exponentielles, état par défaut déjà visible, reduced-motion respecté. |
| 13 | Clair ou sombre choisi par catégorie | Alternance claire / sombre | Faible conflit : c'est le brief | Garder l'alternance | Garder |

**Sans tension** : aucun texte en dégradé ; aucun `border-left` coloré au-delà de 1 px (l'onglet rouge du footer est un aplat en tête, pas une bordure) ; aucun masque géométrique imitant un contour de sujet (le `StepFrame` est un recadrage assumé, pas un détourage approximatif).

---

## 9. Questions et décisions pour toi

1. **Eyebrows** : faut-il (a) les garder telles quelles, (b) garder seulement la règle graduée devenue indicateur de progression (ma recommandation), ou (c) les supprimer ?
2. **Numéraux** : partout comme la référence, ou seulement là où ils indiquent une position (services, témoignage en « 01 / 05 ») ?
3. **Cartes About** (« 4.9/5 », « 20 YEARS ») : faut-il les garder comme métriques ou les transformer en preuve qualitative (citation, frise) ? Les chiffres seront-ils fictifs, et assumés comme tels ?
4. **Formes arrondies** (pilules, avatar rond, points) : on les passe en carré pour la cohérence, ou c'est une douceur voulue ?
5. **Rouge** : un seul `#F02B42` avec des libellés agrandis, ou deux rouges (`#E3213A` pour les surfaces à texte) ?
6. **Encre des titres** : faut-il conserver le bleu-nuit `#171A32` distinct du noir pur, ou unifier ?
7. **Services** : confirmes-tu un vrai carrousel (cartes coupées par le cadre, carte active inversée) plutôt qu'une grille statique ?
8. **Témoignage** : vraie vidéo (Higgsfield sait en générer) avec scrubber fonctionnel, ou image fixe ?
9. **Bandes verticales du hero** : à intégrer dans l'image générée ou à supprimer ?
10. **Langue du contenu** : anglais comme la référence, ou français ?
11. **Crédit et nom** : ce design vient d'un shot Dribbble d'un autre designer. Pour un portfolio, je recommande de **créditer l'auteur original** (« inspiré de … ») et éventuellement de renommer la marque fictive (« VYRON » est la sienne). Garde-t-on « VYRON » ?