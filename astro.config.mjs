import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH come from the environment (see README).
// Defaults are for the custom domain; the deploy workflow overrides them
// for GitHub Pages until the domain is switched on.
const site = (process.env.SITE_URL || 'https://academy.datatalks.club').replace(/\/+$/, '');
const raw = (process.env.BASE_PATH || '/').trim();
const base = raw === '/' || raw === '' ? '/' : '/' + raw.replace(/^\/+|\/+$/g, '');

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
