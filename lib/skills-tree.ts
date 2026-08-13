import fs from "node:fs";
import path from "node:path";

export type FileKind = "code" | "text" | "image";

export type SkillTreeNode =
  | { id: string; name: string; type: "folder"; children: SkillTreeNode[] }
  | { id: string; name: string; type: "file"; kind: FileKind; size: string; content: string | null };

const CODE_EXT = new Set([".sh", ".ts", ".tsx", ".js", ".jsx", ".py", ".json", ".yaml", ".yml"]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]);

// Content is only embedded for files small enough that reading them doesn't
// meaningfully grow the page — this repo's skills/ directory is ~600KB
// total, so embedding everything at build time is cheap and means the
// browser needs no API route to read a file's content, consistent with the
// rest of the site's `force-static` pages.
const MAX_EMBED_BYTES = 200_000;

function kindOf(fileName: string): FileKind {
  const ext = path.extname(fileName).toLowerCase();
  if (IMAGE_EXT.has(ext)) return "image";
  if (CODE_EXT.has(ext)) return "code";
  return "text";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function walk(dir: string, relativeTo: string): SkillTreeNode[] {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith("."))
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  return entries.map((entry): SkillTreeNode => {
    const fullPath = path.join(dir, entry.name);
    const id = path.relative(relativeTo, fullPath);

    if (entry.isDirectory()) {
      return { id, name: entry.name, type: "folder", children: walk(fullPath, relativeTo) };
    }

    const stat = fs.statSync(fullPath);
    const kind = kindOf(entry.name);
    let content: string | null = null;
    if (kind !== "image" && stat.size <= MAX_EMBED_BYTES) {
      content = fs.readFileSync(fullPath, "utf-8");
    }

    return { id, name: entry.name, type: "file", kind, size: formatSize(stat.size), content };
  });
}

/** Reads the real skills/ directory tree, with file content embedded for reading in the browser. */
export function getSkillsTree(): SkillTreeNode[] {
  const skillsDir = path.join(process.cwd(), "skills");
  if (!fs.existsSync(skillsDir)) return [];
  return walk(skillsDir, skillsDir);
}
