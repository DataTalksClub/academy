import type { Page, Request } from '@playwright/test';

export const API = 'http://localhost:8787';
export const TRACKS = ['agentic-engineering', 'ai-engineering'] as const;
export const SECTIONS = ['hero', 'facts', 'outcomes', 'project', 'instructor', 'fit', 'syllabus', 'funding', 'admission', 'faq', 'join'];

export interface Api {
  signups: Request[];
  pvs: Request[];
}

/** Mock the signup API. `mode` controls what /signup answers. */
export async function mockApi(page: Page, mode: 'ok' | '500' | 'abort' = 'ok', opts: { webdriver?: boolean } = {}): Promise<Api> {
  const api: Api = { signups: [], pvs: [] };
  // Playwright sets navigator.webdriver; the site skips the beacon for it, so hide it unless asked.
  if (!opts.webdriver) await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  await page.route(`${API}/**`, async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (path === '/pv') {
      api.pvs.push(req);
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }
    if (path === '/signup') {
      api.signups.push(req);
      if (mode === 'abort') return route.abort();
      if (mode === '500') return route.fulfill({ status: 500, body: '{}' });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }
    return route.fulfill({ status: 404, body: '' });
  });
  return api;
}

/** Simulate a signup. Uses the hero form. */
export async function join(page: Page, email = 'ada@example.com') {
  await page.fill('#email-hero', email);
  await page.click('#signup-hero button[type=submit]');
}
