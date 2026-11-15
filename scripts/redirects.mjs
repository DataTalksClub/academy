// Build the academy.datatalks.club redirect site (GitHub Pages).
//
// The academy now lives at https://datatalks.club/academy/. GitHub Pages cannot
// send a 301, so until the subdomain points at an HTTP redirect, every old URL
// serves a stub that sends the browser to the same path under the new base,
// keeping the query string (UTM params) and hash. The stub carries a canonical
// to the new URL and an instant meta refresh, which search engines treat as a
// permanent redirect. Unknown paths fall through to 404.html, which does the same.
//
// Usage: node scripts/redirects.mjs <dist-dir> <out-dir> [target-base]
import { mkdirSync, readdirSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const [dist = 'dist', out = 'dist-redirects', target = 'https://datatalks.club/academy'] = process.argv.slice(2);
const base = target.replace(/\/+$/, '');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function stub(path) {
  const to = base + path;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>DataTalks.Club Academy has moved</title>
<link rel="canonical" href="${esc(to)}">
<script>location.replace(${JSON.stringify(base)} + location.pathname + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${esc(to)}">
</head>
<body>
<p>DataTalks.Club Academy has moved to <a href="${esc(to)}">${esc(to)}</a>.</p>
</body>
</html>
`;
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

let count = 0;
for (const file of walk(dist)) {
  const rel = relative(dist, file).split(sep).join('/');
  if (!rel.endsWith('index.html')) continue;
  const path = '/' + rel.slice(0, -'index.html'.length);
  mkdirSync(join(out, path), { recursive: true });
  writeFileSync(join(out, path, 'index.html'), stub(path));
  count++;
}

// Any other path (including old .ics links and query-only variants of unknown pages).
writeFileSync(join(out, '404.html'), stub('/'));
writeFileSync(
  join(out, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
);
writeFileSync(join(out, '.nojekyll'), '');

console.log(`wrote ${count} redirect stubs to ${out} -> ${base}/`);
