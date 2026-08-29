import fs from "node:fs";
import path from "node:path";
import { extractFrontmatter } from "./frontmatter";
import { CATEGORY_LABELS, CATEGORY_MAP } from "./skill-types";

export type SkillNode = {
  /** directory name, e.g. "delivery-review" */
  id: string;
  /** frontmatter name, e.g. "cmk:delivery-review" */
  label: string;
  summary: string;
  /** grouping id shared with the catalog, e.g. "delivery" */
  category: string;
  /** the catalog's own label for that group, e.g. "Delivery" */
  categoryLabel: string;
  /** how many other skills reference this one */
  inDegree: number;
  /** how many other skills this one references */
  outDegree: number;
};

export type SkillEdge = { source: string; target: string };

export type SkillGraph = {
  nodes: SkillNode[];
  edges: SkillEdge[];
  /** referenced tokens with no matching skill directory */
  dangling: { source: string; token: string }[];
};

// Skills cite each other by their `cmk:<name>` handle, in frontmatter
// descriptions ("phase 4 of cmk:delivery-pipeline") and in body prose alike,
// so the whole file is scanned rather than just one field. A file's own name
// is excluded — every SKILL.md opens by declaring `name: cmk:<self>`, which
// would otherwise give all 34 skills a self-loop.
const HANDLE = /cmk:([a-z0-9-]+)/g;

function readSkillDirs(root: string) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();
}

function walkFiles(dir: string, out: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

export function getSkillGraph(): SkillGraph {
  const root = path.join(process.cwd(), "skills");
  if (!fs.existsSync(root)) return { nodes: [], edges: [], dangling: [] };

  const ids = readSkillDirs(root);
  const known = new Set(ids);

  const meta = new Map<string, { label: string; summary: string }>();
  const targets = new Map<string, Set<string>>();
  const dangling: { source: string; token: string }[] = [];

  for (const id of ids) {
    const dir = path.join(root, id);
    const refs = new Set<string>();

    for (const file of walkFiles(dir)) {
      let text: string;
      try {
        text = fs.readFileSync(file, "utf-8");
      } catch {
        continue;
      }

      if (path.basename(file) === "SKILL.md") {
        const { frontmatter } = extractFrontmatter(text);
        meta.set(id, {
          label: frontmatter?.find((f) => f.key === "name")?.value ?? `cmk:${id}`,
          summary: frontmatter?.find((f) => f.key === "description")?.value ?? "",
        });
      }

      for (const [, token] of text.matchAll(HANDLE)) {
        if (token === id) continue;
        if (known.has(token)) refs.add(token);
        else dangling.push({ source: id, token });
      }
    }

    targets.set(id, refs);
  }

  const edges: SkillEdge[] = [];
  const inDegree = new Map<string, number>(ids.map((id) => [id, 0]));

  for (const id of ids) {
    for (const target of targets.get(id) ?? []) {
      edges.push({ source: id, target });
      inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
    }
  }

  const nodes: SkillNode[] = ids.map((id) => {
    // Same map the catalog groups by, so a skill cannot be filed under
    // "Delivery" in one surface and somewhere else in the other.
    const category = CATEGORY_MAP[id] ?? "other";
    return {
    id,
    label: meta.get(id)?.label ?? `cmk:${id}`,
    summary: meta.get(id)?.summary ?? "",
    category,
    categoryLabel: CATEGORY_LABELS[category] ?? category,
    inDegree: inDegree.get(id) ?? 0,
    outDegree: targets.get(id)?.size ?? 0,
    };
  });

  return { nodes, edges, dangling };
}
