"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Folder,
  Globe,
  Laptop,
  Pause,
  Play,
  Radio,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { PromptInputDemo } from "@/components/agents/prompt-input-demo";
import type { SkillExample } from "@/lib/skill-examples";

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
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
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
    id: "web",
    label: "Web & Docs",
    bg: "#1d9bf0",
    color: "#ffffff",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "x",
    label: "X Refs",
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
    label: "CMK Skills",
    bg: "#437df5",
    color: "#ffffff",
    icon: <Terminal className="h-4 w-4" />,
  },
];

const DEMO_SCENES = [
  {
    id: "search",
    tab: "1. Search & Recall Refs",
    windowTitle: "Refs from AI DevKit",
    userPrompt: "Can you find my UI & MCP refs from AI DevKit?",
    agentStatus: "Using ai-devkit: search_refs & cmk:mcp-config",
    duration: "2.4s",
    thumbs: [
      { title: "Taste Skill", bg: "linear-gradient(135deg,#18181b,#27272a)", accent: "#fab12f" },
      { title: "Emil Kowalski", bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)", accent: "#0284c7" },
      { title: "cmk:mcp-config", bg: "linear-gradient(135deg,#1e1b4b,#312e81)", accent: "#82aaff" },
    ],
    extraCount: "+5",
    agentReply:
      "Found 8 vetted references in your Design & Workflow collections. Ready to wire .mcp.json and apply their motion & layout tokens.",
  },
  {
    id: "configure",
    tab: "2. Wire .mcp.json Across Vendors",
    windowTitle: "cmk:mcp-config · Multi-Vendor Setup",
    userPrompt: "Configure MCP servers for Claude Code, Codex, and Cursor in this repo",
    agentStatus: "Running cmk:mcp-config · writing .mcp.json & .codex/config.toml",
    duration: "1.9s",
    thumbs: [
      { title: ".mcp.json", bg: "linear-gradient(135deg,#0f172a,#1e293b)", accent: "#c3e88d" },
      { title: ".codex/config", bg: "linear-gradient(135deg,#18181b,#27272a)", accent: "#82aaff" },
      { title: ".cursor/mcp", bg: "linear-gradient(135deg,#1e1b4b,#312e81)", accent: "#f79ad0" },
    ],
    extraCount: "+3",
    agentReply:
      "Generated checked-in .mcp.json, .cursor/mcp.json, and .codex/config.toml with zero hardcoded secrets.",
  },
  {
    id: "build",
    tab: "3. Build with CMK + X Companions",
    windowTitle: "cmk:design + X Companion Skills",
    userPrompt: "Build our dark gallery UI following our saved Design collection refs",
    agentStatus: "Applying cmk:design + taste-skill (SHA: 7c9a3d1)",
    duration: "3.1s",
    thumbs: [
      { title: "Explore Grid", bg: "linear-gradient(135deg,#09090b,#18181b)", accent: "#fab12f" },
      { title: "RefPile Stack", bg: "linear-gradient(135deg,#1e293b,#334155)", accent: "#38bdf8" },
      { title: "MCP Demo", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", accent: "#2563eb" },
    ],
    extraCount: "+6",
    agentReply:
      "Built the pitch-black gallery, 3-card spring RefPile folders, and interactive MCP showcase verified against type-check & lint.",
  },
];

const MCP_CAPABILITIES = [
  {
    title: "Configure MCP servers",
    description: "Checked-in, per-vendor MCP configuration for Claude Code, Codex, and Cursor.",
    tools: ["cmk:mcp-config", ".mcp.json"],
  },
  {
    title: "Search curated refs",
    description: "Your saved X companion skills or canonical CMK skills on request.",
    tools: ["search_refs", "search_explore"],
  },
  {
    title: "Vendor & sync skills",
    description: "Wire one canonical skills/ set across every coding agent and lockfile.",
    tools: ["cmk:agent-vendors", "cmk:sync"],
  },
  {
    title: "Install vetted companions",
    description: "Install community skills with pinned commit SHAs and creator attribution.",
    tools: ["npx skills add", "save_ref"],
  },
];

const COPYABLE_PROMPTS = [
  {
    category: "Setup MCP",
    prompt: "Use cmk:mcp-config to set up checked-in MCP servers for Claude Code, Codex, and Cursor",
  },
  {
    category: "Build UI",
    prompt: "Build our skills gallery like the refs in my Design collection using cmk:design",
  },
  {
    category: "Brief",
    prompt: "Read my Workflow & Grill collection, then sum up its architecture rules before we start",
  },
  {
    category: "Decide",
    prompt: "Find UI & motion refs in Explore and pair them with cmk:requirements and cmk:design",
  },
  {
    category: "Vendor",
    prompt: "Run cmk:agent-vendors and cmk:sync so Claude Code, Codex, and Cursor share our skills/",
  },
  {
    category: "Review",
    prompt: "Compare this diff against cmk:delivery-review and our Security & QA collection refs",
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
    "ai-devkit": {
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
    code: `[mcp_servers.ai_devkit]
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
    "ai-devkit": {
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
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [connectOpen, setConnectOpen] = useState(false);
  const [activeAgentTab, setActiveAgentTab] = useState<"claude" | "codex" | "cursor">("claude");
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  // Rotate inline hero badges every 2.6s (just like marked.dev/mcp)
  useEffect(() => {
    const timer = setInterval(() => {
      setSlotTick((prev) => prev + 1);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance the animated GIF-like demo window every 4.2s when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentAgent = AGENT_SLOTS[slotTick % AGENT_SLOTS.length];
  const currentSource = SOURCE_SLOTS[slotTick % SOURCE_SLOTS.length];
  const currentScene = DEMO_SCENES[sceneIndex];

  function handleCopyPrompt(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 1600);
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
        {/* 1. Hero Section (Exact marked.dev/mcp layout & typography) */}
        <section
          aria-labelledby="mcp-title"
          className="flex flex-col items-center pb-14 pt-12 text-center sm:pb-16 sm:pt-16"
        >
          <h1
            id="mcp-title"
            className="max-w-[680px] text-[34px] font-medium leading-[1.08] tracking-[-0.024em] text-[var(--md-fg)] sm:text-[42px]"
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
              <span>for the refs</span>
              <span
                title={currentSource.label}
                style={{ background: currentSource.bg, color: currentSource.color }}
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[11px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                {currentSource.icon}
              </span>
              <span>you saved.</span>
            </span>
          </h1>

          <p className="mt-5 max-w-[460px] text-[15px] leading-[22.5px] text-[var(--md-text-tertiary)]">
            The MCP server &amp; skill kit that lets Claude Code, Codex and Cursor read the{" "}
            <code className="font-mono text-[13.5px] text-[var(--md-fg)]">cmk:*</code> skills,
            interfaces and motion you saved, so they build the way you would.
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
              href="#how"
              className="inline-flex h-10 items-center justify-center rounded-full bg-white/[0.1] px-5 text-[13.5px] font-medium text-[var(--md-fg)] transition-colors hover:bg-white/[0.15]"
            >
              See how it works
            </a>
          </div>
        </section>

        {/* 2. Animated Live GIF-Style Demo Frame (#how) — matches the sky-framed desktop showcase in the screenshot */}
        <section id="how" aria-label="Interactive MCP Demo" className="mb-20">
          {/* Scene selector + play/pause bar */}
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {DEMO_SCENES.map((scene, idx) => {
                const active = idx === sceneIndex;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setSceneIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-white text-[#141413]"
                        : "bg-white/[0.07] text-[var(--md-text-tertiary)] hover:bg-white/[0.12] hover:text-[var(--md-fg)]"
                    }`}
                  >
                    {scene.tab}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 font-mono text-[11.5px] text-[var(--md-text-tertiary)] transition-colors hover:bg-white/[0.12] hover:text-[var(--md-fg)]"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? "Auto-playing demo" : "Paused"}</span>
            </button>
          </div>

          {/* Sky-blue atmospheric wallpaper stage (.mcp-video-frame) */}
          <div
            className="relative overflow-hidden rounded-[28px] px-4 pt-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)] outline outline-1 -outline-offset-1 outline-white/[0.12] sm:px-10 sm:pt-10"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.35) 0%, transparent 55%), linear-gradient(180deg, #5da9e9 0%, #8ec5fc 48%, #d9edff 100%)",
            }}
          >
            {/* Subtle soft cloud highlights */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-50 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.85), transparent 45%), radial-gradient(circle at 78% 25%, rgba(255,255,255,0.8), transparent 50%)",
              }}
            />

            {/* Floating Desktop Agent Window (matches screenshot 1:1) */}
            <div className="relative mx-auto w-full max-w-[980px] overflow-hidden rounded-t-[20px] border border-black/[0.08] bg-[#fcfcfb] text-[#18181b] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              {/* Window Top Bar */}
              <div className="flex h-12 items-center justify-between border-b border-black/[0.06] px-4 sm:px-6">
                <div className="flex items-center gap-3 text-[13px] text-[#71717a]">
                  <span className="select-none">←</span>
                  <span className="select-none">→</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#18181b]">
                    {currentScene.windowTitle}
                    <ChevronDown size={14} className="text-[#71717a]" />
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-[#71717a]">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/[0.05] text-[#18181b]">
                    <Laptop size={14} />
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04]">
                    <Terminal size={14} />
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04]">
                    <Globe size={14} />
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04]">
                    <Folder size={14} />
                  </span>
                </div>
              </div>

              {/* Window Body: Left Conversation Stage + Right Environment Inspector */}
              <div className="grid min-h-[370px] grid-cols-1 gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_250px]">
                {/* Left Agent Session Area */}
                <div className="flex flex-col justify-between">
                  <div>
                    {/* Top environment hint banner */}
                    <p className="text-center text-[11.5px] text-[#a1a1aa]">
                      You often start on This computer · ai-devkit; save it as an environment to start here in one click ·{" "}
                      <span className="underline">Save as environment</span> ·{" "}
                      <span className="underline">Not now</span>
                    </p>

                    {/* User Prompt Bubble (Right-aligned) */}
                    <div className="mt-7 flex justify-end">
                      <div className="rounded-[18px] bg-[#f1f0ee] px-4 py-2.5 text-[13.5px] font-medium text-[#18181b] shadow-sm">
                        {currentScene.userPrompt}
                      </div>
                    </div>

                    {/* Agent MCP Tool Call Row + Fanned Thumbnail Cards + Animated Cursor */}
                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 text-[13px] text-[#71717a]">
                        <span className="inline-flex h-4 w-4 items-center justify-center">
                          <span className="h-2 w-2 animate-ping rounded-full bg-[#ea580c]" />
                        </span>
                        <span className="font-medium text-[#52525b]">
                          {currentScene.agentStatus}
                        </span>
                        <span className="text-[#a1a1aa]">{currentScene.duration} ›</span>
                      </div>

                      {/* Miniature ref cards stack + animated cursor */}
                      <div className="relative flex items-center gap-1.5 pr-4">
                        <span className="mr-1 font-mono text-[11.5px] font-medium text-[#a1a1aa]">
                          {currentScene.extraCount}
                        </span>
                        {currentScene.thumbs.map((thumb, idx) => (
                          <div
                            key={thumb.title}
                            style={{ background: thumb.bg }}
                            className={`relative flex h-[32px] w-[46px] flex-col justify-between overflow-hidden rounded-[6px] p-1.5 shadow-sm transition-transform duration-500 ${
                              idx === 1
                                ? "scale-105 ring-2 ring-[#3b82f6]"
                                : "opacity-90 ring-1 ring-black/10"
                            }`}
                          >
                            <span
                              className="h-1.5 w-4 rounded-full"
                              style={{ background: thumb.accent }}
                            />
                            <span className="truncate font-mono text-[7px] text-white/90 mix-blend-difference">
                              {thumb.title}
                            </span>
                          </div>
                        ))}

                        {/* Animated Pointer Cursor */}
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-3 right-6 h-6 w-6 animate-bounce drop-shadow-md"
                        >
                          <path
                            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                            fill="#111111"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Agent synthesized reply */}
                    <div className="mt-6 rounded-2xl border border-black/[0.06] bg-[#f8f8f7] p-4 text-[13px] leading-[1.6] text-[#3f3f46]">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#2563eb]">
                        <Sparkles size={12} />
                        <span>MCP Context Loaded</span>
                      </div>
                      {currentScene.agentReply}
                    </div>
                  </div>

                  {/* Progress dots */}
                  <div className="mt-6 flex items-center gap-1.5">
                    {DEMO_SCENES.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        aria-label={`Go to demo step ${idx + 1}`}
                        onClick={() => setSceneIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === sceneIndex ? "w-6 bg-[#18181b]" : "w-1.5 bg-black/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Environment / Connectors Sidebar (matches screenshot 1:1) */}
                <div className="flex flex-col gap-2.5 text-[12px]">
                  <div className="rounded-2xl border border-black/[0.07] bg-white p-3.5 shadow-sm">
                    <div className="mb-2.5 flex items-center justify-between font-medium text-[#18181b]">
                      <span>Environment ⌄</span>
                    </div>
                    <div className="space-y-2 text-[#52525b]">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2">
                          <Laptop size={13} className="text-[#71717a]" />
                          This computer
                        </span>
                        <span className="text-[11px] text-[#a1a1aa] underline">Save</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Folder size={13} className="text-[#71717a]" />
                        <span className="truncate font-mono text-[11.5px]">ai-devkit · ~</span>
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="inline-flex items-center gap-2">
                          <Radio size={13} className="text-[#71717a]" />
                          Remote Control
                        </span>
                        <span className="inline-flex h-4 w-7 items-center rounded-full bg-[#2563eb] p-0.5">
                          <span className="ml-auto h-3 w-3 rounded-full bg-white" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-black/[0.07] bg-white px-3.5 py-3 shadow-sm">
                    <span className="font-medium text-[#18181b]">Connectors ›</span>
                    <span className="text-[11.5px] text-[#71717a]">4 active</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-black/[0.07] bg-white px-3.5 py-3 shadow-sm">
                    <span className="font-medium text-[#18181b]">Context ›</span>
                    <span className="inline-flex items-center gap-2 text-[11.5px] text-[#71717a]">
                      24%
                      <span className="inline-flex h-1.5 w-7 overflow-hidden rounded-full bg-black/10">
                        <span className="w-1/3 bg-[#2563eb]" />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Bento Section: "What your agent reads before it builds." */}
        <section aria-labelledby="mcp-tools-title" className="mb-16">
          <h2
            id="mcp-tools-title"
            className="mb-6 text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--md-fg)] sm:text-[28px]"
          >
            <span>What your agent reads</span>{" "}
            <span className="text-[var(--md-text-tertiary)]">before it builds.</span>
          </h2>

          <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {MCP_CAPABILITIES.map((cap) => (
              <li
                key={cap.title}
                className="flex min-h-[190px] flex-col justify-between rounded-[20px] bg-[var(--md-bento-surface)] p-5 shadow-[inset_0_0_0_1px_var(--md-ring-menu)]"
              >
                <div>
                  <h3 className="text-[15px] font-medium text-[var(--md-fg)]">
                    {cap.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[19.5px] text-[var(--md-text-tertiary)]">
                    {cap.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {cap.tools.map((tool) => (
                    <code
                      key={tool}
                      className="rounded-lg bg-white/[0.06] px-2.5 py-1 font-mono text-[11.5px] text-[var(--md-text-secondary)]"
                    >
                      {tool}
                    </code>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Copyable Prompts Section: "Ask before it builds. Copy a prompt to try it." */}
        <section aria-labelledby="mcp-prompts-title" className="mb-16">
          <h2
            id="mcp-prompts-title"
            className="mb-6 text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--md-fg)] sm:text-[28px]"
          >
            <span>Ask before it builds.</span>{" "}
            <span className="text-[var(--md-text-tertiary)]">Copy a prompt to try it.</span>
          </h2>

          <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {COPYABLE_PROMPTS.map((item, idx) => {
              const copied = copiedPromptIdx === idx;
              return (
                <li key={item.prompt}>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(item.prompt, idx)}
                    className="group flex min-h-[148px] w-full flex-col justify-between rounded-[20px] bg-[var(--md-bento-surface)] p-5 text-left shadow-[inset_0_0_0_1px_var(--md-ring-menu)] transition-all hover:shadow-[inset_0_0_0_1px_var(--md-ring-tile)] active:scale-[0.985]"
                  >
                    <div className="flex w-full items-center justify-between text-[12.5px] text-[var(--md-text-tertiary)]">
                      <span>{item.category}</span>
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-[var(--md-text-tertiary)] group-hover:text-[var(--md-fg)]">
                        {copied ? (
                          <Check size={13} className="text-[#c3e88d]" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </span>
                    </div>

                    <p className="mt-4 text-[15px] font-medium leading-[21px] tracking-[-0.01em] text-[var(--md-fg)]">
                      {item.prompt}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 5. Interactive Prompt & Skill Composer Sandbox */}
        <section aria-labelledby="mcp-composer-title" className="mb-10">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="mcp-composer-title"
              className="text-[22px] font-medium tracking-[-0.02em] text-[var(--md-fg)]"
            >
              <span>Try it live</span>{" "}
              <span className="text-[var(--md-text-tertiary)]">in the agent composer.</span>
            </h2>
            <span className="font-mono text-[12px] text-[var(--md-text-tertiary)]">
              Interactive prompt &amp; skill runner
            </span>
          </div>

          <div className="rounded-[24px] bg-[var(--md-bento-surface)] p-4 shadow-[inset_0_0_0_1px_var(--md-ring-menu)] sm:p-8">
            <PromptInputDemo skillExamples={skillExamples} />
          </div>
        </section>
      </div>

      {/* Connect Your Agent Modal (1-click MCP & Skills setup for Claude Code, Codex, Cursor) */}
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
                  Connect your coding agent
                </h3>
                <p className="mt-0.5 text-[13px] text-[#9a9a9a]">
                  Install canonical CMK skills &amp; configure MCP in 30 seconds.
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

            {/* Agent Selector Tabs */}
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

            {/* Step 1: CLI Install */}
            <div className="mt-5 space-y-1.5">
              <div className="text-[12px] font-medium text-[#9a9a9a]">
                1. Install AI DevKit skills
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

            {/* Step 2: MCP Config File */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[12px] font-medium text-[#9a9a9a]">
                <span>
                  2. Add to{" "}
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
