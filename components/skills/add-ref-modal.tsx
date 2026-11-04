"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FolderPlus,
  GitPullRequest,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Plus,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import {
  SKILL_COLLECTIONS,
  detectSocialPlatform,
  getSocialPlatformLabel,
  resolveRefAvatar,
  resolveRefHandle,
  resolveRefPlatform,
  resolveRefPostUrl,
  resolveRefThumbnail,
  resolveRefVideoUrl,
  type CuratedSkillRef,
  type SkillCollection,
  type SocialPlatform,
} from "@/lib/skill-collections";

export const OPEN_ADD_REF_EVENT = "ai-devkit-open-add-ref";
export const COLLECTIONS_UPDATED_EVENT = "ai-devkit-collections-updated";

export const ADMIN_STORAGE_KEY = "cmk-collections-admin-key";

export type OpenAddRefDetail = {
  mode?: "ref" | "collection";
  defaultCollectionId?: string;
  editRef?: CuratedSkillRef;
};

export function triggerOpenAddRefModal(detail?: OpenAddRefDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<OpenAddRefDetail>(OPEN_ADD_REF_EVENT, { detail }));
}

export function notifyCollectionsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COLLECTIONS_UPDATED_EVENT));
}

// Retained as empty-array helpers for backward compatibility
export function loadCustomRefs(): CuratedSkillRef[] {
  return [];
}

export function loadCustomCollections(): SkillCollection[] {
  return [];
}

const GITHUB_EDIT_COLLECTIONS_URL =
  "https://github.com/CommandOSSLabs/ai-devkit/edit/main/lib/skill-collections.ts";

const SUGGESTED_CMK_SKILLS = [
  "design",
  "delivery-ship",
  "codebase-docs",
  "requirements",
  "delivery-spec-plan",
  "delivery-review",
  "rule",
  "toolchain",
  "project-layout",
  "agent-vendors",
];

function slugifyId(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function AddRefModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ref" | "collection">("ref");
  const [collections, setCollections] = useState<SkillCollection[]>(SKILL_COLLECTIONS);

  // Admin passkey (persisted in localStorage)
  const [adminPasskey, setAdminPasskey] = useState("");

  // Ref mode state
  const [editingRefId, setEditingRefId] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [showCustomThumb, setShowCustomThumb] = useState(false);
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState("");
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillMessage, setAutoFillMessage] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [skillId, setSkillId] = useState("");
  const [tagline, setTagline] = useState("");
  const [collectionId, setCollectionId] = useState("design");
  const [additionalCollectionIds, setAdditionalCollectionIds] = useState<string[]>([]);
  const [installCommand, setInstallCommand] = useState("");
  const [pairsWithCmkInput, setPairsWithCmkInput] = useState("design, codebase-docs");
  const [stylePrompt, setStylePrompt] = useState("");

  // Enriched metadata from auto-parse or editRef
  const [creatorName, setCreatorName] = useState("");
  const [creatorHandle, setCreatorHandle] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>("x");
  const [resolvedThumbUrl, setResolvedThumbUrl] = useState("");
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState("");
  const [resolvedAvatarUrl, setResolvedAvatarUrl] = useState("");
  const [resolvedBannerUrl, setResolvedBannerUrl] = useState("");
  const [starsOrInstalls, setStarsOrInstalls] = useState("");
  const [pinnedSha, setPinnedSha] = useState("main");

  // Collection mode state
  const [colId, setColId] = useState("");
  const [colTitle, setColTitle] = useState("");
  const [colSubtitle, setColSubtitle] = useState("");
  const [colDescription, setColDescription] = useState("");
  const [colBadge, setColBadge] = useState("Ecosystem");

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const refreshCollections = useCallback(async () => {
    try {
      const res = await fetch("/api/collections", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.collections) && data.collections.length > 0) {
        setCollections(data.collections);
      }
    } catch {
      // Keep static fallback
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(ADMIN_STORAGE_KEY) || "";
      setAdminPasskey(saved);
    }
  }, []);

  function handleAdminKeyChange(val: string) {
    setAdminPasskey(val);
    if (typeof window !== "undefined") {
      if (val.trim()) {
        window.localStorage.setItem(ADMIN_STORAGE_KEY, val.trim());
      } else {
        window.localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }
  }

  const resetRefForm = useCallback((defaultColId?: string, editRef?: CuratedSkillRef) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setAutoFillMessage(null);

    if (editRef) {
      setEditingRefId(editRef.id);
      const postUrl =
        resolveRefPostUrl(editRef) ||
        editRef.creator.githubUrl ||
        editRef.creator.xUrl ||
        "";
      setSourceUrl(postUrl);
      setCustomThumbnailUrl("");
      setShowCustomThumb(false);
      setTitle(editRef.title);
      setSkillId(editRef.id);
      setTagline(editRef.tagline);
      setCollectionId(editRef.collectionId || defaultColId || "design");
      setAdditionalCollectionIds(editRef.additionalCollectionIds ?? []);
      setInstallCommand(editRef.installCommand ?? "");
      setPairsWithCmkInput((editRef.pairsWithCmk ?? []).join(", "));
      setStylePrompt(editRef.stylePrompt ?? "");
      setCreatorName(editRef.creator.name);
      setCreatorHandle(resolveRefHandle(editRef));
      setGithubRepo(editRef.creator.githubRepo);
      setGithubUrl(editRef.creator.githubUrl);
      setPlatform(resolveRefPlatform(editRef));
      setResolvedThumbUrl(resolveRefThumbnail(editRef));
      setResolvedVideoUrl(resolveRefVideoUrl(editRef) ?? "");
      setResolvedAvatarUrl(resolveRefAvatar(editRef));
      setResolvedBannerUrl(editRef.source?.bannerUrl ?? editRef.xBannerUrl ?? "");
      setStarsOrInstalls(editRef.starsOrInstalls ?? "");
      setPinnedSha(editRef.pinnedSha ?? "main");
      return;
    }

    setEditingRefId(null);
    setSourceUrl("");
    setCustomThumbnailUrl("");
    setShowCustomThumb(false);
    setTitle("");
    setSkillId("");
    setTagline("");
    setCollectionId(defaultColId || "design");
    setAdditionalCollectionIds([]);
    setInstallCommand("");
    setPairsWithCmkInput("design, codebase-docs");
    setStylePrompt("");
    setCreatorName("");
    setCreatorHandle("");
    setGithubRepo("");
    setGithubUrl("");
    setPlatform("x");
    setResolvedThumbUrl("");
    setResolvedVideoUrl("");
    setResolvedAvatarUrl("");
    setResolvedBannerUrl("");
    setStarsOrInstalls("");
    setPinnedSha("main");
  }, []);

  const resetCollectionForm = useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setColId("");
    setColTitle("");
    setColSubtitle("");
    setColDescription("");
    setColBadge("Ecosystem");
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenAddRefDetail>).detail;
      const nextMode = detail?.mode ?? "ref";
      setMode(nextMode);
      resetRefForm(detail?.defaultCollectionId, detail?.editRef);
      resetCollectionForm();
      void refreshCollections();
      setOpen(true);
    };

    window.addEventListener(OPEN_ADD_REF_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ADD_REF_EVENT, onOpen);
  }, [refreshCollections, resetCollectionForm, resetRefForm]);

  const handleAutoFill = useCallback(
    async (overrideUrl?: string) => {
      const targetUrl = (overrideUrl ?? sourceUrl).trim();
      if (!targetUrl) {
        setSubmitError("Paste an X status, GitHub repository, or website URL first.");
        return;
      }

      setIsAutoFilling(true);
      setSubmitError(null);
      setAutoFillMessage(null);

      try {
        const res = await fetch("/api/collections/auto-parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: targetUrl,
            customThumbnailUrl: customThumbnailUrl.trim() || undefined,
            collectionId: collectionId || undefined,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || `Auto-fill failed (${res.status})`);
        }

        const parsed: Partial<CuratedSkillRef> = data?.ref ?? data?.preview ?? data;
        if (parsed.title) setTitle(parsed.title);
        if (parsed.id || parsed.name) {
          setSkillId(parsed.id || parsed.name || slugifyId(parsed.title || ""));
        } else if (parsed.title) {
          setSkillId(slugifyId(parsed.title));
        }
        if (parsed.tagline) setTagline(parsed.tagline);
        if (parsed.collectionId) setCollectionId(parsed.collectionId);
        if (Array.isArray(parsed.additionalCollectionIds)) {
          setAdditionalCollectionIds(parsed.additionalCollectionIds);
        }
        if (parsed.installCommand) setInstallCommand(parsed.installCommand);
        if (Array.isArray(parsed.pairsWithCmk) && parsed.pairsWithCmk.length > 0) {
          setPairsWithCmkInput(parsed.pairsWithCmk.join(", "));
        }
        if (parsed.stylePrompt) setStylePrompt(parsed.stylePrompt);

        const nextCreator = parsed.creator;
        if (nextCreator?.name) setCreatorName(nextCreator.name);
        if (nextCreator?.xHandle || parsed.source?.handle) {
          setCreatorHandle(
            (nextCreator?.xHandle || parsed.source?.handle || "").replace(/^@/, ""),
          );
        }
        if (nextCreator?.githubRepo) setGithubRepo(nextCreator.githubRepo);
        if (nextCreator?.githubUrl) setGithubUrl(nextCreator.githubUrl);

        const nextPlatform =
          parsed.source?.platform ??
          nextCreator?.platform ??
          detectSocialPlatform(targetUrl);
        setPlatform(nextPlatform);

        const thumb =
          customThumbnailUrl.trim() ||
          parsed.source?.thumbnailUrl ||
          parsed.thumbnailUrl ||
          parsed.source?.bannerUrl ||
          parsed.xBannerUrl ||
          "";
        if (thumb) setResolvedThumbUrl(thumb);

        const vid = parsed.source?.videoUrl || parsed.xVideoUrl || "";
        setResolvedVideoUrl(vid);

        const avatar = parsed.source?.avatarUrl || parsed.xAvatarUrl || "";
        if (avatar) setResolvedAvatarUrl(avatar);

        const banner = parsed.source?.bannerUrl || parsed.xBannerUrl || "";
        if (banner) setResolvedBannerUrl(banner);

        if (parsed.starsOrInstalls) setStarsOrInstalls(parsed.starsOrInstalls);
        if (parsed.pinnedSha) setPinnedSha(parsed.pinnedSha);

        setAutoFillMessage(
          vid
            ? "Auto-filled metadata + native HD video stream"
            : "Auto-filled metadata & social preview",
        );
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Could not auto-parse URL",
        );
      } finally {
        setIsAutoFilling(false);
      }
    },
    [collectionId, customThumbnailUrl, sourceUrl],
  );

  function handleUrlPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").trim();
    if (pasted && /^https?:\/\//i.test(pasted) && !title.trim()) {
      setSourceUrl(pasted);
      setTimeout(() => {
        void handleAutoFill(pasted);
      }, 40);
    }
  }

  function toggleAdditionalCollection(id: string) {
    if (id === collectionId) return;
    setAdditionalCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  const parsedPairsWithCmk = useMemo(() => {
    return pairsWithCmkInput
      .split(",")
      .map((s) => s.trim().replace(/^cmk:/i, ""))
      .filter(Boolean);
  }, [pairsWithCmkInput]);

  function toggleCmkChip(cmkSlug: string) {
    const exists = parsedPairsWithCmk.includes(cmkSlug);
    const next = exists
      ? parsedPairsWithCmk.filter((item) => item !== cmkSlug)
      : [...parsedPairsWithCmk, cmkSlug];
    setPairsWithCmkInput(next.join(", "));
  }

  const effectiveThumbnail = customThumbnailUrl.trim() || resolvedThumbUrl;
  const effectiveVideo = resolvedVideoUrl;
  const effectiveHandle = (creatorHandle || "community").replace(/^@/, "");
  const effectiveAvatar =
    resolvedAvatarUrl || `https://unavatar.io/x/${effectiveHandle}`;
  const effectivePlatform = sourceUrl
    ? detectSocialPlatform(sourceUrl)
    : platform;

  async function handlePublishRef(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const finalTitle = title.trim();
    const finalId = slugifyId(skillId.trim() || finalTitle || "custom-skill");
    if (!finalTitle || !finalId) {
      setSubmitError("Title and Skill Slug are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanUrl = sourceUrl.trim();
      const handle = effectiveHandle;
      const repo =
        githubRepo.trim() ||
        (cleanUrl.includes("github.com/")
          ? cleanUrl
              .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
              .split("/")
              .slice(0, 2)
              .join("/")
          : `${handle}/${finalId}`);
      const repoUrl =
        githubUrl.trim() ||
        (cleanUrl.includes("github.com/")
          ? cleanUrl
          : `https://github.com/${repo}`);

      const refPayload: CuratedSkillRef = {
        id: editingRefId || finalId,
        name: finalId,
        title: finalTitle,
        tagline:
          tagline.trim() ||
          `Curated companion skill ${finalTitle} by @${handle}.`,
        collectionId: collectionId || "design",
        additionalCollectionIds: additionalCollectionIds.filter(
          (c) => c !== collectionId,
        ),
        creator: {
          name: creatorName.trim() || handle,
          xHandle: handle,
          xUrl:
            effectivePlatform === "x"
              ? `https://x.com/${handle}`
              : cleanUrl || `https://x.com/${handle}`,
          xPostUrl:
            effectivePlatform === "x" && cleanUrl.includes("/status/")
              ? cleanUrl
              : undefined,
          platform: effectivePlatform,
          handle,
          postUrl: cleanUrl || undefined,
          githubRepo: repo,
          githubUrl: repoUrl,
        },
        source: {
          platform: effectivePlatform,
          postUrl: cleanUrl || undefined,
          profileUrl:
            effectivePlatform === "x" ? `https://x.com/${handle}` : undefined,
          handle,
          thumbnailUrl: effectiveThumbnail || undefined,
          videoUrl: effectiveVideo || undefined,
          avatarUrl: effectiveAvatar || undefined,
          bannerUrl: resolvedBannerUrl || undefined,
        },
        thumbnailUrl: effectiveThumbnail || undefined,
        xVideoUrl: effectiveVideo || undefined,
        xAvatarUrl: effectiveAvatar || undefined,
        xBannerUrl: resolvedBannerUrl || undefined,
        installCommand:
          installCommand.trim() || `npx skills add ${repo}`,
        stylePrompt: stylePrompt.trim() || undefined,
        pinnedSha: pinnedSha || "main",
        vettedAt: new Date().toISOString().slice(0, 10),
        starsOrInstalls: starsOrInstalls || `@${handle}`,
        pairsWithCmk:
          parsedPairsWithCmk.length > 0 ? parsedPairsWithCmk : ["design"],
        featured: true,
        isNew: true,
      };

      const passkey = adminPasskey.trim();
      const res = await fetch("/api/collections/refs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(passkey ? { "x-admin-secret": passkey } : {}),
        },
        body: JSON.stringify({
          ...refPayload,
          ref: refPayload,
          adminSecret: passkey || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Failed to save skill (${res.status})`);
      }

      const returnedStatus =
        data?.status ?? data?.ref?.status ?? (passkey ? "published" : "pending_review");

      setSubmitSuccess(
        returnedStatus === "published"
          ? "Published live! Updating collection grid..."
          : "Submitted to the Pending Review queue!",
      );

      notifyCollectionsUpdated();

      setTimeout(() => {
        setOpen(false);
        setSubmitSuccess(null);
      }, 600);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to publish skill reference",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateCollection(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const finalTitle = colTitle.trim();
    const finalId = slugifyId(colId.trim() || finalTitle);
    if (!finalTitle || !finalId) {
      setSubmitError("Collection ID and Title are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: SkillCollection = {
        id: finalId,
        title: finalTitle,
        subtitle: colSubtitle.trim() || `${finalTitle} companion skills`,
        description:
          colDescription.trim() ||
          `Curated companion skills and references for ${finalTitle}.`,
        badge: colBadge.trim() || "Ecosystem",
      };

      const passkey = adminPasskey.trim();
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(passkey ? { "x-admin-secret": passkey } : {}),
        },
        body: JSON.stringify({
          ...payload,
          collection: payload,
          adminSecret: passkey || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.error || `Failed to create collection (${res.status})`,
        );
      }

      setSubmitSuccess("Collection folder created live!");
      notifyCollectionsUpdated();

      setTimeout(() => {
        setOpen(false);
        setSubmitSuccess(null);
      }, 600);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create collection",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasAdminKey = adminPasskey.trim().length > 0;

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-[calc(100%-1.25rem)] max-w-2xl flex-col rounded-t-[24px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-[var(--text-primary)] shadow-2xl focus:outline-none sm:bottom-5 sm:rounded-[24px] sm:p-6">
          <div className="mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-full bg-[var(--border-strong)]" />

          {/* Header */}
          <div className="mb-3.5 flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <Sparkles size={12} className="text-[var(--md-card-cmd)]" />
                <span>Auto-Ingest Engine · Live PostgreSQL Sync</span>
              </div>
              <Drawer.Title className="text-[18px] font-semibold tracking-tight text-[var(--text-primary)]">
                {mode === "ref"
                  ? editingRefId
                    ? `Edit Skill Reference (${editingRefId})`
                    : "Add a Skill Reference Live"
                  : "Create a New Collection Folder"}
              </Drawer.Title>
              <Drawer.Description className="mt-0.5 text-[12.5px] leading-[1.45] text-[var(--text-secondary)]">
                {mode === "ref"
                  ? "Paste any X status, GitHub repo, Threads, YouTube, or Web URL — metadata, video, and install commands auto-fill in ~1 second."
                  : "Add a new collection folder to organize curated skills across /skills/collections and /skills/explore."}
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
          <div className="mb-3.5 inline-flex self-start rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] p-1">
            <button
              type="button"
              onClick={() => {
                setMode("ref");
                setSubmitError(null);
                setSubmitSuccess(null);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12px] font-medium transition-colors ${
                mode === "ref"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Plus size={13} />
              Add Skill Ref
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("collection");
                setSubmitError(null);
                setSubmitSuccess(null);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12px] font-medium transition-colors ${
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
            <form
              onSubmit={handlePublishRef}
              className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto pr-1"
            >
              {/* Auto-Ingest URL Bar */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3">
                <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  1. Paste X Post / GitHub Repo / Social URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    onPaste={handleUrlPaste}
                    placeholder="https://x.com/.../status/... or https://github.com/owner/repo"
                    className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 font-mono text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void handleAutoFill()}
                    disabled={isAutoFilling}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--text-primary)] px-3.5 text-[12px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isAutoFilling ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Parsing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        <span>Auto-Fill</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Collapsible Custom Thumbnail Override */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomThumb((v) => !v)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    <ImageIcon size={11} />
                    <span>Custom Thumbnail URL Override (optional)</span>
                    {showCustomThumb ? (
                      <ChevronUp size={11} />
                    ) : (
                      <ChevronDown size={11} />
                    )}
                  </button>

                  {autoFillMessage && (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--md-card-cmd)]">
                      <Check size={11} />
                      <span>{autoFillMessage}</span>
                    </span>
                  )}
                </div>

                {showCustomThumb && (
                  <div className="mt-2">
                    <input
                      type="url"
                      value={customThumbnailUrl}
                      onChange={(e) => setCustomThumbnailUrl(e.target.value)}
                      placeholder="https://github.com/owner/repo/raw/main/docs/light-dark.png"
                      className="h-8 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 font-mono text-[11.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Live Card Preview */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--text-tertiary)]">
                    Live Card Preview
                  </span>
                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
                    {getSocialPlatformLabel(effectivePlatform)} · @{effectiveHandle}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[#0b0b0e] sm:col-span-5">
                    {effectiveVideo ? (
                      <video
                        src={effectiveVideo}
                        poster={effectiveThumbnail || undefined}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : effectiveThumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={effectiveThumbnail}
                        alt={title || "Preview thumbnail"}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-3 text-center font-mono text-[11px] text-white/45">
                        <Sparkles size={16} />
                        <span>Video / Thumbnail Preview</span>
                      </div>
                    )}
                    {effectiveVideo && (
                      <span className="absolute left-2 top-2 rounded-full bg-black/75 px-2 py-0.5 font-mono text-[9.5px] text-white">
                        MP4 Video
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-2 sm:col-span-7">
                    <div>
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={effectiveAvatar}
                          alt={`@${effectiveHandle}`}
                          referrerPolicy="no-referrer"
                          className="h-4 w-4 rounded-full object-cover"
                        />
                        <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                          @{effectiveHandle}
                        </span>
                        <span className="ml-auto rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                          {collectionId}
                        </span>
                      </div>
                      <h4 className="mt-1 line-clamp-1 text-[14px] font-semibold text-[var(--text-primary)]">
                        {title || "Skill Title Preview"}
                      </h4>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-[1.4] text-[var(--text-secondary)]">
                        {tagline ||
                          "Paste a URL above and click Auto-Fill to extract description, media, and install command."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-1.5 font-mono text-[10.5px]">
                      <span className="truncate text-[var(--md-card-cmd)]">
                        <Terminal size={11} className="mr-1 inline" />
                        {installCommand || "npx skills add owner/repo"}
                      </span>
                      {stylePrompt.trim() && (
                        <span className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 text-[10px] text-[var(--text-primary)]">
                          Copy Style ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Form Fields */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingRefId && !skillId) {
                        setSkillId(slugifyId(e.target.value));
                      }
                    }}
                    placeholder="Blank Page — Motion Graphics Prompt Expander"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Skill Slug (id) *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillId}
                    onChange={(e) => setSkillId(slugifyId(e.target.value))}
                    placeholder="blank-page"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                  Tagline / Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Concise 1-2 sentence summary of what this skill does and why it stands out..."
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-2.5 text-[12.5px] leading-[1.45] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                />
              </div>

              {/* Primary + Additional Collections */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Primary Collection
                  </label>
                  <select
                    value={collectionId}
                    onChange={(e) => {
                      const next = e.target.value;
                      setCollectionId(next);
                      setAdditionalCollectionIds((prev) =>
                        prev.filter((id) => id !== next),
                      );
                    }}
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 text-[12.5px] text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
                  >
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Additional Collections (Multi-Folder)
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {collections
                      .filter((c) => c.id !== collectionId)
                      .map((c) => {
                        const selected = additionalCollectionIds.includes(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => toggleAdditionalCollection(c.id)}
                            className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition-colors ${
                              selected
                                ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-base)]"
                                : "border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                            }`}
                          >
                            {selected ? `✓ ${c.id}` : `+ ${c.id}`}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Install Command & Creator Handle */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Install Command
                  </label>
                  <input
                    type="text"
                    value={installCommand}
                    onChange={(e) => setInstallCommand(e.target.value)}
                    placeholder="npx skills add owner/repo"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12px] text-[var(--md-card-cmd)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Creator @handle
                  </label>
                  <input
                    type="text"
                    value={creatorHandle}
                    onChange={(e) => setCreatorHandle(e.target.value.replace(/^@/, ""))}
                    placeholder="blak3shao"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pairs with cmk:* */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="font-mono text-[11px] text-[var(--text-secondary)]">
                    Pairs with cmk:*
                  </label>
                  <span className="font-mono text-[10.5px] text-[var(--text-tertiary)]">
                    Click chips or type comma-separated
                  </span>
                </div>
                <input
                  type="text"
                  value={pairsWithCmkInput}
                  onChange={(e) => setPairsWithCmkInput(e.target.value)}
                  placeholder="design, delivery-ship, codebase-docs"
                  className="h-8 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[11.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {SUGGESTED_CMK_SKILLS.map((slug) => {
                    const active = parsedPairsWithCmk.includes(slug);
                    return (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => toggleCmkChip(slug)}
                        className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] transition-colors ${
                          active
                            ? "bg-[var(--bg-elevated)] font-medium text-[var(--md-card-cmd)] ring-1 ring-[var(--border-strong)]"
                            : "bg-[var(--bg-base)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                        }`}
                      >
                        cmk:{slug}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional UI/UX Style Prompt */}
              <div>
                <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                  UI/UX Style Prompt (optional — enables 1-click &ldquo;Copy Style&rdquo; button on card)
                </label>
                <textarea
                  rows={2}
                  value={stylePrompt}
                  onChange={(e) => setStylePrompt(e.target.value)}
                  placeholder="Optional reusable design/motion prompt for agents..."
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-2.5 font-mono text-[11.5px] leading-[1.45] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                />
              </div>

              {submitError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-400">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[12px] font-medium text-[var(--md-card-cmd)]">
                  <Check size={14} />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {/* Instant Publish Bar (Footer) */}
              <div className="mt-1 flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <KeyRound
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    type="password"
                    value={adminPasskey}
                    onChange={(e) => handleAdminKeyChange(e.target.value)}
                    placeholder="Admin passkey for instant live publish (optional)"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] pl-8 pr-3 font-mono text-[11.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!hasAdminKey && (
                    <a
                      href={GITHUB_EDIT_COLLECTIONS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    >
                      <GitPullRequest size={12} />
                      <span>Or open PR on GitHub</span>
                      <ExternalLink size={11} />
                    </a>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-4 text-[12.5px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : hasAdminKey ? (
                      <>
                        <Sparkles size={13} />
                        <span>Publish Live Now</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} />
                        <span>Submit for Review</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleCreateCollection}
              className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto pr-1"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={colTitle}
                    onChange={(e) => {
                      setColTitle(e.target.value);
                      if (!colId) setColId(slugifyId(e.target.value));
                    }}
                    placeholder="Sui & Move"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Collection ID (kebab-case) *
                  </label>
                  <input
                    type="text"
                    required
                    value={colId}
                    onChange={(e) => setColId(slugifyId(e.target.value))}
                    placeholder="sui-move"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    value={colSubtitle}
                    onChange={(e) => setColSubtitle(e.target.value)}
                    placeholder="Move smart contracts, Walrus & Devstack companions"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                    Category Badge
                  </label>
                  <input
                    type="text"
                    value={colBadge}
                    onChange={(e) => setColBadge(e.target.value)}
                    placeholder="Ecosystem"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 font-mono text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] text-[var(--text-secondary)]">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={colDescription}
                  onChange={(e) => setColDescription(e.target.value)}
                  placeholder="Vetted community skills for Move package development, Sui gRPC clients, and local Devstack testing."
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-2.5 text-[12.5px] leading-[1.45] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                />
              </div>

              {submitError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-400">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[12px] font-medium text-[var(--md-card-cmd)]">
                  <Check size={14} />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <div className="mt-1 flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <KeyRound
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    type="password"
                    value={adminPasskey}
                    onChange={(e) => handleAdminKeyChange(e.target.value)}
                    placeholder="Admin passkey for instant live publish (optional)"
                    className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] pl-8 pr-3 font-mono text-[11.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-4 text-[12.5px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus size={13} />
                      <span>Create Collection Live</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
