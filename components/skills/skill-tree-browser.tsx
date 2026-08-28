"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Folder, FolderOpen, PanelLeft, Search, X } from "lucide-react";
import type { SkillTreeNode } from "@/lib/skills-tree";
import { fileVisual, FOLDER_COLOR, TREE_ACCENT } from "@/lib/file-icons";
import { readSkillDrafts, writeSkillDrafts } from "@/lib/skill-drafts";
import { FileContentPane, type PaneMode } from "./file-content-pane";

// The file tree of one skill, next to the editor that reads and edits it.
//
// Two things changed when /skills became a catalog. The tree sits on the
// LEFT of the editor, which is where every file browser people already use
// puts it — it used to be on the right, so the eye had to cross the reading
// column to navigate. And it is scoped to a single skill, opened from that
// skill's page, so there is no "pick one of 34 folders" step before you can
// read anything: SKILL.md is already open when you arrive.
//
// Keyboard tree navigation (arrows/home/end/enter) is preserved as-is.

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

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

function firstFileId(nodes: SkillTreeNode[]): string | null {
  for (const n of nodes) {
    if (n.type === "file") return n.id;
    const nested = firstFileId(n.children);
    if (nested) return nested;
  }
  return null;
}

/** Keeps folders whose name matches, and folders on the path to a matching file. */
function pruneTree(nodes: SkillTreeNode[], needle: string): SkillTreeNode[] {
  const out: SkillTreeNode[] = [];
  for (const node of nodes) {
    if (node.type === "folder") {
      const children = pruneTree(node.children, needle);
      if (children.length > 0) out.push({ ...node, children });
      else if (node.name.toLowerCase().includes(needle)) out.push(node);
    } else if (node.id.toLowerCase().includes(needle)) {
      out.push(node);
    }
  }
  return out;
}

const BASE = 12;
const INDENT = 16;
const CHEVRON_CENTER = 8;

export default function SkillTreeBrowser({
  tree,
  rootLabel,
}: {
  tree: SkillTreeNode[];
  /** the skill directory these paths hang off, shown as the tree's root row */
  rootLabel: string;
}) {
  const allFolders = useMemo(() => collectFolders(tree), [tree]);
  const defaultFileId = useMemo(
    () => findFile(tree, `${rootLabel}/SKILL.md`)?.id ?? firstFileId(tree),
    [rootLabel, tree],
  );

  const [filter, setFilter] = useState("");
  // A skill holds a handful of files, so everything starts open: collapsing
  // by default would hide the references behind a click for no gain.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(allFolders));
  const [openIds, setOpenIds] = useState<string[]>(() => (defaultFileId ? [defaultFileId] : []));
  const [activeTabId, setActiveTabId] = useState<string | null>(defaultFileId);
  const [activeId, setActiveId] = useState<string>(defaultFileId ?? tree[0]?.id ?? "");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<PaneMode>("preview");
  // Drafts live here rather than in the pane so they outlive a tab: closing a
  // file you edited can then genuinely offer "keep the draft", and the tree
  // can mark which files are carrying one.
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pendingFocus = useRef(false);
  const deepLinkRead = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const draftsLoaded = useRef(false);
  const filesButtonRef = useRef<HTMLButtonElement>(null);

  const needle = filter.trim().toLowerCase();
  const visibleTree = useMemo(() => (needle ? pruneTree(tree, needle) : tree), [tree, needle]);
  const effectiveExpanded = useMemo(
    () => (needle ? new Set(collectFolders(visibleTree)) : expanded),
    [needle, visibleTree, expanded],
  );

  const rows = useMemo(() => flatten(visibleTree, effectiveExpanded), [visibleTree, effectiveExpanded]);
  const activeIndex = rows.findIndex((r) => r.node.id === activeId);
  const effectiveIndex = activeIndex === -1 ? 0 : activeIndex;
  const effectiveId = rows[effectiveIndex]?.node.id ?? "";

  // Drafts are restored before anything can write over them, and every later
  // change is mirrored back out, so a round trip to another route returns to
  // the same buffer.
  useEffect(() => {
    setDrafts(readSkillDrafts(rootLabel));
    draftsLoaded.current = true;
  }, [rootLabel]);

  useEffect(() => {
    if (!draftsLoaded.current) return;
    writeSkillDrafts(rootLabel, drafts);
  }, [rootLabel, drafts]);

  // A deep link names a path relative to the skill and optionally a mode,
  // e.g. ?file=references/adr-template.md&mode=source. Read once after mount
  // so the page itself stays statically generated.
  useEffect(() => {
    // Read once, ever. The sync effect below rewrites the query string on the
    // first commit, so a second run of this effect (React's development
    // double-invoke) would read back the URL it just wrote and undo the deep
    // link it had already applied.
    if (deepLinkRead.current) return;
    deepLinkRead.current = true;

    const params = new URLSearchParams(window.location.search);
    const requestedMode = params.get("mode");
    if (requestedMode === "source" || requestedMode === "edit" || requestedMode === "preview") {
      setMode(requestedMode);
    }

    const requested = params.get("file");
    if (!requested) return;
    const id = `${rootLabel}/${requested}`;
    if (!findFile(tree, id)) return;
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveTabId(id);
    setActiveId(id);
  }, [rootLabel, tree]);

  // Keep the address bar describing the workspace, so a link to "this file, in
  // Source" survives a refresh and can be handed to someone else.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeTabId) params.set("file", activeTabId.slice(rootLabel.length + 1));
    else params.delete("file");
    if (mode === "preview") params.delete("mode");
    else params.set("mode", mode);
    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [activeTabId, mode, rootLabel]);

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    rowRefs.current[effectiveId]?.focus({ preventScroll: true });
  });

  // A drawer that leaves focus behind it strands keyboard and screen-reader
  // users on content they can no longer see, so focus moves in with it, Tab
  // stays inside while it is open, and Escape or a pick hands focus back to
  // the control that opened it.
  useEffect(() => {
    if (!sheetOpen) {
      return;
    }

    const panel = sheetRef.current;
    // Captured now, not read during cleanup: by then React may have swapped
    // the node this ref points at.
    const opener = filesButtonRef.current;
    panel?.querySelector<HTMLInputElement>("input")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSheetOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [sheetOpen]);

  const requestFocus = () => {
    pendingFocus.current = true;
  };

  const isExpanded = useCallback((id: string) => effectiveExpanded.has(id), [effectiveExpanded]);

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
    setMode("preview");
    setSheetOpen(false);
  };

  const hasDraft = useCallback(
    (node: SkillTreeNode) =>
      node.type === "file" && drafts[node.id] !== undefined && drafts[node.id] !== node.content,
    [drafts],
  );

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
        if (rows[0]) setActiveId(rows[0].node.id);
        requestFocus();
        break;
      }
      case "End": {
        e.preventDefault();
        const last = rows[rows.length - 1];
        if (last) setActiveId(last.node.id);
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

  const openFiles = openIds
    .map((id) => findFile(tree, id))
    .filter((f): f is Extract<SkillTreeNode, { type: "file" }> => f !== null);
  const activeFile = activeTabId ? findFile(tree, activeTabId) : null;
  const fileCount = useMemo(() => {
    let n = 0;
    const walk = (nodes: SkillTreeNode[]) => {
      for (const node of nodes) {
        if (node.type === "folder") walk(node.children);
        else n++;
      }
    };
    walk(tree);
    return n;
  }, [tree]);

  return (
    <div className="skills-workspace relative flex h-full min-h-0 overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      {sheetOpen && (
        <button
          type="button"
          aria-label="Close file list"
          onClick={() => setSheetOpen(false)}
          className="absolute inset-0 z-20 bg-black/40 lg:hidden"
        />
      )}

      <div
        ref={sheetRef}
        role={sheetOpen ? "dialog" : undefined}
        aria-modal={sheetOpen ? true : undefined}
        aria-label={sheetOpen ? `Files in ${rootLabel}` : undefined}
        className={cx(
          "absolute inset-y-0 left-0 z-30 flex w-[min(320px,86%)] min-h-0 flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-transform duration-200 ease-out",
          "lg:static lg:z-auto lg:w-[272px] lg:shrink-0 lg:translate-x-0 lg:bg-[var(--glass-frame)]",
          sheetOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-[var(--border-subtle)] px-3">
          <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-[var(--text-tertiary)]">
            skills/{rootLabel}
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-[var(--text-disabled)]">{fileCount}</span>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            aria-label="Close file list"
            className="-mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] lg:hidden"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="shrink-0 border-b border-[var(--border-subtle)] p-2">
          <div className="relative">
            <Search
              size={12}
              strokeWidth={1.75}
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && filter) {
                  e.preventDefault();
                  setFilter("");
                }
              }}
              placeholder="Filter files"
              aria-label="Filter files in this skill"
              className="h-7 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] pl-7 pr-2 text-[12px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-disabled)] focus:border-[#82AAFF]/60 [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-1">
          {rows.length === 0 ? (
            <p className="px-3 py-4 text-[12px] text-[var(--text-tertiary)]">No file matches that filter.</p>
          ) : (
            <div role="tree" aria-label={`skills/${rootLabel} files`} onKeyDown={onKeyDown}>
              {rows.map((row) => {
                const { node, depth } = row;
                const folder = node.type === "folder";
                const open = folder && isExpanded(node.id);
                const isActive = node.id === effectiveId;
                const isSelected = node.id === activeTabId;
                const visual = folder ? null : fileVisual(node.name);
                const Icon = folder ? (open ? FolderOpen : Folder) : visual!.Icon;
                const iconColor = folder ? FOLDER_COLOR : visual!.color;

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
                    style={{
                      paddingLeft: BASE + depth * INDENT,
                      ...(isSelected
                        ? { backgroundColor: `${TREE_ACCENT}1A`, boxShadow: `inset 0 0 0 1px ${TREE_ACCENT}66` }
                        : undefined),
                    }}
                    className={cx(
                      "relative flex h-9 cursor-pointer items-center gap-1.5 pr-3 text-[13px] transition-colors",
                      !isSelected && "hover:bg-[var(--bg-elevated)]",
                      "focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#82AAFF]",
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

                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="h-3.5 w-3.5 shrink-0 transition-opacity"
                      style={{ color: iconColor, opacity: folder && !open ? 0.6 : 1 }}
                    />

                    <span
                      className={cx(
                        "min-w-0 flex-1 truncate font-mono",
                        isSelected ? "font-medium" : "text-[var(--text-primary)]",
                      )}
                      style={isSelected ? { color: TREE_ACCENT } : undefined}
                    >
                      {node.name}
                    </span>

                    {!folder && hasDraft(node) && (
                      <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.06em] text-[#82AAFF]">
                        draft
                      </span>
                    )}

                    {!folder && (
                      <span className="shrink-0 text-[11px] tabular-nums text-[var(--text-tertiary)]">{node.size}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-[var(--border-subtle)] px-2 lg:hidden">
          <button
            ref={filesButtonRef}
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-2 text-[12px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <PanelLeft size={12} strokeWidth={1.75} />
            Files
            <span className="tabular-nums text-[var(--text-disabled)]">{fileCount}</span>
          </button>
          <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-[var(--text-tertiary)]">
            {activeFile ? activeFile.id : `skills/${rootLabel}`}
          </span>
        </div>

        <FileContentPane
          openFiles={openFiles}
          activeId={activeTabId}
          activeFile={activeFile}
          mode={mode}
          drafts={drafts}
          onSelectTab={setActiveTabId}
          onCloseTab={closeTab}
          onModeChange={setMode}
          onDraftChange={(id, text) => setDrafts((d) => ({ ...d, [id]: text }))}
          onDraftRevert={(id) =>
            setDrafts((d) => {
              const next = { ...d };
              delete next[id];
              return next;
            })
          }
        />
      </div>
    </div>
  );
}
