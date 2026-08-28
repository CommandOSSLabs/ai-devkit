import fs from "node:fs";
import path from "node:path";
import { extractFrontmatter } from "./frontmatter";
import { getSkillGraph } from "./skill-graph";
import { CATEGORY_LABELS, CATEGORY_MAP, type SkillCategoryInfo } from "./skill-types";

export type SkillFileRef = {
  /** path relative to skills/, matching SkillTreeNode ids — e.g. "adr/references/adr-template.md" */
  id: string;
  name: string;
  /** path relative to the skill root — e.g. "references/adr-template.md" */
  relativePath: string;
  size: string;
};

export type SkillSection = {
  title: string;
  /** first line under the heading, plain text, for a one-line preview */
  teaser: string;
};

export type SkillSummary = {
  /** directory name — e.g. "delivery-review" */
  id: string;
  /** frontmatter name — e.g. "cmk:delivery-review" */
  handle: string;
  /** the SKILL.md H1 — e.g. "Delivery Review" */
  title: string;
  /** frontmatter description: the full "use when" sentence */
  description: string;
  /** first paragraph of the body: what the skill actually does */
  summary: string;
  version: string;
  category: string;
  categoryLabel: string;
  /** the quoted phrases the description advertises as triggers */
  triggers: string[];
  sections: SkillSection[];
  /** the subset of sections that describe a procedure */
  workflows: SkillSection[];
  files: SkillFileRef[];
  /** skill ids this one references by cmk: handle */
  references: string[];
  /** skill ids that reference this one */
  referencedBy: string[];
};

const SKILL_FILE = "SKILL.md";

function skillsDir() {
  return path.join(process.cwd(), "skills");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/*
 * Enough markdown to render a heading or a first line as plain text in a
 * card — deliberately not a parser. The catalog only ever shows these
 * strings as one-line summaries, so inline marks are noise; block structure
 * is left to MarkdownPreview, which renders the real document.
 */
function stripInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|\W)\*([^*]+)\*/g, "$1$2")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanLine(line: string): string {
  return line
    .trim()
    .replace(/^>\s?/, "")
    .replace(/^[-*+]\s+/, "")
    .replace(/^\d+\.\s+/, "");
}

type ParsedBody = { title: string; summary: string; sections: SkillSection[] };

function parseSkillBody(body: string): ParsedBody {
  const lines = body.split(/\r?\n/);
  let inFence = false;
  let title = "";

  const summaryLines: string[] = [];
  let collecting: "summary" | "teaser" | null = null;

  const sections: SkillSection[] = [];
  let pending: { title: string; teaser: string[] } | null = null;

  const flush = () => {
    if (!pending) return;
    sections.push({ title: pending.title, teaser: stripInline(pending.teaser.join(" ")) });
    pending = null;
  };

  for (const raw of lines) {
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const h2 = raw.match(/^##[ \t]+(.+)$/);
    if (h2) {
      flush();
      pending = { title: stripInline(h2[1]), teaser: [] };
      collecting = "teaser";
      continue;
    }

    const h1 = raw.match(/^#[ \t]+(.+)$/);
    if (h1) {
      flush();
      if (!title) title = stripInline(h1[1]);
      collecting = "summary";
      continue;
    }

    if (/^#{3,}[ \t]/.test(raw)) {
      collecting = null;
      continue;
    }

    const isBlank = raw.trim() === "";

    if (collecting === "summary") {
      if (isBlank) {
        if (summaryLines.length > 0) collecting = null;
        continue;
      }
      summaryLines.push(cleanLine(raw));
    } else if (collecting === "teaser" && pending) {
      if (isBlank) {
        if (pending.teaser.length > 0) collecting = null;
        continue;
      }
      // A table or a bare separator says nothing useful in one line.
      if (/^[|:\-\s]+$/.test(raw.trim())) continue;
      pending.teaser.push(cleanLine(raw));
    }
  }

  flush();
  return { title, summary: stripInline(summaryLines.join(" ")), sections };
}

function collectFiles(dir: string, skillId: string, out: SkillFileRef[] = []): SkillFileRef[] {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith("."))
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, skillId, out);
      continue;
    }
    const relativePath = path.relative(path.join(skillsDir(), skillId), full);
    out.push({
      id: path.join(skillId, relativePath),
      name: entry.name,
      relativePath,
      size: formatSize(fs.statSync(full).size),
    });
  }

  return out;
}

/** Trigger phrases are already written down: the description quotes them verbatim. */
function extractTriggers(description: string): string[] {
  return Array.from(description.matchAll(/"([^"]+)"/g)).map((m) => m[1]);
}

let cached: SkillSummary[] | null = null;

/**
 * Reads skills/ at build time and normalizes it into the shape the catalog,
 * detail and workspace views all render from — one pass, one contract, so
 * three surfaces can't drift into disagreeing about what a skill is.
 *
 * Four route files ask for this, once per generated page, and every ask
 * re-walks skills/ twice (once here, once for the reference graph). The
 * directory cannot change during a production build, so the result is read
 * once and kept. Dev deliberately opts out, so editing a SKILL.md still shows
 * up on reload.
 */
export function getSkillCatalog(): SkillSummary[] {
  if (cached && process.env.NODE_ENV === "production") return cached;

  const root = skillsDir();
  if (!fs.existsSync(root)) return [];

  const graph = getSkillGraph();
  const references = new Map<string, string[]>();
  const referencedBy = new Map<string, string[]>();
  for (const edge of graph.edges) {
    references.set(edge.source, [...(references.get(edge.source) ?? []), edge.target]);
    referencedBy.set(edge.target, [...(referencedBy.get(edge.target) ?? []), edge.source]);
  }

  const dirs = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();

  const skills: SkillSummary[] = [];

  for (const id of dirs) {
    const skillMd = path.join(root, id, SKILL_FILE);
    if (!fs.existsSync(skillMd)) continue;

    const raw = fs.readFileSync(skillMd, "utf-8");
    const { frontmatter, body } = extractFrontmatter(raw);
    const field = (key: string) => frontmatter?.find((f) => f.key === key)?.value ?? "";

    const description = field("description");
    const parsed = parseSkillBody(body);
    const files = collectFiles(path.join(root, id), id);
    const category = CATEGORY_MAP[id] ?? "other";

    skills.push({
      id,
      handle: field("name") || `cmk:${id}`,
      title: parsed.title || id,
      description,
      summary: parsed.summary,
      version: field("version") || "0.0.0",
      category,
      categoryLabel: CATEGORY_LABELS[category] ?? category,
      triggers: extractTriggers(description),
      sections: parsed.sections,
      workflows: parsed.sections.filter((s) => /^workflow/i.test(s.title)),
      files,
      references: (references.get(id) ?? []).sort(),
      referencedBy: (referencedBy.get(id) ?? []).sort(),
    });
  }

  cached = skills.sort((a, b) => a.id.localeCompare(b.id));
  return cached;
}

export function getCatalogCategories(skills: SkillSummary[]): SkillCategoryInfo[] {
  const counts = new Map<string, number>();
  for (const skill of skills) counts.set(skill.category, (counts.get(skill.category) ?? 0) + 1);

  return Array.from(counts.entries())
    .map(([id, count]) => ({ id, label: CATEGORY_LABELS[id] ?? id, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** The raw SKILL.md for one skill, or null when there isn't one. */
export function getSkillDocument(id: string): string | null {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  const file = path.join(skillsDir(), id, SKILL_FILE);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : null;
}
