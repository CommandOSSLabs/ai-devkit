"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { Check, Copy, ExternalLink, FolderPlus, Plus, Sparkles, X } from "lucide-react";
import {
  SKILL_COLLECTIONS,
  type CuratedSkillRef,
  type SkillCollection,
} from "@/lib/skill-collections";
import type { XThumbnailResponse } from "@/app/api/x-thumbnail/route";

export const CUSTOM_REFS_STORAGE_KEY = "ai-devkit-custom-refs-v1";
export const CUSTOM_COLLECTIONS_STORAGE_KEY = "ai-devkit-custom-collections-v1";
export const COLLECTIONS_UPDATED_EVENT = "ai-devkit-collections-updated";
export const OPEN_ADD_REF_EVENT = "ai-devkit-open-add-ref";

export type OpenAddRefDetail = {
  mode?: "ref" | "collection";
  defaultCollectionId?: string;
};

export function triggerOpenAddRefModal(detail?: OpenAddRefDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<OpenAddRefDetail>(OPEN_ADD_REF_EVENT, { detail }));
}

export function loadCustomRefs(): CuratedSkillRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_REFS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadCustomCollections(): SkillCollection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_COLLECTIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AddRefModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ref" | "collection">("ref");
  const [collections, setCollections] = useState<SkillCollection[]>(SKILL_COLLECTIONS);

  // Add Ref form state
  const [title, setTitle] = useState("");
  const [skillName, setSkillName] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [xPostUrl, setXPostUrl] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [collectionId, setCollectionId] = useState("design");
  const [tagline, setTagline] = useState("");
  const [pairsWithInput, setPairsWithInput] = useState("design, delivery-review");
  const [copiedJson, setCopiedJson] = useState(false);
  const [resolvedX, setResolvedX] = useState<XThumbnailResponse | null>(null);
  const [resolvingX, setResolvingX] = useState(false);

  // New Collection form state
  const [colTitle, setColTitle] = useState("");
  const [colSubtitle, setColSubtitle] = useState("");

  useEffect(() => {
    setCollections([...SKILL_COLLECTIONS, ...loadCustomCollections()]);

    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenAddRefDetail>).detail;
      setCollections([...SKILL_COLLECTIONS, ...loadCustomCollections()]);
      if (detail?.mode) setMode(detail.mode);
      else setMode("ref");
      if (detail?.defaultCollectionId) setCollectionId(detail.defaultCollectionId);
      setOpen(true);
    };

    window.addEventListener(OPEN_ADD_REF_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ADD_REF_EVENT, onOpen);
  }, []);

  const cleanHandle = xHandle.trim().replace(/^@/, "") || resolvedX?.handle || "builder";
  const cleanRepo = githubRepo
    .trim()
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/\/$/, "");

  useEffect(() => {
    const targetX = xPostUrl.trim() || (xHandle.trim() ? `https://x.com/${xHandle.trim().replace(/^@/, "")}` : "");
    if (!targetX) {
      setResolvedX(null);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setResolvingX(true);
      const params = new URLSearchParams({ url: targetX });
      if (cleanRepo) params.set("repo", cleanRepo);
      fetch(`/api/x-thumbnail?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: XThumbnailResponse | null) => {
          if (cancelled || !data?.ok) return;
          setResolvedX(data);
          if (!xHandle.trim() && data.handle) {
            setXHandle(`@${data.handle}`);
          }
        })
        .catch(() => {
          // ignore
        })
        .finally(() => {
          if (!cancelled) setResolvingX(false);
        });
    }, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [xPostUrl, xHandle, cleanRepo]);

  const previewRef: CuratedSkillRef = {
    id: (skillName || title || "custom-skill")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, ""),
    name: skillName.trim() || cleanRepo.split("/")[1] || "custom-skill",
    title: title.trim() || skillName.trim() || "Community Agent Skill",
    tagline:
      tagline.trim() ||
      resolvedX?.text?.slice(0, 180) ||
      "Curated community skill from X that pairs with CommandOSS workflows.",
    collectionId,
    creator: {
      name: resolvedX?.authorName || `@${cleanHandle}`,
      xHandle: cleanHandle,
      xUrl: `https://x.com/${cleanHandle}`,
      xPostUrl: xPostUrl.trim() || undefined,
      githubRepo: cleanRepo || `${cleanHandle}/skills`,
      githubUrl: cleanRepo ? `https://github.com/${cleanRepo}` : `https://x.com/${cleanHandle}`,
    },
    thumbnailUrl: resolvedX?.thumbnailUrl ?? undefined,
    xAvatarUrl: resolvedX?.avatarUrl ?? undefined,
    xBannerUrl: resolvedX?.bannerUrl ?? undefined,
    xVideoUrl: resolvedX?.videoUrl ?? undefined,
    installCommand: cleanRepo
      ? skillName.trim()
        ? `npx skills add ${cleanRepo} --skill ${skillName.trim()}`
        : `npx skills add ${cleanRepo}`
      : undefined,
    vettedAt: new Date().toISOString().slice(0, 10),
    starsOrInstalls: "Community Pick",
    pairsWithCmk: pairsWithInput
      .split(",")
      .map((s) => s.trim().replace(/^cmk:/, ""))
      .filter(Boolean),
    isNew: true,
  };

  function handleSaveRef(e: React.FormEvent) {
    e.preventDefault();
    const existing = loadCustomRefs();
    const updated = [previewRef, ...existing.filter((r) => r.id !== previewRef.id)];
    try {
      window.localStorage.setItem(CUSTOM_REFS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(COLLECTIONS_UPDATED_EVENT));
    } catch {
      // ignore storage errors
    }
    setTitle("");
    setSkillName("");
    setXHandle("");
    setXPostUrl("");
    setGithubRepo("");
    setTagline("");
    setOpen(false);
  }

  function handleSaveCollection(e: React.FormEvent) {
    e.preventDefault();
    if (!colTitle.trim()) return;
    const id = colTitle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-");
    const newCol: SkillCollection = {
      id,
      title: colTitle.trim(),
      subtitle: colSubtitle.trim() || "Custom curated skill collection",
      description: colSubtitle.trim() || "Custom curated skill collection from X.",
      badge: "Custom",
    };
    const existing = loadCustomCollections();
    const updated = [...existing.filter((c) => c.id !== id), newCol];
    try {
      window.localStorage.setItem(CUSTOM_COLLECTIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(COLLECTIONS_UPDATED_EVENT));
    } catch {
      // ignore storage errors
    }
    setColTitle("");
    setColSubtitle("");
    setOpen(false);
  }

  function handleCopyJson() {
    navigator.clipboard.writeText(JSON.stringify(previewRef, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1800);
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90vh] w-[calc(100%-1.5rem)] max-w-xl flex-col rounded-t-[24px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-[var(--text-primary)] shadow-2xl focus:outline-none sm:bottom-6 sm:rounded-[24px]">
          <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-[var(--border-strong)]" />

          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Drawer.Title className="text-[18px] font-semibold tracking-tight text-[var(--text-primary)]">
                {mode === "ref" ? "Add Skill Reference from X" : "Create New Collection"}
              </Drawer.Title>
              <Drawer.Description className="mt-1 text-[13px] text-[var(--text-secondary)]">
                {mode === "ref"
                  ? "Save an interesting agent skill you found on X to a collection for quick install & creator shoutouts."
                  : "Create a new folder collection to group community skills by domain or workflow."}
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
          <div className="mb-5 inline-flex self-start rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] p-1">
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
              Skill Reference
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
              New Collection
            </button>
          </div>

          {mode === "ref" ? (
            <form onSubmit={handleSaveRef} className="flex flex-col gap-3.5 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                  <span>Creator X Handle *</span>
                  <input
                    required
                    type="text"
                    value={xHandle}
                    onChange={(e) => setXHandle(e.target.value)}
                    placeholder="@emilkowalski_"
                    className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                  <span>Collection Folder</span>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[13px] text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  >
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                  <span>Display Title *</span>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Anatomy — Explain by Building"
                    className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                  <span>GitHub Repo (owner/repo) *</span>
                  <input
                    required
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="wheresryan22/anatomy"
                    className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                  <span>Skill Flag Name (optional)</span>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="anatomy"
                    className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                  <span>Pairs with CMK skills</span>
                  <input
                    type="text"
                    value={pairsWithInput}
                    onChange={(e) => setPairsWithInput(e.target.value)}
                    placeholder="design, codebase-docs"
                    className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                <span>Why is this skill great? (Shoutout note) *</span>
                <textarea
                  required
                  rows={2}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="One sentence explaining what makes this skill worth installing and shouting out..."
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                <span>Original X Post URL (auto-resolves X thumbnail)</span>
                <input
                  type="url"
                  value={xPostUrl}
                  onChange={(e) => setXPostUrl(e.target.value)}
                  placeholder="https://x.com/handle/status/..."
                  className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              {(resolvedX?.thumbnailUrl || resolvingX) && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-2.5">
                  {resolvedX?.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolvedX.thumbnailUrl}
                      alt="Resolved X thumbnail"
                      referrerPolicy="no-referrer"
                      className="h-14 w-24 shrink-0 rounded-lg border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="h-14 w-24 shrink-0 animate-pulse rounded-lg bg-white/5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {resolvedX?.avatarUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolvedX.avatarUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-4 w-4 rounded-full object-cover"
                        />
                      )}
                      <span className="truncate font-mono text-[11.5px] font-medium text-[var(--text-primary)]">
                        {resolvingX
                          ? "Resolving X link thumbnail..."
                          : `Resolved X thumbnail (@${resolvedX?.handle ?? cleanHandle})`}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[10.5px] text-[var(--text-tertiary)]">
                      {resolvedX?.thumbnailUrl}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  >
                    {copiedJson ? <Check size={13} className="text-[#C3E88D]" /> : <Copy size={13} />}
                    {copiedJson ? "Copied JSON" : "Copy PR JSON"}
                  </button>
                  <a
                    href={`https://github.com/CommandOSSLabs/ai-devkit/issues/new?title=${encodeURIComponent(
                      `[Collection Ref] ${previewRef.title} (@${cleanHandle})`,
                    )}&body=${encodeURIComponent(
                      `### Curated X Skill Suggestion\n\n- **Creator:** @${cleanHandle}\n- **Repo:** https://github.com/${cleanRepo}\n- **Collection:** ${collectionId}\n- **Why:** ${previewRef.tagline}\n\n\`\`\`json\n${JSON.stringify(
                        previewRef,
                        null,
                        2,
                      )}\n\`\`\``,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  >
                    Submit via GitHub
                    <ExternalLink size={12} />
                  </a>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-4 text-[13px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90"
                >
                  <Sparkles size={13} />
                  Add to Collection
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveCollection} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                <span>Collection Name *</span>
                <input
                  required
                  type="text"
                  value={colTitle}
                  onChange={(e) => setColTitle(e.target.value)}
                  placeholder="e.g. Sui & Move Ecosystem"
                  className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-[12px] text-[var(--text-secondary)]">
                <span>Subtitle / Focus</span>
                <input
                  type="text"
                  value={colSubtitle}
                  onChange={(e) => setColSubtitle(e.target.value)}
                  placeholder="e.g. Move smart contracts, Walrus & Devstack companions"
                  className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:border-[var(--accent)] focus:outline-none"
                />
              </label>

              <div className="mt-2 flex items-center justify-end gap-2 border-t border-[var(--border-subtle)] pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-9 rounded-lg border border-[var(--border-subtle)] px-3.5 text-[12.5px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-4 text-[13px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90"
                >
                  <FolderPlus size={13} />
                  Create Collection
                </button>
              </div>
            </form>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
