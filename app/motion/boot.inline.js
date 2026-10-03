// Amorce du mouvement, injectée en ligne dans <head> (nuxt.config.ts) : elle
// s'exécute avant le premier rendu, sans attendre le bundle Vue ni GSAP.
//
// Contrat de classes sur <html> :
//   js          JavaScript actif.
//   has-motion  JavaScript actif ET pas de « mouvement réduit ». Les états
//               initiaux d'animation n'existent que sous cette classe : sans elle
//               (mouvement réduit, JS en panne), tout est visible, état final.
//   hero-intro  l'intro du hero va jouer (arrivée en haut de page, sans ancre) :
//               ses états initiaux s'appliquent.
//   hero-ready  l'intro démarre (keyframes CSS) : dès que la photo du hero et sa
//               plaque de stries sont décodées, au plus tard 1,2 s après le parsing.
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => root.classList.toggle('has-motion', !reduce.matches);
  root.classList.add('js');
  sync();
  // Bascule en direct : passer en mouvement réduit montre aussitôt l'état final.
  reduce.addEventListener('change', () => {
    sync();
    if (reduce.matches) root.classList.remove('hero-intro');
  });

  // Pas d'intro sur une arrivée par ancre ou plus bas dans la page.
  if (reduce.matches || location.hash || scrollY > innerHeight / 2) return;
  root.classList.add('hero-intro');

  const start = () => root.classList.add('hero-ready');
  const fallback = setTimeout(start, 1200);
  const whenParsed = () => {
    const images = [...document.querySelectorAll('.hero__photo, .hero__streaks')];
    // decode() résout aussi si l'image est déjà là ; une erreur ne bloque pas l'intro.
    Promise.all(images.map((image) => image.decode().catch(() => {}))).then(() => {
      clearTimeout(fallback);
      start();
    });
  };
  // « interactive » : le HTML est analysé, avant l'exécution du bundle (différé).
  if (document.readyState === 'loading') {
    document.addEventListener('readystatechange', whenParsed, { once: true });
  } else whenParsed();

  // Retour depuis le bfcache : pas de nouvelle intro.
  addEventListener('pageshow', (event) => {
    if (event.persisted) root.classList.remove('hero-intro');
  });
})();
