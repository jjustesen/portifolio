// All site copy lives here, following docs/ideia-base.md. Use "\n" for intentional line breaks.
// Items marked TODO need real data from the CV before launch.

export interface Link {
  label: string;
  href: string;
}

/** A screen of the product: a still image, or a live animated demo (an HTML page in public/demos/). */
export interface ProjectMedia {
  kind: 'image' | 'demo';
  src: string;
  /** Image alt text, or the demo's accessible title. */
  alt: string;
  caption: string;
}

/** Content of a project's page (/work/:slug). */
export interface ProjectPage {
  intro: string;
  /** Live product or case link, shown under the intro. */
  link?: Link;
  context: string;
  /** Screens of the product, shown between context and contributions. */
  media?: ProjectMedia[];
  contributions: string[];
  outcome: string;
  stack: string;
}

export interface Project {
  /** Stable id (used for margin notes). */
  key: string;
  /** URL of the project page: /work/<slug>. */
  slug: string;
  /** Square image shown in the hover preview (public/…). */
  preview: string;
  page: ProjectPage;
  index: string;
  category: string;
  name: string;
  summary: string;
  role?: string;
  stack?: string;
  owned?: string;
  outcome?: string;
  /** Real, measurable results only (e.g. "Used by 12 teams"). */
  metrics?: string[];
}

export interface Step {
  index: string;
  title: string;
  body: string;
}

export interface Capability {
  title: string;
  items: string;
}

export interface Role {
  period: string;
  title: string;
  scope: string;
}

export const site = {
  name: 'Johannes Justesen',
  initials: 'JJ',
  // Section anchors on the home page; they work from project pages too.
  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'Process', href: '/#process' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Lab', href: '/#lab' },
    { label: 'Contact', href: '/#contact' },
  ] satisfies Link[],
};

export const hero = {
  name: 'Johannes\nJustesen',
  role: 'Frontend Engineer',
  focus: 'AI products / Interaction / Systems',
  tagline: 'Building interfaces for machines that think,\nstream, predict and respond.',
  meta: 'Norway / EU · Available for selected work · 6+ years',
  ctas: [
    { label: 'View selected work →', href: '#work' },
    // TODO: point to the real CV PDF (e.g. /cv.pdf in public/).
    { label: 'Download CV →', href: '#' },
  ] satisfies Link[],
};

export const manifesto = {
  statement: 'I build the interface layer between\ncomplex systems and human intuition.',
  support: 'My work sits where product thinking, frontend architecture,\nreal-time data and interaction design meet.',
};

// TODO: real preview images (square) and page copy for projects 02 and 03.
export const projects: Project[] = [
  {
    key: 'auramind',
    slug: 'auramind',
    preview: '/previews/auramind.png',
    page: {
      intro: 'Sole frontend engineer on Auramind, a corporate generative AI platform running on AWS in a dedicated environment for each client.',
      link: { label: 'Visit auramind.ai ↗', href: 'https://auramind.ai' },
      context:
        'Companies wanted the power of large language models without the chaos: answers grounded in their own knowledge, access shaped by department and guardrails they could trust. Auramind brings assistants for IT, HR, Finance, Legal, Operations and Sales together with multiple models, including Claude and Amazon Nova.\nThe interface had to make streaming, configuration and governance feel calm, and let non-technical people build real tools.',
      // Recreated, animated screens (English). Source: public/demos/auramind/.
      media: [
        {
          kind: 'demo',
          src: '/demos/auramind/index.html?clean#chat',
          alt: 'Auramind chat: tools are enabled, a prompt is sent and the answer streams in with a generated component.',
          caption: 'Chat: pick tools, ask, and get a streamed answer with a working component attached.',
        },
        {
          kind: 'demo',
          src: '/demos/auramind/index.html?clean#editor',
          alt: 'Aura Apps editor: chat requests create new versions of a dashboard while its code updates, then the live preview.',
          caption: 'Aura Apps: describe a change in chat, get a new version of the app, switch between code and preview.',
        },
        {
          kind: 'demo',
          src: '/demos/auramind/index.html?clean#gallery',
          alt: 'Aura Apps gallery: apps are browsed, a previous version is restored and an app is launched.',
          caption: 'Apps gallery: private, department or public apps, each with its own version history.',
        },
      ],
      contributions: [
        'Frontend architecture and a component system shared across chat, admin and apps',
        'Streaming chat UX for long, partial and interrupted responses',
        'Aura Apps: describe an app in chat, see it live, switch to code, preview per device, restore any version and publish it',
        'Admin surfaces for users, departments, knowledge base, guardrails and memories',
        'Interaction analytics that surface recurring demands and training gaps',
      ],
      outcome: 'Turned a wide set of AI capabilities into one product\nthat feels like a single, legible tool.',
      stack: 'React · TypeScript · Amazon Bedrock · AWS',
    },
    index: 'Project 01',
    category: 'Enterprise AI',
    name: 'Auramind',
    summary: 'An enterprise generative AI platform on AWS, where teams chat\nwith specialised assistants, ground answers in company knowledge\nand turn a prompt into a working, versioned app.',
    role: 'Senior Frontend Developer / Sole frontend engineer',
    stack: 'React · TypeScript · Amazon Bedrock · AWS',
    owned: 'Frontend architecture and component system, streaming chat,\nAura Apps (prompt-to-app with live preview, code view and versions),\nmodel configuration, governance and interaction analytics.',
    outcome: 'One coherent interface for chat, knowledge, governance\nand app generation, calm enough for non-technical teams.',
    // TODO: add real numbers, e.g. "Reduced time to first usable response by X%".
    metrics: [],
  },
  {
    key: 'project2',
    slug: 'moita',
    preview: '/previews/moita.png',
    page: {
      intro:
        'I conceived, designed and built Moita on my own: a second brain for meetings that records any call without joining it as a bot, understands who said what, and turns every conversation into searchable memory.',
      link: { label: 'Watch the launch post ↗', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7487461790537166849/' },
      context:
        'Decisions and promises made in meetings, on a call or around a table, get lost between tools. Moita captures the call audio straight from the operating system, so there is no bot in the room, and it works the same for a Zoom call, a Discord chat or an idea spoken into a smartwatch.\nWhen a recording ends, a pipeline of AI models transcribes it, separates and recognises the speakers, and generates a title, summary, tasks, chapters and tags, all in the background.',
      // Recreated, animated screens (English). Source: public/demos/moita/.
      media: [
        {
          kind: 'demo',
          src: '/demos/moita/index.html?clean#record',
          alt: 'A recording is stopped, the processing pipeline runs step by step, and the AI title, tags, summary and tasks appear.',
          caption: 'Recording → AI: stop a call and watch the pipeline transcribe, separate speakers and generate the summary and tasks.',
        },
        {
          kind: 'demo',
          src: '/demos/moita/index.html?clean#speakers',
          alt: 'An unknown speaker is named after consent, the name spreads through the transcript and onto their tasks.',
          caption: 'Speakers: name a voice once, with explicit biometric consent, and Moita recognises it in every future meeting.',
        },
        {
          kind: 'demo',
          src: '/demos/moita/index.html?clean#tasks',
          alt: 'The tasks page groups tasks by meeting; a task is completed and the list is filtered by high priority.',
          caption: 'Tasks: every commitment from every meeting, grouped, prioritised and assigned to whoever said it.',
        },
      ],
      contributions: [
        'Product and UX end to end, across a Windows app, a mobile app, a Wear OS watch app and the landing page',
        'Native audio capture in C++: per-process WASAPI loopback that records only the call’s audio, with crash-safe chunked uploads',
        'AI pipeline: Whisper or Google Chirp 3 transcription, pyannote diarization on GPU, and Gemini generating titles, summaries, tasks, chapters and tags in parallel',
        'Voice fingerprints: speaker embeddings that improve with every meeting, so known people are named automatically, behind an explicit biometric consent',
        'Chat with one meeting, or with all of them: retrieval over pgvector embeddings with Gemini answers',
        'Automatic call detection for any app using the microphone, a live processing timeline and cost tracking for every AI call',
      ],
      outcome:
        'One person, the whole product: a native capture layer, GPU AI services and a Gemini pipeline that turns any conversation into tasks and answers, released as an auto-updating desktop app.',
      stack: 'Electron · React · TypeScript · C++ (WASAPI) · Python · Supabase · pgvector · Gemini · Whisper · pyannote · SpeechBrain · Cloud Run · Expo · Kotlin',
    },
    index: 'Project 02',
    category: 'Meeting AI · Solo build',
    name: 'Moita',
    summary:
      'A meeting memory that never forgets: it records calls without a bot, transcribes them, recognises every voice across meetings, and turns what was said into summaries, tasks and answers.',
    role: 'Founder, designer and engineer / Built end to end, solo',
    stack: 'Electron · React · C++ · Python · Supabase · Gemini · Whisper',
    owned: 'Everything: the Windows app and its native audio capture, the GPU AI services,\nthe Supabase backend, the mobile and Wear OS apps and the landing page.',
    outcome: 'A cross-platform AI product in public releases,\nbuilt by one person from native audio capture to the last prompt.',
  },
  {
    key: 'project3',
    slug: 'vocab-node',
    preview: '/previews/vocab-node.png',
    page: {
      intro:
        'I conceived, designed and built Vocab Node on my own: an AI teaching platform where freelance English teachers turn their class material into interactive homework, teach live on video and follow every student’s progress.',
      context:
        'Freelance teachers run their business on WhatsApp and photographed PDFs, and lose hours every week writing homework. Vocab Node is the extension of the private lesson, built on one rule: the AI proposes, the teacher decides.\nA teacher drops in a text, a photo or a PDF of the class handout, and the AI writes a level-calibrated activity grounded only in that material. Students never sign up or install anything: they open a link on their phone and practise for ten minutes.',
      // Recreated, animated screens (English). Source: public/demos/vocabnode/.
      media: [
        {
          kind: 'demo',
          src: '/demos/vocabnode/index.html?clean#lesson',
          alt: 'The teacher pastes class material, the AI generates a ten-question activity, and it is sent to two students.',
          caption: 'AI lesson: from class material to a reviewed, ten-question activity, sent to each student with their own link.',
        },
        {
          kind: 'demo',
          src: '/demos/vocabnode/index.html?clean#task',
          alt: 'A student on a phone answers multiple choice, matching and word-order questions with instant feedback.',
          caption: 'Student task: no sign-up, instant feedback on every answer, and the result goes straight back to the teacher.',
        },
        {
          kind: 'demo',
          src: '/demos/vocabnode/index.html?clean#call',
          alt: 'The teacher opens the student’s room, admits them from the waiting room and teaches on a shared whiteboard.',
          caption: 'Live class: one permanent room per student, a waiting room, and a shared whiteboard on stage.',
        },
      ],
      contributions: [
        'Product and UX end to end: the spec, every flow and every screen, from the teacher’s dashboard to the student’s phone',
        'AI generation pipeline: Gemini with schema-constrained JSON and a Grok fallback, reading text, photos and PDFs, grounded only in the teacher’s material',
        'Guardrails around the model: server-side validation that discards bad questions and regenerates the gap, monthly quotas, and cost tracking per generation',
        'AI speech: Gemini text-to-speech for listening exercises, and blind transcription for pronunciation scoring that the model can’t game',
        'Live classroom on LiveKit: waiting room, shared stage, collaborative whiteboard, reactions and camera background effects',
        'Supabase backend: Postgres with row-level security for teachers, and edge functions that run every AI call and every student action, so API keys, quotas and answer checks stay on the server; plus token-hashed student links and Stripe billing',
      ],
      outcome:
        'One person, the whole product: from the PRD to a secure serverless backend and an AI pipeline that turns a photo of a class handout into a ready-to-send lesson.',
      stack: 'React 19 · TypeScript · Tailwind · Supabase · Deno Edge Functions · Gemini · Grok · LiveKit · Stripe',
    },
    index: 'Project 03',
    category: 'AI product · Solo build',
    name: 'Vocab Node',
    summary:
      'An AI teaching platform for freelance English teachers: class material becomes interactive homework in about a minute, lessons happen live on video, and every answer is tracked.',
    role: 'Founder, designer and engineer / Built end to end, solo',
    stack: 'React · TypeScript · Supabase · Gemini · LiveKit · Stripe',
    owned: 'Everything: the product spec, UX and UI, frontend, Supabase backend,\nthe AI generation and speech pipeline, the live classroom and billing.',
    outcome: 'A complete AI product designed and built by one person,\nfrom the first sketch to the last edge function.',
  },
];

export const process = {
  title: 'From complexity to clarity',
  steps: [
    {
      index: '01',
      title: 'Understand the system',
      body: 'I map constraints, users, data flows and product goals\nbefore deciding what the interface should become.',
    },
    {
      index: '02',
      title: 'Build the interaction model',
      body: 'I translate invisible system behavior into feedback,\nstates, motion and clear decision points.',
    },
    {
      index: '03',
      title: 'Engineer for change',
      body: 'I create frontend systems that remain understandable\nwhen the product, team and technical scope grow.',
    },
  ] satisfies Step[],
};

export const capabilities: Capability[] = [
  { title: 'Frontend systems', items: 'React · TypeScript · Next.js · Design systems · Accessibility' },
  { title: 'AI product interfaces', items: 'Streaming UX · Model configuration · Prompt workflows · Evaluation UI' },
  { title: 'Interaction', items: 'Motion · WebGL · Creative development · Prototyping' },
  { title: 'Platform', items: 'AWS · Amazon Bedrock · API integration · Analytics · Performance' },
];

// TODO: exact titles, companies and dates from the CV.
export const experience: Role[] = [
  { period: '2024 — 2026', title: 'Senior Frontend Developer', scope: 'Enterprise generative AI platform' },
  { period: '2022 — 2024', title: 'Frontend Engineer', scope: 'Product interfaces, scalable systems and interaction work' },
  { period: 'Earlier', title: 'Web development', scope: 'Creative technology and visual experimentation' },
];

export const lab = {
  intro: 'A space for experiments in WebGL, interaction,\ngenerative systems and visual computing.',
  items: [
    '01 / Optical interfaces',
    '02 / Real-time motion studies',
    '03 / AI interaction prototypes',
    '04 / Image, sound and code experiments',
  ],
};

export const contact = {
  title: 'Let’s build\nsomething clearer.',
  body: 'Available for senior frontend, AI product\nand creative technology collaborations.',
  email: 'johannesjustensen99@gmail.com',
  links: [
    // TODO: real profile URLs and CV file.
    { label: 'LinkedIn ↗', href: '#' },
    { label: 'GitHub ↗', href: '#' },
    { label: 'CV PDF ↗', href: '#' },
  ] satisfies Link[],
};
