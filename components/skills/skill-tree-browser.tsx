"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, FileCode, FileText, Folder, FolderOpen, Image as ImageIcon } from "lucide-react";
import type { SkillTreeNode, FileKind } from "@/lib/skills-tree";
import { FileContentPane } from "./file-content-pane";

// Adapted from React Bits Pro's "List12" file-tree browser — swapped the
// mock TREE for real skills/ directory data (lib/skills-tree.ts), added the
// content detail pane on the right (the point of this page is reading a
// skill's actual files, not just seeing names/sizes), and restyled onto
// this site's own design tokens (var(--bg-surface) etc.) instead of the
// neutral-*/rb-accent Tailwind classes the original used — those exist in
// this repo's tailwind.config.ts too, but nothing else on the site uses
// them, so matching the dominant pattern keeps this page visually
// consistent with the rest of ai-devkit rather than introducing a second
// look. Keyboard tree navigation (arrows/home/end/enter) is preserved as-is.

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const FILE_ICON: Record<FileKind, typeof FileCode> = { code: FileCode, text: FileText, image: ImageIcon };

type Row = {
  node: SkillTreeNode;
  depth: number;
  parentId: string | null;
  hasChildren: boolean;
  posInSet: number;
  setSize: number;
};

function flatten(
  nodes: SkillTreeNode[],
  expanded: Set<string>,
  depth = 0,
  parentId: string | null = null,
  out: Row[] = [],
) {
  for (const [i, node] of nodes.entries()) {
    const folder = node.type === "folder";
    out.push({
      node,
      depth,
      parentId,
      hasChildren: folder && node.children.length > 0,
      posInSet: i + 1,
      setSize: nodes.length,
    });
    if (folder && expanded.has(node.id)) {
      flatten(node.children, expanded, depth + 1, node.id, out);
    }
  }
  return out;
}

function collectFolders(nodes: SkillTreeNode[], out: string[] = []) {
  for (const n of nodes) {
    if (n.type === "folder") {
      out.push(n.id);
      collectFolders(n.children, out);
    }
  }
  return out;
}

function findFile(nodes: SkillTreeNode[], id: string): Extract<SkillTreeNode, { type: "file" }> | null {
  for (const n of nodes) {
    if (n.id === id) return n.type === "file" ? n : null;
    if (n.type === "folder") {
      const found = findFile(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

const BASE = 12;
const INDENT = 16;
const CHEVRON_CENTER = 8;

export default function SkillTreeBrowser({ tree }: { tree: SkillTreeNode[] }) {
  const topFolders = useMemo(() => tree.filter((n) => n.type === "folder").map((n) => n.id), [tree]);
  const allFolders = useMemo(() => collectFolders(tree), [tree]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(topFolders.slice(0, 1)));
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>(tree[0]?.id ?? "");

  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pendingFocus = useRef(false);

  const rows = useMemo(() => flatten(tree, expanded), [tree, expanded]);
  const activeIndex = rows.findIndex((r) => r.node.id === activeId);
  const effectiveIndex = activeIndex === -1 ? 0 : activeIndex;
  const effectiveId = rows[effectiveIndex]?.node.id ?? tree[0]?.id ?? "";

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    rowRefs.current[effectiveId]?.focus({ preventScroll: true });
  });

  const requestFocus = () => {
    pendingFocus.current = true;
  };

  const isExpanded = useCallback((id: string) => expanded.has(id), [expanded]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openFile = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    setOpenIds((prev) => {
      const next = prev.filter((x) => x !== id);
      setActiveTabId((current) => (current === id ? (next[next.length - 1] ?? null) : current));
      return next;
    });
  };

  const onRowClick = (row: Row) => {
    setActiveId(row.node.id);
    if (row.node.type === "folder") toggle(row.node.id);
    else openFile(row.node.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const row = rows[effectiveIndex];
    if (!row) return;
    const folder = row.node.type === "folder";
    const open = folder && isExpanded(row.node.id);

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = rows[Math.min(effectiveIndex + 1, rows.length - 1)];
        setActiveId(next.node.id);
        requestFocus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = rows[Math.max(effectiveIndex - 1, 0)];
        setActiveId(prev.node.id);
        requestFocus();
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (folder && !open && row.hasChildren) {
          toggle(row.node.id);
        } else if (open) {
          const child = rows[effectiveIndex + 1];
          if (child && child.parentId === row.node.id) {
            setActiveId(child.node.id);
            requestFocus();
          }
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (open) {
          toggle(row.node.id);
        } else if (row.parentId) {
          setActiveId(row.parentId);
          requestFocus();
        }
        break;
      }
      case "Home": {
        e.preventDefault();
        setActiveId(rows[0].node.id);
        requestFocus();
        break;
      }
      case "End": {
        e.preventDefault();
        setActiveId(rows[rows.length - 1].node.id);
        requestFocus();
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        onRowClick(row);
        break;
      }
    }
  };

  const expandAll = () => setExpanded(new Set(allFolders));
  const collapseAll = () => {
    setExpanded(new Set());
    setActiveId(tree[0]?.id ?? "");
  };

  const openFiles = openIds
    .map((id) => findFile(tree, id))
    .filter((f): f is Extract<SkillTreeNode, { type: "file" }> => f !== null);
  const activeFile = activeTabId ? findFile(tree, activeTabId) : null;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="flex min-h-0 flex-1 flex-col-reverse lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <FileContentPane
            openFiles={openFiles}
            activeId={activeTabId}
            activeFile={activeFile}
            onSelectTab={setActiveTabId}
            onCloseTab={closeTab}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--bg-frame)] lg:w-[380px] lg:flex-none lg:border-l lg:border-t-0">
          <div className="flex shrink-0 items-center justify-end gap-1.5 border-b border-[var(--border-subtle)] px-2 py-2">
            <button
              type="button"
              onClick={expandAll}
              className="inline-flex h-7 items-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="inline-flex h-7 items-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Collapse all
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto py-1">
            <div role="tree" aria-label="skills/ directory" onKeyDown={onKeyDown}>
              {rows.map((row) => {
                const { node, depth } = row;
                const folder = node.type === "folder";
                const open = folder && isExpanded(node.id);
                const isActive = node.id === effectiveId;
                const isSelected = node.id === activeTabId;
                const Icon = folder ? (open ? FolderOpen : Folder) : FILE_ICON[node.kind];

                return (
                  <div
                    key={node.id}
                    ref={(el) => {
                      rowRefs.current[node.id] = el;
                    }}
                    role="treeitem"
                    aria-level={depth + 1}
                    aria-posinset={row.posInSet}
                    aria-setsize={row.setSize}
                    aria-expanded={folder ? open : undefined}
                    aria-selected={!folder ? isSelected : undefined}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => onRowClick(row)}
                    style={{ paddingLeft: BASE + depth * INDENT }}
                    className={cx(
                      "relative flex h-9 cursor-pointer items-center gap-1.5 pr-3 text-[13px] transition-colors",
                      "focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#82AAFF]",
                      isSelected
                        ? "bg-[#82AAFF]/10 ring-1 ring-inset ring-[#82AAFF]/40"
                        : "hover:bg-[var(--bg-elevated)]",
                    )}
                  >
                    {Array.from({ length: depth }, (_, k) => (
                      <span
                        key={k}
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 top-0 w-px bg-[var(--border-subtle)]"
                        style={{ left: BASE + k * INDENT + CHEVRON_CENTER }}
                      />
                    ))}

                    {folder ? (
                      <ChevronRight
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className={cx(
                          "h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)] transition-transform duration-150 ease-out",
                          open && "rotate-90",
                        )}
                      />
                    ) : (
                      <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    )}

                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" />

                    <span
                      className={cx(
                        "min-w-0 flex-1 truncate font-mono",
                        isSelected ? "font-medium text-[var(--text-primary)]" : "text-[var(--text-primary)]",
                      )}
                    >
                      {node.name}
                    </span>

                    {!folder && (
                      <span className="shrink-0 text-[11px] tabular-nums text-[var(--text-tertiary)]">{node.size}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
