> **Annexe brute** : rapport de l’agent `a2-typography`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

# VYRON : analyse typographique (lentille Impeccable « typeset »)

ID : `a2-typography` · Mode visiteur : **Persuade** (landing page), et pièce de portfolio jugée sur le craft · Phase : analyse seulement, aucun code du site.
Références lues : `typeset.md`, `new-work.md` §4, `craft-floor.md`, `mode-persuade.md`.

---

## 0. Synthèse

- **Le shot n'utilise que 3 familles, toutes libres (OFL, Google Fonts / Fontsource).** Je les ai identifiées en rendant chaque candidat, puis en mesurant la ressemblance de forme avec la capture. Aucune police commerciale n'est à racheter.
  - **Tektur** porte toute la voix de la marque : display, titres, logo, boutons, tags et chiffres.
  - **Inter** sert au sous-titre du hero, au corps et à l'UI.
  - **IBM Plex Mono** sert aux labels et aux slogans « techniques ».
- **Les titres de section sont-ils de la même famille que le display du hero ? Oui, c'est Tektur partout.** Seuls la graisse et la taille changent :
  - display en 500 (Medium) ;
  - H2 et H3 en 600 (SemiBold) ;
  - logo en 600 dans le header, 600 à 700 dans le footer.
  
  La signature commune est le **Y de Tektur, dessiné comme un « y » minuscule** : un bras gauche court greffé sur un bras droit qui devient le fût. On le voit dans VYRON, YOU, INTENSITY et COMMUNITY. Le I à empattements, le P ouvert, le S et le G chanfreinés et le 4 ouvert confirment l'identification (§ 3.1).
- **Scores de forme** (IoU, voir § 1) :

  | Rôle | Meilleur candidat | IoU | Meilleur concurrent |
  |---|---|---|---|
  | BUILD / STRENGTH / SERVICES. | Tektur 500, −0,02em | **0,94 à 0,97** | 0,76 |
  | H2 | Tektur 600 | **0,93 à 0,97** | — |
  | Sous-titre et liste du hero | Inter (≈ Inter Tight) | **0,78 à 0,88** | 0,62 |
  | Labels | IBM Plex Mono | **0,73 à 0,80** | 0,69 à 0,74 |

- **L'échelle a deux étages, avec un contraste radical entre eux.**
  - Étage « affiche » : 273, 224 et 180 px.
  - Étage « lecture » : de 56 à 12 px, sans palier intermédiaire.
  
  Le haut de l'échelle est la force du design. Les défauts sont tous en bas :
  - trois tailles de H3 voisines (32, 34 et 39 px) ;
  - quatre traitements différents pour le même rôle de label ;
  - des index en 12 px gris à 4,05:1 ;
  - des libellés blancs sur rouge à 4,09:1 ;
  - un corps en Light, avec tracking négatif, sur fond quasi noir.
- **Cinq tensions avec le craft-floor Impeccable sont à trancher par toi** (« le brief gagne ») :
  - un display bien au-delà de 6rem ;
  - les eyebrows « ||||||| WHY VYRON » (interdits sans exception par Impeccable) ;
  - les numéros de section 01/02 ;
  - le mono utilisé comme costume, avec IBM Plex qui figure dans la liste des polices par défaut ;
  - Inter utilisé en taille display (sous-titre de 40 px).
- **Recommandation** :
  - garder Tektur sans réserve ;
  - garder Inter pour le corps ;
  - cantonner le mono aux données ;
  - adopter l'échelle fluide de 14 rôles nommés par usage (§ 5).

---

## 1. Méthode et conventions

### 1.1 Échelles de mesure

| Source | Cadre du site (MESURÉ) | Facteur vers une maquette de 1440 px |
|---|---|---|
| `ref/2.png`, `3.png`, `4.png` (1600×1200) | x = 100 → 1499, soit **1400 px** | **k = 1440 / 1400 = 1,0286** |
| `ref/1.png` (407×2000) | x ≈ 19,5 → 386,5, soit ≈ 367 px | ×3,924 |
| `ref/sections/*.png` (×4 de 1.png) | x ≈ 78 → 1546 | ×0,981 |

- **Validation croisée.** La hauteur de capitale de « SERVICES. » vaut 186 px dans 3.png, soit 191 px à 1440. Dans s3, elle vaut 197 × 0,981 = 193 px. L'écart de 1 % confirme que les échelles concordent.
- **Grille.** La marge de contenu mesure 58 px dans le shot, soit **60 px à 1440**. La largeur utile vaut **1320 px**. Le premier filet du hero commence à x = 158. Une maquette en 1440 est donc très probable (ESTIMÉ).

### 1.2 Statuts des valeurs

- **MESURÉ** : lu sur les pixels. Il s'agit des bords d'encre (seuil à mi-chemin entre fond et texte), des profils de lignes, des pas d'interligne et des couleurs échantillonnées.
- **ESTIMÉ** : dérivé d'une mesure et d'une métrique de police connue. Exemple : taille = hauteur de capitale / ratio de capitale. Les graisses et trackings issus des balayages entrent aussi dans cette catégorie.
  - Erreur typique : ±1 px de capitale dans le shot donne ±1 % à 180 px, mais **±8 % à 16 px**.
- **INFÉRÉ** : déduit du contexte, par exemple dans la capture basse définition 1.png où le petit texte est illisible.

### 1.3 Pipeline d'identification (« measure, don't guess »)

Je n'ai pas utilisé `impeccable font-match` : le binaire n'est pas embarqué dans le skill et je n'ai pas lancé de téléchargement. J'ai reproduit son principe avec mes propres scripts (`tools/` dans le dossier de travail) :

1. **Binarisation** de la zone de référence (PIL), au seuil médian entre fond et texte.
2. **Rendu Chromium** de chaque candidat Google Fonts avec le même texte, à 200 px (`tools/render.mjs`, qui gère graisse, axe wdth/opsz, letter-spacing et `font-feature-settings`).
3. **Score** après mise à la même hauteur d'encre (`tools/compare.py`) :
   - **IoU** : recouvrement des pixels d'encre après normalisation de largeur ;
   - **ratio de largeur** : il révèle le tracking ;
   - **ratio d'encre** : il sert d'indice de graisse.
4. **Balayage** graisse × tracking (× largeur pour Tektur) sur le gagnant, puis contrôle visuel des planches `cmp_*.png`.

Pour lire l'IoU :

| IoU | Interprétation |
|---|---|
| > 0,90 | dessin quasi identique |
| 0,75 à 0,90 | très proche (aux petites tailles, le flou plafonne le score) |
| < 0,65 | dessin différent |

Métriques lues avec fontTools sur les fichiers servis par Google Fonts :

| Police | Cap | x-height | Ascendante | Descendante | Axes |
|---|---|---|---|---|---|
| Tektur | 0,700 em | 0,560 | 1,000 | 0,300 | wght 400–900, wdth 75–100 |
| Inter | 0,727 | 0,546 | 0,969 | 0,241 | wght 100–900, opsz 14–32 |
| IBM Plex Mono | 0,698 | 0,516 | 1,025 | 0,275 | statique |

Une remarque utile : chez Tektur comme chez Inter, l'écart entre ascendante et capitale est égal à la descendante. **Les capitales sont donc centrées verticalement dans la boîte de ligne, quel que soit l'interligne.** Boutons et tags en capitales sont optiquement centrés sans bricolage.

---

## 2. Inventaire des rôles (valeurs normalisées à 1440 px)

| # | Rôle | Exemples | Police · graisse | Casse | Cap shot (px) | Taille @1440 | Interligne | Tracking | Couleur (échant.) | Statut |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Display « affiche » (remplit la largeur) | SERVICES. | Tektur 500 | CAPS | 186 (3.png) | **273 px** (17,06rem) ; largeur d'encre 1276 px | 1 ligne | **−0,02em** | rouge ≈ #F02B42 | MESURÉ / taille ESTIMÉE |
| 2 | Display hero | BUILD / STRENGTH | Tektur 500 | CAPS | 122–123 (2.png) | **180 px** (11,25rem) | **0,81** (pas 142 → 146 px) | **−0,02em** | blanc | MESURÉ / ESTIMÉ |
| 3 | Wordmark footer | VYRON™ | Tektur 600–700 | CAPS | 160 (s7) | ≈ **224 px** ; ™ = 38 % de la capitale | — | ≈ +0,02em | blanc | ESTIMÉ (basse déf.) |
| 4 | Chiffres-affiche | 01, 02 (cartes services) | Tektur 500 + **tnum** | — | 128 (s3) ; tronqué dans 3.png | ≈ **180 px** | — | ≈ −0,04em | noir / blanc | ESTIMÉ |
| 5 | Titre de section (H2) | HIGH-INTENSITY…, BUILT FOR THOSE…, FIND THE RIGHT…, REAL TRANSFORMATION…, REDEFINING FITNESS CULTURE. | Tektur 600 | CAPS | **38** (3.png et 4.png) ; 37–40 (s4, s6, s7) | **56 px** (3,5rem) | **0,97 à 1,01** (pas 53–55 → 54,5–56,6 px) | −0,01 à −0,02em | marine ≈ #0F1325 / blanc | MESURÉ / ESTIMÉ |
| 6 | Chiffres de stats | 4.9/5, 20 | Tektur ≈ 600 | — | 37–39 (s2) | ≈ 52–56 px | — | — | blanc / noir | ESTIMÉ (basse déf.) |
| 7 | Logo header | VYRON™ | Tektur 600 | CAPS | 33 (2.png) | **48 px** | — | **+0,02em** | blanc | MESURÉ / ESTIMÉ |
| 8 | Lead (sous-titre hero) | Redefine Your / Physical Potential | Inter 400 (≈ Inter Tight) | Titre | 29 | **40 px** (2,5rem) | **0,98** (pas 38 → 39 px) | Inter ≈ −0,045em (≈ Inter Tight −0,01em) | blanc rosé ≈ #F7E7E1 | MESURÉ / ESTIMÉ |
| 9 | Sous-titre (H3) | STRENGTH TRAINING (cartes), WE FORGE STRONGER… (about), BUILD STRENGTH & GAIN POWER (accordéon) | Tektur 600 | CAPS | 22 (3.png) ; 24–25 et 27–28 (s2, s4) | **32 / 34 / 39 px** (trois valeurs) | ≈ 1,03 | ≈ −0,01em | marine / blanc | 32 MESURÉ ; 34 et 39 ESTIMÉS |
| 10 | Accent | Results are built, not given. ; Jordan Tucker | Tektur 500 (nom en 600, INFÉRÉ) | Phrase | 17 (4.png) | **24 px** | **1,15** (pas 27 px) | 0 à −0,01em | rouge | MESURÉ / ESTIMÉ |
| 11 | Citation | "I came here wanting to get fit…" | Inter 400 | Phrase | ≈ 21 (s6) | ≈ 26 px | ≈ 1,5 | serré | gris moyen | ESTIMÉ (basse déf.) |
| 12 | UI large | PUMP. REPEAT. / LIFT. CRUSH IT. / PUSH YOUR LIMITS. / DIG DEEPER. | Inter 400–500 | CAPS | 13–14 | **18–19 px** | lignes de 58,6 px séparées par des filets | ≈ −0,03em | blanc sur rouge | MESURÉ / ESTIMÉ |
| 13 | Bouton / onglet | Meet the Team, Learn More About Us, View All Programs, Back To Home | Tektur 400 | Titre | 12 | **17–18 px** | — | ≈ −0,01em | blanc sur rouge ou noir | MESURÉ / ESTIMÉ |
| 14 | Nav | MENU | Inter 400–500 | CAPS | 11 | 15–16 px | — | — | blanc | MESURÉ / ESTIMÉ |
| 15 | Corps | One-on-one coaching…, Every workout plan…, Designed to transform… | Inter **300–400** | Phrase | 11–12 | **16 px** (au plus 17) | **1,25 à 1,3** (pas 19–21 → 20,6 px) | ≈ −0,02 à −0,04em (incertain à cette taille) | #6F7173 sur blanc ; #9BA6A5 **et** #CAD5D4 sur noir | MESURÉ / ESTIMÉ |
| 16 | Nom | Alex Vance, Sarah Jenkins… | Inter 400 | Titre | 11 | 15–16 px | — | serré | #C7D0CF | MESURÉ / ESTIMÉ |
| 17 | Tag de catégorie | EXPERT COACHES, PREMIUM EQUIPMENT, 24/7 ACCESS | Tektur 500 | CAPS | 11 | **16 px** | — | 0 | #6D7877 | MESURÉ / ESTIMÉ |
| 18 | Label mono | Trusted by people who demand real fitness results. ; WHY VYRON ; (About Us, Fitness Programs, TRANSFORMATION) | IBM Plex Mono 400 | phrase **et** CAPS (incohérent) | 11 | **15–16 px** | **1,3** (pas 20 px) | ≈ 0 | #6D6E70 sur #F5F5F5 ; #9BA6A5 sur noir | MESURÉ (2 occurrences) ; les autres INFÉRÉES |
| 19 | Index | 01–05 (équipe) | Tektur 500 | — | **8** | **12 px** | — | — | #6A7574 | MESURÉ / ESTIMÉ |
| 20 | Micro-données | pills « 14 Days », « Muscle Building », sous-nom « 14 Days Training », nav du footer (Home, About Us…) | Plex Mono (INFÉRÉ, chasse fixe visible) | Titre | illisible | ≈ 12–14 px | — | — | gris | INFÉRÉ |
| 21 | Bandeau défilant | Fitness Hub ✱ | Tektur 400–500 (probable) | Titre | ≈ 15 (s7) | ≈ 20 px | — | — | blanc sur rouge | INFÉRÉ |

Les éléments suivants ne sont pas des polices et doivent être dessinés en SVG :

- l'**astérisque rouge à 8 branches** (hero, services, témoignage, footer). L'astérisque de Tektur n'a pas la même forme. Le craft-floor proscrit d'ailleurs le glyphe Unicode utilisé comme icône ;
- les **flèches → → →** du hero. Tektur n'a pas de U+2192 ;
- les **traits rouges ||||||||** des labels.

Le **™** est, lui, le glyphe natif de Tektur. Il fait 40 % de la capitale et s'aligne sur la ligne de capitales ; j'ai mesuré 36 à 38 % dans le header comme dans le footer.

**Mesure de ligne (MESURÉ).**

- **Corps** : 37 à 40 caractères par ligne, soit des boîtes de 250 à 270 px dans le shot, ou **≈ 258–278 px à 1440**. Avec Inter, cela correspond à environ 16,5em. Il ne faut pas l'exprimer en unités CSS `ch`, qui sous-estiment le nombre de caractères d'une police proportionnelle.
- **H2** : 23 à 25 caractères par ligne, soit 710 à 745 px à 1440. Cela fait environ 13,3em, ou 7 colonnes sur 12.

---

## 3. Identification des familles

### 3.1 Tektur : la voix (display, titres, logo, boutons, tags, chiffres)

**Indices glyphiques** (crops `c_svc_heading.png`, `c_hero_display.png`, `c_wordmark.png`, `c_why_tags.png`, `c_why_results.png`, comparés à `sp_tektur_weights.png`) :

| Glyphe | Dans le shot | Chez Tektur |
|---|---|---|
| **Y** | forme de « y » minuscule : bras gauche court, bras droit continu qui devient le fût (VYRON, YOU, INTENSITY, COMMUNITY) | identique ; c'est la signature de la police |
| **I** | empattements haut et bas (BUILD, SERVICES, INTENSITY) | identique |
| **P** | panse ouverte en bas (KEEPS, PREMIUM, POWERFUL) | identique |
| **S / C / G** | carrés, coins chanfreinés en diagonale ; G avec barre horizontale | identique |
| **4** | ouvert, en forme de « Ч » (24/7) | identique |
| **1** des 01/02 | drapeau long plus **pied** | uniquement avec **`tnum`** : le glyphe `one.tnum` de Tektur a ce pied (`sp_tektur_tnum.png`, `cmp_01_visual.png`) |
| minuscules | g simple à crochet carré, e à terminaison horizontale, t chanfreiné (Results, given, Meet the Team) | identique |

**Scores** (extraits ; tableaux complets dans la console, montages dans `cmp_*.png`) :

| Zone de référence | 1er | IoU | Suivants |
|---|---|---|---|
| STRENGTH (2.png, 58 polices testées) | Tektur 500, −0,02em | **0,941** (0,957 en 480) | Tektur 500 à 0 : 0,899 · Audiowide 0,758 · Orbitron 0,754 · Chakra Petch 600 : 0,751 · Tomorrow 500 : 0,718 · Kode Mono 600 : 0,600 |
| BUILD | Tektur 500, −0,02em | **0,958** | Chakra Petch 600 : 0,659 · Kode Mono 600 : 0,470 |
| SERVICES. | Tektur 500, −0,02em | **0,971** | Tektur 550, −0,02em : 0,898 · 450 : 0,896 |
| HIGH-INTENSITY TRAINING | Tektur 600, −0,01em | **0,935** | 650 : 0,882 · 700 : 0,822 |
| KEEPS YOU MOTIVATED AND | Tektur 600, −0,01em | **0,928** | 700 : 0,825 |
| BUILT FOR THOSE WHO DON'T | Tektur 600, −0,02em | **0,972** | 650 : 0,932 |
| VYRON (header) | Tektur 600, +0,02em | **0,919** | 700, +0,02em : 0,892 |
| VYRON (footer, basse déf.) | Tektur 700, +0,02em | 0,938 | 600 : 0,905 |
| FUNCTIONAL (titre de carte) | Tektur 600, 0 | 0,867 | 500 : 0,848 |
| Meet the Team | Tektur 400, −0,02em | 0,847 | 400, 0 : 0,780 |
| PREMIUM EQUIPMENT | Tektur 500, 0 | 0,777 | 550 : 0,753 |
| Results are built, | Tektur 500, −0,02em | 0,768 | 500, 0 : 0,707 |
| 02 (basse déf.) | Tektur 500 **tnum**, −0,06em | 0,809 | 450 : 0,781 |

**Axe de largeur.** Le balayage wdth de 92 à 98 fait chuter l'IoU entre 0,79 et 0,90 sur STRENGTH comme sur SERVICES. Le shot utilise donc **wdth 100**, avec un tracking de −0,02em, et non une version condensée (`cmp_var_str.png`, `cmp_var_svc.png`).

**Alignement optique (MESURÉ).** Le B de BUILD commence 3 px **à gauche** de la marge de contenu (x = 155 contre un filet à x = 158). Le designer a donc décalé le display d'environ 0,075em pour compenser l'approche gauche de Tektur, qui vaut ≈ 0,056em sur les fûts droits. À l'inverse, le S de SERVICES. commence **15 px à droite** de la marge, sans compensation. C'est une incohérence à corriger (§ 6.3).

**Original commercial ?** Il n'y en a pas besoin. Tektur (Adam Jagosz, OFL, Google Fonts, variable wght/wdth) colle quasi pixel pour pixel. Les familles « techno chanfreinées » de remplacement (Chakra Petch, Tomorrow, Oxanium) perdent le Y signature et ne sont pas recommandées.

**Confiance** :

- **très haute** pour le display et les H2 ;
- **haute** pour le logo, les boutons, les tags et l'accent ;
- **moyenne-haute** pour les chiffres 01/02, mesurés seulement en basse définition, mais le `1` tabulaire est déterminant.

### 3.2 Inter : lead, corps, UI

**Indices.** On retrouve les traits d'Inter : y à queue droite, t à coupe oblique, a à deux étages, R à jambe droite, f étroit. L'ensemble est serré, à la manière des réglages Figma de −3 à −5 %.

**Scores** :

| Zone | 1er | IoU | Suivants |
|---|---|---|---|
| Physical Potential (47 grotesques testées) | **Inter Tight 400, −0,01em** | **0,777** | Inter 400, −0,05em : 0,676 · Archivo : 0,620 · Albert Sans, −0,04em : 0,609 · Roboto, −0,03em : 0,588 · Geist, −0,06em : 0,391 |
| Redefine Your | **Inter Tight 400, −0,01em** | **0,833** | Inter, −0,05em : 0,756 · Roboto : 0,701 · Geist : 0,540 |
| PUMP. REPEAT. | Inter Tight 500, −0,02em | **0,875** | Inter 500, −0,04em : 0,780 · Roboto : 0,593 · Geist : 0,454 |
| One-on-one coaching… (corps, flou) | Inter 300, −0,04em | 0,676 | Inter Tight 400 : 0,674 · Geist : 0,494 · Manrope : 0,395 |

**Lecture.** Le dessin est celui d'Inter, version texte. La chasse correspond à **Inter Tight** ou, ce qui revient au même, à Inter resserré d'environ −0,045em.

- Inter variable en optique display (opsz 32) à **−0,02em** reproduit exactement la largeur du sous-titre (ratio 1,001), avec un IoU de 0,686. Cette valeur respecte le tracking dynamique recommandé par Inter (≈ −0,022em à 40 px).
- Pour un corps à 16 px, la recommandation d'Inter est ≈ −0,011em, soit trois fois moins serré que le shot.

**Original commercial ?** Ce n'est pas nécessaire. SF Pro est un sosie possible, mais il n'est pas testable (licence Apple) et la correspondance avec Inter suffit.

**Confiance** : **haute** sur la famille ; **moyenne** sur la graisse du corps (300 ou 400) et sur le tracking aux petites tailles.

### 3.3 IBM Plex Mono : labels

**Indices.** On reconnaît le r à empattement de pied, le l à queue courbe et empattement, le i à empattements et le f étroit (`c_svc_mono.png` contre `cmp_trust.png`).

**Scores** :

| Zone | 1er | IoU | Suivants |
|---|---|---|---|
| Trusted by people who demand real (40 monos testées) | **IBM Plex Mono 400** | **0,733** | Plex 300 : 0,696 · Inconsolata : 0,685 · Fira Code : 0,667 · Space Mono : 0,528 · JetBrains Mono : 0,414 |
| WHY VYRON | **Plex Mono 400** | **0,800** | Martian Mono 300 : 0,739 · JetBrains Mono : 0,716 |
| fitness results. | **Plex Mono 400** | **0,748** | Fira Mono : 0,602 |

La graisse est **Regular 400** (ratio d'encre 0,98 à 1,00). Le tracking est **normal**.

**Confiance** : **haute**.

### 3.4 Rôles non résolus (capture basse définition)

Les éléments suivants sont trop petits dans 1.png (2 à 3 px de haut) pour être identifiés ou mesurés de façon fiable. Je les ai attribués par analogie (INFÉRÉ) :

- marquee « Fitness Hub » ;
- nav du footer ;
- pills « 14 Days » et « Muscle Building » ;
- légendes de stats « AVERAGE RATING FROM 480+ VERIFIED REVIEWS » et « YEARS OF EXCELLENCE » (Inter en capitales, probable) ;
- puces « Expert certified personal trainers… » ;
- paragraphes des sections About, Programs et Footer.

**Pour une fidélité exacte, il faudrait des captures haute définition des sections About, Programs, Transformation et Footer.**

---

## 4. Échelle mesurée : ce qu'elle dit

| Palier (@1440) | Rôles | Rapport avec le palier suivant |
|---|---|---|
| 273 | affiche (SERVICES.) | ×1,22 |
| 224 | wordmark footer | ×1,24 |
| 180 | display hero, chiffres 01/02 | **×3,2** (saut volontaire) |
| 56 | H2, stats | ×1,17 |
| 48 | logo header | ×1,2 |
| 40 | lead Inter | ×1,03–1,25 |
| 32 / 34 / 39 | H3 (trois valeurs) | ×1,3–1,6 |
| 24 (26) | accent, nom, citation | ×1,33 |
| 18 | UI large, boutons | ×1,125 |
| 16 | corps, labels, tags, noms | ×1,33 |
| 12 | index | — |

- **Deux étages, et pas de « milieu ».** Le saut de 180 à 56 px (×3,2) fait l'énergie de la page. C'est ce que `typeset.md` appelle un « decisive contrast » en mode Persuade. **À conserver.**
- **Des paliers trop proches pour des rôles différents.**
  - Les H3 à 32, 34 et 39 px tiennent tous le même rôle (titre de bloc). Il faut les fusionner.
  - Le lead Inter à 40 px et le H3 Tektur à 36–39 px sont proches en taille, mais la famille et la casse les distinguent. Cela reste acceptable.
  - L'UI à 18 px et le corps à 16 px (×1,125) ne se distinguent que par la casse. C'est suffisant.
- **Interlignes cohérents par étage.**
  - Display à 0,81.
  - H2 à 1,0, identique dans quatre sections : c'est le rôle le plus régulier du shot.
  - Lead à 0,98.
  - Accent à 1,15.
  - Corps et mono à 1,29. C'est serré pour du gris clair sur fond sombre (§ 6.4).
- **Tracking.**
  - Tektur : négatif léger en display et en titres (−0,01 à −0,02em). C'est sain, au-dessus du plancher du craft-floor (−0,04em).
  - Inter : resserré partout, jusqu'à ≈ −0,045em sur le lead, ce qui est au plancher.
  - Mono et tags : à 0.
- **Alignements (MESURÉ).**
  - Le lead du hero est **aligné sur la ligne de base de BUILD** (dernière ligne de base 955 contre 960 dans le shot).
  - La note latérale du H2 n'est pas traitée pareil d'une section à l'autre :
    - section Why : alignée sur la dernière ligne de base du H2 (360 contre 357) ;
    - section Services : **centrée verticalement** sur le bloc H2 (centre 581,5 contre 581).
    
    Il faut choisir une règle et s'y tenir (§ 6.3).

---

## 5. Échelle fluide proposée (desktop 1440 → mobile 390)

Les valeurs sont calculées par interpolation linéaire entre 390 et 1440 px. Les bornes sont en rem, pour respecter le zoom navigateur. Les noms décrivent l'**usage**, pas la valeur, conformément à `typeset.md`.

| Token (rôle) | Usage | Police · graisse | `font-size` | Interligne | Tracking | Remarques |
|---|---|---|---|---|---|---|
| `poster` | SERVICES. (mot unique pleine largeur) | Tektur 500 | `clamp(4.5rem, 20.68cqi, 17.06rem)` (variante viewport : `clamp(4.75rem, 0.177rem + 18.76vw, 17.06rem)`) | 0,8 | −0,02em | Préférer `cqi` (container query) : `vw` inclut la barre de défilement (≈ 15 px sous Windows) et peut faire déborder un mot calé à 97 % de la largeur. La largeur d'encre vaut ≈ 4,67 × font-size, soit 74 px à 390 pour 358 px utiles. |
| `hero` | BUILD / STRENGTH | Tektur 500 | `clamp(4.5rem, 1.993rem + 10.29vw, 11.25rem)` | 0,82 (0,9 si capitale accentuée en 2ᵉ ligne) | −0,02em | Retrait de STRENGTH = 1,19em à 1440 (215 px). **À ramener à 0 sous ≈ 600 px**, sinon 72 + 341 px dépassent 358 px. |
| `wordmark` | VYRON™ du footer | Tektur 600–700 | `clamp(5.5rem, 2.343rem + 12.95vw, 14rem)` | 0,8 | +0,02em | Largeur ≈ 3,9 × font-size avec le ™. |
| `figure` | 01 / 02 géants | Tektur 500, `font-variant-numeric: tabular-nums` | `clamp(6rem, 4.05rem + 8vw, 11.25rem)` | 0,8 | −0,03em | `tnum` donne le « 1 » à pied du shot et évite le tremblement pendant un compteur animé. |
| `heading` | H2 de section, titre du footer | Tektur 600 | `clamp(2rem, 1.443rem + 2.29vw, 3.5rem)` | 1,0 | −0,015em | `text-wrap: balance`, max ≈ 13,5em |
| `stat` | 4.9/5, 20 | Tektur 600, tnum | `clamp(2.5rem, 2.129rem + 1.52vw, 3.5rem)` | 0,9 | −0,02em | Peut partager la taille de `heading`. Le « /5 » se compose dans un span à environ 0,4em, aligné sur la ligne de base. |
| `logo` | VYRON™ du header | Tektur 600 | `clamp(1.75rem, 1.286rem + 1.9vw, 3rem)` | 1 | +0,02em | Idéalement un SVG vectorisé depuis Tektur 600, identique en header et en footer. |
| `lead` | sous-titre du hero, chapôs | Inter 400 (opsz auto) | `clamp(1.5rem, 1.129rem + 1.52vw, 2.5rem)` | 1,02 | **−0,02em** | Le shot est à ≈ −0,045em ; voir § 6.7. |
| `subheading` | H3 : cartes, accordéon, titre About | Tektur 600 | `clamp(1.5rem, 1.221rem + 1.14vw, 2.25rem)` | 1,05 | −0,01em | Fusionne 32, 34 et 39 px en **36 px**. |
| `accent` | Results are built… ; nom du témoignage ; citation (en Inter) | Tektur 500 / Inter 400 | `clamp(1.25rem, 1.157rem + 0.38vw, 1.5rem)` | 1,15 (Tektur) / 1,45 (citation) | 0 | Guillemets typographiques « “ ” » (ou « » en FR) et ponctuation en retrait. |
| `ui` | liste du hero, boutons, onglets, nav | Tektur 400 (boutons) / Inter 400–500 (liste, nav) | `clamp(1rem, 0.954rem + 0.19vw, 1.125rem)` | 1,2 | Inter en CAPS : **0 à +0,01em** (pas négatif) ; Tektur : −0,01em | |
| `body` | corps | Inter **400** | `1rem` (fixe) | **1,45** sur clair, **1,5** sur sombre | **−0,011em** | `text-wrap: pretty` ; max-width ≈ 17em pour les légendes, 60 à 70 caractères pour les paragraphes |
| `label` | labels mono, tags Tektur | Plex Mono 400 / Tektur 500 | `clamp(0.875rem, 0.829rem + 0.19vw, 1rem)` | 1,3 | mono : 0 ; Tektur en CAPS : **+0,02em** | |
| `micro` | index, pills, méta | Tektur 500 tnum / mono 400 | `0.875rem` (fixe ; remonte les 12 px du shot à 14 px) | 1,2 | +0,02em | Jamais en dessous de 14 px. |

Valeurs de contrôle à 768 px :

| Rôle | Taille |
|---|---|
| poster | ≈ 147 px |
| hero | 111 px |
| figure | 126 px |
| heading | 40,6 px |
| lead | 29,8 px |
| subheading | 28,3 px |

L'étage de lecture reste quasi fixe en rem. Seul l'étage affiche est vraiment fluide, ce qui correspond à la règle de `typeset.md` : le display marketing répond à l'espace, les surfaces de lecture restent prévisibles.

---

## 6. Critique Impeccable (évaluation typographique)

> Le scan mécanique (`impeccable detect --json --scope type`) n'est pas applicable tant qu'il n'y a pas de code. Il faudra le lancer dès la première intégration et le relancer en fin de passe.

### 6.1 Autorité et adéquation

- **Tektur est le bon choix et doit rester l'autorité.** C'est une police avec un point de vue : chanfreins, Y idiosyncratique, I à empattements. Elle évoque la plaque d'acier, le marquage d'équipement et le chrono. Elle n'est **pas** dans la liste des polices par défaut des modèles (`new-work.md` §4). Une seule police variable couvre quatre graisses : 400 (boutons), 500 (display, tags, chiffres, accent), 600 (titres, logo) et 700 (wordmark du footer).
- **Inter** est un outil de travail, légitime pour le corps. Impeccable vise « Inter-as-display » : ici, le display reste Tektur et Inter ne sert qu'au lead de 40 px. Le risque est faible, mais la décision t'appartient (§ 6.7).
- **IBM Plex Mono** pose un double problème :
  - « IBM Plex » figure dans la liste des polices par défaut ;
  - il est employé **en costume** (« Trusted by people who demand real fitness results. » est un slogan, pas une donnée).
  
  Est-ce que chaque famille est nécessaire ? La troisième est la moins justifiée. Elle ne se défend que pour des **données** : durées (« 14 Days »), horaires (« 24/7 »), index et notes.

### 6.2 Hiérarchie

- Au premier coup d'œil, on distingue bien l'affiche, le H2, le corps et le label : la famille, la casse et la taille travaillent ensemble. C'est un bon système.
- **Le rôle « label » a quatre traitements pour un seul usage** :
  - mono en casse de phrase (« About Us », « Fitness Programs ») ;
  - mono en capitales (« WHY VYRON », « TRANSFORMATION ») ;
  - Tektur en capitales (« EXPERT COACHES ») ;
  - Inter en capitales (« AVERAGE RATING… », « MENU »).
  
  Il faut le ramener à **deux rôles** :
  - **meta-donnée**, en mono ;
  - **catégorie**, en Tektur 500 capitales avec +0,02em.
- **Le H3 a trois tailles pour un seul usage** (32, 34 et 39 px). Il faut un seul palier, `subheading`, à 36 px.
- **Les index 01–05 de l'équipe sont en 12 px gris** à côté des noms en 16 px blanc cassé. La hiérarchie est juste, mais l'élément tombe sous le seuil de lisibilité.

### 6.3 Échelle et cohérence

- **Points réguliers** : le H2 garde 56 px et un interligne de 1,0 dans quatre sections, et le corps garde 16 px et 1,29.
- **Points incohérents** :
  - l'alignement optique du display : BUILD est compensé, SERVICES. ne l'est pas. Règle proposée pour tout display Tektur : `margin-inline-start: -0.056em`, soit l'approche gauche des fûts droits (≈ 0,017em pour V, W et Y) ;
  - l'alignement de la note latérale des H2 : choisir l'alignement sur la **dernière ligne de base** (`align-items: last baseline`) partout, comme pour le lead du hero ;
  - la casse des labels (voir § 6.2) ;
  - deux gris de corps sur le même fond sombre (#9BA6A5 et #CAD5D4). Les nommer comme deux tokens (`text-muted` et `text-secondary`) plutôt que de les laisser au hasard ;
  - le wordmark : 600 dans le header, 600 à 700 dans le footer. Utiliser un seul SVG.

### 6.4 Lecture et contraste

- **Mesure.** Les blocs de corps font 37 à 40 caractères par ligne, en dessous des 45 à 75 recommandés. C'est acceptable pour des légendes de 2 ou 3 lignes. Au-delà de 3 lignes, il faut élargir à 60–70 caractères.
- **Clair sur foncé** (section Why, footer). Le shot applique l'inverse des règles d'Impeccable : corps en **Light 300 avec tracking négatif et interligne de 1,29**. `typeset.md` demande de compenser sur trois axes :
  - un peu plus d'interligne (1,5) ;
  - un peu plus de tracking (−0,011em au lieu de −0,03) ;
  - une graisse de plus (400).
- **Contrastes estimés** (couleurs échantillonnées ; la couleur exacte relève de l'analyse couleur) :

| Paire | Ratio | Taille / graisse | Verdict |
|---|---|---|---|
| Blanc sur rouge #F02B42 (boutons, marquee, légende « AVERAGE RATING… », onglet « Back To Home ») | **4,09:1** | 16–18 px, 400 | **Échec AA** (texte normal). Deux corrections : rouge des surfaces portant du texte à **#E3293E (4,51:1)**, même teinte un ton plus bas ; ou libellé en Tektur 600 ≥ 19 px (« large bold », seuil 3:1). |
| Tags #6D7877 sur #05100F | **4,23:1** | 16 px, 500 | Échec léger. Passer à **≥ #727D7C** (4,5:1) ou #8A9594. |
| Index #6A7574 sur #05100F | **4,05:1** | **12 px** | Échec, et texte trop petit. Passer à 14 px et ≥ 4,5:1. |
| Rouge #F02B42 sur #05100F (accent) | 4,72:1 | 24 px | OK |
| Rouge #F02B42 sur #F5F5F5 (SERVICES.) | 3,76:1 | 273 px | OK (grand texte, ≥ 3:1) |
| Mono #6D6E70 sur #F5F5F5 | 4,68:1 | 16 px mono 400 | OK de justesse. Ne jamais passer en 300. |
| Corps #6F7173 sur blanc | 4,90:1 | 16 px | OK |
| Corps #9BA6A5 sur #05100F | 7,72:1 | 16 px | OK |
| Blanc sur la photo rouge du hero | 5,7 à 8,2:1 | 18 px et plus | OK localement, mais la photo varie : prévoir un voile si l'image change. |

### 6.5 Stress

- **Français.** Tektur, Inter et Plex Mono couvrent é, è, à, ç, Œ, « », ’, … et — dans le sous-ensemble *latin*, qui suffit. Aucun des trois ne contient l'espace fine insécable U+202F (le navigateur la prend dans une police de repli, sans dommage visible ; on peut aussi utiliser U+00A0).
- **Collision des accents en display (MESURÉ sur les fichiers).** Chez Tektur, É monte à 0,865em, soit 0,165em au-dessus de la capitale. Avec l'interligne de 0,81 du hero, il ne reste que 0,11em entre la ligne de base 1 et le haut des capitales de la ligne 2. **Un É en 2ᵉ ligne mord d'environ 10 px dans la 1ʳᵉ à 180 px.** Il faut un interligne ≥ 0,9 dès qu'une capitale accentuée tombe en ligne 2. Le H2 à 1,0 passe (marge de 0,135em).
- **Masques de révélation** (animation ligne par ligne avec `overflow: hidden`). Avec un interligne de 0,81, les capitales tiennent dans la boîte (marge de 0,055em), mais **les accents et les descendantes sont rognés**. Il faut prévoir un `padding-block` ou un `clip-path: inset(-0.2em 0)` sur le masque.
- **Allongement.**
  - SERVICES. reste « SERVICES. » en français.
  - « Meet the Team » devient « Rencontrer l'équipe » (+46 %).
  - Le H2 « HIGH-INTENSITY… » en français fait environ +5 à +15 %.
  
  Le H2 (max ≈ 13,5em, `text-wrap: balance`) absorbe la différence. Les boutons doivent être en largeur intrinsèque, pas fixe.
- **Zoom.** Le `clamp()` avec bornes en rem et terme rem + vw respecte le zoom du texte. Un `font-size` en `vw` pur échouerait au critère WCAG 1.4.4.
- **Repli.**
  - Tektur n'a aucun sosie système. Le craft-floor interdit Impact ou Arial Black comme voix display : le repli ne doit exister que le temps du chargement.
  - Il faut générer des surcharges de métriques pour le repli : `size-adjust`, `ascent-override: 100%`, `descent-override: 30%`, `line-gap-override: 0%`. On peut les obtenir via Fontaine, Capsize, ou l'API Fonts d'Astro si elle est retenue (expérimentale en 5.x).
  - Il faut `font-synthesis: none` : Tektur n'a pas d'italique, et il ne faut jamais de faux gras ni de faux italique.
- **Glyphes idiosyncratiques en petit.** Le Y et le 4 de Tektur se lisent moins bien sous 14 px (« 24/7 » en 12 px donne quelque chose comme « 2Ч/7 »). Il faut garder Tektur à 14 px au minimum.

### 6.6 Livraison

| Fichier (sous-ensemble *latin*, woff2) | Poids |
|---|---|
| Tektur variable (wght 400–900, wdth 75–100) | **19,2 KB** |
| Inter variable (wght + opsz) | 72,9 KB |
| Inter Tight variable (si choisi à la place) | 44,9 KB |
| IBM Plex Mono 400 | 14,7 KB |

Le total est ≈ **107 KB** avec Inter, ou ≈ 79 KB avec Inter Tight.

- **Auto-héberger** les fichiers (Fontsource : paquets variables de Tektur et d'Inter, et Plex Mono ; à vérifier à l'installation) et **précharger uniquement Tektur**. Le texte du hero est très probablement l'élément LCP.
- **Animer seulement après le chargement des polices.**
  - Il faut découper le texte (SplitText ou équivalent) **après** `document.fonts.ready`, ou `document.fonts.load('500 1em Tektur')` avec un délai de garde. Sinon, les coupures de lignes calculées avec la police de repli seront fausses.
  - L'état par défaut doit rester visible (craft-floor : l'animation part d'un état déjà visible). Le texte découpé doit garder son nom accessible (aria-label sur le parent).
- **Fonctionnalités OpenType utiles.**
  - Tektur : `kern`, `liga`, `tnum`/`pnum`.
  - La version Google Fonts d'Inter n'a pas les cv/ss (a simple étage, chiffres ouverts) ; il faudrait la version de rsms. Ce n'est pas nécessaire ici.
- **Surfaces navigateur** (craft-floor) : thémer `::selection` (rouge et blanc), `caret-color`, `text-underline-offset` (≈ 0,2em sous Tektur) et les chiffres tabulaires des données.

### 6.7 Tensions avec le craft-floor : décisions pour toi (le brief gagne)

| # | Règle Impeccable | Ce que fait le shot | Options | Ma recommandation |
|---|---|---|---|---|
| 1 | Display au plus 6rem | 11,25 à 17rem (180–273 px), wordmark ≈ 14rem | A. garder ; B. plafonner | **A.** C'est le monde du shot. Garde-fous : mots uniques (pas de césure en display, `hyphens: manual`), taille liée au conteneur, vrai `h2` sémantique, `aria-hidden` sur les répétitions décoratives. |
| 2 | **Eyebrow ou kicker au-dessus d'un titre : interdit sans exception** (« no brief earns it back ») | « \|\|\|\|\|\|\|\| WHY VYRON », « About Us », « Fitness Programs », « TRANSFORMATION » | A. fidélité ; B. supprimer ; C. **transformer** en repère fonctionnel | **C.** Garder le motif des traits rouges, mais lui donner un rôle : jauge de progression de la section (les traits se remplissent au scroll) et nom de section dans un rail latéral ou sticky, **pas au-dessus du H2**. À défaut, B. |
| 3 | Numéros de section seulement si la séquence apporte une information | 01/02 géants (services), 01–04 (programmes), 01–05 (équipe), 01 (témoignage) | A. tout garder ; B. ne garder que ce qui informe | **B.** Le « 01 / 05 » du carrousel indique une position : à garder. Les 01/02 géants sont un motif graphique assumé (`aria-hidden`). Les index de l'équipe en 12 px sont à supprimer. Les numéros de l'accordéon ne restent que si les programmes forment une progression. |
| 4 | Mono comme costume ; IBM Plex dans la liste des défauts | Plex Mono sur les slogans et les labels | A. garder Plex partout ; B. mono réservé aux **données** ; C. changer de mono (Azeret Mono, Martian Mono condensé ; planche `sp_alt_mono.png`) ; D. supprimer le mono (labels en Tektur) | **B**, avec Plex (fidélité) ou C (personnalité). Le slogan « Trusted by people… » passe en Inter. |
| 5 | Inter-as-display (défaut des modèles) | Inter à 40 px pour le lead du hero | A. garder Inter Tight (fidélité 0,78–0,83) ; B. Inter opsz 32 à −0,02em (largeur identique, tracking dans la plage recommandée par Inter) ; C. grotesque à caractère : Archivo ou Host Grotesk (planche `sp_alt_body.png`) | **B.** Un seul fichier Inter pour tout le système. La voix reste Tektur. |
| 6 | Plancher de tracking −0,04em | Lead ≈ −0,045em ; chiffres jusqu'à −0,06em | resserrer moins | Lead à −0,02em, chiffres à −0,03em. |
| 7 | Corps de 65 à 75 caractères | Légendes de 37 à 40 caractères | — | OK pour 3 lignes au plus. Paragraphes à 60–70 caractères. |
| 8 | Contraste 4,5:1 | Blanc sur rouge 4,09 ; tags 4,23 ; index 4,05 | — | Voir § 6.4 : rouge des surfaces texte #E3293E ou libellés en 600 ≥ 19 px ; gris ≥ #727D7C ; micro à 14 px au minimum. |
| 9 | Copie et ponctuation | Apostrophe droite (DON'T), guillemets droits ("I came here…") | — | ’ “ ” (ou « » en FR) et ponctuation en retrait. Option : garder l'apostrophe droite dans les titres Tektur, si on la considère comme un trait du monde. |

---

## 7. Garder le monde, améliorer la lisibilité

1. **Une police variable Tektur, quatre graisses par rôle** : 400 pour les boutons ; 500 pour le display, les tags, les chiffres et l'accent ; 600 pour les titres et le logo ; 700 réservé au wordmark. Toujours en wdth 100, et −0,02em sur le display.
2. **`tabular-nums` sur tous les chiffres Tektur** (01/02, stats, index). C'est fidèle au « 1 » à pied et indispensable pour les compteurs animés.
3. **Corps en Inter 400 à 16 px fixe, −0,011em, interligne 1,45 sur clair et 1,5 sur sombre**, à la place du Light serré du shot. Le gain de lisibilité est net et la texture reste la même.
4. **Deux rôles de label au lieu de quatre** : mono pour les meta-données et Tektur 500 en capitales (+0,02em) pour les catégories. Rien en dessous de 14 px.
5. **Fusionner les H3 à 36 px.** Aligner les notes latérales sur la dernière ligne de base, et aligner optiquement tout display Tektur (−0,056em).
6. **Interligne du display à 0,82**, porté à 0,9 si le contenu français met une capitale accentuée en 2ᵉ ligne. Masques de révélation avec débord vertical.
7. **Contrastes** : rouge des surfaces texte légèrement assombri, ou libellés en 600 ≥ 19 px ; gris des tags et des index remontés.
8. **Animation typographique ancrée dans la police.** Les axes de Tektur (wdth 75–100, wght 400–900) permettent un geste signature : par exemple, SERVICES. qui s'élargit de wdth 75 à 100 en entrant dans l'écran (« build strength »), ou le passage de 500 à 600 au survol des boutons.
   - Il faut le faire avec parcimonie : animer `font-variation-settings` relance la mise en page du texte à chaque image.
   - On peut l'isoler dans une boîte de taille fixe (`contain: layout`) et le désactiver sous `prefers-reduced-motion`.
   
   Le reste de la chorégraphie relève de l'analyse motion.

---

## 8. Questions pour toi (typographie)

1. **Langue du site** : français, anglais ou bilingue ? Cela change l'interligne du display (accents), la largeur des boutons, les guillemets et les espaces fines.
2. **Nom de marque** : garder « VYRON », ou le renommer pour le portfolio ? Le logo repose sur le **Y de Tektur**. Si tu renommes, choisis des lettres qui montrent les glyphes signature (Y, G, S, 4).
3. **Eyebrows** (§ 6.7 n° 2) : A (fidélité), B (suppression) ou C (repère fonctionnel / progression au scroll) ?
4. **Mono** (§ 6.7 n° 4) : garder IBM Plex Mono par fidélité, en le réservant aux données, ou passer à Azeret Mono ou Martian Mono ?
5. **Corps** : acceptes-tu Inter 400 avec plus d'interligne et moins de tracking, au lieu du Light serré du shot ?
6. **Rouge des surfaces portant du texte** : #E3293E (4,5:1 avec du blanc), ou libellés en Tektur 600 ≥ 19 px, pour garder le rouge du shot intact ?
7. **Animation des axes variables de Tektur** (wdth et wght) : partant pour en faire un geste signature unique ?
8. **Captures haute définition** des sections About, Programs, Transformation et Footer : peux-tu les fournir ? Les rôles du § 3.4 sont aujourd'hui INFÉRÉS.

---

## 9. Preuves (dossier `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/work/a2-typography/`)

- **Le fichier `report.md` n'a pas été écrit** : le harnais refuse l'écriture de fichiers de rapport par un sous-agent. Ce texte est la version de référence.
- **Crops de référence** :
  - `c_hero_display.png`, `c_wordmark.png`, `c_hero_list.png`, `c_hero_sub.png` ;
  - `c_svc_heading.png`, `c_svc_mono.png`, `c_svc_card1.png`, `c_svc_numerals_lo.png`, `c_01_lo_zoom.png`, `c_01_hi_zoom.png` ;
  - `c_why_label.png`, `c_why_results.png`, `c_why_tags.png`, `c_why_btn.png`, `c_why_names.png`, `c_dont.png` ;
  - `c_marquee.png`, `c_footer_nav.png`, `c_footer_tabs.png`.
- **Montages de score** (référence en haut, candidats classés) :
  - display : `cmp_strength.png` (58 polices), `cmp_strength2.png`, `cmp_build.png`, `cmp_services.png` ;
  - titres et logo : `cmp_h1.png`, `cmp_h2.png`, `cmp_built.png`, `cmp_vy.png`, `cmp_fvy.png`, `cmp_func.png` ;
  - petits rôles Tektur : `cmp_btn.png`, `cmp_tag.png`, `cmp_res.png` ;
  - chiffres : `cmp_01b.png`, `cmp_02b.png`, `cmp_02t.png`, `cmp_01_visual.png` ;
  - axe de largeur : `cmp_var_str.png`, `cmp_var_svc.png` ;
  - Inter : `cmp_phys.png` (47 grotesques), `cmp_phys2.png`, `cmp_redef.png`, `cmp_pump.png`, `cmp_lift.png`, `cmp_card.png`, `cmp_body.png`, `cmp_var_inter.png` ;
  - mono : `cmp_trust.png` (40 monos), `cmp_why.png`, `cmp_fit.png`.
- **Planches de spécimens** :
  - Tektur : `sp_tektur_weights.png` (Y, P, 4, minuscules), `sp_tektur_tnum.png` (`1` tabulaire à pied), `sp_tektur_numerals.png` ;
  - concurrents écartés : `sp_display_mono1.png` ;
  - alternatives : `sp_alt_mono.png`, `sp_alt_body.png` ;
  - divers : `sp_apostrophe.png`, et `sp_system_1440.png` (les 14 rôles mesurés rendus à leur taille 1440 : reconstitution fidèle du shot).
- **Masques binarisés** : `mask_redefine1.png`, `mask_redefine2.png`, `mask_trusted.png`, `mask_pump.png`.
- **Outils** (`tools/`) :
  - `render.mjs` : rendu Google Fonts avec wght, wdth/opsz, tracking et features ;
  - `render_var.mjs` : balayage des axes variables ;
  - `compare.py` : score IoU, largeur, encre et montage ;
  - `lines.py`, `measure.py`, `profile.py` : métriques de lignes et de boîtes ;
  - `features.mjs` : rendu de features OpenType ;
  - `system.mjs` : planche des rôles.
- **Cache des polices** : `fontcache/` (woff2 servis par Google Fonts, dont `var_Tektur.woff2`, `var_Inter.woff2`, `var_IBM_Plex_Mono.woff2`).