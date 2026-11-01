"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderClosed,
  Layers,
  Plus,
  SendHorizontal,
  Share2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerOpenAddRefModal } from "./add-ref-modal";

export const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/skills/explore", label: "Explore", icon: Sparkles },
  { href: "/skills", label: "CMK Skills", icon: Layers },
  { href: "/skills/collections", label: "Collections", icon: FolderClosed },
  { href: "/skills/visualize-interactions", label: "Graph", icon: Share2 },
  { href: "/skills/prompt-inputs", label: "MCP", icon: SendHorizontal },
];

const TITLE_BY_PATH: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map(({ href, label }) => [href, label]),
);

export function isNavActive(pathname: string, href: string): boolean {
  if (href !== "/skills") return pathname === href || pathname.startsWith(`${href}/`);
  if (pathname === "/skills") return true;
  const claimedBySibling = NAV_ITEMS.some(
    (item) =>
      item.href !== "/skills" &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
  return pathname.startsWith("/skills/") && !claimedBySibling;
}

export function SkillsSectionTitle() {
  const pathname = usePathname();
  const exact = TITLE_BY_PATH[pathname];
  if (exact) return <>{exact}</>;

  const match = pathname.match(/^\/skills\/([^/]+)(\/workspace)?\/?$/);
  if (match) return <>{`CMK Skills / ${match[1]}${match[2] ? " / Workspace" : ""}`}</>;

  return <>CMK Skills</>;
}

export function SkillsTopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="md-site-nav overflow-x-auto">
      {NAV_ITEMS.map(({ href, label }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="whitespace-nowrap"
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AddRefTriggerButton() {
  return (
    <button
      type="button"
      onClick={() => triggerOpenAddRefModal({ mode: "ref" })}
      className="md-header-cta"
    >
      <Plus size={15} strokeWidth={1.9} />
      <span>Add ref</span>
    </button>
  );
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
