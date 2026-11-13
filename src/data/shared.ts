// Copy shared by both landing pages (and parts of the home page).

export const consentVersion = '2026-11-13.v1';
export const seatCaption = '15 SEATS · 1 INSTRUCTOR · NONE OFFERED YET';
export const contactEmail = 'alexey@datatalks.club';

export const facts: { label: string; value: string }[] = [
  { label: 'START', value: 'April 2027' },
  { label: 'FORMAT', value: 'Full-time, live, 12 to 16 weeks' },
  { label: 'WHERE', value: 'Berlin (Prenzlauer Berg) or live online' },
  { label: 'LANGUAGE', value: 'English' },
  { label: 'SEATS', value: '15' },
  { label: 'TUITION', value: 'Bildungsgutschein planned (approval pending) or self-pay' },
];

export const heroInstructorLine =
  'Taught live by Alexey Grigorev, founder of DataTalks.Club and creator of the free Zoomcamps (85,000+ GitHub stars across the course repositories).';

export const instructor = {
  heading: 'One instructor. Every session, every project review.',
  paragraphs: [
    "I'm Alexey Grigorev. I founded DataTalks.Club and created its free Zoomcamps: Data Engineering, Machine Learning, MLOps, LLM and AI Dev Tools. Their course repositories have more than 85,000 stars on GitHub. I wrote Machine Learning Bookcamp, and I teach paid cohort courses on both of these topics on Maven.",
    "This program is different from the Zoomcamps in one way that matters: it is small. I teach every day myself and I look at every participant's project every week. There are no teaching assistants and no pre-recorded lectures in place of a class.",
  ],
  proof: [
    { label: '85,000+ GITHUB STARS', href: 'https://github.com/DataTalksClub' },
    { label: 'MACHINE LEARNING BOOKCAMP', href: 'https://www.manning.com/books/machine-learning-bookcamp' },
    { label: 'COHORT COURSES ON MAVEN', href: 'https://maven.com/alexey-grigorev' },
  ],
};

export const project = { heading: 'You finish with something real.' };

export const fit = {
  forTitle: 'This is for you if',
  notTitle: 'This is not for you if',
  forShared: [
    'You can study full-time, Monday to Friday, for the whole program.',
    'You can follow technical teaching and work with others in English.',
    'You want your next job to be in software or AI engineering, including if you are between jobs right now.',
  ],
  not: [
    'You have never programmed. Start with the [free Zoomcamps](https://datatalks.club/courses.html) and come back.',
    'You need an evenings-only course.',
    'You want a certificate without building anything.',
  ],
};

export const syllabus = {
  heading: 'Sixteen modules, one project that grows every week.',
  intro: "This is the draft syllabus. The shortlist's survey answers shape the final version.",
};

export const funding = {
  heading: "A Bildungsgutschein pays for a seat. It doesn't get you one.",
  paragraphs: [
    "I'm applying for approval so that the Agentur für Arbeit can cover the tuition with a Bildungsgutschein. That approval is still pending, and the Agentur decides on each person's voucher individually. Nobody can promise you funding today, and I won't.",
    'Funding and admission are two separate decisions. The Agentur decides whether it pays. I decide who is in the cohort. You need both.',
    'If you pay yourself, the full program will cost €9,000 to €10,000.',
  ],
  linkLabel: 'How the Bildungsgutschein works (arbeitsagentur.de)',
  linkHref: 'https://www.arbeitsagentur.de/karriere-und-weiterbildung/bildungsgutschein',
};

export const admission = {
  heading: 'Why 15 seats',
  body: "I teach this cohort myself and review every project. I can do that properly for about 15 people, not for more. In Berlin the room doesn't fit more either. If more people qualify than there are seats, there is a waitlist and a later cohort. I won't add seats.",
  stepsHeading: 'How you get in',
  steps: [
    { title: 'Join the shortlist.', text: 'Leave your email on this page. It takes ten seconds and commits you to nothing.' },
    { title: 'Apply first.', text: 'When applications open, the shortlist gets them before anyone else.' },
    { title: 'Short task and a conversation.', text: 'A small practical exercise and a 20-minute call, so we both know the level fits.' },
    { title: 'Seats are offered in rounds.', text: 'Everyone who applies gets an answer.' },
  ],
};

export const faqHeading = 'Questions';

/** `null` answer = taken from the track (prerequisites). */
export const faq: { q: string; a: string | null }[] = [
  {
    q: 'Is this program confirmed?',
    a: "It is planned for April 2027. Two tracks are on the table, agentic engineering and AI engineering, and I'll run the one with more serious interest first. Joining a shortlist is how you vote.",
  },
  {
    q: 'What do I get for joining the shortlist?',
    a: 'You get the application before it opens publicly, and updates on dates, format and funding approval. Nothing else, and no obligation.',
  },
  { q: 'What do I need to know before I start?', a: null },
  {
    q: 'Will the Agentur für Arbeit pay for it?',
    a: "That is the plan. I'm applying for the approval that makes Bildungsgutschein funding possible, and it has not been granted yet. Even after approval, the Agentur decides each person's case. Talk to your adviser early.",
  },
  { q: 'What does it cost if I pay myself?', a: '€9,000 to €10,000 for the full program.' },
  {
    q: 'Is it online or in Berlin?',
    a: 'Not decided yet. It will be either live online from Germany or in person in Berlin, in Prenzlauer Berg near S+U Schönhauser Allee. The survey after you join asks which one you could attend.',
  },
  {
    q: 'What is the schedule?',
    a: "Full-time: Monday to Friday, 09:00 to 16:00 Berlin time, live, for 12 to 16 weeks. The exact length is fixed together with the approval. I'm also considering a part-time version; tell me in the survey if you need one.",
  },
  {
    q: 'Do I have to live in Germany?',
    a: 'The program is built for people in Germany, and a Bildungsgutschein is only available there.',
  },
  {
    q: 'How do you choose who gets a seat?',
    a: 'By the same published criteria for everyone: programming experience that fits the track, availability for the full schedule, English, a concrete goal, and the practical task. Your employment or benefit status is not a criterion.',
  },
  {
    q: 'What happens to my email?',
    a: 'I use it only to write to you about this program and its application. You can ask me to delete it at any time. Details are in the [privacy notice](/privacy/).',
  },
];

export const join = {
  heading: 'Fifteen seats. The shortlist hears first.',
  text: "Leave your email and I'll write to you before applications open.",
};

export const form = {
  label: 'Email address',
  button: 'Join the shortlist',
  micro: "Shortlist members get the application before it opens publicly. I'll email you only about this program. Unsubscribe any time.",
  error: 'Please enter a valid email address.',
};

export const home = {
  metaTitle: 'DataTalks.Club Academy: a 15-seat live program with Alexey Grigorev, April 2027',
  metaDescription:
    'A full-time, live program for people who already code, taught by Alexey Grigorev. Two candidate tracks: agentic engineering and AI engineering. 15 seats, Berlin or online, April 2027.',
  eyebrow: 'DATATALKS.CLUB ACADEMY · FIRST COHORT · APRIL 2027',
  headline: 'One instructor. Fifteen seats. Which track runs first?',
  emphasis: 'first',
  lead: "I'm Alexey Grigorev. In April 2027 I'll teach a full-time, live program for people who already write code, in Berlin or online. Two tracks are on the table and I'll run the one with more serious interest. Pick yours and join its shortlist.",
  cta: 'See the track and join its shortlist',
};
