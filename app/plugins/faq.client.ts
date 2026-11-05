import { motionAllowed } from '~/motion/env';

/**
 * FAQ de la V2 (CapPractical, hydraté jamais) : la réponse se révèle comme une
 * fiche de cours (CapCourseSheet). La hauteur s'ouvre en --dur-layout, puis le
 * texte apparaît en fondu (--dur-state, après --dur-feedback). La fermeture est
 * plus rapide : 0,65 × l'ouverture, avec un fondu de sortie sur la moitié.
 *
 * Tout passe par la Web Animations API, donc partout, Safari compris. Rien n'est
 * intercepté hors de html.has-motion : sans JS ou en mouvement réduit, le
 * <details name="faq"> natif s'ouvre et se ferme instantanément, comme avant.
 *
 * L'exclusivité native (`name`) fermerait la question ouverte d'un coup. Le
 * temps de l'animation, l'attribut est retiré et la voisine se ferme en douceur,
 * puis il est remis (une seule question est ouverte à ce moment-là).
 */
const ITEM = '.cap-practical__item';
const ANSWER = '.cap-practical__answer';
const TEXT = '.cap-practical__answer-text';

const running = new WeakMap<HTMLDetailsElement, Animation[]>();

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Une durée des tokens en millisecondes (« 430ms », ou « .43s » une fois minifiée). */
function ms(name: string, fallback: number): number {
  const raw = token(name);
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value;
}

function stop(item: HTMLDetailsElement) {
  for (const animation of running.get(item) ?? []) animation.cancel();
  running.delete(item);
}

function parts(item: HTMLDetailsElement) {
  return {
    answer: item.querySelector<HTMLElement>(ANSWER),
    text: item.querySelector<HTMLElement>(TEXT),
  };
}

function open(item: HTMLDetailsElement) {
  stop(item);
  delete item.dataset.closing;
  item.open = true;
  const { answer, text } = parts(item);
  if (!answer || !text) return Promise.resolve();
  const layout = ms('--dur-layout', 430);
  const height = answer.offsetHeight;
  const pad = getComputedStyle(answer).paddingBlockEnd;
  const animations = [
    answer.animate(
      [
        { blockSize: '0px', paddingBlockEnd: '0px', overflow: 'clip' },
        { blockSize: `${height}px`, paddingBlockEnd: pad, overflow: 'clip' },
      ],
      { duration: layout, easing: token('--ease-in-out') || 'ease-in-out' },
    ),
    text.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: ms('--dur-state', 240),
      delay: ms('--dur-feedback', 140),
      easing: token('--ease-out-soft') || 'ease-out',
      fill: 'backwards',
    }),
  ];
  running.set(item, animations);
  return Promise.all(animations.map((a) => a.finished)).then(
    () => running.delete(item),
    () => undefined,
  );
}

function close(item: HTMLDetailsElement) {
  stop(item);
  const { answer, text } = parts(item);
  if (!answer || !text) {
    item.open = false;
    return Promise.resolve();
  }
  item.dataset.closing = '';
  const duration = ms('--dur-layout', 430) * 0.65;
  const animations = [
    answer.animate(
      [
        {
          blockSize: `${answer.offsetHeight}px`,
          paddingBlockEnd: getComputedStyle(answer).paddingBlockEnd,
          overflow: 'clip',
        },
        { blockSize: '0px', paddingBlockEnd: '0px', overflow: 'clip' },
      ],
      { duration, easing: token('--ease-in-out') || 'ease-in-out', fill: 'forwards' },
    ),
    text.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: duration * 0.5,
      easing: token('--ease-in') || 'ease-in',
      fill: 'forwards',
    }),
  ];
  running.set(item, animations);
  return Promise.all(animations.map((a) => a.finished)).then(
    () => {
      item.open = false;
      delete item.dataset.closing;
      stop(item);
    },
    () => undefined,
  );
}

function toggle(item: HTMLDetailsElement) {
  const opening = !item.open || item.dataset.closing !== undefined;
  if (!opening) return void close(item);

  // Le nom du groupe survit au retrait de l'attribut (clics rapprochés).
  const name = item.getAttribute('name') ?? item.dataset.group;
  const group = name
    ? [
        ...document.querySelectorAll<HTMLDetailsElement>(
          `${ITEM}[data-group="${name}"], ${ITEM}[name="${name}"]`,
        ),
      ]
    : [item];
  const others = group.filter((other) => other !== item && other.open);
  // Exclusivité tenue à la main le temps de l'animation (voir plus haut).
  for (const member of group) {
    member.dataset.group = name ?? '';
    member.removeAttribute('name');
  }
  const done = [open(item), ...others.map(close)];
  void Promise.all(done).then(() => {
    if (!name || group.some((member) => running.has(member))) return;
    if (group.filter((member) => member.open).length > 1) return;
    for (const member of group) member.setAttribute('name', name);
  });
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
