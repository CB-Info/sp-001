> **Annexe brute** : rapport de l’agent `a6-motion`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).


# VYRON — Analyse motion design (lentille a6-motion)

> Références Impeccable lues et appliquées : `animate.md`, `delight.md`, `overdrive.md`, `mode-persuade.md`, `craft-floor.md` (lignes Motion, States, Refuse).
> Mode visiteur : **Persuade** (landing page) + pièce de portfolio jugée sur le craft. Règle « the brief wins » : la référence fixe le monde visuel ; chaque friction avec le craft-floor est listée en §10 comme **décision pour l'utilisateur**, jamais appliquée d'office.
> Statut des valeurs : **[MESURÉ]** = obtenu par échantillonnage de pixels (PIL/numpy), **[ESTIMÉ]** = mesure possible mais peu précise (basse résolution, bruit photo), **[INFÉRÉ]** = déduction de design, pas une mesure.
> Aucun code du site n'a été écrit. Les noms de propriétés et d'API qui suivent sont des spécifications, pas une implémentation.

---

## 0. Méthode, échelle et fiabilité

| Source | Constat | Facteur vers une maquette 1440 px | Précision |
|---|---|---|---|
| `2.png`, `3.png`, `4.png` (1600×1200) | Cadre du site de x = 100 à 1499, soit **1400 px** [MESURÉ]. Les pixels sont dupliqués par paires : ce sont des agrandissements 2× (plus proche voisin) d'une capture Dribbble en **800×600** [MESURÉ] | **×1,0286** | ±2 px dans la capture, soit ±2 px à 1440 |
| `1.png` (407×2000) | Cadre de x ≈ 20,5 à 386,5, soit **≈ 366 px** [MESURÉ] | **×3,93** | ±1 px dans la capture, soit **±4 px à 1440** |
| `sections/*.png` | Agrandissements Lanczos 4× de `1.png` | lecture visuelle seulement | les petits textes sont illisibles (voir ci-dessous) |

**Illisible, donc non inventé :** le nombre exact d'avis dans la carte « 4.9/5 » (« …80+ verified reviews »), les icônes des 4 pastilles de programme, le glyphe séparateur du marquee (≈ 4 px dans `1.png`, environ 15 px à 1440 ; probablement l'astérisque [INFÉRÉ]), les petits textes du footer, la nature de la barre sombre sous l'image du témoignage.

---

## 1. Ce que la référence dit déjà du mouvement

### 1.1 Inventaire des motifs, avec leurs mesures utiles au motion

| Motif / élément | Mesure dans la capture | ≈ à 1440 px | Statut | Rôle motion |
|---|---|---|---|---|
| Hauteur du hero | 1072 px (`2.png`), recoupé par 281 px (`1.png`) | **≈ 1103 px** | MESURÉ | plus haut qu'un écran de 900 px (voir §10, T6) |
| Filets horizontaux du hero | y = +720 et +1018 depuis le haut du cadre | **741 / 1047** | MESURÉ | les « rails » qui encadrent BUILD/STRENGTH |
| Filets verticaux du hero | x = +29 et +1370 | **30 / 1409** | MESURÉ | cadre intérieur, en retrait de 30 px |
| Réticules « + » (4) | centres x = +68 / +490 / +910 / +1330, y = +638 ; ≈ 22 px de large (bras ≈ 7 px, vide central ≈ 6 px) | x **70 / 504 / 936 / 1368** (pas ≈ 432), y **656**, ≈ 23 px | MESURÉ (±3) | points d'origine du tracé des filets |
| « BUILD » | hauteur de capitale 123 px, largeur 482 px | **126 / 496** | MESURÉ | masque de ligne |
| « STRENGTH » | capitale 122, largeur 829, retrait de 209 px depuis BUILD | **125 / 853 / 215** | MESURÉ | masque de ligne |
| Interligne BUILD → STRENGTH | 20 px d'écart (142 px de capitale à capitale) | **21 / 146** | MESURÉ | les deux lignes sont presque collées : un seul bloc |
| Astérisque du hero | 69×70 px, **8 branches** (4 barres), extrémités carrées | **71×72** | MESURÉ | symétrie de rotation de **45°** → « cliquet » |
| Liste de slogans (4 lignes) | 5 filets, pas de 57 px, longueur ≈ 494 px | pas **≈ 59**, longueur ≈ 508 | MESURÉ (longueur ESTIMÉE) | liste réelle, donc décalage (stagger) légitime |
| Chevrons « → → → » | rouges ; le 1er est plus sombre (196,25,49) que les 2 autres (231,54,75) | — | MESURÉ ; lecture INFÉRÉE | gradient de séquence, suggère une « poursuite » |
| Bouton téléphone (bloc décalé) | 38×38 px, décalage ≈ 4–5 px | **39×39**, step-xs **≈ 5** | MESURÉ | bloc décalé, taille XS |
| Tuile flèche ↪ | 89×89 px ; face 75×76 ; décalage x 12–14, haut 6, bas 13 | **91×91**, step-s **≈ 12–13** | MESURÉ | bloc décalé, taille S |
| Bouton « Meet the Team » | 195×44 px ; décalage x 12–13, haut 4, bas ≈ 10 | **200×45** | MESURÉ | même step S que la tuile |
| Images à encoche (services) | 213×120 px ; décalage x 26–27, haut 9, bas 26 | **219×123**, step-l **≈ 27** | MESURÉ | bloc décalé appliqué à une image |
| Image à encoche (programmes) | ≈ 132×135 px dans `1.png`, décalage ≈ 18 px | **≈ 519×530**, step-xl **≈ 70 (±8)** | ESTIMÉ | grand bloc décalé |
| « SERVICES. » | 1240×186 px | **1275×191** (capitale) | MESURÉ | mot géant, révélation au scroll |
| Grille réglée (services) | 11 colonnes au pas de 116,6 ; lignes au pas ≈ 6,5 ; hauteur 107 | **120 / ≈ 6,7 / 110** | MESURÉ (pas des lignes ESTIMÉ) | texture « de mesure » |
| Bande « couture » en haut des sections claires | 11 colonnes au pas ≈ 127, hauteur ≈ 50 | **≈ 131 / ≈ 52** | MESURÉ | texture récurrente (reste statique, voir §4) |
| Graduations du kicker (« WHY VYRON ») | 13 traits, pas ≈ 5,8, hauteur ≈ 14 ; traits majeurs et mineurs | **≈ 6 / ≈ 14** | MESURÉ (±1) | un « compteur de répétitions » |
| Piliers (Why) | 4 cellules, pas de 237, hauteur 286 | **244 × 294** | MESURÉ | filets à dessiner |
| Bande de l'équipe | 4 portraits de 223×223 + 1 actif de 317×≈398, écart de 19,5 | **229 / 326×≈409 / 20** | MESURÉ | état « déployé » figé (voir 1.2) |
| Piste des services | cartes de **617** px, gouttière 20 ; le groupe tuile + carte active est centré (799,5 contre 800) | carte **≈ 635**, gouttière **≈ 21** | MESURÉ, donc carrousel INFÉRÉ | voir 1.2 |
| Bandeau marquee | hauteur ≈ 12–13 px ; un item tous les 46,6 px | **≈ 49** ; **≈ 183** par item, soit ≈ 7,9 items sur 1440 | MESURÉ (±4) | couplage à la vitesse de scroll |
| Wordmark « VYRON™ » du footer | capitale ≈ 40 px (`1.png`) | **≈ 159** | ESTIMÉ | « serre-livre » de fin de page |
| Section Why (sombre) / footer / page | 311 / 216 / 1954 px (`1.png`) | **≈ 1222 / ≈ 849 / ≈ 7680** (≈ 8,5 écrans de 900) | MESURÉ | page longue : budget de scroll |
| Couleurs | rouge ≈ rgb(240,43,66) **#F02B42** ; fond sombre rgb(4,15,14) **#040F0E** ; filets sombres ≈ rgb(25–32,36–43,35–42) ; fond clair #F5F5F5 ; cartes #FFF ; carte active #000 | — | MESURÉ | couleurs de départ et d'arrivée des transitions d'état |

### 1.2 États interactifs « figés » dans la maquette (lecture clé)

La maquette est statique, mais elle montre déjà **cinq états actifs**. Le motion à construire, c'est d'abord la **transition entre ces états** :

| Où | État figé visible | Preuve | Statut |
|---|---|---|---|
| Services | La carte 02 est **inversée** (noir) au centre ; les cartes 01 et 03 débordent à moitié hors du cadre ; la tuile ↪ est collée à gauche de la carte active | Les cartes visibles mesurent 317 et 318 px, soit ≈ 51 % des 617 px d'une carte complète. La description de la carte 01 tombe à 326 px de son bord gauche théorique, contre 325 pour la carte 02. Le groupe tuile + carte est centré à 0,5 px près. | MESURÉ, donc **carrousel horizontal INFÉRÉ** |
| Programmes | Item 01 **ouvert** (icône −), items 02–04 fermés (icône +) | icônes, contenu déplié | MESURÉ (visuel) |
| Équipe | « 03 Marcus Roy » **déployé** (≈ 1,42× plus large, ≈ 1,79× plus haut, photo d'action au lieu d'un portrait) | 317×398 contre 223×223 | MESURÉ ; déploiement au survol INFÉRÉ |
| Témoignage | « 01 » ; flèche précédente grise et flèche suivante rouge ; 3 points verticaux, celui du milieu rouge ; barre sombre sous l'image | visuel | Bouton précédent désactivé au premier item [INFÉRÉ] ; barre = carte suivante empilée **ou** barre de lecture vidéo [INFÉRÉ, 2 lectures] |
| Footer | « Back To Home » a une barre d'en-tête **rouge**, ses voisines non | visuel | état survolé/actif d'une cellule de lien [INFÉRÉ] |

### 1.3 Lecture motion fondatrice : le bloc décalé est une image rémanente

Tous les « blocs en escalier » mesurés (téléphone, tuile, boutons, images) ont la même construction : **l'union de deux rectangles de même couleur**. Le rectangle avant est en haut à gauche, le rectangle arrière est décalé en bas à droite d'un pas proportionnel à l'objet (XS ≈ 5, S ≈ 12, L ≈ 27, XL ≈ 70 px). Une image d'encoche est **une seule photo** découpée par ce polygone à 8 sommets : la photo est continue à travers les deux rectangles [MESURÉ visuellement].

C'est littéralement **un objet et sa trace décalée**, la version figée et graphique de la **photo rouge à flou de mouvement** du hero et du footer. Toute la grammaire ci-dessous en découle :

- **le pas (step) est à la fois un token de géométrie et un token de distance de mouvement** : un bloc ne se déplace jamais d'une valeur arbitraire, il se déplace de son propre pas ;
- **vitesse puis arrêt** : ce qui arrive vite laisse une trace, et la trace se résorbe dans le cadre ;
- **un vecteur unique, de gauche à droite** : la photo du hero fuse horizontalement, l'athlète regarde et frappe vers la droite, les chevrons pointent à droite. Les entrées horizontales suivent ce sens.

---

## 2. Thèse de mouvement

### 2.1 Trois candidats pour le moment focal

| | **A. « Vitesse → Arrêt » (image rémanente)** ✅ recommandé | B. « Calibrage / verrouillage » | C. « Chargement de la barre » |
|---|---|---|---|
| Idée | Au chargement, le hero est en pleine vitesse : stries horizontales rouges, typo qui arrive avec 2 échos. Tout freine et se fige net. Les échos se résorbent, et l'encoche des blocs devient la « trace » laissée par cette vitesse. | La page naît comme une mire : les filets se tracent depuis les 4 réticules, les réticules « verrouillent » (rotation de 45° à 0°), puis la photo et la typo se calent dans la grille. | Les lettres géantes (« SERVICES. » ou « VYRON™ ») tombent sur leur ligne de base une à une, comme des disques chargés sur une barre, au rythme du scroll. |
| Motifs mobilisés | photo à flou de mouvement, bloc décalé, typo carrée géante, vecteur gauche → droite | filets, réticules, grilles réglées, graduations | typo géante, astérisque |
| Pour | Réunit les **3 motifs dominants** en un seul geste. Spécifique : un concurrent ne peut pas le reprendre sans reprendre aussi l'encoche et la photo. Peu coûteux (opacité, transform, découpe). Le chargement de l'image **est** l'animation (rien de simulé). | Exprime « precisely, consistently » (texte de la section Why). Très léger (SVG/CSS). | Spectaculaire, très « portfolio ». |
| Contre | Demande un 2ᵉ rendu de l'image (strié) et un réglage fin du timing. | Lecture « HUD / jeu vidéo » ; éloigne de l'émotion de la photo ; ressemble à un préchargeur. | Arrive en milieu ou fin de page (le mode Persuade se joue à l'ouverture). Le décalage lettre par lettre sur une typo géante est un cliché d'Awwwards. |
| Verdict | **Focal** | Absorbé dans A comme **phase 3** (les filets se tracent depuis les réticules) | Réduit à un **serre-livre discret** dans le footer (même geste que A, inversé), pas un second moment focal |

**Justification :** `animate.md` demande que le moment focal vienne « de ce produit et de ce concept de surface », et `overdrive.md` interdit d'empiler plusieurs moments extraordinaires concurrents. A est le seul candidat qui fait du langage photographique de VYRON (le flou de mouvement) la cause du langage graphique (l'encoche). B et C restent des matériaux de soutien.

### 2.2 Séquence focale du hero (chronologie en ms)

Contrat : **cliquable à t = 0**, la navigation n'est jamais masquée, **séquence ≤ 1 300 ms**, pas de préchargeur.

| t (ms) | Couche | Mouvement | Durée | Easing |
|---|---|---|---|---|
| 0 | Navigation (logo, MENU, téléphone) | **aucun** : visible et cliquable d'emblée | — | — |
| 0 (déclenché par `img.decode()`, plafonné à 1 200 ms) | Couche « stries » au-dessus de la photo nette | opacité 1 → 0 ; `scaleX` 1,12 → 1 (origine à gauche) : les stries se compriment comme au freinage | 700 | `--ease-out` |
| 0 | Photo nette (le LCP, dessous) | `translateX(-27px → 0)` (= step-l) | 900 | `--ease-out` |
| 120 | « BUILD » | révélation de gauche à droite par double translation (conteneur et contenu en sens opposés) + `translateX(-0.4em → 0)` ; **2 échos rouges** décalés de −27 et −54 px (opacité .6 et .3) qui rejoignent 0 et s'éteignent | 650 | `--ease-out` |
| 210 | « STRENGTH » | idem (+90 ms) | 650 | `--ease-out` |
| 450 | Filets du hero (H à 741/1047, V à 30/1409) | se tracent **depuis les réticules** (`scaleX`/`scaleY` de 0 à 1, origine sur la croix) | 600 | `--ease-out` |
| 450 | 4 réticules | rotation de 45° à 0° et échelle de .6 à 1 : « verrouillage » | 400 | `--ease-out` |
| 520 | Liste des slogans | 5 filets tracés en `scaleX` (origine à gauche) ; textes montés de 100 % à 0 dans leur masque ; décalage de 60 ms entre lignes (4 lignes, 180 ms) | 500 | `--ease-out` |
| 600 | Astérisque | rotation de 0 à 45° : **un cran**. La symétrie à 8 branches fait que l'état final est identique au départ, d'où un vrai « clic » | 300 | `--ease-strike` |
| 700 | « Redefine Your Physical Potential » | masque de ligne, de 100 % à 0 | 450 | `--ease-out` |
| 800 | Chevrons → → → | `translateX(-12px → 0)` + opacité, décalage de 70 ms, comme un départ de sprint | 300 | `--ease-out` |
| ≈ 1 250 | fin | — | — | — |

**Mise en œuvre de la couche stries (proposition à valider visuellement) :** une version de la photo floutée horizontalement, exportée en **résolution anisotrope** (peu de pixels en largeur, beaucoup en hauteur, par exemple ≈ 48×360 px, quelques Ko). Étirée en `object-fit: cover`, l'interpolation bilinéaire du navigateur produit **gratuitement** des stries horizontales. Elle sert de **placeholder basse qualité (LQIP)** pour le chargement : l'animation n'attend rien d'artificiel (`delight.md` : « never fake work »). La photo nette reste dessous, visible dès le premier rendu, donc le LCP n'est pas dégradé. Les échos de texte sont des `<span aria-hidden="true">`, pas des pseudo-éléments `content:` qui peuvent être lus par certains lecteurs d'écran.

**Indépendance vis-à-vis du bundle :** les deux lignes du H1 sont connues à l'avance. L'intro peut donc tourner en **keyframes CSS**, déclenchées par un petit script inline (moins de 1 Ko) qui pose `.is-ready` après `img.decode()`. Le moment focal n'attend pas les ≈ 50 Ko de GSAP, chargés en différé.

**Ne pas rejouer l'intro** si l'arrivée se fait sur une ancre (`#programs`), lors d'un retour depuis le bfcache (`pageshow` avec `persisted`), ou si le hero n'est pas dans le viewport au démarrage.

### 2.3 Continuité, feedback, budget

- **Continuité :**
  - au scroll, la vitesse fait revenir les stries dans le hero (opacité proportionnelle à la vitesse, voir §4) ;
  - les blocs décalés se « soulèvent » à leur entrée (pas de 0 à leur valeur) et s'« enfoncent » quand on appuie dessus ;
  - les changements d'état actif se lient dans l'espace (tuile ↪ re-parentée en FLIP, carte de témoignage qui sort de la pile) ;
  - le footer rejoue le geste du hero à l'envers (le wordmark arrive avec ses échos).
- **Feedback :** pression des blocs décalés, accordéon +/−, déploiement de l'équipe, flèches du carrousel, menu, soulignés, focus qui « verrouille » (l'offset du contour se resserre).
- **Budget :**
  - 1 moment focal, joué une fois par chargement ;
  - **au plus 1 boucle continue** (le marquee, seulement quand il est visible) ;
  - **≤ 4 effets liés au scroll** sur toute la page : stries du hero, remplissage de « SERVICES. », cliquet global des astérisques, wordmark du footer ;
  - aucun `filter: blur()` animé image par image sur une grande surface ;
  - ≤ 10 calques animés en même temps ;
  - JS motion ≤ ≈ 60 Ko gzip, et l'overdrive est chargé à part, à la demande.

---

## 3. Grammaire de mouvement (tokens nommés)

### 3.1 Easings

| Token | Valeur | Équivalent GSAP | Usage |
|---|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | `CustomEase("0.16,1,0.3,1")` (proche de `expo.out`) | toutes les **arrivées** (focal, entrées, ouverture d'overlay) |
| `--ease-out-soft` | `cubic-bezier(0.25, 1, 0.5, 1)` | proche de `power3.out` | changements d'**état** routiniers (couleur, survol, icône) |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | proche de `expo.in` | **sorties** (accélèrent en partant) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | proche de `power2.inOut` | **layout** (accordéon, équipe, piste, deck) |
| `--ease-strike` | `cubic-bezier(0.87, 0, 0.13, 1)` | proche de `expo.inOut` | **frappe sèche** de petits objets : cliquet d'astérisque, point final de « SERVICES. » |
| `linear` | — | `"none"` | scrub (Lenis lisse déjà) et marquee |

Ni rebond ni élastique (`animate.md`). Pour garantir une parité exacte entre CSS et JS, les 4 courbes sont définies **une seule fois** (tableau de 4 nombres dans `tokens.ts`), puis exportées en variables CSS et en `CustomEase`.

### 3.2 Durées

| Token | Valeur | Usage | Sortie (≈ 0,65× l'entrée) |
|---|---|---|---|
| `--dur-press` | 90 ms | `:active`, enfoncement d'un bloc décalé | relâche : 240 ms |
| `--dur-feedback` | 140 ms | survol (couleur, coup de pouce d'une icône) | 120 ms |
| `--dur-state` | 240 ms | +/−, soulignés, échange d'image, cellules du footer, cliquet (220 ms) | 160 ms |
| `--dur-layout` | 420 ms | accordéon, déploiement de l'équipe, piste, deck du témoignage | 280–300 ms |
| `--dur-overlay` | 480 ms | menu plein écran | 320 ms |
| `--dur-focal` | 650–900 ms | lignes du hero, photo | — |
| `--seq-max` | 1 300 ms | plafond de toute séquence | — |

### 3.3 Distances : les pas mesurés

`--step-xs: 5px` · `--step-s: 12px` · `--step-l: 27px` · `--step-xl: 70px` [MESURÉS ; XL ESTIMÉ]. Toute translation d'entrée d'un élément d'interface vaut un de ces pas. Aucune translation ne dépasse `--step-xl`, sauf la typo focale (0,4 em) et le deck (`--step-xl`).

### 3.4 Plafonds de décalage (stagger)

| Token | Valeur | Contexte | Total max |
|---|---|---|---|
| `--stagger-tight` | 40 ms | pastilles, points de pagination | 160 ms |
| `--stagger-list` | 60 ms | slogans, portraits, colonnes de piliers | **240 ms** |
| `--stagger-lines` | 80–90 ms | lignes de display (BUILD/STRENGTH, liens du menu) | 250 ms |

Pas plus de 6 éléments décalés : au-delà, les suivants partagent le dernier délai. **Aucun décalage par caractère** sur du texte courant. On ne décale que ce qui **est** une liste (`animate.md`).

### 3.5 Principes

1. **Entrée depuis le visible.** L'état par défaut du DOM et du CSS est l'état **final**. Les états initiaux n'existent que sous `html.motion`. Cette classe est posée par un script inline dans `<head>` uniquement si JS tourne **et** si `prefers-reduced-motion` n'est pas activé. Garde-fou : si le module motion n'a pas démarré au bout de 3 s, la classe est retirée et tout s'affiche.
2. **Une ancre toujours présente.** Rien n'apparaît depuis le vide sur un fond nu. Chaque entrée a un point d'appui déjà visible : un filet, le contour d'un mot, la couche arrière d'un bloc, la cellule d'une grille.
3. **Courte distance et déclenchement tôt.** Le déclenchement se fait à `top 85%`, `once: true`, sans inverse en remontant (le contenu n'est jamais re-caché). Une animation interrompue ou sautée reste composée, puisque les distances valent au plus un pas.
4. **La sortie est plus rapide que l'entrée** (ratio ≈ 0,65).
5. **Interruptible.** Le survol passe par des transitions CSS, réversibles nativement depuis la valeur courante. Pour les timelines GSAP (menu, deck) : nouvelle commande = `progress(1)` de l'ancienne ou inversion depuis l'état courant. Jamais de file d'attente.
6. **Pas d'entrée identique sur chaque section** (`craft-floor`). **Les H2 ne s'animent pas.** Chaque section a **un seul** mouvement d'entrée, tiré de sa propre matière (§4).

### 3.6 Comportement physique du bloc décalé (spécification unique)

Tous les blocs décalés sont un seul composant : `clip-path: polygon(…)` à 8 sommets, piloté par **une propriété personnalisée typée** (`@property --step { syntax: '<length>' }`, prise en charge par tous les navigateurs récents). La transition de `--step` anime l'encoche sans toucher au layout.

| État | `--step` | Détail | Durée · easing |
|---|---|---|---|
| Repos | token (XS, S, L ou XL) | — | — |
| Entrée (images et boutons) | 0 → token | le bloc se **soulève** hors de son socle ; l'image interne passe de l'échelle 1,06 à 1 | 300 (S) à 700 (XL) · `--ease-out` |
| Survol (pointeur fin) | token → token × 1,5 | « lift » : la trace s'allonge | 140 · `--ease-out-soft` |
| `:active` | → 0 | le bloc s'**enfonce**, le libellé glisse de (1px, 1px) | 90 · linéaire |
| Relâche | → valeur de survol | — | 240 · `--ease-out` |
| `:focus-visible` | inchangé | contour de 2 px sur la boîte englobante ; `outline-offset` 8 → 3 px (« verrouillage ») | 150 · `--ease-out` |
| Désactivé | 0 | désaturé, opacité ≈ .45, aucune transition | — |

---

## 4. Chorégraphie section par section

Légende des priorités : **MUST** = indispensable · **SHOULD** = recommandé · **OVERDRIVE** = optionnel et ambitieux.

### 4.1 Hero

| Élément | Déclencheur | Mouvement (matière) | Durée · easing | Primitive | Réduit | Prio |
|---|---|---|---|---|---|---|
| Photo + stries | chargement (décodage) | voir 2.2 : opacité et `scaleX` des stries, `translateX` de la photo | 700/900 · `--ease-out` | keyframes CSS + script inline | photo nette directe, stries en fondu de 200 ms | MUST |
| BUILD / STRENGTH + échos | chargement +120/+210 | double translation (masque) + 2 échos rouges qui se résorbent | 650 · `--ease-out` | keyframes CSS (2 lignes connues, pas de SplitText) | visible d'emblée, sans échos | MUST |
| Filets + réticules | chargement +450 | tracé `scaleX`/`scaleY` depuis les réticules ; rotation de 45° à 0° | 600/400 · `--ease-out` | keyframes CSS | statiques | SHOULD |
| Slogans | chargement +520 | tracé des filets + montée des lignes dans un masque, décalage de 60 ms | 500 (+180) · `--ease-out` | keyframes CSS (`--i` = index) | statiques | SHOULD |
| Astérisque | chargement +600 | 1 cran de 45° | 300 · `--ease-strike` | CSS | statique | SHOULD |
| Accroche + chevrons | chargement +700/+800 | masque de ligne ; chevrons décalés de 70 ms | 450/300 · `--ease-out` | CSS | statiques | SHOULD |
| Navigation | — | **pas d'entrée** | — | — | — | MUST (règle) |
| Sortie du hero : stries liées à la vitesse | scroll (vitesse) tant que le hero est visible | opacité des stries = min(\|v\| · k, .55), lissée (lerp .15), retour à 0 en ≈ 300 ms à l'arrêt : **la vitesse revient quand on bouge** | continu | vitesse Lenis + `gsap.ticker` → variable CSS | désactivé | SHOULD |
| Sortie du hero : écartement | scrub sur 0–100 % de la hauteur du hero | BUILD part de 0 à −4vw, STRENGTH de 0 à +4vw | scrub · linéaire | GSAP ScrollTrigger (scrub) | désactivé | OVERDRIVE |

### 4.2 About

| Élément | Déclencheur | Mouvement | Durée · easing | Primitive | Réduit | Prio |
|---|---|---|---|---|---|---|
| Compteurs « 4.9 / 5 » et « 20 » (et le nombre d'avis s'il devient lisible) | entrée au scroll (85 %), une fois | **compteur à rouleaux** : des colonnes de chiffres défilent en `translateY` ; chiffres tabulaires ; valeur réelle dans le DOM (`aria-label`), rouleaux en `aria-hidden` | 900 · `--ease-out`, 60 ms d'écart entre colonnes | CSS transform + IntersectionObserver (sans GSAP) | valeur finale | SHOULD |
| Portrait à encoche | entrée au scroll, une fois | `--step` de 0 à 27 + image de 1,06 à 1 | 600 · `--ease-out` | transition CSS `@property` | encoche présente, sans animation | SHOULD |
| CTA « Learn More About Us » | entrée au scroll | `--step` de 0 à 12 (« lift ») | 300 · `--ease-out` | CSS | statique | SHOULD |
| Graduations du kicker | entrée au scroll | 13 traits qui passent de l'opacité .3 à 1 en `steps(13)` : « compteur de répétitions » | 390 · `steps` | keyframes CSS | statiques | dépend de T1 (§10) |
| Titre H2 | — | **aucun mouvement** (règle anti-répétition) | — | — | — | — |

### 4.3 Services

| Élément | Déclencheur | Mouvement | Durée · easing | Primitive | Réduit | Prio |
|---|---|---|---|---|---|---|
| « SERVICES. » | scrub de `top 90%` à `top 40%` | Le mot est **toujours lisible en contour rouge de 1 px** (entrée depuis le visible). Le **remplissage** se révèle de gauche à droite par double translation (composité, pas de `clip-path` sur 1 275 px). Le point « . » tombe sur les 10 derniers % : échelle de 1,35 à 1. | scrub · linéaire ; le point en `--ease-strike` | GSAP ScrollTrigger (scrub) ; alternative : CSS `view()` avec repli statique | mot plein et statique | SHOULD |
| Grille réglée (110 px) | même scrub | balayage de masque (`mask-position`) de gauche à droite, synchronisé avec le remplissage du mot : « la règle mesure » | scrub | masque CSS + ScrollTrigger | statique | SHOULD |
| Piste de cartes (carrousel INFÉRÉ) | clic sur la tuile, swipe, glisser, ←/→ | La piste se translate d'une carte + gouttière (≈ 656 px à 1440). La **carte active s'inverse** (#FFF → #000, texte noir → blanc). La **tuile ↪ est re-parentée** sur la nouvelle carte active (FLIP). L'astérisque du numéro avance d'un cran. | piste 420 · `--ease-in-out` ; couleurs 240 · `--ease-out-soft` | **scroll-snap natif** (piste) + **GSAP Flip** (tuile) | aimantation instantanée, inversion en 150 ms | MUST si le carrousel est retenu (T3) |
| Images à encoche des cartes | première entrée de la piste | `--step` de 0 à 27 | 600 · `--ease-out` | CSS | statiques | SHOULD |
| Alternative : piste épinglée défilée au scroll vertical | scrub épinglé | — | — | ScrollTrigger `pin` | — | **non recommandé** : impression de scroll détourné, concurrence le moment focal, 3 à 4 cartes ne le justifient pas |

### 4.4 Programmes (accordéon)

| Élément | Déclencheur | Mouvement | Durée · easing | Primitive | Réduit | Prio |
|---|---|---|---|---|---|---|
| Image XL à encoche | entrée au scroll | `--step` de 0 à 70 + image de 1,06 à 1 | 700 · `--ease-out` | CSS `@property` | statique | SHOULD |
| Ouverture d'un item | clic, Entrée ou Espace sur `<button aria-expanded>` | La région passe de `grid-template-rows: 0fr` à `1fr` (technique de grille admise par `animate.md`). Le contenu passe de l'opacité 0 à 1 et de y = 8 à 0 après 120 ms. Pastilles décalées de 40 ms, ligne du coach en dernier. Icône + → − (barre verticale : `scaleY` 1 → 0 et rotation de 90°). | 420 · `--ease-in-out` ; contenu 240 · `--ease-out` | transition CSS sur une classe ; `<details name>` + `::details-content` seulement en amélioration progressive (Chromium) | hauteur instantanée + fondu de 150 ms | MUST |
| Fermeture | idem | contenu en fondu (120 ms) **puis** lignes ramenées à 0fr | 280 · `--ease-in-out` | CSS | instantané | MUST |
| Exclusivité (un seul item ouvert) | ouverture d'un autre item | fermeture simultanée de l'ancien. **Compensation de scroll** : si l'item ouvert est sous celui qui se ferme, on corrige `scrollBy(delta)` pour que l'en-tête cliqué ne bouge pas sous le pointeur | — | JS (mesure du delta) + `overflow-anchor` | idem | MUST |
| Changement d'image (si une image par programme, T5) | ouverture | « re-rack » : `--step` de 70 à 0 (160 ms, `--ease-in`), fondu enchaîné vers la nouvelle image (200 ms), puis `--step` de 0 à 70 (320 ms, `--ease-out`) | ≈ 680 | CSS ou WAAPI | fondu enchaîné de 150 ms | SHOULD |
| Technique | `transitionend` | `ScrollTrigger.refresh()` après chaque changement de hauteur | — | — | — | MUST |

### 4.5 Why VYRON (sombre) et équipe

| Élément | Déclencheur | Mouvement | Durée · easing | Primitive | Réduit | Prio |
|---|---|---|---|---|---|---|
| Grille des 4 piliers | entrée au scroll | **seuls les filets se tracent** : horizontaux en `scaleX` (origine à gauche), verticaux en `scaleY` (origine en haut), 60 ms d'écart par colonne (180 ms au total). Les textes sont déjà visibles. | 500 · `--ease-out` | keyframes CSS + IntersectionObserver | statique | SHOULD |
| Entrée de la bande d'équipe | entrée au scroll | portraits révélés du bas vers le haut (`clip-path: inset(100% 0 0 0)` → `inset(0)`), 60 ms d'écart (5 portraits, 240 ms) | 600 · `--ease-out` | CSS | statique | SHOULD |
| Déploiement d'un membre | survol ou focus (ordinateur, pointeur fin) | La colonne active passe de 1fr à 1,42fr en `grid-template-columns`. La hauteur est animée par `clip-path: inset(0 0 44% 0)` → `inset(0)` dans un conteneur de hauteur fixe (≈ 409), donc sans reflow de la page. Fondu enchaîné portrait → photo d'action. Le numéro passe en rouge. En quittant la bande : retour à l'état par défaut **03** après 150 ms (anti-scintillement). | 420 · `--ease-in-out` (retour 300) ; fondu 240 | **CSS pur** : `.team:has(.member:hover, .member:focus-visible)` + transition de `grid-template-columns`, avec `contain: layout paint` | échange instantané + fondu de 150 ms | SHOULD |
| Équipe sur mobile | — | liste horizontale en scroll-snap, sans déploiement | — | CSS | — | MUST |
| « Meet the Team » | entrée, survol, pression | comportement du bloc décalé (3.6) | — | CSS | — | MUST |
| Grille réglée sombre | — | **statique** (une seule grille animée sur la page : celle des services) | — | — | — | — |

### 4.6 Transformation / témoignage

| Élément | Déclencheur | Mouvement | Durée · easing | Primitive | Réduit | Prio |
|---|---|---|---|---|---|---|
| Deck d'images (lecture « pile ») | précédent/suivant, swipe, ←/→ | La carte sortante part en `translateX(-70px)` et disparaît (260, `--ease-in`). L'entrante **sort de la pile** (la barre sombre = la carte suivante qui dépasse) : échelle .94 → 1, y de 14 à 0 (420, `--ease-out`). La nouvelle carte d'attente apparaît en fondu (200 ms). | 260/420 | timeline GSAP interruptible (`progress(1)`) | fondu enchaîné de 150 ms | MUST |
| Citation | idem | lignes qui sortent vers le haut (180, `--ease-in`), puis entrent (420, `--ease-out`, 50 ms d'écart, ≤ 3 lignes) ; zone `aria-live="polite"` | — | SplitText (`lines`, `mask: "lines"`) | fondu enchaîné | MUST |
| Compteur « 01 → 02 » | idem | rouleau | 300 · `--ease-out` | CSS | instantané | SHOULD |
| Pagination (3 points verticaux) | idem | l'indicateur rouge glisse en `translateY` | 300 · `--ease-out` | transform CSS | instantané | SHOULD |
| Grand astérisque rouge | scroll | cliquet global de 45° (§6) | 220 · `--ease-strike` | variable CSS | statique | SHOULD |
| Lecture alternative « vidéo » (barre = progression) | visibilité | lecture muette **seulement** si visible ; pause hors écran et onglet masqué ; mode réduit = image fixe (poster) ; jamais de son sans action | — | IntersectionObserver | poster | SHOULD si vidéo |
| Autoplay du carrousel | — | **non** (WCAG 2.2.2, et une citation qui change seule n'est pas lue) | — | — | — | règle |

### 4.7 Marquee « Fitness Hub ✱ »

| Élément | Déclencheur | Mouvement | Durée · easing | Primitive | Réduit | Prio |
|---|---|---|---|---|---|---|
| Défilement | continu, **seulement si visible** | `translateX` en boucle. Base ≈ 70 px/s (≈ 1 item / 2,6 s pour 183 px). Facteur × (1 + \|v\|·k), plafonné à ×5. **Le sens suit celui du scroll**, lissé par lerp .1. | linéaire | **une seule boucle rAF** (`gsap.ticker`) qui écrit un transform ; pistes dupliquées en `aria-hidden`, un seul texte accessible | **statique** | MUST si le marquee est gardé |
| Séparateurs ✱ | scroll | cliquet global | 220 · `--ease-strike` | variable CSS | statiques | SHOULD |
| Pause | survol ou focus | arrêt de la base (WCAG 2.2.2) ; variante possible : **scroll seul**, sans mouvement autonome (conforme par construction), T8 | — | — | — | SHOULD |

### 4.8 Footer

| Élément | Déclencheur | Mouvement | Durée · easing | Primitive | Réduit | Prio |
|---|---|---|---|---|---|---|
| Wordmark « VYRON™ » | scrub du haut du footer (100 %) jusqu'à la fin de page | lettres montées de 100 % à 0 dans un masque (écart de .04 en espace de scrub) + 2 échos rouges qui se résorbent : **le geste du hero rejoué en arrivant** | scrub · linéaire | ScrollTrigger + 5 `<span>` posés à la main (inutile de charger SplitText pour 5 lettres) | statique | SHOULD |
| Cellules de liens | survol ou focus | la barre d'en-tête se remplit en rouge (`scaleX` depuis la gauche), comme l'état figé de « Back To Home » ; en sortie elle se rétracte vers la droite | 240/160 · `--ease-out`/`--ease-in` | CSS | couleur seule | MUST |
| « Back To Home » | clic | `lenis.scrollTo(0, { duration: 1.2 })` en `--ease-in-out` ; le focus passe au H1 ou à la cible du lien d'évitement ; l'intro **ne rejoue pas** | 1 200 | Lenis | saut instantané | MUST |
| Photo rouge floue | — | aucun mouvement (déjà floue) ; option : stries liées à la vitesse comme dans le hero | — | — | — | OVERDRIVE |

---

## 5. Catalogue des micro-interactions

Les survols ne s'appliquent que sous `@media (hover: hover) and (pointer: fine)`. `:active` s'applique partout. **Chaque survol a son équivalent `:focus-visible`.** **Aucune affordance de survol sur un élément non cliquable.**

| Atome | Survol | Pression | Focus visible | États spéciaux | Mode réduit |
|---|---|---|---|---|---|
| **Bouton décalé** (Learn More, View All Programs, Meet the Team) | `--step` 12 → 18 (140 ms) | `--step` → 0 + libellé décalé de (1, 1) px (90 ms), relâche en 240 ms | contour de 2 px, offset 8 → 3 px (150 ms) | désactivé : pas à 0, opacité .45 | couleurs et pression conservées, pas d'animation de l'offset |
| **Tuile flèche ↪** | le tracé de la flèche se **redessine** (`stroke-dashoffset` de 1 à 0, 240 ms) + lift du pas | pression du bloc | idem | — | redessin désactivé |
| **Déclencheur MENU (grille 3×3)** | vague diagonale sur les 9 points (échelle 1 → 1,35 → 1, 20 ms d'écart, ≈ 300 ms au total) | au clic, les 9 points se réarrangent en **×** (5 rejoignent les diagonales, 4 disparaissent, 300 ms) ; le libellé MENU ↔ CLOSE défile verticalement (240 ms) | contour | `aria-expanded` | permutation instantanée |
| **Menu plein écran** | — | **Ouverture** : rideau à **bord en escalier** (`clip-path` polygonal dont le bord bas a une marche de `--step-xl`) qui descend en 480 ms `--ease-out` ; liens display en masque de ligne, 50 ms d'écart (250 ms max). **Fermeture** : liens en fondu (120 ms), puis rideau qui remonte (320 ms, `--ease-in`). | le focus va au 1er lien ; piège à focus ; Échap ferme ; retour du focus sur le déclencheur ; `inert` sur la page ; `lenis.stop()` | `<dialog>` ou `aria-modal` | fondu de 200 ms, sans rideau |
| **Bouton téléphone** (XS) | les 2 arcs de signal se redessinent l'un après l'autre (2 × 120 ms) ; pas de 5 à 7 | pression du bloc | contour | nom accessible « Appeler VYRON » ; lien `tel:` sur mobile | arcs statiques |
| **Ligne d'accordéon** | le titre glisse de `--step-xs` ; le filet du bas se remplit en rouge (`scaleX` depuis la gauche, 240 ms) ; « + » tourne de 90° (un cran) | ouverture (4.4) | contour sur toute la ligne d'en-tête | `aria-expanded`, `aria-controls` | couleur seule |
| **Pastilles (14 Days, Muscle Building…)** | **aucun** (métadonnées non interactives : pas de survol ni de curseur pointer) | — | non focalisables | entrée décalée de 40 ms à l'ouverture | — |
| **Portraits de l'équipe** | déploiement (4.5), seulement si interactifs | — | si chaque membre mène à une fiche : focalisable, et le focus déploie | sans fiche : déploiement décoratif au survol, aucune perte d'information au clavier (noms visibles) | fondu |
| **Carrousel précédent/suivant** (décalés, S) | flèche poussée de 3 px dans son sens (140 ms) | pression du bloc | contour | précédent désactivé sur 01 (gris, comme la maquette) avec `aria-disabled` ; ←/→ quand le focus est dans le carrousel ; swipe avec un seuil de 40 px | permutation instantanée |
| **Carrés sociaux** (≈ 47 px, ESTIMÉ) | remplissage rouge depuis le bas (pseudo-élément en `scaleY`, 200 ms), icône blanche | `translateY(1px)` (carré simple, sans pas) | contour | — | couleur seule |
| **Liens texte / soulignés** (liens mono du footer, liens courants) | soulignement de 1 px : `scaleX` 0 → 1 depuis la gauche (200 ms) ; en sortie, rétraction **vers la droite** (160 ms) | — | contour + soulignement | `text-underline-offset` aux couleurs du thème | soulignement statique au survol |
| **Cellules du footer** | barre rouge (4.8) | navigation | idem survol | — | couleur |
| **Cartes de services inactives** | `--step` L → L+6, titre poussé de `--step-xs` | devient active (Flip) | contour | — | — |
| **Focus visible (global)** | — | — | contour de 2 px : rouge #F02B42 sur fond clair, blanc sur fond rouge ou sombre ; `outline-offset` 8 → 3 px en 150 ms (**verrouillage**, écho des réticules) | jamais `outline: none` sans remplacement | offset fixe de 3 px |
| **Mini-barre fixe** (si adoptée, T4) | — | — | — | se cache au scroll vers le bas (`translateY(-100%)`, 200 ms, `--ease-in`), réapparaît au scroll vers le haut (300 ms, `--ease-out`) ; bascule de thème sur les sections sombres (200 ms, via IntersectionObserver sur `[data-theme="dark"]`) | apparition et disparition en fondu |

---

## 6. Systèmes globaux

| Système | Recommandation | Raisonnement |
|---|---|---|
| **Lenis (scroll lissé)** | **Oui, sous conditions** : ordinateur, pointeur fin, pas de mouvement réduit. `lerp ≈ 0.12` (plus ferme que 0.1 par défaut, pour un monde de « puissance contrôlée », à régler [ESTIMÉ]). `anchors: true` (avec un offset si la mini-barre existe). `syncTouch: false` (le tactile reste natif). `autoRaf: false` ; boucle `gsap.ticker` → `lenis.raf()`, `lenis.on('scroll', ScrollTrigger.update)`, `lagSmoothing(0)`. `data-lenis-prevent` sur le menu et les zones défilantes internes. `lenis.stop()` quand le menu est ouvert. Supprimer `scroll-behavior: smooth` du CSS (conflit). | **Pour :** Lenis supprime les à-coups des scrubs (remplissage de « SERVICES. », wordmark) sur les molettes à crans, et fournit **la vitesse** au marquee et aux stries. **Contre :** il modifie la sensation native (certains utilisateurs détestent), ajoute ≈ 4–5 Ko, et demande de la rigueur sur les ancres et les zones imbriquées. Le clavier, la recherche dans la page et les lecteurs d'écran restent natifs. **Ne pas l'utiliser** en mouvement réduit, sur tactile, dans les overlays, ni si les scrubs sont abandonnés : sans scrub, Lenis ne vaut plus son coût. |
| **Source de vitesse unique** | Le module `scroll.ts` expose `velocity` et `direction`, depuis Lenis s'il est actif, sinon depuis `ScrollTrigger.getVelocity()`. | Le marquee et les stries fonctionnent aussi sur mobile, sans Lenis. |
| **Cliquet des astérisques** | Un seul calcul : cran = `floor(scrollY / ≈ 320 px)` [ESTIMÉ ≈ 1/3 d'écran]. À chaque **changement** de cran, on écrit `--ratchet` sur `:root`. Chaque astérisque : `rotate: calc(var(--ratchet) * 45deg)` + transition de 220 ms en `--ease-strike`. | La symétrie à 8 branches donne un « clic » de répétition sans jamais paraître « penché ». Coût quasi nul (une écriture par cran, pas par image). Touche le hero, les numéros des services, le témoignage, le marquee et le footer : **une seule loi** pour 6 occurrences. |
| **Transitions de page** (si des sous-pages existent, T7) | **View Transitions natives entre documents** (`@view-transition { navigation: auto }`) avec le **rideau en escalier** sur `::view-transition-old/new(root)`, et un élément partagé `view-transition-name` de l'image d'un programme vers sa page de détail. Dans Astro, préférer le MPA natif au `ClientRouter` (sinon il faut détruire et réinitialiser Lenis, ScrollTrigger et SplitText à chaque `astro:page-load`). | Firefox ne prend pas en charge les transitions entre documents : la navigation y reste normale (amélioration progressive acceptable). |
| **Préchargeur** | **Non.** | Site statique ; le mode Persuade exige une offre lisible et une action immédiate ; `delight.md` interdit de retarder pour mettre en scène. Le **placeholder strié est l'état de chargement**. Polices : précharger la police display en woff2 sous-ensemble, et attendre `document.fonts.ready` **au plus 300 ms** avant de mesurer les lignes (SplitText `autoSplit` + `onSplit` re-découpe si la police arrive plus tard). |
| **Curseur personnalisé** | **Non, globalement.** | Générique ; masque les affordances natives (pointeur, texte) ; ajoute du travail à chaque image et de la latence ; gêne les utilisateurs de grands curseurs ou du contraste élevé ; inexistant sur tactile. Seule tolérance : `cursor: grab/grabbing` sur la piste des services. Un réticule contextuel (motif des croix) **au-dessus** du curseur natif, dans la piste uniquement, serait un OVERDRIVE discutable. |
| **Progression du scroll** | **Pas de barre générique.** Si la mini-barre est adoptée : une **règle graduée** (le motif « ||||||| » du kicker), avec une graduation majeure par section, qui se remplit en rouge et où chaque graduation est un lien vers sa section (fonctionnel, pas décoratif). | Recycle le motif des graduations si les kickers sont supprimés (T1). Environ 8,5 écrans de page : utile mais pas indispensable. |
| **Couplage marquee / vitesse** | Voir 4.7 : plafond ×5, sens du scroll, lissage .1, pause hors écran et onglet masqué. | Pas d'inclinaison (skew) : elle déforme la typo carrée et lit « cheap ». |
| **Compteurs de nombres** | Compteur à rouleaux pour 4.9, 20 et le nombre d'avis. Compteur 01 → 0n du témoignage. | « Rouleau qui se pose » plutôt qu'« incrément de 0 à n » : une note qui « monte de 0 » est un contresens. |
| **Démarrage du code motion** | Les modules de section s'initialisent **paresseusement**, quand leur section approche (IntersectionObserver, `rootMargin: 50%`). Nettoyage par `gsap.context()` / `matchMedia()`. | Moins de JS au démarrage, et aucune fuite si la page est réutilisée en transition. |

---

## 7. Idées OVERDRIVE (coût et risque honnêtes)

| # | Idée | Effet | Coût | Risque | Sert le monde ? | Verdict |
|---|---|---|---|---|---|---|
| O1 | **Flou directionnel en WebGL sur la photo du hero** (OGL, shader de motion blur dont l'intensité vient du chargement, de la vitesse de scroll et de la vitesse horizontale du pointeur) | Un vrai flou directionnel calculé par le GPU, qui remplace le fondu enchaîné du placeholder | OGL ≈ 10–15 Ko gzip [ESTIMÉ] + 1 shader ; 1 à 2 jours de mise au point et de tests sur appareils | GPU faibles, perte de contexte, batterie. Le `<img>` doit rester le LCP : le canvas apparaît en fondu après sa première image. | **Oui** : c'est le langage photographique de VYRON | **Meilleur candidat overdrive.** Pointeur fin et appareil capable seulement (`hardwareConcurrency ≥ 4`, `deviceMemory ≥ 4`, pas de `saveData`) ; repli sur la version strié CSS |
| O2 | **Décalage RVB lié à la vitesse** | Aberration chromatique sur les images au scroll rapide | modéré | lit « glitch / cyber », se bat avec le rouge de la marque, inconfortable | **Non** : un autre monde (glitch), pas le flou de mouvement | **Rejeté.** Si on veut de la matière : des « traînées rouges » directionnelles, donc O1 |
| O3 | **Échos liés à la vitesse sur la typo géante** (« SERVICES. », « VYRON™ ») | 2 clones `aria-hidden` dont le décalage horizontal suit `--v` ; au repos, ils sont confondus avec le mot | faible (transform de 2 clones, variable écrite à chaque image **seulement si visible**) | cinétose, d'où une désactivation en mode réduit et un plafond de ±27 px | **Oui** (le bloc décalé en mouvement) | **OVERDRIVE-lite recommandé** |
| O4 | **Grille réglée réactive au pointeur** | Projecteur (masque radial) qui fait briller les filets près du pointeur ; variante Canvas 2D où les lignes ploient comme un tapis sous un poids | CSS ≈ 0 ; Canvas faible à moyen | bruit décoratif | moyennement (motif de mesure) | Optionnel, version CSS seulement |
| O5 | **Élément partagé programme → page de détail** (View Transitions) | L'image à encoche devient le hero de la page de détail | faible | Firefox sans transition entre documents | oui (continuité) | **SHOULD si des sous-pages existent** |
| O6 | **Footer en serre-livre « arrêt → vitesse »** | Les stries de la photo du footer augmentent quand on arrive en bas, et VYRON™ arrive avec ses échos | faible (réutilise le code du hero) | risque de concurrencer le moment focal | oui | À garder **en sourdine**, sinon à couper |

`overdrive.md` impose de **proposer avant de construire** : O1, O3 et O6 sont des options à faire choisir par l'utilisateur (T9).

---

## 8. Règles d'accessibilité et de performance

**Mouvement réduit (`prefers-reduced-motion: reduce`), en écoutant les changements en direct :**
- **coupé :** Lenis, tous les scrubs, la boucle du marquee (bandeau statique), le cliquet, les échos, les stries liées à la vitesse, le rideau du menu, les entrées spatiales ;
- **conservé :** les changements d'état porteurs de sens (couleurs, +/−, contenu de l'accordéon avec un fondu de 150 ms, fondu enchaîné du carrousel, bascule de thème), le feedback de pression ;
- **mis en œuvre :** media query CSS pour la partie CSS, `gsap.matchMedia({ reduce: "(prefers-reduced-motion: reduce)" })` pour la partie JS, et l'intro réduite à un fondu de 200 ms des stries.

**Contenu jamais masqué par défaut :** classe `html.motion` et garde-fou de 3 s (3.5). Le H1, la navigation et les CTA sont lisibles sans JS.

**Hors écran :** marquee, stries, WebGL et vidéo en pause via IntersectionObserver et `visibilitychange`. ScrollTrigger avec `once: true` pour les entrées.

**Propriétés animées :** `transform`, `opacity`, `clip-path`/`mask` limités à des éléments de taille modérée, et la propriété personnalisée `--step`. **Deux exceptions de layout assumées et confinées :**
1. les lignes de grille de l'accordéon ;
2. les colonnes de la bande d'équipe (`contain: layout paint`, hauteur fixe).

Dans les deux cas : `ScrollTrigger.refresh()` en fin de transition, et repli sur GSAP Flip si l'on mesure des saccades.

**`will-change` :** seulement pendant une animation connue (classe `.is-animating` posée puis retirée ; GSAP `force3D: "auto"` libère le calque à la fin). Jamais de règle globale. Pas de `filter: blur()` animé sur plus de ≈ 300×300 px.

**Grands éléments au scrub :** révélation par **double translation** (composité) plutôt que par `clip-path` (repeint sur le fil principal dans la plupart des navigateurs).

**Objectif de 60 fps sur mobile milieu de gamme** (Android de type Pixel 6a ou Galaxy A5x, iPhone 12 ; profilage DevTools avec le CPU ralenti 4×) :
- moins de ≈ 8 ms de script par image pendant le scroll ;
- aucune tâche longue pendant le scroll ;
- hero en `100svh` et `ScrollTrigger.config({ ignoreMobileResize: true })`, pour éviter les recalculs quand la barre d'URL se replie.

**Budget JS motion :** ≈ 45–55 Ko gzip pour GSAP core + ScrollTrigger + SplitText (+ Flip ≈ 8 Ko) et ≈ 4–5 Ko pour Lenis [ESTIMÉ, à mesurer au build]. Bundle en `type=module` différé, après le LCP. Overdrive ≤ 15 Ko, chargé à la demande. Les micro-interactions sont **100 % CSS** : elles fonctionnent avant le chargement du JS.

**CLS :** aucune animation de chargement ne déplace le layout. Les lignes découpées par SplitText ne changent pas les retours à la ligne (`autoSplit`).

**Clavier et lecteurs d'écran :**
- éléments sémantiques : `<button>` pour les déclencheurs, `aria-expanded`, `aria-controls`, `aria-live="polite"` sur le témoignage ;
- SplitText avec son option `aria` (libellé sur le parent, enfants en `aria-hidden`) ;
- échos, pistes dupliquées du marquee et rouleaux en `aria-hidden` ;
- piège à focus et Échap pour le menu.

**WCAG :**
- 2.2.2 : pas d'autoplay du carrousel, marquee arrêtable ou lié au scroll seul ;
- 2.3.1 : aucun flash à plus de 3 par seconde (le rideau rouge ne doit jamais clignoter) ;
- 2.3.3 : le mode réduit couvre les animations déclenchées par une interaction.

**Interruptions à tester :** clics répétés sur « suivant », balayage rapide de la bande d'équipe, ouverture et fermeture du menu en rafale, redimensionnement pendant l'intro, arrivée par une ancre, retour depuis le bfcache.

---

## 9. Stack motion recommandée et architecture du code

### 9.1 Recommandation

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| **Astro (statique, îlots) + TS natif + GSAP (core, ScrollTrigger, SplitText, Flip, CustomEase) + Lenis + CSS** | Zéro JS par défaut ; GSAP gratuit avec tous ses plugins depuis la 3.13 (licence Webflow, à revérifier) ; timelines interruptibles, `matchMedia`, scrub et Flip couvrent **tous** les besoins ci-dessus ; ScrollTrigger fonctionne partout, y compris sur Firefox | 2 dépendances ; discipline de nettoyage nécessaire | ✅ **Recommandé** |
| Astro + Motion (motion.dev), version JS natif | Plus léger ; moteur hybride WAAPI / ScrollTimeline ; ressorts | Pas d'équivalent éprouvé et gratuit de SplitText, Flip ou d'une timeline aussi riche dans le cœur open-source (à vérifier côté Motion+) | Bon second choix si l'on renonce aux masques de lignes |
| React/Next + Motion | `layout` / `layoutId` excellents pour les transitions d'état | Coût d'hydratation inutile pour une landing statique | Non, sauf si le portfolio est déjà en React |
| Vue/Nuxt + GSAP | Pertinent si le portfolio hôte est en Nuxt (VYRON en serait une route) ; GSAP est indépendant du framework | Hydratation | Acceptable ; Astro peut aussi accueillir des îlots Vue |
| Animations CSS liées au scroll uniquement | 0 Ko | Firefox derrière un flag (selon `overdrive.md`, à revérifier sur caniuse au moment du build) ; moins de contrôle | En amélioration progressive pour de petits effets seulement |
| Barba / Swup | — | Redondant avec les View Transitions natives | Non |
| Three.js | — | ≥ 150 Ko pour un seul plan | OGL si O1 |

**Un seul moteur de scroll (ScrollTrigger) et un seul ticker (`gsap.ticker`, qui pilote aussi Lenis)** : pas de mélange entre CSS lié au scroll, Motion et GSAP pour la même famille d'effets.

### 9.2 Architecture proposée du code motion (structure, pas d'implémentation)

```
src/motion/
  tokens.ts        ← SOURCE UNIQUE : easings (tableaux de bézier), durées, pas, plafonds de stagger
                     → génère les variables CSS (--ease-*, --dur-*, --step-*) + CustomEase
  env.ts           ← détection : mouvement réduit, pointeur, capacité GPU, saveData ; pose html.motion
  scroll.ts        ← Lenis + gsap.ticker + ScrollTrigger ; expose velocity/direction ; stop()/start()
  ratchet.ts       ← cliquet global des astérisques (--ratchet)
  registry.ts      ← amorçage paresseux des modules [data-motion="…"], retourne les fonctions de nettoyage
  sections/        ← hero.intro.css (keyframes, sans JS) · hero.scroll.ts · about.ts · services.ts
                     programs.ts · why.ts · testimonial.ts · marquee.ts · footer.ts
  components/      ← stepped.css (polygone + @property --step) · menu.ts · odometer.css/.ts · underline.css
```

**Conventions :**
- des points d'accroche en `data-motion` (pas de classes de style détournées) ;
- chaque module exporte `init(root) => cleanup` ;
- aucune valeur magique hors de `tokens.ts` ;
- tests Playwright de captures en modes « normal » et « réduit » ;
- Lighthouse CI avec un budget LCP/CLS/JS.

---

## 10. Tensions avec le craft-floor et décisions pour l'utilisateur

| # | Tension ou question | Options | Ma recommandation |
|---|---|---|---|
| T1 | Le **kicker** (« ||||| About Us », « WHY VYRON ») est **interdit sans exception** par le craft-floor, mais présent dans la référence | (a) garder, comme le veut la référence, avec les graduations en « compteur de répétitions » ; (b) supprimer, et recycler les graduations en règle de progression (§6) | Votre choix : la règle Impeccable est explicite, mais le brief fige la référence. (b) préserve le motif sans l'étiquette. |
| T2 | **Numéros** (01 / 02 dans les services, 01–04 dans l'accordéon, 01–05 dans l'équipe, 01 du témoignage) : le craft-floor les refuse s'ils ne portent pas d'information | Le compteur du témoignage **informe** (position). Les grands « 01✱ 02✱ » des services sont de la composition. Ceux de l'accordéon et de l'équipe sont décoratifs. | Garder ceux du témoignage et des services ; question ouverte pour l'accordéon et l'équipe |
| T3 | Services : **carrousel** (déduit des mesures) ou grille statique ? Défilement par aimantation ou **piste épinglée** ? | carrousel aimanté + Flip (recommandé) / piste épinglée / grille | Carrousel aimanté |
| T4 | **Mini-barre fixe** avec MENU + téléphone (le mode Persuade veut une action toujours visible) : absente de la référence | oui, avec masquage au scroll et bascule de thème / non | Oui |
| T5 | **Une image par programme** (le « re-rack » de l'image XL) : il faut 4 visuels | oui / image unique | Oui si les assets Higgsfield suivent |
| T6 | **Hauteur du hero** ≈ 1 103 px à 1440 : sur un écran de 900 px, STRENGTH (bas à ≈ 1 030) est **coupé**, et le moment focal se jouerait en partie hors champ | `100svh` (min ≈ 720, max ≈ 1 100) avec la typo ancrée en bas / garder 1 103 | `100svh` |
| T7 | **Sous-pages** (les liens du footer Home / About / Programs / Join / Contact le suggèrent) ? | page unique avec ancres / multi-page avec View Transitions | Page unique pour le portfolio, sauf envie de démontrer O5 |
| T8 | **Marquee** : mouvement autonome ou **lié au scroll seulement** (conforme WCAG 2.2.2 par construction) ? | base de 70 px/s + pause au survol / scroll seul | Base lente + pause au survol |
| T9 | **Niveau d'intensité** : Impeccable veut **un** moment focal ; vous voulez un site « vivant ». Ma réponse : vivant par la **cohérence matérielle et le feedback**, pas par la quantité. | **Niveau 1 « Sobre »** = MUST seulement · **Niveau 2 « Recommandé »** = MUST + SHOULD · **Niveau 3 « Overdrive »** = + O1, O3, O6 | Niveau 2, avec O3 ; O1 en bonus de fin de projet |
| T10 | Display géant (BUILD ≈ 126 px de capitale, soit une police de ≈ 170–180 px ; SERVICES. ≈ 191 px de capitale) au-delà du **maximum de 6rem** du craft-floor | le brief l'emporte (la référence l'exige) | Garder ; le motion s'appuie sur ces masses |
| T11 | Les blocs décalés peuvent se lire comme des « ombres portées dures » (refusées hors néo-brutalisme) | Ce ne sont pas des ombres (union de même couleur). Le comportement physique (soulever / enfoncer) les **justifie** comme objets. | Garder |
| T12 | **Autoplay du témoignage** | non / oui avec pause | Non |

**Besoins d'assets créés par ce plan motion (pour la phase Higgsfield) :**
- photo du hero en haute définition ; la variante striée **se calcule à partir d'elle** (ffmpeg ou sharp, pas d'IA) ;
- 5 portraits **et** 5 photos d'action pour l'équipe ;
- 4 images de programme (si T5) ;
- ≥ 3 visuels de témoignage (ou des vidéos courtes muettes si la lecture « vidéo » est retenue) ;
- 1 photo de footer rouge floue.

---

## 11. Vérifications finales (d'après `animate.md` Verify et `overdrive.md`)

- [ ] Le moment focal « Vitesse → Arrêt » est propre à VYRON. Test de suppression : sans lui, le hero perd son sens, pas seulement une décoration.
- [ ] Chaque autre animation explique un feedback, un état ou une relation ; aucune section ne partage la même entrée qu'une autre ; aucun H2 animé.
- [ ] Interruptions et usage répété (centième clic) : le feedback reste net et sans file d'attente.
- [ ] Ordinateur, mobile et clavier seul : tout est utilisable ; les survols ont leur équivalent au focus.
- [ ] Mode réduit : moins de mouvement, mais les états et le feedback restent lisibles.
- [ ] 60 fps sur mobile milieu de gamme ; LCP non dégradé par l'intro ; CLS = 0 au chargement.
- [ ] Sans JS : la page est complète et lisible.
- [ ] Puis passer la main à `/impeccable polish` pour la passe finale.