"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";
import { NAV_ITEMS } from "./skills-sidebar-nav";

// Icon-rail sidebar adapted from a reference "hover flyout submenu" pattern
// — but our nav is 3 flat leaf routes (Skills/Visualize interactions/
// Playground), none of them have real sub-items. Inventing children for a
// flyout menu would be the same fake-affordance problem as everywhere else
// in this pane, so this keeps the rail + hover-open mechanic but drops the
// menu: each icon just gets a plain label tooltip, shown on hover or
// keyboard focus (:focus-within covers Tab navigation for free — no click-
// to-pin state machine needed since the icon itself already navigates).

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
    <div className="group relative">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
          active
            ? "bg-[#82AAFF]/10 text-[#82AAFF]"
            : "text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
        }`}
      >
        {children}
      </Link>
      <div
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-30 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[12.5px] font-medium text-[var(--text-primary)] opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </div>
    </div>
  );
}

export function SkillsIconRail() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center gap-4">
      <RailButton href="/" label="ai-devkit">
        <Terminal size={15} className="text-[#82AAFF]" />
      </RailButton>

      <span aria-hidden="true" className="h-px w-6 bg-[var(--border-subtle)]" />

      <nav aria-label="Skills" className="flex flex-col items-center gap-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <RailButton key={href} href={href} label={label} active={pathname === href}>
            <Icon size={17} strokeWidth={1.75} />
          </RailButton>
        ))}
      </nav>
    </div>
  );
}

export default SkillsIconRail;
