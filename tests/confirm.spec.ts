import { test, expect } from '@playwright/test';
import { API } from './helpers';

test('confirm page shows success when API confirms token', async ({ page }) => {
  await page.route(`${API}/confirm*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        title: 'Email Confirmed',
        message: 'Your spot on the Agentic Engineering shortlist is confirmed.',
        track: 'agentic-engineering',
        source: 'shortlist',
      }),
    });
  });

  await page.goto('confirm/?token=valid-token');
  await expect(page.locator('[data-confirm-title]')).toHaveText('Email Confirmed');
  await expect(page.locator('[data-confirm-message]')).toHaveText(
    'Your spot on the Agentic Engineering shortlist is confirmed.',
  );
  await expect(page.locator('[data-confirm-back]')).toHaveAttribute('href', /\/agentic-engineering\/$/);
});

test('confirm page shows clear error for invalid or expired token', async ({ page }) => {
  await page.route(`${API}/confirm*`, async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: false,
        error: 'expired_token',
        title: 'Confirmation Link Expired',
        message: 'This confirmation link has expired. Please submit the form again to get a new link.',
      }),
    });
  });

  await page.goto('confirm/?token=expired-token');
  await expect(page.locator('[data-confirm-title]')).toHaveText('Confirmation Link Expired');
  await expect(page.locator('[data-confirm-message]')).toContainText('expired');
});

test('confirm page shows clear error when token is missing', async ({ page }) => {
  await page.goto('confirm/');
  await expect(page.locator('[data-confirm-title]')).toHaveText('Invalid Confirmation Link');
  await expect(page.locator('[data-confirm-message]')).toContainText('missing a token');
});
