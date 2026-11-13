import { test, expect } from '@playwright/test';
import { TRACKS, mockApi } from './helpers';

const PAGES = ['', ...TRACKS.map((t) => `${t}/`), 'privacy/', 'impressum/'];

test('7. no third-party requests, no cookies, empty storage', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const foreign: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.protocol.startsWith('http') && u.origin !== origin && u.origin !== 'http://localhost:8787') foreign.push(r.url());
  });
  await mockApi(page);
  for (const p of PAGES) {
    await page.goto(p);
    await page.waitForLoadState('networkidle');
  }
  expect(foreign).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
});

test('8. footer links to privacy and impressum work on every page', async ({ page, baseURL }) => {
  const path = new URL(baseURL!).pathname;
  await mockApi(page);
  for (const p of PAGES) {
    for (const [name, h1] of [['Privacy', 'Privacy'], ['Impressum', 'Impressum']]) {
      await page.goto(p);
      const link = page.locator('footer').getByRole('link', { name, exact: true });
      await expect(link).toHaveAttribute('href', new RegExp(`^${path}${name.toLowerCase()}/`));
      await link.click();
      await expect(page.locator('h1')).toHaveText(h1);
    }
  }
});

test('assets and logo load under the base path', async ({ page }) => {
  const bad: string[] = [];
  page.on('response', (r) => {
    if (r.status() >= 400 && !r.url().includes('8787')) bad.push(`${r.status()} ${r.url()}`);
  });
  await mockApi(page);
  for (const p of PAGES) {
    await page.goto(p);
    await page.waitForLoadState('networkidle');
  }
  expect(bad).toEqual([]);
});

test('9. nothing overflows horizontally at 390px', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await mockApi(page);
  for (const p of PAGES) {
    await page.goto(p);
    await page.locator('details').evaluateAll((els) => els.forEach((e) => ((e as HTMLDetailsElement).open = true)));
    const w = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, i: window.innerWidth }));
    expect(w.s, p).toBeLessThanOrEqual(w.i);
  }
});

test('home page links to both landings and shows both tracks', async ({ page }) => {
  await mockApi(page);
  await page.goto('');
  await expect(page.locator('[data-track-panel]')).toHaveCount(2);
  for (const t of TRACKS) await expect(page.locator(`[data-track-panel=${t}] a.btn`)).toHaveAttribute('href', new RegExp(`${t}/`));
});

test('meta: canonical, og image, lang', async ({ page }) => {
  await mockApi(page);
  await page.goto(`${TRACKS[0]}/`);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /agentic-engineering\/$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\/agentic-engineering\.png$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('impressum/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});
