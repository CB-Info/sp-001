> **Annexe brute** : rapport de l’agent `v3-stack-adversary`, versionné tel qu’il a été produit pendant la phase d’analyse (2026-10-02). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse (crops, scripts) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

# VYRON : revue adverse de la stack recommandée (`v3-stack-adversary`)

> **Rôle** : relire le rapport `s1-stack` en partant du doute.
> **Date de vérification** : 2026-10-02.
> **Code** : aucune ligne du site n'a été écrite. Les seuls builds sont des pages jetables de mesure, dans `work/v3-stack-adversary/bench/`.
> **Mesures visuelles** : cette lentille n'en contient aucune. La consigne « px mesurés / normalisés à 1440 px » ne s'applique donc pas ici (facteur d'échelle : sans objet).

---

## 0. Verdict express

**AMEND.** Le cœur de la recommandation tient à la vérification : Astro statique, GSAP, Lenis optionnel, CSS natif et custom elements restent le meilleur choix pour une landing **autonome**. Presque tous les chiffres de s1 sont exacts.

Le rapport a pourtant cinq défauts. Ils changent la façon de présenter la décision à l'utilisateur :

1. **La comparaison côté React est biaisée.** s1 mesure Next.js (168,4 Ko gzip) et non Vite + React (66,0 Ko, MEASURED). C'est pourtant Vite + React que l'utilisateur emploie pour ce type de site.
2. **Le périmètre est gonflé.** s1 prévoit 2 à 4 sous-pages qui n'apparaissent pas dans le shot. Une grande partie du §7.2 et l'avantage « MPA » reposent sur ces sous-pages.
3. **Le choix MPA repose sur un argument reduced-motion inexact.** Le `!important` du ClientRouter peut être surchargé, car la spec donne une spécificité nulle au sélecteur `*`.
4. **Le déclenchement de l'intro sur `pagereveal` depuis un module différé est fragile.** L'événement peut être raté au premier rendu, et l'intro peut se rejouer au retour arrière (bfcache).
5. **La CI mesure avec un Lighthouse en retard d'une version majeure.** `@lhci/cli@0.15.1` embarque `lighthouse@12.6.1`, alors que la version courante est 13.5.0. Les tokens sont aussi écrits en trois exemplaires, tenus alignés par des tests de parité.

---

## 1. Méthode et légende

**Statuts utilisés**

- **MEASURED** : lu ou mesuré par moi dans une source primaire.
- **ESTIMATED** : calculé à partir de valeurs mesurées.
- **INFERRED** : jugement, ou source secondaire.

**Sources primaires lues**

- **Registre npm** : `dist-tags`, `time`, `peerDependencies` et `engines` de tous les paquets cités.
- **Tarballs (`npm pack`)** : `astro@7.3.5`, `lenis@1.3.26`, `gsap@3.15.0`, `nuxt@4.5.2`, `@nuxt/schema@4.5.2`, `motion-v@2.5.2`, `next@16.3.8`.
- **Données navigateurs** : `@mdn/browser-compat-data@8.1.4` (horodaté 2026-10-01T10:12Z) et `web-features@3.40.1`.
- **CHANGELOG bruts sur GitHub** : Astro 6.x et 7.x, React, Motion, Biome.
- **Spécifications** : sources Bikeshed de *CSS View Transitions 1 et 2* (`w3c/csswg-drafts`), page MDN `pagereveal`.
- **Divers** : `nodejs.org/dist/index.json`, documentation Cloudflare (MCP), Context7 (`withastro/docs`, `gsap.com/docs`).

**Contre-mesures des poids**

- J'ai recalculé les poids JS à partir des builds de `s1-stack` (scripts, `modulepreload`, gzip -9). Les résultats sont **identiques** : 0, 5,4, 55,9, 49,3 et 168,4 Ko.
- J'ai ajouté des builds Vite 8.3.2 avec React 19.3.0, Vue 3.5.43 et vanilla, chacun avec GSAP 3.15.0 et Lenis 1.3.26 (§3).

**Accès bloqués**

- Domaines inaccessibles : `gsap.com`, `developer.chrome.com`, `drafts.csswg.org`, `businesswire.com`.
- Je suis passé par les miroirs GitHub quand ils existaient. Sinon, j'ai utilisé une source secondaire, marquée INFERRED.

**Contexte de l'utilisateur**

- J'ai lu les `package.json` de **4 dépôts publics** de son compte GitHub `CB-Info` : `car-clean`, `games-party`, `petankup`, `pfe-web`.
- Je n'ai ouvert aucun dépôt privé, dont `portfolio-3d`, `clement-bilger`, `la-place-brasserie`, `bar-a-fleurs` et `my-agency`.

---

## 2. Vérification des faits

Verdicts : **CONFIRMÉ** · **CONFIRMÉ (nuance)** · **PARTIEL** · **INEXACT** · **NON VÉRIFIÉ**.

### 2.1 Astro

| # | Affirmation de s1 | Verdict | Preuve / source |
|---|---|---|---|
| 1 | `astro` `latest` = 7.3.5 (2026-09-24) ; `beta` = 7.4.0-beta.1 ; 7.0.0 le 2026-06-22 ; 6.0.0 le 2026-03-10 ; 5.0.0 le 2024-12-03 | CONFIRMÉ | https://registry.npmjs.org/astro |
| 2 | Licence MIT ; Node `>=22.12.0` ; `vite ^8.0.13` ; `@astrojs/compiler-rs` ; `esbuild ^0.28` | CONFIRMÉ (compiler-rs en `^0.5.0`) | https://registry.npmjs.org/astro/7.3.5 |
| 3 | Le compilateur Rust devient le compilateur par défaut en 7.0 ; le compilateur Go est supprimé ; une balise non fermée provoque une erreur | CONFIRMÉ | Astro CHANGELOG 7.0.0, PR #16462 : https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md |
| 4 | `compressHTML: 'jsx'` par défaut : les espaces inline entre éléments sur des lignes différentes sont supprimés | CONFIRMÉ (nuance : un espace sur une **même ligne** est conservé) | PR #16965 ; `dist/core/config/schemas/defaults.js` (`compressHTML: "jsx"`) |
| 5 | `<ViewTransitions />` et `handleForms` supprimés en 6.0 ; exports dépréciés d'`astro:transitions` retirés en 7.0 | CONFIRMÉ | PR #14400 et #14462 (CHANGELOG `astro@6.4.8`) ; PR #16725 (7.0.0) |
| 6 | Le CSS du ClientRouter contient `@media (prefers-reduced-motion) { ::view-transition-*(*) { animation: none !important } }` | CONFIRMÉ (le fait) | `astro@7.3.5/components/viewtransitions.css` |
| 6b | Conséquence tirée par s1 : **toute** transition saute, impossible de garder un fondu (argument pro-MPA, §7.2 et §9) | **INEXACT** | La spec dit : *« The specificity of a named view transition pseudo-element selector with a `*` argument is zero »*. Un `::view-transition-group(root)` nommé avec `!important` l'emporte donc (INFERRED : lecture de la spec, non testé en navigateur). https://github.com/w3c/csswg-drafts/blob/main/css-view-transitions-1/Overview.bs |
| 7 | `swapRootAttributes()` efface **tous** les attributs de `<html>`, donc les classes `lenis*` sont perdues | CONFIRMÉ (nuance : Lenis remet ses classes au changement d'état suivant, via les setters `isScrolling` / `isStopped` puis `updateClassName()`. L'effet est donc transitoire, sauf si Lenis est arrêté pendant la navigation) | `astro@7.3.5/dist/transitions/swap-functions.js` ; `lenis@1.3.26/dist/lenis.mjs` l. 990-1051 |
| 8 | Flags expérimentaux en 7.3.5 : `clientPrerender`, `contentIntellisense`, `chromeDevtoolsWorkspace`, `incrementalBuild`, `svgOptimizer`, `collectionStorage` | CONFIRMÉ | `dist/core/config/schemas/base.js` |
| 9 | Fonts API stable depuis 6.0 ; `subset` ajouté à `fontData` en 7.0 ; `security.csp` stable en 6.0 | CONFIRMÉ | CHANGELOG 6.0.0 (PR #15291, #15266) ; 7.0.0 (PR #16996) |
| 10 | Cloudflare a racheté l'équipe Astro le 2026-01-16 ; Astro reste MIT et multi-hébergeur | CONFIRMÉ (sources secondaires ; BusinessWire bloqué) | https://roboin.io/article/en/2026/01/17/cloudflare-acquires-astro-web-framework/ ; https://alternativeto.net/news/2026/1/cloudflare-acquires-astro-team-keeps-it-open-source-with-multiple-deployment-targets |
| 11 | JS initial gzip : Astro 0 Ko, avec ClientRouter 5,4 Ko, page complète 55,9 Ko ; Nuxt 49,3 Ko ; Next 168,4 Ko | CONFIRMÉ (re-mesuré sur les `dist/` de s1) | `work/s1-stack/{astro,nuxt,next}-bench` |

### 2.2 React et Next.js

| # | Affirmation de s1 | Verdict | Preuve / source |
|---|---|---|---|
| 12 | `next` 16.3.8 `latest` ; 16.3.0 le 2026-08-03 ; 16.0.0 le 2025-10-22 ; `canary` 16.4.0-canary.57 | CONFIRMÉ | https://registry.npmjs.org/next |
| 13 | Doc embarquée de Next : « View transitions work in the App Router with no configuration » | CONFIRMÉ (la phrase précise que l'App Router embarque React canary) | `next@16.3.8/dist/docs/01-app/02-guides/view-transitions.md` l. 50 |
| 14 | React 19.3.0 (2026-09-09) : `<ViewTransition />`, `addTransitionType`, Fragment refs, `browser()` | CONFIRMÉ | https://github.com/facebook/react/blob/main/CHANGELOG.md |
| 15 | `@gsap/react@2.1.2` | CONFIRMÉ (nuance : licence « SEE LICENSE AT gsap.com/standard-license », pas MIT ; dernière publication le 2025-01-15) | https://registry.npmjs.org/@gsap/react/2.1.2 |
| 16 | Une page React vide coûte 168,4 Ko (« le poids de React ») | **PARTIEL** : ces 168,4 Ko sont ceux de **Next.js**. Vite + React 19.3 pèse **66,0 Ko gzip** (MEASURED, §3) | Build local `bench/react-hello` |

### 2.3 Nuxt, Vue et Motion

| # | Affirmation de s1 | Verdict | Preuve / source |
|---|---|---|---|
| 17 | `nuxt` 4.5.2 `latest` (publié le 2026-08-05) ; 4.5.0 le 2026-07-18 ; `3x` = 3.21.11 ; Node `^22.19.0 \|\| ^24.11.0 \|\| >=26.0.0` | CONFIRMÉ | https://registry.npmjs.org/nuxt |
| 18 | « Nuxt 5 en cours de stabilisation » | NON VÉRIFIÉ (aucun dist-tag 5.x) | idem |
| 19 | `vue` 3.5.43 `latest` ; 3.6 seulement en `rc` (3.6.0-rc.10) | CONFIRMÉ | https://registry.npmjs.org/vue |
| 20 | Option `viewTransition` de Nuxt : `enabled: boolean \| 'always'`, `types` | CONFIRMÉ. **Omis par s1** : Nuxt coupe lui aussi les view transitions sous `prefers-reduced-motion`, sauf avec `'always'` | `@nuxt/schema@4.5.2/dist/index.d.mts` l. 592 ; `nuxt@4.5.2/dist/app/plugins/view-transitions.client.js` l. 33 |
| 21 | `motion-v@2.5.2` dépend de `framer-motion@13.5.1` | CONFIRMÉ (nuance : c'est une **plage** `^13.3.0`, qui donne 13.5.1 aujourd'hui et ne peut pas atteindre la 14) | https://registry.npmjs.org/motion-v/2.5.2 |
| 22 | Motion 14.0.0 (2026-10-02) ; 13.0.0 (2026-08-05, retrait de `@emotion/is-prop-valid`) ; `AnimateView` en 13.4.0 | CONFIRMÉ | https://github.com/motiondivision/motion/blob/main/CHANGELOG.md |

### 2.4 GSAP

| # | Affirmation de s1 | Verdict | Preuve / source |
|---|---|---|---|
| 23 | GSAP 3.15.0 (2026-04-13), 3.14.0 (2025-12-08), 3.13.0 (2025-04-30) | CONFIRMÉ | https://registry.npmjs.org/gsap |
| 24 | Licence `"Standard 'no charge' license"` ; le README dit « 100% FREE … even for commercial use » | CONFIRMÉ | `gsap@3.15.0/package.json`, README l. 60-62 |
| 25 | Clauses « Prohibited Uses » (pas d'outil no-code concurrent de Webflow, etc.) | NON VÉRIFIÉ (`gsap.com` bloqué). Plausible, et sans effet sur ce projet | https://gsap.com/standard-license |
| 26 | Tous les plugins (SplitText, ScrollSmoother, Flip, MorphSVG…) sont dans le paquet public ; `gsap-trial` est déprécié | CONFIRMÉ | Contenu du tarball ; `gsap-trial@3.13.0` : *« deprecated in favor of the standard 'gsap' package »* |
| 27 | SplitText : `mask`, `autoSplit`, aria géré | CONFIRMÉ (`mask?: "lines"\|"words"\|"chars"`, `aria?: "auto"\|"hidden"\|"none"`, `autoSplit?: boolean`) | `gsap@3.15.0/types/split-text.d.ts` |
| 28 | ScrollSmoother « casse `position: fixed`, `sticky` et les ancres natives » | PARTIEL. Les éléments `fixed` doivent rester **hors** du wrapper transformé (doc). Mais la doc précise que « the actual scrollbar remains on the `<body>` » : les ancres ne sont pas cassées par principe | Context7 `gsap.com/docs/v3/Plugins/ScrollSmoother` |

### 2.5 Lenis

| # | Affirmation de s1 | Verdict | Preuve / source |
|---|---|---|---|
| 29 | `lenis` 1.3.26 (2026-08-05) ; 2.0.0-dev.5 (2026-09-18) | CONFIRMÉ | https://registry.npmjs.org/lenis |
| 30 | Exports `lenis/react`, `lenis/vue`, `lenis/nuxt`, `lenis/snap` | CONFIRMÉ | `lenis@1.3.26/package.json` |
| 31 | `respectReducedMotion` vaut `true` par défaut | CONFIRMÉ | `dist/lenis.mjs` l. 434 (signature du constructeur) |
| 32 | Snippet GSAP : `lenis.on('scroll', ScrollTrigger.update)`, ticker, `lagSmoothing(0)` | CONFIRMÉ | README Lenis l. 145-160 |
| 33 | Limites : Safari plafonné à 60 fps (30 fps en économie d'énergie), iframes, scroll-snap, `fixed` qui traîne sur les anciens Safari macOS | CONFIRMÉ | README Lenis l. 366-369 |

### 2.6 Styles et plateforme web

| # | Affirmation de s1 | Verdict | Preuve / source |
|---|---|---|---|
| 34 | `tailwindcss` 4.3.3 | CONFIRMÉ | https://registry.npmjs.org/tailwindcss |
| 35 | Baseline : nesting *widely* depuis 2026-06-11 ; container queries 2025-08 ; `oklch` 2025-11 ; `@property` *newly* 2024-07 ; `@starting-style` *newly* 2024-08 ; `@scope` *newly* 2026-03-24 | CONFIRMÉ | `web-features@3.40.1` |
| 36 | Tableau BCD : VT same-document dans Firefox 144 ; VT cross-document **absentes** de Firefox ; scroll-driven en `preview` dans Firefox ; `interpolate-size` dans Chrome seul ; `dialog[closedby]` en `preview` dans Safari | CONFIRMÉ | `@mdn/browser-compat-data@8.1.4` |
| 37 | Speculation Rules dans Safari 26.2 | **INEXACT par omission** : c'est **derrière un flag** (`flags` dans BCD). Baseline `false`, Chromium seul | idem |
| 38 | `transition-behavior: allow-discrete` : Baseline « oui » | CONFIRMÉ (nuance : Baseline *newly* depuis le 2024-08-06, pas *widely*) | `web-features@3.40.1` |

### 2.7 Outillage et hébergement

| # | Affirmation de s1 | Verdict | Preuve / source |
|---|---|---|---|
| 39 | TS `latest` = 7.0.2 (2026-07-08). Or `typescript-eslint@8.71` exige `<6.1.0` et `@astrojs/check@0.9.10` exige `^5 \|\| ^6` : il faut épingler `~6.0.3` | CONFIRMÉ, mais **mal attribué** dans la note DX (§5.2). Le verrou vient de `typescript-eslint`, qu'utilisent aussi les setups React et Vue (`@nuxt/eslint-config`). `vue-tsc@3.3.12` accepte `>=5.0.0` | https://registry.npmjs.org/typescript-eslint/8.71.0 ; https://registry.npmjs.org/@astrojs/check/0.9.10 |
| 40 | `eslint-plugin-jsx-a11y@6.10.2` s'arrête à ESLint 9 ; le fork `-x@0.2.0` accepte `^9 \|\| ^10` et est pris en charge par `eslint-plugin-astro@3.2.1` | CONFIRMÉ. **Omis** : `eslint-plugin-astro@3.2.1` exige `eslint >=10` et Node `^22.22.3 \|\| ^24.16.0 \|\| >=26.3.0`. Le banc de s1 tournait sous Node 22.22.0, qui ne satisfait pas cette contrainte | https://registry.npmjs.org/eslint-plugin-astro/3.2.1 |
| 41 | `@lhci/cli@0.15.1`, dernière publication le 2025-06-25 | CONFIRMÉ. **Omis** : il embarque `lighthouse@12.6.1`, alors que Lighthouse en est à **13.5.0** (13.0.0 le 2025-10-10). `unlighthouse@0.19.0` (2026-09-29) dépend de `lighthouse ^13.5.0` | https://registry.npmjs.org/@lhci/cli/0.15.1 ; https://registry.npmjs.org/lighthouse ; https://registry.npmjs.org/@unlighthouse/core/0.19.0 |
| 42 | Biome 2.5.15 : la prise en charge d'Astro est derrière `experimentalFullSupportEnabled` | CONFIRMÉ | https://github.com/biomejs/biome/blob/main/packages/%40biomejs/biome/CHANGELOG.md |
| 43 | Versions d'outillage : ESLint 10.12.0, Vite 8.3.2, Vitest 5.0.3, Playwright 1.63.0, axe 4.13.0, Prettier 3.9.9, plugin Astro 1.1.0, Stylelint 17.16.0 (et configs 40, 2, 2, 7.8), knip 6.39.0, lefthook 2.1.16, commitlint 21.2.3, pnpm 12.8.1, wrangler 4.147.0, embla 8.6.0, three 0.186.1, ogl 1.0.11, `@astrojs/sitemap` 3.7.4, `@astrojs/netlify` 8.2.6, `@astrojs/react` 7.0.0 | CONFIRMÉ (toutes) | Registre npm, 2026-10-02 |
| 44 | Node 24.21.0 LTS « Krypton » ; 26.x pas encore LTS | CONFIRMÉ (24.21.0 le 2026-09-07 ; 26.10.0 en « Current ») | https://nodejs.org/dist/index.json |
| 45 | Doc Cloudflare : « If you are starting a new project, use Workers instead of Pages » | CONFIRMÉ | https://developers.cloudflare.com/workers/best-practices/workers-best-practices/ |

### 2.8 Écosystème

| # | Affirmation de s1 | Verdict | Preuve / source |
|---|---|---|---|
| 46 | State of JS 2025 et Awwwards (ASTRODITHER) | NON VÉRIFIÉ (domaines bloqués). Source secondaire Stack Overflow 2025 : React 46,9 %, Next.js 21,5 %, Vue 18,4 % (INFERRED) | https://enstacked.com/stack-overflow-developer-survey-insights/ |

### Bilan

Sur 46 affirmations vérifiées :

- **35 sont confirmées**, dont 13 avec une nuance ou une omission notable (lignes 4, 6, 7, 13, 15, 20, 21, 38, 39, 40, 41, 44 et 46) ;
- **3 sont partielles** (lignes 16, 28 et 43 pour l'attribution) ;
- **2 sont inexactes** (lignes 6b et 37) ;
- **3 sont non vérifiables** (lignes 18, 25 et 46).

**Aucune erreur de version.** Les failles sont dans le raisonnement, pas dans les données.

---

## 3. Mesures complémentaires : la comparaison que s1 n'a pas faite

**Protocole**

- Vite 8.3.2, une page HTML statique, `vite build` par défaut.
- Tous les `.js` émis sont comptés, en gzip -9 et en brotli q11 (MEASURED).
- Les entrées marquées « + stack » importent GSAP core, ScrollTrigger, SplitText (`mask: "lines"`, scrub) et Lenis, avec le snippet ticker officiel.

| Build | min | gzip | brotli | Statut |
|---|---|---|---|---|
| Vanilla TS + stack GSAP/Lenis | 136,2 Ko | **50,8 Ko** | 45,9 Ko | MEASURED |
| Vue 3.5.43 « hello » | 58,9 Ko | **23,0 Ko** | 21,0 Ko | MEASURED |
| Vue 3.5.43 + stack (`gsap.context` dans `onMounted`, `revert` au démontage) | 195,6 Ko | **73,4 Ko** | 66,3 Ko | MEASURED |
| React 19.3.0 « hello » (`createRoot`) | 214,1 Ko | **66,0 Ko** | 56,8 Ko | MEASURED |
| React 19.3.0 + `@gsap/react` (`useGSAP`) + stack | 351,0 Ko | **116,7 Ko** | 102,0 Ko | MEASURED |
| *Rappel s1* : Astro + ClientRouter + stack | — | 55,9 Ko | — | MEASURED (re-mesuré) |
| *Rappel s1* : Next.js 16.3.8 « hello » | — | 168,4 Ko | 145,5 Ko | MEASURED (re-mesuré) |

**Ce que montrent ces chiffres**

- **Coût du framework au-dessus du vanilla** (ESTIMATED, par différence de mesures) :
  - Astro statique : +0 Ko (+5,1 Ko avec le ClientRouter) ;
  - Vue : **+22,6 Ko** ;
  - React : **+65,9 Ko** ;
  - Next.js : environ 102 Ko de plus que Vite + React, pour le même React.
- La colonne « React » de s1 mesure donc **le routeur et le runtime de Next**, pas React lui-même.
- **Limite de mes builds** : une SPA Vite rend côté client. Le HTML livré est vide, ce qui pénalise le LCP, le SEO et le rendu sans JS. Pour comparer à niveau égal avec Astro, il faudrait un **prérendu**, que je n'ai pas mesuré. Le mode framework de React Router avec prérendu ajouterait son runtime et un coût d'hydratation (INFERRED).
- **Budget de s1** (« JS total de l'accueil ≤ 75 Ko gzip ») :
  - Astro, vanilla et Vue + stack (73,4 Ko) passent ;
  - React + stack (116,7 Ko) **ne passe pas**.

---

## 4. Contexte observé de l'utilisateur (dépôts publics)

| Dépôt (dernier push) | Nature | Stack relevée (MEASURED, `package.json`) |
|---|---|---|
| `car-clean` (2026-09-27) | **Site vitrine one-page**, avec variantes `v2/` et `v3/` | Vite 8.3, React 19.2, TS ~6.0.2, **Tailwind 4.3.3**, **Motion 13.4.3 (LazyMotion)**, **Lenis ^1.3.26**. Le README annonce : « Stack : Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion (LazyMotion) · Lenis » |
| `games-party` (2026-09-25) | Application | React 19.3, react-router 8.4, Tailwind 4.3, typescript-eslint 8.70, Vitest 5 |
| `petankup` (2026-09-25) | Application | **Nuxt 4.4.2**, Nuxt UI, Supabase, Pinia, Tailwind 4.2, vue-tsc |
| `pfe-web` (2026-02) | Application | React 18, framer-motion 11, Tailwind 3 |

**Lecture (INFERRED)**

- L'hypothèse « familiarité Vue » n'est **qu'à moitié juste** : l'utilisateur pratique React et Vue.
- Pour **exactement cette catégorie** (one-page vitrine animée), sa stack par défaut est **Vite + React + Tailwind 4 + Motion + Lenis**. Il l'a utilisée il y a 5 jours.
- Ni Astro ni GSAP n'apparaissent dans les dépôts visibles.
- Le verrou TS 6.0 et Lenis 1.3.26 ne sont pas de nouvelles contraintes pour lui : il les utilise déjà.

---

## 5. Les arguments contre la stack recommandée

Pour chaque argument : sa force, puis ce qui en reste après un examen honnête.

### A1. Comparaison biaisée côté React. **Fort**

- **Constat** : s1 oppose Astro à **Next.js App Router**. Pour une page statique sans données, c'est le pire représentant de React.
- **Écart réel** : le React pertinent ici est Vite + React, à 66,0 Ko et non 168,4 Ko (MEASURED). Stack d'animation comprise, l'écart avec Astro passe d'environ 112 Ko à **environ 61 Ko** gzip (116,7 contre 55,9).
- **Variantes absentes de la matrice** : Vue en SPA (73,4 Ko tout compris) et Astro avec islands Vue ou React.
- **Ce qui reste** : Astro demeure le plus léger. Mais l'écart réel est deux fois plus petit que celui présenté, et la note « Performance 2/5 » donnée à React vient de Next.

### A2. Décalage avec le profil réel de l'utilisateur. **Fort**

- **Constat** : par rapport à la pratique observée (§4), la recommandation change **quatre choses à la fois** :
  1. le framework (Astro au lieu de React) ;
  2. le moteur d'animation (GSAP au lieu de Motion) ;
  3. l'approche des styles (CSS natif au lieu de Tailwind) ;
  4. le modèle de composant (custom elements vanilla avec `AbortController` au lieu de composants React).
- **En plus** : une vingtaine de dépendances de développement (§7.1 de s1).
- **Biais de notation** : la note « Courbe d'apprentissage 4,5 » vaut pour un développeur TS quelconque, pas pour cet utilisateur.
- **Risque** : avec un brief « qualité irréprochable », chaque nouveauté est un risque d'exécution.
- **Ce qui reste** : c'est aussi un argument **pour** Astro. Le portfolio public montre déjà trois pièces React + Tailwind + Motion. VYRON en Astro + GSAP + CSS natif **montre une étendue**, et GSAP/ScrollTrigger est l'outil de référence des postes de « creative developer ». C'est un choix de carrière, pas un fait technique : il revient à l'utilisateur (question Q0, §9).

### A3. Périmètre gonflé : les sous-pages n'existent pas. **Moyen à fort**

- **Constat** : le shot est **une seule page**. Plusieurs éléments relèvent donc d'un périmètre spéculatif :
  - les « 2 à 4 sous-pages », l'i18n et le formulaire de contact ;
  - l'adaptateur `lifecycle.ts` entre MPA et ClientRouter ;
  - `@view-transition`, `pagereveal`, `prefetch` et les Speculation Rules.
- **Conséquences** : en one-page, **le principal avantage structurel invoqué pour Astro en MPA disparaît**. Il n'y a pas de routes, donc « aucun nettoyage inter-routes » ne compte plus. La moitié du §7.2 devient sans objet, et le critère « Transitions de page » (10 % de la matrice) ne départage plus rien.
- **Ce qui reste** : garder le contrat `mount(root) → dispose()`, qui coûte peu et prépare l'avenir. Le reste attend la réponse de l'utilisateur.

### A4. L'argument reduced-motion contre le ClientRouter est inexact. **Moyen**

- **Ce que dit s1** : le ClientRouter « coupe tout en `!important` ». s1 en fait un argument pour la MPA (§7.2 et §9).
- **Ce que dit la spec** : `::view-transition-group(*)` a une spécificité **nulle**. Une règle nommée (`::view-transition-group(root)`, `(hero)`, etc.) avec `!important` dans le CSS du site l'emporte.
- **Nuxt fait pareil** : il coupe aussi les transitions sous reduced motion, avec une échappatoire `'always'`.
- **Ce qui reste** : le choix entre MPA et ClientRouter doit porter uniquement sur deux questions :
  - (a) faut-il des transitions sous Firefox ?
  - (b) faut-il des sorties de page pilotées par GSAP ?

### A5. Les View Transitions cross-document ne livrent pas les transitions demandées. **Moyen** (seulement s'il y a des sous-pages)

- **Firefox** : aucune prise en charge, pas même en `preview` (BCD : `false`, MEASURED).
- **Pas de sortie GSAP** : la page qu'on quitte **ne peut pas jouer de timeline GSAP de sortie**. On peut seulement animer en CSS les pseudo-éléments `::view-transition-*`. L'événement `pageswap` permet tout au plus de poser des *types*.
- **Transitions chorégraphiées « à la Barba »** (rideau, sortie puis entrée) : elles exigent un routeur client. Trois options :
  - le ClientRouter d'Astro, en enveloppant `event.loader` dans `astro:before-preparation` (documenté, vérifié via Context7) ;
  - swup `4.10.0` (2026-09-03) avec `@swup/astro@1.8.0` ;
  - Nuxt, avec `<Transition>` et des hooks JS.
- **Barba est à écarter** : `@barba/core` n'a rien publié depuis le 2024-08-12.

### A6. Le déclencheur `pagereveal` est un piège. **Moyen**

- **Fonctionnement de l'événement** : `pagereveal` est émis **une fois**, « when the new Document is ready for its first rendering opportunity » (spec VT2). Il est émis **de nouveau** à chaque restauration depuis le bfcache ou le prerender (MDN).
- **Position des scripts Astro** : Astro les émet en `<script type="module">` en fin de `<body>` (MEASURED sur le build de s1). Ces modules sont différés.
- **Deux risques** (INFERRED, d'après la sémantique de la spec) :
  - l'écouteur peut s'enregistrer **après** le premier rendu : l'intro ne part alors qu'en repli ;
  - au retour arrière depuis le bfcache, l'intro **se rejoue** sur un contenu déjà animé.
- **Correctif** :
  - capturer l'événement dans un script `is:inline` **classique, dans le `<head>`** (donc bloquant le rendu), qui résout une promesse globale ;
  - le module attend cette promesse ;
  - ignorer les restaurations depuis le bfcache (`pageshow` avec `persisted`) ;
  - en one-page, ne pas utiliser `pagereveal` du tout : `document.fonts.ready` suivi de `requestAnimationFrame` suffit.

### A7. Astro change vite. **Moyen**

- **Rythme des versions majeures** (MEASURED) : 3.0 (2023-08-30), 4.0 (2023-12-05), 5.0 (2024-12-03), 6.0 (2026-03-10), puis **7.0 (2026-06-22), 104 jours après la 6.0**.
- **Valeurs par défaut cassantes en 7.0** : `compressHTML: 'jsx'`, compilateur Rust strict, Markdown Sätteri par défaut.
- **Le ClientRouter est encore corrigé en 7.x** :
  - 7.0.5 : le `<head>` était effacé avec `server:defer` ;
  - **7.2.1 : `<video>` et `<audio>` ne fonctionnaient plus après navigation**, ce qui touche directement la vidéo de la section Transformation ;
  - 7.3.3 : correctifs HMR.
- **Comparaison** : GSAP 3 est stable depuis le 2019-11-10, Vue 3.5 depuis le 2024-09-03, Nuxt 4 depuis le 2025-07-15, Next 16 depuis le 2025-10-22.
- **Ce qui reste** (contre-argument fort) : la **sortie statique ne dépend d'aucun framework**. Ces changements ne coûtent qu'au moment de reconstruire, et une pièce de portfolio vit des années sous forme de `dist/`. Les bugs du ClientRouter ne concernent pas une MPA sans ClientRouter.

### A8. Le coût DX attribué à Astro est en partie mal placé. **Faible**

- **Origine du verrou TS 6** : il vient de `typescript-eslint` (`<6.1.0`), présent dans tout setup React ou Vue sérieux. Seuls `@astrojs/check` (et `svelte-check`) ajoutent un plafond propre à leur écosystème ; `vue-tsc` accepte TS 7.
- **Contrainte d'`engines`** : `eslint-plugin-astro` impose **Node 24** partout, en local comme en CI. Le banc de s1 ne la respectait pas (Node 22.22.0).

### A9. Trop d'outillage et une vérité dupliquée. **Moyen**

- **Tokens en trois exemplaires** : `tokens.css`, `tokens.ts` et `DESIGN.md`, plus deux tests de parité. C'est **entretenir une duplication** au lieu de la supprimer. Il faut une source unique. Deux options :
  - le TS lit les custom properties au montage (`getComputedStyle`) ;
  - ou une source TS/JSON génère le CSS et le frontmatter.
  
  Si Impeccable exige les tokens dans `DESIGN.md` (commande `document`), il faut **générer** ce fichier, pas tester sa parité.
- **Lighthouse périmé** : LHCI 0.15.1 mesure avec Lighthouse 12.6.1 (MEASURED). Ses budgets ne correspondent donc pas à ce qu'affichent PageSpeed Insights et DevTools (Lighthouse 13). Il faut passer à `unlighthouse@0.19.0` en CI (Lighthouse `^13.5.0`) ou à `lighthouse@13.5.0` directement.
- **Ce qui reste** : l'exigence de méthode de l'utilisateur justifie la CI (lint, types, E2E, axe, test sans JS). Il faut couper la redondance, pas la rigueur.

### A10. L'island React « pour le signal » est contre-productive. **Moyen**

- **Ce que propose s1** (§5.3) : environ 67 Ko de React pour **un carrousel** que s1 construit lui-même sur `scroll-snap` natif.
- **Pourquoi c'est contre-productif** :
  - c'est ajouter une techno pour le CV, ce qui va contre Impeccable (« Do not add a dependency for an effect the existing stack can express cleanly ») ;
  - un recruteur qui lit l'ADR s'en apercevra ;
  - le portfolio public **montre déjà du React** (§4).

### A11. Lenis par défaut, face à Impeccable. **Faible à moyen**

- **Ce que dit Impeccable** (`animate`) : « Use scroll-driven motion only when the scroll relationship itself carries meaning » et « Prefer one rehearsed focal sequence to repeated section reveals ».
- **Ce qu'est Lenis** : une dépendance de goût (5,3 Ko), avec des limites connues (Safari à 60 fps, iframes, scroll-snap). ScrollTrigger n'en a pas besoin.
- **Ce qui reste** : s1 en fait déjà une décision de l'utilisateur, ce qui est correct. Il l'a adopté dans `car-clean`, donc la réponse sera probablement « oui ».

### A12. Signal envoyé aux recruteurs. **Moyen**, INFERRED

- **Côté React** : React domine l'usage (React 46,9 %, Next.js 21,5 %, Vue 18,4 % selon une source secondaire sur l'enquête Stack Overflow 2025). La part absolue d'Astro est faible.
- **Côté créatif** : sur ces postes, la **maîtrise de GSAP/ScrollTrigger et du craft** compte plus que le méta-framework.
- **Bilan** : à peu près neutre, avec un léger avantage à React pour les postes « produit ».

### A13. Pièges d'hydratation si l'on ajoute des islands. **Moyen**, seulement dans ce cas

- **Le choix « aucun island » de s1 est une force** : il évite tous ces pièges.
- **Les pièges** (doc Astro, vérifiée via Context7) :
  - pas d'état partagé entre islands sans Nano Stores ;
  - `client:visible` hydrate tard : ScrollTrigger et SplitText peuvent viser des nœuds que le framework va ensuite réconcilier ;
  - sous ClientRouter, les islands sont remontées à chaque navigation, sauf avec `transition:persist`.
- **Le revers** : sans islands, l'utilisateur écrit du **DOM impératif**. Pour un profil React, c'est un changement de façon de penser.

---

## 6. Défense de la meilleure alternative

### 6.1 L'alternative B′

**B′ = Vite 8 + React 19.3 + TypeScript 6.0 + GSAP 3.15 (`useGSAP`) + Lenis 1.3 (`lenis/react`) + Tailwind 4.3, avec prérendu statique.**

**Pourquoi B′ plutôt que Next.js ou Nuxt** : c'est la stack que l'utilisateur pratique pour **cette catégorie exacte** de site (`car-clean`), avec un seul changement : **Motion remplacé par GSAP**. L'apprentissage se concentre là où il rapporte : pin, SplitText masqué, timelines.

**Forces**

- L'utilisateur est à l'aise avec cette stack : une qualité élevée est plus atteignable.
- Un modèle de composant déclaratif pour les quatre widgets (menu, accordéon, carrousel, marquee).
- La réutilisation de briques déjà éprouvées (`car-clean/src/v2/lib/smooth-scroll.ts`, `use-reduced-motion.ts`).
- Le signal React.
- Tailwind 4.3, déjà maîtrisé.

**Faiblesses (MEASURED ou INFERRED)**

- **116,7 Ko gzip** contre 55,9 Ko : le budget de 75 Ko est dépassé.
- Le **prérendu** est obligatoire pour ne pas livrer un HTML vide. Le mode framework de React Router avec `prerender` serait la voie naturelle (non testé, INFERRED).
- SplitText modifie un DOM que React possède : il faut annuler le découpage (revert) dans le nettoyage de `useGSAP`.
- En dev, StrictMode exécute les effets deux fois (`useGSAP` le gère).
- `@gsap/react` n'est pas sous licence MIT.

### 6.2 Sensibilité de la matrice

Notes INFERRED, avec les poids de s1 sauf mention contraire.

**Notes attribuées à B′**

| Critère | Note | Justification |
|---|---|---|
| Performance | 2,5 | 66 Ko seul, 117 Ko avec la stack ; rendu client sans prérendu |
| Cycle de vie | 4 | one-page, `useGSAP` |
| Clarté | 3,5 | — |
| DX | 4,5 | — |
| Transitions | 4,5 | sans objet en one-page |
| Écosystème | 5 | — |
| Recruteurs | 5 | — |
| Apprentissage | 5 | stack déjà maîtrisée |

**Scores par scénario**

| Scénario | A : Astro | B′ : Vite + React | C : Nuxt |
|---|---|---|---|
| **S0** : matrice de s1 telle quelle (Next.js à la place de B′) | **4,40** | 3,65 (Next) | 3,90 |
| **S1** : mêmes poids ; B′ remplace Next ; apprentissage noté **pour cet utilisateur** (Astro 3, React 5, Nuxt 4) | **4,25** | 4,03 | 3,90 |
| **S2** : S1 avec performance à 10 % et apprentissage à 20 % (priorité : livrer vite et bien dans une stack maîtrisée) | 4,05 | **4,28** | 3,95 |

**Lecture** : le classement **résiste aux corrections factuelles** (S1). Il **ne s'inverse que si l'utilisateur fait passer la vitesse d'exécution dans sa stack avant la performance et l'élargissement de son profil** (S2). Ce n'est pas une question technique : c'est la question Q0 du §9.

### 6.3 Quand Nuxt devient la meilleure alternative

Nuxt passe devant si trois conditions sont réunies :

1. il y a des **sous-pages** ;
2. les transitions doivent être **chorégraphiées en GSAP dans tous les navigateurs** ;
3. l'utilisateur **préfère les composants Vue en fichier unique (SFC)**.

La mise en œuvre serait : `<Transition :css="false" @leave @enter>`, des hooks GSAP, `lenis/vue` et `nuxt generate`. Le poids est d'environ 100 Ko gzip (ESTIMATED : 49,3 Ko de Nuxt + 50,8 Ko de stack). C'est le modèle le plus pratique pour enchaîner sortie, changement de route puis entrée.

**Attention** : les modules GSAP communautaires pour Nuxt sont à l'abandon (`nuxt-gsap-module` en 2023, `@hypernym/nuxt-gsap` en 2024-08). Un composable maison est préférable.

---

## 7. Verdict final : AMEND

### 7.1 Amendements précis

1. **Matrice comparative**
   - Remplacer la candidate « B : Next.js » par « **B′ : Vite + React (prérendu)** », avec les mesures du §3.
   - Ajouter une ligne « Vue SPA » (23,0 Ko seul, 73,4 Ko avec la stack).
   - Noter l'apprentissage **pour cet utilisateur**, et publier la table de sensibilité S0 / S1 / S2.
   - Ne garder Next.js que pour la branche « intégré à un portfolio Next existant ».
2. **Périmètre par défaut : one-page** (`src/pages/index.astro` et `404.astro`).
   - Retirer de la v1 : l'adaptateur MPA / ClientRouter, `@view-transition`, `pagereveal`, les Speculation Rules, l'i18n et l'endpoint de contact.
   - **Garder** le contrat d'effet `mount(scope, env) → dispose()` et le registre `data-motion`.
3. **Corriger les §3.1, §7.2 et §9 de s1** : sous ClientRouter, le reduced motion peut être surchargé (spécificité nulle de `*`). Retirer cet argument du choix MPA, qui se décide uniquement sur (a) Firefox et (b) les sorties GSAP.
4. **Si l'utilisateur veut des sous-pages avec des transitions chorégraphiées** : utiliser le ClientRouter, avec `astro` 7.3.5 (au moins 7.2.1 pour le correctif `<video>`).
   - Dans `astro:before-preparation` : envelopper `event.loader` pour attendre la fin de la timeline de sortie.
   - Dans `astro:before-swap` : appeler `dispose()` et `lenis.destroy()`.
   - Dans `astro:page-load` : monter les effets, créer un **nouveau** Lenis, puis appeler `ScrollTrigger.refresh()`.
   - Ne **pas** essayer de recopier les classes `lenis*` : recréer l'instance est plus simple et plus sûr.
   - Garder la MPA avec `@view-transition` seulement si l'utilisateur accepte des transitions **en CSS seul, absentes sous Firefox**.
5. **Démarrage de l'intro**
   - En one-page : remplacer « GSAP sur `pagereveal` depuis `main.ts` » par `document.fonts.ready` suivi d'un `requestAnimationFrame`.
   - En multi-page : capturer `pagereveal` dans un script `is:inline` du `<head>`, et ne pas rejouer l'intro au retour du bfcache (`pageshow.persisted`).
6. **Outillage**
   - Remplacer `@lhci/cli@0.15.1` (qui mesure avec Lighthouse 12.6.1) par `unlighthouse@0.19.0` en mode CI, ou par `lighthouse@13.5.0`.
   - Imposer Node **24.21.0** via `.nvmrc` et `engines`, car `eslint-plugin-astro@3.2.1` refuse les Node antérieurs à 22.22.3.
7. **Tokens** : une **source unique**, sans tests de parité TS ↔ CSS ↔ `DESIGN.md`. Les dérivés sont générés : CustomEase et durées lus depuis les custom properties au montage, ou CSS et frontmatter générés depuis une source TS/JSON.
8. **Supprimer** la variante « island React pour le signal » (§5.3 de s1).
9. **Styles**
   - Présenter Tailwind 4.3 comme la **norme habituelle de l'utilisateur**, et non comme un « signal marché ».
   - Garder le CSS natif comme recommandation pour cette pièce, en assumant que c'est un choix de démonstration qui ralentit l'écriture.
   - La décision revient à l'utilisateur.
10. **Corrections mineures**
    - Speculation Rules dans Safari 26.2 : derrière un flag.
    - `transition-behavior` : Baseline *newly* depuis le 2024-08-06.
    - `motion-v` : dépendance en plage `^13.3.0`.
    - ScrollSmoother : le scroll reste natif sur `<body>` ; seul un élément `fixed` placé dans le wrapper pose problème.
    - Le verrou TS 6 n'est pas propre à Astro.
11. **ADR 0001** : nommer explicitement l'alternative écartée (« ma stack habituelle Vite + React + Tailwind + Motion + Lenis »), avec ses chiffres (116,7 contre 55,9 Ko) et la raison du choix (élargir le profil, tenir le budget). C'est l'ADR le plus parlant pour un recruteur.

### 7.2 Justification

Toutes les versions, dates, licences et données de compatibilité de s1 se vérifient. Le choix d'Astro statique avec GSAP repose sur un avantage réel et mesuré :

- **0 Ko de framework**, contre 22,6 Ko pour Vue et 65,9 Ko pour React au-dessus du vanilla ;
- un HTML complet sans hydratation ;
- un profil de site éditorial, avec 4 widgets et aucun état partagé : le cas d'école d'Astro.

Astro reste en tête même après deux corrections : en comparant à Vite + React plutôt qu'à Next.js, et en notant l'apprentissage pour cet utilisateur (S1 : 4,25 contre 4,03).

La recommandation a toutefois six faiblesses :

- une architecture surdimensionnée pour des sous-pages hypothétiques ;
- un choix MPA fondé sur un argument faux ;
- un déclencheur d'intro fragile ;
- des tokens dupliqués ;
- des budgets mesurés avec un Lighthouse périmé ;
- l'oubli de la stack que l'utilisateur maîtrise déjà pour ce type de site.

La remplacer ne serait pas justifié. L'amender rend la décision honnête. Le seul vrai point de bascule est l'objectif de l'utilisateur, diversifier ou capitaliser, et il faut le lui poser explicitement.

---

## 8. Arbre de décision

### Question préalable Q0 : diversifier ou capitaliser ?

- **Diversifier** (montrer GSAP, une approche « plateforme » et la performance) : famille **Astro**.
- **Capitaliser** (livrer au plus haut niveau dans une stack maîtrisée) : famille **Vite + React** (B′).

### Q1 × Q2

Q1 : site autonome ou intégré à un portfolio existant ? Q2 : one-page ou sous-pages avec transitions ?

| | **Q2 = one-page** (cas du shot) | **Q2 = sous-pages avec transitions** |
|---|---|---|
| **Q1 = site autonome** (URL ou sous-domaine propre, lié depuis le portfolio). Recommandé dans tous les cas | **Astro 7.3.5 statique**, une seule page : GSAP 3.15, Lenis 1.3 (optionnel), CSS natif, custom elements, aucun routeur. JS d'environ 51 Ko gzip plus le code applicatif (MEASURED : 50,8 Ko pour la stack vanilla). *Si Q0 = capitaliser* : **B′** (Vite + React + `useGSAP` + `lenis/react` + Tailwind 4.3, prérendu ; 116,7 Ko) | **Transitions en CSS seul, navigation instantanée sous Firefox acceptée** : Astro en MPA + `@view-transition` (0 Ko de routeur). **Transitions GSAP (sortie et entrée) dans tous les navigateurs** : Astro + `<ClientRouter />` (adaptateur de l'amendement 4), ou swup 4.10 + `@swup/astro`. **Si l'utilisateur préfère les SFC Vue** : Nuxt 4.5 (`<Transition :css="false">` + GSAP, `nuxt generate`, environ 100 Ko ESTIMATED) |
| **Q1 = intégré à un portfolio React** (Next ou Vite) | Une route du portfolio, dont les sections sont des composants React. `useGSAP` avec `scope`, et `lenis/react` monté **au niveau de la route** puis détruit à la sortie. `ScrollTrigger.refresh()` à l'entrée. Sous Next, `'use client'` sur les composants feuilles seulement. **Un seul moteur** : ne pas mélanger sur la même page Motion (déjà présent chez l'utilisateur) et GSAP | Comme en one-page, avec en plus des transitions via `<ViewTransition>` de React 19.3 (same-document, donc Firefox 144+ inclus) ou des timelines GSAP orchestrées par le routeur. Détruire tous les ScrollTriggers de la route avant le changement de page (`context.revert()`) |
| **Q1 = intégré à un portfolio Vue/Nuxt** | Une page, ou un **layer Nuxt** (`layers/vyron`) pour isoler la pièce. Composable `useGsapContext` (`gsap.context` dans `onMounted`, `revert` dans `onBeforeUnmount`), `lenis/vue` | `<Transition>` de Nuxt avec des hooks GSAP. `app.viewTransition` désactivé, ou réglé sur `'always'` en gérant soi-même le reduced motion (sinon le plugin coupe les transitions, MEASURED) |
| **Q1 = intégré à un portfolio Astro** | Une page Astro, avec la même recommandation qu'en autonome | ClientRouter, avec l'adaptateur de l'amendement 4 |

**Règle générale (INFERRED)** : même si le portfolio est en React ou en Vue, **mieux vaut déployer VYRON à part**, par exemple sur un sous-domaine. Lenis sur `<html>`, des ScrollTriggers globaux, des polices et des tokens propres entrent en conflit avec l'application qui les héberge. On ne l'intègre que si le portfolio est conçu pour héberger des études de cas comme routes vivantes.

---

## 9. Questions à poser à l'utilisateur

- **Q0. Objectif** : cette pièce doit-elle **élargir** votre profil (Astro + GSAP + CSS natif, tout ce qui manque à vos dépôts publics) ? Ou **capitaliser** sur votre stack Vite + React + Tailwind + Lenis, en remplaçant seulement Motion par GSAP ?
- **Q1. Hébergement** : site autonome lié depuis votre portfolio, ou route intégrée au portfolio ? Dans le second cas, quelle est la stack du portfolio ? Les dépôts `clement-bilger` et `portfolio-3d` sont privés et n'ont pas été inspectés.
- **Q2. Pages** : une seule page comme dans le shot, ou des sous-pages ? S'il y a des sous-pages, les transitions doivent-elles être chorégraphiées (sortie puis entrée) et fonctionner aussi sous Firefox ?
- **Q3. Styles** : Tailwind 4.3, votre habitude actuelle, ou CSS natif avec tokens, plus démonstratif mais plus lent à écrire ?
- **Q4. Lenis** : oui, comme dans `car-clean`, ou défilement natif ? Impeccable ne le justifie que si le défilement lissé sert le propos de l'animation.

---

## 10. Sources

**Registre npm** (MEASURED, 2026-10-02) :
https://registry.npmjs.org/astro · /next · /react · /nuxt · /vue · /gsap · /lenis · /motion · /motion-v · /typescript · /typescript-eslint · /@astrojs/check · /eslint-plugin-astro · /eslint-plugin-jsx-a11y-x · /@lhci/cli · /lighthouse · /@unlighthouse/core · /@gsap/react · /vue-tsc · /@nuxt/eslint-config · /swup · /@swup/astro · /@barba/core · /gsap-trial · /@astrojs/vue · /@astrojs/react

**Tarballs inspectés**

- `astro@7.3.5` : `components/viewtransitions.css`, `components/ClientRouter.astro`, `dist/transitions/swap-functions.js`, `dist/core/config/schemas/{base,defaults}.js`
- `lenis@1.3.26` : `dist/lenis.mjs`, `dist/lenis.css`, `README.md`
- `gsap@3.15.0` : `package.json`, `README.md`, `types/split-text.d.ts`
- `nuxt@4.5.2` : `dist/app/plugins/view-transitions.client.js`
- `@nuxt/schema@4.5.2` : `dist/index.d.mts`
- `next@16.3.8` : `dist/docs/01-app/02-guides/view-transitions.md`

**CHANGELOG**

- Astro 7.x : https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md
- Astro 6.x : https://github.com/withastro/astro/blob/astro%406.4.8/packages/astro/CHANGELOG.md
- React : https://github.com/facebook/react/blob/main/CHANGELOG.md
- Motion : https://github.com/motiondivision/motion/blob/main/CHANGELOG.md
- Biome : https://github.com/biomejs/biome/blob/main/packages/%40biomejs/biome/CHANGELOG.md

**Spécifications et compatibilité**

- CSS View Transitions 1 (spécificité de `*`) : https://github.com/w3c/csswg-drafts/blob/main/css-view-transitions-1/Overview.bs
- CSS View Transitions 2 (`pagereveal`, render-blocking) : https://github.com/w3c/csswg-drafts/blob/main/css-view-transitions-2/Overview.bs
- MDN `pagereveal` : https://github.com/mdn/content/blob/main/files/en-us/web/api/window/pagereveal_event/index.md
- MDN BCD 8.1.4 : https://github.com/mdn/browser-compat-data
- web-features 3.40.1 : https://github.com/web-platform-dx/web-features

**Documentation (via Context7 et MCP)**

- Astro ClientRouter, `event.loader`, `transition:persist`, Nano Stores :
  - https://docs.astro.build/en/guides/view-transitions/
  - https://docs.astro.build/en/reference/modules/astro-transitions/
  - https://docs.astro.build/en/recipes/sharing-state-islands/
- GSAP ScrollSmoother : https://gsap.com/docs/v3/Plugins/ScrollSmoother
- Cloudflare : https://developers.cloudflare.com/workers/best-practices/workers-best-practices/

**Node** : https://nodejs.org/dist/index.json

**Sources secondaires (INFERRED)**

- Rachat d'Astro par Cloudflare :
  - https://roboin.io/article/en/2026/01/17/cloudflare-acquires-astro-web-framework/
  - https://alternativeto.net/news/2026/1/cloudflare-acquires-astro-team-keeps-it-open-source-with-multiple-deployment-targets
- Enquête Stack Overflow 2025 : https://enstacked.com/stack-overflow-developer-survey-insights/

**Contexte utilisateur (dépôts publics)**

- https://github.com/CB-Info/car-clean
- https://github.com/CB-Info/games-party
- https://github.com/CB-Info/petankup
- https://github.com/CB-Info/pfe-web

**Méthode Impeccable** (lue localement) :

- `reference/animate.md` (« Implement to the runtime », reduced motion, Persuade)
- `reference/craft-floor.md`
- `reference/mode-persuade.md`

**Fichiers de travail**, dans `/tmp/claude-0/-home-user-sp-001/d6f1d911-3169-5742-95d2-98e77696e619/scratchpad/work/v3-stack-adversary/` :

- `bench/` : builds Vite et `build.mjs` ;
- `pkgs/` : tarballs ;
- `bcd/` : BCD et web-features ;
- `userrepos/` : clones superficiels des dépôts publics ;
- ainsi que les CHANGELOG et spécifications téléchargés.

