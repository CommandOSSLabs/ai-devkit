"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
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
  contextPct: string;
  cursorTargetIdx: number;
  thumbs: {
    title: string;
    subtitle: string;
    mode: "dark" | "light" | "code";
    accent: string;
  }[];
  previewToast: {
    tag: string;
    title: string;
    detail: string;
  };
}

const DEMO_SCENES: DemoScene[] = [
  {
    id: "search",
    label: "Search saved refs",
    windowTitle: "Refs from AI DevKit",
    envName: "ai-devkit · ~",
    userPrompt: "Can you find my refs from AI DevKit",
    toolCall: "Using ai-devkit: search refs",
    duration: "2.5s",
    extraCount: "+5",
    connectorStatus: "4 active",
    contextPct: "24%",
    cursorTargetIdx: 1,
    thumbs: [
      {
        title: "taste-skill",
        subtitle: "Obsidian Gallery",
        mode: "dark",
        accent: "#fab12f",
      },
      {
        title: "emil-motion",
        subtitle: "Spring Physics",
        mode: "light",
        accent: "#3b82f6",
      },
      {
        title: "cmk:design",
        subtitle: "System Spec",
        mode: "light",
        accent: "#10b981",
      },
    ],
    previewToast: {
      tag: "search_refs · 8 matches",
      title: "Loaded Design & Motion references into context",
      detail: "taste-skill, UI/UX Pro Max, and cmk:design ready to apply.",
    },
  },
  {
    id: "mcp-config",
    label: "Wire .mcp.json",
    windowTitle: "cmk:mcp-config · Multi-Vendor",
    envName: "ai-devkit · ~",
    userPrompt: "Configure MCP servers for Claude Code, Codex, and Cursor",
    toolCall: "Using cmk:mcp-config: sync vendors",
    duration: "1.8s",
    extraCount: "+3",
    connectorStatus: "4 active",
    contextPct: "31%",
    cursorTargetIdx: 0,
    thumbs: [
      {
        title: ".mcp.json",
        subtitle: "Claude Code",
        mode: "dark",
        accent: "#c3e88d",
      },
      {
        title: "config.toml",
        subtitle: "Codex CLI",
        mode: "light",
        accent: "#3b82f6",
      },
      {
        title: "mcp.json",
        subtitle: "Cursor IDE",
        mode: "code",
        accent: "#a855f7",
      },
    ],
    previewToast: {
      tag: "cmk:mcp-config · verified",
      title: "Wrote checked-in .mcp.json & .codex/config.toml",
      detail: "Zero hardcoded secrets; environment variables bound cleanly.",
    },
  },
  {
    id: "build",
    label: "Build with refs",
    windowTitle: "Build with Saved Collection",
    envName: "ai-devkit · ~",
    userPrompt: "Build our Collections folders and Bento preview from these refs",
    toolCall: "Using ai-devkit: get_ref_details",
    duration: "3.1s",
    extraCount: "+6",
    connectorStatus: "4 active",
    contextPct: "38%",
    cursorTargetIdx: 2,
    thumbs: [
      {
        title: "FolderFlap",
        subtitle: "3D Glass SVG",
        mode: "dark",
        accent: "#a855f7",
      },
      {
        title: "BentoCard",
        subtitle: "LayoutGroup",
        mode: "light",
        accent: "#3b82f6",
      },
      {
        title: "ExploreGrid",
        subtitle: "Masonry Tiles",
        mode: "code",
        accent: "#f59e0b",
      },
    ],
    previewToast: {
      tag: "cmk:delivery-review · pass",
      title: "Applied 3D frosted folder & interactive Bento dashboard",
      detail: "Matched layout tokens, spring curves, and keyboard a11y.",
    },
  },
];

export function McpVideoStage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
    }, 4600);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const scene = DEMO_SCENES[sceneIndex];
  const activeThumbIdx = hoveredThumb ?? scene.cursorTargetIdx;

  // Cursor X offset per thumbnail index (0, 1, 2)
  const cursorOffsets = [-82, -26, 30];
  const cursorX = cursorOffsets[activeThumbIdx] ?? -26;

  return (
    <section id="how" aria-label="Demo video" className="mb-20">
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
          {/* Sunlit cloud bank across top-left and center */}
          <div
            className="absolute -left-16 -top-10 h-44 w-[75%] rounded-full opacity-90 blur-xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.92) 30%, rgba(235,246,255,0.55) 70%, transparent 100%)",
            }}
          />
          {/* Fluffy warm-tinted cloud cluster on the right edge */}
          <div
            className="absolute -right-12 top-2 h-[88%] w-56 opacity-95 blur-lg"
            style={{
              background:
                "radial-gradient(circle at 60% 18%, rgba(255,252,245,0.96) 0%, rgba(255,236,209,0.75) 26%, transparent 55%), radial-gradient(circle at 70% 48%, rgba(255,252,246,0.95) 0%, rgba(248,228,202,0.7) 30%, transparent 60%), radial-gradient(circle at 65% 78%, rgba(255,250,242,0.94) 0%, rgba(242,222,198,0.75) 32%, transparent 62%)",
            }}
          />
          {/* Crisp cloud puffs along top ridge */}
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
                onClick={() =>
                  setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length)
                }
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

                {/* Agent MCP Tool Execution Row + Miniature Ref Cards + Animated Cursor */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scene.id + "-tool"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.26, delay: 0.05 }}
                    className="mt-7 flex flex-wrap items-center justify-between gap-4 sm:mt-9"
                  >
                    {/* Left: Sparkle + Tool Call Name + Duration */}
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

                    {/* Right: +5 Ref Thumbnails + Animated Pointer Cursor */}
                    <div className="relative flex items-center gap-1.5 pr-2">
                      <span className="mr-1 font-mono text-[11.5px] text-[#a1a1aa]">
                        {scene.extraCount}
                      </span>

                      {scene.thumbs.map((thumb, idx) => {
                        const isSelected = idx === activeThumbIdx;
                        return (
                          <button
                            key={thumb.title}
                            type="button"
                            onMouseEnter={() => {
                              setHoveredThumb(idx);
                              setIsPlaying(false);
                            }}
                            onMouseLeave={() => setHoveredThumb(null)}
                            className={`relative flex h-[30px] w-[44px] flex-col justify-between overflow-hidden rounded-[6px] p-1.5 text-left transition-all duration-300 ${
                              thumb.mode === "dark"
                                ? "bg-[#18181b] text-white"
                                : thumb.mode === "code"
                                  ? "bg-[#1e1b4b] text-white"
                                  : "bg-[#f8fafc] text-[#0f172a]"
                            } ${
                              isSelected
                                ? "z-10 scale-105 ring-2 ring-[#3b82f6] shadow-md"
                                : "opacity-90 ring-1 ring-black/15"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className="h-1.5 w-3.5 rounded-full"
                                style={{ background: thumb.accent }}
                              />
                              <span className="h-1 w-2 rounded-full bg-current opacity-25" />
                            </div>
                            <span className="truncate font-mono text-[6.5px] opacity-80">
                              {thumb.title}
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

                {/* Subtle Live MCP Inspection Toast (shows what the agent extracted from the hovered/selected ref) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scene.id + "-toast"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="mt-8 rounded-2xl border border-black/[0.06] bg-[#f8f8f6] px-4 py-3 text-[12.5px] text-[#3f3f46] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#2563eb]">
                        <Sparkles size={11.5} />
                        <span>{scene.previewToast.tag}</span>
                      </span>
                      <span className="font-mono text-[10.5px] text-[#a1a1aa]">
                        {scene.thumbs[activeThumbIdx]?.title}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-[#18181b]">
                      {scene.previewToast.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#71717a]">
                      {scene.previewToast.detail}
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
                  {scene.contextPct}
                  <span className="inline-flex h-1.5 w-7 overflow-hidden rounded-full bg-black/[0.08]">
                    <span className="w-1/3 rounded-full bg-[#3b82f6]" />
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
              {isPlaying ? "Auto-playing · 3 scenes" : "Interactive mode"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
