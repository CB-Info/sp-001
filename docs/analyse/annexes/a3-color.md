> **Annexe brute** : rapport de l’agent `a3-color`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

# VYRON : couleur, matière et contraste (lentille a3-color)

> Référentiel Impeccable : `colorize.md`, `new-work.md` §4 (stratégie couleur), `craft-floor.md` (contraste, surfaces navigateur).
> Mode visiteur : **Persuade** (landing page), aussi jugée comme pièce de portfolio. Règle appliquée : **le brief gagne**. Quand la référence entre en conflit avec le plancher de qualité (craft-floor), je le signale comme une **décision à prendre**, sans rien corriger d'office.
> Le harnais a refusé l'écriture de `report.md`. Ce texte est donc le rapport complet ; les scripts sont bien enregistrés dans le dossier de travail (annexe §7).

---

## 0. Méthode, échelles et fiabilité

### Sources et normalisation

| Fichier | Contenu | Cadre du site (MEASURED) | Facteur vers 1440 px |
|---|---|---|---|
| `2.png` (1600×1200) | Hero haute résolution | x 100→1499, y 100→1170 (fin du hero) | ×1,0286 (1400 → 1440) |
| `3.png` | Haut de Services | x 100→1499 | ×1,0286 |
| `4.png` | Why VYRON (sombre) | x 100→1499 | ×1,0286 |
| `1.png` (407×2000) | Page entière basse résolution | x 19→387 (368 px), y 20→1977 | ×3,913 (368 → 1440) |

- Les PNG embarquent un profil ICC **sRGB** (MEASURED). Les valeurs hex ci-dessous sont donc des valeurs sRGB réelles, et l'OKLCH est calculé à partir de ces valeurs (conversion Ottosson).
- Le fond gris clair **#e4e2e3** qui entoure le site est le **tapis de présentation Dribbble**. Il ne fait pas partie du site et ne doit pas entrer dans la palette.
- La page fait environ **7 660 px de haut à 1440 de large** (1957 × 3,913, ESTIMATED).

### Limites de mesure (à lire avant les chiffres)

1. **Compression avec sous-échantillonnage de la chroma.** Les petits textes colorés « bavent ». Exemple : le blanc sur rouge se lit #ffd6d6 et le rouge sur sombre perd de la chroma. Pour un petit texte, la valeur mesurée sur les pixels de cœur reste une **borne basse** de la vraie couleur. J'indique alors la couleur probable du design en **INFERRED**.
2. **`1.png` est en basse résolution** (environ 0,26 px source par px de design). Les aplats y sont fiables. Les textes de moins de 20 px y sont **illisibles colorimétriquement** : pastilles (pills) de Programs, kicker « About Us », petits textes du footer. Je le signale au lieu d'inventer.
3. Légende des statuts : **MEASURED** (pixels échantillonnés sur un aplat, écart-type ≈ 0), **ESTIMATED** (dérivé d'une mesure plus un calcul, par exemple une opacité intégrée sur une ligne de 1 px), **INFERRED** (déduction de design, non mesurable directement).

### Découpage des sections (MEASURED sur `1.png`, hauteurs normalisées à 1440)

| Section | y dans `1.png` | Hauteur shot | Hauteur @1440 | Matière |
|---|---|---|---|---|
| Hero | 21 → 302 | 282 | **≈1 103 px** (même valeur dans `2.png` : 1070 × 1,0286 = 1 101) | HOT (photo rouge vers noir) |
| About | 303 → 495 | 193 | ≈755 | PAPER blanc |
| Services | 496 → 823 | 328 | ≈1 283 | PAPER-ALT #f5f5f5 |
| Programs | 824 → 1122 | 299 | ≈1 170 | PAPER blanc |
| Why VYRON | 1123 → 1433 | 311 | ≈1 217 | NIGHT #040f0e |
| Transformation | 1434 → 1747 | 314 | ≈1 229 | PAPER blanc |
| Marquee | 1748 → 1759 | 12 | **≈47 px** (±4) | SIGNAL rouge plein |
| Footer | 1760 → 1976 | 216 | ≈845 | HOT (photo rouge vers noir) |

---

## 1. Palette par rôle

### 1.1 Le rouge de marque : un seul rouge ?

**Oui, un seul rouge pour tous les aplats.** Tous les rouges plats mesurés tiennent dans **±1,2 point de L et ±1,5° de teinte** autour de **#f02b42**.

| Élément | Source | Valeur mesurée | OKLCH | Statut |
|---|---|---|---|---|
| Mot « SERVICES. » | 3.png | **#f02b42** | 61,9 % 0,227 21,9 | MEASURED (97 k px) |
| Carré bouton flèche (Services) | 3.png | #f02b42 | 62,0 % 0,228 21,8 | MEASURED |
| ✱ après « 01 » / « 02 » | 3.png | #f02c44 / #f02c42 | 62,0 % 0,227 21,5–22,1 | MEASURED |
| Bouton « Meet the Team » | 4.png | #f02a42 | 61,9 % 0,228 21,8 | MEASURED |
| Bouton « View All Programs » | 1.png | #ef2b42 | 61,7 % 0,226 21,9 | MEASURED (basse rés.) |
| Onglet « Back To Home » (footer) | 1.png | #ef2941 | 61,6 % 0,228 21,9 | MEASURED (basse rés.) |
| Bande marquee | 1.png | #ed2d45 | 61,6 % 0,223 21,2 | MEASURED (basse rés.) |
| ✱ Transformation, ✱ footer | 1.png | #eb2b43 / #ea2b41 | 61,0 % 0,223 21,4 | MEASURED (basse rés.) |
| Carte stat « 4.9/5 » (About) | 1.png | #e42c41 (plage #d2283d → #e92e44) | 56,3 → 60,9 % 0,20–0,22 21 | MEASURED, **texturée** |
| « Results are built, not given. » | 4.png | cœur #d6324a | 58,0 % 0,199 18,5 | MEASURED cœur, **INFERRED = #f02b42** |
| Flèches « → → → » du hero | 2.png | cœur #d82b46 | 57,8 % 0,207 19,1 | MEASURED cœur, **INFERRED = #f02b42** |
| Barres « ||||| » des kickers | 4.png | #8d5060 (1 px dilué) | — | INFERRED = #f02b42 à 1 px |

**Lecture.** #f02b42 est un **rouge cramoisi légèrement rosé** (teinte OKLCH 22°, chroma 0,227). Sa chroma est très haute pour sa clarté, sans être collée au bord du gamut sRGB : la chroma maximale sRGB à L 61,9 %, h 21,9° est 0,249, et 0,281 en Display-P3 (ESTIMATED). Les rouges de texte mesurés plus bas, autour de 18–19°, s'expliquent par l'anticrénelage et le sous-échantillonnage. **Je recommande un seul token d'accent**, décliné en rampe (§5).

### 1.2 Rouges photographiques (étalonnage)

Les rouges des photos sont **plus chauds (écarlate, teinte 27–31°) et plus sombres** que le rouge de marque (22°). C'est une même famille, avec un écart de teinte de 5 à 9°. L'aplat de marque paraît donc « plus rose » que la photo, et ce léger décalage est cohérent : il distingue la couleur d'interface de la couleur de l'image.

| Rôle | Hex | OKLCH | Où | Statut |
|---|---|---|---|---|
| Vignette haut-gauche du hero (zone logo) | **#600405** | 31,0 % 0,123 28,0 | Hero, coin du logo VYRON™ | MEASURED |
| Rouge moyen de fond (flou) | **#8c0b0e / #8d0c0f** | 40,7–41,0 % 0,16 27,5 | Hero, derrière les taglines | MEASURED |
| Bande claire derrière les taglines | **#c9141b** | 53,2 % 0,208 27,2 | Hero, x ≈ 100–150, y ≈ 470–600 (shot) | MEASURED |
| Lame « verre cannelé » (droite) | #b30f12 | 48,7 % 0,192 27,9 | Hero, x 1190–1265 (shot) | MEASURED |
| Rouge le plus profond avant le noir | #2b0101 | 18,4 % 0,072 28,3 | Hero, y ≈ 820 | MEASURED |
| Photo rouge de la carte 02 (Services) | médiane #9c2817 | 46,0 % 0,155 31,4 | Carte noire « Strength Training » | MEASURED |
| Photo footer (zone gauche) | moyenne #6e3130 | 32 % (méd.) 0,07–0,17 28 | Footer, tiers gauche | MEASURED |

**Part de surface.** Rouges photo profonds ≈ **8,9 % de la page**, dont 50,2 % du hero et 15,7 % du footer.

### 1.3 Sombres : deux noirs distincts

| Rôle | Hex | OKLCH | Où | Part | Statut |
|---|---|---|---|---|---|
| **Noir « hot »** | **#000000** (footer #010101) | 0 % 0 | Bas du hero (≥ 80 % de sa hauteur), carte 02 de Services, bouton « Learn More About Us », footer à droite, chiffres « 01 » « 20 » | ≈5,9 % (aplats) | MEASURED (écart-type 0) |
| **Nuit teal** | **#040f0e** | **15,6 % 0,018 188,8** | Toute la section Why VYRON | ≈11,4 % | MEASURED (écart-type 0, 100 % des px) |
| Carbone (boutons sociaux) | #1e1e1e | 23,5 % 0 | Footer, 3 carrés d'icônes | <0,1 % | MEASURED (basse rés.) |

**Le noir de Why VYRON n'est pas neutre.** Il est teinté **vert-cyan** (teinte 189°, R 4, G 15, B 14). Les autres noirs sont du **#000 pur**. Ce n'est pas un accident de compression : l'aplat est parfaitement uniforme. Ce noir s'accorde avec les fonds froids des portraits d'équipe (bleu-gris, teinte 255–258°). Voir la décision D2.

### 1.4 Clairs

| Rôle | Hex | OKLCH | Où | Part | Statut |
|---|---|---|---|---|---|
| Papier | **#ffffff** | 100 % 0 | Fonds About, Programs, Transformation ; cartes blanches de Services | ≈29 % | MEASURED |
| Papier alternatif | **#f5f5f5** | 97,0 % 0 | Fond de Services (seule section #f5) | ≈16 % (avec gris très clairs) | MEASURED (écart-type 0) |
| Fond des bandes « ledger » de haut de section | #f3f3f3 | 96,4 % 0 | Services, y 100–150 (shot) | <1 % | MEASURED |
| Carte grise texturée (« 20 Years ») | #f8f8f8 → #ececec (nuageux) | 97,9 → 94,3 % 0 | About, carte du milieu | <1 % | MEASURED (basse rés.) |
| Passe-partout de la photo témoignage | #f0f1f4 | 95,8 % 0,004 271 (légèrement froid) | Transformation | <1 % | MEASURED (basse rés.) |
| Bouton « précédent » | #e3e5e5 | 92,0 % 0 | Transformation | <0,1 % | MEASURED (basse rés.) |

### 1.5 Encres et textes, sections claires

| Rôle | Hex mesuré | OKLCH | Où | Statut |
|---|---|---|---|---|
| **Encre des titres H2 : bleu marine** | **#141a2c** | **22,1 % 0,037 269,2** | « HIGH-INTENSITY TRAINING… », « FUNCTIONAL TRAINING », titres About et Programs, titres d'accordéon | MEASURED (3.png). Teinte bleue confirmée dans About, Services et Programs (B−R = +7 à +16) |
| Encre neutre noire | #000000 / #030303 | 0–9 % 0 | Gros chiffres « 01 », « 02 », « 20 » ; **titre H2 de Transformation** (B−R = 0) | MEASURED. **Incohérence de la source** (décision D3) |
| Gris de texte courant | cœur #77787b (≈ noir 53 % sur blanc) | 57,3 % 0,005 271 | « One-on-one coaching built around… » | MEASURED cœur |
| Gris mono | cœur #797a7b (≈ noir 50 % sur #f5) | 57,9 % 0,002 | « Trusted by people who demand real fitness results. » | MEASURED cœur |
| Gris de citation | cœur #838383 (basse rés.) | 61 % 0 | Citation « I came here wanting to get fit… » | MEASURED basse rés. (vraie valeur probablement plus sombre) |
| Nom « Jordan Tucker » | cœur #434449 | 38,7 % 0,010 281 | Transformation | Basse rés., **INFERRED = encre marine** |
| Icône téléphone (bouton blanc du hero) | cœur #1c1b24 | 22,7 % 0,017 287 | Hero, en haut à droite | INFERRED = encre marine |
| Pastilles « 16 Days / Muscle Building / … » | — | — | Programs | **Non mesurable** (texte d'environ 3 px dans `1.png`) |

### 1.6 Textes sur sombre et sur rouge

Dans Why VYRON, tous les gris ont la **teinte du fond (≈190°)**. Ce sont des **blancs à opacité réduite** posés sur #040f0e. Le calcul de l'alpha équivalent est concordant sur les trois canaux :

| Rôle | Hex (cœur) | OKLCH | ≈ blanc α | Où |
|---|---|---|---|---|
| Titre | #fdffff | 99,8 % | 100 % | « BUILT FOR THOSE WHO DON'T COMPROMISE ON FITNESS » |
| Secondaire fort | #c4cecd / #c0cbca | 84,3 % 0,011 190 | ≈78 % | Textes des 4 colonnes, noms « Alex Vance »… |
| Courant / chapô / kicker | #949f9e / #95a09f / #909b9a | 68–70 % 0,013 190 | ≈57–59 % | « Every workout plan exists… », « Designed to transform… », « WHY VYRON » |
| Labels de colonnes | #687372 | 54,6 % 0,013 190 | ≈41 % | « EXPERT COACHES », « PREMIUM EQUIPMENT »… |
| Index | #606b6a | 51,8 % 0,014 190 | ≈38 % | « 01 » à « 05 » sous les portraits |
| Gris sur la carte noire (Services) | #999999 | 68,3 % 0 | 60 % sur #000 | « Build muscle, increase power… » |
| Blanc sur photo rouge | #ffffff (cœur #ffd6d6) | — | 100 % | Taglines « PUMP. REPEAT. », « MENU ». INFERRED blanc, la teinte rose vient de la bavure chroma |
| Sous-titre du hero | cœur #f9e9e4 | 94,5 % 0,019 38 | ≈85–90 % | « Redefine Your Physical Potential ». INFERRED blanc légèrement translucide |

**Système implicite du designer.** Le texte secondaire vaut environ **60 % de blanc sur sombre** et **50–53 % de noir sur clair**. Quand le fond est teinté, ce système produit automatiquement des gris teintés de sa couleur, ce qui correspond exactement à la règle Impeccable « *derive secondary text from the surface hue* ».

### 1.7 Filets, trames et repères

| Rôle | Valeur | Contexte | Statut |
|---|---|---|---|
| Filet clair | 1 px ≈ **#dcdcdc** (pic mesuré #e2e2e2, étalé sur 2 rangs) ≈ noir 8–10 % | Séparateurs de Services (au-dessus et au-dessous du H2), accordéon Programs | MEASURED / ESTIMATED |
| Trame « ledger » (bloc) | lignes horizontales **#dadcdc–#dcdcdc** sur #f5f5f5, pas ≈6,5 px (≈6,7 @1440), **11 colonnes** verticales #dcdcdc | Services, bloc de 158→1441 × 703→807 (shot) | MEASURED |
| Trame de haut de section | lignes #e9e9e9–#eeeeee (≈ noir 4–5 %), 11 colonnes de ≈127 px (≈131 @1440) | Bande d'environ 50 px en haut de chaque section claire | MEASURED (3.png) ; INFERRED pour les autres sections |
| Filet sur nuit | **#1f2a29 → #242f2e** ≈ blanc 11–13 % | Grille des colonnes de Why, filets horizontaux | MEASURED |
| Séparateurs des taglines du hero | 1 px, blanc ≈ **50 %** (alpha intégré 0,56) | Hero, 5 lignes entre les taglines | ESTIMATED |
| Repères de cadre du hero | blanc ≈ **15–20 %** (verticale x ≈ 128, horizontales y ≈ 820 et 1118 du shot) ; #292929 sur noir | Hero | ESTIMATED |
| Croix « + » de repère | blanc ≈ **50–60 %** | Hero, y ≈ 738 du shot, 4 occurrences | ESTIMATED |
| Bordures des colonnes du footer | #22201e sur noir (≈ blanc 12 %) | Footer | MEASURED (basse rés.) |

### 1.8 Répartition des surfaces

**Sur toute la page** (classification OKLCH de tous les pixels du cadre, MEASURED) :

| Classe | Part |
|---|---|
| Blanc pur | **29,0 %** |
| Off-white #f5 et gris très clairs | **16,1 %** |
| Nuit teal #040f0e | **11,4 %** |
| Rouges photo profonds | **8,9 %** |
| Noir neutre | **5,9 %** |
| **Rouge de marque en aplat** | **2,5 %** |
| Autres (peau, photos neutres, textes) | 26,2 % |

**Par section :**

| Section | Rouge marque | Rouge photo | Tous rouges | Sombre (L<0,2) | Clair (L>0,93) |
|---|---|---|---|---|---|
| Hero | 0,3 % | 50,2 % | **54,1 %** | 23,1 % | 4,3 % |
| About | 7,6 % | 1,9 % | 10,4 % | 2,7 % | 75,0 % |
| Services | 5,5 % | 1,3 % | 7,8 % | 10,4 % | 74,0 % |
| Programs | 0,4 % | 0,2 % | 0,9 % | 5,3 % | 76,1 % |
| Why | 0,4 % | 0,3 % | 0,7 % | 78,9 % | 0,7 % |
| Transformation | 0,4 % | 0,3 % | 0,9 % | 1,1 % | 79,4 % |
| Marquee | 63,8 % | 11,8 % | **97,5 %** | 0 % | 0,6 % |
| Footer | 3,0 % | 15,7 % | 19,5 % | 58,6 % | 5,6 % |

---

## 2. Stratégie couleur en termes Impeccable

### 2.1 Nom de la stratégie

**Corps Restrained, serre-livres Drenched, et une bande Committed.**

- **Serre-livres Drenched : hero et footer.** La surface *est* la couleur, et c'est la photo qui la porte : 54 % du hero est rouge, le reste est un noir qui en est l'ombre. Le premier et le dernier écran sont des champs rouges.
- **Corps Restrained, d'About à Transformation.** Des neutres par matière (papier blanc, papier #f5, nuit teal) et un seul accent, rationné entre 0,4 et 7,6 % de surface par section.
- **Bande Committed : la marquee.** 47 px de rouge plein (97 %) sur toute la largeur. C'est la charnière qui relance le rouge juste avant le footer.

**Températures.** C'est un système **« rouge chaud contre matière froide »**. Hormis la peau, le rouge est la *seule* teinte chaude. Tout le reste tire vers le froid : encre marine (269°), nuit teal (189°), photos d'équipe et de Programs bleu-gris (255–265°), débardeur blanc du hero légèrement lavande (#938e9c, 302°).

**Amplitude de contraste.** Elle est maximale (L 0 → L 100) et sert de **voix** : noir pur, blanc pur et un rouge saturé, sans gris moyen décoratif.

### 2.2 Rationnement du rouge : un ancrage par section, plus une ponctuation

| Section | Ancre rouge (une seule, forte) | Ponctuation rouge (petite, répétée) |
|---|---|---|
| Hero | Photo rouge (champ entier). **L'astérisque est blanc ici** : sur surface rouge, le rôle « accent » passe au blanc | 3 flèches « → → → » |
| About | Carte stat « 4.9/5 » | Barres du kicker ; polo rouge du coach (la photo fait écho à l'interface) |
| Services | Mot « SERVICES. » (cap ≈ 191 px @1440) | Carré flèche ; ✱ après 01 et 02 ; photo rouge de la carte 02 |
| Programs | Bouton « View All Programs » | Barres du kicker ; index « 01 »–« 04 » |
| Why VYRON | Phrase « Results are built, not given. » | Bouton « Meet the Team » ; barres du kicker |
| Transformation | ✱ géant | Point de pagination actif ; « 01 » ; bouton suivant |
| Marquee | La bande entière | — |
| Footer | Photo rouge plus onglet « Back To Home » | ✱ |

**Règle déduite à conserver.** Jamais deux grands aplats rouges dans la même section. Le rouge **ne décore pas les fonds** du corps de page : il marque **une action, un mot ou un signe**. Le glyphe ✱ à 8 branches est la ponctuation de marque.

### 2.3 Alternance clair/sombre : un système de matières

```
HOT ─▶ PAPER ─▶ PAPER-ALT ─▶ PAPER ─▶ NIGHT ─▶ PAPER ─▶ SIGNAL ─▶ HOT
hero    about    services     programs  why      transfo  marquee   footer
#000    #fff     #f5f5f5      #fff      #040f0e  #fff     #f02b42   #000
+photo                                                              +photo
rouge                                                               rouge
```

| Matière | Fond | Élévation | Texture | Encre |
|---|---|---|---|---|
| **HOT** | photo rouge qui tombe dans #000 | Aucune. Repères en blanc translucide (15–60 %) | Flou de mouvement, verre cannelé | Blanc ; l'accent devient blanc (✱ blanc) |
| **PAPER** | #fff | Cartes : #f5/#f8 texturées, rouge texturé ou photo | Grain nuageux sur les cartes stat | Marine #141a2c ; chiffres #000 |
| **PAPER-ALT** | #f5f5f5 | **Cartes #fff plus claires que le sol** : l'élévation passe par la clarté, pas par l'ombre. Une carte #000 en inverse | Trame ledger #dcdcdc | Marine |
| **NIGHT** | #040f0e | **Cellules cernées de filets** (blanc ≈ 12 %), sans remplissage | Aucune | Blancs à 100/78/60/40 % (teintés teal) |
| **SIGNAL** | #f02b42 | — | — | Blanc |

**Constats « matière » :**

- **Aucune ombre portée** sur toute la page (vérifié autour des cartes et du cadre photo : pas de dégradé de chute). L'élévation passe par un **pas de clarté** (#f5 → #fff), par des **filets**, et par le motif des **« plaques décalées »** : un double rectangle de la *même* couleur décalé de quelques px, sur les boutons « Learn More », « View All Programs », « Meet the Team », sur le carré flèche, le bouton téléphone et les cadres photo (coach, Programs, carte 02).
- **Tension avec craft-floor** (*« Hard offset shadows… outside a world that is actually neobrutalist »*). Ce n'est pas une ombre sombre mais une **silhouette crantée de même couleur**. Elle fait partie du brief, donc on la garde, mais on la construit comme une **forme** (pseudo-élément ou `clip-path` de même couleur) et pas comme un `box-shadow: 4px 4px 0` déguisé.
- Les trois sections PAPER consécutives (About, Services, Programs) ne se distinguent que par #fff / #f5f5f5 / #fff, soit un contraste de **1,09:1**. La séparation vient surtout de la bande ledger en haut de chaque section, qui joue un rôle structurel et pas seulement décoratif.

---

## 3. Étalonnage photo, textures, dégradés : règles d'art direction (pour Higgsfield)

### 3.1 Familles d'images mesurées

Statistiques OKLCH sur échantillons de pixels, toutes MEASURED.

| Emplacement | Moyenne | L médiane (p5–p95) | C médiane (p90) | Teinte dominante | Lecture |
|---|---|---|---|---|---|
| **Hero** (2/3 haut) | #7d2724 | 0,40 (0,10–0,79) | 0,116 (0,176) | **28°** | Monochrome rouge en *split grade* (ombres et tons moyens poussés au rouge) |
| Visage du hero | #703c2f | 0,42 | 0,083 | 37° | Peau préservée, chaude |
| Carte 02 Services | #9c2817 | 0,48 (0,18–0,68) | 0,165 (0,202) | **31°** | Studio monochrome rouge-orangé |
| Carte 03 Services | #4a4c4b | 0,31 (0,15–0,90) | **0,004** | — | **Noir et blanc pur**, contrasté |
| Coach (About) | #4c3738 | 0,34 | **0,008** (p90 0,144) | 26° (polo seul) | **Couleur sélective** : salle désaturée, seul le polo rouge reste saturé |
| Programs | #2d303c | 0,23 (0,14–0,64) | 0,032 | **258°** | Nuit bleu marine, cordes floues au premier plan |
| Équipe Why (×4) | #353c4c… | 0,16–0,36 | 0,016–0,035 | **258°** (fonds) | Salle froide bleu-gris, peau naturelle, hauts noirs |
| Marcus Roy (portrait central) | #403631 | 0,26 (p95 **0,72**) | 0,021 (p90 0,056) | 51° | Le portrait vedette est plus chaud et plus contrasté (chrome, sueur) |
| Témoignage (Transformation) | **#725f41** | 0,45 (**p5 0,24**) | 0,053 | **67–106°** | **Film chaud ambre-olive**, noirs relevés, flou de mouvement |
| Footer | #6e3130 | 0,32 | 0,071 (0,168) | 28° | Monochrome rouge comme le hero, puis fondu vers le noir |

### 3.2 Hero : anatomie de l'étalonnage (MEASURED sur 2.png)

| Bande tonale | Part | C médiane | Teinte |
|---|---|---|---|
| L 0–0,2 (ombres) | 13 % | 0,036 | 29° (rouge-noir) |
| L 0,2–0,4 | 38 % | 0,128 | 28° |
| L 0,4–0,6 | 37 % | **0,157** | 28° |
| L 0,6–0,8 (peau) | 7,6 % | 0,087 | **42°** (pêche) |
| L 0,8–1 (hautes lumières) | 4,3 % | 0,063 | 40° |

- Les **blancs du sujet restent froids** : débardeur #938e9c (65,6 % 0,021 302°). Cette séparation par complémentaire empêche la photo de virer au « filtre rouge plat ».
- Les cheveux et le kettlebell sont **écrasés en rouge-noir** (#470807, #420505).
- **Vignette** : coin haut-gauche à L ≈ 29–31 % (zone du logo), bande plus claire à L 46–53 % derrière les taglines, côté droit uniforme à L ≈ 40 %.
- **Flou de mouvement horizontal** sur tout le fond. Le sujet reste net.
- **« Verre cannelé » à droite** : 4 lames verticales d'environ 70–75 px (≈75 @1440, entre x 1190 et 1495 du shot). Chaque lame est un fond décalé avec son propre micro-dégradé horizontal (par exemple #960607 → #901518) et des sauts de 3 à 8 points de L entre lames.
- **Pas de grain.** Le résidu passe-haut vaut moins de 0,5 sur les zones floues, comme sur les aplats.
- **Fondu vers le noir** (profil vertical à x 1300–1480, ESTIMATED) : le rouge sombre commence vers 62 % de la hauteur du hero (L ≈ 24 %), passe un plateau #380000 vers 72–75 %, et devient **#000 pur à partir d'environ 80 %**. Approximation CSS : `linear-gradient(180deg, transparent 60%, rgb(0 0 0 / .6) 72%, #000 80%)`.

### 3.3 Footer

**Fondu horizontal** (profil de L à 6 hauteurs, MEASURED basse rés.) : photo bien visible de 0 à 20 % de la largeur, fondu de 20 à 65 %, **noir #010101 à partir d'environ 68 %**. Approximation (ESTIMATED) : `linear-gradient(90deg, transparent 15%, rgb(0 0 0 / .7) 45%, #000 68%)`. Une lumière rouge vient du haut-gauche. Une trame ledger très faible apparaît en bas à droite sur le noir.

### 3.4 Textures

| Texture | Où | Mesure | Statut |
|---|---|---|---|
| Grain nuageux, effet béton ou fumée | Carte grise « 20 Years of Excellence » | #ececec ↔ #fafafa, écart-type 4,4 (contre 0 pour un aplat de référence) | MEASURED basse rés. |
| Marbrure | Carte rouge « 4.9/5 » | L 56,3 → 60,9 %, écart-type 3,8, assombrissement vers le bas à droite | MEASURED basse rés. |
| Trame ledger | Services, et haut de chaque section claire | voir §1.7 | MEASURED |
| Aucun bruit | Fonds #fff, #f5, #040f0e, #000, aplats rouges | écart-type 0 | MEASURED |

### 3.5 Règles d'art direction pour les images générées

À appliquer dans chaque prompt. Les fragments sont en anglais pour Higgsfield.

1. **Hero et footer, « red monochrome split grade ».** Ombres et tons moyens en rouge sang (#2b0101 → #8d0c0f → #c9141b, teinte OKLCH ≈ 28°). Peau naturelle et chaude, sans virer au rouge. Blancs légèrement froids. Fond en **flou de mouvement horizontal**, sujet net. **Le quart inférieur (hero) ou les deux tiers droits (footer) doivent tomber au noir pur**, car c'est la zone de texte. Pas de grain.
   *Fragment : "athlete, crimson monochrome color grade, deep blood-red shadows, natural warm skin tones, cool white fabric, strong horizontal motion blur background, subject tack sharp, bottom quarter falls off to pure black, no film grain".*
2. **Studio rouge (cartes de service).** Monochrome rouge légèrement plus orangé (≈31°), fond noir de studio, lumière latérale dure.
3. **Noir et blanc (carte alternée).** Chroma ≈ 0, contraste fort (L 0,15 → 0,90), lumière latérale.
4. **Couleur sélective (portrait coach).** Salle neutre désaturée (C < 0,01), **un seul vêtement rouge** dans la famille #f02b42.
5. **Nuit froide (Programs, équipe Why).** Lumière ambiante bleu-teal (260° ; C ≈ 0,03), sombre (L médiane 0,2–0,35), peau naturelle, hauts noirs. Les **bords doivent rejoindre #040f0e** pour que l'image fusionne avec la section.
6. **Film chaud (témoignage).** Ambre-olive (70–100° ; C ≈ 0,05), **noirs relevés** (L minimale ≈ 0,22), flou de mouvement, léger vignettage. L'image est présentée comme un tirage dans un passe-partout #f0f1f4.
7. **Cohérence de casting.** La source montre des portraits très homogènes, du type « stock IA ». Pour un portfolio, il vaut mieux garder une **même direction de lumière par famille** et un **même focal** (environ 50–85 mm).

---

## 4. Contrastes WCAG 2.x

**Formule.** On linéarise chaque canal : c ≤ 0,04045 → c/12,92, sinon ((c+0,055)/1,055)^2,4. La luminance relative vaut **L = 0,2126 R + 0,7152 G + 0,0722 B**, et le **ratio = (L_clair + 0,05) / (L_sombre + 0,05)**.
Exemple : blanc (L = 1,0000) sur #f02b42 (L = 0,2065) donne 1,05 / 0,2565 = **4,09:1**.

**Seuils.** Texte courant 4,5:1. Grand texte (≥ 24 px, ou ≥ 18,66 px en gras) 3:1. Composants d'interface et icônes 3:1.

**Tailles mesurées** (hauteur de capitale normalisée @1440). Le classement « grand » ou « courant » en dépend :

| Texte | Capitale | Taille de police probable |
|---|---|---|
| « SERVICES. » | 191 px | — |
| H2 | 39 px | ≈ 54 px |
| « Redefine… » | 28,8 px | ≈ 40 px |
| « Results are built » | 16,5 px | ≈ 23–24 px, **à la limite** |
| Texte courant | 11–12 px | ≈ 16 px |
| Labels de colonnes Why | 11,3 px | — |
| « Meet the Team », taglines, MENU | 10,3 px | ≈ 14–15 px |
| Index « 01 » | 8,2 px | ≈ 11 px |

### 4.1 Échecs, avec correction qui garde la teinte

La correction ajuste la **clarté OKLCH** et garde la teinte. Les ratios corrigés sont vérifiés.

| ID | Paire | Ratio | Seuil | Verdict | Correction proposée |
|---|---|---|---|---|---|
| B1 | Blanc / bouton rouge #f02b42 (« Meet the Team », « View All Programs ») | **4,09** | 4,5 | **ÉCHEC** | Remplissage **#e41e3a** oklch(59,0 % 0,225 22,0) → **4,62** |
| B2 | Blanc / bande marquee #f02b42 (≈ 19 px, graisse moyenne) | **4,09** | 4,5 | **ÉCHEC** | Même correction (#e41e3a) ; ou texte ≥ 18,66 px en gras |
| F2 | Blanc / onglet « Back To Home » #f02b42 | **4,09** | 4,5 | **ÉCHEC** | Même correction |
| C2 | Blanc / zone la plus claire de la carte rouge texturée (#e92e44) | **4,25** | 4,5 | **ÉCHEC** | Base #e41e3a, la texture ne doit **qu'assombrir** (zone la plus sombre #d2283d : 5,11) |
| L7 | Index mono rouge « 01 » (≈ 11 px) / blanc | **4,09** | 4,5 | **ÉCHEC** | **#c2152c** oklch(52,1 % 0,200 22,9) → 6,11 sur #fff, 5,60 sur #f5 ; ou index marqué décoratif (`aria-hidden`) |
| L8 | « 01 » rouge du témoignage / blanc | **4,09** | 4,5 | **ÉCHEC** | Même correction (#c2152c) ou ≥ 24 px |
| L3 | Gris courant #77787b / blanc | **4,41** | 4,5 | **ÉCHEC** (de peu) | **#68696c** oklch(52,1 % 0,005 271) → 5,49 |
| L3b | Gris #77787b / carte texturée #ececec (puces « Expert certified… ») | **3,74** | 4,5 | **ÉCHEC** | #68696c → 4,65 |
| L4 | Mono #797a7b / #f5f5f5 (« Trusted by… ») | **3,94** | 4,5 | **ÉCHEC** | #68696c → 5,03 |
| D4 | Labels « EXPERT COACHES » #687372 (blanc ≈ 41 %) / #040f0e | **3,97** | 4,5 | **ÉCHEC** | **#788382** oklch(60,1 % 0,013 190) → 4,97 |
| D6 | Index « 01–05 » #606b6a / #040f0e | **3,53** | 4,5 | **ÉCHEC** | #788382 → 4,97 (ou décoratif) |
| D7m | « Results are built » à la valeur mesurée #d6324a / #040f0e | 4,09 | 4,5 | ÉCHEC si rendu ainsi | Rendu à #f02b42 : 4,75 ✓. **Recommandé : #f64d57** oklch(66 % 0,205 21,6) → **5,67** (voir CVD) |
| H3 | « Redefine Your Physical Potential » blanc / peau éclairée #bb8c81 | **2,92** | 3,0 (grand) | **ÉCHEC** | Voile local noir **≥ 20 %** (3:1) ou **≥ 35 %** (4,5:1) ; ou texte déplacé entièrement dans la zone noire (20,55:1) |
| H3b | Idem / peau la plus claire #e7a38b | **2,10** | 3,0 | **ÉCHEC** | Idem |
| F1 | Texte courant du footer (cœur #656162) / photo #282524 | **≈2,49** | 4,5 | **ÉCHEC** (basse rés., valeur à confirmer) | Texte **#a3a3a3** (8,33 sur #000) ou #ffc3c3 (13,85) ; voile ≥ 35 % sous la colonne au-dessus des hautes lumières de la photo |

### 4.2 Paires conformes

| ID | Paire | Ratio | Seuil |
|---|---|---|---|
| L1 / L2 | Encre marine #141a2c / #fff ; / #f5f5f5 | 17,30 ; 15,87 | 3 / 4,5 ✓ |
| L5 | Citation #838383 / #fff (grand texte ≈ 26 px) | 3,79 | 3 ✓. **Fragile** : si < 24 px, échec. Recommandé #68696c (5,49) |
| L6 | « SERVICES. » #f02b42 / #f5f5f5 | 3,76 | 3 (grand) ✓ |
| B3 | Blanc / bouton noir « Learn More About Us » | 20,87 | ✓ |
| B4 | Flèche blanche / carré rouge (icône) | 4,09 | 3 (UI) ✓ |
| B5 / B6 | Icône marine / bouton #e3e5e5 ; / bouton blanc | 13,68 ; 17,30 | ✓ |
| C1 | Blanc / zone la plus sombre de la carte rouge #d2283d | 5,11 | ✓ |
| C3 | #999 / carte noire Services | 7,37 | ✓ |
| H1 / H2 | Tagline blanche / rouge hero le plus clair #c9141b ; / moyen #a00a0e | 5,83 ; 8,25 | ✓ |
| H4 | Sous-titre blanc / zone noire #100000 | 20,55 | ✓ |
| H5 | Flèches #f02b42 / #130000 (UI) | 4,99 (mesuré #d82b46 : 4,24) | 3 ✓ |
| H6 | MENU blanc / #8a0b10 | 9,83 | ✓ |
| D1, D2, D3, D5, D8 | Blanc / #040f0e ; kicker #909b9a ; courant #949f9e ; colonnes #c4cecd ; noms #c0cbca | 19,45 ; 6,80 ; 7,14 ; 12,09 ; 11,70 | ✓ |
| F3 / F4 | Icônes blanches / #1e1e1e ; liens blancs / noir | 16,67 ; 20,87 | ✓ |

**Éléments décoratifs, sans exigence** (à marquer `aria-hidden` et à ne jamais charger de sens) :

- filet #dcdcdc / #f5f5f5 : 1,26 ;
- filet nuit #1f2a29 / #040f0e : 1,32 ;
- croix « + » du hero : 2,25 ;
- repères de cadre du hero ;
- barres des kickers.

### 4.3 Le nœud du rouge

**Un seul rouge ne peut pas porter à la fois du blanc en texte courant et du texte courant sur la nuit.**

- Pour du blanc dessus à 4,5:1, il faut un rouge de luminance L ≤ **0,183**.
- Pour un texte rouge à 4,5:1 sur #040f0e, il faut L ≥ **0,193**.
- Les deux plages ne se recouvrent pas. Pour mémoire, #f02b42 vaut L = 0,2065 et #e41e3a vaut 0,1773 (4,21 sur la nuit).

Il faut donc **deux tokens** : un **accent de remplissage** (#e41e3a) et un **accent de texte sur sombre** (#f02b42 ou #f64d57). Le display rouge sur papier garde #f02b42, en grand texte uniquement.

### 4.4 Simulation des déficiences de la vision des couleurs

Matrices de Machado 2009, sévérité 1.

| Paire | Normal | Protanopie | Deutéranopie | Tritanopie |
|---|---|---|---|---|
| Rouge #f02b42 / nuit | 4,75 | **3,20** | 5,78 | 4,90 |
| **#f64d57 / nuit** | 5,67 | **4,11** | 6,73 | 5,11 |
| « SERVICES. » / #f5 | 3,76 | 5,53 | 3,10 | 3,63 |
| Blanc / #f02b42 | 4,09 | 6,02 | **3,38** | 3,96 |
| Rouge / noir | 5,13 | 3,49 | 6,21 | 5,31 |
| Point actif rouge / point inactif gris | 2,99 | 4,39 | **2,47** | 2,89 |

- Pour un protanope, le rouge sur sombre perd environ 1/3 de son contraste (#f02b42 est perçu comme #6b6341).
- La pagination du témoignage ne doit pas reposer **que** sur la couleur. Il faut ajouter une forme : point actif allongé en pilule, ou compteur « 01 / 05 ».
- L'accordéon (– / +) et les boutons précédent/suivant ont déjà un repère de forme ✓.

---

## 5. Jeu de tokens proposé (valeurs uniquement)

### 5.1 Primitives

Rampes OKLCH à teinte fixe, chroma réduite près du blanc et du noir. Les valeurs *mesurées* sont verrouillées. Les autres sont dérivées et vérifiées dans le gamut sRGB.

| Token | OKLCH | Hex | Origine |
|---|---|---|---|
| `red-50` | 97,1 % 0,014 17 | #fff2f2 | dérivé |
| `red-100` | 93,4 % 0,032 15 | #fee1e2 | dérivé (texte secondaire sur rouge foncé ou noir) |
| `red-200` | 87,1 % 0,069 19 | #ffc3c3 | dérivé (sélection alternative, secondaire sur HOT) |
| `red-400` | 66,0 % 0,205 21,6 | **#f64d57** | dérivé : accent texte sur nuit |
| `red-500` | **61,9 % 0,227 21,9** | **#f02b42** | **MEASURED** (marque) |
| `red-600` | 59,0 % 0,225 22,0 | **#e41e3a** | dérivé : remplissage AA sous blanc |
| `red-700` | 52,1 % 0,200 22,9 | **#c2152c** | dérivé : petit texte rouge sur papier ; survol |
| `red-800` | 41,0 % 0,160 27,5 | #8d0c0f | MEASURED (rouge photo moyen) |
| `red-900` | 31,0 % 0,123 27,7 | #600305 | MEASURED (vignette du hero) |
| `red-950` | 17,9 % 0,070 28,2 | #290101 | MEASURED (rouge le plus profond) |
| `ink-900` | **22,1 % 0,037 269,2** | **#141a2c** | **MEASURED** |
| `ink-700` | 38,1 % 0,030 270 | #3c4253 | dérivé (secondaire fort sur papier, 10,02:1) |
| `grey-600` | 52,1 % 0,005 271 | **#68696c** | corrigé (AA sur #fff, #f5 et #ececec) |
| `grey-500` | 60,0 % 0,005 271 | #7f8083 | dérivé (désactivé uniquement, 3,95) |
| `grey-300` | 89,4 % 0 | #dcdcdc | MEASURED (filet, trame ledger) |
| `grey-200` | 93,1 % 0 | #e8e8e8 | dérivé (trame de haut de section, fond désactivé) |
| `paper-50` | 97,0 % 0 | **#f5f5f5** | **MEASURED** |
| `paper-0` | 100 % 0 | #ffffff | MEASURED |
| `night-950` | **15,6 % 0,018 188,8** | **#040f0e** | **MEASURED** |
| `night-900` | 19,7 % 0,018 190 | #0b1817 | dérivé (cellule survolée) |
| `night-800` | 27,4 % 0,015 189 | #1f2a29 | MEASURED (filet ≈ blanc 11 %) |
| `night-500` | 60,1 % 0,013 190 | **#788382** | corrigé (AA 4,97) |
| `night-400` | 69,0 % 0,013 190 | #939e9d | MEASURED (≈ blanc 59 %) |
| `night-200` | 84,3 % 0,011 190 | #c4cecd | MEASURED (≈ blanc 78 %) |
| `black` | 0 % | #000000 | MEASURED |
| `carbon-850` | 23,5 % 0 | #1e1e1e | MEASURED |

**Option P3 (adaptation « légère »).** Sous `@media (color-gamut: p3)`, on peut pousser `red-500` vers oklch(61,9 % 0,26 21,9). Il reste de la marge jusqu'à C 0,281 (ESTIMATED). Il faut **revérifier les ratios** ensuite : à L OKLCH constante, la luminance WCAG bouge légèrement.

### 5.2 Tokens sémantiques par matière

| Rôle sémantique | PAPER (#fff) | PAPER-ALT (#f5) | NIGHT | HOT (photo rouge / #000) | SIGNAL (marquee) |
|---|---|---|---|---|---|
| `--bg` | paper-0 | paper-50 | night-950 | black (+ photo) | red-600 |
| `--surface` (carte surélevée) | paper-50 / texture #f8→#ececec | **paper-0** | night-900 (survol) | carbon-850 | — |
| `--surface-inverse` | black | black (carte 02) | paper-0 | — | — |
| `--ink` (titres) | ink-900 | ink-900 | paper-0 | paper-0 | paper-0 |
| `--ink-numeral` (gros chiffres) | black | black | paper-0 | paper-0 | — |
| `--ink-secondary` | ink-700 | ink-700 | night-200 | red-100 | — |
| `--ink-muted` (courant, chapô, mono) | grey-600 | grey-600 | night-400 | **red-200** ou #a3a3a3 | — |
| `--ink-subtle` (labels, index) | grey-600 | grey-600 | night-500 | #a3a3a3 | — |
| `--ink-disabled` | grey-500 | grey-500 | night-800 | — | — |
| `--rule` | grey-300 | grey-300 | night-800 | #292929 sur noir ; blanc 16 % sur photo | — |
| `--pattern-line` (ledger) | grey-200 (bande haute) | grey-300 (bloc) | night-800 | blanc 8–12 % | — |
| `--accent` (display, icônes, ✱) | red-500 | red-500 | red-500 | **paper-0** (le ✱ du hero est blanc) | paper-0 |
| `--accent-ink` (petit texte rouge) | red-700 | red-700 | **red-400** | paper-0 | — |
| `--accent-fill` (boutons) | red-600 | red-600 | red-600 | red-600 | — |
| `--accent-fill-hover` | red-700 | red-700 | red-700 | red-700 | — |
| `--on-accent` | paper-0 | paper-0 | paper-0 | paper-0 | paper-0 |
| `--scrim` (voile de texte) | — | — | — | noir 35 % local ; dégradés de §3.2 et §3.3 | — |

**Note.** Les opacités de la source (blanc 40/60/78 %, noir 50 %) sont converties en **couleurs explicites**, comme le demande `colorize.md` : « *Prefer explicit colors over chains of translucent overlays* ». Seuls les repères posés **sur photo** (filets du hero, croix, voiles) restent translucides, puisque leur fond varie.

### 5.3 Surfaces navigateur (le craft-floor exige de les thématiser)

| Surface | PAPER / PAPER-ALT | NIGHT | HOT | Ratio vérifié |
|---|---|---|---|---|
| `::selection` | fond red-600, texte paper-0 | fond red-400, texte night-950 | fond paper-0, texte red-800 | 4,62 ; 5,67 ; 9,58 |
| Anneau de focus (2 px plein, décalage 3 px) | red-600 | red-400 | paper-0 | 4,62 sur #fff / 4,24 sur #f5 ; 5,67 ; 9,58–21 |
| `caret-color` | red-600 | red-400 | paper-0 | — |
| Soulignement de lien (couleur, épaisseur, décalage) | red-500, 1 px puis 2 px au survol, décalage 0,18 em | red-400 | paper-0 | décoratif, la couleur n'est pas le seul signal |
| `accent-color` (contrôles natifs) | red-600 | red-400 | — | — |
| `scrollbar-color` (racine, un seul pour toute la page) | **pouce ink-900 / piste paper-50** (recommandé, rouge rationné). Variante signature : pouce red-500 | conteneurs internes : night-500 / night-950 | — | — |
| `color-scheme` | `light` | **`dark` sur la section** (contrôles et scrollbars internes sombres) | `dark` | — |
| `<meta name="theme-color">` | **#600305** (red-900, bord haut du hero où se trouve le logo) | — | — | INFERRED |
| Chiffres | `font-variant-numeric: tabular-nums` pour « 4.9/5 », « 20 », « 01–05 », le compteur du témoignage | idem | idem | — |
| Texte désactivé | grey-500 sur grey-200 (exempté WCAG, mais lisible) | — | — | 3,95 |

---

## 6. Décisions à trancher (le brief gagne, mais ce sont des choix)

1. **D1, rouge sous texte blanc.**
   - (a) Garder #f02b42 exact et passer tous les libellés blancs sur rouge en grand texte : ≥ 18,66 px en gras ou ≥ 24 px.
   - (b) **Recommandé** : remplir boutons, marquee et onglet en **#e41e3a**. La différence est de 2,9 points de L, invisible à l'œil, et l'on passe à 4,62:1.
   - (c) Libellés noirs sur rouge (5,13:1), mais cela change la voix.
2. **D2, deux noirs.** Garder **#000 pour HOT et #040f0e teal pour NIGHT** (recommandé : c'est la matière « humaine et froide » de l'équipe, en écho aux photos à 258°), ou tout unifier ? Variante : aligner la teinte de la nuit sur l'encre marine (≈ 265°) pour n'avoir qu'**une** famille froide.
3. **D3, encre des titres.** Unifier tous les H2 en **marine #141a2c** (recommandé ; le H2 de Transformation est en #000 dans la source) ou tout passer en noir pur. Les gros chiffres restent en #000 dans tous les cas : c'est un contraste de matière voulu.
4. **D4, sous-titre du hero sur la peau** (2,1–2,9:1).
   - (a) Voile local noir de 20–35 %.
   - (b) **Recommandé** : remonter le fondu noir ou recadrer l'image générée pour que le sous-titre tombe entièrement dans le noir.
   - (c) Déplacer le sous-titre.
5. **D5, rouge en texte sur la nuit.** #f02b42 (4,75 ; 3,20 en protanopie) ou **#f64d57** (5,67 ; 4,11, recommandé) ?
6. **D6, opacités contre couleurs explicites.** Tokens explicites partout sauf sur photo (recommandé), ou conserver le système d'alpha du designer, plus simple mais dont le contraste dépend du contexte ?
7. **D7, adaptation de teinte.** La rampe est construite sur L et C fixes avec une teinte variable : si tu veux t'approprier la marque, on peut décaler la teinte de 22° (cramoisi) vers 28° (écarlate, comme les photos) sans recalculer les contrastes à la main. Faut-il le faire, ou garder 22° ?
8. **D8, P3.** Activer la variante « rouge plus vif » sur les écrans P3 ?

**Tensions transverses, hors de ma lentille, signalées pour les autres analyses :**

- Le kicker « ||||| WHY VYRON » et ses variantes est un **eyebrow**, explicitement banni par craft-floor (« *no brief earns it back* »). Le garder serait une dérogation assumée au nom du brief.
- « SERVICES. » mesure environ 191 px de capitale, donc dépasse largement le plafond « *display max 6rem* ».
- Le mono des labels peut relever du « *monospace as a costume* ».

---

## 7. Annexe : scripts (reproductibles)

Dossier : `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/work/a3-color/`

| Script | Rôle |
|---|---|
| `colorlib.py` | sRGB ↔ OKLab/OKLCH, luminance et contraste WCAG, correction de clarté à teinte constante, échantillonnage (médiane, dominantes, encre) |
| `frame.py` | Bords du cadre du site dans 2/3/4.png |
| `s_hero.py`, `s_hero2.py`, `s_hero3.py` | Grille colorimétrique du hero, profils, fondu noir, textes, filets, flèches |
| `s_services.py`, `s_services2.py` | Fond #f5, rouge SERVICES, encre marine, mono, trame ledger, cartes |
| `s_why.py` | Nuit #040f0e, gris teintés, bouton |
| `s_about.py`, `s_lower.py`, `s_footer.py` | Cartes texturées, Programs, Transformation, marquee, footer |
| `share.py`, `sections_share.py` | Parts de surface (page entière et par section) |
| `s_photos.py` | Statistiques d'étalonnage des photos, grain par filtre passe-haut |
| `sizes.py` | Hauteurs de capitale (classement grand ou courant) |
| `contrast.py` → `contrast_rows.json` | Toutes les paires WCAG plus les corrections |
| `tokens.py` → `tokens.json` | Primitives OKLCH vers hex, et vérification des contrastes des tokens |
| `cvd.py` | Simulation protanopie, deutéranopie, tritanopie |
| `zoom_*.png`, `z_*.png` | Agrandissements de contrôle (grille, kicker, bouton, cartes, footer) |