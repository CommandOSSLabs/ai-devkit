"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { Drawer } from "vaul";
import { GlowingWave } from "@/components/GlowingWave";
import { CircuitBoard } from "@/components/motion/circuit-board";
import { FlameWrap } from "@/components/motion/flame-wrap";
import { MaskedHeading } from "@/components/motion/masked-heading";
import { DecryptReveal } from "@/components/motion/decrypt-reveal";
import BendingMarquee from "@/components/motion/bending-marquee";
import { ParticleScroll } from "@/components/motion/particle-scroll";
import { ScrambledInstallCommand, type PkgManager } from "@/components/motion/scrambled-install-command";
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

// ParticleScroll (see components/motion/particle-scroll.tsx) owns the page's
// scrolling internally — the actual scrollable element is this id, not
// `window`. `scrollIntoView` already finds the right ancestor on its own, but
// a bare "scroll to top" needs the element by id. Falls back to `window` so
// this keeps working if ParticleScroll is ever removed.
const PAGE_SCROLL_ID = "site-scroll";

function scrollPageToTop(behavior: ScrollBehavior) {
  const root = document.getElementById(PAGE_SCROLL_ID);
  if (root) root.scrollTo({ top: 0, behavior });
  else window.scrollTo({ top: 0, behavior });
}

/* ─── Section nav: real paths in the URL bar, single-page smooth scroll ───
   /quickstart, /features, etc. are real routes (see app/[section]/page.tsx)
   so a hard reload or shared link still lands on the right section — but a
   same-page click never re-navigates, it just scrolls and swaps the URL via
   pushState. Plain functions, not hooks, so any component can call them. */
function navigateToSection(e: React.MouseEvent, id: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", `/${id}`);
}

function navigateHome(e: React.MouseEvent) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  scrollPageToTop("smooth");
  window.history.pushState(null, "", "/");
}

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
        <span className="flex items-center gap-1 font-mono text-[11px] text-[var(--syntax-string)]">
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
  /** Latest git tag, e.g. "v1.5.0". This repo has no npm package of its own
      — "ai-devkit" on the npm registry is an unrelated project with the
      same name, so a tag (matching .claude-plugin/plugin.json) is the only
      real version identifier available. */
  latestTag: string | null;
  recentMerges: MergedPR[];
};

const EMPTY_REPO_META: RepoMeta = {
  stars: null,
  license: null,
  pushedAt: null,
  commitSha: null,
  latestTag: null,
  recentMerges: [],
};

let repoMetaCache: RepoMeta | null = null;
let repoMetaPromise: Promise<RepoMeta> | null = null;

function loadRepoMetaOnce(): Promise<RepoMeta> {
  // Routed through our own /api/repo-meta instead of calling GitHub
  // directly from the browser: unauthenticated GitHub REST calls are
  // capped at 60/hr *per source IP*, so every visitor's own browser was
  // burning its own budget on every page load — one round of testing (or
  // one shared office/NAT IP) was enough to degrade the "live from the
  // repository" numbers to all-dashes. The server route shares one quota
  // across all visitors and caches for 5 minutes, which keeps real GitHub
  // calls far under the limit regardless of traffic.
  return fetch("/api/repo-meta").then((r) => (r.ok ? r.json() : EMPTY_REPO_META));
}

function fetchRepoMeta(): Promise<RepoMeta> {
  if (repoMetaCache) return Promise.resolve(repoMetaCache);
  if (repoMetaPromise) return repoMetaPromise;

  // One retry on transient failure (flaky network, momentary GitHub API
  // hiccup) — a single failed fetch used to permanently poison the page to
  // all-dashes/no-notifications with no way to recover short of a reload.
  repoMetaPromise = loadRepoMetaOnce()
    .catch(() => loadRepoMetaOnce())
    .then((meta) => {
      repoMetaCache = meta;
      return meta;
    })
    .catch(() => {
      // Both attempts failed — don't cache the failure, so the next mount
      // (e.g. a later navigation within the same session) can try again.
      repoMetaPromise = null;
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
          <Link href="/" onClick={navigateHome} className="flex items-center gap-2">
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
          </Link>
          <span
            className={`hidden rounded border px-1.5 py-0.5 font-mono text-[11px] sm:inline-block ${
              isDark
                ? "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-tertiary)]"
                : "border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B]"
            }`}
          >
            {repoMeta.latestTag ?? "—"}
          </span>
        </div>

        {/* Links — lg: not md:, tablet doesn't have room for brand + version + 5 links + all actions in one row */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/quickstart"
            onClick={(e) => navigateToSection(e, "quickstart")}
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Quickstart
          </Link>
          <Link
            href="/how-it-works"
            onClick={(e) => navigateToSection(e, "how-it-works")}
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Architecture
          </Link>
          <Link
            href="/features"
            onClick={(e) => navigateToSection(e, "features")}
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Capabilities
          </Link>
          <Link
            href="/benchmarks"
            onClick={(e) => navigateToSection(e, "benchmarks")}
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Benchmarks
          </Link>
          <Link
            href="/catalog"
            onClick={(e) => navigateToSection(e, "catalog")}
            className={`text-[13px] transition-colors ${
              isDark ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]" : "text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            Skills
          </Link>
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

          <Link
            href="/quickstart"
            onClick={(e) => navigateToSection(e, "quickstart")}
            className={`rounded border border-transparent px-3 py-1.5 text-[13px] font-medium transition-colors ${
              isDark
                ? "bg-[var(--text-primary)] text-[var(--bg-base)] hover:bg-white"
                : "bg-[#0F172A] text-white hover:bg-[#1E293B]"
            }`}
          >
            Install CLI
          </Link>
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

const INSTALL_COMMANDS: Record<PkgManager, string> = {
  npm: "npx skills add CommandOSSLabs/ai-devkit",
  pnpm: "pnpm dlx skills add CommandOSSLabs/ai-devkit",
  yarn: "yarn dlx skills add CommandOSSLabs/ai-devkit",
  bun: "bunx skills add CommandOSSLabs/ai-devkit",
};

function Hero({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [pkgManager, setPkgManager] = useState<PkgManager>("npm");

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

          {/* Corner CTA, top-right — alone, nothing stacked under it in the
              main content flow. */}
          <div className="absolute right-3 top-3 z-20 sm:right-6 sm:top-6">
            <Link
              href="/quickstart"
              onClick={(e) => navigateToSection(e, "quickstart")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E6E8EB] px-3 py-2 text-[12px] font-medium text-[#0A0B0D] shadow-lg transition-colors hover:bg-white sm:px-4 sm:py-2.5 sm:text-[13px]"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Floating install-command card, bottom-right */}
          <div className="absolute bottom-4 right-4 z-20 w-[calc(100%-2rem)] sm:bottom-6 sm:right-6 sm:w-96">
            <div className="w-full space-y-3 rounded-[14px] border border-[#1E2127] bg-[#101216]/95 p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 font-mono text-[12px] text-[#6B7280]">
                <span className="h-2 w-2 rounded-full bg-[var(--syntax-string)]" />
                <span>Documentation-first agent skills</span>
              </div>

              <p className="text-[13px] leading-[1.5] text-[#9BA1AC]">
                Quick install via skills.sh. For per-repo adaptation and upstream sync, use the vendored path instead.
              </p>

              {/* Hero stays dark regardless of site theme (photo backdrop needs
                  the contrast), so the always-forces-dark wrapper matches it
                  rather than following the light/dark toggle like the rest
                  of the page. */}
              <div className="dark">
                <ScrambledInstallCommand
                  installCommand={INSTALL_COMMANDS[pkgManager]}
                  pkgManager={pkgManager}
                  setPkgManager={setPkgManager}
                  className="border-[#1E2127] bg-[#0A0B0D]"
                  headerClassName="border-[#1E2127] bg-[#101216]/60"
                  codeClassName="px-3 py-2.5 text-[12px] text-[#E6E8EB]"
                />
              </div>

              <Link
                href="/catalog"
                onClick={(e) => navigateToSection(e, "catalog")}
                className="group flex w-full items-center justify-between text-[13px] font-medium text-[#E6E8EB] transition-opacity hover:opacity-70"
              >
                <span>Explore 32 skills</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
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
        <div className="intro-panel-text mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.4)]">
          <div className="lg:col-span-6">
            <MaskedHeading
              className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]"
              segments={[
                { text: "Three install paths." },
                { text: "Vendored with sync keeps your per-repo adaptations alive across upgrades.", variant: "secondary" },
              ]}
            />
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="glass-text-secondary text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Tell your agent to fetch the install guide and it walks itself through. Works with Claude Code, Cursor, Codex, OpenCode, and Grok.
            </p>
            <div className="glass-text-secondary mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              02.0 Quickstart →
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
            <div className="flex h-full flex-col justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[12px] font-semibold text-[#82AAFF]">RECOMMENDED</span>
                  <span className="font-mono text-[12px] text-[var(--text-tertiary)]">evolvable</span>
                </div>
                <h3 className="mb-2 text-[16px] font-semibold text-[var(--text-primary)]">Vendored with Sync</h3>
                <p className="mb-4 text-[14px] text-[var(--text-secondary)]">
                  Ask your agent to follow <code className="text-[#82AAFF]">cmk:agent-vendors</code>, then <code className="text-[#82AAFF]">cmk:sync</code> in baseline mode. Adapt freely — upgrades merge at the meaning level, not overwrite.
                </p>
              </div>
              <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3 font-mono text-[13px] text-[var(--syntax-string)]">
                <span>{'"Vendor these skills into my repo"'}</span>
              </div>
            </div>
          </div>

          <FlameWrap
            className="h-full"
            radius={16}
            height={60}
            spread={6}
            intensity={0.65}
            sparks={1.2}
            sparkSize={0.3}
            rim={2}
            melt={3}
            distortion={6}
            smoke={1}
            ember={1.5}
          >
            <div className="h-full rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
              <div className="flex h-full flex-col justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[12px] font-semibold text-[#82AAFF]">QUICK</span>
                    <span className="font-mono text-[12px] text-[var(--text-tertiary)]">read-only</span>
                  </div>
                  <h3 className="mb-2 text-[16px] font-semibold text-[var(--text-primary)]">skills.sh</h3>
                  <p className="mb-4 text-[14px] text-[var(--text-secondary)]">
                    Copies skills into each detected agent&apos;s own directory. Treat as read-only — updates overwrite local edits.
                  </p>
                </div>
                <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3 font-mono text-[13px] text-[var(--text-primary)]">
                  <div className="flex items-center justify-between">
                    <span className="truncate"><span className="text-[var(--text-tertiary)] select-none">$ </span>npx skills add CommandOSSLabs/ai-devkit</span>
                    <CopyButton text="npx skills add CommandOSSLabs/ai-devkit" className="ml-2 flex-shrink-0 p-1 text-[#6B7280] hover:text-[#9BA1AC]" />
                  </div>
                </div>
              </div>
            </div>
          </FlameWrap>

          <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
            <div className="flex h-full flex-col justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[12px] font-semibold text-[#82AAFF]">ZERO SETUP</span>
                  <span className="font-mono text-[12px] text-[var(--text-tertiary)]">Claude Code only</span>
                </div>
                <h3 className="mb-2 text-[16px] font-semibold text-[var(--text-primary)]">Plugin Trial</h3>
                <p className="mb-4 text-[14px] text-[var(--text-secondary)]">
                  Try the kit with nothing added to your repo. Immutable — can&apos;t adapt per-repo; updates replace the whole kit.
                </p>
              </div>
              <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3 font-mono text-[13px] text-[var(--text-primary)]">
                <div className="flex items-center justify-between">
                  <span className="truncate"><span className="text-[var(--text-tertiary)] select-none">$ </span>claude plugin add CommandOSSLabs/ai-devkit</span>
                  <CopyButton text="claude plugin add CommandOSSLabs/ai-devkit" className="ml-2 flex-shrink-0 p-1 text-[#6B7280] hover:text-[#9BA1AC]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4: How It Works / Architecture (§2, §4, §7) ─────────────── */

// Real docs/ folder taxonomy, verbatim from docs/README.md's directory
// structure — not a forced 1:1 stage mapping (Plan and Implement don't get
// their own folder, that's code), just the honest answer to "where does
// this actually get written."
const DOCS_FOLDERS: { name: string; purpose: string }[] = [
  { name: "decisions/", purpose: "Architecture Decision Records" },
  { name: "requirements/", purpose: "product/project requirements" },
  { name: "design/", purpose: "distilled system and feature design" },
  { name: "rules/", purpose: "engineering standards" },
  { name: "guides/", purpose: "how-to / integration guides" },
  { name: "runbooks/", purpose: "operational procedures" },
  { name: "reports/", purpose: "dated, immutable point-in-time records" },
  { name: "research/", purpose: "exploratory findings" },
  { name: "knowledge/", purpose: "gotchas, learnings, hard-won insights" },
  { name: "ai/", purpose: "AI navigation maps → source files" },
  { name: "templates/", purpose: "document templates (kit assets)" },
];

function Architecture() {
  return (
    <section id="how-it-works" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="intro-panel-text mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.4)]">
          <div className="lg:col-span-6">
            <MaskedHeading
              className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]"
              segments={[
                { text: "The SDLC is a flow of documents that build on each other." },
                { text: "The repository's /docs tree is where that flow lives.", variant: "secondary" },
              ]}
            />
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="glass-text-secondary text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Three principles keep the flow coherent: guidance over forms, coherence cascades through every stage, and progressive disclosure so agents read only what the task at hand needs.
            </p>
            <div className="glass-text-secondary mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
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
                <DecryptReveal
                  className="p-4"
                  background="#101216"
                  color="#82AAFF"
                  radius={220}
                  cell={9}
                  passthrough={0.1}
                  scramble={0.08}
                >
                  {/* Snake layout: top row reads left-to-right, drops straight
                      down at the last column (dx=0, so the connector can't
                      cross another node), bottom row continues right-to-left.
                      Fits one frame at this panel's width — no scroll needed. */}
                  <CircuitBoard
                    width={800}
                    height={330}
                    gridSize={20}
                    variant="auto"
                    nodes={[
                      { id: "requirements", x: 70, y: 60, label: "Requirements", status: "active", size: "md", icon: <Search size={16} /> },
                      { id: "design", x: 250, y: 60, label: "Design", status: "active", size: "md", icon: <Layers size={16} /> },
                      { id: "plan", x: 430, y: 60, label: "Plan", status: "active", size: "md", icon: <Workflow size={16} /> },
                      { id: "implement", x: 570, y: 60, label: "Implement", status: "active", size: "md", icon: <Code2 size={16} /> },
                      { id: "simplify", x: 570, y: 270, label: "Simplify", status: "active", size: "md", icon: <Sparkles size={16} /> },
                      { id: "review", x: 390, y: 270, label: "Review", status: "active", size: "md", icon: <ShieldCheck size={16} /> },
                      { id: "ship", x: 210, y: 270, label: "Ship", status: "active", size: "md", icon: <Zap size={16} /> },
                      // Sits outside the two-row pipeline block entirely — same
                      // size as every other stage, forking off Implement and
                      // merging back at Simplify alongside the direct connector,
                      // so it reads as a genuine parallel path (cross-cutting
                      // skills really do apply alongside the main flow, not
                      // wedged into the middle of it).
                      { id: "cross-cutting", x: 730, y: 165, label: "Cross-cutting", status: "active", size: "md", icon: <Info size={16} /> },
                    ]}
                    connections={[
                      { from: "requirements", to: "design", animated: true },
                      { from: "design", to: "plan", animated: true },
                      { from: "plan", to: "implement", animated: true },
                      { from: "implement", to: "simplify", animated: true },
                      { from: "simplify", to: "review", animated: true },
                      { from: "review", to: "ship", animated: true },
                      { from: "implement", to: "cross-cutting", animated: true, style: "straight" },
                      { from: "cross-cutting", to: "simplify", animated: true, style: "straight" },
                    ]}
                  />

                  {/* cmk:adr / glossary / learn / rule — the four skills the "Cross-cutting"
                      hub node above stands in for. Named here since the diagram has
                      room for one hub node, not four. */}
                  <div className="mt-8 flex items-center gap-3 whitespace-nowrap font-mono text-[12px] text-[var(--text-tertiary)]">
                    <span className="uppercase tracking-wide">Cross-cutting</span>
                    <span className="h-px flex-1 bg-[var(--border-subtle)]" />
                    <span className="flex items-center gap-1.5 text-[#82AAFF]"><Info size={13} /> cmk:adr</span>
                    <span className="text-[var(--border-strong)]">·</span>
                    <span className="flex items-center gap-1.5 text-[#82AAFF]"><BookOpen size={13} /> cmk:glossary</span>
                    <span className="text-[var(--border-strong)]">·</span>
                    <span className="flex items-center gap-1.5 text-[#82AAFF]"><Star size={13} /> cmk:learn</span>
                    <span className="text-[var(--border-strong)]">·</span>
                    <span className="flex items-center gap-1.5 text-[#82AAFF]"><Settings2 size={13} /> cmk:rule</span>
                  </div>
                </DecryptReveal>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
              <div className="overflow-hidden rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-2.5 font-mono text-[13px]">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[var(--syntax-string)]" />
                    <span className="text-[var(--text-secondary)]">agent session</span>
                  </div>
                  <span className="text-[var(--text-tertiary)]">skills trigger on intent, not flags</span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.6]">
                  <code>
                    <div className="flex items-center gap-2">
                      <span className="select-none text-[var(--text-tertiary)]">{">"}</span>
                      <span className="text-[var(--text-primary)]">{'"Deliver TICKET-402"'}</span>
                    </div>
                    <div className="mt-2 text-[var(--text-tertiary)]">cmk:delivery-pipeline triggers on that phrasing —</div>
                    <div className="text-[var(--text-secondary)]">[1/5] INTAKE      Resolving tracker context for TICKET-402... done</div>
                    <div className="text-[var(--text-secondary)]">[2/5] SPEC        Generating spec under docs/specs/TICKET-402.md... done</div>
                    <div className="text-[var(--text-secondary)]">[3/5] IMPLEMENT   Applying changes to src/pipeline/engine.ts... done</div>
                    <div className="text-[var(--text-secondary)]">[4/5] REVIEW      Adversarial verification pass... 0 flaws detected</div>
                    <div className="text-[var(--syntax-string)]">[5/5] SHIP        PR opened for review</div>
                    <div className="mt-2 text-[var(--text-tertiary)]">Illustrative — actual step count and timing vary by task.</div>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Where each stage's output actually lands — the diagram above shows
            what gets built when; this answers where it's written. Real
            folders from docs/README.md, not invented. */}
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-3 font-mono text-[12px] text-[var(--text-tertiary)]">
            <span className="uppercase tracking-wide">docs/ — where it all lives</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-3 lg:grid-cols-4">
            {DOCS_FOLDERS.map((f) => (
              <div key={f.name} className="flex flex-col gap-1 bg-[var(--bg-surface)] p-3">
                <span className="font-mono text-[12px] font-semibold text-[#82AAFF]">{f.name}</span>
                <span className="text-[12px] leading-[1.4] text-[var(--text-tertiary)]">{f.purpose}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4.5: Motivation (README.md § Motivation, verbatim) ─────── */

function Motivation() {
  return (
    <section className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="intro-panel-text mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.4)]">
          <div className="lg:col-span-6">
            <MaskedHeading
              className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]"
              segments={[
                { text: "AI agents lose context between sessions." },
                { text: "Structured docs are the shared state that fixes it.", variant: "secondary" },
              ]}
            />
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="glass-text-secondary text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Teams repeat requirements, re-explain decisions, and re-establish scope every time a new conversation starts — there&apos;s no shared memory between agents and humans.
            </p>
            <div className="glass-text-secondary mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              04.0 Motivation →
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] p-1">
          <div className="rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
            <p className="text-[15px] leading-[1.7] text-[var(--text-primary)]">
              This devkit solves that by using structured documentation as the shared state. The repository becomes the single source of truth — agents read it to get up to speed, humans and agents write to it to preserve decisions, and both act on the same base of knowledge.
            </p>
            <div className="mt-6 border-l-2 border-[#82AAFF]/40 pl-4">
              <p className="text-[14px] italic leading-[1.6] text-[var(--text-secondary)]">
                This is a guideline, not a rulebook. The goal is better structure, not more files. Teams can draft in Notion, Google Docs, or conversation — but finalized, development-critical context should live in the repository.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4.6: Marquee Divider (real copy, no placeholder phrases) ── */

function MarqueeDivider({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  // Dark mode: blue text on near-black, matching the rest of the terminal
  // palette. Light mode inverts to dark text on a light band — same pairing
  // React Bits Pro's own reference uses (#0a0a0a on #fafafa) — rather than
  // dropping a near-black band into an otherwise white page.
  const color = isDark ? "#82AAFF" : "#0F172A";
  // Semi-transparent, not solid — the page's ambient wave shifts through a
  // wide color range as it animates (deep blue, warm orange, near-black),
  // and a flat opaque band read as a sticker with no relationship to
  // whatever color the wave happened to be at that moment. Translucency +
  // the component's backdrop-blur lets the actual surrounding color bleed
  // through, so the band always harmonizes with what's behind it instead
  // of clashing with it half the time.
  const bandColor = isDark ? "rgba(10, 11, 13, 0.72)" : "rgba(241, 245, 249, 0.72)";

  return (
    <div className="relative h-[220px] w-full overflow-hidden">
      {/* No opaque background or border on this wrapper — the page's
          ambient wave now runs the full page (not faded past the hero), so
          a solid black box here read as an unrelated rectangle dropped on
          top of it, "viền đen" cutting across the warm glow. Only the
          marquee's own per-row band gets a solid fill; the empty vertical
          margin above/below that row (this container is taller than one
          text row) stays transparent, so the glow shows through around the
          text instead of behind a hard-edged panel. */}
      {/* Getting the fold to actually read as 3D turned out to be about
          `perspective`, not `bend`/`depth` — those two just push a panel
          further away, but a large `perspective` (800-900, what the first
          two attempts used) puts the virtual camera far back, which is a
          *flat*, subtle projection almost by definition. A small
          perspective (camera close to the scene) is what makes CSS 3D
          transforms read as dramatic — same reason a wide-angle lens
          exaggerates depth. 380 here vs. 900 before is the actual fix.
          80° (the reference preview's own value) read as too sharp/gimmicky
          once actually visible — 60° keeps a clearly readable fold without
          tipping into "look at this trick" territory. */}
      <BendingMarquee
        items={[
          "documentation-first",
          "vendor-neutral",
          "worktree-isolated",
          "free & open source",
          "the SDLC is a flow of documents",
        ]}
        separator="·"
        markSway={0}
        panelHeight={220}
        bend={60}
        depth={-200}
        perspective={380}
        speed={22}
        fontSize={22}
        fontWeight={600}
        letterSpacing={0.5}
        itemGap={32}
        bandPadding={20}
        color={color}
        bandColor={bandColor}
        className="h-full w-full"
      />
    </div>
  );
}

/* ─── Section 5: Feature Grid (§2, §9) ──────────────────────────────── */

function FeatureGrid() {
  // Every card names a real skill (skills/<id>/SKILL.md) and a real invocation —
  // "Skills trigger from natural language ... slash commands like /cmk:requirements
  // work too" (README.md § Quick Start). No fabricated CLI, paths, or stats.
  const features = [
    {
      icon: GitBranch,
      title: "Worktree Isolation",
      description: "Worktree-isolated local dev stacks — no port collisions or cross-worktree contamination, for humans, agents, and CI alike.",
      code: "/cmk:local-stack",
    },
    {
      icon: ShieldCheck,
      title: "Adversarial Review",
      description: "Multi-lens review — correctness, security, edge-cases, spec compliance — with adversarial verification before anything ships.",
      code: "/cmk:delivery-review",
    },
    {
      icon: Server,
      title: "Checked-In MCP Config",
      description: "One checked-in .mcp.json every clone and agent shares, wired per-vendor, secrets kept out of the repo.",
      code: "/cmk:mcp-config",
    },
    {
      icon: Code2,
      title: "Hierarchical AI Docs",
      description: "Progressive-disclosure docs under docs/ai/ that point an agent to the right source file instead of duplicating it.",
      code: "/cmk:codebase-docs",
    },
    {
      icon: Workflow,
      title: "Tracker Reconciliation",
      description: "One tracker-neutral reconciliation loop — Linear, GitHub Issues, or another — kept current at every phase boundary, not just at ship time.",
      code: "/cmk:delivery-workflow",
    },
    {
      icon: Zap,
      title: "Sui gRPC Guidance",
      description: "gRPC-first guidance for talking to a Sui full node — JSON-RPC was disabled on Foundation mainnet in 2026.",
      code: "/cmk:sui-sdk",
    },
  ];

  return (
    <section id="features" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="intro-panel-text mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.4)]">
          <div className="lg:col-span-6">
            <MaskedHeading
              className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]"
              segments={[
                { text: "Built for engineering rigor." },
                { text: "Every capability carries concrete, executable proof.", variant: "secondary" },
              ]}
            />
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="glass-text-secondary text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              No marketing buzzwords or hand-waving claims. High-density features designed specifically for software engineers.
            </p>
            <div className="glass-text-secondary mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              05.0 Capabilities →
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
        <div className="intro-panel-text mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.4)]">
          <div className="lg:col-span-6">
            <MaskedHeading
              className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]"
              segments={[
                { text: "Behavior-preserving diff simplification." },
                { text: "Cleans up noise before submitting code for human review.", variant: "secondary" },
              ]}
            />
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="glass-text-secondary text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Phase 3b runs by default, before review — four angles only: Reuse, Simplification, Efficiency, Altitude. No new features, no behavior changes.
            </p>
            <div className="glass-text-secondary mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              06.0 Quality →
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
                <div className="flex bg-[var(--syntax-string)]/10 text-[var(--syntax-string)] -mx-4 px-4">
                  <span className="w-8 select-none pr-4 text-right text-[var(--syntax-string)]/50">42</span>
                  <span>+  const result = await executeDeterministicFlow(task);</span>
                </div>
                <div className="flex bg-[var(--syntax-string)]/10 text-[var(--syntax-string)] -mx-4 px-4">
                  <span className="w-8 select-none pr-4 text-right text-[var(--syntax-string)]/50">43</span>
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
    { label: "Latest Tag", value: repoMeta.latestTag ?? "—" },
    { label: "Last Push", value: timeAgo(repoMeta.pushedAt) },
    { label: "Latest Commit", value: repoMeta.commitSha ?? "—" },
  ];

  return (
    <section id="benchmarks" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="intro-panel-text mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.4)]">
          <div className="lg:col-span-6">
            <MaskedHeading
              className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]"
              segments={[
                { text: "Live from the repository." },
                { text: "Fetched from GitHub at page load — no invented numbers.", variant: "secondary" },
              ]}
            />
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="glass-text-secondary text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              This section shows exactly what&apos;s publicly verifiable about{" "}
              <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className="text-[#82AAFF] hover:underline">
                CommandOSSLabs/ai-devkit
              </a>{" "}
              — nothing else.
            </p>
            <div className="glass-text-secondary mt-2 font-mono text-[13px] text-[var(--text-tertiary)]">
              07.0 Repository →
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

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-4 lg:grid-cols-7">
          {categoryCounts.map((cat) => (
            <Link
              key={cat.id}
              href="/catalog"
              onClick={(e) => navigateToSection(e, "catalog")}
              className="flex flex-col gap-1 bg-[var(--bg-surface)] p-4 transition-colors hover:bg-[var(--bg-elevated)]"
            >
              <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
                {cat.label}
              </span>
              <span className="font-mono text-[16px] font-semibold text-[#82AAFF]">
                {cat.count} skill{cat.count === 1 ? "" : "s"}
              </span>
            </Link>
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

  // Not an install command — `npx skills add --skill a b c` isn't valid syntax
  // for more than one skill. This copies a plain-language prompt instead: paste
  // it into any agent's chat (Claude, Cursor, Codex, whatever) and it fetches
  // and applies the selected skills against the current codebase — no install,
  // no repo changes, works the same way regardless of which agent runs it.
  const copyPromptText = useMemo(() => {
    const list = skills.filter((s) => selectedSkills.has(s.id)).map((s) => s.name);
    if (list.length === 0) return "npx skills add CommandOSSLabs/ai-devkit";
    return `Fetch and apply these skills from https://github.com/CommandOSSLabs/ai-devkit/tree/main/skills against this codebase: ${list.join(", ")}.`;
  }, [skills, selectedSkills]);

  return (
    <section id="catalog" className="border-b border-[var(--border-subtle)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Asymmetric Section Header */}
        <div className="intro-panel-text mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_1px_6px_rgba(0,0,0,0.4)]">
          <div className="lg:col-span-6">
            <MaskedHeading
              className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text-primary)]"
              segments={[
                { text: `${skills.length} Canonical Agent Skills.` },
                { text: "Click any skill card to open detailed specs in a Bottom Sheet.", variant: "secondary" },
              ]}
            />
          </div>
          <div className="lg:col-start-8 lg:col-span-5">
            <p className="glass-text-secondary text-[15px] leading-[1.6] text-[var(--text-secondary)]">
              Every skill is read live from skills/&lt;id&gt;/SKILL.md — name, description, and version straight from the repo.
            </p>
            <div className="mt-2 flex items-center gap-3 font-mono text-[13px]">
              <span className="glass-text-secondary text-[var(--text-tertiary)]">08.0 Skill Catalog →</span>
              <Link href="/skills" className="text-[#82AAFF] hover:underline">
                Browse every file →
              </Link>
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

        {/* Selected Skill Prompt Bar — copies an agent prompt, not an install command.
            Stacks on narrow screens: the truncated prompt preview only adds value once
            there's room to actually show some of it, so it's hidden below sm: rather
            than forcing the row to overflow past a fixed max-w that ignored viewport
            width entirely (it used to clip the Copy button off-screen on mobile). */}
        <div className="mb-8 flex flex-col gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 font-mono text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-[#82AAFF] font-semibold">{selectedSkills.size} skills selected</span>
            <span className="hidden shrink-0 text-[var(--text-disabled)] sm:inline">|</span>
            <code className="hidden min-w-0 truncate text-[var(--text-secondary)] sm:inline">{copyPromptText}</code>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedSkills(new Set())}
              className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              Clear
            </button>
            <CopyButton text={copyPromptText} title="Copy agent prompt" />
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
                          text={`npx skills add CommandOSSLabs/ai-devkit --skill ${skill.name}`}
                          title={`Copy skill command: npx skills add CommandOSSLabs/ai-devkit --skill ${skill.name}`}
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
                        <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--syntax-string)]">
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
                          <span>npx skills add CommandOSSLabs/ai-devkit --skill {activeDetailSkill.name}</span>
                        </span>
                        <CopyButton text={`npx skills add CommandOSSLabs/ai-devkit --skill ${activeDetailSkill.name}`} />
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

                      {/* A plain-language prompt, not a shell command piped into one
                          specific CLI — paste into any agent's chat (Claude, Cursor,
                          Codex, whatever) and it fetches and applies the skill against
                          the current codebase. No install, no repo changes. Distinct
                          from the Install Command above (which was duplicated here
                          before this fix). */}
                      <CopyButton
                        text={`Fetch and apply the ${activeDetailSkill.name} skill from https://github.com/CommandOSSLabs/ai-devkit/tree/main/skills/${activeDetailSkill.id} against this codebase.`}
                        label="Try Without Installing"
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
                <code className="truncate text-[var(--text-primary)]">npx skills add CommandOSSLabs/ai-devkit</code>
                <div className="ml-auto flex-shrink-0">
                  <CopyButton text="npx skills add CommandOSSLabs/ai-devkit" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/quickstart"
                onClick={(e) => navigateToSection(e, "quickstart")}
                className="rounded border border-transparent bg-[var(--text-primary)] px-5 py-2.5 text-[14px] font-medium text-[var(--bg-base)] transition-colors hover:bg-white"
              >
                Install CLI
              </Link>
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
              <span>{repoMeta.latestTag ?? "—"}</span>
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
      { label: "Quickstart", href: "/quickstart" },
      { label: "Architecture", href: "/how-it-works" },
      { label: "Capabilities", href: "/features" },
      { label: "Benchmarks", href: "/benchmarks" },
    ],
  },
  {
    title: "Skill Domains",
    links: [
      { label: "Delivery Workflows", href: "/catalog" },
      { label: "Repository Setup", href: "/catalog" },
      { label: "Agent Vendors", href: "/catalog" },
      { label: "Sui Devstack", href: "/catalog" },
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
    <footer className="w-full px-4 py-12 sm:px-6">
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
                  { Icon: Layers, href: "/catalog", label: "Catalog" },
                  { Icon: Globe, href: `${GITHUB_REPO}#readme`, label: "Docs" },
                ].map(({ Icon, href, label }) =>
                  href.startsWith("http") ? (
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
                  ) : (
                    <Link
                      key={label}
                      href={href}
                      onClick={(e) => navigateToSection(e, href.slice(1))}
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] transition-colors hover:border-[#82AAFF]/40 hover:text-[#82AAFF]"
                    >
                      <Icon size={15} />
                    </Link>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title} className="flex flex-col gap-4">
                  <h3 className="font-mono text-[12px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                    {col.title}
                  </h3>
                  <ul className="space-y-2.5 text-[13px]">
                    {col.links.map((link) =>
                      link.href.startsWith("http") ? (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            {link.label}
                          </a>
                        </li>
                      ) : (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={(e) => navigateToSection(e, link.href.slice(1))}
                            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-2 border-t border-[var(--border-subtle)] pt-6 font-mono text-[12px] text-[var(--text-tertiary)] sm:flex-row sm:justify-between">
          <span>ai-devkit · MIT License · 2026</span>
          {/* Only show the release/commit fragment once both values actually
              loaded — half of it dashed out (fetch still pending, or GitHub's
              API rate-limited this client) reads as a broken footer, not a
              loading state, so leave it out entirely rather than show it. */}
          {repoMeta.latestTag && repoMeta.commitSha ? (
            <span>
              {repoMeta.latestTag} · commit {repoMeta.commitSha}
            </span>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page Component ────────────────────────────────────────────── */

const SECTION_IDS = ["quickstart", "how-it-works", "features", "benchmarks", "catalog"] as const;

export default function TerminalDarkLandingPage({
  skills,
  initialSection,
}: {
  skills: RealSkill[];
  initialSection?: string;
}) {
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

  // A direct load of /features (hard reload, shared link) jumps straight to
  // that section — no smooth scroll, the page should just already be there.
  // Re-run once more after everything (hero image, fonts) has settled: the
  // hero's async banner image can still grow the page height after the
  // first scroll fires, drifting the target out from under the viewport.
  useEffect(() => {
    if (!initialSection) return;
    const jump = () => document.getElementById(initialSection)?.scrollIntoView({ behavior: "auto", block: "start" });
    jump();
    window.addEventListener("load", jump);
    return () => window.removeEventListener("load", jump);
  }, [initialSection]);

  // Browser back/forward: the URL changed under us via history, not a click —
  // re-sync scroll position to whatever section (or top) it now points at.
  useEffect(() => {
    const onPopState = () => {
      const slug = window.location.pathname.slice(1);
      if ((SECTION_IDS as readonly string[]).includes(slug)) {
        document.getElementById(slug)?.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        scrollPageToTop("auto");
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div
      className={`relative h-screen overflow-hidden transition-colors duration-500 selection:bg-[#82AAFF]/20 ${
        isDark ? "bg-[var(--bg-base)] text-[var(--text-primary)]" : "bg-[#F8FAFC] text-[#0F172A]"
      }`}
    >
      {/* ─── Single Luminous Wave Background (React Bits Pro Glowing Wave canvas renderer) ───
          Toned down from the original: lower glow/richness and a lighter dark-mode
          base so the animation reads as ambient light, not a heavy dark overlay.
          Fixed for the full page by design — every bare (non-card) text block
          lower on the page carries its own semi-opaque backdrop (see the
          `bareTextBackdrop` helper below) so contrast holds without having
          to confine or fade the wave itself. Sits outside ParticleScroll so
          it stays pinned to the viewport regardless of the page's own
          internal scroll position. */}
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
        className={`relative z-10 h-full transition-all duration-500 ease-out ${
          activeDetailSkill ? "blur-md scale-[0.985] brightness-90 origin-top pointer-events-none select-none" : ""
        }`}
      >
        {/* ParticleScroll owns the page's scroll container (see PAGE_SCROLL_ID
            above) — every section dissolves into sand below its formation
            line and reassembles as it scrolls back into view. Config is the
            component doc's own "current configuration" defaults. */}
        <ParticleScroll
          className="h-full w-full"
          contentId={PAGE_SCROLL_ID}
          point={0.68}
          band={420}
          density={2}
          size={1.25}
          spread={220}
          gravity={0.35}
          drift={0.7}
          swirl={60}
          stagger={0.7}
          fade={0.85}
          settle={1.2}
          smoothing={0.6}
        >
          <Nav theme={theme} setTheme={setTheme} />
          <main>
            <Hero theme={theme} />
            <Quickstart />
            <Architecture />
            <Motivation />
            <MarqueeDivider theme={theme} />
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
        </ParticleScroll>
      </div>
    </div>
  );
}
