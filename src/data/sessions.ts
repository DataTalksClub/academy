// All copy, dates, links and flags for /sessions ("Hireable with AI") live here, so
// Marketer can swap them in one file. Source of the copy: bots-management
// context/research/hireable-with-ai-final-copy-2026-11.md @c443d62, with the overrides of
// intake 43f5b079 (t48u survey fields win, source stays layoff_proof, Zoom per session from t53u).
//
// Rules: plain copy, no dashes as punctuation. Anything still marked [PLACEHOLDER] in the
// source file (Field Guide figure, GitHub star count, AZAV wording, Alexey's reason,
// session 2 demo, photo, recording turnaround) is left out here and renders nothing.
//
// The reminder and recording emails are sent by the signup Lambda (aws-infra main/academy,
// lambda/sessions_config.json), which keeps its own copy of the dates, titles and Zoom links.
// Change both when a date, title or link changes.

export const SOURCE = 'layoff_proof';
export const CAMPAIGN = 'hireable_with_ai';
export const SERIES = 'Hireable with AI';

export type SessionId = 'session-1' | 'session-2' | 'session-3';

export interface Session {
  id: SessionId;
  number: 1 | 2 | 3;
  /** Local start in Europe/Berlin, used for the label. */
  dateLabel: string;
  weekdayDate: string;
  startUtc: string;
  endUtc: string;
  title: string;
  heroTopic: string;
  shortLabel: string;
  description: string;
  zoomUrl: string;
  meetupUrl: string;
}

export const TIME_LABEL = '17:00 to 18:00 Berlin time';
export const HERO_TIME = '17:00 Berlin';

/** Buttons "RSVP on Meetup" stay hidden until this is true (Marketer confirms the events are published). */
export const rsvp_published = false;

export const sessions: Session[] = [
  {
    id: 'session-1',
    number: 1,
    dateLabel: 'Mon 23 Nov',
    weekdayDate: 'Monday 23 November',
    startUtc: '20261123T160000Z',
    endUtc: '20261123T170000Z',
    title: 'AI engineering or agentic engineering? What job postings ask for, and which path fits you',
    heroTopic: 'What Berlin job postings ask for about AI, and which path fits you',
    shortLabel: 'Mon 23 Nov: AI or agentic engineering, which path',
    description:
      "One in ten engineering job postings at tech companies now lists AI coding tools like Cursor or Claude Code. I'll walk through what those postings ask for and compare AI engineering (building products on LLMs) with agentic engineering (shipping software with coding agents) on real tasks, with Q&A at the end.",
    zoomUrl: 'https://us06web.zoom.us/j/84099607571?pwd=afNorKbnnXre2oWcsOpmrPWWKZEiHj.1',
    meetupUrl: 'https://www.meetup.com/berlin-datatalks-club/events/317427871/',
  },
  {
    id: 'session-2',
    number: 2,
    dateLabel: 'Mon 30 Nov',
    weekdayDate: 'Monday 30 November',
    startUtc: '20261130T160000Z',
    endUtc: '20261130T170000Z',
    title: 'Agentic engineering: shipping real software with coding agents, live',
    heroTopic: 'Agentic engineering: shipping a feature with a coding agent, live',
    shortLabel: 'Mon 30 Nov: Agentic engineering, live',
    description:
      "I'll take a small feature from a ticket to a merged pull request using a coding agent. I'll show the prompt, the code and tests it generates, where it breaks, and how to present this work in a job application.",
    zoomUrl: 'https://us06web.zoom.us/j/86910927132?pwd=kBoaU0pv5ATHmXH5sEyA1k1VMqPdPJ.1',
    meetupUrl: 'https://www.meetup.com/berlin-datatalks-club/events/317427748/',
  },
  {
    id: 'session-3',
    number: 3,
    dateLabel: 'Mon 7 Dec',
    weekdayDate: 'Monday 7 December',
    startUtc: '20261207T160000Z',
    endUtc: '20261207T170000Z',
    title: 'AI engineering: building an LLM app that works, live',
    heroTopic: 'AI engineering: building and testing an LLM app, live',
    shortLabel: 'Mon 7 Dec: AI engineering, live',
    description:
      "I'll build a small LLM app with document search and tool calling, plus an evaluation script that checks if a change helped or broke answers. I'll also show the common failure modes and how to test for them.",
    zoomUrl: 'https://us06web.zoom.us/j/89929618442?pwd=xjMMnER39hbJudSCMZ9bUXbCwvwrWI.1',
    meetupUrl: 'https://www.meetup.com/berlin-datatalks-club/events/317427758/',
  },
];

export const sessionById = (id: string) => sessions.find((s) => s.id === id);

/** Per-channel utm_source values used in the blurbs and links (the page records whatever it receives). */
export const CHANNELS = ['genau', 'handpicked', '20berlin', 'linkedin', 'x', 'newsletter'] as const;

export type Variant = 'a' | 'b' | 'c';

/** Headline variants, chosen by utm_content. Unknown or missing values show A. */
export const variants: Record<Variant, { headline: string; subhead: string }> = {
  a: {
    headline: 'The AI skills Berlin companies now hire developers for',
    subhead: 'Three free one-hour sessions on Zoom:',
  },
  b: {
    headline: 'Becoming layoff-proof as a developer in Berlin',
    subhead: 'Solaris and Glow25 cut jobs in Berlin this year and named AI as a reason. Three free one-hour sessions on Zoom:',
  },
  c: {
    headline: 'Show employers you can ship software with AI',
    subhead: 'A working AI project in your GitHub gives a hiring manager something to click. Three free one-hour sessions on Zoom:',
  },
};

export function variantFor(utmContent: string | null | undefined): Variant {
  const v = (utmContent || '').toLowerCase();
  return v === 'b' || v === 'c' ? v : 'a';
}

export const sessionsPage = {
  metaTitle: 'Hireable with AI: free online sessions for developers in Berlin | DataTalks.Club',
  metaDescription:
    'Three free one-hour online sessions with Alexey Grigorev for developers in Berlin who are job hunting or want to upskill. Mondays 23 November, 30 November and 7 December 2026 at 17:00 Berlin time.',
  eyebrow: 'For developers in Berlin who are job hunting or want to upskill',
  factLine: 'Free, online on Zoom and in English, 60 minutes each. Everyone who registers gets the recording.',
  button: 'Save my seat',
  underButton: 'Pick one, two or all three sessions in the form.',

  forHeading: 'Who these sessions are for',
  forIntro: 'I made these sessions for developers who live in Berlin and are in one of two situations:',
  forList: [
    "You're job hunting or in a notice period.",
    'You have a job and want to learn Cursor, Claude Code or LLM APIs for your next role.',
  ],
  forOutro:
    'These sessions assume you already write code, in any language. Anyone can join from anywhere, though the job market and Agentur für Arbeit parts focus on Berlin.',
  forNote: "If you've never written code, these sessions will move too fast. My free [Zoomcamps](https://datatalks.club/courses.html) are a better place to start.",

  sessionsHeading: 'Three Mondays, 17:00 to 18:00 Berlin time',
  afterSessions:
    "After each session I spend about ten minutes on the full-time program I'm planning for April 2027 and on how the Bildungsgutschein works. If you're not interested, you can leave before that part.",

  whoHeading: 'Who runs the sessions',
  whoText:
    "I'm Alexey Grigorev. I run DataTalks.Club and made its free Zoomcamps on data engineering, machine learning, MLOps, LLMs and AI dev tools. I wrote the book Machine Learning Bookcamp.",

  numbersHeading: 'Numbers behind session 1',
  numbers: [
    '10.1% of 4,820 engineering job postings at 179 tech companies list AI coding tools such as Cursor or Claude Code as a requirement. Source: [match.dev, September 2026](https://www.match.dev/post/ai-coding-tools-in-job-postings/data/).',
    'In September 2026 Berlin had 3,280 unemployed software developers and 100 open vacancies registered with the Bundesagentur für Arbeit. Source: [Stellenradar, based on BA data, September 2026](https://stellenradar.org/presse/2026-09-berlin-werbung-gastronomie-software).',
  ],

  faqHeading: 'Questions',
  faq: [
    {
      q: 'Is it really free?',
      a: 'Yes. No payment and no card. I only use your email for session links and recordings.',
    },
    {
      q: "I can't make it at 17:00. Should I still register?",
      a: 'Yes. Everyone who registers gets the recording and materials by email after each session.',
    },
    {
      q: "I don't live in Berlin. Can I join?",
      a: 'Yes. The job market and Agentur für Arbeit examples are for Germany, while the coding part applies anywhere.',
    },
    {
      q: 'Is this a sales pitch for a course?',
      // The "applying" or "have applied" wording is still a placeholder, so the sentence about
      // the application is left out until Alexey decides.
      a: "About 50 minutes of each hour are the technical topic. In the last 10 minutes I cover the full-time program for 15 people I'm planning for April 2027. A Bildungsgutschein can only pay for it once certification is granted, and your Agentur für Arbeit or Jobcenter decides whether you get a voucher.",
    },
    {
      q: "I've already done an AI bootcamp or a prompting course. Will this be the same?",
      a: "No. These sessions assume you write software, so there's no ChatGPT intro. I build live and show how to test the code.",
    },
    {
      q: 'Do I need to know Python?',
      a: 'It helps for 7 December. Any language is fine for the first two.',
    },
    {
      q: 'What happens to my email?',
      a: "I send you the session links, reminders and recordings. If you tick the box in the form, I'll also write about the April 2027 program. You can unsubscribe any time. Details are in the [privacy notice](/privacy/).",
    },
  ],

  finalHeading: 'Save your seat',
  finalText:
    'Free and online, Mondays 23 November, 30 November and 7 December at 17:00 Berlin time. Recordings go to everyone who registers.',
};

export const form = {
  emailLabel: 'Email',
  nameLabel: 'First name (optional)',
  sessionsLabel: 'Which sessions interest you?',
  trackLabel: 'Which track interests you most?',
  tracks: [
    { value: 'agentic', label: 'Agentic engineering' },
    { value: 'ai', label: 'AI engineering' },
    { value: 'both', label: 'Both' },
    { value: 'not_sure', label: 'Not sure yet' },
  ],
  statusLabel: 'What describes you best?',
  statuses: [
    { value: 'job_hunting', label: 'Job hunting, laid off or in a notice period' },
    { value: 'employed_upskilling', label: 'Employed, want to upskill' },
    { value: 'other', label: 'Something else' },
  ],
  yearsLabel: 'Years as a developer',
  basedLabel: 'Where are you based?',
  based: [
    { value: 'berlin', label: 'Berlin' },
    { value: 'germany', label: 'Elsewhere in Germany' },
    { value: 'outside', label: 'Outside Germany' },
  ],
  bildungLabel: 'Interested in Bildungsgutschein funding?',
  bildung: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'dont_know', label: "I don't know what it is" },
  ],
  freeTextLabel: 'Optional: what do you want to learn?',
  optinLabel: 'Also tell me about the April 2027 full-time program',
  micro: "I'll email you the session details, a reminder before each session and the recording. Nothing else unless you tick the box above. You can unsubscribe any time.",
  button: 'Save my seat',
  success: {
    title: "You're in. Check your inbox.",
    text: "I've sent the details to your email. Please confirm your address with the link in that email. If it isn't there in five minutes, check your spam folder or write to alexey@datatalks.club.",
    rsvpHeading: 'RSVP on Meetup',
    rsvpText: 'The sessions are also Meetup events. RSVP there for the sessions you plan to join.',
    rsvpButton: (s: Session) => `RSVP on Meetup: ${s.dateLabel}`,
    calendarHeading: 'Add to your calendar',
    calendarAll: 'Add all three sessions',
  },
};

export const qrForm = {
  metaTitle: 'Get the recording and materials | DataTalks.Club',
  metaDescription: 'Leave your email and get the recording, the slides and the code from the Hireable with AI session.',
  heading: 'Get the recording and materials',
  text: "Leave your email and I'll send you today's recording, the slides and the code from the session.",
  button: 'Send me the recording',
  success: 'Done. Please confirm your email with the link I just sent, then the recording comes to your inbox.',
};

/** QR URL pattern from the final copy: slide text "Scan the code or open {shortUrl}". */
export const qrUrl = (n: number) =>
  `https://academy.datatalks.club/sessions/materials/?session=${n}&utm_source=zoom&utm_medium=qr&utm_campaign=${CAMPAIGN}&utm_content=session${n}`;
