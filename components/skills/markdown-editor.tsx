"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Check,
  Code,
  Copy,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  RotateCcw,
  Strikethrough,
} from "lucide-react";

// A markdown "edit" mode for the file pane. These files are the repository's,
// read at build time rather than user drafts, so this deliberately does NOT
// simulate a save: no "Saved"/"Saving…" status, nothing persisted to disk
// or the repo. It's a scratch buffer scoped to the open tab — type, mark up
// with the toolbar, copy the result out. Closing the tab (or reverting)
// drops the edit; that's stated plainly in the footer rather than implied.

function currentLine(value: string, pos: number) {
  const start = value.lastIndexOf("\n", pos - 1) + 1;
  const nl = value.indexOf("\n", start);
  const end = nl === -1 ? value.length : nl;
  return { start, end, text: value.slice(start, end) };
}

function toggleLinePrefix(value: string, selStart: number, prefix: string) {
  const { start, text } = currentLine(value, selStart);
  const already = text.startsWith(prefix);
  const next = already
    ? value.slice(0, start) + text.slice(prefix.length) + value.slice(start + text.length)
    : value.slice(0, start) + prefix + text + value.slice(start + text.length);
  const caret = Math.max(start, selStart + (already ? -prefix.length : prefix.length));
  return { next, caret };
}

function wrapSelection(value: string, selStart: number, selEnd: number, before: string, after: string = before) {
  const selected = value.slice(selStart, selEnd) || "text";
  const next = value.slice(0, selStart) + before + selected + after + value.slice(selEnd);
  return { next, selStart: selStart + before.length, selEnd: selStart + before.length + selected.length };
}

function ToolButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
    >
      {children}
    </button>
  );
}

export function MarkdownEditor({
  value,
  edited,
  onChange,
  onRevert,
}: {
  value: string;
  edited: boolean;
  onChange: (next: string) => void;
  onRevert: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  // Revert throws the draft away and there is nothing to undo it with, so the
  // button asks first rather than acting on a single stray click. The pending
  // state clears itself so it can't sit there armed.
  const [confirmRevert, setConfirmRevert] = useState(false);

  useEffect(() => {
    if (!confirmRevert) return;
    const timer = window.setTimeout(() => setConfirmRevert(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmRevert]);

  const applyWrap = (before: string, after?: string) => {
    const el = ref.current;
    if (!el) return;
    const { next, selStart, selEnd } = wrapSelection(value, el.selectionStart, el.selectionEnd, before, after);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  };

  const applyLinePrefix = (prefix: string) => {
    const el = ref.current;
    if (!el) return;
    const { next, caret } = toggleLinePrefix(value, el.selectionStart, prefix);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard permission denied — silently no-op, button just won't confirm
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-9 shrink-0 items-center gap-0.5 overflow-x-auto border-b border-[var(--border-subtle)] px-2">
        <ToolButton label="Heading 1" onClick={() => applyLinePrefix("# ")}>
          <Heading1 size={14} strokeWidth={1.75} />
        </ToolButton>
        <ToolButton label="Heading 2" onClick={() => applyLinePrefix("## ")}>
          <Heading2 size={14} strokeWidth={1.75} />
        </ToolButton>
        <ToolButton label="Quote" onClick={() => applyLinePrefix("> ")}>
          <Quote size={14} strokeWidth={1.75} />
        </ToolButton>
        <ToolButton label="Bulleted list" onClick={() => applyLinePrefix("- ")}>
          <List size={14} strokeWidth={1.75} />
        </ToolButton>
        <ToolButton label="Numbered list" onClick={() => applyLinePrefix("1. ")}>
          <ListOrdered size={14} strokeWidth={1.75} />
        </ToolButton>

        <span aria-hidden="true" className="mx-1 h-4 w-px shrink-0 bg-[var(--border-subtle)]" />

        <ToolButton label="Bold" onClick={() => applyWrap("**")}>
          <Bold size={14} strokeWidth={1.75} />
        </ToolButton>
        <ToolButton label="Italic" onClick={() => applyWrap("*")}>
          <Italic size={14} strokeWidth={1.75} />
        </ToolButton>
        <ToolButton label="Strikethrough" onClick={() => applyWrap("~~")}>
          <Strikethrough size={14} strokeWidth={1.75} />
        </ToolButton>
        <ToolButton label="Code" onClick={() => applyWrap("`")}>
          <Code size={14} strokeWidth={1.75} />
        </ToolButton>
        <ToolButton label="Link" onClick={() => applyWrap("[", "](url)")}>
          <Link2 size={14} strokeWidth={1.75} />
        </ToolButton>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {edited && (
            <button
              type="button"
              onClick={() => {
                if (!confirmRevert) {
                  setConfirmRevert(true);
                  return;
                }
                setConfirmRevert(false);
                onRevert();
              }}
              aria-label={confirmRevert ? "Confirm discarding this local draft" : "Revert this local draft"}
              className={`inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11.5px] transition-colors ${
                confirmRevert
                  ? "bg-amber-500/15 font-medium text-amber-500"
                  : "text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              }`}
            >
              <RotateCcw size={11} strokeWidth={1.75} />
              {confirmRevert ? "Discard draft?" : "Revert"}
            </button>
          )}
          <button
            type="button"
            onClick={copy}
            className={`inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[11.5px] transition-colors ${
              copied
                ? "border-[#82AAFF]/40 bg-[#82AAFF]/10 text-[#82AAFF]"
                : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {copied ? <Check size={11} strokeWidth={1.75} /> : <Copy size={11} strokeWidth={1.75} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="min-h-0 flex-1 resize-none bg-transparent px-6 py-5 font-mono text-[13px] leading-6 text-[var(--text-secondary)] outline-none sm:px-10"
      />
    </div>
  );
}
