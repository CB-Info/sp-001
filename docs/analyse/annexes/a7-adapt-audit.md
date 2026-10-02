> **Annexe brute** : rapport de l’agent `a7-adapt-audit`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).


# VYRON : adaptation responsive, audit technique, durcissement et performance

*Analyste : a7-adapt-audit. Lentilles Impeccable : `adapt`, `audit`, `harden`, `optimize`, avec les garde-fous de `craft-floor` et `animate`. Mode visiteur : **Persuade** (landing page), jugée aussi comme pièce de portfolio.*

> Ce rapport ne contient aucun code du site. Les fragments entre `backticks` sont des valeurs de spécification (tokens, attributs), pas une implémentation.

---

## 0. Méthode, échelles, légende

### 0.1 Facteurs d'échelle (MESURÉS)

| Source | Cadre du site dans l'image | Facteur vers une maquette 1440 px | Fiabilité |
|---|---|---|---|
| `2.png`, `3.png`, `4.png` (1600×1200) | x de 100 à 1499 (**1400 px**), y à partir de 100 | **× 1,0286** | Bonne (±2 px) |
| `1.png` (407×2000, page entière) | x de 20 à 386 (**367 px**) | **× 3,924** | Faible (±10 %), le texte de moins de 14 px est illisible |
| `sections/s*.png` (1.png agrandi × 4, Lanczos) | x de 80 à 1546 | **× 0,981**, les hauteurs mesurées gonflent d'environ 4 px à cause du flou | Faible |

Dans 2, 3 et 4, le fond gris clair (≈ `#E4E2E3`) autour du cadre est la présentation Dribbble, pas le site. En revanche, les bandes « papier millimétré » entre les sections **font partie du site**.

### 0.2 Légende

- **[M] MESURÉ** : relevé au pixel avec PIL/numpy (boîtes englobantes, échantillons de couleur, contours).
- **[E] ESTIMÉ** : dérivé d'une mesure avec une hypothèse explicite. Par exemple, taille de police ≈ hauteur de capitale / 0,70 à 0,73.
- **[I] INFÉRÉ** : déduit de la composition, sans mesure directe possible (comportement, interaction).

### 0.3 Ce qui est illisible (je ne l'invente pas)

Dans `1.png` et `s*.png`, plusieurs textes ne se lisent pas :

- le texte exact des chips du programme ouvert (je suppose « 14 Days · Muscle Building · Power · Progressive Training », [E]) ;
- le paragraphe du footer sous « Back To Home » ;
- le paragraphe de droite de la section Transformation ;
- la ligne sous l'avatar du coach (peut-être « Marcus Roy / 14 Days Training ») ;
- le premier des trois pictos sociaux (Instagram et X sont reconnaissables, le premier non) ;
- les barres des kickers « [||||] About Us / Fitness Programs / Transformation » : le libellé se lit, les barres sont floues.

---

## 1. Mesures de référence, ramenées à une maquette 1440 px

### 1.1 Grille et rythme

| Élément | Shot | 1440 | Statut |
|---|---|---|---|
| Gouttière latérale (bord du cadre au texte) | 58 px | **60 px** (= 4,17 vw) | [M] |
| Largeur de contenu | 1 282 px (de 159 à 1441, rangée équipe) | **1 320 px** | [M] |
| Filets verticaux intérieurs du hero (un cadre dans le cadre) | x = 130 et 1470 | **31 px** depuis le bord | [M] |
| Bande « papier millimétré » | 11 colonnes de 127 px, environ 50 px de haut | 11 × **131 px**, environ 51 px de haut | [M] |
| Bloc millimétré sous le titre Services | 1 283 × 104 px, 11 colonnes | **1 320 × 107**, colonnes de 120 | [M] |
| Hauteur totale de la page | 1 956 px (1.png) | **≈ 7 675 px** | [E] |

### 1.2 Hauteur des sections (1.png × 3,924)

| Section | 1440 | Statut |
|---|---|---|
| Hero | **1 103 px** (1 072 px dans 2.png) | [M] |
| About | ≈ 702 | [E] |
| Services (titre et cartes) | ≈ 1 240 | [E] |
| Programmes | ≈ 1 118 | [E] |
| Why VYRON (sombre) | ≈ 1 209 | [E] |
| Transformation / témoignage | ≈ 1 216 | [E] |
| Bandeau marquee rouge | ≈ 47 | [E] |
| Footer | ≈ 863 | [E] |

### 1.3 Typographie : mesure et taille estimée

| Rôle | Hauteur de capitale (shot) | Taille de police estimée à 1440 | Statut |
|---|---|---|---|
| H1 « BUILD / STRENGTH » | 122 px | capitale 125, donc **≈ 170 à 180 px** (≈ 12,4 vw). Pas de ligne 146 px, soit un **interligne ≈ 0,82** | [M] capitale, [E] taille |
| Retrait de la 2ᵉ ligne du H1 | 209 px | **215 px ≈ 1,2 em** | [M] |
| Largeur de « STRENGTH » | 829 px | **853 px ≈ 4,8 em** (sert au calcul du « fit ») | [M], [E] pour l'em |
| « SERVICES. » | 186 px de capitale, 1 240 de large | capitale 191, largeur **1 275** (97 % du contenu), soit **≈ 260 à 270 px** | [M], [E] |
| « VYRON™ » du footer | environ 161 px (s7) | environ 876 de large, capitale ≈ 158, soit **≈ 220 px** | [E] |
| H2 de section (Services, Why) | 38 px, pas de ligne 55 | capitale 39, soit **≈ 52 à 54 px**, interligne ≈ 1,05 | [M], [E] |
| H2 Programmes, Transformation, Footer | environ 37, 37 et 35 (s*, flou retranché) | **≈ 48 à 52 px** | [E] |
| Déclaration About | environ 22 (s2) | **≈ 30 px**, pas de ligne ≈ 36 | [E] |
| Titres d'accordéon | environ 25 (s4) | **≈ 34 px** | [E] |
| Sous-titre du hero « Redefine Your… » | ascendante 30 px | **≈ 40 px** | [E] |
| Liste du hero « PUMP. REPEAT. … » | 13 à 14 px | **≈ 19 px**, pas de ligne 58,6 | [M], [E] |
| MENU | 10 à 11 px | **≈ 15 px** | [E] |
| Texte des cartes et des colonnes | 11 à 12 px, pas de ligne 20 | **≈ 16 px, interligne 20,5** | [M], [E] |
| Labels en capitales « EXPERT COACHES », kicker mono | 10 à 11 px | **≈ 14 px** | [E] |
| Numéros d'équipe « 01 à 05 », numéros d'accordéon | 7 à 8 px | **≈ 10 à 11 px** (micro-texte) | [M], [E] |
| Citation du témoignage | pas de ligne environ 40 (s6) | **≈ 26 à 28 px** | [E] |

### 1.4 Composants

| Composant | Taille à 1440 | Statut |
|---|---|---|
| Logo VYRON™ | 191 × 34, à environ 27 px du haut | [M] |
| Bouton téléphone (carré blanc à coins décalés) | **39 × 39** | [M] |
| Picto MENU (grille de 9 points) | 13 × 13, libellé ≈ 41 × 10 | [M] |
| Astérisque du hero | 71 × 72 | [M] |
| Filets de la liste du hero | 508 px de long | [M] |
| Repères en croix « + » | rangée à y ≈ 656, espacés de 433 px | [M] |
| Filets de la bande du H1 | y ≈ 741 et 1 047 (bande de 306 px) | [M] |
| Cartes stats About (×3) | ≈ 425 × 241, gouttière ≈ 23 | [E] |
| Bouton « Learn More About Us » | ≈ 239 × 48 | [E] |
| Carte de service active (noire) | **634** de large, ≈ 373 de haut | [M] largeur, [E] hauteur |
| Carte de service inactive (blanche) | au moins 347 (rognée au bord) | [M] |
| Bouton « suivant » des services (carré rouge) | **92 × 92** | [M] |
| Image Programmes | ≈ 517 × 527 | [E] |
| Colonne de l'accordéon | ≈ 725 de large, ligne fermée ≈ 176 de haut | [E] |
| Grille Why (intro et 4 colonnes) | 343 + 4 × **244**, hauteur **293** | [M] |
| Portraits de l'équipe | 4 × **229²** et 1 × **326 × 410** (≈ 4:5), gouttière 21 | [M] |
| Bouton « Meet the Team » | **200 × 45** | [M] |
| Vidéo Transformation (cadre compris) | ≈ 760 × 376 (≈ 2:1) | [E] |
| Barre noire sous la vidéo (progression ?) | ≈ 616 × 13 | [E], [I] |
| Flèches du témoignage | **≈ 37 à 41 px** | [E] |
| Points du carrousel | **≈ 4 à 6 px**, espacés d'environ 16 px | [E] |
| Pictos sociaux | ≈ 45 à 49 px | [E] |
| Panneau rouge « Back To Home » | ≈ 518 × 61 (en-tête du panneau) | [E] |

### 1.5 Couleurs mesurées (tokens candidats)

| Token proposé | Valeur | Où on le voit | Statut |
|---|---|---|---|
| `--red-500` (rouge de marque) | **#F02B42** (240, 43, 66) | SERVICES., boutons, marquee | [M], ±3 par canal (JPEG) |
| `--ink` (titres sur fond clair) | **#0B1024** (11, 16, 36), un noir bleuté | H2 Services | [M] |
| `--night` (fond de Why) | **#040F0E** (4, 15, 14), un noir sarcelle | Why VYRON | [M] |
| `--black` | #000000 | carte de service active, footer | [M] |
| `--paper` et `--paper-2` | #FFFFFF et **#F5F5F5** | About, Programmes, Services | [M] |
| `--grey-600` (texte secondaire sur fond clair) | ≈ #6C6E71 | texte des cartes | [M] |
| `--grey-on-night` (labels sur fond sombre) | ≈ #6C7776 | « EXPERT COACHES », numéros « 01 » | [M] |

---

## 2. Stratégie de breakpoints

### 2.1 Principes

1. **Mobile d'abord.** Les styles de base visent 320 à 599 px. Les requêtes `min-width` sont écrites en **em** pour suivre le zoom, avec la syntaxe d'intervalle `@media (width >= 64em)`.
2. **Les points de rupture viennent du contenu**, relevés sur la maquette et non sur une liste d'appareils :
   - les **4 colonnes de Why** cassent sous environ 1 100 px : sous 200 px par colonne, « PREMIUM EQUIPMENT » passe sur 2 lignes et le texte sur 5 ;
   - la **rangée de 5 portraits** casse sous environ 900 px : chaque portrait passe sous 160 px et le nom bute contre le numéro ;
   - la **déclaration About en 2 colonnes** casse sous environ 960 px : la colonne passe sous 420 px et le texte en capitales fait 5 lignes ou plus ;
   - **Programmes en 2 colonnes** casse aussi sous environ 960 px : les titres d'accordéon à 34 px font 3 lignes ;
   - le **retrait de 1,2 em du H1** casse dès que la largeur de contenu est inférieure à 6 em × la taille de police (voir 2.4).
3. **Paliers retenus.** Les mêmes noms servent dans le CSS, les tokens et le JS (`gsap.matchMedia()`).

| Token | Valeur | Ce qui change |
|---|---|---|
| base | moins de 40em (640) | 1 colonne, empilements, cibles tactiles de 44 px, mots display ajustés à la largeur |
| `--bp-sm` | 40em (640) et plus | grilles 2 colonnes (stats, colonnes Why en 2×2, panneaux du footer) |
| `--bp-md` | 48em (768) et plus | équipe en bento, témoignage plus aéré, en-tête tablette |
| `--bp-lg` | 64em (1024) et plus | layouts 2 colonnes (About, Programmes), Why en 4 colonnes, équipe en 5 colonnes, rail Services avec carte active élargie, retrait du H1 |
| `--bp-xl` | 80em (1280) et plus | composition complète de la maquette (intro Why à gauche, bande millimétrée, repères en croix) |
| plafond | contenu limité à 1 320 px (82,5rem) | au-delà de 1 440, les fonds vont jusqu'aux bords, le contenu reste centré et les mots display sont plafonnés |

4. **Détecter le mode d'entrée, pas la taille d'écran.** Les effets de survol (expansion des portraits, élévation des cartes, curseur) ne s'activent que sous `@media (hover: hover) and (pointer: fine)`. Sous `(pointer: coarse)`, les cibles font au moins 44 px et aucune information ne dépend du survol.
5. **Requêtes de hauteur.** Le hero et le menu plein écran utilisent `svh`, qui reste stable. `dvh` bouge avec la barre d'adresse et provoque des sauts. En paysage mobile (844 × 390, 932 × 430), `@media (height < 30em)` réduit le H1 et retire la liste du hero.
6. **Zones de sécurité.** `viewport-fit=cover` et `env(safe-area-inset-*)` sur l'en-tête, le menu, le footer et une éventuelle barre CTA fixe.

### 2.2 Requêtes de conteneur, là où elles servent vraiment

| Conteneur (`container-type: inline-size`) | Pourquoi |
|---|---|
| `.section__inner` (chaque section) | Les unités **`cqi`** permettent aux mots display de toujours remplir la largeur (« SERVICES. », « VYRON™ ») sans dépendre de la fenêtre ni déborder. |
| `.service-card` | La même carte existe à 347 px (inactive), à 634 px (active) puis à 85 vw sur mobile. La disposition image et description bascule sous `@container (inline-size < 26rem)`. |
| `.team-card` | Petit format (229) ou mis en avant (326). La ligne nom et numéro passe sur 2 lignes sous 14rem. |
| `.stat-card` (About) | Les puces et les avatars se réorganisent selon la largeur réelle de la carte, pas selon la fenêtre. |
| `.footer-panel` | De 265 à 520 px sur desktop, 100 % sur mobile. |
| `.testimonial` | Les contrôles se mettent en ligne ou s'empilent selon la place disponible. |

### 2.3 Tokens fluides (rem + vw, pour respecter le zoom, WCAG 1.4.4)

| Token | Proposition | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| `--gutter` | `clamp(1.25rem, 4.17vw, 3.75rem)` | 20 | 32 | 43 | 60 |
| `--section-pad` | `clamp(4rem, 2.5rem + 5vw, 7.5rem)` | 64 | 78 | 91 | 112 |
| H2 | `clamp(2rem, 1.2rem + 2.9vw, 3.375rem)` | 32 | 42 | 49 | 54 |
| Déclaration About | `clamp(1.5rem, 1.1rem + 0.9vw, 1.875rem)` | 24 | 24,5 | 27 | 30 |
| Titre d'accordéon | `clamp(1.25rem, 0.8rem + 1.8vw, 2.125rem)` | 20 | 27 | 31 | 34 |
| Sous-titre du hero | `clamp(1.25rem, 0.75rem + 2.2vw, 2.5rem)` | 21 | 29 | 34,5 | 40 |
| Citation | `clamp(1.125rem, 0.8rem + 1.3vw, 1.75rem)` | 18 | 23 | 26 | 28 |
| Chiffre de stat (4,9 et 20) | `clamp(2.25rem, 1.6rem + 1.4vw, 2.875rem)` | 36 | 36,5 | 40 | 46 |
| Corps | `1rem` fixe (16 px minimum sur mobile) | 16 | 16 | 16 | 16 |
| Labels et mono | `0.875rem` (au moins 13 px partout) | 14 | 14 | 14 | 14 |
| Micro-numéros | **au moins `0.75rem`** (la maquette est à environ 10 px, voir la décision D8) | 12 | 12 | 12 | 12 |

### 2.4 Grandes capitales : éviter tout débordement

La règle : **taille maximale = largeur de contenu ÷ largeur en em de la ligne la plus longue**. « STRENGTH » mesure environ 4,8 em, et 6,0 em avec le retrait [E, à recalibrer avec la vraie fonte et le vrai texte français].

| Élément | Formule proposée | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| H1 hero sous 1024 (sans retrait) | `clamp(3rem, min(17.5vw, 22svh), 11.5rem)` | **68** | **134** | — | — |
| H1 hero à partir de 1024 (retrait de 1,2 em) | `clamp(3rem, min(12.4vw, 20svh), 11.5rem)` | — | — | **127** | **≈ 178** |
| « SERVICES. » | `20.5cqi` (calé pour 97 % de la largeur) et `white-space: nowrap` | 72 | 144 | 192 | 270 |
| « VYRON™ » du footer | `min(25cqi, 13.75rem)` | 87 | 176 | 220 | 220 |

Vérification à 280 px (écran externe d'un Galaxy Fold) : le H1 à 49 px donne un « STRENGTH » de 235 px pour 240 disponibles, ça tient. Ne **jamais** mettre `overflow-wrap: anywhere` sur ces mots, qui se couperaient en plein milieu.

---

## 3. Plan de réorganisation par section

### 3.1 En-tête et navigation

| | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| Disposition | Logo à gauche (191 × 34), MENU et téléphone à droite, posés sur le hero sans barre | Identique, logo d'environ 160 px | Identique, logo d'environ 140 px | Barre de 64 px : logo ≈ 120 × 21, **MENU en 44 × 44** (picto et libellé), **téléphone en 44 × 44** |
| Au scroll [I : la maquette ne montre pas d'en-tête fixe] | Recommandé : l'en-tête disparaît quand on descend et revient quand on remonte, avec un fond plein (`--night`) une fois sorti du hero | idem | idem | idem, avec `padding-top: env(safe-area-inset-top)` |
| Téléphone | Icône seule avec un nom accessible. Le numéro peut apparaître au survol ou au focus : sur desktop, `tel:` ouvre FaceTime ou Skype, voir le numéro aide | idem | idem | Appel en un geste. C'est le lien le plus utile sur mobile, il reste à côté de MENU |

**Menu plein écran (tous les paliers)** : un `<dialog>` modal ouvert avec `showModal()`.

- **Contenu** : les ancres de la page (À propos, Services, Programmes, Pourquoi VYRON, Témoignages, Contact) en fonte display, taille `clamp(2.5rem, 8vw, 4.5rem)`. S'y ajoutent le téléphone, l'e-mail, les réseaux et la mention « concept ».
- **Fermeture** : un bouton Fermer de 44 × 44, exactement à la place de MENU, pour que la transformation se lise.
- **Mouvement** : le menu se découvre en `clip-path` depuis l'angle du bouton (≈ 400 ms), puis les liens arrivent avec 40 ms d'écart, 300 ms au total au maximum. En mouvement réduit, un simple fondu de 150 ms.
- **Défilement** : à l'ouverture, `lenis.stop()` et `overflow: hidden` sur `html`. Ajouter `scrollbar-gutter: stable` pour que la page ne saute pas de 15 px quand la barre de défilement disparaît sur desktop.

### 3.2 Hero

| | 1440 | 1024 (paysage) | 768 (portrait) | 390 |
|---|---|---|---|---|
| Hauteur | Maquette : 1 103 px [M], donc **plus haute qu'un écran 1440 × 900**. Recommandé : `min-height: max(100svh, 40rem)`, H1 calé en bas | 100svh (768) | 100svh (1024) | 100svh (40rem minimum). En paysage (`height < 30em`), hauteur auto |
| H1 | 2 lignes, retrait de 1,2 em, ≈ 178 px | 127 px, retrait conservé | 134 px, **retrait ramené à 0 à 0,3 em** | 68 px, sans retrait, `text-wrap: balance` |
| Liste « PUMP. REPEAT. … » | Colonne de gauche, 508 px, 4 lignes séparées par des filets | 40 % de la largeur | 60 % de la largeur | **Grille 2 × 2 compacte** (13 à 14 px) juste au-dessus du H1, masquée en paysage mobile |
| Astérisque, repères « + », filets de cadre | Visibles | Visibles | Astérisque réduit à 48 px, repères masqués | Astérisque masqué ou à 40 px. Repères et filets de cadre masqués (ou filets ramenés à 10 px du bord) |
| Sous-titre et 3 flèches | À droite de la 1ʳᵉ ligne du H1, à x ≈ 768 | À droite, 34 px | Sous le H1, aligné à gauche | Sous le H1, 20 à 21 px, flèches conservées (décoratives) |
| Image | Plein cadre, sujet à droite | Recadrage centré à droite | **Recadrage dédié** au format portrait | Recadrage 9:16 ou 4:5, visage dans les 55 % supérieurs, bas de l'image sombre pour le H1 |
| CTA (adaptation proposée, D6) | Bouton principal sous le sous-titre | idem | idem | Bouton pleine largeur en bas du hero, puis barre CTA fixe en bas d'écran après le hero (sous le pouce) |

**Constat mesuré** : la ligne de base de « STRENGTH » est à 1 030 px et celle de « BUILD » à 860 px. Sur un portable 1440 × 900, une fois l'interface du navigateur retirée, il reste environ 800 à 820 px visibles. **Au chargement, aucune des deux lignes du H1 n'est entièrement à l'écran.** La taille du H1 doit donc dépendre aussi de la hauteur (`svh`), pas seulement de la largeur.

### 3.3 About

| | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| En-tête | Kicker sur les colonnes 1 à 6, déclaration sur les colonnes 7 à 12 (elle démarre à ≈ 57 %), puis bouton | 2 colonnes à 50/50 | 1 colonne, déclaration limitée à 32 caractères par ligne | 1 colonne, déclaration à 24 px, bouton de largeur automatique et d'au moins 44 px de haut |
| 3 cartes | 3 × 425 × 241 | 3 × ≈ 306, avec une **`min-height`** et jamais une hauteur fixe, sinon les puces débordent | `grid-template-areas` : « note années » puis « photo photo » (photo en 16:9) | Empilées : note, puis années et puces, puis photo en 4:3 |
| Avatars d'avis | 5 × environ 39 px | idem | idem | 5 × 36 px, sur une seule ligne |

### 3.4 Services

| | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| « SERVICES. » | 20.5cqi (270 px) | 192 px | 144 px | 72 px |
| Accroche et note mono | 2 colonnes (≈ 60 % et 25 %) | idem | Note sous l'accroche | Accroche ≈ 26 px, note mono à 15 px |
| Bloc millimétré | 1 320 × 107, 11 colonnes | 8 colonnes | 6 colonnes, 64 px de haut | 4 colonnes et 48 px, ou masqué |
| Rail de cartes [I : cartes rognées aux bords et bouton « suivant », donc un carrousel] | Rail qui déborde des gouttières, carte active noire de 634, cartes inactives blanches de 347, bouton 92 × 92 | Active 560, inactives 300, bouton 72 × 72 | Cartes égales de **60 vw** au contenu complet (image, texte, numéro, titre), `scroll-snap-type: x mandatory`, boutons précédent et suivant de 48 × 48 et compteur « 02 / 05 » | **Option A (recommandée)** : pile verticale de cartes complètes, la carte au centre de l'écran prenant l'état actif sombre. **Option B** : rail de cartes à 84 vw qui laisse voir 16 vw de la suivante. Décision D3 |
| Carte (requête de conteneur) | Image de 220 px et texte côte à côte | idem | Image en haut (16:9) | Image en haut, numéro en `clamp(3.5rem, 22cqi, 7.5rem)` |

La carte active s'élargit avec `flex-grow` ou la technique FLIP, jamais avec une transition de `width`. Le rail porte `scroll-padding-inline: var(--gutter)` pour que la carte calée reste alignée sur la grille.

### 3.5 Programmes (accordéon)

| | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| Disposition | 2 colonnes. À gauche : titre, texte, bouton, image de 517 × 527. À droite : accordéon de 725 | 5/7, **colonne de gauche en `position: sticky`** pendant que l'accordéon s'ouvre | 1 colonne : titre, texte, bouton, image en bandeau 16:9, accordéon | 1 colonne, image en 4:3 ou placée dans le panneau ouvert (D4) |
| Ligne fermée | ≈ 176 px | ≈ 150 | auto (≈ 110) | auto (≈ 96 à 120), titre de 20 px sur 2 ou 3 lignes |
| Icône +/– | Sur la rangée du numéro, environ 20 px | idem | idem | Icône de 24 px dans une zone tactile de 44 × 44. **Toute la ligne est cliquable** |
| Chips du programme ouvert | Une ligne | `flex-wrap` | `flex-wrap` | `flex-wrap`, mono d'au moins 13 px |
| Coach (avatar et nom) | Sous les chips | idem | idem | idem |

### 3.6 Why VYRON : colonnes de points forts et grille d'équipe

| | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| En-tête | H2 à gauche (743 px de large), note à droite | Note sous le H2 | idem | idem, H2 à 32 px |
| Intro « Results are built… » et 4 colonnes | Intro de 343 et 4 colonnes de 244 sur 293 de haut (le milieu des colonnes est vide) | Intro en pleine largeur au-dessus, 4 colonnes de ≈ 226 avec `min-height: 13rem` | Intro au-dessus, **grille 2 × 2** d'environ 340 de large, hauteur auto | **Liste sur une colonne** : pour chaque ligne, le label en capitales puis le texte, des filets entre les lignes, **sans le vide central** |
| Équipe (5 portraits) | 4 × 229² et 1 × 326 × 410 au centre [I : le portrait survolé s'élargit] | 5 colonnes de ≈ 170. Élargissement au survol et au focus, uniquement sous `hover: hover` | **Bento** : le portrait mis en avant occupe la gauche sur 2 rangées, une grille 2 × 2 à droite | **1 + 4** : portrait mis en avant en pleine largeur (4:5), puis grille 2 × 2 de carrés. Aucun orphelin, pas besoin de carrousel |
| Bloc millimétré sous l'équipe | 465 × 107 | idem | Masqué | Masqué |
| « Meet the Team » | 200 × 45, en bas à droite | idem | Aligné à droite | Pleine largeur, 48 px de haut |

### 3.7 Transformation : vidéo et témoignage

| | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| Composition | Astérisque (colonne d'environ 330), vidéo de 760 × 376, points verticaux | Astérisque de 80 px, vidéo de 600 | Astérisque masqué (ou placé près du H2). Vidéo en pleine largeur en **16:9**, points à l'horizontale sous la vidéo | Vidéo 16:9 de 350 × 197 |
| Témoignage | « 01 » à gauche, nom et citation au centre (≈ 730), flèches à droite | idem | Nom et citation en pleine largeur, contrôles sur une rangée en dessous | Rangée `[‹] 01 / 03 [›]` en 44 × 44, citation de 18 à 20 px |
| Hauteur | Toutes les diapositives sont empilées dans **la même cellule de grille** : la hauteur suit la plus longue, et changer de diapositive ne décale rien (**CLS nul**) | idem | idem | idem |
| Points et compteur [I : deux contrôles pour un même carrousel] | **Les fusionner** en un seul jeu de contrôles (D5) | — | — | Garder seulement le compteur et les flèches |

### 3.8 Bandeau marquee

| 1440 | 1024 | 768 | 390 |
|---|---|---|---|
| 47 px de haut, « Fitness Hub » et astérisque, 14 px | idem | 44 px | 40 px. **Vitesse constante en px/s** (la durée se calcule selon la largeur), pour ne pas défiler trop vite sur mobile. Pause hors écran, bandeau immobile en mouvement réduit |

### 3.9 Footer et ses 3 panneaux

| | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| Haut | H2 à gauche (≈ 48 px), navigation mono sur 2 colonnes à droite | idem, colonnes resserrées | H2 en pleine largeur, navigation sur 2 colonnes dessous | H2 de 32 px, navigation en **grille de 2 colonnes à lignes de 44 px** |
| 3 panneaux | 265, 518 et 520 de large, ≈ 350 de haut | 3 panneaux égaux | « Back to Home » en pleine largeur, puis 2 panneaux à 50 % | Empilés, `min-height: auto` (≈ 160). Chaque panneau est **un seul lien qui couvre toute sa surface** (via un pseudo-élément) |
| Mot-symbole VYRON™ | ≈ 876 de large | `min(25cqi, 13.75rem)` | 176 px | 87 px, en pleine largeur |
| Réseaux | 3 × environ 46, en bas à droite | idem | À droite sur la même ligne de base si la place le permet | Rangée de 3 × 44, 12 px d'écart |
| Photo de fond | Photo à gauche, dégradé vers le noir à droite | idem | Recadrage portrait | Recadrage portrait, **voile plus sombre** (le paragraphe sur la photo est à ≈ 3,4:1 [E]) |
| Bas de page | Non visible dans la maquette | — | — | Mention « Concept de portfolio, salle fictive », crédit au designer d'origine, `padding-bottom: max(1.5rem, env(safe-area-inset-bottom))` |

---

## 4. Audit d'accessibilité (WCAG 2.2 AA) de la maquette telle qu'elle est dessinée

### 4.1 Score de santé prévisionnel (si la maquette était reproduite à l'identique)

| # | Dimension | Score | Constat principal |
|---|---|---|---|
| 1 | Accessibilité | **2/4** | Blanc sur rouge à 4,09:1 sur tous les boutons. Sous-titre du hero à environ 2:1 sur la peau. Points du carrousel d'environ 5 px. Mouvement automatique sans pause |
| 2 | Performance (risque) | **2/4** | Une vingtaine de photos en plein cadre, une vidéo, 3 familles de fontes, un display géant animé. Rien de bloquant, mais tout doit être budgété |
| 3 | Responsive | **1/4** | Seulement desktop : 5 colonnes, 4 colonnes, rail qui déborde, H1 hors écran à 1440 × 900 |
| 4 | Theming | **3/4** | Palette courte et cohérente, facile à mettre en tokens. Il manque un rouge pour le texte qui passe le contraste |
| 5 | Intégrité d'implémentation | **N/A, et 3/4 pour le système de design** | Pas encore de code, donc pas de détecteur à lancer. Les motifs (blocs décalés en escalier, astérisque, filets, kickers mono) sont cohérents. Plusieurs tensions avec le *craft-floor* sont à arbitrer (§ 8) |
| **Total** | | **≈ 11/20** | **Acceptable** : le design tient, l'essentiel du travail porte sur l'adaptation et l'accessibilité |

**Verdict d'intégrité (du dessin, pas du code) : réussi, avec réserves.** Le langage visuel appartient à cette marque : rouge #F02B42 sur noir sarcelle, capitales carrées, grilles millimétrées, astérisque à 8 branches, blocs en escalier. Ce n'est pas un gabarit qu'on retrouverait ailleurs. Les réserves portent sur les kickers, les numéros décoratifs et les ombres décalées (§ 8).

### 4.2 Contrastes mesurés

| Zone | Texte sur fond | Ratio | Taille | Verdict AA |
|---|---|---|---|---|
| Liste du hero (PUMP…, DIG…) | #FEE0DF sur rouge de la photo (140–179, 5–23, 8–27) | 5,5 à 7,9:1 | environ 19 px | ✅ [M] |
| **Sous-titre « Redefine Your… »** | #F8ECE4 sur peau éclairée (196–198, 146–163, 133–153) | **1,98 à 2,32:1** | environ 40 px (grand texte, 3:1 requis) | ❌ par endroits [M] |
| H1 « BUILD » | blanc sur photo (médiane #280100, et les 2 % de pixels les plus clairs) | plus de 15:1 en médiane, mais **2,9:1** sur le bras | 178 px | ⚠️ zone à risque [M] |
| Flèches rouges du hero | #CA384B sur #3E0000 | 3,47:1 | décoratives | ✅ (élément non textuel et décoratif) [M] |
| MENU | blanc sur rouge de la photo | 7,96:1 | environ 15 px | ✅ [M] |
| « SERVICES. » | #F02B42 sur #F5F5F5 | 3,74:1 | 270 px | ✅ en grand texte [M] |
| **Petit texte rouge** (kickers, « 01 » d'accordéon, « 01 » du témoignage) | #F02B42 sur #FFF ou #F5F5F5 | **4,09 ou 3,74:1** | 10 à 14 px | ❌ [M] |
| **Blanc sur rouge** (Meet the Team, View All Programs, Back To Home, marquee, carte 4,9/5) | #FFF sur #F02B42 ou #EF2A41 | **4,09 à 4,14:1** | 14 à 16 px | ❌ [M] |
| Note mono « Trusted by… » | #6C6C6F sur #F5F5F5 | 4,79:1 | environ 15 px | ✅ de justesse [M] |
| Texte de carte (fond clair) | #6D6E71 sur #FFF | 5,08:1 | 16 px | ✅ [M] |
| Texte de carte (fond noir) | #A1A1A1 sur #000 | 8,15:1 | 16 px | ✅ [M] |
| H2 sur fond clair | #0B1024 sur #F5F5F5 | 17,3:1 | 54 px | ✅ [M] |
| H2 sur fond nuit | #FFF sur #040F0E | 19,5:1 | 54 px | ✅ [M] |
| Kicker « WHY VYRON » | #95A09F sur nuit | 7,23:1 | environ 14 px | ✅ [M] |
| **Labels « EXPERT COACHES… »** | #6C7776 sur nuit | **4,22:1** | environ 14 px | ❌ de peu [M] |
| Texte des colonnes et note | #CBD6D5 et #9DA8A7 sur nuit | 13,0 et 8,0:1 | 15 à 16 px | ✅ [M] |
| « Results are built, not given. » | #F02B42 sur #040F0E | 4,75:1 | environ 25 px | ✅ [M] |
| Noms de l'équipe | #C7D2D1 sur nuit | 12,6:1 | 15 px | ✅ [M] |
| **Numéros d'équipe « 01 à 05 »** | #67726F sur nuit | **3,92:1** | **environ 10 px** | ❌ [M] |
| Citation du témoignage | ≈ #656565 sur #FCFCFC | ≈ 5,7:1 | 27 px | ✅ [E] |
| Petits paragraphes gris (texte Programmes, droite de Transformation, chips, puces About) | gris clair sur blanc | 1,8 à 3,3:1 mesurés dans 1.png | 11 à 14 px | ⚠️ **à vérifier** : le flou de 1.png fait baisser le ratio mesuré. Le gris réel est probablement celui des cartes, à environ 5:1 [E] |
| Paragraphe du footer sur la photo | ≈ #726F70 sur photo sombre | ≈ 3,4:1 | environ 13 px | ⚠️ échec probable [E] |

**Correctifs calculés, sans abîmer la marque :**

- **Un rouge pour le texte et pour les surfaces qui portent du petit texte blanc** : `--red-600: #E3293F` (4,51:1 avec le blanc) ou **`#D8273B`** (4,5:1 en texte sur #F5F5F5, 4,9:1 avec le blanc). C'est la même teinte, plus sombre de 6 à 10 %, et l'écart se voit à peine. Le #F02B42 reste réservé au display, aux astérisques, aux grandes surfaces sans texte et aux grands chiffres (D7).
- **Garder le rouge actuel** reste possible : il faut alors des libellés de bouton en gras d'au moins 18,66 px, qui comptent comme grand texte (3:1 suffit). Le rendu devient plus lourd.
- **Gris sur fond nuit** : passer les labels de #6C7776 à **#737E7D au minimum** (4,64:1), ou mieux à #7A8584 (environ 5:1).
- **Sous-titre et H1 du hero** : un voile dégradé sous la bande de texte (de transparent à `rgb(0 0 0 / .55)`), et/ou une image Higgsfield générée avec une **zone sombre prévue** derrière le sous-titre. À recontrôler sur l'image finale.

### 4.3 Micro-texte

Plusieurs éléments descendent sous 12 px à 1440 : les numéros d'équipe, les numéros d'accordéon et les chips mono (environ 10 à 12 px). WCAG n'impose pas de taille minimale, mais Impeccable demande 16 px pour le corps et 14 px pour le secondaire.

**Recommandation :**
- au moins 12 px pour les numéros purement décoratifs, masqués aux lecteurs d'écran ;
- 13 à 14 px pour tout ce qui a du sens (chips, labels, navigation mono du footer).

### 4.4 Focus visible

- **Le risque.** Un anneau de focus rouge sur un bouton rouge, ou blanc sur fond blanc, ne se voit pas. Or la maquette alterne blanc, gris, rouge, noir et nuit.
- **La spécification :**
  - Un token `--focus` redéfini selon la surface : `--ink` sur `[data-surface="light"]`, blanc sur les surfaces `dark` et `red`.
  - L'anneau est tracé **avec `outline`, jamais avec `box-shadow`**, car l'ombre disparaît en mode contrastes forcés. Valeurs : `outline: 2px solid var(--focus); outline-offset: 3px`.
  - Sur les surfaces rouges, un double anneau (outline blanc et liseré `--ink`) se voit sur tous les fonds.
- **WCAG 2.4.11 *Focus Not Obscured* (AA, nouveau en 2.2).** L'en-tête fixe ne doit jamais cacher l'élément qui a le focus. Il faut un `scroll-padding-top` égal à la hauteur de l'en-tête, et Lenis doit laisser passer les `scrollIntoView` que déclenche la navigation au clavier.
- **Les éléments natifs du navigateur se thématisent aussi** (craft-floor) :
  - `::selection` : fond `--red-600`, texte blanc ;
  - `caret-color`, `accent-color`, `text-underline-offset` et la barre de défilement ;
  - **`font-variant-numeric: tabular-nums`** sur les compteurs (« 01 / 03 », « 4,9 », « 20 », « 480+ »), pour que les chiffres ne sautillent pas pendant les animations de comptage.

### 4.5 Composants interactifs

**Accordéon (Programmes).** Suivre le pattern APG : `<h3><button aria-expanded aria-controls>…</button></h3>`, avec un panneau `hidden="until-found"` et l'événement `beforematch`, pour que la recherche dans la page (Ctrl+F) ouvre le bon panneau.

- **Pourquoi pas `<details name>` :** un titre placé dans `<summary>` perd sa nature de titre, car le résumé est un bouton. Il disparaît alors de la navigation par titres. `<details>` reste un repli correct si l'on veut zéro JS (D10).
- **Sans JS :** tous les panneaux sont visibles, le script les referme au démarrage.
- **Icône +/– :** en `aria-hidden`, l'état passe par `aria-expanded`. Comme dans la maquette, le premier élément est ouvert par défaut.
- **Animation de hauteur :** `grid-template-rows` de `0fr` à `1fr`, ou `interpolate-size: allow-keywords` en amélioration progressive (support récent, à vérifier sur caniuse). Pas de mesure de hauteur en JS, ce qui est meilleur pour l'INP.

**Carrousels** (témoignages, et Services si l'option B est retenue). Suivre le pattern APG Carousel.

- **Structure :** `role="region"`, `aria-roledescription="carrousel"` et `aria-label="Témoignages clients"`. Chaque diapositive porte `role="group"`, `aria-roledescription="diapositive"` et `aria-label="1 sur 3"`.
- **Contrôles et annonce :** Précédent et Suivant sont des `<button>` avec un nom (« Témoignage suivant »). Une zone `aria-live="polite"` annonce le changement, **seulement après une action de l'utilisateur**. Les diapositives inactives sont `inert`.
- **Pas d'autoplay, de préférence.** S'il y en a un :
  - un bouton pause en tête de l'ordre de tabulation ;
  - l'arrêt au survol et au focus ;
  - `aria-live="off"` pendant la rotation.
- **Points :** si on les garde, chacun est un `<button aria-label="Afficher le témoignage 2">`, l'actif porte `aria-current="true"`. La **zone cliquable fait au moins 24 × 24** (44 recommandé), par padding ou pseudo-élément. À environ 5 px avec 16 px d'écart, la maquette échoue au critère 2.5.8.
- **WCAG 2.5.7 *Dragging Movements* (AA, nouveau en 2.2) :** tout glissement doit avoir une alternative en un seul clic ou tap. Les flèches y répondent.

**Menu plein écran.** Un `<dialog>` modal fournit nativement le fond `inert`, le piège de focus et la touche `Esc`. À la fermeture, le focus revient au bouton qui l'a ouvert.

- **Bouton d'ouverture :** `<button aria-expanded aria-controls>` avec le texte visible « Menu ».
- **Sans JS :** MENU est d'abord un lien `<a href="#plan-du-site">` vers la navigation du footer. Le script le transforme ensuite en bouton.
- **Mouvement réduit :** ouverture en fondu, sans déplacement.

**Vidéo (Transformation).** Deux cas à trancher (D5) :

- **(a) Boucle décorative muette.**
  - `muted playsinline loop preload="none"` et un `poster`.
  - Lecture seulement quand la vidéo est à l'écran (IntersectionObserver) et hors mouvement réduit.
  - **Bouton pause visible** : le critère 2.2.2 veut qu'on puisse arrêter tout ce qui bouge plus de 5 secondes.
  - Piste audio retirée.
- **(b) Témoignage parlé.**
  - `controls` et **sous-titres WebVTT** (`<track kind="captions" srclang="fr" default>`, critère 1.2.2).
  - Une transcription en lien.
  - Jamais d'autoplay avec le son.
- **Dans les deux cas :** si la barre noire sous la vidéo (≈ 616 × 13) est une barre de progression, elle devient un vrai curseur accessible. Sinon, elle reste décorative, en `aria-hidden`.

**Marquee.** Le bandeau entier est en `aria-hidden="true"` : il est décoratif, et ses copies répétées feraient du bruit au lecteur d'écran. Le critère 2.2.2 exige quand même un moyen de le mettre en pause, et le survol ne suffit pas (ni au clavier, ni au tactile).

- **Interrupteur global** « Mettre les animations en pause », dans le footer et dans le menu. Il arrête le marquee, la vidéo et l'éventuel autoplay. Le choix est mémorisé dans `localStorage`, avec un try/catch.
- **Mouvement réduit :** une seule copie, immobile.

**Motifs décoratifs** (astérisques, croix « + », filets de cadre, « codes-barres » rouges des kickers, bandes millimétrées, blocs en escalier, flèches « → → → », mot-symbole géant du footer) :

- en `aria-hidden="true"`, ou mieux en pseudo-éléments et fonds CSS ;
- l'astérisque devient **un seul symbole SVG réutilisé avec `<use>`**, pas un caractère Unicode (règle du *craft-floor*).

**Textes alternatifs.**

| Image | `alt` recommandé | Pourquoi |
|---|---|---|
| Photo du hero | `""` | Elle porte l'ambiance, le message est dans le H1 |
| Photo du coach (About) | `""`, ou court : « Coach VYRON dans la salle » | Illustrative |
| 5 avatars d'avis | `""`, avec un vrai texte « Plus de 480 avis vérifiés » | Évite « image, image, image… » |
| Vignettes des services | `""` | Le titre de la carte est juste à côté |
| Image Programmes | `""` | Décorative |
| Portraits d'équipe | `""`, avec un `<figcaption>` (nom et spécialité) | Évite de lire le nom deux fois, la légende fait foi |
| Vidéo | Un nom accessible, et une transcription si elle est parlée | — |
| Logo VYRON™ | Lien nommé « VYRON, accueil » (`aria-label`) | Évite « V-Y-R-O-N marque déposée » |
| Pictos sociaux | « VYRON sur Instagram », etc., avec le SVG en `aria-hidden` | — |

Les images générées avec Higgsfield montrent des **personnes fictives**. Les `alt` doivent décrire l'image finale telle qu'elle est, pas le prompt. Le portfolio doit dire que les visages sont générés.

**Ordre des titres et zones de la page.**

```
<a class="skip">Aller au contenu</a>
<header> (banner) : logo, bouton Menu, lien téléphone
<main id="contenu">
  h1  Forge ta force                      (hero ; la liste des slogans est une <ul>, pas des titres)
  h2  Déclaration About                   (kicker en <p>, barres en aria-hidden)
  h2  Services                            (accroche en <p class="lead">), puis un h3 par carte
  h2  Trouve le bon programme             puis un h3 > button par élément d'accordéon
  h2  Pensé pour ceux qui…                puis un h3 par point fort ; « Results are built » en <p><strong>
      h3 (masqué visuellement) L'équipe   puis une <ul> de <figure>
  h2  De vraies transformations           région carrousel ; <figure><blockquote> et <figcaption>
<footer> (contentinfo) : h2 « Réinventer la culture du fitness », <nav aria-label="Pied de page">
```

La page est en `<html lang="fr">`. Les mots anglais conservés (« Fitness Hub ») portent `lang="en"`. Le mot-symbole géant du footer n'est **pas** un titre.

**Capitales.** Écrire le texte en casse normale et appliquer `text-transform: uppercase`. Certains lecteurs d'écran épellent un mot tapé en capitales comme un sigle, et le copier-coller reste propre. Avec `lang="fr"`, les capitales accentuées sont correctes (é donne É).

**Tailles des cibles.**

| Cible | Taille à 1440 | Minimum AA de 24 px (2.5.8) | 44 px recommandés |
|---|---|---|---|
| MENU | visuel de 13 px, plus le libellé de 41 × 13 | ⚠️ zone à agrandir | Zone de 44 × 44 obligatoire |
| Téléphone | 39 × 39 [M] | ✅ | ⚠️ 44 en `pointer: coarse` |
| Bouton suivant des services | 92 × 92 [M] | ✅ | ✅ |
| Flèches du témoignage | ≈ 37 à 41 [E] | ✅ | ⚠️ 44 au tactile |
| **Points du carrousel** | **≈ 4 à 6, espacés de 16** [E] | ❌ | ❌ |
| Lignes de l'accordéon | toute la ligne, ≈ 176 de haut | ✅ | ✅ |
| Liens mono du footer | espacés d'environ 40 | ✅ grâce à l'espacement | ⚠️ zone de 44 sur mobile |
| Réseaux | ≈ 45 à 49 | ✅ | ✅ |
| Boutons Meet, Learn, View | 45 à 48 de haut | ✅ | ✅ |

**Effets de bord du défilement doux (Lenis).**

1. Retirer `scroll-behavior: smooth` du CSS, qui entre en conflit avec Lenis.
2. Ancres :
   - Lenis bloque les liens d'ancre tant que l'option `anchors: true` n'est pas activée (documentation Lenis).
   - Il faut en plus **déplacer le focus** sur la cible : `tabindex="-1"`, puis `focus({ preventScroll: true })`.
   - Sinon, le lien d'évitement et « Retour en haut » font défiler la page sans emmener le focus clavier.
3. Avec `prefers-reduced-motion: reduce`, **ne pas démarrer Lenis du tout**. L'inertie du défilement suffit à gêner les personnes sensibles au mouvement.
4. Au tactile, garder `syncTouch: false` (la valeur par défaut) pour conserver l'inertie native.
5. Zones qui défilent à l'intérieur de la page (menu, rail horizontal, transcription) : `data-lenis-prevent`. Menu ouvert : `lenis.stop()`.
6. Avec ScrollTrigger :
   - une seule boucle d'animation, Lenis étant piloté par `gsap.ticker` avec `autoRaf: false` ;
   - `lenis.on('scroll', ScrollTrigger.update)`.
7. Le clavier (Espace, Page suivante, flèches) et la recherche dans la page restent natifs. Vérifier que Lenis ne lisse pas ces sauts après coup.

**Mouvement et sécurité.**

- **Ni effet glitch ni clignotement rouge/noir.** Le seuil de flash rouge du critère 2.3.1 (plus de 3 flashs par seconde) est particulièrement sensible avec un rouge aussi saturé.
- La parallaxe et les mouvements liés au scroll se coupent en mouvement réduit (2.3.3, critère AAA, mais recommandé).
- Le mouvement réduit **réduit sans tout effacer** (règle d'`animate`) :
  - on garde les fondus de changement d'état (accordéon, menu, carrousel) ;
  - on retire les déplacements, la parallaxe, le marquee et la vidéo.

**Zoom, reflow et espacement du texte.**

- **1.4.10 *Reflow* :** à 320 px, pas de défilement horizontal en dehors des rails prévus. Les mots display en `cqi` le garantissent.
- **1.4.4 *Resize text* :** une taille en `vw` pur ne grossit pas avec le zoom du texte. D'où les `clamp()` qui contiennent une part en **rem** (§ 2.3).
- **1.4.12 *Text Spacing* :**
  - aucune hauteur fixe sur un conteneur de texte ;
  - les masques de ligne (`overflow: clip`) utilisés pour faire apparaître les titres couperaient le texte si l'utilisateur augmente l'interligne ;
  - on retire donc le masque une fois l'animation finie.
- **Mode contrastes forcés** (`forced-colors: active`) : les blocs en escalier et les fonds rouges disparaissent. Il faut donc :
  - des **bordures** sur les boutons et les cartes ;
  - des SVG en `currentColor` ;
  - un focus en `outline`.

### 4.6 Problèmes classés par gravité

**[P0] Pas de version mobile ni tablette.** Toute la maquette est pensée pour le desktop.
- *Où :* toutes les sections.
- *Impact :* la majorité du trafic est mobile (critère 1.4.10).
- *Correctif :* § 2 et § 3.
- *Commande :* `/impeccable adapt`.

**[P1] Blanc sur rouge à 4,09:1.**
- *Où :* boutons, marquee, panneau du footer, carte 4,9/5.
- *Critère :* 1.4.3.
- *Correctif :* `--red-600` (§ 4.2).
- *Commande :* `/impeccable colorize`.

**[P1] Sous-titre du hero à 2,0 à 2,3:1 sur la peau.**
- *Critère :* 1.4.3 (grand texte, 3:1 requis).
- *Correctif :* voile, et zone sombre prévue dans l'image générée.
- *Commande :* `/impeccable colorize`, puis `/impeccable layout`.

**[P1] Mouvement automatique sans pause.**
- *Où :* marquee, vidéo, éventuel autoplay.
- *Critère :* 2.2.2.
- *Correctif :* interrupteur global et mouvement réduit.
- *Commande :* `/impeccable animate`.

**[P1] Points du carrousel sous 24 px.**
- *Critère :* 2.5.8.
- *Correctif :* zone cliquable de 24 à 44 px, ou suppression au profit du compteur.
- *Commande :* `/impeccable adapt`.

**[P1] Focus non prévu, invisible sur le rouge.**
- *Critères :* 2.4.7 et 2.4.11.
- *Correctif :* tokens `--focus` par surface, tracés en `outline`.
- *Commande :* `/impeccable harden`.

**[P1] H1 hors écran au chargement à 1440 × 900.**
- *Impact :* en mode Persuade, le message principal n'est pas visible.
- *Correctif :* hero dimensionné en `svh` (§ 3.2).
- *Commande :* `/impeccable layout`.

**[P1] Pas d'action principale dans le hero.**
- *Où :* seule l'icône téléphone est cliquable.
- *Impact :* le mode Persuade demande une action visible.
- *Correctif :* D6.
- *Commande :* `/impeccable clarify`.

**[P2] Gris sur fond nuit à 4,22:1.**
- *Où :* labels « EXPERT COACHES… ».
- *Critère :* 1.4.3.
- *Commande :* `/impeccable colorize`.

**[P2] Numéros rouges et gris à 3,7 à 3,9:1, et à environ 10 px.**
- *Où :* accordéon, équipe, témoignage.
- *Correctif :* `aria-hidden` s'ils sont décoratifs, sinon au moins 12 px et un contraste d'au moins 4,5:1.
- *Commande :* `/impeccable typeset`.

**[P2] Élargissement des portraits d'équipe au survol seulement [I].**
- *Critère :* 1.4.13, si du contenu apparaît au survol.
- *Correctif :* même effet au focus, et rien au tactile.
- *Commande :* `/impeccable adapt`.

**[P2] Interligne display de 0,82 avec les accents français.**
- *Correctif :* § 6.2.
- *Commande :* `/impeccable typeset`.

**[P3] Liens sans destination dans une démo d'une seule page.**
- *Où :* « Join Now », « Contact Us », « Meet the Team », « View All Programs », « Explore Classes ».
- *Correctif :* des ancres, ou un état « bientôt » affiché clairement. Jamais `href="#"`.
- *Commande :* `/impeccable harden`.

**[P3] Données fictives présentées comme réelles.**
- *Où :* 4,9/5, plus de 480 avis, 20 ans d'existence.
- *Correctif :* mention « concept », et jamais de balisage `AggregateRating`.
- *Commande :* `/impeccable clarify`.

**Problèmes de fond :**
1. Le rouge de marque sert à la fois au display et au petit texte. Il faut **deux rôles de rouge**.
2. Les petits libellés mono et les numéros sont trop petits et trop pâles, sur les deux types de fond.
3. Plusieurs interactions ne sont qu'implicites (survol de l'équipe, carte de service « active », double contrôle du carrousel). Il faut les préciser avant de coder.

**Ce qui marche :**
- Le contraste des titres (17 à 19:1) et du texte courant (5 à 13:1) est excellent.
- La hiérarchie typographique est nette, avec des écarts de taille francs.
- La palette est courte (environ 7 tokens).
- Les motifs récurrents (astérisque, escalier, filets) se déclinent facilement en composants.
- Les cibles sont grandes là où il faut agir : bouton suivant de 92 px, lignes d'accordéon de 176 px, réseaux de 46 px.
- Presque aucun texte n'est dans une image : tout est du vrai texte.

---

## 5. Plan de performance

### 5.1 LCP (Largest Contentful Paint)

- **Élément LCP attendu :** l'image du hero, sur desktop comme sur mobile, car c'est la plus grande surface. Si l'image arrivait tard, ce serait le H1.
- **Image du hero :**
  - un vrai `<img>` dans un `<picture>`, **pas un `background-image` CSS** ;
  - avec le composant Astro `<Picture … priority>` (depuis Astro 5.10), on obtient `loading="eager"` et `fetchpriority="high"` ;
  - ni lazy-loading ni JS pour l'afficher.
- **Pas d'écran de chargement, et pas de fondu depuis l'opacité 0 sur le H1 ou l'image.** Chrome ne retient pas un élément à opacité 0 comme candidat LCP : une intro qui part de 0 retarde le LCP d'autant.
  - L'intro du hero anime une image **déjà visible** : ouverture en `clip-path`, `scale` de 1,08 à 1.
  - Le H1 apparaît ligne par ligne derrière un masque, en moins de 800 ms.
- **Découpage du H1 en lignes :** seulement après `document.fonts.ready` (option `autoSplit` de SplitText), sinon un nouveau découpage décale la mise en page (CLS).

### 5.2 Images

| Image | Formats | Largeurs `srcset` | `sizes` | Budget (estimé) |
|---|---|---|---|---|
| Hero desktop | AVIF et WebP (JPEG en repli) | 1080, 1440, 1920, 2560, 2880 | `100vw` | 150 Ko au plus (AVIF 1440 w) |
| Hero mobile (recadrage portrait via `<source media>`) | AVIF et WebP | 390, 640, 828, 1170 | `100vw` | 80 Ko au plus (828 w) |
| Portraits d'équipe | AVIF et WebP | 240, 360, 480, 720 | `(width >= 64em) 17vw, (width >= 48em) 33vw, 50vw`, et `100vw` pour le portrait mis en avant sur mobile | 35 Ko au plus chacun |
| Cartes About et Programmes | AVIF et WebP | 400, 640, 960 | `(width >= 64em) 30vw, (width >= 40em) 50vw, 100vw` | 60 Ko au plus |
| Vignettes des services | AVIF et WebP | 240, 480 | `(width >= 64em) 15rem, 40vw` | 25 Ko au plus |
| Fond du footer | AVIF et WebP, recadrage portrait sur mobile | 640, 1080, 1440, 1920 | `100vw` | 120 Ko au plus |
| Textures (trame de la carte rouge, bandes millimétrées) | **CSS** (`repeating-linear-gradient`, motif SVG) | — | — | 0 octet |
| Astérisques, flèches, pictos | **Sprite SVG intégré à la page**, avec `<use>` | — | — | moins de 3 Ko |

- **Pour toutes les images :**
  - `width` et `height` (ou `aspect-ratio`) ;
  - `loading="lazy"` et `decoding="async"` sous la ligne de flottaison ;
  - une couleur de fond d'attente prise dans les tokens (`--night`, ou un rouge sombre pour les photos teintées).
- **Génération avec Higgsfield :**
  - générer en **2 880 px de large au moins**, ou agrandir ensuite ;
  - prévoir des **zones de sécurité** pour le texte. Hero : sujet à droite du centre, coin bas-gauche sombre pour le H1. Mobile : une deuxième version en 4:5 ou 9:16, visage dans le tiers supérieur ;
  - exporter en PNG ou JPEG de haute qualité. Astro produit l'AVIF et le WebP au moment du build.

### 5.3 Fontes

- **Probablement 3 familles :** une display carrée, une grotesque sans pour le texte et une mono pour les labels. Voici la charge maximale :

| Famille | Graisses | Préchargement | `font-display` |
|---|---|---|---|
| Display | 1 graisse (2 au maximum) | **Oui** (le H1 est au-dessus de la ligne de flottaison) | `swap` |
| Sans | 400 et 500 | **Oui**, pour la 400 | `swap` |
| Mono | 400 | Non | `swap` |

- **Hébergement :**
  - toutes les fontes sont servies par le site en WOFF2, sans passer par le CDN Google ;
  - l'**API Fonts d'Astro** fournit `fontProviders.local()`, `<Font cssVariable … preload />` et des polices de repli ajustées automatiquement (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) ;
  - la documentation actuelle la présente dans l'option `fonts` de la configuration ; vérifier son statut dans la version installée.
- **Sous-ensemble : latin, Latin-1 et les caractères du français.** À vérifier glyphe par glyphe dans la fonte display, souvent incomplète :
  - lettres accentuées : `É È Ê Ë À Â Ç Î Ï Ô Ù Û Ü`, ainsi que `Œ œ` ;
  - ponctuation : `’ « » … – —` ;
  - **espace fine insécable U+202F** et espace insécable U+00A0 ;
  - **™ U+2122** pour « VYRON™ ».

  Chaque fichier ainsi réduit pèse environ 15 à 30 Ko, **110 Ko au total au maximum** [E].
- **Décalage dû aux fontes (CLS) :** les polices de repli ajustées le ramènent presque à zéro. Pour la display carrée, très différente d'Arial, **régler `size-adjust` sur la largeur** de « STRENGTH » et de « SERVICES. ».

### 5.4 Budget JS (un seul moteur d'animation)

| Brique | Poids gzip (ordre de grandeur, à mesurer) | Statut |
|---|---|---|
| GSAP core | ≈ 25 à 28 Ko | [E] |
| ScrollTrigger | ≈ 12 à 16 Ko | [E] |
| SplitText | ≈ 5 à 7 Ko | [E] |
| Lenis | ≈ 4 à 5 Ko | [E] |
| Code du site (menu, carrousel, accordéon, vidéo, démarrage des animations) | ≈ 6 à 10 Ko | [E] |
| **Total visé** | **60 à 65 Ko gzip au plus au premier chargement** | Objectif |

- **Ne pas embarquer GSAP et Motion en même temps.**
  - Motion en vanilla (`animate`, `inView`, `scroll`, environ 18 Ko) suffit si le *motion thesis* ne demande ni timelines complexes ni découpage du texte.
  - Une île React ajouterait environ 45 Ko (react-dom) sans utilité sur une landing statique.
  - Astro avec du TypeScript vanilla reste le plus léger.
- **Organisation :**
  - scripts Astro (modules différés) ;
  - `gsap.matchMedia()` pour les paliers et le mouvement réduit (rien n'est créé en `reduce`) ;
  - ScrollTrigger et SplitText chargés une seule fois ;
  - `revert()` au changement de palier.
- **INP :**
  - pas de lecture de la mise en page dans les gestionnaires de scroll (utiliser `gsap.quickSetter` ou des transforms) ;
  - accordéon sans mesure en JS ;
  - aucune tâche de plus de 50 ms au clic.

### 5.5 CSS, chargement différé, vidéo

- **CSS :**
  - 25 Ko gzip au plus ; Astro intègre les petites feuilles directement dans la page (`build.inlineStylesheets: 'auto'`) ;
  - `contain: layout paint` sur les rails et les cartes animées ;
  - **prudence avec `content-visibility: auto`** sur les sections suivies par ScrollTrigger, car les positions mesurées deviennent approximatives. À réserver au footer s'il n'a aucun déclencheur.
- **Chargement différé :**
  - tout ce qui suit le hero est en lazy-loading natif ;
  - carrousels et vidéo s'initialisent à leur première apparition à l'écran (IntersectionObserver, marge de 200 px).
- **Vidéo :**
  - encodage en MP4 H.264 et en WebM (VP9 ou AV1), **en 720p**, 8 à 12 secondes, **2,5 Mo au plus**, sans piste audio si elle est décorative ;
  - `preload="none"`, et un `poster` en WebP ou JPEG ;
  - pas de lecture en mouvement réduit ni avec `navigator.connection.saveData` : on affiche le poster et un bouton lecture ;
  - pause quand la vidéo sort de l'écran ou quand l'onglet est caché (`visibilitychange`).

### 5.6 Objectifs

| Indicateur | Cible en labo (Lighthouse mobile, 4G lente) | Cible sur le terrain (75ᵉ percentile) |
|---|---|---|
| LCP | 1,8 s au plus | 2,5 s au plus |
| INP | — (TBT de 150 ms au plus) | 150 ms au plus |
| CLS | 0,05 au plus | 0,05 au plus |
| FCP | 1,2 s au plus | — |
| Poids au-dessus de la ligne de flottaison | 400 Ko au plus | — |
| Page complète hors vidéo | 1,8 Mo au plus | — |
| Lighthouse | Performance d'au moins 90 sur mobile (95 visé) et 98 sur desktop. Accessibilité, Bonnes pratiques et SEO à **100** | — |

- **Contrôles automatiques :** Lighthouse CI dans GitHub Actions avec un `budget.json` qui fait échouer la CI au-delà du budget. axe-core et Pa11y CI à 0 violation.
- **Poids du JS :** l'inspecter visuellement avec `rollup-plugin-visualizer`.
- **Appareils :** WebPageTest sur un Android de milieu de gamme, puis un test réel sur iPhone Safari et sur un Android d'entrée de gamme (Impeccable rappelle que Chromium n'est pas Safari).
- **Avant et après chaque animation ajoutée :** onglet Performance, 60 images par seconde au scroll, couches de composition, et `will-change` posé seulement pendant l'animation.

---

## 6. Durcissement

### 6.1 Le texte français : ce qui casse en premier

| Composant | Anglais (caractères) | Proposition en français (caractères) | Écart | Risque et parade |
|---|---|---|---|---|
| Titres d'accordéon | IMPROVE WITH FUNCTIONAL TRAINING (32) | PROGRESSE GRÂCE À L'ENTRAÎNEMENT FONCTIONNEL (44) | **+38 %** | **Casse en premier** : à 1440, le titre anglais occupe déjà 711 des 725 px [E]. On accepte 2 lignes, avec `text-wrap: balance` et l'icône dans une colonne `auto` réservée |
| Labels Why | 24/7 ACCESS (11) | ACCÈS 24 H/24, 7 J/7 (20) | **+82 %** | Une colonne de 244 moins 40 de marge, donc 2 lignes. Jamais de `nowrap` |
| Labels Why | PREMIUM EQUIPMENT (17) | ÉQUIPEMENT HAUT DE GAMME (24) | +41 % | idem |
| Boutons | Meet the Team (13), View All Programs (17) | Rencontrer l'équipe (19), Voir tous les programmes (24) | +46 %, +41 % | Largeur selon le contenu (`padding-inline`). **Les blocs en escalier suivent la largeur** : pseudo-éléments en `inset`, sans largeur fixe |
| H2 Why | BUILT FOR THOSE WHO DON'T COMPROMISE ON FITNESS (47) | PENSÉ POUR CELLES ET CEUX QUI NE TRANSIGENT PAS SUR LEUR FORME (62) | +32 % | 3 lignes à 1440 : limiter à `max-inline-size: 18ch` et équilibrer |
| Cartes de services | FUNCTIONAL TRAINING (19) | ENTRAÎNEMENT FONCTIONNEL (24) | +26 % | Dans une carte inactive de 347 px, le titre fait 2 ou 3 lignes. `hyphens: manual` et des `&shy;` ciblés, jamais `hyphens: auto` sur le display |
| Panneaux du footer | Explore Classes (15) | Découvrir les cours (19) | +27 % | Faible |
| Liste du hero | PUSH YOUR LIMITS. (17) | REPOUSSE TES LIMITES. (21) | +24 % | Le filet de 508 px suffit |
| H1 | BUILD STRENGTH (14) | FORGE TA FORCE (14) ou DEVIENS PLUS FORT (17) | 0 ou +21 % | Recalculer la taille maximale (§ 2.4) avec le mot le plus long |
| « SERVICES. » | 9 | SERVICES. (9) | 0 | Aucun |
| Footer | REDEFINING FITNESS CULTURE. (27) | RÉINVENTER LA CULTURE DU FITNESS. (33) | +22 % | Faible |

**Ce qui casse, dans l'ordre probable :** l'accordéon, les labels Why, les boutons à escalier, les titres des cartes de services inactives, le H2 Why, puis le H1 si sa formulation change.

### 6.2 Display serré et accents français (point propre à cette maquette)

- L'interligne du H1 mesure **environ 0,82**. Entre la ligne de base de « BUILD » et le haut des capitales de « STRENGTH », il reste **20 px dans le shot**, environ 21 à 1440.
- Un accent sur une capitale (É, È, À, Ê) dépasse d'environ 0,2 em, soit **environ 35 px**. Il **déborderait d'environ 14 px sur la ligne du dessus** [E]. La cédille du Ç, elle, descend sous la ligne de base.
- Les **masques qui font apparaître les lignes une par une** (`overflow: clip` de SplitText avec `mask: "lines"`) **coupent les accents et les cédilles** quand l'interligne est inférieur à 1.
- **Parades :**
  - choisir des formulations sans capitale accentuée en 2ᵉ ligne, ou passer l'interligne à 0,9 ou 0,95 quand le texte contient un accent ;
  - ajouter `padding-block: 0.15em` aux masques, avec une marge négative pour compenser, ou utiliser `overflow-clip-margin` ;
  - retirer les masques une fois l'animation terminée ;
  - tester systématiquement « ÉLITE », « ÇA » et « À FOND ».

### 6.3 Typographie française et formats

- **Espaces :** une espace fine insécable (U+202F) avant `; : ! ?` et à l'intérieur des « ». Une espace insécable entre un nombre et son unité (« 14 jours », « 24 h/24 »). Vérifier que la fonte display contient U+202F, sinon le caractère vient d'une fonte de repli plus large.
- **Nombres :** `Intl.NumberFormat('fr-FR')`, ce qui donne « 4,9/5 » avec une virgule, « plus de 480 avis », « 20 ans ».
  - Un éventuel compteur animé reste en `tabular-nums`.
  - La valeur finale figure dans le HTML, lisible sans JS et par les lecteurs d'écran ; le chiffre animé est en `aria-hidden`.
- **Coupure des mots :** `hyphens: auto` avec `lang="fr"`, pour le texte courant seulement.
- **Langues écrites de droite à gauche :** employer les propriétés logiques (`margin-inline`, `inset-inline`) dès le départ. Le retrait du H1 et les blocs en escalier passent en `inline-start`. Ça ne coûte rien et le code reste propre.

### 6.4 Noms longs et contenus extrêmes

- **Portraits :** une grille `1fr auto` (nom puis numéro) avec `min-width: 0`. Les noms passent sur 2 lignes et ne sont jamais tronqués, car ce sont du contenu. À tester avec « Marie-Clémence Fontaine-Dubois » (30 caractères) dans une carte de 229 px.
- **Citations :** consigne éditoriale de 220 caractères au plus. Les diapositives empilées en grille absorbent les écarts de hauteur. À tester avec une citation de 400 caractères et une autre d'une seule ligne.
- **Chips :** `flex-wrap`, sans hauteur fixe. À tester avec 8 chips.
- **Tailles d'écran extrêmes à tester :**
  - petits écrans : 280, 320, 360, 390, 430 ;
  - tablettes : 768, 820, 1024 ;
  - portables et écrans de bureau : 1280 × 720, 1366 × 768, 1440 × 900, 1920 × 1080, 2560 × 1440 ;
  - paysage mobile : 844 × 390 et 932 × 430 ;
  - zoom : 200 % et 400 %.

### 6.5 Images manquantes

- **Cadres photo :** un `aspect-ratio` et une couleur de fond tirée des tokens.
- **Hero :** si l'image ne charge pas, il reste lisible sur un dégradé de `--red-500` vers `--black`.
- **Vidéo :** elle se replie sur son poster, puis sur la couleur de fond.
- **Texte alternatif :** il reste lisible sur fond sombre, car sa couleur vient du token de la surface.

### 6.6 Sans JS, le contenu est visible par défaut

- `<html class="no-js">` est remplacé par `js` grâce à un petit script intégré de deux lignes.
- **Les états de départ des animations (opacité, déplacement, masque) ne s'appliquent que sous `.js` et `(prefers-reduced-motion: no-preference)`.** Si le script échoue, la page s'affiche entière et immobile.
- **Comportement de chaque composant sans JS :**
  - accordéon : panneaux ouverts ;
  - carrousels : listes en `scroll-snap` natif, ou empilées ;
  - menu : lien vers la navigation du footer ;
  - vidéo : contrôles natifs (`controls`) ;
  - marquee : animation en CSS pur, immobile en mouvement réduit ;
  - compteurs : valeurs finales.

### 6.7 Impression

- **À masquer :** en-tête, menu, marquee, vidéo, réseaux et motifs.
- **Contenu :** ouvrir tous les panneaux d'accordéon à l'événement `beforeprint`, car le CSS seul ne peut pas forcer l'ouverture d'un élément `hidden`.
- **Couleurs et tailles :** texte noir sur blanc, photos retirées pour économiser l'encre, **mots display limités à 48 pt**.
- **Liens :** `a[href^="http"]::after` affiche l'URL, et le numéro de téléphone apparaît en toutes lettres.
- **Pagination :** `break-inside: avoid` sur les cartes et les citations.

### 6.8 Formulaires et liens d'action

- **Constat :** la maquette n'a **aucun formulaire**, ni newsletter ni réservation. « Join Now » et « Contact Us » mènent à des pages qui n'existent pas.
- **Si l'on ajoute un formulaire de démo** « Réserver une séance d'essai » (D9), voici ce qu'il doit couvrir :

| Aspect | Exigences |
|---|---|
| États | par défaut ; focus ; rempli ; invalide (message sous le champ, relié par `aria-describedby`, et `aria-invalid`) ; envoi en cours (bouton désactivé pour éviter le double envoi) ; succès (annoncé par une zone live) ; erreur réseau (message, bouton « Réessayer », saisie conservée) ; désactivé |
| Champs | `autocomplete` (`name`, `email`, `tel`), `inputmode="tel"`, police d'au moins 16 px (sinon iOS zoome) |
| Validation | côté navigateur **et** côté serveur (Astro Actions ou un service de formulaires) |
| Anti-spam | un champ piège invisible (honeypot), sans CAPTCHA bloquant |
| Honnêteté | mention « démo, aucun envoi réel » s'il n'y a pas de serveur derrière |

- **Téléphone :** prendre un **numéro réservé à la fiction**. L'ARCEP réserve des plages pour cet usage, par exemple 01 99 00 xx xx (à vérifier). Ne jamais mettre un numéro au hasard qui pourrait appartenir à quelqu'un.

---

## 7. SEO, métadonnées et aperçu sur les réseaux (étude de cas de portfolio)

- **Titre (60 caractères au plus) :** « VYRON · Landing page fitness : étude de cas | [Prénom Nom] ».
- **Description (155 caractères au plus) :** « Recréation d'une landing page de salle de sport : direction brutaliste rouge, animations GSAP, accessibilité WCAG 2.2 AA et Core Web Vitals au vert. »
- **Open Graph et Twitter :**
  - `og:title`, `og:description`, `og:type=website`, `og:locale=fr_FR` et `og:url` ;
  - `og:image` en **1200 × 630**, JPEG de 300 Ko au plus, accompagné d'un `og:image:alt`. Contenu : le hero recadré, le mot-symbole, la mention « Étude de cas » et le nom de l'auteur ;
  - `twitter:card=summary_large_image` ;
  - l'image peut être générée au build (Satori, `astro-og-canvas`) ou être un fichier fixe.
- **Technique :** `<link rel="canonical">`, `lang="fr"` (et `hreflang` s'il existe une version anglaise), `@astrojs/sitemap` et `robots.txt`.
- **Icônes :** favicon SVG (l'astérisque), `apple-touch-icon` en 180 × 180, et `theme-color` (#040F0E, ou une valeur par `media`).
- **Données structurées :**
  - **À éviter :** `ExerciseGym`, `LocalBusiness` et `AggregateRating` pour une salle fictive. Ce seraient des données trompeuses (faux avis, fausse adresse), contraires aux règles de Google sur les résultats enrichis.
  - **À utiliser** sur la page d'étude de cas :
    - `CreativeWork` (ou `WebPage` avec `about`) ;
    - `author` en `Person` (`name`, `url`, `sameAs` vers GitHub et LinkedIn), `dateCreated` et `keywords` ;
    - **`isBasedOn` avec l'URL du shot Dribbble d'origine**, pour l'attribution ;
    - `BreadcrumbList` si la page s'inscrit dans l'arborescence du portfolio.
- **Indexation (D11) :** indexer l'étude de cas et mettre la démo en `noindex`, pour qu'une « salle VYRON » fictive n'apparaisse pas dans des recherches locales. Autre option : indexer la démo avec une mention « concept » bien visible.
- **Éthique et droits :** créditer le designer d'origine, avec un lien vers son shot, dans le footer de la démo et dans l'étude de cas. Le nom « VYRON » vient du shot : ne pas le présenter comme une vraie marque.

---

## 8. Conflits avec le *craft-floor* : ce que tu dois trancher (ta consigne passe en premier)

| # | Point de tension | Ce que fait la maquette | Règle Impeccable | Options |
|---|---|---|---|---|
| D1 | Display au-delà de 6rem | H1 ≈ 178 px, SERVICES ≈ 270, VYRON ≈ 220 | « display de 6rem au maximum » | **Garder**, c'est l'identité de la maquette, avec un ajustement en `cqi`, des plafonds et des tests d'accents |
| D2 | Kickers « [||||] About Us / WHY VYRON… » | 5 occurrences | **Interdit** (« no brief earns it back ») | Les garder pour la fidélité (en `<p>`, barres en `aria-hidden`), ou les supprimer et laisser le titre porter la section |
| D3 | Rail Services en carrousel sur mobile | Le rail déborde | Un carrousel est une interaction coûteuse | Pile verticale (A) ou rail à cartes calées (B) |
| D4 | Image Programmes sur mobile | Grande image décorative | Ne pas masquer l'essentiel | Bandeau 16:9, une image par programme dans le panneau, ou suppression |
| D5 | Vidéo, points et compteur | Deux contrôles pour un même carrousel [I] | Un seul état, un seul contrôle | Les fusionner, et décider si la vidéo est décorative (a) ou parlée (b) |
| D6 | Pas de CTA dans le hero | Icône téléphone seule | Persuade : « action principale visible » | Ajouter « Réserver une séance d'essai », et une barre fixe sur mobile |
| D7 | Rouge #F02B42 sur le petit texte | 4,09:1 | Contraste d'au moins 4,5:1 | `--red-600` (#D8273B ou #E3293F) pour le texte et les boutons |
| D8 | Numéros 01/02/03 (services, accordéon, équipe) | Décoratifs | Pas de numéros de section, sauf si la séquence apporte une information | Les garder décoratifs (`aria-hidden`, au moins 12 px) ou les retirer. Seul le compteur du témoignage informe |
| D9 | Formulaire | Absent | « Couverture : chaque exigence du brief se trouve en quelques secondes » | Ajouter un formulaire de démo honnête, ou s'en passer |
| D10 | Accordéon en `<details>` ou bouton APG | — | — | Bouton APG avec `hidden="until-found"` (recommandé), ou `<details name>` (zéro JS, mais les titres ne sont plus vus comme des titres) |
| D11 | Démo indexée | — | — | `noindex` pour la démo, ou indexation avec la mention « concept » |
| D12 | Blocs en escalier (ombres décalées sans flou) | Boutons, photos, bouton téléphone | Une ombre décalée dure est un costume en dehors d'un univers néobrutaliste | L'univers techno-brutaliste est assumé, c'est donc défendable. Les réaliser en pseudo-éléments **sans** `box-shadow`, avec une bordure en mode contrastes forcés |
| D13 | Mono pour les labels et la navigation du footer | 3ᵉ famille de fontes | La mono ne doit pas servir de costume « technique » | La garder pour les données (chips, compteurs) et repasser la navigation en sans, ou supprimer la mono (une fonte de moins) |
| D14 | Astérisque et flèches | Caractères typographiques ? [I] | Pas de caractère Unicode à la place d'une icône | Un sprite SVG dessiné, à l'épaisseur de trait constante |

---

## 9. Questions ouvertes, à trancher avant `shape` et `craft`

1. Hero en **100svh avec le H1 visible** au chargement (recommandé), ou fidélité aux 1 103 px de la maquette ?
2. Ajoute-t-on un **CTA principal**, et une **barre CTA fixe sur mobile** (D6) ?
3. Services sur mobile : **pile verticale**, ou **rail à cartes calées** (D3) ?
4. Équipe : veux-tu l'**élargissement au survol** sur desktop ? (Sur mobile, ce serait le bento 1 + 4.)
5. Vidéo : **décorative et muette**, ou **témoignage parlé** avec sous-titres (D5) ?
6. Acceptes-tu un **rouge un peu plus sombre pour le texte** (D7) ?
7. **Kickers et numéros** : fidélité à la maquette, ou règle Impeccable (D2, D8) ?
8. Langue : **français seulement**, ou **français et anglais** (routage i18n d'Astro, double texte à tester) ?
9. Un **formulaire de démo** (D9), et un numéro de téléphone fictif ?
10. Démo **indexée** ou en **`noindex`** (D11) ?
11. Garde-t-on la fonte mono (D13) ?
12. Lenis : actif seulement sur desktop, coupé en mouvement réduit et natif au tactile (recommandé) ?

---

## 10. Actions recommandées, par priorité

1. **[P0] `/impeccable adapt`** : décliner chaque section sur les 4 paliers (§ 3), le menu en `<dialog>`, des cibles de 44 px, le bento de l'équipe, le rail ou la pile des services.
2. **[P1] `/impeccable colorize`** : deux rôles de rouge, un gris sur fond nuit d'au moins 4,6:1, le voile du hero, des tokens `--focus` par surface.
3. **[P1] `/impeccable layout`** : le hero en `svh` avec le H1 visible, la colonne fixe de Programmes, les diapositives empilées en grille pour éviter le CLS.
4. **[P1] `/impeccable animate`** : une thèse de mouvement (un seul moment fort, l'intro du hero), des variantes en mouvement réduit, un bouton de pause global, Lenis sous conditions.
5. **[P1] `/impeccable harden`** : le vrai texte français à chaque palier, les accents et les masques, le fonctionnement sans JS, l'impression, les liens sans destination, les chiffres et données fictifs.
6. **[P1] `/impeccable optimize`** : la chaîne d'images d'Astro, les sous-ensembles de fontes et leurs polices de repli, un budget JS de 65 Ko au plus, Lighthouse CI.
7. **[P2] `/impeccable typeset`** : une échelle en `clamp()` avec rem et vw, le micro-texte à 12–14 px minimum, l'interligne du display face aux accents.
8. **[P3] `/impeccable clarify`** : les libellés français des actions, la mention « concept », le crédit au designer.
9. **`/impeccable polish`** pour la passe finale, puis **`/impeccable audit`** sur le vrai code, avec le détecteur, pour mesurer le score.

> Tu peux me demander de lancer ces commandes une par une, toutes d'un coup, ou dans l'ordre que tu préfères. Relance `/impeccable audit` après les correctifs pour voir le score progresser.