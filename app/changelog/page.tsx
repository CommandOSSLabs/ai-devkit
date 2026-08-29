import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Terminal, ArrowLeft, Github, ExternalLink } from "lucide-react";
import { ArcadeSplash } from "@/components/marketing/arcade/ArcadeSplash";
import { ArcadeBackground } from "@/components/marketing/arcade/ArcadeBackground";
import { InstallBlock } from "@/components/marketing/changelog/InstallBlock";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Changelog · AI DevKit Skills",
  description: "What's new on skills.commandoss.com — site launches, fixes, and features, in order.",
};

// Same accent as the landing page (--syntax-func), so the changelog reads
// as part of the same site rather than a visually disconnected page.
const ACCENT = "#82AAFF";

type ChangelogEntry = {
  date: string;
  /** Compact form for the sticky gutter marker, e.g. "Aug 14". */
  shortDate: string;
  title: string;
  items: string[];
  /** Extra rendered content after the bullet list — used once, on the launch entry. */
  extra?: React.ReactNode;
};

// A standalone page, deliberately outside the landing page's section-scroll
// system (no shared Nav, no #id sections) — its own route, its own header.
// Layout follows Superset's own changelog
// (github.com/superset-sh/superset/tree/main/apps/marketing/src/app/changelog):
// a sticky gutter date + accent tick per entry, plain flowing prose in the
// body instead of a bordered card with typed badges — no separate visual
// system on top of what the content already says.
const REPO = "https://github.com/CommandOSSLabs/ai-devkit";

const SITE = "https://skills.commandoss.com";

const ENTRIES: ChangelogEntry[] = [
  {
    date: "August 29, 2026",
    shortDate: "Aug 29",
    title: "A quieter skills catalog and an interactive relationship map",
    items: [
      "The **Skills catalog** is category-first and much more compact — a card carries the handle, the title and the phrase that triggers it, so choosing a workflow no longer means reading 34 descriptions.",
      "**Visualize interactions** is a pan-and-zoom canvas now. Move skills around, trace what each one references and what references it, and reset to the canonical layout whenever you want.",
      "Every relationship is still available as an accessible **List view**, which is also what smaller screens get by default.",
      "**Skill detail, the workspace, Preview, Source, Edit and browser-local drafts** are all still there — this changed how you find a skill, not what you can do with it.",
      `[$ gh pr view 24](${REPO}/pull/24)`,
    ],
  },
  {
    date: "August 14, 2026",
    shortDate: "Aug 14",
    title: "New: cmk:interpret, plus acceptance-criteria notation",
    items: [
      `New skill: **cmk:interpret**, for user-invoked interpret sessions. [$ git show 0d7b298](${REPO}/commit/0d7b298)`,
      `Requirements now need one clear **acceptance criterion** per rule, each with its own ID. [$ git show b12a3fd](${REPO}/commit/b12a3fd)`,
      `Design docs link back to those requirement IDs instead of repeating them. [$ git show b12a3fd](${REPO}/commit/b12a3fd)`,
      `**34 skills** are live on [skills.commandoss.com](${SITE}).`,
    ],
  },
  {
    date: "August 13, 2026",
    shortDate: "Aug 13",
    title: `[skills.commandoss.com](${SITE}) launched`,
    items: [
      "**Homepage** is the skills page now — dropped the /skill in the URL.",
      "Nav links go to real URLs. Share a link straight to any section.",
      "Text was hard to read over the background in some spots — fixed.",
      "Marquee divider colors fixed in light mode.",
      "**Install box** got an npm/pnpm/yarn/bun switcher.",
      `Copying multiple skills now gives a usable prompt. [$ gh pr view 9](${REPO}/pull/9)`,
    ],
    extra: <InstallBlock />,
  },
];

// Supports [label](url) and **bold** inline. A label starting with "$ " is a
// CLI reference (a commit/PR to look up) and renders as a small terminal-style
// chip, matching the install-command boxes elsewhere on this site — everything
// else with a link renders as a plain inline link.
function parseInline(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const href = linkMatch[2];
      const isExternal = href.startsWith("http");
      const linkProps = {
        href,
        target: isExternal ? "_blank" : undefined,
        rel: isExternal ? "noreferrer" : undefined,
      } as const;

      if (label.startsWith("$ ")) {
        return (
          <Link
            key={i}
            {...linkProps}
            className="ml-1 inline-flex items-center gap-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-1.5 py-0.5 align-middle font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <span className="select-none text-[var(--text-tertiary)]">$</span>
            {label.slice(2)}
          </Link>
        );
      }

      return (
        <Link
          key={i}
          {...linkProps}
          className="font-medium underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current"
          style={{ color: ACCENT }}
        >
          {label}
        </Link>
      );
    }
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={i} className="font-semibold text-[var(--text-primary)]">
          {boldMatch[1]}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// A small bracket + pulsing dot, mirrored into all four corners of a link —
// dims to a resting state and brightens on hover, like a UI element being
// targeted rather than just a plain text link.
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

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <ArcadeSplash />

      {/* Ambient full-page background — fixed and behind everything, same
          role GlowingWave plays on the main landing page. Same arcade-pixel
          engine as the intro splash, kept running instead of fading out —
          the reveal settles into the backdrop rather than handing off to
          something unrelated. No word here even at the dim watermark
          opacity it was hurting legibility where it crossed body text —
          ArcadeSplash still shows "changelog" during the intro, this is
          grain/moire texture only once that's done. */}
      <ArcadeBackground className="fixed inset-0 z-0" word="" opacity={0.4} />

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

        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20" style={{ zoom: 1.25 }}>
          {/* Header — Superset's own pattern: an eyebrow label, "What's New"
              as the actual heading, a description that links out to GitHub
              Releases inline, then a second explicit link below it. Plain
              text on the page background, no card — matches how Superset's
              own changelog header sits directly in the page. */}
          <div className="mb-14">
            <span className="font-mono text-[13px] uppercase tracking-wider text-[var(--text-secondary)]">
              Changelog
            </span>
            <h1 className="mt-3 text-[clamp(28px,4vw,40px)] font-medium tracking-tight text-[var(--text-primary)]">
              What&apos;s New
            </h1>
            <p className="mt-2 max-w-md text-[15px] text-[var(--text-secondary)]">
              The latest updates and improvements to AI DevKit Skills. For detailed release notes, see{" "}
              <Link
                href={`${REPO}/releases`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--text-primary)] underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current"
              >
                GitHub Releases
                <ExternalLink size={12} />
              </Link>
              .
            </p>
            <Link
              href={`${REPO}/releases`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-fit items-center gap-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Github size={14} />
              View releases on GitHub
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Timeline — sticky gutter date + accent tick to the left of the
              column on desktop (each date stays pinned while its entry
              scrolls past), collapsing to an inline date above the title
              on mobile where there's no gutter to put it in. */}
          <div className="relative">
            {ENTRIES.map((entry) => (
              <div
                key={entry.date}
                className="relative border-b border-[var(--border-subtle)] pb-12 last:border-b-0 lg:pb-16"
              >
                <div className="absolute top-0 hidden items-start lg:flex" style={{ right: "calc(100% + 24px)" }}>
                  <div className="sticky top-24 flex items-center gap-2.5 pt-1">
                    <span className="whitespace-nowrap font-mono text-[13px] text-[var(--text-tertiary)]">
                      {entry.shortDate}
                    </span>
                    <div className="h-[18px] w-0.5" style={{ backgroundColor: ACCENT }} />
                  </div>
                </div>

                <div className="mb-1 font-mono text-[13px] uppercase tracking-wide text-[var(--text-tertiary)] lg:hidden">
                  {entry.date}
                </div>

                <h2 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)] sm:text-[26px]">
                  {parseInline(entry.title)}
                </h2>

                {/* Plain flowing prose, no card or badges — the content sits
                    directly in the page the way Superset's MDX body does. */}
                <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-[15px] leading-relaxed text-[var(--text-secondary)] marker:text-[var(--text-disabled)]">
                  {entry.items.map((item) => (
                    <li key={item}>{parseInline(item)}</li>
                  ))}
                </ul>

                {entry.extra}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
