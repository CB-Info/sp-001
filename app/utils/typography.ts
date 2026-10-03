/**
 * Typographie française du contenu.
 *
 * Le contenu s'écrit au clavier (apostrophe droite, espace simple avant « : ») ;
 * ces règles produisent la composition correcte une seule fois, à la source, au
 * lieu de semer des caractères invisibles dans les données.
 *
 * L'espace insécable est U+00A0 partout, même là où l'usage veut une fine
 * (U+202F) : Tektur, la police des titres, n'a pas de glyphe U+202F.
 */
const NBSP = ' ';

const rules: ReadonlyArray<readonly [RegExp, string]> = [
  // Apostrophe typographique entre deux lettres : l'art → l’art.
  [/(?<=\p{L})'(?=\p{L})/gu, '’'],
  // Insécable avant la ponctuation haute et le guillemet fermant…
  [/ (?=[:;!?»])/g, NBSP],
  // … et après le guillemet ouvrant.
  [/« /g, `«${NBSP}`],
  // Pas de mot d'une lettre en fin de ligne (« grâce à un », « chacun a sa place »).
  [/(?<=(?:^|\s)[aàyAÀY]) /gu, NBSP],
];

export function typeset(text: string): string {
  return rules.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);
}

/** Applique `typeset` à toutes les chaînes d'une structure de contenu, sans changer son type. */
export function typesetDeep<T>(value: T): T {
  if (typeof value === 'string') return typeset(value) as T;
  if (Array.isArray(value)) return value.map((item) => typesetDeep(item)) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, typesetDeep(item)]),
    ) as T;
  }
  return value;
}
