import { test, expect } from '@playwright/test';
import { mockApi } from './helpers';

test('layoff-proof page renders all 3 sessions and OG image', async ({ page }) => {
  await mockApi(page);
  await page.goto('layoff-proof/');
  await expect(page.locator('[data-session-id]')).toHaveCount(3);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\/layoff-proof\.png$/);
});

test('layoff-proof form submits source=layoff_proof with UTMs and sends form pv events', async ({ page }) => {
  const api = await mockApi(page);
  await page.goto('layoff-proof/?utm_source=linkedin&utm_medium=social&utm_campaign=lp&utm_content=var2');

  const form = page.locator('[data-layoff-form] form');
  await form.locator('input[name="email"]').fill('dev+lp@dtcdev.click');
  await form.locator('input[name="name"]').fill('Ada');
  await form.locator('input[name="sessions"][value="session-2"]').uncheck();
  await form.locator('input[name="status"][value="job_hunting"]').check();
  await form.locator('input[name="berlin_germany"][value="yes"]').check();
  await form.locator('input[name="bildungsgutschein"][value="yes"]').check();
  await form.locator('button[type="submit"]').click();

  await expect(page.locator('[data-layoff-form] [data-success]')).toBeVisible();
  expect(api.signups).toHaveLength(1);
  expect(api.signups[0].postDataJSON()).toMatchObject({
    source: 'layoff_proof',
    email: 'dev+lp@dtcdev.click',
    name: 'Ada',
    sessions: ['session-1', 'session-3'],
    status: 'job_hunting',
    berlin_germany: 'yes',
    bildungsgutschein: 'yes',
    utm_source: 'linkedin',
    utm_medium: 'social',
    utm_campaign: 'lp',
    utm_content: 'var2',
  });

  const pvPages = api.pvs.map((r) => r.postDataJSON().page);
  expect(pvPages).toContain('/form/layoff-proof-submit');
  expect(pvPages).toContain('/form/layoff-proof-success');
});
