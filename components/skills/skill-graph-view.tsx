"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowDownLeft, ArrowUpRight, List, RotateCcw, Share2, X } from "lucide-react";
import type { SkillGraph, SkillNode } from "@/lib/skill-graph";
import {
  clearStoredLayout,
  layoutSkillGraph,
  readStoredLayout,
  writeStoredLayout,
  type SkillGraphPosition,
} from "@/lib/skill-graph-layout";
import { normalizeSkillId } from "@/lib/skill-id";
import { useMediaQuery } from "@/lib/use-media-query";

// Three things live here and nowhere else: which view is showing, which skill
// is selected, and what the URL says about both. The canvas is a renderer it
// mounts; the inspector is rendered by this component directly, so its content
// never waits on the canvas or on an animation finishing — the previous
// version could leave the panel blank behind an exit transition that never
// completed.

const SkillGraphCanvas = dynamic(
  () => import("./skill-graph-canvas").then((m) => m.SkillGraphCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-[13px] text-[var(--text-tertiary)]">
        Loading the map…
      </div>
    ),
  },
);

export type SkillGraphViewMode = "canvas" | "list";

const CANVAS_MIN_WIDTH = "(min-width: 768px)";

function toggleClass(on: boolean) {
  return `inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[12px] transition-colors ${
    on
      ? "bg-[var(--bg-elevated)] font-medium text-[var(--text-primary)]"
      : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
  }`;
}

function RelationList({
  title,
  icon,
  color,
  ids,
  byId,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  ids: string[];
  byId: Map<string, SkillNode>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.07em] text-[var(--text-tertiary)]">
        <span style={{ color }}>{icon}</span>
        {title} ({ids.length})
      </p>
      {ids.length === 0 ? (
        <p className="text-[12px] italic text-[var(--text-disabled)]">none</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {ids.map((id) => (
            <Link
              key={id}
              href={`/skills/${id}`}
              className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[11.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--skill-node)] hover:text-[color:var(--skill-node)]"
            >
              {byId.get(id)?.label ?? `cmk:${id}`}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SkillGraphView({ graph }: { graph: SkillGraph }) {
  const reduce = useReducedMotion() ?? false;
  const wideEnoughForCanvas = useMediaQuery(CANVAS_MIN_WIDTH);
  const showMiniMap = useMediaQuery("(min-width: 1280px)") === true;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [requestedView, setRequestedView] = useState<SkillGraphViewMode | null>(null);
  const [positions, setPositions] = useState<Record<string, SkillGraphPosition>>({});
  const [initialised, setInitialised] = useState(false);
  const deepLinkRead = useRef(false);

  const layout = useMemo(() => layoutSkillGraph(graph.nodes), [graph.nodes]);
  const byId = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph.nodes]);

  // Read once, ever: the sync effect below rewrites the query string, and a
  // second read would pick up what it just wrote.
  useEffect(() => {
    if (deepLinkRead.current) return;
    deepLinkRead.current = true;

    const params = new URLSearchParams(window.location.search);
    const skill = normalizeSkillId(params.get("skill") ?? params.get("focus"));
    if (skill && graph.nodes.some((n) => n.id === skill)) setSelectedId(skill);

    const view = params.get("view");
    if (view === "canvas" || view === "list") setRequestedView(view);

    const stored = readStoredLayout();
    if (stored) setPositions(stored);
    setInitialised(true);
  }, [graph.nodes]);

  // Canvas where there is room for one, list where there is not, and an
  // explicit ?view= wins on any viewport.
  const view: SkillGraphViewMode =
    requestedView ?? (wideEnoughForCanvas === false ? "list" : "canvas");

  useEffect(() => {
    if (!initialised || wideEnoughForCanvas === null) return;
    const params = new URLSearchParams(window.location.search);
    if (selectedId) params.set("skill", selectedId);
    else params.delete("skill");
    if (requestedView) params.set("view", requestedView);
    else params.delete("view");
    params.delete("focus");
    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [initialised, selectedId, requestedView, wideEnoughForCanvas]);

  const select = useCallback((id: string) => {
    setSelectedId((current) => (id === "" || current === id ? null : id));
  }, []);

  const handlePositions = useCallback((next: Record<string, SkillGraphPosition>) => {
    setPositions(next);
    writeStoredLayout(next);
  }, []);

  const resetLayout = useCallback(() => {
    clearStoredLayout();
    setPositions({});
  }, []);

  const selected = selectedId ? (byId.get(selectedId) ?? null) : null;
  const relations = useMemo(() => {
    if (!selectedId) return { out: [] as string[], inc: [] as string[] };
    return {
      out: graph.edges.filter((e) => e.source === selectedId).map((e) => e.target).sort(),
      inc: graph.edges.filter((e) => e.target === selectedId).map((e) => e.source).sort(),
    };
  }, [graph.edges, selectedId]);

  const inspector = selected ? (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-[13px] font-semibold text-[color:var(--skill-node)]">
            {selected.label}
          </p>
          <p className="mt-0.5 text-[11.5px] text-[var(--text-tertiary)]">
            {selected.categoryLabel} · {selected.outDegree} out · {selected.inDegree} in
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          aria-label="Clear selection"
          className="shrink-0 rounded-md p-1 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-3">
        {selected.summary && (
          <p className="line-clamp-4 text-[12.5px] leading-6 text-[var(--text-secondary)]">{selected.summary}</p>
        )}
        <RelationList
          title="References"
          icon={<ArrowUpRight size={12} />}
          color="var(--skill-edge-out)"
          ids={relations.out}
          byId={byId}
        />
        <RelationList
          title="Referenced by"
          icon={<ArrowDownLeft size={12} />}
          color="var(--skill-edge-in)"
          ids={relations.inc}
          byId={byId}
        />
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={`/skills/${selected.id}`}
            className="inline-flex h-8 items-center rounded-lg border border-[var(--border-subtle)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            Open detail
          </Link>
          <Link
            href={`/skills/${selected.id}/workspace`}
            className="inline-flex h-8 items-center rounded-lg border border-[var(--skill-node)]/40 bg-[var(--skill-node)]/10 px-3 text-[12.5px] font-medium text-[color:var(--skill-node)] transition-colors hover:bg-[var(--skill-node)]/20"
          >
            Open workspace
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center px-6 text-center">
      <p className="text-[13px] leading-[1.6] text-[var(--text-tertiary)]">
        Pick a skill to trace what it references and what references it.
      </p>
    </div>
  );

  if (graph.nodes.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-[16px] border border-dashed border-[var(--border-subtle)]">
        <p className="text-[13px] text-[var(--text-tertiary)]">No skills were found in this build.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Visualization view"
          className="flex items-center gap-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--glass-elevated)] p-0.5"
        >
          <button
            type="button"
            onClick={() => setRequestedView("canvas")}
            aria-pressed={view === "canvas"}
            className={toggleClass(view === "canvas")}
          >
            <Share2 size={12} strokeWidth={1.75} />
            Canvas
          </button>
          <button
            type="button"
            onClick={() => setRequestedView("list")}
            aria-pressed={view === "list"}
            className={toggleClass(view === "list")}
          >
            <List size={12} strokeWidth={1.75} />
            List
          </button>
        </div>

        {view === "canvas" && (
          <button
            type="button"
            onClick={resetLayout}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            Reset layout
          </button>
        )}

        {view === "canvas" && (
          <p className="ml-auto hidden items-center gap-3 text-[11px] text-[var(--text-tertiary)] sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-px w-4" style={{ background: "var(--skill-edge-out)" }} /> references
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-px w-4" style={{ background: "var(--skill-edge-in)" }} /> referenced by
            </span>
          </p>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--glass-surface)]">
          {view === "canvas" ? (
            <SkillGraphCanvas
              nodes={layout.nodes}
              edges={graph.edges}
              lanes={layout.lanes}
              laneWidth={layout.width}
              selectedId={selectedId}
              positions={positions}
              showMiniMap={showMiniMap}
              reduceMotion={reduce}
              onSelect={select}
              onPositionsChange={handlePositions}
            />
          ) : (
            <div className="h-full overflow-y-auto p-2">
              <ul className="flex flex-col gap-0.5">
                {graph.nodes.map((node) => {
                  const on = node.id === selectedId;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        onClick={() => select(node.id)}
                        aria-pressed={on}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          on ? "bg-[var(--skill-node)]/10" : "hover:bg-[var(--bg-elevated)]"
                        }`}
                      >
                        <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-[color:var(--skill-node)]">
                          {node.label}
                        </span>
                        <span className="hidden shrink-0 text-[11.5px] text-[var(--text-tertiary)] sm:inline">
                          {node.categoryLabel}
                        </span>
                        <span className="shrink-0 text-[11.5px] tabular-nums text-[var(--text-tertiary)]">
                          {node.outDegree} out · {node.inDegree} in
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <aside className="hidden shrink-0 flex-col overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--glass-frame)] lg:flex lg:w-[320px]">
          {inspector}
        </aside>
      </div>

      {/* Below lg the inspector is a bottom sheet: a 320px rail would leave
          neither the map nor the panel usable. */}
      {selected && (
        <div className="fixed inset-x-0 bottom-0 z-40 max-h-[58vh] overflow-hidden rounded-t-[16px] border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.45)] lg:hidden">
          <div className="flex max-h-[58vh] flex-col">{inspector}</div>
        </div>
      )}
    </div>
  );
}

export default SkillGraphView;
