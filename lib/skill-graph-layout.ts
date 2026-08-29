import type { SkillNode } from "./skill-graph";
import { CATEGORY_LABELS } from "./skill-types";

export type SkillGraphPosition = { x: number; y: number };

export type PositionedSkillNode = SkillNode & { position: SkillGraphPosition };

export type PersistedSkillGraphLayout = {
  version: typeof LAYOUT_VERSION;
  positions: Record<string, SkillGraphPosition>;
};

/**
 * Bump when lane geometry changes. A stored layout carrying a different
 * version is discarded rather than migrated: the positions describe a map that
 * no longer exists, and restoring them would scatter nodes across lanes that
 * have moved.
 */
export const LAYOUT_VERSION = 3;

const STORAGE_KEY = "ai-devkit-skill-graph-layout";

// Sized for three lines at zoom 1 without hovering: the handle, the human
// title, and the line saying what the skill is for. The last one is the
// reason the card grew — a reader who cannot tell what a node does has no
// use for knowing how many arrows touch it.
const NODE_WIDTH = 216;
const NODE_HEIGHT = 92;
const COLUMN_GAP = 64;
const ROW_GAP = 28;
const LANE_GAP = 56;
const LANE_HEADER = 44;

/** Lane order, so the map reads the same way every time it is opened. */
const LANE_ORDER = [
  "delivery",
  "docs",
  "setup",
  "agent",
  "testing",
  "sui",
  "sync",
  "session",
  "other",
];

function laneRank(category: string): number {
  const i = LANE_ORDER.indexOf(category);
  return i === -1 ? LANE_ORDER.length : i;
}

export type SkillGraphLane = {
  category: string;
  label: string;
  /** y of the lane's heading, in flow coordinates */
  y: number;
  height: number;
  count: number;
};

export type SkillGraphLayout = {
  nodes: PositionedSkillNode[];
  lanes: SkillGraphLane[];
  width: number;
  /** full bounds of the laid-out map, so the canvas can frame it without measuring */
  height: number;
};

/**
 * Deterministic, category-clustered placement: lanes in a fixed order, skills
 * alphabetical inside a lane, wrapped into a grid whose width depends only on
 * the largest lane. The same graph produces the same map on every load, which
 * is the whole reason this is not a force simulation — a picture you can refer
 * back to next week beats one that looks alive.
 */
export function layoutSkillGraph(nodes: SkillNode[]): SkillGraphLayout {
  const byCategory = new Map<string, SkillNode[]>();
  for (const node of nodes) {
    const list = byCategory.get(node.category) ?? [];
    list.push(node);
    byCategory.set(node.category, list);
  }

  const categories = Array.from(byCategory.keys()).sort(
    (a, b) => laneRank(a) - laneRank(b) || a.localeCompare(b),
  );

  // One column count for every lane, so lanes line up rather than ragging.
  // Three, not a function of the largest lane: at the readable node size a
  // wider grid is wider than the canvas gets on a 1440 screen with the
  // inspector docked, and a column you have to pan to find on first load is
  // the same mistake as a node too small to read.
  const columns = 3;

  const positioned: PositionedSkillNode[] = [];
  const lanes: SkillGraphLane[] = [];
  let y = 0;

  for (const category of categories) {
    const list = (byCategory.get(category) ?? []).slice().sort((a, b) => a.id.localeCompare(b.id));
    const rows = Math.ceil(list.length / columns);
    const height = LANE_HEADER + rows * NODE_HEIGHT + Math.max(0, rows - 1) * ROW_GAP;

    list.forEach((node, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      positioned.push({
        ...node,
        position: {
          x: column * (NODE_WIDTH + COLUMN_GAP),
          y: y + LANE_HEADER + row * (NODE_HEIGHT + ROW_GAP),
        },
      });
    });

    lanes.push({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      y,
      height,
      count: list.length,
    });

    y += height + LANE_GAP;
  }

  return {
    nodes: positioned,
    lanes,
    width: columns * NODE_WIDTH + (columns - 1) * COLUMN_GAP,
    height: Math.max(0, y - LANE_GAP),
  };
}

export const SKILL_NODE_SIZE = { width: NODE_WIDTH, height: NODE_HEIGHT };

function isPosition(value: unknown): value is SkillGraphPosition {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as SkillGraphPosition).x === "number" &&
    typeof (value as SkillGraphPosition).y === "number" &&
    Number.isFinite((value as SkillGraphPosition).x) &&
    Number.isFinite((value as SkillGraphPosition).y)
  );
}

/**
 * Dragged positions, for this browser tab only. Anything unreadable, of the
 * wrong version, or carrying a value that is not a finite coordinate pair is
 * discarded whole — a half-restored map is worse than the canonical one.
 */
export function readStoredLayout(): Record<string, SkillGraphPosition> | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (parsed as PersistedSkillGraphLayout).version !== LAYOUT_VERSION
    ) {
      return null;
    }
    const positions = (parsed as PersistedSkillGraphLayout).positions;
    if (typeof positions !== "object" || positions === null) return null;

    const out: Record<string, SkillGraphPosition> = {};
    for (const [id, position] of Object.entries(positions)) {
      if (!isPosition(position)) return null;
      out[id] = { x: position.x, y: position.y };
    }
    return out;
  } catch {
    return null;
  }
}

export function writeStoredLayout(positions: Record<string, SkillGraphPosition>): void {
  try {
    const payload: PersistedSkillGraphLayout = { version: LAYOUT_VERSION, positions };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // storage unavailable or full — the map still works, it just won't be
    // where you left it after a reload
  }
}

export function clearStoredLayout(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clear
  }
}
