import type { APIRoute } from 'astro';
import { sessions } from '../../data/sessions';
import { icsFor } from '../../data/ics';

export const GET: APIRoute = () =>
  new Response(icsFor(sessions), { headers: { 'content-type': 'text/calendar; charset=utf-8' } });
