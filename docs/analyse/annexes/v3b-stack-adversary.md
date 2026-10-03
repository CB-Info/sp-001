> **Annexe brute** : seconde revue adverse de la stack (`v3b`), produite indépendamment de `v3` lors de la reprise du workflow (2026-10-02/03). Les chemins `/tmp/…` renvoient au scratchpad de la session d’analyse et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

# VYRON — Contre-expertise de la recommandation de stack (`v3-stack-adversary`)

> Rôle : relecteur adversarial du rapport `s1-stack`. Posture par défaut : sceptique.
> Données contrôlées le **2026-10-02** (≈ 23:35 UTC). Aucune ligne du site n'a été écrite.
> Artefacts jetables dans `scratchpad/work/v3-stack-adversary/` : tarballs npm extraits (`pkgs/x/`), CHANGELOG frais (`*.fresh.md`), specs CSS (`vt1.fresh.bs`, `cascade5.bs`), banc Vite (`bench/`).

---

## 0. Verdict en bref

**AMEND.** Astro statique + GSAP reste le bon couple pour une landing page éditoriale très animée. Les faits techniques de s1 sont, à de rares exceptions près, exacts : **55 affirmations contrôlées, 40 vérifiées, 5 reproduites ou corroborées, 5 partielles, 2 fausses, 3 invérifiables**.

En revanche, quatre choix de s1 ne tiennent pas en l'état :

1. **MPA + View Transitions cross-document par défaut.** C'est le maillon faible pour un brief qui demande explicitement des « transitions » :
   - aucune transition sous Firefox ;
   - aucune chorégraphie GSAP possible entre deux pages ;
   - aucun élément persistant ;
   - un **bug de cycle de vie non vu** : `pagereveal` rejoue au retour bfcache.
2. **La matrice ignore l'utilisateur réel.** Les dépôts de l'utilisateur montrent React, Nuxt, Tailwind, Motion, Lenis et Vercel, et aucun Astro ni GSAP. Une fois ce critère ajouté, les écarts tombent à ≤ 0,2 point : c'est du bruit de pondération.
3. **Sur-outillage.** Le rapport prévoit 13 outils qualité, des tokens recopiés en trois exemplaires et des tests de parité entre eux, pour une seule page.
4. **Deux erreurs factuelles et plusieurs nuances** (§2), dont une qui pénalise Astro à tort (le verrou TypeScript ≤ 6 touche les trois stacks).

**Meilleure alternative : Nuxt 4.5 en `nuxt generate`.** Elle l'emporte si l'utilisateur veut des sous-pages avec une chorégraphie GSAP entre elles, ou s'il intègre VYRON dans un portfolio Vue/Nuxt. Le choix final doit sortir de l'arbre de décision (§6), pas du score.

---

## 1. Méthode et légende

**Verdicts du fact-check**

| Verdict | Sens |
|---|---|
| VÉRIFIÉ | Lu par moi dans une source primaire : registre npm, code des tarballs, CHANGELOG brut, spec, données BCD ou web-features |
| REPRODUIT | Recalculé par moi à partir des mêmes artefacts |
| CORROBORÉ | Confirmé par ma propre mesure ou par plusieurs sources secondaires concordantes |
| PARTIEL | Fait exact, mais conclusion ou détail inexact |
| FAUX | Contredit par une source primaire |
| NON VÉRIFIABLE | Source primaire inaccessible et rien de concordant |

Les valeurs chiffrées gardent la légende commune **MEASURED / ESTIMATED / INFERRED**.

**Accès réseau.** Le proxy bloque `gsap.com`, `astro.build`, `docs.astro.build`, `motion.dev`, `nuxt.com`, `nextjs.org`, `developer.mozilla.org`, `bugzilla.mozilla.org` et `scancode-licensedb`. Il laisse passer `registry.npmjs.org`, `raw.githubusercontent.com` et `nodejs.org`, ainsi que la doc Cloudflare (MCP), Context7 (`/withastro/docs`, `/websites/nuxt_4_x`) et WebSearch. Les fichiers des paquets sont cités par leur URL `unpkg.com`, dont le contenu est identique au tarball que j'ai lu.

**Mesures visuelles.** Ma lentille n'en contient aucune. La consigne « px mesurés / normalisés à 1440 » et le facteur d'échelle sont **sans objet** ici. Je garde les bornes 375 / 1440 px de s1 pour les `clamp()`.

**Contexte utilisateur.** Les `package.json` de quatre dépôts de l'utilisateur (organisation GitHub `CB-Info`) étaient déjà clonés dans mon dossier scratch par une exécution précédente. J'en ai lu **uniquement les dépendances et la date du dernier commit**. Je ne suis pas allé plus loin : une exploration supplémentaire a été refusée par le contrôle des permissions, et elle n'était pas nécessaire.

---

## 2. Fact-check

### 2.1 Versions, dates, dépendances (registre npm, 2026-10-02)

| # | Affirmation de s1 | Verdict | Constat | Source |
|---|---|---|---|---|
| 1 | `astro@7.3.5` latest (2026-09-24) ; beta 7.4.0-beta.1 ; 7.0.0 le 2026-06-22 ; 6.0.0 le 2026-03-10 ; 5.0.0 le 2024-12-03 | VÉRIFIÉ | Identique | https://registry.npmjs.org/astro |
| 2 | Astro : MIT, `node >=22.12.0`, `vite ^8.0.13`, `esbuild ^0.28` | VÉRIFIÉ | **Ajout** : dépend de `@astrojs/compiler-rs ^0.5.0`. La version 0.5.1 a été publiée pour la première fois le 2026-02-19 : le compilateur par défaut est encore en 0.x | https://registry.npmjs.org/@astrojs/compiler-rs |
| 3 | `next@16.3.8` ; 16.3.0 le 2026-08-03 ; 16.0.0 le 2025-10-22 ; canary 16.4.0-canary.57 | VÉRIFIÉ | — | https://registry.npmjs.org/next |
| 4 | `react@19.3.0` (2026-09-09) : `<ViewTransition />`, `addTransitionType`, Fragment refs et `browser()` stables | VÉRIFIÉ | **Nuance** : la doc embarquée dans Next 16.3.8 précise que l'App Router utilise *sa* canary React vendorisée, pas le `react@19.3.0` installé | https://raw.githubusercontent.com/facebook/react/main/CHANGELOG.md · https://unpkg.com/next@16.3.8/dist/docs/01-app/02-guides/view-transitions.md |
| 5 | `nuxt@4.5.2` ; 4.5.0 le 2026-07-18 ; `3x` = 3.21.11 ; engines `^22.19.0 \|\| ^24.11.0 \|\| >=26.0.0` | VÉRIFIÉ | 4.5.2 publié le 2026-08-05 | https://registry.npmjs.org/nuxt |
| 6 | « Nuxt 5 est en cours de stabilisation » | NON VÉRIFIABLE | Aucune version 5.x, même en pré-version, sur npm | idem |
| 7 | `vue@3.5.43` ; Vapor = `3.6.0-rc.10` (non stable) | VÉRIFIÉ | rc.10 publiée le 2026-09-30 | https://registry.npmjs.org/vue |
| 8 | `gsap@3.15.0` (2026-04-13) ; 3.14.0 (2025-12-08) ; 3.13.0 (2025-04-30) | VÉRIFIÉ | — | https://registry.npmjs.org/gsap |
| 9 | `motion@14.0.0` publié le 2026-10-02 ; 13.0.0 le 2026-08-05 ; `AnimateView` en 13.4 | VÉRIFIÉ | 14.0.0 publié à 13:15 UTC. **Deux majeures en 58 jours** | https://raw.githubusercontent.com/motiondivision/motion/main/CHANGELOG.md |
| 10 | `motion-v@2.5.2` « dépend encore de `framer-motion@13.5.1` », donc « en retard sur Motion 14 » | PARTIEL | Le paquet déclare `framer-motion ^13.3.0`, résolu aujourd'hui en 13.5.1. Mais 2.5.2 est sorti le 2026-10-02 à 16:45 UTC, **3 h 30 après Motion 14**. Ce « retard » ne dit rien de la maintenance | https://registry.npmjs.org/motion-v |
| 11 | `lenis@1.3.26` (2026-08-05) ; `2.0.0-dev.5` (2026-09-18) ; exports `vue`, `nuxt`, `react`, `snap` | VÉRIFIÉ | — | https://registry.npmjs.org/lenis |
| 12 | `tailwindcss@4.3.3` ; 4.3.0 le 2026-05-08 ; 4.2.0 le 2026-02-18 | VÉRIFIÉ | — | https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/CHANGELOG.md |
| 13 | TypeScript latest = 7.0.2 ; `typescript-eslint@8.71` exige `<6.1.0` ; `@astrojs/check@0.9.10` exige `^5 \|\| ^6` ; donc épingler `~6.0.3` | VÉRIFIÉ | **Ajouts décisifs** : `typescript@7.0.2` n'a **aucun champ `main`**, donc pas d'API JS. La canary `typescript-eslint@8.71.1-alpha.6` garde `<6.1.0`. `eslint-config-next@16.3.8` dépend de `typescript-eslint ^8.46`. Le verrou touche **les trois stacks**, pas seulement Astro | https://registry.npmjs.org/typescript · https://registry.npmjs.org/typescript-eslint · https://registry.npmjs.org/eslint-config-next |
| 14 | ESLint 10.12.0 ; 10.0.0 le 2026-02-06 ; maintenance 9.39.5 | VÉRIFIÉ | 10.12.0 publié le 2026-10-02 à 20:08 UTC | https://registry.npmjs.org/eslint |
| 15 | `eslint-plugin-jsx-a11y@6.10.2` limité à ESLint ≤ 9 ; le fork `-x@0.2.0` est pris en charge par `eslint-plugin-astro@3.2.1` | VÉRIFIÉ | Peer optionnel `eslint-plugin-jsx-a11y-x >=0.2.0`. **Ajout** : `eslint-plugin-astro` exige Node `^22.22.3 \|\| ^24.16.0 \|\| >=26.3.0`. Le Node 22.22.0 du banc de s1 ne le satisfait pas : sans effet sur ses mesures, mais la CI doit tourner en Node 24 | https://registry.npmjs.org/eslint-plugin-astro |
| 16 | Biome 2.5.15 ; templates Astro derrière `html.experimentalFullSupportEnabled` | VÉRIFIÉ | — | https://raw.githubusercontent.com/biomejs/biome/main/packages/%40biomejs/biome/CHANGELOG.md |
| 17 | Le reste de l'outillage (liste ci-dessous) | VÉRIFIÉ (22/22) | Toutes les versions concordent | npm |
| 18 | `@lhci/cli@0.15.1`, dernière publication le 2025-06-25 | VÉRIFIÉ | — | https://registry.npmjs.org/@lhci/cli |
| 19 | Node 24.21.0 LTS « Krypton » ; 26.x non LTS ; 22.x LTS « Jod » | VÉRIFIÉ | 24.21.0 du 2026-09-07 ; 26.10.0 non LTS ; 22.23.3 « Jod » | https://nodejs.org/dist/index.json |

Liste de la ligne 17 :

- Prettier 3.9.9 et `prettier-plugin-astro` 1.1.0 ;
- Stylelint 17.16.0, avec `stylelint-config-standard` 40.0.0, `stylelint-config-html` 2.0.0, `postcss-html` 2.0.0 et `stylelint-config-recess-order` 7.8.0 ;
- Vite 8.3.2, Vitest 5.0.3, Playwright 1.63.0, `@axe-core/playwright` 4.13.0 ;
- knip 6.39.0, lefthook 2.1.16, commitlint 21.2.3, pnpm 12.8.1, wrangler 4.147.0 ;
- three 0.186.1, ogl 1.0.11, embla 8.6.0 ;
- `@gsap/react` 2.1.2, `@astrojs/react` 7.0.0, `@astrojs/sitemap` 3.7.4, `@astrojs/netlify` 8.2.6 ;
- unlighthouse 0.19.0.

### 2.2 Licences

| # | Affirmation de s1 | Verdict | Constat | Source |
|---|---|---|---|---|
| 20 | GSAP : `license` = « Standard 'no charge' license » ; le README dit « 100% FREE … even for commercial use » | VÉRIFIÉ | — | https://unpkg.com/gsap@3.15.0/README.md |
| 21 | « Prohibited Uses » : outil d'animation visuelle sans code concurrent de Webflow, rétro-ingénierie, retrait des mentions ; licence non OSI | VÉRIFIÉ | Texte intégral lu, classé « Proprietary Free ». Les « Permitted Uses » couvrent explicitement « any website, web application, or digital interface ». **Aucun risque pour un portfolio** | https://raw.githubusercontent.com/aboutcode-org/scancode-toolkit/develop/src/licensedcode/data/licenses/gsap-standard-no-charge-2025.LICENSE |
| 22 | Tous les plugins sont dans le tarball public (ScrollSmoother, SplitText, MorphSVG…) | VÉRIFIÉ | 22 fichiers de plugins présents | https://unpkg.com/browse/gsap@3.15.0/ |
| 23 | Motion sous MIT ; Motion+ payant (`splitText`…) | PARTIEL | MIT vérifié. Le statut de Motion+ n'est pas vérifiable : `motion.dev` est bloqué | https://registry.npmjs.org/motion |

### 2.3 Comportements lus dans le code

| # | Affirmation de s1 | Verdict | Constat | Source |
|---|---|---|---|---|
| 24 | ClientRouter : `@media (prefers-reduced-motion) { … animation: none !important }`, donc « toute animation saute, y compris un simple fondu » | PARTIEL | **Le CSS existe**, et il couvre aussi `[data-astro-transition-scope]`. Mais il est **hors `@layer`**. Or, selon CSS Cascade 5, pour les déclarations `!important`, « the declaration whose cascade layer is **earliest** wins », et le hors-couche est la couche implicite finale. **N'importe quel `!important` placé dans un `@layer` l'emporte donc.** De plus, `::view-transition-old(root)` a la spécificité d'un sélecteur de type, alors que `(*)` a une spécificité nulle. Garder un fondu en reduced motion tient en une règle | https://unpkg.com/astro@7.3.5/components/viewtransitions.css · https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-cascade-5/Overview.bs · https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-view-transitions-1/Overview.bs |
| 25 | `swapRootAttributes()` efface tous les attributs de `<html>` | VÉRIFIÉ | **Et cela casse aussi le contrat de s1** : la classe `html.has-motion`, posée par un script inline du `<head>` (§7.2 de s1), disparaît au premier swap, pas seulement `lenis*`. Le défaut est contournable proprement avec `event.swap` et `swapFunctions`, documentés depuis Astro 4.15 | https://unpkg.com/astro@7.3.5/dist/transitions/swap-functions.js · https://docs.astro.build/en/guides/view-transitions/ |
| 26 | `compressHTML: 'jsx'` par défaut en 7.0 | VÉRIFIÉ | Lu dans `schemas/defaults.js` et dans le CHANGELOG 7.0.0 | https://unpkg.com/astro@7.3.5/dist/core/config/schemas/defaults.js |
| 27 | Compilateur Rust par défaut, compilateur Go supprimé, comportement plus strict | VÉRIFIÉ | — | https://raw.githubusercontent.com/withastro/astro/main/packages/astro/CHANGELOG.md |
| 28 | `<ViewTransitions />` et `handleForms` supprimés en 6.0 ; exports dépréciés retirés en 7.0 | VÉRIFIÉ | — | CHANGELOG 6.x (tag `astro@6.4.8`) et 7.x |
| 29 | Fonts API stable en 6.0 (avec le provider `npm`) ; `subset` en 7.0 ; CSP stable en 6.0 ; directives CSP par élément en 7.1 ; réglages Sharp par codec en 6.1 | VÉRIFIÉ | La ligne 6.1, marquée INFERRED par s1, est en fait vérifiable (PR #15804) | idem |
| 30 | Flags expérimentaux de 7.3.5 (`clientPrerender`, …) ; preset `tsconfigs/strictest` | VÉRIFIÉ | — | https://unpkg.com/astro@7.3.5/dist/core/config/schemas/base.js |
| 31 | Lenis : options, `respectReducedMotion = true` par défaut, contenu de `lenis.css`, limites du README | VÉRIFIÉ | **Précision** : la règle `overflow: clip` porte sur le sélecteur `.lenis:not(.lenis-autoToggle).lenis-stopped`. Elle dépend donc des classes de `<html>`, ce qui la rend vulnérable au point #25 | https://unpkg.com/lenis@1.3.26/dist/lenis.css · https://unpkg.com/lenis@1.3.26/dist/lenis.mjs |
| 32 | Nuxt : `viewTransition` vaut `enabled: boolean \| 'always'`, avec `types` | VÉRIFIÉ | **Omission importante** : dans le plugin, `true` saute la transition si `prefers-reduced-motion: reduce`, alors que `'always'` la conserve. L'auteur garde donc la main sur un fondu réduit. La stack C n'a pas le défaut reproché à ClientRouter | https://unpkg.com/nuxt@4.5.2/dist/app/plugins/view-transitions.client.js |
| 33 | Next : « View transitions work in the App Router with no configuration » | VÉRIFIÉ | Voir #4 | unpkg (doc Next) |
| 34 | MPA : « chaque navigation repart d'une page neuve : **aucun nettoyage inter-routes à écrire** » ; montage sur `pagereveal` | FAUX (en partie) | MDN : `pagereveal` est émis aussi lors d'une restauration **depuis le bfcache** et d'une activation **prerender** (détail ci-dessous) | https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/window/pagereveal_event/index.md |

Détail de la ligne 34 :

- Sur un « retour arrière », la page revient avec ses ScrollTriggers, son instance Lenis et un DOM déjà découpé par SplitText.
- `pagereveal` relance alors le montage. Résultat : double initialisation et split imbriqué, si le montage n'est pas idempotent.
- Sous Firefox, le repli sur `DOMContentLoaded` **ne** se relance **pas**. Il y a donc deux comportements à tester.

### 2.4 Navigateurs (MDN BCD 8.1.4 du 2026-10-01T10:12Z ; web-features 3.40.1)

| # | Affirmation de s1 | Verdict | Constat |
|---|---|---|---|
| 35 | Navigateurs courants : Chrome 154, Safari 27, Firefox 157 | VÉRIFIÉ | Sorties le 2026-09-22, le 2026-09-14 et le 2026-09-29 |
| 36 | View Transitions same-document 111 / 18 / 144, *newly* le 2025-10-14 ; `view-transition-class` 125 / 18.2 / 144 ; types 125 / 18.2 / 147 | VÉRIFIÉ | — |
| 37 | View Transitions cross-document 126 / 18.2 / non, pas Baseline | VÉRIFIÉ | — |
| 38 | `pagereveal` / `pageswap` : 123 / 124 ; Safari 18.2 ; Firefox non | VÉRIFIÉ | Nuance : `pageswap` n'est que **partiel** sous Safari |
| 39 | CSS scroll-driven animations 115 / 26 / Firefox en `preview` seulement | VÉRIFIÉ | — |
| 40 | `<details name>` 120 / 17.2 / 130 ; `::details-content` 131 / 18.4 / 143 | VÉRIFIÉ | — |
| 41 | `interpolate-size` / `calc-size()` : Chrome 129 seulement | VÉRIFIÉ | — |
| 42 | `transition-behavior` 117 / 17.4 / 129, « Baseline : oui » | PARTIEL | Baseline ***newly*** depuis le 2024-08-06, pas *widely* |
| 43 | `dialog[closedby]` 134 / preview / 141 | VÉRIFIÉ | — |
| 44 | Speculation Rules : Chrome 109, **Safari 26.2**, Firefox non | **FAUX** (Safari) | BCD : Safari 26.2 **derrière un flag** ; web-features ne liste même pas Safari. C'est réservé à Chromium |
| 45 | Baseline : layers *widely* (2024-09-14) ; nesting *widely* (2026-06-11) ; container queries *widely* (2025-08-14) ; oklch *widely* (2025-11-09) ; `@property` *newly* (2024-07-09) ; `@starting-style` *newly* (2024-08-06) ; `@scope` *newly* (2026-03-24) | VÉRIFIÉ | — |
| 46 | Animation de `grid-template-rows` : 107 / 16 / 66 | VÉRIFIÉ | — |

### 2.5 Mesures de poids

| # | Affirmation de s1 | Verdict | Constat |
|---|---|---|---|
| 47 | JS initial gzip : Astro 0 / ClientRouter 5,4 / page complète 55,9 Ko ; Nuxt 49,3 Ko ; Next 168,4 Ko | REPRODUIT | Recompté (script + `modulepreload`, gzip -9) sur les sorties de build de s1 : **0,0 / 5,4 / 55,9 / 49,3 / 168,4 Ko**. Mêmes chiffres. Je n'ai pas refait les builds |
| 48 | GSAP core + ScrollTrigger + SplitText = 47,0 Ko ; Lenis = 5,3 Ko | CORROBORÉ | Mon build Vite 8.3.2 « vanilla » (même pile + snippet officiel Lenis ↔ ticker) donne **50,8 Ko gzip** (MEASURED). C'est cohérent avec 47,0 + 5,3, moins la part mutualisée |
| 49 | Nuxt ≈ 100 Ko et Next ≈ 218 Ko « tout compris » (ESTIMATED) | CORROBORÉ (ordre de grandeur) | Même pile sur Vue 3.5 : **73,4 Ko** ; sur React 19.3 + `@gsap/react` : **116,7 Ko** (MEASURED, Vite, sans routeur ni runtime de méta-framework). Pour Nuxt, 49,3 + 50,8 ≈ 100 Ko, ce qui est plausible |

### 2.6 Affirmations secondaires

| # | Affirmation de s1 | Verdict | Constat | Source |
|---|---|---|---|---|
| 50 | Cloudflare rachète l'équipe Astro (2026-01-16) ; Astro reste open source | CORROBORÉ | Plusieurs titres de presse concordants | https://thenewstack.io/cloudflare-acquires-team-behind-open-source-framework-astro/ · https://itbrief.co.uk/story/cloudflare-buys-astro-framework-pledges-open-future |
| 51 | Cloudflare : « If you are starting a new project, use Workers instead of Pages » ; un site statique n'a besoin d'aucun script Worker | VÉRIFIÉ | Texte exact | https://developers.cloudflare.com/workers/best-practices/workers-best-practices/ |
| 52 | Next 16.2.6 (mai 2026) « corrigeait 13 advisories d'un coup » | PARTIEL | Les 13 advisories ont été corrigés le 2026-05-06 en **16.2.5**. La 16.2.6 (2026-05-07) complète un correctif incomplet (GHSA-26hh-7cqf-hhc6). Surtout, c'est **sans objet en `output: 'export'`** : ni middleware, ni Image Optimization, ni Server Functions. L'argument ne départage pas les stacks ici | https://releases.sh/release/rel_zeicewuJdFUIE6QZSvosY-twelve-next-js-and-react-vulnerabilities-patched-upgrade-to-15-5-18-or-16-2-6 · https://www.rabinarayanpatra.com/blogs/nextjs-may-2026-security-release-upgrade-guide (secondaires) |
| 53 | State of JS 2025 : Astro en tête de la satisfaction parmi les méta-frameworks | CORROBORÉ (secondaire) | Source primaire bloquée | https://www.infoq.com/news/2026/03/state-of-js-survey-2025 · https://strapi.io/blog/state-of-javascript-2025-key-takeaways |
| 54 | ASTRODITHER *Site of the Day* le 2026-05-05 | NON VÉRIFIABLE | — | — |
| 55 | Next 16.3 : « Instant Navigations », type-check en TypeScript 7 | NON VÉRIFIABLE | `nextjs.org` bloqué | — |

### 2.7 Omissions qui comptent

| Omission | Pourquoi c'est important | Statut |
|---|---|---|
| `@gsap/react` est sous la même licence propriétaire gratuite (`SEE LICENSE AT https://gsap.com/standard-license`), pas sous MIT | Utile pour `credits.md` | MEASURED (npm) |
| GSAP ne peut pas cibler les pseudo-éléments `::view-transition-*` : ils ne sont pas dans le DOM | En MPA, les transitions de page passent par du CSS ou par WAAPI (`element.animate(…, { pseudoElement })`). L'argument de s1 « un seul moteur » (§6.1, raison 4) est donc faux dès qu'il y a des transitions de page | INFERRED (architecture de l'API) |
| Astro fournit `event.loader` (`astro:before-preparation`) et `event.swap` / `swapFunctions` (`astro:before-swap`) | Ils permettent une sortie GSAP attendue avant le chargement et un swap qui préserve les classes runtime. Cela réduit fortement les défauts reprochés à ClientRouter | Docs Astro (Context7) + code 7.3.5 |
| Les islands Astro émettent `astro:hydrate`, un événement non propagé, sur `<astro-island>` | Point d'accroche pour `ScrollTrigger.refresh()` après hydratation : écouter en phase de capture sur `document` | MEASURED (`runtime/server/astro-island.js`) |
| Cadence des majeures (tableau ci-dessous) | Coût de maintenance d'un portfolio qui doit vivre des années | MEASURED (npm) |
| Âge de `@astrojs/compiler-rs` : 0.5.x, sept mois | Le compilateur par défaut est jeune et strict ; c'est un risque de bug de build | MEASURED (npm) |

Cadence des versions majeures :

| Projet | Historique | Rythme |
|---|---|---|
| Astro | 5.0 → 6.0 → 7.0 | Seulement **104 jours** entre 6.0 et 7.0 |
| Nuxt | 3 → 4 | 32 mois |
| Next | Une majeure par an | Annuel |
| GSAP | 3.x depuis 2019 | Très stable |
| Motion | 13 → 14 | 58 jours |

---

## 3. Ce que s1 fait bien

Une critique honnête commence par là. Je garde tous ces points.

- **Le diagnostic du profil est juste.** La page est statique et éditoriale, avec 4 widgets et une chorégraphie de scroll, sans état applicatif. Toutes les mesures de poids sont reproductibles (#47).
- **GSAP est le bon moteur** pour ce design :
  - SplitText gratuit avec `mask: "lines"` ;
  - `pin` ;
  - `gsap.context()` et `matchMedia()`.
  - Motion n'a ni pin ni split de texte gratuit. Il a sorti deux majeures en 58 jours.
- **Astro a un avantage réel que s1 sous-exploite.** Dans du HTML statique piloté par des custom elements, SplitText peut muter le DOM sans conflit avec un DOM virtuel. En Vue ou React, il faut garantir qu'aucun re-rendu ni hydratation ne touche les nœuds découpés.
- **Le contrat « contenu visible par défaut » et le registre `data-motion` en opt-in** sont exemplaires et conformes à Impeccable (« one authored moment », « Keep content visible in the default state »).
- **La liste des risques** (§8 de s1) est sérieuse.

---

## 4. Le dossier à charge

### 4.1 La matrice ignore l'utilisateur réel

Ce que montrent les quatre dépôts de l'utilisateur (dépendances et date du dernier commit uniquement) :

| Dépôt | Dernier commit | Pile déclarée | Signal |
|---|---|---|---|
| `car-clean` | 2026-09-27 | React 19.2, Vite 8.3, Tailwind 4.3, **`motion` 13.4 + `lenis` 1.3.26**, oxlint, TS ~6.0 | Son projet le plus récent est déjà une page animée, en React + Motion + Lenis |
| `games-party` | 2026-09-25 | React 19.3, react-router 8.4, Express 5, socket.io, Tailwind 4.3, ESLint 10 + typescript-eslint 8.70, Vitest 5, TS 6.0.3 | Outillage moderne déjà maîtrisé |
| `petankup` | 2026-08-31 | **Nuxt 4.4.2**, Nuxt UI 4.8, Pinia, Supabase, Tailwind 4.2, vue-tsc ; présence d'un `vercel.json` | Nuxt 4 déjà livré |
| `pfe-web` | 2025-09-13 | React 18, MUI 5, framer-motion 11, Tailwind 3, Playwright ; présence d'un `vercel.json` | — |

Bilan : Tailwind dans **4 dépôts sur 4**, React dans 3, Nuxt dans 1. **Ni Astro ni GSAP nulle part.** Motion ou framer-motion dans 2, Lenis dans 1, Vercel dans 2.

**Conséquence.** s1 empile quatre nouveautés simultanées : Astro, GSAP, CSS sans Tailwind et Cloudflare. Pour un portfolio, apprendre est un atout. Mais une méthode « irréprochable » limite les axes de risque ouverts en même temps. La matrice de s1 n'a pas de critère d'adéquation à l'utilisateur, et sa note « courbe d'apprentissage » vaut pour un développeur générique, pas pour lui.

**Analyse de sensibilité** (notes INFERRED, calcul ESTIMATED)

Changements appliqués à la matrice de s1 :

- ajout d'un critère « adéquation à l'écosystème » à 10 % ;
- performance ramenée de 20 % à 15 % et écosystème primé de 10 % à 5 % ;
- courbe d'apprentissage spécifique à l'utilisateur ;
- transitions MPA notées 3,5 (voir §4.2).

| Scénario | Astro MPA | Astro + ClientRouter | Nuxt 4.5 | Next 16.3 |
|---|---|---|---|---|
| s1 d'origine | **4,40** | ≈ 4,25 | 3,90 | 3,65 |
| S1 : profil Vue, sous-pages avec transitions | 4,12 | 4,07 | **4,25** | 3,83 |
| S2 : profil React, sous-pages avec transitions | **4,12** | 4,07 | 4,05 | 3,88 |
| S3 : profil Vue, **une seule page** (poids des transitions reporté sur le cycle de vie et la clarté) | **4,22** | 4,02 | 4,15 | 3,73 |

Notes S1 qui diffèrent de s1 :

| Critère | Astro | Nuxt | Next |
|---|---|---|---|
| Performance | 5 | 4 | 2,5 |
| Transitions | 3,5 en MPA, 4,5 avec ClientRouter | 5 | — |
| DX | — | 4,5 | — |
| Apprentissage | 4 | 5 | 3,5 |
| Adéquation | 3 | 4,5 | 4 |

**Lecture.** Les écarts de tête sont ≤ 0,2 point. Le classement s'inverse selon deux réponses de l'utilisateur. **Le score de 4,40 n'est pas un argument : c'est un artefact de pondération.** Il faut décider par l'arbre du §6.

### 4.2 MPA + cross-document : le maillon faible pour un brief « transitions »

L'utilisateur demande explicitement des transitions. Avec `@view-transition` en MPA :

1. **Firefox n'a aucune transition** (#37). Les visiteurs d'un portfolio de développeur sur-représentent probablement Firefox (INFERRED).
2. **GSAP n'anime pas les pseudo-éléments `::view-transition-*`.** La transition de page s'écrit en CSS ou en WAAPI. Il y a donc deux systèmes de motion, deux syntaxes d'easing et deux branches reduced motion. Cela contredit la raison n°4 de s1.
3. **Aucune chorégraphie de sortie** du type « rideau, puis navigation ». Pour l'obtenir, il faudrait intercepter les clics et retarder `location.href`, c'est-à-dire réécrire un routeur.
4. **Aucun élément persistant** entre les pages : position de Lenis, vidéo, canvas WebGL.
5. **L'intro du hero se rejoue à chaque page** si elle est montée au chargement. Il faut prévoir une variante courte en navigation interne. Impeccable le dit : « do not make users wait through page-load choreography ».
6. **Bug de cycle de vie au retour bfcache** (#34). Il infirme l'argument central de s1 : « aucun nettoyage à écrire ».

s1 note bien Firefox et propose ClientRouter. Mais elle **fixe la MPA comme défaut** sans savoir si les sous-pages existent : le shot ne montre qu'une page. Elle note les trois stacks au même niveau (4,5) sur les transitions, ce que les points 1 à 4 ne justifient pas.

### 4.3 ClientRouter : défauts sur-estimés d'un côté, sous-estimés de l'autre

**Sur-estimés**

- Le reduced motion `!important` se neutralise en une règle placée dans un `@layer` (#24).
- Les classes de `<html>` se préservent avec un `event.swap` construit sur `swapFunctions`, qui recopie les classes runtime vers `newDocument.documentElement` avant `swapRootAttributes`.
- Une sortie GSAP peut être **attendue** en surchargeant `event.loader` dans `astro:before-preparation`.

**Sous-estimés**

- L'effacement touche **toutes** les classes runtime : `has-motion` (contrat de s1), `lenis`, `lenis-smooth`, `lenis-stopped` et l'état du menu. Un patch au cas par cas, comme le propose s1 pour les seules classes `lenis*`, laissera passer un oubli.
- Le script inline du `<head>` qui pose `has-motion` n'est pas rejoué au swap (INFERRED, à tester).

### 4.4 Cycle de vie ScrollTrigger / Lenis selon la stack

Les pièges sont INFERRED (expertise), sauf mention contraire.

| | Astro MPA | Astro + ClientRouter | Nuxt 4.5 | Next 16 App Router | Astro + islands Vue/React |
|---|---|---|---|---|---|
| **Montage** | Script module au chargement ; `pagereveal` (Chrome, Safari) sinon `DOMContentLoaded` | `astro:page-load` à chaque navigation | `onMounted` de la page ; ScrollTriggers créés **après** le hook `page:transition:finish` | `useGSAP` dans un composant feuille `'use client'` | `onMounted` / `useEffect` **dans** l'island |
| **Démontage** | Aucun… sauf au retour bfcache (#34) | `astro:before-swap` puis `ctx.revert()` | `onUnmounted` puis `ctx.revert()`, ou hook `onLeave(el, done)` | Automatique (`useGSAP`) | Cleanup de l'island ; `astro:unmount` existe |
| **Lenis** | Une instance par page | Une instance qui survit au swap, mais classes de `<html>` effacées (#25). Option `stopInertiaOnNavigate` | Une instance (`lenis/nuxt`) qui survit aux routes | `ReactLenis root` dans le layout | Script de page ; singleton de module partagé |
| **Refresh** | Après polices et images | Après swap et images | Après la fin de transition, sinon positions mesurées pendant le `transform` d'entrée | À chaque `pathname` | Sur `astro:hydrate`, écouté en capture |
| **Piège n°1** | Double montage au retour bfcache, avec un split imbriqué | Perte de `has-motion` et de `lenis*` | `pin` dans un wrapper de transition transformé : un ancêtre `transform` casse `position: fixed`. Il faut `clearProps: 'transform'` en fin d'entrée | Double exécution des effets en StrictMode (dev) | GSAP ou SplitText appliqué au HTML d'une island **avant** son hydratation : *mismatch*. Vue répare en patchant ; React 19 rebascule en rendu client. Les nœuds animés sont remplacés |
| **Piège n°2** | Intro rejouée à chaque page | État GSAP des éléments `transition:persist` | SSR : `registerPlugin` uniquement côté client (`.client.ts`) | ScrollTriggers orphelins dans les layouts persistants | `client:visible` hydrate en plein scroll : décalage de mise en page **après** la mesure ScrollTrigger |

### 4.5 Les islands, si l'utilisateur veut montrer Vue ou React dans Astro

La variante de s1 (§5.3, « un island React justifié ») est honnête mais fragile pour un site animé :

- **Chaque island est une application isolée.** Pas de `provide`/`inject` ni de contexte React entre islands. Lenis et GSAP doivent passer par un singleton de module.
- **Règle stricte** : on n'anime le contenu d'une island que depuis l'island, après son montage. Jamais depuis un script de page.
- **`client:visible`** est à proscrire près des sections épinglées. Préférer `client:idle`, ou rafraîchir ScrollTrigger sur `astro:hydrate`.
- **Coût** : environ 67 Ko gzip de React (MEASURED par s1) pour un seul carrousel. Le gain de signal est faible, car les dépôts React existants le prouvent déjà.

### 4.6 L'argument performance est surpondéré

JS de la même pile d'animation (GSAP core + ScrollTrigger + SplitText + Lenis), build Vite 8.3.2, gzip -9 :

| Base | JS gzip | Statut |
|---|---|---|
| Vanilla (≈ Astro sans routeur) | **50,8 Ko** | MEASURED |
| Astro + ClientRouter (page réelle de s1) | 55,9 Ko | MEASURED (#47) |
| Vue 3.5 | 73,4 Ko | MEASURED |
| Nuxt 4.5 | ≈ 100 Ko | ESTIMATED (49,3 + 50,8) |
| React 19.3 + `@gsap/react` | 116,7 Ko | MEASURED |
| Next 16.3 | ≈ 218 Ko | ESTIMATED |

- Entre Astro et Nuxt, l'écart est d'environ **44 Ko gzip**. C'est moins que le quart du budget de l'image hero AVIF (≤ 200 Ko) et environ un tiers du budget polices (≤ 120 Ko), deux budgets fixés par s1.
- Le vrai coût de Nuxt est l'**hydratation** de toute la page (TBT et INP). Il existe, mais il se mesure, il ne se suppose pas.
- Seul Next reste nettement pénalisé.
- La pondération de 20 % sur la performance fait passer un écart de second ordre pour un argument décisif.

### 4.7 Clarté : un micro-framework maison

L'architecture de s1 comprend :

- des custom elements avec `AbortController` ;
- un registre `data-motion` ;
- un adaptateur `lifecycle.ts` ;
- des tokens recopiés en CSS, en TS et dans `DESIGN.md`, avec deux tests de parité.

Elle est élégante, mais **sur mesure** : un relecteur doit apprendre les conventions du projet. En Nuxt, le même contrat s'exprime en conventions que tout recruteur Vue reconnaît : `onMounted` / `onUnmounted`, `gsap.context`, hooks de `<Transition>`, `definePageMeta`.

Les **trois copies des tokens** contredisent la clarté demandée. Une seule source de vérité suffit (amendement A12).

### 4.8 Outillage et maintenance

- **13 outils qualité plus Renovate** pour une seule page. Plusieurs se recouvrent : LHCI (peu maintenu) et unlighthouse ; Vitest qui ne servirait qu'aux tests de parité.
- **Rythme de sortie** : Astro a sorti 6.0 puis 7.0 à 104 jours d'écart ; Motion deux majeures en 58 jours ; Lenis 2 est en développement. Chaque montée de version déclenche toute la CI.
- **Le verrou TypeScript ≤ 6** (#13) est réel, mais **commun aux trois stacks**. s1 le retient à tort contre Astro seul dans la note DX.

### 4.9 Signal recruteur : l'argument joue dans les deux sens

| Pour Astro | Pour Nuxt ou Next |
|---|---|
| Diversifie un GitHub déjà React + Nuxt | Les filtres de candidature cherchent « React » ou « Vue » |
| Montre la maîtrise de la plate-forme et une performance mesurée | Une vitrine sans framework UI ne prouve ni composants ni état… |
| Astro en tête de la satisfaction (#53, source secondaire) | … mais les autres dépôts le prouvent déjà |

**Bilan (INFERRED)** : neutre à légèrement favorable à Astro, à condition d'avoir un README et des ADR. Cet argument ne justifie ni un remplacement, ni le maintien en l'état.

### 4.10 Le meilleur contre-projet : Nuxt 4.5 en `nuxt generate`

**Composition**

- Nuxt 4.5.2 en génération statique, Vue 3.5.43 ;
- GSAP 3.15 (registre de plugins dans un plugin `.client.ts`) ;
- `lenis/nuxt` ;
- styles scopés SFC (ou Tailwind 4.3, déjà maîtrisé) ;
- `<NuxtPage :transition="{ css: false, mode: 'out-in', onLeave, onEnter }">` piloté par GSAP. La doc Nuxt 4 cite explicitement GSAP pour ces hooks ;
- `viewTransition: 'always'` en option, pour garder la main sur le reduced motion (#32).

**Pour**

- Transitions de page chorégraphiées (sortie GSAP attendue par `done()`) **dans tous les navigateurs**, sans dépendre de l'API View Transitions.
- Layout persistant : header, Lenis et canvas survivent aux routes.
- Conventions de cycle de vie connues.
- **Apprentissage nul** pour l'utilisateur (Nuxt 4.4 déjà livré).
- Intégration native dans un portfolio Nuxt.

**Contre**

- Environ +44 Ko gzip de JS, plus l'hydratation de toute la page.
- Discipline nécessaire : SplitText seulement sur du texte non réactif, revert au démontage, `clearProps` avant tout `pin`, ScrollTriggers créés après `page:transition:finish`.
- Vue 3.6 (Vapor) est en RC et Nuxt 5 est annoncé, ce qui laisse une migration à prévoir (INFERRED).

---

## 5. Verdict final : **AMEND**

**Justification.** Pour ce que montre réellement le shot, une page unique, statique et éditoriale à chorégraphie de scroll, Astro statique + GSAP + CSS moderne reste le meilleur couple. Il livre le moins de JS (50,8 à 55,9 Ko, MEASURED), aucun DOM virtuel ne dispute les nœuds que SplitText découpe, et les faits de s1 sont solides. Remplacer la stack ne se justifie donc pas. Mais s1 tranche trop tôt trois questions qui appartiennent à l'utilisateur : sous-pages ou non, nature des transitions, écosystème. Son défaut MPA + cross-document contient un bug de cycle de vie (bfcache) et une promesse intenable (« un seul moteur »). Sa matrice n'a pas de critère d'adéquation, et une fois ce critère ajouté, l'avance de 0,5 point fond à moins de 0,2. Il faut donc **garder le cœur et amender** la navigation, la méthode de décision, les tokens et l'outillage, puis laisser l'arbre du §6 décider, Nuxt 4.5 étant la bascule documentée.

### Amendements exacts

| # | Section de s1 | Remplacer | Par |
|---|---|---|---|
| A1 | §0, §7.2, §9 Q1 | Le périmètre « landing + 2 à 4 sous-pages » | Le périmètre **une page** (le shot), sous-pages en option à confirmer. En une page : **aucun routeur, aucune View Transition inter-pages** ; le débat MPA / ClientRouter disparaît |
| A2 | §7.2 | « MPA + View Transitions cross-document recommandé » | Un choix selon la nature des transitions (§6, Q3). Fondu ou morph avec Firefox sans transition accepté : MPA. Chorégraphie GSAP ou persistance : **ClientRouter + adaptateur**, ou Nuxt 4.5 |
| A3 | §7.2, contrat d'animation | « En MPA : `pagereveal`, avec repli sur `DOMContentLoaded` » ; « aucun nettoyage » | Un **montage idempotent** : garde `root.dataset.motionMounted`, ou démontage sur `pagehide` (si `persisted`) et remontage sur `pageshow`. Documenter que `pagereveal` rejoue au retour bfcache. Ajouter un test Playwright `page.goBack()` / `goForward()` qui vérifie une seule instance Lenis et aucun split imbriqué |
| A4 | §6.1 raison 4, ADR 0002 | « Un seul moteur » | « GSAP pour l'in-page ; CSS (ou WAAPI `pseudoElement`) pour les transitions inter-pages, car GSAP ne cible pas `::view-transition-*`. Easings partagés via des custom properties » |
| A5 | §3.1, §7.2, §8 risque 2, §9 | « Reduced motion coupé en `!important`, impossible de garder un fondu » ; recopie des seules classes `lenis*` | « Coupé par défaut ; neutralisé par une règle `!important` dans un `@layer` ». Un **`event.swap` personnalisé** (`swapFunctions`) recopie **toutes** les classes runtime (`has-motion`, `lenis*`, état du menu). Une sortie GSAP passe par `event.loader` |
| A6 | §5.2 | La matrice à 8 critères | Ajouter l'**adéquation à l'écosystème** (10 %), rendre l'apprentissage spécifique à l'utilisateur, performance à 15 %, écosystème primé à 5 %, transitions MPA à 3,5. Publier la sensibilité du §4.1 et conclure : « écart dans le bruit, décider par Q1/Q2 » |
| A7 | §5.2, note DX | « Astro pénalisé par le verrou TypeScript ≤ 6 » | « Verrou commun aux trois stacks : `typescript@7` n'expose pas d'API JS, et `eslint-config-next` dépend de typescript-eslint » |
| A8 | §3.8, §7.2 | Speculation Rules « Safari 26.2 » ; `transition-behavior` « Baseline oui » | « Chromium seulement (Safari derrière un flag) » ; « Baseline *newly* 2024-08 » |
| A9 | §3.3 | motion-v « en retard sur Motion 14 » | « Déclare `framer-motion ^13.3.0` ; publié 3 h 30 après Motion 14 » |
| A10 | §3.2 | « 16.2.6 corrigeait 13 advisories » | « 13 advisories corrigés en 16.2.5, complétés en 16.2.6 ; sans objet pour un export statique » |
| A11 | §7.3, §9 Q3 | « Pourquoi pas Tailwind » | Tailwind v4 présenté **à égalité** : l'utilisateur l'emploie dans 4 dépôts sur 4, et `@theme` donne une source unique de tokens. Si le CSS natif est retenu, l'ADR l'assume comme démonstration volontaire de maîtrise CSS |
| A12 | §7.4 | `tokens.css`, `tokens.ts`, `DESIGN.md` et deux tests de parité | **Une seule source** : soit `tokens.css` lu au runtime (`getComputedStyle`, puis `CustomEase.create`), soit des tokens générés au build depuis un unique fichier. Au plus un test, entre `DESIGN.md` et cette source |
| A13 | §7.7, §7.1 | 13 outils obligatoires | Un **socle** : Prettier ; ESLint + typescript-eslint + eslint-plugin-astro + jsx-a11y-x ; `astro check` ; Playwright + axe ; un audit Lighthouse. Des **options** : Stylelint, knip, lefthook + commitlint, Vitest, LHCI. CI en **Node 24** (engines de `eslint-plugin-astro`) |
| A14 | §7.9 | « Cible : Cloudflare » | « Sortie statique, indépendante de l'hébergeur. Par défaut l'hébergeur déjà utilisé (Vercel, présent dans 2 dépôts), Cloudflare en alternative, ou l'inverse si l'utilisateur veut l'apprendre » |
| A15 | §8 | — | Ajouter trois risques : `@astrojs/compiler-rs` encore en 0.x ; cadence des majeures d'Astro (104 jours entre 6 et 7) ; carrousel `scroll-snap` horizontal sous Lenis à couvrir en E2E (`gestureOrientation` vaut `vertical` par défaut, MEASURED) |

---

## 6. Arbre de décision

```
Q1. VYRON vit-il seul (domaine ou sous-domaine, lié depuis le portfolio) ou DANS une app portfolio existante ?
│
├── SEUL
│   └── Q2. Une page, ou des sous-pages avec transitions ?
│       ├── Une page (= le shot) ............................................... ①
│       └── Sous-pages
│           └── Q3. Quelle nature de transition ?
│               ├── Fondu ou morph d'éléments partagés ; Firefox sans transition accepté .... ②
│               └── Chorégraphie GSAP (sortie → entrée), éléments persistants, parité Firefox
│                   ├── Vous voulez rester en HTML / TS natif ................ ③
│                   └── Vous préférez Vue, ou voulez le signal Vue ........... ④
│
├── DANS un portfolio Vue / Nuxt
│   ├── Une page ...................................................... ⑤a
│   ├── Sous-pages .................................................... ⑤b
│   └── Portfolio Vue SPA sans Nuxt → ① déployé à côté, sous /vyron (rewrite)
│
└── DANS un portfolio React
    ├── Next.js App Router ............................................ ⑥a
    ├── Vite + React Router (SPA) ..................................... ⑥b
    └── Si la performance est l'argument du case study → ① déployé sous /vyron (rewrite)
```

| Feuille | Stack | Transitions | Montage / démontage GSAP | Lenis | Ce qu'on garde de s1 | JS d'animation gzip |
|---|---|---|---|---|---|---|
| ① | **Astro 7.3 statique, sans routeur** + GSAP 3.15 + CSS natif ou Tailwind 4.3 | In-page seulement (menu, accordéon, carrousel) | Script module au chargement, montage idempotent (A3) | Option, mode prudent | Tout, sauf §7.2, avec les amendements A3 et A11 à A15 | ≈ 51 Ko (MEASURED 50,8) + code applicatif |
| ② | Astro MPA + `@view-transition` (s1 tel quel) | CSS / WAAPI ; Firefox sans transition | `pagereveal` / `DOMContentLoaded`, **idempotent** (A3) | Une instance par page | s1 + A3, A4, A8 | ≈ 51 Ko |
| ③ | Astro + `<ClientRouter />` | Sortie GSAP via `event.loader` ; entrée sur `astro:page-load` ; fondu réduit dans un `@layer` | `astro:page-load` pour monter, `astro:before-swap` pour `revert()` | Instance persistante + **`event.swap` qui recopie les classes runtime** | s1 + A5 | 55,9 Ko (MEASURED) |
| ④ | **Nuxt 4.5 `nuxt generate`** + GSAP + `lenis/nuxt` | `<NuxtPage :transition>` avec hooks GSAP, `mode: 'out-in'` ; `viewTransition: 'always'` en option | `onMounted` / `onUnmounted` + `gsap.context` ; refresh sur `page:transition:finish` ; `clearProps` avant `pin` | Instance persistante dans `app.vue` | Contrat « visible par défaut », registre `data-motion`, motion-thesis, tokens, tests a11y et E2E | ≈ 100 Ko (ESTIMATED) |
| ⑤a | Route Nuxt `pages/vyron.vue` dans l'app existante | Celles du portfolio | Tout dans un `gsap.context(scope)` revert au démontage ; aucun ScrollTrigger global | **Réutiliser** l'instance du portfolio si elle existe ; sinon une instance de page | Idem ④ | Marginal si GSAP est déjà présent ; sinon ≈ +51 Ko |
| ⑤b | `pages/vyron/*` + layout `vyron.vue` (header et Lenis persistants) | `definePageMeta({ pageTransition })` avec hooks GSAP | Idem ④ | Dans le layout | Idem ④ | Idem ⑤a |
| ⑥a | Segment `app/vyron/` + composants feuilles `'use client'` + `useGSAP` | React `<ViewTransition>` ou hooks GSAP via `template.tsx` | `useGSAP` avec `scope` ; refresh sur changement de `pathname` | `ReactLenis root` dans le layout du segment | Contrat, registre, tokens, tests | Marginal dans l'app ; ≈ 218 Ko en autonome (ESTIMATED) |
| ⑥b | Route React + `useGSAP` + `lenis/react` | Hooks GSAP par route | `useGSAP` | Layout de route | Idem ⑥a | 116,7 Ko (MEASURED, sans routeur) |

Note sur ⑥b : un **pré-rendu est obligatoire**, par exemple le mode framework de React Router (INFERRED). Sinon le contenu reste invisible sans JS, ce qui contredit Impeccable et nuit au LCP.

**Réponse par défaut si l'utilisateur ne tranche pas** : la feuille **①**. C'est le shot tel qu'il est : une page, la stack de s1 amendée.

---

## 7. Questions à poser à l'utilisateur

1. **Q1** : VYRON sera-t-il autonome (domaine, sous-domaine ou `/vyron`) ou une route de votre portfolio ? Dans ce cas, sur quel framework tourne ce portfolio ?
2. **Q2** : une page (comme le shot) ou des sous-pages ? Si oui, lesquelles ?
3. **Q3** : vos transitions de page sont-elles des fondus ou morphs, ou une **chorégraphie** de sortie puis d'entrée ? La parité Firefox est-elle exigée ?
4. Voulez-vous **montrer Vue ou React** dans cette pièce, ou au contraire **diversifier** (Astro + plate-forme) puisque vos dépôts montrent déjà React et Nuxt ?
5. Tailwind (votre habitude) ou CSS natif (démonstration volontaire) ?
6. Lenis : votre dernier projet l'utilise. Le voulez-vous ici, sachant que le brief (des captures statiques) ne l'impose pas ?
7. Hébergement : Vercel, que vous utilisez déjà, ou Cloudflare ?

**Tension Impeccable pertinente pour la stack.** « Reduced motion means fewer and gentler, not disabling all motion. » Chaque feuille de l'arbre le permet :

- ① et ② : règle CSS dans un `@layer` ;
- ③ : la même règle, qui l'emporte sur le `!important` hors couche d'Astro ;
- ④ et ⑤ : `viewTransition: 'always'` ou hooks GSAP sous `matchMedia`.

C'est une décision d'implémentation, pas un critère de choix de stack.

---

## 8. Sources

**Primaires lues par moi**

- Registre npm (2026-10-02) : `https://registry.npmjs.org/<paquet>` pour astro, @astrojs/compiler-rs, @astrojs/check, @astrojs/react, @astrojs/vue, @astrojs/sitemap, @astrojs/netlify, next, eslint-config-next, react, react-dom, nuxt, vue, vue-tsc, gsap, @gsap/react, motion, framer-motion, motion-v, lenis, tailwindcss, typescript, typescript-eslint, eslint, eslint-plugin-astro, eslint-plugin-jsx-a11y, eslint-plugin-jsx-a11y-x, @biomejs/biome, prettier, prettier-plugin-astro, stylelint (et ses configs), postcss-html, vite, vitest, @playwright/test, @axe-core/playwright, @lhci/cli, unlighthouse, knip, lefthook, @commitlint/*, wrangler, pnpm, three, ogl, embla-carousel.
- Fichiers de paquets (lus dans les tarballs, mêmes contenus sur unpkg) :
  - https://unpkg.com/astro@7.3.5/components/viewtransitions.css
  - https://unpkg.com/astro@7.3.5/components/ClientRouter.astro
  - https://unpkg.com/astro@7.3.5/dist/transitions/swap-functions.js
  - https://unpkg.com/astro@7.3.5/dist/core/config/schemas/defaults.js
  - https://unpkg.com/astro@7.3.5/dist/core/config/schemas/base.js
  - https://unpkg.com/astro@7.3.5/dist/runtime/server/astro-island.js
  - https://unpkg.com/lenis@1.3.26/dist/lenis.css
  - https://unpkg.com/lenis@1.3.26/dist/lenis.mjs
  - https://unpkg.com/lenis@1.3.26/dist/lenis.d.ts
  - https://unpkg.com/lenis@1.3.26/README.md
  - https://unpkg.com/gsap@3.15.0/README.md
  - https://unpkg.com/nuxt@4.5.2/dist/app/plugins/view-transitions.client.js
  - https://unpkg.com/@nuxt/schema@4.5.2/dist/index.d.mts
  - https://unpkg.com/next@16.3.8/dist/docs/01-app/02-guides/view-transitions.md
- CHANGELOG :
  - https://raw.githubusercontent.com/withastro/astro/main/packages/astro/CHANGELOG.md
  - https://raw.githubusercontent.com/withastro/astro/astro%406.4.8/packages/astro/CHANGELOG.md
  - https://raw.githubusercontent.com/facebook/react/main/CHANGELOG.md
  - https://raw.githubusercontent.com/motiondivision/motion/main/CHANGELOG.md
  - https://raw.githubusercontent.com/biomejs/biome/main/packages/%40biomejs/biome/CHANGELOG.md
  - https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/CHANGELOG.md
- Spécifications :
  - CSS Cascade 5 (ordre des couches pour `!important`) : https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-cascade-5/Overview.bs
  - CSS View Transitions 1 (spécificité des pseudo-éléments nommés) : https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-view-transitions-1/Overview.bs
  - MDN `pagereveal` : https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/window/pagereveal_event/index.md
- Compatibilité navigateurs :
  - `@mdn/browser-compat-data@8.1.4` (horodaté 2026-10-01T10:12:15Z) : https://www.npmjs.com/package/@mdn/browser-compat-data
  - `web-features@3.40.1` : https://www.npmjs.com/package/web-features
- Licence GSAP (texte intégral, ScanCode) : https://raw.githubusercontent.com/aboutcode-org/scancode-toolkit/develop/src/licensedcode/data/licenses/gsap-standard-no-charge-2025.LICENSE
- Node : https://nodejs.org/dist/index.json
- Cloudflare (MCP) : https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- Docs Astro (Context7 `/withastro/docs`) : https://docs.astro.build/en/guides/view-transitions/ (`event.loader`, `event.swap`, `swapFunctions`)
- Docs Nuxt 4 (Context7 `/websites/nuxt_4_x`) : https://nuxt.com/docs/4.x/getting-started/transitions (hooks JS, GSAP)

**Mesures**

- Re-comptage des sorties de build de s1 : `work/s1-stack/{astro-bench/dist, nuxt-bench/.output/public, next-bench/out}`.
- Banc Vite 8.3.2, relancé aujourd'hui : `work/v3-stack-adversary/bench/build.mjs` (vanilla, Vue et React, avec la même pile GSAP + Lenis).

**Secondaires**

- https://thenewstack.io/cloudflare-acquires-team-behind-open-source-framework-astro/
- https://itbrief.co.uk/story/cloudflare-buys-astro-framework-pledges-open-future
- https://releases.sh/release/rel_zeicewuJdFUIE6QZSvosY-twelve-next-js-and-react-vulnerabilities-patched-upgrade-to-15-5-18-or-16-2-6
- https://www.rabinarayanpatra.com/blogs/nextjs-may-2026-security-release-upgrade-guide
- https://www.infoq.com/news/2026/03/state-of-js-survey-2025
- https://strapi.io/blog/state-of-javascript-2025-key-takeaways

**Méthode Impeccable** (lue localement) : `reference/craft-floor.md`, `animate.md` (« Implement to the runtime », reduced motion), `mode-persuade.md`, `optimize.md`.

