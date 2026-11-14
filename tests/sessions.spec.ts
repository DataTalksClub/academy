import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { mockApi } from './helpers';

const H = {
  a: 'The AI skills Berlin companies now hire developers for',
  b: 'Becoming layoff-proof as a developer in Berlin',
  c: 'Show employers you can ship software with AI',
};

test('sessions page shows all three sessions, the form and an OG image', async ({ page }) => {
  await mockApi(page);
  await page.goto('sessions/');
  await expect(page.locator('[data-hero-sessions] li')).toHaveCount(3);
  await expect(page.locator('[data-session-id]')).toHaveCount(3);
  await expect(page.locator('[data-session-id]').nth(0)).toContainText('Monday 23 November');
  await expect(page.locator('[data-session-id]').nth(1)).toContainText('Monday 30 November');
  await expect(page.locator('[data-session-id]').nth(2)).toContainText('Monday 7 December');
  await expect(page.locator('h1')).toHaveText(H.a);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\/sessions\.png$/);
  await expect(page.locator('#register form')).toBeVisible();
  // Meetup RSVP buttons stay hidden until rsvp_published is true.
  await expect(page.locator('[data-rsvp]')).toHaveCount(0);
  await expect(page.locator('a[href*="meetup.com"]')).toHaveCount(0);
});

for (const [v, text] of Object.entries(H)) {
  test(`utm_content=${v} picks the headline`, async ({ page }) => {
    await mockApi(page);
    await page.goto(`sessions/?utm_content=${v}`);
    await expect(page.locator('h1')).toHaveText(text);
  });
}

test('unknown utm_content shows headline A', async ({ page }) => {
  await mockApi(page);
  await page.goto('sessions/?utm_content=zzz');
  await expect(page.locator('h1')).toHaveText(H.a);
});

test('page copy has no placeholders, no dashes as punctuation and no live-coding promises', async ({ page }) => {
  await mockApi(page);
  await page.goto('sessions/');
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/PLACEHOLDER/i);
  expect(text).not.toMatch(/[—–]/);
  expect(text).not.toMatch(/ - /);
  expect(text).not.toContain('·');
  expect(text).not.toMatch(/live coding|live demo|hands-on|merged pull request|build live|one-hour/i);
  expect(text).toContain('AI engineering vs agentic engineering');
  expect(text).toContain('Agentic engineering: how I build software with coding agents');
  expect(text).toContain('AI engineering: how to build apps on top of LLMs');
  await page.goto('sessions/materials/');
  const qr = await page.locator('main').innerText();
  expect(qr).not.toMatch(/PLACEHOLDER|[—–]| - /);
  expect(qr).not.toMatch(/live coding|live demo|hands-on|merged pull request|the code/i);
});

test('form posts survey answers as source=layoff_proof with channel UTMs, then shows calendar links', async ({ page }) => {
  const api = await mockApi(page);
  await page.goto('sessions/?utm_source=genau&utm_medium=telegram&utm_campaign=hireable_with_ai&utm_content=b');
  const form = page.locator('#register form');
  await form.locator('input[name="email"]').fill('dev+lp@dtcdev.click');
  await form.locator('input[name="name"]').fill('Ada');
  await form.locator('input[name="sessions"][value="session-2"]').uncheck();
  await form.locator('input[name="track_interest"][value="both"]').check();
  await form.locator('input[name="status"][value="job_hunting"]').check();
  await form.locator('input[name="years_dev"]').fill('7');
  await form.locator('input[name="based_in"][value="berlin"]').check();
  await form.locator('input[name="bildungsgutschein"][value="dont_know"]').check();
  await form.locator('textarea[name="free_text"]').fill('evals');
  await form.locator('input[name="academy_optin"]').check();
  await form.locator('button[type="submit"]').click();

  await expect(page.locator('#register [data-success]')).toBeVisible();
  expect(api.signups).toHaveLength(1);
  expect(api.signups[0].postDataJSON()).toMatchObject({
    source: 'layoff_proof',
    form: 'main',
    email: 'dev+lp@dtcdev.click',
    name: 'Ada',
    sessions: ['session-1', 'session-3'],
    track_interest: 'both',
    status: 'job_hunting',
    years_dev: '7',
    based_in: 'berlin',
    bildungsgutschein: 'dont_know',
    free_text: 'evals',
    academy_optin: 'yes',
    page: '/sessions/',
    utm_source: 'genau',
    utm_medium: 'telegram',
    utm_campaign: 'hireable_with_ai',
    utm_content: 'b',
  });
  // Calendar links only for the picked sessions plus the all-in-one file.
  const cal = page.locator('[data-calendar-session]:visible');
  await expect(cal).toHaveCount(2);
  await expect(page.locator('[data-calendar] a[href$="hireable-with-ai.ics"]')).toBeVisible();
  const pvPages = () => api.pvs.map((r) => r.postDataJSON().page);
  await expect.poll(pvPages).toContain('/form/sessions-submit');
  await expect.poll(pvPages).toContain('/form/sessions-success');
});

test('form needs at least one session and an email', async ({ page }) => {
  const api = await mockApi(page);
  await page.goto('sessions/');
  const form = page.locator('#register form');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-error="invalid"]')).toBeVisible();
  await form.locator('input[name="email"]').fill('dev+x@dtcdev.click');
  for (const id of ['session-1', 'session-2', 'session-3']) await form.locator(`input[name="sessions"][value="${id}"]`).uncheck();
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-error="sessions"]')).toBeVisible();
  expect(api.signups).toHaveLength(0);
});

test('failed signup shows the error and keeps the form', async ({ page }) => {
  await mockApi(page, '500');
  await page.goto('sessions/');
  const form = page.locator('#register form');
  await form.locator('input[name="email"]').fill('dev+x@dtcdev.click');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-error="failed"]')).toBeVisible();
  await expect(form).toBeVisible();
});

test('QR form posts form=qr with the session from the URL', async ({ page }) => {
  const api = await mockApi(page);
  await page.goto('sessions/materials/?session=2&utm_source=zoom&utm_medium=qr&utm_campaign=hireable_with_ai&utm_content=session2');
  await expect(page.locator('h1')).toHaveText('Get the recording and materials');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  const form = page.locator('#register form');
  await form.locator('input[name="email"]').fill('dev+qr@dtcdev.click');
  await form.locator('input[name="status"][value="employed_upskilling"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#register [data-success]')).toBeVisible();
  expect(api.signups[0].postDataJSON()).toMatchObject({
    source: 'layoff_proof',
    form: 'qr',
    session: 'session-2',
    email: 'dev+qr@dtcdev.click',
    status: 'employed_upskilling',
    utm_source: 'zoom',
    utm_medium: 'qr',
    utm_content: 'session2',
  });
  expect(api.signups[0].postDataJSON().sessions).toBeUndefined();
  await expect.poll(() => api.pvs.map((r) => r.postDataJSON().page)).toContain('/form/materials-success');
});

test('QR form without a valid session does not post', async ({ page }) => {
  const api = await mockApi(page);
  await page.goto('sessions/materials/');
  const form = page.locator('#register form');
  await form.locator('input[name="email"]').fill('dev+qr@dtcdev.click');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-error="failed"]')).toBeVisible();
  expect(api.signups).toHaveLength(0);
});

test('ics files carry the per-session Zoom link and the right times', async ({ request, baseURL }) => {
  const zoom = {
    'session-1': ['84099607571', '20261123T160000Z'],
    'session-2': ['86910927132', '20261130T160000Z'],
    'session-3': ['89929618442', '20261207T160000Z'],
  } as const;
  for (const [id, [meeting, start]] of Object.entries(zoom)) {
    const res = await request.get(`${baseURL}sessions/${id}.ics`);
    expect(res.status()).toBe(200);
    const body = (await res.text()).replace(/\r\n /g, '');
    expect(body).toContain('BEGIN:VCALENDAR');
    expect(body).toContain(`DTSTART:${start}`);
    expect(body).toContain(`zoom.us/j/${meeting}`);
    expect(body).not.toMatch(/live coding|live demo|hands-on|merged pull request/i);
    expect(body.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    for (const other of Object.values(zoom)) if (other[0] !== meeting) expect(body).not.toContain(other[0]);
  }
  const all = (await (await request.get(`${baseURL}sessions/hireable-with-ai.ics`)).text()).replace(/\r\n /g, '');
  expect(all.match(/BEGIN:VEVENT/g)).toHaveLength(3);
  expect(all).not.toMatch(/live coding|live demo|hands-on|merged pull request/i);
});

test('old /layoff-proof/ link redirects to /sessions/ and keeps the query', async ({ page }) => {
  await mockApi(page);
  await page.goto('layoff-proof/?utm_source=linkedin&utm_content=c');
  await page.waitForURL(/sessions\/\?utm_source=linkedin&utm_content=c/);
  await expect(page.locator('h1')).toHaveText(H.c);
});

test('QR codes are committed as PNG and SVG for each session', () => {
  for (const n of [1, 2, 3]) {
    const png = readFileSync(`public/qr/session-${n}.png`);
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect(existsSync(`public/qr/session-${n}.svg`)).toBe(true);
    expect(readFileSync(`public/qr/session-${n}.svg`, 'utf8')).toContain('<svg');
  }
});
