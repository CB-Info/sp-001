# ADR 0001 — Stack : Nuxt 4.5 (génération statique) + GSAP

- **Statut** : accepté
- **Date** : 2026-10-03
- **Décideur** : l'auteur du projet, sur la base de l'analyse [`docs/analyse/00-synthese.md`](../analyse/00-synthese.md) §12

## Contexte

Le projet est une page unique de landing, très animée : une reproduction fidèle de la référence « VYRON », sous la marque fictive CLUSEM. C'est une pièce de portfolio, jugée sur l'exécution : animation, micro-interactions, accessibilité, performance et clarté du code.

L'analyse a comparé trois familles de stack. Les chiffres sont du JS gzip, mesuré sur des builds jetables le 2026-10-02 :

| Stack                  | Page vide                        | Avec GSAP (core, ScrollTrigger, SplitText) et Lenis |
| ---------------------- | -------------------------------- | --------------------------------------------------- |
| Astro 7 statique       | 0 Ko                             | ≈ 51 à 56 Ko                                        |
| Vue 3.5 (base de Nuxt) | 23 Ko (Vue seul), 49,3 Ko (Nuxt) | ≈ 73 Ko (Vue seul), ≈ 100 Ko (Nuxt, estimé)         |
| Vite + React 19        | 66 Ko                            | 116,7 Ko                                            |

Astro arrivait en tête au score pondéré. Deux revues adverses indépendantes ont pourtant montré qu'une fois l'adéquation à l'écosystème de l'auteur prise en compte, **l'écart tombe dans le bruit de pondération** (moins de 0,2 à 0,25 point). Le choix revenait donc à l'auteur.

## Décision

**Nuxt 4.5 en génération statique (`nuxt generate`), Vue 3.5, TypeScript, et GSAP comme moteur d'animation unique dans la page.**

| Couche                   | Choix                                                                                                        | Version épinglée                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Framework                | `nuxt` (SSG, une route `/`)                                                                                  | 4.5.2                                                                     |
| UI                       | `vue`                                                                                                        | 3.5.43 (Vapor 3.6 encore en RC, donc non retenu)                          |
| Langage                  | `typescript`                                                                                                 | **~6.0.3**. La 7.x est exclue : `typescript-eslint@8.71` exige `<6.1.0`   |
| Animation                | `gsap` : core, ScrollTrigger, SplitText, Flip, CustomEase                                                    | 3.15.0 (gratuit, plugins compris, sous la licence « standard no-charge ») |
| Smooth scroll            | `lenis` (export `lenis/vue`), sous conditions                                                                | ~1.3.26 (la 2.0 est en dev)                                               |
| WebGL (option overdrive) | `ogl`                                                                                                        | 1.0.11                                                                    |
| Polices                  | Fontsource auto-hébergé : `@fontsource-variable/tektur`, `inter-tight`, `inter`, `@fontsource/ibm-plex-mono` | 5.3.0                                                                     |
| Images                   | `@nuxt/image`, qui génère AVIF/WebP et `srcset` au build                                                     | 2.1.0                                                                     |
| Lint                     | `@nuxt/eslint` (ESLint 10 flat), `vue-tsc` via `nuxt typecheck`                                              | 1.17.0 / 3.3.12                                                           |
| Tests                    | `@playwright/test` + `@axe-core/playwright` ; `@nuxt/test-utils` si de la logique le justifie                | 1.63.0 / 4.13.0 / 4.3.3                                                   |
| Runtime                  | Node 24 LTS, pnpm                                                                                            | 24.x                                                                      |

**Hors stack** :

- **Motion** : un seul moteur d'animation dans la page ;
- **`@nuxt/content`** : inutile pour une page dont le contenu est typé en TS ;
- **Barba** : n'est plus maintenu.

## Conséquences

### Positives

- C'est l'écosystème déjà pratiqué par l'auteur (un projet Nuxt 4 existe). L'effort d'apprentissage se concentre sur GSAP (pin, SplitText masqué, timelines), là où il rapporte.
- **Le cycle de vie est connu** :
  - `onMounted` crée un `gsap.context(scope)` ;
  - `onBeforeUnmount` appelle `revert()` ;
  - `gsap.matchMedia()` gère les paliers et `prefers-reduced-motion`.
- Si des sous-pages arrivent un jour, `<NuxtPage :transition="{ css: false, onLeave, onEnter }">` donne des transitions chorégraphiées par GSAP **dans tous les navigateurs**, Firefox compris.
- Les composants monofichiers Vue gardent ensemble structure, style scopé et comportement, ce qui sert directement la clarté demandée.

### Négatives, et ce qui les compense

| Coût                                                                                                 | Mitigation                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ≈ +45 Ko de JS par rapport à Astro, plus l'hydratation de la page                                    | Budget JS au premier chargement : **≤ 110 Ko gzip**, contrôlé en CI. Modules d'animation chargés à la demande (`IntersectionObserver`). Overdrive WebGL en `import()` dynamique, après le LCP                                                                            |
| SplitText modifie un DOM que Vue possède                                                             | SplitText ne s'applique qu'à du **texte statique non réactif**, après hydratation et `document.fonts.ready`, et il est **reverté au démontage**. Les éléments découpés ne portent aucune liaison réactive                                                                |
| Risque de mismatch d'hydratation (états initiaux d'animation, détection de `prefers-reduced-motion`) | Les états initiaux cachés n'existent que sous la classe `html.has-motion`, posée par un script inline dans le `<head>` (`useHead`) **avant** l'hydratation, avec un garde-fou de 3 s. Le HTML généré est complet et visible sans JS                                      |
| Lenis et ScrollTrigger avec le scroll natif                                                          | Lenis est piloté par `gsap.ticker` (`autoRaf: false`) et relié par `lenis.on('scroll', ScrollTrigger.update)`. Il est actif seulement sur desktop avec pointeur fin et hors reduced-motion. `data-lenis-prevent` sur le menu ; un test E2E dédié au carrousel horizontal |
| Vue 3.6 et Nuxt 5 annoncés : migration à prévoir                                                     | Versions exactes, Renovate groupé. La sortie statique ne dépend pas du rythme de mise à jour                                                                                                                                                                             |

## Alternatives écartées

- **Astro 7 statique** : le plus léger (environ 55 Ko au total) et le cas d'école pour ce type de page. Écarté par choix de l'auteur, au profit de son écosystème et de la possibilité de transitions de page chorégraphiées plus tard.
- **Vite + React 19 + GSAP + Tailwind** : la stack habituelle de l'auteur pour une one-page, mais c'est la plus lourde (116,7 Ko) et elle impose un prérendu.
- **Next.js 16** : 168 Ko de JS de base pour une page statique ; aucun bénéfice ici.

## Références

- Analyse et matrice : [`docs/analyse/00-synthese.md`](../analyse/00-synthese.md) §12
- Revues adverses : [`v3`](../analyse/annexes/v3-stack-adversary.md), [`v3b`](../analyse/annexes/v3b-stack-adversary.md). Le §4.10 de v3b détaille la variante Nuxt.
