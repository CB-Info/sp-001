# Direction « Pleins & Déliés » : nouvelle V2 de CAP Fitness by EBC Sport

## A. Nom de la direction et thèse

**« Pleins & Déliés ».** En calligraphie, le plein est le trait épais et le délié le trait fin. Le logo de CAP repose déjà sur cette opposition : « CAP » est en contour citron (le délié), « FITNESS » en blanc gras (le plein), et un trait d'électrocardiogramme (ECG) passe entre les deux.

1. **Ce que la page possède : la grammaire du logo.** Elle en fait un système typographique de campagne. Chaque grand titre est construit comme le logo : un mot délié citron, un mot plein blanc, une signature en italique citron calée à droite. Ces titres sont composés à l'échelle d'une affiche, sur une série de photos noir et blanc très sombres où le citron n'arrive que comme une lumière.
2. **Elle possède aussi les vraies données du club.** Les 8 créneaux du flyer deviennent la pièce maîtresse : une bande de cinq jours où chaque cours est un battement réel. Tout ce qui manque s'affiche honnêtement en contour pointillé, « à confirmer ».
3. **Elle refuse le reste.** Pas de cartes en grille, de surtitres, de dégradé sur du texte, de néon, de cœurs ni de pictos. Pas de compteur, de faux avis, de sponsor, de copie du flyer, ni de signe repris de la V1. Le citron reste sous 10 % de la surface. Le battement apparaît une fois par écran au plus, sauf dans la semaine, où il porte des données.

## B. Système visuel

### B.1 Palette

Contrastes calculés en WCAG 2.x (luminance relative sRGB).

| Token             | Hex     | Rôle                                                                            | Contrastes vérifiés                                                                                    |
| ----------------- | ------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `--cf-noir`       | #0C0C0B | Fond principal (surface `nuit`)                                                 | craie 17,30 ; citron 12,23 ; gris 7,56                                                                 |
| `--cf-carbone`    | #1C1B19 | Fond exact du logo. Surface `carbone` : Retour au calme, Réserver, Pratique     | craie 15,22 ; citron 10,76 ; gris 6,65. **Sur noir : 1,14**, donc filet ou rupture d'image obligatoire |
| `--cf-graphite`   | #2A2926 | Filets décoratifs, grille ECG, bande du jour                                    | 1,35 sur noir : décor uniquement                                                                       |
| `--cf-filet`      | #6E6C66 | Bordures des composants interactifs                                             | 3,73 sur noir ; 3,28 sur carbone (critère 1.4.11)                                                      |
| `--cf-pointille`  | #8C8A83 | Contour pointillé des données « à confirmer »                                   | 5,66 sur noir ; 4,98 sur carbone                                                                       |
| `--cf-gris`       | #A3A199 | Texte secondaire                                                                | 7,56 / 6,65 / 5,62 (noir / carbone / graphite)                                                         |
| `--cf-craie`      | #F2F1EC | Texte courant, mots pleins                                                      | 17,30 / 15,22 / 12,86                                                                                  |
| `--cf-blanc`      | #FFFFFF | Logo, tracé ECG blanc                                                           | 19,57 sur noir                                                                                         |
| `--cf-citron`     | #CCD52F | **Accent unique** : délié, CTA, focus, prochain cours, signature, tracé en tube | 12,23 sur noir ; noir sur citron 12,23                                                                 |
| `--cf-citron-vif` | #D9E34A | Survol et appui du CTA                                                          | noir dessus 14,01                                                                                      |
| `--cf-lime`       | #99C336 | Fin du dégradé « maillot » **uniquement**                                       | noir dessus 9,52                                                                                       |

Le dégradé « maillot » se déclare ainsi :

```css
--cf-maillot: linear-gradient(180deg in oklab, #0c0c0b 0 42%, #2a331a 60%, #72902f 85%, #99c336);
```

- Le texte craie est autorisé entre 0 et 60 % de la hauteur : 5,53:1 au pire, à #526820.
- Le texte noir est autorisé entre 85 et 100 % : 5,35:1 au pire, à #72902F.
- **La bande de 42 à 85 % ne porte aucun texte** : noir sur #526820 ne donne que 3,13:1.

Paires interdites :

- blanc ou craie sur citron : 1,60 ;
- citron sur lime : 1,29 ;
- citron et lime en aplats voisins (13° d'écart de teinte).

Les surfaces se déclarent par `data-surface` et redéfinissent les mêmes rôles que la V1 (`--bg`, `--ink`, `--ink-muted`, `--rule`, `--accent`, `--on-accent`, `--focus`) :

| Surface   | Contenu                                      |
| --------- | -------------------------------------------- |
| `nuit`    | noir, encre craie                            |
| `carbone` | carbone, encre craie                         |
| `photo`   | encre craie, filets `rgb(242 241 236 / .28)` |
| `maillot` | dégradé ; encre craie en haut, noire en bas  |

Le focus est un anneau citron de 2 px décalé de 2 px. Sur la zone lime, il devient noir.

### B.2 Typographie

Deux familles seulement.

| Police                           | Source et poids                                                                                                                                                                                                                                                                                 | Rôles                                                                                                                                                                                                                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Anybody** (display)            | `@fontsource-variable/anybody` 5.3.0, sous-ensemble latin `wdth`. **Instancié avec `fontTools.varLib.instancer` en `wght` 900 fixe, axe `wdth` 50–150 conservé : 32,5 Ko** (contre 56,9 Ko d'origine, mesuré). Fichier `public/fonts/anybody-cap-900.woff2`, famille `"Anybody CAP"`, préchargé | **Délié** : `font-stretch: 150%` (100 % sur mobile), `color: transparent`, `-webkit-text-stroke: max(2px, .04em) currentColor`, soit 6 % de la capitale (0,675 em), comme le contour de CAP. Uniquement à 64 px ou plus. **Plein** : `font-stretch: 62%` (50 % sur mobile). **Données** : 62 %, `tnum` |
| **Figtree** (texte et signature) | `@fontsource-variable/figtree` 5.3.0 : romain 300–900 (20,2 Ko, préchargé) et italique (20,9 Ko, sans préchargement)                                                                                                                                                                            | Texte en 400, interface en 500, boutons en 600. **Signature** : italique 500 citron, en casse normale, calée à droite sous le mot plein (l'équivalent de « BY EBC SPORT »)                                                                                                                             |

Règles complémentaires :

- Total des polices : 73,6 Ko.
- Polices de repli à métriques ajustées (`"Anybody CAP Fallback"`, `"Figtree Fallback"`), sur le modèle de `fonts-fallback.css`.
- Les deux fichiers n'ont pas le glyphe U+202F : espace insécable U+00A0 avant `: ; ! ? »`, via `typesetDeep`.
- Capitales par `text-transform` uniquement sur les mots d'affiche. **Aucune capitale espacée.**
- `@media (forced-colors: active)` : le délié repasse en `color: CanvasText; -webkit-text-stroke: 0`.

**Échelle fluide** (390 → 1440 px, bornes en rem) :

| Token           | Rôle                                        | 390             | 1440 | Valeur                                              |
| --------------- | ------------------------------------------- | --------------- | ---- | --------------------------------------------------- |
| `--t-small`     | notes, mentions                             | 14              | 15   | `clamp(.875rem, .852rem + .095vw, .9375rem)`        |
| `--t-body`      | texte courant (Figtree 400/1,55)            | 16              | 18   | `clamp(1rem, .954rem + .19vw, 1.125rem)`            |
| `--t-lead`      | chapeaux (1,4)                              | 18              | 22   | `clamp(1.125rem, 1.032rem + .381vw, 1.375rem)`      |
| `--t-signature` | italique citron (1,1)                       | 20              | 40   | `clamp(1.25rem, .786rem + 1.905vw, 2.5rem)`         |
| `--t-data`      | horaires, Anybody 62 `tnum`                 | 28              | 48   | `clamp(1.75rem, 1.286rem + 1.905vw, 3rem)`          |
| `--t-h3`        | noms de cours, sous-titres pleins           | 40              | 72   | `clamp(2.5rem, 1.757rem + 3.048vw, 4.5rem)`         |
| `--t-h2`        | titres de chapitre (≥ 96 px sur ordinateur) | 48              | 120  | `clamp(3rem, 1.329rem + 6.857vw, 7.5rem)`           |
| Mots ajustés    | affiches                                    | voir ci-dessous |      | `font-size: calc(var(--part) * 100cqi / var(--em))` |

**Mots ajustés à leur conteneur** (`container-type: inline-size`) :

- Largeurs mesurées à 900 et en capitales avec fontTools : « CHACUN » à 150 : 6,886 em. « SON RYTHME. » à 62 : 4,694 em ; à 50 : 3,826 em. « BOUGE ! » à 150 : 6,279 em. « FAIS MONTER » à 150 : 11,011 em. « LE CŒUR. » à 62 : 2,981 em. « TA » à 150 : 2,264 em. « SEMAINE. » à 62 : 3,325 em. « ENSEMBLE, » à 100 : 6,069 em. « PLUS QU'UNE SALLE, » à 100 : 10,823 em. « UNE FAMILLE. » à 62 : 4,442 em.
- Ces valeurs sont générées dans `app/data/cap-fit.ts` par `scripts/measure-fit.py`. Tout changement de texte impose de les remesurer.

**Interlignage** :

| Usage                                    | Interligne                             |
| ---------------------------------------- | -------------------------------------- |
| plein                                    | 0,86                                   |
| délié                                    | 0,9                                    |
| ligne portant une capitale accentuée (É) | 0,92, avec masques débordant de `-1em` |
| texte                                    | 1,55                                   |

**Approche** : plein −0,005 em, délié +0,01 em (le trait a besoin d'air), données 0.

**Rapport display / corps** : 185,8 / 18 = **10,3** pour le hero, 233 / 18 = 12,9 pour la semaine.

### B.3 Grille

| Écran   | Colonnes | Marge | Gouttière | Largeur de colonne                                                                                                                                                                 |
| ------- | -------- | ----- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 64em  | 12       | 60 px | 24 px     | 88 px. La colonne _n_ commence à x = 60 + (n−1) × 112 : col 3 = 284, col 5 = 508, col 7 = 732, col 9 = 956, col 10 = 1068, col 11 = 1180. La col 10 finit à 1156, la col 12 à 1380 |
| 48–64em | 8        |       |           |                                                                                                                                                                                    |
| < 48em  | 4        | 20 px | 16 px     | 75,5 px                                                                                                                                                                            |

Valeurs fluides :

- marge : `max(clamp(1.25rem, .321rem + 3.81vw, 3.75rem), (100vw - 1760px) / 2)` ; le contenu plafonne à 1 760 px, et les mots ajustés grandissent avec lui à 1 920 px ;
- gouttière : `clamp(1rem, .814rem + .762vw, 1.5rem)`.

**Paddings de section**, quatre valeurs :

| Token      | 390 → 1440 | Valeur                                   |
| ---------- | ---------- | ---------------------------------------- |
| `--pad-xl` | 96 → 160   | `clamp(6rem, 4.514rem + 6.095vw, 10rem)` |
| `--pad-l`  | 64 → 120   | `clamp(4rem, 2.7rem + 5.333vw, 7.5rem)`  |
| `--pad-s`  | 48 → 64    | `clamp(3rem, 2.629rem + 1.524vw, 4rem)`  |
| —          | 0          | photos plein cadre                       |

Rayon 0 partout. Aucun filet systématique sous les sections.

### B.4 Matières, lumière, couches

- **Ordre des couches sur une photo** :
  - 0 : photo ;
  - 1 : voile local, uniquement s'il est mesuré nécessaire ; ancré sur la bande de texte, alpha ≤ 0,55 ;
  - 2 : couche de lumière citron (hero) ;
  - 3 : mot délié (la photo se voit dans les lettres, comme sur la bannière) ;
  - 4 : tracé ECG ;
  - 5 : mot plein ;
  - 6 : interface.
- **Aucune ombre**, aucun `backdrop-filter`, aucun flou CSS, aucun verre dépoli.
- **Élévation** par le seul pas noir → carbone, plus un filet graphite de 1 px.
- **Grain et vignettage** cuits dans les photos, jamais en surcouche CSS.
- **Une seule « lumière » colorée par page**, le dégradé maillot (Fin). La lumière citron de la couverture n'est qu'une impulsion, jamais un état stable.
- **Grille de papier ECG** uniquement derrière la bande de la semaine :
  - petits carreaux de 6 min (13,7 px) en `#1A1918` ;
  - gros carreaux de 30 min (68,5 px) en graphite #2A2926 ;
  - traits de 1 px.

### B.5 Iconographie

**Aucune icône.** Cinq signes seulement, tous en `aria-hidden` :

1. le logo ;
2. le tracé ECG canonique, sous quatre formes :

   | Forme     | Dessin                                                 | Usage              |
   | --------- | ------------------------------------------------------ | ------------------ |
   | plein     | 0,08 de la capitale, pointes effilées                  | —                  |
   | tube      | 0,15 de la capitale, filet de 0,03, bouts coupés à 45° | —                  |
   | plat      | ligne seule                                            | respiration        |
   | pointillé | —                                                      | donnée à confirmer |

3. le contour pointillé « à confirmer » ;
4. la grille de papier ECG ;
5. le filet citron vertical de 2 px qui marque une question ouverte dans la FAQ.

Sinon, du texte :

- « Menu » et « Fermer » ;
- « lien à venir » ;
- « Haut de page » ;
- liens soulignés sans flèche.

Pas de coche, pas de « + », pas d'emoji, pas de picto de cours.

### B.6 Traitement photo : famille d'étalonnage « nuit »

À ajouter dans `art/v2/grade.py` ; elle importe la géométrie et le grain de `art/grade.py`. Étapes :

1. Rognage de sécurité de 3 %, puis recadrage au ratio cible centré sur le point focal déclaré.
2. Noir et blanc vrai : luminance Rec. 709 en linéaire. **Vérification : chroma maximal ≤ 1**, sinon échec.
3. Niveaux : le centile 0,5 passe à 0,015 (#040404), le centile 99,7 à 0,90 (#E6E6E6).
4. Courbe en S de force 1,18, pivot à L* 40. Au moins 15 % des pixels sous L* 8 : de vrais noirs, sans voile laiteux.
5. Vignettage de −0,4 IL aux angles, départ à 55 % de la diagonale.
6. **Zones de texte déclarées** par image, en rectangles normalisés, et assombries en fondu sur 12 % de la largeur. **Vérification** du centile 95 de luminance relative : ≤ 0,10 sous du texte courant (craie ≥ 6,2:1), ≤ 0,16 sous un mot délié citron (≥ 3,9:1, grand texte).
7. Grain gaussien monochrome σ = 0,011, à 1 px de la taille livrée.
8. XMP IPTC `trainedAlgorithmicMedia`, prompt embarqué, renvoi au job dans `art/v2/manifest.json`.

Livraison :

- AVIF/WebP/JPEG, échelle de largeurs 480–2400, empreinte dans le nom ;
- recadrages dirigés (`CROPS`) pour le mobile ;
- miniature floue de 24 px en `data:` (≈ 1 Ko) en fond de chaque `<picture>` : aucun bloc vide en capture pleine page.

**Couche de lumière du hero** : luminance ≥ 0,72 → alpha `smoothstep(.72, .92)`, couleur citron, 960 px de large, AVIF avec alpha ≤ 20 Ko. Elle sert à l'intro et de repli au WebGL.

### B.7 Logo reconstruit en SVG

Script `scripts/brand/build-logo.py`, avec fontTools et skia-pathops ; base : `capfit-scripts/logo_build.py`. Sorties versionnées dans `app/assets/brand/*.svg`, inlinées par `<CapLogo>`. Aucune police chargée au rendu.

1. **CAP** :
   - glyphes de Montserrat 900 ;
   - `removeOverlaps` **avant** le contour (A et P se chevauchent dans la police) ;
   - trait citron de 0,06 de la capitale, `miter`, puis vectorisé en contour ;
   - ratio 2,9:1 en horizontal, 3,4:1 en carré.
2. **FITNESS** :
   - Exo 2 Black sans chevauchements, condensé à 0,97, approche −0,04 em ;
   - coupes par différence booléenne : fentes effilées à 22 % et 75 % (horizontal) ; lamelles de 4 % décalées de ±12 % sur le F et le dernier S (carré) ;
   - ratio 5,2:1.
3. **Signature** : Montserrat 500 italique, citron, calée à droite.
   - Horizontal : 12 px sous FITNESS (0,18 cap), départ à 46 % de FITNESS.
   - Carré : 0,35 de la capitale de FITNESS, départ à 41 %.
4. **ECG** : un polygone plein à pointes effilées (le contour en angles vifs ferait exploser la pointe R→S), ou un tube masqué (trait blanc W, puis trait noir W − 2t). Chemin canonique, amplitude 100 :

   ```svg
   <path d="M-45 0H0L10.4-44L27 37.5L48.6-100L53.1 92L76.5-29.5L90 0H135"/>
   ```

   - Amplitude R = 1,1 × la capitale du mot porté ; largeur du complexe = 0,9 × l'amplitude.
   - Le tracé repose sur la ligne de base de ce mot.
   - Chiasme : tracé blanc plein à côté du mot délié citron, tracé citron en tube à côté du mot plein blanc.

**Déclinaisons** (`<CapLogo variant>`) :

| Variante     | Composition                                                  | Usage dans la page          | Minimum              |
| ------------ | ------------------------------------------------------------ | --------------------------- | -------------------- |
| `horizontal` | ECG blanc plein, CAP, FITNESS, ECG citron en tube, signature | pied de page, 872 px        | 400 px               |
| `reduite`    | CAP et FITNESS                                               | en-tête 184 px, menu 220 px | 180 px               |
| `carre`      | empilé, ECG blancs en tube                                   | image OG 1200×630 sur noir  | signature dès 300 px |
| `monogramme` | CAP délié                                                    | page 404                    | 64 px de haut        |
| `ecg`        | complexe plein, trait à 10 %                                 | favicon `/v2/favicon.svg`   | 32 px                |

Règles d'usage :

- `role="img"`, `aria-label="CAP Fitness by EBC Sport"`, un seul `<title>` ;
- zone de protection : la capitale de FITNESS ;
- jamais sur citron, lime ou fond clair.

## C. Le hero (« Couverture »)

Le hero est le logo carré éclaté à l'échelle de l'écran :

- un mot délié citron porte le rôle de CAP ;
- un mot plein porte celui de FITNESS ;
- une signature italique porte celui de « BY EBC SPORT » ;
- le tracé blanc entre par la gauche sur la ligne de base du mot délié.

Sa réponse, le tracé citron en tube, n'apparaîtra qu'à la fin de la page.

### C.1 Ordinateur 1440×900

| Zone                             | Position (px)                                                                        | Contenu et style                                                                                                                                                                                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bandeau maquette                 | y 0–36, plein cadre, carbone                                                         | Figtree 500 14 px gris : « Maquette non officielle : proposition de site pour CAP Fitness by EBC Sport. » Puis en citron : « Les mentions “à confirmer” attendent les infos du club. » Lien « En savoir plus » vers `#mentions`                                                                          |
| En-tête                          | y 36–108, transparent sur la photo                                                   | `CapLogo reduite` de 184 px de large (capitale 22,4 px), à x 60, centré sur y 72. Navigation Figtree 500 15 px craie : Cours, Semaine, Famille, Infos (écart 32), finissant à x 1156. Bouton « Réserve ta place » à x 1196–1380, 44 px de haut, **masqué tant que le CTA du hero est visible** (avec JS) |
| Photo `cap-couverture`           | y 36–900, plein cadre, `object-position: 66% 34%`                                    | Le sujet au premier plan occupe x 790–1150. La rangée de pratiquants recule vers la droite, avec les fenêtres en fond à droite                                                                                                                                                                           |
| Chapeau                          | x 60–484 (col. 1–4), y 172–295                                                       | Figtree 400 22/1,4 craie, 4 lignes : « Pound, Cardio Jump, Cross training, Pilates… Huit disciplines, des coachs diplômés et une salle où l'on se dépasse ensemble, dans la bonne humeur. »                                                                                                              |
| Action                           | y 327–379                                                                            | Bouton « Réserve ta place » (fond citron, texte noir Figtree 600 16, 52 px, padding 0 24, rayon 0), vers `#reserver`. À 24 px à sa droite, lien texte « Voir le planning » (souligné citron 1 px, décalé de 4 px), vers `#semaine`. **Une seule action principale**                                      |
| H1, ligne 1 « Chacun »           | x 284–1156 (col. 3–10), capitale y 566–651, ligne de base 651                        | Délié citron, wdth 150, **126,6 px** (`9.594cqi`), capitale 85,5 px, trait 5,1 px                                                                                                                                                                                                                        |
| H1, ligne 2 « son rythme. »      | x 284–1156, capitale y 660–785, ligne de base 785                                    | Plein craie, wdth 62, **185,8 px** (`14.07cqi`), capitale 125,4 px. Écart de 0,10 capitale avec la ligne 1, comme le logo horizontal                                                                                                                                                                     |
| H1, signature « Tous ensemble. » | calée à droite, se termine à x 1151 (retrait italique de 0,12 em), ligne de base 836 | Figtree italique 500, 40 px, citron, environ 273 px de large. Placée à 0,18 capitale sous la ligne 2. Dans le DOM, c'est un `<span>` du H1, qui se lit « Chacun son rythme. Tous ensemble. »                                                                                                             |
| Tracé ECG blanc plein            | ligne de base y 651, de x 0 (déborde à gauche) à x 272                               | Amplitude R 94 px (sommet y 557, creux S y 737). Complexe sur x 127–212, ligne plate de 0 à 127 et de 212 à 272. Trait de 7 px, pointes effilées. Il ne touche pas la ligne 2, qui commence à x 284                                                                                                      |
| Prochain cours                   | x 1180–1380, ligne de base 836                                                       | « Prochain cours » en Figtree 500 14 gris (y 772) ; « Mer. 19 h 00 » en Anybody 62 `tnum` 32 px craie (ligne de base 812) ; « Cross training » en Figtree 500 16 craie (ligne de base 836)                                                                                                               |

**Zones sombres exigées de l'image** :

- chapeau : (0–0,36 ; 0,12–0,45), centile 95 ≤ 0,10 ;
- H1 : (0,15–0,82 ; 0,60–0,96), centile 95 ≤ 0,16.

### C.2 Mobile 390×844

| Zone                        | Position (px)                     | Contenu                                                                                                                  |
| --------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Bandeau                     | y 0–36                            | « Maquette non officielle · en savoir plus », 14 px                                                                      |
| En-tête                     | y 36–100                          | `CapLogo reduite` de 180 px à x 20 ; bouton « Menu » de 44×44 à x 326                                                    |
| Photo                       | y 36–844                          | Recadrage dirigé 1:2 (master 1024×2048, livré en 480/640/780 px). Point focal (0,62 ; 0,30) ; le sujet est sur y 110–470 |
| Prochain cours              | x 20, y 116                       | Une ligne en 14 px : « Prochain cours · mer. 19 h 00 · Cross training »                                                  |
| H1, ligne 1 « Chacun »      | x 87–382, ligne de base 540       | Délié citron, **wdth 100, 64 px** (295 px de large), calé à droite                                                       |
| Tracé blanc                 | x 0–75, sur la même ligne de base | Amplitude R 47 px, complexe de 43 px                                                                                     |
| H1, ligne 2 « son rythme. » | x 20–370, ligne de base 628       | Plein craie, wdth 50, **91,5 px** (`26.14cqi`)                                                                           |
| Signature                   | calée à droite, ligne de base 668 | 20 px                                                                                                                    |
| Chapeau                     | y 680–752                         | Figtree 16/1,5, 3 lignes                                                                                                 |
| Bouton et lien              | y 768–820                         | Bouton de 52 px et lien « Voir le planning ». La barre « Prochain cours » collée en bas n'apparaît qu'après le hero      |

### C.3 Les deux premières secondes

Intro en keyframes CSS, déclenchée par `boot.inline.js` (`hero-intro`, puis `hero-ready`). Paramètres posés par `v2.vue` :

- `data-intro-media` sur l'image ;
- `htmlAttrs['data-intro-font'] = '900 1em "Anybody CAP"'`.

Les temps comptent depuis `hero-ready`.

| t (ms)          | Élément                        | Mouvement                                                                                                                                                                                                                                                                                                 | Durée                | Courbe                  |
| --------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------- |
| 0               | Photo                          | Voile noir local de 0,45 → 0 (« le noir s'allume ») ; l'image elle-même n'est jamais à opacité 0                                                                                                                                                                                                          | 680                  | `out`                   |
| 0               | Ligne 2                        | Peinte en délié blanc (état de départ) : l'élément est peint dès le premier rendu                                                                                                                                                                                                                         | —                    | —                       |
| 120 → 920       | Tracé blanc                    | `stroke-dashoffset` de 1 → 0 (`pathLength="1"`), à vitesse constante comme un enregistreur                                                                                                                                                                                                                | 800 (`--dur-beat`)   | `trace`                 |
| **552** (pic R) | Ligne 2 « son rythme. »        | **La frappe** : une copie pleine se découvre en montant depuis la ligne de base, `clip-path: inset(100% 0 0 0)` → `inset(0)`                                                                                                                                                                              | 230 (`--dur-strike`) | `strike`                |
| 552             | Couche de lumière (si décodée) | Opacité 0 → 0,9 en 230 ms, puis → 0 en 430 ms : une seule impulsion                                                                                                                                                                                                                                       | 660                  | `strike`, puis `in-out` |
| 680 → 1290      | Chapeau                        | 4 lignes montent de 12 px dans leur masque, décalées de 60 ms                                                                                                                                                                                                                                             | 430 chacune          | `out`                   |
| 780             | Signature                      | `translateY(100%)` → 0 dans son masque                                                                                                                                                                                                                                                                    | 430                  | `out`                   |
| 900             | Bouton et lien                 | Opacité 0 → 1, montée de 12 px. Cliquables dès t = 0 ; `:focus-visible` force l'opacité à 1                                                                                                                                                                                                               | 240                  | `out`                   |
| 920 → 1240      | Ligne 1 « Chacun »             | Découverte de gauche à droite, `inset(0 100% 0 0)` → 0 : le tracé « entre » dans le mot                                                                                                                                                                                                                   | 320                  | `out`                   |
| 1000            | Prochain cours                 | Opacité 0 → 1                                                                                                                                                                                                                                                                                             | 240                  | `out-soft`              |
| 1290            | —                              | Fin de séquence, sous la limite de 1 300 ms                                                                                                                                                                                                                                                               | —                    | —                       |
| 1300 → 2000     | —                              | Repos. Ensuite, la vitesse de défilement fait monter l'amplitude du complexe (`scaleY` de 1 → 1,35 depuis la ligne de base, retour au calme en environ 300 ms via `approach`). Sur ordinateur capable, le WebGL « lumière de pouls » (E.4) se charge pendant un temps libre après le décodage de la photo | —                    | —                       |

**Sans JS, ou en mouvement réduit** : état final immédiat.

- Pas de voile, tracé dessiné, ligne 2 pleine, ligne 1 visible, signature, chapeau et bouton en place.
- Le bouton de l'en-tête reste visible.
- Le bloc « Prochain cours » devient « Premier cours de la semaine · lun. 13 h 00 · Pound », valeur neutre du rendu statique. La valeur réelle (heure de Paris) arrive après le montage.

## D. Section par section

Ordre : 0 Bandeau et en-tête · 1 Couverture · 2 Édito · 3 Les cours (3a, 3b, 3c) · 4 La semaine (et Réserver) · 5 La famille · 6 Pratique · 7 Fin · 8 Pied de page.

Soit sept chapitres, cinq gabarits de titre distincts, et l'enchaînement de matières suivant : photo, nuit, photo, nuit, carbone, nuit, carbone, photo, nuit, carbone, maillot, nuit. Jamais trois fois la même matière d'affilée.

### 0. Bandeau maquette et en-tête

- **Rôle** : honnêteté (maquette non officielle, `noindex` déjà global) et navigation.
- **Composition** : décrite en C. L'en-tête colle en haut.
  - Au-delà de 120 px de défilement : fond noir plein, filet graphite en bas, hauteur 64 px.
  - Le logo réduit reste à x 60.
- **Menu mobile** :
  - `<dialog>` plein écran noir ;
  - liens en plein wdth 62 à 56 px ;
  - signature « ensemble, allons plus loin. » en bas à gauche ;
  - « Fermer » en texte ;
  - Échap ferme le menu et le focus revient au bouton.
- **Mouvement du menu** :
  - le rideau monte du sol, `clip-path: inset(100% 0 0 0)` → `inset(0)` en 480 ms `in-out` ;
  - les liens apparaissent décalés de 60 ms ;
  - la sortie dure 0,65 × l'entrée.
- **Sans JS** : le menu s'ouvre par `:target`, comme en V1.
- **Barre mobile** « Prochain cours · mer. 19 h 00 · Cross training », avec le bouton « Réserver » (44 px) :
  - 56 px de haut, plus la zone de sécurité ;
  - visible entre la fin du hero et l'apparition du bloc Réserver ou de la Fin ;
  - absente sans JS (c'est un doublon).

### 1. Couverture

Voir la partie C.

### 2. Édito « Bouge ! » (nuit, padding 160 / 120)

- **Rôle** : le manifeste et les valeurs du club, sans grille de quatre cartes.
- **Composition** : une affiche en triangle descendant.
  - **« Bouge ! »** : plein craie, wdth 150, ajusté à toute la largeur, **210 px** (`15.93cqi`, capitale 142 px), à x 60.
  - Dessous, trois lignes **calées à droite sur x 1380** à `--t-h2` (120 px), wdth 62, interligne 0,92. Le bord gauche s'élargit vers le bas, comme la pente montante du complexe :

    | Ligne                      | Style        | Position           |
    | -------------------------- | ------------ | ------------------ |
    | « Dépasse-toi. »           | délié citron | 549 px, x 831–1380 |
    | « Prends du plaisir. »     | plein craie  | 813 px, x 567–1380 |
    | « Atteins tes objectifs. » | délié citron | 978 px, x 402–1380 |

  - Les deux déliés ne sont jamais voisins.
  - Dans le vide en bas à gauche (col. 1–4), le paragraphe en Figtree 18/1,55 craie, 8 lignes, aligné sur la dernière ligne de base de « Atteins tes objectifs. » : « Ici, on vient pour bouger, et on revient pour les gens… ». Il fond les quatre valeurs du flyer en une phrase.
  - Sous le paragraphe, en gris 16 : « Huit créneaux sur quatre jours, dont deux à la pause de midi. »
- **Interaction** : aucune.
- **Mouvement** :
  - les deux lignes pleines (« Bouge ! », « Prends du plaisir. ») partent en délié blanc ;
  - chacune « frappe » (remplissage montant de 230 ms, `strike`) quand sa ligne de base passe à 60 % de l'écran ;
  - les titres ne se déplacent jamais.
- **Sans JS / mouvement réduit** : le chiasme final (plein, délié, plein, délié).
- **Mobile** :
  - « Bouge ! » en wdth 100, ajusté à 350 px, soit environ 83 px ;
  - les trois verbes à 48 px, alignés à gauche, en `text-wrap: balance` ;
  - le paragraphe passe sous les verbes.

### 3. Les cours (titre nuit, puis trois mouvements)

**Titre**, padding haut 120 :

- ligne 1 « Fais monter » : délié citron, wdth 150, ajusté à 1 320 px, soit **119,9 px** (`9.08cqi`) ;
- ligne 2 « le cœur. » : plein craie, wdth 62, **240 px**, calé à droite (715 px, x 665–1380) ;
- signature « puis redescends en douceur. » en 40 px, calée à droite.

**Codage d'intensité par la marque** : les cours intenses ont leur nom en plein, les cours calmes en délié. L'intensité est toujours écrite en toutes lettres : « Intensité indicative : soutenue · 4 sur 5 ». Elle est notée « à valider avec les coachs ».

**Structure de chaque cours** :

- `<h4><button aria-expanded>` ;
- panneau en `grid-template-rows: 0fr → 1fr` (430 ms `in-out`), `hidden="until-found"` ;
- contenu de la fiche :
  - accroche en Figtree 500 22 ;
  - texte en 18 ;
  - liste de définitions : Déroulé, Matériel, Pour qui, Ce que tu y gagnes, Précautions (Cardio Jump), Créneaux en Anybody `tnum` ;
  - « Durée à confirmer » en pointillé ;
  - lien « Réserver ce cours » vers `#reserver`.
- À l'ouverture, les éléments de la fiche suivent après une pause de 140 ms, décalés de 60 ms. La fermeture dure 0,65 × l'ouverture.
- Sans JS : tous les panneaux sont ouverts.

**3a. Cardio en musique (photo plein cadre, padding 0)**

- **Composition** : une scène épinglée en CSS (`position: sticky; height: 100svh`).
  - Trois photos empilées : `cap-pound`, `cap-jump`, `cap-step`.
  - La liste défile par-dessus, sur les colonnes 1–7. Le sujet de chaque photo est sur les colonnes 8–12.
  - Titre du groupe (H3) en signature italique 40 px : « cardio en musique ».
  - Chaque ligne fait 96 px : nom en plein wdth 62 à 72 px (POUND 173 px, CARDIO JUMP 342 px, STEP 119 px) ; à droite, le créneau en `--t-data` 28 px (« lun. 13 h 00 ») et l'intensité en gris 15.
  - Filets de rangée `rgb(242 241 236 / .28)`.
- **Interaction** : la ligne qui passe au centre de l'écran devient active et sa photo apparaît en fondu (480 ms `in-out`). Le moteur est un `view-timeline` CSS là où il est disponible, sinon un IntersectionObserver.
- **Sans JS / mouvement réduit** : seule `cap-pound` est épinglée ; chaque fiche ouverte montre sa photo en 4:5. Le fondu est remplacé par un changement instantané.
- **Mobile** : pas d'épinglage. Chaque cours a sa photo 4:5 pleine largeur, suivie de la ligne et de la fiche.

**3b. Force et intensité (nuit, padding 120)**

- **Composition** : en deux parts asymétriques.
  - Photo `cap-force` 3:4 qui déborde à gauche (x 0–620, 827 px de haut).
  - À droite, colonnes 7–12, décalées de 120 px vers le bas :
    - H3 en signature « force et intensité » ;
    - Cross training (5/5) avec ses trois créneaux : mer. 12 h 15, mer. 19 h 00, ven. 19 h 00 ;
    - CAF (3/5), développé « cuisses, abdos, fessiers » ;
    - l'encadré « L'enchaînement du mercredi » : deux lignes en `--t-data` 48 px, « 18 h 00 CAF » et « 19 h 00 Cross training », reliées par un filet vertical citron de 2 px et 64 px de haut. Sans flèche.
- **Mouvement** : l'image se pose de 1,04 → 1 en 680 ms quand elle franchit le seuil d'entrée (`ENTRY`). C'est la seule entrée de la section.
- **Sans JS / mouvement réduit** : statique.
- **Mobile** : photo 4:5 pleine largeur, puis le texte.

**3c. Retour au calme (carbone, filet graphite en haut, padding 160)**

- **Composition** : la seule zone aérée de la page.
  - Les trois noms en délié craie (et non citron, pour limiter la dominance du citron) à 80 px, wdth 150, alignés sur la colonne 2 (x 172) avec 64 px d'écart : PILATES 538 px, YOGA 368 px, STRETCHING 831 px.
  - Sous chaque nom, sa phrase du flyer en gris 18. Pour Stretching : « Gagne en souplesse, récupère mieux. »
  - Dans chaque fiche, « Créneaux à confirmer » en pointillé.
  - Photo `cap-calme` 4:5 sur les colonnes 9–12 (424×530), en haut.
  - Une **ligne plate** craie de 1 px traverse la section sur la ligne de base du dernier nom : c'est l'occurrence ECG de l'écran, la respiration.
- **Mouvement** : la ligne plate se trace de gauche à droite en 1 200 ms (`--dur-calm`, linéaire).
- **Sans JS / mouvement réduit** : la ligne est tracée.
- **Mobile** : délié en wdth 75 à 64 px (STRETCHING 330 px), photo pleine largeur.

### 4. La semaine (nuit, padding 120) : pièce maîtresse

**Titre**, gabarit « horizontal », comme CAPFITNESS sur une ligne :

- « Ta » en délié citron (wdth 150) et « semaine. » en plein craie (wdth 62), à la **même taille, 233 px** (`17.68cqi`) ;
- écart de 0,10 capitale ;
- signature calée à droite : « huit créneaux sur quatre jours, dont deux à la pause de midi. »

**La bande (ordinateur)** : cinq pistes, du lundi au vendredi, comme un tracé à plusieurs dérivations.

- **Axe** :
  - libellés sur les colonnes 1–2 (x 60–260) ;
  - bande sur les colonnes 3–12 (x 284–1380), en deux fenêtres honnêtes : midi de 11 h 30 à 14 h 00 (x 284–760) et soir de 17 h 00 à 20 h 00 (x 808–1380) ;
  - une coupure de 48 px est annoncée par le texte « 14 h – 17 h » en gris 14 ;
  - échelle de 190,5 px par heure ;
  - heures en haut en Figtree 14 `tnum`.
- **Pistes** :
  - 128 px de haut, ligne de base à +72 ;
  - tracé craie de 2 px ;
  - à chaque cours, un **complexe canonique dont le pic R tombe exactement sur l'heure de début** (amplitude 48 px, sommet à +24, creux S à +116).
- **Positions des pics R** :

  | Créneau                    | x (px) |
  | -------------------------- | ------ |
  | mer. 12 h 15               | 427    |
  | lun. 13 h 00               | 570    |
  | mar. 17 h 15               | 856    |
  | mer. 18 h 00               | 999    |
  | lun. 18 h 15               | 1046   |
  | lun., mer. et ven. 19 h 00 | 1189   |

- **Étiquettes** à x_R + 31 :
  - l'heure en Anybody `tnum` 20 px (« 18 h 15 » : 45 px) ;
  - dessous, le nom en Figtree 600 14, sur deux lignes au plus ;
  - l'écart de 143 px entre 18 h 15 et 19 h 00 suffit.
- **Jeudi** : ligne plate, avec « Pas de cours collectif au planning ce jour-là. »
- **Sixième piste « Bien-être »** : ligne pointillée (#8C8A83) et le texte « Pilates, Yoga, Stretching : créneaux à confirmer ». Le contour attend d'être rempli.
- **Note** en gris 14 : « Samedi et dimanche : pas de cours collectif au planning. Planning de la saison, en place depuis la rentrée, d'après le flyer du club ; susceptible d'évoluer pendant les vacances : à confirmer. »

**États temps réel**, à l'heure de `Europe/Paris`, mis à jour chaque minute par `useClubClock` :

- la piste du jour a un fond carbone et un libellé craie ; les autres libellés sont gris ;
- **le tracé du jour est écrit en craie jusqu'à maintenant et en gris après** ;
- une ligne verticale citron de 1 px marque l'heure, avec l'étiquette « maintenant 18 h 20 » ;
- le prochain cours a son complexe et son étiquette en citron, plus le mot « Prochain cours » ;
- un cours commencé depuis plus de 15 min affiche « Commencé à 18 h 00 » ;
- **pas d'état « en ce moment »** : les durées sont inconnues.

**Interaction** :

- **Filtre** : groupe de radios natives (« Tout », « Cardio en musique », « Force et intensité », « Pause de midi »), libellés soulignés en citron (2 px) quand ils sont cochés.
  - Les cours hors filtre **s'aplatissent** : `scaleY` de 1 → 0,06 sur leur complexe, en 240 ms `out-soft`. Ils passent en gris, avec `inert` et `aria-hidden`.
  - Une zone `aria-live="polite"` annonce « 3 créneaux affichés », après action seulement.
- **Survol ou focus d'un créneau** : le complexe se retrace (0 → 1 en 430 ms).
- **Créneau** :
  - chaque étiquette est un lien vers `#reserver` ;
  - texte visible « 18 h 15 Cardio Jump » ;
  - suffixe masqué « , réserver (lundi) ».
- **Idées de semaine**, sous la bande :
  - 4 lignes de texte en deux colonnes, sans cartes, avec la mention « Idées, pas un programme du club » ;
  - exemple : « Tu veux du solide : mer. 18 h 00 CAF, 19 h 00 Cross training, ven. 19 h 00 Cross training. »
- **Structure accessible** :
  - `<ol>` de jours, chaque jour avec son `<h3>` et un `<ol>` de créneaux portant des `<time>` ;
  - les SVG sont en `aria-hidden` ;
  - les étiquettes sont du texte réel, placé par `left: calc(...)`.

**Mouvement** :

- au seuil d'entrée, les pistes se tracent de gauche à droite, 800 ms chacune, décalées de 92 ms (1 168 ms au total) ;
- puis la ligne « maintenant » apparaît (140 ms).

**Sans JS / mouvement réduit** : tout est tracé, sans état temporel ni ligne « maintenant ». Le filtre est masqué en `html:not(.js)`.

**Mobile** :

- onglets APG Lun–Ven (logique de `ClubSchedule`, en Anybody 20 px) ; le jour courant est sélectionné au montage ;
- axe vertical à 96 px par heure (midi 240 px, coupure 32, soir 288) ;
- tracé vertical au bord gauche (x 20–84), pics vers la droite comme l'ECG sur la jambe du short ;
- étiquettes à partir de x 100 ;
- sans JS : les 5 jours empilés, à 40 px par heure.

**Réserver** (`#reserver`, bande carbone pleine largeur, padding 64, filets graphite en haut et en bas) :

- **Composition** :
  - H3 « Ta place t'attend. » en plein wdth 62, 72 px, sur les colonnes 1–5 ;
  - colonnes 7–9, « Dans l'appli CAP Fitness » : « Ouvre l'appli, choisis ton cours, viens comme tu es. » ;
  - colonnes 10–12, « À l'accueil » : « Tu préfères en parler ? Passe à l'accueil, on s'en occupe avec toi. », avec « Adresse à confirmer » en pointillé ;
  - les deux colonnes sont séparées par un filet #6E6C66 vertical.
- **Liens des stores** : `<span>` en contour pointillé (#8C8A83) « App Store · lien à venir », « Google Play · lien à venir ». Ce ne sont pas des liens, et ils ne prennent pas le focus.
- **Mouvement** : les deux colonnes montent de 12 px et apparaissent en fondu, décalées de 60 ms. C'est une des 4 entrées de ce type de la page.

### 5. La famille (photo, puis nuit ; padding 0 / 120)

- **Rôle** : « Plus qu'une salle, une famille. »
- **Composition** : le titre chevauche la rupture entre la photo et le noir.
  - `cap-famille` en plein cadre, 90svh (560 px minimum).
  - **Le bas de la photo coïncide avec la ligne de base de la ligne 1** :
    - ligne 1 « Plus qu'une salle, » : délié citron, wdth 100, ajusté à 1 320 px, soit 122 px, posée sur la photo (la photo se voit dans les lettres) ;
    - ligne 2 « une famille. » : plein craie, wdth 62, 200 px (888 px), calée à droite sur le noir, juste sous la rupture.
  - Dessous :
    - colonnes 2–6 : chapeau Figtree 22 « On se dépasse ensemble, dans la bonne humeur. Ceux qui reprennent, ceux qui s'y mettent, ceux qui ne ratent pas un mercredi soir : tout le monde a sa place. » ;
    - colonnes 8–12, décalées de 96 px vers le bas : « Tes coachs. » en plein 72 px, « Diplômés, pour t'accompagner et te motiver. », puis **un seul** cadre pointillé 16:9 : « Portraits, prénoms et diplômes de l'équipe : à fournir par le club » ;
    - colonnes 1–5 : cadre pointillé d'une ligne « Avis Google à intégrer ».
  - Ni cartes de coach, ni faux avis.
- **Mouvement** :
  - le voile de la photo passe de 0,5 → 0, lié au défilement (`top 100%` → `top 50%`), en opacité seulement ;
  - « une famille. » frappe (remplissage montant de 230 ms) quand sa ligne de base passe à 70 % de l'écran ;
  - le chapeau entre en fondu montant de 12 px (une des 4 occurrences).
- **Sans JS / mouvement réduit** : état final.
- **Mobile** : photo 4:5, ligne 1 sur le bas de la photo en wdth 100 ajustée (environ 32 px : sous le seuil de 64 px du délié, donc **plein citron sur mobile**), ligne 2 ajustée à 79 px, puis les blocs empilés.

### 6. Pratique « Avant ton premier cours » (carbone, filet en haut, padding 120)

- **Rôle** : rassurer, et lister ce qui manque. Le message au gérant : « il ne manque que vos infos ».
- **Composition** : guide en trois colonnes inégales.
  - **A** (colonnes 1–4, collante à `top: 120px`) : H2 **en casse normale**, plein wdth 62, 104 px, sur 4 lignes : « Avant ton / premier / cours. ». C'est le seul titre en minuscules de la page, donc un gabarit propre.
  - **B** (colonnes 5–9) : FAQ en `<details name="faq">`, 8 questions.
    - Résumés en Figtree 600 20 ; réponses en 18.
    - Les réponses inconnues sont en pointillé « à confirmer » (abonnement, essai, certificat).
    - Une question ouverte reçoit un filet citron vertical de 2 px à gauche et un résumé citron.
    - Aucun « + ».
  - **C** (colonnes 10–12) : la fiche pratique en `<dl>` :
    - Adresse ([Commune], à confirmer) ;
    - Accueil : 7 lignes « lun. — h — », à confirmer ;
    - Téléphone, e-mail, réseaux : à confirmer ;
    - Formules : « Cours collectifs — € », « Salle et cours — € (si plateau) », « Séance à l'unité — € », chacune notée « Tarif à confirmer » ;
    - lien « Demande les tarifs à l'accueil » vers `#reserver` ;
    - cadre pointillé 3:2 « Plan d'accès à venir ».
- **Mouvement** : aucune entrée. Ouverture de la FAQ par `::details-content` + `interpolate-size` (430 ms `in-out`) quand le navigateur le permet, sinon ouverture instantanée.
- **Mobile** : titre, puis la fiche pratique en premier (information de conversion), puis la FAQ.

### 7. Fin « Ensemble, allons plus loin » (maillot)

- **Composition** : section de `max(100svh, 52rem)`, fond `--cf-maillot`.
  - **« Ensemble, »** : plein craie, wdth 100, ajusté aux colonnes 1–10 (1 096 px), **180,6 px**, capitale y 128–250.
  - **Tracé citron en tube** sur sa ligne de base, de x 1168 à 1440 (déborde à droite) :
    - amplitude 134 px (sommet y 116, creux S y 373, donc dans la zone noire, sous 378) ;
    - complexe sur x 1220–1341 ;
    - tube de 18 px de large, filet de 3,7 px, bouts coupés à 45° ;
    - c'est la réponse à la trace blanche de la couverture : repos à gauche, signal à droite.
  - **Signature** « allons plus loin. » en 40 px, calée à droite à x 1156, ligne de base 300.
  - **De 378 à 765 px : rien.** Seule la lumière qui monte du sol.
  - **Dans la bande lime (85 à 100 %)**, une seule rangée à y 800–856 :
    - bouton « Réserve ta place » **fond noir, texte citron** (12,23:1 ; noir sur lime 9,52:1 pour la bordure implicite) ;
    - à droite, en Figtree 500 22 noir : « On t'attend mercredi à 19 h 00 ? » (dynamique) ; sans JS : « On t'attend au prochain cours ? ».
- **Mouvement** :
  - la couche du dégradé (pseudo-élément) monte de `translateY(30%)` → 0, liée au défilement de `top 80%` à `bottom 100%`. Uniquement par le compositeur, sans repeindre le dégradé ;
  - en bas de page : **le dernier battement**. Le tube s'aplatit (`scaleY` → 0,06 en 430 ms), puis bat une fois (retour à 1 en 230 ms, `strike`). Une seule fois, jamais en boucle.
- **Sans JS / mouvement réduit** : dégradé en place, tube dessiné.
- **Mobile** :
  - « Ensemble, » en wdth 62 ajusté, environ 97 px ;
  - la signature est alignée à gauche, et le tube part de son dernier mot jusqu'au bord droit, sur sa ligne de base ;
  - le bouton et la ligne s'empilent dans le bas lime.

### 8. Pied de page (nuit : le short sous le maillot ; padding 96 / 40)

- **Composition** :
  - `CapLogo horizontal` de 872 px (colonnes 1–8, capitale 77,9 px) ;
  - colonnes 10–12 : liens Figtree 500 18 (Cours, Semaine, Famille, Infos, « Voir la version 1 ») ;
  - rangée basse, sous un filet graphite, `#mentions`, en gris 14 : « Maquette non officielle, réalisée par [auteur] pour proposition, non validée par le club. Planning et slogans repris des supports du club ; les autres informations sont à confirmer. Visuels d'illustration générés par IA. Mentions légales à compléter. » ;
  - « Haut de page » : course de 1 200 ms en `in-out`, puis le focus passe au contenu.
- **Mouvement** : aucun.

## E. Grammaire de mouvement

### E.1 Geste fondateur : « la frappe »

**Énoncé** : un complexe se trace, et à son pic R le mot plein se remplit en montant depuis sa ligne de base. C'est le battement qui « imprime » le plein ; le délié reste au trait.

| Usage                       | Ce qui se passe                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| Entrée                      | Une frappe par titre de chapitre : couverture, édito, famille, fin                             |
| Survol (CTA, lien d'action) | Un complexe de 1,5 × la capitale se trace sous le libellé en 430 ms ; il se rétracte en 280 ms |
| Appui                       | `translateY(2px)` en 90 ms, et le fond passe au citron vif                                     |
| Écho de fin                 | Le dernier battement de la Fin                                                                 |

### E.2 Tokens

Sous `:root[data-site='v2']`. Les noms sont ceux que lit le JavaScript. Les durées découlent d'un battement à 75 bpm (800 ms) ; les distances des ordonnées du complexe × 40 px.

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-soft: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in: cubic-bezier(0.7, 0, 0.84, 0);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-strike: cubic-bezier(0.87, 0, 0.13, 1); /* remplace .34,1.56,… : aucun rebond */
--ease-trace: cubic-bezier(0, 0, 1, 1); /* linéaire, mais au format lu par bezier() */
--dur-press: 90ms; /* onde P, 0,115 battement */
--dur-feedback: 140ms;
--dur-state: 240ms; /* Q, 0,30 */
--dur-strike: 230ms; /* QRS, Q→S */
--dur-layout: 430ms; /* R, 0,54 */
--dur-overlay: 480ms;
--dur-focal: 680ms; /* T, 0,85 */
--dur-beat: 800ms;
--dur-calm: 1200ms;
--dur-travel: 1200ms;
--seq-max: 1300ms;
--stagger-tight: 40ms;
--stagger-list: 60ms;
--stagger-lines: 92ms;
--move-xs: 5px;
--move-s: 12px; /* T */
--move-l: 17px; /* P */
--move-xl: 40px; /* R */
```

Règles de durée :

- une sortie dure 0,65 × l'entrée ;
- retour au calme lié à la vitesse : `approach`, environ 300 ms (`speed.ts`, `FULL_SPEED` 37, `REST` 0,02).

### E.3 Chorégraphies clés

1. L'intro de la couverture (C.3).
2. La frappe des titres (édito, famille).
3. Le tracé des pistes de la semaine.
4. L'aplatissement au filtre.
5. Le fondu des photos épinglées du Cardio.
6. L'accordéon des cours.
7. Le rideau du menu qui monte du sol.
8. La lumière du maillot liée au défilement.
9. Le dernier battement.

Discipline :

- une entrée par section, tirée de sa matière ;
- titres H2 immobiles, ils ne font que changer d'état ;
- fondu + translation limité à **4 occurrences** : chapeau du hero, action du hero, Réserver, chapeau de la Famille ;
- éléments déjà visibles à l'arrivée de GSAP laissés en état final (`reached`) ;
- `clearProps` en fin d'animation ;
- ticker endormi au repos ;
- Lenis (`lerp` 0,12) seulement avec un pointeur fin.

### E.4 Effets ambitieux (« overdrive »)

**O1. Lumière de pouls** (WebGL, OGL, couverture, ordinateur capable) :

- **Principe** : la photo noir et blanc est rééclairée en citron **uniquement dans ses hautes lumières** (contre-jour des fenêtres, épaules, cheveux), autour du pointeur ou de la tête de tracé.
- **Pilotes** : la vitesse de défilement, la vitesse du pointeur (plein effet à 60 px par image) et le pic R des frappes.
- **Au repos** : canvas masqué, noir et blanc pur.
- **Shader** (environ 25 opérations ALU) :

  ```glsl
  float y = dot(texture2D(uTex, vUv).rgb, vec3(.2126,.7152,.0722));
  float h = smoothstep(uThreshold, .95, y);          // uThreshold : .78 au repos, .66 à pleine intensité
  float f = 1. - smoothstep(0., uRadius, distance(vUv * uAspect, uCenter)); // uRadius .35
  gl_FragColor = vec4(mix(vec3(y), uTint * y * 1.08, h * f * uIntensity), 1.);
  ```

- **Budget et garde-fous** :
  - OGL 13,8 Ko plus le module 2,4 Ko gzip, **chargés à la demande** pendant un temps libre après le décodage de la photo ;
  - test d'aptitude `canBlur()` repris de `motion-blur.ts` (pointeur fin, au moins 4 cœurs et 4 Go, pas d'économie de données ; refus de SwiftShader et llvmpipe) ;
  - WebGL2 en basse consommation, `failIfMajorPerformanceCaveat`, DPR plafonné à 1,5 ;
  - une texture de 1 600 px réutilisée depuis l'`<img>` (même origine) ;
  - objectif de moins de 2 ms par image sur GPU intégré ;
  - rendu seulement si l'intensité dépasse 0,02 ;
  - pause hors écran et dans un onglet masqué.
- **Repli** (mobile, perte de contexte, appareil refusé) : la couche de lumière précalculée (≤ 20 Ko), dont l'opacité suit l'intensité du défilement. Sans pointeur.

**O2. La semaine s'écrit jusqu'à maintenant** (SVG) :

- le tracé du jour est découpé à l'heure de Paris : la partie passée en craie, la partie future en gris ;
- la tête est la ligne citron « maintenant » ;
- mise à jour toutes les 60 s, sans boucle d'animation ;
- l'aplatissement des complexes au filtre passe par `transform` seul.

**O3. Amplitude liée à la vitesse** (SVG) : le complexe de la couverture et le tube de la fin montent jusqu'à `scaleY(1,35)` selon la vitesse de défilement, retour en environ 300 ms.

### E.5 Interdits

- Rebond et élastique.
- Fondu montant par défaut (4 occurrences au plus).
- Parallaxe.
- Bandeau défilant.
- Boucle autonome : aucune animation ne tourne seule plus de 5 s ; il n'y en a aucune.
- Bouton qui pulse.
- Variation de luminance calée sur un battement répété : 3 flashs par seconde au plus (WCAG 2.3.1) ; une impulsion seulement, sur interaction.
- Lueur, néon ou flou sur un tracé.
- Animation lettre par lettre.
- Compteur.
- Défilement détourné.
- Pré-chargeur bloquant.
- Épinglage par GSAP de plus d'un écran.
- Animation d'une propriété qui repeint de grandes surfaces (dégradés, filtres).

## F. Plan d'images

### Série « nuit »

Toutes les images sont cohérentes entre elles :

- **la même salle** : grandes fenêtres en fond, sol caoutchouc noir, murs sombres ;
- **la même lumière** : contre-jour de fenêtre plus une seule lumière dure ;
- objectifs 35 ou 50 mm ;
- même étalonnage (B.6) ;
- casting fictif fixé par les éléments de référence Higgsfield : le sujet du hero revient dans `cap-famille` ;
- âges de 20 à 65 ans et morphologies variées ;
- tenues unies noires, anthracite ou grises, de coupes différentes, sans rayure ni logo ;
- baskets sans marque, gourdes en inox nues ;
- prompt commun : « no text, no logo, no brand mark, no signage, no sponsor » ;
- **aucun citron dans les images** : la couleur vient du code.

| Id               | Format master → livré                                           | Cadrage                                                                                                  | Sujet                                                                                                                                                                                                 | Éclairage                                                                                     | Étalonnage et zones                                                                                           |
| ---------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `cap-couverture` | 3:2, 3072×2048 → 960–2400 ; recadrage 1:2 (1024×2048) → 480–960 | Plan large en légère contre-plongée ; point focal (0,66 ; 0,34) ; profondeur en diagonale vers la droite | Cours CAF ou cross en fentes : une femme d'environ 40 ans au premier plan, net, à droite ; trois personnes (environ 25, 35 et 60 ans) qui reculent et se floutent ; flou de bougé sur le bras arrière | Fenêtres en fond à droite (contour sur les épaules et les cheveux), sol sombre avec un reflet | Zones sombres (0–0,36 ; 0,12–0,45) ≤ 0,10 et (0,15–0,82 ; 0,60–0,96) ≤ 0,16. Couche de lumière citron dérivée |
| `cap-pound`      | 16:9, 3072×1728 → 1280–2400 ; 4:5 mobile                        | Plan moyen au ras du sol                                                                                 | Deux femmes (environ 30 et 50 ans), baguettes en bois nues levées en pleine frappe ; flou sur les baguettes                                                                                           | Lumière dure latérale par la droite, fond noir                                                | 55 % gauche ≤ 0,10                                                                                            |
| `cap-jump`       | 16:9 et 4:5                                                     | Trois quarts au ras du sol                                                                               | Rangée de 3 mini-trampolines noirs, pieds en l'air, une personne nette                                                                                                                                | Contre-jour des fenêtres                                                                      | 55 % gauche ≤ 0,10                                                                                            |
| `cap-step`       | 16:9 et 4:5                                                     | Serré sur les jambes                                                                                     | Pieds en plein pas sur une plateforme de step noire nue                                                                                                                                               | Douche de lumière zénithale dure                                                              | 55 % gauche ≤ 0,10                                                                                            |
| `cap-force`      | 3:4, 2048×2731 → 620–1240                                       | Très serré, décentré                                                                                     | Mains couvertes de magnésie qui se referment sur l'anse d'une kettlebell en fonte noire, avant-bras, poussière en suspension                                                                          | Contour dur par le haut à gauche, fond noir pur                                               | Noirs ≤ 2 % sur 40 % de l'image                                                                               |
| `cap-calme`      | 4:5, 2048×2560 → 424–848                                        | Plan large, sujet petit et décentré à gauche                                                             | Homme d'environ 60 ans en flexion avant assise sur un tapis sombre                                                                                                                                    | Une source douce au zénith ; 70 % d'espace noir                                               | —                                                                                                             |
| `cap-famille`    | 16:9 et 4:5                                                     | À hauteur d'œil, légèrement en plongée, sur le vif                                                       | Après le cours : 6 personnes de 20 à 65 ans, assises au sol ou sur un banc, qui rient, serviettes, une debout qui s'étire                                                                             | Contre-jour des fenêtres (même salle que le hero)                                             | 30 % bas ≤ 0,16 (la ligne délié se pose sur le bord)                                                          |

Budgets :

- hero ordinateur ≤ 140 Ko en AVIF à 1 600 px ;
- hero mobile ≤ 55 Ko à 780 px ;
- autres images en chargement paresseux, ≤ 180 Ko chacune à 2 400 px ;
- total de la page défilée ≤ 1,2 Mo sur ordinateur.

**En graphisme ou en code plutôt qu'en photo** :

- logo et déclinaisons ;
- tous les tracés ECG ;
- la bande de la semaine et sa grille ;
- les cadres pointillés : équipe, avis Google, plan d'accès, liens des stores ;
- l'image OG (logo carré sur noir, rendue en PNG au build) ;
- le favicon ;
- la page 404 (monogramme CAP délié et une ligne plate).

## G. Moments « waouh » (3)

1. **La couverture bat.**
   - **Ce qui se passe** : le tracé blanc entre depuis le bord de l'écran sur la ligne de base de « Chacun ». À son pic, « son rythme. » s'imprime en plein, en montant du sol, et les hautes lumières de la photo s'allument une fois en citron. Ensuite, la souris et le défilement rallument la salle.
   - **Pourquoi c'est sobre** : un seul battement, 1,29 s, deux encres, aucune boucle, état final sans JS identique.
2. **La semaine s'écrit.** Les vrais créneaux du club deviennent cinq pistes d'enregistreur.
   - **Ce qui se passe** : la piste du jour est écrite jusqu'à l'heure de Paris, le prochain cours est en citron, et filtrer aplatit les battements hors sujet.
   - **Pourquoi c'est sobre** : traits de 1 à 2 px, grille graphite à peine visible, aucun vert d'hôpital, une mise à jour par minute, chaque pic correspond à une donnée réelle.
3. **Le maillot.**
   - **Ce qui se passe** : en arrivant à la fin, le noir s'allume par le bas comme l'ourlet du t-shirt. Le tube citron sort à droite, répondant à la trace blanche du début, et bat une dernière fois. Puis le pied de page noir fait le short.
   - **Pourquoi c'est sobre** : un seul dégradé par page, 387 px de lumière sans texte, aucun texte sur les tons moyens, un seul battement.

## H. Risques et parades

| Risque                                                        | Parade mesurable                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LCP mobile > 2,5 s (la V1 est à 3,0 s avec une photo en hero) | Hero mobile ≤ 55 Ko AVIF préchargé par media query avec `fetchpriority="high"`. Polices préchargées : 52,7 Ko (Anybody instancié 32,5 + Figtree 20,2). CSS critique inline, JS différé. **Plan B** si le labo dépasse 2,5 s : sur mobile, le H1 sur noir passe en LCP et la photo descend sous lui (la V2 actuelle est à 1,0 s ainsi)                                                                          |
| JS > 110 Ko                                                   | Cible ≤ 100 Ko gzip au premier chargement. Suppression des gadgets de l'ancienne V2 (flocage, écharpe, carte retournée, chiffres, billet, formulaire). GSAP (47,8 Ko) à l'approche ; OGL + module (16,2 Ko) pendant un temps libre et seulement sur appareil capable                                                                                                                                           |
| CLS dû aux mots ajustés                                       | Taille de police indépendante de la police chargée (`cqi` / em mesuré) ; interligne fixe ; `overflow: clip` sur chaque ligne ; polices de repli métriques. Cible 0                                                                                                                                                                                                                                             |
| Délié illisible ou invisible                                  | Uniquement à 64 px ou plus ; trait ≥ 2 px ; zones photo mesurées (centile 95 ≤ 0,16) ; règles pour les contrastes forcés ; le texte accessible est le texte réel                                                                                                                                                                                                                                               |
| Zoom à 200 et 400 %                                           | Planchers en rem sur les mots ajustés (`max(14.07cqi, 3.5rem)`) ; `nowrap` levé sous 30em ; corps en rem                                                                                                                                                                                                                                                                                                       |
| Données temporelles                                           | Rendu serveur neutre (« Premier cours de la semaine »), puis heure de `Europe/Paris` après le montage ; aucun état « en ce moment » sans durée connue ; test e2e calé au mercredi 4 novembre 2026, 18 h 20                                                                                                                                                                                                     |
| Flash et photosensibilité                                     | Une impulsion lumineuse par interaction, au plus une toutes les 800 ms (1,25 Hz < 3 Hz) ; aucune boucle                                                                                                                                                                                                                                                                                                        |
| Clavier et lecteur d'écran                                    | Onglets et accordéons selon les patterns APG ; `<dialog>` ; `inert` et `aria-hidden` pour les éléments filtrés ; annonce `aria-live` seulement après action ; libellé visible contenu dans le nom accessible (2.5.3) ; cibles de 44 px ; focus jamais caché par l'en-tête (`scroll-margin-top: 88px`)                                                                                                          |
| Kitsch de l'ECG                                               | Un seul tracé canonique ; une occurrence par écran (exception : la semaine, qui porte des données) ; pas de cœur, de bip, de lueur ni de boucle ; tracé toujours posé sur une ligne de base de texte                                                                                                                                                                                                           |
| Kitsch du vert                                                | Le citron sous 10 % de la surface et un seul élément citron dominant par écran ; le lime uniquement en bas du maillot ; le vert du flyer (#78A014) jamais employé ; aucun aplat citron de section                                                                                                                                                                                                              |
| Effet « template »                                            | 5 gabarits de titre distincts ; 4 paddings ; aucune grille de 3 cartes ou plus ; 0 surtitre ; 0 capitale espacée ; un seul bouton principal par écran                                                                                                                                                                                                                                                          |
| Honnêteté et droit                                            | Bandeau maquette et `noindex` ; pointillé « à confirmer » pour toute donnée manquante ; « Pound » sans ® ; jamais « CrossFit » ; « sport santé » sans label ; « coachs diplômés » sans « d'État » ; intensité marquée « indicative » ; mention des visuels IA ; recherche à 0 occurrence de « ALVAR », « 412 », « Lyon », « Canaris », « Drake », maillot, flocage, effectif, tribune, écharpe, match, terrain |
| Désalignement des couches de la couverture                    | Le tracé et le H1 sont positionnés dans le même conteneur de requête ; la photo est indépendante (aucune découpe à aligner)                                                                                                                                                                                                                                                                                    |

## I. Faisabilité dans la pile

### I.1 À créer

Les composants sont dans `app/components/cap/` ; Nuxt les préfixe en `<Cap…>`.

| Fichier                                | Rôle                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `MockBanner.vue`                       | Bandeau maquette                                                                            |
| `Header.vue`                           | En-tête collant, menu `<dialog>`, CTA masqué pendant le hero                                |
| `Logo.vue`                             | 5 variantes, SVG inline                                                                     |
| `Trace.vue`                            | Tracé canonique : plein, tube, plat, pointillé ; amplitude, `pathLength`, `draw`, `beats[]` |
| `Lockup.vue`                           | Titres délié / plein / signature ; balise h1, h2 ou h3 ; largeurs lues dans `cap-fit.ts`    |
| `Cover.vue`                            | Hero                                                                                        |
| `Edito.vue`                            | Édito                                                                                       |
| `Courses.vue`, `CourseItem.vue`        | Cours : accordéon et scène épinglée                                                         |
| `Week.vue`, `WeekLead.vue`, `Book.vue` | Semaine, une piste, bloc Réserver                                                           |
| `Family.vue`                           | La famille                                                                                  |
| `Guide.vue`                            | FAQ, fiche pratique, formules                                                               |
| `Finale.vue`                           | Fin                                                                                         |
| `Footer.vue`                           | Pied de page                                                                                |
| `Pending.vue`                          | Donnée « à confirmer »                                                                      |
| `NextBar.vue`                          | Barre mobile du prochain cours                                                              |

Autres fichiers :

- `app/motion/pulse-light.ts` : OGL. Il reprend de `motion-blur.ts` le test `canBlur`, le refus des rendus logiciels, le plafond de DPR et la gestion de la perte de contexte.
- `app/utils/club-time.ts` : ajouter `parisNow()` via `Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris' })`. Retirer l'état `live` faute de durées.
- `app/data/cap.ts`, `app/types/cap.ts` : chaque donnée porte un statut `flyer | a-confirmer | exemple`. `app/data/cap-fit.ts` est généré.
- `app/assets/css/v2.css` réécrit :
  - `@layer reset, tokens, base, layout, components, utilities;` en tête ;
  - tokens sous `:root[data-site='v2']` ;
  - surfaces `nuit`, `carbone`, `photo`, `maillot`.
- `app/pages/v2.vue` :
  - `data-site` et `data-intro-font` ;
  - `theme-color` #0C0C0B ;
  - préchargement des 2 polices et de l'image du hero par media query ;
  - titre « CAP Fitness by EBC Sport : cours collectifs à [Commune] (maquette) ».
- Scripts : `scripts/brand/build-logo.py`, `scripts/fonts/instance-anybody.py`, `scripts/measure-fit.py`.
- Art : `art/v2/production.json` et `prompts/` (nouvelle série), famille `nuit` et couche de lumière dans `art/v2/grade.py`, entrées `CROPS` et miniatures dans `scripts/build-images.mjs`.
- Tests : `tests/e2e/v2/` réécrit :
  - axe sur 4 états (repos, menu, filtre, FAQ ouverte) ;
  - clavier (onglets, accordéons, dialog) ;
  - sans JS ;
  - mouvement et mouvement réduit ;
  - parcours : prochain cours à Paris, découpe du tracé du jour, filtre qui aplatit ;
  - recherches d'interdits (couleurs de l'ancienne V2, mots du foot, sponsor) ;
  - luminance de chaque `section` ≤ celle de #1c1c1c, sauf la bande lime du maillot, déclarée comme exception.

### I.2 Repris de la V1, tel quel

- Mouvement : `app/motion/{boot.inline.js, env.ts, tokens.ts, gsap.ts, sequence.ts, speed.ts, scroll.ts}`, `useMotion`, `plugins/motion.client.ts`.
- Images : `providers/variants.ts`, `build-images.mjs`, `art/grade.py`.
- Typographie et polices : `typesetDeep`, `sync-fonts.mjs` et `fonts-fallback.css` (familles ajoutées).
- Mise en page : `layout.css`.
- Preuves : `serve-static.mjs`, le harnais Playwright et axe.
- Repris en esprit : le préchargement de la photo par media query et l'intro en CSS.

### I.3 Repris de l'ancienne V2 (logique seulement)

- `club-time` ;
- les onglets APG et les radios natives de `ClubSchedule` ;
- le `<details name>` de `ClubFaq` ;
- le comportement du tiroir de `ClubHeader` (piège de focus et Échap à vérifier).

### I.4 À supprimer

- Tous les autres composants de `app/components/v2/`.
- Saira et Schibsted Grotesk (dépendances).
- Les images et l'art de l'ancienne V2.
- `docs/brief/v2.md`, remplacé par cette direction.

### I.5 Budgets cibles

| Poste                    | Cible                                                   |
| ------------------------ | ------------------------------------------------------- |
| JS au premier chargement | ≤ 100 Ko gzip                                           |
| JS à la demande          | GSAP 47,8 Ko ; OGL et pulse-light 16,2 Ko               |
| CSS                      | ≤ 30 Ko                                                 |
| Polices                  | 73,6 Ko                                                 |
| LCP mobile               | ≤ 2,2 s (labo), ≤ 2,5 s exigé                           |
| CLS                      | 0                                                       |
| Lighthouse mobile        | Performance ≥ 90, Accessibilité et Bonnes pratiques 100 |
| axe                      | 0 violation                                             |

### I.6 Ordre de travail

1. Logo SVG, polices instanciées, `cap-fit.ts`.
2. Tokens et `data-site`.
3. Données et horloge de Paris.
4. Génération et étalonnage des 7 images.
5. Sections en état final statique : sans JS et mobile d'abord.
6. Intro CSS et frappes.
7. Semaine en temps réel.
8. Scène épinglée du Cardio.
9. O1 en WebGL.
10. Tests, Lighthouse, captures 1440 et 390 comparées à cette direction.

### I.7 Fichiers de référence produits pendant l'analyse

- `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit-scripts/measure.py` et `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit-scripts/measure2.py` : mesure des largeurs Anybody en em.
- Mesure de l'instanciation d'Anybody (900 fixe : 32 520 o ; 800–900 : 49 784 o), faite en ligne de commande, sans fichier conservé.
- Prototypes de logo existants : `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit/proto-horizontal.svg`, `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit/proto-carre.svg`, `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit/proto-ecg.svg`.
- Aucun fichier du dépôt n'a été modifié.
