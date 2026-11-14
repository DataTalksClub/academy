// Copy shared by both landing pages (and parts of the home page).

export const consentVersion = '2026-11-13.v1';
export const seatCaption = '15 seats, 1 instructor';
export const contactEmail = 'alexey@datatalks.club';

export const facts: { label: string; value: string }[] = [
  { label: 'START', value: 'April 2027' },
  { label: 'FORMAT', value: 'Full-time, live, 16 weeks' },
  { label: 'WHERE', value: 'Berlin (Prenzlauer Berg) or live online' },
  { label: 'LANGUAGE', value: 'English' },
  { label: 'SEATS', value: '15' },
  { label: 'TUITION', value: 'Bildungsgutschein (approval pending) or €9,000 to €10,000 self-pay' },
];

export const heroInstructorLine =
  "I'm Alexey Grigorev, founder of DataTalks.Club. Since 2024, 12,755 students have enrolled on our course platform.";

export const heroHonesty =
  'Planned for April 2027. Your signup counts as a vote for this track.';

export const instructor = {
  heading: 'I teach every session and review every project',
  paragraphs: [
    "I'm Alexey Grigorev. I founded DataTalks.Club and created its free Zoomcamps on data engineering, machine learning, MLOps, LLMs and AI dev tools. Since 2024, 12,755 students have enrolled on our course platform and 1,848 have graduated with certificates. I also wrote Machine Learning Bookcamp and teach paid cohort courses on Maven.",
    "This cohort has 15 seats. I teach every day myself and look at every participant's project every week. There are no teaching assistants and no pre-recorded lectures.",
  ],
  proof: [
    { label: 'DATATALKS.CLUB ON GITHUB', href: 'https://github.com/DataTalksClub' },
    { label: 'MACHINE LEARNING BOOKCAMP', href: 'https://www.manning.com/books/machine-learning-bookcamp' },
    { label: 'COHORT COURSES ON MAVEN', href: 'https://maven.com/alexey-grigorev' },
  ],
};

export const project = { heading: 'The final project' };

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
  heading: 'Sixteen modules, one project that grows every week',
  intro: "This is the draft syllabus. I use the shortlist's survey answers to shape the final version.",
};

export const funding = {
  heading: 'How tuition and the Bildungsgutschein work',
  paragraphs: [
    "I'm applying for AZAV certification so the Agentur für Arbeit can cover tuition with a Bildungsgutschein. Approval is still pending, and the Agentur decides on each person's voucher individually.",
    'The voucher and the seat are separate decisions. The Agentur decides whether it pays, and I decide who is in the cohort.',
    'If you pay yourself, the full program costs €9,000 to €10,000.',
  ],
  linkLabel: 'How the Bildungsgutschein works (arbeitsagentur.de)',
  linkHref: 'https://www.arbeitsagentur.de/karriere-und-weiterbildung/bildungsgutschein',
};

export const admission = {
  heading: 'Why 15 seats',
  body: "I teach this cohort myself and review every project. I can do that properly for about 15 people, not for more. If more people qualify than there are seats, there is a waitlist and a later cohort. I won't add seats.",
  stepsHeading: 'How you get in',
  steps: [
    { title: 'Join the shortlist.', text: 'Leave your email on this page. There is no commitment.' },
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
    a: "It is planned for April 2027. Two tracks are on the table, Agentic Engineering and AI Engineering, and I'll run the one with more serious interest first. Joining a shortlist is how you vote.",
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
    a: "Full-time: Monday to Friday, 09:00 to 16:00 Berlin time, live, for 12 to 16 weeks. The exact length is fixed together with the approval. I'm also considering a part-time version. Tell me in the survey if you need one.",
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
  heading: 'Join the shortlist for April 2027',
  text: "Leave your email and I'll write to you before applications open.",
};

export const form = {
  label: 'Email address',
  button: 'Join the shortlist',
  micro: "Shortlist members get the application before it opens publicly. I'll email you only about this program. Unsubscribe any time.",
  error: 'Please enter a valid email address.',
};

export const home = {
  metaTitle: 'DataTalks.Club Academy: live full-time courses with Alexey Grigorev, April 2027',
  metaDescription:
    'A full-time, live program for developers who already write code, taught by Alexey Grigorev. Two tracks: Agentic Engineering and AI Engineering. 15 seats, Berlin or online, April 2027.',
  eyebrow: 'DataTalks.Club Academy, April 2027',
  headline: 'Live full-time courses in Berlin or online, starting April 2027',
  emphasis: '',
  lead: "I'm Alexey Grigorev. In April 2027 I'll teach a full-time, live program for developers who already write code, in Berlin or online. Two tracks are on the table and I'll run the one with more interest first. Pick a track and join its shortlist.",
  cta: 'Read about the track',
};
