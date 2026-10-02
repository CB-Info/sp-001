> **Annexe brute** : rapport de l’agent `s1-stack`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

# VYRON — Analyse `s1-stack` : recommandation de stack technique

> Lentille : choix technologique, vérifié sur des données à jour au **2 octobre 2026**.
> Périmètre : landing page « Persuade » très animée (+ 2 à 4 sous-pages), pièce de portfolio jugée sur le craft.
> Aucune ligne du site n'a été écrite. Les seuls builds réalisés sont des pages « hello » jetables, servant à mesurer le JavaScript livré par chaque framework (dossier scratch).

---

## 0. Synthèse

### Stack recommandée

| Couche | Choix | Version (au 2026-10-02) |
|---|---|---|
| Framework | **Astro**, sortie 100 % statique, **MPA** (une vraie page HTML par URL) | `astro@7.3.5` |
| Langage | **TypeScript**, preset `astro/tsconfigs/strictest` | `typescript@~6.0.3` (**pas 7.x**, voir §3.9) |
| Moteur d'animation | **GSAP** : core, ScrollTrigger, SplitText, CustomEase, plus Flip si besoin | `gsap@3.15.0` |
| Smooth scroll | **Lenis**, configuration prudente, piloté par le ticker GSAP | `lenis@~1.3.26` |
| Transitions de page | **View Transitions natives cross-document** (`@view-transition`), en amélioration progressive | CSS natif |
| Micro-interactions | **CSS natif** : transitions, `@starting-style`, `@property`, grid-rows | — |
| Styles | **CSS moderne** (layers, nesting, `@property`, container queries) + styles scopés Astro + tokens CSS à 3 niveaux | — |
| Composants interactifs | **Custom elements** (`<vy-menu>`, `<vy-accordion>`, `<vy-carousel>`), sans island de framework | — |
| Qualité | `astro check`, ESLint 10 + typescript-eslint + eslint-plugin-astro + jsx-a11y-x, Prettier + plugin Astro, Stylelint 17, Vitest 5, Playwright 1.63 + axe 4.13, Lighthouse CI, knip, lefthook + commitlint | §7.7 |
| Hébergement | **Cloudflare Workers Static Assets**, avec Netlify en alternative | `wrangler@4.147.0` |
| Runtime | Node **24 LTS** (« Krypton ») | `24.21.0` |

### Pourquoi, en 5 chiffres (tous MEASURED)

| Mesure | Astro 7.3.5 | Nuxt 4.5.2 | Next.js 16.3.8 |
|---|---|---|---|
| JS critique d'une page « hello » (gzip) | **0 Ko** | 49,3 Ko | 168,4 Ko |
| Même page avec routeur client | 5,4 Ko (`<ClientRouter />`) | (inclus) | (inclus) |
| Page + GSAP core/ScrollTrigger/SplitText + Lenis + routeur | **55,9 Ko** | ≈ 100 Ko (ESTIMATED) | ≈ 218 Ko (ESTIMATED) |

Score pondéré de la matrice (§5, jugement INFERRED appuyé sur les mesures) : **Astro 4,40/5**, Nuxt 3,90/5, Next.js 3,65/5.

### Décisions qui reviennent à l'utilisateur (détail au §9)

1. MPA + View Transitions cross-document (recommandé), ou `<ClientRouter />` d'Astro.
2. Smooth scroll Lenis : oui en mode prudent (recommandé), ou scroll natif.
3. CSS natif (recommandé), ou Tailwind v4.3.
4. Effet WebGL dans le hero : non par défaut. Si oui, OGL chargé après le LCP.
5. Le signal « React » compte-t-il plus que tout pour vos candidatures ? Si oui, voir la variante du §5.3.

---

## 1. Méthode et légende

**Légende des valeurs**

- **MEASURED** : lu ou mesuré par moi dans une source primaire. Cela couvre le registre npm interrogé le 2026-10-02, le code source des paquets téléchargés (`npm pack`), les données MDN `@mdn/browser-compat-data@8.1.4` (horodatées 2026-10-01T10:12Z), `web-features@3.40.1`, les CHANGELOG bruts sur GitHub, et des builds locaux.
- **ESTIMATED** : calcul ou projection à partir de valeurs mesurées (par exemple une somme de bundles).
- **INFERRED** : jugement d'expert ou fait cité depuis une source secondaire non vérifiable directement.

**Protocole de mesure des poids**

- Bundles des bibliothèques : `esbuild@0.28.2`, `--bundle --minify --format=esm --target=es2022`. Tailles gzip -9 et brotli q11 calculées sur le fichier produit. Chaque entrée importe uniquement l'API citée (tree-shaking réel).
- Frameworks : build de production d'une page qui n'affiche qu'un `<h1>`, sur Node 22.22.0.
  - Astro : `astro build`.
  - Next.js : App Router, `output: 'export'`, Turbopack.
  - Nuxt : `nuxt generate`.
  - Je n'ai compté que le JS chargé au premier rendu : scripts plus `modulepreload`, sans les `prefetch`.

**Limites d'accès**

- Le proxy de sortie bloque `astro.build`, `motion.dev`, `gsap.com`, `webflow.com` et `stateofjs.com`. Les faits issus de ces domaines viennent :
  - de miroirs de leur documentation (Context7, qui indexe `withastro/docs`, `gsap.com/docs`, `motion.dev/docs`) ;
  - ou de résumés de recherche web, signalés comme INFERRED.
- Les versions, dates, licences, `peerDependencies` et la compatibilité navigateurs viennent toutes de sources primaires (MEASURED).

**Mesures visuelles** : ma lentille n'en contient aucune. La consigne « px mesurés / normalisés 1440 » ne s'applique donc pas ici. J'utilise seulement **1440 px** (desktop) et **375 px** (mobile) comme bornes des échelles fluides `clamp()` des tokens (§7.4). C'est un choix INFERRED, à recaler sur les mesures des autres analystes.

---

## 2. Ce que le design impose à la stack

Inventaire relevé sur `ref/1.png` (pleine page, basse résolution, donc observation qualitative) :

| Zone (haut → bas) | Élément observé | Exigence technique |
|---|---|---|
| Header | Logo « VYRON™ », bouton « MENU » avec icône | Menu plein écran : focus contenu, `Esc`, fond inerte, chorégraphie d'entrée et de sortie, arrêt du smooth scroll |
| Hero | Photo plein cadre, display géant « BUILD STRENGTH », liste « PUMP. REPEAT / LIFT. CRUSH IT / … », « Redefine Your Physical Potential » | Moment focal (split par lignes masquées, révélation d'image) **sans dégrader le LCP**. Police display auto-hébergée |
| About | Chiffres « 4.9 », « 20 years », vignettes, CTA | Compteurs éventuels (attention au texte réel pour l'accessibilité), images responsives |
| Services | Titre géant « SERVICES. », cartes « 01 / 02 » avec astérisque rouge | Typographie fluide, états hover, chorégraphie scroll éventuelle (pin ou empilement) |
| Programmes | Liste dépliable (+ / −) et portrait | Accordéon accessible avec animation de hauteur, échange d'image |
| Why VYRON (fond sombre) | Grille de colonnes, portraits d'équipe, CTA « Meet the Team » | Section qui peut être épinglée, hovers, changement de thème local |
| Transformation | Média vidéo/photo, témoignage, compteur « 01 », boutons précédent/suivant | Carrousel accessible (`aria-live`), vidéo en lazy, pause hors écran |
| Bandeau rouge | « Fitness Hub ✱ » répété | Marquee en boucle infinie, pause hover/focus et reduced motion |
| Footer | Wordmark géant « VYRON™ », navigation, réseaux | Révélation au scroll éventuelle, liens |

**Conclusion (INFERRED)** : le site est presque entièrement **statique et éditorial**. Il compte 4 widgets interactifs (menu, accordéon, carrousel avec vidéo, marquee) et une chorégraphie de scroll. Il n'a besoin d'**aucun état applicatif partagé**. Ce profil est exactement celui pour lequel un framework « zéro JS par défaut » est le mieux taillé.

---

## 3. État de l'art au 2 octobre 2026

### 3.1 Astro

| Sujet | Fait | Statut |
|---|---|---|
| Version | `7.3.5`, `latest`, publiée le 2026-09-24 ; `beta` = `7.4.0-beta.1`. 7.0.0 le 2026-06-22, 6.0.0 le 2026-03-10, 5.0.0 le 2024-12-03 | MEASURED (npm) |
| Propriété | Cloudflare a racheté l'équipe The Astro Technology Company (annonce du 2026-01-16). Astro reste open source et multi-hébergeur ; l'Astro Ecosystem Fund continue avec Webflow, Netlify, Wix et Sentry | INFERRED (communiqué BusinessWire et presse) |
| Licence | MIT (`package.json`) | MEASURED |
| Moteur de build | Vite 8 (`vite: ^8.0.13`, d'où Rolldown) ; esbuild `^0.28` | MEASURED |
| Compilateur | Le compilateur **Rust** `@astrojs/compiler-rs` devient celui par défaut en 7.0 ; le compilateur Go est supprimé. Il est **plus strict** : une balise non fermée provoque une erreur de build au lieu d'être corrigée en silence | MEASURED (CHANGELOG 7.0.0) |
| Piège 7.0 | `compressHTML` vaut `'jsx'` par défaut : les espaces entre éléments inline sur des lignes séparées sont **supprimés**. Il faut écrire `{" "}` explicitement | MEASURED (CHANGELOG 7.0.0) |
| Node | `>=22.12.0` | MEASURED (`engines`) |
| Fonts API | **Stable depuis 6.0**. Option `fonts` au premier niveau, composant `<Font cssVariable preload />` depuis `astro:assets`. Providers `local`, `google`, `fontsource` et `npm` (6.0). Fallbacks métriques optimisés générés automatiquement, ce qui réduit le CLS. 7.0 ajoute `subset` à `fontData` | MEASURED (CHANGELOG 6.0 et 7.0) + docs via Context7 |
| Images | `<Image>` / `<Picture>` (sharp) : AVIF/WebP, `layout` = `constrained` / `full-width` / `fixed` qui génère `srcset`/`sizes`, attribut `priority` pour l'image LCP, `image.responsiveStyles`. 6.1 ajoute des réglages Sharp par codec | Docs via Context7 ; 6.1 = INFERRED (recherche) |
| View transitions | `<ViewTransitions />` est **supprimé en 6.0**, remplacé par **`<ClientRouter />`**, et `handleForms` disparaît. 7.0 retire les exports dépréciés de `astro:transitions`. Événements : `astro:before-preparation`, `after-preparation`, `before-swap`, `after-swap`, `page-load`. Fallback `animate` / `swap` / `none`. `transition:persist`, `data-astro-rerun` | MEASURED (CHANGELOG + `dist/transitions`) |
| ClientRouter et reduced motion | Le CSS embarqué contient `@media (prefers-reduced-motion) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important } }`. **Toute** animation de transition saute, y compris un simple fondu | MEASURED (`components/viewtransitions.css`) |
| ClientRouter et `<html>` | `swapRootAttributes()` **efface tous les attributs de `<html>`**, puis recopie ceux de la nouvelle page. Les classes posées au runtime (par exemple `lenis`, `lenis-stopped`) sont donc perdues à chaque navigation | MEASURED (`dist/transitions/swap-functions.js`) |
| Islands | `client:load`/`idle`/`visible`/`media`/`only` pour les composants de framework. Pour ce site, aucun island n'est nécessaire : scripts vanilla et custom elements suffisent, comme la doc le recommande | Docs via Context7 + INFERRED |
| CSP | `security.csp` stable depuis 6.0 ; directives par élément en 7.1 | MEASURED |
| Encore expérimental en 7.3.5 | `clientPrerender` (Speculation Rules), `contentIntellisense`, `chromeDevtoolsWorkspace`, `incrementalBuild`, `svgOptimizer`, `collectionStorage` | MEASURED (schéma de config) |

### 3.2 Next.js + React

| Sujet | Fait | Statut |
|---|---|---|
| Next.js | `16.3.8` (`latest`) ; 16.3.0 le 2026-08-03 ; 16.0.0 le 2025-10-22 ; `canary` = 16.4.0-canary.57 | MEASURED |
| Next 16.x | Turbopack par défaut ; Cache Components (`"use cache"`). 16.3 apporte les « Instant Navigations », la réduction de RAM en dev et la prise en charge de TypeScript 7 pour le type-check. 16.2.6 (mai 2026) corrigeait **13 advisories de sécurité** d'un coup | INFERRED (nextjs.org/blog via recherche) |
| React | `19.3.0`, publié le 2026-09-09. **`<ViewTransition />` et `addTransitionType` sont désormais stables**, ainsi que les Fragment refs et `browser()` | MEASURED (CHANGELOG React) |
| Transitions | La doc embarquée dans `next@16.3.8` indique : « View transitions work in the App Router with no configuration » | MEASURED (`dist/docs/01-app/02-guides/view-transitions.md`) |
| GSAP en React | `@gsap/react@2.1.2` (`useGSAP`, nettoyage automatique) | MEASURED |
| Poids de base | **168,4 Ko gzip** (145,5 Ko brotli) de JS pour une page statique vide (6 scripts) | MEASURED (build local) |

### 3.3 Nuxt + Vue

| Sujet | Fait | Statut |
|---|---|---|
| Nuxt | `4.5.2` (`latest`) ; 4.5.0 le 2026-07-18 ; ligne `3x` = 3.21.11. Nuxt 5 est « en cours de stabilisation » | MEASURED (npm) ; Nuxt 5 = INFERRED |
| Vue | `3.5.43` (`latest`) ; **3.6 (Vapor mode) seulement en `rc` = 3.6.0-rc.10**, donc pas stable | MEASURED (dist-tags) |
| Node | `^22.19.0 \|\| ^24.11.0 \|\| >=26.0.0` | MEASURED |
| Transitions | `app.viewTransition` / `experimental.viewTransition` : `enabled: boolean \| 'always'`, `types`. Les hooks JS de `<Transition>` (onEnter / onLeave) restent le schéma classique GSAP + Nuxt | MEASURED (types `@nuxt/schema@4.5.2`) |
| Motion pour Vue | `motion-v@2.5.2` dépend encore de `framer-motion@13.5.1`, donc il est **en retard sur Motion 14** | MEASURED (dépendance imbriquée) |
| Lenis | `lenis/vue` et `lenis/nuxt` sont fournis | MEASURED (exports) |
| Poids de base | **49,3 Ko gzip** de JS critique (2 modules), plus environ 6 Ko en `prefetch` | MEASURED (build local) |

### 3.4 GSAP (licence depuis le rachat par Webflow)

| Sujet | Fait | Statut |
|---|---|---|
| Version | `3.15.0` (2026-04-13) ; 3.14.0 (2025-12-08) ; 3.13.0 (2025-04-30), première version entièrement gratuite | MEASURED |
| Licence | `package.json` : `"Standard 'no charge' license: https://gsap.com/standard-license"`. README : « GSAP is now 100% FREE including ALL of the bonus plugins like SplitText, MorphSVG […] even for commercial use » | MEASURED |
| Plugins dans le paquet public | ScrollTrigger, **ScrollSmoother**, **SplitText**, **Flip**, **MorphSVGPlugin**, DrawSVGPlugin, ScrambleTextPlugin, Draggable, InertiaPlugin, MotionPathPlugin, Observer, CustomEase / CustomBounce / CustomWiggle, Physics2D, PhysicsProps, GSDevTools, ScrollToPlugin, TextPlugin, Pixi et Easel. Aucun token ni registre privé n'est nécessaire, et `gsap-trial` est déprécié | MEASURED (contenu du tarball) |
| Ce que la licence interdit | (1) Les « Prohibited Uses » : intégrer GSAP dans un **outil de création d'animations visuelles sans code qui concurrence Webflow** ; (2) faire de la rétro-ingénierie pour produire un produit concurrent ; (3) retirer ou modifier les mentions de propriété. Ce n'est **pas** une licence open source au sens OSI : le code est propriétaire et gratuit | INFERRED (texte de licence cité via recherche) |
| Impact sur ce projet | Aucun. Un site portfolio n'est pas un outil d'animation visuelle. Il faut garder les bannières `@license` (le minifieur les conserve) | INFERRED |
| API utiles ici | `gsap.context()` + `revert()` (nettoyage groupé, y compris des ScrollTriggers) ; `gsap.matchMedia()` avec une condition `prefers-reduced-motion` ; **SplitText 3.13+** (`autoSplit`, `mask: "lines"`, `onSplit`, aria géré automatiquement) | Docs via Context7 |

### 3.5 Motion (motion.dev)

| Sujet | Fait | Statut |
|---|---|---|
| Version | **`14.0.0` publiée aujourd'hui (2026-10-02)** : elle retire les internals de compatibilité restaurés en 13.5.1. 13.0.0 (2026-08-05) supprimait `@emotion/is-prop-valid`. 13.2 ajoute un système d'« effects » (`threeEffect`, `vgpuEffect`). **13.4 : `AnimateView`**, des view transitions bâties sur `<ViewTransition>` de React 19.3. 13.5 : bounce négatif | MEASURED (CHANGELOG brut GitHub, npm) |
| Paquets | `motion` (vanilla : `animate`, `scroll`, `inView`, `stagger`) ; `motion/mini` ; `motion/react`, `motion/react-m`, `motion/react-animate-view` ; `motion/three`, `motion/vgpu`. `framer-motion@14.0.0` est le même code. Pour Vue : `motion-v` | MEASURED (exports) |
| Licence | MIT. **Motion+** est payant (abonnement à vie) : `splitText`, `AnimateNumber`, `Cursor`, Ticker et d'autres | MEASURED (licence) ; Motion+ via la doc Context7 |
| Scroll | `scroll()` passe par le **`ScrollTimeline` natif** quand c'est possible (accéléré matériellement), sinon par une boucle groupée. Il n'existe **pas d'API de pin** : le `position: sticky` CSS reste nécessaire | Doc via Context7 ; pin = INFERRED |
| Poids annoncés | mini ≈ 2,3–2,5 Ko, hybrid ≈ 17–18 Ko | Doc via Context7 |

### 3.6 Lenis

| Sujet | Fait | Statut |
|---|---|---|
| Paquet | **`lenis`** (l'ancien `@studio-freight/lenis`) `1.3.26` (2026-08-05). **2.0.0-dev.5** est en développement (2026-09-18) | MEASURED |
| Exports | `lenis`, `lenis/react`, `lenis/vue`, `lenis/nuxt`, `lenis/snap` | MEASURED |
| Intégration GSAP (README) | `lenis.on('scroll', ScrollTrigger.update)` ; `gsap.ticker.add((t) => lenis.raf(t * 1000))` ; `gsap.ticker.lagSmoothing(0)` | MEASURED (README) |
| Options pertinentes | `autoRaf`, `lerp`, `syncTouch`, `anchors`, `allowNestedScroll`, `prevent`, `autoToggle`, `stopInertiaOnNavigate`, **`respectReducedMotion`, à `true` par défaut** | MEASURED (`lenis.d.ts`, source) |
| CSS requis | `lenis/dist/lenis.css` : `html.lenis { height:auto }`, `.lenis-stopped { overflow: clip }`, `[data-lenis-prevent] { overscroll-behavior: contain }`, iframes en `pointer-events:none` | MEASURED |
| Limites (README) | Safari plafonné à 60 fps (30 fps en économie d'énergie) ; pas de lissage au-dessus des iframes ; CSS scroll-snap non pris en charge (utiliser `lenis/snap`) ; `position: fixed` peut traîner sur les anciens Safari macOS | MEASURED (README) |

### 3.7 Styles : Tailwind v4, CSS moderne, CSS Modules

| Option | Faits | Statut |
|---|---|---|
| Tailwind | `4.3.3`. 4.3.0 (2026-05-08) : utilitaires `scrollbar-*`, `@container-size`, `zoom-*`, `@variant` empilés. 4.2.0 (2026-02-18) : utilitaires logiques, palettes mauve/olive/mist/taupe, plugin webpack. Configuration CSS-first via `@theme` ; `@tailwindcss/vite@4.3.3` | MEASURED (CHANGELOG, npm) |
| CSS natif (Baseline) | Cascade layers : *widely* depuis 2024-09. **Nesting : *widely* depuis 2026-06-11**. Container queries : *widely* depuis 2025-08. `oklch` : *widely* depuis 2025-11. `@property` : *newly* (2024-07). `@starting-style` : *newly* (2024-08). `@scope` : *newly* (2026-03-24) | MEASURED (`web-features@3.40.1`) |
| CSS Modules | Redondant dans Astro, qui scope déjà les styles nativement. C'est le choix naturel dans Next.js | INFERRED |

### 3.8 Plateforme web : support réel (MDN BCD 8.1.4)

Navigateurs courants dans les données : **Chrome 154** (2026-09-22), **Safari 27** (2026-09-14), **Firefox 157** (2026-09-29). Tout le tableau est MEASURED.

| Fonctionnalité | Chrome | Safari | Firefox | Baseline |
|---|---|---|---|---|
| View Transitions same-document (`startViewTransition`) | 111 | 18 | **144** | *newly* (2025-10-14) |
| `view-transition-class` | 125 | 18.2 | 144 | *newly* |
| Types de transition (`:active-view-transition-type`) | 125 | 18.2 | 147 | *newly* (2026-01-13) |
| **View Transitions cross-document** (`@view-transition`) | 126 | 18.2 | **non** (bug 1860854) | **non** |
| `pagereveal` / `pageswap` | 123 / 124 | 18.2 | non | — |
| **CSS scroll-driven animations** (`animation-timeline`, `ScrollTimeline`, `ViewTimeline`) | 115 | **26** | **non, Nightly uniquement** (`preview`) | **non** |
| `<details name>` (accordéon exclusif) | 120 | 17.2 | 130 | *newly* |
| `::details-content` | 131 | 18.4 | 143 | *newly* (2025-09) |
| `interpolate-size` / `calc-size()` | 129 | non | non | non |
| Animation de `grid-template-rows` | 107 | 16 | 66 | oui |
| `transition-behavior: allow-discrete` | 117 | 17.4 | 129 | oui |
| `<dialog>.showModal()` / `inert` | 37 / 102 | 15.4 / 15.5 | 98 / 112 | *widely* |
| `dialog[closedby]` | 134 | `preview` | 141 | non |
| Speculation Rules | 109 | 26.2 | non | non |

**Lecture (INFERRED)**

- Les transitions *same-document* (donc tout routeur client : ClientRouter, Next, Nuxt) fonctionnent dans les 3 moteurs.
- Les transitions *cross-document* (MPA pur, zéro JS) fonctionnent dans Chrome, Edge et Safari, mais **pas dans Firefox**. Dans Firefox, la navigation reste instantanée, ce qui est acceptable en amélioration progressive.
- Les **animations pilotées par le scroll en CSS ne sont pas fiables pour la chorégraphie principale** tant que Firefox stable ne les livre pas. ScrollTrigger reste nécessaire.

### 3.9 Outillage : versions et pièges de compatibilité

| Outil | Version | Point d'attention | Statut |
|---|---|---|---|
| TypeScript | `latest` = **7.0.2** (port natif, 2026-07-08) ; 6.0.3 (2026-04-16) | **`typescript-eslint@8.71` exige `typescript >=4.8.4 <6.1.0`** et **`@astrojs/check@0.9.10` exige `^5 \|\| ^6`**. Il faut donc **épingler `~6.0.3`** | MEASURED |
| ESLint | 10.12.0 (10.0 le 2026-02-06) ; maintenance 9.39.5 | `eslint-plugin-jsx-a11y@6.10.2` (dernière publication en 2024) n'accepte que ESLint ≤ 9. Il faut le **fork `eslint-plugin-jsx-a11y-x@0.2.0` (ESLint ^9 \|\| ^10)**, explicitement pris en charge par `eslint-plugin-astro@3.2.1` | MEASURED |
| Biome | 2.5.15 | La prise en charge des templates Astro est **encore derrière `html.experimentalFullSupportEnabled`**. C'est trop jeune pour être l'unique outil sur des `.astro` | MEASURED (CHANGELOG) |
| Prettier | 3.9.9 + `prettier-plugin-astro@1.1.0` | — | MEASURED |
| Stylelint | 17.16.0 + `stylelint-config-standard@40` + `stylelint-config-html@2` (pour les `<style>` dans `.astro`) + `stylelint-config-recess-order@7.8` | — | MEASURED |
| Vite / Vitest | 8.3.2 / 5.0.3 | — | MEASURED |
| Playwright / axe | `@playwright/test@1.63.0` / `@axe-core/playwright@4.13.0` | — | MEASURED |
| Lighthouse CI | `@lhci/cli@0.15.1`, **dernière publication le 2025-06-25** | Rythme de maintenance lent ; `unlighthouse@0.19` en complément | MEASURED |
| Divers | `knip@6.39.0`, `lefthook@2.1.16`, `@commitlint/cli@21.2.3`, `pnpm@12.8.1`, `wrangler@4.147.0` | — | MEASURED |
| Node | 24.21.0 LTS « Krypton » ; 26.x pas encore LTS ; 22.x LTS « Jod » | — | MEASURED (nodejs.org/dist) |

---

## 4. Mesures de poids (tableau de référence)

### 4.1 Frameworks : JS initial d'une page vide

| Framework | Fichiers JS | gzip | brotli | Statut |
|---|---|---|---|---|
| Astro 7.3.5, statique | 0 | **0 Ko** | 0 Ko | MEASURED |
| Astro 7.3.5 + `<ClientRouter />` | 1 | **5,4 Ko** | 4,9 Ko | MEASURED |
| Nuxt 4.5.2 (`generate`) | 2 critiques (+3 en prefetch) | **49,3 Ko** | 44,8 Ko | MEASURED |
| Next.js 16.3.8 (App Router, export) | 6 | **168,4 Ko** | 145,5 Ko | MEASURED |
| Repère : React 19.3 seul (`react-dom/client`) | — | 67,4 Ko | 58,1 Ko | MEASURED |
| Repère : Vue 3.5 seul (`createApp`) | — | 24,8 Ko | 22,6 Ko | MEASURED |

### 4.2 Bibliothèques d'animation et de scroll

| Entrée bundlée | min | gzip | Statut |
|---|---|---|---|
| `motion/mini` → `animate` | 8,2 Ko | 3,3 Ko | MEASURED |
| `motion` → `animate` (hybrid) | 53,9 Ko | 19,8 Ko | MEASURED |
| `motion` → `animate + scroll + inView + stagger` | 60,7 Ko | **22,6 Ko** | MEASURED |
| `motion/react` → `motion.div` (React inclus) | 340,8 Ko | 107,7 Ko, soit **+40,3 Ko** sur React | MEASURED |
| `motion/react` → `LazyMotion` + `m` | 293,5 Ko | 93,9 Ko, soit +26,5 Ko | MEASURED |
| `motion-v` → `motion.div` (Vue inclus) | 187,5 Ko | 65,0 Ko, soit +40,2 Ko sur Vue | MEASURED |
| `gsap` core | 69,0 Ko | 27,0 Ko | MEASURED |
| + ScrollTrigger | 112,5 Ko | 44,0 Ko | MEASURED |
| + ScrollTrigger + SplitText | 119,8 Ko | **47,0 Ko** (SplitText ≈ +3,0 Ko) | MEASURED |
| + ScrollTrigger + SplitText + Flip | 144,4 Ko | 55,8 Ko (Flip ≈ +8,8 Ko) | MEASURED |
| + ScrollTrigger + ScrollSmoother | 125,4 Ko | 48,6 Ko (ScrollSmoother ≈ +4,6 Ko) | MEASURED |
| `lenis` | 18,2 Ko | **5,3 Ko** | MEASURED |
| `embla-carousel@8.6.0` | 17,9 Ko | 7,4 Ko | MEASURED |
| **Page Astro réelle : ClientRouter + GSAP core/ST/SplitText + Lenis + CSS Lenis** | — | **55,9 Ko** | MEASURED |

### 4.3 WebGL (option effet de hero)

| Entrée : plan plein écran avec shader | min | gzip | Statut |
|---|---|---|---|
| `three@0.186.1` (WebGLRenderer, Scene, Mesh, ShaderMaterial) | 516,8 Ko | **128,9 Ko** | MEASURED |
| `ogl@1.0.11` (Renderer, Program, Mesh, Triangle) | 43,5 Ko | **12,5 Ko** | MEASURED |

**Lecture (INFERRED)** : avec Astro, la page d'accueil complète, moteur d'animation compris, reste sous **≈ 65–70 Ko gzip** de JS (ESTIMATED : 55,9 Ko mesurés plus environ 10 Ko de code applicatif). Next.js consomme **168 Ko avant la première ligne d'animation**.

---

## 5. Matrice comparative de trois stacks complètes

### 5.1 Les candidates

- **A — Astro** : Astro 7.3 (statique, MPA) + TS + custom elements + GSAP 3.15 + Lenis 1.3 + CSS natif et scopé + View Transitions cross-document ; déploiement Cloudflare.
- **B — React** : Next.js 16.3 (App Router, `output: 'export'`) + React 19.3 + GSAP via `useGSAP` (ou Motion for React) + `lenis/react` + CSS Modules ou Tailwind 4.3 + `<ViewTransition>` ; déploiement Vercel.
- **C — Vue** : Nuxt 4.5 + Vue 3.5 + GSAP (ou `motion-v`) + `lenis/vue` + styles scopés SFC + `<Transition>` / `viewTransition` ; `nuxt generate` ; déploiement Netlify ou Cloudflare.

### 5.2 Scores sur 5 (pondération en %, notes INFERRED appuyées sur les mesures citées)

| Critère | Poids | A — Astro | B — Next.js | C — Nuxt |
|---|---|---|---|---|
| Performance / JS livré | 20 % | **5** (0 Ko de base, 55,9 Ko tout compris) | 2 (168,4 Ko de base) | 3,5 (49,3 Ko de base) |
| Cycle de vie de la chorégraphie scroll | 15 % | **4,5** en MPA, 3,5 avec ClientRouter | 3,5 | 4 |
| Clarté et structure du code | 15 % | **4,5** | 3,5 | 4 |
| DX / outillage | 10 % | 4 | **4,5** | 4 |
| Transitions de page | 10 % | **4,5** | **4,5** | **4,5** |
| Écosystème de sites primés | 10 % | 3,5 | **5** | 4 |
| Signal portfolio auprès des recruteurs | 10 % | 4 | **5** | 3,5 |
| Courbe d'apprentissage | 10 % | **4,5** | 3 | 4 |
| **Total pondéré** | 100 % | **4,40** | 3,65 | 3,90 |

**Justification des notes**

1. **Performance**
   - Mesures du §4.
   - Next.js livre le runtime React et le routeur même en export statique.
   - Nuxt est trois fois plus léger que Next mais pas nul.
   - Astro n'envoie que ce que la page importe.
2. **Cycle de vie de la chorégraphie scroll**
   - Le vrai risque d'un site très animé, ce sont les fuites : ScrollTriggers orphelins, `SplitText` non revertés, listeners dupliqués, Lenis désynchronisé après une navigation.
   - En **MPA**, chaque navigation repart d'une page neuve : il n'y a aucun nettoyage inter-routes à écrire.
   - Avec **ClientRouter**, il faut un adaptateur (`astro:before-swap` pour revert, `astro:page-load` pour monter). Il faut aussi réparer les classes de `<html>` effacées (§3.1).
   - **Next** : `useGSAP` nettoie bien le composant. En revanche, les layouts persistants, le double appel des effets en StrictMode en dev, la frontière `'use client'` et le `ScrollTrigger.refresh()` à chaque changement de route alourdissent le code.
   - **Nuxt** : `onMounted` / `onUnmounted` et les hooks de `<Transition>` sont propres et bien connus.
3. **Clarté**
   - Astro garde le HTML au premier plan : un composant `.astro` se lit comme une page.
   - Le comportement tient dans des custom elements autonomes.
   - En React, piloter GSAP de façon impérative oblige à des refs, des hooks et des frontières client/serveur.
4. **DX** : Next a l'écosystème le plus fourni. Astro est pénalisé par le verrou TypeScript ≤ 6 et l'outillage Biome encore expérimental sur `.astro`.
5. **Transitions de page**
   - Astro : cross-document natif sans JS, ou ClientRouter.
   - Next : `<ViewTransition>` stable sans configuration.
   - Nuxt : `<Transition>` avec des hooks JS sur mesure, plus `viewTransition`.
   - Les trois sont au niveau.
6. **Écosystème primé** (INFERRED, sans données primaires accessibles)
   - Next.js et Nuxt dominent historiquement les sites d'agences créatives animés en GSAP.
   - Astro progresse : il existe une page Awwwards dédiée « websites/astro », et ASTRODITHER a été signalé *Site of the Day* et *Developer Award* le 2026-05-05 (vu via recherche, non vérifié).
7. **Signal recruteurs** (INFERRED)
   - React/Next reste le plus demandé.
   - Astro signale une culture de la performance et du HTML. D'après le résumé State of JS 2025, il est en tête en satisfaction parmi les méta-frameworks, avec un usage en forte hausse (non vérifié, domaine bloqué).
   - Un **README d'architecture et des ADR** pèsent autant que le choix du framework.
8. **Courbe d'apprentissage** (INFERRED, en supposant un développeur front TS)
   - Astro ajoute très peu de concepts au trio HTML/CSS/TS.
   - Next 16 impose RSC, `'use client'`, Cache Components et hooks.

### 5.3 Variantes et sensibilité

- **Si le signal React est l'objectif n°1** : il n'est pas indispensable de passer à Next.js. On peut ajouter **un seul island React justifié** dans Astro (`@astrojs/react@7.0.0`, `client:visible`), par exemple le carrousel de témoignages. Le coût mesuré est d'environ 67 Ko gzip de React, chargés **uniquement** quand le carrousel devient visible. C'est un compromis honnête, à documenter dans un ADR.
- **Si l'utilisateur veut un SPA** avec des éléments persistants entre les pages (par exemple une vidéo qui continue à jouer ou un canvas WebGL continu) : Astro avec ClientRouter fait mieux. Le score total passe alors de 4,40 à environ 4,25, ce qui reste en tête.

---

## 6. GSAP, Motion, ou les deux ?

### 6.1 Verdict : **GSAP comme moteur unique**, et pas de Motion dans le build

| Critère | GSAP 3.15 | Motion 14 (vanilla, dans Astro) |
|---|---|---|
| Poids (MEASURED) | 47,0 Ko gzip (core + ScrollTrigger + SplitText) | 22,6 Ko gzip (`animate + scroll + inView + stagger`) |
| Licence | « Standard no-charge » : gratuit, propriétaire, clause anti-concurrence Webflow | MIT, mais Motion+ payant pour `splitText` |
| Scroll | ScrollTrigger : `scrub`, **`pin`**, `snap`, `containerAnimation` (scroll horizontal), `batch`, `refresh`, `markers` pour le debug | `scroll()` relie la progression, accéléré via ScrollTimeline sur Chrome et Safari. **Pas de pin** |
| Texte | **SplitText gratuit** : lignes, mots, caractères, `mask`, `autoSplit` au resize et au chargement des polices, aria géré | `splitText`, réservé à Motion+ |
| Séquençage | `timeline()` avec labels, imbrication, `reverse()`, contrôle complet | Séquences par tableau via `animate` |
| Layout / FLIP | Plugin **Flip** (gratuit) | Les animations de layout sont des API de composant React ou Vue |
| Nettoyage | **`gsap.context().revert()`** et **`gsap.matchMedia()`**, nettoyage groupé avec les ScrollTriggers | Arrêt animation par animation (INFERRED) |
| Easings des tokens | **CustomEase** reproduit exactement `cubic-bezier(0.16,1,0.3,1)` | Bézier natif |
| Lenis | Snippet officiel (ticker partagé) | Possible, mais non documenté côté Lenis |
| Accélération | Animation sur le thread principal (rAF) | Hybride WAAPI / ScrollTimeline (compositeur) |

**Raisons précises du choix**

1. Les besoins du design (hero en lignes masquées, sections épinglées, chorégraphie au scroll, menu en timeline) correspondent **exactement** aux plugins gratuits de GSAP.
2. Le framework n'impose rien : le moteur tourne dans des scripts Astro vanilla, sans island React ni Vue.
3. `context` et `matchMedia` apportent un **nettoyage déterministe** et une branche reduced motion explicite, ce qui est indispensable si le ClientRouter est adopté un jour.
4. **Un seul moteur** veut dire un seul modèle mental, un seul système d'easing et un seul point de synchronisation avec Lenis.
5. Le surcoût par rapport à Motion (environ 24 Ko gzip, MEASURED) est absorbé par le budget, puisque la base Astro est à 0 Ko.

**Contreparties assumées**

- ScrollTrigger travaille sur le thread principal. Mitigation : ne lier au scroll que `transform`, `opacity` et `clip-path`, et mesurer l'INP.
- Licence non-OSI : sans effet ici.
- Si la **stack B (React)** était retenue, le raisonnement reste valable : GSAP + `useGSAP`. Motion for React ne se justifie que sans pin et sans split de texte.

### 6.2 Quand le CSS seul suffit

Cette partie suit la règle Impeccable « Implement to the runtime » : ne pas ajouter de dépendance pour un effet que la stack exprime proprement.

| Besoin | Technique native | Support |
|---|---|---|
| Hover, focus, pression (boutons, liens, cartes) | `transition` de 100 à 150 ms sur `transform`, `color`, `clip-path`, soulignement via `text-underline-offset` | Universel |
| Icône du bouton menu (≡ → ×) | Transition pilotée par `[aria-expanded="true"]` | Universel |
| Entrée et sortie d'overlay ou de dialog simple | `@starting-style` + `transition-behavior: allow-discrete` | Baseline |
| Accordéon (hauteur) | `grid-template-rows: 0fr → 1fr`. Variante : `<details name>` + `::details-content`, avec `interpolate-size` (animé seulement sous Chrome) | Grid : universel |
| Marquee « Fitness Hub ✱ » | `@keyframes` sur `translateX(-50%)` d'une piste dupliquée (copie en `aria-hidden`), `animation-play-state: paused` au hover, au `:focus-within` et en reduced motion | Universel |
| Transitions de page | `@view-transition { navigation: auto }` + `view-transition-name` (header, wordmark) + `view-transition-class` | Chrome et Safari ; Firefox sans transition |
| Compteurs décoratifs | `@property --n { syntax: '<integer>' }` + `counter()`, avec le vrai chiffre en texte accessible | Baseline 2024 |
| Liaison décorative au scroll (barre de progression) | `animation-timeline: scroll()` en amélioration progressive **seulement**. Je ne le recommande pas, pour ne pas avoir deux systèmes de scroll | Firefox : non |

**GSAP est réservé** à ce qui demande séquençage, interruption ou valeurs dynamiques : intro du hero, timeline du menu, ScrollTriggers (pin, scrub), split de texte, Flip de l'image des programmes, vitesse du marquee liée au scroll si cet effet est retenu.

### 6.3 Où s'insère Lenis

- **Recommandé, en mode prudent** :
  - `autoRaf: false`, car piloté par `gsap.ticker` (snippet officiel) ;
  - `lerp` autour de 0,1 ;
  - `syncTouch: false` pour garder le scroll tactile natif ;
  - `anchors: true` ;
  - `allowNestedScroll: true` ;
  - `respectReducedMotion` laissé à `true`, sa valeur par défaut (MEASURED).
- **Ouverture du menu** : appeler `lenis.stop()`, ce qui pose la classe `.lenis-stopped { overflow: clip }`. Mettre `data-lenis-prevent` sur l'overlay. Appeler `lenis.start()` à la fermeture.
- **Pas de ScrollSmoother**. Il est gratuit (+4,6 Ko gzip), mais il impose un wrapper et un contenu transformés, ce qui casse `position: fixed`, `sticky` et les ancres natives (INFERRED, architecture connue). Lenis, lui, garde le **scroll natif du document** (README).
- **Avec ClientRouter** (si cette option était choisie) : recopier les classes `lenis*` sur `event.newDocument.documentElement` dans `astro:before-swap`, car `swapRootAttributes` les efface (MEASURED). Puis appeler `lenis.resize()` et `ScrollTrigger.refresh()` sur `astro:page-load`.
- **Épinglage de version** : `~1.3.26`. Lenis 2.0 est en `dev` et risque de casser l'API.

### 6.4 Correspondance composant → technique

| Composant | Technique retenue | Moteur |
|---|---|---|
| Menu plein écran | `<dialog>` + `showModal()` (focus contenu, `Esc`, fond inerte). `closedby` n'existe pas sous Safari, donc la fermeture au clic sur le fond est gérée en JS. Timeline GSAP : `clip-path` du panneau, liens en stagger, sortie plus rapide que l'entrée | GSAP + natif |
| Hero (moment focal) | SplitText `mask: "lines"` sur « BUILD STRENGTH », révélation de la photo **à partir d'un état visible** (scale ou `clip-path`), 500 à 800 ms, ease-out exponentielle | GSAP |
| Grands titres « SERVICES. », « VYRON™ » | Au plus **une** variation liée au scroll (scrub), **pas** la même entrée sur chaque section (craft-floor) | GSAP (ScrollTrigger) |
| Accordéon des programmes | Pattern bouton `aria-expanded` + région, hauteur par grid-rows. Échange d'image par fondu ou Flip | CSS (+ GSAP Flip en option) |
| Why VYRON | Pin et scrub éventuels, hovers de portraits en CSS | GSAP + CSS |
| Carrousel des témoignages | Custom element sur `scroll-snap` natif, boutons étiquetés, compteur `aria-live="polite"`. Vidéo `preload="none"` + `poster` + sous-titres VTT, en pause hors écran (IntersectionObserver). Embla (7,4 Ko gzip) seulement si le snap natif ne suffit pas | Natif |
| Marquee | Keyframes CSS. Vélocité liée au scroll en option : GSAP `getVelocity()` | CSS |
| Transitions entre pages | View Transitions cross-document. L'entrée GSAP est déclenchée sur `pagereveal` (avec repli sur `DOMContentLoaded` pour Firefox), ce qui reste sûr sous prerender | CSS + GSAP |
| WebGL du hero (optionnel) | **OGL** (12,5 Ko contre 128,9 Ko pour three), en `import()` dynamique **après le LCP**, désactivé en reduced motion ou `saveData`, coupé hors écran | OGL |

---

## 7. Stack recommandée en détail

### 7.1 Versions à épingler (`save-exact`, Renovate en groupes)

| Paquet | Version | Note |
|---|---|---|
| `astro` | 7.3.5 | Stable du moment ; 7.4 en beta |
| `typescript` | ~6.0.3 | Verrou imposé par typescript-eslint et `astro check` (§3.9) |
| `@astrojs/check` | 0.9.10 | Type-check des fichiers `.astro` |
| `@astrojs/sitemap` | 3.7.4 | SEO |
| `gsap` | 3.15.0 | Plugins inclus |
| `lenis` | ~1.3.26 | Éviter 2.0-dev |
| `ogl` | 1.0.11 | Seulement si l'option WebGL est retenue |
| `eslint` + `typescript-eslint` + `eslint-plugin-astro` + `eslint-plugin-jsx-a11y-x` | 10.12.0 / 8.71.0 / 3.2.1 / 0.2.0 | Config flat `eslint.config.ts` |
| `prettier` + `prettier-plugin-astro` | 3.9.9 / 1.1.0 | — |
| `stylelint` + `stylelint-config-standard` + `stylelint-config-html` + `postcss-html` + `stylelint-config-recess-order` | 17.16.0 / 40.0.0 / 2.0.0 / 2.0.0 / 7.8.0 | — |
| `vitest` | 5.0.3 | Tests unitaires TS purs |
| `@playwright/test` + `@axe-core/playwright` | 1.63.0 / 4.13.0 | E2E, visuel, accessibilité |
| `@lhci/cli` | 0.15.1 | Budgets Lighthouse |
| `knip` | 6.39.0 | Code et dépendances morts |
| `lefthook` + `@commitlint/cli` + `@commitlint/config-conventional` | 2.1.16 / 21.2.3 / 21.2.3 | Hooks Git |
| `wrangler` | 4.147.0 | Déploiement |
| Node / pnpm | 24.21.0 LTS / 12.8.1 | `.nvmrc` et champ `packageManager` |

Je n'ai **pas** retenu Motion 14.0.0 : il est publié aujourd'hui et n'est pas nécessaire.

### 7.2 Architecture de rendu et de navigation

**Recommandation : MPA + View Transitions cross-document**, avec un **contrat de cycle de vie** qui rend le passage au ClientRouter trivial si l'utilisateur le décide plus tard.

| | MPA + `@view-transition` (recommandé) | `<ClientRouter />` |
|---|---|---|
| JS du routeur | 0 Ko | 5,4 Ko gzip (MEASURED) |
| Transitions sous Firefox | Non : navigation instantanée | Oui (same-document, Firefox 144+) |
| Nettoyage entre pages | Aucun, chaque page est neuve | Manuel (`before-swap` / `page-load`) |
| Classes sur `<html>` (Lenis, état du menu) | Intactes | **Effacées à chaque navigation** (MEASURED) |
| Reduced motion | Contrôlé par notre CSS : on garde un fondu, comme le veut Impeccable | **Toutes les animations sont coupées en `!important`** (MEASURED) |
| Éléments persistants (vidéo, canvas) | Impossible | `transition:persist` |
| Navigation instantanée | `prefetch` d'Astro (stable) ; Speculation Rules via `experimental.clientPrerender` (expérimental) | Prefetch intégré |

**Contrat d'animation** (spécification de design, pas du code du site)

- Chaque effet est un module de la forme `(scope: HTMLElement, env: { reduced: boolean; desktop: boolean }) => void | Cleanup`.
- Les effets sont enregistrés dans un registre et activés **explicitement** par `data-motion="hero-intro"`. Il n'y a pas de sélecteur global du type « tout révéler ».
- `mountMotion(root)` exécute les effets dans `gsap.context(root)` et `gsap.matchMedia()`. Il renvoie une fonction `dispose()`.
- Un adaptateur unique, `lifecycle.ts`, décide **quand** monter :
  - en MPA : `pagereveal`, avec repli sur `DOMContentLoaded` ;
  - avec ClientRouter : `astro:page-load` pour monter, `astro:before-swap` pour démonter.
- **Contenu visible par défaut**, conformément à Impeccable :
  - Les états initiaux cachés ne s'appliquent que sous `html.has-motion`.
  - Cette classe est posée par un script inline dans `<head>`, uniquement si `prefers-reduced-motion: no-preference`.
  - Un délai de garde retire la classe si le moteur n'a pas démarré en 3 s.
  - L'élément LCP (photo du hero) n'est **jamais** à `opacity: 0` au premier rendu.

### 7.3 Approche des styles

**CSS natif moderne avec styles scopés Astro**, sans framework utilitaire. C'est la recommandation (INFERRED), et c'est une décision ouverte (§9).

- **Ordre des couches globales** : `@layer reset, tokens, base, layout, utilities;`. Les styles scopés des composants Astro sont *hors couche*, donc ils l'emportent naturellement sur le global. La règle est voulue et documentée dans un ADR.
- **Nesting natif** : *widely available* depuis 2026-06 (MEASURED), aucune transpilation nécessaire.
- **Container queries** pour les cartes de services et de programmes, qui changent de mise en page selon leur conteneur et pas selon le viewport.
- **États tirés de l'accessibilité** : on style `[aria-expanded="true"]`, `[aria-current="page"]` et `[data-state="open"]` plutôt que des classes `.is-open`. Le CSS ne peut ainsi pas mentir sur l'état réel.
- **Surfaces du navigateur thématisées** (craft-floor « Browser surfaces ») : `::selection`, `caret-color`, `scrollbar-color` et `scrollbar-width`, anneau `:focus-visible`, `text-underline-offset`, `font-variant-numeric: tabular-nums` sur les chiffres (« 4.9 », « 20 »).
- **Pourquoi pas Tailwind 4.3** : il est excellent, mais sur un balisage éditorial dense, qui porte déjà des attributs d'animation et d'état, les listes de classes nuisent à la lisibilité exigée. Il apporte peu ici face aux tokens natifs (INFERRED). Ce serait le bon choix si le signal « Tailwind » compte pour l'utilisateur.

### 7.4 Stratégie de design tokens

Trois niveaux, en custom properties dans `src/styles/tokens.css` :

| Niveau | Exemples (noms) | Règle |
|---|---|---|
| **Primitifs** | `--red-600`, `--ink-950`, `--paper-50` (en `oklch`), `--space-1…12`, `--radius-0` | Valeurs brutes, jamais utilisées directement dans les composants |
| **Sémantiques** | `--color-accent`, `--surface-dark`, `--text-on-dark`, `--text-display-xl`, `--gutter`, `--section-gap` | Seul niveau consommé par les composants |
| **Composants** | `--button-bg`, `--card-border`, `--menu-panel-bg` | Optionnels, déclarés dans le `<style>` scopé du composant |

- **Typographie fluide** : `clamp()` entre 375 px et 1440 px de viewport. Le display respecte le plafond craft-floor de 6rem (≈ 96 px) **sauf** décision contraire de l'utilisateur, puisque le wordmark et « SERVICES. » du shot semblent nettement plus grands. Le tracking ne descend pas sous -0,04em.
- **Tokens de mouvement**, alignés sur le tableau d'Impeccable `animate` :
  - `--dur-instant: 120ms`, `--dur-fast: 200ms`, `--dur-base: 320ms`, `--dur-view: 450ms`, `--dur-focal: 700ms` ;
  - `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, sorties plus rapides que les entrées.
- **Miroir en TypeScript** : `src/scripts/motion/tokens.ts` reprend ces tokens pour GSAP (`CustomEase.create('out', '0.16,1,0.3,1')`). Un **test Vitest de parité** vérifie que `tokens.css` et `tokens.ts` concordent.
- **Lien avec Impeccable** : `DESIGN.md` porte les tokens normatifs en frontmatter YAML, les tokens hors spec (ombres, motion, focus) allant dans un sidecar. Un test de parité CSS ↔ `DESIGN.md` évite la dérive. Le hook détecteur d'Impeccable scanne nativement `.astro`, `.css` et `.ts` (MEASURED, `hooks.md`).
- **Tokens animables** : déclarés avec `@property` (typés), pour que GSAP ou le CSS puisse interpoler, par exemple `--reveal: <percentage>`.

### 7.5 Arborescence

```
vyron/
├── .github/
│   ├── workflows/ci.yml              # lint → typecheck → unit → build → e2e + a11y + visuel → lhci
│   ├── workflows/deploy.yml          # main → wrangler deploy ; previews par PR
│   └── pull_request_template.md      # checklist : a11y, reduced motion, captures avant/après, diff Lighthouse
├── .impeccable/config.json            # config Impeccable (hook détecteur)
├── docs/
│   ├── adr/                           # 0001-astro-mpa.md, 0002-gsap-moteur-unique.md, 0003-css-natif.md, 0004-lenis.md…
│   ├── motion-thesis.md               # moment focal, continuités, feedbacks, budget (Impeccable « animate »)
│   └── credits.md                     # designer du shot d'origine, licences des polices, provenance des images (Higgsfield)
├── public/
│   ├── _headers                       # cache immutable sur /_astro/*, en-têtes de sécurité
│   ├── videos/ · captions/            # mp4/webm + .vtt (non traités par Vite)
│   └── favicon.svg · robots.txt
├── src/
│   ├── assets/
│   │   ├── images/                    # sources haute définition → AVIF/WebP via astro:assets
│   │   └── fonts/                     # woff2 sous licence (Fonts API, provider local)
│   ├── components/
│   │   ├── ui/                        # Button, LinkArrow, Icon, Asterisk, Tag (.astro)
│   │   ├── layout/                    # SiteHeader, MenuDialog, SiteFooter, SkipLink
│   │   └── sections/                  # Hero, About, Services, Programs, WhyVyron, Transformation, Marquee
│   ├── content/                       # programs/, services/, testimonials/, team/ (YAML/MD)
│   ├── content.config.ts              # schémas Zod des collections
│   ├── layouts/BaseLayout.astro       # <head>, <Font>, SEO, @view-transition, script has-motion, main.ts
│   ├── pages/                         # index, programmes/, a-propos, equipe, contact, 404
│   ├── scripts/
│   │   ├── main.ts                    # point d'entrée client unique
│   │   ├── elements/                  # vy-menu.ts, vy-accordion.ts, vy-carousel.ts, vy-video.ts
│   │   └── motion/
│   │       ├── engine.ts              # registerPlugin, defaults, CustomEase
│   │       ├── tokens.ts              # miroir de tokens.css
│   │       ├── smooth-scroll.ts       # Lenis ↔ ScrollTrigger, stop/start
│   │       ├── lifecycle.ts           # adaptateur MPA / ClientRouter
│   │       ├── registry.ts            # data-motion → effet
│   │       └── effects/               # hero-intro.ts, reveal-lines.ts, why-pin.ts, footer-wordmark.ts
│   ├── styles/
│   │   ├── global.css                 # déclaration des @layer + imports
│   │   ├── tokens.css · reset.css · base.css · layout.css · utilities.css
│   │   └── motion.css                 # états initiaux sous html.has-motion + reduced motion
│   └── lib/                           # TS pur et testable : media.ts, dom.ts, a11y.ts
├── tests/
│   ├── unit/                          # Vitest : parité des tokens, lib/*
│   ├── e2e/                           # menu, accordéon, carrousel, navigation, no-js
│   ├── a11y/                          # axe : chaque page × états (menu ouvert, accordéon déplié)
│   └── visual/                        # toHaveScreenshot 375 / 768 / 1440
├── astro.config.ts · tsconfig.json · eslint.config.ts · prettier.config.mjs · stylelint.config.mjs
├── playwright.config.ts · vitest.config.ts · lighthouserc.json · knip.json · wrangler.jsonc
├── lefthook.yml · commitlint.config.ts · .editorconfig · .nvmrc · .browserslistrc
├── PRODUCT.md · DESIGN.md             # artefacts Impeccable à la racine (init / document)
└── README.md                          # architecture, scripts, scores, crédits, GIF des interactions
```

### 7.6 Conventions de composants

- **Un composant, une responsabilité.** Les fichiers `.astro` sont en PascalCase. Les props sont typées par `interface Props` et ont des valeurs par défaut dans la déstructuration. `any` est interdit, ce que le preset `strictest` et typescript-eslint `strictTypeChecked` font respecter.
- **Le contenu vit hors des composants.** Textes, programmes, témoignages et équipe sont dans des content collections validées par Zod. Les sections ne font que mapper.
- **Le comportement passe par des custom elements** (`<vy-menu>`…), comme la doc Astro le recommande :
  - `this.querySelector` reste limité au composant ;
  - `connectedCallback` gère le montage ;
  - `disconnectedCallback`, avec un `AbortController` pour tous les listeners, gère le démontage. Ce mécanisme reste valable avec un swap ClientRouter (INFERRED, comportement standard du DOM).
- **Séparation entre style, état et animation** :
  - les classes servent au style ;
  - les attributs ARIA et `data-state` portent l'état ;
  - `data-motion` sert de point d'accroche à l'animation.
  - Une animation ne cible jamais une classe de style.
- **Langue et sémantique** : `lang` sur `<html>`, une seule hiérarchie de titres par page, `SkipLink`, vrais `<button>` et `<a>`, textes alternatifs descriptifs sur les images (générées par Higgsfield).
- **Images** : toujours `<Image>` ou `<Picture>` avec `layout` et `widths`. L'image du hero a `priority`. Pas d'`<img>` brut.
- **Pas de JS de mise en page** : aucune lecture de layout dans une boucle d'écriture. Les mesures passent par ScrollTrigger et `ResizeObserver`.

### 7.7 Outillage qualité et CI

| Étape | Commande / outil | Échec bloquant si… |
|---|---|---|
| Format | `prettier --check` (avec le plugin Astro) | Fichier non formaté |
| Lint TS / Astro / a11y | ESLint 10 flat : `typescript-eslint` strictTypeChecked, `eslint-plugin-astro` recommended + jsx-a11y-strict (via `jsx-a11y-x`) | Une erreur |
| Lint CSS | Stylelint 17 : standard, html, recess-order. Interdiction des couleurs littérales hors `tokens.css` | Une erreur |
| Types | `astro check` (TypeScript 6.0) | Une erreur |
| Code mort | `knip` | Export ou dépendance inutilisés |
| Unitaires | Vitest 5 : parité des tokens, `lib/` | Un test rouge |
| Build | `astro build` | Warning Rolldown ou HTML invalide (compilateur Rust strict) |
| E2E | Playwright : clavier (Tab, `Esc`, retour du focus), menu, accordéon, carrousel, navigation. **Projet `no-js`** (`javaScriptEnabled: false`) : tout le contenu reste visible | Un test rouge |
| Accessibilité | `@axe-core/playwright`, tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`, sur chaque page × états, **en `reducedMotion: 'reduce'` et `'no-preference'`** | Une violation |
| Visuel | `toHaveScreenshot` à 375, 768 et 1440, `animations: 'disabled'`, vidéos masquées, exécuté dans l'image Docker officielle de Playwright pour un rendu déterministe | Diff au-dessus du seuil |
| Animation | Test « rien ne reste caché » : après chargement et scroll complet, aucun `[data-motion]` n'a `opacity: 0` | Un élément invisible |
| Lighthouse CI | 3 runs, profil mobile ; assertions ci-dessous | Budget dépassé |

**Budgets proposés** (ESTIMATED, à valider sur le premier build réel)

| Indicateur | Budget |
|---|---|
| Performance | ≥ 0,95 |
| Accessibilité | = 1,00 |
| Bonnes pratiques et SEO | ≥ 0,95 |
| LCP | ≤ 2,0 s |
| CLS | ≤ 0,05 |
| TBT | ≤ 150 ms |
| JS total de l'accueil | ≤ 75 Ko gzip |
| Polices (woff2, subset latin) | ≤ 120 Ko |
| Image du hero en AVIF, 1440w | ≤ 200 Ko |

**Hooks locaux** (lefthook)

- `pre-commit` : Prettier, ESLint et Stylelint sur les fichiers indexés.
- `commit-msg` : commitlint.
- `pre-push` : `astro check` et Vitest.

### 7.8 Conventions Git

- **Conventional Commits**, contrôlés par commitlint.
  - Types : `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `docs`, `build`, `ci`, `chore`, `revert`.
  - **Scopes** = sections ou couches : `hero`, `about`, `services`, `programs`, `why`, `transformation`, `marquee`, `footer`, `menu`, `motion`, `tokens`, `a11y`, `content`, `deps`.
  - Exemple : `feat(hero): split-line intro with masked reveal`.
- **Trunk-based** :
  - `main` protégé, déployé en production ;
  - branches courtes `feat/hero-intro`, `fix/menu-focus-return` ;
  - PR obligatoire avec CI verte et preview déployée ;
  - **squash merge** pour garder un historique linéaire.
- **Jalons taggés** : `v0.1.0` pour la maquette statique, `v0.2.0` pour les interactions, `v0.3.0` pour le motion, `v1.0.0` pour le lancement. Les notes de version reprennent les commits.
- **Un ADR par décision structurante** dans `docs/adr/`. C'est la preuve de méthode la plus lisible pour un recruteur.

### 7.9 Déploiement

- **Cible : Cloudflare Workers Static Assets.**
  - La doc Cloudflare (mise à jour en septembre 2026) dit : « If you are starting a new project, use Workers instead of Pages ».
  - Pour un site purement statique, `assets.directory: "./dist"` suffit, sans script Worker.
  - `_headers` et `_redirects` sont pris en charge nativement.
  - Les previews par branche passent par Workers Builds.
  - Tout cela est MEASURED (doc Cloudflare via MCP).
  - Cloudflare possède désormais Astro, ce qui laisse présager une intégration suivie (INFERRED).
- **En-têtes** :
  - `/_astro/*` en `Cache-Control: public, max-age=31536000, immutable` (fichiers hashés) ;
  - les pages gardent le défaut `max-age=0, must-revalidate` avec ETag ;
  - CSP via `security.csp` d'Astro (stable).
- **Alternatives équivalentes** : Netlify (`@astrojs/netlify@8.2.6`) ou Vercel. Aucun adaptateur n'est nécessaire pour une sortie statique.

---

## 8. Risques de la recommandation et mitigations

| # | Risque | Probabilité / impact | Mitigation |
|---|---|---|---|
| 1 | Pas de transition de page sous Firefox (cross-document absent, MEASURED) | Certaine / faible | Amélioration progressive : navigation instantanée et prefetch. Basculer sur ClientRouter si l'utilisateur l'exige (adaptateur §7.2) |
| 2 | Avec ClientRouter : classes `<html>` effacées, ce qui casse `lenis-stopped`, et reduced motion coupé en `!important` (MEASURED) | Si option choisie / moyen | Recopie des classes dans `astro:before-swap`. CSS de transition personnalisé avec une spécificité supérieure. Tests E2E de navigation |
| 3 | `compressHTML: 'jsx'` par défaut (Astro 7) : espaces supprimés entre éléments inline | Probable / faible mais sournois | `{" "}` explicites, test visuel des textes riches, ou `compressHTML: true` si besoin |
| 4 | Verrou TypeScript : `latest` = 7.0.2, incompatible avec typescript-eslint et `astro check` (MEASURED) | Certaine / moyen | Épingler `~6.0.3`. Renovate n'ouvre la montée vers 7 qu'une fois les `peerDependencies` élargies |
| 5 | Le hero animé dégrade le LCP ou le CLS (photo masquée, lignes reflowées par une police tardive) | Moyenne / élevé (portfolio) | Photo LCP visible dès t = 0, `priority`. Intro par `transform` / `clip-path` depuis un état visible. SplitText `autoSplit` après `document.fonts.ready`. Fallbacks métriques de la Fonts API |
| 6 | Sur-animation : même révélation sur chaque section (refusé par le craft-floor) | Élevée / élevé | Registre en opt-in, `motion-thesis.md` validé avant de coder, revue par Impeccable `animate`, puis `polish` |
| 7 | Lenis et accessibilité ou attentes natives (iframes, Safari 60 fps, scroll-snap) | Moyenne / moyen | Mode prudent §6.3, `syncTouch: false`, `respectReducedMotion` à `true`, `data-lenis-prevent`. Option « natif » documentée |
| 8 | ScrollTrigger sur le thread principal, donc jank sur mobile modeste | Moyenne / moyen | Animer seulement `transform`, `opacity` et `clip-path`. `will-change` limité à la durée de l'animation. Profilage DevTools, budget TBT dans LHCI |
| 9 | Licence GSAP propriétaire (clause Webflow) | Faible / faible | Usage portfolio hors du périmètre interdit. Bannières de licence conservées. Mention dans `credits.md` |
| 10 | Rythme de sortie élevé (Astro mineure chaque mois, Motion 14 publié aujourd'hui, Lenis 2 en dev) | Certaine / faible | Versions exactes, Renovate groupé et hebdomadaire, CI complète sur chaque montée |
| 11 | Lighthouse CI peu maintenu (dernière version en juin 2025, MEASURED) | Moyenne / faible | Garder `@lhci/cli` pour les assertions, ajouter `unlighthouse` pour un scan multi-pages local |
| 12 | Éthique et droits : reproduction d'un shot Dribbble d'un autre designer, polices sous licence inconnue | Certaine / élevé (réputation) | Créditer le designer d'origine (README, footer, `credits.md`), adapter le design, n'utiliser aucun asset de marque réel, prendre une police sous licence compatible (self-host via la Fonts API) |
| 13 | Signal React plus faible auprès de certains recruteurs | Moyenne / moyen | README et ADR qui expliquent le choix. Island React optionnel et mesuré (§5.3) |
| 14 | Vidéo de témoignage trop lourde | Moyenne / moyen | `preload="none"`, `poster` AVIF, encodages H.264 et AV1/VP9, lecture à l'action de l'utilisateur, pause hors écran, sous-titres |

---

## 9. Tensions Impeccable et questions pour l'utilisateur

**Tensions entre le craft-floor et le brief.** « The brief wins » : ce sont des décisions à prendre, pas des corrections automatiques.

- **Reduced motion** : Impeccable demande « fewer and gentler, not disabling all motion ». Le ClientRouter d'Astro coupe tout (MEASURED). C'est un argument de plus pour la MPA, où l'on peut garder un fondu.
- **« One authored moment »** : le shot invite à animer chaque titre géant. La stack doit rendre l'opt-in explicite (registre `data-motion`) pour que le moment focal (hero) reste unique.
- **Police display** : le craft-floor refuse une police système en voix display. Il faut une police sous licence, auto-hébergée via la Fonts API. Le choix exact revient à l'analyste typographie.
- **Plafond display de 6rem** : le wordmark « VYRON™ » et « SERVICES. » du shot le dépassent visiblement. Garder l'échelle du brief ou appliquer le plafond ?
- **Hors de ma lentille mais visibles sur `1.png`** : surtitres de section du type « [ABOUT] About Us » (**ban absolu** du craft-floor) et numéros « 01 / 02 ». C'est à trancher avec les analystes design.

**Questions à poser**

1. **Navigation** : MPA + View Transitions natives (0 Ko, pas d'animation sous Firefox) ou `<ClientRouter />` (5,4 Ko, transitions partout, cycle de vie à gérer) ? Faut-il un élément qui persiste entre les pages ?
2. **Smooth scroll** : Lenis en mode prudent, ou scroll natif pur ?
3. **Styles** : CSS natif avec tokens (recommandé), ou Tailwind v4.3 pour le signal marché ?
4. **WebGL** : faut-il un effet shader sur la photo du hero ? Si oui, OGL, chargé après le LCP.
5. **Objectif carrière** : le signal React doit-il être visible ? Si oui, avec un island React mesuré ou avec la stack B complète ?
6. **Sous-pages** : lesquelles exactement (À propos, Programmes, Équipe, Contact) ? Faut-il un formulaire de contact réel ? Cela demanderait un endpoint (Worker ou service tiers) et changerait la sortie 100 % statique.
7. **Langue** : le site sera-t-il en anglais comme le shot, en français, ou bilingue (routing i18n d'Astro) ?
8. **Hébergement et domaine** : Cloudflare (recommandé), Netlify ou Vercel ? Avez-vous un domaine personnel ?
9. **Crédits** : quels sont le nom et le lien du designer d'origine, à citer dans le README et le footer ?
10. **Police** : acceptez-vous une alternative libre si la police du shot est commerciale ?

---

## 10. Sources

**Registre npm et paquets (MEASURED, interrogés le 2026-10-02)** : `https://registry.npmjs.org/<paquet>`, pour astro, next, react, nuxt, vue, gsap, motion, framer-motion, motion-v, lenis, tailwindcss, typescript, vite, eslint, typescript-eslint, @astrojs/check, eslint-plugin-astro, eslint-plugin-jsx-a11y(-x), stylelint*, @playwright/test, @axe-core/playwright, @lhci/cli, knip, lefthook, @commitlint/*, wrangler, pnpm, three, ogl et embla-carousel. Code source lu dans les tarballs `astro@7.3.5` (`components/ClientRouter.astro`, `components/viewtransitions.css`, `dist/transitions/swap-functions.js`, `dist/core/config/schemas/base.js`, `tsconfigs/*`), `lenis@1.3.26` (`dist/lenis.css`, `lenis.d.ts`), `gsap@3.15.0` (README, en-têtes de licence), `next@16.3.8` (`dist/docs/01-app/02-guides/view-transitions.md`) et `@nuxt/schema@4.5.2`.

**Données navigateurs (MEASURED)**
- [MDN browser-compat-data 8.1.4](https://github.com/mdn/browser-compat-data)
- [web-features 3.40.1 (Baseline)](https://github.com/web-platform-dx/web-features)
- [Chrome — Cross-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)
- [Chrome — Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- [buildmvpfast — état de Firefox (flag en 152)](https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026) (secondaire)

**Astro**
- [CHANGELOG Astro 7.x](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)
- [CHANGELOG Astro 6.x (tag astro@6.4.8)](https://github.com/withastro/astro/blob/astro%406.4.8/packages/astro/CHANGELOG.md)
- [Blog Astro 7](https://astro.build/blog/astro-7/) (bloqué, cité via recherche)
- Docs (via Context7, `withastro/docs`) :
  - [View transitions](https://docs.astro.build/en/guides/view-transitions/)
  - [Fonts](https://docs.astro.build/en/guides/fonts/)
  - [Images](https://docs.astro.build/en/guides/images/)
  - [Client-side scripts](https://docs.astro.build/en/guides/client-side-scripts/)
- Rachat par Cloudflare :
  - [BusinessWire 2026-01-16](https://secure.businesswire.com/news/home/20260116386991/en/Cloudflare-Acquires-Astro-to-Accelerate-the-Future-of-High-Performance-Web-Development)
  - [roboin.io](https://roboin.io/article/en/2026/01/17/cloudflare-acquires-astro-web-framework/)
- [Astro 6 sur Netlify](https://blogs.apievangelist.com/blogs/netlify-2026-03-10-astro-6-just-works-on-netlify/)

**React / Next.js**
- [CHANGELOG React (19.3.0)](https://github.com/facebook/react/blob/main/CHANGELOG.md)
- [Next.js 16.3](https://nextjs.org/blog/next-16-3)
- [Next.js 16 (résumé)](https://alternativeto.net/news/2025/10/next-js-16-launches-with-turbopack-new-caching-model-react-19-2-and-devtools-upgrades)

**Nuxt / Vue**
- [Nuxt 4.5.0](https://newreleases.io/project/npm/nuxt/release/4.5.0)
- [Contexte Nuxt 5 / Vapor](https://ecorpit.com/vue-js-development-company/) (secondaire)

**GSAP**
- [Standard License](https://gsap.com/standard-license) (bloqué, texte cité via recherche)
- [Miroir du texte de licence](https://gsap.com/community/standard-license/)
- [Webflow — GSAP becomes free](https://webflow.com/blog/gsap-becomes-free)
- [gsap-trial déprécié](https://cdn.jsdelivr.net/npm/gsap-trial@3.13.0/README.md)
- Docs (via Context7) :
  - [gsap.context()](https://gsap.com/docs/v3/GSAP/gsap.context())
  - [gsap.matchMedia()](https://gsap.com/docs/v3/GSAP/gsap.matchMedia())
  - [SplitText](https://gsap.com/docs/v3/Plugins/SplitText)
  - [ScrollTrigger.refresh()](https://gsap.com/docs/v3/Plugins/ScrollTrigger/refresh())

**Motion**
- [CHANGELOG Motion](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)
- Docs (via Context7) :
  - [Upgrade guide](https://motion.dev/docs/upgrade-guide)
  - [splitText (Motion+)](https://motion.dev/docs/split-text)
  - [GSAP vs Motion](https://motion.dev/docs/gsap-vs-motion)
  - [React upgrade guide](https://motion.dev/docs/react-upgrade-guide)

**Lenis** : [README Lenis](https://github.com/darkroomengineering/lenis)

**Styles** : [CHANGELOG Tailwind CSS](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md)

**Outillage**
- [CHANGELOG Biome](https://github.com/biomejs/biome/blob/main/packages/%40biomejs/biome/CHANGELOG.md)
- [Versions Node.js](https://nodejs.org/dist/index.json)

**Déploiement (doc Cloudflare via MCP)**
- [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Astro sur Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Migrer de Pages vers Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [Headers des static assets](https://developers.cloudflare.com/workers/static-assets/headers/)

**Écosystème et adoption (INFERRED, secondaire)**
- [State of JS 2025 — Meta-frameworks](https://2025.stateofjs.com/en-US/libraries/meta-frameworks/)
- [Strapi — résumé State of JS 2025](https://strapi.io/blog/state-of-javascript-2025-key-takeaways)
- [Awwwards — sites Astro](https://www.awwwards.com/websites/astro/)

**Méthode Impeccable (lue localement)** : `reference/craft-floor.md`, `animate.md`, `mode-persuade.md`, `optimize.md`, `hooks.md`, `init.md`, `document.md` et `SKILL.md` (v4.5.0).

