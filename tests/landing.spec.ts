import { test, expect } from '@playwright/test';
import { API, SECTIONS, TRACKS, join, mockApi } from './helpers';

async function structure(page: import('@playwright/test').Page) {
  return page.evaluate(() => ({
    sections: Array.from(document.querySelectorAll('main > section')).map((s) => s.id),
    headings: Array.from(document.querySelectorAll('h1,h2,h3,h4')).map((h) => h.tagName),
    fields: Array.from(document.querySelectorAll('form input, form button')).map(
      (e) => `${e.tagName}:${(e as HTMLInputElement).name || (e as HTMLInputElement).type}`,
    ),
    labels: Array.from(document.querySelectorAll('main .label')).map((e) => e.textContent!.replace(/TRACK [AB]/, '')),
    details: document.querySelectorAll('details').length,
    modules: document.querySelectorAll('#syllabus ol li').length,
    outcomes: document.querySelectorAll('#outcomes ol li').length,
  }));
}

test('1. both landings have every section in order and identical structure', async ({ page }) => {
  const seen = [];
  for (const t of TRACKS) {
    await mockApi(page);
    await page.goto(`${t}/`);
    const s = await structure(page);
    expect(s.sections).toEqual(SECTIONS);
    expect(s.modules).toBe(16);
    expect(s.outcomes).toBe(7);
    seen.push(s);
  }
  expect(seen[0]).toEqual(seen[1]);
  await expect(page.locator('h1')).toHaveCount(1);
});

for (const t of TRACKS) {
  test.describe(t, () => {
    test('2. email is required and invalid input sends nothing', async ({ page }) => {
      const api = await mockApi(page);
      await page.goto(`${t}/`);
      const input = page.locator('#email-hero');
      await expect(input).toHaveAttribute('type', 'email');
      await expect(input).toHaveAttribute('required', '');
      for (const bad of ['', 'not-an-email']) {
        await page.fill('#email-hero', bad);
        await page.click('#signup-hero button[type=submit]');
        await expect(page.locator('#signup-hero [data-error=invalid]')).toBeVisible();
        await expect(page.locator('#signup-hero [data-error=invalid]')).toHaveText('Please enter a valid email address.');
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        await expect(input).toBeFocused();
      }
      expect(api.signups).toHaveLength(0);
    });

    test('3. valid signup posts, shows success in both places, chips and survey link', async ({ page }) => {
      const api = await mockApi(page);
      await page.goto(`${t}/?utm_source=test&utm_campaign=c1&utm_content=a`);
      await join(page, ' ada@example.com ');
      await expect(page.locator('#signup-hero [data-success]')).toBeVisible();
      await expect(page.locator('#signup-join [data-success]')).toBeAttached();
      await expect(page.locator('#signup-hero [data-success-title]')).toBeFocused();
      expect(api.signups).toHaveLength(1);
      const body = api.signups[0].postDataJSON();
      expect(body).toMatchObject({
        email: 'ada@example.com',
        track: t,
        consent_version: '2026-11-13.v1',
        utm_source: 'test',
        utm_campaign: 'c1',
        utm_content: 'a',
        website: '',
        page: `/${t}/`,
      });
      expect(body).not.toHaveProperty('utm_term');
      expect(api.signups[0].method()).toBe('POST');
      expect(api.signups[0].url()).toBe(`${API}/signup`);

      // The final form also shows success.
      await page.locator('#signup-join').scrollIntoViewIfNeeded();
      await expect(page.locator('#signup-join [data-success]')).toBeVisible();
      await expect(page.locator('#signup-join form')).toBeHidden();

      await page.click('#signup-hero .chip[data-value=berlin]');
      await expect(page.locator('#signup-hero .chip[data-value=berlin]')).toHaveAttribute('aria-pressed', 'true');
      await expect.poll(() => api.signups.length).toBe(2);
      expect(api.signups[1].postDataJSON()).toMatchObject({ email: 'ada@example.com', track: t, answers: { location: 'berlin' } });
      await page.click('#signup-hero .chip[data-value=self]');
      await expect.poll(() => api.signups.length).toBe(3);
      expect(api.signups[2].postDataJSON().answers).toEqual({ funding: 'self' });

      const href = await page.locator('#signup-hero [data-survey]').getAttribute('href');
      const u = new URL(href!);
      expect(u.hostname).toBe('docs.google.com');
      expect(u.searchParams.get('entry.1984241375')).toBe(t === 'agentic-engineering' ? 'A. Agentic engineering' : 'B. AI engineering');
      expect(u.searchParams.get('entry.1840392648')).toBe('ada@example.com');
    });

    for (const mode of ['500', 'abort'] as const) {
      test(`4. failing API (${mode}) shows the error and no success`, async ({ page }) => {
        await mockApi(page, mode);
        await page.goto(`${t}/`);
        await join(page);
        await expect(page.locator('#signup-hero [data-error=failed]')).toBeVisible();
        await expect(page.locator('#signup-hero [data-error=failed]')).toContainText("That didn't go through.");
        await expect(page.locator('#signup-hero [data-success]')).toBeHidden();
        await expect(page.locator('#signup-hero button[type=submit]')).toBeEnabled();
      });
    }

    test('5. a filled honeypot is passed through', async ({ page }) => {
      const api = await mockApi(page);
      await page.goto(`${t}/`);
      await page.locator('#signup-hero input[name=website]').fill('http://spam.example', { force: true });
      await join(page);
      await expect.poll(() => api.signups.length).toBe(1);
      expect(api.signups[0].postDataJSON().website).toBe('http://spam.example');
    });

    test('6. /pv is called once per page load with the page path', async ({ page }) => {
      const api = await mockApi(page);
      await page.goto(`${t}/?utm_source=x`);
      await expect.poll(() => api.pvs.length).toBe(1);
      await page.waitForTimeout(300);
      expect(api.pvs).toHaveLength(1);
      expect(api.pvs[0].postDataJSON()).toMatchObject({ page: `/${t}/`, utm_source: 'x' });
    });

    test('10. sticky bar shows after the hero form and hides after signup', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile only');
      await mockApi(page);
      await page.goto(`${t}/`);
      const sticky = page.locator('[data-sticky]');
      await expect(sticky).toBeHidden();
      await page.locator('#facts').scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, document.querySelector('#outcomes')!.getBoundingClientRect().top + scrollY));
      await expect(sticky).toBeVisible();
      await page.locator('#join').scrollIntoViewIfNeeded();
      await page.evaluate(() => document.querySelector('#signup-join')!.scrollIntoView());
      await expect(sticky).toBeHidden();
      await page.evaluate(() => window.scrollTo(0, document.querySelector('#fit')!.getBoundingClientRect().top + scrollY));
      await expect(sticky).toBeVisible();
      await sticky.locator('button').click();
      await expect(page.locator('input[name=email]:focus')).toHaveCount(1);
      await join(page);
      await expect(page.locator('#signup-hero [data-success]')).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, document.querySelector('#fit')!.getBoundingClientRect().top + scrollY));
      await expect(sticky).toBeHidden();
    });
  });
}

test('/pv is skipped for automated browsers (navigator.webdriver)', async ({ page }) => {
  const api = await mockApi(page, 'ok', { webdriver: true });
  await page.goto('');
  await page.waitForTimeout(500);
  expect(api.pvs).toHaveLength(0);
});

test('UTM parameters are carried to internal links', async ({ page }) => {
  await mockApi(page);
  await page.goto('?utm_source=s&utm_campaign=c');
  const href = await page.locator('main a.btn[href*="ai-engineering"]').getAttribute('href');
  expect(href).toContain('utm_source=s');
  expect(href).toContain('utm_campaign=c');
});
