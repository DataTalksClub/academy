import type { APIRoute, GetStaticPaths } from 'astro';
import { sessions } from '../../data/sessions';
import { icsFor } from '../../data/ics';

export const getStaticPaths: GetStaticPaths = () => sessions.map((s) => ({ params: { id: s.id }, props: { id: s.id } }));

export const GET: APIRoute = ({ props }) => {
  const s = sessions.find((x) => x.id === props.id)!;
  return new Response(icsFor([s]), { headers: { 'content-type': 'text/calendar; charset=utf-8' } });
};
