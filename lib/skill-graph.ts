import fs from "node:fs";
import path from "node:path";
import { extractFrontmatter } from "./frontmatter";
import { CATEGORY_LABELS, CATEGORY_MAP, extractTriggers, skillPurpose } from "./skill-types";

export type SkillNode = {
  /** directory name, e.g. "delivery-review" */
  id: string;
  /** frontmatter name, e.g. "cmk:delivery-review" */
  label: string;
  /** the SKILL.md H1, e.g. "Delivery Review" */
  title: string;
  /** one line saying what the skill is for, in the reader's words */
  purpose: string;
  /** the phrase the description advertises first, e.g. "review my changes" */
  trigger: string;
  summary: string;
  /** grouping id shared with the catalog, e.g. "delivery" */
  category: string;
  /** the catalog's own label for that group, e.g. "Delivery" */
  categoryLabel: string;
  /** how many other skills reference this one */
  inDegree: number;
  /** how many other skills this one references */
  outDegree: number;
  /**
   * Skills that keep company with this one: they are pulled in by the same
   * third skill. Not an edge in the graph — a co-reference, ranked by how
   * many skills name both — and the closest thing the data has to "you will
   * probably want these together".
   */
  oftenUsedWith: string[];
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

  const meta = new Map<string, { label: string; title: string; summary: string }>();
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
        const { frontmatter, body } = extractFrontmatter(text);
        meta.set(id, {
          label: frontmatter?.find((f) => f.key === "name")?.value ?? `cmk:${id}`,
          title: body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? id,
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

  // Two skills "go together" when some third skill pulls in both. Counting
  // those shared parents is what turns a reference list into a suggestion:
  // the graph knows delivery-review and cicd are named side by side, and a
  // reader looking at one is usually about to want the other.
  const companions = new Map<string, Map<string, number>>(ids.map((id) => [id, new Map()]));
  for (const id of ids) {
    const cited = Array.from(targets.get(id) ?? []);
    for (const a of cited) {
      const row = companions.get(a);
      if (!row) continue;
      for (const b of cited) {
        if (a === b) continue;
        row.set(b, (row.get(b) ?? 0) + 1);
      }
    }
  }

  const nodes: SkillNode[] = ids.map((id) => {
    // Same map the catalog groups by, so a skill cannot be filed under
    // "Delivery" in one surface and somewhere else in the other.
    const category = CATEGORY_MAP[id] ?? "other";
    const summary = meta.get(id)?.summary ?? "";
    return {
      id,
      label: meta.get(id)?.label ?? `cmk:${id}`,
      title: meta.get(id)?.title ?? id,
      purpose: skillPurpose(id, summary),
      trigger: extractTriggers(summary)[0] ?? "",
      summary,
      category,
      categoryLabel: CATEGORY_LABELS[category] ?? category,
      inDegree: inDegree.get(id) ?? 0,
      outDegree: targets.get(id)?.size ?? 0,
      oftenUsedWith: Array.from(companions.get(id) ?? [])
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 3)
        .map(([other]) => other),
    };
  });

  return { nodes, edges, dangling };
}
