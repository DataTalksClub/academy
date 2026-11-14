import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib';
import { tracks } from '../data/tracks';

export const GET: APIRoute = () => {
  const paths = ['/', ...tracks.map((t) => `/${t.slug}/`), '/layoff-proof/', '/privacy/', '/impressum/'];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths.map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
