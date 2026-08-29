import {
  File,
  FileCode,
  FileCog,
  FileJson,
  FileText,
  Image as ImageIcon,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export type FileVisual = { Icon: LucideIcon; color: string };

// Colors come from the project's own --syntax-* palette (globals.css), which
// already ships a light and a dark value for each hue — so the tree tints
// itself correctly in both themes instead of hardcoding one set of hex that
// would go unreadable on the other. Grouping mirrors how the syntax
// highlighter already colors these languages in the editor pane.
const BY_EXT: Record<string, FileVisual> = {
  md: { Icon: FileText, color: "var(--syntax-func)" },
  mdx: { Icon: FileText, color: "var(--syntax-func)" },
  txt: { Icon: FileText, color: "var(--syntax-comment)" },

  ts: { Icon: FileCode, color: "var(--syntax-keyword)" },
  tsx: { Icon: FileCode, color: "var(--syntax-keyword)" },
  js: { Icon: FileCode, color: "var(--syntax-keyword)" },
  jsx: { Icon: FileCode, color: "var(--syntax-keyword)" },
  py: { Icon: FileCode, color: "var(--syntax-keyword)" },

  json: { Icon: FileJson, color: "var(--syntax-const)" },

  yaml: { Icon: FileCog, color: "var(--syntax-number)" },
  yml: { Icon: FileCog, color: "var(--syntax-number)" },
  toml: { Icon: FileCog, color: "var(--syntax-number)" },
  env: { Icon: FileCog, color: "var(--syntax-number)" },

  sh: { Icon: Terminal, color: "var(--syntax-string)" },
  bash: { Icon: Terminal, color: "var(--syntax-string)" },

  png: { Icon: ImageIcon, color: "var(--syntax-error)" },
  jpg: { Icon: ImageIcon, color: "var(--syntax-error)" },
  jpeg: { Icon: ImageIcon, color: "var(--syntax-error)" },
  gif: { Icon: ImageIcon, color: "var(--syntax-error)" },
  svg: { Icon: ImageIcon, color: "var(--syntax-error)" },
  webp: { Icon: ImageIcon, color: "var(--syntax-error)" },
};

const FALLBACK: FileVisual = { Icon: File, color: "var(--text-tertiary)" };

export function fileVisual(name: string): FileVisual {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return BY_EXT[ext] ?? FALLBACK;
}

/** Folders keep the classic amber tint, dimmed while collapsed. */
export const FOLDER_COLOR = "var(--syntax-const)";

/** Accent for the selected row — the reference file-tree's pink. */
export const TREE_ACCENT = "#F472B6";
