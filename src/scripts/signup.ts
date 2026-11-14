// Signup form, page-view beacon, UTM continuity and the sticky mobile bar.
// Vanilla, no storage, no cookies. The only network calls go to PUBLIC_API_URL.

const API = (import.meta.env.PUBLIC_API_URL || '').replace(/\/+$/, '');
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');
const CONSENT_VERSION = '2026-11-13.v1';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const TRACK_OPTION: Record<string, string> = {
  'agentic-engineering': 'A. Agentic engineering',
  'ai-engineering': 'B. AI engineering',
};
const SURVEY =
  'https://docs.google.com/forms/d/e/1FAIpQLSdl4f48ZsEV_9VBjUD8dHTHm9qMddnW75_2P7Uj5B6hC1IInQ/viewform?usp=pp_url';

const track = document.body.dataset.track || '';
const $$ = <T extends HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

function utm(): Record<string, string> {
  const q = new URLSearchParams(location.search);
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = q.get(k);
    if (v) out[k] = v;
  }
  return out;
}

function pagePath(): string {
  const p = location.pathname;
  return BASE && p.startsWith(BASE) ? p.slice(BASE.length) || '/' : p;
}

function referrer(): string {
  if (!document.referrer) return '';
  try {
    const r = new URL(document.referrer);
    return r.origin + r.pathname;
  } catch {
    return '';
  }
}

async function post(path: string, body: unknown, keepalive = false): Promise<boolean> {
  if (!API) return false;
  try {
    const res = await fetch(API + path, {
      method: 'POST',
      keepalive,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) return false;
    const data = await res.json().catch(() => null);
    return !!data && data.ok === true;
  } catch {
    return false;
  }
}

function sendPv(page: string) {
  if (!API || navigator.webdriver) return;
  const u = utm();
  fetch(API + '/pv', {
    method: 'POST',
    keepalive: true,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      page,
      utm_source: u.utm_source,
      utm_medium: u.utm_medium,
      utm_campaign: u.utm_campaign,
      utm_content: u.utm_content,
    }),
  }).catch(() => {});
}

// 1. Page-view beacon (errors swallowed).
sendPv(pagePath());

// 1b. Home page track-click event in the PV counter, broken down by UTM.
for (const link of $$<HTMLAnchorElement>('[data-track-click]')) {
  link.addEventListener('click', () => {
    const slug = link.dataset.trackClick;
    if (slug) sendPv(`/click/${slug}`);
  });
}

// 2. UTM continuity on internal links.
{
  const u = utm();
  if (Object.keys(u).length) {
    for (const a of $$<HTMLAnchorElement>('a[href]')) {
      const raw = a.getAttribute('href') || '';
      if (raw.startsWith('#') || /^(mailto|tel):/.test(raw) || a.hasAttribute('download')) continue;
      let target: URL;
      try {
        target = new URL(raw, location.href);
      } catch {
        continue;
      }
      if (target.origin !== location.origin) continue;
      for (const [k, v] of Object.entries(u)) if (!target.searchParams.has(k)) target.searchParams.set(k, v);
      a.setAttribute('href', target.pathname + target.search + target.hash);
    }
  }
}

// 3. Signup forms.
const signups = $$<HTMLElement>('[data-signup]');
let joinedEmail = '';

function showSuccess(from: HTMLElement) {
  for (const el of signups) {
    $$('form', el)[0].hidden = true;
    const ok = $$('[data-success]', el)[0];
    ok.hidden = false;
    const survey = $$<HTMLAnchorElement>('[data-survey]', ok)[0];
    survey.href =
      SURVEY +
      '&entry.1984241375=' +
      encodeURIComponent(TRACK_OPTION[track] || '') +
      '&entry.1840392648=' +
      encodeURIComponent(joinedEmail);
  }
  document.documentElement.dataset.joined = 'true';
  updateSticky();
  $$<HTMLElement>('[data-success-title]', from)[0].focus();
}

for (const el of signups) {
  const form = $$<HTMLFormElement>('form', el)[0];
  const input = $$<HTMLInputElement>('input[name="email"]', form)[0];
  const hp = $$<HTMLInputElement>('input[name="website"]', form)[0];
  const button = $$<HTMLButtonElement>('button[type="submit"]', form)[0];
  const errInvalid = $$('[data-error="invalid"]', form)[0];
  const errFailed = $$('[data-error="failed"]', form)[0];
  const label = button.textContent || '';
  // The button is disabled in the HTML so that a submit without this script
  // cannot put the email into the URL.
  button.disabled = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errFailed.hidden = true;
    const email = input.value.trim();
    input.value = email;
    if (!input.checkValidity() || !EMAIL_RE.test(email)) {
      errInvalid.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    errInvalid.hidden = true;
    input.removeAttribute('aria-invalid');
    button.disabled = true;
    button.textContent = 'Joining…';

    const ok = await post('/signup', {
      email,
      track,
      ...utm(),
      referrer: referrer(),
      page: pagePath(),
      lang: navigator.language,
      consent_version: CONSENT_VERSION,
      website: hp.value,
    });
    button.disabled = false;
    button.textContent = label;
    if (ok) {
      joinedEmail = email;
      showSuccess(el);
    } else {
      errFailed.hidden = false;
    }
  });

  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') && EMAIL_RE.test(input.value.trim())) {
      input.removeAttribute('aria-invalid');
      errInvalid.hidden = true;
    }
  });

  // Optional answers: each chip sends a second POST. A chip is shown as chosen
  // only once the answer is stored, and a failed request says so.
  const errAnswers = $$('[data-error="answers"]', el)[0];
  for (const chip of $$<HTMLButtonElement>('.chip', el)) {
    chip.addEventListener('click', async () => {
      const group = chip.dataset.group!;
      const peers = $$<HTMLButtonElement>(`.chip[data-group="${group}"]`);
      for (const e of $$('[data-error="answers"]')) e.hidden = true;
      for (const p of peers) p.disabled = true;
      const ok = await post('/signup', { email: joinedEmail, track, answers: { [group]: chip.dataset.value } });
      for (const p of peers) p.disabled = false;
      if (ok) {
        for (const p of peers) {
          p.setAttribute('aria-pressed', String(p.dataset.value === chip.dataset.value));
        }
      } else if (errAnswers) {
        errAnswers.hidden = false;
      }
    });
  }
}

// 2b. Hero headline variant by utm_content (a, b or c; anything else shows a).
{
  const holder = document.getElementById('hero-variants');
  const h1 = document.querySelector<HTMLElement>('[data-hero-headline]');
  const sub = document.querySelector<HTMLElement>('[data-hero-subhead]');
  if (holder && h1 && sub) {
    try {
      const variants = JSON.parse(holder.textContent || '{}') as Record<string, { headline: string; subhead: string }>;
      const v = (utm().utm_content || '').toLowerCase();
      const pick = v === 'b' || v === 'c' ? variants[v] : undefined;
      if (pick) {
        h1.textContent = pick.headline;
        sub.textContent = pick.subhead;
      }
      document.documentElement.dataset.variant = pick ? v : 'a';
    } catch {
      /* keep variant A */
    }
  }
}

// 2c. Scroll to the sessions form from the hero and final buttons.
for (const b of $$<HTMLAnchorElement>('[data-scroll-to-form-lp]')) {
  b.addEventListener('click', (e) => {
    const target = document.getElementById('register');
    if (!target) return;
    e.preventDefault();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    $$<HTMLInputElement>('input[name="email"]', target)[0]?.focus({ preventScroll: true });
  });
}

// 3b. Sessions lead forms (source=layoff_proof): the main survey form and the QR "recording" form.
const SOURCE = 'layoff_proof';
const val = (form: HTMLFormElement, name: string) =>
  $$<HTMLInputElement>(`input[name="${name}"]:checked`, form)[0]?.value || '';

for (const el of $$<HTMLElement>('[data-layoff-form]')) {
  const kind = el.dataset.formKind === 'qr' ? 'qr' : 'main';
  const form = $$<HTMLFormElement>('form', el)[0];
  const emailInput = $$<HTMLInputElement>('input[name="email"]', form)[0];
  const hp = $$<HTMLInputElement>('input[name="website"]', form)[0];
  const button = $$<HTMLButtonElement>('button[type="submit"]', form)[0];
  const errInvalid = $$('[data-error="invalid"]', form)[0];
  const errFailed = $$('[data-error="failed"]', form)[0];
  const errSessions = $$('[data-error="sessions"]', form)[0];
  const okBox = $$('[data-success]', el)[0];
  const label = button.textContent || '';
  const qrParam = new URLSearchParams(location.search).get('session') || '';
  const qrSession = /^[1-3]$/.test(qrParam) ? `session-${qrParam}` : '';
  button.disabled = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errFailed.hidden = true;
    if (errSessions) errSessions.hidden = true;
    const email = emailInput.value.trim();
    emailInput.value = email;
    if (!emailInput.checkValidity() || !EMAIL_RE.test(email)) {
      errInvalid.hidden = false;
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      return;
    }
    errInvalid.hidden = true;
    emailInput.removeAttribute('aria-invalid');

    const sessions = $$<HTMLInputElement>('input[name="sessions"]:checked', form).map((c) => c.value);
    if (kind === 'main' && sessions.length === 0) {
      if (errSessions) errSessions.hidden = false;
      return;
    }
    if (kind === 'qr' && !qrSession) {
      errFailed.hidden = false;
      return;
    }
    button.disabled = true;
    button.textContent = 'Sending…';

    const years = $$<HTMLInputElement>('input[name="years_dev"]', form)[0]?.value.trim() || '';
    const body: Record<string, unknown> = {
      source: SOURCE,
      form: kind,
      email,
      name: $$<HTMLInputElement>('input[name="name"]', form)[0]?.value.trim() || '',
      status: val(form, 'status'),
      academy_optin: $$<HTMLInputElement>('input[name="academy_optin"]', form)[0]?.checked ? 'yes' : '',
      ...utm(),
      referrer: referrer(),
      page: pagePath(),
      lang: navigator.language,
      consent_version: CONSENT_VERSION,
      website: hp.value,
    };
    if (kind === 'main') {
      Object.assign(body, {
        sessions,
        track_interest: val(form, 'track_interest'),
        years_dev: years,
        based_in: val(form, 'based_in'),
        bildungsgutschein: val(form, 'bildungsgutschein'),
        free_text: $$<HTMLTextAreaElement>('textarea[name="free_text"]', form)[0]?.value.trim() || '',
      });
    } else {
      body.session = qrSession;
    }

    const prefix = kind === 'qr' ? 'materials' : 'sessions';
    sendPv(`/form/${prefix}-submit`);
    const ok = await post('/signup', body);
    button.disabled = false;
    button.textContent = label;
    if (!ok) {
      errFailed.hidden = false;
      return;
    }
    sendPv(`/form/${prefix}-success`);
    form.hidden = true;
    okBox.hidden = false;
    if (kind === 'main') {
      // Calendar links only for the picked sessions, plus the all-in-one file.
      for (const li of $$<HTMLElement>('[data-calendar-session]', okBox)) {
        li.hidden = !sessions.includes(li.dataset.calendarSession || '');
      }
      for (const a of $$<HTMLAnchorElement>('[data-meetup]', okBox)) {
        a.addEventListener('click', () => sendPv(`/click/meetup-${a.dataset.meetup}`));
        a.hidden = !sessions.includes(a.dataset.meetup || '');
      }
    }
    $$<HTMLElement>('[data-success-title]', okBox)[0]?.focus();
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.getAttribute('aria-invalid') && EMAIL_RE.test(emailInput.value.trim())) {
      emailInput.removeAttribute('aria-invalid');
      errInvalid.hidden = true;
    }
  });
}

// 4. Scroll-to-form buttons (header, sticky bar).
function nearestForm(): HTMLElement | undefined {
  const mid = innerHeight / 2;
  return signups
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { el, d: Math.abs((r.top + r.bottom) / 2 - mid) };
    })
    .sort((a, b) => a.d - b.d)[0]?.el;
}
for (const b of $$('[data-scroll-to-form]')) {
  b.addEventListener('click', (e) => {
    const form = b.closest('[data-sticky]') ? nearestForm() : signups[0];
    if (!form) return;
    e.preventDefault();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    $$<HTMLInputElement>('input[name="email"]', form)[0]?.focus({ preventScroll: true });
  });
}

// 5. Sticky bar: visible once the hero form is above the viewport, hidden while
// the final form is in view and after a successful signup.
const sticky = $$('[data-sticky]')[0];
const state = { heroPast: false, joinVisible: false };
function updateSticky() {
  if (!sticky) return;
  const joined = document.documentElement.dataset.joined === 'true';
  sticky.dataset.visible = String(state.heroPast && !state.joinVisible && !joined);
}
if (sticky && signups.length > 1 && 'IntersectionObserver' in window) {
  new IntersectionObserver(([en]) => {
    state.heroPast = !en.isIntersecting && en.boundingClientRect.bottom < 0;
    updateSticky();
  }).observe(signups[0]);
  new IntersectionObserver(([en]) => {
    state.joinVisible = en.isIntersecting;
    updateSticky();
  }).observe(signups[signups.length - 1]);
}
