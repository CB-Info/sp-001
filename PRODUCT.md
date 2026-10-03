# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Nuxt 4.5 en génération statique (`nuxt generate`), Vue 3.5, TypeScript ~6.0, GSAP 3.15 comme moteur d'animation unique dans la page (ScrollTrigger, SplitText, Flip, CustomEase), Lenis 1.3 sous conditions. C'est le choix de l'auteur, consigné dans [ADR 0001](docs/adr/0001-stack-nuxt-gsap.md).

À décider : l'approche des styles (CSS scopé et tokens, ou Tailwind 4) et l'hébergeur (Vercel ou Cloudflare).

## Users

- **Public principal** : recruteurs, directeurs et directrices de création, clients potentiels qui arrivent depuis le portfolio de l'auteur, un développeur front.
  - **Situation** : une visite courte, de 30 à 90 secondes, d'abord sur desktop, souvent suivie d'un redimensionnement ou d'un passage sur mobile. Certains ouvrent les DevTools, Lighthouse ou le dépôt GitHub.
  - **Ce qu'ils évaluent** : le niveau d'exécution, c'est-à-dire l'animation, les micro-interactions, les survols, la finesse typographique, la tenue responsive, l'accessibilité, la performance et la clarté du code.
- **Public fictif (cadre de la démo)** : un prospect d'une salle de sport orientée force et coaching. Il ne sert qu'à rendre la page crédible ; aucune conversion réelle n'est attendue.

## Product Purpose

CLUSEM est une pièce de portfolio. C'est la **reproduction fidèle et animée** d'une landing page de salle de sport dessinée par un autre designer (shot Dribbble « VYRON »). La structure et le design sont repris, les défauts d'accessibilité, de responsive et d'états sont corrigés, et le mouvement est ajouté.

**Critère de succès** : le visiteur est **impressionné** par l'exécution (animation, micro-interactions, survols), sans aucun compromis sur l'accessibilité (WCAG 2.2 AA) ni sur la performance (Core Web Vitals au vert), et le code se lit comme un livrable à part entière.

## Positioning

- **Fidélité mesurée.** Une référence épinglée, reproduite d'après des mesures au pixel (grille, échelle typographique, palette, polices identifiées par rendu) plutôt qu'à l'œil.
- **Un mouvement né de la référence.** Le moment signature « Vitesse → Arrêt » vient des motifs propres au shot : le flou de bougé photographique devient la silhouette en escalier des contrôles. Ce n'est pas un catalogue d'effets génériques.
- **Une qualité vérifiable.** L'accessibilité, la performance et le mode mouvement réduit sont testés et publiés.
- **De la transparence.** L'auteur original est crédité, la fiction est étiquetée et la provenance des images est intégrée aux fichiers.

## Operating Context

- **Parcours de visite** : arrivée depuis le portfolio de l'auteur, sur une URL dédiée (sous-domaine).
- **Ce qui sera vérifié** : la page, son comportement au clavier et en mouvement réduit, son rendu mobile, son score Lighthouse, ainsi que le README et les ADR du dépôt.
- **Les décisions et la méthode sont documentées** :
  - l'analyse dans `docs/analyse/` ;
  - les décisions dans `docs/adr/` ;
  - les règles de design dans ce fichier et dans `DESIGN.md`, qui sera écrit en fin de construction.

## Capabilities and Constraints

### Périmètre de la v1

- **Une seule page**, qui doit être irréprochable.
- Le menu plein écran mène aux sections de la page.
- Les liens secondaires de la référence (« Learn More About Us », « View All Programs », « Meet the Team », « Join Now », etc.) mènent à des ancres. **Aucun lien mort.**

### Fidélité

La référence est reproduite telle quelle : structure, ordre des sections, motifs, contenus, eyebrows, numéros, cartes de statistiques, labels en mono, display géant.

### Correctifs autorisés

- contraste ;
- versions mobile et tablette ;
- états d'interaction (survol, focus, appui, désactivé) ;
- accessibilité (clavier, lecteurs d'écran, mouvement réduit) ;
- performance ;
- défauts de cohérence internes à la référence : deux encres de titre, trois tailles de H3, casse des labels, compteur de témoignage contradictoire, un même coach avec deux visages.

**Pas de changement stylistique** au-delà de ces correctifs.

### Animation

Niveau d'ambition **maximal** (« je veux être impressionné »), dans le cadre des règles de mouvement d'Impeccable : un moment signature, une grammaire cohérente, un parcours complet en mouvement réduit et un budget de performance tenu.

### Images

Toutes sont générées avec Higgsfield :
- aucune image du shot en entrée ;
- aucune marque visible ;
- personnes fictives étiquetées comme telles ;
- étalonnage cohérent par famille.

### Encore indécis

- la langue du contenu ;
- l'approche des styles ;
- le niveau d'overdrive (WebGL) ;
- l'hébergeur ;
- le nom et le lien du designer d'origine à créditer.

## Brand Commitments

- **Nom** : **CLUSEM**, marque fictive, remplace « VYRON » partout (logo, wordmark du footer, textes). Le logo s'écrit en Tektur 700 : il n'utilise plus le « Y » signature de Tektur.
- **Univers visuel épinglé par la référence** :
  - typographie : **Tektur** (500 display, 600 titres, 700 logo), **Inter Tight** (lead), **Inter** (corps), **IBM Plex Mono** (labels) ;
  - couleurs : un seul rouge de marque `#F02B42`, décliné en rôles accessibles ; encre marine `#171A32` ; noir pur `#000` ; nuit sarcelle `#040F0E` ; papier `#FFFFFF` et `#F5F5F5` ;
  - motifs : silhouette en escalier (deux plaques de même couleur décalées), astérisque à 8 branches, trames réglées à 11 colonnes, repères de calage « + », règles graduées, numéraux géants.
- **Fidélité assumée contre le craft-floor d'Impeccable.** L'auteur a choisi de conserver les eyebrows, les numéros de section, les cartes « hero-metric », le mono en labels et le display au-delà de 6rem. C'est une décision de marque délibérée, pas un oubli.
- **Crédit obligatoire** au designer du shot d'origine (nom et lien à fournir), dans le footer de la démo, le README et l'étude de cas.

## Evidence on Hand

- 4 captures de la référence : une page entière en basse définition, plus le hero, Services et Why VYRON en haute définition. Elles ne sont pas versionnées, pour respecter les droits du designer.
- L'analyse mesurée : [`docs/analyse/00-synthese.md`](docs/analyse/00-synthese.md) et ses annexes.
- **Absences à ne pas combler par de la fiction présentée comme réelle** :
  - il n'existe ni vrais clients, ni vrais avis, ni vraie note, ni ancienneté, ni adresse, ni horaires, ni tarifs ;
  - les chiffres de la référence (« 4.9/5 », « 480+ verified reviews », « 20 Years of Excellence ») et les témoignages sont **fictifs**, et la page doit le dire (« Projet conceptuel : marque, personnes, chiffres et avis fictifs ; visuels générés par IA ») ;
  - aucune donnée structurée `LocalBusiness` ni `AggregateRating` ;
  - aucun numéro de téléphone réel.

## Product Principles

1. **Mesurer avant d'interpréter.** La référence fait foi. Toute divergence est un correctif listé, jamais une préférence.
2. **Le mouvement vient de la matière.** Chaque animation dérive d'un motif de la référence (vitesse, plaques, trames, astérisque) et explique un état, un retour ou une relation. Un moment signature, pas des effets dispersés.
3. **L'accessibilité et la performance font partie de l'effet.** Une page impressionnante reste lisible, utilisable au clavier, sobre en mouvement réduit et rapide sur un mobile moyen.
4. **Transparence.** Le crédit, la fiction étiquetée et la provenance des images sont visibles.
5. **Le code est un livrable.** La structure est lisible, les tokens viennent d'une source unique, chaque décision structurante a son ADR, et des tests prouvent la qualité.

## Accessibility & Inclusion

- **WCAG 2.2 niveau AA** :
  - contrastes : 4,5:1 pour le texte, 3:1 pour le grand texte et l'interface ;
  - focus toujours visible, jamais masqué par l'en-tête collant ;
  - cibles d'au moins 24 px, 44 px visés au tactile.
- **Patterns APG** pour l'accordéon, les carrousels et le menu (dialog).
- **Parcours `prefers-reduced-motion` complet** : moins de mouvement, mais les changements d'état restent lisibles. Pas de smooth scroll ni de défilement automatique. Une pause globale pour tout ce qui bouge en continu.
- **Contenu visible sans JavaScript.**
- **Lisibilité** : texte de 14 px au minimum (16 px pour le corps), testé en zoom à 200 % et 400 % et en mode contrastes forcés.
