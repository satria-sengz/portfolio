export const site = {
  name: "Satria Putra",
  role: "AI Engineer (Full Stack) and Engineering Manager",
  hook: "I build the pipeline my team ships through.",
  intro:
    "Ten years of backend work by hand. Since November 2025 coding agents write most of the code at The Body Shop Indonesia, and my job became the gates that make their output safe to deploy: the ticket rules, the failing-test-first gate, the subagent roster, and the knowledge base they read before they act. I still ship every week.",
  location:
    "Tangerang, Indonesia (UTC+7). Open to remote work with a few hours of overlap.",
  links: {
    email: "satriaputra1994@gmail.com",
    linkedin: "https://www.linkedin.com/in/satriaputra",
    github: "https://github.com/satria-putra",
    cv: "/Satria_Putra_CV.pdf",
  },
};

export const stats = [
  { value: "249", label: "endpoints being ported from NestJS to Go, byte for byte" },
  { value: "21", label: "subagents, one per service, each with its own instruction file" },
  { value: "5,000+", label: "notes in the knowledge base agents read before they act" },
  { value: "739", label: "commits on one project in a month, all under my name" },
];

export const timeline = [
  {
    when: "Nov 2025",
    text: "Started with Augment Code on our NestJS services. The first few weeks were mostly finding out how agents break: wrong test runner, stale context, three different browser tools across three repos. That is where the standards work began.",
  },
  {
    when: "Dec 2025 to Feb 2026",
    text: "Moved to Claude Code as the daily driver and shipped the first LLM features to production: receipt OCR with a vision model, then a separate categorizer and a claim validator, all through OpenRouter. The model for each feature lives in a config table, so swapping one is a row update rather than a deploy.",
  },
  {
    when: "Mar 2026",
    text: "Wrote the orchestrator: 21 subagents, one per service. Built a smaller fleet of seven for the internal tools platform, including a meta-agent whose only job is to recalibrate the others when they drift. The Obsidian vault became the thing agents read first.",
  },
  {
    when: "Apr to Jun 2026",
    text: "Turned habits into rules. Jira frozen; tickets are markdown files in git. No implementation until a failing test is committed and its hash is in the ticket. Under those rules I shipped three production platforms mostly alone, with 739, 413 and 215 commits under my name.",
  },
  {
    when: "Jun 2026 to now",
    text: "Added Paseo to run agents in parallel. Since July the main job has been porting the inventory service from NestJS to Go, 249 endpoints, with golden tests recorded from the live service so every response stays identical. Cutover is per path, and the old service still answers anything not yet ported.",
  },
];

export type Concept = {
  id: string;
  title: string;
  tldr: string;
  steps: string[];
  decisions: string[];
  broke: string;
  stack: string[];
  role: string;
};

export const concepts: Concept[] = [
  {
    id: "ocr",
    title: "Reading a receipt",
    tldr: "Staff photograph a receipt or upload a PDF. Three model calls later the claim has a merchant, a total, a category and a confidence score, and finance sees a form that is already filled in.",
    steps: [
      "The upload lands in private storage. A PDF is rendered page by page to images; photos are hashed (SHA-256 plus a perceptual hash) before anything else happens.",
      "Call one: a vision model reads the image and returns structured JSON with merchant, date, receipt number, line items, total and a confidence score. If the receipt has no printed number, the system generates a short one and marks it as generated.",
      "Call two: a separate, cheaper model categorises the receipt. It gets the extracted items plus enriched category context (keywords, example merchants), not the raw image.",
      "Call three, only when the staff member types a claim description: a validator checks it against the active category list and expands to sibling categories when it matches a parent.",
      "Every call goes through one OpenRouter client with retries and exponential backoff. Model, prompt template and fallback model per feature live in a config table, so switching models is a row update.",
      "If any call fails the upload still succeeds. The fields stay empty and a person fills them in. A slow model never blocks a claim.",
    ],
    decisions: [
      "Separate calls for extraction and categorisation. A vision model is good at reading; a small text model with the right context is better and cheaper at classifying.",
      "Model per feature in the database rather than in code, because the best model for receipts changed three times in two months.",
      "Hashing runs before any model call. Fraud checks must not depend on an LLM being available.",
    ],
    broke:
      "Bank transfer slips. The model kept reading the transfer amount as the total when the claimable amount was the admin fee. Fixed with a rule in the prompt for that receipt type and a regression example in the golden set.",
    stack: ["Next.js 16", "Supabase", "OpenRouter", "Claude Haiku", "GLM vision", "sharp"],
    role: "Sole author of the AI layer and the fraud checks. 67 commits, February 2026.",
  },
  {
    id: "pipeline",
    title: "How a ticket becomes a deploy",
    tldr: "Every change goes through the same loop whether a person or an agent writes the code. The rules live in the repo, so the agents read them the same way the team does.",
    steps: [
      "A ticket is a markdown file in git with frontmatter: id, service, branch, status. Jira is frozen. No ticket, no code.",
      "The orchestrator picks the subagent for the service. There are 21, one per service, each with an instruction file describing the repo, its conventions and its test runner.",
      "The agent writes a failing test first and commits it. That commit hash goes into the ticket. Implementation cannot start without it; an override needs a written reason and a 24-hour regression follow-up.",
      "Implementation, then a second agent reviews adversarially. It is told to look for what the first one got wrong, and it reads the source, not the summary.",
      "Merge follows the codified git flow through dev, preprod and production. The ticket log records what changed and what was verified live.",
      "Every session writes what it learned back to the knowledge base: 5,000+ notes and 370+ SQL recipes. No secrets, no PII, no raw transcripts.",
    ],
    decisions: [
      "Tickets in git instead of Jira, because an agent can read a file in the repo and cannot read a Jira board.",
      "One browser-automation tool for every agent. Three repos had Playwright, Puppeteer and Cypress; agents failed differently in each and the failures were invisible.",
      "The reviewing agent is never the implementing agent. An agent asked to review its own work agrees with itself.",
    ],
    broke:
      "A local clone of one service was 815 commits behind production. The agent ported the stale version faithfully, tests green. Golden tests against the live API caught it. The source of truth is now pinned in the ticket.",
    stack: ["Claude Code", "custom subagents", "MCP", "Paseo", "Obsidian", "git"],
    role: "Designed the workflow and wrote the roster in March 2026. Runs across about 15 services.",
  },
  {
    id: "go",
    title: "Moving 249 endpoints from NestJS to Go without a big bang",
    tldr: "The inventory service used about 1.5 GiB across 8 pods. Equivalent Go services ran at a fraction of that. The rewrite ships module by module behind the same URLs, and the old service keeps answering anything not yet ported.",
    steps: [
      "Inventory first: 249 endpoints in 4 modules, 138 request DTOs with custom validation messages, permissions derived from the API docs. All of it has to stay identical because four frontends use it as-is.",
      "Phase 1 is a Go skeleton: response envelope, error engine, validation parity, the Keycloak guard chain (published as a reusable library), CORS and health checks.",
      "For each module: capture golden responses from the live service, including error bodies and key order. Write the Go handler until the bytes match. Node bugs are replicated on purpose and documented, not fixed, so the frontends see no change.",
      "Each phase runs as subagent-driven TDD, in parallel worktrees where modules are independent, with an adversarial review before the pull request.",
      "Cutover is per path in Traefik. A path routes to Go once its golden tests pass live; everything else still goes to Node. Rolling a path back is one routing change.",
      "Decommission Node only when every path is on Go and has stayed there.",
    ],
    decisions: [
      "Strangler-fig per module instead of a rewrite branch. The service receives around 125 commits a month; a long-lived branch would never catch up.",
      "Byte-exact parity, bugs included. Fixing behaviour during a migration hides which change caused a regression.",
      "A separate auth library, because every future Go service needs the same Keycloak guard.",
    ],
    broke:
      "Traefik matched three write paths that Go had not mounted yet and returned 404 instead of falling back to Node. Fixed with explicit carve-out rules and an exit criterion: every route in the cutover list is either mounted or excluded, never in between.",
    stack: ["Go", "NestJS", "Keycloak", "Traefik", "PostgreSQL", "Oracle"],
    role: "Designed and executed alone, from July 2026. Still in cutover.",
  },
  {
    id: "fraud",
    title: "Five checks a receipt has to pass, none of them an LLM",
    tldr: "Duplicate and edited receipts are the common fraud in petty cash. Each check is cheap, deterministic and explainable, which matters when finance has to tell someone why their claim was blocked.",
    steps: [
      "Layer 1, exact hash. SHA-256 of the file. A match with any earlier receipt blocks submission outright.",
      "Layer 2, perceptual hash. An 8 by 8 average hash of the image compared by Hamming distance. Catches the same receipt re-photographed or re-cropped. Flags for review.",
      "Layer 3, receipt number. The same number from the same staff member blocks; the same number across staff members flags.",
      "Layer 4, transaction fingerprint. Merchant, date and total together. Catches a receipt retyped from scratch.",
      "Layer 5, behaviour. Submission frequency, round amounts, amounts just under approval thresholds, unusual hours. Only ever flags, never blocks.",
      "Blocks stop the claim before it is saved. Flags travel with the claim so the approver sees them next to the receipt.",
    ],
    decisions: [
      "Deterministic checks first. An LLM cannot tell you two files are identical; a hash can, for free.",
      "Block and flag are different outcomes. Only exact evidence blocks; everything else is a signal for a person.",
      "Denied and cancelled items are excluded from the checks, otherwise a resubmission after a fix looks like fraud.",
    ],
    broke:
      "The first version read the OCR result from the wrong nesting level, so layer 4 compared empty strings and never fired. A known duplicate sailed through in testing. A fixture with a real duplicate now runs in CI.",
    stack: ["TypeScript", "sharp", "Supabase", "Jest"],
    role: "Sole author, part of the petty cash module. February 2026.",
  },
];

export const skills = [
  {
    group: "AI and agents",
    items: "Claude Code, custom subagents and instruction files, MCP, Augment Code, Paseo, OpenRouter with Anthropic, xAI, Google and Zhipu models, vision OCR, prompt and model config management, golden-test evaluation, agent knowledge bases",
  },
  {
    group: "Backend",
    items: "Go, TypeScript and Node.js (NestJS), Java (Spring Boot, Quarkus), Python (FastAPI), REST, GraphQL, Kafka, Redis",
  },
  {
    group: "Frontend",
    items: "Next.js (App Router), React, Tailwind CSS, shadcn/ui, Core Web Vitals work",
  },
  {
    group: "Data",
    items: "PostgreSQL (partitioning, TypeORM), MongoDB, Elasticsearch, MSSQL warehouse, Oracle retail ERP, Supabase",
  },
  {
    group: "Infra",
    items: "Kubernetes (EKS), Docker, Jenkins, Traefik, AWS, Keycloak, Ansible",
  },
  {
    group: "How I work",
    items: "TDD, spec-driven development, strangler-fig migrations, engineering standards, code review, leading a team of four",
  },
];

export const experience = [
  {
    role: "IT Development Manager",
    org: "The Body Shop Indonesia",
    dates: "Aug 2025 to now",
    bullets: [
      "Run a team of four and the retail platform behind e-commerce, POS and inventory: about 15 microservices and four frontends.",
      "Designed the AI-native workflow the team works in, wrote the GenAI engineering standards, and maintain the knowledge base agents read before acting.",
      "Porting the inventory service from NestJS to Go on my own. Still shipping as an individual contributor.",
    ],
  },
  {
    role: "Senior Backend Developer",
    org: "The Body Shop Indonesia",
    dates: "Mar 2021 to Jul 2025",
    bullets: [
      "Inventory, product and commerce services in NestJS on PostgreSQL, MongoDB and Kafka. Kubernetes on EKS, Jenkins for CI.",
      "Wrote most of the Java middleware (OTP, notifications, marketplace) and the Go scheduler that syncs marketplace orders.",
    ],
  },
  {
    role: "Web Developer",
    org: "PT Neo-Fusion Indonesia",
    dates: "Mar 2016 to Feb 2021",
    bullets: [
      "Java and Spring Boot for client web applications.",
      "From 2020, main author of The Body Shop Indonesia's Spring Boot backend on AWS. That project is how I ended up joining them in 2021.",
    ],
  },
];
