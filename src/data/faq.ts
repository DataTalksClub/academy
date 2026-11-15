export interface FaqEntry {
  q: string;
  a: string;
}

export const faqPage = {
  metaTitle: 'Frequently Asked Questions | DataTalks.Club Academy',
  metaDescription:
    'Answers on eligibility, April 2027 start, Monday to Friday schedule, English language, Berlin or live online format, 15 seats, Bildungsgutschein funding, and the waitlist.',
  eyebrow: 'DataTalks.Club Academy',
  heading: 'Frequently Asked Questions',
  lead: 'Direct answers about the two full-time programs, Agentic Engineering and AI Engineering, starting April 2027.',
};

export const faqEntries: FaqEntry[] = [
  {
    q: 'Who is DataTalks.Club Academy for?',
    a: 'It is for experienced developers in Germany with 2+ years of programming experience. Whether you are laid off, in your notice period, job hunting, or employed and upskilling, you can apply. Both programs require comfortable programming skills and are not for beginners.',
  },
  {
    q: 'When does the next cohort start?',
    a: 'Start: April 2027. Join the waitlist and you hear first when applications open. There are two programs, Agentic Engineering and AI Engineering, each lasting 3 months (13 weeks).',
  },
  {
    q: 'What are the daily hours and schedule?',
    a: 'Classes run full-time, Monday to Friday, 09:00 to 16:30 Berlin time, for 3 months (13 weeks). All sessions are taught live by Alexey Grigorev, with no pre-recorded lectures. You need to be available for the full schedule.',
  },
  {
    q: 'What language is the program taught in?',
    a: 'Both programs are taught in English. You need to be able to follow technical teaching and work with other developers in English. The German page at /academy/bildungsgutschein/ explains the Bildungsgutschein context in German.',
  },
  {
    q: 'Where do the classes take place?',
    a: 'Classes take place in Berlin or live online. Online participants join live from Germany on the same Monday to Friday schedule. After joining the waitlist, you can indicate whether you prefer Berlin or live online.',
  },
  {
    q: 'How many seats are there?',
    a: 'Each cohort has 15 seats. Alexey Grigorev teaches every session himself and reviews every participant project every week. If more people qualify than there are seats, later cohorts will follow.',
  },
  {
    q: 'How does Bildungsgutschein funding work?',
    a: 'Designed for Bildungsgutschein funding (AZAV), coming soon. Talk to your Agentur für Arbeit or Jobcenter adviser early so they know your plan. The voucher and the admission seat are separate decisions.',
  },
  {
    q: 'How does the waitlist work?',
    a: 'Waitlist members hear first when applications open and receive updates on dates, format, and funding. Joining the waitlist has no commitment and no cost. After joining, you can share your location, German level, and full-time availability.',
  },
];
