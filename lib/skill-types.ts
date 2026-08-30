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
  other: "Other",
};

/*
 * Category is presentation-only grouping — it is not in the real SKILL.md
 * frontmatter (only name/description/version are). Known ids get a real
 * label; anything new that shows up in skills/ that we don't recognize yet
 * still renders (falls into "other") instead of silently disappearing.
 */
export const CATEGORY_MAP: Record<string, string> = {
  "delivery-workflow": "delivery",
  "discover-efforts": "delivery",
  "delivery-intake": "delivery",
  "delivery-spec-plan": "delivery",
  "delivery-simplify": "delivery",
  "delivery-review": "delivery",
  "delivery-ship": "delivery",
  "delivery-pipeline": "delivery",
  "delivery-handoff": "delivery",
  "repo-setup": "setup",
  "project-layout": "setup",
  toolchain: "setup",
  "mcp-config": "setup",
  "local-stack": "setup",
  infra: "setup",
  cicd: "setup",
  enclave: "setup",
  "agent-instructions": "agent",
  "agent-vendors": "agent",
  sync: "sync",
  docs: "docs",
  "codebase-docs": "docs",
  requirements: "docs",
  design: "docs",
  adr: "docs",
  glossary: "docs",
  rule: "docs",
  learn: "docs",
  "test-resources": "testing",
  testcontainers: "testing",
  rust: "testing",
  "sui-sdk": "sui",
  "sui-devstack": "sui",
  interpret: "session",
};

/**
 * One line saying what a skill is FOR, in the reader's words.
 *
 * Presentation-only, exactly like CATEGORY_MAP above: SKILL.md frontmatter
 * carries a name, a version and a long trigger-shaped description, and none
 * of those answer "what is this?" in a card-width line. Extracting a clause
 * from the description reads unevenly across 34 skills, so these are written
 * and reviewed here, next to the other copy the site owns.
 *
 * A skill with no entry falls back to its first trigger phrase, so a new
 * directory still renders rather than showing a blank line.
 */
export const SKILL_PURPOSE: Record<string, string> = {
  adr: "Record why an architecture choice was made",
  "agent-instructions": "Set up CLAUDE.md and AGENTS.md",
  "agent-vendors": "Vendor skills for each coding agent",
  cicd: "Set up or speed up CI and deploys",
  "codebase-docs": "Generate AI-navigable codebase docs",
  "delivery-handoff": "Hand tracked work to another agent",
  "delivery-intake": "Pick up a ticket and gather its context",
  "delivery-pipeline": "Run a ticket end to end, unsupervised",
  "delivery-review": "Review changes before shipping",
  "delivery-ship": "Open the PR and close out the ticket",
  "delivery-simplify": "Clean up a diff without changing behavior",
  "delivery-spec-plan": "Write the spec and plan before building",
  "delivery-workflow": "Keep the tracker honest while you work",
  design: "Decide how to build something",
  "discover-efforts": "Find what work is already underway",
  docs: "Bootstrap and audit the docs structure",
  enclave: "Seal secrets into a TEE enclave",
  glossary: "Lock the words the team uses",
  infra: "Structure infrastructure as code",
  interpret: "Take a stance on another agent's reply",
  learn: "Capture a gotcha worth remembering",
  "local-stack": "Run the stack locally, worktree-safe",
  "mcp-config": "Configure MCP servers for the repo",
  "project-layout": "Lay out a role-first monorepo",
  "repo-setup": "Set up a whole repo with the devkit",
  requirements: "Write requirements and acceptance criteria",
  rule: "Codify a standard the team follows",
  rust: "Rust error handling, features and lints",
  "sui-devstack": "Wire tests to a local Sui stack",
  "sui-sdk": "Call Sui over gRPC, not JSON-RPC",
  sync: "Pull upstream skill updates into a repo",
  "test-resources": "Share fixtures across slow tests",
  testcontainers: "Start throwaway service containers in tests",
  toolchain: "Pin versions and assign tool roles",
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
