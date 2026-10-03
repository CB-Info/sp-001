// Capture une URL à une largeur donnée, page entière ou viewport.
// Usage : node scripts/shot.mjs <url> <sortie.png> [largeur=1440] [hauteur=900] [--full] [--reduced]
// Le navigateur est celui de Playwright ; PW_CHROMIUM permet d'en imposer un autre.
import { chromium } from '@playwright/test';

const [url, out, width = '1440', height = '900', ...flags] = process.argv.slice(2);
if (!url || !out) {
  console.error(
    'usage: node scripts/shot.mjs <url> <out.png> [width] [height] [--full] [--reduced]',
  );
  process.exit(1);
}
const browser = await chromium.launch(
  process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
);
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  reducedMotion: flags.includes('--reduced') ? 'reduce' : 'no-preference',
});
const fullPage = flags.includes('--full');
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
if (fullPage) {
  // Les images hors écran sont en loading="lazy" : on parcourt la page pour les
  // déclencher, on attend qu'elles soient décodées, puis on revient en haut.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    // decode() ne se résout jamais pour une image restée hors flux (masquée) : on borne.
    const decoded = Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    await Promise.race([decoded, new Promise((resolve) => setTimeout(resolve, 4000))]);
    scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle').catch(() => {});
}
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage });
await browser.close();
console.log('capture :', out);
