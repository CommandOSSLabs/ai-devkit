"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Share2, SendHorizontal, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/skills", label: "Skills", icon: Layers },
  { href: "/skills/visualize-interactions", label: "How skills connect", icon: Share2 },
  { href: "/skills/prompt-inputs", label: "Prompt Inputs", icon: SendHorizontal },
];

// Playground has no surface yet. Rather than route people to a 404 or to a
// placeholder that adds a page with nothing in it, it is absent from the nav
// until it exists; /skills/playground redirects to the catalog so any link
// already in the wild lands somewhere real.

const TITLE_BY_PATH: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map(({ href, label }) => [href, label]),
);

// /skills owns two child routes now — /skills/<id> and its workspace — so
// "Skills" stays the active section while you're inside one, rather than the
// nav going blank the moment you open a skill. Sibling routes are matched
// first so /skills/playground never counts as a skill id.
export function isNavActive(pathname: string, href: string): boolean {
  if (href !== "/skills") return pathname === href || pathname.startsWith(`${href}/`);
  if (pathname === "/skills") return true;
  const claimedBySibling = NAV_ITEMS.some(
    (item) => item.href !== "/skills" && (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
  return pathname.startsWith("/skills/") && !claimedBySibling;
}

// The top bar's title needs to react to the active route, but layout.tsx
// stays a server component — so that one bit of client state lives here,
// next to the nav data it's already derived from, instead of forcing the
// whole shell to become a client component just for a label.
export function SkillsSectionTitle() {
  const pathname = usePathname();
  const exact = TITLE_BY_PATH[pathname];
  if (exact) return <>{exact}</>;

  const match = pathname.match(/^\/skills\/([^/]+)(\/workspace)?\/?$/);
  if (match) return <>{`Skills / ${match[1]}${match[2] ? " / Workspace" : ""}`}</>;

  return <>Skills</>;
}

export function SkillsSidebarNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1.5", className)}>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] tracking-tight transition-colors ${
              active
                ? "bg-[#82AAFF]/10 font-medium text-[color:var(--accent)]"
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
