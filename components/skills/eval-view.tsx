"use client";

import { CheckCircle2, Hash, Sparkles } from "lucide-react";

// eval.json is a fixed shape across all six skills that ship one: a list of
// scenarios, each a prompt plus the assertions its output has to satisfy.
// Rendered as raw JSON it reads as a wall of escaped strings, so this shows
// it as what it actually is — a spec you can read down.

export type EvalCase = {
  eval_id?: number;
  eval_name?: string;
  prompt?: string;
  assertions?: string[];
  kind?: string;
  derived_from?: string;
};

/** Returns the cases when `text` is a recognisable eval file, else null. */
export function parseEvals(text: string): EvalCase[] | null {
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data) || data.length === 0) return null;
    const looksRight = data.every(
      (d) => d && typeof d === "object" && ("eval_name" in d || "assertions" in d),
    );
    return looksRight ? (data as EvalCase[]) : null;
  } catch {
    return null;
  }
}

export function EvalView({ cases }: { cases: EvalCase[] }) {
  const totalAssertions = cases.reduce((n, c) => n + (c.assertions?.length ?? 0), 0);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-10">
      <div className="mx-auto flex max-w-[760px] flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-[var(--text-tertiary)]">
          <span className="rounded-full bg-[var(--glass-elevated)] px-2.5 py-1">
            {cases.length} {cases.length === 1 ? "scenario" : "scenarios"}
          </span>
          <span className="rounded-full bg-[var(--glass-elevated)] px-2.5 py-1">
            {totalAssertions} assertions
          </span>
        </div>

        {cases.map((c, i) => (
          <section
            key={c.eval_id ?? i}
            className="flex flex-col gap-3 rounded-[14px] border border-[var(--glass-line)] bg-[var(--glass-elevated)] p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#82AAFF]/10 px-2 py-0.5 font-mono text-[11.5px] text-[color:var(--accent)]">
                <Hash size={10} strokeWidth={2} />
                {c.eval_id ?? i + 1}
              </span>
              <h3 className="font-mono text-[14px] font-semibold text-[var(--text-primary)]">
                {c.eval_name ?? "untitled"}
              </h3>
              {c.kind && (
                <span className="rounded-full border border-[var(--glass-line)] px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  {c.kind}
                </span>
              )}
            </div>

            {c.derived_from && (
              <p className="text-[11.5px] text-[var(--text-tertiary)]">
                derived from <span className="font-mono text-[var(--text-secondary)]">{c.derived_from}</span>
              </p>
            )}

            {c.prompt && (
              <div className="flex gap-2.5 rounded-[10px] border-l-2 border-[#82AAFF]/40 bg-[var(--bg-surface)]/40 px-3.5 py-3">
                <Sparkles size={13} className="mt-0.5 shrink-0 text-[color:var(--accent)]/70" strokeWidth={1.75} />
                <p className="text-[13px] leading-6 text-[var(--text-secondary)]">{c.prompt}</p>
              </div>
            )}

            {c.assertions && c.assertions.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.07em] text-[var(--text-tertiary)]">
                  Must satisfy ({c.assertions.length})
                </p>
                <ul className="flex flex-col gap-2">
                  {c.assertions.map((a, j) => (
                    <li key={j} className="flex gap-2.5 text-[13px] leading-6 text-[var(--text-secondary)]">
                      <CheckCircle2
                        size={13}
                        strokeWidth={1.75}
                        className="mt-[5px] shrink-0 text-[var(--syntax-string)]"
                      />
                      <span className="[overflow-wrap:anywhere]">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default EvalView;
