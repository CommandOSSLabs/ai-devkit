export type RealSkill = {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  triggers: string[];
};

export type SkillCategoryInfo = {
  id: string;
  label: string;
  /** how many skills fall in this category — only the catalog needs it */
  count?: number;
};

export const CATEGORY_LABELS: Record<string, string> = {
  delivery: "Delivery",
  setup: "Setup & Infra",
  agent: "Agent & Vendors",
  sync: "Sync",
  docs: "Documentation",
  testing: "Testing & Code",
  sui: "Sui Network",
  session: "Session",
  roadmap: "Roadmap",
  acceptance: "Acceptance & UI",
  meta: "Skill Authoring",
  other: "Other",
};

/*
 * Category is presentation-only grouping — it is not in the real SKILL.md
 * frontmatter (only name/description/version are). Known ids get a real
 * label; anything new that shows up in skills/ that we don't recognize yet
 * still renders (falls into "other") instead of silently disappearing.
 */
export const CATEGORY_MAP: Record<string, string> = {
  acceptance: "acceptance",
  "acceptance-api": "acceptance",
  "acceptance-ui": "acceptance",
  "dogfood-plan": "acceptance",
  "dogfood-run": "acceptance",
  "ui-brief": "acceptance",
  "ui-review": "acceptance",
  "ux-brief": "acceptance",
  "agent-instructions": "agent",
  "agent-vendors": "agent",
  backlog: "delivery",
  board: "delivery",
  "delivery-build": "delivery",
  "delivery-handoff": "delivery",
  "delivery-intake": "delivery",
  "delivery-pipeline": "delivery",
  "delivery-pr": "delivery",
  "delivery-remote": "delivery",
  "delivery-reroute": "delivery",
  "delivery-review": "delivery",
  "delivery-ship": "delivery",
  "delivery-simplify": "delivery",
  "delivery-spec-plan": "delivery",
  "delivery-status": "delivery",
  "delivery-workflow": "delivery",
  "discover-efforts": "delivery",
  evidence: "delivery",
  feedback: "delivery",
  go: "delivery",
  idea: "delivery",
  release: "delivery",
  shape: "delivery",
  "shipped-audit": "delivery",
  triage: "delivery",
  verdict: "delivery",
  worktree: "delivery",
  adr: "docs",
  amend: "docs",
  "architecture-scan": "docs",
  catalog: "docs",
  "codebase-docs": "docs",
  debt: "docs",
  design: "docs",
  docs: "docs",
  explain: "docs",
  "feature-graph": "docs",
  glossary: "docs",
  interview: "docs",
  learn: "docs",
  realign: "docs",
  requirements: "docs",
  research: "docs",
  rule: "docs",
  scope: "docs",
  spike: "docs",
  "system-docs": "docs",
  traceability: "docs",
  vision: "docs",
  visualize: "docs",
  retro: "meta",
  "skill-authoring": "meta",
  "milestone-review": "roadmap",
  pivot: "roadmap",
  "progress-chart": "roadmap",
  roadmap: "roadmap",
  "roadmap-status": "roadmap",
  goal: "session",
  interpret: "session",
  pathfind: "session",
  problem: "session",
  prompt: "session",
  prose: "session",
  "source-trust": "session",
  "working-set": "session",
  cicd: "setup",
  enclave: "setup",
  incident: "setup",
  infra: "setup",
  "local-stack": "setup",
  "mcp-config": "setup",
  observability: "setup",
  "project-layout": "setup",
  "repo-config": "setup",
  "repo-setup": "setup",
  toolchain: "setup",
  "sui-devstack": "sui",
  "sui-sdk": "sui",
  sync: "sync",
  debug: "testing",
  rust: "testing",
  tdd: "testing",
  "test-resources": "testing",
  testcontainers: "testing",
};

/**
 * One line saying what a skill is FOR, in the reader's words.
 *
 * Presentation-only, exactly like CATEGORY_MAP above: SKILL.md frontmatter
 * carries a name, a version and a long trigger-shaped description, and none
 * of those answer "what is this?" in a card-width line. Extracting a clause
 * from the description reads unevenly across the set, so these are written
 * and reviewed here, next to the other copy the site owns.
 *
 * A skill with no entry falls back to its first trigger phrase, so a new
 * directory still renders rather than showing a blank line.
 */
export const SKILL_PURPOSE: Record<string, string> = {
  acceptance: "Validate a feature end to end",
  "acceptance-api": "Validate an API against its spec",
  "acceptance-ui": "Validate a UI against its spec",
  adr: "Record why an architecture choice was made",
  "agent-instructions": "Set up CLAUDE.md and AGENTS.md",
  "agent-vendors": "Vendor skills for each coding agent",
  amend: "Make a small change to a shipped feature",
  "architecture-scan": "Scan the codebase for structural debt",
  backlog: "Sweep your assigned tickets into order",
  board: "See what waits on you and on agents",
  catalog: "Keep the feature catalog current",
  cicd: "Set up or speed up CI and deploys",
  "codebase-docs": "Generate AI-navigable codebase docs",
  debt: "Bank a known issue left unfixed",
  debug: "Find the root cause of a bug",
  "delivery-build": "Build an approved plan task by task",
  "delivery-handoff": "Hand tracked work to another agent",
  "delivery-intake": "Pick up a ticket and gather its context",
  "delivery-pipeline": "Run a ticket end to end, unsupervised",
  "delivery-pr": "Take a PR to merge-ready",
  "delivery-remote": "Run a build on another machine",
  "delivery-reroute": "Change course when the plan breaks",
  "delivery-review": "Review changes before shipping",
  "delivery-ship": "Open the PR and close out the ticket",
  "delivery-simplify": "Clean up a diff without changing behavior",
  "delivery-spec-plan": "Write the task plan for an approved design",
  "delivery-status": "See where one build stands",
  "delivery-workflow": "Keep the tracker honest while you work",
  design: "Decide how to build something",
  "discover-efforts": "Find what work is already underway",
  docs: "Bootstrap and audit the docs structure",
  "dogfood-plan": "Write a hands-on product walk",
  "dogfood-run": "Walk the product and record findings",
  enclave: "Seal secrets into a TEE enclave",
  evidence: "Prove a claim before saying it",
  explain: "Understand how a piece of the system works",
  "feature-graph": "Load a feature and its neighbours",
  feedback: "Check review feedback before acting",
  glossary: "Lock the words the team uses",
  go: "Build every ready ticket to a PR",
  goal: "Define an unattended agent goal",
  idea: "Put an idea on the board",
  incident: "Gather evidence on a live incident",
  infra: "Structure infrastructure as code",
  interpret: "Take a stance on another agent's reply",
  interview: "Get grilled until the decisions are made",
  learn: "Capture a gotcha worth remembering",
  "local-stack": "Run the stack locally, worktree-safe",
  "mcp-config": "Configure MCP servers for the repo",
  "milestone-review": "Judge whether a milestone delivered",
  observability: "Check a service can be observed",
  pathfind: "Map the route to a destination",
  pivot: "Sort shipped code after a product pivot",
  problem: "Work a hard problem across sessions",
  "progress-chart": "Chart the week's progress",
  "project-layout": "Lay out a role-first monorepo",
  prompt: "Turn a rough ask into a prompt",
  prose: "Write what a person will read",
  realign: "Bring a drifted spec back in line",
  release: "Cut a release",
  "repo-config": "Configure the repo for agent delivery",
  "repo-setup": "Set up a whole repo with the devkit",
  requirements: "Write requirements and acceptance criteria",
  research: "Answer a question from primary sources",
  retro: "Turn a session into skill edits",
  roadmap: "Plan milestones and their order",
  "roadmap-status": "See where the roadmap stands",
  rule: "Codify a standard the team follows",
  rust: "Rust error handling, features and lints",
  scope: "Decide how much process a change needs",
  shape: "Get a ticket ready for an agent",
  "shipped-audit": "Audit merged work for missed edge cases",
  "skill-authoring": "Write and test a skill",
  "source-trust": "Treat tool output as untrusted data",
  spike: "Answer a design question with running code",
  "sui-devstack": "Wire tests to a local Sui stack",
  "sui-sdk": "Call Sui over gRPC, not JSON-RPC",
  sync: "Pull upstream skill updates into a repo",
  "system-docs": "Write security and ops system docs",
  tdd: "Write the failing test first",
  "test-resources": "Share fixtures across slow tests",
  testcontainers: "Start throwaway service containers in tests",
  toolchain: "Pin versions and assign tool roles",
  traceability: "Check requirement IDs agree everywhere",
  triage: "Sort incoming issues and PRs",
  "ui-brief": "Decide how a screen looks",
  "ui-review": "Review UI changes in the browser",
  "ux-brief": "Decide how a surface behaves",
  verdict: "Record a go or no-go decision",
  vision: "Write the project vision and architecture",
  visualize: "Draw a page a person can read",
  "working-set": "Keep many ideas straight in one task",
  worktree: "Work in an isolated git worktree",
};

/** The quoted phrases a description advertises as triggers. */
export function extractTriggers(description: string): string[] {
  return Array.from(description.matchAll(/"([^"]+)"/g)).map((m) => m[1]);
}

/**
 * What a card and a map node both say about a skill, in the same order, so
 * the catalog and the map cannot describe the same skill differently.
 */
export function skillPurpose(id: string, description: string): string {
  const curated = SKILL_PURPOSE[id];
  if (curated) return curated;
  const trigger = extractTriggers(description)[0];
  return trigger ? `Ask for it with "${trigger}"` : "";
}
