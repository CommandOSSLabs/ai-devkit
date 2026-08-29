"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  HelpCircle,
  List,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  Scan,
  Share2,
  X,
} from "lucide-react";
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
import type { SkillCanvasApi } from "./skill-graph-canvas";

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
/** Where a docked inspector still leaves the canvas about three quarters of
 *  the panel. Below it the inspector is a sheet over the map instead. */
const DOCKED_INSPECTOR = "(min-width: 1280px)";
const HINT_KEY = "ai-devkit-skill-graph-hint";

function toggleClass(on: boolean) {
  return `inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[12px] transition-colors ${
    on
      ? "bg-[var(--bg-elevated)] font-medium text-[var(--text-primary)]"
      : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
  }`;
}

const actionClass =
  "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--glass-elevated)] px-2.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]";

const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--glass-elevated)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]";

function RelationGroup({
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
  // <details> rather than a hand-rolled disclosure: the open/closed state, the
  // keyboard handling and the announced role all come for free, and this panel
  // has to stay light enough that the map keeps the attention.
  return (
    <details open className="group shrink-0">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.07em] text-[var(--text-tertiary)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--skill-node-active)]">
        <span style={{ color }}>{icon}</span>
        {title} ({ids.length})
      </summary>
      <div className="mt-1.5">
        {ids.length === 0 ? (
          <p className="text-[12px] italic text-[var(--text-tertiary)]">none</p>
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
    </details>
  );
}

export function SkillGraphView({ graph }: { graph: SkillGraph }) {
  const reduce = useReducedMotion() ?? false;
  const wideEnoughForCanvas = useMediaQuery(CANVAS_MIN_WIDTH);
  const canDockInspector = useMediaQuery(DOCKED_INSPECTOR) === true;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [requestedView, setRequestedView] = useState<SkillGraphViewMode | null>(null);
  const [positions, setPositions] = useState<Record<string, SkillGraphPosition>>({});
  const [initialised, setInitialised] = useState(false);
  const [focus, setFocus] = useState(false);
  const [api, setApi] = useState<SkillCanvasApi | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const deepLinkRead = useRef(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const layout = useMemo(() => layoutSkillGraph(graph.nodes), [graph.nodes]);
  const byId = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph.nodes]);

  // Read once, ever: the sync effect below rewrites the query string, and a
  // second read would pick up what it just wrote.
  useEffect(() => {
    if (deepLinkRead.current) return;
    deepLinkRead.current = true;

    const params = new URLSearchParams(window.location.search);
    const skill = normalizeSkillId(params.get("skill"));
    if (skill && graph.nodes.some((n) => n.id === skill)) setSelectedId(skill);

    const view = params.get("view");
    if (view === "canvas" || view === "list") setRequestedView(view);
    if (params.get("focus") === "canvas") setFocus(true);

    const stored = readStoredLayout();
    if (stored) setPositions(stored);

    try {
      if (!sessionStorage.getItem(HINT_KEY)) setHintOpen(true);
    } catch {
      // storage unavailable: the hint just does not auto-open
    }
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
    if (focus) params.set("focus", "canvas");
    else params.delete("focus");
    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [initialised, selectedId, requestedView, focus, wideEnoughForCanvas]);

  // Focus mode is application-level, not the browser's Fullscreen API: it
  // collapses the shell's own chrome from a single attribute on <html>, so the
  // canvas grows into the space its ancestors were using without being
  // unmounted and re-created in a new part of the tree. One canvas, one
  // viewport, no remount on the way in or out.
  useEffect(() => {
    const root = document.documentElement;
    if (focus) root.setAttribute("data-skills-focus", "");
    else root.removeAttribute("data-skills-focus");
    return () => root.removeAttribute("data-skills-focus");
  }, [focus]);

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

  const handleReady = useCallback((next: SkillCanvasApi | null) => setApi(next), []);

  const dismissHint = useCallback(() => {
    setHintOpen(false);
    try {
      sessionStorage.setItem(HINT_KEY, "seen");
    } catch {
      // nothing to remember it with
    }
  }, []);

  // Keyboard: F toggles focus, R resets the layout, Escape peels one layer at
  // a time — the open panel first, then focus mode itself.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape") {
        if (hintOpen) dismissHint();
        else if (selectedId) setSelectedId(null);
        else if (focus) setFocus(false);
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "f" && wideEnoughForCanvas) {
        e.preventDefault();
        setFocus((on) => !on);
      } else if (key === "r" && view === "canvas") {
        e.preventDefault();
        resetLayout();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissHint, focus, hintOpen, resetLayout, selectedId, view, wideEnoughForCanvas]);

  // Bring the selection into view without yanking the canvas: the renderer
  // only moves when the node is off-frame or too small to read.
  useEffect(() => {
    if (!api || !selectedId || view !== "canvas") return;
    api.reveal(selectedId);
  }, [api, selectedId, view]);

  // The docked rail exists only while something is selected. An empty 300px
  // panel reading "pick a skill" was taking a third of the canvas at 1280 to
  // say what the page's own subtitle already says, which is the opposite of
  // canvas-first.
  const dockInspector = canDockInspector && !focus && selectedId !== null;

  // Wherever the inspector floats over the map rather than sitting beside it,
  // it gets the workspace drawer's treatment: focus moves in and Tab stays
  // inside while it is open. Escape is handled by the global handler above.
  const overlayInspector = selectedId !== null && !dockInspector;
  useEffect(() => {
    if (!overlayInspector) return;
    const panel = drawerRef.current;
    if (!panel) return;

    // Where focus came from, so closing the panel puts it back on the node
    // rather than dropping it at the top of the document.
    const returnTo = document.activeElement as HTMLElement | null;
    panel.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), summary',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (returnTo && returnTo.isConnected && document.body.contains(returnTo)) returnTo.focus();
    };
  }, [overlayInspector, selectedId]);

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

      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-3">
        {selected.summary && (
          <p className="line-clamp-2 shrink-0 text-[12.5px] leading-6 text-[var(--text-secondary)]">
            {selected.summary}
          </p>
        )}
        <RelationGroup
          title="References"
          icon={<ArrowUpRight size={12} />}
          color="var(--skill-edge-out)"
          ids={relations.out}
          byId={byId}
        />
        <RelationGroup
          title="Referenced by"
          icon={<ArrowDownLeft size={12} />}
          color="var(--skill-edge-in)"
          ids={relations.inc}
          byId={byId}
        />
      </div>

      <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-[var(--border-subtle)] px-4 py-3">
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

  const viewToggle = (
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
  );

  const canvasActions = view === "canvas" && (
    <>
      <button type="button" onClick={() => api?.zoomOut()} aria-label="Zoom out" className={iconButtonClass}>
        <Minus size={13} strokeWidth={1.75} />
      </button>
      <button type="button" onClick={() => api?.zoomIn()} aria-label="Zoom in" className={iconButtonClass}>
        <Plus size={13} strokeWidth={1.75} />
      </button>
      <button type="button" onClick={() => api?.fitAll()} className={actionClass}>
        <Scan size={12} strokeWidth={1.75} />
        Fit all
      </button>
      <button type="button" onClick={resetLayout} className={actionClass}>
        <RotateCcw size={12} strokeWidth={1.75} />
        Reset
      </button>
    </>
  );

  const focusToggle = wideEnoughForCanvas ? (
    <button
      type="button"
      onClick={() => setFocus((on) => !on)}
      aria-pressed={focus}
      title={focus ? "Exit focus (Esc)" : "Focus canvas (F)"}
      className={actionClass}
    >
      {focus ? <Minimize2 size={12} strokeWidth={1.75} /> : <Maximize2 size={12} strokeWidth={1.75} />}
      {focus ? "Exit focus" : "Focus canvas"}
    </button>
  ) : null;

  const help = (
    <div className="relative">
      <button
        type="button"
        onClick={() => (hintOpen ? dismissHint() : setHintOpen(true))}
        aria-expanded={hintOpen}
        aria-label="How to read this map"
        className={iconButtonClass}
      >
        <HelpCircle size={13} strokeWidth={1.75} />
      </button>
      {hintOpen && (
        <div className="absolute right-0 top-9 z-30 w-[248px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-[11.5px] leading-5 text-[var(--text-secondary)] shadow-[0_8px_28px_-12px_rgba(0,0,0,0.5)]">
          <p>Drag to rearrange · Scroll to zoom · Select to trace</p>
          <p className="mt-1.5 text-[var(--text-tertiary)]">
            <span className="font-mono">F</span> focus · <span className="font-mono">R</span> reset ·{" "}
            <span className="font-mono">Esc</span> back
          </p>
          <button
            type="button"
            onClick={dismissHint}
            className="mt-2 text-[11.5px] text-[color:var(--accent)] underline-offset-2 hover:underline"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );

  const canvasPanel =
    view === "canvas" ? (
      <SkillGraphCanvas
        nodes={layout.nodes}
        edges={graph.edges}
        lanes={layout.lanes}
        laneWidth={layout.width}
        graphHeight={layout.height}
        selectedId={selectedId}
        hoveredId={hoveredId}
        positions={positions}
        showMiniMap={focus ? wideEnoughForCanvas === true : canDockInspector}
        reduceMotion={reduce}
        onSelect={select}
        onHover={setHoveredId}
        onPositionsChange={handlePositions}
        onReady={handleReady}
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
    );

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${focus ? "gap-0" : "gap-3"}`}>
      {!focus && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {viewToggle}
          {canvasActions}
          {focusToggle}
          <div className="ml-auto flex items-center gap-2">
            {view === "canvas" && (
              <p className="hidden items-center gap-3 text-[11px] text-[var(--text-tertiary)] sm:flex">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-px w-4" style={{ background: "var(--skill-edge-out)" }} /> references
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-px w-4" style={{ background: "var(--skill-edge-in)" }} /> referenced by
                </span>
              </p>
            )}
            {help}
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <div
          className={`relative min-h-[420px] flex-1 overflow-hidden bg-[var(--glass-surface)] ${
            focus ? "" : "rounded-[16px] border border-[var(--border-subtle)]"
          }`}
        >
          {canvasPanel}

          {/* In focus mode the page chrome is gone, so the controls come to
              the canvas rather than the other way round. */}
          {focus && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-center gap-2 p-3">
              <div className="pointer-events-auto flex flex-wrap items-center gap-2">
                {focusToggle}
                {viewToggle}
                {canvasActions}
              </div>
              <div className="pointer-events-auto ml-auto">{help}</div>
            </div>
          )}
        </div>

        {dockInspector && (
          <aside className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--glass-frame)]">
            {inspector}
          </aside>
        )}
      </div>

      {/* Over the map rather than beside it: a docked rail is a sheet on a
          narrow viewport, and an overlay drawer in focus mode, where nothing
          is allowed to shrink the canvas. */}
      {selected && overlayInspector && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.label} relationships`}
          className={
            focus
              ? "fixed right-3 top-16 z-30 flex max-h-[calc(100vh-5rem)] w-[320px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_16px_48px_-16px_rgba(0,0,0,0.55)]"
              : "fixed inset-x-0 bottom-0 z-40 flex max-h-[58vh] flex-col overflow-hidden rounded-t-[16px] border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.45)]"
          }
        >
          {inspector}
        </div>
      )}
    </div>
  );
}

export default SkillGraphView;
