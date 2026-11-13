// Dev helper: full-page screenshots of every page at 390 and 1440, plus success and error states.
// Usage: node scripts/shots.mjs [baseUrl]   (site must be built with PUBLIC_API_URL=http://localhost:8787 and previewed)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:4321/';
const out = new URL('../.screenshots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const pages = { home: '', agentic: 'agentic-engineering/', ai: 'ai-engineering/', privacy: 'privacy/', impressum: 'impressum/' };
const sizes = { m: { width: 390, height: 844 }, d: { width: 1440, height: 900 } };
const browser = await chromium.launch();

async function open(size, mode) {
  const ctx = await browser.newContext({ viewport: size, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.route('http://localhost:8787/**', (r) =>
    mode === 'fail' ? r.fulfill({ status: 500, body: '{}' }) : r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  );
  return page;
}

for (const [sk, size] of Object.entries(sizes)) {
  for (const [name, path] of Object.entries(pages)) {
    const page = await open(size, 'ok');
    await page.goto(base + path);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}${name}-${sk}.png`, fullPage: true });
    await page.close();
  }
  for (const mode of ['success', 'error']) {
    const page = await open(size, mode === 'error' ? 'fail' : 'ok');
    await page.goto(base + 'agentic-engineering/');
    await page.fill('#email-hero', 'ada@example.com');
    await page.click('#signup-hero button[type=submit]');
    await page.waitForTimeout(500);
    if (mode === 'success') await page.click('#signup-hero .chip[data-value=berlin]');
    await page.waitForTimeout(200);
    await page.locator('#hero').screenshot({ path: `${out}hero-${mode}-${sk}.png` });
    await page.close();
  }
}
await browser.close();
