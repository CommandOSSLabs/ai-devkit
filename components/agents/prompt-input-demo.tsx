"use client";

import Link from "next/link";
import { ArrowUpRight, Cpu, FileText, ImagePlus, Puzzle, Rocket, Sparkles, Wind, X, Zap } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { SkillExample } from "@/lib/skill-examples";
import { normalizeSkillId } from "@/lib/skill-id";
import { PromptInput, type PromptAction, type PromptModel } from "./prompt-input";

// Adapted from the component doc's usage example. That example fetches
// real provider favicons for each model icon via an external service —
// dropped here since it's a live network dependency unrelated to what this
// tab demonstrates, replaced with plain icons.
//
// The "Use a skill" action is the actual point of this tab: rather than a
// generic notice, it opens a picker built from skillExamples (read server-
// side straight off this repo's skills/*/SKILL.md frontmatter — see
// lib/skill-examples.ts) so picking a skill inserts the REAL trigger
// phrase its own description advertises, e.g. cmk-adr's "record this
// decision". That's the concrete example of "what prompt makes a model
// reach for this skill" — not invented copy.

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

const DEFAULT_VALUE = "Review the current implementation and suggest the next improvement.";

export function PromptInputDemo({ skillExamples }: { skillExamples: SkillExample[] }) {
  const reduce = useReducedMotion() ?? false;
  const timer = useRef<number | undefined>(undefined);
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [context, setContext] = useState<SkillExample | null>(null);

  // Arriving from a skill's page (…/prompt-inputs?skill=adr) should land you
  // in that skill's context with its own trigger phrase already typed, rather
  // than on a blank composer you have to re-find the skill in.
  useEffect(() => {
    const requested = normalizeSkillId(new URLSearchParams(window.location.search).get("skill"));
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

  const submit = (prompt: string) => {
    setSent(undefined);
    setNotice(undefined);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setSent(prompt);
      setValue("");
    }, 900);
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
    setNotice(`Inserted ${skill.label}'s own trigger phrase — this is what tells a model to reach for it.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
      {context && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#82AAFF]/30 bg-[#82AAFF]/[0.07] px-3 py-2 text-[12.5px]">
          <Puzzle size={13} strokeWidth={1.75} className="text-[#82AAFF]" aria-hidden="true" />
          <span className="text-[var(--text-secondary)]">Prompting in the context of</span>
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
              className="inline-flex h-6 items-center rounded-md border border-[var(--border-subtle)] px-2 text-[11.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              Change skill
            </button>
            <button
              type="button"
              onClick={() => setContext(null)}
              aria-label="Clear skill context"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
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
          setNotice(selected ? `${selected.label} selected.` : undefined);
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
            className="mt-3 max-h-72 overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--glass-elevated)] p-3 backdrop-blur-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                Real trigger phrases from skills/*/SKILL.md
              </p>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close"
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
              >
                <X size={12} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {skillExamples.map((skill) => (
                <div key={skill.id}>
                  <p className="mb-1 font-mono text-[11.5px] text-[#82AAFF]">{skill.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.examples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => pickExample(skill, example)}
                        className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-left text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[#82AAFF]/40 hover:text-[var(--text-primary)]"
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

      <p className="px-2 pt-2 text-[11.5px] text-[var(--text-disabled)]">
        Demo composer — nothing is sent to a model.
      </p>

      <div className="h-8 px-2 pt-1 text-[12.5px] text-[var(--text-tertiary)]">
        <AnimatePresence mode="wait">
          {sent || notice ? (
            <motion.p
              key={sent ?? notice}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
            >
              {sent ? "Prompt captured. No request left the browser." : notice}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PromptInputDemo;
