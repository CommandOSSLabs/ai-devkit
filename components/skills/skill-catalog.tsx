"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, FolderOpen, Search, SlidersHorizontal, X } from "lucide-react";
import type { SkillSummary } from "@/lib/skill-catalog";
import type { SkillCategoryInfo } from "@/lib/skill-types";
import { normalizeSkillId } from "@/lib/skill-id";
import { useMediaQuery } from "@/lib/use-media-query";
import { readRecentSkills } from "@/lib/recent-skills";
import { SkillDetail, type SkillHandles } from "./skill-detail";

// The catalog answers "which skill fits what I'm doing", and the panel beside
// it answers "what is this one, exactly" — so /skills never opens on an empty
// reader, and picking a card costs nothing. Both are entry points to the
// workspace, which is a peer surface here, not a later step: every card and
// the panel both offer Open workspace directly.

type SortKey = "name" | "referenced" | "files" | "recent";
type FlagKey = "evals" | "references" | "recent";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name (A–Z)" },
  { value: "referenced", label: "Most referenced" },
  { value: "files", label: "Most files" },
  { value: "recent", label: "Recently opened" },
];

// Only flags the repository can actually answer. "Has tests" would match one
// skill of 34 and "snapshot availability" is the same for every row, so
// neither earns a control.
const FLAGS: { value: FlagKey; label: string }[] = [
  { value: "evals", label: "Has evals" },
  { value: "references", label: "Has references" },
  { value: "recent", label: "Recently opened" },
];

const ALL = "all";

function hasEvals(skill: SkillSummary) {
  return skill.files.some((f) => f.name === "eval.json");
}

function hasReferences(skill: SkillSummary) {
  return skill.files.some((f) => f.relativePath.startsWith("references/"));
}

/**
 * Ranked rather than merely filtered: typing "review" should put
 * cmk:delivery-review above the eight skills that mention reviewing somewhere
 * in a paragraph. Every term has to match something, and the best field each
 * term hits decides its weight.
 */
function scoreSkill(skill: SkillSummary, terms: string[]): number {
  if (terms.length === 0) return 1;

  const id = skill.id.toLowerCase();
  const handle = skill.handle.toLowerCase();
  const title = skill.title.toLowerCase();
  const triggers = skill.triggers.join(" ").toLowerCase();
  const prose = `${skill.summary} ${skill.description}`.toLowerCase();
  const category = skill.categoryLabel.toLowerCase();
  const related = [...skill.references, ...skill.referencedBy].join(" ").toLowerCase();
  const files = skill.files.map((f) => f.relativePath).join(" ").toLowerCase();

  let total = 0;
  for (const term of terms) {
    let best = 0;
    if (id === term || handle === term) best = 100;
    else if (id.startsWith(term) || handle.startsWith(term)) best = 60;
    else if (id.includes(term) || handle.includes(term)) best = 40;
    else if (triggers.includes(term)) best = 30;
    else if (title.includes(term)) best = 25;
    else if (prose.includes(term)) best = 15;
    else if (category.includes(term)) best = 10;
    else if (related.includes(term)) best = 6;
    else if (files.includes(term)) best = 4;

    if (best === 0) return 0;
    total += best;
  }
  return total;
}

function SkillCard({
  skill,
  selected,
  splitView,
  onSelect,
}: {
  skill: SkillSummary;
  selected: boolean;
  splitView: boolean;
  onSelect: () => void;
}) {
  const [firstTrigger, ...restTriggers] = skill.triggers;

  // min-w-0: a grid item defaults to min-width:auto, so the truncating trigger
  // line would otherwise set the column's minimum width to the full phrase and
  // push the whole grid past a phone's viewport.
  return (
    <article
      aria-current={splitView && selected ? "true" : undefined}
      className={`group relative flex min-w-0 flex-col gap-2 rounded-[12px] border bg-[var(--glass-surface)] px-3.5 py-3 transition-colors ${
        splitView && selected
          ? "border-[#82AAFF]/60 bg-[#82AAFF]/[0.06]"
          : "border-[var(--border-subtle)] hover:border-[var(--border-strong)] focus-within:border-[#82AAFF]/60"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-[13px] font-semibold text-[color:var(--accent)]">
            {/* A real link so it can be opened in a new tab and read by
                assistive tech, intercepted only where a preview panel exists
                to update instead. */}
            <Link
              href={`/skills/${skill.id}`}
              aria-label={`${skill.handle}: ${skill.title}, view details`}
              onClick={(e) => {
                if (!splitView || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onSelect();
              }}
              className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-[12px] after:content-[''] focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4"
            >
              {skill.handle}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-[12.5px] text-[var(--text-primary)]">{skill.title}</p>
        </div>
        <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-[var(--border-subtle)] px-2 text-[10.5px] text-[var(--text-tertiary)]">
          {skill.categoryLabel}
        </span>
      </div>

      {/* The phrase you would actually type is the strongest recognition
          signal a card can carry. Summaries and counts live in detail, where
          someone is comparing rather than scanning. */}
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-[11.5px] text-[var(--text-tertiary)]">
          {firstTrigger ? (
            <>
              <span className="text-[var(--text-disabled)]">Use when </span>
              <span className="text-[var(--text-secondary)]">&ldquo;{firstTrigger}&rdquo;</span>
              {restTriggers.length > 0 && (
                <span className="text-[var(--text-disabled)]"> +{restTriggers.length}</span>
              )}
            </>
          ) : (
            <span className="text-[var(--text-disabled)]">No trigger phrase</span>
          )}
        </span>

        <Link
          href={`/skills/${skill.id}/workspace`}
          title={`Open the ${skill.handle} workspace`}
          aria-label={`Open the ${skill.handle} workspace`}
          className="relative z-[1] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#82AAFF]/40 bg-[#82AAFF]/10 text-[color:var(--accent)] transition-colors hover:bg-[#82AAFF]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <FolderOpen size={12} strokeWidth={1.75} aria-hidden="true" />
        </Link>
        <ArrowRight
          size={13}
          strokeWidth={1.75}
          aria-hidden="true"
          className="shrink-0 text-[var(--text-disabled)] transition-colors group-hover:text-[color:var(--accent)]"
        />
      </div>
    </article>
  );
}

export function SkillCatalog({
  skills,
  categories,
  handles,
}: {
  skills: SkillSummary[];
  categories: SkillCategoryInfo[];
  handles: SkillHandles;
}) {
  const wideViewport = useMediaQuery("(min-width: 1440px)");
  const splitView = wideViewport === true;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("name");
  const [flags, setFlags] = useState<FlagKey[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [initialised, setInitialised] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialDeepLinkSkill = useRef<string | null>(null);

  // Deep links are read once, after mount, rather than through
  // useSearchParams: this page is statically generated, and reading the
  // params during render would push it behind a Suspense boundary and trade
  // the whole catalog for a loading shell on first paint.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query") ?? params.get("q");
    const c = params.get("category");
    const s = params.get("sort");
    const has = params.get("has");
    const skill = normalizeSkillId(params.get("skill"));
    initialDeepLinkSkill.current = skill;
    if (q) setQuery(q);
    if (c) setCategory(c);
    if (s && SORTS.some((option) => option.value === s)) setSort(s as SortKey);
    if (has) setFlags(has.split(",").filter((f): f is FlagKey => FLAGS.some((x) => x.value === f)));
    if (skill && skills.some((entry) => entry.id === skill)) setSelectedId(skill);
    setRecent(readRecentSkills());
    setInitialised(true);
  }, [skills]);

  const indexed = useMemo(
    () => skills.map((skill) => ({ skill, evals: hasEvals(skill), references: hasReferences(skill) })),
    [skills],
  );

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const recentSet = new Set(recent);

    const scored = indexed
      .filter(({ skill, evals, references }) => {
        if (category !== ALL && skill.category !== category) return false;
        if (flags.includes("evals") && !evals) return false;
        if (flags.includes("references") && !references) return false;
        if (flags.includes("recent") && !recentSet.has(skill.id)) return false;
        return true;
      })
      .map(({ skill }) => ({ skill, score: scoreSkill(skill, terms) }))
      .filter((entry) => entry.score > 0);

    const byName = (a: SkillSummary, b: SkillSummary) => a.id.localeCompare(b.id);
    const rank = (id: string) => {
      const i = recent.indexOf(id);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };

    // A query is itself a ranking, so relevance wins while one is typed.
    if (terms.length > 0) {
      scored.sort((a, b) => b.score - a.score || byName(a.skill, b.skill));
      return scored.map((entry) => entry.skill);
    }

    const list = scored.map((entry) => entry.skill);
    switch (sort) {
      case "referenced":
        return list.sort((a, b) => b.referencedBy.length - a.referencedBy.length || byName(a, b));
      case "files":
        return list.sort((a, b) => b.files.length - a.files.length || byName(a, b));
      case "recent":
        return list.sort((a, b) => rank(a.id) - rank(b.id) || byName(a, b));
      default:
        return list.sort(byName);
    }
  }, [indexed, query, category, flags, sort, recent]);

  // Never leave the panel empty or pointing at a skill the filters just hid.
  useEffect(() => {
    // Let the one-time URL reader establish a deep-linked selection first;
    // otherwise this fallback can race it on the initial mount and select the
    // alphabetically first skill instead.
    if (!initialised) return;
    if (results.length === 0) return;
    if (selectedId && results.some((skill) => skill.id === selectedId)) return;
    setSelectedId(results[0].id);
  }, [initialised, results, selectedId]);

  const selected = results.find((skill) => skill.id === selectedId) ?? results[0] ?? null;

  // Narrow viewports have no panel to select into, so /skills?skill=<id>
  // means the same thing there that tapping a card does: open that skill's
  // page. Waiting for `wideViewport` to be measured (not null) keeps a
  // desktop deep link from being redirected on the first client render.
  const pendingNarrowDeepLink = wideViewport === false && initialDeepLinkSkill.current !== null;

  useEffect(() => {
    if (!initialised || wideViewport !== false) return;
    const id = initialDeepLinkSkill.current;
    if (!id) return;
    if (skills.some((skill) => skill.id === id)) {
      // A hard navigation prevents the catalog's replaceState effect from
      // restoring the old query URL after the route transition starts.
      window.location.assign(`/skills/${id}`);
    }
  }, [initialised, wideViewport, skills]);

  useEffect(() => {
    if (!initialised) return;
    // Don't rewrite the query string out from under a deep link that is still
    // waiting to be resolved into a route.
    if (pendingNarrowDeepLink) return;
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (category !== ALL) params.set("category", category);
    if (sort !== "name") params.set("sort", sort);
    if (flags.length > 0) params.set("has", flags.join(","));
    // While a panel is on screen the address bar names the skill it shows, so
    // the link someone copies matches what they are looking at.
    if (splitView && selected) params.set("skill", selected.id);
    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [query, category, sort, flags, splitView, selected, initialised, pendingNarrowDeepLink]);

  const toggleFlag = useCallback((flag: FlagKey) => {
    setFlags((prev) => (prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]));
  }, []);

  const filtered = query.trim() !== "" || category !== ALL || flags.length > 0;

  // Default view only: once someone searches, filters by category or sorts,
  // grouping by category would fight the ordering they asked for.
  const grouped = useMemo(() => {
    if (query.trim() !== "" || category !== ALL || sort !== "name") return null;
    const groups = new Map<string, SkillSummary[]>();
    for (const skill of results) {
      const list = groups.get(skill.categoryLabel) ?? [];
      list.push(skill);
      groups.set(skill.categoryLabel, list);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [results, query, category, sort]);

  const activeFilters = [
    ...(category !== ALL
      ? [{ key: `category:${category}`, label: categories.find((c) => c.id === category)?.label ?? category, clear: () => setCategory(ALL) }]
      : []),
    ...flags.map((flag) => ({
      key: `flag:${flag}`,
      label: FLAGS.find((f) => f.value === flag)?.label ?? flag,
      clear: () => toggleFlag(flag),
    })),
    ...(sort !== "name"
      ? [{ key: "sort", label: SORTS.find((o) => o.value === sort)?.label ?? sort, clear: () => setSort("name") }]
      : []),
  ];

  const controls = (
    <div className="flex shrink-0 flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={14}
            strokeWidth={1.75}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                setQuery("");
              }
            }}
            placeholder="Search skills, trigger phrases or files…"
            aria-label="Search skills"
            className="h-10 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--glass-elevated)] pl-9 pr-9 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-disabled)] focus:border-[#82AAFF]/60 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
          className={`flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-[12.5px] transition-colors ${
            filtersOpen || flags.length > 0 || sort !== "name"
              ? "border-[#82AAFF]/50 bg-[#82AAFF]/10 text-[color:var(--accent)]"
              : "border-[var(--border-subtle)] bg-[var(--glass-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <SlidersHorizontal size={13} strokeWidth={1.75} aria-hidden="true" />
          Filters
        </button>
      </div>

      {filtersOpen && (
        <div
          id="catalog-filters"
          className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--glass-elevated)] px-3 py-2"
        >
          <label className="flex items-center gap-2 text-[12.5px] text-[var(--text-secondary)]">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort skills"
              disabled={query.trim() !== ""}
              title={query.trim() !== "" ? "Results are ranked by relevance while searching" : undefined}
              className="cursor-pointer rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1 text-[12.5px] text-[var(--text-primary)] outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value} className="bg-[var(--bg-surface)]">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <span aria-hidden="true" className="h-5 w-px bg-[var(--border-subtle)]" />
          {FLAGS.map((flag) => (
            <FilterChip key={flag.value} active={flags.includes(flag.value)} onClick={() => toggleFlag(flag.value)}>
              {flag.label}
            </FilterChip>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
        <FilterChip active={category === ALL} onClick={() => setCategory(ALL)}>
          All <span className="tabular-nums opacity-60">{skills.length}</span>
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            {c.label} <span className="tabular-nums opacity-60">{c.count}</span>
          </FilterChip>
        ))}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Active filters">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={filter.clear}
              className="inline-flex h-6 items-center gap-1 rounded-full border border-[#82AAFF]/40 bg-[#82AAFF]/10 px-2 text-[11.5px] text-[color:var(--accent)] transition-colors hover:bg-[#82AAFF]/20"
            >
              {filter.label}
              <X size={10} strokeWidth={2.5} aria-hidden="true" />
              <span className="sr-only">remove this filter</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const list =
    results.length === 0 ? (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-[var(--border-subtle)] px-6 text-center">
        <p className="text-[13.5px] text-[var(--text-secondary)]">
          No skill matches{" "}
          {query.trim() ? <span className="font-mono">&ldquo;{query.trim()}&rdquo;</span> : "this filter"}.
        </p>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setCategory(ALL);
            setFlags([]);
          }}
          className="inline-flex h-8 items-center rounded-lg border border-[var(--border-subtle)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          Clear filters
        </button>
      </div>
    ) : (
      (() => {
        const gridClass = splitView ? "flex flex-col gap-2.5" : "grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3";
        const card = (skill: SkillSummary) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            selected={skill.id === selected?.id}
            splitView={splitView}
            onSelect={() => setSelectedId(skill.id)}
          />
        );

        // Category headings are the default organisation: at 34 skills across
        // nine groups, category is the first useful cut, and a flat
        // alphabetical wall makes the reader do that grouping themselves.
        if (grouped) {
          return (
            <div className="flex flex-col gap-6">
              {grouped.map(([label, group]) => (
                <section key={label} className="flex flex-col gap-2.5">
                  <h2 className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                    {label}
                    <span className="tabular-nums text-[var(--text-disabled)]">[{group.length}]</span>
                  </h2>
                  <div className={gridClass}>{group.map(card)}</div>
                </section>
              ))}
            </div>
          );
        }

        return <div className={gridClass}>{results.map(card)}</div>;
      })()
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {controls}

      <p aria-live="polite" className="sr-only">
        {results.length} of {skills.length} skills match
      </p>

      <div className={`flex min-h-0 flex-1 gap-4 ${splitView ? "" : "flex-col"}`}>
        <div className={splitView ? "min-h-0 w-[360px] shrink-0 overflow-y-auto pr-1" : "min-h-0 flex-1 overflow-y-auto pr-0.5"}>
          {list}
        </div>

        {splitView && (
          <div className={`min-h-0 flex-1 overflow-y-auto rounded-[16px] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-base)_92%,transparent)] p-5 ${splitView ? "" : "shrink-0"}`}>
            {selected ? (
              <SkillDetail skill={selected} handles={handles} variant="preview" />
            ) : (
              <p className="text-[13px] text-[var(--text-tertiary)]">
                Nothing to preview while no skill matches the filters.
              </p>
            )}
          </div>
        )}
      </div>

      {filtered && results.length > 0 && (
        <p className="shrink-0 text-[12px] text-[var(--text-tertiary)]">
          Showing {results.length} of {skills.length} skills
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[12px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
        active
          ? "border-[#82AAFF]/50 bg-[#82AAFF]/10 font-medium text-[color:var(--accent)]"
          : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

export default SkillCatalog;
