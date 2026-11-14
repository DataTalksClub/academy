// Generates public/qr/session-N.png and .svg: the QR codes for the last slide of each session.
// The URL comes from src/data/sessions.ts (qrUrl). Run: npm run qr
import QRCode from 'qrcode';
import { mkdirSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url).pathname;
const CAMPAIGN = 'hireable_with_ai';
const qrUrl = (n) =>
  `https://academy.datatalks.club/sessions/materials/?session=${n}&utm_source=zoom&utm_medium=qr&utm_campaign=${CAMPAIGN}&utm_content=session${n}`;

mkdirSync(root + 'public/qr', { recursive: true });
const opts = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#16301F', light: '#FFFFFF' } };
for (const n of [1, 2, 3]) {
  const url = qrUrl(n);
  writeFileSync(`${root}public/qr/session-${n}.svg`, await QRCode.toString(url, { ...opts, type: 'svg' }));
  await QRCode.toFile(`${root}public/qr/session-${n}.png`, url, { ...opts, type: 'png', width: 1024 });
  console.log(n, url);
}
