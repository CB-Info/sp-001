# Direction « Tracé » : la page qui bat (V2 CAP FITNESS)

## A. Nom de la direction et thèse

**« Tracé »**

1. La page n'a qu'un seul instrument : le complexe ECG du logo CAP, redessiné au point près.
   - Il écrit chaque chapitre à vitesse de papier constante.
   - Il porte les titres sur sa ligne de base.
   - Ce que son pic touche passe du contour au plein, ce qui reprend la grammaire « CAP au trait, FITNESS en plein » du logo.
2. Elle déroule une vraie séance sur le noir chaud du logo, avec des photos N&B en clé basse et un seul accent citron. Les étapes sont : échauffement, montée, pic, rythme de la semaine, cœur, retour au calme, récupération, puis le dernier battement. La pièce maîtresse est le vrai planning du flyer, tracé comme un électrocardiogramme et placé à l'heure de Paris.
3. Elle refuse :
   - la lueur néon, le cœur-icône et le fluo en fond ;
   - les cartes, les surtitres et les chiffres inventés ;
   - toute boucle qui bat seule.

   Le tracé ne bouge que quand tu bouges, et il se tait au repos.

---

## B. Système visuel

### B1. Palette

Les tokens sont posés sous `:root[data-site='v2']`. Les contrastes WCAG 2.x ont été recalculés pour ce document.

| Token             | Hex     | Rôle                                                                | Contrastes vérifiés                                                                           |
| ----------------- | ------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `--cf-noir`       | #0C0C0B | Fond principal (`--bg`)                                             | —                                                                                             |
| `--cf-carbone`    | #1C1B19 | Fond exact du logo ; surfaces Planning et Premier cours             | noir/carbone 1,14 : séparer par une rupture d'image, jamais bord à bord                       |
| `--cf-bande`      | #232220 | Bande du jour courant (planning)                                    | décoratif                                                                                     |
| `--cf-graphite`   | #2A2926 | Carreaux d'heure du papier ECG, filets décoratifs                   | graphite/carbone 1,18 (décoratif)                                                             |
| `--cf-filet`      | #6E6C66 | Bordures d'UI, trait du moniteur                                    | 3,73 sur noir ; 3,28 sur carbone (≥ 3:1, 1.4.11)                                              |
| `--cf-passe`      | #787670 | Tracé « terminé » du planning                                       | 3,79 sur carbone ; 3,50 sur la bande                                                          |
| `--cf-gris`       | #A3A199 | Texte secondaire, contours des données « à confirmer »              | 7,56 noir ; 6,65 carbone ; 6,14 bande                                                         |
| `--cf-craie`      | #F2F1EC | Texte courant, tracé « instrument »                                 | 17,30 noir ; 15,22 carbone ; 14,06 bande                                                      |
| `--cf-blanc`      | #FFFFFF | Mots pleins du display, tracé plein, logo                           | 19,57 noir ; 11,55 sur photo à #393939                                                        |
| `--cf-citron`     | #CCD52F | Accent unique : contours, tracé tube, action, focus, prochain cours | 12,23 noir ; 10,76 carbone ; 9,94 bande ; 7,22 sur photo à #393939 ; 5,54 sur photo à #4A4A4A |
| `--cf-citron-vif` | #D9E34A | Survol et appui du bouton                                           | texte noir 14,01                                                                              |
| `--cf-lime`       | #99C336 | **Uniquement** en fin de l'« ourlet » du pied de page               | texte noir 9,52                                                                               |

**Rôles sémantiques (mêmes noms que la V1)**

| Rôle                                 | Valeur                                    |
| ------------------------------------ | ----------------------------------------- |
| `--bg`                               | noir                                      |
| `--surface`                          | carbone                                   |
| `--ink`                              | craie                                     |
| `--ink-muted`                        | gris                                      |
| `--rule`                             | graphite                                  |
| `--accent`                           | citron                                    |
| `--accent-fill`                      | citron                                    |
| `--on-accent`                        | noir                                      |
| `--focus`                            | citron (anneau de 2 px, décalage de 2 px) |
| `--selection-bg` / `--selection-ink` | citron / noir                             |

Autres réglages : `color-scheme: dark`, `scrollbar-color: #6E6C66 #0C0C0B`, `theme-color` à #0C0C0B, `caret-color` et `accent-color` en citron.

Les surfaces passent par `[data-site='v2'] [data-surface='noir'|'carbone'|'photo']`.

**Règles mesurables**

- **Blanc sur citron : interdit** (1,60).
- **Citron sur lime : interdit** (1,29).
- Les deux verts ne sont jamais voisins. Le vert herbe #78A014 du flyer est banni.
- **Part de pixels citron ≤ 10 %** par capture de 1440×900. Mesure : masque OKLCH, teinte 105–120°, chroma ≥ 0,12. Un seul aplat citron massif sur la page : le mot « loin. » plein du chapitre Fin.
- **Photo sous un mot en contour : luminance p95 ≤ 30 %** (citron ≥ 5,5:1).
- **Photo sous du texte courant : p95 ≤ 15 %.**
- **Aucune** `box-shadow`, aucun `text-shadow`, aucun `background-clip: text`, aucun dégradé sur du texte. Rayon 0 partout.

**Dégradé « ourlet »** : il n'apparaît qu'une fois, dans une bande de 160 px (120 px en mobile) en bas du pied de page, sans aucun texte dessus.

```css
linear-gradient(180deg in oklab, #0C0C0B 0 42%, #2A331A 60%, #72902F 85%, #99C336)
```

### B2. Typographie

**Deux familles, toutes deux en @fontsource**, auto-hébergées par `scripts/sync-fonts.mjs` :

| Police                                                   | Paquet                               | Usage                                                          | Fichier livré                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Anybody** (variable, axes wdth 50–150 et wght 100–900) | `@fontsource-variable/anybody@5.3.0` | Display uniquement, toujours en capitales par `text-transform` | **Sous-ensemble maison** : axes limités à wdth 60–150 et wght 700–900. Glyphes : capitales, accents français, Œ, chiffres, ponctuation, U+00A0, U+2019, « ». Fonctions `kern`, `tnum`, `case`. **18 008 o** en woff2, contre 56 888 o pour le fichier fontsource « wdth ». Prototype : `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit/sub/anybody-display-maj.woff2`. Préchargé. |
| **Figtree** (variable, wght 300–900)                     | `@fontsource-variable/figtree@5.3.0` | Texte courant, interface ; italique 500 pour la voix signature | Romain latin 20 156 o (préchargé) ; italique 20 928 o (sans préchargement)                                                                                                                                                                                                                                                                                                                                                |

- Métriques mesurées d'Anybody : unités par em 2000, capitale 0,675 em, ascendante 0,795, descendante 0,24.
- Figtree : capitale 0,70.
- **Aucune des deux n'a U+202F** ; Figtree n'a pas non plus U+2009. `typesetDeep` place donc U+00A0, comme pour la V1.
- Montserrat 900 (CAP, signature) et Exo 2 Black (FITNESS) ne servent **qu'à vectoriser le logo**. Elles ne sont jamais chargées.

**Rôles et échelle fluide**

Les `clamp()` sont linéaires entre 390 et 1440 px, avec des bornes en rem.

| Rôle                                                 | Police et axes                                                                                                                   | 390      | 1440       | `font-size`                                                                                | Interligne / approche              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------ | ---------------------------------- |
| `--text-giant` (mots-étendards en contour)           | Anybody, wdth 150 (wdth 100 sous 48em), wght 900, contour `-webkit-text-stroke: max(2px, .04em)` citron, remplissage transparent | 66–85 px | 172–320 px | ajusté au conteneur en `cqi` : `font-size: calc(100cqi / <largeur du mot en em>)` (§C, §D) | 0,8 / −0,01em                      |
| `--text-display` (titres de chapitre pleins)         | Anybody wdth 75, wght 900, blanc                                                                                                 | 44       | 112        | `clamp(2.75rem, 1.171rem + 6.476vw, 7rem)`                                                 | 0,9 (accent en 2ᵉ ligne) / −0,02em |
| `--text-title` (noms de cours, H3)                   | Anybody wdth 75, wght 900                                                                                                        | 32       | 72         | `clamp(2rem, 1.071rem + 3.81vw, 4.5rem)`                                                   | 0,92 / −0,015em                    |
| `--text-sub` (lignes pleines secondaires du display) | Anybody wdth 100, wght 900                                                                                                       | 28       | 64         | `clamp(1.75rem, 1.003rem + 3.429vw, 4rem)`                                                 | 0,95 / −0,01em                     |
| `--text-voice` (voix signature)                      | Figtree italique 500, citron, casse normale                                                                                      | 18       | 28         | `clamp(1.125rem, 0.893rem + 0.952vw, 1.75rem)`                                             | 1,25                               |
| `--text-lead`                                        | Figtree 400                                                                                                                      | 17       | 20         | `clamp(1.0625rem, 0.993rem + 0.286vw, 1.25rem)`                                            | 1,45                               |
| `--text-body`                                        | Figtree 400                                                                                                                      | 16       | 17         | `clamp(1rem, 0.977rem + 0.095vw, 1.0625rem)`                                               | 1,5                                |
| `--text-data` (horaires, jours)                      | Anybody wdth 60, wght 800, `tnum`                                                                                                | 16       | 20         | `clamp(1rem, 0.907rem + 0.381vw, 1.25rem)`                                                 | 1,1 / +0,01em                      |
| `--text-small` (mentions, libellés)                  | Figtree 500                                                                                                                      | 14       | 15         | `clamp(0.875rem, 0.852rem + 0.095vw, 0.9375rem)`                                           | 1,4                                |

**Rapports d'échelle**

- Géant / corps : 172 / 17 = **10,1** dans le hero ; 320 / 17 = **18,8** dans le chapitre Fin.
- Titre de chapitre / corps : 112 / 17 = 6,6.
- **Trois moments à 12vw ou plus** à 1440 : « rythme. » à 172 px, « famille. » à 187 px, « loin. » à 270 px.

**Largeurs mesurées en em** (Anybody wght 900, fontTools) :

| Mot                    | wdth 150 | wdth 100 | wdth 75 |
| ---------------------- | -------- | -------- | ------- |
| RYTHME.                | 7,154    | 4,827    | —       |
| FAMILLE.               | 7,032    | 4,699    | —       |
| LOIN.                  | 4,125    | —        | —       |
| CHACUN SON             | —        | 7,231    | —       |
| TOUS ENSEMBLE.         | —        | —        | 6,875   |
| FAIS MONTER LE CŒUR.   | —        | —        | 9,364   |
| ATTEINS TES OBJECTIFS. | —        | —        | 9,965   |

**Règles typographiques**

- **Chiasme plein / contour** : un mot en contour citron (≥ 64 px), son voisin en plein blanc. Jamais deux contours côte à côte.
- Le contour n'est jamais utilisé sous 64 px : en mobile, un mot prévu en contour mais trop petit passe en **plein citron**.
- Aucun surtitre ni libellé en capitales espacées au-dessus d'un titre. Au plus 6 éléments non-titres ont `letter-spacing` > 0,05em.
- Source en casse normale ; capitales par CSS.
- Typographie française à la source (`typesetDeep`) ; heures au format « 18 h 15 » en `tnum`.
- Deux « ! » au plus sur la page : « Bouge ! » et une FAQ.
- **Repli des polices sans CLS** : chaque mot géant vit dans une boîte de hauteur fixe (`line-height` en em, `white-space: nowrap`, `contain: layout`). L'échange de police ne déplace rien. Les replis « Anybody Fallback » et « Figtree Fallback » ont des métriques ajustées, générées par `sync-fonts.mjs`.

### B3. Grille

**Bureau**

- 12 colonnes. Conteneur de 1320 px, marges `clamp(20px, 4.17vw, 60px)`, gouttière de 20 px. Une colonne mesure 93,33 px.
- Bornes des colonnes à 1440 :

  | Colonne | Bord gauche | Bord droit |
  | ------- | ----------- | ---------- |
  | 1       | 60          | 153        |
  | 2       | 173         | —          |
  | 7       | 700         | —          |
  | 12      | —           | 1380       |

**Mobile (390)**

- 4 colonnes, marges de 20 px, gouttière de 16 px.

**La marge du pouls**

- C'est l'invariant de la direction, issu du logo où le tracé se branche sur le pied du C.
- Bureau : du bord du viewport à la fin de la colonne 1 (x 0 → 153). Mobile : x 0 → 52.
- Les complexes qui accompagnent un titre vivent là, sur la ligne de base du titre, et se raccordent au pied de sa première lettre.
- Deux chapitres seulement l'utilisent (Hero et Manifeste). Les autres placent leur tracé autrement : à droite façon logo, en donnée, plat, ou absent.

**Paddings de section (cinq valeurs)**

| Valeur bureau | Valeur mobile | Usage                                                          |
| ------------- | ------------- | -------------------------------------------------------------- |
| 240           | 120           | vide noir avant Famille                                        |
| 160           | 96            | —                                                              |
| 120           | 64            | —                                                              |
| 96            | 56            | —                                                              |
| 0             | 0             | sections qui commencent ou finissent sur une photo plein cadre |

**Autres règles**

- Pas de filet systématique entre les sections.
- Paliers : 48em pour passer au mot géant en wdth 150 ; 64em pour la courbe d'effort, le planning en 5 rangées et la navigation en ligne.
- Requêtes de conteneur sur les fiches.
- Hero : `max(100svh, 40rem)` moins 36 px (bandeau maquette) ; repli paysage à `height < 30em`.

### B4. Matières, lumière, couches

**Ordre des couches**, de bas en haut, toujours le même :

| #   | Couche              | Détail                                                                                                                                                                                        |
| --- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | surface             | noir ou carbone                                                                                                                                                                               |
| 1   | photo N&B           | —                                                                                                                                                                                             |
| 2   | grain               | tuile PNG 128×128 en niveaux de gris (σ 0,03, ≈ 3 Ko) sur le `::after` de chaque `.cap-photo`, en `mix-blend-mode: overlay`, opacité 0,07. Le grain n'est **pas cuit** dans l'image (voir B7) |
| 3   | voile ancré         | dégradé local sous le bloc de texte seulement, jamais un voile uniforme                                                                                                                       |
| 4   | lettrage en contour | intérieur transparent : la photo passe dans les lettres, comme dans la bannière                                                                                                               |
| 5   | tracé               | —                                                                                                                                                                                             |
| 6   | interface           | —                                                                                                                                                                                             |

**Lumière**

- La lumière vient de deux sources seulement : le contre-jour dans les photos, et le citron du graphisme.
- L'« ourlet » du pied de page est la seule lumière colorée de surface.

**Papier ECG**

- Uniquement derrière le planning.
- Petit carreau = 12 minutes = 34,46 px ; grand carreau = 1 heure = 172,3 px (rapport 5:1, comme le vrai papier ECG).
- Couleurs : #232220 pour les petits carreaux, #2A2926 pour les grands, sur carbone.

**Séquence des surfaces** : photo → noir → noir (photos de groupe, puis rupture plein cadre) → carbone → noir → carbone → photo plein cadre puis noir → noir → noir avec l'ourlet.

### B5. Le système du tracé

**Complexe canonique** : amplitude 100, ligne de base y = 0, y vers le bas, empan de 0,9 × l'amplitude.

```svg
<path d="M-45 0H0L10.4-44L27 37.5L48.6-100L53.1 92L76.5-29.5L90 0H135"/>
```

| Point                   | P      | Q      | R   | S     | T      |
| ----------------------- | ------ | ------ | --- | ----- | ------ |
| Hauteur (fraction de R) | +0,435 | −0,375 | +1  | −0,92 | +0,295 |

`app/utils/ecg.ts` génère tous les tracés **au rendu serveur**. C'est une interpolation linéaire par morceaux : les positions sur le tracé se calculent analytiquement, sans `getPointAtLength`.

**Trois styles, une seule forme**

| Style          | Épaisseur                                                                                                                                                                     | Usage                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Plein**      | polygone rempli de 0,08 cap, à pointes effilées                                                                                                                               | Accompagne un mot en contour (chiasme)         |
| **Tube**       | 0,15 cap de large, filet de 0,03 cap, bout en biseau à 45°. Masque : trait blanc de largeur W moins trait noir de largeur W − 2t, ce qui donne un tube réellement transparent | Accompagne un mot en plein ; données inconnues |
| **Instrument** | 1,5 px, `miter`, `stroke-miterlimit: 4`                                                                                                                                       | Données : moniteur, planning, courbe d'effort  |

**Règles**

- **Le tracé porte les mots** : sa ligne isoélectrique est à 0,9 cap sous le haut des capitales, c'est-à-dire sur la ligne de base.
- **Amplitude R = 1,1 × la hauteur de capitale** du mot accompagné.
- **Un grand tracé par écran.** Exceptions : le Hero, qui a deux complexes comme le logo, et deux « bandes » qui disent un rythme (Manifeste et Planning), où chaque battement est une phrase ou un vrai créneau.
- **Le moniteur de l'en-tête** (104×24 px) est le seul instrument permanent. Il passe à plat (opacité 0,4, 240 ms) quand un grand tracé s'écrit dans l'écran : un seul cœur bat à la fois.
- **Amplitude par phase de séance** (moniteur et tracés de titre) :

  | Phase           | Amplitude                 |
  | --------------- | ------------------------- |
  | échauffement    | 0,45                      |
  | montée          | 0,6                       |
  | pic             | 1                         |
  | rythme          | 0,8                       |
  | cœur            | 0,7                       |
  | retour au calme | 0,3                       |
  | récupération    | 0 (plat)                  |
  | ensemble        | 0 → 1 (dernier battement) |

- **Code d'état unique, pris au logo** : contour = fermé, inconnu, à venir ; plein = ouvert, confirmé, actif. Il s'applique au carré de la FAQ, aux créneaux filtrés, aux données « à confirmer » et à « loin. ».
- Jamais de lueur, de flou, de cœur, de croix, de bip, ni de clignotement de luminance calé sur le battement.

### B6. Iconographie

**Aucune icône.** Les seuls signes graphiques de la page sont :

1. le complexe ECG canonique ;
2. un carré de 10 px en contour, qui devient plein (état de la FAQ) ;
3. un filet en pointillé citron de 1 px, sous une donnée « à confirmer ».

Tout le reste est en texte :

- « Menu » et « Fermer » ;
- aucune flèche → ;
- « App Store » et « Google Play » en texte dans un cadre en contour, sans logo de store, avec « lien à venir » ;
- les réseaux sociaux en toutes lettres.

### B7. Traitement photo

Famille d'étalonnage **`cap-mono`**, à ajouter à `art/grade.py` (module importé par `art/cap/grade.py`) :

1. **Génération en couleur**, puis passage en N&B par **mélange de canaux** : R 0,45, G 0,45, B 0,10 (effet filtre orange : peaux claires, ciels et néons foncés). Saturation 0.
2. **Niveaux** : centile 0,5 → 4/255 ; centile 99,7 → 232/255.
3. **Courbe** : S de contraste 1,22 centrée sur 0,40 ; pied gamma 1,15 sous 0,25 (noirs denses) ; épaule douce au-dessus de 0,80.
4. **Vignettage** radial de −10 % aux coins (rayon 0,75 de la diagonale).
5. **Accentuation** : unsharp 0,4 px, 40 %.
6. **Cibles d'histogramme**, vérifiées par script :

   | Mesure                        | Cible     |
   | ----------------------------- | --------- |
   | médiane                       | 18 à 24 % |
   | p5                            | ≤ 3 %     |
   | p99                           | ≥ 85 %    |
   | zone sous texte courant, p95  | ≤ 15 %    |
   | zone sous mot en contour, p95 | ≤ 30 %    |

7. **Géométrie** : rognage de sécurité de 3 %, point focal déclaré par image, `object-position` lu dans les données. Recadrages dirigés (`CROPS`) : 4:5 pour le mobile, avec un **fondu cuit vers #0C0C0B** sur les 35 % bas pour le hero mobile.
8. **Livraison**
   - AVIF, WebP et JPEG ; largeurs 390, 640, 780, 1080, 1440, 1920 et 2560 ; noms à empreinte.
   - Hero bureau en AVIF 1440w ≤ 120 Ko ; hero mobile en AVIF 4:5 780w ≤ 40 Ko.
   - **Grain non cuit** : une image N&B lisse se compresse 30 à 40 % mieux.
9. **Placeholder** : chaque conteneur photo a une plaque floue de 32 px de large en WebP inline (≤ 600 o), plus `background: #1A1A19`. Plus de blocs vides en capture mobile.
10. **Provenance** : XMP IPTC `trainedAlgorithmicMedia`, prompt embarqué, `art/cap/manifest.json`. Mention en pied de page : « Visuels d'illustration générés par IA ».

### B8. Logo : reconstruction SVG et déclinaisons

Un script `scripts/build-logo.py` (tiré du générateur `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit-scripts/logo_build.py`) produit les SVG versionnés `app/assets/logo/cap-{horizontal,reduit,carre,monogramme,ecg}.svg`, puis un composant `CapLogo.vue` (chemins inline).

**Construction**

| Élément          | Procédé                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CAP**          | Glyphes de Montserrat 900, chevauchements supprimés (`removeOverlaps` + skia-pathops). Contour de 0,06 cap, centré, `miter`. Vectorisé en contour dans la version finale                         |
| **FITNESS**      | Exo 2 Black sans chevauchements. Condensé à 0,97, approche −0,04em, ratio 5,2:1. Deux fentes effilées à 22 % et 75 % de la hauteur, découpées par différence booléenne ; le I coupé se lit « ! » |
| **BY EBC SPORT** | Montserrat 500 italique, citron, +0,02em, ferrée à droite à 0,18 cap sous FITNESS                                                                                                                |
| **Tracés**       | Chemin canonique. Chiasme : à gauche, **blanc plein** contre CAP en contour ; à droite, **citron tube** contre FITNESS en plein                                                                  |

**Déclinaisons**

| Version                 | Unités (cap = 100)          | Usage                                                                        | Taille minimale |
| ----------------------- | --------------------------- | ---------------------------------------------------------------------------- | --------------- |
| Horizontale complète    | viewBox de 1120 × 210       | Pied de page (720 px), image OG                                              | ≥ 400 px        |
| Réduite (CAP + FITNESS) | 820 × 100                   | En-tête : 200 px de large (cap de 24 px, contour de 1,46 px) ; mobile 184 px | ≥ 180 px        |
| Carrée / empilée        | 2,44:1, ECG blancs en tube  | Avatar, image de partage carrée                                              | ≥ 300 px        |
| Monogramme CAP          | contour citron              | Page 404                                                                     | ≥ 64 px de haut |
| ECG seul                | plein citron sur carré noir | Favicon SVG (trait épaissi à 10 %), apple-touch 180 px                       | 32 px           |

**Règles d'emploi**

- Zone de protection : la hauteur de capitale de FITNESS.
- Jamais sur citron, jamais sur fond clair, jamais la bitmap.
- Accessibilité : `role="img"`, `aria-label="CAP Fitness by EBC Sport"`.
- **Image OG** de 1200×630 composée au build (sharp) : recadrage du hero, logo complet de 640 px, et la mention lisible « Maquette non officielle ».

---

## C. Le hero au pixel près

**Titre accessible :** « Chacun son rythme. Tous ensemble. » (un seul `<h1>`, lu d'une traite ; tracés en `aria-hidden`).

### C1. Bureau, 1440×900

| y (px)  | Élément                                        | Position, taille, style                                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–36    | Bandeau maquette                               | Fond carbone, filet bas #2A2926. Figtree 500 14 px gris : « Maquette non officielle : proposition de site pour CAP Fitness by EBC Sport. Les éléments “à confirmer” attendent les infos du club. » Lien « Pourquoi ? » → `#maquette`                                                               |
| 36–108  | En-tête, 72 px, transparent sur la photo       | Logo réduit à x 60 (200 px). Navigation Figtree 600 15 px craie à x 520–860 : Cours, Planning, Famille, Infos. Moniteur à x 1040–1144, y 60–84. Bouton secondaire « Réserve ta place » à x 1180–1380, 44 px (filet craie, texte craie)                                                             |
| 36–900  | Photo `cap-hero` plein cadre (1440×864, cover) | Sujet A au tiers droit : tête à x 1000–1150, y 160–330, au-dessus de la zone du titre. Groupe flou entre x 300 et 1300, y 200 et 520 ; le bas gauche (sol caoutchouc) reste sombre. Voile ancré : `linear-gradient(to top, #0C0C0B 0, rgb(12 12 11 / .82) 30%, transparent 100%)` de y 640 à y 900 |
| 377–420 | Ligne A « Chacun son »                         | Anybody wdth 100 / 900, 64 px, blanc plein. x 150, ligne de base 420, largeur 463 px                                                                                                                                                                                                               |
| 444–560 | Ligne B « rythme. »                            | Anybody wdth 150 / 900, **172 px** (`calc(100cqi / 7.154)` sur un conteneur de x 150 à 1380, soit 1230 px). Contour citron de 0,04em (6,9 px), intérieur transparent : la photo passe dans les lettres. Ligne de base 560, capitale de 116 px                                                      |
| 432–678 | Tracé gauche, **plein blanc**                  | Ligne isoélectrique y 560 de x 0 (pointe effilée au bord du viewport) à x 150, raccordée au pied du R. Complexe sur x 22–137 : amplitude 128 (R à y 432), S à y 678. Épaisseur 9 px (0,08 cap)                                                                                                     |
| 571–636 | Ligne C « Tous ensemble. »                     | Anybody wdth 75 / 900, 96 px, blanc plein. x 150–810, ligne de base 636. 11 px sous la ligne de base de B (le serrage CAP/FITNESS du logo)                                                                                                                                                         |
| 570–697 | Tracé droit, **tube citron**                   | Ligne isoélectrique y 636 de x 822 jusqu'au bord droit (x 1440 : il sort de l'écran et part vers la suite). Complexe sur x 846–905 : amplitude 66 (R à y 570, à 10 px sous « rythme. »), S à y 697. Tube de 10 px, filet de 2 px                                                                   |
| 690–777 | Chapô                                          | Figtree 400, 20/29, craie, x 150, largeur 520 px, 3 lignes : « Pound, Cardio Jump, Cross training, Pilates… Huit disciplines, des coachs diplômés et une salle où l'on se dépasse ensemble, dans la bonne humeur. »                                                                                |
| 808–864 | Action                                         | Bouton citron plein « Réserve ta place » (Figtree 600 17 px, texte noir, 56 px de haut, rayon 0) à x 150, ancre `#reserver`. Lien texte « Voir le planning » à x 392, souligné de 1 px, même ligne de base                                                                                         |
| 810–864 | Prochain cours                                 | Ferré à droite sur x 1380. « Prochain cours » en Figtree italique 500, 16 px citron (ligne de base 826). Dessous : « Lundi · 13 h 00 · Pound », Anybody wdth 60 / 800, 22 px craie, `tnum` (ligne de base 856)                                                                                     |

### C2. Mobile, 390×844

| y (px)  | Élément                        | Détail                                                                                                                             |
| ------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 0–36    | Bandeau                        | « Maquette non officielle · infos à confirmer », lien « Pourquoi ? »                                                               |
| 36–92   | En-tête, 56 px                 | Logo réduit de 184 px à x 20. Bouton « Menu » 44×44 à x 326. Le bouton d'action est dans le hero puis dans la barre basse          |
| 36–524  | Photo, recadrage 4:5 (390×488) | Fondu cuit vers #0C0C0B sur les 35 % bas                                                                                           |
| 494–516 | Ligne A « Chacun son »         | 32 px, wdth 100, x 52, largeur 231 px                                                                                              |
| 533–578 | Ligne B « rythme. »            | wdth 100, **66 px** (`calc(100cqi / 4.827)`, conteneur de x 52 à 371), contour de 2,6 px. Ligne de base 578                        |
| 529–623 | Tracé gauche, plein            | x 0–52, épaisseur 3,6 px. Complexe sur x 4–48, amplitude 49                                                                        |
| 590–620 | Ligne C « Tous ensemble. »     | wdth 75, 44 px, x 52–354, ligne de base 620. Tube citron de 4,5 px, de x 360 à 390, **sans complexe** (un seul complexe à l'écran) |
| 642–690 | Chapô                          | Figtree 17/24, x 52–370 : « Huit disciplines, des coachs diplômés, une salle où l'on se dépasse ensemble. »                        |
| 714–766 | Action                         | Bouton de 52 px à x 52 ; lien « Voir le planning » à x 258                                                                         |
| 786–818 | Prochain cours                 | Une ligne : italique citron 14 px plus données Anybody 17 px : « Prochain cours · lun. 13 h 00 · Pound »                           |

### C3. Les deux premières secondes

L'intro est en **keyframes CSS**, sans GSAP. Elle part de `hero-ready`, posé par `boot.inline.js` après le décodage de `[data-intro-media]` et le chargement de la police `900 1em Anybody`, au plus tard 1,2 s après le parsing.

| t (ms)      | Événement                                                                               | Paramètres                                                                                 |
| ----------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 0 → 1300    | La photo se pose                                                                        | `scale 1.035 → 1`, `--ease-out`. Jamais à opacité 0 (élément LCP)                          |
| 0 → 420     | Ligne A monte dans son masque                                                           | Translation de 0,4em → 0, `--ease-out`                                                     |
| 85 → 505    | Ligne C, même mouvement                                                                 | —                                                                                          |
| 120 → 480   | **Écriture du tracé gauche** depuis le bord de l'écran                                  | `stroke-dashoffset 1 → 0`, `pathLength="1"`, **linéaire** (vitesse de papier : 417 px/s)   |
| ≈ 322       | **Frappe** : le pic R atteint le haut                                                   | —                                                                                          |
| 322 → 742   | Une copie pleine citron de « rythme. » (`aria-hidden`) balaie le mot de gauche à droite | Double translation conteneur / contenu, composée : rien n'est repeint. `--ease-in-out`     |
| 742 → 982   | Elle se retire vers la droite                                                           | `--ease-in`. Le mot redevient contour. Un seul changement de luminance, aucun flash répété |
| 600 → 1120  | Écriture du tube citron droit, de x 822 jusqu'au bord                                   | Linéaire, 520 ms                                                                           |
| 700 → 1100  | Les 3 lignes du chapô montent dans leur masque                                          | Décalage de 85 ms, 320 ms chacune                                                          |
| 900 → 1140  | Le prochain cours apparaît                                                              | Opacité seule, 240 ms                                                                      |
| 1240 → 2000 | Immobilité totale                                                                       | Le moniteur affiche un complexe statique d'amplitude 0,45 et le mot « échauffement »       |

- Le bouton est **visible et cliquable dès t = 0** ; il n'est jamais animé.
- Mobile : même partition, sans le tube droit (ligne de 30 px tracée à t = 600 en 120 ms).

### C4. Sans JS et en mouvement réduit

- Tout est à l'état final :
  - tracés entièrement dessinés (pas de `dasharray`) ;
  - « rythme. » en contour ;
  - textes visibles ;
  - photo à l'échelle 1.
- Le prochain cours est rendu à la génération sous la forme « Premier cours de la semaine · Lundi · 13 h 00 · Pound ». C'est vrai sans horloge.
- Avec JS mais en mouvement réduit : rendu identique, mais le libellé passe à « Prochain cours » calculé à l'heure de Paris, et ni GSAP ni OGL ne sont jamais téléchargés.

---

## D. Section par section

Il y a 8 chapitres. Ancres : `#cours`, `#planning`, `#reserver`, `#famille`, `#premier-cours`, `#infos`, `#fin`, `#maquette`.

### 0. Bandeau, en-tête, moniteur, barre mobile (cadre, hors chapitres)

**Rôle** : marque, navigation, une action, transparence.

**Composition**

- Le bandeau (§C) défile avec la page ; il n'est pas collant.
- **En-tête collant**
  - 72 px puis 56 px au-delà de 120 px de défilement ; fond #0C0C0B opaque et filet bas #2A2926. Pas de verre ni de flou.
  - Le lien de la section courante est souligné en citron (2 px).
- **Passage de témoin du bouton** : tant que le bouton du hero est visible, celui de l'en-tête est secondaire (filet craie). Ensuite il devient citron plein (240 ms). Un seul aplat d'action par écran.
- **Moniteur** (`CapMonitor`, ≥ 64em, `aria-hidden`)
  - SVG de 104×24 : tracé instrument #787670, tête d'écriture ronde craie de 4 px, rémanence (masque dégradé : 0–40 px derrière la tête en craie, puis #787670).
  - À droite, le mot de phase en Figtree italique 500, 14 px citron : « échauffement », « montée », « pic », « rythme », « cœur », « retour au calme », « récupération », « ensemble ».
- **Barre mobile** (< 64em)
  - Collée en bas, 64 px plus la zone de sécurité, fond noir, filet haut.
  - Contenu : « Prochain cours » (italique citron 14 px) + « Mer. 18 h 00 · CAF » (Anybody 60/800, 18 px) + bouton « Réserver » de 44 px.
  - Elle apparaît quand le bouton du hero quitte l'écran (IntersectionObserver) et se masque quand `#reserver` ou la Fin sont visibles.

**Interaction**

- Navigation : défilement programmé de 1200 ms en `--ease-in-out`, puis focus sur le titre de la cible.
- Menu mobile en `<dialog>`, liens Anybody wdth 75/900 en 48 px. Il contient le bouton d'action, le prochain cours et la mention maquette. Piège de focus natif, Échap.

**Mouvement**

- Le moniteur n'avance que pendant le défilement.
- Battements : bpm = 64 + 86 × `intensity(vitesse)` (de 64 à 150), RR = 60000 / bpm.
- À l'arrêt, il écrit encore un RR (≤ 940 ms), puis s'arrête à plat. Aucune boucle autonome.

**Sans JS / mouvement réduit**

- Moniteur statique (un complexe, sans mot de phase).
- Barre mobile absente.
- Menu par `:target`.

### 1. Hero : « échauffement »

Voir §C.

**Au défilement de sortie** (`top top` → `bottom top`) : la photo se décale à 0,85 × la vitesse. C'est le **seul** parallaxe de la page.

### 2. Manifeste : « Bouge ! » (montée)

**Rôle** : dire le slogan comme un crescendo, puis fondre les quatre valeurs du club en un paragraphe.

**Composition à 1440** : surface noire, padding de 160 en haut et 120 en bas, aucune photo (premier vide noir).

- Le `<h2>` fait 4 lignes. Chacune commence à x 173 (colonne 2), son complexe est dans la marge du pouls, et **la taille monte** :

  | Ligne | Texte                      | Taille                                    | Style              | Complexe dans la marge                  |
  | ----- | -------------------------- | ----------------------------------------- | ------------------ | --------------------------------------- |
  | 1     | « Bouge ! »                | 56 px, wdth 75                            | plein blanc        | instrument craie, amplitude 42          |
  | 2     | « Dépasse-toi. »           | 72 px                                     | plein blanc        | instrument, amplitude 53                |
  | 3     | « Prends du plaisir. »     | 96 px                                     | plein blanc        | instrument, amplitude 71                |
  | 4     | « Atteins tes objectifs. » | 112 px (1116 px de large, jusqu'à x 1289) | **contour citron** | **plein blanc**, amplitude 83 (chiasme) |

- Écarts de ligne de base : 84, 108 et 124 px. Interligne ≥ 0,9 à cause du É.
- **Paragraphe** sur les colonnes 7 à 11 (x 700–1266), 64 px sous la ligne 4, en Figtree 22/32 craie. Les valeurs sont en Figtree 600 dans le fil du texte : « Que tu débutes ou que tu t'entraînes depuis des années, tu trouves ta place dès le premier cours. Des **coachs diplômés** t'accompagnent et te motivent, l'**ambiance** te porte, et ton corps comme ton mental nous tiennent à cœur : **sport santé et bien-être**. »
- **Ligne factuelle** : « Huit créneaux sur quatre jours, dont deux à la pause de midi. » (Anybody wdth 60/800, 24 px, `tnum`). Dessous, la voix signature 16 px : « d'après le planning de rentrée du club, à confirmer ».

**Composition à 390**

- Lignes à 36, 40, 44 et 52 px ; la ligne 4 se coupe en « Atteins tes / objectifs. ».
- La ligne 4 passe en **plein citron**, parce qu'elle fait moins de 64 px.
- Complexes dans la marge de 0 à 52.
- Paragraphe en pleine largeur.

**Interaction** : aucune.

**Mouvement**

- Les mots ne bougent pas (règle : les titres de chapitre sont immobiles).
- Chaque complexe s'écrit quand sa ligne passe à 80 % de l'écran, une seule fois : 360 ms, linéaire, décalage de 85 ms si plusieurs lignes arrivent ensemble.
- Le moniteur passe en phase « montée ».

**Sans JS / mouvement réduit** : tracés dessinés.

### 3. Les cours (pic)

**Rôle** : choisir son cours par l'intensité. Les huit disciplines sont présentées en trois rythmes, sans grille de cartes.

**Composition à 1440** : surface noire, padding de 120 en haut, 0 en bas (la section finit sur une photo plein cadre).

1. **Titre en diagonale**, la lecture haut gauche → bas droit du logo carré :
   - « Fais monter le cœur. » en Anybody wdth 75/900, **112 px** plein blanc, x 60 (1049 px de large) ;
   - 64 px plus bas, ferré à droite sur x 1380 : « Puis redescends en douceur. » en voix signature de **40 px**.
2. **Courbe d'effort** : x 60–1380, zone de 360 px de haut, tracé instrument craie.
   - Huit complexes, amplitude = 32 px × intensité indicative :

     | Groupe             | Cours          | Intensité | Amplitude |
     | ------------------ | -------------- | --------- | --------- |
     | Cardio en musique  | Pound          | 4         | 128       |
     | Cardio en musique  | Cardio Jump    | 5         | 160       |
     | Cardio en musique  | Step           | 3         | 96        |
     | Force et intensité | Cross training | 5         | 160       |
     | Force et intensité | CAF            | 3         | 96        |
     | Retour au calme    | Pilates        | 2         | 64        |
     | Retour au calme    | Yoga           | 1         | 32        |
     | Retour au calme    | Stretching     | 1         | 32        |

   - Lignes plates de 72 px entre les cours, de 96 px entre les groupes ; la ligne continue à plat jusqu'au bord droit.
   - Nom au-dessus de chaque pic R (Anybody wdth 60/800, 18 px craie).
   - Nom de groupe sous la ligne de base, au départ du groupe (voix 18 px gris) : « cardio en musique », « force et intensité », « retour au calme ».
   - Le complexe sélectionné est en **plein citron, 3 px**.
3. **Fiche** (`tabpanel`)
   - Photo du groupe en 3:2 sur les colonnes 1 à 7 (760×507).
   - Texte sur les colonnes 8 à 12 (x 820–1380) :
     - nom en Anybody wdth 75/900 72 px (« Cross training » : 507 px) ;
     - accroche en voix 22 px (« Court, intense, jamais pareil. ») ;
     - ligne d'intensité : mini complexe de 48×36 (amplitude = intensité × 7) + « Intensité : intense · 5 sur 5 · indicative, le coach adapte » ;
     - liste de définitions (intitulés Figtree 600 14 px gris, valeurs 17 px craie) : Ce que c'est, Pour qui, Ce que tu y gagnes, Matériel, Créneaux (en données « Mer. 12 h 15 · Mer. 19 h 00 · Ven. 19 h 00 ») ;
     - liens « Voir dans le planning » (filtre préréglé) et « Réserver ce cours » → `#reserver`.
4. **Sortie** : photo `cap-souffle` **plein cadre** en 21:9 (1440×617), sans texte. Elle sert de silence et de rupture d'image avant le carbone du Planning.

**Composition à 390**

- La courbe reste visible en décor `aria-hidden` (350×120).
- Puis trois blocs de groupe. Chacun commence par sa photo **plein cadre** en 4:5 (390×488).
- Chaque cours est un `<details name="cours">` exclusif. Le `<summary>` fait 56 px : nom en 32 px, mini complexe de 40×28 ferré à droite, « 4/5 ».
- Le contenu est la fiche.

**Contenu** : les textes prêts du dossier de contenu.

- Mentions : « POUND » sans ® (marque à confirmer) ; jamais « CrossFit ».
- Précautions du Cardio Jump dans la fiche.

**Interaction**

- Onglets APG : flèches, Début, Fin. Activation manuelle (Entrée ou Espace).
- Chaque complexe a une zone de clic de 44 px de large minimum, couvrant pic et libellé. Nom accessible : « Pound, intensité soutenue, 4 sur 5 ».
- Survol ou focus : le complexe se réécrit (`dashoffset 1 → 0`, 240 ms linéaire) et son libellé passe de craie à citron (140 ms).

**Mouvement**

- Entrée unique : la courbe s'écrit **en scrub** de `top 85%` à `top 35%`, tête d'écriture et rémanence, vitesse linéaire.
- Changement de groupe : la nouvelle photo est découverte par un `clip-path: polygon()` tiré des 7 points du complexe (420 ms, `--ease-in-out`). C'est la seule « coupe en pic » de la page.
- Changement de cours dans le même groupe : texte en fondu sortant de 140 ms, entrant de 240 ms, sans translation.

**Sans JS / mouvement réduit**

- La courbe est une `<nav>` de liens `#cours-pound`… et les 8 fiches sont empilées par groupe, chacune avec sa photo de groupe.
- Avec JS, `html.js` masque les fiches non choisies **sans saut** : les fiches sont superposées dans une même cellule de grille (`grid-area: 1/1`), la hauteur de la plus grande est réservée, et `visibility` change.
- En mouvement réduit : changements instantanés.

### 4. Planning et réservation (rythme)

**Rôle** : pièce maîtresse. C'est la semaine réelle du flyer, tracée comme un électrocardiogramme et placée à l'heure de Paris.

**Composition à 1440** : surface carbone, padding de 120 et 120.

1. **En-tête de section**
   - Colonnes 1 à 5 : « Ta semaine » en Anybody wdth 75/900, 112 px (561 px), puis « en cours collectifs. » en Anybody wdth 60/700, 48 px craie.
   - Colonnes 7 à 12 : chapô en Figtree 20/29, « Huit créneaux sur quatre jours, dont deux à la pause de midi. Réserve ta place dans l'appli CAP Fitness ou à l'accueil. », puis la ligne d'état en direct, « Prochain cours : mercredi, 19 h 00 · Cross training ».
2. **Idées de semaine** : boutons radio natifs, rangée de 44 px, Figtree 600 16 px, sélection soulignée en citron (3 px).
   - Choix : « Toute la semaine · Pause de midi · Tu reprends · Tu veux te défouler · Tu veux du solide ».
   - Note en voix 14 px : « suggestions, pas un programme du club ».
3. **La bande ECG**
   - Colonne des jours de x 60 à 220 (Anybody wdth 60/800, 24 px).
   - **Axe coupé, à échelle unique** de 172,3 px par heure :
     - fenêtre de midi, 11 h 30 – 14 h 00, sur x 220–651 ;
     - coupure de 40 px sur x 651–691, ligne isoélectrique en pointillés 2/4 et libellé « 14 h → 17 h » (14 px gris) ;
     - fenêtre du soir, 16 h 30 – 20 h 30, sur x 691–1380.
   - Heures en haut (Anybody 60/700, 14 px gris, `tnum`).
   - Papier ECG en fond (§B4).
   - **5 rangées de 128 px** (lundi à vendredi). Ligne isoélectrique à +20 px du centre de la rangée. Complexes instrument d'amplitude **56**, **identique pour tous** : le planning ne donne pas d'intensité.
   - Pic R à l'heure de début. Positions calculées : lundi 13 h 00 → x 479 ; lundi 18 h 15 → 993 ; lundi 19 h 00 → 1122 ; mardi 17 h 15 → 820 ; mercredi 12 h 15 → 349 ; mercredi 18 h 00 → 949 ; mercredi 19 h 00 → 1122 ; vendredi 19 h 00 → 1122.
   - Libellés : heure au-dessus du pic (Anybody 60/800, 20 px craie) ; nom à droite du creux S (Figtree 600 15 px).
   - **Jeudi** : ligne plate et « Pas de cours collectif au planning ce jour-là. » (15 px gris).
   - **Annotation du mercredi** : une accolade de 1 px de x 949 à 1122 et, en voix 15 px, « l'enchaînement du mercredi : CAF à 18 h 00, puis Cross training à 19 h 00 ».
   - **Jour courant** : rangée sur fond #232220, nom du jour en citron, avec « aujourd'hui » en voix 14 px.
4. **Sous la bande**
   - Rangée « Bien-être · créneaux à confirmer » : Pilates, Yoga et Stretching en complexes **tube** gris, non placés sur l'axe (le contour attend d'être rempli).
   - « Samedi et dimanche : pas de cours collectif au planning. »
   - « Planning de la saison, en place depuis la rentrée. D'après le flyer du club, à confirmer. Susceptible d'évoluer pendant les vacances. »
5. **`#reserver`**, sur la même surface, après un filet graphite
   - Colonnes 1 à 5 : « Ta place t'attend. » en Anybody wdth 75/900, 56 px.
   - Colonnes 7 à 12 : une phrase, « Ouvre l'appli CAP Fitness, choisis ton cours, viens comme tu es. »
   - Deux cadres en contour (filet #6E6C66) « App Store · lien à venir » et « Google Play · lien à venir », en `<span aria-disabled="true">`.
   - « Tu préfères en parler ? Passe à l'accueil, on s'en occupe avec toi. »

**Composition à 390**

- Onglets APG pour les jours, « Lun Mar Mer Jeu Ven » : 5 boutons de 66 px de large sur 48 px de haut, le jour courant sélectionné au montage.
- Panneau : une bande de 350×140 (mêmes fenêtres, 50 px par heure, amplitude 40), puis la liste des créneaux en rangées de 56 px : « 18 h 15 · Cardio Jump · Réserver ».

**Interaction**

- Chaque complexe est un lien vers la fiche du cours. Chaque ligne de liste a un lien « Réserver » ; nom accessible : « Réserver le Cross training du mercredi, 12 h 15 ».
- Idées de semaine, en CSS seul (`:has(:checked)`) : les créneaux retenus restent **pleins** ; les autres passent en **tube** #6E6C66 avec un libellé gris. La couleur n'est jamais seule : les libellés changent aussi de graisse.
- **États, à l'heure `Europe/Paris`** (`app/utils/cap-time.ts`, horloge à la minute) :

  | État               | Rendu                                                                                                                              |
  | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
  | « Terminé »        | tracé #787670                                                                                                                      |
  | « En ce moment »   | dans les 45 min après le début. Cette durée est une **hypothèse marquée dans les données**, la fiche affiche « durée à confirmer » |
  | « Prochain cours » | complexe citron                                                                                                                    |

- **Tête « maintenant »** : un trait citron vertical de 1 px sur la hauteur de la rangée du jour, plus un point de 6 px sur la ligne isoélectrique. Exemple de test : mercredi à 18 h 20, x ≈ 1007.

**Mouvement**

- **Scène scrubbée** de `top 80%` à `top 20%` : les 5 rangées s'écrivent de gauche à droite à vitesse constante, chaque rangée décalée de 6 % de la progression.
- La rémanence ne s'applique que sur la rangée du jour : à gauche de la tête, le tracé passe en #787670.
- Pas de pin.

**Sans JS / mouvement réduit**

- Bande entièrement tracée et tous les jours visibles (en mobile, empilés sans onglets).
- Les idées de semaine fonctionnent sans JS (`:has`).
- Pas de tête « maintenant » ni d'états. Le chapô reste vrai.

### 5. La famille (cœur)

**Rôle** : « Plus qu'une salle, une famille. » La preuve humaine d'une salle de village.

**Composition à 1440** : surface noire, padding de **240** en haut (le vrai vide noir) et 120 en bas.

1. **Titre**
   - Ligne 1 : « Plus qu'une salle, une » en Anybody wdth 100/900, 64 px plein blanc, x 60 (852 px).
   - Tube citron sur sa ligne de base, de x 930 jusqu'au bord droit ; complexe d'amplitude 47 sur x 960–1003 (l'écho du tracé droit du logo).
   - Ligne 2 : « famille. » en contour citron, wdth 150, **187 px** (`calc(100cqi / 7.032)`), x 60–1380.
2. **Mosaïque**, qui commence à mi-hauteur des capitales de « famille. ». Le mot passe sur le haut des photos ; ses intérieurs transparents montrent la photo en bas et le noir en haut.

   | Photo           | Format | Colonnes                | Taille  |
   | --------------- | ------ | ----------------------- | ------- |
   | `cap-famille-1` | 4:5    | 1 à 5                   | 530×662 |
   | `cap-famille-2` | 3:2    | 7 à 12, décalée de +120 | 680×453 |

3. **Sous la photo 2**, colonnes 7 à 11 :
   - texte en Figtree 20/29 : « On se dépasse ensemble, dans la bonne humeur. Ceux qui reprennent, ceux qui s'y mettent, ceux qui ne ratent pas un mercredi soir : tout le monde a sa place. » ;
   - « Tes coachs. Diplômés, pour t'accompagner et te motiver. » ;
   - un seul encart « Prénoms, photos et diplômes des coachs : à venir » (filet en pointillé citron) ;
   - un encart « Avis Google à intégrer ».
   - Pas de cartes coach.

**Composition à 390**

- « Plus qu'une salle, / une » en 28 px.
- « famille. » en contour, wdth 100, 74 px.
- Photo 1 en 350×438, photo 2 en 350×233, puis le texte.

**Interaction** : aucune. Les photos ne sont pas cliquables.

**Mouvement**

- Entrée unique de la section : les photos sont découvertes par le bas (`clip-path` de inset(100% 0 0 0) à 0, 700 ms, `--ease-out`, décalage de 85 ms). C'est le noir qui s'allume par le bas.
- Le tube citron s'écrit en 360 ms, linéaire.
- Le titre ne bouge pas.

**Sans JS / mouvement réduit** : photos visibles, tube dessiné.

### 6. Avant ton premier cours (retour au calme)

**Rôle** : rassurer (FAQ) et poser la structure des formules sans prix inventés.

**Composition à 1440** : surface carbone, padding de 120 en haut, 160 en bas.

- **Colonnes 1 à 4, collantes** (`top: 120px`)
  - « Avant ton / premier / cours. » en Anybody wdth 75/900, 96 px plein blanc.
  - Sous la dernière ligne de base, une **ligne plate** instrument craie de x 0 à x 493 : aucun complexe, c'est le silence de la page.
- **Colonnes 6 à 12** (x 527–1380)
  - 8 `<details name="faq">`. Question en Figtree 600, 22 px, rangée de 72 px minimum, séparateurs graphite décoratifs.
  - Indicateur : carré de 10 px en contour gris, qui devient plein citron à l'ouverture.
  - Réponses en Figtree 18/27 craie. Les réponses inconnues portent la mention « à confirmer ».
- **Formules**, sous la FAQ
  - « Les formules. » en Anybody wdth 75/900, 48 px.
  - Un `<table>` de 3 rangées (Cours collectifs · Salle et cours, si un plateau est confirmé · Séance à l'unité) et 3 colonnes (Formule · Inclus · Prix).
  - Prix : « — € », souligné en pointillé citron, avec « tarif à confirmer ».
  - Lien « Demande les tarifs à l'accueil » → `#infos`.

**Composition à 390**

- Titre en 44 px sur 3 lignes, puis la ligne plate en pleine largeur.
- FAQ, puis tableau des formules. Le tableau se recompose en `<dl>` sous 30em.

**Interaction** : ouverture de la FAQ en `grid-template-rows: 0fr → 1fr` (420 ms, `--ease-in-out`), contenu après 140 ms. Le pattern accordéon de la V1.

**Mouvement** : seule la ligne plate s'écrit au scrub. Aucune autre entrée : le calme est réel.

**Sans JS / mouvement réduit** : `<details>` natifs, ligne plate dessinée.

### 7. Viens nous voir (récupération)

**Rôle** : le lieu et les infos pratiques. **Tout est « à confirmer »**, dit honnêtement.

**Composition à 1440** : padding de 0 en haut, 120 en bas.

1. Photo `cap-lieu` **plein cadre**, 21:9 (1440×617). Titre « Viens nous voir. » en Anybody wdth 100/900, 112 px plein blanc (1098 px), x 60, ligne de base à 48 px du bas de la photo, posé sur la zone sombre prévue (p95 ≤ 15 %).
2. Sur noir, padding de 96, en grille asymétrique :
   - **Colonnes 1 à 5** : « [Commune] » en **contour gris**, Anybody wdth 125/900, 96 px. Contour = donnée inconnue. Dessous : « Adresse à confirmer », « Parking et accès PMR à confirmer », « Plan d'accès à venir » (aucune fausse carte).
   - **Colonnes 7 à 9** : l'accueil, en tableau de 7 jours (« Lun. — h — à — h — »), en données `tnum`, et « Horaires à confirmer ».
   - **Colonnes 10 à 12** : Téléphone, E-mail, Instagram, Facebook, Fiche Google, chacun « à confirmer ». Ce sont des textes, pas des liens morts.

**Composition à 390** : photo en 4:5 (390×488) avec le titre en 44 px dedans, puis les trois blocs empilés ; « [Commune] » en contour à 64 px.

**Interaction** : aucune. Pas d'« Ouvert maintenant » tant que les horaires sont inconnus.

**Mouvement** : aucun tracé (récupération) ; le moniteur est à plat. Aucune entrée.

**Sans JS / mouvement réduit** : identique.

### 8. Fin et pied de page (ensemble)

**Rôle** : le dernier battement, la dernière action, et un serre-livre avec le hero.

**Composition de la Fin à 1440** : **épinglée pendant 100svh**, soit 200svh de défilement au total. Surface noire.

- « Ensemble, allons plus » en Anybody wdth 75/900, 72 px plein blanc, x 266, ligne de base 380.
- « loin. » en contour citron, wdth 150, **270 px** (`calc(100cqi / 4.125)` sur x 266–1380), contour de 10,8 px. Ligne de base 620, capitale de 182 px.
- Ligne isoélectrique sur toute la largeur à y 620.
- Complexe à venir sur x 60–240 : amplitude 200 (R à y 420), plein blanc de 14,6 px.
- Dessous :
  - « On t'attend mercredi ? » en voix de 28 px, x 266, ligne de base 700 ;
  - bouton « Réserve ta place » sur y 736–792 ;
  - prochain cours ferré à droite.

**Composition de la Fin à 390** (sans pin)

- Complexe sur x 0–60, amplitude 63.
- « loin. » en contour, 69 px, x 64–349.
- Ligne 1 en 32 px ; bouton de 52 px.

**Pied de page** : surface noire, padding de 96 en haut.

- Logo horizontal complet de **720 px** à x 60 : cap de 64 px, signature lisible.
- Colonnes 8 à 12 :
  - liens Figtree 600 17 px : Cours, Planning, Famille, Infos ;
  - « Voir la direction 1 » → `/` ;
  - `#maquette` : « Maquette non officielle, réalisée pour proposition et non validée par le club. Planning et slogans repris des supports du club ; les autres informations sont à confirmer. Visuels d'illustration générés par IA. Mentions légales à compléter. »
- Enfin l'**ourlet** : 160 px, sans texte.

**Mouvement de la Fin**

- Progression de 0 à 0,65, **en scrub** : la tête d'écriture trace la seule ligne plate, de x 0 à 1440, à vitesse constante. Le segment x 60–240 reste plat. C'est le silence.
- À 0,7, **une fois, au temps et non au scrub** :
  - le segment plat se déforme en complexe : interpolation des 7 ordonnées de 0 à leur valeur canonique, 220 ms, `--ease-strike` ;
  - au pic R, « loin. » se remplit de citron de gauche à droite (420 ms, double translation) **et reste plein**. C'est le seul gros aplat citron de la page.
- Le moniteur bat une dernière fois puis s'arrête.

**Mouvement du pied de page**

- À l'entrée, une fois, le logo s'assemble :
  - tracé blanc, de 0 à 360 ms, linéaire ;
  - contour de CAP lettre par lettre (`dashoffset`), de 120 à 640 ms ;
  - FITNESS découvert de gauche à droite, de 360 à 780 ms, `--ease-out` ;
  - tube citron, de 600 à 960 ms ;
  - signature en opacité, de 960 à 1200 ms.
- La partition reprend celle du hero.

**Sans JS / mouvement réduit** : pas de pin ; complexe présent ; « loin. » **plein citron** ; logo complet.

---

## E. Grammaire de mouvement

### E1. Geste fondateur : « Écrire, frapper, se poser »

1. **Écrire** : le tracé avance à **vitesse de papier constante** (courbe linéaire). C'est le seul mouvement linéaire de la page, ce qui le rend reconnaissable.
2. **Frapper** : au pic R, ce que le tracé porte passe du **contour au plein**. Dans le hero, le plein se retire ; dans la Fin, il reste.
3. **Se poser** : le tracé revient à la ligne plate, et rien ne bouge plus.

Tout le reste en découle :

- une entrée est une écriture ;
- un changement d'état est un remplissage (carré de la FAQ, créneaux, complexe choisi) ;
- un repos est une ligne plate.

### E2. Tokens

Les noms sont ceux qu'attendent `app/motion/tokens.ts` et `gsap.ts`. Les 5 courbes sont des `cubic-bezier()`, sans dépassement.

```css
@layer tokens {
  :root[data-site='v2'] {
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* arrivées, révélations par masque */
    --ease-out-soft: cubic-bezier(0.25, 1, 0.5, 1); /* changements d'état */
    --ease-in: cubic-bezier(0.7, 0, 0.84, 0); /* retraits, sorties (×0,65 de l'entrée) */
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* layout, propagation du remplissage */
    --ease-strike: cubic-bezier(0.87, 0, 0.13, 1); /* la frappe du pic R */
    --ease-paper: cubic-bezier(0, 0, 1, 1); /* écriture du tracé : vitesse constante */
    --dur-press: 90ms;
    --dur-feedback: 140ms;
    --dur-state: 240ms;
    --dur-strike: 220ms;
    --dur-layout: 420ms;
    --dur-overlay: 480ms;
    --dur-focal: 700ms;
    --dur-travel: 1200ms;
    --seq-max: 1300ms;
    --dur-write-s: 360ms; /* complexe de titre */
    --dur-write-l: 520ms; /* tracé qui sort de l'écran */
    --dur-rr: 940ms; /* un battement à 64 bpm : repos */
    --dur-rr-effort: 400ms; /* un battement à 150 bpm : plafond */
    --stagger-tight: 40ms;
    --stagger-list: 60ms;
    --stagger-lines: 85ms;
    --move-xs: 6px; /* écart vertical CAP/FITNESS : 0,05 cap (cap du hero 116 px) */
    --move-s: 12px; /* écart horizontal CAP/FITNESS : 0,10 cap */
    --move-l: 28px; /* onde T (0,295) d'un complexe d'amplitude 96 */
    --move-xl: 72px; /* amplitude R d'un titre de 96 px (1,1 × cap de 65) */
  }
}
```

### E3. Chorégraphies clés

| Zone             | Déclencheur                    | Partition                                                                                                                                                                                                              |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero             | `hero-ready` (CSS)             | §C3 : 1240 ms, une frappe                                                                                                                                                                                              |
| Moniteur         | défilement (`followScroll`)    | bpm = 64 + 86 × `intensity` ; retour du chiffre interne à 64 en environ 1,6 s (`approach`) ; arrêt à plat après un RR                                                                                                  |
| Bouton principal | survol, focus, appui           | Survol : un mini complexe noir de 20×14 s'écrit à gauche du libellé (240 ms, papier) ; le libellé se décale de `--move-s` (240 ms, `out-soft`) ; fond citron → citron vif (140 ms). Appui : translation de 1 px, 90 ms |
| Manifeste        | 80 % de l'écran, une fois      | 4 écritures de 360 ms, décalage de 85 ms                                                                                                                                                                               |
| Cours            | scrub de 85 % à 35 % ; onglets | Écriture de la courbe ; coupe en pic de la photo (420 ms) ; réécriture au survol (240 ms)                                                                                                                              |
| Planning         | scrub de 80 % à 20 %           | 5 rangées écrites, rémanence sur la rangée du jour ; tête « maintenant » déplacée chaque minute, sans animation                                                                                                        |
| Famille          | 85 %, une fois                 | Photos découvertes par le bas (700 ms, décalage de 85 ms) ; tube écrit (360 ms)                                                                                                                                        |
| Premier cours    | scrub                          | Ligne plate seule                                                                                                                                                                                                      |
| Fin              | pin 100svh, scrub puis temps   | Ligne plate (scrub), frappe (220 ms), remplissage de « loin. » (420 ms)                                                                                                                                                |
| Pied de page     | entrée, ou `focusin`           | Assemblage du logo, 1200 ms                                                                                                                                                                                            |

**Discipline** (celle de la V1)

- Les titres de chapitre ne bougent jamais.
- Une seule entrée par section.
- `ENTRY` au seuil de 85 % ; `reached()` laisse à l'état final ce qui est déjà à l'écran.
- `clearProps` en fin d'animation ; décalages plafonnés à 6 éléments (`capped`).
- Lenis (`lerp` 0,12) seulement avec un pointeur fin.
- Ticker GSAP **endormi au repos**.

### E4. Effets ambitieux

**1. « L'image bat »** (WebGL, OGL), sur la photo du hero

- **Principe**
  - Un quad plein écran échantillonne la photo servie avec un décalage vertical de dy = A · ecg((x − tête) / empan) · atténuation.
  - `ecg()` est le complexe canonique : 6 segments linéaires évalués dans le fragment shader.
  - La tête balaie 0 → 100 % de la largeur en 900 ms, linéaire. **A = 6 px** sur bureau, empan de 220 px.
  - La photo se déforme en suivant le tracé au moment où il passe. **Aucune variation de luminance**, donc aucun risque de flash (2.3.1).
- **Déclenchement**
  - Sur un battement du moniteur pendant que le hero est visible à plus de 50 %, au plus un par RR.
  - Jamais pendant l'intro : le module arrive après le LCP.
- **Budget**
  - OGL : 13,8 Ko gzip, chunk déjà partagé avec `motion-blur.ts` de la V1. Plus `ecg-gl.ts` (environ 1,6 Ko).
  - Chargé en temps libre, après `decode()` de la photo, **jamais** au premier chargement.
  - Une texture (≤ 1920 px), DPR plafonné à 1,5.
  - Rendu **seulement pendant un balayage** (≤ 900 ms). Ensuite le canvas passe à opacité 0, le vrai `<img>` reste visible, et le ticker se rendort.
- **Conditions** : reprise de `canBlur()` (pointeur fin, ≥ 4 cœurs, ≥ 4 Go, pas d'économie de données, WebGL2 basse consommation avec `failIfMajorPerformanceCaveat`, refus de SwiftShader et llvmpipe), et `has-motion`.
- **Repli** : rien. La photo reste fixe et le battement reste en SVG. Perte de contexte : le canvas est retiré.

**2. Rémanence de phosphore** (SVG)

- Pour le moniteur et la rangée du jour du planning.
- Un `<mask>` à dégradé linéaire est ancré sur la tête d'écriture : 0–40 px derrière la tête en craie, puis fondu vers #787670 sur 160 px, et 8 px de vide devant la tête.
- Aucune lueur.

**3. Coupe en pic** (`clip-path: polygon`)

- Le polygone est dérivé des 7 points canoniques, mis à l'échelle de la photo et interpolé du plat au complexe.
- Utilisée une seule fois : changement de groupe dans les Cours.

### E5. Interdits de mouvement

- Rebond, élastique ou dépassement (pas de `--ease-strike` à `1.56`).
- Fondu plus translation comme langage par défaut : au plus 6 occurrences sur la page.
- Animation lettre par lettre.
- Parallaxe ailleurs que sur la photo du hero.
- **Toute boucle autonome de plus de 5 s.** Aucune boucle n'en a besoin, donc aucun bouton pause n'est requis ; à vérifier par test.
- Battement de luminance, pulsation permanente d'un bouton ou d'un point « en direct », lueur, flou, bip.
- Bandeau défilant, carrousel automatique, compteur qui défile.
- Détournement du défilement (snap forcé, défilement ralenti).
- Plus de 2 scènes épinglées. Il n'y en a qu'une : la Fin.
- Animer `x`, `y` ou `rotation` sur un élément dont le `translate` est piloté en CSS.
- Séquences de plus de 1300 ms.

---

## F. Plan d'images

Les images sont générées sur Higgsfield, en couleur, puis étalonnées en `cap-mono` (§B7). Elles vivent dans `art/cap/production.json`, avec les prompts dans `art/cap/prompts/*.prompt.txt`.

**Casting fixe** (personnes fictives, _reference elements_ pour un visage unique par personne, aucun nom affiché) :

| Lettre | Personne                                      |
| ------ | --------------------------------------------- |
| A      | femme d'environ 40 ans, cheveux courts bruns  |
| B      | homme d'environ 55 ans, barbe grise courte    |
| C      | femme d'environ 25 ans, tresses               |
| D      | homme d'environ 30 ans                        |
| E      | femme d'environ 62 ans, cheveux blancs courts |
| F      | homme d'environ 68 ans                        |

**Clauses communes à tous les prompts**

- Vêtements de sport unis noirs ou gris, de coupes variées. Pas de tenue uniforme.
- **Aucun logo, texte, marque ni écran affiché.** Aucun sponsor.
- Corps réels, sans musculature de culturiste, sans huile. Peau texturée.
- Personne ne regarde l'objectif.
- Imperfection voulue : flou de bougé partiel, sujet coupé par le cadre.
- Optique 35 ou 85 mm, f/2.

| id              | Usage                          | Master          | Recadrages dirigés                     | Sujet                                                                                                                                                                                         | Lumière                                                                                     | Zone sombre exigée                                                          |
| --------------- | ------------------------------ | --------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `cap-hero`      | Hero (plein cadre)             | 16:9, 2560×1440 | 5:3 bureau ; 4:5 mobile avec fondu bas | Cours collectif vu à hauteur de hanche. A nette au premier plan, au tiers droit, en plein mouvement. B à E derrière, légèrement désynchronisés (« chacun son rythme »), en flou de profondeur | Contre-jour de grandes baies vitrées (écho de la bannière), réflecteur latéral droit faible | Tiers bas gauche p95 ≤ 15 % ; bande y 49–65 % (sous « rythme. ») p95 ≤ 30 % |
| `cap-musique`   | Fiche « Cardio en musique »    | 3:2, 2400×1600  | 4:5 mobile                             | Gros plan des mains de C frappant le sol avec deux baguettes lisses sans marque. Baguettes floues (1/30 s), mains nettes à l'impact                                                           | Rasante et dure depuis la gauche, fond noir                                                 | Moitié droite p95 ≤ 20 %                                                    |
| `cap-force`     | Fiche « Force et intensité »   | 3:2             | 4:5                                    | B au sommet d'un swing de kettlebell noire sans inscription. Magnésie en suspension dans un faisceau                                                                                          | Faisceau latéral unique, fond noir                                                          | Coin haut droit sombre                                                      |
| `cap-calme`     | Fiche « Retour au calme »      | 3:2             | 4:5                                    | E en flexion avant assise sur tapis, yeux fermés, salle quasi noire                                                                                                                           | Fenêtre latérale rasante de fin de journée                                                  | 60 % de l'image ≤ 10 %                                                      |
| `cap-souffle`   | Sortie des Cours (plein cadre) | 21:9, 3360×1440 | 4:5                                    | Très gros plan de profil de D qui expire après l'effort, sueur ; sujet au tiers gauche, le reste noir                                                                                         | Lumière de contour arrière                                                                  | Deux tiers droits ≤ 6 %                                                     |
| `cap-famille-1` | Famille, grande                | 4:5, 2048×2560  | 1:1                                    | A, C et D après un cours, rire franc pris sur le vif, l'une tend une serviette                                                                                                                | Plafonnier doux plus contre-jour                                                            | **Quart haut p95 ≤ 30 %** (le mot géant passe dessus)                       |
| `cap-famille-2` | Famille, large                 | 3:2             | 16:9                                   | F et C en gainage côte à côte, qui se regardent et sourient                                                                                                                                   | Latérale                                                                                    | Quart haut p95 ≤ 30 %                                                       |
| `cap-lieu`      | Infos (plein cadre)            | 21:9            | 4:5                                    | La salle de biking vide, de nuit. Rangée de vélos d'intérieur génériques sans marque ni écran, en perspective fuyante (écho de la bannière, réinterprété)                                     | Seule lumière : celle de la rue par les baies ; sol légèrement brillant                     | Bande basse gauche p95 ≤ 15 %                                               |

**Ce qui est fait en code ou en graphisme à la place de photos**

- Le logo et toutes ses déclinaisons, et tous les tracés ECG.
- Le planning et le papier ECG ; la courbe d'effort.
- Les données « à confirmer » (coachs, adresse, carte, tarifs, avis).
- Les cadres des stores, en texte.
- L'ourlet en dégradé et la tuile de grain.
- L'image OG (montage au build), le favicon, la page 404 (monogramme CAP et ligne plate).
- **Aucune** maquette de téléphone, aucun portrait de coach, aucune carte stylisée, aucune illustration vectorielle.

---

## G. Moments « waouh » (trois)

1. **Le premier battement** (hero)
   - **Ce qui se passe** : le tracé blanc naît au bord gauche de l'écran, frappe, et le mot géant « rythme. » s'allume en plein citron le temps d'un battement (660 ms), puis redevient contour. Le tube citron part vers la droite hors champ. Plus tard, si l'appareil le permet, la photo se déforme au passage du pic quand tu fais défiler la page.
   - **Pourquoi c'est sobre** :
     - c'est le logo même, recomposé (chiasme, raccord au pied de lettre), pas un effet ajouté ;
     - une seule frappe, 1240 ms en tout, aucun changement de luminance hors du remplissage ;
     - le bouton est utilisable dès t = 0.
2. **La semaine en électrocardiogramme** (planning)
   - **Ce qui se passe** : les 8 vrais créneaux sont des pics posés à leur heure, sur du papier ECG dont le grand carreau vaut une heure. La rangée du jour porte un trait « maintenant » à l'heure de Paris. Le passé s'éteint en gris, le prochain cours s'allume en citron, et le jeudi est une ligne plate honnête.
   - **Pourquoi c'est sobre** :
     - le motif porte de **vraies données** ;
     - le trait fait 1,5 px, l'amplitude est la même pour tous les créneaux (aucune intensité inventée) ;
     - il ne bouge que pendant que tu fais défiler la page ou quand la minute change.
3. **Le dernier battement** (Fin)
   - **Ce qui se passe** : un écran entier de noir, traversé d'une seule ligne plate, puis le cœur repart une fois, et « loin. » se remplit de citron et le reste.
   - **Pourquoi c'est sobre** :
     - c'est le seul aplat citron de la page ;
     - il est préparé par du silence (la page a été plate pendant Premier cours et Infos) ;
     - un seul pin, une seule frappe de 220 ms, aucun retour en arrière une fois joué.

---

## H. Risques et parades

| Risque                                                | Seuil mesurable                                  | Parade                                                                                                                                                                                                                                               |
| ----------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LCP mobile > 2,5 s (photo et police)                  | LCP labo ≤ 2,3 s, médiane de 3                   | AVIF 4:5 780w ≤ 40 Ko préchargé **par media query** (un seul cadrage téléchargé). Anybody en sous-ensemble de 18 Ko et Figtree de 20 Ko préchargés. Grain non cuit. Titre en HTML. Photo jamais à opacité 0                                          |
| JS au premier chargement > 110 Ko                     | ≤ 106 Ko gzip mesuré                             | Tracés générés côté serveur (0 calcul client). Sections sous la ligne de flottaison en **hydratation paresseuse** (`<LazyCapPlanning hydrate-on-visible />`, Nuxt 4) ; GSAP (47,8 Ko) et OGL (13,8 Ko) à la demande. `ecg.ts` + `cap-time.ts` ≤ 2 Ko |
| CLS au changement de police                           | 0                                                | Mots géants en boîte de hauteur fixe, `nowrap`, `contain: layout` ; replis à métriques ajustées                                                                                                                                                      |
| Saccades sur la scène de Fin et le scrub du planning  | ≥ 55 fps en 4× CPU                               | On n'anime que `stroke-dashoffset`, `transform` et `clip-path`. Tracés < 60 points. Pas de pin en mobile. Ticker endormi                                                                                                                             |
| Contraste du texte en contour sur photo               | Citron ≥ 5,5:1 (p95 ≤ 30 % sous le mot)          | Zone sombre prévue dans le prompt et vérifiée par script sur les recadrages servis ; voile ancré local                                                                                                                                               |
| Le contour illisible en petit ou en contrastes forcés | Contour ≥ 64 px                                  | Sous 64 px, le mot passe en plein citron. `@media (forced-colors: active)` : `-webkit-text-stroke: 0`, `-webkit-text-fill-color: CanvasText`, tracés en `CanvasText`                                                                                 |
| WCAG 2.2.2 et 2.3.1                                   | 0 boucle > 5 s ; ≤ 1 flash par séquence          | Aucun battement autonome. Le moniteur ne bat qu'au défilement. Remplissage du hero unique. WebGL sans variation de luminance                                                                                                                         |
| Clavier et lecteurs d'écran                           | axe : 0 violation sur 5 états                    | Onglets APG (cours, jours) ; `<details>` natifs ; tracés en `aria-hidden` ; noms accessibles explicites (« Réserver le Cross training du mercredi, 12 h 15 ») ; focus citron de 2 px ; `scroll-margin-top` à 72 px                                   |
| Zoom à 400 %                                          | Pas de défilement horizontal à 320 px            | Mots géants en `cqi` avec bornes en rem ; axe du planning remplacé par les onglets sous 64em                                                                                                                                                         |
| Kitsch « moniteur d'hôpital »                         | Grands tracés ≤ 1 par écran ; part citron ≤ 10 % | Trois styles seulement, épaisseur instrument de 1,5 px, jamais de lueur ni de cœur. Papier ECG seulement derrière le planning. Phases de silence (deux chapitres sans complexe)                                                                      |
| Effet « template de salle »                           | Grep et règles §I                                | Ni cartes, ni surtitres, ni rangée de chiffres, ni tarifs à 3 colonnes, ni icônes. Un bouton principal par écran                                                                                                                                     |
| Fausse information sur une vraie entreprise           | 0 donnée non sourcée affichée comme réelle       | Statut par donnée (`flyer`, `a-confirmer`, `hypothese`). Bandeau maquette, `noindex`, mention dans l'image OG. « POUND » sans ® ; jamais « CrossFit », « diplômé d'État » ni « sport sur ordonnance » ; pas de faux avis ; aucun sponsor             |
| Photos IA incohérentes (mains, kettlebell, vélos)     | Contrôle humain image par image                  | Gros plans, flou de bougé contrôlé, objets sans inscription ; casting fixe ; on rejette toute image portant du texte ou un logo                                                                                                                      |
| Durée des cours inconnue pour « En ce moment »        | —                                                | Hypothèse de 45 min marquée dans les données ; « durée à confirmer » affiché dans la fiche ; une seule constante à changer                                                                                                                           |

---

## I. Faisabilité dans la pile

### I1. À créer

Sous `app/components/cap/` et `app/` :

| Fichier                                                                                                                                                                                                                                                                                     | Rôle                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/v2.vue` (réécrit)                                                                                                                                                                                                                                                                    | `htmlAttrs: { 'data-site': 'v2', 'data-intro-font': '900 1em Anybody' }`, `theme-color` #0C0C0B, préchargement d'Anybody (sous-ensemble) et de Figtree, préchargement photo par media query, titre « CAP Fitness by EBC Sport : cours collectifs à [Commune] (maquette) » |
| `assets/css/v2.css` (réécrit)                                                                                                                                                                                                                                                               | `@layer reset, tokens, base, layout, components, utilities;` redéclaré, tokens §B1 et §E2, surfaces, `.cap-photo` (grain)                                                                                                                                                 |
| `data/cap.ts` + `types/cap.ts`                                                                                                                                                                                                                                                              | Contenu passé par `typesetDeep`. Statut par donnée : `flyer` / `a-confirmer` / `hypothese` / `exemple`. Sessions : `{ jour, debut, cours, groupe, minutes: 45, minutesStatut: 'hypothese' }`                                                                              |
| `utils/ecg.ts`                                                                                                                                                                                                                                                                              | Complexe canonique ; `complex(x, base, amp)`, `strip(beats[], width)`, `taperedPolygon()`, `sample(t)`. Pur, côté serveur                                                                                                                                                 |
| `utils/cap-time.ts`                                                                                                                                                                                                                                                                         | Reprend `club-time.ts` (`sessionStates`, `nextSession` avec 15 min de grâce, `useClubClock`) en **`Europe/Paris`** via `Intl.DateTimeFormat`                                                                                                                              |
| `CapLogo.vue`                                                                                                                                                                                                                                                                               | 5 variantes, chemins inline issus de `scripts/build-logo.py`                                                                                                                                                                                                              |
| `EcgTrace.vue`                                                                                                                                                                                                                                                                              | Styles `plein` / `tube` / `instrument`, `pathLength="1"`, `--draw`                                                                                                                                                                                                        |
| `CapMockBanner.vue`, `CapHeader.vue`, `CapMonitor.vue`, `CapMenu.vue`, `CapNextBar.vue`                                                                                                                                                                                                     | Cadre de page                                                                                                                                                                                                                                                             |
| `CapHero.vue`, `CapManifeste.vue`, `CapCours.vue` (+ `CapCoursFiche.vue`), `CapPlanning.vue` (+ `CapWeekStrip.vue`, logique d'onglets reprise de `ClubSchedule.vue`), `CapFamille.vue`, `CapPremierCours.vue` (FAQ reprise de `ClubFaq.vue`), `CapInfos.vue`, `CapFin.vue`, `CapFooter.vue` | Les 8 chapitres                                                                                                                                                                                                                                                           |
| `CapAConfirmer.vue`                                                                                                                                                                                                                                                                         | Donnée inconnue : contour ou filet pointillé citron, plus « à confirmer » lisible                                                                                                                                                                                         |
| `motion/pulse.ts`                                                                                                                                                                                                                                                                           | Battements pilotés par `followScroll` + `intensity` + `approach`                                                                                                                                                                                                          |
| `motion/ecg-gl.ts`                                                                                                                                                                                                                                                                          | Effet « l'image bat » ; garde de capacité `canBlur()` ; classe de canvas paramétrée                                                                                                                                                                                       |
| `scripts/build-logo.py`                                                                                                                                                                                                                                                                     | Vectorisation : Montserrat 900, Exo 2 Black, skia-pathops                                                                                                                                                                                                                 |
| `art/cap/{production.json, grade.py, prompts/}`                                                                                                                                                                                                                                             | Famille `cap-mono` ; entrées `CROPS` et plaques floues dans `scripts/build-images.mjs`                                                                                                                                                                                    |
| `sync-fonts.mjs`                                                                                                                                                                                                                                                                            | Ajout d'Anybody (sous-ensemble maison) et de Figtree                                                                                                                                                                                                                      |
| `package.json`                                                                                                                                                                                                                                                                              | Ajouter `@fontsource-variable/anybody@5.3.0` et `@fontsource-variable/figtree@5.3.0`. Retirer Saira et Schibsted (utilisées par la V2 seule)                                                                                                                              |

### I2. Repris de la V1, tels quels

- `motion/boot.inline.js`, `env.ts`, `tokens.ts`, `gsap.ts`, `sequence.ts` (`ENTRY`, `capped`, `reached`), `speed.ts`, `scroll.ts` (Lenis, ticker endormi, `followScroll`, `scrollToTarget`).
- `composables/useMotion.ts` (contexte, `matchMedia`, chargement à l'approche, `contextSafe`).
- `plugins/motion.client.ts`.
- `utils/typography.ts`.
- `providers/variants.ts`, `scripts/build-images.mjs`, `art/grade.py` (module importé).
- La technique de la V1 pour remplir un mot au défilement par double translation (`ServicesSection.vue`) : remplissages de « rythme. » et « loin. ».
- Le pattern accordéon `grid-template-rows` des Programmes.
- La garde `canBlur()` et la gestion de perte de contexte de `motion-blur.ts`.
- `scripts/serve-static.mjs`.
- Rien ne change dans la V1 elle-même (`/`) : `noindex` global, `/v2` déjà prérendu, préchargement de gsap, lenis et ogl déjà désactivé.

### I3. À supprimer

Tout `app/components/v2/Club*` : la logique utile est transplantée (onglets, horloge, FAQ, en-tête), le reste est jeté. Aussi : `app/data/club.ts`, `app/types/club.ts`, et les images `art/v2` du kit vert et jaune.

### I4. Budgets cibles

| Poste                                 | Cible                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| JS au premier chargement              | ≤ 106 Ko gzip (plafond dur 110)                                                     |
| Polices préchargées                   | Anybody 18,0 Ko + Figtree 19,7 Ko                                                   |
| Figtree italique (sans préchargement) | 20,4 Ko                                                                             |
| LCP mobile simulé                     | ≤ 2,3 s                                                                             |
| CLS                                   | 0                                                                                   |
| Lighthouse mobile                     | Performance ≥ 90 ; Accessibilité et Bonnes pratiques 100 ; SEO 63 voulu (`noindex`) |
| Hauteur de page                       | ≤ 10 500 px sur bureau, contre 13 642 pour l'ancienne V2                            |

### I5. Preuves à écrire

Dans `tests/e2e/v2/`, avec l'horloge réglée au mercredi 4 novembre 2026, 18 h 20, heure de Paris :

- **`accessibilite`** : axe sur 5 états (repos, menu ouvert, fiche cours choisie, idée « Tu veux du solide », FAQ ouverte).
- **`parcours`** :
  - CAF « En ce moment », Cross training 19 h 00 « Prochain cours », tête à x ≈ 1007 ;
  - jeudi plat ;
  - onglets au clavier.
- **`sans-js`** : 8 fiches visibles, 5 rangées, tracés dessinés, « loin. » plein.
- **`mouvement-reduit`** : aucune requête GSAP ni OGL, état final identique.
- **`interdits`** :
  - grep à 0 pour `#0f5233`, `#ffd83d`, `#eef3ef`, ALVAR, maillot, flocage, effectif, tribune, écharpe, match, 412, Lyon, Drake, Saira ;
  - au plus 6 éléments en capitales avec `letter-spacing` > 0,05em ;
  - fond calculé de chaque `section` ≤ la luminance de #1c1c1c ;
  - au moins 3 éléments avec `font-size` ≥ 170 px à 1440 ;
  - `border-radius` ≤ 4 px, aucune `box-shadow` floue ;
  - part citron ≤ 10 % par capture de 1440×900 ;
  - aucune animation `infinite` de plus de 5 s.

**Ordre de travail recommandé**

1. Logo SVG et `ecg.ts`.
2. Tokens et polices.
3. Hero, mesuré contre §C.
4. Planning (données réelles).
5. Images.
6. Autres chapitres.
7. Mouvement.
8. WebGL en dernier, désactivable sans rien casser.

**Mesures produites pour ce document** (scripts dans le dossier `capfit-scripts` du scratchpad, aucun fichier du dépôt modifié) :

- `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit-scripts/m.py` et `m2.py` : métriques d'Anybody et de Figtree, largeurs des mots en em.
- `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit-scripts/c.py` : contrastes.
- `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit-scripts/sub.py` et `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit/sub/anybody-display-maj.woff2` : prototype du sous-ensemble de 18 Ko.
