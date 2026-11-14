# academy.datatalks.club: site spec

Owner: Alexey Grigorev (DataTalks.Club). Written 13 November 2026 by the orchestrating session for intake `a0af4b9b`.
The research behind these choices is in `alexeygrigorev/research-dump`, `courses/ai-engineering-school-germany/academy-landing/`.

## 1. Purpose

A demand test. Alexey plans a selective, full-time, multi-month program starting April 2027 (about 15 seats, live online from Germany or in person in Berlin, taught by him, Bildungsgutschein funding planned with approval pending, or self-pay). Two tracks are candidates and only one runs first:

- **Agentic engineering**: build, test and ship software with coding agents.
- **AI engineering**: build, evaluate and run applications on language models.

Each track gets one landing page. The only conversion is **leaving an email to join the shortlist**. Paid and organic traffic is sent to both pages and the conversion rates are compared. Therefore:

1. **The two landing pages must be structurally identical.** One template, one stylesheet, one section order, the same funding, admission, instructor and FAQ blocks. Only the track data differs (name, headline, outcomes, project, prerequisites, syllabus, one FAQ answer). A test enforces this.
2. **Email is mandatory.** There is no way to "sign up" without it.
3. **Every claim is true today.** No "free", no "certified", no "seats going fast", no countdowns, no invented numbers or testimonials. If a fact is not in this spec, do not add it.
4. **No cookies, no local/session storage, no third-party requests.** Fonts and images are self-hosted. The only network calls are to our own signup API. This is what lets the site run in Germany without a consent banner.

## 2. Stack

- **Astro** (latest stable), static output, no UI framework. Plain CSS (one global stylesheet with custom properties plus component-scoped styles). A single small vanilla TypeScript module for the form and the page-view beacon.
- Node 22, npm. Fonts through `@fontsource-variable/fraunces`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono` (self-hosted by the build; only the weights used; `font-display: swap`).
- Hosting: GitHub Pages, deployed by GitHub Actions (`actions/deploy-pages`).
- **Base path must be configurable.** Until DNS exists the site is served at `https://datatalksclub.github.io/academy/`; afterwards at `https://academy.datatalks.club/`. Read `SITE_URL` and `BASE_PATH` from the environment in `astro.config.mjs` (defaults: `https://academy.datatalks.club` and `/`). Every internal link and asset URL goes through one helper that respects the base. Do **not** add a `CNAME` file yet; the orchestrator switches the domain on later through repository variables.
- API URL: build-time `PUBLIC_API_URL` (no trailing slash). The deploy workflow reads it from the repository variable `API_URL`. If it is empty at build time the form still renders, and on submit shows the error state (never a fake success).

Repository layout:

```
src/data/tracks.ts        # all track-specific copy, typed; the ONLY place the two pages differ
src/data/shared.ts        # shared copy: facts, funding, admission steps, FAQ, instructor
src/layouts/Base.astro
src/components/*.astro     # Hero, SignupForm, SeatGrid, FactsStrip, Outcomes, Instructor, Fit, Syllabus, Funding, Admission, Faq, FinalCta, Footer, StickyCta
src/pages/index.astro
src/pages/[track].astro    # getStaticPaths over tracks.ts -> /agentic-engineering/ and /ai-engineering/
src/pages/privacy.astro
src/pages/impressum.astro
src/pages/404.astro
src/scripts/signup.ts
public/                    # favicon, logo, instructor photo, og images
tests/                     # Playwright
```

## 3. Design direction

The feeling: **an admissions notice from a small school, set by someone who cares about typography.** Calm, specific, a little austere. Not a SaaS template: no gradient blobs, no glassmorphism, no emoji, no stock illustrations, no purple, no rounded "pill" everything, no icon-in-a-circle feature grids, no centered hero with two buttons.

### Tokens

```css
--paper:      #F5F1E8;  /* page background, warm off-white */
--paper-2:    #ECE6D8;  /* alternate band */
--ink:        #17201B;  /* body text */
--ink-2:      #4A564F;  /* secondary text */
--green-900:  #16301F;  /* hero and footer background */
--green-700:  #2C573E;  /* DataTalks.Club brand green: links, buttons on paper */
--mint:       #8ED8AD;  /* accent on dark; highlights */
--mint-100:   #DCEFE3;
--line:       rgba(23, 32, 27, 0.16);  /* hairlines on paper */
--line-dark:  rgba(245, 241, 232, 0.22);
--error:      #B3261E;
```

Check contrast: body text and buttons must meet WCAG AA in every combination used.

### Type

- **Fraunces** (variable, optical size on, weight about 500, slightly tight tracking) for `h1`, `h2` and the big numerals. Use the "soft" axis at 0 and no italics except one emphasised word per headline at most.
- **IBM Plex Sans** 400/500/600 for body (17px base on mobile, 18px from 768px, line-height 1.6, measure 60–68 characters).
- **IBM Plex Mono** 400/500 for labels, the facts strip, section numbers and form microcopy. Uppercase with +0.06em tracking for labels only.
- `h1`: `clamp(2.4rem, 6.2vw, 4.6rem)`, line-height 1.02. `h2`: `clamp(1.7rem, 3.4vw, 2.6rem)`.

### Layout and motifs

- 12-column grid, max content width 1120px, generous vertical rhythm (sections 96–128px apart on desktop, 64px on mobile). Hairline rules (`--line`) separate sections instead of cards and shadows. Corners are square or 2px. No drop shadows except a very soft one on the hero form.
- Every section has a mono label like `01 / WHAT YOU WILL BE ABLE TO DO` above its heading.
- **The seat grid** is the signature element: 15 small outlined squares in a 5 × 3 grid, drawn in SVG, mint stroke on the dark hero. It appears in the hero (large, beside the form on desktop, below the headline and above the form on mobile, smaller) and again, small, in the "Why 15 seats" block and the final call to action. Caption in mono: `15 SEATS · 1 INSTRUCTOR · NONE OFFERED YET`. On load the squares draw in one by one (about 40ms stagger, 600ms total); with `prefers-reduced-motion` they are simply there. No other animation on the page except focus and hover transitions.
- Hero: full-bleed `--green-900`, paper-coloured text, mint accents. The rest of the page is on `--paper` with one `--paper-2` band (the instructor block) and the dark footer.
- Header: DataTalks.Club logo (download `https://datatalks.club/images/logo.svg` into `public/`; if it does not sit well on the dark hero, set the wordmark "DataTalks.Club" in Plex Sans 600 and "Academy" in Fraunces next to it) followed by the word `Academy`. Right side on desktop: mono text `FIRST COHORT · APRIL 2027` and a small button `Join the shortlist` that scrolls to the hero form. No navigation menu on the landing pages.
- Instructor photo: download `https://datatalks.club/images/authors/alexeygrigorev.jpg` into `public/`, serve an optimised square crop (Astro `<Image>`), shown in greyscale with a mint duotone feel or simply greyscale; 2px corners.
- Mobile first. About 85% of education landing traffic is mobile. At 375px nothing overflows, tap targets are at least 44px, the hero form is fully visible without horizontal scrolling, and the email field and button stack full-width.
- **Sticky mobile call to action**: below 768px a bottom bar (`--green-900`, one line: `15 seats · April 2027` and a `Join the shortlist` button) appears once the hero form has scrolled out of view and hides while the final form is in view or after a successful signup. It scrolls to the nearest form and focuses the email field.
- Focus states are clearly visible (2px mint or green outline with offset). Skip link. Semantic landmarks. One `h1` per page.

## 4. The signup form (component `SignupForm`)

Appears twice per landing page (hero and final call to action) and nowhere else. Both instances behave identically; a success in one switches both to the success state.

Markup: a real `<form>` with

- `<label>` "Email address" (visually present, mono, small) and `<input type="email" name="email" required autocomplete="email" inputmode="email" placeholder="you@example.com">`,
- a hidden honeypot `<input type="text" name="website" tabindex="-1" autocomplete="off">` inside a visually hidden, `aria-hidden` wrapper,
- submit button **`Join the shortlist`**,
- microcopy under the button (mono, small): `Shortlist members get the application before it opens publicly. I'll email you only about this program. Unsubscribe any time.` followed by a link `Privacy` to `/privacy/`.

Behaviour (`src/scripts/signup.ts`):

1. On submit: trim the value, validate with the browser's constraint validation plus a simple pattern (`something@something.tld`). Invalid or empty: show an inline error under the field (`Please enter a valid email address.`), set `aria-invalid`, focus the field. Do not call the API.
2. Valid: disable the button, label it `Joining…`, `POST {PUBLIC_API_URL}/signup` as JSON:
   `{ email, track, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, page, lang, consent_version: "2026-11-13.v1", website }`.
   - `track` is the page's track slug (`agentic-engineering` or `ai-engineering`).
   - UTM values are read from the current URL's query string at submit time; omit the ones that are absent. `referrer` is `document.referrer` (origin and path only, no query). `page` is `location.pathname` without the base path. `lang` is `navigator.language`.
3. HTTP 200 with `{"ok": true}`: replace the form (both instances) with the **success panel** below, move focus to its heading, and hide the sticky bar.
4. Anything else (network error, non-200, empty API URL): re-enable the button and show: `That didn't go through. Please try again, or email alexey@datatalks.club and I'll add you.` (mailto link). Never show success on failure.

UTM continuity without storage: on load, append the current `utm_*` query parameters to every internal link (`a[href]` pointing to this site), so a visitor who moves from the home page to a landing page keeps them.

Page-view beacon: on load, `fetch(PUBLIC_API_URL + "/pv", { method: "POST", keepalive: true, headers: {"content-type": "application/json"}, body: JSON.stringify({ page, utm_source, utm_campaign, utm_content }) })`, errors swallowed. Skip it when `PUBLIC_API_URL` is empty or `navigator.webdriver` is true.

### Success panel

```
[mono label]  YOU'RE ON THE SHORTLIST
[h3, Fraunces] Thank you. I'll write to you before applications open.
[p] Joining the shortlist is not a seat and not a funding decision. It means you hear first, and your choice of track counts when I decide which one runs in April 2027.

[mono label]  TWO QUICK QUESTIONS (OPTIONAL)
Where are you based?        [Berlin] [Elsewhere in Germany] [Outside Germany]
How would you pay?          [Bildungsgutschein] [Myself] [My employer] [Not sure yet]

[p] Want more say in what is taught? The five-minute survey decides the curriculum.
[button, secondary] Take the survey
```

- The chips are real `<button type="button">` elements in two groups with `aria-pressed`. Choosing one immediately sends a second `POST /signup` with the same `email` and `track` plus `answers: { location: "berlin" | "germany" | "outside-germany" }` or `answers: { funding: "bildungsgutschein" | "self" | "employer" | "unsure" }`, and marks the chip as selected. Failures here are silent.
- "Take the survey" opens the existing Google Form in a new tab, prefilled with the track and the email:
  `https://docs.google.com/forms/d/e/1FAIpQLSdl4f48ZsEV_9VBjUD8dHTHm9qMddnW75_2P7Uj5B6hC1IInQ/viewform?usp=pp_url&entry.1984241375=<TRACK_OPTION>&entry.1840392648=<EMAIL>`
  where `<TRACK_OPTION>` is `A. Agentic engineering` or `B. AI engineering` and both values are URL-encoded.

## 5. Landing page structure (identical for both tracks)

Section ids, in this exact order: `hero`, `facts`, `outcomes`, `project`, `instructor`, `fit`, `syllabus`, `funding`, `admission`, `faq`, `join`. Then the footer.

### hero

- Mono eyebrow: `FIRST COHORT · APRIL 2027 · BERLIN OR LIVE ONLINE`
- `h1`: track `headline`
- Lead paragraph: track `lead`
- SignupForm
- Instructor line (small photo, 48px, plus text): `Taught live by Alexey Grigorev, founder of DataTalks.Club and creator of the free Zoomcamps (85,000+ GitHub stars across the course repositories).`
- Seat grid with its caption.

### facts (a strip of six facts, mono labels over Plex Sans values, hairlines between; two columns on mobile)

| Label | Value |
|---|---|
| START | April 2027 |
| FORMAT | Full-time, live, 12 to 16 weeks |
| WHERE | Berlin (Prenzlauer Berg) or live online |
| LANGUAGE | English |
| SEATS | 15 |
| TUITION | Bildungsgutschein planned (approval pending) or self-pay |

### outcomes: `01 / WHAT YOU WILL BE ABLE TO DO`

`h2`: track `outcomesTitle`. A numbered list of the track's seven outcomes (large mono numerals `01`–`07`, two columns on desktop).

### project: `02 / THE FINAL PROJECT`

`h2`: `You finish with something real.` Then the track's `project` paragraph, set large (Fraunces, about 1.5rem), with a mint left rule.

### instructor: `03 / WHO TEACHES` (band on `--paper-2`)

Photo (about 280px square on desktop) beside the text.

`h2`: `One instructor. Every session, every project review.`

> I'm Alexey Grigorev. I founded DataTalks.Club and created its free Zoomcamps: Data Engineering, Machine Learning, MLOps, LLM and AI Dev Tools. Their course repositories have more than 85,000 stars on GitHub. I wrote Machine Learning Bookcamp, and I teach paid cohort courses on both of these topics on Maven.
>
> This program is different from the Zoomcamps in one way that matters: it is small. I teach every day myself and I look at every participant's project every week. There are no teaching assistants and no pre-recorded lectures in place of a class.

Three mono proof items under the text, each a link opening in a new tab:
`85,000+ GITHUB STARS` → `https://github.com/DataTalksClub` · `MACHINE LEARNING BOOKCAMP` → `https://www.manning.com/books/machine-learning-bookcamp` · `COHORT COURSES ON MAVEN` → `https://maven.com/alexey-grigorev`

### fit: `04 / WHO IT IS FOR`

Two columns with headings `This is for you if` and `This is not for you if`.

For you if (first item is the track's `fitFirst`, the rest are shared):
- (track `fitFirst`)
- You can study full-time, Monday to Friday, for the whole program.
- You can follow technical teaching and work with others in English.
- You want your next job to be in software or AI engineering, including if you are between jobs right now.

Not for you if (shared):
- You have never programmed. Start with the free Zoomcamps at `https://datatalks.club/courses.html` (link) and come back.
- You need an evenings-only course.
- You want a certificate without building anything.

### syllabus: `05 / WHAT WE COVER`

`h2`: `Sixteen modules, one project that grows every week.`
Intro: `This is the draft syllabus. The shortlist's survey answers shape the final version.`
The track's 16 modules in four groups of four (`<details>` per group, the first one open). Each module row: mono number, module title, and one line "You produce: …".

### funding: `06 / FUNDING`

`h2`: `A Bildungsgutschein pays for a seat. It doesn't get you one.`

> I'm applying for approval so that the Agentur für Arbeit can cover the tuition with a Bildungsgutschein. That approval is still pending, and the Agentur decides on each person's voucher individually. Nobody can promise you funding today, and I won't.
>
> Funding and admission are two separate decisions. The Agentur decides whether it pays. I decide who is in the cohort. You need both.
>
> If you pay yourself, the full program will cost €9,000 to €10,000.

Small link: `How the Bildungsgutschein works (arbeitsagentur.de)` → `https://www.arbeitsagentur.de/karriere-und-weiterbildung/bildungsgutschein`

### admission: `07 / HOW YOU GET IN`

Left: `h2` `Why 15 seats` with the small seat grid and:

> I teach this cohort myself and review every project. I can do that properly for about 15 people, not for more. In Berlin the room doesn't fit more either. If more people qualify than there are seats, there is a waitlist and a later cohort. I won't add seats.

Right: four numbered steps.

1. **Join the shortlist.** Leave your email on this page. It takes ten seconds and commits you to nothing.
2. **Apply first.** When applications open, the shortlist gets them before anyone else.
3. **Short task and a conversation.** A small practical exercise and a 20-minute call, so we both know the level fits.
4. **Seats are offered in rounds.** Everyone who applies gets an answer.

### faq: `08 / QUESTIONS`

`<details>` list. Shared questions, except the prerequisites answer which comes from the track.

1. **Is this program confirmed?** It is planned for April 2027. Two tracks are on the table, agentic engineering and AI engineering, and I'll run the one with more serious interest first. Joining a shortlist is how you vote.
2. **What do I get for joining the shortlist?** You get the application before it opens publicly, and updates on dates, format and funding approval. Nothing else, and no obligation.
3. **What do I need to know before I start?** (track `prerequisites`)
4. **Will the Agentur für Arbeit pay for it?** That is the plan. I'm applying for the approval that makes Bildungsgutschein funding possible, and it has not been granted yet. Even after approval, the Agentur decides each person's case. Talk to your adviser early.
5. **What does it cost if I pay myself?** €9,000 to €10,000 for the full program.
6. **Is it online or in Berlin?** Not decided yet. It will be either live online from Germany or in person in Berlin, in Prenzlauer Berg near S+U Schönhauser Allee. The survey after you join asks which one you could attend.
7. **What is the schedule?** Full-time: Monday to Friday, 09:00 to 16:00 Berlin time, live, for 12 to 16 weeks. The exact length is fixed together with the approval. I'm also considering a part-time version; tell me in the survey if you need one.
8. **Do I have to live in Germany?** The program is built for people in Germany, and a Bildungsgutschein is only available there.
9. **How do you choose who gets a seat?** By the same published criteria for everyone: programming experience that fits the track, availability for the full schedule, English, a concrete goal, and the practical task. Your employment or benefit status is not a criterion.
10. **What happens to my email?** I use it only to write to you about this program and its application. You can ask me to delete it at any time. Details are in the privacy notice (link).

### join (final call to action, `--green-900` band)

`h2`: `Fifteen seats. The shortlist hears first.`
Paragraph: `Leave your email and I'll write to you before applications open.`
SignupForm (same component), small seat grid.

### Footer (`--green-900`, small, mono labels)

`DataTalks.Club Academy` · links: `Impressum`, `Privacy`, `DataTalks.Club` (https://datatalks.club) · `© 2026 DataTalks.Club` · and one quiet line: `Looking at the other track?` linking to the other landing page (the only cross-link; keep it in the footer).

## 6. Track data (`src/data/tracks.ts`)

### agentic-engineering

- `name`: Agentic Engineering
- `surveyOption`: `A. Agentic engineering`
- `headline`: Build, test and ship software with coding agents.
- `lead`: A full-time, live program for people who already write code. You learn to run coding agents the way an engineer runs a team: clear specs, small tasks, tests, review, releases. Fifteen seats, taught by Alexey Grigorev.
- `metaTitle`: Agentic Engineering: a 15-seat live program, April 2027 | DataTalks.Club Academy
- `metaDescription`: Learn to build, test and ship software with coding agents. Full-time, live, 15 seats, taught by Alexey Grigorev. Berlin or online, April 2027. Join the shortlist.
- `outcomesTitle`: By the end you can run a software project with agents, and answer for the result.
- `outcomes`:
  1. Turn a product idea into a spec and a set of small tasks.
  2. Build a full-stack feature across the interface, the API and the database.
  3. Work in an existing codebase: debug it and review agent-generated changes.
  4. Automate tests and releases with CI/CD.
  5. Deploy your application and use logs and metrics to investigate failures.
  6. Connect agents to tools through MCP and build reusable workflows for implementation and code review.
  7. Set up and configure an agentic software factory.
- `project`: You ship a working web application for a real user task. People try it, you improve it from their feedback, and you show how you tested and released each change.
- `fitFirst`: You write code today (Python, JavaScript, TypeScript or similar) and have used AI tools only a little.
- `prerequisites`: You can write basic code in Python, JavaScript, TypeScript or a similar language, use the command line and Git, read and explain a short function, and run a simple test. You don't need any experience with coding agents.
- `syllabus` (four groups):
  - **Weeks 1–4 · Foundations**
    1. AI development tools: overview and setup. *You produce: a working environment and your first agent-made commit.*
    2. Working in a session and in an existing codebase. *You produce: a verified pull request in a repository you didn't write.*
    3. From idea to spec, backlog and small tasks. *You produce: a product brief and a groomed backlog for your own product.*
    4. Full-stack feature I: interface and API contract. *You produce: a working interface on mocks and an OpenAPI specification.*
  - **Weeks 5–8 · Build and verify**
    5. Full-stack feature II: backend and database. *You produce: the main user task working end to end, with backend tests.*
    6. Testing, verification and debugging. *You produce: a test suite, and a seeded bug reproduced, fixed and covered.*
    7. Reviewing agent-generated changes. *You produce: a review record, a reviewer workflow and two automatic checks.*
    8. Containers, CI/CD and deployment. *You produce: your first version deployed through CI (midterm).*
  - **Weeks 9–12 · Operate and automate**
    9. Permissions, sandboxing and safe operation. *You produce: a threat sketch and guardrails for your product.*
    10. Environments, logs, metrics and an on-call agent. *You produce: dashboards, one alert, and a failure investigated from telemetry.*
    11. Reusable workflows: skills, subagents and hooks. *You produce: packaged implementation and code-review workflows.*
    12. Connecting agents to tools through MCP. *You produce: your product's tools exposed through MCP and used by the agent.*
  - **Weeks 13–16 · Factory, capstone and interviews**
    13. Agent teams, loops and parallel work. *You produce: a backlog batch worked through by an agent team, with QA verdicts.*
    14. The agentic software factory. *You produce: a configured factory on your product and an operating guide.*
    15. Capstone: users, feedback, release and defence. *You produce: an improved product released through the pipeline, launch report and defence.*
    16. Technical interviews and hiring prep. *You produce: peer mock interviews, coding and take-home drills, and a project presentation.*

### ai-engineering

- `name`: AI Engineering
- `surveyOption`: `B. AI engineering`
- `headline`: Build, evaluate and run applications on language models.
- `lead`: A full-time, live program for people who already write code. You learn to build LLM applications the way an engineer builds any system: retrieval, tools, evaluation, deployment, monitoring. Fifteen seats, taught by Alexey Grigorev.
- `metaTitle`: AI Engineering: a 15-seat live program, April 2027 | DataTalks.Club Academy
- `metaDescription`: Learn to build, evaluate and run LLM applications: RAG, agents, evals, deployment. Full-time, live, 15 seats, taught by Alexey Grigorev. Berlin or online, April 2027. Join the shortlist.
- `outcomesTitle`: By the end you can build an AI application, and show where it works and where it fails.
- `outcomes`:
  1. Build an assistant in Python on an LLM API.
  2. Use retrieval-augmented generation (RAG) and document processing over company data.
  3. Give the assistant tools, function calling and MCP connections to look things up or call an API.
  4. Define what it can do on its own and when it needs human approval.
  5. Evaluate answers and tool use with realistic tasks; compare prompts, models and retrieval methods; catch regressions.
  6. Deploy the application to the cloud and trace its model and tool calls.
  7. Track quality, latency and cost, and handle failures safely with guardrails.
- `project`: You build and deploy an AI assistant for a concrete company use case, for example one that answers questions from messy internal documents with sources and carries out actions after human approval. You show where it works, where it fails, and how you measured that.
- `fitFirst`: You program today, ideally in Python, and can use APIs and work in a repository.
- `prerequisites`: You are comfortable programming, preferably in Python, and you can use the command line, Git and basic Docker. You don't need a machine-learning background, advanced mathematics or a GPU.
- `syllabus` (four groups):
  - **Weeks 1–4 · Retrieval**
    1. A Python service on an LLM API. *You produce: a small API that returns validated, structured answers.*
    2. First assistant with retrieval. *You produce: a knowledge assistant that answers with sources.*
    3. Document processing, ingestion and indexing. *You produce: an ingestion pipeline you can rebuild with one command.*
    4. Vector and hybrid search. *You produce: three retrieval variants, with examples of where each fails.*
  - **Weeks 5–8 · Agents**
    5. Evaluating retrieval. *You produce: a retrieval evaluation and a justified configuration.*
    6. Tools, function calling and the agent loop. *You produce: an assistant that calls an API through a tool.*
    7. Agent frameworks, MCP and context. *You produce: the assistant rebuilt on a framework, with one MCP tool.*
    8. Serving and cloud deployment. *You produce: a deployed assistant with cited answers and one tool (midterm).*
  - **Weeks 9–12 · Quality**
    9. Agentic workflows and human approval. *You produce: a workflow action that waits for approval and handles refusal.*
    10. Testing LLM applications and CI/CD. *You produce: a regression suite running in CI.*
    11. Evaluating answers and agents. *You produce: an evaluation report comparing two configurations.*
    12. Tracing, observability and monitoring. *You produce: traces and a monitoring dashboard for the deployed assistant.*
  - **Weeks 13–16 · Production, capstone and interviews**
    13. Cost, latency and model choice. *You produce: a cost and latency report with one measured improvement.*
    14. Safety: guardrails, injection and compliance. *You produce: tested guardrails and a short compliance checklist.*
    15. Capstone: build, evaluate and defend. *You produce: a deployed assistant, an evaluation report and a defence.*
    16. Technical interviews and hiring prep. *You produce: peer mock interviews, coding and take-home drills, and a project presentation.*

## 7. Home page (`/`)

Same header, footer and visual language. Purpose: let an undecided visitor choose a track; the choice itself is a signal.

- Hero (`--green-900`): eyebrow `DATATALKS.CLUB ACADEMY · FIRST COHORT · APRIL 2027`; `h1`: `One instructor. Fifteen seats. Which track runs first?`; lead: `I'm Alexey Grigorev. In April 2027 I'll teach a full-time, live program for people who already write code, in Berlin or online. Two tracks are on the table and I'll run the one with more serious interest. Pick yours and join its shortlist.`; the large seat grid.
- Two equal track panels side by side (stacked on mobile; **order randomised on each page load** with a tiny inline script so neither track is favoured, with the server-rendered order as the no-JS fallback). Each panel: mono label `TRACK A` / `TRACK B` (labels follow the track, not the position), track name in Fraunces, the track headline, three of its outcomes (1, 3 and 5 from the list), and a button `See the track and join its shortlist` linking to the landing page.
- A short shared block under the panels: the facts strip, then the funding headline and its first paragraph, then the footer.
- `metaTitle`: DataTalks.Club Academy: a 15-seat live program with Alexey Grigorev, April 2027
- `metaDescription`: A full-time, live program for people who already code, taught by Alexey Grigorev. Two candidate tracks: agentic engineering and AI engineering. 15 seats, Berlin or online, April 2027.

## 8. Legal pages

Plain, readable, same layout, `noindex` not needed. Both linked from every footer.

### /impressum/ (German, as required by § 5 DDG)

```
Impressum

Angaben gemäß § 5 DDG
DataTalks.Club
Schönensche Str. 13
10439 Berlin
Deutschland

Vertreten durch: Alexey Grigorev
Kontakt: alexey@datatalks.club
Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: DE343190995
Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: Alexey Grigorev, Anschrift wie oben

Verbraucherstreitbeilegung: Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
```

### /privacy/ (English)

Sections and content:

1. **Who is responsible.** DataTalks.Club, Schönensche Str. 13, 10439 Berlin, Germany, represented by Alexey Grigorev. Contact: alexey@datatalks.club.
2. **What this site stores when you join a shortlist.** Your email address; the track you chose; the date and time; the page you signed up on; the campaign parameters in the link you followed (`utm_*`) and the referring page; your browser language; and, if you answer them, the two optional questions (where you are based, how you would pay). Not stored: your IP address, your browser details, cookies.
3. **Why, and on what legal basis.** To write to you about this program and its application, and to decide which track to run. The legal basis is your consent (Art. 6(1)(a) GDPR), which you give by submitting the form. You can withdraw it at any time by writing to alexey@datatalks.club or using the unsubscribe link in any email; this does not affect processing before the withdrawal.
4. **Page-view counts.** The site counts page views per page and campaign in aggregate (a daily number per page and campaign). These counts contain no personal data. The site sets no cookies and stores nothing on your device.
5. **Who processes the data.** Amazon Web Services EMEA SARL stores the shortlist in the EU (Ireland, region eu-west-1). GitHub, Inc. hosts this static site through GitHub Pages and processes your IP address in its server logs to deliver the pages. Emails are sent through Amazon SES. If you follow the link to the survey, Google Forms processes what you enter there under Google's terms.
6. **How long.** Until the first cohort has been filled or the plan is dropped, and at most 24 months after you signed up, unless you ask for deletion earlier.
7. **Your rights.** Access, rectification, erasure, restriction, data portability and objection (Art. 15–21 GDPR), and the right to complain to a supervisory authority, for example the Berliner Beauftragte für Datenschutz und Informationsfreiheit.
8. **Last updated:** 13 November 2026.

## 9. Meta, sharing and performance

- Per-page `<title>`, description, canonical URL, Open Graph and Twitter card tags. `lang="en"` (`lang="de"` on the Impressum).
- One Open Graph image per landing page and one for the home page (1200 × 630, dark green, the headline in Fraunces, the seat grid, `DataTalks.Club Academy`). Generate them at build or commit time with a small script (for example a Playwright screenshot of a hidden `/og/<slug>/` route, or `satori`), and commit the PNGs to `public/og/`.
- Favicon: a single seat square in mint on green (SVG plus a 32px PNG fallback).
- `robots.txt` allowing all, `sitemap.xml`.
- Performance budget: no client framework; total JS under 15 KB; fonts preloaded for the two most used files only; Lighthouse mobile performance ≥ 95 and accessibility ≥ 95.

## 10. Tests and CI

Playwright (Chromium; desktop 1440 × 900 and mobile 390 × 844 projects) against the built site (`astro preview`), with the API mocked through `page.route`:

1. Both landing pages render every section id in the required order, and **the ordered list of section ids, heading levels and form field names is identical** between the two pages.
2. The email input is `required` with `type="email"`. Submitting empty or with `not-an-email` shows the inline error and sends no request.
3. A valid submit sends one `POST /signup` whose JSON has the right `track`, the email, `consent_version`, and the `utm_*` values from the query string (test with `?utm_source=test&utm_campaign=c1&utm_content=a`); the success panel appears in both form positions; choosing a chip sends a second request with `answers`; the survey link contains the encoded track option and email.
4. A failing API (500 and network error) shows the error message and no success panel.
5. A filled honeypot is passed through in the request body (the server decides).
6. `/pv` is called once per page load with the page path.
7. No request leaves the site's origin except to the API host. No cookies are set and `localStorage`/`sessionStorage` stay empty.
8. Footer links to `/privacy/` and `/impressum/` work on every page, with the base path applied (run the suite once with `BASE_PATH=/academy/`).
9. At 390px width no element overflows horizontally on any page (`document.documentElement.scrollWidth <= innerWidth`).
10. The sticky bar appears after scrolling past the hero form on mobile and is hidden after a successful signup.

Workflows:

- `.github/workflows/ci.yml` on pull requests and pushes: `npm ci`, `astro check`, build, Playwright tests (both base paths). Upload the Playwright report on failure.
- `.github/workflows/deploy.yml` on push to `main` (and `workflow_dispatch`): build with `SITE_URL`, `BASE_PATH` and `PUBLIC_API_URL` taken from repository variables `SITE_URL`, `BASE_PATH`, `API_URL` (with the defaults above when unset, except that `BASE_PATH` defaults to `/academy/` and `SITE_URL` to `https://datatalksclub.github.io` **in the workflow** until the orchestrator sets the variables for the custom domain), then deploy to GitHub Pages.

README: what the site is, how to run it (`npm install`, `npm run dev`, `npm test`), how the two pages are kept identical, the environment variables, and how the domain switch works.
