export type CuratedSkillRef = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  collectionId: string;
  creator: {
    name: string;
    xHandle: string;
    xUrl: string;
    xPostUrl?: string;
    githubRepo: string;
    githubUrl: string;
  };
  installCommand?: string;
  installNote?: string;
  pinnedSha?: string;
  vettedAt: string;
  starsOrInstalls?: string;
  pairsWithCmk: string[];
  featured?: boolean;
  isNew?: boolean;
};

export type SkillCollection = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
};

export const SKILL_COLLECTIONS: SkillCollection[] = [
  {
    id: "design",
    title: "Design",
    subtitle: "UI taste, motion & polish",
    description:
      "Named-designer taste layers, motion grammars, and interface guidelines that stop agents from generating generic AI layouts.",
    badge: "Design & UI",
  },
  {
    id: "explainers",
    title: "Explainers",
    subtitle: "Interactive SVG & visual decks",
    description:
      "Skills that turn complex architectures, diffs, and plans into working isometric machines or hand-drawn HTML explainers.",
    badge: "Visuals",
  },
  {
    id: "workflow",
    title: "Workflow & Grill",
    subtitle: "Plan interrogation & human gates",
    description:
      "Elicitation companions, plan annotators, and autonomous loops that pair with cmk:requirements and cmk:delivery-pipeline.",
    badge: "Engineering",
  },
  {
    id: "security",
    title: "Security & QA",
    subtitle: "Reasoning audits & browser proof",
    description:
      "Security review lenses, differential smart-contract analyzers, and headless browser verifiers for ship evidence.",
    badge: "Verification",
  },
  {
    id: "vendors",
    title: "Vendor SDKs",
    subtitle: "First-party platform rules",
    description:
      "Official skills maintained by Vercel, Cloudflare, Supabase, and Stripe to keep generated SDK code current.",
    badge: "Ecosystem",
  },
  {
    id: "memory",
    title: "Memory & Voice",
    subtitle: "Anti-slop prose & user profiles",
    description:
      "Humanizers that strip AI writing tropes, plus personal preference and cross-session memory companions.",
    badge: "Personalization",
  },
];

export const CURATED_SKILL_REFS: CuratedSkillRef[] = [
  // ─── Design Collection ───────────────────────────────────────────────
  {
    id: "emilkowalski-skills",
    name: "emilkowalski/skills",
    title: "Emil Kowalski Motion & UI Polish",
    tagline:
      "A named designer's taste: spring physics, restraint in micro-interactions, and Apple-grade animation grammar for web UI.",
    collectionId: "design",
    creator: {
      name: "Emil Kowalski",
      xHandle: "emilkowalski_",
      xUrl: "https://x.com/emilkowalski_",
      githubRepo: "emilkowalski/skills",
      githubUrl: "https://github.com/emilkowalski/skills",
    },
    installCommand: "npx skills add emilkowalski/skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "45.1k stars",
    pairsWithCmk: ["design", "rule", "delivery-review"],
    featured: true,
    isNew: true,
  },
  {
    id: "impeccable",
    name: "impeccable",
    title: "Impeccable Design Language",
    tagline:
      "Opinionated design-language layer with /polish, /audit, and /typeset commands plus a comprehensive UI anti-pattern library.",
    collectionId: "design",
    creator: {
      name: "Paul Bakaus",
      xHandle: "pbakaus",
      xUrl: "https://x.com/pbakaus",
      githubRepo: "pbakaus/impeccable",
      githubUrl: "https://github.com/pbakaus/impeccable",
    },
    installCommand: "npx skills add pbakaus/impeccable",
    vettedAt: "2026-10-11",
    starsOrInstalls: "79.5k stars",
    pairsWithCmk: ["design", "delivery-simplify"],
    featured: true,
  },
  {
    id: "taste-skill",
    name: "design-taste-frontend",
    title: "Metric-Driven Taste Skill",
    tagline:
      "Quantified layout rhythm, optical alignment, typography hierarchy, and spacing rules for frontend engineering.",
    collectionId: "design",
    creator: {
      name: "Leon Lin",
      xHandle: "Leonxlnx",
      xUrl: "https://x.com/Leonxlnx",
      githubRepo: "Leonxlnx/taste-skill",
      githubUrl: "https://github.com/Leonxlnx/taste-skill",
    },
    installCommand: "npx skills add Leonxlnx/taste-skill --skill design-taste-frontend",
    vettedAt: "2026-10-11",
    starsOrInstalls: "94.5k stars",
    pairsWithCmk: ["design", "rule"],
  },
  {
    id: "ui-ux-pro-max",
    name: "ui-ux-pro-max",
    title: "UI/UX Pro Max System Generator",
    tagline:
      "Searchable style, palette, and font pairing database with a design-system generator and WCAG contrast checklist.",
    collectionId: "design",
    creator: {
      name: "NextLevelBuilder",
      xHandle: "nextlevelbuild",
      xUrl: "https://x.com/search?q=ui-ux-pro-max-skill",
      githubRepo: "nextlevelbuilder/ui-ux-pro-max-skill",
      githubUrl: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    },
    installCommand: "npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max",
    vettedAt: "2026-10-11",
    starsOrInstalls: "134.6k stars",
    pairsWithCmk: ["design", "requirements"],
  },
  {
    id: "frontend-design",
    name: "frontend-design",
    title: "Anthropic Frontend Design Baseline",
    tagline:
      "Anthropic's canonical baseline skill for avoiding generic AI UI layouts, purple gradients, and cookie-cutter card grids.",
    collectionId: "design",
    creator: {
      name: "Anthropic",
      xHandle: "AnthropicAI",
      xUrl: "https://x.com/AnthropicAI",
      githubRepo: "anthropics/skills",
      githubUrl: "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
    },
    installCommand: "npx skills add anthropics/skills --skill frontend-design",
    vettedAt: "2026-10-11",
    starsOrInstalls: "973k installs",
    pairsWithCmk: ["design", "repo-setup"],
  },
  {
    id: "web-design-guidelines",
    name: "web-design-guidelines",
    title: "Vercel Web Interface Guidelines",
    tagline:
      "Audits components against Vercel's interface checklist: keyboard focus rings, hit targets, tabular numerals, and layout stability.",
    collectionId: "design",
    creator: {
      name: "Vercel Labs",
      xHandle: "vercel",
      xUrl: "https://x.com/vercel",
      githubRepo: "vercel-labs/agent-skills",
      githubUrl: "https://github.com/vercel-labs/agent-skills",
    },
    installCommand: "npx skills add vercel-labs/agent-skills --skill web-design-guidelines",
    vettedAt: "2026-10-11",
    starsOrInstalls: "32.2k stars",
    pairsWithCmk: ["delivery-review", "rule"],
  },
  {
    id: "shadcn-skill",
    name: "shadcn/ui",
    title: "Official shadcn/ui Registry Skill",
    tagline:
      "Teaches agents shadcn CLI v4, custom component registries, and clean token wiring without overwriting project globals.",
    collectionId: "design",
    creator: {
      name: "shadcn",
      xHandle: "shadcn",
      xUrl: "https://x.com/shadcn",
      githubRepo: "shadcn-ui/ui",
      githubUrl: "https://ui.shadcn.com/docs/skills",
    },
    installCommand: "npx skills add shadcn/ui",
    vettedAt: "2026-10-11",
    starsOrInstalls: "125k stars",
    pairsWithCmk: ["toolchain", "project-layout"],
  },

  // ─── Explainers Collection ───────────────────────────────────────────
  {
    id: "anatomy",
    name: "anatomy",
    title: "Anatomy — Explain by Building",
    tagline:
      "Explains a technical concept by inventing a working machine whose operation is the concept, rendered as interactive isometric SVG.",
    collectionId: "explainers",
    creator: {
      name: "Ryan",
      xHandle: "wheresryan22",
      xUrl: "https://x.com/wheresryan22",
      githubRepo: "wheresryan22/anatomy",
      githubUrl: "https://github.com/wheresryan22/anatomy",
    },
    installCommand: "npx skills add wheresryan22/anatomy",
    vettedAt: "2026-10-11",
    starsOrInstalls: "418 stars · MIT",
    pairsWithCmk: ["codebase-docs", "design", "docs"],
    featured: true,
    isNew: true,
  },
  {
    id: "visual-explainer",
    name: "visual-explainer",
    title: "Visual Explainer Decks & Diffs",
    tagline:
      "Builds self-contained HTML pages and slide decks with hand-drawn diagrams for architecture reviews, PR recaps, and plan audits.",
    collectionId: "explainers",
    creator: {
      name: "Nico Bailon",
      xHandle: "nicobailon",
      xUrl: "https://x.com/nicobailon",
      githubRepo: "nicobailon/visual-explainer",
      githubUrl: "https://github.com/nicobailon/visual-explainer",
    },
    installCommand: "npx skills add nicobailon/visual-explainer",
    vettedAt: "2026-10-11",
    starsOrInstalls: "10.3k stars",
    pairsWithCmk: ["design", "delivery-handoff", "delivery-review"],
    featured: true,
  },
  {
    id: "understand-anything",
    name: "Understand-Anything",
    title: "Understand-Anything Knowledge Graph",
    tagline:
      "Turns an unfamiliar repository into an interactive, queryable knowledge graph that complements progressive-disclosure docs.",
    collectionId: "explainers",
    creator: {
      name: "Egonex AI",
      xHandle: "EgonexAI",
      xUrl: "https://x.com/search?q=Understand-Anything+github",
      githubRepo: "Egonex-AI/Understand-Anything",
      githubUrl: "https://github.com/Egonex-AI/Understand-Anything",
    },
    installCommand: "npx skills add Egonex-AI/Understand-Anything",
    vettedAt: "2026-10-11",
    starsOrInstalls: "85.9k stars",
    pairsWithCmk: ["codebase-docs", "discover-efforts"],
  },

  // ─── Workflow & Grill Collection ─────────────────────────────────────
  {
    id: "grill-me",
    name: "grill-me",
    title: "Matt Pocock's Grill-Me Interrogation",
    tagline:
      "Relentlessly interviews you about edge cases, hidden assumptions, and trade-offs before a single line of spec or code is written.",
    collectionId: "workflow",
    creator: {
      name: "Matt Pocock",
      xHandle: "mattpocockuk",
      xUrl: "https://x.com/mattpocockuk",
      githubRepo: "mattpocock/skills",
      githubUrl: "https://github.com/mattpocock/skills",
    },
    installCommand: "npx skills add mattpocock/skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "1.3M installs",
    pairsWithCmk: ["requirements", "delivery-spec-plan", "adr"],
    featured: true,
    isNew: true,
  },
  {
    id: "plannotator",
    name: "plannotator",
    title: "Plannotator — Local Plan & Diff Gate",
    tagline:
      "Annotate an agent's implementation plan locally before execution and review diffs PR-style with structured feedback back to the agent.",
    collectionId: "workflow",
    creator: {
      name: "backnotprop",
      xHandle: "backnotprop",
      xUrl: "https://x.com/backnotprop",
      githubRepo: "backnotprop/plannotator",
      githubUrl: "https://github.com/backnotprop/plannotator",
    },
    installNote: "Use when already installed locally (/plannotator-annotate & /plannotator-review)",
    pinnedSha: "5e38b79",
    vettedAt: "2026-10-12",
    starsOrInstalls: "Pinned SHA 5e38b79",
    pairsWithCmk: ["delivery-spec-plan", "delivery-ship", "delivery-review"],
    featured: true,
    isNew: true,
  },
  {
    id: "superpowers",
    name: "superpowers",
    title: "Obra Superpowers Methodology",
    tagline:
      "Battle-tested workflows for structured brainstorming, TDD, systematic debugging, and subagent-driven implementation.",
    collectionId: "workflow",
    creator: {
      name: "Jesse Vincent",
      xHandle: "obra",
      xUrl: "https://x.com/obra",
      githubRepo: "obra/superpowers",
      githubUrl: "https://github.com/obra/superpowers",
    },
    installCommand: "npx skills add obra/superpowers",
    vettedAt: "2026-10-11",
    starsOrInstalls: "297k stars",
    pairsWithCmk: ["delivery-pipeline", "requirements", "delivery-spec-plan"],
  },
  {
    id: "compound-engineering",
    name: "compound-engineering",
    title: "Every Inc Compound Engineering",
    tagline:
      "Home of the ce-compound session retrospective pattern that turns debugging sessions into durable repository learnings.",
    collectionId: "workflow",
    creator: {
      name: "Every Inc",
      xHandle: "every",
      xUrl: "https://x.com/every",
      githubRepo: "EveryInc/compound-engineering-plugin",
      githubUrl: "https://github.com/EveryInc/compound-engineering-plugin",
    },
    installCommand: "npx skills add EveryInc/compound-engineering-plugin",
    vettedAt: "2026-10-11",
    starsOrInstalls: "25.5k stars",
    pairsWithCmk: ["learn", "rule", "delivery-workflow"],
  },

  // ─── Security & QA Collection ────────────────────────────────────────
  {
    id: "sentry-security-review",
    name: "security-review",
    title: "Sentry Reasoning Security Review",
    tagline:
      "Reasoning-first security review lens from Sentry engineers — traces trust boundaries and exploit paths instead of running a rote checklist.",
    collectionId: "security",
    creator: {
      name: "Sentry",
      xHandle: "getsentry",
      xUrl: "https://x.com/getsentry",
      githubRepo: "getsentry/skills",
      githubUrl: "https://github.com/getsentry/skills",
    },
    installCommand: "npx skills add getsentry/skills --skill security-review",
    vettedAt: "2026-10-11",
    starsOrInstalls: "1.0k stars",
    pairsWithCmk: ["delivery-review", "enclave"],
    featured: true,
  },
  {
    id: "trailofbits-skills",
    name: "trailofbits/skills",
    title: "Trail of Bits Differential & Audit Suite",
    tagline:
      "CodeQL/Semgrep rules, differential security review, and smart-contract / cryptographic audit workflows.",
    collectionId: "security",
    creator: {
      name: "Trail of Bits",
      xHandle: "trailofbits",
      xUrl: "https://x.com/trailofbits",
      githubRepo: "trailofbits/skills",
      githubUrl: "https://github.com/trailofbits/skills",
    },
    installCommand: "npx skills add trailofbits/skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "7.5k stars",
    pairsWithCmk: ["delivery-review", "sui-sdk", "rust"],
  },
  {
    id: "agent-browser",
    name: "agent-browser",
    title: "Vercel Agent Browser QA",
    tagline:
      "Deterministic browser automation skill for capturing live UI verification evidence before opening a pull request.",
    collectionId: "security",
    creator: {
      name: "Vercel Labs",
      xHandle: "vercel",
      xUrl: "https://x.com/vercel",
      githubRepo: "vercel-labs/agent-browser",
      githubUrl: "https://github.com/vercel-labs/agent-browser",
    },
    installCommand: "npx skills add vercel-labs/agent-browser",
    vettedAt: "2026-10-11",
    starsOrInstalls: "1.1M installs",
    pairsWithCmk: ["delivery-ship", "local-stack"],
  },

  // ─── Vendor SDKs Collection ──────────────────────────────────────────
  {
    id: "vercel-agent-skills",
    name: "react-best-practices",
    title: "Vercel React & Next.js Best Practices",
    tagline:
      "First-party guidance on React 19, Server Actions, caching, and bundle optimization straight from the Next.js team.",
    collectionId: "vendors",
    creator: {
      name: "Vercel",
      xHandle: "vercel",
      xUrl: "https://x.com/vercel",
      githubRepo: "vercel-labs/agent-skills",
      githubUrl: "https://github.com/vercel-labs/agent-skills",
    },
    installCommand: "npx skills add vercel-labs/agent-skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "32.2k stars",
    pairsWithCmk: ["toolchain", "codebase-docs"],
  },
  {
    id: "cloudflare-skills",
    name: "cloudflare/skills",
    title: "Cloudflare Workers & Edge Platform",
    tagline:
      "Up-to-date bindings for Workers, Durable Objects, R2, D1, and Wrangler configuration without stale training-data hallucinations.",
    collectionId: "vendors",
    creator: {
      name: "Cloudflare",
      xHandle: "CloudflareDev",
      xUrl: "https://x.com/CloudflareDev",
      githubRepo: "cloudflare/skills",
      githubUrl: "https://github.com/cloudflare/skills",
    },
    installCommand: "npx skills add cloudflare/skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "3.0k stars",
    pairsWithCmk: ["infra", "cicd"],
  },
  {
    id: "supabase-skills",
    name: "postgres-best-practices",
    title: "Supabase & Postgres Best Practices",
    tagline:
      "Row-Level Security policies, indexing strategies, migration hygiene, and edge function patterns from Supabase.",
    collectionId: "vendors",
    creator: {
      name: "Supabase",
      xHandle: "supabase",
      xUrl: "https://x.com/supabase",
      githubRepo: "supabase/agent-skills",
      githubUrl: "https://github.com/supabase/agent-skills",
    },
    installCommand: "npx skills add supabase/agent-skills",
    vettedAt: "2026-10-11",
    starsOrInstalls: "2.7k stars",
    pairsWithCmk: ["local-stack", "testcontainers"],
  },

  // ─── Memory & Voice Collection ───────────────────────────────────────
  {
    id: "humanizer",
    name: "humanizer",
    title: "Humanizer — Strip 26 AI Writing Tropes",
    tagline:
      "Removes puffery, 'delve/testament/tapestry' vocabulary, and robotic transitions from documentation, PR descriptions, and release notes.",
    collectionId: "memory",
    creator: {
      name: "blader",
      xHandle: "blader",
      xUrl: "https://x.com/blader",
      githubRepo: "blader/humanizer",
      githubUrl: "https://github.com/blader/humanizer",
    },
    installCommand: "npx skills add blader/humanizer",
    vettedAt: "2026-10-11",
    starsOrInstalls: "55.5k stars",
    pairsWithCmk: ["docs", "delivery-ship", "requirements"],
    featured: true,
  },
  {
    id: "soul-md",
    name: "soul.md",
    title: "SOUL.md Personal Style Builder",
    tagline:
      "Interviews you and analyzes your real writing samples to synthesize a personal SOUL.md and STYLE.md preference layer.",
    collectionId: "memory",
    creator: {
      name: "Aaron Mars",
      xHandle: "aeonfun",
      xUrl: "https://x.com/aeonfun",
      githubRepo: "aeonfun/soul.md",
      githubUrl: "https://github.com/aeonfun/soul.md",
    },
    installCommand: "npx skills add aeonfun/soul.md",
    vettedAt: "2026-10-11",
    starsOrInstalls: "687 stars",
    pairsWithCmk: ["agent-instructions", "learn"],
    isNew: true,
  },
];

export type StarterCombo = {
  id: string;
  title: string;
  problem: string;
  cmkSkillId: string;
  cmkHandle: string;
  companionRefId: string;
  companionName: string;
  creatorHandle: string;
  outcome: string;
};

export const STARTER_COMBOS: StarterCombo[] = [
  {
    id: "spec-grill",
    title: "Interrogate Before Writing Requirements",
    problem: "Agents jump straight into drafting a PRD while edge cases are still fuzzy.",
    cmkSkillId: "requirements",
    cmkHandle: "cmk:requirements",
    companionRefId: "grill-me",
    companionName: "grill-me",
    creatorHandle: "mattpocockuk",
    outcome:
      "grill-me stress-tests your assumptions first; cmk:requirements then locks the answers into EARS acceptance criteria under docs/requirements/.",
  },
  {
    id: "plan-gate",
    title: "Human-Annotated Spec & Diff Gate",
    problem: "Long implementation plans scroll past in terminal chat without line-by-line human sign-off.",
    cmkSkillId: "delivery-spec-plan",
    cmkHandle: "cmk:delivery-spec-plan",
    companionRefId: "plannotator",
    companionName: "plannotator",
    creatorHandle: "backnotprop",
    outcome:
      "cmk:delivery-spec-plan hands its finished plan to /plannotator-annotate for inline human notes before Phase 3 implementation starts.",
  },
  {
    id: "visual-arch",
    title: "Living System Design + Visual Explainers",
    problem: "Prose design docs are accurate, but reviewers need a mental model they can scan in 15 seconds.",
    cmkSkillId: "design",
    cmkHandle: "cmk:design",
    companionRefId: "anatomy",
    companionName: "anatomy",
    creatorHandle: "wheresryan22",
    outcome:
      "cmk:design records canonical architecture in docs/design/; anatomy or visual-explainer renders an interactive isometric SVG machine from it.",
  },
  {
    id: "ui-taste-rules",
    title: "Codify Designer Taste into Repo Rules",
    problem: "Frontend diffs drift back to generic AI spacing and linear easings across sessions.",
    cmkSkillId: "rule",
    cmkHandle: "cmk:rule",
    companionRefId: "emilkowalski-skills",
    companionName: "emilkowalski/skills",
    creatorHandle: "emilkowalski_",
    outcome:
      "Pair Emil Kowalski's motion grammar or Paul Bakaus's impeccable with cmk:rule so your repo's docs/rules/react/ enforces the exact standard.",
  },
];

export function buildShoutoutTweet(ref: CuratedSkillRef): string {
  const cmkList = ref.pairsWithCmk.slice(0, 2).map((id) => `cmk:${id}`).join(" + ");
  const cmd = ref.installCommand ?? `https://github.com/${ref.creator.githubRepo}`;
  return [
    `Shoutout to @${ref.creator.xHandle} for ${ref.title} (${ref.name}) — curated in the @CommandOSSLabs AI DevKit Collections.`,
    ``,
    `${ref.tagline}`,
    cmkList ? `Pairs great with ${cmkList} in our SDLC workflow.` : ``,
    ``,
    `Try it: ${cmd}`,
  ]
    .filter(Boolean)
    .join("\n");
}
