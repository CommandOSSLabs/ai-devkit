import type { Metadata } from "next";
import { PromptInputDemo } from "@/components/agents/prompt-input-demo";
import { getSkillExamples } from "@/lib/skill-examples";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Prompt Inputs · AI DevKit Skills",
  description: "An auto-growing agent composer with prompt actions, model selection, keyboard submission, and animated send and stop states.",
};

export default function PromptInputsPage() {
  const skillExamples = getSkillExamples();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Prompt Inputs</h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            An auto-growing agent composer with prompt actions, model selection, keyboard submission, and animated send and stop states.
          </p>
        </div>
        <span className="flex h-9 items-center rounded-lg bg-[#82AAFF]/10 px-3 text-[12.5px] font-medium text-[#82AAFF]">
          Interactive demo
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-6 sm:px-8">
        <PromptInputDemo skillExamples={skillExamples} />
      </div>
    </div>
  );
}
