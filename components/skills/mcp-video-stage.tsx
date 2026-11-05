"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  ChevronDown,
  Columns2,
  Folder,
  Globe,
  Laptop,
  MoreVertical,
  PanelLeft,
  Pause,
  Play,
  Radio,
  Sparkles,
  Terminal,
} from "lucide-react";

interface CmkThumbSpec {
  slug: string;
  shortLabel: string;
  cmkName: string;
  skillPath: string;
  mode: "dark" | "light" | "code";
  accent: string;
  title: string;
  detail: string;
  companionLabel: string;
  contextPct: string;
}

interface DemoScene {
  id: string;
  label: string;
  windowTitle: string;
  envName: string;
  userPrompt: string;
  toolCall: string;
  duration: string;
  extraCount: string;
  connectorStatus: string;
  thumbs: CmkThumbSpec[];
}

const DEMO_SCENES: DemoScene[] = [
  {
    id: "delivery",
    label: "cmk:delivery-pipeline",
    windowTitle: "cmk:delivery-pipeline · SDLC",
    envName: "ai-devkit · ~",
    userPrompt: "Run cmk:delivery-pipeline to intake, spec, and review ticket #42",
    toolCall: "Using ai-devkit: cmk:delivery-pipeline",
    duration: "1.4s",
    extraCount: "+5",
    connectorStatus: "4 active",
    thumbs: [
      {
        slug: "delivery-intake",
        shortLabel: "cmk:intake",
        cmkName: "cmk:delivery-intake",
        skillPath: "skills/delivery-intake/SKILL.md",
        mode: "dark",
        accent: "#c3e88d",
        title: "Reconciled ticket #42 scope & affected modules",
        detail:
          "Mapped acceptance criteria against docs/ai/ and paired with Understand-Anything.",
        companionLabel: "+ @fleetingbits/Understand-Anything",
        contextPct: "22%",
      },
      {
        slug: "delivery-spec-plan",
        shortLabel: "cmk:spec",
        cmkName: "cmk:delivery-spec-plan",
        skillPath: "skills/delivery-spec-plan/SKILL.md",
        mode: "light",
        accent: "#3b82f6",
        title: "Drafted implementation spec under docs/design/",
        detail:
          "Interrogated edge cases with grill-me and checked upstream ADRs before planning.",
        companionLabel: "+ @mattpocockuk/grill-me",
        contextPct: "28%",
      },
      {
        slug: "delivery-review",
        shortLabel: "cmk:review",
        cmkName: "cmk:delivery-review",
        skillPath: "skills/delivery-review/SKILL.md",
        mode: "code",
        accent: "#a855f7",
        title: "Audited local diff against docs/rules/ & acceptance gates",
        detail:
          "Verified type-check, test suite, and visual diff annotations with plannotator.",
        companionLabel: "+ @backnotprop/plannotator",
        contextPct: "34%",
      },
    ],
  },
  {
    id: "architecture",
    label: "cmk:design & docs",
    windowTitle: "cmk:design · Living Docs",
    envName: "ai-devkit · ~",
    userPrompt: "Update our system design, codebase maps, and ADRs for the new UI",
    toolCall: "Using ai-devkit: cmk:design",
    duration: "1.8s",
    extraCount: "+4",
    connectorStatus: "4 active",
    thumbs: [
      {
        slug: "design",
        shortLabel: "cmk:design",
        cmkName: "cmk:design",
        skillPath: "skills/design/SKILL.md",
        mode: "dark",
        accent: "#fab12f",
        title: "Updated distilled feature spec in docs/design/",
        detail:
          "Aligned component boundaries and applied impeccable UI anti-slop rules.",
        companionLabel: "+ @pbakaus/impeccable",
        contextPct: "25%",
      },
      {
        slug: "codebase-docs",
        shortLabel: "cmk:ai-docs",
        cmkName: "cmk:codebase-docs",
        skillPath: "skills/codebase-docs/SKILL.md",
        mode: "light",
        accent: "#10b981",
        title: "Refreshed progressive-disclosure maps under docs/ai/",
        detail:
          "Linked entrypoints and rendered interactive SVG explainers with anatomy.",
        companionLabel: "+ @wheresryan22/anatomy",
        contextPct: "31%",
      },
      {
        slug: "adr",
        shortLabel: "cmk:adr",
        cmkName: "cmk:adr",
        skillPath: "skills/adr/SKILL.md",
        mode: "code",
        accent: "#3b82f6",
        title: "Recorded architecture decision in docs/adr/",
        detail:
          "Captured trade-offs and rejected alternatives with visual-explainer diagrams.",
        companionLabel: "+ @nicobailon/visual-explainer",
        contextPct: "37%",
      },
    ],
  },
  {
    id: "setup",
    label: "cmk:repo-setup",
    windowTitle: "cmk:repo-setup · Multi-Vendor",
    envName: "ai-devkit · ~",
    userPrompt: "Configure MCP servers and sync skills for Claude Code, Codex, and Cursor",
    toolCall: "Using ai-devkit: cmk:repo-setup",
    duration: "1.6s",
    extraCount: "+6",
    connectorStatus: "4 active",
    thumbs: [
      {
        slug: "mcp-config",
        shortLabel: "cmk:mcp",
        cmkName: "cmk:mcp-config",
        skillPath: "skills/mcp-config/SKILL.md",
        mode: "dark",
        accent: "#c3e88d",
        title: "Wrote checked-in .mcp.json & .codex/config.toml",
        detail:
          "Zero hardcoded secrets; environment variables bound cleanly across vendors.",
        companionLabel: "+ @shadcn/ui",
        contextPct: "24%",
      },
      {
        slug: "agent-vendors",
        shortLabel: "cmk:vendors",
        cmkName: "cmk:agent-vendors",
        skillPath: "skills/agent-vendors/SKILL.md",
        mode: "light",
        accent: "#3b82f6",
        title: "Synced 36 cmk:* skills into .agents/skills/",
        detail:
          "Wired one canonical skill directory for Claude Code, Codex, and Cursor.",
        companionLabel: "+ @emilkowalski_/skills",
        contextPct: "30%",
      },
      {
        slug: "rule",
        shortLabel: "cmk:rule",
        cmkName: "cmk:rule",
        skillPath: "skills/rule/SKILL.md",
        mode: "code",
        accent: "#f59e0b",
        title: "Codified enforceable standards in docs/rules/",
        detail:
          "Kept root AGENTS.md thin and paired with trailofbits security invariants.",
        companionLabel: "+ @trailofbits/skills",
        contextPct: "36%",
      },
    ],
  },
];

export function McpVideoStage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedThumbIdx, setSelectedThumbIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Step through each of the 3 cmk:* thumbnails inside the scene, then advance to the next scene
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSelectedThumbIdx((prevThumb) => {
        if (prevThumb < 2) {
          return prevThumb + 1;
        }
        setSceneIndex((prevScene) => (prevScene + 1) % DEMO_SCENES.length);
        return 0;
      });
    }, 2600);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const scene = DEMO_SCENES[sceneIndex];
  const activeThumb = scene.thumbs[selectedThumbIdx] ?? scene.thumbs[0];

  // Cursor X offset per thumbnail index (0, 1, 2)
  const cursorOffsets = [-116, -48, 20];
  const cursorX = cursorOffsets[selectedThumbIdx] ?? -48;

  return (
    <section id="how" aria-label="Demo video" className="mb-20 scroll-mt-20">
      {/* .mcp-video-frame — exact 3:2 aspect ratio & atmospheric cloud wallpaper matching marked.dev/mcp */}
      <div
        className="group relative aspect-[15/10] w-full overflow-hidden rounded-[24px] shadow-[0_28px_90px_rgba(0,0,0,0.72)] outline outline-1 -outline-offset-1 outline-white/[0.14]"
        style={{
          background:
            "linear-gradient(180deg, #1b76d2 0%, #3592eb 32%, #6cb8f8 68%, #bce0fd 100%)",
        }}
      >
        {/* Photorealistic multi-layered clouds matching the marked.dev/mcp sky backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute -left-16 -top-10 h-44 w-[75%] rounded-full opacity-90 blur-xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.92) 30%, rgba(235,246,255,0.55) 70%, transparent 100%)",
            }}
          />
          <div
            className="absolute -right-12 top-2 h-[88%] w-56 opacity-95 blur-lg"
            style={{
              background:
                "radial-gradient(circle at 60% 18%, rgba(255,252,245,0.96) 0%, rgba(255,236,209,0.75) 26%, transparent 55%), radial-gradient(circle at 70% 48%, rgba(255,252,246,0.95) 0%, rgba(248,228,202,0.7) 30%, transparent 60%), radial-gradient(circle at 65% 78%, rgba(255,250,242,0.94) 0%, rgba(242,222,198,0.75) 32%, transparent 62%)",
            }}
          />
          <div
            className="absolute inset-x-12 top-1 h-24 opacity-85 blur-md"
            style={{
              background:
                "radial-gradient(circle at 18% 40%, #ffffff 0%, transparent 28%), radial-gradient(circle at 46% 30%, #ffffff 0%, transparent 32%), radial-gradient(circle at 76% 35%, #fffdf9 0%, transparent 30%)",
            }}
          />
        </div>

        {/* Left-bleeding Desktop Agent Window (1:1 geometry with marked.dev/mcp video) */}
        <div className="relative -ml-3 mt-8 flex h-[calc(100%-2rem)] w-[calc(100%-1.25rem)] flex-col overflow-hidden rounded-tr-[20px] border border-white/60 bg-[#fcfcfb] text-[#18181b] shadow-[0_24px_70px_rgba(12,38,78,0.38)] ring-[5px] ring-white/35 sm:-ml-6 sm:mt-12 sm:h-[calc(100%-3rem)] sm:w-[calc(100%-2.25rem)]">
          {/* Window Top Navigation Bar */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-black/[0.05] px-5 sm:px-7">
            <div className="flex items-center gap-3.5 text-[13px] text-[#71717a]">
              <span className="select-none text-[#a1a1aa]">→</span>
              <button
                type="button"
                onClick={() => {
                  setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
                  setSelectedThumbIdx(0);
                }}
                className="inline-flex items-center gap-1.5 font-medium text-[#18181b] transition-colors hover:text-[#2563eb]"
              >
                <span>{scene.windowTitle}</span>
                <ChevronDown size={13} className="text-[#71717a]" />
              </button>
            </div>

            {/* Right macOS Agent Toolbar Icons */}
            <div className="flex items-center gap-1.5 text-[#71717a] sm:gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/[0.08] bg-black/[0.03] text-[#18181b]">
                <PanelLeft size={13.5} />
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04]">
                <Terminal size={13.5} />
              </span>
              <span className="hidden h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04] sm:inline-flex">
                <Columns2 size={13.5} />
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04]">
                <Globe size={13.5} />
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04]">
                <Folder size={13.5} />
              </span>
              <span className="hidden h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04] sm:inline-flex">
                <MoreVertical size={13.5} />
              </span>
            </div>
          </div>

          {/* Window Content Area */}
          <div className="relative grid flex-1 grid-cols-1 gap-6 overflow-hidden p-5 sm:p-8 lg:grid-cols-[1fr_240px]">
            {/* Center Agent Conversation Column */}
            <div className="mx-auto flex w-full max-w-[560px] flex-col justify-between">
              <div>
                {/* Subtle Environment Suggestion Banner */}
                <p className="text-center text-[11px] leading-relaxed text-[#a1a1aa]">
                  You often start on This computer · {scene.envName.split(" ")[0]};
                  save it as an environment to start here in one click ·{" "}
                  <span className="underline decoration-[#d4d4d8]">
                    Save as environment
                  </span>{" "}
                  · <span className="underline decoration-[#d4d4d8]">Not now</span>
                </p>

                {/* User Prompt Pill (Right-aligned) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scene.id + "-prompt"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="mt-6 flex justify-end sm:mt-8"
                  >
                    <div className="rounded-[18px] bg-[#f3f2f0] px-4 py-2 text-[13px] font-medium text-[#18181b]">
                      {scene.userPrompt}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Agent MCP Tool Execution Row + 3 Selectable CMK Skill Chips + Animated Cursor */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scene.id + "-tool"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.26, delay: 0.05 }}
                    className="mt-7 flex flex-wrap items-center justify-between gap-4 sm:mt-9"
                  >
                    {/* Left: Dot + Tool Call Name + Duration */}
                    <div className="inline-flex items-center gap-2.5 text-[13px] text-[#71717a]">
                      <span className="relative inline-flex h-4 w-4 items-center justify-center">
                        <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-[#ea580c]/40" />
                        <span className="relative h-2 w-2 rounded-full bg-[#ea580c]" />
                      </span>
                      <span className="font-normal text-[#52525b]">
                        {scene.toolCall}
                      </span>
                      <span className="text-[12px] text-[#a1a1aa]">
                        {scene.duration} ›
                      </span>
                    </div>

                    {/* Right: 3 Selectable CMK Skill Thumbnails + Animated Pointer Cursor */}
                    <div className="relative flex items-center gap-1.5 pr-2">
                      <span className="mr-1 font-mono text-[11.5px] text-[#a1a1aa]">
                        {scene.extraCount}
                      </span>

                      {scene.thumbs.map((thumb, idx) => {
                        const isSelected = idx === selectedThumbIdx;
                        return (
                          <button
                            key={thumb.slug}
                            type="button"
                            onClick={() => {
                              setSelectedThumbIdx(idx);
                              setIsPlaying(false);
                            }}
                            onMouseEnter={() => {
                              setSelectedThumbIdx(idx);
                              setIsPlaying(false);
                            }}
                            className={`relative flex h-[34px] w-[62px] flex-col justify-between overflow-hidden rounded-[7px] px-2 py-1.5 text-left transition-all duration-200 ${
                              thumb.mode === "dark"
                                ? "bg-[#18181b] text-white"
                                : thumb.mode === "code"
                                  ? "bg-[#1e1b4b] text-white"
                                  : "bg-[#f8fafc] text-[#0f172a]"
                            } ${
                              isSelected
                                ? "z-10 scale-105 shadow-md ring-2 ring-[#3b82f6]"
                                : "opacity-85 ring-1 ring-black/15 hover:opacity-100"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className="h-1.5 w-3.5 rounded-full"
                                style={{ background: thumb.accent }}
                              />
                              <span className="h-1 w-2 rounded-full bg-current opacity-25" />
                            </div>
                            <span className="truncate font-mono text-[8px] font-medium opacity-95">
                              {thumb.shortLabel}
                            </span>
                          </button>
                        );
                      })}

                      {/* Smoothly Animated macOS Pointer Cursor */}
                      <motion.svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        animate={{
                          x: cursorX,
                          y: [0, -2, 0],
                          scale: [1, 0.94, 1],
                        }}
                        transition={{
                          x: { type: "spring", stiffness: 180, damping: 22 },
                          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                          scale: {
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                        className="pointer-events-none absolute -bottom-4 right-0 z-20 h-6 w-6 drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)]"
                      >
                        <path
                          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                          fill="#111111"
                          stroke="#ffffff"
                          strokeWidth="1.6"
                        />
                      </motion.svg>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Connected Live CMK Inspection Card (updates whenever you select any of the 3 cmk:* thumbnails!) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${scene.id}-${activeThumb.slug}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="mt-8 rounded-2xl border border-black/[0.06] bg-[#f8f8f6] px-4 py-3.5 text-[12.5px] text-[#3f3f46] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/skills/${activeThumb.slug}`}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#2563eb] hover:underline"
                      >
                        <Sparkles size={11.5} />
                        <span>{activeThumb.cmkName}</span>
                        <ArrowUpRight size={11} />
                      </Link>
                      <span className="font-mono text-[10.5px] text-[#71717a]">
                        {activeThumb.companionLabel}
                      </span>
                    </div>
                    <p className="mt-1.5 font-medium text-[#18181b]">
                      {activeThumb.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#71717a]">
                      {activeThumb.detail}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Environment / Connectors Inspector Column (1:1 with marked.dev/mcp screenshot) */}
            <div className="hidden flex-col gap-2.5 text-[12px] lg:flex">
              <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="mb-2.5 flex items-center justify-between font-medium text-[#18181b]">
                  <span className="inline-flex items-center gap-1">
                    Environment
                    <ChevronDown size={12} className="text-[#71717a]" />
                  </span>
                </div>
                <div className="space-y-2 text-[#52525b]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <Laptop size={12.5} className="text-[#71717a]" />
                      This computer
                    </span>
                    <span className="text-[11px] text-[#a1a1aa] underline">
                      Save
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Folder size={12.5} className="text-[#71717a]" />
                    <span className="truncate font-mono text-[11px]">
                      {scene.envName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="inline-flex items-center gap-2">
                      <Radio size={12.5} className="text-[#71717a]" />
                      Remote Control
                    </span>
                    <span className="inline-flex h-4 w-7 items-center rounded-full bg-[#3b82f6] p-0.5">
                      <span className="ml-auto h-3 w-3 rounded-full bg-white shadow-sm" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <span className="font-medium text-[#18181b]">Connectors ›</span>
                <span className="text-[11.5px] text-[#a1a1aa]">
                  {scene.connectorStatus}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <span className="font-medium text-[#18181b]">Context ›</span>
                <span className="inline-flex items-center gap-2 text-[11.5px] text-[#a1a1aa]">
                  {activeThumb.contextPct}
                  <span className="inline-flex h-1.5 w-7 overflow-hidden rounded-full bg-black/[0.08]">
                    <span
                      className="rounded-full bg-[#3b82f6] transition-all duration-300"
                      style={{ width: activeThumb.contextPct }}
                    />
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Sleek Video Overlay Controls at Bottom of Window */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.05] bg-[#fafaf9]/90 px-4 py-2.5 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Pause demo" : "Play demo"}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#18181b] text-white transition-transform active:scale-95"
              >
                {isPlaying ? <Pause size={11} /> : <Play size={11} />}
              </button>
              <div className="flex items-center gap-1 pl-1">
                {DEMO_SCENES.map((item, idx) => {
                  const active = idx === sceneIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSceneIndex(idx);
                        setSelectedThumbIdx(0);
                        setIsPlaying(false);
                      }}
                      className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                        active
                          ? "bg-black/[0.08] text-[#18181b]"
                          : "text-[#71717a] hover:bg-black/[0.04] hover:text-[#18181b]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <span className="font-mono text-[11px] text-[#a1a1aa]">
              {isPlaying
                ? `Auto-playing · ${activeThumb.cmkName}`
                : `Interactive · ${activeThumb.cmkName}`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
