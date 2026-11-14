// All track-specific copy. This is the ONLY place the two landing pages differ.

export interface Module {
  title: string;
  produce: string;
}
export interface Group {
  weeks: string;
  title: string;
  modules: Module[];
}
export interface Track {
  slug: 'agentic-engineering' | 'ai-engineering';
  label: 'A' | 'B';
  name: string;
  surveyOption: string;
  headline: string;
  /** One word of the headline set in italic (at most one per headline). */
  emphasis: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  outcomesTitle: string;
  outcomes: [string, string, string, string, string, string, string];
  project: string;
  fitFirst: string;
  prerequisites: string;
  syllabus: [Group, Group, Group, Group];
}

export const tracks: Track[] = [
  {
    slug: 'agentic-engineering',
    label: 'A',
    name: 'Agentic Engineering',
    surveyOption: 'A. Agentic engineering',
    headline: 'Build, test and ship software with coding agents.',
    emphasis: 'ship',
    lead: 'A full-time, live program for people who already write code. You learn to run coding agents the way an engineer runs a team: clear specs, small tasks, tests, review, releases. Fifteen seats, taught by Alexey Grigorev.',
    metaTitle: 'Agentic Engineering: a 15-seat live program, April 2027 | DataTalks.Club Academy',
    metaDescription:
      'Learn to build, test and ship software with coding agents. Full-time, live, 15 seats, taught by Alexey Grigorev. Berlin or online, April 2027. Join the shortlist.',
    outcomesTitle: 'By the end you can run a software project with agents, and answer for the result.',
    outcomes: [
      'Turn a product idea into a spec and a set of small tasks.',
      'Build a full-stack feature across the interface, the API and the database.',
      'Work in an existing codebase: debug it and review agent-generated changes.',
      'Automate tests and releases with CI/CD.',
      'Deploy your application and use logs and metrics to investigate failures.',
      'Connect agents to tools through MCP and build reusable workflows for implementation and code review.',
      'Set up and configure an agentic software factory.',
    ],
    project:
      'You ship a working web application for a real user task. People try it, you improve it from their feedback, and you show how you tested and released each change.',
    fitFirst: 'You write code today (Python, JavaScript, TypeScript or similar) and want to move from ad-hoc prompting to disciplined engineering with agents.',
    prerequisites:
      "You can write basic code in Python, JavaScript, TypeScript or a similar language, use the command line and Git, read and explain a short function, and run a simple test. You don't need any experience with coding agents.",
    syllabus: [
      {
        weeks: 'Weeks 1–4',
        title: 'Foundations',
        modules: [
          { title: 'AI development tools: overview and setup.', produce: 'a working environment and your first agent-made commit.' },
          { title: 'Working in a session and in an existing codebase.', produce: "a verified pull request in a repository you didn't write." },
          { title: 'From idea to spec, backlog and full-stack foundation.', produce: 'a product brief, a groomed backlog and a minimal full-stack scaffold with passing backend tests.' },
          { title: 'Introduction to AI engineering.', produce: 'an LLM API app with a chatbot, RAG over documents and a simple tool-calling agent built with coding agents.' },
        ],
      },
      {
        weeks: 'Weeks 5–8',
        title: 'Build and verify',
        modules: [
          { title: 'Testing, verification and debugging.', produce: 'a test suite, and a seeded bug reproduced, fixed and covered.' },
          { title: 'Reviewing agent-generated changes.', produce: 'a review record, a reviewer workflow and two automatic checks.' },
          { title: 'Containers, CI/CD and deployment.', produce: 'your first version deployed through CI (midterm).' },
          { title: 'Permissions, sandboxing and safe operation.', produce: 'a threat sketch and guardrails for your product.' },
        ],
      },
      {
        weeks: 'Weeks 9–12',
        title: 'Operate and automate',
        modules: [
          { title: 'Environments, logs, metrics and an on-call agent.', produce: 'dashboards, one alert, and a failure investigated from telemetry.' },
          { title: 'Reusable workflows: skills, subagents and hooks.', produce: 'packaged implementation and code-review workflows.' },
          { title: 'Connecting agents to tools through MCP.', produce: "your product's tools exposed through MCP and used by the agent." },
          { title: 'Agent teams, loops and the software factory.', produce: 'an agent-team backlog batch, configured factory and operating guide.' },
        ],
      },
      {
        weeks: 'Weeks 13–16',
        title: 'Capstone and interviews',
        modules: [
          { title: 'Technical interviews and hiring prep (full week, 40 UE).', produce: 'algorithm coding drills without AI, a timed take-home, a project presentation and first peer mocks.' },
          { title: 'Capstone I and interview practice.', produce: 'your 80 UE capstone core alongside weekly coding drills and squad mock interviews.' },
          { title: 'Capstone II and interview practice.', produce: 'user-tested capstone improvements, mock interviews and project-talk rehearsals.' },
          { title: 'Capstone III: release, defence and career prep.', produce: 'the launched product, defence, final 40 UE interview practice and 3 individual 45-min career consultations plus written CV review (no placement promises).' },
        ],
      },
    ],
  },
  {
    slug: 'ai-engineering',
    label: 'B',
    name: 'AI Engineering',
    surveyOption: 'B. AI engineering',
    headline: 'Build, evaluate and run applications on language models.',
    emphasis: 'evaluate',
    lead: 'A full-time, live program for people who already write code. You learn to build LLM applications the way an engineer builds any system: retrieval, tools, evaluation, deployment, monitoring. Fifteen seats, taught by Alexey Grigorev.',
    metaTitle: 'AI Engineering: a 15-seat live program, April 2027 | DataTalks.Club Academy',
    metaDescription:
      'Learn to build, evaluate and run LLM applications: RAG, agents, evals, deployment. Full-time, live, 15 seats, taught by Alexey Grigorev. Berlin or online, April 2027. Join the shortlist.',
    outcomesTitle: 'By the end you can build an AI application, and show where it works and where it fails.',
    outcomes: [
      'Build an assistant in Python on an LLM API.',
      'Use retrieval-augmented generation (RAG) and document processing over company data.',
      'Give the assistant tools, function calling and MCP connections to look things up or call an API.',
      'Define what it can do on its own and when it needs human approval.',
      'Evaluate answers and tool use with realistic tasks; compare prompts, models and retrieval methods; catch regressions.',
      'Deploy the application to the cloud and trace its model and tool calls.',
      'Track quality, latency and cost, and handle failures safely with guardrails.',
    ],
    project:
      'You build and deploy an AI assistant for a concrete company use case, for example one that answers questions from messy internal documents with sources and carries out actions after human approval. You show where it works, where it fails, and how you measured that.',
    fitFirst: 'You program today, ideally in Python, and can use APIs and work in a repository.',
    prerequisites:
      "You are comfortable programming, preferably in Python, and you can use the command line, Git and basic Docker. You don't need a machine-learning background, advanced mathematics or a GPU.",
    syllabus: [
      {
        weeks: 'Weeks 1–4',
        title: 'Retrieval',
        modules: [
          { title: 'Agentic engineering basics and a Python service on an LLM API.', produce: 'a working coding-agent setup (day 1) and a small API that returns validated, structured answers.' },
          { title: 'Retrieval, document processing and indexing.', produce: 'a one-command ingestion pipeline and a knowledge assistant with sources.' },
          { title: 'Vector and hybrid search.', produce: 'three retrieval variants, with examples of where each fails.' },
          { title: 'Evaluating retrieval.', produce: 'a retrieval evaluation and a justified configuration.' },
        ],
      },
      {
        weeks: 'Weeks 5–8',
        title: 'Agents',
        modules: [
          { title: 'Agentic engineering workflow, tools and the agent loop.', produce: 'the full agent workflow on your project repo (spec to tasks, tests, diff review, CI) and an assistant that calls an API through a tool.' },
          { title: 'Agent frameworks, MCP and context.', produce: 'the assistant rebuilt on a framework, with one MCP tool.' },
          { title: 'Serving and cloud deployment.', produce: 'a deployed assistant with cited answers and one tool (midterm).' },
          { title: 'Agentic workflows and human approval.', produce: 'a workflow action that waits for approval and handles refusal.' },
        ],
      },
      {
        weeks: 'Weeks 9–12',
        title: 'Quality and production',
        modules: [
          { title: 'Testing LLM applications and CI/CD.', produce: 'a regression suite running in CI.' },
          { title: 'Evaluating answers and agents.', produce: 'an evaluation report comparing two configurations.' },
          { title: 'Tracing, monitoring, cost and latency.', produce: 'traces, dashboards, and a cost/latency report with a measured improvement.' },
          { title: 'Safety: guardrails, injection and compliance.', produce: 'tested guardrails and a short compliance checklist.' },
        ],
      },
      {
        weeks: 'Weeks 13–16',
        title: 'Capstone and interviews',
        modules: [
          { title: 'Technical interviews and hiring prep (full week, 40 UE).', produce: 'algorithm coding drills without AI, a timed take-home, a project presentation and first peer mocks.' },
          { title: 'Capstone I and interview practice.', produce: 'your 80 UE capstone assistant core alongside weekly coding drills and squad mock interviews.' },
          { title: 'Capstone II and interview practice.', produce: 'evaluation evidence, improved assistant, mock interviews and project-talk rehearsals.' },
          { title: 'Capstone III: deploy, defence and career prep.', produce: 'the deployed assistant, defence, final 40 UE interview practice and 3 individual 45-min career consultations plus written CV review (no placement promises).' },
        ],
      },
    ],
  },
];

export function otherTrack(slug: string): Track {
  return tracks.find((t) => t.slug !== slug)!;
}
