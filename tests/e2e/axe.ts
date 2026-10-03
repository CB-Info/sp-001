import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/** Normes vérifiées : WCAG 2.2 niveau AA (avec les critères A et AA antérieurs). */
const WCAG_22_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Violations axe résumées en une ligne chacune, lisibles dans le rapport d'échec. */
export async function axeViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_22_AA).analyze();
  return violations.map(
    (violation) =>
      `${violation.id} (${violation.nodes.length}) : ${violation.nodes
        .slice(0, 3)
        .map((node) => node.target.join(' '))
        .join(' | ')}`,
  );
}
