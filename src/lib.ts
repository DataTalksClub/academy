// One helper for every internal link and asset URL: respects the configured base path.
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function url(path: string = '/'): string {
  const p = path.startsWith('/') ? path : '/' + path;
  return base + p;
}

export function absoluteUrl(path: string = '/'): string {
  return new URL(url(path), import.meta.env.SITE).toString();
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Tiny inline markup used in copy: [label](href). Internal hrefs start with "/".
export function rich(text: string): string {
  return esc(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
    const internal = href.startsWith('/');
    const attrs = internal ? '' : ' target="_blank" rel="noopener"';
    return `<a href="${internal ? url(href) : href}"${attrs}>${label}</a>`;
  });
}

// Wrap one word of a headline in <em> (italic accent). Text is escaped first.
export function emph(text: string, word: string): string {
  const safe = esc(text);
  if (!word) return safe;
  const w = esc(word);
  return safe.replace(w, `<em>${w}</em>`);
}
