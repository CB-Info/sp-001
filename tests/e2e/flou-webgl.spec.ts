import { expect, test } from '@playwright/test';

/**
 * Overdrive O1 : le flou WebGL du hero. Le navigateur de test rend WebGL sur le
 * processeur (SwiftShader), que le site écarte à dessein : on lui fait passer pour
 * un GPU matériel, dans une petite fenêtre pour garder des images rapides.
 */
test.use({
  viewport: { width: 800, height: 500 },
  launchOptions: {
    executablePath: process.env.PW_CHROMIUM || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  },
});

test.skip(({ isMobile }) => isMobile, 'réservé au pointeur fin');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      attributes?: WebGLContextAttributes,
    ) {
      if (attributes) delete attributes.failIfMajorPerformanceCaveat;
      return getContext.call(this, type, attributes);
    } as typeof getContext;
    const getParameter = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function (
      this: WebGL2RenderingContext,
      name: number,
    ) {
      // UNMASKED_RENDERER_WEBGL
      return name === 0x9246 ? 'GPU de test' : getParameter.call(this, name);
    };
  });
  await page.goto('/');
});

test('le flou suit le pointeur, puis rend la photo nette', async ({ page }) => {
  const canvas = page.locator('.hero__blur');
  await expect(canvas).toBeAttached({ timeout: 10_000 });
  await expect(canvas).toBeHidden();

  await page.mouse.move(80, 250);
  for (let step = 1; step <= 4; step++) await page.mouse.move(80 + step * 150, 250);
  await expect(canvas).toBeVisible();
  await expect(canvas).toBeHidden({ timeout: 5_000 });
});

test('le mouvement réduit retire le canvas', async ({ page }) => {
  await expect(page.locator('.hero__blur')).toBeAttached({ timeout: 10_000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero__blur')).toHaveCount(0);
});
