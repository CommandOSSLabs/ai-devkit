"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
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
      className="pointer-events-none flex items-center gap-2 border-b border-[var(--border-subtle)] pb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]"
    >
      {data.label}
      <span className="tabular-nums text-[var(--text-disabled)]">[{data.count}]</span>
    </div>
  );
}

function SkillFlowNodeCard({ id, data }: NodeProps<SkillCardNode>) {
  const { label, categoryLabel, outDegree, inDegree, selected, traced, related, dimmed } = data;

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
      className={`flex cursor-pointer flex-col justify-center gap-0.5 rounded-[10px] border px-3 text-left outline-none transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--skill-node-active)] ${
        selected
          ? "border-[var(--skill-node-active)] bg-[var(--bg-surface)]"
          : traced
            ? "border-[var(--skill-node-active)] bg-[var(--bg-surface)]"
            : related === "out"
              ? "border-[var(--skill-edge-out)] bg-[var(--bg-surface)]"
              : related === "in"
                ? "border-[var(--skill-edge-in)] bg-[var(--bg-surface)]"
                : "border-[var(--border-subtle)] bg-[var(--bg-surface)]"
      } ${dimmed ? "opacity-25" : "opacity-100"}`}
    >
      {/* Edges need anchors to attach to. They carry no affordance of their
          own: connecting is disabled, so these exist purely as geometry. */}
      <Handle type="target" position={Position.Left} isConnectable={false} className="!opacity-0" />
      <Handle type="source" position={Position.Right} isConnectable={false} className="!opacity-0" />
      <span className="truncate font-mono text-[12px] font-semibold text-[color:var(--skill-node)]">{label}</span>
      <span className="flex items-center gap-2 text-[10.5px] text-[var(--text-tertiary)]">
        <span className="truncate">{categoryLabel}</span>
        <span className="ml-auto shrink-0 tabular-nums">
          {outDegree} out &middot; {inDegree} in
        </span>
      </span>
    </div>
  );
}

const NODE_TYPES: NodeTypes = { skill: SkillFlowNodeCard, lane: LaneHeading };

export function SkillGraphCanvas({
  nodes,
  edges,
  lanes,
  laneWidth,
  selectedId,
  hoveredId,
  positions,
  showMiniMap,
  reduceMotion,
  onSelect,
  onHover,
  onPositionsChange,
}: {
  nodes: PositionedSkillNode[];
  edges: SkillEdge[];
  lanes: SkillGraphLane[];
  laneWidth: number;
  selectedId: string | null;
  hoveredId: string | null;
  /** dragged overrides on top of the canonical layout */
  positions: Record<string, SkillGraphPosition>;
  showMiniMap: boolean;
  reduceMotion: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onPositionsChange: (next: Record<string, SkillGraphPosition>) => void;
}) {
  const instance = useRef<ReactFlowInstance<SkillFlowNode, Edge> | null>(null);

  // Hover traces a different skill without taking the pin away: the trace
  // follows the pointer, the pinned marker does not move.
  const tracedId = hoveredId ?? selectedId;

  const relation = useMemo(() => {
    if (!tracedId) return null;
    const out = new Set(edges.filter((e) => e.source === tracedId).map((e) => e.target));
    const inc = new Set(edges.filter((e) => e.target === tracedId).map((e) => e.source));
    return { out, inc };
  }, [edges, tracedId]);

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
      height: 24,
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
          position: positions[node.id] ?? node.position,
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
  }, [nodes, lanes, laneWidth, positions, relation, selectedId, tracedId, onSelect]);

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
            opacity: tracedId ? (touched ? 0.9 : 0.05) : 0.28,
          },
        };
      }),
    [edges, tracedId, reduceMotion],
  );

  // Re-fit when the graph itself changes, not on every selection.
  useEffect(() => {
    instance.current?.fitView({ padding: 0.16, duration: reduceMotion ? 0 : 300 });
  }, [nodes.length, reduceMotion]);

  const handleDragStop = useCallback(
    (_: unknown, node: SkillFlowNode) => {
      if (node.type !== "skill") return;
      onPositionsChange({ ...positions, [node.id]: { x: node.position.x, y: node.position.y } });
    },
    [onPositionsChange, positions],
  );

  return (
    <ReactFlow<SkillFlowNode, Edge>
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={NODE_TYPES}
      onInit={(i) => {
        instance.current = i;
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
      fitView
      fitViewOptions={{ padding: 0.16 }}
      minZoom={0.2}
      maxZoom={1.8}
      className="[&_.react-flow\\_\\_attribution]:hidden"
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="var(--border-subtle)" />
      <Controls showInteractive={false} position="bottom-right" />
      {showMiniMap && (
        <MiniMap
          pannable
          zoomable
          position="bottom-left"
          ariaLabel="Skill map overview"
          maskColor="color-mix(in srgb, var(--bg-base) 72%, transparent)"
          className="!bg-[var(--bg-surface)]"
          style={{ width: 168, height: 112 }}
        />
      )}
    </ReactFlow>
  );
}

export default SkillGraphCanvas;
