// Real signal only — no invented plans. "Now" comes from actual open PRs,
// "Shipped" mirrors the real /changelog entries, "Next" comes from the
// draft design doc at docs/design/visualize.md. "Later" has nothing behind
// it yet, so it stays empty rather than promise something that isn't decided.

export type RoadmapCategory = "Website" | "Skills";

export type RoadmapStatus = "now" | "next" | "later" | "shipped";

interface RoadmapItemBase {
  id: string;
  title: string;
  description: string;
  category: RoadmapCategory;
}

interface ActiveRoadmapItem extends RoadmapItemBase {
  status: "now" | "next" | "later";
  /** Open PR covering this work, if any. */
  pr?: string;
  /** External reference/inspiration for this item — a post, a prior art link. */
  link?: { label: string; url: string };
}

interface ShippedRoadmapItem extends RoadmapItemBase {
  status: "shipped";
  shippedDate: string;
  /** Commit or PR reference shown as a "$ git show"-style chip. */
  ref?: { label: string; url: string };
  /** Link to the changelog entry covering the ship. */
  href?: string;
}

export type RoadmapItem = ActiveRoadmapItem | ShippedRoadmapItem;

export const CATEGORIES: RoadmapCategory[] = ["Website", "Skills"];

export const STATUS_LABELS: Record<RoadmapStatus, string> = {
  now: "In Progress",
  next: "Next",
  later: "Later",
  shipped: "Shipped",
};

export const STATUS_DESCRIPTIONS: Record<RoadmapStatus, string> = {
  now: "Being worked on right now.",
  next: "Queued up after what's in progress.",
  later: "On the radar, not yet started.",
  shipped: "Already live.",
};

const REPO = "https://github.com/CommandOSSLabs/ai-devkit";

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "skills-explorer-canvas",
    status: "now",
    category: "Website",
    title: "Minimal skills explorer + relationship canvas",
    description: "A quieter category-first catalog and a pan-and-zoom map for tracing how skills reference each other.",
  },
  {
    id: "repo-meta-rate-limit",
    status: "now",
    category: "Website",
    title: "Fix GitHub repo-meta rate limiting",
    description: "Stops hitting GitHub's rate limit on repo metadata calls and removes a dead WebGL scroll loop left running behind it.",
    pr: `${REPO}/pull/13`,
  },
  {
    id: "cmk-visualize",
    status: "next",
    category: "Skills",
    title: "New skill: cmk:visualize",
    description: "Turns content you already have — a design doc, a tracker query, a raw description — into a rendered diagram, slide deck, or animated teaser, instead of a wall of markdown. One target shape: an isometric map of a repo's own infrastructure, dependencies and data paths traced from the real code, citing the files it read.",
    link: { label: "reference: isometric repo-map prompt", url: "https://x.com/JayScambler/status/2088356230968287547" },
  },
  {
    id: "skills-dashboard",
    status: "shipped",
    category: "Website",
    shippedDate: "Aug 29",
    title: "Skills dashboard and local workspace",
    description: "Browse, inspect and locally edit all skills through catalog, detail and code-editor-style workspace views.",
    ref: { label: "c29ea93", url: `${REPO}/commit/c29ea93` },
  },
  {
    id: "cmk-interpret",
    status: "shipped",
    category: "Skills",
    shippedDate: "Aug 14",
    title: "New skill: cmk:interpret",
    description: "For user-invoked interpret sessions, plus acceptance-criteria notation for requirements.",
    ref: { label: "0d7b298", url: `${REPO}/commit/0d7b298` },
    href: "/changelog",
  },
  {
    id: "skills-site-launch",
    status: "shipped",
    category: "Website",
    shippedDate: "Aug 13",
    title: "skills.commandoss.com launched",
    description: "Homepage moved to the skills page, nav links go to real URLs, and the install box got a package-manager switcher.",
    href: "/changelog",
  },
];
