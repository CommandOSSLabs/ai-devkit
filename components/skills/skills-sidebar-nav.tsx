"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Share2, FlaskConical, SendHorizontal, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/skills", label: "Skills", icon: Layers },
  { href: "/skills/visualize-interactions", label: "Visualize interactions", icon: Share2 },
  { href: "/skills/playground", label: "Playground", icon: FlaskConical },
  { href: "/skills/prompt-inputs", label: "Prompt Inputs", icon: SendHorizontal },
];

const TITLE_BY_PATH: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map(({ href, label }) => [href, label]),
);

// The top bar's title needs to react to the active route, but layout.tsx
// stays a server component — so that one bit of client state lives here,
// next to the nav data it's already derived from, instead of forcing the
// whole shell to become a client component just for a label.
export function SkillsSectionTitle() {
  const pathname = usePathname();
  return <>{TITLE_BY_PATH[pathname] ?? "Skills"}</>;
}

export function SkillsSidebarNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1.5", className)}>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] tracking-tight transition-colors ${
              active
                ? "bg-[#82AAFF]/10 font-medium text-[#82AAFF]"
                : "text-[var(--text-secondary)] opacity-80 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] hover:opacity-100"
            }`}
          >
            <Icon size={15} />
            <span className="whitespace-nowrap">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default SkillsSidebarNav;
