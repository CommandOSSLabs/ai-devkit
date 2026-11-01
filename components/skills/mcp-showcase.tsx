"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Globe, Terminal, X } from "lucide-react";
import { PromptInputDemo } from "@/components/agents/prompt-input-demo";
import type { SkillExample } from "@/lib/skill-examples";
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
    id: "cmk",
    label: "CMK Core Skills",
    bg: "#437df5",
    color: "#ffffff",
    icon: <Terminal className="h-4 w-4" />,
  },
  {
    id: "x",
    label: "X Companion Refs",
    bg: "#262626",
    color: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L1.6 2H8l4.5 6.7L18.9 2Zm-1.1 18h1.8L7 4H5.1l12.7 16Z" />
      </svg>
    ),
  },
  {
    id: "web",
    label: "Living Docs",
    bg: "#1d9bf0",
    color: "#ffffff",
    icon: <Globe className="h-5 w-5" />,
  },
];

const MCP_CAPABILITIES = [
  {
    title: "Run 23 core cmk:* skills",
    description:
      "Load canonical engineering workflows — delivery pipeline, design specs, ADRs, and repo setup — straight into your agent.",
    tools: ["cmk:delivery-pipeline", "cmk:design"],
  },
  {
    title: "Auto-pair companion refs",
    description:
      "Each cmk:* skill pulls its vetted companion skills from Collections (grill-me, plannotator, impeccable, anatomy) when needed.",
    tools: ["get_cmk_skill", "get_collection"],
  },
  {
    title: "Keep living /docs in sync",
    description:
      "Read and update docs/requirements, docs/design, docs/adr, and docs/ai codebase maps without drifting from source.",
    tools: ["cmk:codebase-docs", "cmk:adr"],
  },
  {
    title: "One config across vendors",
    description:
      "Wire checked-in .mcp.json and .agents/skills/ once for Claude Code, Codex, and Cursor.",
    tools: ["cmk:mcp-config", "cmk:agent-vendors"],
  },
];

const COPYABLE_PROMPTS = [
  {
    category: "Delivery Pipeline",
    prompt:
      "Run cmk:delivery-pipeline on this ticket: intake context, spec the plan, and verify before shipping.",
  },
  {
    category: "System & UI Design",
    prompt:
      "Use cmk:design with our Design collection to spec and polish this component.",
  },
  {
    category: "Pre-Spec Interrogation",
    prompt:
      "Load cmk:delivery-spec-plan and grill-me to stress-test our edge cases before writing code.",
  },
  {
    category: "AI Codebase Maps",
    prompt:
      "Run cmk:codebase-docs and anatomy to refresh docs/ai/ and build an interactive architecture map.",
  },
  {
    category: "Pre-Ship Diff Review",
    prompt:
      "Use cmk:delivery-review and security-review to audit our local diff against docs/rules/.",
  },
  {
    category: "Multi-Vendor Setup",
    prompt:
      "Run cmk:repo-setup and cmk:mcp-config to wire .mcp.json and .agents/skills/ for Claude Code and Codex.",
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
  const [connectOpen, setConnectOpen] = useState(false);
  const [activeAgentTab, setActiveAgentTab] = useState<
    "claude" | "codex" | "cursor"
  >("claude");
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
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
        {/* 1. Hero Section — Clean & minimal matching marked.dev/mcp */}
        <section
          aria-labelledby="mcp-title"
          className="flex flex-col items-center pb-14 pt-12 text-center sm:pb-16 sm:pt-16"
        >
          <h1
            id="mcp-title"
            className="max-w-[680px] text-[34px] font-medium leading-[1.08] tracking-[-0.024em] text-[var(--md-fg)] sm:text-[46px]"
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
              <span>for</span>
              <code className="font-mono text-[31px] text-[var(--md-fg)] sm:text-[42px]">
                cmk:*
              </code>
              <span
                title={currentSource.label}
                style={{ background: currentSource.bg, color: currentSource.color }}
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[11px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                {currentSource.icon}
              </span>
              <span>skills.</span>
            </span>
          </h1>

          <p className="mt-5 max-w-[460px] text-[15px] leading-[22.5px] text-[var(--md-text-tertiary)]">
            The MCP server that lets Claude Code, Codex and Cursor run the 23
            core{" "}
            <code className="font-mono text-[13.5px] text-[var(--md-fg)]">
              cmk:*
            </code>{" "}
            skills and companion collections, so they build the way you would.
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

        {/* 2. Sky-Framed Desktop Agent Video Showcase (#how) */}
        <McpVideoStage />

        {/* 3. Interactive Bento Dashboard + MCP Capabilities Section */}
        <section aria-labelledby="mcp-tools-title" className="mb-16">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="mcp-tools-title"
              className="text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--md-fg)] sm:text-[28px]"
            >
              <span>What your agent reads</span>{" "}
              <span className="text-[var(--md-text-tertiary)]">
                before it builds.
              </span>
            </h2>
            <span className="font-mono text-[11.5px] text-[var(--md-text-tertiary)]">
              Interactive Bento Preview · Switch tabs below
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

        {/* 4. Copyable Prompts Section: "Ask before it builds. Copy a prompt to try it." */}
        <section aria-labelledby="mcp-prompts-title" className="mb-16">
          <h2
            id="mcp-prompts-title"
            className="mb-6 text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--md-fg)] sm:text-[28px]"
          >
            <span>Ask before it builds.</span>{" "}
            <span className="text-[var(--md-text-tertiary)]">
              Copy a prompt to try it.
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
