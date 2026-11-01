"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
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

interface CmkSceneSkillStep {
  cmkSlug: string;
  cmkName: string;
  cmkPhaseBadge: string;
  cmkRoleTitle: string;
  cmkSkillPath: string;
  cmkDeliverable: string;
  cmkCoreRule: string;
  cmkInstallCmd: string;
  companionRefId: string;
  companionBoostNote: string;
  mcpCall: string;
  contextAddedPct: string;
}

interface DemoScene {
  id: string;
  stepNumber: string;
  label: string;
  domainBadge: string;
  windowTitle: string;
  envName: string;
  userPrompt: string;
  toolCall: string;
  duration: string;
  skills: CmkSceneSkillStep[];
}

const DEMO_SCENES: DemoScene[] = [
  {
    id: "cmk-delivery",
    stepNumber: "01",
    label: "1. cmk:delivery-pipeline",
    domainBadge: "Core SDLC Pipeline (5 Phases)",
    windowTitle: "MCP · cmk:delivery-pipeline",
    envName: "ai-devkit · skills/delivery-*",
    userPrompt:
      "Run cmk:delivery-pipeline on ticket #42: intake context, grill edge cases, spec the plan, and review the diff before shipping",
    toolCall: 'ai-devkit.run_cmk_pipeline({ skill: "cmk:delivery-pipeline" })',
    duration: "1.2s",
    skills: [
      {
        cmkSlug: "delivery-intake",
        cmkName: "cmk:delivery-intake",
        cmkPhaseBadge: "Phase 1 · Intake",
        cmkRoleTitle: "Context & Tracker Reconciliation",
        cmkSkillPath: "skills/delivery-intake/SKILL.md",
        cmkDeliverable: "Tracker state + affected docs/code scope",
        cmkCoreRule:
          "Pulls ticket acceptance criteria, maps affected modules in docs/ai/, and verifies branch/worktree isolation before planning.",
        cmkInstallCmd:
          "npx skills add CommandOSSLabs/ai-devkit --skill delivery-intake",
        companionRefId: "understand-anything",
        companionBoostNote:
          "Optional Collection boost: pairs with @fleetingbits/Understand-Anything to build an interactive knowledge graph of unfamiliar modules.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:delivery-intake", with_companions: true })',
        contextAddedPct: "21%",
      },
      {
        cmkSlug: "delivery-spec-plan",
        cmkName: "cmk:delivery-spec-plan",
        cmkPhaseBadge: "Phase 2 · Spec & Plan",
        cmkRoleTitle: "Architecture Spec & Execution Plan",
        cmkSkillPath: "skills/delivery-spec-plan/SKILL.md",
        cmkDeliverable: "docs/design/<feature>.md + step-by-step plan",
        cmkCoreRule:
          "Checks upstream docs/requirements/ and docs/adr/, resolves open design trade-offs, and writes a verifiable implementation plan.",
        cmkInstallCmd:
          "npx skills add CommandOSSLabs/ai-devkit --skill delivery-spec-plan",
        companionRefId: "grill-me",
        companionBoostNote:
          "Optional Collection boost: pairs with @mattpocockuk/grill-me to relentlessly interrogate hidden assumptions before locking the spec.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:delivery-spec-plan", with_companions: true })',
        contextAddedPct: "29%",
      },
      {
        cmkSlug: "delivery-review",
        cmkName: "cmk:delivery-review",
        cmkPhaseBadge: "Phase 4 · Review Gate",
        cmkRoleTitle: "Pre-Ship Code & Acceptance Audit",
        cmkSkillPath: "skills/delivery-review/SKILL.md",
        cmkDeliverable: "Verified diff + acceptance checklist pass",
        cmkCoreRule:
          "Audits the local diff against docs/rules/, acceptance criteria, type-check/test gates, and security boundaries before cmk:delivery-ship.",
        cmkInstallCmd:
          "npx skills add CommandOSSLabs/ai-devkit --skill delivery-review",
        companionRefId: "plannotator",
        companionBoostNote:
          "Optional Collection boost: pairs with @backnotprop/plannotator for local PR-style visual diff & plan annotation.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:delivery-review", with_companions: true })',
        contextAddedPct: "36%",
      },
    ],
  },
  {
    id: "cmk-architecture",
    stepNumber: "02",
    label: "2. cmk:design & codebase-docs",
    domainBadge: "Living Architecture & AI Docs",
    windowTitle: "MCP · cmk:design + cmk:codebase-docs",
    envName: "ai-devkit · docs/",
    userPrompt:
      "Use cmk:design, cmk:codebase-docs, and cmk:adr to update our system design and progressive-disclosure AI docs",
    toolCall:
      'ai-devkit.get_cmk_skill({ skill: ["cmk:design", "cmk:codebase-docs", "cmk:adr"] })',
    duration: "1.4s",
    skills: [
      {
        cmkSlug: "design",
        cmkName: "cmk:design",
        cmkPhaseBadge: "Core · Design Spec",
        cmkRoleTitle: "Distilled System & Feature Design",
        cmkSkillPath: "skills/design/SKILL.md",
        cmkDeliverable: "docs/design/ living specifications",
        cmkCoreRule:
          "Authors concise, non-duplicative design specs under docs/design/ reconciled against product requirements and recorded ADRs.",
        cmkInstallCmd: "npx skills add CommandOSSLabs/ai-devkit --skill design",
        companionRefId: "impeccable",
        companionBoostNote:
          "Optional Collection boost: pairs with @pbakaus/impeccable (/polish, /audit, /typeset) for frontend UI & anti-slop craft.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:design", with_companions: true })',
        contextAddedPct: "25%",
      },
      {
        cmkSlug: "codebase-docs",
        cmkName: "cmk:codebase-docs",
        cmkPhaseBadge: "Core · AI Map",
        cmkRoleTitle: "Hierarchical AI Navigation Docs",
        cmkSkillPath: "skills/codebase-docs/SKILL.md",
        cmkDeliverable: "docs/ai/ progressive-disclosure tree",
        cmkCoreRule:
          "Generates concise docs/ai/ maps that point agents directly to source files and module boundaries without duplicating code.",
        cmkInstallCmd:
          "npx skills add CommandOSSLabs/ai-devkit --skill codebase-docs",
        companionRefId: "anatomy",
        companionBoostNote:
          "Optional Collection boost: pairs with @wheresryan22/anatomy to render interactive isometric SVG machines for complex subsystems.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:codebase-docs", with_companions: true })',
        contextAddedPct: "32%",
      },
      {
        cmkSlug: "adr",
        cmkName: "cmk:adr",
        cmkPhaseBadge: "Core · Decisions",
        cmkRoleTitle: "Architecture Decision Records",
        cmkSkillPath: "skills/adr/SKILL.md",
        cmkDeliverable: "docs/adr/ADR-XXXX-*.md",
        cmkCoreRule:
          "Records durable technical decisions, rejected alternatives, and trade-offs under docs/adr/ so agents never relitigate settled architecture.",
        cmkInstallCmd: "npx skills add CommandOSSLabs/ai-devkit --skill adr",
        companionRefId: "visual-explainer",
        companionBoostNote:
          "Optional Collection boost: pairs with @nicobailon/visual-explainer to generate self-contained HTML comparison decks for ADR trade-offs.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:adr", with_companions: true })',
        contextAddedPct: "38%",
      },
    ],
  },
  {
    id: "cmk-repo-setup",
    stepNumber: "03",
    label: "3. cmk:repo-setup & mcp-config",
    domainBadge: "Multi-Vendor Repo Bootstrap",
    windowTitle: "MCP · cmk:repo-setup + cmk:mcp-config",
    envName: "ai-devkit · .agents/skills",
    userPrompt:
      "Bootstrap this repo with cmk:repo-setup: configure .mcp.json, wire .agents/skills for Claude/Codex/Cursor, and codify engineering rules",
    toolCall: 'ai-devkit.get_cmk_skill({ skill: "cmk:repo-setup" })',
    duration: "1.5s",
    skills: [
      {
        cmkSlug: "mcp-config",
        cmkName: "cmk:mcp-config",
        cmkPhaseBadge: "Core · MCP Wiring",
        cmkRoleTitle: "Checked-In Multi-Vendor MCP Config",
        cmkSkillPath: "skills/mcp-config/SKILL.md",
        cmkDeliverable: ".mcp.json + .codex/config.toml",
        cmkCoreRule:
          "Establishes deterministic, secret-free MCP server configs across Claude Code, Codex, and Cursor with clean environment variable binding.",
        cmkInstallCmd:
          "npx skills add CommandOSSLabs/ai-devkit --skill mcp-config",
        companionRefId: "shadcn-skill",
        companionBoostNote:
          "Optional Collection boost: pairs with @shadcn/ui registry skill for zero-conflict component & token installation.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:mcp-config", with_companions: true })',
        contextAddedPct: "24%",
      },
      {
        cmkSlug: "agent-vendors",
        cmkName: "cmk:agent-vendors",
        cmkPhaseBadge: "Core · Vendor Sync",
        cmkRoleTitle: "One Canonical Skill Set Across Agents",
        cmkSkillPath: "skills/agent-vendors/SKILL.md",
        cmkDeliverable: ".agents/skills/ + vendor adapters",
        cmkCoreRule:
          "Vendors all 23 cmk:* skills and selected companion skills into one canonical .agents/skills/ directory discoverable by every coding agent.",
        cmkInstallCmd:
          "npx skills add CommandOSSLabs/ai-devkit --skill agent-vendors",
        companionRefId: "emilkowalski-skills",
        companionBoostNote:
          "Optional Collection boost: syncs @emilkowalski_/skills alongside cmk:* so every agent shares the same motion & UI standards.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:agent-vendors", with_companions: true })',
        contextAddedPct: "33%",
      },
      {
        cmkSlug: "rule",
        cmkName: "cmk:rule",
        cmkPhaseBadge: "Core · Guardrails",
        cmkRoleTitle: "Enforceable Engineering Standards",
        cmkSkillPath: "skills/rule/SKILL.md",
        cmkDeliverable: "docs/rules/*.md + thin AGENTS.md",
        cmkCoreRule:
          "Promotes engineering conventions and security invariants into on-demand rules under docs/rules/ referenced from a thin root AGENTS.md.",
        cmkInstallCmd: "npx skills add CommandOSSLabs/ai-devkit --skill rule",
        companionRefId: "trailofbits-skills",
        companionBoostNote:
          "Optional Collection boost: pairs with @trailofbits/skills for differential security audit rules and invariant checks.",
        mcpCall:
          'ai-devkit.get_cmk_skill({ skill: "cmk:rule", with_companions: true })',
        contextAddedPct: "41%",
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

  // Auto-advance through each of the 3 primary cmk:* skills in the current scene,
  // then advance to the next scene.
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
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const scene = DEMO_SCENES[sceneIndex];
  const activeStep = scene.skills[selectedSkillIdx] ?? scene.skills[0];
  const companionRef = getRefById(activeStep.companionRefId);
  const companionThumbUrl = resolveRefThumbnail(companionRef);
  const companionAvatarUrl = resolveRefAvatar(companionRef);
  const companionXLink = resolveRefXLink(companionRef);

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
    <section
      id="how"
      aria-label="Interactive CMK Skills & Collections MCP Demo Stage"
      className="mb-20 scroll-mt-20"
    >
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
              <span className="inline-flex h-6 items-center rounded-md bg-[#18181b] px-2 font-mono text-[11px] font-semibold text-[#c3e88d]">
                CMK CORE · {scene.stepNumber}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleSelectScene((sceneIndex + 1) % DEMO_SCENES.length)
                }
                className="inline-flex items-center gap-1.5 font-mono text-[12.5px] font-semibold text-[#18181b] transition-colors hover:text-[#2563eb]"
              >
                <span>{scene.windowTitle}</span>
                <ChevronDown size={13} className="text-[#71717a]" />
              </button>
            </div>

            {/* Right macOS Agent Toolbar Icons */}
            <div className="flex items-center gap-1.5 text-[#71717a] sm:gap-2">
              <span className="hidden rounded-full bg-[#eff6ff] px-2.5 py-1 font-mono text-[11px] font-medium text-[#2563eb] sm:inline-flex">
                {scene.domainBadge}
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
          <div className="relative grid flex-1 grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_270px]">
            {/* Left/Center Agent Conversation + Connected CMK Skill Inspector */}
            <div className="flex w-full flex-col justify-between">
              <div>
                {/* 1. User Prompt Bubble */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
                    1. Operator Prompt (CMK-First Workflow)
                  </span>
                  <span className="font-mono text-[11px] font-medium text-[#18181b]">
                    23 Core <code className="text-[#2563eb]">cmk:*</code> Skills + Companion Collections
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

                {/* 2. Agent MCP Tool Call + 3 Selectable PRIMARY CMK Skill Cards */}
                <div className="mt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 text-[12.5px] text-[#52525b]">
                      <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
                        <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-[#2563eb]/40" />
                        <span className="relative h-2 w-2 rounded-full bg-[#2563eb]" />
                      </span>
                      <code className="rounded bg-black/[0.05] px-1.5 py-0.5 font-mono text-[11.5px] font-medium text-[#18181b]">
                        {scene.toolCall}
                      </code>
                      <span className="font-mono text-[11px] text-[#a1a1aa]">
                        {scene.duration}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-[#71717a]">
                      2. Select a <strong className="text-[#18181b]">cmk:*</strong> skill below ({selectedSkillIdx + 1}/3)
                    </span>
                  </div>

                  {/* 3 Selectable Primary CMK Skill Cards (with distinct CMK badges + distinct companion thumbnails) */}
                  <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {scene.skills.map((skillStep, idx) => {
                      const comp = getRefById(skillStep.companionRefId);
                      const compAvatar = resolveRefAvatar(comp);
                      const isSelected = idx === selectedSkillIdx;

                      return (
                        <button
                          key={skillStep.cmkSlug}
                          type="button"
                          onClick={() => handleSelectSkill(idx)}
                          onMouseEnter={() => handleSelectSkill(idx)}
                          className={`group/card relative flex flex-col justify-between rounded-[14px] border p-3 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#2563eb] bg-[#eff6ff] shadow-[0_8px_20px_rgba(37,99,235,0.15)] ring-2 ring-[#2563eb]/30"
                              : "border-black/[0.08] bg-white hover:border-black/20 hover:bg-[#fafaf9]"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold ${
                                  isSelected
                                    ? "bg-[#2563eb] text-white"
                                    : "bg-[#18181b] text-[#c3e88d]"
                                }`}
                              >
                                <Terminal size={10} />
                                <span>{skillStep.cmkPhaseBadge}</span>
                              </span>
                              <span className="font-mono text-[9.5px] text-[#71717a]">
                                Primary
                              </span>
                            </div>

                            <div className="mt-2 font-mono text-[13px] font-bold tracking-tight text-[#18181b]">
                              {skillStep.cmkName}
                            </div>
                            <div className="mt-0.5 truncate text-[11.5px] font-medium text-[#52525b]">
                              {skillStep.cmkRoleTitle}
                            </div>
                          </div>

                          {/* Paired Collection Companion Strip at bottom of card */}
                          <div className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-black/[0.06] pt-2">
                            <span className="inline-flex min-w-0 items-center gap-1.5 truncate font-mono text-[10px] text-[#52525b]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={compAvatar}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="h-3.5 w-3.5 shrink-0 rounded-full object-cover"
                              />
                              <span className="truncate">
                                + {comp.name}
                              </span>
                            </span>
                            <span className="shrink-0 font-mono text-[9.5px] text-[#71717a]">
                              @{comp.creator.xHandle}
                            </span>
                          </div>

                          {/* Active pointer pill */}
                          {isSelected && (
                            <motion.div
                              layoutId="mcp-active-cursor-pointer"
                              transition={{
                                type: "spring",
                                stiffness: 280,
                                damping: 24,
                              }}
                              className="pointer-events-none absolute -bottom-2.5 right-2 z-20 flex items-center gap-1 rounded-full bg-[#18181b] px-2 py-0.5 font-mono text-[9.5px] font-medium text-[#c3e88d] shadow-md"
                            >
                              <span>Active CMK</span>
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Connected Live CMK + Companion Inspector Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${scene.id}-${activeStep.cmkSlug}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 overflow-hidden rounded-[18px] border border-black/[0.08] bg-[#141418] text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
                  >
                    {/* Top bar: MCP Call + Direct Link to CMK Skill Page */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles size={13} className="text-[#c3e88d]" />
                        <code className="font-mono text-[11.5px] text-[#c3e88d]">
                          {activeStep.mcpCall}
                        </code>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/skills/${activeStep.cmkSlug}`}
                          className="inline-flex items-center gap-1 rounded-full bg-[#c3e88d]/15 px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#c3e88d] hover:bg-[#c3e88d]/25"
                        >
                          <span>Open {activeStep.cmkName}</span>
                          <ArrowUpRight size={11} />
                        </Link>
                      </div>
                    </div>

                    {/* Body: Left = CMK Skill Spec + Companion X Card; Right = CMK Rules + Companion Boost */}
                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[215px_1fr]">
                      {/* Left Visual Column: Primary CMK Spec Card + Companion X Thumbnail */}
                      <div className="flex flex-col justify-between gap-2.5 rounded-xl border border-white/10 bg-[#0b0b0e] p-3">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="rounded bg-[#c3e88d]/15 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-[#c3e88d]">
                              PRIMARY CMK SKILL
                            </span>
                            <span className="font-mono text-[9.5px] text-white/50">
                              {activeStep.cmkPhaseBadge}
                            </span>
                          </div>
                          <div className="mt-1.5 font-mono text-[14px] font-bold text-white">
                            {activeStep.cmkName}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-white/55">
                            {activeStep.cmkSkillPath}
                          </div>
                          <div className="mt-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 py-1.5 font-mono text-[10px] text-[#82AAFF]">
                            Out: {activeStep.cmkDeliverable}
                          </div>
                        </div>

                        {/* Companion X Thumbnail Preview strip */}
                        <div className="overflow-hidden rounded-lg border border-white/10 bg-black/60">
                          <div className="relative h-16 w-full overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={companionThumbUrl}
                              alt={companionRef.title}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            <a
                              href={companionXLink}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-x-2 bottom-1.5 flex items-center justify-between font-mono text-[10px] text-white hover:underline"
                            >
                              <span className="inline-flex items-center gap-1 truncate">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={companionAvatarUrl}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="h-3.5 w-3.5 rounded-full object-cover"
                                />
                                <span className="truncate">
                                  + {companionRef.name}
                                </span>
                              </span>
                              <ExternalLink size={10} className="shrink-0 opacity-80" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Right Content Column: Primary CMK Engineering Rule + Optional Collection Boost */}
                      <div className="flex flex-col justify-between gap-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-white">
                              {activeStep.cmkName} — {activeStep.cmkRoleTitle}
                            </span>
                          </div>

                          <p className="mt-1.5 text-[12.5px] leading-[19px] text-[#d4d4d8]">
                            {activeStep.cmkCoreRule}
                          </p>

                          <div className="mt-2.5 rounded-xl border border-[#82AAFF]/20 bg-[#82AAFF]/[0.07] px-3 py-2 text-[11.5px] leading-[17.5px] text-[#bfd6ff]">
                            {activeStep.companionBoostNote}
                          </div>
                        </div>

                        {/* Install command + Companion install */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyInstall(activeStep.cmkInstallCmd)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-2.5 py-1 font-mono text-[11px] text-[#c3e88d] transition-colors hover:bg-white/[0.14]"
                          >
                            <span>$ {activeStep.cmkInstallCmd}</span>
                            {copiedCmd ? (
                              <Check size={11} />
                            ) : (
                              <Copy size={11} className="text-white/60" />
                            )}
                          </button>

                          <span className="font-mono text-[10.5px] text-white/60">
                            Companion: @{companionRef.creator.xHandle} ({companionRef.collectionId})
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: CMK Priority Hierarchy & Active Stack */}
            <div className="hidden flex-col justify-between gap-3 text-[12px] lg:flex">
              <div className="space-y-2.5">
                <div className="rounded-2xl border border-black/[0.07] bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="mb-2 flex items-center justify-between font-medium text-[#18181b]">
                    <span>MCP Skill Priority</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#15803d]">
                      ● CMK-First
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[#52525b]">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <Laptop size={12} className="text-[#71717a]" />
                        <span>1. Core Engine</span>
                      </span>
                      <code className="font-mono text-[11px] font-semibold text-[#18181b]">
                        23 cmk:* skills
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <Folder size={12} className="text-[#71717a]" />
                        <span>2. Companions</span>
                      </span>
                      <code className="font-mono text-[11px] text-[#2563eb]">
                        6 X Collections
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <Radio size={12} className="text-[#71717a]" />
                        <span>Auto-Pair</span>
                      </span>
                      <span className="inline-flex h-4 w-7 items-center rounded-full bg-[#2563eb] p-0.5">
                        <span className="ml-auto h-3 w-3 rounded-full bg-white shadow-sm" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active CMK Pipeline Stack in Right Sidebar (clickable) */}
                <div className="rounded-2xl border border-black/[0.07] bg-white p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#18181b]">
                      Active CMK Stack
                    </span>
                    <span className="font-mono text-[10.5px] text-[#71717a]">
                      3 core skills
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {scene.skills.map((stepItem, idx) => {
                      const comp = getRefById(stepItem.companionRefId);
                      const active = idx === selectedSkillIdx;
                      return (
                        <button
                          key={stepItem.cmkSlug}
                          type="button"
                          onClick={() => handleSelectSkill(idx)}
                          className={`flex w-full flex-col rounded-xl px-2.5 py-1.5 text-left font-mono transition-colors ${
                            active
                              ? "bg-[#eff6ff] text-[#2563eb]"
                              : "text-[#52525b] hover:bg-black/[0.04]"
                          }`}
                        >
                          <div className="flex w-full items-center justify-between text-[11px] font-semibold">
                            <span className="truncate">
                              {active ? "▸ " : "  "}
                              {stepItem.cmkName}
                            </span>
                          </div>
                          <div className="pl-3 text-[9.5px] opacity-75">
                            + {comp.name} (@{comp.creator.xHandle})
                          </div>
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
                      className={`rounded-full px-3 py-1 font-mono text-[11.5px] font-medium transition-colors ${
                        active
                          ? "bg-[#18181b] text-[#c3e88d] shadow-sm"
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
                ? `Auto-stepping ${activeStep.cmkName} (${selectedSkillIdx + 1}/3)`
                : `Interactive · Inspecting ${activeStep.cmkName}`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
