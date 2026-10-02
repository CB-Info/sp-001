> **Annexe brute** : rapport de l’agent `v2-completeness`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

# VYRON : critique de complétude (lentille v2-completeness)

> **Référentiel.** Impeccable v4.5 : `craft-floor.md` (Verify / Refuse) et `polish.md` (classement des dérives : missing token, one-off, conceptual mismatch, local defect).
> **Rôle.** Relever ce que les rapports **a1-structure** et **a4-components** ont manqué ou mal mesuré. Règle « the brief wins » : chaque écart au craft-floor est présenté comme une décision à prendre, pas comme une correction automatique.
> **Fichier non écrit.** `report.md` n'a pas été écrit, car les consignes des sous-agents l'interdisent. Le rapport complet est ce texte.
> **Fichiers d'appui.** Les chemins sont relatifs à `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/work/v2-completeness/`.
> - `grid/{2,3,4}_r{0-3}c{0-3}.png` : 48 crops (grille 4×4, agrandis ×2), tous examinés.
> - `halves/s{1..7}-*_{top,bot}.png` : 14 moitiés de sections, toutes examinées.
> - `zoom/` : agrandissements de travail.
> - `evidence/` : preuves citées ci-dessous.

**Échelles et conventions**
- 2.png, 3.png et 4.png : cadre x 100 → 1500, soit 1400 px, facteur **×1,0286** vers 1440.
- 1.png : cadre x 20,3 → 386,4, soit 366,1 px, facteur **×3,933**.
- « shot » désigne un pixel de l'image source. « @1440 » désigne une valeur normalisée, avec y compté depuis le haut de la section.
- **[M]** mesuré au pixel (PIL/numpy), **[E]** estimé, **[I]** inféré.

---

## 1. Éléments visibles absents des deux rapports

### 1.1 Couleur et typographie

**Le H2 de Transformation est noir neutre, pas `--ink`** [M]
- Pixels sombres du titre « REAL TRANSFORMATION… » dans 1.png : moyenne (13,13,13), B−R = **0,0** sur 1 089 px.
- Titres de comparaison :
  - H2 Services : B−R = **16,6** (n = 1 073) ;
  - H2 Programs : B−R = **16,1** (n = 433), donc la teinte `#171A32`.
- C'est donc un deuxième noir de titre. La règle de a4 « h2 = `--ink` ou blanc » est contredite, et a1 n'en parle pas.
- Classement polish : *missing token / local defect*.
- Preuve : `evidence/ev_h2_ink_transf_vs_programs_1png.png`.

**Indices de la face display pour la sourcer** [M visuel]
- Le « I » de SERVICES a des empattements à **bord extérieur concave** : le haut se creuse au centre, le bas remonte, et le fût s'évase légèrement.
- La face des H2 et du logo a aussi un « I » à empattements, un « Y » en U avec fût et un « G » chanfreiné.
- Aucun des deux rapports ne relève ces indices ni ne propose de piste d'identification.
- Preuves : `evidence/ev_services_I_glyph_3png.png`, `zoom/services_h2_detail.png`.

**La ponctuation finale des titres est incohérente** [M, lecture]
- Avec un point : « SERVICES. », « …EXPERT COACHING. », « FIND THE RIGHT FITNESS PROGRAM. », « REDEFINING FITNESS CULTURE. », « PUSH BEYOND LIMITS. ».
- Sans point : les H2 de Services, Why et Transformation.
- a4 relève la casse mais pas la ponctuation. Classement : *local defect*.

### 1.2 Hero

**Contraste du sous-titre « Redefine Your / Physical Potential »** [M]
- Le texte blanc en graisse light est posé sur la peau claire et sur l'objet gris.
- Des zones de fond contiguës au texte ont été mesurées dans 2.png (x 846 → 1075, y 872 → 887 ; x 1076 → 1095, y 890 → 920).
- Luminance relative de **0,26 à 0,44**, soit un contraste de **2,2:1 à 3,4:1** contre le blanc.
- Le seuil craft-floor pour un grand texte (3:1) n'est donc pas tenu par endroits. a4 ne signale que les slogans (« à vérifier »).
- Décision à prendre : générer la photo avec une zone sombre sous le texte, ou ajouter un voile local.
- Preuve : `evidence/ev_hero_lede_contrast_2png.png`.

**Objet tenu par l'athlète** [E]
- Une forme grise mouchetée et bombée, dans 2.png (x 880 → 1020, y 840 → 900).
- Un objet rouge sombre arrondi avec un marquage foncé, en bas à droite (x 1180 → 1300, y 1060 → 1172).
- a1 affirme « gant » sans preuve, et a4 n'en dit rien. C'est utile pour le prompt Higgsfield.
- Preuves : `evidence/ev_hero_object_2png.png`, `zoom/hero_object_mid.png`.

### 1.3 Textures et grille

**Les bandes réglées sont ancrées au cadre et alignées d'une section à l'autre** [M]
- La bande en tête d'About (2.png, y 1172 → 1200) et celle de Services (3.png, y 100 → 152) ont leurs verticales **aux mêmes x** : 227 / 354 / 481,5 / 608,5 / 736 / 863,5 / 991 / 1117,5 / 1245 / 1372 shot.
- Cela correspond à 100 + k × 127,3 shot, soit 1440 / 11 = **130,9 @1440**, compté depuis le bord du viewport et non depuis le conteneur de 1320.
- Conséquence : il faut un seul motif à l'échelle de la page, et non un motif par section.
- Preuves : `evidence/ev_strip_about_2png.png`, `evidence/ev_strip_services_3png.png`.

**Le panneau réglé a une hauteur fixe** [M]
- Le panneau de Services (3.png, y 703 → 807) et celui de Why (4.png, y 1020 → 1124) mesurent tous deux **104 shot, soit 107 @1440**.
- Tous deux ont **16 rangées au pas de 6,5 shot**, ce qui est aussi le pas des bandes.
- Seule la largeur des 11 colonnes change : 116,6 shot dans Services, 42,1 dans Why.
- La règle n'est énoncée nulle part. a4 donne même deux hauteurs différentes (111 et 109).

**Un axe central commun** [M]
- L'unité active de Services (tuile + carte B, 437 → 1163 shot) a son centre à **800,0**.
- Le portrait mis en avant dans Why (643 → 958) a son centre à **800,5**.
- Le centre de la page est à 800. a1 ne le note que pour Services.
- C'est un motif réutilisable pour le mouvement : l'élément actif est toujours au centre.

### 1.4 Programs

**Deux visages pour « Marcus Roy »** [E]
- L'avatar du coach dans Programs (1.png, x ≈ 187 → 199, y ≈ 931 → 945) montre un homme à **peau foncée, barbu**.
- Le « Marcus Roy 03 » de Why (4.png) est un homme **d'apparence est-asiatique** qui fait un curl d'haltère.
- Même nom, deux personnes. Cela touche le modèle de données (une seule source par coach) et la cohérence des personnages générés par Higgsfield.
- Preuves : `evidence/ev_programs_coach_avatar_1png.png`, `evidence/ev_why_marcus_4png.png`.

**Marques dans les photos** [E]
- Logo **Nike** sur le débardeur de la photo Programs (1.png, x ≈ 103 → 112, y ≈ 1009 → 1013).
- Ceinture de short à motif (boxe ou Muay Thai) dans la vidéo du témoignage.
- Marquage sur l'objet en bas à droite du hero.
- Pour une pièce de portfolio régénérée, les prompts doivent exclure les logos. Aucun des deux rapports ne le signale.
- Preuves : `evidence/ev_programs_nike_1png.png`, `evidence/ev_transf_stacked_plate_1png.png`, `evidence/ev_hero_object_2png.png`.

**Sujets des photos non décrits**
- Programs : homme avec des cordes ondulatoires floues au premier plan, étalonnage bleu froid.
- Témoignage : boxeur sur un ring, gants, flou de mouvement, grain film chaud.
- Footer : pompes en salle éclairée en rouge, avec des néons diagonaux en haut à gauche.

### 1.5 Why

**Microstructure de la règle graduée** [M, 4.png]
- 13 graduations **alignées par le haut** sur y = 208 : seul le bas varie, elles « pendent ».
- Hauteurs en shot, de gauche à droite : **12 / 11 / 10 / 10 / 10 / 10 / 12 / 10 / 8 / 8 / 8 / 8 / 12**.
- Le pas vaut 6, **sauf un pas de 4** entre x 204 et 208.
- a4 décrit une règle régulière (majeures 12, mineures ~9).
- Preuve : `evidence/ev_why_tickruler_4png.png`.

### 1.6 Transformation

**L'état affiché est contradictoire** [M/I]
- Le compteur « 01 » et le bouton précédent grisé suggèrent la première diapositive.
- Mais le point rouge (actif) du pager vertical est **le deuxième sur trois** (1.png, x ≈ 333, y ≈ 1601, entre des points gris à ≈ 1597 et ≈ 1605).
- Aucun des deux rapports ne le relève.
- Preuves : `evidence/ev_transf_pager_counter_btns_1png.png`, `evidence/ev_transf_counter_01_1png.png`.

### 1.7 Footer

**Les panneaux ont une rangée d'en-tête** [M/E]
- Chacun des 3 panneaux a une rangée d'en-tête de la hauteur de l'onglet rouge : 1.png y 1827 → 1843, soit ≈ 267 → 332 @1440.
- Cette rangée est fermée par un **filet** dans les panneaux 1 et 3 (y ≈ 1842 → 1843, lisible sur la zone sombre du panneau 3).
- « Back To Home » n'est donc pas un onglet flottant : c'est la rangée d'en-tête du panneau 2, **remplie de rouge**. Cela renforce l'hypothèse « en-tête = lien, rouge = survol ou actif ».
- Preuve : `evidence/ev_footer_panel_headers_1png.png`.

### 1.8 Inventaire des visuels à produire (absent des deux rapports)

| # | Où | Sujet visible | Format @1440 | Traitement |
|---|---|---|---|---|
| 1 | Hero | sportive (ponytail, bras tendu, objet en main) | 1440 × 1102, plein cadre | duotone rouge, flou de bougé, fondu noir en bas, bandes verticales à droite |
| 2 | About | homme barbu, quarter-zip rouge, rack à barre | ≈ 428 × 248, en escalier | naturel, fond gris sombre |
| 3–7 | About | 5 avatars | ≈ 38 × 38 carrés | naturel |
| 8–10+ | Services | 02 : homme en débardeur rouge avec haltère ; 03 : homme de profil ; 01 et suivantes cachées | 218 × 122, en escalier | rouge monochrome (actif) ou N&B (inactif) |
| 11 | Programs | homme et cordes ondulatoires | ≈ 519 × 531, en escalier | bleu froid, sombre |
| 12 | Programs | avatar coach | ≈ 47, rond | naturel |
| 13–17 | Why | 5 coachs | 4 × 228 × 229 + 325 × 409 | froid et assombri, sauf le portrait mis en avant, chaud et lumineux |
| 18–20 | Transformation | boxeur + 1 ou 2 cartes empilées (bas visible seulement) | ≈ 721 × 338 (2,13:1) | grain film chaud |
| 21 | Footer | pompes, salle rouge | 1440 × 849, fond | rouge vers noir dès ~65 % de la largeur |

Total : **≈ 21 visuels visibles**, jusqu'à ≈ 27 avec les éléments cachés (service 01 et suivants, témoignages 2 et 3, photos par programme).

---

## 2. Erreurs factuelles dans les rapports

1. **a1 : « union de 2 rectangles identiques » (silhouette en escalier).** Faux : le décalage du haut (t) n'est jamais égal à celui du bas (b) [M].
   - Tuile flèche : avant 75 × 74, arrière 77 × 82 shot, t ≈ 5–6, b ≈ 13–14.
   - « Meet the Team » : avant 182 × 33, arrière 183 × 40, t 4, b 11.
   - Photo Programs, d'après les propres valeurs de a1 : A 452 × 458, B 448 × 496.
   - La tuile n'est donc pas « décalée de 12 × 9 », mais t ≈ 6 et b ≈ 14 @1440. Le polygone à 8 points de a4 (dx, t, b) est la bonne modélisation.
   - Preuves : `evidence/ev_stepshape_arrow_3png.png`, `evidence/ev_stepshape_meet_4png.png`, `evidence/ev_stepshape_programs_photo_1png.png`.

2. **a1 : onglet rouge du footer « 267 → 311 (43) ».** Mesuré dans 1.png : y 1828 → 1843,5, soit 16 px, donc **271 → 332 @1440, environ 61 à 63 de haut**. La valeur de a4 (63) est la bonne.

3. **a1 : encre des titres « #0D1127 [M] ».** La couleur dominante des pixels du H2 de Services dans 3.png est **(23,26,50), soit `#171A32`** (≈ 28 000 px). Même valeur pour « FUNCTIONAL ». a4 a raison.

4. **a1 « barre de progression noire » et a4 « Scrubber ».** La géométrie indique plutôt **une deuxième carte empilée derrière** [M géométrie, I lecture].
   - Plaque principale : 1.png x 128 → 321 (424 → 1183 @1440), passe-partout de 5 à 6 px.
   - Juste dessous, **sans écart** :
     - une bande sombre x 146 → 304, haute d'environ 4,5 px, **texturée comme une image** ;
     - puis une bande claire x 141 → 309,5, haute d'environ 5 px.
   - C'est la même anatomie que le bas de la carte principale (image puis bordure). La carte arrière est 12,5 % plus étroite (665 contre 759 @1440, retrait de ~49 de chaque côté) et visible sur ~39 px (787 → 826 @1440).
   - La « barre » de a4, donnée pour ~10 de haut, fait en réalité ~16 à 18 @1440.
   - Preuve : `evidence/ev_transf_stacked_plate_1png.png`.

5. **a4 : la phrase-titre d'About est rangée en `h2` (capitale 39).** Mesuré : capitale ≈ 6,5 px dans 1.png, soit **≈ 25 @1440**, avec un pas d'environ 37. Les H2 de Services, Why et Transformation ont une capitale de 9,5 à 10 px (37 à 39 @1440) et un pas d'environ 57. a1 a raison.
   - Preuve : `evidence/ev_about_vs_services_h2_1png.png`.

6. **a4 : les y de la section Why sont tous décalés de −14 à −16.** Ils sont mesurés depuis le haut de 4.png, qui commence environ 13 px (shot) sous le haut de la section.
   - Dans 1.png, Why commence à y 1122,5 et l'eyebrow à 1153,5, soit **122 @1440**, et non « ~108 ».
   - Les portraits sont à ~664, et non « +648 ». Les valeurs de a1 sont les bonnes.
   - Preuve : `evidence/ev_why_top_offset_1png.png`.

7. **a4 : item d'accordéon ouvert « ~460 ».** Filets mesurés dans 1.png à y 855,5 / 957 / 1002 / 1047 / 1091.
   - Item ouvert : **≈ 399 @1440**.
   - Items fermés : **173 à 177**.
   - a1 a raison. Preuve : `evidence/ev_programs_accordion_1png.png`.

8. **a4 §7.3 : « VYRON™ du footer » rangé avec la face chanfreinée de BUILD et SERVICES.** C'est contraire à son propre §0.2.
   - À échelle égale, le wordmark est **beaucoup plus gras et plus étroit**, avec le « Y » en U : c'est la face des H2 et du logo, en graisse lourde.
   - Preuve : `evidence/ev_footer_wordmark_vs_services_display_1png.png`.

9. **a4 : « 14 Days » et « 14 Days Training » présentés comme lus.** Le chiffre est illisible (14 ou 16), comme le dit a1.
   - Preuve : `evidence/ev_programs_tags_1png.png`.

10. **a4 : wordmark « collé au bas du cadre ».** Capitales du wordmark : y 1928 → 1967 ; bas du cadre : 1975. L'écart est donc d'environ **31 @1440**. Le §1.9 de a4 donne d'ailleurs lui-même ~35.
    - Preuve : `evidence/ev_footer_bottom_1png.png`.

11. **a4 : « 2 hauteurs de panneau réglé, 111 et 109 ».** Les deux mesurent 107 @1440 (voir § 1.3).

12. **a4 : points du menu « carrés de 3 [M] ».** Ils font environ 1,5 px natif (2.png est un agrandissement ×2) : leur forme n'est pas mesurable, et ils se lisent ronds à l'agrandissement.
    - Preuve : `zoom/hero_menu.png`.

13. **a1 : « coach en polo rouge ».** C'est un col montant zippé (quarter-zip). « Gant » est affirmé sans preuve (voir § 1.2).
    - Preuve : `evidence/ev_about_coach_1png.png`.

14. **a4 : texte du marquee et libellés des stats d'About en « néo-grotesque »** [E, faible confiance].
    - « Fitness Hub » paraît large et carré, comme « Meet the Team ».
    - « AVERAGE RATING… » et « YEARS OF EXCELLENCE » ressemblent à la face carrée light des titres de piliers de Why.
    - À vérifier, et non à tenir pour acquis. Preuves : `zoom/p1_marquee_L.png`, `zoom/p1_about_stat.png`.

---

## 3. Ambiguïtés : questions précises pour l'utilisateur

« (nouveau) » signale une question absente des deux rapports. « (précisé) » signale une question déjà effleurée, rendue tranchable.

### Carrousels et états

1. **(précisé) Services.**
   - Combien de services en tout, et lesquels ? La carte 01 est-elle « Personal Training » ? Que dit la carte 03 « Functional Training » ?
   - Le défilement est-il en boucle ou borné ?
   - La tuile flèche rouge est le seul contrôle : il n'y a ni pagination ni « précédent » sous les cartes (vérifié dans 1.png, y 795 → 824 uniformes). Doit-elle suivre la carte active ou rester fixe sur l'axe central ?
2. **(précisé)** La carte noire signifie-t-elle « sélectionnée au clic » ou « survolée » ? Une seule carte noire à la fois ?
3. **(nouveau) Transformation.** La plaque étroite sous la vidéo est-elle une **pile de cartes** ? Si oui, combien, et la carte du dessous remonte-t-elle à l'échange ? Ou est-ce une barre de lecture ?
4. **(nouveau)** Quel état fait foi : « 01 » avec précédent grisé, ou le pager dont le **deuxième** point est actif ? Le pager vertical pilote-t-il le même carrousel que les flèches ?
5. **(précisé)** Vraie vidéo (lecture au clic, son, sous-titres) ou image fixe ? Aucun bouton lecture n'est visible.
6. **(nouveau)** Jordan Tucker, l'auteur de la citation, est-il la personne de la vidéo ?

### Contenu et images

7. **(nouveau)** Un même coach doit-il avoir **un nom et un visage uniques** partout (Marcus Roy dans Programs et dans Why) ? Le coach de la photo About fait-il partie de l'équipe (fondateur, 6e membre) ?
8. **(nouveau)** Peut-on générer tous les visuels **sans aucune marque** (Nike, short de boxe) ?
   - Quel univers sportif garder : force, boxe, mixte ?
   - Quel objet l'athlète du hero tient-elle : gant de boxe ou kettlebell ?
9. **(précisé)** Programs : la photo change-t-elle avec l'item ouvert (4 photos) ? Un item reste-t-il toujours ouvert ?
   - Les contenus des items 02 à 04 (description, tags, coach) sont-ils à fournir ou à inventer ?
   - Quelle durée exacte : 14 ou 16 jours ?
10. **(précisé)** Why : la colonne mise en avant est-elle fixe ou suit-elle le survol ? Le froid assombri contre le chaud lumineux est-il le codage inactif / actif ?

### Typographie et tokens

11. **(nouveau) Polices.** Avez-vous le lien du shot ou la liste de ses polices ? Sinon, acceptez-vous des équivalents libres choisis sur les indices relevés (I à empattements concaves, Y en U, chanfreins) ?
    - Faut-il garder **4 familles** (display chanfreinée, techno lourde pour H2 et logo, néo-grotesque, mono), ou en retirer une pour alléger la page ?
12. **(nouveau)** Le H2 de Transformation en noir pur est-il voulu, ou faut-il unifier tous les titres clairs en `#171A32` ?
13. **(nouveau)** Ponctuation des titres : un point partout, nulle part, ou seulement sur les affirmations ?
14. **(nouveau)** Règle graduée : reproduire son irrégularité (hauteurs 12 / 10 / 8, un pas de 4) ou la régulariser ?
15. **(nouveau) Craft-floor, contraste.** Pour le sous-titre du hero, à 2,2–3,4:1 : voile local, photo générée avec une zone sombre, ou texte plus gras ?

### Navigation, header et footer

16. **(nouveau)** Footer : les en-têtes de panneaux sont-ils des **liens** (rouge = survol ou page courante) ou des **onglets** qui changent le contenu ? Que doit contenir le corps du panneau 1, vide dans la référence ?
17. **(précisé)** Dans un one-page de portfolio, vers quoi pointent ces liens ? « Join Now », « Contact Us », « Explore Classes », « Meet the Team », « View All Programs », « Learn More About Us » : ancres, pages factices, modales ou liens inactifs assumés ?
18. **(précisé)** Que contient le panneau ouvert par MENU, et sous quelle forme (plein écran ou latéral) ? Le bouton téléphone est-il un lien `tel:` ou un formulaire de rappel ?
19. **(nouveau)** Si le header reste visible au défilement, comment traiter les sections blanches, où le logo et MENU blancs disparaissent : barre noire, inversion ou `mix-blend-mode` ?
20. **(nouveau) Au-delà de 1440 px :**
    - Le contenu reste-t-il plafonné à 1320 et centré, avec des fonds en pleine largeur ?
    - Le cadre de filets du hero reste-t-il à 30 px du bord du viewport ?
    - Les bandes réglées gardent-elles 11 colonnes (≈ 175 px à 1920) ou un pas fixe de 131 ?
    - Le carrousel affiche-t-il plus de cartes ?
21. **(nouveau)** Marquee : garder « Fitness Hub », qui est générique, ou le remplacer par des formules de marque ? Le séparateur, illisible, devient-il l'astérisque de la marque ?