export interface LayoffProofSession {
  id: 'session-1' | 'session-2' | 'session-3';
  number: string;
  title: string;
  date: string;
  time: string;
  description: string;
}

export type DateOptionKey = 'tbd' | 'option-a' | 'option-b';

export const DATE_PRESETS: Record<DateOptionKey, readonly [string, string, string]> = {
  tbd: ['Monday, Nov 23 or Nov 30 (TBD)', 'Monday, Dec 7 or Dec 14 (TBD)', 'Monday, Dec 21 or Jan 11 (TBD)'],
  'option-a': ['Monday, Nov 23, 2026', 'Monday, Dec 7, 2026', 'Monday, Dec 21, 2026'],
  'option-b': ['Monday, Nov 30, 2026', 'Monday, Dec 14, 2026', 'Monday, Jan 11, 2027'],
};

// Switch activeDatePreset to 'option-a' or 'option-b' once dates are finalized.
export const activeDatePreset: DateOptionKey = 'tbd';

const dates = DATE_PRESETS[activeDatePreset];

export const layoffProof = {
  metaTitle: 'Layoff-Proof Developer: free online sessions | DataTalks.Club Academy',
  metaDescription:
    'Three free online sessions for Berlin developers who are job hunting or upskilling into AI. Biweekly Mondays at 17:00 Berlin, 60 minutes each.',
  eyebrow: 'FREE ONLINE SERIES · BIWEEKLY MONDAYS 17:00 BERLIN · 60 MIN',
  headline: 'Layoff-Proof Developer:',
  emphasis: 'free online sessions for Berlin devs',
  lead: 'Three 60-minute online sessions for developers in Berlin who are job hunting or upskilling into AI. Full-time 2027 Academy cohorts are planned with Bildungsgutschein support.',
  scheduleNote: 'Dates are tentative (option A: Nov 23, Dec 7, Dec 21; option B: Nov 30, Dec 14, Jan 11). We will send the confirmed calendar invite after you register.',
  sessions: [
    {
      id: 'session-1',
      number: '01',
      title: 'Becoming layoff-proof: AI Engineering or Agentic Engineering, which skills will keep you hired in 2027?',
      date: dates[0],
      time: '17:00 Berlin (60 min, online)',
      description: 'Overview of the skills employers ask for in AI Engineering and Agentic Engineering, and how the two paths differ. Detailed agenda coming soon.',
    },
    {
      id: 'session-2',
      number: '02',
      title: 'Layoff-proof skill #1: Agentic Engineering, shipping real software with coding agents',
      date: dates[1],
      time: '17:00 Berlin (60 min, online)',
      description: 'Practical walkthrough of building, testing, and shipping software with coding agents. Detailed agenda coming soon.',
    },
    {
      id: 'session-3',
      number: '03',
      title: 'Layoff-proof skill #2: AI Engineering, building LLM apps that work',
      date: dates[2],
      time: '17:00 Berlin (60 min, online)',
      description: 'Practical walkthrough of building and evaluating language model applications. Detailed agenda coming soon.',
    },
  ] satisfies LayoffProofSession[],
  tracksLinkLabel: 'Explore the 2027 Academy tracks',
};
