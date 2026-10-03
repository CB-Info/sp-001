import { defineConfig, devices } from '@playwright/test';

/**
 * Tests e2e sur la sortie statique (`pnpm generate` d'abord) : ce qui est testé
 * est exactement ce qui sera déployé.
 *
 * PW_CHROMIUM permet de pointer un Chromium déjà installé (conteneurs, CI).
 */
const executablePath = process.env.PW_CHROMIUM || undefined;
const port = 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    locale: 'fr-FR',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'bureau',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        launchOptions: { executablePath },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 390, height: 844 },
        launchOptions: { executablePath },
      },
    },
  ],
  webServer: {
    command: `node scripts/serve-static.mjs ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
});
