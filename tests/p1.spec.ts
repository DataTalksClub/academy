import { test, expect } from '@playwright/test';
import { mockApi, join } from './helpers';

test('home, course, sessions, and faq pages include expected JSON-LD and answer blocks', async ({ page }) => {
  const checks: { path: string; types: string[]; snippet: string }[] = [
    {
      path: '.',
      types: ['Organization'],
      snippet: 'DataTalks.Club Academy is a full-time live program in English for experienced developers in Germany',
    },
    {
      path: 'agentic-engineering/',
      types: ['Course', 'FAQPage'],
      snippet: 'Agentic Engineering is a 3-month full-time live program in English for developers with 2+ years of experience in Germany.',
    },
    {
      path: 'ai-engineering/',
      types: ['Course', 'FAQPage'],
      snippet: 'AI Engineering is a 3-month full-time live program in English for developers with 2+ years of experience in Germany.',
    },
    {
      path: 'sessions/',
      types: ['Event'],
      snippet: 'Hireable With AI is a series of three free online sessions',
    },
    {
      path: 'faq/',
      types: ['FAQPage'],
      snippet: 'Frequently Asked Questions',
    },
  ];

  for (const c of checks) {
    const res = await page.goto(c.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('main')).toContainText(c.snippet);
    const ldRaw = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = ldRaw.map((raw) => JSON.parse(raw)['@type']);
    for (const t of c.types) {
      expect(types).toContain(t);
    }
  }
});

test('faq page appears in sitemap and signup success includes german_level and full_day_availability', async ({ page }) => {
  const sitemap = await page.request.get('sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('/faq/');

  const api = await mockApi(page);
  await page.goto('agentic-engineering/');
  await join(page, 'dev+test@dtcdev.click');
  await expect(page.locator('#signup-hero [data-success]')).toBeVisible();

  await page.locator('#signup-hero .chip[data-group="german_level"][data-value="b2"]').click();
  await expect(page.locator('#signup-hero .chip[data-group="german_level"][data-value="b2"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#signup-hero .chip[data-group="full_day_availability"][data-value="yes"]').click();
  await expect(page.locator('#signup-hero .chip[data-group="full_day_availability"][data-value="yes"]')).toHaveAttribute('aria-pressed', 'true');

  const payloads = api.signups.map((req) => req.postDataJSON());
  expect(payloads.some((r) => r.answers?.german_level === 'b2')).toBe(true);
  expect(payloads.some((r) => r.answers?.full_day_availability === 'yes')).toBe(true);
});
