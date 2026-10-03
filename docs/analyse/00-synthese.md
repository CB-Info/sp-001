# VYRON — Analyse de la référence et recommandations

> **Statut** : phase d'analyse, aucune ligne du site n'est écrite.
> **Date** : 2 octobre 2026.
> **Méthode de design** : Impeccable v4.5 (dépôt `pbakaus/impeccable`).
> **Sources** : 4 captures de la référence. Une page entière basse définition (407 × 2000) et trois zooms 1600 × 1200 : hero, Services, Why VYRON.
> **Annexes** : les 11 rapports d'analyse complets sont dans [`annexes/`](annexes/). Ce document en est la synthèse arbitrée.

---

## 0. L'essentiel en 10 points

1. **Le monde visuel est fort et signé.** On le doit à :
   - une seule voix typographique carrée et chanfreinée (Tektur) à échelle monumentale ;
   - un rouge unique `#F02B42` utilisé avec parcimonie ;
   - un noir teinté sarcelle `#040F0E` ;
   - la silhouette « en escalier » (deux plaques de même couleur décalées) ;
   - l'astérisque à 8 branches ;
   - les trames réglées à 11 colonnes et les repères de calage d'imprimerie.

   Tout cela est à préserver.
2. **Le squelette, lui, est générique et la page ne convertit pas.**
   - Le hero n'a aucune action principale. La page n'affiche ni prix, ni horaires, ni adresse, ni offre d'essai.
   - Le seul « Join Now » est un lien de 13 px dans le footer.
   - Critique Impeccable : **16/28 (57 %)**, verdict « coquille signée, squelette générique ».
3. **L'accessibilité échoue sur des points structurants.**
   - Blanc sur rouge à **4,09:1** (échec AA) sur tous les boutons rouges, le marquee et l'onglet du footer.
   - Sous-titre du hero à **2,0 à 2,9:1** sur la peau.
   - Micro-textes de 10 à 12 px, points de pagination d'environ 5 px.
   - Chaque correction garde la teinte (§5.4).
4. **La maquette est desktop uniquement.**
   - Aucune version mobile.
   - Le hero mesure 1 103 px à 1440 : sur un écran 1440 × 900, « STRENGTH » passe sous la ligne de flottaison.
5. **Polices identifiées par rendu réel et score de recouvrement (IoU), puis confirmées par une vérification adverse** (76 concurrents rendus) : **Tektur** (IoU 0,91 à 0,97), **Inter Tight** pour le lead, **Inter** pour le corps et **IBM Plex Mono**. Toutes sont libres (OFL) et auto-hébergeables.
6. **Cinq habitudes de la référence vont contre le « craft-floor » d'Impeccable** : eyebrows, numéros décoratifs, cartes « hero-metric », mono en costume et display au-delà de 6rem. Règle « the brief wins » : c'est **toi** qui tranches. Mes recommandations sont au §8.
7. **Motion.** Un **seul moment signature**, « Vitesse → Arrêt » : le flou de bougé de la photo se fige et devient l'escalier des boutons. S'y ajoute **une grammaire** : la plaque se soulève au survol et s'enfonce au clic. Tout le reste passe en micro-interactions. Ni préchargeur ni curseur personnalisé.
8. **Images.**
   - Environ 21 visuels (jusqu'à 27), avec un casting récurrent fixe et 4 familles d'étalonnage.
   - **Aucune image du shot** ne sert d'entrée à Higgsfield.
   - Rien n'a été généré. Solde lu : 694,5 crédits.
9. **Stack recommandée.**
   - Astro 7 statique, TypeScript, GSAP 3.15 (ScrollTrigger, SplitText, Flip), Lenis 1.3 sous conditions, CSS natif (ou Tailwind) à tokens, custom elements, sortie statique (Vercel ou Cloudflare).
   - Deux revues adverses indépendantes l'ont validée **avec amendements**.
   - Deux alternatives crédibles :
     - ta stack habituelle (Vite + React + Tailwind), avec GSAP à la place de Motion ;
     - Nuxt 4.5, s'il y a des sous-pages avec des transitions chorégraphiées.
   - L'écart entre stacks est faible : ce sont tes réponses qui décident.
10. **Quatre décisions bloquent la suite** (questions en fin de message). Les autres ont un défaut proposé (§15).

---

## 1. Méthode

### 1.1 Comment l'analyse a été produite

- **Impeccable n'était pas installé dans la session.** Je l'ai cloné depuis GitHub (v4.5.0) et j'ai lancé son chargeur `impeccable context`. Verdict : `NO_PRODUCT_MD`. Un nouveau site doit d'abord passer par `init` (entretien produit, puis `PRODUCT.md`), puis par `shape` et `new-work`, avant toute ligne de design.
- **Neuf lentilles indépendantes**, chacune suivant la référence Impeccable correspondante. Chaque analyste travaillait isolé, sans voir les autres.

| Lentille | Références Impeccable | Annexe |
|---|---|---|
| Structure, grille, espacement | `layout`, `shape`, `mode-persuade` | [a1](annexes/a1-structure.md) |
| Typographie (identification par rendu) | `typeset`, `new-work` §4 | [a2](annexes/a2-typography.md) |
| Couleur, matière, contraste | `colorize`, `craft-floor` | [a3](annexes/a3-color.md) |
| Inventaire des composants et motifs | `extract`, `polish`, `craft-floor` | [a4](annexes/a4-components.md) |
| Critique (Assessment A) | `critique` | [a5](annexes/a5-critique.md) |
| Motion design | `animate`, `delight`, `overdrive` | [a6](annexes/a6-motion.md) |
| Responsive, audit, durcissement, performance | `adapt`, `audit`, `harden`, `optimize` | [a7](annexes/a7-adapt-audit.md) |
| Images (plan Higgsfield, lecture seule) | `visualize` (plates et provenance) | [a8](annexes/a8-imagery.md) |
| Stack, vérifiée sur npm, MDN BCD et CHANGELOG | — | [s1](annexes/s1-stack.md) |

- **Trois vérifications adverses** :
  - **v1b** : ré-identification des polices, en partant du principe qu'il faut réfuter, avec 76 concurrents rendus ([annexe](annexes/v1b-fonts.md)) ;
  - **v2** : critique de complétude, qui a relevé 14 erreurs factuelles et des oublis ([annexe](annexes/v2-completeness.md)) ;
  - **v3 et v3b** : deux revues adverses **indépendantes** de la stack, avec vérification de 46 puis 55 affirmations ([v3](annexes/v3-stack-adversary.md), [v3b](annexes/v3b-stack-adversary.md)). Toutes deux concluent **AMEND**, pas REPLACE.
- **Statut de chaque valeur** : **[M]** mesuré au pixel (PIL/numpy), **[E]** estimé, **[I]** inféré. Le texte illisible est signalé, jamais inventé.

### 1.2 Échelles

| Source | Cadre du site | Facteur vers une maquette 1440 |
|---|---|---|
| `2.png`, `3.png`, `4.png` | x 100 → 1499, soit 1 400 px | × 1,0286 |
| `1.png` (page entière) | x 20 → 386, soit 366 px | × 3,93 (± 4 à 8 px) |

- La maquette est très probablement dessinée en **1440**. Deux sources indépendantes donnent le même hero, à 1 px près.
- Les zooms 1600 × 1200 sont eux-mêmes des agrandissements × 2 d'une capture en 800 × 600.

### 1.3 Limites à connaître

- **About, Programs, Transformation et Footer** ne sont visibles que dans la capture basse définition. Leurs petits textes, icônes et chiffres sont en partie illisibles (par exemple « 14 ou 16 Days », le séparateur du marquee, les pictos des tags). **Des captures haute définition de ces sections lèveraient la plupart des [E] et [I].**
- **Le détecteur déterministe d'Impeccable** (Assessment B de `critique`) ne lit que du markup. Il tournera sur le code, à chaque jalon.

---

## 2. Carte de la page

| # | Section | Rôle dans le récit (comprendre, croire, agir) | Hauteur @1440 | Fond | Densité |
|---|---|---|---|---|---|
| 0 | Header | S'orienter : logo, MENU, téléphone | ~86 | posé sur la photo | faible |
| 1 | **Hero** | Accroche, intensité. **Aucune action** | **1 102** [M] | photo en monochrome rouge, fondu au noir | très peu d'éléments, intensité maximale |
| 2 | **About** | Crédibilité : une promesse, des preuves chiffrées, un coach | ~755 | `#FFFFFF` | moyenne |
| 3 | **Services** | L'offre : mot géant « SERVICES. », carrousel de cartes | ~1 294 | `#F5F5F5` | calme, puis dense |
| 4 | **Programs** | Le choix : accordéon de 4 programmes et photo | ~1 176 | `#FFFFFF` | dense |
| 5 | **Why VYRON** | Différenciation : 4 piliers, équipe de 5 coachs | ~1 219 | `#040F0E` | **la plus dense** |
| 6 | **Transformation** | Preuve sociale : vidéo et témoignage | ~1 233 | `#FFFFFF` | calme |
| 7 | **Marquee** | Respiration cinétique avant la fin | ~47–55 | `#F02B42` | — |
| 8 | **Footer** | Clôture : signature, navigation, 3 panneaux, wordmark géant | ~849 | photo rouge vers noir | dense |
| | **Total** | | **≈ 7 680 px**, soit 8,5 écrans | | |

**Arc narratif** : accroche → crédibilité → offre → choix → différenciation → preuve → relance. Le hero et le footer se répondent : même photo rouge, même display géant, même astérisque. La page se referme sur elle-même.

**Ce qui manque en mode Persuade** :
- une action principale dans le hero ;
- une offre concrète (essai, abonnements) ;
- les infos pratiques (adresse, horaires, planning) ;
- un appel final avant le footer.

**Rythme** :
- **Ce qui marche.** La section sombre arrive à environ 56 % du défilement : c'est le point culminant du milieu de page. La densité alterne bien. Les espacements contrastent vraiment (12, 20, 48, 80, 120).
- **La faiblesse.** About, Services et Programs forment **3 225 px de clair d'affilée** (42 % de la page). Seuls le `#F5F5F5`, le mot rouge et la carte noire les séparent.

---

## 3. Système de mise en page

### 3.1 Invariants mesurés

| Rôle | Valeur @1440 | Statut |
|---|---|---|
| Marges latérales, contenu | **60 px**, contenu de **1 320 px** | [M] |
| Gouttière entre tuiles | **20 px** | [M] |
| Padding vertical des sections | **≈ 120 px** (de 114 à 124 selon la section) | [E] |
| Cadre de filets du hero | à **30 px** des bords (la moitié de la marge) | [M] |
| Repères « + » du hero | 4 repères à y 656, au pas de **432,7**. Les pointes des deux repères extrêmes tombent sur 60 et 1 380 | [M] |
| Piste mise en avant | **≈ √2 (1,4)** fois la piste standard : intro de Why 342/244,5 ; portrait central 325/228 ; colonnes de Programs 727/519 | [M] |
| Axe central | L'élément actif du carrousel Services et le portrait vedette de Why sont **centrés à x = 720** (au pixel près) | [M] |
| Rayons | **0 partout**, sauf les pastilles (tags), l'avatar rond et les points de pagination | [M] |

### 3.2 Grille

- **Aucune grille unique n'explique toute la page.** Une grille de 16 colonnes (gouttière 20) colle aux sections mesurées en haute définition : équipe en 3-3-4-3-3, piliers en 4 + 12. Une grille de 12 colonnes colle à About (cartes en 4-4-4) et au footer.
- **Recommandation (option B d'a1)** :
  - une **grille de page de 16 colonnes**, gouttière 20, marges de 60 (fluides en dessous) ;
  - des lignes nommées pour les sorties en pleine largeur (hero, carrousel, marquee, footer) ;
  - **deux exceptions nommées** : les tiers d'About et le 1 : 2 : 2 des panneaux du footer.
- **Coût de la régularisation** : moins de 40 px d'écart avec la référence partout. **Gain** : un axe commun pour About, Programs et Transformation, qui ont aujourd'hui 5 axes différents sur 425 px.
- **Les trames réglées ne sont pas une grille de contenu.** Ce sont un motif **ancré au viewport** : 1440/11 = 130,9 px, avec les mêmes x d'une section à l'autre [M, v2]. Il faut **un seul motif à l'échelle de la page**, pas un par section. Les panneaux réglés mesurent tous **107 px de haut, 16 rangées au pas de ≈ 6,7** [M, v2].

### 3.3 Échelle d'espacement

Elle repose sur une **base de 4**, organisée en trois séries qui doublent : **12 → 24 → 48**, **20 → 40 → 80** et **60 → 120**. Ces valeurs portent des rôles nommés :

| Rôle | Valeur |
|---|---|
| `tight` | 12 |
| `gutter` | 20 |
| `stack` | 24 |
| `stack-loose` | 40 |
| `header-gap` | 48 |
| `margin-inline` | 60 |
| `block-gap` | 80 |
| `section-pad` | 120 |

En mobile, ces valeurs deviennent fluides : marges de 60 à 20, padding de section de 120 à 64–72, gouttière de 20 à 16.

---

## 4. Typographie

### 4.1 Familles (identification par rendu, puis vérification)

| Rôle | Police | Graisses | Preuve |
|---|---|---|---|
| Display, titres, logo, boutons, tags, chiffres | **Tektur** (Google Fonts, OFL, variable `wght` 400–900 et `wdth` 75–100) | 500 display et chiffres-affiche · 600 H2 et H3 · **700 logo (header et footer), tracking 0** · 400 boutons | IoU **0,96 à 0,97** sur BUILD, STRENGTH et SERVICES., **0,91 à 0,92** sur les H2, **0,94** sur le logo. Meilleur concurrent : 0,77. Signatures : **Y dessiné comme un « y » minuscule**, I à empattements, P ouvert, S à un seul chanfrein en bas à droite, G à barre en marche, R à jambe diagonale, « 1 » à drapeau et pied **dans les chiffres par défaut** |
| Lead | **Inter Tight** | 400, −0,01em | IoU 0,77 à 0,81. Inter seul, même resserré, reste en dessous |
| Corps, UI | **Inter** | 300 ou 400 dans le shot (graisse incertaine) | IoU 0,68 à 0,88 selon la zone |
| Labels, notes | **IBM Plex Mono** | 400, tracking 0 | IoU 0,72 à 0,78 ; le r à empattement de pied élimine Fira, Inconsolata, JetBrains et Red Hat |

- **Les H2 et le display sont-ils de la même famille ?** Oui : c'est Tektur partout, seules la graisse et la taille changent.
- **La vérification adverse (v1b) confirme les trois familles** : aucun des 76 concurrents rendus ne s'en approche. Elle corrige trois détails de a2 :
  - le logo est en **700, tracking 0** (et non en 600 à +0,02em) ;
  - les chiffres 01/02 sont les **chiffres par défaut**, pas `tnum` ;
  - Tektur **contient** la flèche →, mais seulement dans le fichier complet, pas dans le sous-ensemble « latin » de Google Fonts.
- **Rôles non résolus**, trop petits dans la capture basse définition et donc attribués par analogie : marquee, navigation du footer, tags, légendes des stats d'About.

### 4.2 Échelle mesurée (@1440)

| Rôle | Exemple | Taille | Interligne | Tracking |
|---|---|---|---|---|
| Affiche | SERVICES. (ajusté à 97 % du conteneur) | **≈ 273 px** | 1 ligne | −0,02em |
| Wordmark footer | VYRON™ | ≈ 224 px | — | +0,02em |
| Display hero | BUILD / STRENGTH (retrait de 215 px) | **≈ 180 px** | **0,81** | −0,02em |
| Chiffres-affiche | 01✱ / 02✱ (chiffres par défaut) | ≈ 180 px | — | ≈ −0,02 à −0,04em |
| H2 | « HIGH-INTENSITY TRAINING… » | **56 px** | 1,0 | −0,01 à −0,02em |
| Logo header | VYRON™ | 48 px (Tektur 700) | — | 0 |
| Lead | « Redefine Your Physical Potential » | 40 px | 0,98 | ≈ −0,045em |
| H3 | cartes, accordéon, phrase About | **32 / 34 / 39 px** (trois valeurs pour un même rôle) | ≈ 1,03 | −0,01em |
| Accent | « Results are built, not given. » | 24 px | 1,15 | — |
| UI | slogans du hero, boutons, MENU | 15–19 px | — | — |
| Corps | cartes et colonnes | **16 px** | 1,25–1,3 | −0,02 à −0,04em |
| Labels mono et tags | — | 15–16 px | 1,3 | 0 |
| Index | 01–05 de l'équipe | **12 px** | — | — |

**Lecture.** L'échelle a **deux étages**, un étage « affiche » (273 / 224 / 180) et un étage « lecture » (56 et moins), séparés par un saut de **× 3,2**. Ce saut fait l'énergie de la page : **à garder**. Les défauts sont tous en bas de l'échelle :
- trois tailles de H3 pour un même rôle ;
- quatre traitements différents du rôle « label » (mono en casse de phrase, mono en capitales, Tektur en capitales, Inter en capitales) ;
- un corps en Light, avec un tracking serré, sur fond sombre ;
- un micro-texte à 12 px.

### 4.3 Recommandations typographiques

1. **Tektur reste l'autorité.** Quatre graisses par rôle, `wdth 100`. Les chiffres-affiche gardent les **chiffres par défaut** (fidèles à la référence). `tabular-nums` est réservé aux chiffres qui **changent** (compteurs à rouleaux, « 01 / 03 »), pour qu'ils ne sautillent pas.
2. **Corps en Inter 400**, 16 px, tracking −0,011em, interligne **1,45 sur clair** et **1,5 sur sombre**, au lieu du Light serré du shot.
3. **Fusionner les H3 à 36 px.** **Deux rôles de label** au lieu de quatre : la métadonnée en mono, la catégorie en Tektur 500 capitales à +0,02em. **Rien sous 14 px.**
4. **Échelle fluide** en `clamp()` avec des bornes en rem (respect du zoom, WCAG 1.4.4). Les mots ajustés à la largeur (SERVICES., wordmark) passent en **unités `cqi`**, pas en `vw`, pour éviter le débordement dû à la barre de défilement. Le tableau complet des 14 rôles est en [annexe a2 §5](annexes/a2-typography.md).
5. **Pièges propres à cette maquette** :
   - **Accents français et interligne de 0,81** : un « É » en 2ᵉ ligne mord d'environ 10 px dans la 1ʳᵉ à 180 px. Il faut un interligne d'au moins 0,9 dès qu'une capitale accentuée tombe en ligne 2.
   - **Masques de révélation ligne par ligne** : ils rognent accents et cédilles. Il faut un débord vertical (`clip-path: inset(-0.2em 0)` ou un padding compensé), et retirer le masque une fois l'animation finie.
   - **Découpage du texte** (SplitText) **seulement après `document.fonts.ready`**, sinon les coupures de lignes sont fausses (CLS).
   - **Alignement optique** : BUILD est compensé d'environ −0,056em, SERVICES. ne l'est pas. Il faut une règle unique.
6. **Livraison** :
   - Tektur variable : 19,2 Ko (latin), avec un sous-ensemble sur mesure si l'on veut la flèche → native ;
   - Inter Tight (lead) : 44,9 Ko, plus Inter variable (corps) : 72,9 Ko. Pour n'avoir que trois fichiers, Inter seul à −0,05em, au prix d'une fidélité moindre (IoU −0,07) ;
   - Plex Mono 400 : 14,7 Ko.
   - Toutes sont auto-hébergées, et **seule Tektur est préchargée** (le texte du hero est candidat LCP).
   - Polices de repli à métriques ajustées.
   - `font-synthesis: none`.

> **Couverture du français (v1b)** : Tektur 1.005 couvre É È Ê À Â Ç Î Ô Ù Û Ü Ÿ Œ Æ « » ’ “ ” … – —, l'espace insécable et ™. **Seule l'espace fine insécable U+202F manque** (même chose pour Plex Mono) : le navigateur la prend dans la police de repli, ou l'on utilise U+00A0. Pas d'astérisque dans Tektur : l'astérisque à 8 branches est un SVG.

---

## 5. Couleur et matière

### 5.1 Palette mesurée

| Rôle | Valeur | OKLCH | Où |
|---|---|---|---|
| **Rouge de marque**, un seul rouge pour tous les aplats | **`#F02B42`** | 61,9 % 0,227 21,9 | SERVICES., boutons, astérisques, marquee, onglet du footer |
| Rouges photo (étalonnage) | `#600405` → `#8D0C0F` → `#C9141B` | teinte 27–31° (plus chaude que l'interface) | hero, footer, carte 02 |
| **Encre des titres** (marine, pas noir) | **`#171A32`** (valeur dominante, environ 28 000 px). Selon la méthode d'échantillonnage, les mesures vont de `#0B1024` à `#141A2C` | ≈ 22 % 0,037 269 | H2 et H3 sur clair |
| Noir « hot » | `#000000` | — | bas du hero, carte active, bouton noir, chiffres, footer |
| **Nuit sarcelle** | **`#040F0E`** | 15,6 % 0,018 189 | toute la section Why |
| Papier / papier alternatif | `#FFFFFF` / `#F5F5F5` | — | About, Programs, Transformation / Services |
| Filets | `#DCDCDC`–`#ECECEC` sur clair ; `#1F2A29` sur nuit ; blanc 15–20 % sur photo | — | — |
| Gris de texte | `#77787B` sur blanc ; `#949F9E` et `#C4CECD` sur nuit | — | — |

**Deux noirs de titre coexistent.** Le H2 de Transformation est en `#000` neutre, les autres H2 en marine `#171A32` [M, v2]. Il faut choisir (§15).

### 5.2 Stratégie couleur, en termes Impeccable

**Corps « Restrained », serre-livres « Drenched », une bande « Committed ».**
- **Hero et footer** sont des champs rouges : 54 % du hero est rouge, le reste est son ombre noire.
- **D'About à Transformation**, ce sont des neutres par matière, avec un seul accent rationné entre 0,4 et 7,6 % de surface par section.
- **Le marquee** fait 47 à 55 px de rouge plein (97 %) : c'est la charnière qui relance le rouge avant le footer.

**Règle de rationnement à conserver.** Jamais deux grands aplats rouges dans une même section. Le rouge marque **une action, un mot ou un signe**, jamais un fond du corps de page.

**Température.** Le système oppose un rouge chaud à une matière froide. Hormis la peau, le rouge est la seule teinte chaude : encre marine à 269°, nuit à 189°, photos de l'équipe à 258°.

### 5.3 Système de matières

```
HOT ─▶ PAPER ─▶ PAPER-ALT ─▶ PAPER ─▶ NIGHT ─▶ PAPER ─▶ SIGNAL ─▶ HOT
hero    about    services     programs  why      transfo  marquee   footer
```

- **Aucune ombre portée sur toute la page.** L'élévation passe par trois moyens :
  - un pas de clarté (cartes `#FFF` sur sol `#F5F5F5`) ;
  - des filets ;
  - le motif « deux plaques décalées ».
- **Textures mesurées** : grain marbré sur la carte rouge 4.9/5, marbrure béton sur la carte grise « 20 Years ». Aucun grain ailleurs.

### 5.4 Contrastes (WCAG 2.2 AA) : ce qui échoue, et comment le corriger sans changer la teinte

Ratios recalculés indépendamment.

| Paire | Ratio | Verdict | Correction proposée |
|---|---|---|---|
| Blanc sur `#F02B42` (boutons, marquee, onglet footer, carte 4.9) | **4,09** | ❌ | Remplissage **`#E41E3A`**, soit **4,62**. Écart de clarté de 2,9 points, quasi invisible |
| Petit texte rouge `#F02B42` sur blanc / `#F5F5F5` | 4,09 / 3,76 | ❌ (sous 24 px) | **`#C2152C`**, soit 6,11 / 5,60 |
| Rouge sur nuit `#040F0E` | 4,75 | ✅ (3,20 en protanopie) | **`#F64D57`**, soit 5,67 (4,11 en protanopie) |
| Labels « EXPERT COACHES » `#687372` sur nuit | 3,97 | ❌ | **`#788382`**, soit 4,97 |
| Index de l'équipe `#606B6A` sur nuit, à environ 10–12 px | 3,53 | ❌ | `#788382` et 14 px minimum, ou décoratif (`aria-hidden`) |
| Corps gris `#77787B` sur blanc | 4,41 | ❌ (de peu) | **`#68696C`**, soit 5,49 |
| Mono « Trusted by… » `#797A7B` sur `#F5F5F5` | 3,94 | ❌ | `#68696C`, soit 5,03 |
| **Sous-titre du hero** sur la peau éclairée | **2,0 à 2,9** | ❌ (grand texte, 3:1 requis) | Image générée avec une **zone sombre prévue** sous le texte (recommandé) ou voile local de 20 à 35 % |
| Encre marine sur blanc | 17,1 | ✅ | — |

**Le nœud du rouge.** Un seul rouge ne peut pas porter à la fois du **blanc en texte courant** (il faut une luminance L ≤ 0,183) et du **texte rouge sur la nuit** (il faut L ≥ 0,193). Les deux plages ne se recouvrent pas. Il faut donc des **rôles de rouge** :
- `red-500 #F02B42` pour le display, les glyphes et les grandes surfaces sans texte ;
- `red-600 #E41E3A` pour les remplissages qui portent du texte blanc ;
- `red-700 #C2152C` pour le petit texte rouge sur papier ;
- `red-400 #F64D57` pour le texte rouge sur nuit.

### 5.5 Tokens

Le jeu complet (primitives OKLCH et hex, sémantiques par matière, surfaces navigateur) est en [annexe a3 §5](annexes/a3-color.md). Il couvre :
- **les opacités converties en couleurs explicites**, sauf sur photo (règle `colorize`) ;
- **les surfaces navigateur thématisées** (`::selection`, anneau de focus par surface, `caret-color`, `scrollbar-color`, `theme-color`), une exigence du craft-floor ;
- **le focus** : un token `--focus` par surface (encre sur clair, blanc sur rouge et sur sombre), toujours en `outline`, jamais en `box-shadow`, qui disparaît en mode contrastes forcés.

---

## 6. Composants et motifs signature

### 6.1 Les signatures, par poids identitaire (sans elles, ce n'est plus ce monde)

1. **`StepShape`, la silhouette à gradin.**
   - **Construction** : union de deux rectangles **de même couleur**, avec des encoches **toujours en haut à droite et en bas à gauche**. Ce n'est **pas** une ombre.
   - **Modèle** : un polygone à 8 points avec un pas horizontal `dx`, un décalage haut `t` et un décalage bas `b`. **`t ≠ b`** : par exemple 13/4/11 pour « Meet the Team » et 12/6/14 pour la tuile flèche [M, corrigé par v2].
   - **Pas** : fixe sur les contrôles, proportionnel sur les images (11 à 14 % de la largeur).
2. **L'astérisque à 8 branches.**
   - **Forme** : 4 barres à bouts carrés, épaisseur égale à 19–20 % du diamètre.
   - **Couleur** : blanc dans le hero, rouge ailleurs.
   - **Placement** : collé aux chiffres géants (« 01✱ »).
3. **Tektur à échelle géante.** BUILD/STRENGTH en escalier, SERVICES. ajusté à la largeur, 01/02, wordmark.
4. **La palette tri-ton stricte.** Un rouge, des noirs (pur, marine, sarcelle) et du papier.
5. **Les trames « tableur ».** 11 colonnes en séparateurs et en panneaux, plus les filets techniques et les repères de calage : le registre de la mesure.
6. **La règle graduée des eyebrows.** 13 graduations alignées par le haut, irrégulières (12/11/10/…/8/12) [M, v2].
7. **La direction photo.**
   - Monochrome rouge et flou de bougé dans le hero.
   - Code d'état dans les cartes Services : une carte inactive est en **N&B**, la carte active en **rouge**.
8. **Le carrousel coupé net par le cadre**, avec la carte active inversée en noir au centre de la page.
9. **Les compositions asymétriques à √2.**
10. **Le marquee rouge, puis le footer** avec son wordmark géant ancré à environ 30 px du bas.

### 6.2 Inventaire, version courte

Le détail complet (anatomie, cotes, variantes, états proposés) est en [annexe a4](annexes/a4-components.md).

| Niveau | Composants |
|---|---|
| **Tokens** | couleurs, matières, espacements, grille, mouvement (durées, courbes, pas) |
| **Primitives** | `StepShape`, `Asterisk` (SVG), `Hairline` / `FrameRules`, `RuledGrid` (`strip` et `panel`, `light` et `dark`), `TickRuler`, `Crosshair`, `Icon` (un seul jeu au trait) |
| **Composants partagés** | `StepButton` (noir, rouge), `IconButton` (blanc, rouge, rouge-lg, gris, carré sombre), `StepFrame` (média), `SectionHeader` (`split`, `offset`, `stacked`), `Wordmark` (sm, xl), `Eyebrow` (selon la décision du §8) |
| **Organismes** | `SiteHeader` + `MenuTrigger` + menu plein écran ; `HeroHeadline`, `HeroTaglineList`, `HeroLede` + `ArrowTrail` ; `RatingCard`, `StatCard`, `AvatarStack` ; `DisplayWord`, `ServiceCarousel`, `ServiceCard`, `NumeralMark` ; `ProgramAccordion`, `TagPill`, `CoachChip` ; `FeatureTable`, `TeamGrid` ; `TestimonialDeck` (cartes empilées, `SlideCounter`, `QuoteBlock`, contrôles) ; `MarqueeBand` ; `SiteFooter`, `FooterPanel`, `SocialLinks` |

### 6.3 États figés lisibles dans la maquette

La maquette est statique, mais elle montre déjà **cinq états actifs**. Le motion consistera d'abord à animer la transition **entre** ces états.

| Où | Ce que montre la maquette | Lecture |
|---|---|---|
| Services | Carte 02 inversée (noire) au centre ; cartes 01 et 03 à moitié hors cadre | Carrousel centré [M géométrie, I comportement] |
| Programs | Item 01 ouvert (−), les autres fermés (+) | Accordéon exclusif |
| Why | Portrait 03 élargi (≈ 1,42 ×) et plus lumineux | Mise en avant au survol, ou fixe |
| Transformation | « 01 » et bouton précédent grisé, **mais** c'est le 2ᵉ des 3 points du pager qui est actif | **Contradiction** à trancher. La plaque sous la vidéo est **une 2ᵉ carte empilée** (v2), pas une barre de lecture |
| Footer | La rangée d'en-tête du panneau 2 est remplie de rouge (« Back To Home ») | État survol ou actif d'un en-tête de panneau, qui est un lien |

### 6.4 Incohérences de la référence (classement « polish »)

| Incohérence | Classe | Correction |
|---|---|---|
| Pas du gradin variable selon l'occurrence | missing token | Deux échelles : `--step-control` (≈ 12/4/12) et `--step-media` (≈ 12 % / 7 % / 20 %) |
| Deux encres de titre (marine, et `#000` pour le H2 de Transformation) | missing token | Unifier en marine ; les gros chiffres restent en `#000` (§15) |
| Pastilles, avatar et points de pagination arrondis dans un monde sans rayon | conceptual mismatch | Les passer en carré (rayon 0 à 2) |
| Flèche coudée à bouts ronds | conceptual mismatch | `stroke-linecap: square` |
| Boutons sociaux sans gradin | one-off | Les intégrer au système `IconButton` |
| Casse des eyebrows et des CTA (« About Us » contre « WHY VYRON », « Meet the Team » contre « Learn More About Us ») | local defect | Une seule règle |
| Ponctuation finale des titres (avec et sans point) | local defect | Une seule règle |
| Note à droite du H2 : centrée dans Services, alignée en bas ailleurs | local defect | Toujours sur la **dernière ligne de base** du H2 |
| Apostrophe et guillemets droits (DON'T, "I came…") | local defect | ’ et « » (ou “ ”) |
| « Marcus Roy » a **deux visages** (avatar dans Programs, portrait n°03 dans Why) | conceptual mismatch | Une seule source par coach (données et image) |
| Le marquee dit « Fitness Hub », pas le nom de la marque | local defect | Contenu de marque (§15) |

---

## 7. Critique Impeccable (Assessment A)

> **Méthode** : Assessment A menée par un agent isolé (a5). Assessment B (détecteur) **non applicable** : il n'y a pas de markup. Elle sera lancée sur le code construit.

### 7.1 Verdict de spécificité

**La coquille est signée, le squelette est générique.** L'enveloppe visuelle appartient bien à une marque : display carré monumental, rouge rationné, noir sarcelle, plaques décalées, repères de calage. La structure, elle, est celle du template « gym Dribbble » : titre au-dessus d'une rangée de cartes (About, Why), hero-metric, eyebrows partout, 5 portraits souriants, témoignage unique. Le texte est interchangeable à 100 %.

**L'occasion manquée.** L'univers « feuille de registre et impression » colle parfaitement à une salle de **force**, où l'on note charges et progrès dans un carnet. Pourtant les trames restent du décor. Si une trame devenait **le planning des cours ou le carnet d'entraînement**, le motif porterait l'information **et** la conversion.

### 7.2 Heuristiques de Nielsen

| # | Heuristique | Score | Point clé |
|---|---|---|---|
| 1 | Visibilité de l'état | 2 | Pas de position dans le carrousel ; compteur « 01 » qui contredit le pager |
| 2 | Correspondance avec le monde réel | 2 | « Services », « Programs » et « Classes » pour une même offre ; ↪ (qui veut dire « refaire ») utilisé pour « suivant » ; rien ne dit « salle de sport » |
| 3 | Contrôle et liberté | 2 | Carrousel sans « précédent » ; « Back To Home » sur la page d'accueil ; marquee sans pause |
| 4 | Cohérence et standards | 3 | Système visuel solide, mais trois vocabulaires de flèches et deux visages pour un même coach |
| 5 | Prévention des erreurs | 2 | Fausses affordances : slogans en liste à filets, flèches → → → qui ne mènent nulle part |
| 6 | Reconnaissance plutôt que rappel | 2 | Navigation desktop cachée derrière MENU ; icônes sans libellé |
| 7 | Flexibilité et efficacité | n/a | Surface Persuade |
| 8 | Esthétique et minimalisme | 3 | Hiérarchie forte ; du décor (6 trames, eyebrows, index) qui coûte de la hauteur |
| 9 | Récupération des erreurs | n/a | Aucun formulaire (et c'est en soi le problème P0) |
| 10 | Aide | n/a | Surface Persuade |
| | **Total** | **16/28 (57 %)** | « Acceptable » : de vrais problèmes d'usage sous une très bonne surface |

**Charge cognitive** : 3 critères en échec sur 8 (charge modérée).
- **Focus unique** : le hero n'a pas de tâche principale.
- **Hiérarchie de l'action** : l'élément le plus saturé du footer est « Back To Home ».
- **Choix minimaux** : le footer présente **11 cibles** sans hiérarchie.

**Parcours émotionnel.** Le pic (hero) et la fin (footer) sont deux moments de marque forts, mais **ni l'un ni l'autre ne porte l'action**. On garde le souvenir sans convertir. Il y a deux creux : About (preuves vagues) et surtout Transformation, la section de preuve, qui est la plus faible.

### 7.3 Ce qui fonctionne

1. **La typographie comme architecture.** Une seule voix à trois échelles. L'escalier BUILD / STRENGTH prolonge le coup de poing de l'athlète.
2. **Une palette rationnée et un rythme clair / sombre.** Les gris secondaires sont **teintés** de la couleur du fond, exactement la règle Impeccable « derive secondary text from the surface hue ».
3. **Un motif graphique propre et cohérent.** La double plaque se prête naturellement à une micro-interaction : la plaque se remet en registre au survol ou à l'appui.

### 7.4 Problèmes prioritaires

| Sévérité | Problème | Correctif | Commande Impeccable |
|---|---|---|---|
| **P0** | Aucune action primaire opérante. L'offre n'est pas lisible au premier écran (ni prix, ni horaires, ni adresse, ni essai) | Une action de réservation dans le hero, posée **sur** les flèches → → →, sans changer la composition ; un CTA persistant ; footer qui se termine sur « Réserver » avec les infos pratiques | `shape`, puis `layout` |
| **P0** | Pas de version mobile ni tablette | Plan de recomposition section par section (§10) | `adapt` |
| **P1** | Texte interchangeable et preuves inventées (« 4.9/5 · 480+ verified reviews », « 20 Years ») | Donner un point de vue à la marque ; étiqueter toute la fiction | `clarify` |
| **P1** | Accessibilité de la marque : contraste du rouge, gris trop clairs, cibles sous 44 px, marquee sans pause | §5.4 et §10 | `audit`, puis `harden` |
| **P1** | H1 hors écran au chargement à 1440 × 900 | Hero en `100svh` avec le H1 calé en bas | `layout` |
| **P2** | Navigation et contrôles ambigus (MENU seul sur desktop, ↪ entre deux cartes, compteur contradictoire) | Un seul jeu d'icônes ; prev / next attachés au carrousel avec compteur « 02 / 05 » | `clarify` |
| **P2** | Du décor structurel sans information (eyebrows, 6 trames, index, cellules Why vides à 68 %) | Trancher le §8 | `distill` |

**Personas** : le détail est en [annexe a5 §8](annexes/a5-critique.md). En résumé :
- **Jordan** (première fois) abandonne au hero ;
- **Casey** (mobile) n'a aucune maquette ;
- **Camille** (directrice de création qui parcourt ton portfolio en 60 s) cherche le crédit au designer d'origine, un mobile soigné, le respect de `reduced-motion` et aucun lien mort ;
- **Karim** (34 ans, reprend le sport) ne trouve ni le prix, ni l'adresse, ni « débutants bienvenus ».

---

## 8. Tensions avec le craft-floor d'Impeccable : à toi de trancher

Impeccable dit à la fois « *the brief wins* » (tu as épinglé ce monde) et, pour les eyebrows, « *no brief earns it back* ». Voici chaque tension, avec ce que je recommande dans l'option **« adaptation ciblée »** :

| # | Habitude de la référence | Règle Impeccable | Porteuse pour ce monde ? | Recommandation |
|---|---|---|---|---|
| 1 | **Eyebrows** (règle graduée et label mono) sur 4 sections | **Interdit, sans exception** | Le **label** n'apporte rien. La **règle graduée** est un vrai motif | **Garder la règle, supprimer le label, et la rendre fonctionnelle** : elle devient l'indicateur de progression de la section, et ses graduations se remplissent au scroll |
| 2 | **Numéros** 01/02 (services), 01–04 (accordéon), 01–05 (équipe), 01 (témoignage) | Seulement si la séquence apporte une information | Forte pour « 01✱ 02✱ » (masse graphique), faible ailleurs | Garder 01✱/02✱ (composition, `aria-hidden`) et le compteur **« 01 / 03 »**. Retirer les index de l'accordéon et de l'équipe, ou les remplacer par une donnée (durée, spécialité) |
| 3 | **Cartes « hero-metric »** (4.9/5, 20 Years) | Template par défaut | Surtout pour **la masse rouge** de la section | Garder la masse rouge, mais avec un contenu qualitatif : un extrait d'avis signé, assumé comme fictif. « 20 ans » se fond dans une phrase |
| 4 | **Plaques décalées** | Les ombres dures décalées sont refusées hors néobrutalisme | **Très forte (signature n°1)** | **Garder.** Les construire comme une **forme** (`clip-path` à 8 points, ou pseudo-élément de même couleur), jamais en `box-shadow`. Les réserver aux contrôles et aux médias |
| 5 | **Mono** pour les eyebrows, les notes, la navigation du footer | Le mono ne doit pas servir de costume « tech » | Moyenne (texture de fiche technique) | **Mono réservé aux données** : durées, horaires, compteurs, tags. Phrases et navigation passent en Inter |
| 6 | **Cartes de même taille** (piliers Why, cartes About) | Template par défaut | Moyenne : les piliers ressemblent à un tableau de specs | Faire de chaque pilier une vraie ligne de specs, avec une donnée par colonne (fictive et assumée) |
| 7 | **Display au-delà de 6rem** (180–273 px) | Maximum 6rem | **Très forte : l'échelle est l'identité** | **Garder** (le brief l'emporte), avec `clamp()`, `cqi` et des tests de débordement à chaque palier |
| 8 | **Glyphes ✱ → ↪ en Unicode** | Interdits comme icônes | Forte (l'astérisque est une signature) | Tout passe en **SVG dessiné** : un seul jeu d'icônes, un seul trait |
| 9 | **Bandes « verre cannelé »** à droite du hero | Verre et flou décoratifs refusés | Faible | Les intégrer à l'image générée, ou les supprimer. Pas de `backdrop-filter` |

---

## 9. Plan d'animation

### 9.1 Thèse (Impeccable `animate` : un moment signature, pas des effets dispersés)

**Moment signature recommandé : « Vitesse → Arrêt » (l'image rémanente).**

- **Le constat de départ.** Tous les blocs en escalier sont **un objet et sa trace décalée**. C'est la version figée et graphique du **flou de bougé** des photos du hero et du footer.
- **La séquence**, au chargement :
  1. le hero arrive « en pleine vitesse » : stries horizontales, typo qui arrive avec deux échos rouges ;
  2. tout freine net et se fige ;
  3. les échos se résorbent ;
  4. les filets se tracent depuis les repères « + », qui se « verrouillent » ;
  5. l'astérisque avance d'un cran de 45°.
- **Durée** : au plus 1,3 s. **Contrat** : la page est cliquable dès t = 0, sans préchargeur.
- **Contrainte technique** : la photo LCP n'est **jamais** à opacité 0. La couche striée est un aperçu basse définition étiré, qui sert aussi d'état de chargement.
- **Ce que j'ai écarté** :
  - « Calibrage » (les filets qui partent des repères) : il est absorbé dans la phase 3 du moment signature ;
  - « Chargement de la barre » (lettres qui tombent) : réduit à un discret écho de fin de page, sur le wordmark du footer.

### 9.2 Grammaire

| Tokens | Valeurs |
|---|---|
| Courbes | `--ease-out cubic-bezier(.16,1,.3,1)` pour les arrivées ; `--ease-in` pour les sorties ; `--ease-in-out` pour le layout ; `--ease-strike cubic-bezier(.87,0,.13,1)` pour les crans d'astérisque. Ni rebond ni élastique |
| Durées | appui 90 · feedback 140 · état 240 · layout 420 · overlay 480 · focal 650–900 · plafond de séquence 1 300 ms. Une sortie dure environ 0,65 fois l'entrée |
| Distances | les **pas mesurés** de l'escalier : 5 / 12 / 27 / 70 px. Un bloc ne bouge jamais d'une valeur arbitraire, il bouge **de son propre pas** |
| Décalages (stagger) | 40 / 60 / 80–90 ms, total plafonné à 240 ms, jamais caractère par caractère sur du texte courant |
| Principes | L'état par défaut est **l'état final**. Les états initiaux n'existent que sous `html.motion`, avec un garde-fou de 3 s. **Les H2 ne s'animent pas.** Chaque section a **une seule** entrée, tirée de sa propre matière |

**Comportement physique de la plaque**, appliqué à tous les `StepShape` :

| État | Ce que fait la plaque |
|---|---|
| Entrée | Elle se **soulève** : `--step` de 0 à sa valeur |
| Survol | La trace s'allonge (× 1,5) |
| Appui | Elle s'**enfonce** : `--step` à 0 |
| Focus | Le contour se resserre, en écho aux repères |
| Désactivé | Elle est plate |

Le tout passe par une propriété `@property --step` animée sur le compositeur.

### 9.3 Chorégraphie, résumé

Le tableau complet (déclencheur, propriétés, durée, primitive, version reduced-motion, priorité) est en [annexe a6 §4](annexes/a6-motion.md).

| Section | Mouvement | Priorité |
|---|---|---|
| Hero | Moment signature. Puis, au scroll, les stries reviennent avec la **vitesse** de défilement | MUST, puis SHOULD |
| About | Compteurs **à rouleaux** (« 4.9 » qui se pose, pas un comptage de 0 à n) ; la plaque photo se soulève | SHOULD |
| Services | « SERVICES. » toujours lisible en contour, **se remplit** au scroll (scrub) avec la trame qui « mesure » ; carrousel en scroll-snap avec la tuile ↪ re-parentée (Flip) et inversion de la carte active | SHOULD / MUST |
| Programs | Accordéon en `grid-template-rows` 0fr → 1fr, contenu en cascade, compensation de scroll ; image qui se « ré-encoche » au changement | MUST |
| Why et équipe | Seuls les filets du tableau se tracent ; portraits révélés par masque ; la colonne survolée devient la vedette (CSS `:has()`) | SHOULD |
| Transformation | **Pile de cartes** : la carte suivante sort de la pile ; citation ligne par ligne ; compteur à rouleau ; **pas d'autoplay** | MUST |
| Marquee | Vitesse couplée au scroll (plafond × 5), pause au survol et au focus, statique en reduced motion | MUST |
| Footer | Le geste du hero rejoué « en arrivant » sur le wordmark ; les en-têtes de panneau se remplissent de rouge au survol | SHOULD |
| Global | **Cliquet des astérisques** : une seule loi (un cran de 45° tous les ~320 px de scroll) pour les 6 occurrences | SHOULD |

**Micro-interactions** (100 % CSS, actives avant le chargement du JS) :
- plaque soulevée ou enfoncée ;
- flèche de la tuile redessinée ;
- grille 3 × 3 du MENU qui se réarrange en × ;
- menu plein écran qui descend comme un **rideau au bord en escalier** ;
- soulignés qui se tracent puis se rétractent vers la droite ;
- focus qui se « verrouille ».

Aucune affordance de survol sur un élément non cliquable (pastilles).

### 9.4 Systèmes globaux

| Sujet | Recommandation |
|---|---|
| **Lenis** | **Oui, sous conditions** : desktop, pointeur fin, pas de reduced motion, scroll tactile natif. Piloté par le ticker GSAP. `anchors: true` avec déplacement du focus, `lenis.stop()` quand le menu est ouvert. Sans scrub, il ne vaut plus son coût |
| Préchargeur | **Non.** L'état de chargement, c'est la couche striée |
| Curseur personnalisé | **Non.** Il masque les affordances natives et n'existe pas au tactile |
| Barre de progression | Pas de barre générique. Si on garde la règle graduée, elle devient l'index de navigation des sections |
| Transitions de page | Seulement s'il y a des sous-pages (§12) |
| Pause globale | Interrupteur « Mettre les animations en pause » (marquee, vidéo), mémorisé |

### 9.5 Trois niveaux d'intensité

1. **Sobre** : seulement les MUST.
2. **Recommandé** : MUST et SHOULD, avec en plus **O3**, des échos liés à la vitesse sur SERVICES. et le wordmark, 2 clones plafonnés à ± 27 px.
3. **Overdrive** : en plus **O1**, un vrai **flou directionnel en WebGL** (OGL, environ 12,5 Ko) sur la photo du hero, piloté par le chargement, la vitesse de scroll et le pointeur. Seulement sur un appareil capable, chargé après le LCP, avec repli sur la version CSS.

**Effet rejeté** : le décalage RVB (glitch). C'est un autre monde, et il se bat avec le rouge de la marque.

**Budget** : JS motion de 45 à 55 Ko gzip, overdrive à au plus 15 Ko à la demande, 60 fps sur un mobile milieu de gamme, CLS nul au chargement.

---

## 10. Responsive, accessibilité, performance

### 10.1 Paliers (mobile d'abord, en em, guidés par le contenu)

Base sous 40em (640), puis 40em, 48em (768), 64em (1024, où les compositions en 2 colonnes et le retrait du H1 apparaissent) et 80em (1280, composition complète avec les trames et les repères). Au-delà, le contenu est plafonné à 1 320 px et centré, avec des fonds en pleine largeur. **Requêtes de conteneur** pour les cartes de service, d'équipe et de stats, et pour les panneaux du footer.

| Section | 768 | 390 |
|---|---|---|
| Hero | Retrait de STRENGTH réduit à 0–0,3em ; sous-titre sous le H1 | `100svh`, H1 de 68 px sans retrait, slogans en 2 × 2, recadrage 9:16 dédié, CTA en pleine largeur puis **barre CTA fixe sous le pouce** |
| About | Cartes en « note + années » puis photo | Cartes empilées |
| Services | Cartes égales à 60vw en scroll-snap, avec prev / next et compteur | **Pile verticale** de cartes complètes, la carte au centre de l'écran prenant l'état actif (ou rail à 84vw) |
| Programs | 1 colonne, image en 16:9 | Toute la ligne cliquable, icône dans une zone de 44 × 44 |
| Why | Piliers en 2 × 2 ; équipe en **bento** (vedette à gauche, 2 × 2 à droite) | Piliers en liste, sans le vide central ; équipe en 1 + 4 |
| Transformation | Vidéo en 16:9 pleine largeur, points à l'horizontale | Contrôles `[‹] 01 / 03 [›]` en 44 × 44 |
| Footer | Panneau principal en pleine largeur, puis 2 à 50 % | Panneaux empilés, chacun en lien sur toute sa surface ; wordmark en `cqi` |

### 10.2 Accessibilité (WCAG 2.2 AA) : points clés

- **Contrastes** : §5.4.
- **Cibles** : MENU, téléphone et flèches à **44 × 44**, points de pagination à **24 px minimum**.
- **Focus visible** sur toutes les surfaces, et non masqué par le header collant (2.4.11, `scroll-padding-top`).
- **Accordéon** : pattern APG (`<h3><button aria-expanded>`), avec `hidden="until-found"` pour que Ctrl+F ouvre le bon panneau.
- **Carrousels** : pattern APG, diapositives inactives en `inert`, `aria-live` seulement après une action, **pas d'autoplay**, une alternative au glissement (2.5.7).
- **Menu** : `<dialog>` modal, qui fournit nativement le fond inerte, le piège de focus, Échap et le retour du focus.
- **Marquee** : `aria-hidden`, avec une pause accessible au clavier (2.2.2).
- **Vidéo** : muette et décorative avec un bouton pause, **ou** parlée avec sous-titres WebVTT.
- **Motifs** : tous en `aria-hidden` (astérisques, repères, trames, échos). Les capitales s'écrivent en casse normale avec `text-transform`.
- **Contrastes forcés** : bordures sur les boutons, SVG en `currentColor`, focus en `outline`.
- **Sans JS** : tout le contenu reste visible ; les panneaux de l'accordéon sont ouverts.

### 10.3 Performance : cibles

| Indicateur | Cible |
|---|---|
| LCP (la photo du hero, en `<Picture priority>`, jamais en fond CSS) | ≤ 1,8 s en labo, ≤ 2,5 s sur le terrain |
| CLS | ≤ 0,05 |
| INP | ≤ 150 ms |
| JS au premier chargement | ≤ 60–75 Ko gzip, **un seul moteur d'animation** |
| Polices | ≤ 110–120 Ko |
| Image du hero en AVIF, 1440w | ≤ 150–200 Ko |
| Lighthouse | Performance ≥ 90 sur mobile (95 visé) ; Accessibilité, Bonnes pratiques et SEO à 100 |

### 10.4 Texte français : ce qui casse en premier

1. **Titres d'accordéon** : jusqu'à +38 %. Le titre anglais occupe déjà 711 des 725 px.
2. **Labels Why** : « ACCÈS 24 H/24, 7 J/7 » fait +82 %.
3. **Boutons à escalier** : +41 à +46 %. Leur largeur doit suivre le contenu.
4. **Titres des cartes de service inactives**.
5. **H2 de Why** : +32 %.
6. **H1**, si sa formulation change.

« SERVICES. » ne change pas. Il faut tester systématiquement « ÉLITE », « ÇA » et « À FOND » dans le display.

---

## 11. Images (Higgsfield)

- **Rien n'a été généré.** Seuls des outils en lecture seule ont été appelés. Solde : **694,5 crédits**, plan Plus.
- **Inventaire** : environ **21 emplacements visibles**, jusqu'à 27 avec les éléments cachés :
  - hero ;
  - coach et 5 avatars d'About ;
  - 3 images de services ou plus ;
  - image et avatar de Programs ;
  - 5 portraits d'équipe ;
  - 1 à 3 témoignages ;
  - footer ;
  - 2 textures.

  Le détail des formats, points focaux et zones calmes réservées à l'interface est en [annexe a8](annexes/a8-imagery.md).
- **Casting récurrent fixe.** Un même nom correspond à un même visage partout : on corrige le double « Marcus Roy ». Le casting est divers en âge, en origine et en morphologie, et **les identités sont nouvelles** : on ne reproduit pas les modèles du shot. La cohérence passe par des **reference elements** Higgsfield (`vyron-…`).
- **Quatre familles d'étalonnage**, appliquées en post-production par LUT versionnée pour une cohérence garantie :

| Famille | Images | Traitement |
|---|---|---|
| **Crimson velocity** | hero, footer, état actif des services | Décor cramoisi, peau naturelle, flou de bougé sur le décor seulement |
| **Teal night** | équipe, Programs, coach | Ombres tirées vers `#040F0E` pour fondre dans la section |
| **Mono** | état inactif des services | N&B. L'état rouge peut être un duotone CSS animable à partir d'une seule image |
| **Warm film** | témoignages | Noirs relevés, ambre |

- **Modèles** :
  - Nano Banana Pro (portraits et ancres d'identité) ;
  - Cinema Studio Image 2.5 (action, 4k) ;
  - Kling 3.0 (boucle hero : image de début = image de fin, son coupé) ;
  - Seedance 2.0 (témoignages en 21:9).
- **Budget** : environ 320 à 415 crédits pour les images fixes. Le coût des vidéos n'est pas lisible sans générer : il faut **un pilote de calibrage** (1 image par modèle, 1 clip de 5 s), puis la production par lots.
- **Éthique, non négociable** :
  - **aucune image du shot** n'est envoyée à Higgsfield (ni upload, ni img2img, ni référence de visage) ;
  - **aucune marque** dans les images (le swoosh Nike et les lettrages de la référence) ;
  - témoignages et avis **étiquetés comme fictifs** ;
  - pas de « talking head » synthétique ;
  - provenance de chaque raster intégrée au fichier (`impeccable embed-prompt`), avec un manifeste des assets.

---

## 12. Stack recommandée

### 12.1 Recommandation

Cas par défaut : site **autonome**, **une page** comme le shot, objectif « montrer une étendue ».

| Couche | Choix | Version au 2026-10-02 |
|---|---|---|
| Framework | **Astro**, sortie statique, une page (`index` + `404`) | `astro@7.3.5` |
| Langage | **TypeScript** strict (`strictest`) | `typescript@~6.0.3`. **Pas la 7.x** : `typescript-eslint` exige `<6.1` |
| Animation | **GSAP**, moteur unique : core, ScrollTrigger, SplitText, Flip, CustomEase | `gsap@3.15.0`, 100 % gratuit plugins compris depuis la 3.13 |
| Smooth scroll | **Lenis** sous conditions (§9.4), piloté par le ticker GSAP | `lenis@~1.3.26`. La 2.0 est en dev |
| Micro-interactions | **CSS natif** : transitions, `@property`, `@starting-style`, `grid-template-rows` | — |
| Styles | **CSS moderne** (layers, nesting, container queries, `oklch`) + styles scopés Astro, avec des tokens à **source unique** | — |
| Interactif | **Custom elements** (`<vy-menu>`, `<vy-accordion>`, `<vy-carousel>`, `<vy-video>`), sans island de framework | — |
| Polices et images | **Astro Fonts API** (stable, auto-hébergement, repli à métriques ajustées) et **`astro:assets`** (AVIF/WebP, `srcset`, `priority`) | — |
| Hébergement | Sortie statique, **indépendante de l'hébergeur** : Vercel (ton habitude) ou Cloudflare Workers Static Assets | `wrangler@4.147` si Cloudflare |
| Runtime | Node **24 LTS**, pnpm | `24.21.0` |

**Pourquoi**, avec des valeurs mesurées sur des builds jetables :

| Mesure (JS gzip) | Valeur |
|---|---|
| Astro, page vide | **0 Ko** |
| Astro + GSAP (core, ScrollTrigger, SplitText) + Lenis | **≈ 51 à 56 Ko** |
| Vite + React, page vide | 66 Ko |
| Vite + React + `useGSAP` + la même stack | **116,7 Ko** |
| Nuxt, page vide | 49,3 Ko |
| Vue seul + la même stack | 73,4 Ko |
| Next.js 16, page vide | 168,4 Ko |

Ce site est le cas d'école d'Astro : éditorial, 4 widgets, aucun état partagé, HTML complet sans hydratation. Astro reste en tête même en comparant honnêtement à Vite + React plutôt qu'à Next.js (scénario S1 de la revue adverse : 4,25 contre 4,03).

### 12.2 Ta question « Motion, GSAP, Lenis, autre ? »

- **GSAP plutôt que Motion, et pas les deux.**
  - GSAP couvre exactement les besoins : SplitText gratuit avec masques de lignes, `autoSplit` et aria ; pin et scrub de ScrollTrigger ; Flip ; timelines interruptibles ; nettoyage déterministe avec `gsap.context()` et `gsap.matchMedia()` (branche reduced-motion explicite) ; CustomEase pour reproduire exactement les courbes des tokens.
  - Motion 14 est excellent et plus léger (22,6 Ko contre 47 Ko). Mais il n'a **pas de pin**, et son `splitText` est **payant** (Motion+).
  - **Un seul moteur** veut dire un seul modèle mental, un seul système de courbes et un seul point de synchronisation avec Lenis.
- **Lenis : oui, sous conditions** (§9.4). Ce n'est pas ScrollSmoother, qui transforme le contenu et casse `fixed`, `sticky` et les ancres.
- **Les autres options** :
  - **OGL**, seulement pour l'overdrive WebGL (12,5 Ko contre 128,9 Ko pour Three.js), chargé après le LCP ;
  - **swup 4.10** + `@swup/astro`, seulement si l'on veut des transitions de page chorégraphiées ;
  - **Barba est à écarter** (rien publié depuis août 2024) ;
  - **Embla** (7,4 Ko), seulement si le scroll-snap natif ne suffit pas pour le carrousel.
- **Animations CSS liées au scroll** : en amélioration progressive seulement. **Firefox stable ne les supporte toujours pas**, ScrollTrigger reste nécessaire pour la chorégraphie principale.

### 12.3 Les amendements des deux revues adverses (v3 et v3b : AMEND, pas REPLACE)

**Les faits tiennent.** Les deux revues ont été menées indépendamment, sur 46 puis 55 affirmations. Elles ne trouvent **aucune erreur de version**, seulement deux inexactitudes mineures. Les failles relevées sont dans le raisonnement, et les deux revues convergent :

1. **Le périmètre était gonflé.** Le shot est **une seule page**. En une page, il n'y a ni routeur ni View Transition inter-pages, et le débat MPA / ClientRouter disparaît. On garde seulement le contrat d'effet `mount(scope, env) → dispose()`, rendu **idempotent** (pas de double montage au retour bfcache, vérifié par un test Playwright `goBack()` / `goForward()`), et le registre `data-motion`.
2. **La comparaison côté React était biaisée.** Elle opposait Next.js (168 Ko) à Astro, alors que le React pertinent ici est Vite + React (66 Ko). L'écart réel avec Astro est **≈ 61 Ko**, pas 112.
3. **La matrice ignorait l'utilisateur réel.** Avec un critère « adéquation à ton écosystème » et un apprentissage noté **pour toi**, l'écart entre stacks tombe sous 0,2 à 0,25 point. **Ce n'est plus le score qui décide, c'est tes réponses** (§12.4).
4. **Intro du hero** : `document.fonts.ready` suivi d'un `requestAnimationFrame`, et non `pagereveal`, qui peut être raté au premier rendu ou rejoué au retour bfcache.
5. **« Un seul moteur » vaut seulement dans la page.** GSAP ne peut pas cibler les pseudo-éléments `::view-transition-*`. En cas de sous-pages, les transitions inter-pages passent par du CSS (ou par WAAPI) avec les **mêmes courbes**, partagées par custom properties.
6. **Tokens à source unique.** Pas trois copies (CSS, TS, `DESIGN.md`) tenues alignées par des tests de parité. `tokens.css` fait foi ; le TS le lit au montage (`getComputedStyle`, puis `CustomEase`) ; `DESIGN.md` est **généré**.
7. **Un outillage en socle et en options**, pas 13 outils obligatoires pour une seule page (§12.5). **Lighthouse 13** (`unlighthouse` ou `lighthouse@13.5`), car `@lhci/cli@0.15.1` mesure encore avec Lighthouse 12.
8. **Tailwind 4.3 présenté à égalité** avec le CSS natif : c'est ta norme, et `@theme` donne aussi une source unique de tokens. Choisir le CSS natif est une **démonstration volontaire** à assumer dans un ADR.
9. **Hébergement neutre.** La sortie est statique. Par défaut, ton hébergeur habituel (Vercel), ou Cloudflare si tu veux l'apprendre.
10. **Pas d'island React « pour le CV »** : ce serait ajouter une dépendance pour un effet que la stack exprime déjà.
11. **Trois risques à ajouter** :
    - le compilateur Rust d'Astro est encore en 0.x ;
    - Astro a un rythme de versions majeures rapide (104 jours entre 6.0 et 7.0) ;
    - un carrousel en `scroll-snap` horizontal sous Lenis demande un test E2E dédié (`gestureOrientation` vaut `vertical` par défaut).

**Contexte (à te signaler).** Pour situer ta pratique, les deux revues ont consulté tes **dépôts GitHub publics**. Ta stack habituelle pour ce type de site (une one-page vitrine animée) y apparaît comme **Vite + React 19 + Tailwind 4.3 + Motion + Lenis**. Tu as aussi un projet **Nuxt 4**, et Vercel revient dans deux dépôts. D'où les deux alternatives ci-dessous.

### 12.4 Arbre de décision

**Q0 : cette pièce doit-elle élargir ton profil ou capitaliser sur ta stack ?**

| | Une page (cas du shot) | Avec sous-pages et transitions |
|---|---|---|
| **Site autonome**, élargir | **Astro 7.3 statique**, GSAP, Lenis, CSS natif, custom elements | Transitions en CSS seul (absentes sous Firefox) : Astro MPA + `@view-transition`. Transitions GSAP partout : Astro + `<ClientRouter />` avec adaptateur (`event.loader` pour la sortie, `swapFunctions` pour préserver les classes, `dispose()` puis nouveau Lenis à chaque page), ou swup. **Meilleure alternative selon v3b : Nuxt 4.5 en `nuxt generate`**, avec `<NuxtPage :transition="{ css: false, onLeave, onEnter }">` piloté par GSAP. C'est la chorégraphie inter-pages la plus simple dans tous les navigateurs, et tu connais déjà Nuxt (≈ +44 Ko) |
| **Site autonome**, capitaliser | **B′ : Vite 8 + React 19.3 + TS 6 + GSAP (`useGSAP`) + `lenis/react` + Tailwind 4.3**, avec prérendu statique obligatoire (environ 117 Ko) | `<ViewTransition>` de React 19.3 ou timelines GSAP orchestrées par le routeur |
| **Intégré à un portfolio React** | Une route ; `useGSAP` avec `scope` ; Lenis monté et détruit au niveau de la route ; ne jamais mélanger Motion et GSAP sur la même page | idem, avec `context.revert()` avant chaque changement de route |
| **Intégré à un portfolio Nuxt / Vue** | Un layer Nuxt ; composable `useGsapContext` ; `lenis/vue` | `<Transition :css="false">` avec des hooks GSAP |

**Règle générale** : même si ton portfolio est en React ou en Vue, **mieux vaut déployer VYRON à part** (sous-domaine) et le lier depuis le portfolio. Lenis sur `<html>`, des ScrollTriggers globaux, des polices et des tokens propres entrent en conflit avec une application hôte.

### 12.5 Structure et outillage (méthode de travail)

**Arborescence** (Astro) :

```
src/
  components/{ui,layout,sections}/   # .astro en PascalCase, interface Props typée
  content/ + content.config.ts       # textes, programmes, équipe, témoignages (validés par Zod)
  layouts/BaseLayout.astro
  pages/{index,404}.astro
  scripts/
    elements/                        # vy-menu.ts, vy-accordion.ts, vy-carousel.ts, vy-video.ts
    motion/                          # engine.ts, tokens.ts (dérivé), smooth-scroll.ts, registry.ts, effects/*
  styles/                            # tokens.css (source), reset, base, layout, utilities, motion.css
  lib/                               # TS pur et testable
tests/{unit,e2e,a11y,visual}/
docs/{adr,analyse}/ + PRODUCT.md + DESIGN.md
```

**Conventions** :
- classes pour le style, ARIA et `data-state` pour l'état, `data-motion` pour l'animation ; une animation ne cible jamais une classe de style ;
- chaque effet est un module `init(root) → cleanup` ;
- aucune valeur magique hors des tokens.

**Qualité** : un socle obligatoire et des options, en CI sous Node 24.

| Rôle | Outil | Niveau |
|---|---|---|
| Format | Prettier + plugin Astro | **Socle** |
| Lint TS, Astro, a11y | ESLint 10 + typescript-eslint (strictTypeChecked) + eslint-plugin-astro + jsx-a11y-x | **Socle** |
| Types | `astro check` | **Socle** |
| E2E | Playwright : clavier, menu, accordéon, carrousel, **projet sans JS**, **projets reduced-motion et no-preference**, retour bfcache | **Socle** |
| Accessibilité | axe, WCAG 2.2 AA, 0 violation | **Socle** |
| Animation | test « rien ne reste caché » | **Socle** |
| Performance | Lighthouse 13 avec budgets | **Socle** |
| Visuel | captures à 375, 768 et 1440 | Option (recommandée) |
| Lint CSS | Stylelint 17 (couleurs littérales interdites hors tokens) | Option |
| Code mort | knip | Option |
| Unitaires | Vitest (seulement s'il y a de la logique TS pure) | Option |
| Hooks Git | lefthook + commitlint | Option |

**Git** :
- Conventional Commits, avec des scopes par section (`feat(hero): …`) contrôlés par commitlint ; hooks lefthook ;
- trunk-based, branches courtes, PR avec CI verte et preview, squash merge ;
- jalons taggés `v0.1` (statique), `v0.2` (interactions), `v0.3` (motion), `v1.0` ;
- **un ADR par décision structurante.** Le premier, « Astro plutôt que ma stack Vite + React habituelle », avec ses chiffres, est l'ADR le plus parlant pour un recruteur.

**Pièges de version relevés** :
- Astro 7 a `compressHTML: 'jsx'` par défaut, ce qui supprime les espaces entre éléments inline : il faut des `{" "}` explicites ;
- le compilateur Rust est plus strict ;
- **TypeScript 7 est incompatible** avec l'outillage de lint actuel ;
- `eslint-plugin-jsx-a11y` est figé : il faut le fork `-x`.

---

## 13. Désaccords entre analystes, et comment je les ai tranchés

| Sujet | Désaccord | Arbitrage |
|---|---|---|
| Encre des titres | `#0B1024`, `#0D1127`, `#141A2C` ou `#171A32` | **`#171A32`**, valeur dominante sur environ 28 000 px. Les autres valeurs viennent de pixels de cœur ou d'anticrénelage |
| Escalier | « 2 rectangles identiques » (a1) contre polygone `dx / t / b` (a4) | **Polygone `dx / t / b`, avec t ≠ b** (v2, mesuré) |
| Plaque sous la vidéo | « Barre de progression » (a1, a4) contre « carte empilée » (a6, a8, v2) | **Carte empilée** : géométrie mesurée, texture d'image, retrait symétrique |
| Hauteur de l'onglet rouge du footer | 43 (a1) contre 61–63 (a4, v2) | **≈ 62** |
| Item d'accordéon ouvert | ~460 (a4) contre ~400 (a1, v2) | **≈ 400** ; items fermés de 173 à 177 |
| Phrase d'About | H2 (a4) contre taille H3 (a1, a2, v2) | **Taille H3** (capitale ≈ 25 contre 39 pour les H2) |
| Wordmark et logo | « Face chanfreinée du display » (a4) contre « Tektur 600 à 700 » (a2, v2) | **Tektur 700, tracking 0**, au header comme au footer (v1b, IoU 0,94) |
| Chiffres 01/02 | `tnum` (a2) contre chiffres par défaut (v1b) | **Chiffres par défaut** (IoU 0,90 contre 0,70 en `tnum`) |
| Flèche → | absente de Tektur (a2) contre présente (v1b) | **Présente** dans le fichier complet, absente du sous-ensemble « latin » ; les flèches restent de toute façon des SVG |
| Correctif du rouge | `#E3293E`, `#E3213A`, `#E01028`, `#D8273B`… | **Rampe `#E41E3A` / `#C2152C` / `#F64D57`** (a3), recalculée (§5.4) |

---

## 14. Éthique et crédit

- **Le design appartient à un autre designer**, tout comme le nom fictif « VYRON ». Pour un portfolio :
  - **créditer** l'auteur, avec son nom et un lien vers le shot, dans le footer de la démo, le README et l'étude de cas ;
  - distinguer « structure inspirée de… » de « adaptation, développement, animation et images : moi ».
- **Mention recommandée** : « Projet conceptuel. Marque, personnes, chiffres et avis fictifs ; visuels générés par IA. Design d'origine : [designer], adapté et animé par [toi]. »
- **SEO** :
  - données structurées `CreativeWork` avec `isBasedOn` pointant vers le shot, **jamais** `LocalBusiness` ni `AggregateRating` (ce seraient de faux avis) ;
  - démo en `noindex` recommandée.
- **Captures de référence** : elles ne sont **pas** versionnées dans ce dépôt (droits du designer). Si le dépôt est privé, je peux les ajouter dans `docs/reference/`. C'est pratique pour les sessions futures, car ce conteneur est éphémère.

---

## 15. Décisions

### 15.1 Bloquantes (posées en questions)

1. **Stack et objectif** : Astro (élargir) ou Vite + React (capitaliser) ? Site autonome ou intégré au portfolio ?
2. **Niveau d'adaptation** : fidèle (avec seulement les correctifs a11y), adaptation ciblée (§8, recommandé), ou réinterprétation produit (la trame devient un planning réservable) ?
3. **Marque et langue** : nouveau nom ou VYRON ? Français ou anglais ?
4. **Périmètre** : une page, ou une page avec sous-pages et transitions ?

### 15.2 Secondaires (défaut proposé, à corriger si besoin)

| Décision | Défaut proposé |
|---|---|
| Intensité du motion | **Niveau 2** (MUST, SHOULD et O3) ; WebGL O1 en bonus de fin de projet |
| Lenis | Oui, sous conditions |
| Styles | CSS natif à tokens, ou Tailwind 4.3 (ta norme, avec `@theme` comme source de tokens) : les deux sont valables, le choix t'appartient |
| Rouges | Rampe à 4 rôles (§5.4) |
| Encre des titres | Marine `#171A32` partout ; chiffres en `#000` |
| Deux noirs (`#000` HOT, `#040F0E` NIGHT) | Les garder |
| Hero | `100svh` avec H1 visible au chargement ; image générée avec une zone sombre sous le sous-titre |
| Services | Carrousel centré (scroll-snap + Flip) sur desktop ; pile verticale sur mobile ; nombre de services à fixer (3 à 5) |
| Témoignages | Pile de 3 cartes, plans **muets** (pas de talking head), pas d'autoplay ; compteur « 01 / 03 », sans pager vertical en double |
| Formes arrondies (pastilles, avatar, points) | Passer en carré |
| Mono | Réservé aux données ; Plex Mono gardé par fidélité |
| Footer | Panneaux réaffectés (Contact et adresse · Réserver · Horaires), crédit et mention « concept » |
| Images | 4 familles d'étalonnage ; « Stills essentiels » d'abord, avec un pilote de calibrage des crédits |
| Mode de construction Impeccable | Défaut d'Impeccable quand la génération d'image est disponible : **comp-first** (3 comps avant de coder). Ici, je propose **code-first**, puisque la référence fait déjà office de comp. **Non enregistré** tant que tu ne l'as pas confirmé |
| Hébergement | Vercel (ton habitude) ou Cloudflare ; sous-domaine de ton portfolio |

### 15.3 Informations à me fournir quand tu peux

- **Nom et lien du designer d'origine**, pour le crédit.
- **Captures haute définition** d'About, Programs, Transformation et Footer, si tu les as. Elles lèveraient les valeurs encore inférées (tags, séparateur du marquee, pictos).

---

## 16. Suite : le parcours Impeccable

1. **`init`** : à partir de tes réponses, j'écris `PRODUCT.md` (utilisateurs, objectif, positionnement, contraintes, preuves disponibles et absentes, stack).
2. **`shape`** : brief de la surface (parcours, action principale, contenus, états) ; on le valide ensemble.
3. **Contrat de direction**, dans le surface brief : thèse, univers, histoire, premier écran, forme, et une ligne FINISH. Le monde est **épinglé par la référence**, donc pas de tirage de concepts.
4. **Images** : ancres de casting à valider, pilote de calibrage, puis lots.
5. **Construction par jalons** :
   - **v0.1** : tokens, polices et sections statiques responsive ;
   - **v0.2** : interactions et accessibilité ;
   - **v0.3** : motion.
   - **Chaque jalon** : `impeccable detect`, tests et Lighthouse.
6. **Revue de fin** par un relecteur indépendant, puis **`document`** (`DESIGN.md` et tokens), puis **`audit`** et **`polish`**.

---

## Annexe : vérification typographique

La vérification adverse des polices est intégrée au §4.1 et détaillée dans [`annexes/v1b-fonts.md`](annexes/v1b-fonts.md). Une première tentative (v1) a été interrompue par un redémarrage du conteneur, puis relancée.
