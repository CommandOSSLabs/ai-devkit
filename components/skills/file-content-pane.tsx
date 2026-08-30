"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Code2, ExternalLink, Eye, FileText, Pencil, X } from "lucide-react";
import type { FileKind } from "@/lib/skills-tree";
import { fileVisual } from "@/lib/file-icons";
import { REPO_SKILLS_BLOB } from "@/lib/repo-links";
import { CodeBlock } from "@/components/ui/code-block";
import { MarkdownPreview } from "./markdown-preview";
import { markdownEditorStats } from "@/lib/markdown-stats";

// The editor and its toolbar only matter once someone switches to Edit, and
// most visits never do — so it loads then rather than riding along in the
// workspace bundle for every reader.
const MarkdownEditor = dynamic(() => import("./markdown-editor").then((m) => m.MarkdownEditor), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-0 flex-1 items-center justify-center text-[12.5px] text-[var(--text-tertiary)]">
      Loading the editor…
    </div>
  ),
});
import { EvalView, parseEvals } from "./eval-view";

// Three local modes over one buffer: Preview renders it, Source shows the
// bytes, Edit marks it up. They all read the same value, so switching never
// drops what you typed. "View on GitHub" stays a link out — blame, history
// and permalinks are jobs a pane in here will never do better.
//
// Edits are scratch buffers held by the workspace for as long as the page is
// open. Nothing here writes to the repository, so nothing here claims to: no
// Saved state, no autosave, and closing a tab that holds one asks what to do
// with it rather than deciding silently.

const EXT_TO_LANG: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  py: "python",
  sh: "bash",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  md: "markdown",
};

export type PaneMode = "preview" | "source" | "edit";

function languageFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_LANG[ext] ?? "text";
}

function basename(id: string) {
  return id.split("/").pop() ?? id;
}

export type ContentFile = {
  id: string;
  kind: FileKind;
  size: string;
  content: string | null;
};

export function FileContentPane({
  openFiles,
  activeId,
  activeFile,
  mode,
  drafts,
  onSelectTab,
  onCloseTab,
  onModeChange,
  onDraftChange,
  onDraftRevert,
}: {
  openFiles: ContentFile[];
  activeId: string | null;
  activeFile: ContentFile | null;
  mode: PaneMode;
  /** file id to local draft text, owned by the workspace so it outlives a tab */
  drafts: Record<string, string>;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onModeChange: (mode: PaneMode) => void;
  onDraftChange: (id: string, text: string) => void;
  onDraftRevert: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [pendingClose, setPendingClose] = useState<string | null>(null);
  const keepRef = useRef<HTMLButtonElement>(null);

  const filename = activeFile ? basename(activeFile.id) : "";
  const lang = filename ? languageFor(filename) : "text";
  const isMarkdown = lang === "markdown";
  const shown = activeFile ? (drafts[activeFile.id] ?? activeFile.content) : null;
  const edited = activeFile
    ? drafts[activeFile.id] !== undefined && drafts[activeFile.id] !== activeFile.content
    : false;
  // eval.json has a known shape worth rendering as a spec rather than raw JSON
  const evalCases = useMemo(
    () => (filename === "eval.json" && shown ? parseEvals(shown) : null),
    [filename, shown],
  );
  const isEval = evalCases !== null;

  useEffect(() => {
    if (!pendingClose) return;
    keepRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPendingClose(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingClose]);

  const hasDraft = (file: ContentFile) => drafts[file.id] !== undefined && drafts[file.id] !== file.content;

  const requestClose = (file: ContentFile) => {
    if (hasDraft(file)) setPendingClose(file.id);
    else onCloseTab(file.id);
  };

  if (openFiles.length === 0 || !activeFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <FileText size={20} className="text-[var(--text-disabled)]" />
        <p className="text-[13px] text-[var(--text-tertiary)]">Pick a file to read it.</p>
      </div>
    );
  }

  const toggleClass = (on: boolean, accent = false) =>
    `inline-flex h-6 items-center gap-1 rounded-[4px] px-2 text-[11.5px] transition-colors ${
      on
        ? accent
          ? "bg-[#82AAFF]/15 font-medium text-[color:var(--accent)]"
          : "bg-[var(--bg-surface)] text-[var(--text-primary)]"
        : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
    }`;

  const pendingName = pendingClose ? basename(pendingClose) : "";

  // One cluster, two homes: inline with the tabs where there is room, on its
  // own row below lg. Sharing the toolbar with the tabs on a phone pushed the
  // Preview/Source/Edit switch off the right edge of a scrollable strip, which
  // is the same as not having it.
  const actionCluster = (
    <>
      {(isEval || (isMarkdown && activeFile.content !== null)) && (
        <div className="flex items-center gap-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--glass-elevated)] p-0.5">
          <button
            type="button"
            onClick={() => onModeChange("preview")}
            aria-pressed={mode === "preview"}
            className={toggleClass(mode === "preview")}
          >
            <Eye size={11} strokeWidth={1.75} />
            {isEval ? "Evals" : "Preview"}
          </button>
          <button
            type="button"
            onClick={() => onModeChange("source")}
            aria-pressed={mode === "source"}
            className={toggleClass(mode === "source")}
          >
            <Code2 size={11} strokeWidth={1.75} />
            Source
          </button>
          {isMarkdown && (
            <button
              type="button"
              onClick={() => onModeChange("edit")}
              aria-pressed={mode === "edit"}
              className={toggleClass(mode === "edit", true)}
            >
              <Pencil size={11} strokeWidth={1.75} />
              Edit
            </button>
          )}
        </div>
      )}
      <a
        href={`${REPO_SKILLS_BLOB}/${activeFile.id}`}
        target="_blank"
        rel="noreferrer"
        title="View this file on GitHub"
        className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11.5px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
      >
        <ExternalLink size={11} strokeWidth={1.75} />
        GitHub
      </a>
    </>
  );

  return (
    <>
      {/* Real tab semantics rather than a row of buttons: assistive tech gets
          the selected state and the arrow-key model people already expect from
          an editor's tab strip. */}
      <div className="flex shrink-0 items-center border-b border-[var(--border-subtle)] px-2">
        {/* The tablist owns tabs and nothing else. A tablist may only own
            elements with role="tab", so the close control lives inside its own
            tab — which is why a tab is a div here rather than a button, since
            a button cannot legally contain one — and the file actions sit
            outside the tablist entirely rather than as its last child.
            The close control is a pointer affordance only: a focusable button
            inside a tab is nested interactive content, so it is kept out of
            the accessibility tree and keyboard users close the focused tab
            with Delete or Backspace instead. */}
        <div
          role="tablist"
          aria-label="Open files"
          onKeyDown={(e) => {
            const index = openFiles.findIndex((f) => f.id === activeId);
            if (index === -1) return;
            const move = (next: number) => {
              e.preventDefault();
              onSelectTab(openFiles[(next + openFiles.length) % openFiles.length].id);
            };
            if (e.key === "ArrowRight") move(index + 1);
            else if (e.key === "ArrowLeft") move(index - 1);
            else if (e.key === "Home") move(0);
            else if (e.key === "End") move(openFiles.length - 1);
            else if (e.key === "Delete" || e.key === "Backspace") {
              e.preventDefault();
              requestClose(openFiles[index]);
            }
          }}
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        >
          <AnimatePresence initial={false}>
            {openFiles.map((f) => {
              const on = f.id === activeId;
              const name = basename(f.id);
              const { Icon, color } = fileVisual(name);
              const draft = hasDraft(f);
              return (
                <motion.div
                  key={f.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={reduce ? undefined : { opacity: 0, width: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="relative shrink-0"
                >
                  <div
                    role="tab"
                    id={`file-tab-${f.id}`}
                    aria-selected={on}
                    aria-controls="file-content-panel"
                    aria-keyshortcuts="Delete"
                    tabIndex={on ? 0 : -1}
                    onClick={() => onSelectTab(f.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectTab(f.id);
                      }
                    }}
                    className={`flex h-10 cursor-pointer items-center gap-2 px-3 pr-8 text-[13px] outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)] ${
                      on ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Icon size={14} className="shrink-0" style={{ color }} />
                    <span className="max-w-[220px] truncate font-mono">{name}</span>
                    {draft && (
                      <span className="inline-flex shrink-0 items-center gap-1 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[color:var(--accent)]">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#82AAFF]" />
                        draft
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      title={`Close ${name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        requestClose(f);
                      }}
                      className="absolute right-1.5 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[4px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                    >
                      <X size={12} strokeWidth={2} />
                    </span>
                  </div>
                  {on && <span className="absolute inset-x-0 bottom-0 h-px bg-[#82AAFF]" />}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="ml-auto hidden shrink-0 items-center gap-1.5 pl-2 lg:flex">{actionCluster}</div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 border-b border-[var(--border-subtle)] px-2 py-1 lg:hidden">
        {actionCluster}
      </div>

      <div
        id="file-content-panel"
        role="tabpanel"
        aria-labelledby={activeId ? `file-tab-${activeId}` : undefined}
        className="relative flex min-h-0 flex-1"
      >
        {shown === null ? (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-[var(--text-tertiary)]">
            {activeFile.kind === "image" ? "Image preview not shown here." : "File too large to preview."}
          </div>
        ) : isEval && mode === "preview" ? (
          <EvalView cases={evalCases} />
        ) : isMarkdown && mode === "edit" ? (
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col lg:border-r lg:border-[var(--border-subtle)]">
              <MarkdownEditor
                value={shown}
                edited={edited}
                onChange={(next) => onDraftChange(activeFile.id, next)}
                onRevert={() => onDraftRevert(activeFile.id)}
              />
            </div>
            {/* Live rendered preview of the draft — same renderer as Preview
                mode, so what you type shows formatted. Desktop-only: cramped
                below lg. */}
            <div className="hidden min-h-0 flex-1 lg:flex">
              <MarkdownPreview content={shown} />
            </div>
          </div>
        ) : isMarkdown && mode === "preview" ? (
          <MarkdownPreview content={shown} />
        ) : (
          <CodeBlock
            code={shown}
            language={lang}
            filename={activeFile.id}
            className="min-h-0 flex-1 rounded-none border-0"
          />
        )}

        <AnimatePresence>
          {pendingClose && (
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.12 }}
              /* A literal black scrim, not bg-[var(--bg-base)]/70: Tailwind 3
                 drops the opacity modifier on an arbitrary custom-property
                 colour, which left the scrim fully transparent. */
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-6 backdrop-blur-[2px]"
            >
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="close-draft-title"
                aria-describedby="close-draft-body"
                className="w-full max-w-[440px] rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-2xl"
              >
                <h2 id="close-draft-title" className="text-[14px] font-semibold text-[var(--text-primary)]">
                  <span className="font-mono">{pendingName}</span> has a local edit
                </h2>
                <p id="close-draft-body" className="mt-2 text-[12.5px] leading-[1.6] text-[var(--text-secondary)]">
                  It was never written to the repository. Closing the tab keeps the draft for this session, so reopening
                  the file brings it back; reverting throws it away and restores the repository version.
                </p>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    ref={keepRef}
                    type="button"
                    onClick={() => setPendingClose(null)}
                    className="inline-flex h-8 items-center rounded-lg border border-[var(--border-subtle)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  >
                    Keep open
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDraftRevert(pendingClose);
                      onCloseTab(pendingClose);
                      setPendingClose(null);
                    }}
                    className="inline-flex h-8 items-center rounded-lg border border-[var(--border-subtle)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  >
                    Revert and close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onCloseTab(pendingClose);
                      setPendingClose(null);
                    }}
                    className="inline-flex h-8 items-center rounded-lg bg-[#82AAFF] px-3 text-[12.5px] font-medium text-[#0A0B0D] transition-opacity hover:opacity-90"
                  >
                    Close, keep draft
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--border-subtle)] px-4 py-2 text-[11px] text-[var(--text-tertiary)]">
        {isMarkdown && mode === "edit" && shown !== null && (
          <span className="tabular-nums">
            {markdownEditorStats(shown).words} words, {markdownEditorStats(shown).chars} characters
          </span>
        )}
        {edited && (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[color:var(--accent)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#82AAFF]" />
            Local draft, never written to the repository
          </span>
        )}
        <span className={shown !== null ? "shrink-0" : "truncate"}>{activeFile.id}</span>
        <span className="ml-auto shrink-0">{lang === "text" ? "Plain Text" : lang}</span>
        <span className="shrink-0">UTF-8</span>
        <span className="shrink-0">{activeFile.size}</span>
        {activeFile.content === null && (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-amber-500">
            <AlertTriangle size={12} strokeWidth={1.75} />
            not previewed
          </span>
        )}
      </footer>
    </>
  );
}

export default FileContentPane;
