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
      if (raw.startsWith('#') || /^(mailto|tel):/.test(raw)) continue;
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
