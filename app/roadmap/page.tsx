import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, ArrowLeft, Github } from "lucide-react";
import { ArcadeBackground } from "@/components/marketing/arcade/ArcadeBackground";
import { RoadmapBoard } from "@/components/marketing/roadmap/RoadmapBoard";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Roadmap · AI DevKit Skills",
  description: "What's in progress on AI DevKit Skills, and what's already shipped.",
};

const ACCENT = "#82AAFF";
const REPO = "https://github.com/CommandOSSLabs/ai-devkit";

// Same corner-mark decoration as the changelog page's "Back to site" link —
// reused directly, not re-derived, so the two pages read as one site.
function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      className={`pointer-events-none absolute text-[var(--border-strong)] opacity-40 transition-opacity duration-300 group-hover:opacity-100 ${className ?? ""}`}
    >
      <path d="M1 8 V1 H8" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="1" cy="1" r="1.2" fill="currentColor" className="animate-pulse" />
    </svg>
  );
}

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Same ambient background as /changelog, no splash — the reveal
          moment belongs to the changelog; landing here should feel calm. */}
      <ArcadeBackground className="fixed inset-0 z-0" word="" opacity={0.4} />

      <div className="relative z-10">
        <header className="border-b border-[var(--border-subtle)] px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)]">
                <Terminal size={14} style={{ color: ACCENT }} />
              </div>
              <span className="whitespace-nowrap font-mono text-[14px] font-semibold">ai-devkit</span>
            </Link>
            <Link
              href="/"
              className="group relative inline-flex items-center gap-1.5 px-2 py-1 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <CornerMark className="left-0 top-0" />
              <CornerMark className="right-0 top-0 -scale-x-100" />
              <CornerMark className="bottom-0 left-0 -scale-y-100" />
              <CornerMark className="bottom-0 right-0 -scale-100" />
              <ArrowLeft size={14} />
              <span>Back to site</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-14">
            <span className="font-mono text-[13px] uppercase tracking-wider text-[var(--text-secondary)]">
              Roadmap
            </span>
            <h1 className="mt-3 text-[clamp(28px,4vw,40px)] font-medium tracking-tight text-[var(--text-primary)]">
              What&apos;s In Progress
            </h1>
            <p className="mt-2 max-w-md text-[15px] text-[var(--text-secondary)]">
              What&apos;s being worked on right now, and what&apos;s already shipped. Next and Later are open —
              there&apos;s no fixed plan for them yet.
            </p>
            <p className="mt-3 text-[13px] text-[var(--text-secondary)]">
              Want something prioritized?{" "}
              <Link
                href={`${REPO}/issues`}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current"
                style={{ color: ACCENT }}
              >
                Open an issue on GitHub
              </Link>
              .
            </p>
            <Link
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-fit items-center gap-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Github size={14} />
              View the repo on GitHub
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <RoadmapBoard />
        </main>
      </div>
    </div>
  );
}
