"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";
import { NAV_ITEMS, isNavActive } from "./skills-sidebar-nav";

// The rail is icon-only where space is tight and grows real labels once the
// viewport can afford them (xl and up) — a tooltip is a fallback for a
// cramped layout, not a substitute for a legible nav on a wide screen.
// Below xl the label still exists in the DOM for screen readers; only its
// visual form changes.

function RailButton({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative w-full">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors xl:w-full xl:justify-start xl:gap-2.5 xl:px-3 ${
          active
            ? "bg-[#82AAFF]/10 text-[#82AAFF]"
            : "text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
        }`}
      >
        {children}
        <span className="hidden truncate text-[13px] tracking-tight xl:inline">{label}</span>
        <span className="sr-only xl:hidden">{label}</span>
      </Link>
      <div
        role="tooltip"
        aria-hidden="true"
        className="pointer-events-none absolute left-full top-1/2 z-30 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[12.5px] font-medium text-[var(--text-primary)] opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 xl:hidden"
      >
        {label}
      </div>
    </div>
  );
}

export function SkillsIconRail() {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col items-center gap-4 xl:items-stretch">
      <RailButton href="/" label="ai-devkit">
        <Terminal size={15} className="shrink-0 text-[#82AAFF]" />
      </RailButton>

      <span aria-hidden="true" className="h-px w-6 bg-[var(--border-subtle)] xl:w-full" />

      <nav aria-label="Skills" className="flex w-full flex-col items-center gap-1.5 xl:items-stretch">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <RailButton key={href} href={href} label={label} active={isNavActive(pathname, href)}>
            <Icon size={17} strokeWidth={1.75} className="shrink-0" />
          </RailButton>
        ))}
      </nav>
    </div>
  );
}

export default SkillsIconRail;
