"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  CURATED_SKILL_REFS,
  SKILL_COLLECTIONS,
  type CuratedSkillRef,
  type SkillCollection,
} from "@/lib/skill-collections";
import { StackedFolderCard } from "./stacked-folder-card";
import { ExploreVisualTile, RefDetailModal } from "./curated-skill-card";
import {
  ADMIN_STORAGE_KEY,
  COLLECTIONS_UPDATED_EVENT,
  notifyCollectionsUpdated,
  triggerOpenAddRefModal,
} from "./add-ref-modal";

const COLLECTION_PREVIEW_ACCENTS: Record<string, string[]> = {
  "3d": [
    "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
    "linear-gradient(135deg, #f79ad0 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #c3e88d 0%, #10b981 100%)",
  ],
  design: [
    "linear-gradient(135deg, #fab12f 0%, #dd0303 100%)",
    "linear-gradient(135deg, #f79ad0 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
  ],
  explainers: [
    "linear-gradient(135deg, #82aaff 0%, #437df5 100%)",
    "linear-gradient(135deg, #c3e88d 0%, #10b981 100%)",
    "linear-gradient(135deg, #fab12f 0%, #dd0303 100%)",
  ],
  workflow: [
    "linear-gradient(135deg, #c3e88d 0%, #10b981 100%)",
    "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
    "linear-gradient(135deg, #82aaff 0%, #437df5 100%)",
  ],
  security: [
    "linear-gradient(135deg, #fb923c 0%, #dd0303 100%)",
    "linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #fab12f 0%, #ea580c 100%)",
  ],
  vendors: [
    "linear-gradient(135deg, #38bdf8 0%, #10b981 100%)",
    "linear-gradient(135deg, #fab12f 0%, #dd0303 100%)",
    "linear-gradient(135deg, #82aaff 0%, #6366f1 100%)",
  ],
  memory: [
    "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    "linear-gradient(135deg, #f79ad0 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #fab12f 0%, #10b981 100%)",
  ],
};

export function CollectionsView() {
  const [allCollections, setAllCollections] =
    useState<SkillCollection[]>(SKILL_COLLECTIONS);
  const [allRefs, setAllRefs] = useState<CuratedSkillRef[]>(CURATED_SKILL_REFS);
  const [pendingRefs, setPendingRefs] = useState<CuratedSkillRef[]>([]);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [busyPendingId, setBusyPendingId] = useState<string | null>(null);
  const [moderationError, setModerationError] = useState<string | null>(null);

  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [selectedRef, setSelectedRef] = useState<CuratedSkillRef | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchLiveCollections = useCallback(async () => {
    try {
      const adminKey =
        typeof window !== "undefined"
          ? window.localStorage.getItem(ADMIN_STORAGE_KEY) || ""
          : "";
      const res = await fetch("/api/collections?includePending=1", {
        cache: "no-store",
        headers: adminKey ? { "x-admin-secret": adminKey } : undefined,
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.collections) && data.collections.length > 0) {
        setAllCollections(data.collections);
      }
      if (Array.isArray(data?.refs) && data.refs.length > 0) {
        setAllRefs(data.refs);
      }
      if (Array.isArray(data?.pendingRefs)) {
        setPendingRefs(data.pendingRefs);
      }
    } catch {
      // Retain hydrated static state on network failure
    }
  }, []);

  useEffect(() => {
    void fetchLiveCollections();
    const handleUpdate = () => {
      void fetchLiveCollections();
    };
    window.addEventListener(COLLECTIONS_UPDATED_EVENT, handleUpdate);
    return () =>
      window.removeEventListener(COLLECTIONS_UPDATED_EVENT, handleUpdate);
  }, [fetchLiveCollections]);

  useEffect(() => {
    function handleSlashKey(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleSlashKey);
    return () => window.removeEventListener("keydown", handleSlashKey);
  }, []);

  async function handleApprovePending(id: string) {
    setBusyPendingId(id);
    setModerationError(null);
    try {
      const adminKey =
        typeof window !== "undefined"
          ? window.localStorage.getItem(ADMIN_STORAGE_KEY) || ""
          : "";
      const res = await fetch(
        `/api/collections/refs/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(adminKey ? { "x-admin-secret": adminKey } : {}),
          },
          body: JSON.stringify({
            status: "published",
            adminSecret: adminKey || undefined,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Approval failed (${res.status})`);
      }
      notifyCollectionsUpdated();
    } catch (err) {
      setModerationError(
        err instanceof Error ? err.message : "Could not approve ref",
      );
    } finally {
      setBusyPendingId(null);
    }
  }

  async function handleRejectPending(id: string) {
    setBusyPendingId(id);
    setModerationError(null);
    try {
      const adminKey =
        typeof window !== "undefined"
          ? window.localStorage.getItem(ADMIN_STORAGE_KEY) || ""
          : "";
      const res = await fetch(
        `/api/collections/refs/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(adminKey ? { "x-admin-secret": adminKey } : {}),
          },
          body: JSON.stringify({
            adminSecret: adminKey || undefined,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Delete failed (${res.status})`);
      }
      notifyCollectionsUpdated();
    } catch (err) {
      setModerationError(
        err instanceof Error ? err.message : "Could not reject ref",
      );
    } finally {
      setBusyPendingId(null);
    }
  }

  const refsByCollection = useMemo(() => {
    const map: Record<string, CuratedSkillRef[]> = {};
    for (const c of allCollections) map[c.id] = [];
    for (const item of allRefs) {
      if (!map[item.collectionId]) map[item.collectionId] = [];
      map[item.collectionId].push(item);
      for (const extraId of item.additionalCollectionIds ?? []) {
        if (!map[extraId]) map[extraId] = [];
        if (!map[extraId].some((r) => r.id === item.id)) {
          map[extraId].push(item);
        }
      }
    }
    return map;
  }, [allCollections, allRefs]);

  const countByCollection = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of allCollections) {
      counts[c.id] = refsByCollection[c.id]?.length ?? 0;
    }
    return counts;
  }, [allCollections, refsByCollection]);

  const activeCollection = useMemo(
    () => allCollections.find((c) => c.id === activeCollectionId) ?? null,
    [allCollections, activeCollectionId],
  );

  const filteredRefs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRefs.filter((item) => {
      if (
        activeCollectionId &&
        item.collectionId !== activeCollectionId &&
        !item.additionalCollectionIds?.includes(activeCollectionId)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.creator.xHandle.toLowerCase().includes(q) ||
        item.creator.githubRepo.toLowerCase().includes(q) ||
        item.collectionId.toLowerCase().includes(q) ||
        item.pairsWithCmk.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [allRefs, activeCollectionId, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-28">
      <div className="w-full">
        {/* marked.dev .collection-header */}
        <header className="mb-8 mt-7 flex min-h-[40px] flex-wrap items-center justify-between gap-4">
          {activeCollection ? (
            <div className="flex min-w-0 flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveCollectionId(null)}
                className="text-[28px] font-medium leading-[34px] tracking-[-0.02em] text-[var(--md-text-muted)] transition-colors hover:text-[var(--md-fg)]"
              >
                Collections
              </button>
              <ChevronRight size={20} className="text-[var(--md-text-muted)]" />
              <h1 className="text-[28px] font-medium leading-[34px] tracking-[-0.02em] text-[var(--md-fg)]">
                {activeCollection.title}
              </h1>
              <span className="ml-1 inline-flex items-center rounded-full bg-[var(--md-fill-control-hover)] px-2.5 py-0.5 font-mono text-[12px] font-medium tabular-nums text-[var(--md-fg)]">
                {filteredRefs.length}
              </span>
            </div>
          ) : (
            <h1 className="text-[28px] font-medium leading-[34px] tracking-[-0.02em] text-[var(--md-fg)]">
              Collections
            </h1>
          )}

          <div className="flex items-center gap-2">
            {pendingRefs.length > 0 && (
              <button
                type="button"
                onClick={() => setPendingOpen((v) => !v)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 font-mono text-[12px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-elevated)]"
              >
                <Clock size={13} className="text-[#fab12f]" />
                <span>Pending Review ({pendingRefs.length})</span>
                {pendingOpen ? (
                  <ChevronUp size={13} />
                ) : (
                  <ChevronDown size={13} />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                triggerOpenAddRefModal({
                  mode: "ref",
                  defaultCollectionId: activeCollection?.id,
                })
              }
              className="md-header-cta"
            >
              <Plus size={15} />
              <span>Add ref</span>
            </button>
          </div>
        </header>

        {/* Collapsible Pending Review Queue Banner */}
        {pendingRefs.length > 0 && pendingOpen && (
          <section
            aria-label="Pending Review Queue"
            className="mb-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">
                  Pending Community Submissions ({pendingRefs.length})
                </h2>
                <p className="text-[12px] text-[var(--text-secondary)]">
                  Approve with your Admin Passkey to publish live to PostgreSQL immediately.
                </p>
              </div>
              {moderationError && (
                <span className="font-mono text-[11.5px] text-red-400">
                  {moderationError}
                </span>
              )}
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
              {pendingRefs.map((item) => {
                const isBusy = busyPendingId === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[13.5px] font-medium text-[var(--text-primary)]">
                          {item.title}
                        </span>
                        <span className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--text-secondary)]">
                          {item.collectionId}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                          @{item.creator.xHandle}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-[12px] text-[var(--text-secondary)]">
                        {item.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleApprovePending(item.id)}
                        className="inline-flex h-8 items-center gap-1 rounded-full bg-[var(--text-primary)] px-3 text-[11.5px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {isBusy ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Check size={12} />
                        )}
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleRejectPending(item.id)}
                        className="inline-flex h-8 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 text-[11.5px] text-[var(--text-secondary)] transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
                      >
                        <Trash2 size={12} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Main Collections Stacked Folder Grid (exact marked.dev/collections layout) */}
        {!activeCollection && (
          <section aria-label="Skill collections" className="md-collections-grid">
            <StackedFolderCard
              variant="new"
              title="Propose collection"
              onClick={() => triggerOpenAddRefModal({ mode: "collection" })}
            />

            {allCollections.map((collection) => {
              const items = refsByCollection[collection.id] ?? [];
              const count = countByCollection[collection.id] ?? 0;
              return (
                <StackedFolderCard
                  key={collection.id}
                  title={collection.title}
                  countLabel={`${count} ${count === 1 ? "ref" : "refs"}`}
                  active={activeCollectionId === collection.id}
                  previewAccents={
                    COLLECTION_PREVIEW_ACCENTS[collection.id] ??
                    COLLECTION_PREVIEW_ACCENTS.design
                  }
                  previewItems={items}
                  onClick={() => setActiveCollectionId(collection.id)}
                />
              );
            })}
          </section>
        )}

        {/* Featured X Video Posts Showcase on root /skills/collections */}
        {!activeCollection && query.trim().length === 0 && (
          <section aria-label="Featured X Video Posts" className="mt-14">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-medium tracking-[-0.015em] text-[var(--md-fg)]">
                  X Video Posts
                </h2>
                <p className="mt-1 text-[13.5px] text-[var(--md-text-tertiary)]">
                  Auto-enriched live from X status URLs, GitHub repositories, and{" "}
                  <a
                    href="https://github.com/CommandOSSLabs/ai-devkit/blob/main/lib/skill-collections.ts"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[12px] text-[var(--md-fg)] underline decoration-[var(--md-card-border)] underline-offset-4 hover:decoration-[var(--md-fg)]"
                  >
                    lib/skill-collections.ts
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://github.com/CommandOSSLabs/ai-devkit/blob/main/lib/skill-collections.ts"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 font-mono text-[11.5px] text-[var(--md-text-tertiary)] transition-colors hover:text-[var(--md-fg)]"
                >
                  <span>GitHub sync</span>
                  <ExternalLink size={11} />
                </a>
                <button
                  type="button"
                  onClick={() => triggerOpenAddRefModal({ mode: "ref" })}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--md-card-border)] bg-[var(--md-card-pill-bg)] px-3.5 text-[12px] font-medium text-[var(--md-fg)] transition-colors hover:bg-[var(--md-fill-control-hover)]"
                >
                  <Sparkles size={13} className="text-[var(--md-card-cmd)]" />
                  <span>+ Add Link Live</span>
                </button>
              </div>
            </div>

            <div className="md-ref-grid">
              {allRefs
                .filter((item) =>
                  Boolean(
                    item.xVideoUrl ||
                      item.creator.xPostUrl ||
                      item.source?.postUrl,
                  ),
                )
                .map((item, index) => (
                  <ExploreVisualTile
                    key={item.id}
                    item={item}
                    index={index}
                    onSelect={(ref) => setSelectedRef(ref)}
                  />
                ))}
            </div>
          </section>
        )}

        {/* Drill-down or Search Results Visual Masonry Grid */}
        {(activeCollection || query.trim().length > 0) && (
          <section
            aria-label="Collection references"
            className={activeCollection ? "mt-2" : "mt-10"}
          >
            {activeCollection && (
              <p className="mb-6 max-w-2xl text-[14px] leading-[21px] text-[var(--md-text-tertiary)]">
                {activeCollection.description}
              </p>
            )}

            {filteredRefs.length > 0 ? (
              <div className="md-ref-grid">
                {filteredRefs.map((item, index) => (
                  <ExploreVisualTile
                    key={item.id}
                    item={item}
                    index={index}
                    onSelect={(ref) => setSelectedRef(ref)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[28px] bg-[var(--md-bento-surface)] px-6 py-16 text-center shadow-[inset_0_0_0_1px_var(--md-ring-menu)]">
                <p className="text-[15px] font-medium text-[var(--md-fg)]">
                  No refs in this view yet
                </p>
                <p className="mt-1 text-[13px] text-[var(--md-text-tertiary)]">
                  Add a skill reference from X or clear your search query.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    triggerOpenAddRefModal({
                      mode: "ref",
                      defaultCollectionId: activeCollection?.id,
                    })
                  }
                  className="md-header-cta mt-4"
                >
                  <Plus size={15} />
                  <span>Add ref</span>
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Floating Bottom Search & Filter Dock (.search-dock) */}
      <div className="md-search-dock">
        <label className="md-search-float">
          <Search size={16} className="shrink-0 text-[var(--md-text-tertiary)]" />
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search collections and refs"
            className="h-full w-full min-w-0 flex-1 bg-transparent text-[14px] text-[var(--md-fg)] placeholder:text-[var(--md-text-tertiary)] focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--md-card-pill-bg)] text-[var(--md-text-tertiary)] hover:text-[var(--md-fg)]"
            >
              <X size={11} />
            </button>
          ) : (
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--md-card-pill-bg)] font-mono text-[11px] text-[var(--md-text-tertiary)]">
              /
            </span>
          )}
        </label>

        {activeCollectionId && (
          <button
            type="button"
            onClick={() => setActiveCollectionId(null)}
            title="Show all collections"
            className="md-filter-float"
            data-active="true"
          >
            <SlidersHorizontal size={16} />
          </button>
        )}
      </div>

      <RefDetailModal
        item={selectedRef}
        index={
          selectedRef ? allRefs.findIndex((r) => r.id === selectedRef.id) : 0
        }
        onClose={() => setSelectedRef(null)}
      />
    </div>
  );
}
