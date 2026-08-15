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
    id: "browse-skills-nav",
    status: "now",
    category: "Website",
    title: "Browse Skills nav + loading transition",
    description: "A dedicated nav button to browse skills, with a TextMorph transition while the list loads.",
    pr: `${REPO}/pull/15`,
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
    description: "Turns content you already have — a design doc, a tracker query, a raw description — into a rendered diagram, slide deck, or animated teaser, instead of a wall of markdown.",
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
