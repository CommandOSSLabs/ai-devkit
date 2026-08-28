"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDownLeft, ArrowUpRight, ExternalLink, List, Share2, X } from "lucide-react";
import type { SkillGraph } from "@/lib/skill-graph";
import { normalizeSkillId } from "@/lib/skill-id";

// A circular (chord) layout rather than a force simulation: with 34 nodes and
// 108 edges a physics layout settles differently on every load, which makes
// the picture impossible to refer back to. Fixed positions mean "the hub at
// the top right" stays the hub at the top right, and it needs no animation
// frame budget next to the fluid background already running on this page.

const SIZE = 900;
const C = SIZE / 2;
const R = 310;
const OUT_COLOR = "#82AAFF";
const IN_COLOR = "#F472B6";

type Pt = { x: number; y: number; angle: number };

// Coordinates are rounded before they reach the DOM. Full-precision floats
// serialize differently on the server and the client (…4313 vs …43124), which
// React reports as a hydration mismatch on every label in the ring.
const r2 = (n: number) => Math.round(n * 100) / 100;

export function SkillGraphView({ graph }: { graph: SkillGraph }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [view, setView] = useState<"graph" | "list">("graph");
  const active = hovered ?? pinned;

  // A skill page links here as …?focus=delivery-review, so "see what this
  // connects to" lands on that node already traced instead of on 34
  // undifferentiated dots. Read after mount to keep the page static.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = normalizeSkillId(params.get("skill") ?? params.get("focus"));
    if (requested && graph.nodes.some((n) => n.id === requested)) setPinned(requested);
  }, [graph.nodes]);

  const { points, byId } = useMemo(() => {
    const points = new Map<string, Pt>();
    const n = graph.nodes.length || 1;
    graph.nodes.forEach((node, i) => {
      // start at 12 o'clock so the ordering reads clockwise from the top
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      points.set(node.id, { x: r2(C + Math.cos(angle) * R), y: r2(C + Math.sin(angle) * R), angle });
    });
    return { points, byId: new Map(graph.nodes.map((nd) => [nd.id, nd])) };
  }, [graph]);

  const related = useMemo(() => {
    if (!active) return null;
    const out = graph.edges.filter((e) => e.source === active).map((e) => e.target);
    const inc = graph.edges.filter((e) => e.target === active).map((e) => e.source);
    return { out, inc, touching: new Set([...out, ...inc, active]) };
  }, [active, graph.edges]);

  const activeNode = active ? byId.get(active) : null;
  const maxDeg = Math.max(...graph.nodes.map((n) => n.inDegree + n.outDegree), 1);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--glass-surface)]">
        <div className="absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5">
          <button
            type="button"
            onClick={() => setView("graph")}
            aria-pressed={view === "graph"}
            className={`inline-flex h-6 items-center gap-1 rounded-[4px] px-2 text-[11.5px] transition-colors ${
              view === "graph"
                ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Share2 size={11} strokeWidth={1.75} />
            Graph
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`inline-flex h-6 items-center gap-1 rounded-[4px] px-2 text-[11.5px] transition-colors ${
              view === "list"
                ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <List size={11} strokeWidth={1.75} />
            List
          </button>
        </div>

        {view === "list" ? (
          /* The same relationships without an SVG in the way: every skill is
             a focusable row, and focusing one traces it in the inspector, so
             this graph is navigable by keyboard and by screen reader too. */
          <div className="min-h-0 flex-1 overflow-y-auto p-2 pt-12">
            <ul className="flex flex-col gap-0.5">
              {graph.nodes.map((node) => {
                const on = node.id === active;
                return (
                  <li key={node.id}>
                    <button
                      type="button"
                      onClick={() => setPinned((cur) => (cur === node.id ? null : node.id))}
                      onFocus={() => setHovered(node.id)}
                      onBlur={() => setHovered(null)}
                      onMouseEnter={() => setHovered(node.id)}
                      onMouseLeave={() => setHovered(null)}
                      aria-pressed={node.id === pinned}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        on ? "bg-[#82AAFF]/10" : "hover:bg-[var(--bg-elevated)]"
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-[color:var(--accent)]">
                        {node.label}
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
        ) : (
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full" role="img" aria-label="Skill reference graph">
          <g>
            {graph.edges.map((e, i) => {
              const a = points.get(e.source);
              const b = points.get(e.target);
              if (!a || !b) return null;
              const isOut = active && e.source === active;
              const isIn = active && e.target === active;
              const on = isOut || isIn;
              // pull the control point toward the centre so edges read as
              // chords instead of overlapping straight lines
              const cx = r2(C + (a.x + b.x - 2 * C) * 0.18);
              const cy = r2(C + (a.y + b.y - 2 * C) * 0.18);
              return (
                <path
                  key={i}
                  d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                  fill="none"
                  stroke={isOut ? OUT_COLOR : isIn ? IN_COLOR : "var(--border-strong)"}
                  strokeWidth={on ? 1.6 : 0.7}
                  opacity={active ? (on ? 0.85 : 0.06) : 0.25}
                  className="transition-[opacity,stroke-width] duration-200"
                />
              );
            })}
          </g>

          <g>
            {graph.nodes.map((node) => {
              const p = points.get(node.id)!;
              const deg = node.inDegree + node.outDegree;
              const r = r2(3 + (deg / maxDeg) * 7);
              const dim = active ? !related?.touching.has(node.id) : false;
              const isActive = node.id === active;
              const rightSide = Math.cos(p.angle) > -0.01;
              const lx = r2(C + Math.cos(p.angle) * (R + 14));
              const ly = r2(C + Math.sin(p.angle) * (R + 14));

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-opacity duration-200"
                  opacity={dim ? 0.2 : 1}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setPinned((cur) => (cur === node.id ? null : node.id))}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r}
                    fill={isActive ? IN_COLOR : OUT_COLOR}
                    opacity={isActive ? 1 : 0.75}
                  />
                  {/* generous invisible hit area — the dots are small */}
                  <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
                  <text
                    x={lx}
                    y={ly}
                    fontSize={11}
                    fontFamily="var(--font-mono, monospace)"
                    fill={isActive ? IN_COLOR : "var(--text-secondary)"}
                    fontWeight={isActive ? 600 : 400}
                    textAnchor={rightSide ? "start" : "end"}
                    dominantBaseline="middle"
                    transform={rightSide ? undefined : `rotate(180 ${lx} ${ly})`}
                    style={{ transformBox: "fill-box" }}
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        )}

        {view === "graph" && (
          <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-4 text-[11px] text-[var(--text-tertiary)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-px w-4" style={{ background: OUT_COLOR }} /> references
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-px w-4" style={{ background: IN_COLOR }} /> referenced by
            </span>
          </div>
        )}
      </div>

      <aside className="flex shrink-0 flex-col overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--glass-frame)] backdrop-blur-sm lg:w-[320px]">
        <AnimatePresence mode="wait">
          {activeNode && related ? (
            <motion.div
              key={activeNode.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[13px] font-semibold text-[color:var(--accent)]">{activeNode.label}</p>
                  <p className="mt-1 text-[11.5px] text-[var(--text-tertiary)]">
                    {activeNode.outDegree} out · {activeNode.inDegree} in
                  </p>
                </div>
                {pinned && (
                  <button
                    type="button"
                    onClick={() => setPinned(null)}
                    aria-label="Clear selection"
                    className="shrink-0 rounded-md p-1 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                {activeNode.summary && (
                  <p className="mb-4 text-[12.5px] leading-6 text-[var(--text-secondary)]">{activeNode.summary}</p>
                )}
                <RefList title="References" icon={<ArrowUpRight size={12} />} color={OUT_COLOR} ids={related.out} />
                <RefList title="Referenced by" icon={<ArrowDownLeft size={12} />} color={IN_COLOR} ids={related.inc} />
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    href={`/skills/${activeNode.id}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[#82AAFF]/50 hover:text-[color:var(--accent)]"
                  >
                    <ExternalLink size={12} strokeWidth={1.75} />
                    Open detail
                  </Link>
                  <Link
                    href={`/skills/${activeNode.id}/workspace`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#82AAFF]/40 bg-[#82AAFF]/10 px-3 text-[12.5px] font-medium text-[color:var(--accent)] transition-colors hover:bg-[#82AAFF]/20"
                  >
                    Open workspace
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center"
            >
              <p className="text-[13px] leading-[1.6] text-[var(--text-tertiary)]">
                Hover a skill to trace its references. Click to keep it pinned. Switch to List to reach every skill by
                keyboard.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function RefList({
  title,
  icon,
  color,
  ids,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  ids: string[];
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.07em] text-[var(--text-tertiary)]">
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
              className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[11.5px] text-[var(--text-secondary)] transition-colors hover:border-[#82AAFF]/50 hover:text-[color:var(--accent)]"
            >
              {id}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillGraphView;
