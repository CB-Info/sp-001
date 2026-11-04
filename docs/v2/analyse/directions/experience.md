## A. Direction « Le Tracé » : thèse

1. La page s'approprie les deux seules choses qui appartiennent vraiment à CAP Fitness. La première est son logo : le tracé ECG, « CAP » au trait, « FITNESS » en plein, la signature en italique citron. La seconde est sa vraie semaine : 8 créneaux sur 4 jours, tirés du flyer. Les deux se fondent en un seul instrument : chaque pic du tracé correspond à un vrai cours qu'on peut réserver.
2. Tout sert à décider de venir dès ce soir. Le hero annonce le prochain cours à l'heure de Paris. Un sélecteur « Ce soir, tu veux… » recommande un cours. Le planning se lit comme un électrocardiogramme à cinq dérivations, une par jour. Une seule action revient partout : « Réserve ta place », qui mène vers l'appli, vers l'accueil, ou ajoute le cours à l'agenda (.ics).
3. La page refuse :
   - les couleurs hors logo, le vert du flyer, les fonds clairs ;
   - les cartes en grille, les surtitres, les icônes ;
   - les chiffres, avis, tarifs, coachs et adresse inventés ;
   - le battement de cœur décoratif répété, la lueur néon, toute boucle automatique ;
   - les signes de la V1 : rouge, Tektur, escalier, astérisque, trame tableur.

## B. Système visuel

### B.1 Palette

Ratios WCAG 2.x recalculés (script `capfit/contrast.py`).

| Token               | Hex     | Rôle                                                                                     | Contrastes vérifiés                                      |
| ------------------- | ------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `--cf-noir`         | #0C0C0B | Fond principal (surface `nuit`)                                                          | craie 17,30 ; citron 12,23 ; blanc 19,57                 |
| `--cf-carbone`      | #1C1B19 | Fond exact du logo. Surface `carbone` (Rythme, Pratique), bandeau maquette, barre mobile | craie 15,22 ; citron 10,76 ; gris 6,65                   |
| `--cf-graphite`     | #2A2926 | Filets décoratifs, grands carreaux du papier ECG, cours hors filtre                      | gris 5,62 ; citron 9,09                                  |
| `--cf-quadrillage`  | #181816 | Petits carreaux ECG (décor seulement)                                                    | décor                                                    |
| `--cf-filet`        | #6E6C66 | Bordures interactives, pointillés « à confirmer », lignes de base des dérivations        | 3,73 sur noir ; 3,28 sur carbone (≥ 3:1, critère 1.4.11) |
| `--cf-gris`         | #A3A199 | Texte secondaire                                                                         | 7,56 / 6,65 / 5,62                                       |
| `--cf-craie`        | #F2F1EC | Texte courant                                                                            | 17,30 / 15,22                                            |
| `--cf-blanc`        | #FFFFFF | Mots pleins du display, logo                                                             | 19,57                                                    |
| `--cf-citron`       | #CCD52F | Accent unique : tracé, contours, bouton, focus, état actif                               | 12,23 sur noir ; noir sur citron 12,23                   |
| `--cf-citron-vif`   | #D9E34A | Survol et appui du bouton                                                                | noir dessus 14,01                                        |
| `--cf-citron-ombre` | #8A8C3A | Tracés et libellés « passé » ou « hors filtre »                                          | 5,49 sur noir (utilisable en texte)                      |
| `--cf-lime`         | #99C336 | Uniquement en fin du dégradé « ourlet »                                                  | noir dessus 9,52                                         |

Combinaisons interdites :

- blanc sur citron (1,60) ;
- citron sur craie (1,41) ;
- citron sur lime (1,29) ;
- citron et lime en aplats voisins.

Le vert du flyer #78A014 est banni.

**Dégradé « ourlet »** (une seule fois, en bas de la section Fin) :

```css
linear-gradient(180deg in oklab, #0C0C0B 0 42%, #2A331A 60%, #72902F 85%, #99C336)
```

Points de contrôle :

- blanc sur #526820 (mi-parcours) : 6,25 ;
- noir sur #72902F : 5,35 ;
- noir sur #526820 : 3,13, donc graphisme seulement.

On ne pose aucun texte entre 45 % et 85 % de la hauteur du dégradé.

**Zones de texte sur photo** : p95 de la luminance ≤ #585858 (Y 0,098) et p99,5 ≤ #737373. À #585858 on obtient blanc 7,11, craie 6,29, citron 4,45. Le citron n'y apparaît qu'en display ≥ 64 px (texte large, 3:1 suffit).

**Rationnement**

- Le citron couvre au plus 10 % de la surface d'un écran. Pas d'aplat citron plus grand qu'un bouton.
- La seule grande zone lumineuse est l'ourlet.

**Surfaces** : `[data-site='v2'] [data-surface='nuit' | 'carbone' | 'photo' | 'ourlet']` redéfinit `--bg`, `--ink`, `--ink-muted`, `--rule`, `--accent`, `--accent-fill`, `--on-accent`, `--focus`, `--selection-*`.

**Navigateur**

- `::selection` citron sur noir.
- `caret-color` et `accent-color` citron.
- `scrollbar-color: #6E6C66 #0C0C0B`.
- `theme-color` #0C0C0B.

**Focus** : `outline: 2px solid #CCD52F; outline-offset: 2px` partout, `scroll-margin-top: 88px`.

### B.2 Typographie

| Famille                                          | Paquet                                           | Rôle                                                                                          |
| ------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| **Anybody** variable (wdth 50–150, wght 100–900) | `@fontsource-variable/anybody` 5.3.0, `wdth.css` | Display, avec 4 instances nommées (ci-dessous)                                                |
| **Figtree** variable (wght 300–900, italique)    | `@fontsource-variable/figtree` 5.3.0             | Texte 400/500/600. **Italique 500 citron** pour la voix signature, l'écho de « BY EBC SPORT » |
| Montserrat 900 et 500 italique, Exo 2 Black      | build seulement                                  | Vectorisation du logo, jamais chargées                                                        |

Instances d'Anybody :

| Instance           | wdth    | wght      | Usage                                 |
| ------------------ | ------- | --------- | ------------------------------------- |
| « Étendard »       | 140–150 | 900       | En contour, l'esprit de CAP           |
| « Bloc »           | 60–70   | 900       | En plein blanc, l'esprit de FITNESS   |
| « Donnée »         | 62      | 800       | `tnum`, pour les horaires             |
| « Poids du cours » | 100     | 300 → 900 | Indexé sur l'intensité, voir plus bas |

**Le poids du cours**

- Un nom de cours est composé à `wght = 150 + 150 × intensité`, soit 300 (Yoga) à 900 (Cross training).
- L'intensité est toujours écrite en texte à côté, par exemple « Intensité : soutenue · 4 sur 5 ».
- Mention obligatoire : « repère indicatif, à valider par les coachs ».

**Contour CSS**

- `-webkit-text-stroke: 0.04em #CCD52F` (≈ 5,6 % de la capitale, comme CAP), avec `color: transparent` et `paint-order: stroke`.
- Seulement à partir de 64 px.
- Jamais deux mots en contour côte à côte.
- En contrastes forcés : `-webkit-text-stroke: 0`, `color: CanvasText`.

**Casse**

- Mots-étendards et lignes du H1 : `text-transform: uppercase`, la source reste en casse normale.
- H2 : en casse de phrase, en Bloc.
- Aucune capitale espacée hors du display. Au plus 4 éléments de ce type sur la page.

**Échelle fluide** (base 16 px, bornes 390 → 1440) :

| Token                    | 390 | 1440 | `clamp()`                                                                                         | Interligne / approche |
| ------------------------ | --- | ---- | ------------------------------------------------------------------------------------------------- | --------------------- |
| `--text-hero`            | 68  | 176  | `clamp(4.25rem, 1.743rem + 10.286vw, 11rem)`                                                      | 0,86 / −0,01em        |
| `--text-hero-2` (0,65 ×) | 44  | 114  | `calc(var(--text-hero) * .65)`                                                                    | 0,9 / −0,02em         |
| `--text-banner`          | 72  | 264  | `clamp(4.5rem, 0.043rem + 18.286vw, 16.5rem)`, remplacé par `calc(var(--fit) * 1cqi)` mot par mot | 0,8 / −0,01em         |
| `--text-h2`              | 44  | 112  | `clamp(2.75rem, 1.171rem + 6.476vw, 7rem)`                                                        | 0,92 / −0,02em        |
| `--text-h3`              | 28  | 44   | `clamp(1.75rem, 1.379rem + 1.524vw, 2.75rem)`                                                     | 1,05                  |
| `--text-data`            | 32  | 56   | `clamp(2rem, 1.443rem + 2.286vw, 3.5rem)`                                                         | 1 / `tnum`            |
| `--text-signature`       | 20  | 32   | `clamp(1.25rem, 0.971rem + 1.143vw, 2rem)`                                                        | 1,1                   |
| `--text-lead`            | 19  | 24   | `clamp(1.1875rem, 1.071rem + 0.476vw, 1.5rem)`                                                    | 1,35                  |
| `--text-body`            | 16  | 17   | `clamp(1rem, 0.977rem + 0.095vw, 1.0625rem)`                                                      | 1,55                  |
| `--text-label`           | 14  | 15   | `clamp(0.875rem, 0.852rem + 0.095vw, 0.9375rem)`                                                  | 1,3                   |

Rapports :

- hero sur corps : 176/17 = 10,4 ;
- étendard sur corps : 15,5 ;
- 4 moments ≥ 170 px à 1440 (H1, « Bouge ! », « une famille. », « Ensemble, ») ;
- les titres de chapitre font 112 px.

**Règles de composition**

- Interligne ≥ 0,9 quand une capitale accentuée tombe en 2ᵉ ligne (« DÉPASSE-TOI »).
- `text-wrap: balance` pour les titres, `pretty` pour les paragraphes.
- `typesetDeep()` sur toutes les données. Vérifier U+202F dans Anybody et Figtree ; s'il manque, utiliser U+00A0.

**Calibrage « justifié »**

- Le H1 et le titre de fin reprennent la règle du logo carré : le mot en contour et la ligne pleine ont **la même largeur**.
- On l'obtient en réglant le `wdth` de la ligne pleine. Le rapport des largeurs ne dépend pas du corps, donc on le mesure une fois au build et on le stocke dans `--wdth-bloc`.

### B.3 Grille et espacement

- **Contenu** : 12 colonnes, 1 320 px au maximum.
- **Marges** : `clamp(1.25rem, 0.321rem + 3.81vw, 3.75rem)`, soit 20 → 60 px.
- **Gouttière** : `clamp(1rem, 0.814rem + 0.762vw, 1.5rem)`, soit 16 → 24 px.
- **Espacement en « cadence »** : 8, 16, 24, 40, 64, 104, 168.
- **Trois paddings de section** :
  - `--pad-fort` : `clamp(6rem, 4.329rem + 6.857vw, 10.5rem)`, soit 96 → 168 ;
  - `--pad` : `clamp(4rem, 3.071rem + 3.81vw, 6.5rem)`, soit 64 → 104 ;
  - `--pad-dense` : `clamp(2.5rem, 1.943rem + 2.286vw, 4rem)`, soit 40 → 64.
  - Plus 0 pour les photos plein cadre.
- **Échelle du papier ECG** (planning et sélecteur) :
  - 1 heure = 150 px = 5 grands carreaux de 30 px ;
  - chaque grand carreau compte 5 petits de 6 px (le rapport 1:5 du papier ECG).
- **Formes** : rayon 2 px sur les boutons, 0 sur les photos et panneaux. Aucune `box-shadow`.

### B.4 Matières, lumière, couches

De bas en haut :

1. le noir ;
2. la photo N&B (grain cuit) ;
3. le papier ECG en `repeating-linear-gradient` 1 px, uniquement derrière les données ;
4. le tracé SVG et les contours, en citron ou blanc ;
5. l'interface.

**La couleur est une lumière**

- Le citron n'existe que comme trait, contour, bouton, focus ou état.
- La « lumière chartreuse » sur les photos est faite **en code**, jamais dans l'image. Deux procédés :
  - un duotone transitoire `::after { background:#CCD52F; mix-blend-mode:multiply }`, de 0 à 1 en 240 ms au survol ou au focus d'une photo de moins de 50 % de la largeur ;
  - le shader Phosphore du hero (§E).

**Séparations**

- Entre noir et carbone : toujours un filet #2A2926 de 1 px ou une rupture d'image (leur contraste n'est que de 1,14).
- Pas de filet systématique sous les sections.

### B.5 Iconographie

Aucune icône. Ce qui la remplace :

| Besoin               | Solution                                                        |
| -------------------- | --------------------------------------------------------------- |
| Signe de marque      | Le complexe ECG canonique seul                                  |
| Marqueur de FAQ      | Tiret de 16 × 2 px qui passe à 32 px et en citron à l'ouverture |
| Liens                | Le mot seul (« Voir le planning »), sans flèche                 |
| Menu                 | Bouton texte « Menu » / « Fermer », même largeur                |
| Liens de stores      | Texte en pointillé « App Store · lien à venir », sans badge     |
| Information inconnue | Filet pointillé 1 px #6E6C66 + mention « à confirmer »          |

Pas de coche, pas de « + », pas d'emoji, pas de pictogrammes du flyer.

### B.6 Traitement photo : famille « nuit »

Réglages dans `art/v2/grade.py`, sur la base de `art/grade.py` :

- **Mono** : luma Rec.709, saturation 0.
- **Niveaux** :
  - point noir : p1 → 0,015 (≈ #040404) ;
  - point blanc : p99,7 → 0,90 (≈ #E6E6E6).
- **Courbe** :
  - S de contraste 1,25, pivot 0,40 ;
  - épaule des hautes lumières à partir de 0,80 ;
  - gamma 1,12 (low-key) ;
  - ombres non relevées.
- **Zone de texte prévue** : masque gradué de −0,6 EV, adouci sur 25 %, sur le rectangle déclaré par image. Cible : p95 ≤ #585858, vérifiée par script.
- **Vignettage** : −0,35 EV aux coins, ellipse 1,2.
- **Grain** : gaussien monochrome σ 0,010 à la taille livrée, pixel 1, réduit ×0,6 dans les noirs.
- **Netteté** : unsharp de rayon 0,6, quantité 0,4.
- **Géométrie** : marge de sécurité de 3 %, recadrage sur un point focal déclaré, `object-position` lu dans les données.
- **Encodage** :
  - en niveaux de gris : AVIF q50 (4:2:0, chroma vide), WebP q72, JPEG q78 progressif ;
  - largeurs 480, 768, 1 080, 1 440, 1 920 et 2 560 ;
  - empreinte dans le nom des fichiers.
- **Placeholder** : 32 × 18 px flouté, en ligne (≈ 400 o).
- **Provenance** : XMP IPTC `trainedAlgorithmicMedia`, prompt embarqué, `art/v2/manifest.json`.
- **Recadrages dirigés** (`CROPS`) : 3:4 pour le hero mobile, 4:5 pour la Famille mobile.

### B.7 Logo reconstruit (SVG)

Générateur : `art/v2/logo_build.py`, repris de `scratchpad/capfit-scripts/logo_build.py`.

**Construction**

- **CAP** : Montserrat 900 sans chevauchements (skia-pathops), contour de 0,06 cap vectorisé en surface remplie, intérieur transparent.
- **FITNESS** : Exo 2 Black sans chevauchements, condensé à 0,97, approche −0,04em. Les coupes sont faites par différence booléenne :
  - horizontal : fentes effilées à 22 % et 75 % ;
  - carré : lamelles décalées de ±12 % sur le F et le dernier S.
- **Signature** : Montserrat 500 italique, calée à droite.
- **Tracé canonique** (amplitude 100, ligne de base y = 0) :
  ```svg
  <path d="M-45 0H0L10.4-44L27 37.5L48.6-100L53.1 92L76.5-29.5L90 0H135"/>
  ```
  - tube de 0,15 cap, parois de 0,03 cap, bouts biseautés à 45°, transparence par masque ;
  - version pleine en polygone à pointes effilées ;
  - `stroke-miterlimit: 5`.
- **Groupes animables** : `#trace-l`, `#cap`, `#fitness`, `#trace-r`, `#signature`. Le tracé en trait porte `pathLength="1"`.
- **Sortie** : `app/assets/brand/cap-*.svg` → `CapLogo.vue`, en ligne. Accessibilité : `role="img"`, `aria-label="CAP Fitness by EBC Sport"`.

**Déclinaisons**

| Variante   | Contenu                                                                                         | Usage                                                                  | Taille minimale                      |
| ---------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| `full`     | Chiasme complet : ECG blanc plein, CAP en contour, FITNESS plein, ECG citron en tube, signature | Pied de page                                                           | ≥ 400 px                             |
| `reduced`  | CAP + FITNESS                                                                                   | En-tête                                                                | 213 px sur bureau, 180 px sur mobile |
| `stacked`  | Version carrée                                                                                  | Image OG 1200 × 630 générée au build, avec « Maquette non officielle » | —                                    |
| `monogram` | CAP en contour                                                                                  | Page 404                                                               | —                                    |
| `trace`    | Complexe plein citron                                                                           | Favicon `/v2/favicon.svg` (trait à 10 %)                               | —                                    |

Zone de protection : la capitale de FITNESS. Le logo n'est jamais posé sur citron ni sur fond clair.

## C. Le hero au pixel près

Le H1 se lit en une phrase : « Chacun son rythme. Tous ensemble. » Sa composition reproduit le logo carré :

- un mot-étendard en contour au-dessus ;
- une ligne pleine à 0,65 × de même largeur ;
- la signature italique ferrée à droite.

Le bloc est ancré au bas du hero (`bottom` fixe) ; les hauteurs ci-dessous valent pour un viewport de 900.

### Bureau 1440 × 900

- **0–32** : bandeau maquette, carbone. Figtree 500, 14 px, craie, x = 60 : « Maquette non officielle : proposition de site pour CAP Fitness by EBC Sport. » À droite (x = 1380) : lien gris souligné « Ce qui reste à confirmer » → `#a-confirmer`.
- **32–104** : en-tête transparent sur la photo.
  - Logo `reduced` 213 × 28 à x = 60.
  - Navigation Figtree 500, 16 px, craie, à partir de x = 790, écarts de 40 : Cours, Semaine, Famille, Infos.
  - Bouton « Réserve ta place » de 44 px de haut, bord droit à x = 1380 : Figtree 600 16 px, noir sur citron, avec une fente de 20 px pour l'impulsion.
- **Photo `nuit-hero`** : plein cadre 1440 × 868 (y 32–900), focale (0,70, 0,40).
  - Les sujets occupent x 35–95 % et y 120–520.
  - Le sol sombre occupe y > 540 : c'est la zone de texte.
  - Voile d'intro noir à 0,5 (voir l'animation).
- **H1, x = 60** (approche optique −0,04em) :
  - **L1 « Chacun »** : Étendard wdth 145 wght 900, 176 px, contour citron de 7 px. Capitale de y 462 à 589 (ligne de base). Largeur W ≈ 824 px.
  - **L2 « son rythme. »** : Bloc wght 900, 114 px, blanc plein, `wdth` calibré pour une largeur de W. Capitale de y 595 à 677 (L2 repose sur L1 avec un jour de 6 px = 0,05 cap, comme CAP sur FITNESS).
  - **« Tous ensemble. »** : Figtree italique 500, 32 px, citron, ferrée à droite à x = 884, ligne de base y = 725.
- **Lead**, x = 60, lignes de base 768 et 796 : Figtree 20/28, craie, 34ch : « Pound, Cardio Jump, Cross training, Pilates… Huit disciplines, des coachs diplômés et une salle où l'on se dépasse ensemble, dans la bonne humeur. »
- **Tracé**, branché sur le pied de L2 comme dans le logo :
  - tube citron de 12 px, parois de 3 px ;
  - départ à x = 892 sur y = 677 ;
  - complexe de 80 px de large (x 892–972), R à y 588, S à y 759 ;
  - puis ligne plate jusqu'au bord, x = 1440.
  - C'est la seule occurrence du tracé sur l'écran.
- **Moniteur « Prochain cours »** (x 1060–1380), posé sur la ligne plate :
  - « Prochain cours », Figtree 500 15 px, gris, ligne de base 548 ;
  - « Lundi 18 h 15 », Donnée 56 px `tnum`, craie, ligne de base 606 ;
  - « Cardio Jump · intensité 5 sur 5 », Figtree 600 18 px, ligne de base 636 ;
  - « dans 2 h 40 · heure de Paris », 15 px, gris, ligne de base 662.
  - Sous la ligne, y 701–753 : bouton « Réserve ta place » de 52 px à x = 1060, et lien « Voir le planning » ferré à x = 1380.
  - À x = 1380, ligne de base 790 : « 62 bpm · tempo de ta visite » en 14 px gris, `aria-hidden`.

### Mobile 390 × 844

- **0–32** : bandeau d'une ligne : « Maquette non officielle · pourquoi ? »
- **32–88** : en-tête de 56 px. Logo `reduced` 180 × 24 à x = 20. Bouton texte « Menu » 44 × 44, x 326–370.
- **Photo** : recadrage 3:4 en `cover`, focale (0,62, 0,32). Sujets entre y 120 et 420 ; y > 440 est la zone de texte.
- **H1, x = 20, W = 350** :
  - L1 en 74 px, contour de 3 px, capitale de y 452 à 505 ;
  - L2 en 48 px, ligne de base 544 ;
  - signature 22 px, ferrée à x = 370, ligne de base 578.
- **Tracé** :
  - ligne plate à y = 664 sur toute la largeur ;
  - complexe à x 20–67, amplitude 52 (R à 612, S à 712).
- **Moniteur** (x 88–370) :
  - au-dessus de la ligne : « Prochain cours » en 14 px (ligne de base 612), « Lun. 18 h 15 » en Donnée 32 px (ligne de base 652) ;
  - sous la ligne : « Cardio Jump · 5 sur 5 » en 15 px (ligne de base 690).
- **Actions** : bouton plein « Réserve ta place » 350 × 52 (y 716–768) ; lien « Voir le planning » avec une cible de 44 px (y 776–820). Le lead passe dans le Manifeste.

### Les 2 premières secondes

Animation en keyframes CSS, déclenchée par `hero-ready`. Le H1, le bouton et la photo sont peints et cliquables dès t = 0.

| t (ms)    | Événement                                                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–480     | Voile 0,5 → 0, courbe `out` : « la salle s'allume »                                                                                                                  |
| 80–700    | Contour de L1 tracé de gauche à droite (`clip-path: inset(0 100% 0 0)` → `inset(0)`, `in-out`), comme un traceur. L2 et la signature sont déjà là (élément LCP-safe) |
| 500–1060  | Tracé dessiné (`stroke-dashoffset` 1 → 0, linéaire, vitesse de papier). Le pic R passe à 802 ms                                                                      |
| 802–1272  | **Battement** : L1 se remplit de citron en 90 ms (`strike`), tient 140 ms, revient au contour en 240 ms (`out-soft`)                                                 |
| 900–1140  | Les chiffres du moniteur montent de 14 px dans un masque (`out`)                                                                                                     |
| 1060–1300 | « 62 bpm » apparaît en fondu (240 ms)                                                                                                                                |
| > 1300    | Tout est immobile. Le hero ne bouge plus que sous le pointeur ou au défilement (§E)                                                                                  |

**État sans JS et en mouvement réduit**

- Composition finale, sans voile, tracé entièrement dessiné, L1 en contour.
- Le moniteur affiche la donnée du rendu serveur : « Premier cours de la semaine · Lundi 13 h 00 · Pound ». Ce n'est jamais présenté comme « prochain ».
- Avec JS, ce bloc est recalculé à l'heure de Paris.
- Le tempo n'est pas affiché.

## D. Section par section

### 0. Bandeau, en-tête, menu, barre mobile

- **Rôle** : transparence et accès permanent à l'action.
- **En-tête**
  - Collant sous le bandeau. Passe de 72 à 56 px après 80 px de défilement (240 ms, `out-soft`).
  - Une fois défilé : fond noir plein et filet #2A2926. Pas de translucidité.
- **Bouton**
  - Au survol, une impulsion noire de 1,5 px se dessine dans la fente de 20 px (220 ms) ; elle se rétracte à 0,65 × au départ du pointeur.
  - À l'appui : `translateY(1px)` en 90 ms.
- **Menu mobile**
  - `<dialog>` modal plein écran, piège du focus natif, Échap.
  - Entrées en Bloc 64 px, craie pleine ; citron plein au focus ou au survol.
  - En bas : le prochain cours et le bouton.
  - Sans JS : ouverture par `:target`.
- **Barre mobile**
  - Fixe en bas : 64 px + `safe-area`, fond carbone, filet haut.
  - Contenu : « Prochain : Cross training · mer. 12 h 15 » (heure en Donnée) et un bouton « Réserver » de 44 px.
  - Apparaît quand le bouton du hero sort de l'écran ; masquée quand le bouton de la Fin est visible ou que le menu est ouvert.
  - Sans JS : toujours visible, avec « 8 créneaux par semaine · Réserve ta place ».

### 1. Hero `#haut` : l'échauffement

Voir §C.

### 2. Manifeste `#bouge` : la ligne plate

- **Surface** : `nuit`. Padding `--pad-fort` en haut, `--pad` en bas.
- **Rôle** : la promesse et les valeurs en un écran, sans cartes.
- **Composition bureau**
  - « Bouge ! » en Étendard, contour citron, ajusté sur 12 colonnes (`--fit` ≈ 22cqi, soit ≈ 290 px à 1440).
  - Dessous, sur 12 colonnes :
    - colonnes 1–5 : « Dépasse-toi. / Prends du plaisir. / Atteins tes objectifs. » en Bloc 56 px blanc, interligne 1,0 ;
    - colonnes 7–12 : le paragraphe (Figtree 24/1,4, craie, 34ch) : « Ici, on vient pour bouger, et on revient pour les gens… ». Les quatre valeurs y sont fondues dans une phrase, en Figtree 600 : tous niveaux, coachs diplômés, ambiance motivante, sport santé & bien-être.
  - Puis la ligne de faits : « **8** créneaux sur **4** jours, dont **2** à la pause de midi. » Chiffres en Donnée citron.
  - Au pied de la section, une **ligne plate** pleine largeur (1 px, #6E6C66) qui sert de filet d'entrée à la section suivante.
- **Mobile** : « Bouge ! » ajusté sur 350 px (≈ 80 px) ; verbes en 36 px ; paragraphe en 19 px ; le lead du hero arrive ici.
- **Mouvement**
  - Défilement lié de `top 85%` à `top 45%` : le contour de « Bouge ! » se trace de gauche à droite (`clip-path`).
  - À 100 % : un battement (contour → plein → contour, 470 ms).
  - Le reste est immobile.
- **Sans JS / mouvement réduit** : contour complet, pas de battement.

### 3. Ton rythme `#cours` : la montée et le pic

- **Surface** : `carbone`, filet d'entrée hérité de la ligne plate. Padding `--pad`.
- **Rôle** : recommander un cours et y mener (conversion).
- **Titre**
  - « Fais monter le cœur. » en H2 Bloc 112 px, blanc, colonnes 1–8.
  - « Puis redescends en douceur. » en signature italique citron 32 px, ferrée à droite sous le H2.

#### Le sélecteur « Ce soir, tu veux… » (bureau)

Un bandeau de 1 320 × 360 px, sur papier ECG.

- **Colonnes 1–8, la bande-tempo** :
  - SVG de 760 × 160 qui montre une fenêtre de 4 s ;
  - complexes canoniques d'amplitude 80 et d'empan 72, espacés selon le niveau : 60, 80, 105, 130 et 155 bpm, soit 4 à 10 complexes ;
  - à 155 bpm l'intervalle fait 73,5 px, donc les complexes se frôlent ;
  - légende : « Tempo illustratif, pas une mesure ».
- **Dessous, `radiogroup` natif de 5 options** (cibles ≥ 44 px) :
  - Respirer ;
  - Bouger en douceur ;
  - Transpirer ;
  - Te défouler ;
  - Tout donner.
  - Chaque libellé est composé au poids de son niveau (300 → 900). Option cochée par défaut : niveau 3.
- **Colonnes 9–12, la recommandation**. Exemple : « Pour toi : Step » (h3 au poids 600), son accroche, « Prochain créneau : mardi 17 h 15 », le bouton « Réserver ce cours » et le lien « Voir la fiche ».

Correspondance des niveaux :

| Niveau | Cours recommandés                                                 |
| ------ | ----------------------------------------------------------------- |
| 1      | Yoga, Stretching (« Créneaux à confirmer : demande à l'accueil ») |
| 2      | Pilates                                                           |
| 3      | Step, CAF                                                         |
| 4      | Pound                                                             |
| 5      | Cardio Jump, Cross training                                       |

#### Les huit cours, en trois groupes de compositions différentes

- **Cardio en musique** : photo plein cadre 100vw × 72svh (`nuit-pound`, `nuit-jump`, `nuit-step`).
  - Nom du cours actif en bas à gauche, en Bloc 96 px.
  - Index vertical au bord droit, en onglets APG : « Pound · lun. 13 h 00 », « Cardio Jump · lun. 18 h 15, 19 h 00 », « Step · mar. 17 h 15 ».
  - L'onglet actif est marqué d'un tiret citron de 24 px.
- **Force et intensité** : deux photos en quinconce.
  - Colonnes 1–7 : `nuit-cross-mains` en 4:5. Colonnes 9–12 : `nuit-caf` en 1:1, décalée de 104 px vers le bas.
  - Leurs fiches sous chaque photo.
  - Un encadré-donnée : **l'enchaînement du mercredi**, mini-dérivation de 18 h 00 à 20 h 00 (300 px) avec deux pics réels, CAF à 18 h 00 puis Cross training à 19 h 00.
- **Retour au calme** : photo panoramique 21:9 plein cadre (`nuit-calme`, 80 % de noir), suivie d'une liste aérée de 3 lignes.
  - Noms au poids 300 à 450, 56 px.
  - Phrases du flyer.
  - Mention « Créneaux à confirmer » sur filet pointillé.

#### Fiches et mobile

- **Fiche de cours** : `<details>` natif, ouverture en `grid-template-rows` 0fr → 1fr (420 ms, `in-out`), `hidden="until-found"`.
  - Contenu : ce que c'est, déroulé (« durée à confirmer »), matériel, pour qui, ce que tu y gagnes, précautions (Cardio Jump, CAF), créneaux réels.
  - Actions : « Réserver ce cours » et « Ajouter à mon agenda » (.ics statique).
- **Mobile** :
  - sélecteur vertical (5 radios de 52 px) ;
  - bande-tempo de 350 × 120 sur une fenêtre de 2 s, amplitude 48 ;
  - Cardio en musique en rail aimanté (`useSnapRail`, cartes à 84 %) ;
  - Force empilée, Calme en liste.

#### Interaction et mouvement

- Changer de niveau repositionne les complexes : `translateX` en 240 ms, `out-soft`, sans redessin de la forme. Le poids du titre recommandé interpole en 240 ms.
- La recommandation change en fondu + 14 px (occurrence n° 2 sur 6).
- Changer d'onglet Cardio : fondu enchaîné de la photo en 240 ms.
- Survol des photos du groupe Force : duotone citron.

#### Sans JS et mouvement réduit

- Le sélecteur fonctionne en CSS seul : `.rythme:has(#niveau-3:checked) [data-niveau="3"] { display:block }`.
- Les créneaux affichés sont ceux du rendu serveur (« Premier créneau : mardi 17 h 15 »).
- Les onglets sont empilés et les fiches lisibles.

### 4. Ta semaine `#semaine` : la signature, sur des données réelles

- **Surface** : `nuit` sur papier ECG.
- **Hauteur** : 100svh (minimum 760), padding `--pad-dense`. Épinglée 100svh sur bureau (≥ 64em, mouvement autorisé, hauteur ≥ 700).

**Composition bureau**

- **Haut (160 px)** :
  - H2 « Ta semaine en cours collectifs. » en Bloc 112 px, une ligne, colonnes 1–9 ;
  - chapeau en 17 px gris, colonnes 10–12 : « Huit créneaux sur quatre jours, dont deux à la pause de midi. Réserve dans l'appli CAP Fitness ou à l'accueil. »
- **Grille, cinq dérivations** :
  - colonne des jours de 120 px, puis l'axe 12 h → 20 h sur 1 200 px (150 px par heure) ;
  - 5 lignes de 104 px : lun., mar., mer., jeu., ven.
  - Dans chaque ligne :
    - une ligne de base #6E6C66 à 32 px du bas ;
    - chaque créneau est un complexe canonique (amplitude 56, empan 50) dont **le R tombe sur l'heure de début** ;
    - au-dessus, un `<button>` : heure en Donnée 24 px, nom au poids du cours en 16 px. Nom accessible : « Cross training, mercredi 12 h 15 : réserver ».
  - Écarts vérifiés : lun. 18 h 15 → 19 h 00 = 112 px, mer. 18 h 00 → 19 h 00 = 150 px. Les étiquettes tiennent.
  - Le jeudi est une ligne plate avec « Pas de cours collectif au planning ce jour-là. », Figtree italique, gris.
  - Ligne fine « sam. · dim. » de 48 px, même mention.
  - Ligne pointillée « Bien-être » : Pilates, Yoga, Stretching, « créneaux à confirmer ».
- **Bas** :
  - filtres en radios natives : Tout · Cardio en musique · Force et intensité · Retour au calme. Les créneaux hors filtre passent en `citron-ombre` et gris ;
  - « Idées de semaine (suggestions, pas un programme du club) » : Tu reprends · Tu veux te défouler · Tu veux du solide · Pause de midi. Chaque idée allume ses créneaux, en CSS `:has()` ;
  - mention en 14 px gris sur pointillé : « Planning de la saison, en place depuis la rentrée (source : flyer du club). Susceptible d'évoluer pendant les vacances : à confirmer. »

**États** (heure de Paris, `Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris' })`) :

| État                             | Rendu                                                       |
| -------------------------------- | ----------------------------------------------------------- |
| Jour courant                     | Libellé du jour en citron, ligne de base en craie           |
| « Passé »                        | Complexe en `citron-ombre`                                  |
| « Commencé à 18 h 00 »           | Pendant 45 min, mention « durée à confirmer »               |
| « Prochain cours · dans 2 h 40 » | Complexe citron, bouton « Réserver ce cours » mis en avant  |
| Repère « Maintenant · 18 h 20 »  | Trait vertical citron de 1 px, seulement entre 12 h et 20 h |

**Mobile**

- Onglets APG lun.–ven., 5 × 64 px ; le jour courant est sélectionné au montage.
- Une dérivation de 350 px (43,75 px par heure, amplitude 40).
- Liste dessous : heure en Donnée 32 px, nom, état, bouton « Réserver » de 44 px et lien agenda.
- Sans JS : les jours sont empilés (logique de `ClubSchedule.vue` conservée).

**Mouvement** : voir le moment « Cinq dérivations » en §E et §G. Les étiquettes passent de 0,35 à 1 et de +14 px à 0 au passage du curseur (occurrence n° 3).

**Mouvement réduit et sans JS** : grille complète, tous les complexes tracés, aucun épinglage.

### 5. La famille `#famille`

- **Surface** : `photo` puis `nuit`. Padding 0, puis `--pad`.
- **Rôle** : rassurer par l'ambiance et l'honnêteté.

**Composition bureau**

- Photo plein cadre 100vw × 80svh (`nuit-famille`), zones sombres prévues en haut à gauche et en bas à droite.
- « Plus qu'une salle, » en Bloc 112 px blanc, en haut à gauche (x = 60, y = 104).
- « une famille. » en Étendard contour citron, ajusté (≈ 210 px), en bas à droite, ferré à x = 1380.
- Sous la photo, une grille 5/7 :
  - **gauche** : « On se dépasse ensemble, dans la bonne humeur. Ceux qui reprennent, ceux qui s'y mettent, ceux qui ne ratent pas un mercredi soir : tout le monde a sa place. » (lead 24 px) ;
  - **droite**, « Tes coachs. Diplômés, pour t'accompagner et te motiver. » :
    - 3 lignes typographiques sur pointillé, sans silhouette ni carte, par exemple « Coach · prénom à venir — Cours encadrés : à confirmer — Diplôme : à confirmer » ;
    - un bloc pointillé « Avis Google à intégrer · lien vers la fiche : à confirmer ». Aucun faux avis.
- **Mobile** : recadrage 4:5 (390 × 488) ; titres en 44 et 76 px ; colonnes empilées.

**Mouvement**

- Le contour de « une famille. » se trace (700 ms, `in-out`) à `top 70%`, sans battement : une seule frappe par écran.
- Les textes arrivent en fondu + 14 px (occurrence n° 4).

**Réduit et sans JS** : état final.

### 6. Pratique `#infos` : avant ton premier cours

- **Surface** : `carbone`, filet d'entrée. Padding `--pad`. C'est la zone dense de la page.
- **Composition bureau**
  - Colonnes 1–4, collant à `top: 120px` : H2 « Avant ton premier cours. » en Bloc 96 px sur 3 lignes, plus `nuit-velos` en 4:5 (330 px de large), légendée « Visuel d'illustration ».
  - Colonnes 6–12, trois blocs séparés par des filets #2A2926 :
    - **FAQ** : 8 questions du dossier dans des `<details name="faq">` natifs. Question en Figtree 600 20 px ; marqueur en tiret.
    - **Formules** : tableau sémantique de 3 lignes (Cours collectifs · Salle et cours, si un plateau existe · Séance à l'unité). Colonne prix « — € · à confirmer » sur pointillé. Lien « Demande les tarifs à l'accueil ». Ni carte ni « le plus choisi ».
    - **Accès et accueil** :
      - « Adresse à confirmer, [Commune] » sur pointillé ;
      - grille de 7 jours « — h — · à confirmer » ;
      - « Téléphone, e-mail, Instagram, Facebook : à confirmer » ;
      - « Plan d'accès à venir », sans fausse carte ni « ouvert maintenant ».
- **Mobile** : sans colonne collante ; H2 64 px ; blocs empilés.
- **Mouvement** : seulement l'accordéon. Aucune entrée animée.
- **Sans JS** : identique.

### 7. Fin `#reserver` : l'ourlet

- **Surface** : `nuit`, puis `ourlet`. Padding `--pad-fort`.
- **Rôle** : la réservation, l'écho du hero (même gabarit de titre, 2 chapitres sur 8 au maximum).

**Composition bureau**

- **Titre** justifié sur 1 320 px :
  - « Ensemble, » en Étendard contour citron, ≈ 190 px ;
  - « allons plus loin. » en Bloc blanc à 0,65 ×, même largeur.
- **Ligne dynamique** en Donnée 56 px : « On t'attend ce soir, 19 h 00 ? ». Sans JS : « On t'attend au prochain cours ? »
- **Deux voies sur 6 + 6 colonnes**, sans cartes :
  - **gauche, « Dans l'appli CAP Fitness »** :
    - phrase en séquence : « Ouvre l'appli. Choisis ton cours. Viens comme tu es. » ;
    - liens pointillés « App Store · lien à venir », « Google Play · lien à venir » ;
  - **droite, « À l'accueil »** : « Tu préfères en parler ? Passe à l'accueil, on s'en occupe avec toi. Adresse à confirmer. »
- **Action**
  - Un seul bouton plein : « Ajouter mon prochain cours à l'agenda » (.ics). C'est l'action réelle disponible tant que le club n'a pas fourni le lien de l'appli.
  - Si un cours a été choisi plus haut (JS, `useState`) : « Tu as choisi : Cross training, mercredi 19 h 00 ».
- **Ourlet** : bande plein cadre 100vw × 44svh, dégradé de §B.1. À 80 % de sa hauteur, un tracé **noir** de 2 px (3,1 à 9,5:1).
- **Raccord** : l'ourlet finit en lime puis bascule net vers le noir du pied de page, comme le maillot sur le short.
- **Mobile** : titre ajusté sur 350 px (≈ 64 / 42 px) ; voies empilées ; ourlet 40svh.

**Mouvement**

- À `top 60%` : la ligne noire est plate, puis bat **une fois** (complexe dessiné en 420 ms).
- « Ensemble, » fait un battement synchronisé.
- Les voies arrivent en fondu + 14 px (occurrence n° 5).

**Réduit et sans JS** : tracé complet et immobile.

### 8. Pied de page : le short

- **Surface** : `nuit`. Padding `--pad-dense`.
- **Liste « À confirmer par le club »** (`#a-confirmer`), sur 2 colonnes : commune et adresse, téléphone, horaires, durées, créneaux bien-être, tarifs, essai, coachs, appli, mentions légales, licence POUND, photos réelles. C'est le message au gérant : « il ne manque que vos infos ».
- **Mentions** :
  - « Maquette non officielle, réalisée pour proposition, non validée par le club. Planning et slogans repris des supports du club ; les autres informations sont à confirmer. Visuels d'illustration générés par IA, personnes fictives. » ;
  - lien « Voir la direction 1 ».
- **Logo** : logo `full` sur toute la largeur du conteneur (1 320 px, cap ≈ 118 px), calé en bas.
- **Mouvement** :
  - serre-livre : les deux tracés du logo se dessinent (700 ms), puis « CAP » bat une fois ;
  - déclenché aussi par `focusin`.

## E. Grammaire de mouvement

**Geste fondateur : le battement.** Un passage du pic R remplit un contour (contour → plein → contour), en 90 + 140 + 240 = 470 ms.

**Règles du tracé**

- Il s'écrit à vitesse constante, comme du papier ECG.
- Le temps ne change jamais la forme canonique : il change l'**espacement** entre les complexes.
- Le repos est l'état final, tracé complet.

**Tokens** (dans `@layer tokens { :root[data-site='v2'] }`, lus par `app/motion/tokens.ts`) :

| Token                                | Valeur                      | Origine                                                                                     |
| ------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------- |
| `--ease-out`                         | `cubic-bezier(.2,.9,.25,1)` | Arrivées                                                                                    |
| `--ease-out-soft`                    | `cubic-bezier(.3,.8,.4,1)`  | États, relâchement du battement                                                             |
| `--ease-in`                          | `cubic-bezier(.6,0,.9,.3)`  | Sorties (×0,65 de la durée d'entrée)                                                        |
| `--ease-in-out`                      | `cubic-bezier(.62,0,.32,1)` | Mise en page, tracé des contours                                                            |
| `--ease-strike`                      | `cubic-bezier(.9,0,.1,1)`   | Montée R → S quasi verticale. **Aucun dépassement** : on supprime l'ancien `.34,1.56,.64,1` |
| `--ease-trace`                       | `linear`                    | CSS seulement, à ne pas ajouter aux `EASES` (`bezier()` lèverait une erreur)                |
| `--dur-press` / `feedback` / `state` | 90 / 140 / 240 ms           | —                                                                                           |
| `--dur-strike`                       | 100 ms                      | Durée d'un QRS                                                                              |
| `--dur-layout` / `overlay` / `focal` | 420 / 480 / 700 ms          | —                                                                                           |
| `--dur-travel`                       | 968 ms                      | Un battement à 62 bpm (défilement programmé)                                                |
| `--dur-beat`                         | 470 ms                      | Battement complet                                                                           |
| `--seq-max`                          | 1300 ms                     | —                                                                                           |
| `--stagger-tight` / `list` / `lines` | 36 / 72 / 96 ms             | Plafond de 6 éléments                                                                       |
| `--move-xs`                          | 5 px                        | Contour, 6 % de la capitale du H2                                                           |
| `--move-s`                           | 14 px                       | Écart entre signature et FITNESS, 0,18 cap                                                  |
| `--move-l`                           | 34 px                       | Onde P, 0,435 cap                                                                           |
| `--move-xl`                          | 78 px                       | 1 cap du H2 à 1440                                                                          |

**Chorégraphies clés**

1. **Intro du hero** : §C, fin à 1 272 ms.
2. **Moniteur du hero** (JS, sans GSAP) :
   - Sur pointeur fin, la tête d'écriture suit le pointeur le long du segment droit (lerp 0,2) : à gauche de la tête, le tracé est net ; devant elle, un vide de 24 px ; au-delà, l'ancien balayage reste à 35 %. Au départ du pointeur, la tête revient au bout en 420 ms.
   - La vitesse de défilement (`speed.ts`, `intensity()`) fait monter le tempo de 62 à 150 bpm. La récupération vers 62 se fait avec une constante de 1 200 ms.
   - Les battements sont limités à un toutes les 400 ms.
3. **Bouge !** : contour lié au défilement, puis un battement.
4. **Bande-tempo** : `translateX` des complexes en 240 ms.
5. **Cinq dérivations** :
   - L'épinglage de 100svh fait avancer un curseur vertical de 12 h à 20 h sur les 5 lignes à la fois.
   - Chaque complexe se trace (`dashoffset`) entre x_R − 27 et x_R + 23 px.
   - En fin de course, le curseur rejoint « Maintenant » en 420 ms (`in-out`) et devient le repère citron. Hors plage horaire, il s'efface en 240 ms.
   - Un `focusin` dans la section pousse la progression à 1.
6. **Fin** : ligne plate, puis un complexe, plus un battement.
7. **Pied de page** : le logo se dessine.
8. **Impulsion du bouton** : voir l'en-tête (§D.0).

**Discipline**

- Le fondu + translation est utilisé 5 fois au plus.
- Les H2 ne se déplacent jamais ; seul le remplissage change.
- Fin propre par `clearProps`.
- Ticker endormi au repos.
- Lenis seulement sur pointeur fin.
- `gsap.matchMedia` pour basculer en mouvement réduit en direct.

**Overdrive O1 « Phosphore »** (OGL, hero, bureau)

- **Canvas** : couvre le hero, DPR plafonné à 1,5.
- **Passe 1**, trace à demi-résolution en ping-pong : `trail = prev × decay(dt)`, demi-vie de 180 ms, plus le segment parcouru par la tête.
- **Passe 2**, composition :
  - photo en niveaux de gris ;
  - lumière citron **seulement sur les hautes lumières**, là où passe la trace : `mix(photo, photo × #CCD52F, trail × 0,22 × luma)` ;
  - rémanence de l'ancien tracé en trait de 1 px, de `citron-ombre` vers citron.
- **Interdits dans le shader** : noyau de flou, lueur.
- **Veille** : arrêt et canvas masqué dès que l'entrée est inactive depuis 300 ms et que `max(trail) < 0,02`. La vraie `<img>` reste dessous.
- **Garde-fou** : `canBlur()` (pointeur fin, ≥ 4 cœurs, ≥ 4 Go, pas d'économie de données, refus de SwiftShader et llvmpipe) et `motionAllowed`.
- **Chargement** : `import()` en temps libre, après LCP et `hero-ready`.
- **Budget** : 13,8 Ko d'OGL + ≈ 3,5 Ko pour `phosphor.ts`. 2 draws par image, ≈ 2,9 Mpx en composition, ≈ 0,7 Mpx pour la trace.
- **Repli** : le moniteur SVG seul, avec masque.

**Overdrive O2** : la scène SVG « Cinq dérivations », liée au défilement et épinglée.

**Interdits**

- Rebond et élastique.
- Lueur, néon, `text-shadow`, flou sur le tracé.
- Boucle automatique, point qui pulse, bouton qui « respire ».
- Plus de 3 changements de luminance par seconde.
- Parallaxe, bandeau défilant, compteur animé.
- Animation lettre par lettre.
- Épinglage au-delà de 100svh.
- Survol qui agrandit des cartes.
- Animation du LCP vers une opacité de 0.

## F. Plan d'images

**Série « nuit »**

- Un seul lieu fictif : salle de village, sol en caoutchouc sombre, murs noirs, hautes fenêtres.
- Une seule heure : le soir, à l'heure des cours, contre-jour bleu devenu gris.
- Optique 35 ou 50 mm, f/2–2,8, 1/30 s : flou de bougé sur le matériel.
- Tenues de sport sombres et variées, **sans logo ni texte**.
- Aucun sponsor, aucun regard caméra, pas de culturistes.

**Distribution fixe** (éléments de référence Higgsfield, personnes fictives) :

- A : femme, 30 ans, cheveux courts ;
- B : homme, 55 ans, barbe grise ;
- C : femme, 22 ans, tresses ;
- D : homme, 40 ans ;
- E : femme, 62 ans ;
- F : homme, 34 ans.

| id                 | Master → livrés                 | Cadrage                                                                       | Sujet                                                                         | Lumière                                            | Zone de texte (≤ #585858)                                                            |
| ------------------ | ------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `nuit-hero`        | 3:2 → 16:9 (2560) et 3:4 (1080) | Hauteur de hanche, plan moyen, sujets à x 35–95 %, pieds à 58 % de la hauteur | A, B, D, F en Cross training, kettlebells en haut de swing, flou de bougé     | Contre-jour des fenêtres, contour depuis la gauche | Bureau : y > 60 % et x < 65 %, plus le bloc x 72–96 % × y 58–88 %. Mobile : y > 52 % |
| `nuit-pound`       | 16:9 plein cadre                | Au ras du sol                                                                 | Baguettes unies qui frappent le sol, arcs de bougé, B à genoux, coupé         | Lumière latérale dure                              | Bas gauche, 40 %                                                                     |
| `nuit-jump`        | 16:9 plein cadre                | Bas, de trois quarts                                                          | Rangée de mini-trampolines, C en l'air, pieds nets                            | Contre-jour                                        | Bas gauche                                                                           |
| `nuit-step`        | 16:9 plein cadre                | Au ras du sol                                                                 | 3 steps, pieds synchronisés en montée                                         | Reflets au sol                                     | Bas gauche                                                                           |
| `nuit-cross-mains` | 4:5                             | Macro                                                                         | Mains magnésiées sur une poignée de kettlebell, poussière en contre-jour      | Contre-jour                                        | Aucune (pas de texte dessus)                                                         |
| `nuit-caf`         | 1:1                             | Profil bas                                                                    | E en pont fessier sur tapis                                                   | Lumière de contour                                 | Aucune                                                                               |
| `nuit-calme`       | 21:9 plein cadre                | Large, 80 % de noir                                                           | F en flexion avant assise                                                     | Un rai de fenêtre au sol                           | Moitié gauche                                                                        |
| `nuit-famille`     | 16:9 → 4:5                      | De trois quarts dos                                                           | A, B, C, E, F après le cours : rires, serviettes, gourdes sans marque         | Contre-jour doux                                   | Haut gauche et bas droit                                                             |
| `nuit-velos`       | 4:5                             | Perspective depuis la gauche                                                  | Salle de vélos vide (écho de la bannière), légendée « visuel d'illustration » | Contre-jour                                        | Aucune                                                                               |

**Contrôle**

- Rejeter toute image avec des mains, baguettes ou poignées incohérentes.
- Rejeter tout texte ou tissu logoté.
- Script de p95 par zone.
- `embed-prompt --scan` : 0 image sans provenance.

**Fait en code, pas en photo**

- Logo et favicon.
- Tous les tracés.
- Papier ECG, planning, bande-tempo.
- Dégradé de l'ourlet.
- Lumière citron (duotone, Phosphore).
- Image OG.
- Placeholders des coachs, de l'adresse et des tarifs (typographiques, en pointillé).
- Liens de stores en texte.
- Aucune carte, aucun téléphone factice, aucune silhouette clipart.

## G. Moments « waouh »

1. **Le battement du logo (hero)**
   - Ce qui se passe :
     - le contour de « Chacun » se trace ;
     - le tracé sort du pied de « son rythme. » ;
     - au passage du pic R, le mot se remplit de citron une seule fois ;
     - ensuite le tracé ne réagit plus qu'à toi : pointeur, vitesse de défilement, tempo de 62 à 150 qui redescend.
   - Pourquoi c'est sobre : une seule occurrence, aucune boucle, une seule couleur, et tout est immobile après 1,3 s.
2. **Cinq dérivations (planning)**
   - Ce qui se passe :
     - la journée défile de 12 h à 20 h sur les cinq jours à la fois ;
     - les vrais cours font leur pic ;
     - le curseur se pose sur « Maintenant » à l'heure de Paris ;
     - cliquer un pic mène à « Réserver » ou à l'agenda.
   - Pourquoi c'est sobre : rien que des données réelles, une forme identique pour tous les cours, 100svh d'épinglage au plus.
3. **« Ce soir, tu veux… » (sélecteur)**
   - Ce qui se passe : cinq radios ; le tempo de la bande se resserre ; le poids des noms de cours suit l'intensité ; la recommandation donne le prochain créneau réel.
   - Pourquoi c'est sobre : contrôles natifs, fonctionne sans JS grâce à `:has()`, transitions de 240 ms.

La ligne noire qui bat une fois sur l'ourlet est un **écho** du premier moment, pas un quatrième.

## H. Risques et parades

| Risque                                                  | Parade mesurable                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LCP mobile > 2,5 s (la V1 est à 3,0 s avec 60 Ko)       | <ul><li>Hero 3:4 en gris AVIF, 768w ≤ 28 Ko, 1080w ≤ 40 Ko ; bureau 1920w ≤ 140 Ko</li><li>`preload` avec `imagesrcset` + `media` + `fetchpriority="high"`</li><li>`content-visibility:auto` sur Manifeste, Famille et Pratique (pas sur la Semaine épinglée)</li><li>Hydratation différée</li><li>Cible Lighthouse mobile ≥ 92, CLS 0</li></ul>                                                          |
| Grain qui gonfle les fichiers                           | σ 0,010 appliqué à la taille livrée ; poids mesuré par image dans `build-images.mjs`, échec du build au-delà du budget                                                                                                                                                                                                                                                                                    |
| Polices lourdes                                         | <ul><li>Anybody instanciée par `fontTools.varLib.instancer` (wght 300–900, wdth 60–150) : ≈ 35 Ko visés au lieu de 56 Ko</li><li>Préchargée, car c'est la police du H1</li><li>Figtree 20 Ko et italique 20 Ko sans préchargement</li><li>Replis à métriques ajustées</li><li>Lignes du H1 en `nowrap` explicite : le changement de largeur à l'échange de police ne déplace rien verticalement</li></ul> |
| JS au premier chargement > 110 Ko (V2 actuelle : 105,1) | <ul><li>`<LazyCapWeek hydrate-on-visible>`, `<LazyCapRhythm hydrate-on-visible>`, `<LazyCapPractical hydrate-never>`</li><li>Sélecteur et filtres en CSS</li><li>Cible ≤ 104 Ko ; GSAP (47,8), OGL (13,8 + 3,5) et Lenis (5,4) chargés à la demande</li></ul>                                                                                                                                             |
| Contour illisible ou axe en « incomplet »               | Contour seulement à ≥ 64 px sur un fond ≤ #585858 (citron 4,45:1) ; texte réel accessible ; contour converti en plein en contrastes forcés                                                                                                                                                                                                                                                                |
| Épinglage et clavier                                    | `focusin` pousse la progression à 1 ; aucun contenu masqué avant `reached()` ; `scroll-margin`                                                                                                                                                                                                                                                                                                            |
| Flash (WCAG 2.3.1) et boucle (2.2.2)                    | Battements ≥ 400 ms d'écart (≤ 2,5 par seconde) ; aucune animation automatique de plus de 1,3 s ; moniteur seulement sur entrée de l'utilisateur                                                                                                                                                                                                                                                          |
| ECG kitsch ou surutilisé                                | <ul><li>Test e2e : au plus 1 `[data-ecg]` persistant dans le viewport à chaque pas de 25 % de défilement (exception déclarée : `#semaine`)</li><li>Pas de lueur ; tracé canonique unique (`CapTrace.vue`)</li></ul>                                                                                                                                                                                       |
| Données trompeuses (vraie entreprise)                   | <ul><li>`noindex` ; bandeau et pied de page « maquette »</li><li>Statut par donnée : `reel`, `a-confirmer` ou `exemple`, avec sa source</li><li>« Pound » sans ®, jamais « CrossFit »</li><li>Durées et intensités étiquetées</li><li>.ics avec « durée provisoire 1 h, à confirmer »</li><li>Greps à 0 : ALVAR, 412, Lyon, Canaris, Drake</li></ul>                                                      |
| Heure fausse                                            | Calcul en `Europe/Paris` par `Intl` (correctif de `club-time.ts`) ; tests à mer. 18 h 20 et sam. 10 h 00 heure de Paris                                                                                                                                                                                                                                                                                   |
| Barre mobile qui masque du contenu                      | `padding-bottom` de 64 px + `safe-area` sur `main` ; barre masquée quand le bouton de la Fin est visible                                                                                                                                                                                                                                                                                                  |
| Rendu de « template »                                   | <ul><li>Grep à 0 pour `#0f5233` et `#ffd83d`</li><li>Au plus 4 éléments en capitales espacées</li><li>Aucun fond clair (luminance ≤ #1C1B19 par section)</li><li>`impeccable detect` : 0 constat</li></ul>                                                                                                                                                                                                |

## I. Faisabilité dans la pile

**À créer** (`app/components/v2/`, préfixe `Cap`) :

| Composant                                                            | Rôle                                                     | Budget gzip |
| -------------------------------------------------------------------- | -------------------------------------------------------- | ----------- |
| `CapLogo.vue`                                                        | 5 variantes                                              | —           |
| `CapTrace.vue`                                                       | Tracé canonique : `plein`/`tube`, couleur, `draw`, `bpm` | —           |
| `CapMockBanner.vue`                                                  | Bandeau maquette                                         | —           |
| `CapHeader.vue`, `CapMenu.vue`                                       | En-tête et `<dialog>`                                    | —           |
| `CapStickyBar.vue`                                                   | Barre mobile                                             | —           |
| `CapHero.vue`                                                        | Hero                                                     | ≤ 3 Ko      |
| `CapNextSession.vue`                                                 | Moniteur partagé entre hero, barre et Fin                | —           |
| `CapManifesto.vue`                                                   | Manifeste                                                | —           |
| `CapRhythm.vue`                                                      | Sélecteur                                                | ≤ 3 Ko      |
| `CapCardio.vue`, `CapForce.vue`, `CapCalm.vue`, `CapCourseSheet.vue` | Groupes de cours et fiches                               | —           |
| `CapWeek.vue`                                                        | Planning                                                 | ≤ 6 Ko      |
| `CapFamily.vue`                                                      | Famille                                                  | —           |
| `CapPractical.vue`                                                   | FAQ, formules, accès                                     | —           |
| `CapFinale.vue`                                                      | Fin et ourlet                                            | —           |
| `CapFooter.vue`                                                      | Pied de page                                             | —           |

**Autres fichiers**

| Fichier                                        | Rôle                                                                                                                                                                                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/motion/phosphor.ts`                       | Overdrive OGL                                                                                                                                                                                                                                   |
| `app/utils/cap-time.ts`                        | `club-time.ts` + Europe/Paris + états sans durée connue                                                                                                                                                                                         |
| `app/data/cap.ts` + `app/types/cap.ts`         | Données avec `status` et `source`, via `typesetDeep`                                                                                                                                                                                            |
| `scripts/build-ics.mjs`                        | Un .ics statique par créneau dans `public/v2/agenda/` : `RRULE:FREQ=WEEKLY`, `TZID=Europe/Paris`. Fonctionne sans JS                                                                                                                            |
| `art/v2/logo_build.py`                         | Vectorisation du logo                                                                                                                                                                                                                           |
| `art/v2/grade.py`                              | Famille « nuit »                                                                                                                                                                                                                                |
| `art/v2/production.json`                       | Images                                                                                                                                                                                                                                          |
| `scripts/sync-fonts.mjs`, `fonts-fallback.css` | Anybody instanciée, Figtree, replis                                                                                                                                                                                                             |
| `app/pages/v2.vue`                             | Réécrit : `data-site='v2'`, `data-intro-font: '900 1em Anybody'`, `theme-color` #0C0C0B, préchargements (police et hero par media), favicon `/v2/favicon.svg`, `<title>` « CAP Fitness by EBC Sport : cours collectifs à [Commune] (maquette) » |
| `app/assets/css/v2.css`                        | Réécrit : `@layer reset, tokens, base, layout, components, utilities;` redéclaré, rôles identiques à la V1                                                                                                                                      |

**Réutilisé de la V1, tel quel**

- `boot.inline.js`, `env.ts`, `tokens.ts`, `gsap.ts`, `sequence.ts`, `speed.ts`, `scroll.ts`.
- `useMotion.ts`, `useSnapRail.ts`, `motion.client.ts`.
- `typography.ts`, `providers/variants.ts`, `build-images.mjs` (entrées `CROPS` à ajouter), `art/grade.py` (importé).
- Le garde-fou `canBlur()`, à extraire de `motion-blur.ts` vers `canGL()`.
- `base.css`, `layout.css`.

**Repris de la V2 actuelle**

- Logique seulement : `sessionStates`/`nextSession`, onglets APG de `ClubSchedule.vue`, `<details name>` de `ClubFaq.vue`, tiroir de `ClubHeader.vue`.
- Harnais de tests : `tests/e2e/v2/`.

**À supprimer** : les 20 composants `Club*`, Saira, `club.ts`, toutes les images v2 actuelles.

**Budgets cibles**

| Poste                           | Cible                                                        |
| ------------------------------- | ------------------------------------------------------------ |
| JS au premier chargement        | ≤ 104 Ko gzip                                                |
| GSAP, ScrollTrigger, CustomEase | 47,8 Ko, à l'approche d'une zone, jamais en mouvement réduit |
| Lenis                           | 5,4 Ko, pointeur fin seulement                               |
| OGL + Phosphore                 | 17,3 Ko, en temps libre sur appareil capable                 |
| Polices                         | ≤ 80 Ko                                                      |
| Hero mobile                     | ≤ 40 Ko                                                      |
| LCP mobile simulé               | ≤ 2,3 s                                                      |
| CLS                             | 0                                                            |

**Preuves** (`tests/e2e/v2/`)

- `accessibilite` : axe sur le menu ouvert, une fiche ouverte, le filtre, les niveaux 1 et 5, et la page après défilement complet.
- `parcours` : heure de Paris à mer. 18 h 20 → CAF « commencé », Cross training 19 h 00 « prochain » ; niveau 5 → Cardio Jump et Cross training ; les .ics répondent 200 avec un `RRULE` valide.
- `sans-js` : tout le contenu ; le sélecteur par `:has()` ; les jours empilés.
- `mouvement-reduit` : 0 requête GSAP ou OGL ; tracés complets.
- `marque` : greps des interdits, 1 ECG par viewport, aucun fond clair.
- Mesures : Lighthouse mobile (médiane de 3), `impeccable detect`, script de p95 des photos.

**Ordre de travail**

1. Logo SVG et tokens.
2. Hero, puis mesure du LCP.
3. Semaine.
4. Rythme.
5. Fin et ourlet.
6. Les autres sections.
7. Images Higgsfield (série « nuit »).
8. Phosphore en dernier, seulement si les budgets ont encore de la marge.
