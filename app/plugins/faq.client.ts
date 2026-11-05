import { motionAllowed } from '~/motion/env';

/**
 * FAQ de la V2 (CapPractical, hydraté jamais) : la réponse se révèle avec le
 * mécanisme des fiches de cours (CapCourseSheet), le même dans tous les
 * navigateurs. Une transition CSS de `grid-template-rows` (0fr → 1fr) ouvre la
 * hauteur, puis le texte apparaît en fondu ; la fermeture est plus rapide. Le
 * CSS est dans CapPractical.vue. Ce script ne fait que poser les attributs :
 *
 * - `data-shut` : la réponse est repliée (0fr, texte à 0) ;
 * - `data-moving` : une transition joue (débordement coupé).
 *
 * Ouverture : `open`, puis `data-shut` posé, styles calculés, et `data-shut`
 * retiré deux images plus tard. La réponse vient de sortir du contenu caché du
 * <details> : sans ce calcul préalable, Safari n'aurait pas d'état de départ
 * et l'afficherait d'un coup.
 * Fermeture : `data-shut`, puis `open` retiré à la fin de la transition.
 *
 * Rien n'est intercepté hors de html.has-motion : sans JS ou en mouvement réduit,
 * le <details name="faq"> natif s'ouvre et se ferme instantanément. L'exclusivité
 * native (`name`) fermerait d'un coup la question ouverte : le temps de
 * l'animation, l'attribut est retiré et la voisine se replie en douceur, puis il
 * est remis.
 */
const ITEM = '.cap-practical__item';

const timers = new WeakMap<HTMLDetailsElement, number>();

function duration(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  // « 430ms », ou « .43s » une fois minifiée.
  return raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value;
}

function wait(item: HTMLDetailsElement, ms: number, then: () => void) {
  clearTimeout(timers.get(item));
  timers.set(
    item,
    window.setTimeout(() => {
      timers.delete(item);
      then();
    }, ms),
  );
}

function open(item: HTMLDetailsElement, done: () => void) {
  const layout = duration('--dur-layout', 430);
  item.dataset.moving = '';
  item.dataset.shut = '';
  item.open = true;
  // État de départ calculé (0fr, texte à 0) avant de lancer la transition.
  void item.offsetHeight;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (!item.open) return;
      delete item.dataset.shut;
      const fade = duration('--dur-feedback', 140) + duration('--dur-state', 240);
      wait(item, Math.max(layout, fade) + 50, () => {
        delete item.dataset.moving;
        done();
      });
    }),
  );
}

function close(item: HTMLDetailsElement, done: () => void) {
  item.dataset.moving = '';
  item.dataset.shut = '';
  wait(item, duration('--dur-layout', 430) * 0.65 + 50, () => {
    item.open = false;
    delete item.dataset.shut;
    delete item.dataset.moving;
    done();
  });
}

function toggle(item: HTMLDetailsElement) {
  const opening = !item.open || item.dataset.shut !== undefined;
  // Le nom du groupe survit au retrait de l'attribut (clics rapprochés).
  const name = item.getAttribute('name') ?? item.dataset.group ?? '';
  const group = name
    ? [
        ...document.querySelectorAll<HTMLDetailsElement>(
          `${ITEM}[data-group="${name}"], ${ITEM}[name="${name}"]`,
        ),
      ]
    : [item];
  for (const member of group) {
    member.dataset.group = name;
    member.removeAttribute('name');
  }

  let pending = 0;
  const finish = () => {
    pending -= 1;
    if (pending > 0 || !name) return;
    if (group.some((member) => member.dataset.moving !== undefined)) return;
    if (group.filter((member) => member.open).length > 1) return;
    for (const member of group) member.setAttribute('name', name);
  };

  if (!opening) {
    pending = 1;
    close(item, finish);
    return;
  }
  const others = group.filter(
    (other) => other !== item && other.open && other.dataset.shut === undefined,
  );
  pending = 1 + others.length;
  open(item, finish);
  for (const other of others) close(other, finish);
}

export default defineNuxtPlugin(() => {
  document.addEventListener('click', (event) => {
    if (!motionAllowed()) return;
    const target = event.target as Element | null;
    const summary = target?.closest('summary');
    const item = summary?.parentElement;
    if (!summary || !(item instanceof HTMLDetailsElement) || !item.matches(ITEM)) return;
    event.preventDefault();
    toggle(item);
  });
});
