// Generates public/og/*.png (1200x630) and public/favicon-32.png with Playwright.
// Fonts are read from node_modules, so nothing leaves the machine.
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const root = new URL('../', import.meta.url).pathname;
const nm = root + 'node_modules/';
const font = (p) => 'data:font/woff2;base64,' + readFileSync(nm + p).toString('base64');
const fraunces = font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2');
const frauncesItalic = font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2');
const plex = font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2');

const items = [
  { file: 'agentic-engineering', head: 'Build, test and <em>ship</em> software with coding agents.', tag: 'AGENTIC ENGINEERING' },
  { file: 'ai-engineering', head: 'Build, <em>evaluate</em> and run applications on language models.', tag: 'AI ENGINEERING' },
  { file: 'home', head: 'One instructor. Fifteen seats. Which track runs <em>first</em>?', tag: 'FIRST COHORT · APRIL 2027' },
  {
    file: 'sessions',
    head: 'Hireable with AI. Free online sessions for <em>developers in Berlin</em>',
    tag: 'MONDAYS 23 NOV, 30 NOV, 7 DEC AT 17:00 BERLIN TIME',
    dates: ['23 NOV', '30 NOV', '7 DEC'],
  },
];

function dateCards(dates) {
  return dates
    .map(
      (d, i) =>
        `<div class="dc"><span>0${i + 1}</span><b>${d}</b><i>17:00</i></div>`,
    )
    .join('');
}

function grid() {
  let s = '';
  for (let i = 0; i < 15; i++) {
    const x = 2 + (i % 5) * 76, y = 2 + Math.floor(i / 5) * 76;
    s += `<rect x="${x}" y="${y}" width="60" height="60" fill="none" stroke="#8ED8AD" stroke-width="2"/>`;
  }
  return `<svg width="360" height="202" viewBox="0 0 384 216">${s}</svg>`;
}

const html = (i) => `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:F;src:url(${fraunces});font-weight:300 900}
@font-face{font-family:F;font-style:italic;src:url(${frauncesItalic});font-weight:300 900}
@font-face{font-family:M;src:url(${plex})}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#16301F;color:#F5F1E8;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;position:relative}
.top{font:500 20px M;letter-spacing:.06em;color:#8ED8AD}
h1{font:500 66px/1.05 F;letter-spacing:-.025em;max-width:640px}
em{font-style:italic;font-weight:400;color:#8ED8AD}
.brand{font:500 28px F}
.cap{font:500 12px M;letter-spacing:.06em;color:#8ED8AD;margin-top:16px;white-space:nowrap}
.g{position:absolute;right:72px;bottom:64px;width:360px}
.dcs{position:absolute;right:72px;bottom:64px;display:flex;flex-direction:column;gap:12px;width:300px}
.dc{border:2px solid #8ED8AD;padding:14px 18px;display:flex;align-items:baseline;gap:16px}
.dc span{font:500 16px M;color:#8ED8AD}
.dc b{font:500 34px F;flex:1}
.dc i{font:500 16px M;font-style:normal;color:#8ED8AD}
</style>
<div class=top>${i.tag}</div><h1>${i.head}</h1><div class=brand>DataTalks.Club Academy</div>
${i.dates ? `<div class=dcs>${dateCards(i.dates)}</div>` : `<div class=g>${grid()}<div class=cap>15 SEATS · 1 INSTRUCTOR · NONE OFFERED YET</div></div>`}`;

mkdirSync(root + 'public/og', { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
for (const it of items) {
  await p.setContent(html(it));
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${root}public/og/${it.file}.png` });
}
const fav = readFileSync(root + 'public/favicon.svg', 'utf8');
const q = await b.newPage({ viewport: { width: 32, height: 32 } });
await q.setContent(`<body style="margin:0">${fav.replace('<svg ', '<svg width="32" height="32" ')}`);
await q.screenshot({ path: root + 'public/favicon-32.png' });
await b.close();
