"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, ExternalLink, Eye, FileText, Pencil, X } from "lucide-react";
import type { FileKind } from "@/lib/skills-tree";
import { fileVisual } from "@/lib/file-icons";
import { CodeBlock } from "@/components/ui/code-block";
import { MarkdownPreview } from "./markdown-preview";
import { MarkdownEditor, markdownEditorStats } from "./markdown-editor";

// Reading a file's raw source is a job GitHub already does better than a
// pane in here ever will — blame, history, permalinks, search. So "Source"
// is a link out rather than a third local mode; what stays local is what
// benefits from being here: the rendered read (Preview) and the scratch
// edit. Non-markdown files still render inline, since there's no Preview
// alternative for them, but through the same CodeBlock the markdown
// fences use rather than a bespoke gutter/minimap of their own.
const GITHUB_BLOB = "https://github.com/CommandOSSLabs/ai-devkit/blob/main/skills";

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
  onSelectTab,
  onCloseTab,
}: {
  openFiles: ContentFile[];
  activeId: string | null;
  activeFile: ContentFile | null;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const filename = activeFile ? basename(activeFile.id) : "";
  const lang = filename ? languageFor(filename) : "text";
  const isMarkdown = lang === "markdown";
  // Preview and Edit render the same value, so switching between them never
  // silently drops what you just typed.
  const shown = activeFile ? (drafts[activeFile.id] ?? activeFile.content) : null;
  const edited = activeFile ? drafts[activeFile.id] !== undefined && drafts[activeFile.id] !== activeFile.content : false;

  useEffect(() => {
    setMode("preview");
  }, [activeFile]);

  // Drafts are scratch buffers scoped to open tabs, not persisted anywhere —
  // drop a tab's draft once it's no longer open rather than leaking state.
  useEffect(() => {
    setDrafts((prev) => {
      const openIds = new Set(openFiles.map((f) => f.id));
      let changed = false;
      const next: Record<string, string> = {};
      for (const [id, text] of Object.entries(prev)) {
        if (openIds.has(id)) next[id] = text;
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [openFiles]);

  if (openFiles.length === 0 || !activeFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <FileText size={20} className="text-[var(--text-disabled)]" />
        <p className="text-[13px] text-[var(--text-tertiary)]">Select a file on the left to read it.</p>
      </div>
    );
  }

  const toggleClass = (on: boolean) =>
    `inline-flex h-6 items-center gap-1 rounded-[4px] px-2 text-[11.5px] transition-colors ${
      on ? "bg-[var(--bg-surface)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
    }`;

  return (
    <>
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-[var(--border-subtle)] px-2">
        <AnimatePresence initial={false}>
          {openFiles.map((f) => {
            const on = f.id === activeId;
            const name = basename(f.id);
            const { Icon, color } = fileVisual(name);
            const hasDraft = drafts[f.id] !== undefined && drafts[f.id] !== f.content;
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
                <button
                  type="button"
                  onClick={() => onSelectTab(f.id)}
                  aria-current={on ? "true" : undefined}
                  className={`flex h-10 items-center gap-2 px-3 pr-8 text-[13px] transition-colors ${
                    on ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon size={14} className="shrink-0" style={{ color }} />
                  <span className="max-w-[220px] truncate font-mono">{name}</span>
                  {hasDraft && (
                    <span aria-label="Unsaved local edit" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#82AAFF]" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label={`Close ${name}`}
                  onClick={() => onCloseTab(f.id)}
                  className="absolute right-1.5 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-[4px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                >
                  <X size={12} strokeWidth={2} />
                </button>
                {on && <span className="absolute inset-x-0 bottom-0 h-px bg-[#82AAFF]" />}
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {isMarkdown && activeFile.content !== null && (
            <div className="flex items-center gap-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-0.5">
              <button type="button" onClick={() => setMode("preview")} aria-pressed={mode === "preview"} className={toggleClass(mode === "preview")}>
                <Eye size={11} strokeWidth={1.75} />
                Preview
              </button>
              <button type="button" onClick={() => setMode("edit")} aria-pressed={mode === "edit"} className={toggleClass(mode === "edit")}>
                <Pencil size={11} strokeWidth={1.75} />
                Edit
              </button>
            </div>
          )}
          <a
            href={`${GITHUB_BLOB}/${activeFile.id}`}
            target="_blank"
            rel="noreferrer"
            title="View source on GitHub"
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11.5px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            <ExternalLink size={11} strokeWidth={1.75} />
            Source
          </a>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {shown === null ? (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-[var(--text-tertiary)]">
            {activeFile.kind === "image" ? "Image preview not shown here." : "File too large to preview."}
          </div>
        ) : isMarkdown && mode === "edit" ? (
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col lg:border-r lg:border-[var(--border-subtle)]">
              <MarkdownEditor
                value={shown}
                edited={edited}
                onChange={(next) => setDrafts((d) => ({ ...d, [activeFile.id]: next }))}
                onRevert={() =>
                  setDrafts((d) => {
                    const next = { ...d };
                    delete next[activeFile.id];
                    return next;
                  })
                }
              />
            </div>
            {/* Live rendered preview of the draft — same renderer as Preview
                mode, so what you type shows formatted. Desktop-only: cramped
                below lg. */}
            <div className="hidden min-h-0 flex-1 lg:flex">
              <MarkdownPreview content={shown} />
            </div>
          </div>
        ) : isMarkdown ? (
          <MarkdownPreview content={shown} />
        ) : (
          <CodeBlock
            code={shown}
            language={lang}
            filename={activeFile.id}
            className="min-h-0 flex-1 rounded-none border-0"
          />
        )}
      </div>

      <footer className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--border-subtle)] px-4 py-2 text-[11px] text-[var(--text-tertiary)]">
        {isMarkdown && mode === "edit" && shown !== null && (
          <>
            <span className="tabular-nums">
              {markdownEditorStats(shown).words} words, {markdownEditorStats(shown).chars} characters
            </span>
            <span className="italic">Local edit only — not saved to the repo</span>
          </>
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
