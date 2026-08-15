"use client";

// The "here's how to actually get it" block for the launch entry — typical
// uses + a copyable install command, same shape as Superset's own changelog
// install callout. Commands come straight from this repo's own
// INSTALLATION.md (skills.sh + the Claude Code plugin trial), not copied
// from Superset's.

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const USES = [
  "Bootstrap /docs once, then capture requirements, design, and decisions as you build",
  "Hand a ticket straight to delivery — intake, spec, implement, review, ship, end to end",
  "Vendor and sync skills with upstream without losing your repo's own adaptations",
];

const INSTALL_CMD = "npx skills add CommandOSSLabs/ai-devkit";
const PLUGIN_CMD = "claude plugin add CommandOSSLabs/ai-devkit";

function CommandLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [cmd, ...args] = text.split(" ");

  const onCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3">
      <code className="font-mono text-[14px]">
        <span className="text-[var(--syntax-func)]">{cmd}</span>{" "}
        <span className="text-[var(--syntax-string)]">{args.join(" ")}</span>
      </code>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy command"
        className="shrink-0 rounded p-1 text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export function InstallBlock() {
  return (
    <div className="mt-5 space-y-4 text-[15px] text-[var(--text-secondary)]">
      <div>
        <p>Typical uses:</p>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 leading-relaxed marker:text-[var(--text-disabled)]">
          {USES.map((use) => (
            <li key={use}>{use}</li>
          ))}
        </ul>
      </div>

      <CommandLine text={INSTALL_CMD} />

      <p className="text-[14px]">
        Claude Code users can also try it zero-setup:{" "}
        <code className="rounded bg-[var(--bg-base)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--text-primary)]">
          {PLUGIN_CMD}
        </code>
        .
      </p>
    </div>
  );
}
