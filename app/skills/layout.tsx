import Link from "next/link";
import { AiDevkitLogoIcon } from "@/components/brand-logo";
import {
  AddRefTriggerButton,
  SkillsTopNav,
} from "@/components/skills/skills-sidebar-nav";
import { AddRefModal } from "@/components/skills/add-ref-modal";
import { ThemeToggle } from "@/components/skills/theme-toggle";
import { LiquefyTheme } from "@/components/skills/liquefy-theme";

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <AiDevkitLogoIcon size="md" />
      <span className="font-pixel text-[13.5px] font-semibold tracking-tight text-[var(--md-fg)]">
        ai-devkit
      </span>
    </span>
  );
}

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiquefyTheme>
      <div className="skills-shell relative flex h-screen flex-col overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
        <div className="skills-column relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-[var(--bg-base)]">
          <header className="skills-topbar md-site-header shrink-0">
            <div className="md-header-lead min-w-0">
              <Link
                href="/"
                title="AI DevKit Home"
                aria-label="AI DevKit Home"
                className="inline-flex h-10 items-center transition-opacity hover:opacity-85"
              >
                <BrandMark />
              </Link>

              <SkillsTopNav />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <AddRefTriggerButton />
              <ThemeToggle />
              <a
                href="https://github.com/CommandOSSLabs/ai-devkit"
                target="_blank"
                rel="noreferrer"
                title="CommandOSSLabs/ai-devkit on GitHub"
                aria-label="CommandOSSLabs/ai-devkit on GitHub"
                className="md-avatar-orb"
              />
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="skills-content-pad flex min-h-0 flex-1 flex-col px-5 pb-6 pt-2">
              {children}
            </div>
          </main>
        </div>

        <AddRefModal />
      </div>
    </LiquefyTheme>
  );
}
