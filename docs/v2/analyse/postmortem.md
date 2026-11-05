# Post-mortem V2 « Le Club » (CLUSEM, vert bouteille et canari)

## Preuves citées

| Clé | Capture                                                                                                     | Contenu                        |
| --- | ----------------------------------------------------------------------------------------------------------- | ------------------------------ |
| C0  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/sc-desktop.png            | page entière, 1440 × 13 642 px |
| C1  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/sc-desktop-0.png          | hero, chiffres                 |
| C2  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/sc-desktop-1.png          | méthode, disciplines           |
| C3  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/sc-desktop-2.png          | disciplines, calendrier        |
| C4  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/sc-desktop-3.png          | effectif, cartes coach         |
| C5  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/sc-desktop-4.png          | tarifs, tribune, écharpe       |
| C6  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/sc-desktop-5.png          | FAQ, club-house, plan          |
| C7  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/sc-desktop-6.png          | essai, footer                  |
| C8  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/rm-mobile-sheet-0.png     | planche mobile 1               |
| C9  | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/rm-mobile-sheet-1.png     | planche mobile 2               |
| C10 | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/ix-season.png             | tarifs à la saison             |
| C11 | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/ix-flock.png              | flocage                        |
| C12 | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/ix-flip.png               | carte coach retournée          |
| C13 | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/w-1920.png                | hero à 1920 px                 |
| C14 | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/disc.png                  | photo des disciplines          |
| C15 | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/s/h2-desktop.png            | hero, état final               |
| V1a | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit/v1-d-hero.png        | hero de la V1                  |
| V1b | /tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/capfit/v1-d-02-services.png | services de la V1              |

Les captures sc-* et ix-* datent de 10 h 21 à 10 h 44. Elles précèdent le commit `2565c2a` (10 h 48), qui a retiré les surtitres « 02 LE CLUB EN CHIFFRES ». Le code actuel n'a fait que déplacer le tic : le badge numéroté est maintenant dans le `h2`.

## 0. Verdict

- **Cause racine.** La V2 est née comme « contrepoint de la V1 » (`docs/v2/analyse-v1.md` §4). Elle s'est donc interdit tout ce qui rendait la V1 premium : le noir, la photo plein cadre, le titre géant posé sur l'image, le mouvement fort. Son brief exigeait même « sans aucun trait partagé en surface avec la V1 » (`docs/brief/v2.md` §2).
- **Monde inventé.** La V2 traite la salle comme un club de foot fictif. Ce monde n'a aucun lien avec la marque réelle CAP FITNESS : noir, chartreuse, tracé ECG, contour et plein.
- **Résultat.** On obtient une landing de template exhaustive : 12 sections, claire, plate, enfermée dans 1 280 px, avec une seule échelle de titre et des entrées en fondu. Des gadgets (flocage, écharpe, carte à retourner, billet) remplacent l'art direction.

## 1. Pourquoi elle fait « site IA générique »

### Structure et rythme

- **Une page-checklist.** On trouve chiffres, méthode en 3 étapes, disciplines, planning, équipe, 3 tarifs, témoignages, bandeau défilant, FAQ, accès, formulaire et footer (`app/pages/v2.vue` l.51-63). La page fait 13 642 px à 1440, soit environ 15 écrans (C0).
- **Sections clonées.** Toutes portent `.club-section` (`app/assets/css/v2.css`) : même `--section-pad` (124 px à 1440), même conteneur de 1 280 px, même alignement à gauche. Un filet de 2 px (`border-block-end`) passe sous chacune (C1-C7).
- **Alternance mécanique.** Les fonds suivent blanc, brume, blanc, vert, etc. Sept sections sur douze sont claires : `--bg: var(--kit-white)` et `[data-surface='mist']`.
- **Aucune rupture.** Hors hero, rien n'est plein écran ou épinglé. Il n'y a ni vide volontaire ni compression.

### Têtes de section identiques

- Onze sections passent par `ClubSectionHead.vue` : badge « 02 » à « 12 », titre en Saira large et capitales, chapô gris limité à 38rem. Tout est aligné à gauche, à la même taille `--text-display` (72 px max) et dans le même bloc de 52rem (C1-C7).
- Elles entrent toutes avec la même animation : titre de 1,05 à 1 puis badge de 0,6 à 1 (`ClubSectionHead.vue` l.27-50).

### Cartes uniformes et matières SaaS

- Trois cartes de tarifs, dont celle du milieu mise en avant « Le plus choisi » : c'est le gabarit de pricing SaaS (C5, C10).
- On trouve aussi 5 cartes coach clonées (C4), 6 cartes de disciplines sur mobile (C8), 3 étapes 01/02/03 (C2), 3 témoignages avec avatar rond (C5) et un tableau de 4 chiffres (C1).
- Dans `app/components/v2/`, je compte 16 `--radius-card` (14 px), 13 `--shadow-card/lift` (ombre douce floue) et 16 `--radius-pill`. C'est la matière par défaut des landings SaaS.
- Les filets fins sont partout : 38 bordures de 1 ou 2 px. Ils servent aux listes (disciplines, FAQ, horaires), au cadre de touche et au rond central du hero, et passent sous chaque section.

### Typographie

- **Une seule voix.** La règle globale `[data-site='v2'] :is(h1, h2, h3)` impose graisse 800, chasse 125 % et capitales (`v2.css`, couche base). Tous les titres parlent pareil.
- **Police de template.** Saira large et grasse fait « template esport ou club ». Elle n'a ni coupe, ni contour, ni italique.
- **Surtitres partout.** J'ai compté 29 `.club-label` en capitales espacées de 0,08em : « FLOQUE TON MAILLOT », « PROCHAIN COURS », « CARTE DE SAISON », « HORAIRES », « ADRESSE », « UNE SÉANCE DE FORCE, EN CHIFFRES »… Le surtitre est chassé des têtes mais revient dans chaque bloc.
- **Aucun contraste de style.** Le texte courant est un Schibsted gris de 17 à 23 px. Il n'y a ni jeu plein/contour, ni condensé, ni italique.

### Palette et contraste

- **Couleurs hors marque.** Le vert `#0f5233` et le canari `#ffd83d` forment une palette de club de foot (type Nantes ou Brésil). Elles n'ont rien à voir avec CAP (noir `#080808`-`#181818`, chartreuse ≈ `#C8D24A`).
- **Pas de lumière.** Les deux teintes sont mi-saturées. Il n'y a ni noir profond ni source de lumière. La brume `#eef3ef` et le blanc donnent un fond d'outil SaaS.
- **Accent dilué.** Le canari est partout : CTA, badges, prix, bande du maillot, anneaux d'avatar, guillemets, 4 macarons « 2 mois offerts » (C10). L'accent n'accentue plus rien.
- **Bruit sans profondeur.** Sur les champs verts, des rayures de tonte en `repeating-linear-gradient` (`ClubHero.vue`) ajoutent du bruit, pas de relief.

### Iconographie

- L'écusson est un clip-art : bouclier, kettlebell et étoile (`ClubCrest.vue`).
- On retrouve tout le kit générique : coches dans les tarifs, « + » cerclés dans la FAQ, flèche → sur chaque CTA, icône de rotation « Voir la fiche », « i » d'info dans le formulaire, guillemets en chevrons jaunes, pastille « M » de métro, code-barres du billet.
- Le plan stylisé en blocs blancs (`ClubHouse.vue`, C6) ressemble à un espace réservé de maquette.

### Photographie

- **Banque d'images IA.** Plein jour, béton clair, fenêtres d'atelier, tout le monde dans le même maillot vert et jaune. Les poses sont frontales et en rang (photo d'équipe, C4). Les portraits ont tous le même fond gris-vert (C4, C12).
- **Aucune photo plein cadre.** Toutes sont enfermées dans 1 280 px, avec coins arrondis et ombre. Pas d'étalonnage, pas de grain, pas de contre-jour.
- **Hero sans photo.** C'était un choix pour le LCP (`v2.vue` l.29) : 1,0 s, payé en premium.
- **Photo molle.** La photo des disciplines est floue à 1440 (C14). Cause probable : `sizes="lg:620px"` pour un panneau d'environ 736 px CSS (`ClubDisciplines.vue` l.158).
- **Blocs vides sur mobile.** En capture pleine page mobile, les cartes sans image deviennent des blocs vides (C8, C9). L'image paresseuse n'était pas chargée, et il n'y a aucun fond de repli étalonné.

### Hiérarchie et échelle

- **Un seul moment display.** Seul le hero est grand : `--text-hero` plafonne à 8,25rem, soit 132 px. Tout le reste plafonne à 72 px.
- **Hero perdu à 1920.** Le contenu reste centré sur 1 280 px et le titre fait environ 620 px de large (C13).
- **Écart avec la V1.** Dans la V1, « SERVICES. » occupe toute la largeur sur environ 190 px de haut (V1b). Hors hero, le rapport titre/corps vaut environ 4:1 en V2, contre environ 11:1 en V1.

### Hero de template

- Il est coupé 50/50 : texte à gauche, illustration à droite, deux pilules (pleine et contour), puis une ligne « Saison · Club · Ville » (C15, C13).
- Le maillot est un SVG à dégradé avec un cintre : un clip-art (`ClubJersey.vue`, C11).

### Mouvement

- **Entrées génériques.** J'ai compté 11 entrées par fondu avec translation de 10 px ou mise à l'échelle, plus des compteurs qui défilent (`ClubStats.vue`).
- **Un seul scrub.** C'est l'écharpe (`ClubScarf.vue` l.98). Il n'y a ni pin, ni scène, ni WebGL, alors qu'OGL est dans la pile.
- **Signature confinée.** Le flocage se joue dans un champ de saisie. Le retournement de carte (C12) est un gadget.

### Absence de moment fort

- « Floque ton maillot » n'a ni enjeu émotionnel ni lien avec la salle réelle. On ne le voit pas en défilant, et il ne se partage pas.

### Densité

- On trouve du micro-texte de 13-14 px partout :
  - notes de fiction ;
  - pastilles « 60 min / Groupes de 8 / Tous niveaux » ;
  - « Saison 26/27 · N° 0001 » ;
  - légendes grises.
- Tout est dit, rien n'est montré.

### Contenu et métaphore

- **Métaphore foot étirée.** On lit « effectif », « tribune », « écharpe », « carte de saison », « plan de jeu », « Six façons de jouer », « chaque cours se joue comme un match ». Le ton est celui d'un concept généré, pas d'une salle de village.
- **Fiction encombrante.** Il y a 412 membres, 5 coachs nommés repris de la V1 (Alex, Sarah, Marcus, Elena, Drake), Lyon, « 12 rue des Canaris ».
- **Contenu réel absent.** Rien de CAP n'apparaît : Pound, Cardio Jump, Step, CAF, réservation par l'appli, « Plus qu'une salle, une famille ».

### Finition visible

- À la saison, le « 90 » est décalé par rapport à « 30 » et « 45 » (C10).
- Le macaron « 2 mois offerts » apparaît 4 fois dans la même vue (C10).
- Les cartes coach font environ 230 px de large, et le bouton pilule est à cheval sur le bord (C4, C12).

## 2. Ce qui manquait pour être premium

### Échelle et contraste typographique

- Il faut trois niveaux extrêmes : des mots-blocs de 12 à 20vw, un corps de 16-17 px, et des libellés rares.
- Le dessin doit venir du logo :
  - « CAP » en contour, « FITNESS » plein et condensé à coupes ;
  - « BY EBC SPORT » en italique chartreuse ;
  - interlignage serré, graisses contrastées.
- Le rapport titre/corps doit atteindre au moins 8:1, comme en V1.

### Profondeur

- Étager les noirs : `#080808` / `#111` / `#181818`.
- Traiter la chartreuse comme une lumière ou une matière, jamais comme un aplat.
- Ajouter grain, vignettage, et des couches où la photo, le lettrage et le tracé se croisent. La V2 n'a que des aplats et des ombres portées.

### Photographie

- Une série noir et blanc sombre et contrastée, sur le modèle de la bannière `capfit/3.png`.
- L'accent citron vient seulement de la lumière ou de la matière.
- Au moins 3 photos plein cadre (100vw).
- Alterner des cadrages serrés (mains, magnésie, pédalier, souffle, sueur) et des plans larges. Garder du flou de bougé, des gens non posés, un étalonnage commun et des recadrages dirigés pour le mobile.

### Art direction

- Un système tiré de la marque :
  - le tracé ECG comme fil conducteur, séparateur, indicateur « maintenant » et progression ;
  - le dégradé noir → citron du maillot (`2.webp`) comme matière de transition ;
  - le jeu contour/plein du logo.
- Reprendre de la V1 la mesure (grille, échelle, discipline), pas ses signes.

### Mouvement signature

- Un seul geste propriétaire : le pouls ECG qui se trace et accélère avec le défilement, ou qui bat jusqu'au prochain cours.
- Il est scrubbé ou épinglé, piloté par tokens, avec un état final par défaut. WebGL (OGL) reste possible s'il est chargé à la demande, comme l'overdrive de la V1.
- Les entrées secondaires restent rares et sobres.

### Micro-interactions

- Survol de photo : passage du noir et blanc à l'accent.
- CTA : une impulsion ECG au survol ou à l'appui.
- Calendrier : le cours survolé s'allume sur le tracé.
- Focus visibles aux couleurs de la marque.
- La V2 ne fait que changer une couleur et réduire l'échelle à 0,97.

### Rythme et respiration

- Six à huit chapitres au lieu de douze.
- Alterner plein écran, bloc serré, et un vrai vide noir.
- Au moins une scène épinglée, et au moins trois paddings de section différents.

### Éditorialisation

- Partir du contenu réel du flyer :
  - planning de la rentrée : Pound, Cardio Jump, Step, Cross Training, CAF, Pilates, Yoga, Stretching ;
  - « Tous niveaux », « Coachs diplômés », « Ambiance motivante », « Sport santé & bien-être » ;
  - réservation par l'application CAP FITNESS ou à l'accueil ;
  - « Plus qu'une salle, une famille ! », « Ensemble, allons plus loin ».
- Le réécrire au tutoiement : une phrase forte par chapitre, pas un chapô gris.
- Marquer clairement le planning « à confirmer ».

### Budgets à anticiper

- **JS.** `/v2` charge déjà 105,1 Ko gzip pour un budget de 110 Ko (`docs/verification/v2.md` l.21). La signature et WebGL doivent arriver à la demande.
- **LCP.** La V2 a gagné 1,0 s en retirant la photo du hero. La V1 est à 3,0 s simulé. Un hero photo premium demande un AVIF préchargé, des tailles dirigées et un titre en HTML.

## 3. À garder techniquement

| Élément                 | Fichier                                                                   | Raison                                                                                                                                                                                                           | Adaptation                                                                                              |
| ----------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Temps du club           | `app/utils/club-time.ts`                                                  | `weekdayOf`, `sessionStates`, `nextSession` (15 min de grâce), `openStatus`, `useClubClock` : rendu serveur neutre, puis heure du visiteur tenue à la minute                                                     | Brancher le planning CAP du flyer : « prochain cours », « ouvert maintenant »                           |
| Logique du calendrier   | `ClubSchedule.vue`                                                        | Onglets APG au clavier (flèches, Début, Fin), filtres en radios natives, jours empilés sans JS, `html.js` qui masque sans saut de mise en page, jour courant sélectionné au montage, ligne « Maintenant »        | Garder la logique, refaire tout le rendu (la ligne « maintenant » devient un tracé ECG)                 |
| Formulaire d'essai      | `ClubTrial.vue`                                                           | Validation en français à l'envoi, messages liés aux champs, focus sur la première erreur, bouton désactivé sans JS avec note, confirmation qui reçoit le focus, rien n'est envoyé, préremplissage par `useState` | Supprimer la reprise du prénom du maillot et le billet ; garder la discipline reprise du calendrier     |
| Tokens par site         | `v2.css`, `html[data-site]`                                               | Rôles sémantiques communs avec la V1 (`--bg`, `--ink`, `--accent-fill`, `--dur-*`, `--ease-*`) ; surfaces `data-surface` qui redéfinissent les rôles ; `@layer` redéclaré (bug d'ordre d'insertion documenté)    | Garder le mécanisme, jeter toutes les valeurs (pitch, canary, mist)                                     |
| Fondations du mouvement | `useMotion`, `app/motion/{sequence,tokens,gsap}.ts`                       | `ENTRY`, `reached()`, `capped`, durées lues dans le CSS, GSAP chargé à l'approche, jamais en mouvement réduit                                                                                                    | Telles quelles                                                                                          |
| Modèle de données       | `app/types/club.ts`, `app/data/club.ts`                                   | Aucun texte en dur dans les composants ; types `Session`, `Discipline`, `OpeningHours`, `Plan`                                                                                                                   | Remplacer le contenu ; ajouter un statut « à confirmer » ou « exemple » par donnée                      |
| FAQ                     | `ClubFaq.vue`                                                             | `<details name>` natif et exclusif                                                                                                                                                                               | Seulement si le contenu vient de CAP                                                                    |
| En-tête                 | `ClubHeader.vue`                                                          | Collant et compact au défilement, tiroir mobile en `role="dialog"`                                                                                                                                               | Refaire le style ; vérifier le piège de focus et Échap (non vus dans le fichier)                        |
| Images                  | `NuxtPicture` + variantes                                                 | AVIF/WebP, point focal en `object-position`, provenance embarquée                                                                                                                                                | Corriger les `sizes` ; jeter toutes les images v2 (kit vert/jaune)                                      |
| Tests                   | `tests/e2e/v2/{accessibilite,clavier,sans-js,mouvement,parcours}.spec.ts` | axe sur 4 états, clavier, sans JS, mouvement réduit, scénario « maintenant »                                                                                                                                     | Garder le harnais et les scénarios calendrier et formulaire ; supprimer flocage, retournement et saison |
| Transparence            | `.club-note`, lien d'évitement, préchargement de la police LCP            | Mentions toujours lisibles                                                                                                                                                                                       | Devient un bandeau « Maquette non officielle » + `noindex`                                              |

Mesures actuelles à ne pas dégrader : axe 0 violation, Lighthouse mobile 99, JS 105,1 Ko (`docs/verification/v2.md`).

À jeter : `ClubJersey`, `ClubFlockField`, `ClubScarf`, `ClubCoachCard` (retournement), `ClubCrest`, `ClubStats`, `ClubPlans` (3 cartes), `ClubTribune`, le plan de `ClubHouse`, `ClubSectionHead`, Saira, et les tokens pitch, canary et mist.

## 4. Interdits pour la refonte

1. **Aucune couleur V2.** Zéro occurrence de `#0f5233`, `#ffd83d`, `#eef3ef`, `pitch-*`, `canary-*`, `mist-*` dans le code de `/v2`.
2. **Aucune section à fond clair** (blanc, crème, brume). Vérification : fond calculé de chaque `section` avec une luminance ≤ celle de `#1c1c1c`.
3. **Chartreuse = accent rare.**
   - Jamais en aplat de section.
   - Au plus un élément chartreuse dominant par écran.
   - Zéro `text-shadow` lumineux, zéro `background-clip: text`, zéro dégradé de texte.
4. **Pas de surtitre.** Aucun badge numéroté ni libellé en capitales espacées au-dessus d'un titre. Au plus 6 éléments non-titres avec `text-transform: uppercase` et `letter-spacing` > 0,05em dans toute la page.
5. **Pas de tête de section clonée.** Au plus 2 chapitres partagent le même gabarit de titre. Pas de composant « SectionHead » unique.
6. **Échelle.**
   - Au moins 3 moments typographiques ≥ 12vw (≥ 170 px à 1440).
   - Titres de chapitre ≥ 96 px sur ordinateur.
   - Rapport display/corps ≥ 8.
7. **Pas de grille de cartes identiques à 3 éléments ou plus.** Pas de tarifs en 3 colonnes avec « Le plus choisi », pas de cartes coach clonées, pas d'étapes 01/02/03, pas de rangée de témoignages.
8. **Pas de rangée de chiffres-clés** ni de compteur animé.
9. **Pas de coins arrondis ni d'ombres floues.** Au plus 4 px de rayon sur photos et panneaux. Aucune `box-shadow` floue > 8 px. Au plus 2 styles de bouton.
10. **Hero.** Pas de 50/50 « texte + illustration + deux pilules ». Pas d'illustration vectorielle (maillot, écusson, plan stylisé). Une seule action principale.
11. **Photo.**
    - Au moins 3 images plein cadre (100vw), dont le hero.
    - Une série noir et blanc sombre au même étalonnage.
    - Zéro photo de plein jour ou de béton clair, zéro pose frontale en rang, zéro tenue uniforme imposée.
    - Aucun texte ni marque dans les images ; le logo CAP est posé en code seulement.
12. **Aucune métaphore étrangère à la marque.** Un grep doit renvoyer 0 pour : maillot, flocage, effectif, tribune, écharpe, « carte de saison », match, terrain.
13. **Pas de transplantation de la V1.** Ni astérisque, ni silhouette en escalier, ni trame tableur, ni rouge `#F02B42`, ni Tektur. Reprendre sa mesure et son mouvement, pas ses signes.
14. **Motifs fondateurs = ceux du logo seulement :** tracé ECG, lettrage contour/plein, dégradé noir → citron.
15. **Pas d'icônes génériques.** Ni coches de liste, ni « + » cerclés, ni flèche → systématique, ni « i », ni pictos du flyer (haltère, kettlebell, trampoline, calendrier), ni emojis.
16. **Mouvement.**
    - Le fondu + translation n'est pas le langage par défaut : au plus 6 occurrences.
    - Au moins une scène scrubbée ou épinglée portée par le tracé ECG.
    - Pas de bandeau défilant.
    - Sans JS et en mouvement réduit, le contenu est identique.
17. **Rythme.** Au plus 8 chapitres, au moins 3 valeurs de padding de section, aucun filet de séparation systématique sous les sections.
18. **Aucune copie du flyer.** Ni tableau vert à cases, ni bannière inclinée, ni script manuscrit, ni pictos. Seul le contenu est repris, marqué « planning de la rentrée, à confirmer ».
19. **Aucune donnée inventée présentée comme réelle.**
    - Pas de sponsor tiers : grep « ALVAR » = 0.
    - Pas de coachs nommés ou montrés comme réels.
    - Pas de chiffres, tarifs, avis, adresse ou téléphone inventés hors espaces réservés étiquetés. Grep « 412 », « Canaris », « Lyon », « Drake » = 0.
    - Bandeau « Maquette non officielle » visible et `noindex` présent.
20. **Typographie.**
    - Zéro Saira et zéro `font-stretch` à 125 %.
    - Pas de règle globale qui met tous les `h1`-`h3` en capitales.
    - Aucune police de la liste surutilisée en display.
    - Au plus 2 familles.
