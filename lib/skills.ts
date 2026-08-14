import fs from "node:fs";
import path from "node:path";
import { type RealSkill, type SkillCategoryInfo, CATEGORY_LABELS } from "./skill-types";

export type { RealSkill, SkillCategoryInfo };
export { CATEGORY_LABELS };

/*
 * Category is presentation-only grouping — it's not in the real SKILL.md
 * frontmatter (only name/description/version are). Known ids get a real
 * label; anything new that shows up in skills/ that we don't recognize yet
 * still renders (falls into "other") instead of silently disappearing.
 */
const CATEGORY_MAP: Record<string, string> = {
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

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return fm;
}

function extractTriggers(description: string): string[] {
  const matches = [...description.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  return matches.slice(0, 2);
}

/** Reads every skills/<id>/SKILL.md in the repo and returns real, synced skill data. */
export function getAllSkills(): RealSkill[] {
  const skillsDir = path.join(process.cwd(), "skills");
  if (!fs.existsSync(skillsDir)) return [];

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory());
  const skills: RealSkill[] = [];

  for (const entry of entries) {
    const skillMdPath = path.join(skillsDir, entry.name, "SKILL.md");
    if (!fs.existsSync(skillMdPath)) continue;

    const raw = fs.readFileSync(skillMdPath, "utf-8");
    const fm = parseFrontmatter(raw);
    if (!fm.name || !fm.description) continue;

    skills.push({
      id: entry.name,
      name: fm.name,
      description: fm.description,
      version: fm.version ?? "0.0.0",
      category: CATEGORY_MAP[entry.name] ?? "other",
      triggers: extractTriggers(fm.description),
    });
  }

  return skills.sort((a, b) => a.id.localeCompare(b.id));
}

export function getSkillCategories(skills: RealSkill[]): SkillCategoryInfo[] {
  const present = Array.from(new Set(skills.map((s) => s.category)));
  return present
    .sort((a, b) => a.localeCompare(b))
    .map((id) => ({ id, label: CATEGORY_LABELS[id] ?? id }));
}
