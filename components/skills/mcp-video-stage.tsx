"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronDown,
  Columns2,
  Copy,
  ExternalLink,
  Folder,
  Laptop,
  MoreVertical,
  PanelLeft,
  Pause,
  Play,
  Radio,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  CURATED_SKILL_REFS,
  resolveRefAvatar,
  resolveRefThumbnail,
  resolveRefXLink,
  type CuratedSkillRef,
} from "@/lib/skill-collections";

interface SceneSkillStep {
  refId: string;
  mcpCall: string;
  extractedRuleTitle: string;
  extractedRuleDetail: string;
  whyItMatters: string;
  contextAddedPct: string;
}

interface DemoScene {
  id: string;
  stepNumber: string;
  label: string;
  collectionId: string;
  collectionTitle: string;
  windowTitle: string;
  envName: string;
  userPrompt: string;
  toolCall: string;
  duration: string;
  extraCount: string;
  connectorStatus: string;
  skills: SceneSkillStep[];
}

const DEMO_SCENES: DemoScene[] = [
  {
    id: "pull-design",
    stepNumber: "01",
    label: '1. Pull "Design" Collection',
    collectionId: "design",
    collectionTitle: "Design Collection",
    windowTitle: 'MCP · get_collection("design")',
    envName: "ai-devkit · /skills/collections",
    userPrompt:
      "Pull the Design collection from AI DevKit MCP and polish our folder cards & spring motion",
    toolCall: 'ai-devkit.get_collection({ collection_id: "design" })',
    duration: "1.4s",
    extraCount: "+4 more in Design",
    connectorStatus: "ai-devkit MCP · active",
    skills: [
      {
        refId: "emilkowalski-skills",
        mcpCall: 'get_skill_ref({ id: "emilkowalski-skills", include_skill_md: true })',
        extractedRuleTitle:
          "Loaded SKILL.md: Emil Kowalski — Design Engineering & Animations",
        extractedRuleDetail:
          "Use spring physics (stiffness: 260, damping: 24) for folder flap rotateX(-40deg); keep hover transitions under 220ms and avoid bounce on layout shifts.",
        whyItMatters:
          "Paired with cmk:design → applies production motion curves to StackedFolderCard.",
        contextAddedPct: "22%",
      },
      {
        refId: "pbakaus-impeccable",
        mcpCall: 'get_skill_ref({ id: "pbakaus-impeccable", include_skill_md: true })',
        extractedRuleTitle:
          "Loaded SKILL.md: Impeccable — 20 Design Commands & Anti-Slop",
        extractedRuleDetail:
          "Run /critique and /polish gates: strip generic AI gradient borders, enforce 1px subtle inner rings (rgba(255,255,255,0.08)), and tighten typographic hierarchy.",
        whyItMatters:
          "Paired with cmk:delivery-review → audits UI components against anti-slop rules.",
        contextAddedPct: "28%",
      },
      {
        refId: "leonxlnx-taste-skill",
        mcpCall: 'get_skill_ref({ id: "leonxlnx-taste-skill", include_skill_md: true })',
        extractedRuleTitle:
          "Loaded SKILL.md: Taste-Skill — High-Agency Frontend Direction",
        extractedRuleDetail:
          "Enforce obsidian gallery surface (#0d0d0f) with high-contrast metadata pills and real creator X media thumbnails instead of placeholder blocks.",
        whyItMatters:
          "Paired with cmk:design → drives the visual card layout across /skills/collections.",
        contextAddedPct: "34%",
      },
    ],
  },
  {
    id: "pull-workflow",
    stepNumber: "02",
    label: '2. Pull "Workflow & Grill"',
    collectionId: "workflow",
    collectionTitle: "Workflow & Grill Collection",
    windowTitle: 'MCP · get_collection("workflow")',
    envName: "ai-devkit · /skills/collections",
    userPrompt:
      "Pull grill-me and plannotator from our Workflow collection to stress-test and review this spec",
    toolCall: 'ai-devkit.get_collection({ collection_id: "workflow" })',
    duration: "1.6s",
    extraCount: "+1 more in Workflow",
    connectorStatus: "ai-devkit MCP · active",
    skills: [
      {
        refId: "mattpocock-grill-me",
        mcpCall: 'get_skill_ref({ id: "mattpocock-grill-me", include_skill_md: true })',
        extractedRuleTitle:
          "Loaded SKILL.md: grill-me — Relentless Pre-Spec Interrogation",
        extractedRuleDetail:
          "Before writing code, interview the operator on edge cases, data ownership, failure modes, and scope boundaries until zero ambiguity remains.",
        whyItMatters:
          "Paired with cmk:delivery-intake & cmk:delivery-spec-plan → prevents premature implementation.",
        contextAddedPct: "26%",
      },
      {
        refId: "backnotprop-plannotator",
        mcpCall: 'get_skill_ref({ id: "backnotprop-plannotator", include_skill_md: true })',
        extractedRuleTitle:
          "Loaded SKILL.md: Plannotator — Visual Plan & Diff Annotation Gate",
        extractedRuleDetail:
          "Render the implementation plan and file diff in an interactive visual review canvas; block execution until inline annotations are resolved.",
        whyItMatters:
          "Paired with cmk:delivery-spec-plan & cmk:delivery-review → visual sign-off before merge.",
        contextAddedPct: "31%",
      },
      {
        refId: "obra-superpowers",
        mcpCall: 'get_skill_ref({ id: "obra-superpowers", include_skill_md: true })',
        extractedRuleTitle:
          "Loaded SKILL.md: Superpowers — TDD & Subagent Dispatch",
        extractedRuleDetail:
          "Decompose approved spec into isolated tasks, enforce red-green-refactor test gates first, and verify every acceptance criterion.",
        whyItMatters:
          "Paired with cmk:delivery-pipeline → runs disciplined multi-step execution.",
        contextAddedPct: "39%",
      },
    ],
  },
  {
    id: "pull-explainers-security",
    stepNumber: "03",
    label: "3. Install & Execute Skills",
    collectionId: "explainers",
    collectionTitle: "Explainers & Security Collections",
    windowTitle: "MCP · install_collection_skill()",
    envName: "ai-devkit · .agents/skills",
    userPrompt:
      "Install anatomy, visual-explainer, and trailofbits security skills from Collections into this repo",
    toolCall: "ai-devkit.install_collection_skill({ vendor: 'all' })",
    duration: "2.1s",
    extraCount: "Pinned SHA verified",
    connectorStatus: "ai-devkit MCP · active",
    skills: [
      {
        refId: "wheresryan-anatomy",
        mcpCall: 'install_collection_skill({ id: "wheresryan-anatomy" })',
        extractedRuleTitle:
          "Installed to .agents/skills/anatomy: Explain Complex Systems by Building",
        extractedRuleDetail:
          "Generates interactive single-file HTML/SVG architecture walkthroughs with slider state controls and progressive disclosure.",
        whyItMatters:
          "Paired with cmk:codebase-docs → builds live visual codebase maps under docs/ai/.",
        contextAddedPct: "29%",
      },
      {
        refId: "nicobailon-visual-explainer",
        mcpCall: 'install_collection_skill({ id: "nicobailon-visual-explainer" })',
        extractedRuleTitle:
          "Installed to .agents/skills/visual-explainer: Rich HTML Diagrams",
        extractedRuleDetail:
          "Turns terminal ASCII tables and architecture diffs into self-contained interactive HTML pages instead of wall-of-text markdown.",
        whyItMatters:
          "Paired with cmk:adr & cmk:codebase-docs → visual architecture decision records.",
        contextAddedPct: "35%",
      },
      {
        refId: "trailofbits-skills",
        mcpCall: 'install_collection_skill({ id: "trailofbits-skills" })',
        extractedRuleTitle:
          "Installed to .agents/skills/trailofbits: Security Audit & Variant Analysis",
        extractedRuleDetail:
          "Runs property-based invariant checks, auth-boundary verification, and vulnerability variant analysis across changed files.",
        whyItMatters:
          "Paired with cmk:delivery-review → pre-PR security gate.",
        contextAddedPct: "42%",
      },
    ],
  },
];

function getRefById(id: string): CuratedSkillRef {
  return (
    CURATED_SKILL_REFS.find((r) => r.id === id) ?? CURATED_SKILL_REFS[0]
  );
}

export function McpVideoStage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedSkillIdx, setSelectedSkillIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState(false);

  // Auto-advance through each of the 3 pulled skills inside the current scene,
  // then advance to the next scene so the viewer sees the cursor select each skill
  // and sees the inspector panel update in sync!
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSelectedSkillIdx((prevSkill) => {
        if (prevSkill < 2) {
          return prevSkill + 1;
        }
        setSceneIndex((prevScene) => (prevScene + 1) % DEMO_SCENES.length);
        return 0;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const scene = DEMO_SCENES[sceneIndex];
  const activeStep = scene.skills[selectedSkillIdx] ?? scene.skills[0];
  const activeRef = getRefById(activeStep.refId);
  const activeThumbUrl = resolveRefThumbnail(activeRef);
  const activeAvatarUrl = resolveRefAvatar(activeRef);
  const activeXLink = resolveRefXLink(activeRef);

  function handleSelectScene(idx: number) {
    setSceneIndex(idx);
    setSelectedSkillIdx(0);
    setIsPlaying(false);
  }

  function handleSelectSkill(idx: number) {
    setSelectedSkillIdx(idx);
    setIsPlaying(false);
  }

  function handleCopyInstall(cmd: string) {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1600);
  }

  return (
    <section id="how" aria-label="Interactive MCP Demo Stage" className="mb-20 scroll-mt-20">
      {/* .mcp-video-frame — atmospheric sky backdrop framing the live agent MCP window */}
      <div
        className="group relative w-full overflow-hidden rounded-[24px] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.72)] outline outline-1 -outline-offset-1 outline-white/[0.14] sm:p-7"
        style={{
          background:
            "linear-gradient(180deg, #1b76d2 0%, #3592eb 32%, #6cb8f8 68%, #bce0fd 100%)",
        }}
      >
        {/* Photorealistic multi-layered clouds */}
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
        </div>

        {/* Desktop Agent Window */}
        <div className="relative mx-auto flex w-full flex-col overflow-hidden rounded-[20px] border border-white/60 bg-[#fcfcfb] text-[#18181b] shadow-[0_24px_70px_rgba(12,38,78,0.38)] ring-[5px] ring-white/35">
          {/* Window Top Navigation Bar */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-black/[0.06] bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3 text-[13px] text-[#71717a]">
              <span className="inline-flex h-6 items-center rounded-md bg-[#eff6ff] px-2 font-mono text-[11px] font-semibold text-[#2563eb]">
                STEP {scene.stepNumber}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleSelectScene((sceneIndex + 1) % DEMO_SCENES.length)
                }
                className="inline-flex items-center gap-1.5 font-mono text-[12.5px] font-medium text-[#18181b] transition-colors hover:text-[#2563eb]"
              >
                <span>{scene.windowTitle}</span>
                <ChevronDown size={13} className="text-[#71717a]" />
              </button>
            </div>

            {/* Right macOS Agent Toolbar Icons */}
            <div className="flex items-center gap-1.5 text-[#71717a] sm:gap-2">
              <span className="hidden rounded-full bg-black/[0.04] px-2.5 py-1 font-mono text-[11px] text-[#52525b] sm:inline-flex">
                Click any pulled skill card below to inspect
              </span>
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
                <Folder size={13.5} />
              </span>
              <span className="hidden h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04] sm:inline-flex">
                <MoreVertical size={13.5} />
              </span>
            </div>
          </div>

          {/* Window Content Area */}
          <div className="relative grid flex-1 grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_265px]">
            {/* Left/Center Agent Conversation + Connected Skill Inspector */}
            <div className="flex w-full flex-col justify-between">
              <div>
                {/* 1. User Prompt Bubble */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
                    1. Your Prompt in Claude Code / Codex / Cursor
                  </span>
                  <span className="font-mono text-[11px] text-[#2563eb]">
                    Collection: {scene.collectionTitle}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={scene.id + "-prompt"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 flex justify-end"
                  >
                    <div className="w-full rounded-[16px] border border-black/[0.07] bg-[#f4f4f1] px-4 py-2.5 text-[13.5px] font-medium text-[#18181b] shadow-sm">
                      &ldquo;{scene.userPrompt}&rdquo;
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* 2. Agent MCP Tool Call + 3 Interactive Pulled Collection Skill Cards */}
                <div className="mt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 text-[12.5px] text-[#52525b]">
                      <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
                        <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-[#ea580c]/40" />
                        <span className="relative h-2 w-2 rounded-full bg-[#ea580c]" />
                      </span>
                      <code className="rounded bg-black/[0.05] px-1.5 py-0.5 font-mono text-[11.5px] font-medium text-[#18181b]">
                        {scene.toolCall}
                      </code>
                      <span className="font-mono text-[11px] text-[#a1a1aa]">
                        {scene.duration}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-[#71717a]">
                      2. Select a pulled X skill to see what MCP loads ({selectedSkillIdx + 1}/3)
                    </span>
                  </div>

                  {/* 3 Interactive Skill Thumbnail Cards from the Collection */}
                  <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {scene.skills.map((skillStep, idx) => {
                      const refItem = getRefById(skillStep.refId);
                      const thumbUrl = resolveRefThumbnail(refItem);
                      const avatarUrl = resolveRefAvatar(refItem);
                      const isSelected = idx === selectedSkillIdx;

                      return (
                        <button
                          key={skillStep.refId}
                          type="button"
                          onClick={() => handleSelectSkill(idx)}
                          onMouseEnter={() => handleSelectSkill(idx)}
                          className={`group/card relative flex items-center gap-2.5 rounded-[14px] border p-2 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#2563eb] bg-[#eff6ff]/90 shadow-[0_6px_18px_rgba(37,99,235,0.14)] ring-2 ring-[#2563eb]/30"
                              : "border-black/[0.08] bg-white hover:border-black/20 hover:bg-[#fafaf9]"
                          }`}
                        >
                          {/* Real X Thumbnail Preview */}
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-[8px] border border-black/10 bg-[#18181b]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumbUrl}
                              alt={refItem.name}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute bottom-0.5 right-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black/75 text-[8px] text-white">
                              𝕏
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={avatarUrl}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="h-3.5 w-3.5 shrink-0 rounded-full object-cover"
                              />
                              <span className="truncate font-mono text-[10.5px] text-[#52525b]">
                                @{refItem.creator.xHandle}
                              </span>
                            </div>
                            <div className="mt-0.5 truncate font-mono text-[11.5px] font-semibold text-[#18181b]">
                              {refItem.name}
                            </div>
                            <div className="truncate font-mono text-[10px] text-[#2563eb]">
                              + cmk:{refItem.pairsWithCmk[0]}
                            </div>
                          </div>

                          {/* Animated pointer badge on the currently active card */}
                          {isSelected && (
                            <motion.div
                              layoutId="mcp-active-cursor-pointer"
                              transition={{
                                type: "spring",
                                stiffness: 280,
                                damping: 24,
                              }}
                              className="pointer-events-none absolute -bottom-2.5 -right-1.5 z-20 flex items-center gap-1 rounded-full bg-[#18181b] px-2 py-0.5 font-mono text-[9.5px] font-medium text-white shadow-md"
                            >
                              <span>Active</span>
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Connected Live Inspector Card — Directly reflects the selected skill! */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${scene.id}-${activeStep.refId}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 overflow-hidden rounded-[18px] border border-black/[0.08] bg-[#141418] text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
                  >
                    {/* Top bar of the Inspector Card */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles size={13} className="text-[#c3e88d]" />
                        <code className="font-mono text-[11.5px] text-[#c3e88d]">
                          {activeStep.mcpCall}
                        </code>
                      </div>
                      <a
                        href={activeXLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-white/70 hover:text-white"
                      >
                        <span>@{activeRef.creator.xHandle} on X</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>

                    {/* Body of the Inspector Card: X Thumbnail + Extracted SKILL.md Rules + Install Command */}
                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[180px_1fr]">
                      {/* Left: Real X Thumbnail & Creator Badge */}
                      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0e]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeThumbUrl}
                          alt={activeRef.title}
                          referrerPolicy="no-referrer"
                          className="aspect-[16/10] h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 via-black/60 to-transparent px-2.5 py-1.5">
                          <span className="inline-flex items-center gap-1.5 truncate font-mono text-[10.5px] text-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={activeAvatarUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="h-4 w-4 rounded-full object-cover"
                            />
                            <span>@{activeRef.creator.xHandle}</span>
                          </span>
                          <span className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[9.5px] text-white">
                            {activeRef.collectionId}
                          </span>
                        </div>
                      </div>

                      {/* Right: What MCP Pulled & How It Pairs with CMK */}
                      <div className="flex flex-col justify-between gap-2.5">
                        <div>
                          <div className="text-[13.5px] font-semibold text-white">
                            {activeStep.extractedRuleTitle}
                          </div>
                          <p className="mt-1 text-[12.5px] leading-[18.5px] text-[#b4b4bc]">
                            {activeStep.extractedRuleDetail}
                          </p>
                          <p className="mt-1.5 font-mono text-[11.5px] text-[#82AAFF]">
                            {activeStep.whyItMatters}
                          </p>
                        </div>

                        {/* Install command + paired CMK badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-2.5">
                          {activeRef.installCommand && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyInstall(activeRef.installCommand!)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-2.5 py-1 font-mono text-[11px] text-[#c3e88d] transition-colors hover:bg-white/[0.12]"
                            >
                              <span>$ {activeRef.installCommand}</span>
                              {copiedCmd ? (
                                <Check size={11} />
                              ) : (
                                <Copy size={11} className="text-white/60" />
                              )}
                            </button>
                          )}

                          <div className="flex flex-wrap items-center gap-1">
                            {activeRef.pairsWithCmk.map((cmk) => (
                              <span
                                key={cmk}
                                className="rounded-full bg-white/[0.08] px-2 py-0.5 font-mono text-[10.5px] text-white/85"
                              >
                                cmk:{cmk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Live MCP Session & Pulled Collection Manifest */}
            <div className="hidden flex-col justify-between gap-3 text-[12px] lg:flex">
              <div className="space-y-2.5">
                <div className="rounded-2xl border border-black/[0.07] bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="mb-2 flex items-center justify-between font-medium text-[#18181b]">
                    <span>MCP Server Status</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#15803d]">
                      ● Connected
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[#52525b]">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <Laptop size={12} className="text-[#71717a]" />
                        <span>Server</span>
                      </span>
                      <code className="font-mono text-[11px] text-[#18181b]">
                        ai-devkit-collections
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <Folder size={12} className="text-[#71717a]" />
                        <span>Folder</span>
                      </span>
                      <code className="font-mono text-[11px] text-[#2563eb]">
                        {scene.collectionId}/
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <Radio size={12} className="text-[#71717a]" />
                        <span>Auto-Pair CMK</span>
                      </span>
                      <span className="inline-flex h-4 w-7 items-center rounded-full bg-[#2563eb] p-0.5">
                        <span className="ml-auto h-3 w-3 rounded-full bg-white shadow-sm" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pulled Skills Queue inside Right Sidebar (also clickable!) */}
                <div className="rounded-2xl border border-black/[0.07] bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#18181b]">
                      Pulled from Collection
                    </span>
                    <span className="font-mono text-[10.5px] text-[#71717a]">
                      {scene.skills.length} skills
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {scene.skills.map((stepItem, idx) => {
                      const r = getRefById(stepItem.refId);
                      const active = idx === selectedSkillIdx;
                      return (
                        <button
                          key={stepItem.refId}
                          type="button"
                          onClick={() => handleSelectSkill(idx)}
                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left font-mono text-[11px] transition-colors ${
                            active
                              ? "bg-[#eff6ff] font-semibold text-[#2563eb]"
                              : "text-[#52525b] hover:bg-black/[0.04]"
                          }`}
                        >
                          <span className="truncate">
                            {active ? "▸ " : "  "}
                            {r.name}
                          </span>
                          <span className="text-[10px] opacity-75">
                            @{r.creator.xHandle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-black/[0.07] bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <span className="font-medium text-[#18181b]">
                  Context Loaded ›
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-[11.5px] text-[#2563eb]">
                  {activeStep.contextAddedPct}
                  <span className="inline-flex h-1.5 w-8 overflow-hidden rounded-full bg-black/[0.08]">
                    <span
                      className="rounded-full bg-[#2563eb] transition-all duration-300"
                      style={{ width: activeStep.contextAddedPct }}
                    />
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Scene Switcher & Playback Controls */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] bg-[#fafaf9] px-4 py-2.5 sm:px-6">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Pause walkthrough" : "Play walkthrough"}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#18181b] text-white transition-transform active:scale-95"
              >
                {isPlaying ? <Pause size={11} /> : <Play size={11} />}
              </button>
              <div className="flex flex-wrap items-center gap-1 pl-1">
                {DEMO_SCENES.map((item, idx) => {
                  const active = idx === sceneIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectScene(idx)}
                      className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                        active
                          ? "bg-[#18181b] text-white shadow-sm"
                          : "text-[#52525b] hover:bg-black/[0.05] hover:text-[#18181b]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <span className="font-mono text-[11px] text-[#71717a]">
              {isPlaying
                ? `Auto-stepping skill ${selectedSkillIdx + 1}/3 · Scene ${sceneIndex + 1}/3`
                : `Interactive · Inspecting ${activeRef.name}`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
