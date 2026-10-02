> **Annexe brute** : rapport de l’agent `a5-critique`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

Critique Impeccable : Assessment A (design review) de la référence VYRON

**Méthode :** Assessment A isolée (agent `a5-critique`), sans accès aux résultats des autres analystes.
**Assessment B (détecteur déterministe) :** elle ne peut pas tourner sur des captures raster, car `impeccable detect` analyse du markup. Il faudra la lancer sur le code construit, à chaque jalon.
**Fichier :** l'écriture de `work/a5-critique/report.md` a été refusée par le harness (les sous-agents rendent leurs résultats en texte). Ce rapport est donc rendu uniquement ici.

---

## 0. Cadre, sources et conventions

| Élément | Valeur |
|---|---|
| Cible | Landing page « VYRON » (salle de sport), shot Dribbble d'un autre designer, analysée comme point de départ d'une reconstruction pour portfolio |
| Mode Impeccable | **Persuade** (landing). La page sera aussi jugée comme pièce de portfolio sur la qualité d'exécution |
| Règle directrice | « The brief wins » : l'utilisateur a choisi ce monde visuel. Les écarts avec le craft-floor sont donc listés comme **décisions** (§11) et non appliqués d'office |
| Sources | `1.png` (page entière, 407×2000, basse définition), `2.png` (hero), `3.png` (Services), `4.png` (Why VYRON) en 1600×1200, et les upscales `s1`…`s7` |
| Échelle | Dans 2/3/4, le cadre du site va de x=100 à 1499, soit **1400 px MESURÉ**, d'où **k = 1440/1400 = 1,0286**. Dans 1.png, il va de x=20 à 386, soit **366 px MESURÉ**, d'où **k = 1440/366 ≈ 3,934** |
| Légende | **M** = MESURÉ (pixels échantillonnés avec PIL), **E** = ESTIMÉ (dérivé d'une mesure avec une hypothèse, par ex. ratio cap-height/font-size ≈ 0,70–0,72), **I** = INFÉRÉ (lecture visuelle sur image floue). Le texte illisible est signalé comme tel |

**Hauteurs de sections à 1440 px** (1.png × 3,934, **M**) : hero ≈ 1100 · About ≈ 760 · Services ≈ 1175 · Programs ≈ 1285 · Why (sombre) ≈ 1220 · Transformation ≈ 1225 · marquee ≈ 51 · footer ≈ 850. **Page totale ≈ 7 690 px.**

---

## 1. Verdict de spécificité

**Verdict : la coquille est signée, le squelette est générique.**

L'enveloppe visuelle appartient bien à une marque : un display carré « techno-sport » à échelle monumentale, un rouge #F02B42 rationné, un noir légèrement teinté vert (#040F0E, **M**), des formes à « double plaque » décalée, des croix de repérage et des réglures de registre. La structure, elle, est celle du template « AI fitness / Dribbble gym ». Retirez le logo et les photos, et chaque section convient à n'importe quelle salle, n'importe quelle app de coaching ou n'importe quelle marque de vêtements de sport. Le texte est interchangeable à 100 %.

| Élément | Distinctif / générique | Pourquoi |
|---|---|---|
| Display carré à échelle monumentale (BUILD/STRENGTH en escalier, « SERVICES. » sur 88,5 % de la largeur **M**, wordmark VYRON™ en footer) | **Distinctif** | Une seule voix typographique à trois échelles crée un rythme reconnaissable. L'escalier BUILD (x 155–637) puis STRENGTH (x 364–1192) (**M**, shot) suit la direction du geste de l'athlète |
| Formes « double plaque » décalées (boutons, cadres photo) | **Distinctif** | Deux rectangles de même couleur décalés d'environ 12 px en x et 4 à 11 px en y (**M**, « Meet the Team ») : on pense à une impression mal repérée ou à des disques empilés. Le motif est appliqué partout de façon cohérente |
| Croix de repérage « + » dans le hero (y=738, x≈169/589/1012/1430, pas ≈ 420 px **M**) et réglures de registre | **Distinctif mais décoratif** | Vocabulaire d'imprimerie / feuille de production. Le concept est fort mais sous-exploité : il n'y a aucune information dedans (voir le dernier P2 du §7) |
| Photo hero passée en monochrome rouge avec filé de mouvement | **Distinctif** | Le monde de la marque est posé dès le premier écran |
| Slogans « PUMP. REPEAT. / LIFT. CRUSH IT. / PUSH YOUR LIMITS. / DIG DEEPER. » | Générique | Lexique fitness agressif que l'on trouve sur 9 landings de salle sur 10 |
| Eyebrows « ‖‖‖‖ About Us », « Fitness Programs », « WHY VYRON », « TRANSFORMATION » | **Tell de template** | Kicker au-dessus de chaque H2 : banni par le craft-floor |
| Cartes stats About (« 4.9/5 », « 20 Years of Excellence ») | **Tell de template** | C'est exactement le « hero-metric template » : gros chiffre, petit label, stats d'appui, accent |
| Why VYRON : 4 cellules égales label + une ligne | **Tell de template** | Cartes de même taille. 237×286 px avec environ 195 px de vide entre label et description (**M**) |
| Rangée de 5 portraits souriants à l'éclairage uniforme | **Tell de template** | Visages de stock ou d'IA, noms seuls, sans spécialité ni preuve |
| Testimonial unique avec flèches prev/next | Générique | Aucune donnée de transformation dans une section titrée « Real Transformation » |
| Marquee « Fitness Hub ✱ Fitness Hub » | Générique (et incohérent) | Ce n'est même pas le nom de la marque |
| Mega-footer avec gros wordmark | Générique mais bien exécuté | Belle fin visuelle, sans action (voir §5) |

**Occasion manquée principale.** Le monde « feuille de registre / impression » colle parfaitement à une salle de **force**, où l'on note ses charges et ses progrès dans un carnet. Pourtant les réglures restent du décor. Si cette grille devenait le **planning des cours** ou le **carnet d'entraînement** d'un membre, le motif porterait l'information et la conversion. C'est la seule chose que VYRON pourrait prouver et que les autres ne prouvent pas.

**Test de composition (mode Persuade).** Le hero échappe au template (pas de split copy/produit) : c'est un point positif. Mais About (titre, bouton, rangée de 3 cartes) et Why (titre, rangée de 4 cellules égales) reprennent exactement le squelette « titre sur rangée de cartes » que mode-persuade identifie comme le template.

---

## 2. Impression générale

Visuellement, le shot est très solide : tension typographique, palette disciplinée, alternance clair/sombre rythmée. Comme landing de salle de sport, c'est une affiche, pas un site. **Le premier écran ne dit pas que VYRON est une salle et ne propose aucune action.** Sur environ 7 690 px, on ne trouve ni prix, ni planning, ni adresse, ni horaires, ni offre d'essai.

**La plus grosse opportunité** consiste à faire de la grille de registre déjà présente le formulaire de conversion (planning / réservation d'essai). On garde le monde et on lui donne une fonction. Pour un recruteur, cette décision montre du jugement produit, et pas seulement de la reproduction.

---

## 3. Design Health Score (heuristiques de Nielsen)

| # | Heuristique | Score | Problème clé |
|---|---|---|---|
| 1 | Visibilité de l'état du système | **2** | Le carrousel Services n'indique aucune position (« 01 », « 02 » sont des identifiants de carte, pas « 2/5 »). Le testimonial affiche « 01 » sans total, alors que le pager vertical à 3 points montre le **2ᵉ** point actif (**I**, image floue) : contradiction. L'accordéon Programs (+ / —) est clair |
| 2 | Correspondance avec le monde réel | **2** | Trois mots pour l'offre : « Services », « Programs », « Explore Classes » (footer). L'icône ↪ (qui signifie « refaire / partager / transférer ») sert de « suivant ». Le hero ne contient pas le mot « gym » ou « salle ». Les faits qui comptent pour un vrai prospect (prix, adresse, horaires, planning) sont absents |
| 3 | Contrôle et liberté | **2** | Le carrousel Services n'a qu'un contrôle « avant », sans « précédent » visible. « Back To Home » est l'action mise en avant du footer… sur la page d'accueil. Le marquee défile sans pause possible (WCAG 2.2.2 à prévoir dans le build) |
| 4 | Cohérence et standards | **3** | Le système visuel est fort (un rouge, un display, des plaques décalées partout). Mais il y a trois vocabulaires de flèches (↪ courbe, →→→ droites triples, ↩/↪ testimonial), « Fitness Hub » au lieu de VYRON, et un étalonnage photo incohérent (hero rouge, équipe gris-bleu froid, Transformation sépia, carte 3 en N&B). « Marcus Roy » semble être deux personnes différentes (avatar Programs vs portrait n°03, **I**) |
| 5 | Prévention des erreurs | **2** | Fausses affordances : les slogans du hero sont posés sur une liste à filets (pas de 57 px **M**) qui ressemble à une nav. « Redefine Your Physical Potential →→→ » ressemble à un lien. Le bouton ↪ est à 20 px de la carte 1 et 21 px de la carte 2 (**M**) : on ne sait pas à qui il appartient. Le téléphone en icône seule déclenchera un `tel:` sur desktop. « View All Programs » mène probablement à une impasse dans un one-page |
| 6 | Reconnaissance plutôt que rappel | **2** | La nav desktop est cachée derrière « MENU » (texte ≈ 15 px **E**, icône 9 points de 14×14 px **M**) alors qu'il y a 1400 px de large disponibles. Le bouton téléphone et ↪ sont des icônes sans label. Les cartes voisines du carrousel sont rognées : la carte 1 montre son numéro sans titre, la carte 3 son titre sans numéro (**M**) |
| 7 | Flexibilité et efficacité | **n/a** | Surface Persuade : pas d'usage expert répété |
| 8 | Esthétique et minimalisme | **3** | La hiérarchie est forte dans chaque section. En revanche : au moins 6 bandes de réglures (**M**), dont un bloc de 104 px de haut sous le H2 Services (y 703–809 dans 3.png **M**), 4 croix de repérage, des eyebrows, des index 01–05 sans signification, et environ 195 px de vide dans chaque cellule Why (**M**). Le décor coûte de la hauteur |
| 9 | Diagnostic et récupération des erreurs | **n/a** | La référence ne contient aucune saisie ni aucun formulaire, ce qui est en soi le problème P0. L'heuristique devient applicable dès qu'on ajoute la réservation d'essai : validation, créneau complet, erreur réseau devront alors être designés. *Si l'on refuse ce n/a, le score vaut 0 et le total 16/32 = 50 %, même bande.* |
| 10 | Aide et documentation | **n/a** | Surface Persuade. Pour une salle, « l'aide » prend la forme d'infos pratiques et d'une FAQ (première séance, résiliation). Leur absence est comptée en H2 et en P0 |
| **Total** | | **16/28 (57 %)** | **Acceptable** : de vrais problèmes d'usage sous une très bonne surface |

---

## 4. Charge cognitive

| Critère | Statut | Détail |
|---|---|---|
| Single focus | **ÉCHEC** | Le hero n'a pas de tâche principale. Les 4 slogans en liste, « →→→ », MENU et le téléphone se disputent l'attention sans qu'aucun ne soit l'action |
| Chunking (≤ 4 par groupe) | OK | 4 programmes, 4 atouts. L'équipe (5 + CTA) est à la limite |
| Grouping | OK, sauf footer | Filets et réglures groupent bien. Dans le footer, 3 panneaux (« Strength Training », « Back To Home », « Explore Classes ») doublonnent la nav sans logique visible |
| Hiérarchie visuelle | **ÉCHEC** | Elle est claire pour le contenu (un H1 géant par section) mais inversée pour l'action. L'élément le plus saturé du footer est « Back To Home » (en-tête rouge d'environ 525×62 px à 1440, **E**). Le seul CTA rouge en haut de page, « View All Programs », est en 3ᵉ section |
| Une chose à la fois | OK | Accordéon et carrousel séquencent bien |
| Choix minimaux (≤ 4 options) | **ÉCHEC** | Footer : 5 liens nav + 3 panneaux + 3 réseaux sociaux = **11 cibles** sans hiérarchie |
| Mémoire de travail | OK (limite) | Rien à retenir d'un écran à l'autre. En revanche, « Strength » apparaît 3 fois (carte Services 02, programme 01, panneau footer), et l'utilisateur doit comprendre seul qu'il s'agit de la même offre |
| Progressive disclosure | OK | L'accordéon Programs est bien utilisé |

**Score : 3 échecs, charge modérée, à traiter.**

**Points de décision à plus de 4 options :**
- **Footer** : 11 cibles. Il faut regrouper en « Réserver » (primaire), une nav à 4 liens maximum et les réseaux.
- **Hero** : 6 éléments perçus comme cliquables (4 lignes de slogans, MENU, téléphone, plus « →→→ »), dont **aucun n'est la conversion**.
- **Why + Team** : 5 portraits plus « Meet the Team ». C'est acceptable si les portraits ne sont pas cliquables, sinon 6 options.

---

## 5. Parcours émotionnel

| Section | Émotion visée | Émotion produite | Intensité (1–5) |
|---|---|---|---|
| Hero | Adrénaline, aspiration | Adrénaline, mais « c'est quoi ? » | **5 (pic)** |
| About | Confiance | Neutre. Colonne gauche vide sur environ la moitié de la largeur (eyebrow seul), stats génériques | **2 (creux)** |
| Services | Capacité, choix | Choc du wordmark « SERVICES. », puis réglures vides et carrousel pauvre en info | 4 → 2 |
| Programs | « C'est pour moi » | Correct, mais pas de niveau (débutant ?) ni de prix | 3 |
| Why VYRON (sombre) | Appartenance | Bascule sombre réussie et visages humains, mais preuves creuses | 4 |
| Transformation | **Preuve, espoir** (devrait être le 2ᵉ pic) | Une citation, une photo sépia sans lien avec l'auteur, une colonne gauche occupée seulement par un astérisque | **2 (creux au pire endroit)** |
| Marquee | Énergie | « Fitness Hub » : bruit | 3 |
| Footer | Rémanence de marque | Fin forte (VYRON™ géant sur photo rouge) | 4 |

**Peak-end.** Le pic (hero) et la fin (footer) sont deux moments de marque à haute intensité : la page se mémorise bien. Mais **ni le pic ni la fin ne portent l'action**, ce qui donne un souvenir sans conversion. La fin se résout sur « Back To Home » au lieu de « Réserver ma séance d'essai ».

**Creux.** About (preuves vagues) et surtout Transformation, la section qui devrait apporter la preuve et qui est la plus faible.

**Réassurance aux moments à enjeu.** Il n'y en a aucune. Les trois anxiétés d'un prospect de salle sont le **coût**, l'**engagement** et l'**intimidation**. Aucune n'est traitée : pas de prix, pas de « sans engagement », pas de « séance d'essai offerte », pas de signal « débutants bienvenus ». Le ton (« without excuses », « don't compromise ») accroît même l'intimidation.

---

## 6. Ce qui fonctionne

1. **La typographie comme architecture.** Le même display carré à trois échelles structure la page : H1 hero avec cap-height de 123 px dans le shot (**M**), soit environ 126 px à 1440 et une taille d'environ 170–180 px (**E**) ; « SERVICES. » avec cap-height de 186 px (**M**), soit environ 191 px à 1440 et une taille d'environ 255–270 px (**E**) ; wordmark footer. L'escalier BUILD / STRENGTH (indentation de 209 px dans le shot, **M**) crée une diagonale qui prolonge le coup de poing de l'athlète. La hiérarchie est lisible à 2 m de l'écran. C'est la signature à préserver.
2. **Une palette rationnée avec un rythme clair/sombre.** Rouge #F02B42 (**M**) réservé aux accents, au grand titre Services, aux CTA et au marquee. Sombre #040F0E teinté vert (**M**) plutôt qu'un noir pur, avec des gris secondaires **teintés** dans cette teinte (#949F9E, **M**), ce qui respecte exactement le craft-floor « teinter le secondaire depuis la teinte ». Titres #131829 bleu-nuit sur #F5F5F5 (17,6:1 sur blanc). L'alternance rouge/sombre, blanc, gris, blanc, sombre, blanc, rouge/noir donne une respiration régulière.
3. **Un motif graphique propre et appliqué de façon cohérente.** La « double plaque » décalée apparaît sur tous les boutons (« Learn More About Us », « View All Programs », « Meet the Team », bouton ↪, flèches testimonial) et sur les cadres photo (coach About, portrait Programs, vignettes Services). Associée aux croix de repérage et aux réglures, elle donne au site une grammaire d'objet imprimé que le rouge seul ne donnerait pas. Elle se prête aussi naturellement à une micro-interaction : les plaques qui se « remettent en registre » au survol ou à l'appui.

---

## 7. Problèmes prioritaires

### [P0] Aucune action primaire opérante, et l'offre n'est pas lisible au premier écran
- **Quoi.** Le hero (environ 1100 px de haut à 1440, **M**) ne contient aucun CTA. Les seules actions sont « MENU » et un bouton téléphone en icône seule de 37×38 px dans le shot (**M**), soit environ 38×39 px à 1440. « Join Now » n'existe que dans le footer, en mono d'environ 13 px (**E**). Il n'y a ni prix, ni planning, ni adresse, ni horaires, ni offre d'essai sur toute la page. Le mot « gym » n'apparaît qu'une fois, dans une puce d'environ 11 px (**E**) de la section About. VYRON pourrait tout aussi bien être une marque de vêtements.
- **Pourquoi c'est grave.** mode-persuade exige « a visible primary action in its working form », c'est-à-dire l'action que les visiteurs de la catégorie viennent faire. Pour une salle, c'est **réserver une séance d'essai ou un créneau de cours**, puis voir les tarifs et trouver la salle. Un lien décoratif ne compte pas. Le prospect ne peut pas accomplir sa tâche. Pour le portfolio, le shot montre du stylisme, pas de la pensée produit.
- **Correctif.**
  1. Hero : à la place de « Redefine Your Physical Potential →→→ », une mini-réservation qui fonctionne (« Séance d'essai offerte » avec les 3 prochains créneaux, par ex. « Auj. 18:30 · Strength · 4 places », et un bouton primaire). Les flèches →→→ deviennent l'amorce visuelle qui y mène.
  2. CTA persistant « Réserver un essai » à côté de MENU sur desktop, et barre basse sticky sur mobile.
  3. La grille de registre sous « SERVICES. » (11 colonnes et environ 16 lignes, **M**) devient le **planning hebdomadaire** cliquable.
  4. Dans le footer, « Back To Home » est remplacé par « Réserver un essai », avec adresse, horaires, téléphone et lien itinéraire.
  5. Ajouter un bloc Abonnements (3 offres maximum, mention « sans engagement » si c'est vrai dans la fiction).
- **Commande suggérée :** `/impeccable shape` (définir le flux de conversion), puis `/impeccable layout`.

### [P1] Copie interchangeable et preuves inventées : rien que seul VYRON pourrait dire
- **Quoi.** Tous les titres sont du boilerplate de catégorie : « Build Strength », « Redefine Your Physical Potential », « Built for those who don't compromise on fitness », « Results are built, not given », « Real transformation through client experiences », « Redefining fitness culture », « Push beyond limits ». Les preuves sont invérifiables (voir §10). La description du programme 01 reprend **mot pour mot** l'intro de section (« Whether you're looking to build strength, improve endurance, lose weight, or move better… », **I**, lisible à 4×). Le marquee dit « Fitness Hub », pas VYRON.
- **Pourquoi c'est grave.** C'est le cœur du verdict de spécificité. Un recruteur y lit « template ». Un prospect décote immédiatement des stats sans source.
- **Correctif.** Donner un point de vue à VYRON, par exemple « salle de force à progression mesurée : chaque membre a son registre ». Réécrire chaque H2 pour porter un fait (taille des groupes, spécialités des coachs, horaires, progression). Remplacer les cartes stats par une preuve liée à ce point de vue, par exemple un extrait de registre « Squat 60 → 105 kg en 24 semaines ». Étiqueter toute la fiction (§10).
- **Commande suggérée :** `/impeccable clarify`.

### [P1] La marque échoue en accessibilité : contraste du rouge, gris trop clairs, cibles tactiles
- **Quoi.**
  - Blanc sur #F02B42 : **4,09:1** (**M**, calculé sur l'aplat échantillonné). C'est un échec AA pour « Meet the Team » (label avec cap-height d'environ 11 px, soit environ 16 px de taille, regular, **E**), « View All Programs », « Back To Home », le texte du marquee et le corps de la carte « 4.9 ».
  - Rouge #F02B42 sur #F5F5F5 : **3,76:1** (**M**). Valable pour « SERVICES. » (très grand), en échec pour le petit texte rouge (index 01–04 de Programs, ticks des eyebrows).
  - Gris mono « Trusted by people who demand real fitness results. » sur #F5F5F5 : environ **4,05:1** (**E**, l'anticrénelage sous-estime l'encre). Labels « EXPERT COACHES » sur #040F0E : environ **4,1:1** (**E**). Index d'équipe : environ **3,7:1** (**E**).
  - Cibles tactiles : téléphone d'environ 38×39 px et flèches testimonial d'environ 39–42 px (**E**), donc sous 44 px.
  - Le marquee défile en continu sans pause.
  - Le texte du hero repose sur une photo : environ 6–7,5:1 aujourd'hui (**M**), mais sans scrim garanti au changement d'image.
- **Pourquoi c'est grave.** Pour une pièce jugée sur l'exécution, Lighthouse et axe sont la première chose qu'un recruteur technique lance. Les vrais utilisateurs lisent sur mobile, en extérieur ou dans une salle mal éclairée.
- **Correctif.**
  - Deux tokens rouges. `--red-display` #F02B42 pour les aplats décoratifs et le display ≥ 24 px. `--red-ink` ≈ **#E01028** pour le petit texte rouge sur clair (4,51:1 sur #F5F5F5, **M** calculé) et pour les fonds de boutons à label blanc (4,91:1).
  - Attention : sur sombre, un rouge plus foncé **perd** du contraste (#E01028 sur #040F0E = 3,96:1). Il faut garder #F02B42 (4,75:1) ou l'éclaircir pour le petit texte sur fond sombre.
  - Alternative pour les boutons : labels ≥ 18,66 px en gras, donc « large text » au seuil 3:1.
  - Gris remontés à ≥ 4,5:1, cibles de 44 px minimum, marquee en pause au survol et au focus avec version statique sous `prefers-reduced-motion`, scrim en dégradé sous le texte hero.
- **Commande suggérée :** `/impeccable audit`, puis `/impeccable harden`.

### [P2] Navigation et contrôles ambigus
- **Quoi.**
  - Nav desktop masquée derrière une icône 9 points (proche d'un « app launcher ») et « MENU ».
  - Slogans du hero sur une liste à filets qui imite une nav.
  - Carrousel Services : un seul bouton ↪ (glyphe « refaire / partager ») de 89×88 px dans le shot (**M**), placé à équidistance des cartes 1 et 2 (20 / 21 px, **M**). On ne sait pas à qui il appartient, il n'y a pas de « précédent » ni de position.
  - Le compteur testimonial « 01 » contredit le point actif n°2 (**I**).
  - « Back To Home » sur la page d'accueil.
  - « Learn More About Us » : un label vague, alors qu'un contrôle doit nommer son action.
- **Pourquoi c'est grave.** Jordan ne trouve pas son chemin et Riley relève les contradictions (H1, H5, H6).
- **Correctif.**
  - 4 liens et le CTA visibles dans le header à partir de 1024 px. MENU réservé au mobile.
  - Un seul jeu d'icônes à trait constant (Lucide ou Phosphor) : flèches droites en paire prev/next **attachées** au carrousel, avec un compteur « 02 / 05 ».
  - Un composant de pagination unique pour Services et Testimonials.
  - Slogans sans affordance de lien (pas de hover), ou transformés en ticker animé sur une ligne.
- **Commande suggérée :** `/impeccable clarify`.

### [P2] Du décor structurel qui ne porte aucune information
- **Quoi.**
  - Eyebrows sur 4 sections.
  - Au moins 6 bandes de réglures (**M**) : en haut d'About, de Services, de Transformation, sous le H2 Services, en bas à gauche de Why, en bas du footer.
  - Numéros 01–05 qui n'encodent rien (programmes, équipe).
  - Cellules Why de 237×286 px dont environ 68 % vides (**M**).
  - Cartes hero-metric dans About.
  - Colonne gauche d'About vide (eyebrow seul).
- **Pourquoi c'est grave.** Chaque élément coûte de la hauteur (page d'environ 7 690 px) et de l'attention. Le craft-floor refuse les eyebrows (interdiction absolue), les numéros de section décoratifs, le hero-metric template et les cartes égales. Pour un DA, ce sont les marqueurs « shot Dribbble ».
- **Correctif.** Trancher chaque tension (§11). Recommandation : **une seule** grille de registre, qui porte de la donnée (planning ou carnet), et suppression des autres bandes. Eyebrows supprimés ou fusionnés en un index de section sticky. Cellules Why remplies de preuves (photo du plateau, nombre de coachs, horaires réels) ou réduites à une liste 2×2 à côté du statement.
- **Commande suggérée :** `/impeccable distill`.

---

## 8. Persona red flags

**Jordan (première fois, n'a jamais fréquenté de salle)**
- Test des 5 secondes raté sur le hero : il ne sait pas ce qu'est VYRON ni où cliquer. Les 4 lignes de slogans à filets ressemblent à des liens, et il clique sur « PUSH YOUR LIMITS. ».
- « Services », « Programs », « Classes » : trois mots, trois entrées. « Strength » apparaît 3 fois. Il ne sait pas laquelle est « la sienne ».
- Jargon non expliqué : « Functional Training », « Progressive Training », « High-Intensity ». Aucun niveau (débutant / confirmé) dans les programmes.
- ↪ est lu comme « partager » : il ne comprend pas que c'est « suivant ».
- Rien sur la première séance : quoi apporter, vestiaires, accompagnement. Le ton « Crush it / without excuses » lui dit que ce n'est pas pour lui. **Abandon au hero ou à Services.**

**Riley (stress tester)**
- « Back To Home » sur la page d'accueil : action sans effet.
- Compteur testimonial « 01 » contre point actif n°2 (**I**). « Marcus Roy » : avatar Programs et portrait n°03 qui semblent deux personnes différentes (**I**).
- « Fitness Hub » vs VYRON. Description du programme 01 identique à l'intro.
- « 24/7 Access » alors qu'aucun horaire ni mode d'accès (badge ? accueil ?) n'est donné. « 480+ verified reviews » : vérifiées par qui, et où ?
- « View All Programs » dans un one-page : une 404 probable.
- Carrousel : que se passe-t-il après la dernière carte (boucle ou butée) ? Accordéon : peut-on ouvrir deux items ? Tout fermer ?
- **Robustesse du texte.** « STRENGTHEN YOUR CORE & STABILITY » occupe déjà environ 97 % de sa colonne (environ 705 / 728 px à 1440, **E**). En français (+15 à 30 %), il passe sur 2 lignes. « SERVICES. » occupe 88,5 % de la largeur (**M**), donc « PRESTATIONS. » (12 caractères contre 9) déborde à taille égale. Les capitales accentuées (É, À) entrent en collision avec un interlignage d'environ 1,0 (pas de ligne du H2 de 53–55 px pour un cap-height de 37–38 px, **M**).
- Survol équipe : la carte centrale agrandie (316 px contre 222 px, **M**) semble être un état hover figé. Sur tactile, ce comportement n'est pas défini.

**Casey (mobile, distrait, une main)**
- **Aucune maquette mobile n'existe.** Toutes les décisions responsive restent à prendre, et c'est un risque majeur pour une pièce de portfolio.
- MENU et téléphone sont en haut à droite, hors de la zone du pouce. Le CTA (à créer) doit être une barre basse sticky.
- « SERVICES. » d'environ 16 rem et l'escalier BUILD / STRENGTH doivent être recomposés, pas seulement réduits.
- Le bouton ↪ entre deux cartes ne tient pas sur 375 px. Le carrousel à cartes débordantes est par contre un bon pattern de swipe.
- Poids : photo hero plein cadre, vidéo / visuel Transformation, 5 portraits, 1 photo grand format, 3 vignettes, photo footer, soit plus de 12 images. LCP et data en 4G sont menacés. Le marquee en animation continue distrait et consomme de la batterie.
- Cibles sous 44 px (téléphone, flèches testimonial).

**Camille, directrice de création / recruteuse (60 secondes sur le portfolio)** *(persona dérivé du but déclaré par l'utilisateur, pas d'un Design Context)*
- Parcours type :
  - 0–5 s : chargement du hero. Elle juge le rendu typo, la première animation et la vitesse.
  - 5–30 s : scroll rapide. Rythme et cohérence des reveals.
  - 30–50 s : elle teste une interaction (carrousel, accordéon, survol équipe) et redimensionne la fenêtre.
  - 50–60 s : elle cherche « qu'a fait ce dev ? ».
- **Red flags :**
  - Réplique non créditée d'un genre Dribbble très reconnaissable (gym rouge / noir techno) : soupçon de plagiat immédiat.
  - Preloader plein écran qui retarde le contenu.
  - Le même fade-up sur chaque section, ou un scroll-jacking (Lenis mal réglé) qui rend la page lourde.
  - Visages IA et mains « uncanny » (main au dumbbell de Marcus Roy, **I**).
  - Liens morts (« View All Programs », « Back To Home »).
  - Pas de version mobile. Logo Nike visible sur le débardeur du portrait Programs (**I**). ™ revendiqué sur une marque fictive.
- **Ce qui la convaincrait :** un bandeau « Concept : reconstruction d'un shot de [designer], adapté et animé par moi », des décisions d'adaptation visibles (la grille-planning), un passage axe / Lighthouse propre, un mode reduced-motion, un repo lisible.

**Karim, 34 ans, reprend le sport après 5 ans, hésite à réserver un essai (mobile, le soir)** *(persona dérivé du but « vraie salle »)*
- Ses questions, dans l'ordre : *Où ? Combien ? Engagement ? Est-ce pour les débutants ? Les horaires collent-ils après le travail ? L'essai est-il gratuit ? Puis-je réserver sans appeler ?* La page ne répond à **aucune**.
- Coachs : noms seuls, sans spécialité, certification ni langue parlée.
- « 24/7 Access » sans explication. « 20 Years of Excellence » sans date de fondation ni lieu.
- Seul moyen de conversion : appeler (icône téléphone), le canal le plus coûteux en effort, et inadapté à 22 h.
- Le ton agressif rebute quelqu'un qui revient au sport. **Il ferme l'onglet et compare les avis Google Maps.**

---

## 9. Mode Persuade : l'action primaire « en forme opérante »

| Question mode-persuade | Référence VYRON | Verdict |
|---|---|---|
| L'offre est-elle intelligible au premier écran ? | « BUILD STRENGTH / Redefine Your Physical Potential ». Rien ne dit salle, lieu ou coaching | **Non** |
| Est-elle désirable ? | Oui : photo, type et énergie | Oui |
| Une action claire est-elle exposée ? | MENU et icône téléphone seulement | **Non** |
| L'action est-elle en forme opérante ? | Aucune forme. « Join Now » est un lien texte de footer | **Non** |
| Démontre-t-elle quelque chose que seul ce produit peut prouver ? | Stats génériques et une citation | **Non** |

**Quelle est la vraie action de conversion d'une salle ?**
1. **Primaire : réserver une séance d'essai, ou un cours précis.** Sa forme opérante est un sélecteur de créneaux (équivalent du « open appointment slots » d'une clinique cité par mode-persuade) : jour, cours, places restantes, bouton « Réserver ».
2. **Secondaire : voir les abonnements**, avec prix, engagement et ce qui est inclus.
3. **Tertiaire : trouver la salle**, avec adresse, horaires, accès, itinéraire, et éventuellement appeler.

**Recommandation.** Une forme opérante en deux endroits, dans le vocabulaire du monde :
- dans le hero, un module de 3 créneaux sous les flèches →→→ ;
- dans Services, la grille de registre transformée en planning de la semaine.

Le footer se termine par cette même action et non par « Back To Home ». Pour le portfolio, la réservation peut être simulée (état succès / erreur / complet designé), à condition d'être signalée comme démo.

---

## 10. Affirmations inventées à étiqueter comme fictives

| Affirmation (référence) | Où | Statut / action portfolio |
|---|---|---|
| « 4.9/5 · Average rating from 4?0+ verified reviews » (chiffre partiellement illisible, probablement 480+, **I**) | Carte rouge About | Fictif. Le mot « verified » est trompeur : le retirer ou étiqueter « données fictives » |
| « 20 · Years of Excellence » | Carte About | Fictif. Incompatible avec une marque inventée |
| « Expert certified personal trainers / State-of-the-art gym equipment / Personalized nutrition and training plans » (**I**, texte d'environ 11 px) | Carte About | Allégations génériques. « Certified » est une allégation réglementée en France (BPJEPS, etc.) |
| « 24/7 Access », « Expert Coaches », « Premium Equipment », « Real Community » | Why VYRON | Fictifs, sans substance |
| « Trusted by people who demand real fitness results. » | Services | Allégation de confiance sans source |
| Coachs « Alex Vance, Sarah Jenkins, Marcus Roy, Elena Rostova, Drake Torres » et leurs portraits | Why VYRON / Programs | Personnes fictives, visages probablement générés par IA (**I**). Les étiqueter comme tels. Ne pas réutiliser des visages de stock sans licence |
| Testimonial « Jordan Tucker » et sa citation | Transformation | Témoignage fictif : l'étiqueter (« témoignage illustratif ») |
| « Marcus Roy · 14 Days Training » | Programme 01 | Fictif |
| « VYRON™ » | Logo, footer | ™ revendiqué sur une marque fictive. Vérifier les homonymes réels, ajouter une mention « marque fictive » ou renommer |
| Logo Nike sur le débardeur (portrait Programs, **I**) | Programs | Marque tierce dans l'imagerie : à exclure des prompts Higgsfield |
| Le design lui-même | Tout | **Créditer le designer du shot original**. Indispensable pour un portfolio |

Mention recommandée en pied de page et en tête de case study : *« Projet conceptuel. VYRON est une marque fictive ; chiffres, avis, coachs et témoignages sont illustratifs. Design d'origine : [designer, lien Dribbble], adapté et animé par [toi]. »*

---

## 11. Tensions brief ↔ craft-floor : décisions pour l'utilisateur

| Tension | Référence | Règle craft-floor | Options | Recommandation |
|---|---|---|---|---|
| Eyebrows / kickers | 4 sections, avec ticks rouges et mono | **Interdiction absolue** (« no brief earns it back ») | (a) supprimer · (b) les fusionner en index de section sticky qui suit le scroll (fonctionnel) · (c) garder par fidélité | (b), sinon (a). Garder (c) va contre Impeccable : décision consciente à assumer |
| Display au-delà de 6 rem | H1 d'environ 11 rem, « SERVICES. » d'environ 16–17 rem (**E**) | Display max 6 rem | (a) garder monumental avec `clamp()` et fit-to-width · (b) plafonner | **(a)** : c'est l'identité, le brief l'emporte. Tester FR et mobile |
| Hero-metric template | Cartes 4.9 / 20 ans | À refuser par défaut | (a) remplacer par une preuve liée au point de vue · (b) garder étiqueté fictif | (a) |
| Cartes égales | Why : 4 cellules | À refuser par défaut | (a) liste 2×2 dense · (b) cellules avec preuves visuelles | (b) |
| Numéros de section 01–05 | Services, Programs, Team, Testimonial | Seulement si la séquence informe | (a) supprimer · (b) garder là où c'est une position (« 02 / 05 ») | (b) |
| Mono en costume | Eyebrows, « Trusted by… », chips, nav footer | Mono réservé au code, aux données, aux mesures | (a) mono seulement pour les données (horaires, durées, charges) · (b) garder partout | (a). Le planning et le registre justifient le mono |
| Plaques décalées | Boutons, cadres | Les ombres dures décalées sont interdites hors néobrutalisme | Ce n'est pas une ombre (même couleur) : c'est une forme | **Garder**, mais construite en `clip-path: polygon()` et non en `box-shadow: Xpx Ypx 0` |
| Glyphe ✱ et flèches unicode | 6 astérisques, ↪, →→→ | Pas de glyphes Unicode ou d'emoji comme icônes | (a) SVG authored pour l'astérisque (marque) et une librairie d'icônes à trait constant | (a), obligatoire |
| Réglures / croix de repérage | Au moins 6 bandes | « … standing in for content » | (a) une seule grille, porteuse de données · (b) toutes en décor | (a) |
| **Animation « partout »** (demande utilisateur) | Shot statique | « One authored moment, not scattered effects and not one identical entrance on every section. Exponential ease-out from an already-visible default. » | (a) un moment signature, des micro-interactions sobres et des reveals différenciés · (b) des reveals sur chaque section | **(a)**. Le contenu est visible sans JS (pas d'`opacity:0` en attente de script), avec un mode `prefers-reduced-motion` complet |

---

## 12. Observations mineures

- **Ordre de lecture du H1.** Visuellement : BUILD, « Redefine… », STRENGTH. Dans le DOM, `<h1>Build strength</h1>` doit rester d'un seul tenant, le sous-titre venir après, et les flèches →→→ être en `aria-hidden`.
- **Étalonnage photo** incohérent : hero rouge monochrome, vignette Services 1 rouge-orangé, carte 3 en N&B, équipe gris-bleu studio souriante, Transformation sépia vintage, footer rouge. Il faut définir une recette unique avant de générer les images avec Higgsfield, par exemple duotone rouge pour l'action et neutre froid pour les portraits.
- **Transformation.** La barre noire sous l'image (environ 635 px de large dans s6, **E**) est illisible : scrubber vidéo ou carte empilée ? À décider. Le boxeur sur la photo n'a aucun lien avec l'auteur de la citation.
- **Corps de texte** d'environ 15 px (**E**) avec un pas de ligne de 20 px (**M**) : correct en légende, petit en paragraphe sur une landing à 1440. Viser 16–17 px.
- **Trois familles** (display carré, grotesque, mono) : c'est la limite haute. Le display est à sourcer et à auto-héberger : pas de fallback système (Impact, Arial Black), interdit par le craft-floor.
- **Footer :** pas d'adresse, d'horaires, d'e-mail ni de mentions légales. Une vraie salle en France doit afficher des mentions légales. Pour le portfolio, ajouter la ligne « projet fictif ».
- **Croix de repérage** à pas d'environ 420 px dans le shot (**M**), soit environ 432 px à 1440 : elles révèlent une grille à 4 colonnes. C'est un détail à garder, et un bon point d'ancrage pour l'animation d'entrée du hero.
- **Gouttière latérale** de 58 px dans le shot (**M**, logo à x=159, H2 à x=158–161), soit environ 60 px à 1440.
- **Bouton « Meet the Team »** de 195×44 px dans le shot (**M**), soit environ 200×45 px. Le label est dans le display alors que « Learn More About Us » semble en grotesque (**I**) : unifier.
- **About :** le H2 « We forge stronger, healthier bodies… » est poussé à droite, et la moitié gauche ne contient que l'eyebrow. C'est voulu (asymétrie) mais vide. Le remplir avec une donnée ou réduire la hauteur.
- **Marquee :** environ 51 px de haut (**M** × k), séparateurs en glyphes. Le texte « Fitness Hub » est à remplacer par du contenu de marque ou d'info (horaires, prochains cours).
- **Transitions entre sections :** les bandes de réglures font office de séparateur. Si on n'en garde qu'une (dernier P2 du §7), il faut un autre principe d'espacement vertical régulier, comme le demande mode-persuade (« sections keep a steady vertical rhythm »).

---

## 13. Questions provocatrices

1. **Et si la grille de registre était le planning ?** La seule réglure conservée deviendrait le formulaire de réservation. Le motif cesserait d'être un décor et deviendrait la conversion.
2. **Sans logo ni photos, qui reconnaîtrait VYRON ?** Quelle est la chose que VYRON fait et qu'aucune autre salle ne fait, et pourquoi n'est-elle pas dans le hero ?
3. **Vers quoi pointent les flèches →→→ ?** Aujourd'hui vers rien. Elles devraient pointer vers 3 créneaux réservables.
4. **« Crush it / Dig deeper / without excuses » : est-ce la voix que tu veux montrer ?** Dans une catégorie saturée d'agressivité, une voix exigeante mais accueillante pour les débutants serait plus distinctive et convertirait mieux. Laquelle sert le mieux ton portfolio ?
5. **Où va le budget motion ?** Un moment signature (par ex. les plaques qui se remettent en registre pendant que BUILD / STRENGTH s'assemble sur les croix de repérage) ou des reveals partout ? Que voit un visiteur en `prefers-reduced-motion` ?
6. **Anglais (fidélité au shot) ou français (ton marché) ?** En français, chaque ligne de display va se recomposer (« SERVICES. » → « PRESTATIONS. », « BUILD STRENGTH » → « FORGE TA FORCE »), et les capitales accentuées imposent de revoir l'interlignage.