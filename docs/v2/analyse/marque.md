# Analyse forensique : identité CAP FITNESS by EBC Sport

## 0. Sources et méthode

| Fichier  | Format    | Ce que c'est                                                                                                            | Fiabilité                                                   |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `1.png`  | 564×564   | Logo carré. Champ noir de 564×416 (ratio 1,36) collé dans un carré blanc : bande blanche de 72 px en haut, 76 px en bas | Bitmap basse définition, compression visible (chroma lavée) |
| `2.webp` | 1200×1311 | Maquette 3D de tenue, éclairage studio                                                                                  | Couleurs faussées par l'ombrage                             |
| `3.png`  | 894×343   | Bannière : photo N&B et logo horizontal                                                                                 | Meilleure source pour le chartreuse                         |
| `4.png`  | 365×547   | Flyer IA                                                                                                                | Texte lisible, couleurs hors marque                         |

- **Méthode couleur** : PIL/numpy. J'ai pris la médiane des pixels « de cœur de trait » (les 15 à 25 % les plus saturés), pour écarter l'anticrénelage. Conversion en OKLCH, contrastes WCAG 2.x.
- **Méthode typo** : rendus superposés au logo (PIL et Chrome headless). Le contour CSS a été testé en vrai dans Chrome.
- **Fichiers produits** (scratchpad, aucun fichier du dépôt modifié) :
  - Comparatifs : `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit/cmp-cap.png`, `.../capfit/cmp-fitness.png`, `.../capfit/cmp-fitness2.png`, `.../capfit/cmp-sig.png`
  - Spécimens : `.../capfit/specimen.png`, `.../capfit/spec2.png`
  - Zooms : `.../capfit/z-*.png`
  - Prototypes vectoriels : `.../capfit/proto-horizontal.svg`, `.../capfit/proto-carre.svg`, `.../capfit/proto-ecg.svg`, `.../capfit/proto-monogramme.svg`, et la comparaison `.../capfit/proto-compare.png`
  - Générateur : `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit-scripts/logo_build.py`
  - Fontes sans chevauchements : `.../capfit/fonts-dl/inst/mont900-clean.ttf`, `.../capfit/fonts-dl/inst/exo900-clean.ttf`, `.../capfit/fonts-dl/inst/mont500i-static.ttf`
  - skia-pathops installé dans `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/pylib`. Lancer `python3 -I` avec `sys.path.insert` vers ce dossier.

---

## 1. Couleurs

### 1.1 Mesures

| Élément                     | Source        | Hex mesuré                                                                                     | OKLCH                                 | Remarque                                     |
| --------------------------- | ------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------------- |
| Chartreuse « CAP »          | 1.png         | médiane #C6CA61, cœur #CDD35A                                                                  | 0.839 0.144 111.7                     | Lavé par la compression                      |
| Chartreuse « CAP »          | 3.png         | p75 #C9D336, p90 #CAD627, p97 **#CDD813**                                                      | 0.833 0.170 113.3 → 0.845 0.186 113.5 | Source la plus fidèle                        |
| Tracé ECG droit             | 3.png         | #BBC748                                                                                        | —                                     | Trait fin, anticrénelé                       |
| « BY EBC SPORT »            | 3.png / 1.png | #B2C647 / #9CA756                                                                              | —                                     | Petit corps, donc lavé                       |
| Lime du maillot             | 2.webp        | ombre #6B9821, médiane de l'ourlet #739F23, p97 **#9AC133**, hautes lumières #BDDC5B / #C2DF63 | 0.757 0.169 124.0                     | Plus vert que le logo                        |
| Tracé ECG du short          | 2.webp        | #9BB141 (cœur #9EB933)                                                                         | —                                     | Rendu avec une lueur                         |
| Logo imprimé sur le maillot | 2.webp        | #90A044 (cœur #ACC053)                                                                         | —                                     | Rendu 3D, désaturé                           |
| Vert du flyer               | 4.png         | **#78A014** ; panneaux des jours #7AA225                                                       | 0.652 0.160 125.8                     | Vert herbe, hors marque                      |
| Fond du logo                | 1.png         | **#1C1B19**                                                                                    | 0.222 0.004 84.6                      | Noir chaud, aplat (écart-type ≈ 0)           |
| Noirs du maillot            | 2.webp        | #0D0D0D à #181818 ; short #0C0C0C à #0E0E0E ; studio #1D1D1C                                   | —                                     |                                              |
| Photo de la bannière        | 3.png         | gris neutre pur (saturation médiane 0, p99 3)                                                  | —                                     | Luminance 24 à 72/255 (9 à 28 %), médiane 38 |
| Noir du flyer               | 4.png         | #060606                                                                                        | —                                     |                                              |
| Blanc du logo               | 1.png         | #FEFEFE                                                                                        | —                                     | Pratiquement blanc pur                       |

Constats :

- **Il y a deux verts distincts.**
  - Le _chartreuse_ est l'encre du logo : teinte OKLCH 112 à 114, jaune-vert, clarté L 0,84.
  - Le _lime_ est la couleur du textile : teinte 124 à 128, plus vert.
  - L'écart de teinte est de 11 à 14°. Il se voit si les deux sont côte à côte.
  - Le flyer dérive encore : vert herbe à 126°, plus sombre (L 0,65). Il est hors marque.
- **La valeur source du chartreuse est probablement plus saturée que les bitmaps.** Le p97 de la bannière donne #CDD813, proche d'un jaune-vert de type Pantone 381 C (#CEDC00). C'est une hypothèse à faire confirmer par le client.
- **La photo de la bannière est écrasée** sous un voile noir uniforme. Les noirs sont laiteux (plancher 24/255) et rien ne dépasse 28 % de luminance.

### 1.2 Palette de tokens proposée

| Token             | Hex         | OKLCH             | Rôle                                                                                                 |
| ----------------- | ----------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `--cf-noir`       | #0C0C0B     | 0.154 0.002 107   | Fond principal (noir du short et du haut du maillot)                                                 |
| `--cf-carbone`    | #1C1B19     | 0.222 0.004 85    | Fond exact du logo ; sections secondaires, cartes                                                    |
| `--cf-graphite`   | #2A2926     | 0.281 0.006 92    | Filets décoratifs, surfaces surélevées (non porteurs d'information)                                  |
| `--cf-filet`      | #6E6C66     | 0.531 0.010 92    | Bordures des composants interactifs (≥ 3:1)                                                          |
| `--cf-gris`       | #A3A199     | 0.708 0.012 95    | Texte secondaire                                                                                     |
| `--cf-craie`      | #F2F1EC     | 0.958 0.007 97    | Texte courant (moins dur que le blanc pur)                                                           |
| `--cf-blanc`      | #FFFFFF     | 1 0 0             | Logo, mots-étendards en plein                                                                        |
| `--cf-citron`     | **#CCD52F** | 0.839 0.175 112.8 | Accent unique : moyenne des cœurs de trait. À remplacer par la valeur source si le client la fournit |
| `--cf-citron-vif` | #D9E34A     | 0.881 0.170 113.1 | Survol et état actif du citron                                                                       |
| `--cf-lime`       | #99C336     | 0.761 0.170 124.9 | **Uniquement** en fin de dégradé « maillot »                                                         |
| `--cf-olive`      | #5F6300     | 0.480 0.107 112.5 | Accent sur fond clair, si une section claire existe                                                  |

Dégradé « maillot », remis au propre :

```css
linear-gradient(180deg in oklab, #0C0C0B 0 42%, #2A331A 60%, #72902F 85%, #99C336)
```

- Sur le maillot, le noir tient jusqu'à environ 40 à 45 % de la hauteur. La transition se fait entre 45 et 85 %.
- Points médians mesurés : t=0,25 → oklab #2A331A (sRGB #2F3A16) ; t=0,5 → #4D5F25 (sRGB #526820) ; t=0,75 → #72902F.
- L'olive boueux du milieu (#455233 sur le maillot) vient en partie de l'ombrage du rendu.

### 1.3 Contrastes WCAG

| Paire                                             | Ratio                    | Verdict                                            |
| ------------------------------------------------- | ------------------------ | -------------------------------------------------- |
| craie sur noir / sur carbone                      | 17,30 / 15,22            | AAA                                                |
| blanc sur noir                                    | 19,57                    | AAA                                                |
| gris #A3A199 sur noir / carbone / graphite        | 7,56 / 6,65 / 5,62       | AA texte normal partout, AAA sur noir              |
| **citron sur noir** / carbone / graphite          | **12,23** / 10,76 / 9,09 | AAA, y compris en petit texte                      |
| **noir sur citron** (bouton)                      | **12,23**                | AAA                                                |
| noir sur citron-vif / sur lime                    | 14,01 / 9,52             | AAA                                                |
| **blanc sur citron**                              | **1,60**                 | Interdit                                           |
| **citron sur craie**                              | **1,41**                 | Interdit ; utiliser l'olive (5,68)                 |
| filet #6E6C66 sur noir / carbone                  | 3,73 / 3,28              | OK pour les bordures d'UI (1.4.11)                 |
| carbone sur noir                                  | 1,14                     | Séparation invisible sans filet ni rupture d'image |
| graphite sur noir                                 | 1,35                     | Décoratif seulement                                |
| citron sur lime                                   | 1,29                     | Jamais l'un sur l'autre                            |
| citron sur photo (gris #393939) / blanc sur photo | 7,20 / 11,55             | OK si la photo reste ≤ 30 % de luminance           |

---

## 2. Logo

### 2.1 Anatomie mesurée

Les ratios sont exprimés en hauteurs de capitale de CAP (« cap »).

| Élément                  | Carré (1.png)                                                                                                        | Horizontal (3.png, maillot)                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| CAP                      | x 142–414, y 174–254 : 272×80 px, ratio **3,4:1**                                                                    | 195×67 px, ratio **2,9:1** (lettres jointives)                                               |
| FITNESS                  | 279×52 px : **0,65 cap**, **même largeur que CAP** (bloc justifié)                                                   | 332×64 px : **même hauteur que CAP**, ratio 5,2:1                                            |
| Écart CAP / FITNESS      | 4 px vertical (0,05 cap) : CAP repose sur FITNESS                                                                    | 7 px horizontal (0,10 cap)                                                                   |
| BY EBC SPORT             | 153×13,5 px : 0,17 cap (0,26 de FITNESS)                                                                             | 183×18 px : 0,27 cap                                                                         |
| Position de la signature | 18 px sous FITNESS (0,35 de sa capitale). Ferrée à droite, retrait de 12 px pour l'italique. Commence à 41 % du bloc | 12 px sous FITNESS (0,18 cap). Ferrée à droite (+3 px de débord). Commence à 46 % de FITNESS |
| Encombrement total       | 534×219 px (2,44:1). Centré, marges de 2,7 % seulement (trop serré)                                                  | 748×141 px : **11,2 × 2,1 cap (≈ 5,3:1)**. Centré, 84 % de la largeur                        |

**CAP**

- Police : **Montserrat Black (900)**, rendue **en contour seul**. Confirmé par superposition (cmp-cap.png) :
  - C aux terminaisons obliques ;
  - A à sommet plat (0,33 cap) et barre basse ;
  - P à grande panse.
- Le contour mesure 4 à 5 px pour 80 px, soit **≈ 5,5 à 6 % de la capitale**. Il est centré sur le contour du glyphe.
- L'intérieur est **transparent** : sur la bannière, la photo se voit dans les lettres.
- Approche : 3 à 4 px entre lettres sur le carré ; lettres jointives sur l'horizontal, où les contours se touchent.

**FITNESS**

- Police : grotesque techno très grasse, en plein blanc. Pas d'équivalent libre exact ; c'est probablement une police commerciale ou Canva. La plus proche est **Exo 2 Black** (S carré, E, N). Russo One est plus arrondie.
- Dessin :
  - fûts de 0,21 à 0,23 de sa capitale, barres d'environ 0,20 ;
  - certains angles extérieurs arrondis (r ≈ 0,12 : haut gauche du F, angles du S) ;
  - S en rectangle arrondi ;
  - chasse serrée : 2 px entre lettres, ≈ 0,04 de sa capitale.
- **Coupes**, deux mécaniques différentes :
  - _Carré_ : de fines lamelles (≈ 4 % de la hauteur) sont décalées vers l'extérieur d'environ 12 %. Sur le F, vers la gauche (lignes 259–260 et 268–269). Sur le dernier S, vers la droite (lignes 300–301 et 309–310). C'est un « glitch vitesse ».
  - _Bannière_ : des entailles en biseau effilé à ≈ 22 % et ≈ 75 % de la hauteur. Le I, coupé bas, se lit « ! ».

**BY EBC SPORT**

- **Montserrat Medium Italic (500)**, en capitales, citron. Correspondance identique (cmp-sig.png).
- Interlettrage légèrement positif (≈ +0,02 em).

**Tracé ECG** : un complexe PQRST stylisé, identique sur les deux côtés. Il est **translaté, pas en miroir**.

| Point             | x (fraction de l'empan) | y (fraction de l'amplitude R, haut positif) |
| ----------------- | ----------------------- | ------------------------------------------- |
| Départ de montée  | 0                       | 0                                           |
| P                 | 0,115                   | +0,435                                      |
| Q                 | 0,30                    | −0,375                                      |
| **R**             | 0,54                    | **+1,00**                                   |
| **S**             | 0,59                    | **−0,92** (R→S quasi vertical)              |
| T                 | 0,85                    | +0,295                                      |
| Retour à la ligne | 1,00                    | 0                                           |

- Les valeurs sont la moyenne de 4 relevés concordants : gauche et droite, carré et bannière.
- Amplitude R ≈ **1,06 à 1,12 cap**. Empan ≈ **0,9 × l'amplitude**, donc un dessin haut et pointu.
- Ligne d'amorce extérieure : 0,45 à 0,55 × l'empan. Côté intérieur, le tracé se branche directement sur les lettres (pied du C ; départ depuis le pied du dernier S).
- Chemin canonique (amplitude 100, ligne de base y=0, y vers le bas) :

```svg
<path d="M-45 0H0L10.4-44L27 37.5L48.6-100L53.1 92L76.5-29.5L90 0H135"/>
```

- Ligne de base :
  - **Horizontal** : la ligne médiane passe à 0,9 cap du haut. Le bas du tracé **affleure la ligne de base des lettres** : le tracé porte les mots.
  - **Carré** : le tracé gauche court au pied de CAP (haut de FITNESS), le droit au pied de FITNESS. La lecture descend donc en diagonale, du haut gauche vers le bas droit.
- Deux styles de trait :
  - _plein_ : ≈ 0,08 cap, extrémité effilée en pointe (bannière à gauche, short) ;
  - _contour (tube)_ : largeur ≈ 0,15 cap, filet 0,025 à 0,04 cap, extrémité coupée en biseau d'environ 40 à 50° (carré des deux côtés ; bannière et maillot à droite).
- **Logique de chiasme** (horizontal) :
  - à gauche, le tracé est **blanc plein**, à côté de CAP en **contour citron** ;
  - à droite, il est **citron en contour**, à côté de FITNESS en **blanc plein** ;
  - chaque tracé prend donc le style du mot opposé, ce qui croise et équilibre l'ensemble ;
  - sur le carré, les deux tracés sont blancs en contour.

### 2.2 Reconstruction SVG (vérifiée par prototype)

1. **CAP**
   - Extraire les glyphes C, A, P de Montserrat 900 (OFL ; la vectorisation dans un logo est autorisée) avec fontTools `SVGPathPen`.
   - **Supprimer d'abord les chevauchements** (`fontTools.ttLib.removeOverlaps` avec skia-pathops). Constaté : la Montserrat variable _et_ les statiques @fontsource ont des contours superposés (A = chevron + barre ; P = fût + panse). Un contour tracé dessus montre des lignes parasites.
   - Puis `fill="none" stroke="#CCD52F" stroke-width="0.06·cap" stroke-linejoin="miter"`.
   - Pour une version finale qui garde ses proportions partout : vectoriser le trait en contour.
2. **FITNESS**
   - Soit le redessiner sur une grille de 100 (fûts 22, barres 20, rayons 12 sur les angles d'attaque).
   - Soit partir d'Exo 2 Black sans chevauchements, condensé à ≈ 0,97 en horizontal, approche −0,04 em.
   - Appliquer les coupes par **différence booléenne** (pathops) plutôt que par masque : deux fentes effilées à 22 % et 75 %, lamelles décalées de ±12 % sur le F et le dernier S.
   - Dans le prototype, l'horizontal avec sx 0,9 sort trop étroit ; viser un ratio de 5,2:1.
3. **Signature** : glyphes de Montserrat 500 italique (statique), en citron, calés à droite.
4. **ECG**
   - Polyligne du chemin canonique.
   - **Piège vérifié** : avec `stroke-linejoin="miter"`, l'angle R→S (≈ 3°) produit une pointe démesurée (le miter vaut environ w / sin(θ/2)). Soit plafonner `stroke-miterlimit` vers 4 à 6 et accepter des pointes biseautées, soit construire le tracé plein comme **polygone rempli** à pointes effilées.
   - Version tube sur photo : un **masque** (trait blanc de largeur W, puis trait noir de largeur W − 2t) donne un tube réellement transparent.
   - Animation de dessin progressif : version trait avec `pathLength="1"` et `stroke-dasharray`.
5. **Accessibilité** : `role="img"`, `aria-label="CAP Fitness by EBC Sport"`, un seul `<title>`.

Le prototype `proto-compare.png` montre la reconstruction à côté des originaux : proportions et tracé concordent.

### 2.3 Déclinaisons

| Version                  | Composition                                                                | Usage                                                                                     | Taille mini                                                                                    |
| ------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Horizontale complète** | ECG blanc plein, CAP contour, FITNESS plein, ECG citron contour, signature | Hero, pied de page, partage social                                                        | ≥ 400 px de large (signature ≥ 10 px)                                                          |
| **Horizontale réduite**  | CAP et FITNESS seuls (8,2 cap de large)                                    | En-tête, menu mobile                                                                      | ≥ 180 à 200 px (contour ≥ 1,2 px) ; en dessous, CAP en plein citron (à valider avec le client) |
| **Carrée / empilée**     | CAP au-dessus de FITNESS justifiés, ECG blancs en contour, signature       | Avatar, carte, OG image                                                                   | Signature dès 300 px de côté                                                                   |
| **Monogramme « CAP »**   | CAP en contour citron                                                      | Tampon, filigrane XXL, page 404                                                           | ≥ 64 px de haut                                                                                |
| **Tracé ECG seul**       | Le complexe canonique, plein ou tube                                       | Motif, séparateur, indicateur de temps, favicon (trait épaissi à environ 10 % de l'icône) | Favicon 32 px en plein                                                                         |

Zone de protection : la hauteur de capitale de FITNESS, tout autour.

---

## 3. Typographie

### 3.1 Polices du logo (identifiées)

- **CAP** = Montserrat Black, en contour.
- **BY EBC SPORT** = Montserrat Medium Italic.
- **FITNESS** = police non libre ; Exo 2 Black est la plus proche.

Montserrat et Exo 2 servent **seulement de sources pour vectoriser le logo**. Les charger sur le site produirait un rendu de modèle Canva : Montserrat est générique, et Exo 2 tire vers le gaming et vers Tektur, la police de la V1.

### 3.2 Recommandations

Tous les paquets ont été vérifiés avec `npm view`. Poids : fichier woff2 du sous-ensemble latin.

| #   | Police                                             | Paquet                                                                                                                             | Axes                                        | Poids latin                                                   | Rôle                                                                                                                                                                             | Pourquoi                                                                                                                                                                                                                                                 |
| --- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Anybody** (choix principal)                      | `@fontsource-variable/anybody` 5.3.0, CSS `wdth.css` / `wdth-italic.css`                                                           | wdth 50–150, wght 100–900, italique, `tnum` | wdth normal 56 888 o ; italique 62 084 o ; wght seul 24 048 o | Display : 140–150 / 900 **en contour** pour les mots-étendards (l'esprit de CAP) ; 60–75 / 800–900 en plein pour les titres compacts, horaires et chiffres (l'esprit de FITNESS) | Un seul fichier couvre la dualité plein / contour du logo. Caractère athlétique sans être techno (≠ V1). **Contour CSS propre, testé** (`-webkit-text-stroke` sans lignes parasites). Ses C ont des terminaisons horizontales, mais le logo reste en SVG |
| 2   | **Figtree** (texte et signature)                   | `@fontsource-variable/figtree` 5.3.0                                                                                               | wght 300–900, italique, `tnum`              | 20 156 o ; italique 20 928 o                                  | Texte courant 16 à 18 px. **Italique 500 citron** pour la voix « signature »                                                                                                     | Géométrique, cousine de Montserrat. Son italique 500 est très proche de « BY EBC SPORT » (spec2.png). Très léger                                                                                                                                         |
| 3   | **Archivo** (display alternatif)                   | `@fontsource-variable/archivo` 5.3.0                                                                                               | wght 100–900, wdth 62–125, italique, `tnum` | wdth 90 104 o ; italique 101 676 o ; wght seul 34 928 o       | Remplace Anybody si on la juge trop rétro                                                                                                                                        | Grotesque de pages sportives, plus neutre. Contour CSS propre (testé). Plus lourde                                                                                                                                                                       |
| 4   | **Onest** (texte alternatif)                       | `@fontsource-variable/onest` 5.3.1                                                                                                 | wght 100–900, `tnum`, `calt`                | 33 760 o                                                      | Texte, si Figtree semble trop rond                                                                                                                                               | Plus neutre et contemporaine. Pas d'italique : la signature passerait alors en Anybody italique                                                                                                                                                          |
| 5   | **Montserrat** et **Exo 2** (outils, non chargées) | `@fontsource/montserrat` 5.3.0 (statiques 900 : 18 020 o ; 500 italique : 19 316 o), `@fontsource-variable/exo-2` 5.3.0 (40 896 o) | —                                           | —                                                             | Vectorisation du logo uniquement                                                                                                                                                 | Ce sont les sources réelles ou les plus proches du logo                                                                                                                                                                                                  |

**Écartées**

- Mona Sans et Hubot Sans (98 Ko et 93 Ko) et Unbounded : **le contour CSS montre les chevauchements**, constaté sur la barre du A et le fût du P. Unbounded est en plus un cliché web3.
- Saira (V2 rejetée), Tektur et Inter (V1), Russo One (gaming), Big Shoulders (hors sujet).

**Budget de chargement**

- Anybody wdth (55,6 Kio) + Figtree (19,7 Kio) en preload. Figtree italique (20,4 Kio) chargée sans preload. Total ≈ 96 Kio de polices ; cela ne compte pas dans le budget JS.
- Garder le motif de fontes de repli métriques du dépôt (« X Fallback »).

**Contour en CSS**

- Réservé aux mots ≥ 64 px, avec un trait de 2 à 3 px (≈ 5 à 6 % du corps). C'est le même ratio que CAP.
- Le texte accessible reste le texte réel.

---

## 4. Maillot et bannière : le système visuel

**Ce qu'ils disent**

- **Deux encres sur du noir** : blanc et citron. Tout le reste est neutre.
- **Plein contre contour, en chiasme** : la règle de composition de la marque.
- **La couleur monte du sol** : le maillot reste noir sur plus de 40 % de sa hauteur, puis « s'allume » vers l'ourlet.
- **La photo est un décor neutre** : N&B pur, salle de biking avec une rangée de vélos en perspective et un contre-jour de fenêtres. Le graphisme porte toute la couleur.
- **Placement en périphérie** : logo à gauche sur la poitrine, ECG sur le bas de la jambe du short, barres réfléchissantes « ▬ ▪ ▪ » aux épaules (en miroir). Les marques sont petites et décentrées, posées aux bords.
- **L'ECG sert d'ornement de rythme**, jamais d'icône.

**Réutilisable de façon premium**

- **« Le noir qui s'allume par le bas »** : le dégradé interpolé en oklab, qui démarre tard, utilisé comme _lumière_ (bas du hero, bloc d'inscription, remplissage d'une progression) et une seule fois par page.
- **L'ECG comme instrument du temps** : le planning de la semaine tracé comme une bande d'électrocardiogramme. Une pointe R à chaque cours réel, sur un axe horaire par jour. C'est un usage du tracé qui porte de vraies données et un bon candidat pour le moment signature. Il ne faut **pas** inventer d'intensité par cours.
- **Le chiasme plein / contour** dans les grands titres : un mot en contour citron, son voisin en plein blanc. Il remplace les surtitres.
- **La voix signature en italique citron**, en casse normale (« ensemble, allons plus loin »). Elle remplace les capitales espacées au-dessus des titres.
- **Une photographie N&B vraiment low-key** : noirs profonds (≤ 5 %), hautes lumières tenues jusqu'à 85–90 %, éclairage de contour, grain fin. On garde l'impression de profondeur que la bannière a perdue.
- **Des marques petites et décentrées aux bords** des sections (comme l'ECG sur la jambe), plutôt que centrées.
- (Option mineure) Le rythme « ▬ ▪ ▪ » des épaules comme micro-repère de pagination ou de progression.

**Cheap, à éviter**

- Le dégradé noir → vert fluo en fond de section entière : effet maillot de foot ou esport.
- Lueur, néon ou flou sur l'ECG (le short en a une).
- Un voile noir uniforme sur la photo (bannière : 9 à 28 % de luminance, noirs laiteux, image plate).
- Le logo centré sur une photo sombre, façon couverture Facebook.
- Les deux verts en aplats voisins (13° d'écart de teinte).
- Les barres réfléchissantes décoratives, et le sponsor tiers « ALVAR RYLOR » (exclu).
- L'ECG utilisé partout : le « battement de cœur » est un cliché santé et fitness. On n'utilise que le tracé exact de la marque, rarement.

---

## 5. Le flyer

**Contenu à garder** (données réelles de la salle). Les afficher avec la mention « d'après le flyer de rentrée, à confirmer » :

- **Planning des cours collectifs**

| Jour     | Horaire | Cours                        |
| -------- | ------- | ---------------------------- |
| Lundi    | 13h00   | Pound                        |
| Lundi    | 18h15   | Cardio Jump                  |
| Lundi    | 19h00   | Cardio Jump                  |
| Mardi    | 17h15   | Step                         |
| Mercredi | 12h15   | Cross Training               |
| Mercredi | 18h00   | CAF (Cuisses Abdos Fessiers) |
| Mercredi | 19h00   | Cross Training               |
| Vendredi | 19h00   | Cross Training               |

- Jeudi, samedi et dimanche : rien n'est indiqué.
- **Pilates** (« Renforce, tonifie et améliore ta posture »), **Yoga** (« Respire, relâche les tensions et retrouve ton équilibre »), **Stretching** (« Gagne en souplesse, récupère et préviens les blessures ») : aucun horaire.
- La mention « Tous les cours sont à la rentrée ! » apparaît deux fois et reste ambiguë. Afficher « à la rentrée, horaires à venir » et faire confirmer.
- **Réservation** : « Réserve ta place dès maintenant ! Sur l'application CAP FITNESS ou à l'accueil. » Ne pas inventer de lien vers un store.
- **Valeurs** :
  - Tous niveaux : « Débutant ou confirmé, tu es le bienvenu ! »
  - Coachs diplômés : « Pour t'accompagner et te motiver ! »
  - Ambiance motivante : « On se dépasse ensemble dans la bonne humeur ! »
  - Sport santé & bien-être : « Ton corps et ton mental nous tiennent à cœur ! »
- **Slogans** : « Bouge ! Dépasse-toi, prends du plaisir, atteins tes objectifs ! », « Plus qu'une salle, une famille ! », « Ensemble, allons plus loin ! ». Le tutoiement est déjà celui de la marque.
- La bannière montre une **salle de biking**, mais ce n'est pas un cours du planning. À traiter comme un espace, sans horaire.
- **Inconnu, donc placeholder étiqueté** : adresse, téléphone, horaires d'ouverture, tarifs, noms des coachs, nom et liens de l'application.

**À éviter absolument**

- Les bandeaux et bulles au pinceau vert (« Bouge ! », rubans).
- Le tableau en cases blanches avec des pavés verts pour les jours.
- Les icônes clipart : calendrier, baguettes, trampoline, step, kettlebell, silhouette, lotus, yogi, médaille, smiley, cœur-ECG.
- Les cœurs, la flèche manuscrite, la maquette de téléphone.
- Les capitales condensées grunge partout, et les points d'exclamation à chaque ligne.
- Le pied de page en bandeau plein avec des cœurs, et la composition entièrement centrée et empilée.
- Le **vert herbe #78A014**, hors marque.
- La **variante de logo redessinée** du flyer (CAP en plein blanc, FITNESS en vert, « by EBC Sport » en script entre deux filets) : elle n'est pas canonique.

---

## Règles de marque

1. **Logo uniquement en SVG reconstruit**, jamais la bitmap. Toujours sur noir, carbone ou photo N&B à ≤ 30 % de luminance. Jamais sur citron ni sur fond clair.
2. **Un seul accent : le citron #CCD52F.** Le lime #99C336 n'existe qu'en fin de dégradé « maillot ». Jamais les deux en aplats voisins. Le vert du flyer est banni.
3. **Le citron est une lumière, pas une peinture** : traits, contours, ECG, CTA, focus. Environ 10 % de la surface au maximum, et un seul aplat citron plein cadre par page.
4. **Sur citron, le texte est noir** (12,2:1). Jamais de blanc sur citron (1,6:1). Jamais de citron en texte sur fond clair (1,4:1) : utiliser l'olive #5F6300 (5,7:1).
5. **Plein et contour en chiasme** : un mot en contour citron (≥ 64 px, trait ≈ 6 % du corps), le mot voisin en plein blanc. Jamais deux contours côte à côte. Contour CSS seulement avec une police sans chevauchements (Anybody ou Archivo).
6. **Un seul tracé ECG, canonique**
   - Valeurs : P +0,435, Q −0,375, R +1, S −0,92, T +0,295 ; empan égal à 0,9 × l'amplitude.
   - Ne jamais le redessiner ni le remplacer par une icône.
   - Il repose sur la ligne de base du texte qu'il accompagne.
   - Une occurrence par écran au maximum.
7. **Pas de lueur, de néon, de flou ni d'ombre portée** sur le tracé ou le logo. Le tracé plein a des pointes effilées ; le tube a des bouts en biseau.
8. **Photos en N&B vrai** (saturation 0), low-key, avec de vrais noirs et des hautes lumières tenues. Pas de voile noir uniforme. La couleur ne vient que du graphisme.
9. **Typographie**
   - Anybody : large pour les mots-étendards, étroite pour les horaires et chiffres (avec `tnum`).
   - Figtree : texte courant, et italique 500 citron pour la voix signature.
   - Montserrat et Exo 2 ne servent qu'à vectoriser le logo.
10. **Voix signature à la place des surtitres** : une petite italique citron en casse normale. Aucune capitale espacée au-dessus des titres.
11. **Dégradé « maillot »** : vertical, noir jusqu'à au moins 40 %, interpolé en oklab. Un seul moment par page. Jamais en fond de section entière.
12. **Marques petites et décentrées** (logique du maillot) : ECG et repères posés aux bords, pas au centre. Pas de hero centré avec deux boutons.
13. **Séparer noir et carbone par un filet ou une rupture d'image** (contraste de 1,14 seulement). Bordures des composants interactifs ≥ #6E6C66 (3,7:1). Focus : anneau citron de 2 px décalé de 2 px.
14. **Logo : protection et tailles mini**

- Zone de protection : la hauteur de capitale de FITNESS.
- Horizontal complet : ≥ 400 px. Version réduite (CAP et FITNESS) : ≥ 180 px.
- Favicon : le complexe ECG seul, en plein.

15. **Données**

- Uniquement le contenu du flyer, avec sa source et la mention « à confirmer ».
- Tout le reste en placeholder étiqueté.
- Pas de sponsor tiers, pas de cœurs, pas de pinceaux, pas d'icônes clipart.
- Maquette non officielle, en `noindex`.
