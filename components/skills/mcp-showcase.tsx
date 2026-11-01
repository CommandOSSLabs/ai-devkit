"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  Copy,
  FolderClosed,
  Globe,
  Layers,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { PromptInputDemo } from "@/components/agents/prompt-input-demo";
import type { SkillExample } from "@/lib/skill-examples";
import {
  CURATED_SKILL_REFS,
  SKILL_COLLECTIONS,
} from "@/lib/skill-collections";
import { McpBentoCard } from "./mcp-bento-card";
import { McpVideoStage } from "./mcp-video-stage";

const AGENT_SLOTS = [
  {
    id: "claude",
    label: "Claude Code",
    bg: "#262626",
    color: "#D97757",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2L14.2 8.8L21 9.5L15.5 14L17.2 21L12 17.2L6.8 21L8.5 14L3 9.5L9.8 8.8L12 2Z" />
      </svg>
    ),
  },
  {
    id: "codex",
    label: "Codex",
    bg: "#262626",
    color: "#FFFFFF",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-none stroke-current"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16M4 12h16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "cursor",
    label: "Cursor",
    bg: "#262626",
    color: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.3l6.8 3.8L12 11.9 5.2 8.1 12 4.3zm-7 5.6l6 3.4v6.8l-6-3.4V9.9zm8 10.2v-6.8l6-3.4v6.8l-6 3.4z" />
      </svg>
    ),
  },
];

const SOURCE_SLOTS = [
  {
    id: "x",
    label: "X Skill Collections",
    bg: "#262626",
    color: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L1.6 2H8l4.5 6.7L18.9 2Zm-1.1 18h1.8L7 4H5.1l12.7 16Z" />
      </svg>
    ),
  },
  {
    id: "cmk",
    label: "CMK Core Skills",
    bg: "#437df5",
    color: "#ffffff",
    icon: <Terminal className="h-4 w-4" />,
  },
  {
    id: "web",
    label: "Collection Folders",
    bg: "#1d9bf0",
    color: "#ffffff",
    icon: <Globe className="h-5 w-5" />,
  },
];

const HERO_STEPS = [
  {
    step: "01",
    title: "Browse 6 Curated Collections",
    detail:
      "18+ maintainer-vetted X companion skills (Design, Explainers, Workflow, Security, Vendors, Memory) paired with 23 core cmk:* skills.",
    badge: "/skills/collections",
  },
  {
    step: "02",
    title: "Agent Queries Skills via MCP",
    detail:
      "Your coding agent calls list_collections, get_collection, or get_skill_ref to fetch SKILL.md rules, X reference media, and cmk:* pairing recipes.",
    badge: "5 MCP Tools",
  },
  {
    step: "03",
    title: "Pull, Install & Execute in Repo",
    detail:
      "The agent runs npx skills add <owner>/<repo> at a pinned commit SHA, wires .agents/skills/, and applies the skill instructions immediately.",
    badge: "npx skills add",
  },
];

const MCP_CAPABILITIES = [
  {
    title: "Pull entire Collection folders",
    description:
      "Fetch every vetted X companion skill inside design, explainers, workflow, security, vendors, or memory with one MCP call.",
    tools: ["list_collections", "get_collection"],
  },
  {
    title: "Read SKILL.md & X context",
    description:
      "Inspect a skill's full SKILL.md rules, creator X thread/video thumbnail, pinned commit SHA, and paired cmk:* workflow before writing code.",
    tools: ["get_skill_ref", "search_collection_skills"],
  },
  {
    title: "Install at pinned commit SHAs",
    description:
      "Execute npx skills add <owner>/<repo> --skill <name> directly from the collection manifest with maintainer-vetted provenance.",
    tools: ["install_collection_skill", "npx skills add"],
  },
  {
    title: "Sync across all agent vendors",
    description:
      "Wire pulled collection skills and core cmk:* skills into .agents/skills/ for Claude Code, Codex, Cursor, and OpenCode.",
    tools: ["cmk:mcp-config", "cmk:agent-vendors"],
  },
];

type McpToolSpec = {
  id: string;
  name: string;
  signature: string;
  badge: string;
  summary: string;
  whenUsed: string;
  triggerPrompt: string;
  requestJson: string;
  responseJson: string;
};

const MCP_TOOL_SPECS: McpToolSpec[] = [
  {
    id: "get_collection",
    name: "get_collection",
    signature: 'get_collection({ collection_id: "design" | "explainers" | "workflow" | "security" | "vendors" | "memory" })',
    badge: "Most Used · Folder Fetch",
    summary:
      "Pulls all vetted X companion skills inside a specific Collection folder, including their install commands, creator X links, thumbnails, and paired cmk:* skills.",
    whenUsed:
      "Called when you ask your agent to use a Collection folder (e.g. 'Use our Design collection to polish this page').",
    triggerPrompt:
      "Pull the Design collection from AI DevKit MCP, load emilkowalski/skills + impeccable alongside cmk:design, and refine our folder cards.",
    requestJson: `{
  "tool": "get_collection",
  "arguments": {
    "collection_id": "design",
    "include_pairing_rules": true
  }
}`,
    responseJson: `{
  "collection": {
    "id": "design",
    "title": "Design",
    "subtitle": "UI craft, motion, taste & frontend polish",
    "count": 7
  },
  "skills": [
    {
      "id": "emilkowalski-skills",
      "title": "Design Engineering & Animations",
      "creator": "@emilkowalski_",
      "xUrl": "https://x.com/emilkowalski_",
      "installCommand": "npx skills add emilkowalski/skills",
      "pairsWithCmk": ["design", "delivery-review"]
    },
    {
      "id": "pbakaus-impeccable",
      "title": "Impeccable — 20 Design Commands & Anti-Slop",
      "creator": "@pbakaus",
      "xPostUrl": "https://x.com/pbakaus/status/2036874272624361858",
      "installCommand": "npx skills add pbakaus/impeccable",
      "pairsWithCmk": ["design", "delivery-review"]
    }
  ]
}`,
  },
  {
    id: "get_skill_ref",
    name: "get_skill_ref",
    signature: "get_skill_ref({ id: string, include_skill_md?: boolean })",
    badge: "Deep Inspect · SKILL.md",
    summary:
      "Fetches a single curated skill reference by ID, returning its full SKILL.md instructions, creator X post URL, resolved X media thumbnail, pinned SHA, and exact npx install command.",
    whenUsed:
      "Called when the agent needs the exact rules or prompt constraints of a specific skill from Collections before executing a task.",
    triggerPrompt:
      "Inspect plannotator and grill-me from the Workflow & Grill collection via MCP and run a pre-spec interrogation on our auth redesign.",
    requestJson: `{
  "tool": "get_skill_ref",
  "arguments": {
    "id": "backnotprop-plannotator",
    "include_skill_md": true
  }
}`,
    responseJson: `{
  "id": "backnotprop-plannotator",
  "name": "plannotator",
  "collectionId": "workflow",
  "creator": {
    "name": "backnotprop",
    "xHandle": "plannotator",
    "xPostUrl": "https://x.com/plannotator/status/2093419561077154287",
    "githubRepo": "backnotprop/plannotator"
  },
  "installCommand": "npx skills add backnotprop/plannotator",
  "pairsWithCmk": ["delivery-spec-plan", "delivery-review", "design"],
  "skillMdExcerpt": "Interactive plan & diff annotation UI for coding agents. Gate implementation behind visual plan sign-off..."
}`,
  },
  {
    id: "search_collection_skills",
    name: "search_collection_skills",
    signature:
      "search_collection_skills({ query: string, collection_id?: string, pairs_with_cmk?: string })",
    badge: "Semantic & Tag Search",
    summary:
      "Searches across all 6 Collections and 23 core cmk:* skills by keyword, workflow stage, creator handle, or paired cmk:* skill.",
    whenUsed:
      "Called when you describe a problem (e.g. 'interactive architecture diagram' or 'diff security audit') and want the agent to pick the best skill from Collections.",
    triggerPrompt:
      "Search AI DevKit Collections for skills that generate interactive architecture explainers and pair with cmk:codebase-docs.",
    requestJson: `{
  "tool": "search_collection_skills",
  "arguments": {
    "query": "architecture diagram interactive html",
    "pairs_with_cmk": "codebase-docs"
  }
}`,
    responseJson: `{
  "matches": [
    {
      "id": "wheresryan-anatomy",
      "title": "Anatomy — Explain by Building",
      "collectionId": "explainers",
      "installCommand": "npx skills add wheresryan22/anatomy",
      "pairsWithCmk": ["codebase-docs", "design", "learn"]
    },
    {
      "id": "nicobailon-visual-explainer",
      "title": "Visual Explainer — Rich HTML Diagrams",
      "collectionId": "explainers",
      "installCommand": "npx skills add nicobailon/visual-explainer",
      "pairsWithCmk": ["codebase-docs", "adr", "design"]
    }
  ]
}`,
  },
  {
    id: "install_collection_skill",
    name: "install_collection_skill",
    signature:
      'install_collection_skill({ id: string, vendor?: "claude" | "codex" | "cursor" | "all" })',
    badge: "One-Step Installer",
    summary:
      "Installs a curated skill from Collections into the current workspace (.agents/skills/) using its vetted GitHub repository and syncs vendor symlinks.",
    whenUsed:
      "Called when you ask your agent to install a skill from a Collection folder into your local project.",
    triggerPrompt:
      "Install trailofbits/skills and anthropics/claude-code-security-review from the Security & QA collection and wire them for Claude Code and Codex.",
    requestJson: `{
  "tool": "install_collection_skill",
  "arguments": {
    "id": "trailofbits-skills",
    "vendor": "all"
  }
}`,
    responseJson: `{
  "installed": true,
  "commandExecuted": "npx skills add trailofbits/skills",
  "installedPath": ".agents/skills/trailofbits-skills/SKILL.md",
  "pairedCmkSkills": ["cmk:delivery-review", "cmk:rule"]
}`,
  },
  {
    id: "list_collections",
    name: "list_collections",
    signature: "list_collections()",
    badge: "Discovery Index",
    summary:
      "Returns the full catalog of all 6 Collection folders, item counts, descriptions, and featured X creators so the agent knows every domain available.",
    whenUsed:
      "Called at the start of a session when the agent inspects what skill collections are available in AI DevKit.",
    triggerPrompt:
      "List all available skill collections in AI DevKit MCP and tell me which skills we should pull for a Next.js + Supabase launch.",
    requestJson: `{
  "tool": "list_collections",
  "arguments": {}
}`,
    responseJson: `{
  "collections": [
    { "id": "design", "title": "Design", "count": 7, "badge": "Hot on X" },
    { "id": "explainers", "title": "Interactive Explainers", "count": 3, "badge": "Visual" },
    { "id": "workflow", "title": "Workflow & Grill", "count": 4, "badge": "SDLC" },
    { "id": "security", "title": "Security & QA", "count": 2, "badge": "Guardrails" },
    { "id": "vendors", "title": "Agent Vendors & Web", "count": 4, "badge": "Official" },
    { "id": "memory", "title": "Identity & Writing", "count": 2, "badge": "Voice" }
  ]
}`,
  },
];

const COPYABLE_PROMPTS = [
  {
    category: "Pull Design Collection",
    collectionId: "design",
    toolsCalled: "get_collection('design') + cmk:design",
    prompt:
      "Pull the Design collection via MCP (emilkowalski/skills + pbakaus/impeccable), pair it with cmk:design, and polish our UI components and spring motion.",
  },
  {
    category: "Pull Explainers Collection",
    collectionId: "explainers",
    toolsCalled: "get_collection('explainers') + cmk:codebase-docs",
    prompt:
      "Fetch anatomy and visual-explainer from the Interactive Explainers collection and generate an interactive HTML architecture walkthrough with cmk:codebase-docs.",
  },
  {
    category: "Pull Workflow & Grill",
    collectionId: "workflow",
    toolsCalled: "get_collection('workflow') + cmk:delivery-spec-plan",
    prompt:
      "Load grill-me and plannotator from the Workflow & Grill collection, stress-test our feature assumptions, and draft a spec with cmk:delivery-spec-plan.",
  },
  {
    category: "Pull Security & QA",
    collectionId: "security",
    toolsCalled: "get_collection('security') + cmk:delivery-review",
    prompt:
      "Pull trailofbits/skills and claude-code-security-review from the Security & QA collection and audit this PR diff alongside cmk:delivery-review.",
  },
  {
    category: "Pull Agent Vendors & Web",
    collectionId: "vendors",
    toolsCalled: "get_collection('vendors') + cmk:local-stack",
    prompt:
      "Install react-best-practices, agent-browser, and supabase postgres-best-practices from the Vendors collection and verify our app in a headless browser.",
  },
  {
    category: "Pull Identity & Writing",
    collectionId: "memory",
    toolsCalled: "get_collection('memory') + cmk:docs",
    prompt:
      "Pull blader/humanizer from the Identity & Writing collection and rewrite our release notes and docs so they read like a sharp human engineer.",
  },
];

const AGENT_CONFIG_SNIPPETS: Record<
  string,
  { label: string; filename: string; command: string; code: string }
> = {
  claude: {
    label: "Claude Code",
    filename: ".mcp.json",
    command: "npx skills add CommandOSSLabs/ai-devkit",
    code: `{
  "mcpServers": {
    "ai-devkit-collections": {
      "command": "npx",
      "args": ["-y", "skills", "mcp", "--repo", "CommandOSSLabs/ai-devkit"]
    },
    "serena": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oraios/serena", "serena-mcp-server"]
    }
  }
}`,
  },
  codex: {
    label: "Codex",
    filename: ".codex/config.toml",
    command: "npx skills add CommandOSSLabs/ai-devkit --agent codex",
    code: `[mcp_servers.ai_devkit_collections]
command = "npx"
args = ["-y", "skills", "mcp", "--repo", "CommandOSSLabs/ai-devkit"]

[skills]
paths = [".agents/skills", "skills"]`,
  },
  cursor: {
    label: "Cursor",
    filename: ".cursor/mcp.json",
    command: "npx skills add CommandOSSLabs/ai-devkit --agent cursor",
    code: `{
  "mcpServers": {
    "ai-devkit-collections": {
      "command": "npx",
      "args": ["-y", "skills", "mcp", "--repo", "CommandOSSLabs/ai-devkit"]
    }
  }
}`,
  },
};

export function McpShowcase({
  skillExamples,
}: {
  skillExamples: SkillExample[];
}) {
  const [slotTick, setSlotTick] = useState(0);
  const [connectOpen, setConnectOpen] = useState(false);
  const [activeAgentTab, setActiveAgentTab] = useState<
    "claude" | "codex" | "cursor"
  >("claude");
  const [activeToolId, setActiveToolId] = useState<string>("get_collection");
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
  const [copiedCollectionId, setCopiedCollectionId] = useState<string | null>(
    null,
  );
  const [copiedToolPrompt, setCopiedToolPrompt] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlotTick((prev) => prev + 1);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const currentAgent = AGENT_SLOTS[slotTick % AGENT_SLOTS.length];
  const currentSource = SOURCE_SLOTS[slotTick % SOURCE_SLOTS.length];
  const activeTool =
    MCP_TOOL_SPECS.find((t) => t.id === activeToolId) ?? MCP_TOOL_SPECS[0];

  function handleCopyPrompt(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 1600);
  }

  function handleCopyCollectionPrompt(collectionId: string, prompt: string) {
    navigator.clipboard.writeText(prompt);
    setCopiedCollectionId(collectionId);
    setTimeout(() => setCopiedCollectionId(null), 1600);
  }

  function handleCopyToolPrompt(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedToolPrompt(true);
    setTimeout(() => setCopiedToolPrompt(false), 1600);
  }

  function handleCopyConfig(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 1600);
  }

  function handleCopyCli(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 1600);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-24">
      <div className="mx-auto w-full max-w-[1160px] px-2 sm:px-6">
        {/* 1. Hero Section — Explicitly explains pulling skills from Collections + CMK */}
        <section
          aria-labelledby="mcp-title"
          className="flex flex-col items-center pb-14 pt-10 text-center sm:pb-16 sm:pt-14"
        >
          <div className="mb-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11.5px] text-[var(--md-text-secondary)]">
            <Sparkles size={12} className="text-[#c3e88d]" />
            <span>AI DevKit Collections MCP</span>
            <span className="text-white/25">·</span>
            <span>6 Collection Folders</span>
            <span className="text-white/25">·</span>
            <span>{CURATED_SKILL_REFS.length} Vetted X Skills + 23 Core CMK Skills</span>
          </div>

          <h1
            id="mcp-title"
            className="max-w-[780px] text-[34px] font-medium leading-[1.08] tracking-[-0.024em] text-[var(--md-fg)] sm:text-[46px]"
          >
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
              <span>The MCP server</span>
              <span
                title={currentAgent.label}
                style={{ background: currentAgent.bg, color: currentAgent.color }}
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[11px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                {currentAgent.icon}
              </span>
            </span>
            <br />
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
              <span>to pull skills from</span>
              <span
                title={currentSource.label}
                style={{ background: currentSource.bg, color: currentSource.color }}
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[11px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                {currentSource.icon}
              </span>
              <span>Collections.</span>
            </span>
          </h1>

          <p className="mt-5 max-w-[650px] text-[15.5px] leading-[24px] text-[var(--md-text-tertiary)]">
            Instead of hunting through X bookmarks or manually copying{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-[var(--md-fg)]">
              npx skills add
            </code>{" "}
            commands, connect{" "}
            <strong className="font-medium text-[var(--md-fg)]">
              Claude Code, Codex, or Cursor
            </strong>{" "}
            to the AI DevKit MCP. Your agent can query any{" "}
            <Link
              href="/skills/collections"
              className="text-[var(--md-fg)] underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              Collection folder
            </Link>{" "}
            (<code className="font-mono text-[13px] text-white/85">design</code>,{" "}
            <code className="font-mono text-[13px] text-white/85">explainers</code>,{" "}
            <code className="font-mono text-[13px] text-white/85">workflow</code>,{" "}
            <code className="font-mono text-[13px] text-white/85">security</code>,{" "}
            <code className="font-mono text-[13px] text-white/85">vendors</code>,{" "}
            <code className="font-mono text-[13px] text-white/85">memory</code>),
            read each skill&apos;s <code className="font-mono text-[13px] text-white/85">SKILL.md</code> rules &amp; X demo, and pair them with{" "}
            <code className="font-mono text-[13px] text-[#c3e88d]">cmk:*</code>{" "}
            workflows automatically.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setConnectOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13.5px] font-medium text-[#141413] transition-transform hover:bg-[#e5e5e3] active:scale-95"
            >
              Connect your agent
            </button>
            <a
              href="#mcp-tools-spec"
              className="inline-flex h-10 items-center justify-center rounded-full bg-white/[0.1] px-5 text-[13.5px] font-medium text-[var(--md-fg)] transition-colors hover:bg-white/[0.15]"
            >
              Inspect 5 MCP tools
            </a>
            <Link
              href="/skills/collections"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/[0.12] bg-transparent px-4 text-[13px] font-medium text-[var(--md-text-secondary)] transition-colors hover:border-white/[0.24] hover:text-white"
            >
              <FolderClosed size={14} />
              <span>Browse Collections</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* 3-Step Visual Pipeline Strip right under Hero */}
          <div className="mt-12 grid w-full grid-cols-1 gap-3.5 text-left md:grid-cols-3">
            {HERO_STEPS.map((item) => (
              <div
                key={item.step}
                className="flex flex-col justify-between rounded-[20px] bg-[var(--md-bento-surface)] p-5 shadow-[inset_0_0_0_1px_var(--md-ring-menu)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex h-6 items-center rounded-full bg-white/[0.08] px-2.5 font-mono text-[11px] font-semibold text-white">
                      STEP {item.step}
                    </span>
                    <span className="font-mono text-[11px] text-[#c3e88d]">
                      {item.badge}
                    </span>
                  </div>
                  <h2 className="mt-3 text-[15.5px] font-medium text-[var(--md-fg)]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-[19.5px] text-[var(--md-text-tertiary)]">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Sky-Framed Desktop Agent Video Showcase (#how) */}
        <McpVideoStage />

        {/* 3. Interactive Bento Dashboard + MCP Capabilities Section */}
        <section aria-labelledby="mcp-tools-title" className="mb-16">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2
                id="mcp-tools-title"
                className="text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--md-fg)] sm:text-[28px]"
              >
                <span>What your agent pulls from Collections</span>{" "}
                <span className="text-[var(--md-text-tertiary)]">
                  before it writes code.
                </span>
              </h2>
              <p className="mt-1.5 text-[13.5px] text-[var(--md-text-tertiary)]">
                Switch tabs on the left to see how MCP Config, Search &amp; Pull, Agent Vendors, and Pinned Install work together.
              </p>
            </div>
            <span className="font-mono text-[11.5px] text-[var(--md-text-tertiary)]">
              Interactive Bento Preview · 4 Workflows
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12">
            {/* Left 7 columns: Interactive Tabbed Glass Bento Card */}
            <div className="lg:col-span-7">
              <McpBentoCard />
            </div>

            {/* Right 5 columns: 2x2 MCP Tool Capability Tiles */}
            <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-5">
              {MCP_CAPABILITIES.map((cap) => (
                <li
                  key={cap.title}
                  className="flex min-h-[184px] flex-col justify-between rounded-[24px] bg-[var(--md-bento-surface)] p-5 shadow-[inset_0_0_0_1px_var(--md-ring-menu)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--md-ring-tile)]"
                >
                  <div>
                    <h3 className="text-[15px] font-medium text-[var(--md-fg)]">
                      {cap.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-[19.5px] text-[var(--md-text-tertiary)]">
                      {cap.description}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {cap.tools.map((tool) => (
                      <code
                        key={tool}
                        className="rounded-lg bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-[var(--md-text-secondary)]"
                      >
                        {tool}
                      </code>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Detailed 5 MCP Tools Specification & Live JSON Payload Inspector */}
        <section
          id="mcp-tools-spec"
          aria-labelledby="mcp-spec-heading"
          className="mb-16 scroll-mt-24"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] uppercase tracking-wider text-[#c3e88d]">
                <Code2 size={13} />
                <span>MCP Tool Protocol Specification</span>
              </div>
              <h2
                id="mcp-spec-heading"
                className="text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--md-fg)] sm:text-[28px]"
              >
                <span>5 MCP tools to query &amp; install</span>{" "}
                <span className="text-[var(--md-text-tertiary)]">
                  skills from Collections.
                </span>
              </h2>
              <p className="mt-1.5 max-w-[680px] text-[13.5px] leading-[20px] text-[var(--md-text-tertiary)]">
                Every tool reads directly from the git-curated{" "}
                <code className="font-mono text-white/85">lib/skill-collections.ts</code>{" "}
                and <code className="font-mono text-white/85">skills/*/SKILL.md</code>{" "}
                manifests. Select any tool below to inspect its parameters, trigger prompt, and JSON response.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Tool Selector List (4 cols) */}
            <div className="flex flex-col gap-2 lg:col-span-4">
              {MCP_TOOL_SPECS.map((tool) => {
                const active = tool.id === activeTool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setActiveToolId(tool.id)}
                    className={`flex flex-col items-start rounded-[18px] p-4 text-left transition-all ${
                      active
                        ? "bg-white/[0.09] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]"
                        : "bg-[var(--md-bento-surface)] shadow-[inset_0_0_0_1px_var(--md-ring-menu)] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <code className="font-mono text-[13px] font-semibold text-white">
                        {tool.name}()
                      </code>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                          active
                            ? "bg-[#c3e88d]/20 text-[#c3e88d]"
                            : "bg-white/[0.06] text-[var(--md-text-tertiary)]"
                        }`}
                      >
                        {tool.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-[18px] text-[var(--md-text-tertiary)]">
                      {tool.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Tool Inspector Panel (8 cols) */}
            <div className="flex flex-col justify-between rounded-[24px] bg-[var(--md-bento-surface)] p-5 shadow-[inset_0_0_0_1px_var(--md-ring-menu)] sm:p-6 lg:col-span-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                  <code className="font-mono text-[13px] text-[#c3e88d]">
                    {activeTool.signature}
                  </code>
                  <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-white/80">
                    Read-only / Pinned Git Manifest
                  </span>
                </div>

                <p className="mt-4 text-[14px] leading-[21px] text-[var(--md-fg)]">
                  {activeTool.summary}
                </p>
                <p className="mt-1.5 text-[12.5px] text-[var(--md-text-tertiary)]">
                  <strong className="font-medium text-white/80">When agent calls it:</strong>{" "}
                  {activeTool.whenUsed}
                </p>

                {/* Example Prompt Box */}
                <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/40 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--md-text-tertiary)]">
                      Example Prompt That Triggers {activeTool.name}()
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyToolPrompt(activeTool.triggerPrompt)}
                      className="inline-flex items-center gap-1 rounded-md bg-white/[0.08] px-2 py-1 font-mono text-[11px] text-white hover:bg-white/[0.14]"
                    >
                      {copiedToolPrompt ? (
                        <>
                          <Check size={11} className="text-[#c3e88d]" />
                          <span className="text-[#c3e88d]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 font-mono text-[12.5px] leading-[19px] text-white">
                    &ldquo;{activeTool.triggerPrompt}&rdquo;
                  </p>
                </div>

                {/* Request & Response JSON Grid */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="mb-1.5 font-mono text-[11px] text-[var(--md-text-tertiary)]">
                      MCP Tool Call Input
                    </div>
                    <pre className="max-h-[230px] overflow-auto rounded-xl border border-white/[0.07] bg-[#0b0b0e] p-3 font-mono text-[11px] leading-[1.55] text-[#d4d4d8]">
                      <code>{activeTool.requestJson}</code>
                    </pre>
                  </div>
                  <div>
                    <div className="mb-1.5 font-mono text-[11px] text-[var(--md-text-tertiary)]">
                      Collection Manifest Response
                    </div>
                    <pre className="max-h-[230px] overflow-auto rounded-xl border border-white/[0.07] bg-[#0b0b0e] p-3 font-mono text-[11px] leading-[1.55] text-[#c3e88d]/90">
                      <code>{activeTool.responseJson}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Collection-by-Collection Breakdown: What Skills Each Folder Provides via MCP */}
        <section aria-labelledby="mcp-collections-map-title" className="mb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] uppercase tracking-wider text-[var(--md-text-secondary)]">
                <Layers size={13} className="text-[#82AAFF]" />
                <span>Collection Folder → MCP Skill Map</span>
              </div>
              <h2
                id="mcp-collections-map-title"
                className="text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--md-fg)] sm:text-[28px]"
              >
                <span>What skills reside in each Collection</span>{" "}
                <span className="text-[var(--md-text-tertiary)]">
                  &amp; how they pair with <code className="font-mono text-[22px]">cmk:*</code>.
                </span>
              </h2>
            </div>

            <Link
              href="/skills/collections"
              className="inline-flex items-center gap-1.5 font-mono text-[12px] text-white/80 hover:text-white"
            >
              <span>Open /skills/collections</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {SKILL_COLLECTIONS.map((col) => {
              const items = CURATED_SKILL_REFS.filter(
                (r) => r.collectionId === col.id,
              );
              const cmkPairs = Array.from(
                new Set(items.flatMap((i) => i.pairsWithCmk)),
              ).slice(0, 4);
              const folderPrompt = `Use AI DevKit MCP get_collection("${col.id}") to pull ${items
                .slice(0, 2)
                .map((i) => i.name)
                .join(" and ")}, pair with ${cmkPairs
                .slice(0, 2)
                .map((c) => `cmk:${c}`)
                .join(" + ")}, and apply their rules to this repo.`;
              const isCopied = copiedCollectionId === col.id;

              return (
                <div
                  key={col.id}
                  className="flex flex-col justify-between rounded-[22px] bg-[var(--md-bento-surface)] p-5 shadow-[inset_0_0_0_1px_var(--md-ring-menu)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FolderClosed size={15} className="text-white/80" />
                        <h3 className="text-[16px] font-medium text-white">
                          {col.title}
                        </h3>
                      </div>
                      <code className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-[#c3e88d]">
                        id: &quot;{col.id}&quot;
                      </code>
                    </div>

                    <p className="mt-1.5 text-[12.5px] leading-[18.5px] text-[var(--md-text-tertiary)]">
                      {col.description}
                    </p>

                    {/* Vetted X Skills inside this folder */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--md-text-tertiary)]">
                        Pulled X Companion Skills ({items.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <span
                            key={item.id}
                            title={`${item.title} (@${item.creator.xHandle})`}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-white/90"
                          >
                            <span>{item.name}</span>
                            <span className="text-[10px] text-white/45">
                              @{item.creator.xHandle}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Paired CMK Skills */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--md-text-tertiary)]">
                        Pairs with Core CMK Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cmkPairs.map((cmk) => (
                          <Link
                            key={cmk}
                            href={`/skills/${cmk}`}
                            className="rounded-full bg-[#82AAFF]/10 px-2.5 py-0.5 font-mono text-[11px] text-[#82AAFF] hover:bg-[#82AAFF]/20"
                          >
                            cmk:{cmk}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-white/[0.07] pt-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyCollectionPrompt(col.id, folderPrompt)
                      }
                      className="inline-flex w-full items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2 font-mono text-[11.5px] text-white transition-colors hover:bg-white/[0.11]"
                    >
                      <span className="truncate">
                        {isCopied
                          ? "Copied collection prompt!"
                          : `Copy "${col.title}" MCP prompt`}
                      </span>
                      {isCopied ? (
                        <Check size={13} className="shrink-0 text-[#c3e88d]" />
                      ) : (
                        <Copy size={13} className="shrink-0 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Copyable Prompts Section: "Ask before it builds. Copy a prompt to try it." */}
        <section aria-labelledby="mcp-prompts-title" className="mb-16">
          <h2
            id="mcp-prompts-title"
            className="mb-6 text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--md-fg)] sm:text-[28px]"
          >
            <span>Ready-to-paste Collection prompts.</span>{" "}
            <span className="text-[var(--md-text-tertiary)]">
              Click any card to copy.
            </span>
          </h2>

          <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {COPYABLE_PROMPTS.map((item, idx) => {
              const copied = copiedPromptIdx === idx;
              return (
                <li key={item.prompt}>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(item.prompt, idx)}
                    className="group flex min-h-[164px] w-full flex-col justify-between rounded-[20px] bg-[var(--md-bento-surface)] p-5 text-left shadow-[inset_0_0_0_1px_var(--md-ring-menu)] transition-all hover:shadow-[inset_0_0_0_1px_var(--md-ring-tile)] active:scale-[0.985]"
                  >
                    <div className="flex w-full items-center justify-between gap-2 text-[12px] text-[var(--md-text-tertiary)]">
                      <span className="font-medium text-white/85">
                        {item.category}
                      </span>
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[var(--md-text-tertiary)] group-hover:text-[var(--md-fg)]">
                        {copied ? (
                          <Check size={13} className="text-[#c3e88d]" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </span>
                    </div>

                    <p className="mt-3 text-[14.5px] font-medium leading-[20.5px] tracking-[-0.01em] text-[var(--md-fg)]">
                      {item.prompt}
                    </p>

                    <div className="mt-3 border-t border-white/[0.06] pt-2.5 font-mono text-[11px] text-[#c3e88d]">
                      MCP: {item.toolsCalled}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 7. Interactive Prompt & Skill Composer Sandbox */}
        <section aria-labelledby="mcp-composer-title" className="mb-10">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="mcp-composer-title"
              className="text-[22px] font-medium tracking-[-0.02em] text-[var(--md-fg)]"
            >
              <span>Try it live</span>{" "}
              <span className="text-[var(--md-text-tertiary)]">
                in the agent composer.
              </span>
            </h2>
            <span className="font-mono text-[12px] text-[var(--md-text-tertiary)]">
              Interactive prompt &amp; skill runner
            </span>
          </div>

          <div className="rounded-[24px] bg-[var(--md-bento-surface)] p-5 shadow-[inset_0_0_0_1px_var(--md-ring-menu)] sm:p-8">
            <PromptInputDemo skillExamples={skillExamples} />
          </div>
        </section>
      </div>

      {/* Connect Your Agent Modal */}
      {connectOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Connect your agent to AI DevKit MCP & Skills"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setConnectOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] rounded-[24px] bg-[#141416] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.8)] outline outline-1 outline-white/[0.1]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-medium tracking-[-0.015em]">
                  Connect your coding agent to Collections MCP
                </h3>
                <p className="mt-0.5 text-[13px] text-[#9a9a9a]">
                  Pull curated X companion skills &amp; core CMK skills in Claude Code, Codex, or Cursor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConnectOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-[#9a9a9a] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 flex gap-1.5 rounded-full bg-white/[0.06] p-1">
              {(["claude", "codex", "cursor"] as const).map((key) => {
                const active = activeAgentTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveAgentTab(key)}
                    className={`flex-1 rounded-full py-1.5 text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-white text-[#141413]"
                        : "text-[#9a9a9a] hover:text-white"
                    }`}
                  >
                    {AGENT_CONFIG_SNIPPETS[key].label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-1.5">
              <div className="text-[12px] font-medium text-[#9a9a9a]">
                1. Install AI DevKit skills &amp; CLI
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl bg-black/60 px-3.5 py-2.5 font-mono text-[12px] text-[#c3e88d] outline outline-1 outline-white/[0.08]">
                <code className="truncate">
                  $ {AGENT_CONFIG_SNIPPETS[activeAgentTab].command}
                </code>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyCli(AGENT_CONFIG_SNIPPETS[activeAgentTab].command)
                  }
                  className="inline-flex items-center gap-1 rounded-md bg-white/[0.08] px-2 py-1 text-[11px] text-white hover:bg-white/[0.14]"
                >
                  {copiedCli ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedCli ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[12px] font-medium text-[#9a9a9a]">
                <span>
                  2. Add Collections MCP to{" "}
                  <code className="font-mono text-white">
                    {AGENT_CONFIG_SNIPPETS[activeAgentTab].filename}
                  </code>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyConfig(AGENT_CONFIG_SNIPPETS[activeAgentTab].code)
                  }
                  className="inline-flex items-center gap-1 font-mono text-[11.5px] text-white hover:underline"
                >
                  {copiedConfig ? (
                    <>
                      <Check size={12} className="text-[#c3e88d]" />
                      <span className="text-[#c3e88d]">Copied snippet</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy config</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-black/60 p-3.5 font-mono text-[12px] leading-[1.55] text-[#d4d4d8] outline outline-1 outline-white/[0.08]">
                <code>{AGENT_CONFIG_SNIPPETS[activeAgentTab].code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
