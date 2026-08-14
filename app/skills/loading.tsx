import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";
import { TextMorph } from "@/components/motion/text-morph";

// Next's App Router renders this automatically while the /skills route
// segment is being fetched/prepared for a client-side navigation — no
// manual state wiring needed. Same header as the real page (logo + back
// link) so the transition reads as one continuous screen, not a flash of
// something unrelated, before SkillTreeBrowser's actual content replaces
// this.
export default function SkillsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-subtle)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)]">
              <Terminal size={14} className="text-[#82AAFF]" />
            </div>
            <span className="whitespace-nowrap font-mono text-[14px] font-semibold">ai-devkit</span>
          </span>
          <Link
            href="/catalog"
            className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            <span>Back to catalog</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <TextMorph
          words={["READING", "REPOSITORY", "SKILLS"]}
          interval={900}
          morphDuration={520}
          className="font-mono text-[clamp(22px,4vw,32px)] font-semibold tracking-[-0.02em] text-[var(--text-secondary)]"
        />
      </main>
    </div>
  );
}
