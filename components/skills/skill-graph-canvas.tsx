"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  useStore,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { SkillEdge } from "@/lib/skill-graph";
import {
  SKILL_NODE_SIZE,
  type PositionedSkillNode,
  type SkillGraphLane,
  type SkillGraphPosition,
} from "@/lib/skill-graph-layout";

// The React Flow boundary. It owns the viewport — pan, zoom, drag, minimap —
// and nothing else: selection, the URL, the inspector and persistence stay in
// SkillGraphView, so replacing this renderer later touches one file.

/** Imperative viewport controls, handed to the toolbar that lives outside. */
export type SkillCanvasApi = {
  fitAll: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  /** bring a node into view, raising the zoom to a readable level if needed */
  reveal: (id: string, force?: boolean) => void;
};

/** Below this the metadata row is dropped: it would render sub-8px. */
const META_ZOOM = 0.62;
/** The band a selected node is pulled into. Anything inside it stays put. */
const READABLE_MIN = 1;
const READABLE_MAX = 1.2;
const MIN_ZOOM = 0.22;
const MAX_ZOOM = 1.8;

type SkillNodeData = {
  label: string;
  categoryLabel: string;
  outDegree: number;
  inDegree: number;
  selected: boolean;
  /** hovered but not pinned — a lighter marker than the pin's */
  traced: boolean;
  related: "out" | "in" | null;
  dimmed: boolean;
  onSelect: (id: string) => void;
};

type LaneNodeData = { label: string; count: number; width: number };

type SkillFlowNode = Node<SkillNodeData, "skill"> | Node<LaneNodeData, "lane">;
type SkillCardNode = Node<SkillNodeData, "skill">;

function LaneHeading({ data }: NodeProps<Node<LaneNodeData, "lane">>) {
  return (
    <div
      style={{ width: data.width }}
      className="pointer-events-none flex items-center gap-2 border-b border-[var(--border-subtle)] pb-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]"
    >
      {data.label}
      {/* Tertiary, not disabled: the count is information, and on the light
          palette --text-disabled measures 2.54:1 against the canvas. */}
      <span className="tabular-nums text-[var(--text-tertiary)]">[{data.count}]</span>
    </div>
  );
}

function SkillFlowNodeCard({ id, data }: NodeProps<SkillCardNode>) {
  const { label, categoryLabel, outDegree, inDegree, selected, traced, related, dimmed } = data;
  // A boolean selector, so the store only re-renders these cards on the two
  // zoom steps where the answer actually flips.
  const showMeta = useStore((s) => s.transform[2] >= META_ZOOM);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${label}, ${categoryLabel}. ${outDegree} references out, ${inDegree} in.`}
      onClick={() => data.onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          data.onSelect(id);
        }
      }}
      style={{
        width: SKILL_NODE_SIZE.width,
        height: SKILL_NODE_SIZE.height,
        // Inline, not a Tailwind arbitrary value: a color-mix() with commas
        // inside shadow-[...] does not survive the class parser, and it failed
        // silently — the pin lost its halo and became indistinguishable from a
        // hover, which is the one distinction this component has to keep.
        boxShadow: selected
          ? "0 0 0 4px color-mix(in srgb, var(--skill-node-active) 24%, transparent)"
          : undefined,
      }}
      className={`flex cursor-pointer flex-col justify-center gap-1 rounded-[10px] border px-3.5 text-left outline-none transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--skill-node-active)] ${
        selected
          ? "border-[var(--skill-node-active)] bg-[var(--bg-surface)]"
          : traced
            ? "border-[var(--skill-node-active)] bg-[var(--bg-surface)]"
            : related === "out"
              ? "border-[var(--skill-edge-out)] bg-[var(--bg-surface)]"
              : related === "in"
                ? "border-[var(--skill-edge-in)] bg-[var(--bg-surface)]"
                : "border-[var(--border-subtle)] bg-[var(--bg-surface)]"
      } ${dimmed ? "opacity-30" : "opacity-100"}`}
    >
      {/* Edges need anchors to attach to. They carry no affordance of their
          own: connecting is disabled, so these exist purely as geometry. */}
      <Handle type="target" position={Position.Left} isConnectable={false} className="!opacity-0" />
      <Handle type="source" position={Position.Right} isConnectable={false} className="!opacity-0" />
      <span className="truncate font-mono text-[13.5px] font-semibold leading-tight text-[color:var(--skill-node)]">
        {label}
      </span>
      {showMeta && (
        <span className="flex items-center gap-2 text-[11.5px] leading-tight text-[var(--text-tertiary)]">
          <span className="truncate">{categoryLabel}</span>
          <span className="ml-auto shrink-0 tabular-nums">
            {outDegree} out &middot; {inDegree} in
          </span>
        </span>
      )}
    </div>
  );
}

const NODE_TYPES: NodeTypes = { skill: SkillFlowNodeCard, lane: LaneHeading };

export function SkillGraphCanvas({
  nodes,
  edges,
  lanes,
  laneWidth,
  graphHeight,
  selectedId,
  hoveredId,
  positions,
  showMiniMap,
  reduceMotion,
  onSelect,
  onHover,
  onPositionsChange,
  onReady,
}: {
  nodes: PositionedSkillNode[];
  edges: SkillEdge[];
  lanes: SkillGraphLane[];
  laneWidth: number;
  graphHeight: number;
  selectedId: string | null;
  hoveredId: string | null;
  /** dragged overrides on top of the canonical layout */
  positions: Record<string, SkillGraphPosition>;
  showMiniMap: boolean;
  reduceMotion: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onPositionsChange: (next: Record<string, SkillGraphPosition>) => void;
  onReady?: (api: SkillCanvasApi | null) => void;
}) {
  const instance = useRef<ReactFlowInstance<SkillFlowNode, Edge> | null>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  // Read at mount only. Re-centring on every selection change would fight the
  // user's own panning; the reveal rule below decides when to move instead.
  const initialSelection = useRef(selectedId);
  const framed = useRef(false);

  // Hover traces a different skill without taking the pin away: the trace
  // follows the pointer, the pinned marker does not move.
  const tracedId = hoveredId ?? selectedId;

  const placed = useMemo(() => {
    const map = new Map<string, SkillGraphPosition>();
    for (const node of nodes) map.set(node.id, positions[node.id] ?? node.position);
    return map;
  }, [nodes, positions]);
  const placedRef = useRef(placed);
  placedRef.current = placed;

  const relation = useMemo(() => {
    if (!tracedId) return null;
    const out = new Set(edges.filter((e) => e.source === tracedId).map((e) => e.target));
    const inc = new Set(edges.filter((e) => e.target === tracedId).map((e) => e.source));
    return { out, inc };
  }, [edges, tracedId]);

  /** Absolute placement, computed from the container box rather than from
   *  React Flow's measured size: measurement rides on ResizeObserver, and the
   *  first frame must land exactly whether or not that has been delivered. */
  const centerOn = useCallback((cx: number, cy: number, zoom: number, duration: number) => {
    const inst = instance.current;
    const box = wrapper.current?.getBoundingClientRect();
    if (!inst || !box || box.width === 0) return;
    inst.setViewport(
      { x: box.width / 2 - cx * zoom, y: box.height / 2 - cy * zoom, zoom },
      { duration },
    );
  }, []);

  /** The opening frame, anchored to the map's top-left corner rather than
   *  centred on it: centring a grid wider than the panel clips the first
   *  column, and the first thing anyone reads should be a whole card. */
  const anchorHome = useCallback(() => {
    const inst = instance.current;
    if (!inst) return;
    inst.setViewport({ x: 32, y: 32, zoom: 1 }, { duration: 0 });
  }, []);

  const api = useMemo<SkillCanvasApi>(
    () => ({
      fitAll: () => {
        const box = wrapper.current?.getBoundingClientRect();
        if (!box || box.width === 0) return;
        const zoom = Math.max(
          MIN_ZOOM,
          Math.min(1, (box.width - 72) / laneWidth, (box.height - 72) / Math.max(1, graphHeight)),
        );
        centerOn(laneWidth / 2, graphHeight / 2, zoom, reduceMotion ? 0 : 280);
      },
      zoomIn: () => instance.current?.zoomIn({ duration: reduceMotion ? 0 : 160 }),
      zoomOut: () => instance.current?.zoomOut({ duration: reduceMotion ? 0 : 160 }),
      reveal: (id, force) => {
        const inst = instance.current;
        const box = wrapper.current?.getBoundingClientRect();
        const at = placedRef.current.get(id);
        if (!inst || !box || !at || box.width === 0) return;

        const cx = at.x + SKILL_NODE_SIZE.width / 2;
        const cy = at.y + SKILL_NODE_SIZE.height / 2;
        const vp = inst.getViewport();
        const nextZoom = Math.min(READABLE_MAX, Math.max(vp.zoom, READABLE_MIN));

        // Already legible and comfortably inside the frame: leave the viewport
        // where the reader put it. Yanking the canvas on every click is the
        // thing that makes a graph feel like it is fighting you.
        const sx = cx * vp.zoom + vp.x;
        const sy = cy * vp.zoom + vp.y;
        const insetX = box.width * 0.16;
        const insetY = box.height * 0.16;
        const inFrame =
          sx > insetX && sx < box.width - insetX && sy > insetY && sy < box.height - insetY;
        if (!force && inFrame && nextZoom === vp.zoom) return;

        centerOn(cx, cy, nextZoom, reduceMotion ? 0 : 280);
      },
    }),
    [centerOn, graphHeight, laneWidth, reduceMotion],
  );

  useEffect(() => {
    onReady?.(api);
    return () => onReady?.(null);
  }, [api, onReady]);

  const flowNodes = useMemo<SkillFlowNode[]>(() => {
    // Lane headings are nodes rather than an overlay, so the category
    // structure pans and zooms with the map instead of floating over it.
    const laneNodes: SkillFlowNode[] = lanes.map((lane) => ({
      id: `lane:${lane.category}`,
      type: "lane" as const,
      position: { x: 0, y: lane.y },
      // Dimensions are declared rather than measured. React Flow keeps a node
      // `visibility: hidden` until it has measured it, and measurement rides on
      // ResizeObserver delivery — under a throttled rendering loop that never
      // arrives and the whole map stays invisible. The layout already knows
      // every size, so it says so.
      width: laneWidth,
      height: 26,
      data: { label: lane.label, count: lane.count, width: laneWidth },
      draggable: false,
      selectable: false,
      focusable: false,
      deletable: false,
    }));

    const skillNodes: SkillFlowNode[] = nodes.map((node) => {
      const isSelected = node.id === selectedId;
      const isTraced = node.id === tracedId;
      const related: "out" | "in" | null = relation?.out.has(node.id)
        ? "out"
        : relation?.inc.has(node.id)
          ? "in"
          : null;
      return {
        id: node.id,
        type: "skill" as const,
        position: placed.get(node.id) ?? node.position,
        width: SKILL_NODE_SIZE.width,
        height: SKILL_NODE_SIZE.height,
        data: {
          label: node.label,
          categoryLabel: node.categoryLabel,
          outDegree: node.outDegree,
          inDegree: node.inDegree,
          selected: isSelected,
          traced: isTraced && !isSelected,
          related,
          dimmed: Boolean(tracedId) && !isTraced && !isSelected && related === null,
          onSelect,
        },
      };
    });

    return [...laneNodes, ...skillNodes];
  }, [nodes, lanes, laneWidth, placed, relation, selectedId, tracedId, onSelect]);

  const flowEdges = useMemo<Edge[]>(
    () =>
      edges.map((edge) => {
        const isOut = tracedId !== null && edge.source === tracedId;
        const isIn = tracedId !== null && edge.target === tracedId;
        const touched = isOut || isIn;
        return {
          id: `${edge.source}->${edge.target}`,
          source: edge.source,
          target: edge.target,
          type: "smoothstep",
          // Edges are read-only: they are repository references, not something
          // this UI lets anyone draw.
          selectable: false,
          focusable: false,
          animated: touched && !reduceMotion,
          style: {
            stroke: isOut
              ? "var(--skill-edge-out)"
              : isIn
                ? "var(--skill-edge-in)"
                : "var(--skill-edge)",
            strokeWidth: touched ? 1.8 : 0.8,
            opacity: tracedId ? (touched ? 0.9 : 0.06) : 0.28,
          },
        };
      }),
    [edges, tracedId, reduceMotion],
  );

  const handleDragStop = useCallback(
    (_: unknown, node: SkillFlowNode) => {
      if (node.type !== "skill") return;
      onPositionsChange({ ...positions, [node.id]: { x: node.position.x, y: node.position.y } });
    },
    [onPositionsChange, positions],
  );

  return (
    <div ref={wrapper} className="h-full w-full">
      <ReactFlow<SkillFlowNode, Edge>
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={NODE_TYPES}
        onInit={(i) => {
          instance.current = i;
          if (framed.current) return;
          framed.current = true;
          // The map opens readable, not fitted. Fitting eight lanes into a
          // panel drove every card to roughly a centimetre of unreadable
          // colour; the frame now starts where the reader is going to look —
          // the deep-linked skill, or the first lane — and "Fit all" is a
          // deliberate action rather than the default.
          const start = initialSelection.current
            ? placedRef.current.get(initialSelection.current)
            : undefined;
          if (start) {
            centerOn(
              start.x + SKILL_NODE_SIZE.width / 2,
              start.y + SKILL_NODE_SIZE.height / 2,
              1.1,
              0,
            );
            return;
          }
          anchorHome();
        }}
        onNodeDragStop={handleDragStop}
        onNodeMouseEnter={(_, node) => {
          if (node.type === "skill") onHover(node.id);
        }}
        onNodeMouseLeave={() => onHover(null)}
        onPaneClick={() => onSelect("")}
        /* One focus stop per node, ours, so the accessible name and the
           Enter/Space handling are the card's rather than the wrapper's. */
        nodesFocusable={false}
        edgesFocusable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="var(--border-subtle)" />
        {showMiniMap && (
          <MiniMap
            pannable
            zoomable
            position="bottom-left"
            ariaLabel="Skill map overview"
            maskColor="color-mix(in srgb, var(--bg-base) 72%, transparent)"
            className="!bg-[var(--bg-surface)]"
            style={{ width: 152, height: 100 }}
          />
        )}
      </ReactFlow>
    </div>
  );
}

export default SkillGraphCanvas;
