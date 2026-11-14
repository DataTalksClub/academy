import { sessions, SERIES, type Session } from './sessions';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// RFC 5545: lines are folded at 75 octets with CRLF + one space.
function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = '';
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

function event(s: Session): string[] {
  const title = `${SERIES} #${s.number}: ${s.title}`;
  const desc = `${s.title}\n\nZoom link: ${s.zoomUrl}\n\nFree online session with Alexey Grigorev. Everyone who registers gets the recording.`;
  return [
    'BEGIN:VEVENT',
    `UID:${s.id}@hireable-with-ai.academy.datatalks.club`,
    'DTSTAMP:20261114T120000Z',
    `DTSTART:${s.startUtc}`,
    `DTEND:${s.endUtc}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(desc)}`,
    `LOCATION:${esc(s.zoomUrl)}`,
    `URL:${s.zoomUrl}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(`Starting in 15 minutes: ${s.title}`)}`,
    'TRIGGER:-PT15M',
    'END:VALARM',
    'END:VEVENT',
  ];
}

export function icsFor(list: Session[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DataTalks.Club//Hireable with AI//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...list.flatMap(event),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export const allSessions = () => sessions;
