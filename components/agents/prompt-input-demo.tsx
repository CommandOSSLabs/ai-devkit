"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Cpu,
  FileText,
  ImagePlus,
  Puzzle,
  Rocket,
  Sparkles,
  Terminal,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SkillExample } from "@/lib/skill-examples";
import { normalizeSkillId } from "@/lib/skill-id";
import { PromptInput, type PromptAction, type PromptModel } from "./prompt-input";

const MODELS: PromptModel[] = [
  { value: "claude-sonnet-5", label: "Claude Sonnet 5", icon: <Sparkles size={14} /> },
  { value: "gpt-5.2", label: "GPT-5.2", icon: <Cpu size={14} /> },
  { value: "gemini-3.6-flash", label: "Gemini 3.6 Flash", icon: <Zap size={14} /> },
  { value: "grok-4.5", label: "Grok 4.5", icon: <Rocket size={14} /> },
  { value: "mistral-large-3", label: "Mistral Large 3", icon: <Wind size={14} /> },
];

const ACTIONS: PromptAction[] = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: <ImagePlus />,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Insert a real trigger phrase from this repo's skills.",
    icon: <Puzzle />,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: <FileText />,
  },
];

const DEFAULT_VALUE =
  "Configure MCP servers for Claude Code, Codex, and Cursor using cmk:mcp-config and pull our Design collection refs.";

export function PromptInputDemo({
  skillExamples,
}: {
  skillExamples: SkillExample[];
}) {
  const reduce = useReducedMotion() ?? false;
  const timer = useRef<number | undefined>(undefined);
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [context, setContext] = useState<SkillExample | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const featuredTriggers = useMemo(
    () =>
      skillExamples
        .filter((s) => s.examples.length > 0)
        .slice(0, 5)
        .map((skill) => ({
          skill,
          phrase: skill.examples[0],
        })),
    [skillExamples],
  );

  useEffect(() => {
    const requested = normalizeSkillId(
      new URLSearchParams(window.location.search).get("skill"),
    );
    if (!requested) return;
    const skill = skillExamples.find((s) => s.id === requested);
    if (!skill) return;
    setContext(skill);
    if (skill.examples[0]) setValue(skill.examples[0]);
  }, [skillExamples]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const matchedSkill = useMemo(() => {
    if (context) return context;
    const q = (sent ?? value).toLowerCase();
    return (
      skillExamples.find(
        (s) =>
          q.includes(s.id.toLowerCase()) ||
          q.includes(s.label.toLowerCase()) ||
          s.examples.some((ex) => q.includes(ex.toLowerCase())),
      ) ?? skillExamples[0]
    );
  }, [context, sent, value, skillExamples]);

  const submit = (prompt: string) => {
    setSent(undefined);
    setNotice(undefined);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setSent(prompt);
    }, 650);
  };

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setLoading(false);
  };

  const pickExample = (skill: SkillExample, example: string) => {
    setValue(example);
    setContext(skill);
    setPickerOpen(false);
    setSent(undefined);
    setNotice(
      `Inserted ${skill.label}'s trigger phrase — hit Enter or Send to simulate MCP dispatch.`,
    );
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1600);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
      {/* Quick-try skill trigger chips */}
      <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--md-text-tertiary)]">
          Try trigger:
        </span>
        {featuredTriggers.map(({ skill, phrase }) => {
          const isSelected = context?.id === skill.id;
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => pickExample(skill, phrase)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] transition-colors ${
                isSelected
                  ? "bg-white text-[#141413] font-medium"
                  : "bg-white/[0.06] text-[var(--md-text-secondary)] hover:bg-white/[0.12] hover:text-[var(--md-fg)]"
              }`}
            >
              <span className="font-mono text-[10.5px] opacity-75">
                {skill.label}
              </span>
              <span className="opacity-40">·</span>
              <span className="max-w-[160px] truncate">&ldquo;{phrase}&rdquo;</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full border border-white/[0.1] px-2.5 py-1 font-mono text-[11px] text-[var(--md-text-tertiary)] transition-colors hover:border-white/[0.2] hover:text-[var(--md-fg)]"
        >
          <Puzzle size={11} />
          <span>{pickerOpen ? "Hide all" : "All skills"}</span>
        </button>
      </div>

      {context && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#82AAFF]/30 bg-[#82AAFF]/[0.07] px-3 py-2 text-[12.5px]">
          <Puzzle
            size={13}
            strokeWidth={1.75}
            className="text-[#82AAFF]"
            aria-hidden="true"
          />
          <span className="text-[var(--md-text-secondary)]">
            Active skill context:
          </span>
          <Link
            href={`/skills/${context.id}`}
            className="inline-flex items-center gap-1 font-mono text-[#82AAFF] hover:underline"
          >
            {context.label}
            <ArrowUpRight size={11} strokeWidth={1.75} />
          </Link>
          <span className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex h-6 items-center rounded-md border border-white/[0.1] px-2 text-[11.5px] text-[var(--md-text-secondary)] transition-colors hover:border-white/[0.2] hover:text-white"
            >
              Change skill
            </button>
            <button
              type="button"
              onClick={() => setContext(null)}
              aria-label="Clear skill context"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--md-text-tertiary)] transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <X size={12} strokeWidth={2} />
            </button>
          </span>
        </div>
      )}

      <PromptInput
        value={value}
        onValueChange={setValue}
        models={MODELS}
        actions={ACTIONS}
        defaultModel="claude-sonnet-5"
        loading={loading}
        onSubmit={submit}
        onStop={stop}
        onAction={(action) => {
          if (action === "skill") {
            setPickerOpen((v) => !v);
            return;
          }
          const selected = ACTIONS.find((item) => item.value === action);
          setNotice(selected ? `${selected.label} ready.` : undefined);
          setSent(undefined);
        }}
      />

      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.15 }}
            className="mt-3 max-h-72 overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#141417] p-3.5 backdrop-blur-sm"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--md-text-tertiary)]">
                Real trigger phrases from skills/*/SKILL.md
              </p>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close"
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--md-text-tertiary)] transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <X size={12} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {skillExamples.map((skill) => (
                <div key={skill.id}>
                  <p className="mb-1 font-mono text-[11.5px] text-[#82AAFF]">
                    {skill.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.examples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => pickExample(skill, example)}
                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-left text-[12px] text-[var(--md-text-secondary)] transition-colors hover:border-[#82AAFF]/40 hover:text-white"
                      >
                        &ldquo;{example}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive MCP Dispatch Trace or Status Footer */}
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key={sent}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="mt-4 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 font-mono text-[11.5px] text-[#c3e88d]">
                <Terminal size={13} />
                <span>MCP Tool &amp; Skill Dispatch Simulated</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(sent)}
                  className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-2.5 py-1 font-mono text-[11px] text-white transition-colors hover:bg-white/[0.14]"
                >
                  {copiedPrompt ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedPrompt ? "Copied" : "Copy prompt"}</span>
                </button>
                {matchedSkill && (
                  <Link
                    href={`/skills/${matchedSkill.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-[#82AAFF]/15 px-2.5 py-1 font-mono text-[11px] text-[#82AAFF] hover:bg-[#82AAFF]/25"
                  >
                    <span>Open {matchedSkill.label}</span>
                    <ArrowUpRight size={11} />
                  </Link>
                )}
              </div>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--md-text-secondary)]">
              Matched skill{" "}
              <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[11.5px] text-white">
                {matchedSkill?.label ?? "cmk:mcp-config"}
              </code>{" "}
              + MCP tool{" "}
              <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[11.5px] text-white">
                search_refs
              </code>{" "}
              for <span className="text-white">&ldquo;{sent}&rdquo;</span>.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={notice ?? "idle"}
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[12px] text-[var(--md-text-tertiary)]"
          >
            <span>
              {notice ??
                "Select a skill trigger pill above or press Enter to preview how MCP routes your prompt."}
            </span>
            <span className="font-mono text-[11px] opacity-70">
              Local browser sandbox
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PromptInputDemo;
