import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Terminal, ArrowLeft } from "lucide-react";
import DotShift from "@/components/motion/dot-shift";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Changelog · AI DevKit Skills",
  description: "What's new on skills.commandoss.com — site launches, fixes, and features, in order.",
};

// Same accent as the landing page (--syntax-func), so the changelog reads
// as part of the same site rather than a visually disconnected page.
const ACCENT = "#82AAFF";

type ChangeType = "feature" | "fix" | "change";

const TYPE_STYLES: Record<ChangeType, { label: string; color: string; bg: string }> = {
  feature: { label: "Feature", color: "#C3E88D", bg: "rgba(195, 232, 141, 0.12)" },
  fix: { label: "Fix", color: "#F07178", bg: "rgba(240, 113, 120, 0.12)" },
  change: { label: "Change", color: ACCENT, bg: "rgba(130, 170, 255, 0.12)" },
};

type ChangelogItem = { type: ChangeType; text: string };

type ChangelogEntry = {
  date: string;
  title: string;
  items: ChangelogItem[];
};

// A standalone page, deliberately outside the landing page's section-scroll
// system (no shared Nav, no #id sections) — its own route, its own header.
// Timeline structure follows github.com/Saurabh-2607/GreatUI's changelog
// page: a big date heading per entry on a connecting vertical line, an
// icon marker on the newest entry, plain dots on the rest. Each entry sits
// in a card (matching the site's own card pattern) with typed badges per
// line instead of a flat bullet list — colors/icons are ai-devkit's own,
// not copied from that project's branding.
const ENTRIES: ChangelogEntry[] = [
  {
    date: "August 13, 2026",
    title: "skills.commandoss.com launched",
    items: [
      { type: "change", text: "Homepage is the skills page now — dropped the /skill in the URL." },
      { type: "feature", text: "Nav links go to real URLs, not #hash junk. Share a link straight to any section." },
      { type: "fix", text: "Text was hard to read over the background in some spots — fixed, light and dark." },
      { type: "fix", text: "Marquee divider flips colors properly in light mode now." },
      { type: "feature", text: "Install box got an npm/pnpm/yarn/bun switcher, with a little type-in animation." },
      { type: "fix", text: "Picking multiple skills copies an actual usable prompt now, not a broken command." },
    ],
  },
];

// Supports [label](url) inline, same as GreatUI's changelog — kept minimal
// since only internal/GitHub links are expected here.
function parseInlineLinks(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    const match = part.match(/\[(.*?)\]\((.*?)\)/);
    if (!match) return <Fragment key={i}>{part}</Fragment>;
    const isExternal = match[2].startsWith("http");
    return (
      <Link
        key={i}
        href={match[2]}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="font-medium underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current"
        style={{ color: ACCENT }}
      >
        {match[1]}
      </Link>
    );
  });
}

function TypeBadge({ type }: { type: ChangeType }) {
  const style = TYPE_STYLES[type];
  return (
    <span
      className="mt-0.5 inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide"
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      {style.label}
    </span>
  );
}

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Ambient full-page background (React Bits Pro Dot Shift shader) —
          fixed and behind everything, same role GlowingWave plays on the
          main landing page, so this page isn't a flat dark rectangle.
          Tinted to this page's own accent, not the landing page's blue. */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <DotShift color={ACCENT} speed={0.35} scale={0.55} size={0.55} blur={0.6} />
      </div>

      <div className="relative z-10">
        <header className="border-b border-[var(--border-subtle)] px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)]"
              >
                <Terminal size={14} style={{ color: ACCENT }} />
              </div>
              <span className="whitespace-nowrap font-mono text-[14px] font-semibold">ai-devkit</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={14} />
              <span>Back to site</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-14">
            <h1 className="mb-3 text-[clamp(32px,5vw,48px)] font-black tracking-tight text-[var(--text-primary)]">
              Changelog
            </h1>
            <p className="text-[18px] text-[var(--text-secondary)]">
              New updates and improvements to AI DevKit Skills.
            </p>
          </div>

          <div className="relative ml-3">
            {ENTRIES.map((entry, index) => (
              <div key={entry.date} className="group relative pb-12 pl-8 last:pb-0">
                {index !== ENTRIES.length - 1 && (
                  <div className="absolute bottom-[-8px] left-0 top-2 w-px -translate-x-1/2 bg-[var(--border-subtle)]" aria-hidden />
                )}

                {index === 0 ? (
                  <span
                    className="absolute left-0 top-1.5 flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-[var(--bg-base)] ring-4 ring-[var(--bg-base)]"
                  >
                    <Terminal size={10} style={{ color: ACCENT }} />
                  </span>
                ) : (
                  <span className="absolute left-0 top-2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--bg-base)] ring-4 ring-[var(--bg-base)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--text-disabled)]" />
                  </span>
                )}

                <div className="font-mono text-[13px] uppercase tracking-wide text-[var(--text-tertiary)]">
                  {entry.date}
                </div>
                <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[var(--text-primary)] sm:text-[26px]">
                  {entry.title}
                </h2>

                {/* Card matching the site's own frame pattern (rounded-[16px]
                    border + bg-surface), so an entry reads as a discrete
                    unit instead of text floating loose on the star field. */}
                <div className="mt-4 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                  <ul className="flex flex-col gap-3.5">
                    {entry.items.map((item) => (
                      <li key={item.text} className="flex items-start gap-3">
                        <TypeBadge type={item.type} />
                        <span className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                          {parseInlineLinks(item.text)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
