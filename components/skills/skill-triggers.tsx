"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// The trigger phrases are the shortest useful thing on the page: they are
// what you type to make an agent reach for this skill. So each one is
// copyable rather than decorative — the phrase is the deliverable.
export function SkillTriggers({ triggers }: { triggers: string[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (phrase: string) => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopied(phrase);
      setTimeout(() => setCopied((current) => (current === phrase ? null : current)), 1500);
    } catch {
      // clipboard blocked — the phrase is still readable on screen
    }
  };

  if (triggers.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {triggers.map((phrase) => {
        const on = copied === phrase;
        return (
          <li key={phrase}>
            <button
              type="button"
              onClick={() => copy(phrase)}
              title="Copy trigger phrase"
              className={`group inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-left text-[12.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                on
                  ? "border-[#82AAFF]/50 bg-[#82AAFF]/10 text-[color:var(--accent)]"
                  : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="truncate">&ldquo;{phrase}&rdquo;</span>
              {on ? (
                <Check size={11} strokeWidth={2} className="shrink-0" />
              ) : (
                <Copy size={11} strokeWidth={1.75} className="shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
              )}
              <span className="sr-only">{on ? "Copied" : "Copy this phrase"}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default SkillTriggers;
