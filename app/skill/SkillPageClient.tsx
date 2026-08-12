"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Drawer } from "vaul";
import { GlowingWave } from "@/components/GlowingWave";
import { NotificationStack, type NotificationStackItem } from "@/components/motion/notification-stack";
import { CircuitBoard } from "@/components/motion/circuit-board";
import { type RealSkill, CATEGORY_LABELS } from "@/lib/skill-types";
import {
  Check,
  Copy,
  Terminal,
  Code2,
  Layers,
  Settings2,
  Bot,
  BookOpen,
  TestTube2,
  Hexagon,
  ShieldCheck,
  Zap,
  GitBranch,
  ArrowRight,
  Search,
  Sparkles,
  Server,
  Workflow,
  Info,
  X,
  Sun,
  Moon,
  Box,
  Globe,
  Star,
  RefreshCw,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */

type Skill = RealSkill;

type Category = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  delivery: Layers,
  setup: Settings2,
  agent: Bot,
  sync: RefreshCw,
  docs: BookOpen,
  testing: TestTube2,
  sui: Hexagon,
  other: Box,
};

const GITHUB_REPO = "https://github.com/CommandOSSLabs/ai-devkit";

function skillGithubUrl(id: string): string {
  return `${GITHUB_REPO}/blob/main/skills/${id}/SKILL.md`;
}

/* ─── Helper: Copy Button Component ─────────────────────────────────── */

function CopyButton({
  text,
  label,
  className = "",
  title,
}: {
  text: string;
  label?: string;
  className?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [text]);

  return (
    <button
      type="button"
      title={title || (label ? `Copy ${label}` : "Copy to clipboard")}
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
      aria-label={label || title || "Copy code"}
      className={`inline-flex items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#82AAFF] ${
        className || "p-1 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
      }`}
    >
      {copied ? (
        <span className="flex items-center gap-1 font-mono text-[11px] text-[#C3E88D]">
          <Check size={13} />
          <span>{label ? "Copied!" : "Copied"}</span>
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <Copy size={13} />
          {label && <span>{label}</span>}
        </span>
      )}
    </button>
  );
}

/* ─── Section 1: Navigation Bar ─────────────────────────────────────── */

function formatStarCount(count: number): string {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(1)}k`;
}

type MergedPR = {
  number: number;
  title: string;
  mergedAt: string;
};

type RepoMeta = {
  stars: number | null;
  license: string | null;
  pushedAt: string | null;
  commitSha: string | null;
  npmVersion: string | null;
  recentMerges: MergedPR[];
};

const EMPTY_REPO_META: RepoMeta = {
  stars: null,
  license: null,
  pushedAt: null,
  commitSha: null,
  npmVersion: null,
  recentMerges: [],
};

let repoMetaCache: RepoMeta | null = null;
let repoMetaPromise: Promise<RepoMeta> | null = null;

function fetchRepoMeta(): Promise<RepoMeta> {
  if (repoMetaCache) return Promise.resolve(repoMetaCache);
  if (repoMetaPromise) return repoMetaPromise;

  repoMetaPromise = Promise.all([
    fetch("https://api.github.com/repos/CommandOSSLabs/ai-devkit").then((r) => (r.ok ? r.json() : null)),
    fetch("https://api.github.com/repos/CommandOSSLabs/ai-devkit/commits/main").then((r) => (r.ok ? r.json() : null)),
    fetch("https://registry.npmjs.org/ai-devkit").then((r) => (r.ok ? r.json() : null)),
    fetch("https://api.github.com/repos/CommandOSSLabs/ai-devkit/pulls?state=closed&sort=updated&direction=desc&per_page=8").then((r) =>
      r.ok ? r.json() : null
    ),
  ])
    .then(([repo, commit, npm, pulls]) => {
      const recentMerges: MergedPR[] = Array.isArray(pulls)
        ? pulls
            .filter((pr) => pr?.merged_at)
            .slice(0, 3)
            .map((pr) => ({ number: pr.number, title: pr.title, mergedAt: pr.merged_at }))
        : [];

      const meta: RepoMeta = {
        stars: repo?.stargazers_count ?? null,
        license: repo?.license?.spdx_id ?? null,
        pushedAt: repo?.pushed_at ?? null,
        commitSha: commit?.sha ? String(commit.sha).slice(0, 7) : null,
        npmVersion: npm?.["dist-tags"]?.latest ?? null,
        recentMerges,
      };
      repoMetaCache = meta;
      return meta;
    })
    .catch(() => {
      repoMetaCache = EMPTY_REPO_META;
      return EMPTY_REPO_META;
    });

  return repoMetaPromise;
}

function useRepoMeta(): RepoMeta {
  const [meta, setMeta] = useState<RepoMeta>(() => repoMetaCache ?? EMPTY_REPO_META);

  useEffect(() => {
    let cancelled = false;
    fetchRepoMeta().then((m) => {
      if (!cancelled) setMeta(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return meta;
}

function Nav({
  theme,
  setTheme,
}: {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}) {
  const isDark = theme === "dark";
  const repoMeta = useRepoMeta();

  return (
    <header
      className={`sticky top-0 z-40 h-14 w-full border-b transition-colors duration-300 ${
        isDark
          ? "border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-md text-[var(--text-primary)]"
          : "border-[#E2E8F0] bg-[#FFFFFF]/85 backdrop-blur-md text-[#0F172A]"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                isDark ? "border-[var(--border-strong)] bg-[var(--bg-surface)]" : "border-[#E2E8F0] bg-[#F1F5F9]"
              }`}
            >
              <Terminal size={14} className="text-[#82AAFF]" />
            </div>
            <span className="whitespace-nowrap font-pixel text-[14px] font-semibold">
              ai-devkit
            </span>
          </a>
          <span
            className={`hidden rounded border px-1.5 py-0.5 font-mono text-[11px] sm:inline-block ${
              isDark
                ? "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-tertiary)]"
                : "border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B]"
            }`}
          >
            {repoMeta.npmVersion ? `v${repoMeta.npmVersion}` : "—"}
          </span>
        </div>

        {/* Links — lg: not md:, tablet doesn't have room for brand + version + 5 links + all actions in one row */}
        <nav className="hidden items-center gap-6 lg:flex">
          <a
            href="#quickstart"
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Quickstart
          </a>
          <a
            href="#how-it-works"
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Architecture
          </a>
          <a
            href="#features"
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Capabilities
          </a>
          <a
            href="#benchmarks"
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Benchmarks
          </a>
          <a
            href="#catalog"
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Skills
          </a>
        </nav>

        {/* Action & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
              isDark
                ? "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[#82AAFF] hover:text-[var(--text-primary)]"
                : "border-[#E2E8F0] bg-[#F1F5F9] text-[#475569] hover:border-[#4F46E5] hover:text-[#0F172A]"
            }`}
          >
            {isDark ? (
              <Sun size={15} className="text-[#FFCB6B]" />
            ) : (
              <Moon size={15} className="text-[#4F46E5]" />
            )}
          </button>

          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
            className={`hidden items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[12px] transition-colors sm:flex ${
              isDark
                ? "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                : "border-[#E2E8F0] bg-[#F1F5F9] text-[#475569] hover:border-[#CBD5E1] hover:text-[#0F172A]"
            }`}
          >
            <Star size={13} className="text-[#FFCB6B]" fill="currentColor" />
            <span>{repoMeta.stars !== null ? formatStarCount(repoMeta.stars) : "—"}</span>
          </a>

          <a
            href="#quickstart"
            className={`rounded border border-transparent px-3 py-1.5 text-[13px] font-medium transition-colors ${
              isDark
                ? "bg-[var(--text-primary)] text-[var(--bg-base)] hover:bg-white"
                : "bg-[#0F172A] text-white hover:bg-[#1E293B]"
            }`}
          >
            Install CLI
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─── Section 2: Hero Section ───────────────────────────────────────── */

/* Corner-notch mask shared by the stacked headline tabs (ported from the
   Hero12 pattern: a quarter-circle cut where the tab meets the surface
   behind it, reskinned dark and pointed at the code panel instead of a
   stock photo). */
function CornerNotch({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z" fill="currentColor" />
    </svg>
  );
}

function mergesToNotifications(merges: MergedPR[]): NotificationStackItem[] {
  return merges.map((pr) => ({
    id: String(pr.number),
    title: pr.title,
    description: `${timeAgo(pr.mergedAt)} · #${pr.number} merged`,
    trailing: <GitBranch size={13} className="text-[#C3E88D]" />,
  }));
}

function Hero({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const repoMeta = useRepoMeta();
  const notifications = mergesToNotifications(repoMeta.recentMerges);

  return (
    <section
      className={`relative border-b px-4 py-8 transition-colors duration-300 sm:px-6 ${
        isDark ? "border-[var(--border-subtle)]" : "border-[#E2E8F0]"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative min-h-[520px] overflow-hidden rounded-[24px] border border-[#1E2127] bg-[#0D0E11] sm:min-h-[600px]">
          {/* Real banner photo as the hero visual, not decorative code — a strong
              bottom-to-top gradient guarantees the floating UI stays legible
              regardless of what's in the image. */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- external CDN image, no next/image optimization needed for a single hero background */}
            <img
              src="https://pbs.twimg.com/profile_banners/1968527134512791554/1758896982/1080x360"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/55 to-[#0A0B0D]/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0D]/70 via-transparent to-[#0A0B0D]/40" />
          </div>

          {/* Stacked notch-cut headline tabs, top-left — Hero12-scale type.
              Semi-transparent + blurred so the photo still bleeds through,
              not a solid card blocking it. Wraps and shrinks below lg: so it
              can't overflow into the CTA/notification cluster on the right —
              tablet (~768px) doesn't have room for the nowrap desktop size. */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 flex w-full max-w-3xl flex-col items-start pr-20 lg:pr-0">
            <div className="pointer-events-auto relative w-fit max-w-full rounded-br-[24px] bg-[#0A0B0D]/60 p-3 backdrop-blur-md lg:rounded-br-[36px] lg:p-4">
              <h1 className="text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#E6E8EB] sm:text-[34px] lg:whitespace-nowrap lg:text-[56px] lg:leading-[1.05] xl:text-[68px]">
                Evolvable agent skills.
              </h1>
              <CornerNotch size={40} className="absolute right-[-40px] top-0 hidden rotate-180 text-[#0A0B0D]/60 lg:block" />
            </div>

            <div className="pointer-events-auto relative w-fit max-w-full rounded-br-[24px] bg-[#0A0B0D]/60 p-3 backdrop-blur-md lg:rounded-br-[36px] lg:p-4">
              <h1 className="text-[20px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#9BA1AC] sm:text-[28px] lg:whitespace-nowrap lg:text-[44px] lg:leading-[1.05] xl:text-[52px]">
                For the full SDLC.
              </h1>
              <CornerNotch size={40} className="absolute right-[-40px] top-0 hidden rotate-180 text-[#0A0B0D]/60 lg:block" />
              <CornerNotch size={40} className="absolute bottom-[-40px] left-0 hidden rotate-180 text-[#0A0B0D]/60 lg:block" />
            </div>
          </div>

          {/* Corner CTA + notification stack, top-right. Notifications hide
              below sm: to avoid colliding with the wrapped headline text —
              the CTA alone is the priority on small screens. */}
          <div className="absolute right-3 top-3 z-20 flex flex-col items-end gap-3 sm:right-6 sm:top-6">
            <a
              href="#quickstart"
              className="inline-flex items-center gap-2 rounded-lg bg-[#E6E8EB] px-3 py-2 text-[12px] font-medium text-[#0A0B0D] shadow-lg transition-colors hover:bg-white sm:px-4 sm:py-2.5 sm:text-[13px]"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </a>
            <div className="hidden sm:block">
              <NotificationStack
                items={notifications}
                collapsedLabel="Recent merges"
                emptyLabel="No recent merges"
              />
            </div>
          </div>

          {/* Floating install-command card, bottom-right */}
          <div className="absolute bottom-4 right-4 z-20 w-[calc(100%-2rem)] sm:bottom-6 sm:right-6 sm:w-96">
            <div className="space-y-3 rounded-[14px] border border-[#1E2127] bg-[#101216]/95 p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 font-mono text-[12px] text-[#6B7280]">
                <span className="h-2 w-2 rounded-full bg-[#C3E88D]" />
                <span>Documentation-first agent skills</span>
              </div>

              <p className="text-[13px] leading-[1.5] text-[#9BA1AC]">
                Vendored into your repo, skills adapt to how your team works and still sync with upstream.
              </p>

              <div className="flex items-center gap-3 rounded border border-[#1E2127] bg-[#0A0B0D] px-3 py-2 font-mono text-[12px]">
                <span className="select-none text-[#6B7280]">$</span>
                <code className="truncate text-[#E6E8EB]">npx ai-devkit@latest init</code>
                <div className="ml-auto flex-shrink-0">
                  <CopyButton text="npx ai-devkit@latest init" />
                </div>
              </div>

              <a
                href="#catalog"
                className="group flex w-full items-center justify-between text-[13px] font-medium text-[#E6E8EB] transition-opacity hover:opacity-70"
              >
                <span>Explore 32 skills</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 3: Install & Quickstart (§2, §2.2, §8) ────────────────── */

function Quickstart() {
  return (
    <section id="quickstart" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]">
              Three install paths.{" "}
              <span className="text-[var(--text-secondary)]">Vendored with sync keeps your per-repo adaptations alive across upgrades.</span>
            </h2>
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Tell your agent to fetch the install guide and it walks itself through. Works with Claude Code, Cursor, Codex, OpenCode, and Grok.
            </p>
            <div className="mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              02.0 Quickstart →
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
            <div className="flex h-full flex-col justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[12px] font-semibold text-[#82AAFF]">STEP 01</span>
                  <span className="font-mono text-[12px] text-[var(--text-tertiary)]">0.4s</span>
                </div>
                <h3 className="mb-2 text-[16px] font-semibold text-[var(--text-primary)]">Initialize Repository</h3>
                <p className="mb-4 text-[14px] text-[var(--text-secondary)]">
                  Scaffold `.agents/skills` root and default configuration.
                </p>
              </div>
              <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3 font-mono text-[13px] text-[var(--text-primary)]">
                <div className="flex items-center justify-between">
                  <span><span className="text-[var(--text-tertiary)] select-none">$ </span>npx ai-devkit init</span>
                  <CopyButton text="npx ai-devkit init" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
            <div className="flex h-full flex-col justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[12px] font-semibold text-[#82AAFF]">STEP 02</span>
                  <span className="font-mono text-[12px] text-[var(--text-tertiary)]">0.8s</span>
                </div>
                <h3 className="mb-2 text-[16px] font-semibold text-[var(--text-primary)]">Select Canonical Skills</h3>
                <p className="mb-4 text-[14px] text-[var(--text-secondary)]">
                  Pull requested skills from the upstream registry.
                </p>
              </div>
              <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3 font-mono text-[13px] text-[var(--text-primary)]">
                <div className="flex items-center justify-between">
                  <span><span className="text-[var(--text-tertiary)] select-none">$ </span>npx ai-devkit add delivery</span>
                  <CopyButton text="npx ai-devkit add delivery" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
            <div className="flex h-full flex-col justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[12px] font-semibold text-[#82AAFF]">STEP 03</span>
                  <span className="font-mono text-[12px] text-[var(--text-tertiary)]">Instant</span>
                </div>
                <h3 className="mb-2 text-[16px] font-semibold text-[var(--text-primary)]">Natural Language Trigger</h3>
                <p className="mb-4 text-[14px] text-[var(--text-secondary)]">
                  Agents trigger skills naturally based on intent matching.
                </p>
              </div>
              <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3 font-mono text-[13px] text-[#C3E88D]">
                <span>{'"Start work on TICKET-104"'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4: How It Works / Architecture (§2, §4, §7) ─────────────── */

function Architecture() {
  return (
    <section id="how-it-works" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]">
              The SDLC is a flow of documents that build on each other.{" "}
              <span className="text-[var(--text-secondary)]">The repository&apos;s /docs tree is where that flow lives.</span>
            </h2>
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Three principles keep the flow coherent: guidance over forms, coherence cascades through every stage, and progressive disclosure so agents read only what the task at hand needs.
            </p>
            <div className="mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              03.0 Architecture →
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
              <div className="overflow-hidden rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-2.5 font-mono text-[13px]">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[#82AAFF]" />
                    <span className="text-[var(--text-secondary)]">docs/</span>
                  </div>
                  <span className="text-[var(--text-tertiary)]">Document tree</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <CircuitBoard
                    width={560}
                    height={300}
                    variant="auto"
                    nodes={[
                      { id: "requirements", x: 60, y: 50, label: "Requirements", status: "active", size: "sm" },
                      { id: "design", x: 220, y: 50, label: "Design", status: "active", size: "sm" },
                      { id: "plan", x: 380, y: 50, label: "Plan", status: "processing", size: "sm" },
                      { id: "implement", x: 60, y: 170, label: "Implement", status: "active", size: "sm" },
                      { id: "simplify", x: 220, y: 170, label: "Simplify", status: "active", size: "sm" },
                      { id: "review", x: 380, y: 170, label: "Review", status: "processing", size: "sm" },
                      { id: "ship", x: 500, y: 170, label: "Ship", status: "active", size: "sm" },
                      { id: "adr", x: 100, y: 260, label: "cmk:adr", status: "inactive", size: "sm" },
                      { id: "glossary", x: 220, y: 260, label: "cmk:glossary", status: "inactive", size: "sm" },
                      { id: "learn", x: 360, y: 260, label: "cmk:learn", status: "inactive", size: "sm" },
                      { id: "rule", x: 480, y: 260, label: "cmk:rule", status: "inactive", size: "sm" },
                    ]}
                    connections={[
                      { from: "requirements", to: "design", animated: true },
                      { from: "design", to: "plan", animated: true },
                      { from: "requirements", to: "implement", animated: true },
                      { from: "implement", to: "simplify", animated: true },
                      { from: "simplify", to: "review", animated: true },
                      { from: "review", to: "ship", animated: true },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
              <div className="overflow-hidden rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-2.5 font-mono text-[13px]">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[#C3E88D]" />
                    <span className="text-[var(--text-secondary)]">terminal session</span>
                  </div>
                  <span className="text-[var(--text-tertiary)]">zsh — 80x24</span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.6]">
                  <code>
                    <div className="flex items-center gap-2">
                      <span className="select-none text-[var(--text-tertiary)]">$</span>
                      <span className="text-[var(--text-primary)]">cmk delivery-pipeline --issue TICKET-402</span>
                    </div>
                    <div className="mt-2 text-[var(--text-secondary)]">[1/5] INTAKE      Resolving Linear context for TICKET-402... done (120ms)</div>
                    <div className="text-[var(--text-secondary)]">[2/5] SPEC        Generating spec under docs/specs/TICKET-402.md... done</div>
                    <div className="text-[var(--text-secondary)]">[3/5] IMPLEMENT   Applying changes to src/pipeline/engine.ts... done</div>
                    <div className="text-[var(--text-secondary)]">[4/5] REVIEW      Adversarial verification pass... 0 flaws detected</div>
                    <div className="text-[#C3E88D]">[5/5] SHIP        Created PR #148 (https://github.com/org/repo/pull/148)</div>
                    <div className="mt-2 text-[var(--text-tertiary)]">Pipeline executed successfully in 4.2s · 0 warnings</div>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5: Feature Grid (§2, §9) ──────────────────────────────── */

function FeatureGrid() {
  const features = [
    {
      icon: GitBranch,
      title: "Worktree Isolation",
      description: "Run parallel agent efforts in isolated git worktrees without state collision.",
      code: "cmk local-stack --worktree-safe",
    },
    {
      icon: ShieldCheck,
      title: "Adversarial Review",
      description: "Automated multi-lens review pass checks for security, edge-cases, and performance.",
      code: "cmk delivery-review --adversarial",
    },
    {
      icon: Server,
      title: "Checked-In MCP Config",
      description: "Repository-scoped Model Context Protocol configuration checked directly into git.",
      code: ".mcp.json -> vendor configuration",
    },
    {
      icon: Code2,
      title: "Hierarchical AI Docs",
      description: "Progressive disclosure docs map code architecture into dense markdown for AI context.",
      code: "docs/ai/MAP.md -> 70% token savings",
    },
    {
      icon: Workflow,
      title: "Tracker Reconciliation",
      description: "Automatic state updates across Linear, GitHub Issues, Jira, and local git branches.",
      code: "cmk sync --tracker linear",
    },
    {
      icon: Zap,
      title: "gRPC Sui Transport",
      description: "2026-compliant Sui full node integration replacing deprecated JSON-RPC.",
      code: "cmk sui-sdk --transport grpc",
    },
  ];

  return (
    <section id="features" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]">
              Built for engineering rigor.{" "}
              <span className="text-[var(--text-secondary)]">Every capability carries concrete, executable proof.</span>
            </h2>
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              No marketing buzzwords or hand-waving claims. High-density features designed specifically for software engineers.
            </p>
            <div className="mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              04.0 Capabilities →
            </div>
          </div>
        </div>

        <div className="grid overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--border-subtle)] gap-px md:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="flex flex-col justify-between bg-[var(--bg-surface)] p-6">
                <div>
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)]">
                    <Icon size={16} />
                  </div>
                  <h3 className="mb-1 text-[16px] font-semibold text-[var(--text-primary)]">{feat.title}</h3>
                  <p className="mb-4 text-[14px] leading-[1.5] text-[var(--text-secondary)]">{feat.description}</p>
                </div>
                <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1.5 font-mono text-[12px] text-[#82AAFF]">
                  <code>{feat.code}</code>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6: Terminal / Diff Demo (§2, §6, §7) ────────────────────── */

function DiffDemo() {
  return (
    <section className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]">
              Behavior-preserving diff simplification.{" "}
              <span className="text-[var(--text-secondary)]">Cleans up noise before submitting code for human review.</span>
            </h2>
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Phase 3b automatically runs a simplification pass to reduce diff churn, unify variable conventions, and eliminate redundant logic.
            </p>
            <div className="mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              05.0 Quality →
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
          <div className="overflow-hidden rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-2.5 font-mono text-[13px]">
              <span className="text-[var(--text-secondary)]">diff --git a/src/engine.ts b/src/engine.ts</span>
              <span className="text-[var(--text-tertiary)]">-8 lines / +3 lines</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.6]">
              <code>
                <div className="text-[var(--text-tertiary)]">@@ -42,8 +42,3 @@ export async function processTask(task: Task) @@</div>
                <div className="flex bg-[#F07178]/10 text-[#F07178] -mx-4 px-4">
                  <span className="w-8 select-none pr-4 text-right text-[#F07178]/50">42</span>
                  <span>-  let result = null;</span>
                </div>
                <div className="flex bg-[#F07178]/10 text-[#F07178] -mx-4 px-4">
                  <span className="w-8 select-none pr-4 text-right text-[#F07178]/50">43</span>
                  <span>-  try {"{"} result = await executeLegacyFlow(task); {"}"} catch (e) {"{"} log(e); {"}"}</span>
                </div>
                <div className="flex bg-[#F07178]/10 text-[#F07178] -mx-4 px-4">
                  <span className="w-8 select-none pr-4 text-right text-[#F07178]/50">44</span>
                  <span>-  if (!result) return false;</span>
                </div>
                <div className="flex bg-[#C3E88D]/10 text-[#C3E88D] -mx-4 px-4">
                  <span className="w-8 select-none pr-4 text-right text-[#C3E88D]/50">42</span>
                  <span>+  const result = await executeDeterministicFlow(task);</span>
                </div>
                <div className="flex bg-[#C3E88D]/10 text-[#C3E88D] -mx-4 px-4">
                  <span className="w-8 select-none pr-4 text-right text-[#C3E88D]/50">43</span>
                  <span>{'+  return result.status === "SUCCESS";'}</span>
                </div>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 7: Performance & Specs Table (§2, §12.1) ───────────────── */

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

function Benchmarks({ skills, categories }: { skills: Skill[]; categories: Category[] }) {
  const repoMeta = useRepoMeta();
  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count: skills.filter((s) => s.category === cat.id).length,
  }));

  const stats = [
    { label: "GitHub Stars", value: repoMeta.stars !== null ? formatStarCount(repoMeta.stars) : "—" },
    { label: "License", value: repoMeta.license ?? "—" },
    { label: "Canonical Skills", value: String(skills.length) },
    { label: "Latest Release", value: repoMeta.npmVersion ? `v${repoMeta.npmVersion}` : "—" },
    { label: "Last Push", value: timeAgo(repoMeta.pushedAt) },
    { label: "Latest Commit", value: repoMeta.commitSha ?? "—" },
  ];

  return (
    <section id="benchmarks" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]">
              Live from the repository.{" "}
              <span className="text-[var(--text-secondary)]">Fetched from GitHub and npm at page load — no invented numbers.</span>
            </h2>
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              This section shows exactly what&apos;s publicly verifiable about{" "}
              <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className="text-[#82AAFF] hover:underline">
                CommandOSSLabs/ai-devkit
              </a>{" "}
              — nothing else.
            </p>
            <div className="mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              06.0 Repository →
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 bg-[var(--bg-surface)] p-4">
              <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
                {stat.label}
              </span>
              <span className="font-mono text-[16px] font-semibold text-[var(--text-primary)]">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-3 lg:grid-cols-6">
          {categoryCounts.map((cat) => (
            <a
              key={cat.id}
              href="#catalog"
              className="flex flex-col gap-1 bg-[var(--bg-surface)] p-4 transition-colors hover:bg-[var(--bg-elevated)]"
            >
              <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
                {cat.label}
              </span>
              <span className="font-mono text-[16px] font-semibold text-[#82AAFF]">
                {cat.count} skill{cat.count === 1 ? "" : "s"}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 8: 32-Skill Interactive Catalog & Vaul Bottom Sheet ────── */

function SkillCatalog({
  skills,
  categories,
  activeDetailSkill,
  setActiveDetailSkill,
}: {
  skills: Skill[];
  categories: Category[];
  activeDetailSkill: Skill | null;
  setActiveDetailSkill: (skill: Skill | null) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    () => new Set(["delivery-pipeline", "repo-setup", "codebase-docs"])
  );

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchCat = selectedCategory === "all" || s.category === selectedCategory;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.triggers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyPromptText = useMemo(() => {
    const list = skills.filter((s) => selectedSkills.has(s.id)).map((s) => s.name);
    return list.length > 0 ? `npx ai-devkit add ${list.join(" ")}` : "npx ai-devkit init";
  }, [skills, selectedSkills]);

  return (
    <section id="catalog" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Asymmetric Section Header */}
        <div className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]">
              {skills.length} Canonical Agent Skills.{" "}
              <span className="text-[var(--text-secondary)]">Click any skill card to open detailed specs in a Bottom Sheet.</span>
            </h2>
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Every skill is read live from skills/&lt;id&gt;/SKILL.md — name, description, and version straight from the repo.
            </p>
            <div className="mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              08.0 Skill Catalog →
            </div>
          </div>
        </div>

        {/* Toolbar: Category Filter & Search */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded px-3 py-1.5 font-mono text-[12px] transition-colors ${
                selectedCategory === "all"
                  ? "bg-[#82AAFF]/15 text-[#82AAFF] border border-[#82AAFF]/40"
                  : "border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
              }`}
            >
              All ({skills.length})
            </button>
            {categories.map((cat) => {
              const count = skills.filter((s) => s.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded px-3 py-1.5 font-mono text-[12px] transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-[#82AAFF]/15 text-[#82AAFF] border border-[#82AAFF]/40"
                      : "border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Filter skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-9 pr-3 py-1.5 font-mono text-[12px] text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[#82AAFF] focus:outline-none"
            />
          </div>
        </div>

        {/* Selected Skill Installer Bar */}
        <div className="mb-8 flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 font-mono text-[13px]">
          <div className="flex items-center gap-3">
            <span className="text-[#82AAFF] font-semibold">{selectedSkills.size} skills selected</span>
            <span className="text-[var(--text-disabled)]">|</span>
            <code className="text-[var(--text-secondary)] truncate max-w-md">{copyPromptText}</code>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedSkills(new Set())}
              className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              Clear
            </button>
            <CopyButton text={copyPromptText} />
          </div>
        </div>

        {/* Skill Card Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkills.has(skill.id);
            return (
              <div
                key={skill.id}
                onClick={() => setActiveDetailSkill(skill)}
                className={`group cursor-pointer rounded-[16px] border p-1 transition-all ${
                  isSelected
                    ? "border-[#82AAFF]/50 bg-[#82AAFF]/5"
                    : "border-[var(--border-subtle)] bg-[var(--bg-frame)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="flex h-full flex-col justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[13px] font-semibold text-[#82AAFF] flex items-center gap-1.5">
                        {skill.name}
                        <Info size={12} className="text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Open SKILL.md on GitHub */}
                        <a
                          href={skillGithubUrl(skill.id)}
                          target="_blank"
                          rel="noreferrer"
                          title={`View ${skill.id}/SKILL.md on GitHub`}
                          className="rounded p-1 text-[var(--text-tertiary)] hover:bg-[var(--border-subtle)] hover:text-[#82AAFF]"
                        >
                          <GitBranch size={13} />
                        </a>

                        {/* 1-Click Copy Skill Command */}
                        <CopyButton
                          text={`npx ai-devkit add ${skill.id}`}
                          title={`Copy skill command: npx ai-devkit add ${skill.id}`}
                          className="rounded p-1 text-[var(--text-tertiary)] hover:bg-[var(--border-subtle)] hover:text-[#82AAFF]"
                        />

                        {/* Select Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleSkill(skill.id)}
                          aria-label="Toggle selection"
                          className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? "border-[#82AAFF] bg-[#82AAFF] text-[var(--bg-base)]"
                              : "border-[var(--border-strong)] text-transparent hover:border-[#82AAFF]"
                          }`}
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    <p className="mb-3 line-clamp-3 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
                      {skill.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1.5 font-mono text-[11px] text-[#5C6370]">
                    <span className="truncate">
                      {skill.triggers.length > 0 ? skill.triggers.map((t) => `"${t}"`).join(", ") : `v${skill.version}`}
                    </span>
                    <div className="ml-2 flex items-center gap-2 flex-shrink-0">
                      <span className="text-[#82AAFF] underline text-[10px] select-none">Details</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Bottom Sheet Modal Component (Vaul Drawer - @beui/bottom-sheet spec) ─── */}
        <Drawer.Root
          open={!!activeDetailSkill}
          onOpenChange={(open) => {
            if (!open) setActiveDetailSkill(null);
          }}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-50 bg-[var(--bg-base)]/75 backdrop-blur-md transition-all duration-300" />
            <Drawer.Content className="fixed inset-x-0 bottom-0 sm:bottom-4 z-50 mx-auto flex max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl flex-col rounded-t-[20px] sm:rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl focus:outline-none">
              {/* Drag Handle */}
              <div className="mx-auto mb-4 h-1.5 w-10 flex-shrink-0 rounded-full bg-[var(--border-strong)]" />

              {activeDetailSkill && (
                <div className="w-full overflow-y-auto pr-1">
                  {/* Clean Header */}
                  <div className="mb-4 flex items-start justify-between border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="rounded border border-[#82AAFF]/30 bg-[#82AAFF]/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#82AAFF] uppercase">
                          {activeDetailSkill.category}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--text-tertiary)]">Skill Spec</span>
                      </div>
                      <Drawer.Title className="font-mono text-[18px] font-bold text-[var(--text-primary)]">
                        {activeDetailSkill.name}
                      </Drawer.Title>
                      <Drawer.Description className="mt-1 text-[13px] text-[var(--text-secondary)]">
                        {activeDetailSkill.description}
                      </Drawer.Description>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveDetailSkill(null)}
                      className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Clean Divide List (§ Usage @beui/bottom-sheet) */}
                  <ul className="divide-y divide-[var(--border-subtle)] font-mono text-[13px]">
                    {/* Natural Triggers — extracted from the real description's quoted phrases */}
                    {activeDetailSkill.triggers.length > 0 && (
                      <li className="py-3">
                        <div className="mb-1.5 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase">
                          Natural Language Triggers
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#C3E88D]">
                          {activeDetailSkill.triggers.map((t) => (
                            <span key={t} className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2 py-1">
                              {`"${t}"`}
                            </span>
                          ))}
                        </div>
                      </li>
                    )}

                    {/* Version */}
                    <li className="py-3">
                      <div className="mb-1 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase">
                        Version
                      </div>
                      <div className="text-[12px] text-[var(--text-primary)]">v{activeDetailSkill.version}</div>
                    </li>

                    {/* Source on GitHub */}
                    <li className="py-3">
                      <div className="mb-1 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase">
                        Source
                      </div>
                      <a
                        href={skillGithubUrl(activeDetailSkill.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-[#82AAFF] hover:border-[#82AAFF]/40"
                      >
                        <span className="truncate">skills/{activeDetailSkill.id}/SKILL.md</span>
                        <GitBranch size={13} className="ml-2 flex-shrink-0" />
                      </a>
                    </li>

                    {/* Install Command */}
                    <li className="py-3">
                      <div className="mb-1 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase">
                        Install Command
                      </div>
                      <div className="flex items-center justify-between rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-[var(--text-primary)]">
                        <span>
                          <span className="select-none text-[var(--text-tertiary)]">$ </span>
                          <span>npx ai-devkit add {activeDetailSkill.id}</span>
                        </span>
                        <CopyButton text={`npx ai-devkit add ${activeDetailSkill.id}`} />
                      </div>
                    </li>
                  </ul>

                  {/* Clean Action Footer */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSkill(activeDetailSkill.id)}
                        className={`rounded-lg px-4 py-2 font-mono text-[13px] font-medium transition-colors ${
                          selectedSkills.has(activeDetailSkill.id)
                            ? "bg-[#82AAFF]/20 text-[#82AAFF] border border-[#82AAFF]/40"
                            : "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[#82AAFF]"
                        }`}
                      >
                        {selectedSkills.has(activeDetailSkill.id)
                          ? "✓ Selected in CLI Builder"
                          : "+ Add to Selection"}
                      </button>

                      {/* 1-Click Copy Only This Skill */}
                      <CopyButton
                        text={`npx ai-devkit add ${activeDetailSkill.id}`}
                        label="Copy Skill Command"
                        className="rounded-lg border border-[#82AAFF]/40 bg-[#82AAFF]/10 px-4 py-2 font-mono text-[13px] text-[#82AAFF] hover:bg-[#82AAFF]/20"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveDetailSkill(null)}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-2 font-mono text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </section>
  );
}

/* ─── Section 10: Call to Action (§2, §8) ─────────────────────────────── */

function CTA() {
  const repoMeta = useRepoMeta();
  return (
    <section className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
          <div className="flex flex-col items-center justify-center rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-12 text-center sm:px-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-1 font-mono text-[12px] text-[#82AAFF]">
              <Sparkles size={13} />
              <span>Get Started in 30 Seconds</span>
            </div>

            <h2 className="mb-4 text-[clamp(26px,3.5vw,42px)] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--text-primary)]">
              Build software with developer-first agent skills.{" "}
              <span className="text-[var(--text-secondary)]">Free, open source, and vendor-neutral.</span>
            </h2>

            <p className="mb-8 max-w-[54ch] text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Vendor canonical skills directly into `.agents/skills`. Designed for modern coding agents and CLI workflows.
            </p>

            <div className="mb-8 w-full max-w-md">
              <div className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3 font-mono text-[13px]">
                <span className="select-none text-[var(--text-tertiary)]">$</span>
                <code className="text-[var(--text-primary)]">npx ai-devkit@latest init</code>
                <div className="ml-auto">
                  <CopyButton text="npx ai-devkit@latest init" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#quickstart"
                className="rounded border border-transparent bg-[var(--text-primary)] px-5 py-2.5 text-[14px] font-medium text-[var(--bg-base)] transition-colors hover:bg-white"
              >
                Install CLI
              </a>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-5 py-2.5 font-mono text-[13px] text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)]"
              >
                View on GitHub →
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] text-[var(--text-tertiary)]">
              <span>npm {repoMeta.npmVersion ? `v${repoMeta.npmVersion}` : "—"}</span>
              <span>·</span>
              <span>license {repoMeta.license ?? "MIT"}</span>
              <span>·</span>
              <span>{repoMeta.stars !== null ? formatStarCount(repoMeta.stars) : "—"} stars</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 11: Footer (§2) ───────────────────────────────────────── */

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Quickstart", href: "#quickstart" },
      { label: "Architecture", href: "#how-it-works" },
      { label: "Capabilities", href: "#features" },
      { label: "Benchmarks", href: "#benchmarks" },
    ],
  },
  {
    title: "Skill Domains",
    links: [
      { label: "Delivery Workflows", href: "#catalog" },
      { label: "Repository Setup", href: "#catalog" },
      { label: "Agent Vendors", href: "#catalog" },
      { label: "Sui Devstack", href: "#catalog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: `${GITHUB_REPO}#readme` },
      { label: "GitHub Repository", href: GITHUB_REPO },
      { label: "Contributing", href: `${GITHUB_REPO}/blob/main/CONTRIBUTING.md` },
      { label: "Installation Guide", href: `${GITHUB_REPO}/blob/main/INSTALLATION.md` },
    ],
  },
];

function Footer() {
  const repoMeta = useRepoMeta();
  return (
    <footer className="w-full bg-[var(--bg-base)] px-4 py-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        <div className="relative w-full overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 sm:p-12">
          <div className="pointer-events-none absolute inset-0 flex flex-row items-end justify-center">
            {Array.from({ length: 9 }).map((_, i) => {
              const distFromCenter = Math.abs(i - 4);
              const height = Math.max(20, 90 - distFromCenter * 15);
              const opacity = Math.max(0.05, 0.4 - distFromCenter * 0.08);
              return (
                <div
                  key={i}
                  className="relative flex-1"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, rgba(130,170,255,${opacity}) 0%, rgba(130,170,255,0) 100%)`,
                  }}
                />
              );
            })}
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)]">
                  <Terminal size={16} className="text-[#82AAFF]" />
                </div>
                <span className="font-mono text-[15px] font-semibold text-[var(--text-primary)]">ai-devkit</span>
              </div>

              <p className="max-w-sm text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                Evolvable agent skills, vendored directly into your repository as plain
                markdown under <code className="font-mono text-[13px] text-[var(--text-primary)]">.agents/skills</code>. Free and open source.
              </p>

              <div className="flex items-center gap-3">
                {[
                  { Icon: GitBranch, href: GITHUB_REPO, label: "GitHub" },
                  { Icon: Box, href: `${GITHUB_REPO}/tree/main/skills`, label: "Skills" },
                  { Icon: Layers, href: "#catalog", label: "Catalog" },
                  { Icon: Globe, href: `${GITHUB_REPO}#readme`, label: "Docs" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] transition-colors hover:border-[#82AAFF]/40 hover:text-[#82AAFF]"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title} className="flex flex-col gap-4">
                  <h3 className="font-mono text-[12px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                    {col.title}
                  </h3>
                  <ul className="space-y-2.5 text-[13px]">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                          className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-6 font-mono text-[12px] text-[var(--text-tertiary)] sm:flex-row">
          <span>ai-devkit · MIT License · 2026</span>
          <span>
            {repoMeta.npmVersion ? `npm v${repoMeta.npmVersion}` : "npm —"} · commit {repoMeta.commitSha ?? "—"}
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page Component ────────────────────────────────────────────── */

export default function TerminalDarkLandingPage({ skills }: { skills: RealSkill[] }) {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [activeDetailSkill, setActiveDetailSkill] = useState<Skill | null>(null);

  const isDark = theme === "dark";

  const categories: Category[] = useMemo(() => {
    const present = Array.from(new Set(skills.map((s) => s.category)));
    return present
      .sort((a, b) => a.localeCompare(b))
      .map((id) => ({ id, label: CATEGORY_LABELS[id] ?? id, icon: CATEGORY_ICONS[id] ?? Box }));
  }, [skills]);

  const setTheme = useCallback((next: "dark" | "light") => {
    setThemeState(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("ai-devkit-theme", next);
    } catch {
      // localStorage unavailable (private mode, etc.) — theme just won't persist
    }
  }, []);

  // Sync initial state to whatever the pre-paint script in layout.tsx already applied.
  useEffect(() => {
    const applied = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setThemeState((prev) => (prev === applied ? prev : applied));
  }, []);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 selection:bg-[#82AAFF]/20 ${
        isDark ? "bg-[var(--bg-base)] text-[var(--text-primary)]" : "bg-[#F8FAFC] text-[#0F172A]"
      }`}
    >
      {/* ─── Single Luminous Wave Background (React Bits Pro Glowing Wave canvas renderer) ───
          Toned down from the original: lower glow/richness and a lighter dark-mode
          base so the animation reads as ambient light, not a heavy dark overlay. */}
      <div className={`fixed inset-0 z-0 pointer-events-none ${isDark ? "opacity-80" : "opacity-100"}`}>
        <GlowingWave
          className="h-screen w-full"
          swell={0.18}
          glow={0.5}
          richness={0.45}
          colorFrequency={6}
          color={isDark ? "#1a3a7a" : "#94a3b8"}
          hotColor={isDark ? "#ff8a5c" : "#3b82f6"}
          backgroundColor={isDark ? "#111318" : "#f8fafc"}
        />
      </div>

      {/* Background Page Content Wrapper with Gaussian Blur & Scaling on Sheet Open */}
      <div
        className={`relative z-10 transition-all duration-500 ease-out ${
          activeDetailSkill ? "blur-md scale-[0.985] brightness-90 origin-top pointer-events-none select-none" : ""
        }`}
      >
        <Nav theme={theme} setTheme={setTheme} />
        <main>
          <Hero theme={theme} />
          <Quickstart />
          <Architecture />
          <FeatureGrid />
          <DiffDemo />
          <Benchmarks skills={skills} categories={categories} />
          <SkillCatalog
            skills={skills}
            categories={categories}
            activeDetailSkill={activeDetailSkill}
            setActiveDetailSkill={setActiveDetailSkill}
          />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
