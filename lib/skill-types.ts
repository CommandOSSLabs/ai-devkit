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
