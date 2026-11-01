"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import {
  Check,
  Copy,
  ExternalLink,
  FileCode2,
  FolderPlus,
  GitPullRequest,
  Loader2,
  Play,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  type CuratedSkillRef,
  type SkillCollection,
} from "@/lib/skill-collections";
import type { XThumbnailResponse } from "@/app/api/x-thumbnail/route";

export const OPEN_ADD_REF_EVENT = "ai-devkit-open-add-ref";

export type OpenAddRefDetail = {
  mode?: "ref" | "collection";
  defaultCollectionId?: string;
};

export function triggerOpenAddRefModal(detail?: OpenAddRefDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<OpenAddRefDetail>(OPEN_ADD_REF_EVENT, { detail }));
}

// Retained as empty-array helpers so Collections/Explore strictly render git-tracked data
export function loadCustomRefs(): CuratedSkillRef[] {
  return [];
}

export function loadCustomCollections(): SkillCollection[] {
  return [];
}

const REF_TS_SNIPPET = `{
  id: "owner-skill-name",
  name: "skill-name",
  title: "Skill Display Title",
  tagline:
    "One-sentence summary of what the skill does and why it pairs well with CMK workflows.",
  collectionId: "design", // "design" | "explainers" | "workflow" | "security" | "vendors" | "memory"
  creator: {
    name: "Creator Name",
    xHandle: "creator_handle",
    xUrl: "https://x.com/creator_handle",
    xPostUrl: "https://x.com/creator_handle/status/...",
    githubRepo: "owner/repo",
    githubUrl: "https://github.com/owner/repo",
  },
  thumbnailUrl: "https://pbs.twimg.com/...",
  xAvatarUrl: "https://pbs.twimg.com/profile_images/...",
  installCommand: "npx skills add owner/repo --skill skill-name",
  vettedAt: "2026-10-12",
  starsOrInstalls: "1.2k stars",
  pairsWithCmk: ["design", "delivery-review"],
}`;

const COLLECTION_TS_SNIPPET = `{
  id: "sui-move",
  title: "Sui & Move",
  subtitle: "Move smart contracts, Walrus & Devstack companions",
  description:
    "Vetted community skills for Move package development, Sui gRPC clients, and local Devstack testing.",
  badge: "Ecosystem",
}`;

const GITHUB_EDIT_COLLECTIONS_URL =
  "https://github.com/CommandOSSLabs/ai-devkit/edit/main/lib/skill-collections.ts";
const GITHUB_COMPANION_GUIDE_URL =
  "https://github.com/CommandOSSLabs/ai-devkit/blob/main/docs/guides/companion-skills.md";

const GITHUB_NEW_REF_ISSUE_URL = `https://github.com/CommandOSSLabs/ai-devkit/issues/new?title=${encodeURIComponent(
  "[Skill Ref] <skill-name> by @<x-handle>",
)}&body=${encodeURIComponent(
  [
    "### Nominate a Skill Reference for AI DevKit Collections",
    "",
    "- **Skill Title:** ",
    "- **Collection (`design` | `explainers` | `workflow` | `security` | `vendors` | `memory`):** ",
    "- **Creator X Handle:** @",
    "- **Original X Post URL:** https://x.com/...",
    "- **GitHub Repository (`owner/repo`):** https://github.com/...",
    "- **Install Command:** `npx skills add <owner>/<repo>`",
    "- **Pinned Commit SHA / Tag:** ",
    "- **Pairs with `cmk:*` skills:** ",
    "- **Why it belongs in the collection:** ",
  ].join("\n"),
)}`;

const GITHUB_NEW_COLLECTION_ISSUE_URL = `https://github.com/CommandOSSLabs/ai-devkit/issues/new?title=${encodeURIComponent(
  "[New Collection] <Collection Title>",
)}&body=${encodeURIComponent(
  [
    "### Propose a New Skill Collection Folder",
    "",
    "- **Collection ID (`kebab-case`):** ",
    "- **Collection Title:** ",
    "- **Subtitle:** ",
    "- **Description & Scope:** ",
    "- **Initial 3+ Vetted X Skill References (X URLs + GitHub Repos):** ",
    "  1. ",
    "  2. ",
    "  3. ",
  ].join("\n"),
)}`;

export function AddRefModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ref" | "collection">("ref");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [xInputUrl, setXInputUrl] = useState(
    "https://x.com/benjitaylor/status/2116593247854453244",
  );
  const [previewData, setPreviewData] = useState<XThumbnailResponse | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenAddRefDetail>).detail;
      if (detail?.mode) setMode(detail.mode);
      else setMode("ref");
      setOpen(true);
    };

    window.addEventListener(OPEN_ADD_REF_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ADD_REF_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open || mode !== "ref") return;
    const trimmed = xInputUrl.trim();
    if (!trimmed) {
      setPreviewData(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoadingPreview(true);
      try {
        const res = await fetch(`/api/x-thumbnail?url=${encodeURIComponent(trimmed)}`);
        const data = (await res.json()) as XThumbnailResponse;
        if (!cancelled) {
          setPreviewData(data.ok ? data : null);
        }
      } catch {
        if (!cancelled) setPreviewData(null);
      } finally {
        if (!cancelled) setLoadingPreview(false);
      }
    }, 280);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, mode, xInputUrl]);

  const dynamicRefSnippet = previewData
    ? `{
  id: "${(previewData.installCommand?.split("--skill")[1]?.trim() || previewData.handle || "custom-skill").toLowerCase().replace(/[^a-z0-9-]+/g, "-")}",
  name: "${previewData.installCommand?.split("--skill")[1]?.trim() || previewData.githubRepo || previewData.handle || "skill-name"}",
  title: "${(previewData.text?.split(/[.\n]/)[0] || `${previewData.authorName ?? previewData.handle} Skill`).replace(/"/g, '\\"').slice(0, 68)}",
  tagline:
    "${(previewData.text?.replace(/\s+/g, " ").trim() || "One-sentence summary of what the skill does.").replace(/"/g, '\\"').slice(0, 160)}",
  collectionId: "design",
  creator: {
    name: "${(previewData.authorName || previewData.handle || "Creator").replace(/"/g, '\\"')}",
    xHandle: "${previewData.handle || "handle"}",
    xUrl: "https://x.com/${previewData.handle || "handle"}",
    xPostUrl: "${previewData.xUrl}",
    githubRepo: "${previewData.githubRepo || `${previewData.handle || "owner"}/skills`}",
    githubUrl: "https://github.com/${previewData.githubRepo || `${previewData.handle || "owner"}/skills`}",
  },
  thumbnailUrl: "${previewData.thumbnailUrl || ""}",
  xAvatarUrl: "${previewData.avatarUrl || ""}",${previewData.videoUrl ? `\n  xVideoUrl: "${previewData.videoUrl}",` : ""}
  installCommand: "${previewData.installCommand || `npx skills add ${previewData.githubRepo || `${previewData.handle || "owner"}/skills`}`}",
  vettedAt: "${new Date().toISOString().slice(0, 10)}",
  pairsWithCmk: ["design", "delivery-review"],
}`
    : REF_TS_SNIPPET;

  const activeSnippet = mode === "ref" ? dynamicRefSnippet : COLLECTION_TS_SNIPPET;

  function handleCopySnippet() {
    navigator.clipboard.writeText(activeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 1800);
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90vh] w-[calc(100%-1.5rem)] max-w-xl flex-col rounded-t-[24px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-[var(--text-primary)] shadow-2xl focus:outline-none sm:bottom-6 sm:rounded-[24px]">
          <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-[var(--border-strong)]" />

          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <GitPullRequest size={12} className="text-[#c3e88d]" />
                <span>Git-Tracked Curation · Maintainer Vetted</span>
              </div>
              <Drawer.Title className="text-[18px] font-semibold tracking-tight text-[var(--text-primary)]">
                {mode === "ref"
                  ? "Submit a Skill Reference via GitHub PR"
                  : "Propose a New Collection via GitHub PR"}
              </Drawer.Title>
              <Drawer.Description className="mt-1 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
                {mode === "ref"
                  ? "Collections are curated directly in Git rather than a public database. Maintainers and contributors add vetted X skill references via Pull Request."
                  : "Collection folders are version-controlled in the repository. Add a new collection in lib/skill-collections.ts and open a Pull Request."}
              </Drawer.Description>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close modal"
              className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="mb-4 inline-flex self-start rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] p-1">
            <button
              type="button"
              onClick={() => setMode("ref")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12.5px] font-medium transition-colors ${
                mode === "ref"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Plus size={13} />
              Skill Reference Guide
            </button>
            <button
              type="button"
              onClick={() => setMode("collection")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12.5px] font-medium transition-colors ${
                mode === "collection"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <FolderPlus size={13} />
              New Collection Guide
            </button>
          </div>

          {/* Scrollable Guide Body */}
          <div className="flex flex-col gap-3.5 overflow-y-auto pr-1">
            {/* Live X Post Unfurler & Video Preview when mode === "ref" */}
            {mode === "ref" && (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5">
                <div className="flex items-center justify-between gap-2 text-[13px] font-medium text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-[11px] text-white">
                      1
                    </span>
                    <span>Paste X Post URL to Preview Video & Auto-Fill Entry</span>
                  </div>
                  {loadingPreview && (
                    <Loader2 size={13} className="animate-spin text-[var(--text-tertiary)]" />
                  )}
                </div>

                <div className="mt-2.5">
                  <input
                    type="url"
                    value={xInputUrl}
                    onChange={(e) => setXInputUrl(e.target.value)}
                    placeholder="https://x.com/benjitaylor/status/2116593247854453244"
                    className="h-9 w-full rounded-lg border border-white/10 bg-[#0b0b0e] px-3 font-mono text-[12px] text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none"
                  />
                </div>

                {previewData && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#111115] p-3">
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        {previewData.avatarUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={previewData.avatarUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="h-5 w-5 shrink-0 rounded-full object-cover"
                          />
                        )}
                        <span className="truncate font-mono text-[12px] font-medium text-white">
                          {previewData.authorName ?? `@${previewData.handle}`}
                        </span>
                        <span className="truncate font-mono text-[11px] text-white/55">
                          @{previewData.handle}
                        </span>
                      </div>
                      {previewData.videoUrl && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-[#38bdf8]">
                          <Play size={9} className="fill-current" />
                          <span>X Video Post</span>
                        </span>
                      )}
                    </div>

                    {previewData.videoUrl ? (
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
                        <video
                          src={previewData.videoUrl}
                          poster={previewData.thumbnailUrl ?? undefined}
                          controls
                          playsInline
                          muted
                          loop
                          autoPlay
                          className="aspect-[16/10] w-full object-cover"
                        />
                      </div>
                    ) : previewData.thumbnailUrl ? (
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewData.thumbnailUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="aspect-[16/10] w-full object-cover"
                        />
                      </div>
                    ) : null}

                    {previewData.text && (
                      <p className="mt-2.5 line-clamp-2 text-[12px] leading-[1.45] text-white/80">
                        {previewData.text}
                      </p>
                    )}

                    {previewData.installCommand && (
                      <div className="mt-2 rounded-lg bg-white/[0.06] px-2.5 py-1.5 font-mono text-[11px] text-[#c3e88d]">
                        $ {previewData.installCommand}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step: Vetting Criteria */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5">
              <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-primary)]">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-[11px] text-white">
                  {mode === "ref" ? "2" : "1"}
                </span>
                <span>
                  {mode === "ref"
                    ? "Check Vetting & Pairing Criteria"
                    : "Define Collection Scope & Initial Refs"}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5 pl-7 text-[12.5px] leading-[1.5] text-[var(--text-secondary)]">
                {mode === "ref" ? (
                  <>
                    <li className="flex items-start gap-2">
                      <ShieldCheck size={13} className="mt-0.5 shrink-0 text-[#c3e88d]" />
                      <span>
                        Public GitHub repo with a valid <code className="font-mono text-white/90">SKILL.md</code> (installable via <code className="font-mono text-white/90">npx skills add</code>) and no unvetted binary/curl-pipe execution.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck size={13} className="mt-0.5 shrink-0 text-[#c3e88d]" />
                      <span>
                        Original creator X post/profile link (<code className="font-mono text-white/90">xPostUrl</code> / <code className="font-mono text-white/90">xUrl</code>) so the X thumbnail and shoutout card resolve cleanly.
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <ShieldCheck size={13} className="mt-0.5 shrink-0 text-[#c3e88d]" />
                      <span>
                        Group at least <strong>3 vetted X skill references</strong> under a clear SDLC or ecosystem theme so the translucent folder fan-out is populated.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck size={13} className="mt-0.5 shrink-0 text-[#c3e88d]" />
                      <span>
                        Document how the collection complements core <code className="font-mono text-white/90">cmk:*</code> skills in <code className="font-mono text-white/90">docs/guides/companion-skills.md</code>.
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Step 2: Code Snippet to Add in PR */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-primary)]">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-[11px] text-white">
                    {mode === "ref" ? "3" : "2"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FileCode2 size={14} className="text-[var(--text-secondary)]" />
                    <span>
                      Add to{" "}
                      <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11.5px] text-white">
                        lib/skill-collections.ts
                      </code>
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 font-mono text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                  {copiedSnippet ? (
                    <>
                      <Check size={12} className="text-[#c3e88d]" />
                      <span className="text-[#c3e88d]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy template</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-1.5 pl-7 text-[12px] text-[var(--text-tertiary)]">
                {mode === "ref"
                  ? "Append your skill entry to CURATED_SKILL_REFS (and add a row in docs/guides/companion-skills.md):"
                  : "Append your folder entry to SKILL_COLLECTIONS in lib/skill-collections.ts:"}
              </p>

              <pre className="mt-2.5 max-h-48 overflow-x-auto rounded-lg border border-white/[0.06] bg-[#0b0b0e] p-3 font-mono text-[11px] leading-[1.55] text-[#d4d4d8]">
                <code>{activeSnippet}</code>
              </pre>
            </div>

            {/* Step 3: Open PR or Issue */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5">
              <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-primary)]">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-[11px] text-white">
                  {mode === "ref" ? "4" : "3"}
                </span>
                <span>Open a Pull Request (or Nominate via Issue)</span>
              </div>
              <p className="mt-1.5 pl-7 text-[12.5px] leading-[1.5] text-[var(--text-secondary)]">
                Admins and contributors can edit{" "}
                <code className="font-mono text-white/90">lib/skill-collections.ts</code>{" "}
                directly on GitHub to open a PR, or file a structured GitHub Issue for maintainers to vet and merge.
              </p>
            </div>

            {/* Footer Action Links */}
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-4">
              <a
                href={GITHUB_COMPANION_GUIDE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              >
                <span>Vetting Guide</span>
                <ExternalLink size={12} />
              </a>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={
                    mode === "ref"
                      ? GITHUB_NEW_REF_ISSUE_URL
                      : GITHUB_NEW_COLLECTION_ISSUE_URL
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3.5 text-[12.5px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
                >
                  <span>Nominate via Issue</span>
                  <ExternalLink size={12} />
                </a>

                <a
                  href={GITHUB_EDIT_COLLECTIONS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-4 text-[12.5px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90"
                >
                  <GitPullRequest size={13} />
                  <span>Open PR on GitHub</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
