"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Database,
  Folder,
  Info,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  header: string;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    header: "Project Overview",
    description: "Daily summary of your agent & skill telemetry.",
  },
  {
    id: "management",
    label: "Management",
    icon: Users,
    header: "Agent Vendors",
    description: "Manage synced coding agents and MCP permissions.",
    badge: "10",
  },
  {
    id: "threads",
    label: "Threads",
    icon: MessageSquare,
    header: "Skill Workflows",
    description: "High-priority delivery & review pipelines.",
    badge: "12",
  },
  {
    id: "resources",
    label: "Resources",
    icon: Folder,
    header: "System Assets",
    description: "Saved X references, SKILL.md specs, and MCP logs.",
  },
];

export function McpBentoCard() {
  const [activeTab, setActiveTab] = useState<TabConfig>(TABS[0]);

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "dashboard":
        return <OverviewDashboard />;
      case "management":
        return <ManagementDashboard />;
      case "threads":
        return <ThreadsDashboard />;
      case "resources":
        return <ResourcesDashboard />;
      default:
        return null;
    }
  }, [activeTab.id]);

  return (
    <div className="flex w-full items-center justify-center antialiased">
      <div className="group relative m-0 w-full overflow-hidden rounded-[24px] bg-[var(--md-bento-surface)] shadow-[inset_0_0_0_1px_var(--md-ring-menu),0_24px_60px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_var(--md-ring-tile),0_28px_70px_rgba(0,0,0,0.6)]">
        <div className="relative z-10 space-y-1.5 p-5 sm:p-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--md-text-tertiary)]">
            MCP Workspace Preview
          </span>
          <p className="max-w-[460px] text-[18px] font-medium leading-snug tracking-[-0.015em] text-[var(--md-fg)] sm:text-[21px]">
            High-performance skill telemetry and multi-agent collaboration in one glass tile.
          </p>
        </div>

        <div className="relative h-[270px] w-full overflow-hidden rounded-t-2xl sm:h-[300px]">
          {/* Back decorative glass layer */}
          <div className="absolute left-10 top-14 h-full w-full rounded-3xl border border-white/[0.06] bg-white/[0.02] opacity-80 sm:left-14" />

          {/* Foreground Interactive App Frame */}
          <div className="absolute left-6 top-6 flex h-full w-[calc(100%-24px)] flex-col overflow-hidden rounded-tl-3xl bg-[#0d0d0f] shadow-2xl ring-4 ring-white/[0.06] sm:left-16 sm:w-[calc(100%-64px)]">
            {/* Window Chrome */}
            <div className="relative flex items-center border-b border-white/[0.07] bg-white/[0.02] px-5 py-3.5 backdrop-blur-sm">
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
              </div>
              <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">
                  Workspace · ai-devkit
                </span>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar with LayoutGroup Spring Pills */}
              <div className="flex w-36 shrink-0 flex-col gap-1 border-r border-white/[0.06] bg-white/[0.015] p-2 pt-4 sm:w-40">
                <LayoutGroup id="mcp-bento-tabs">
                  {TABS.map((tab) => {
                    const isActive = activeTab.id === tab.id;
                    const Icon = tab.icon;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "relative flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-xs transition-colors",
                          isActive
                            ? "text-white"
                            : "text-white/50 hover:text-white/85",
                        )}
                      >
                        <Icon size={14} className="relative z-20 shrink-0" />
                        <span className="relative z-20 truncate font-medium">
                          {tab.label}
                        </span>
                        {tab.badge && (
                          <span
                            className={cn(
                              "relative z-20 ml-auto rounded-md px-1.5 py-0.5 font-mono text-[9px] leading-none tabular-nums transition-all",
                              isActive
                                ? "border border-[#82aaff]/30 bg-[#82aaff]/15 text-[#82aaff]"
                                : "border border-transparent bg-white/[0.06] text-white/50",
                            )}
                          >
                            {tab.badge}
                          </span>
                        )}

                        {isActive && (
                          <motion.div
                            layoutId="sidebar-pill"
                            className="absolute left-0 z-30 h-4 w-[2.5px] rounded-full bg-[#82aaff]"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="backgroundIndicator"
                            className="absolute inset-0 rounded-xl border border-white/[0.08] bg-white/[0.06]"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </LayoutGroup>
              </div>

              {/* Right Swappable Preview Area */}
              <div className="relative flex flex-1 flex-col gap-3.5 overflow-hidden bg-[#0d0d0f] p-4 pt-4 sm:p-5">
                <header className="flex flex-col gap-0.5">
                  <h3 className="line-clamp-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white/60">
                    {activeTab.header}
                  </h3>
                  <p className="line-clamp-1 text-[11px] font-normal leading-tight text-white/45">
                    {activeTab.description}
                  </p>
                </header>

                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 min-h-0"
                  >
                    {content}
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-8 bg-gradient-to-t from-[#0d0d0f] to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewDashboard() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-3.5">
        <div className="relative z-10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-white/55">
              Skill Recall Accuracy
            </span>
            <ArrowUpRight size={13} className="text-[#82aaff]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-medium tracking-tight text-white">
              94.2%
            </span>
            <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "94.2%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-[#82aaff]"
              />
            </div>
          </div>
          <span className="text-[9.5px] text-white/45">
            Matched across CMK skills &amp; saved X companion refs
          </span>
        </div>
        <div className="pointer-events-none absolute -bottom-2 -right-2 rotate-12 scale-125 text-white/[0.04]">
          <BarChart3 size={64} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-white">1,070</span>
            <span className="font-mono text-[8.5px] font-medium uppercase text-white/45">
              Skill Triggers
            </span>
          </div>
          <Search size={14} className="text-white/25" />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-white">28 Skills</span>
            <span className="font-mono text-[8.5px] font-medium uppercase text-white/45">
              Synced Vendors
            </span>
          </div>
          <Info size={14} className="text-white/25" />
        </div>
      </div>
    </div>
  );
}

function ManagementDashboard() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.03] px-3 py-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-white/55">
            Active Agent Runtimes
          </span>
          <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#0d0d0f] px-1.5 py-0.5">
            <Search size={10} className="text-white/40" />
            <span className="text-[8.5px] font-medium text-white/45">Filter</span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 p-1.5">
          {[
            {
              name: "Claude Code (.mcp.json)",
              role: "cmk:mcp-config · 4 active servers",
              color: "bg-emerald-400",
            },
            {
              name: "Codex (.codex/config.toml)",
              role: "cmk:agent-vendors · synced lockfile",
              color: "bg-emerald-400",
            },
            {
              name: "Cursor (.cursor/mcp.json)",
              role: "Pending workspace reload",
              color: "bg-amber-400",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-white/[0.04]"
            >
              <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05]">
                <User size={11} className="text-white/60" />
                <div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#0d0d0f]",
                    item.color,
                  )}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[10.5px] font-medium text-white">
                  {item.name}
                </span>
                <span className="truncate text-[9px] text-white/45">
                  {item.role}
                </span>
              </div>
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <Settings size={12} className="text-white/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThreadsDashboard() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        {[
          {
            title: "Run Spec & Plan",
            desc: "cmk:delivery-spec-plan",
            icon: Folder,
          },
          {
            title: "Verify & Ship PR",
            desc: "cmk:delivery-review",
            icon: Check,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-3"
          >
            <div className="z-10 flex flex-col gap-0.5">
              <span className="text-[11.5px] font-medium leading-tight text-white">
                {card.title}
              </span>
              <span className="font-mono text-[9px] leading-tight text-white/45">
                {card.desc}
              </span>
            </div>
            <button
              type="button"
              className="z-10 flex w-fit items-center gap-1 rounded-md bg-white px-2 py-1 text-[9px] font-semibold text-[#141413] transition-transform active:scale-95 group-hover:bg-[#82aaff]"
            >
              <Plus size={9} strokeWidth={3} />
              Launch
            </button>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
        <div className="flex items-center gap-2">
          <div className="rounded-md border border-white/[0.08] bg-[#0d0d0f] p-1 px-1.5">
            <Info size={10} className="text-white/55" />
          </div>
          <span className="text-[9.5px] font-medium text-white/55">
            Pin a new X companion skill ref
          </span>
        </div>
        <Plus size={12} className="text-white/40" />
      </div>
    </div>
  );
}

function ResourcesDashboard() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.03] px-3 py-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-white/55">
            Synced Specs &amp; Configs
          </span>
          <Database size={12} className="text-white/30" />
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto p-1.5">
          {[
            {
              file: "skills/cmk-design/SKILL.md",
              size: "14 KB",
              type: "SKILL",
              icon: Mail,
            },
            {
              file: ".mcp.json",
              size: "1.8 KB",
              type: "JSON",
              icon: BarChart3,
            },
            {
              file: "taste-skill-ref.json",
              size: "4.2 KB",
              type: "X REF",
              icon: Folder,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-white/60 transition-colors group-hover:border-[#82aaff]/30 group-hover:bg-[#82aaff]/10 group-hover:text-[#82aaff]">
                  <Icon size={12} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-mono text-[10px] font-medium text-white">
                    {item.file}
                  </span>
                  <span className="font-mono text-[8.5px] uppercase tabular-nums text-white/45">
                    {item.size} • {item.type}
                  </span>
                </div>
                <ArrowUpRight
                  size={11}
                  className="text-white/50 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
