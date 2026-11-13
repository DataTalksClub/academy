import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
