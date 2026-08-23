"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Code2, Eye, FileText, Pencil, X } from "lucide-react";
import type { FileKind } from "@/lib/skills-tree";
import { fileVisual } from "@/lib/file-icons";
import { MarkdownPreview } from "./markdown-preview";
import { MarkdownEditor, markdownEditorStats } from "./markdown-editor";

// The project already has a --syntax-* palette defined in globals.css
// (used by nothing until now) — mirrored here as literal hex because
// shiki resolves theme colors at token-generation time and can't read
// CSS custom properties. Keeping these values in sync with globals.css
// is a manual step if that palette ever changes.
const SYNTAX_LIGHT = {
  keyword: "#8B5CF6",
  string: "#16A34A",
  func: "#4F46E5",
  number: "#EA580C",
  comment: "#94A3B8",
  const: "#CA8A04",
  error: "#DC2626",
};
const SYNTAX_DARK = {
  keyword: "#C792EA",
  string: "#C3E88D",
  func: "#82AAFF",
  number: "#F78C6C",
  comment: "#5C6370",
  const: "#FFCB6B",
  error: "#F07178",
};

const THEME_SCOPES: [string[], keyof typeof SYNTAX_LIGHT, string?][] = [
  [["comment", "punctuation.definition.comment"], "comment", "italic"],
  [["string", "string.quoted", "constant.character.escape"], "string"],
  [["constant.numeric", "constant.language"], "number"],
  [["keyword", "keyword.control", "storage.type", "storage.modifier"], "keyword"],
  [["entity.name.function", "support.function", "meta.function-call"], "func"],
  [["entity.name.type", "support.type", "entity.name.class", "support.class"], "const"],
  [["invalid", "invalid.illegal"], "error"],
];

function buildShikiTheme(dark: boolean) {
  const palette = dark ? SYNTAX_DARK : SYNTAX_LIGHT;
  return {
    name: dark ? "ai-devkit-dark" : "ai-devkit-light",
    type: dark ? ("dark" as const) : ("light" as const),
    colors: {},
    tokenColors: THEME_SCOPES.map(([scope, key, fontStyle]) => ({
      scope,
      settings: { foreground: palette[key], ...(fontStyle ? { fontStyle } : {}) },
    })),
  };
}

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

type Tok = { content: string; htmlStyle?: Record<string, string> };

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
  const [tokens, setTokens] = useState<Tok[][] | null>(null);
  const [caret, setCaret] = useState(1);
  const [mode, setMode] = useState<"preview" | "source" | "edit">("preview");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const runId = useRef(0);

  const filename = activeFile ? basename(activeFile.id) : "";
  const lang = useMemo(() => (filename ? languageFor(filename) : "text"), [filename]);
  // Every mode renders the draft when the tab has one, so Preview/Source/Edit
  // agree with each other instead of two of them quietly showing the on-disk
  // file while you're looking at your own unsaved changes.
  const shown = activeFile ? (drafts[activeFile.id] ?? activeFile.content) : null;
  const lines = useMemo(() => (shown ? shown.split("\n") : []), [shown]);
  const isMarkdown = lang === "markdown";
  const showGutterView = activeFile?.content != null && (!isMarkdown || mode === "source");

  useEffect(() => {
    setCaret(1);
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

  useEffect(() => {
    if (!shown || lang === "text") {
      setTokens(null);
      return;
    }

    const run = ++runId.current;
    let cancelled = false;
    setTokens(null);

    import("shiki")
      .then(({ codeToTokens }) =>
        codeToTokens(shown, {
          lang: lang as Parameters<typeof codeToTokens>[1]["lang"],
          themes: { light: buildShikiTheme(false), dark: buildShikiTheme(true) },
          defaultColor: false,
        }),
      )
      .then((res) => {
        if (!cancelled && run === runId.current) setTokens(res.tokens as Tok[][]);
      })
      .catch(() => {
        if (!cancelled && run === runId.current) setTokens(null);
      });

    return () => {
      cancelled = true;
    };
  }, [shown, lang]);

  if (openFiles.length === 0 || !activeFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <FileText size={20} className="text-[var(--text-disabled)]" />
        <p className="text-[13px] text-[var(--text-tertiary)]">Select a file on the left to read it.</p>
      </div>
    );
  }

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

        {isMarkdown && (
          <div className="ml-auto flex shrink-0 items-center gap-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-0.5">
            <button
              type="button"
              onClick={() => setMode("preview")}
              aria-pressed={mode === "preview"}
              className={`inline-flex h-6 items-center gap-1 rounded-[4px] px-2 text-[11.5px] transition-colors ${
                mode === "preview" ? "bg-[var(--bg-surface)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Eye size={11} strokeWidth={1.75} />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setMode("source")}
              aria-pressed={mode === "source"}
              className={`inline-flex h-6 items-center gap-1 rounded-[4px] px-2 text-[11.5px] transition-colors ${
                mode === "source" ? "bg-[var(--bg-surface)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Code2 size={11} strokeWidth={1.75} />
              Source
            </button>
            <button
              type="button"
              onClick={() => setMode("edit")}
              aria-pressed={mode === "edit"}
              className={`inline-flex h-6 items-center gap-1 rounded-[4px] px-2 text-[11.5px] transition-colors ${
                mode === "edit" ? "bg-[var(--bg-surface)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Pencil size={11} strokeWidth={1.75} />
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {activeFile.content !== null && isMarkdown && mode === "preview" ? (
          // Reads the draft when one exists, so switching Edit → Preview
          // shows what you just typed instead of silently reverting to the
          // on-disk file (the tab's dot already says a local edit is live).
          <MarkdownPreview content={drafts[activeFile.id] ?? activeFile.content} />
        ) : activeFile.content !== null && isMarkdown && mode === "edit" ? (
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col lg:border-r lg:border-[var(--border-subtle)]">
              <MarkdownEditor
                value={drafts[activeFile.id] ?? activeFile.content}
                edited={drafts[activeFile.id] !== undefined && drafts[activeFile.id] !== activeFile.content}
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
            {/* Live rendered preview of the draft — reuses the same renderer
                as Preview mode so what you type shows formatted, not just
                raw markdown syntax. Desktop-only: cramped below lg. */}
            <div className="hidden min-h-0 flex-1 lg:flex">
              <MarkdownPreview content={drafts[activeFile.id] ?? activeFile.content} />
            </div>
          </div>
        ) : showGutterView ? (
          <>
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="flex min-w-max font-mono text-[12.5px] leading-5">
                <div
                  aria-hidden="true"
                  className="sticky left-0 z-10 shrink-0 select-none border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] py-3 pr-3 pl-4 text-right tabular-nums text-[var(--text-disabled)]"
                >
                  {lines.map((_, i) => (
                    <div key={i} className={i + 1 === caret ? "text-[var(--text-primary)]" : undefined}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1 py-3 text-[var(--text-secondary)]">
                  {lines.map((rawLine, i) => {
                    const row = tokens?.[i];
                    return (
                      <div
                        key={i}
                        role="presentation"
                        onMouseEnter={() => setCaret(i + 1)}
                        className={`whitespace-pre pr-6 pl-4 ${i + 1 === caret ? "bg-[var(--bg-elevated)]" : ""}`}
                      >
                        {row && row.length > 0
                          ? row.map((t, j) => (
                              <span
                                key={j}
                                className="text-[var(--shiki-light)] dark:text-[var(--shiki-dark)]"
                                style={t.htmlStyle as React.CSSProperties}
                              >
                                {t.content}
                              </span>
                            ))
                          : rawLine === ""
                            ? " "
                            : rawLine}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Minimap: a scroll-position rail, not a scrubber — this pane
                doesn't wire up click-to-jump/drag since these files are
                short reference docs, not something you'd navigate by
                scrubbing a viewport thumb through. */}
            <div
              aria-hidden="true"
              className="hidden w-[52px] shrink-0 overflow-hidden border-l border-[var(--border-subtle)] px-2 py-3 lg:block"
            >
              <div className="space-y-[3px]">
                {lines.map((l, i) => (
                  <div
                    key={i}
                    className={`h-[2px] rounded-full ${i + 1 === caret ? "bg-[#82AAFF]" : "bg-[var(--border-subtle)]"}`}
                    style={{
                      width: `${Math.min(100, Math.max(6, (l.trim().length / 44) * 100))}%`,
                      marginLeft: `${Math.min(30, (l.length - l.trimStart().length) * 4)}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-[var(--text-tertiary)]">
            {activeFile.kind === "image" ? "Image preview not shown here." : "File too large to preview."}
          </div>
        )}
      </div>

      <footer className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--border-subtle)] px-4 py-2 text-[11px] text-[var(--text-tertiary)]">
        {showGutterView && (
          <span className="tabular-nums">
            Ln {caret}, {lines.length} lines
          </span>
        )}
        {isMarkdown && mode === "edit" && activeFile.content !== null && (
          <>
            {(() => {
              const stats = markdownEditorStats(drafts[activeFile.id] ?? activeFile.content ?? "");
              return (
                <span className="tabular-nums">
                  {stats.words} words, {stats.chars} characters
                </span>
              );
            })()}
            <span className="italic">Local edit only — not saved to the repo</span>
          </>
        )}
        <span className={activeFile.content !== null ? "shrink-0" : "truncate"}>{activeFile.id}</span>
        <span className="ml-auto shrink-0">{lang === "text" ? "Plain Text" : lang}</span>
        <span className="shrink-0">UTF-8</span>
        <span className="shrink-0">{activeFile.size}</span>
        {activeFile.content === null && (
          <span className="shrink-0 inline-flex items-center gap-1.5 text-amber-500">
            <AlertTriangle size={12} strokeWidth={1.75} />
            not previewed
          </span>
        )}
      </footer>
    </>
  );
}

export default FileContentPane;
