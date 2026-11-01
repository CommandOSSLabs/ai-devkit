"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import {
  CURATED_SKILL_REFS,
  SKILL_COLLECTIONS,
  type CuratedSkillRef,
  type SkillCollection,
} from "@/lib/skill-collections";
import { StackedFolderCard } from "./stacked-folder-card";
import { ExploreVisualTile, RefDetailModal } from "./curated-skill-card";
import {
  loadCustomCollections,
  loadCustomRefs,
  triggerOpenAddRefModal,
} from "./add-ref-modal";

const COLLECTION_PREVIEW_ACCENTS: Record<string, string[]> = {
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
  "context-memory": [
    "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    "linear-gradient(135deg, #38bdf8 0%, #10b981 100%)",
    "linear-gradient(135deg, #f79ad0 0%, #8b5cf6 100%)",
  ],
  harnesses: [
    "linear-gradient(135deg, #fab12f 0%, #10b981 100%)",
    "linear-gradient(135deg, #82aaff 0%, #6366f1 100%)",
    "linear-gradient(135deg, #fb923c 0%, #ec4899 100%)",
  ],
};

export function CollectionsView() {
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedRef, setSelectedRef] = useState<CuratedSkillRef | null>(null);
  const [customRefs, setCustomRefs] = useState<CuratedSkillRef[]>([]);
  const [customCollections, setCustomCollections] = useState<SkillCollection[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function syncCustomData() {
      setCustomRefs(loadCustomRefs());
      setCustomCollections(loadCustomCollections());
    }
    syncCustomData();
    window.addEventListener("ai-devkit-collections-updated", syncCustomData);
    return () =>
      window.removeEventListener("ai-devkit-collections-updated", syncCustomData);
  }, []);

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

  const allCollections = useMemo(
    () => [...SKILL_COLLECTIONS, ...customCollections],
    [customCollections],
  );

  const allRefs = useMemo(
    () => [...customRefs, ...CURATED_SKILL_REFS],
    [customRefs],
  );

  const countByCollection = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of allCollections) counts[c.id] = 0;
    for (const item of allRefs) {
      counts[item.collectionId] = (counts[item.collectionId] ?? 0) + 1;
    }
    return counts;
  }, [allCollections, allRefs]);

  const activeCollection = useMemo(
    () => allCollections.find((c) => c.id === activeCollectionId) ?? null,
    [allCollections, activeCollectionId],
  );

  const filteredRefs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRefs.filter((item) => {
      if (activeCollectionId && item.collectionId !== activeCollectionId) {
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

          {activeCollection && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerOpenAddRefModal({ mode: "ref" })}
                className="md-header-cta"
              >
                <Plus size={15} />
                <span>Add ref</span>
              </button>
            </div>
          )}
        </header>

        {/* Main Collections Stacked Folder Grid (exact marked.dev/collections layout) */}
        {!activeCollection && (
          <section aria-label="Skill collections" className="md-collections-grid">
            <StackedFolderCard
              variant="new"
              title="New collection"
              onClick={() => triggerOpenAddRefModal({ mode: "collection" })}
            />

            {allCollections.map((collection) => {
              const count = countByCollection[collection.id] ?? 0;
              return (
                <StackedFolderCard
                  key={collection.id}
                  title={collection.title}
                  countLabel={`${count} ${count === 1 ? "ref" : "refs"}`}
                  active={activeCollectionId === collection.id}
                  previewAccents={COLLECTION_PREVIEW_ACCENTS[collection.id]}
                  onClick={() => setActiveCollectionId(collection.id)}
                />
              );
            })}
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
                  onClick={() => triggerOpenAddRefModal({ mode: "ref" })}
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
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--md-text-tertiary)] hover:text-[var(--md-fg)]"
            >
              <X size={11} />
            </button>
          ) : (
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.08] font-mono text-[11px] text-[var(--md-text-tertiary)]">
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
        index={selectedRef ? allRefs.findIndex((r) => r.id === selectedRef.id) : 0}
        onClose={() => setSelectedRef(null)}
      />
    </div>
  );
}
