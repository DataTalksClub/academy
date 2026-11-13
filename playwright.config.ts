import { defineConfig, devices } from '@playwright/test';

const rawBase = process.env.BASE_PATH || '/';
const base = rawBase === '/' ? '/' : '/' + rawBase.replace(/^\/+|\/+$/g, '') + '/';
const PORT = 4321;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://localhost:${PORT}${base}` },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npx astro build && npx astro preview --ignore-lock --port ${PORT}`,
    url: `http://localhost:${PORT}${base}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      PUBLIC_API_URL: 'http://localhost:8787',
      SITE_URL: 'http://localhost:4321',
      BASE_PATH: base,
    },
  },
});
