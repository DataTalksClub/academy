// Full-page screenshots of a deployed preview: home + one track page, desktop 1440 and mobile 390.
// Usage: node scripts/preview-shots.mjs <baseUrl> <prefix> [outDir]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const [base, prefix, outDir = join(homedir(), 'tmp/agent-reports/2026-11-15-academy-design-variants')] = process.argv.slice(2);
if (!base || !prefix) throw new Error('usage: preview-shots.mjs <baseUrl> <prefix> [outDir]');
mkdirSync(outDir, { recursive: true });
const pages = [
  ['home', ''],
  ['track', 'agentic-engineering/'],
];
const viewports = [
  ['desktop', { width: 1440, height: 900 }, 1],
  ['mobile', { width: 390, height: 844 }, 2],
];
const browser = await chromium.launch();
for (const [vpName, viewport, dpr] of viewports) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, isMobile: vpName === 'mobile', hasTouch: vpName === 'mobile' });
  const page = await ctx.newPage();
  for (const [pName, path] of pages) {
    const res = await page.goto(base.replace(/\/?$/, '/') + path, { waitUntil: 'networkidle' });
    if (!res || res.status() !== 200) throw new Error(`${path} -> ${res && res.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const file = join(outDir, `${prefix}-${pName}-${vpName}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
  await ctx.close();
}
await browser.close();
