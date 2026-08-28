import fs from "node:fs";
import path from "node:path";
import { type RealSkill, type SkillCategoryInfo, CATEGORY_LABELS, CATEGORY_MAP } from "./skill-types";

export type { RealSkill, SkillCategoryInfo };
export { CATEGORY_LABELS };

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
