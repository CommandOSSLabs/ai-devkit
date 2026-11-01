"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import type { SkillSummary } from "@/lib/skill-catalog";
import {
  CURATED_SKILL_REFS,
  SKILL_COLLECTIONS,
  type CuratedSkillRef,
} from "@/lib/skill-collections";
import { ExploreVisualTile, RefDetailModal } from "./curated-skill-card";
import { loadCustomRefs, triggerOpenAddRefModal } from "./add-ref-modal";

export function ExploreView({ skills = [] }: { skills?: SkillSummary[] }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRef, setSelectedRef] = useState<CuratedSkillRef | null>(null);
  const [customRefs, setCustomRefs] = useState<CuratedSkillRef[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cmkExploreRefs = useMemo<CuratedSkillRef[]>(
    () =>
      skills.slice(0, 8).map((s) => ({
        id: `cmk-core-${s.id}`,
        name: s.id,
        title: `${s.handle} — ${s.title}`,
        tagline: s.purpose || s.description,
        collectionId: "workflow",
        creator: {
          name: "CommandOSS AI DevKit",
          xHandle: "CommandOSSLabs",
          xUrl: "https://github.com/CommandOSSLabs/ai-devkit",
          githubRepo: `CommandOSSLabs/ai-devkit (skills/${s.id})`,
          githubUrl: `https://github.com/CommandOSSLabs/ai-devkit/tree/main/skills/${s.id}`,
        },
        installCommand: `npx skills add CommandOSSLabs/ai-devkit --skill ${s.id}`,
        pinnedSha: "main",
        vettedAt: "2026-04",
        pairsWithCmk: s.references.slice(0, 2),
        starsOrInstalls: `v${s.version}`,
        featured: true,
      })),
    [skills],
  );

  useEffect(() => {
    function syncCustom() {
      setCustomRefs(loadCustomRefs());
    }
    syncCustom();
    window.addEventListener("ai-devkit-collections-updated", syncCustom);
    return () =>
      window.removeEventListener("ai-devkit-collections-updated", syncCustom);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Interleave X companion refs and core CMK skills for a rich visual masonry feed
  const allExploreRefs = useMemo(() => {
    const combined: CuratedSkillRef[] = [...customRefs];
    const maxLen = Math.max(CURATED_SKILL_REFS.length, cmkExploreRefs.length);
    for (let i = 0; i < maxLen; i += 1) {
      if (CURATED_SKILL_REFS[i]) combined.push(CURATED_SKILL_REFS[i]);
      if (i % 2 === 1 && cmkExploreRefs[Math.floor(i / 2)]) {
        combined.push(cmkExploreRefs[Math.floor(i / 2)]);
      }
    }
    return combined;
  }, [customRefs, cmkExploreRefs]);

  const filteredRefs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allExploreRefs.filter((item) => {
      if (activeFilter === "x-companions" && item.id.startsWith("cmk-core-")) {
        return false;
      }
      if (activeFilter === "cmk-core" && !item.id.startsWith("cmk-core-")) {
        return false;
      }
      if (
        activeFilter !== "all" &&
        activeFilter !== "x-companions" &&
        activeFilter !== "cmk-core" &&
        item.collectionId !== activeFilter
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
  }, [allExploreRefs, activeFilter, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-28 pt-2">
      {/* marked.dev/explore 4-column visual masonry grid (.ref-grid) */}
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
        <div className="mt-12 flex flex-col items-center justify-center rounded-[28px] bg-[var(--md-bento-surface)] px-6 py-20 text-center shadow-[inset_0_0_0_1px_var(--md-ring-menu)]">
          <p className="text-[15px] font-medium text-[var(--md-fg)]">
            No matching skill references
          </p>
          <p className="mt-1 text-[13px] text-[var(--md-text-tertiary)]">
            Try another search keyword, reset the filter, or add a new skill ref.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveFilter("all");
              }}
              className="md-header-cta"
            >
              Reset filter
            </button>
            <button
              type="button"
              onClick={() => triggerOpenAddRefModal({ mode: "ref" })}
              className="md-header-cta"
            >
              <Plus size={15} />
              <span>Add ref</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Filter Popover above the dock */}
      {filterOpen && (
        <div className="fixed bottom-[84px] left-1/2 z-40 flex w-[92vw] max-w-[540px] -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-[22px] bg-[#171717]/95 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_20px_48px_rgba(0,0,0,0.75)] backdrop-blur-xl">
          {[
            { id: "all", label: "All Refs" },
            { id: "x-companions", label: "X Companion Drops" },
            { id: "cmk-core", label: "Core CMK Skills" },
            ...SKILL_COLLECTIONS.map((c) => ({ id: c.id, label: c.title })),
          ].map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.id);
                  setFilterOpen(false);
                }}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  active
                    ? "bg-white text-[#141413]"
                    : "bg-white/[0.06] text-[#b4b4b4] hover:bg-white/[0.12] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Fixed Bottom Search & Filter Dock (.search-dock) — matches Screenshot 2 */}
      <div className="md-search-dock">
        <label className="md-search-float">
          <Search size={16} className="shrink-0 text-[var(--md-text-tertiary)]" />
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search skills and references"
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

        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          aria-expanded={filterOpen}
          aria-label="Filter references"
          title="Filter references"
          data-active={activeFilter !== "all" || filterOpen ? "true" : undefined}
          className="md-filter-float"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* marked.dev-style Ref Detail Overlay Modal */}
      <RefDetailModal
        item={selectedRef}
        index={
          selectedRef
            ? allExploreRefs.findIndex((r) => r.id === selectedRef.id)
            : 0
        }
        onClose={() => setSelectedRef(null)}
      />
    </div>
  );
}
