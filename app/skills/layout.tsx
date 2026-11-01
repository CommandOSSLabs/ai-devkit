import Link from "next/link";
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
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#14161d] shadow-[inset_0_0_0_1px_rgba(130,170,255,0.28),0_4px_14px_rgba(67,125,245,0.18)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-[18px] w-[18px]"
        >
          <defs>
            <linearGradient
              id="cmk-skills-logo-grad"
              x1="2"
              y1="2"
              x2="22"
              y2="22"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="50%" stopColor="#82AAFF" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          {/* Back stacked skill layer */}
          <path
            d="M7 4.75H16.5C17.8807 4.75 19 5.86929 19 7.25V15.5"
            stroke="url(#cmk-skills-logo-grad)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />
          {/* Front modular skill tile */}
          <rect
            x="4"
            y="7.5"
            width="12.5"
            height="12.5"
            rx="3.5"
            stroke="url(#cmk-skills-logo-grad)"
            strokeWidth="1.85"
            fill="#0B0D13"
          />
          {/* Terminal prompt `>_` inside the skill tile */}
          <path
            d="M7.5 11.75L9.75 13.75L7.5 15.75"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.25 15.75H13.25"
            stroke="#82AAFF"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </span>
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
