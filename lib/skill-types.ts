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
