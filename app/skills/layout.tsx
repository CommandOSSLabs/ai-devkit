import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";
import {
  SkillsSidebarNav,
  SkillsSectionTitle,
} from "@/components/skills/skills-sidebar-nav";
import { SkillsIconRail } from "@/components/skills/skills-icon-rail";
import { SkillsBackdrop } from "@/components/skills/skills-backdrop";
import { ThemeToggle } from "@/components/skills/theme-toggle";
import { LiquefyTheme } from "@/components/skills/liquefy-theme";

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiquefyTheme>
      <div className="skills-shell relative flex h-screen flex-col gap-3 bg-[var(--bg-elevated)] p-4 text-[var(--text-primary)] lg:flex-row">
        <SkillsBackdrop />

        {/* z-20, above the content column's z-10: backdrop-filter makes this
          aside a stacking context, so the rail's hover tooltips cannot escape
          it on z-index alone. At equal z the later sibling wins and the
          content panel painted over them, leaving a sliver at the rail edge. */}
        <aside className="relative z-20 hidden shrink-0 flex-col items-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--glass-surface)] px-2 py-5 backdrop-blur-sm lg:flex lg:w-16 xl:w-52 xl:items-stretch xl:px-3">
          <SkillsIconRail />
        </aside>

        <div className="skills-column relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-base)_92%,transparent)] backdrop-blur-sm">
          <header className="skills-topbar shrink-0 border-b border-[var(--border-subtle)] px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2 lg:hidden">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)]">
                  <Terminal size={14} className="text-[color:var(--accent)]" />
                </div>
                <span className="whitespace-nowrap font-mono text-[14px] font-semibold">
                  ai-devkit
                </span>
              </Link>
              <div className="hidden min-w-0 items-center gap-2 text-[15px] text-[var(--text-tertiary)] lg:flex">
                <span>ai-devkit</span>
                <span className="text-[var(--border-strong)]">|</span>
                <span className="truncate font-medium text-[var(--text-primary)]/80">
                  <SkillsSectionTitle />
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <ThemeToggle />
                <Link
                  href="/catalog"
                  className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <ArrowLeft size={14} />
                  <span>Back to catalog</span>
                </Link>
              </div>
            </div>
            <SkillsSidebarNav className="mt-4 flex-row overflow-x-auto lg:hidden" />
          </header>

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="skills-content-pad flex min-h-0 flex-1 flex-col p-4 sm:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LiquefyTheme>
  );
}
