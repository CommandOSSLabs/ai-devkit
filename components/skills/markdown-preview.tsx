"use client";

import { useMemo, useState } from "react";
import { Focus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { extractFrontmatter, type FrontmatterField } from "@/lib/frontmatter";
import { CodeBlock } from "@/components/ui/code-block";

// Adapted from two reference "editor" patterns the site's design system was
// pointed at: a long-document reader (collapsible outline rail + focus mode
// dimming everything but the active section) and a markdown workspace
// (write/split/preview). Every file here is the repository's, read at build
// time and never a user's draft, so this half of the pair only reads: outline
// navigation and rendered prose. Editing lives next door in MarkdownEditor,
// which says plainly that its buffer is local and goes nowhere.

// A list item keeps its own nested bullets: these docs wrap long items
// across several source lines and nest sub-bullets under them, so a flat
// string[] collapsed real structure into one run-on paragraph.
type ListItem = { text: string; children: string[] };

type BodyToken =
  | { kind: "p"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "ul"; items: ListItem[] }
  | { kind: "ol"; items: ListItem[] }
  | { kind: "code"; text: string; lang: string };

type Section = { id: string; level: 1 | 2 | 3; title: string; body: BodyToken[] };

const UL_MARKER = /^\s*[-*+]\s+/;
const OL_MARKER = /^\s*\d+[.)]\s+/;

/** A block is a list only when its FIRST line carries an unindented marker. */
function startsList(lines: string[], marker: RegExp) {
  return marker.test(lines[0]) && !/^\s/.test(lines[0]);
}

// Markdown wraps a single list item across multiple source lines and nests
// sub-bullets by indentation. Group by that instead of requiring every line
// to start with a marker — the old `lines.every(...)` test failed on the
// very first wrapped item and dumped the whole list into a paragraph.
function parseListItems(lines: string[], marker: RegExp): ListItem[] {
  const items: ListItem[] = [];

  for (const raw of lines) {
    const indented = /^\s/.test(raw);
    const isMarker = marker.test(raw) || (indented && (UL_MARKER.test(raw) || OL_MARKER.test(raw)));

    if (isMarker && !indented) {
      items.push({ text: raw.replace(marker, "").trim(), children: [] });
      continue;
    }
    if (items.length === 0) continue;

    const current = items[items.length - 1];
    if (isMarker && indented) {
      current.children.push(raw.replace(UL_MARKER, "").replace(OL_MARKER, "").trim());
      continue;
    }

    const text = raw.trim();
    if (!text) continue;
    if (current.children.length > 0) current.children[current.children.length - 1] += ` ${text}`;
    else current.text += ` ${text}`;
  }

  return items;
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section"
  );
}

function SkillNameBadge({ value }: { value: string }) {
  const colonIdx = value.indexOf(":");
  if (colonIdx === -1) {
    return (
      <span className="rounded-md bg-[#82AAFF]/10 px-2 py-0.5 font-mono text-[12.5px] font-medium text-[color:var(--accent)]">
        {value}
      </span>
    );
  }
  const namespace = value.slice(0, colonIdx);
  const name = value.slice(colonIdx + 1);
  return (
    <span className="inline-flex items-baseline gap-0.5 rounded-md bg-[#82AAFF]/10 px-2 py-0.5 font-mono text-[12.5px]">
      <span className="text-[color:var(--accent)]/55">{namespace}</span>
      <span className="text-[color:var(--accent)]/55">:</span>
      <span className="font-semibold text-[color:var(--accent)]">{name}</span>
    </span>
  );
}

function FrontmatterCard({ fields }: { fields: FrontmatterField[] }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--glass-elevated)] px-4 py-3.5">
      {fields.map((f) => (
        // Stacked on a phone: an 88px label column next to a paragraph-long
        // description left roughly two words per line.
        <div key={f.key} className="flex flex-col gap-1 text-[13px] leading-6 sm:flex-row sm:items-baseline sm:gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-[var(--text-tertiary)] sm:w-[88px] sm:shrink-0">
            {f.key}
          </span>
          {f.key === "name" ? (
            <SkillNameBadge value={f.value} />
          ) : f.key === "version" ? (
            <span className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[11.5px] text-[var(--text-secondary)]">
              v{f.value}
            </span>
          ) : (
            <span className="text-[var(--text-secondary)]">{f.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function parseSections(src: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  const usedIds = new Set<string>();

  const makeId = (text: string) => {
    const base = slugify(text);
    let id = base;
    let n = 2;
    while (usedIds.has(id)) id = `${base}-${n++}`;
    usedIds.add(id);
    return id;
  };

  const pushBody = (token: BodyToken) => {
    if (!current) {
      current = { id: makeId("top"), level: 1, title: "", body: [] };
      sections.push(current);
    }
    current.body.push(token);
  };

  for (const raw of src.split(/\n{2,}/)) {
    const block = raw.trim();
    if (!block) continue;
    const lines = block.split("\n");

    if (block.startsWith("```")) {
      const lang = lines[0].slice(3).trim();
      const closeIdx = lines.length > 1 && lines[lines.length - 1].trim() === "```" ? lines.length - 1 : lines.length;
      pushBody({ kind: "code", text: lines.slice(1, closeIdx).join("\n"), lang });
    } else if (startsList(lines, UL_MARKER)) {
      pushBody({ kind: "ul", items: parseListItems(lines, UL_MARKER) });
    } else if (startsList(lines, OL_MARKER)) {
      pushBody({ kind: "ol", items: parseListItems(lines, OL_MARKER) });
    } else if (block.startsWith("### ")) {
      const title = block.slice(4);
      current = { id: makeId(title), level: 3, title, body: [] };
      sections.push(current);
    } else if (block.startsWith("## ")) {
      const title = block.slice(3);
      current = { id: makeId(title), level: 2, title, body: [] };
      sections.push(current);
    } else if (block.startsWith("# ")) {
      const title = block.slice(2);
      current = { id: makeId(title), level: 1, title, body: [] };
      sections.push(current);
    } else if (block.startsWith("> ")) {
      pushBody({ kind: "quote", text: block.replace(/^>\s?/gm, "") });
    } else if (block === "---") {
      // frontmatter/hr fence — not rendered as a section, just skipped
      continue;
    } else {
      pushBody({ kind: "p", text: block.replace(/\n/g, " ") });
    }
  }

  return sections;
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-medium text-[var(--text-primary)]">
              {p.slice(2, -2)}
            </strong>
          );
        }
        if (p.startsWith("*") && p.endsWith("*")) {
          return (
            <em key={i} className="italic">
              {p.slice(1, -1)}
            </em>
          );
        }
        if (p.startsWith("`") && p.endsWith("`")) {
          return (
            <code key={i} className="rounded-[4px] bg-[var(--bg-elevated)] px-1 py-0.5 font-mono text-[0.9em] text-[color:var(--accent)]">
              {p.slice(1, -1)}
            </code>
          );
        }
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          return (
            <a
              key={i}
              href={link[2]}
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--accent)] underline decoration-[#82AAFF]/30 underline-offset-2 hover:decoration-[#82AAFF]"
            >
              {link[1]}
            </a>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function NestedItems({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-2.5 flex flex-col gap-2 border-l border-[var(--border-subtle)] pl-4">
      {items.map((child, i) => (
        <li key={i} className="text-[14px] leading-7 text-[var(--text-secondary)] [overflow-wrap:anywhere]">
          <Inline text={child} />
        </li>
      ))}
    </ul>
  );
}

function BodyBlock({ token }: { token: BodyToken }) {
  switch (token.kind) {
    case "p":
      return (
        <p className="text-[14.5px] leading-7 text-[var(--text-secondary)] [overflow-wrap:anywhere]">
          <Inline text={token.text} />
        </p>
      );
    case "quote":
      return (
        <p className="rounded-[10px] bg-[var(--glass-elevated)] px-4 py-3 text-[13.5px] leading-6 text-[var(--text-secondary)]">
          <Inline text={token.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="flex flex-col gap-3">
          {token.items.map((it, j) => (
            <li key={j} className="flex gap-3 text-[14.5px] leading-7 text-[var(--text-secondary)]">
              <span aria-hidden="true" className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-[var(--text-tertiary)]" />
              <div className="min-w-0 flex-1">
                <Inline text={it.text} />
                <NestedItems items={it.children} />
              </div>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="flex flex-col gap-3">
          {token.items.map((it, j) => (
            <li key={j} className="flex gap-3 text-[14.5px] leading-7 text-[var(--text-secondary)]">
              <span className="w-5 shrink-0 text-right tabular-nums text-[var(--text-tertiary)]">{j + 1}.</span>
              <div className="min-w-0 flex-1">
                <Inline text={it.text} />
                <NestedItems items={it.children} />
              </div>
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <CodeBlock
          code={token.text}
          language={token.lang || "text"}
          showLineNumbers={token.text.split("\n").length > 3}
        />
      );
  }
}

export function MarkdownPreview({
  content,
  variant = "pane",
  showFrontmatter = true,
}: {
  content: string;
  /**
   * "pane" is the workspace reader: its own scroll container, outline rail
   * and focus toggle. "document" drops all of that and renders into the
   * surrounding page flow — the skill detail page already supplies the
   * identity, the outline and the scroll, so a second set of each would be
   * two chromes competing over one document.
   */
  variant?: "pane" | "document";
  showFrontmatter?: boolean;
}) {
  const { frontmatter, body } = useMemo(() => extractFrontmatter(content), [content]);
  const sections = useMemo(() => parseSections(body), [body]);
  const outlineItems = useMemo(() => sections.filter((s) => s.title.length > 0), [sections]);

  const [outlineOpen, setOutlineOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [current, setCurrent] = useState<string | null>(outlineItems[0]?.id ?? null);

  const scrollTo = (id: string) => {
    setCurrent(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (variant === "document") {
    return (
      <article className="flex flex-col gap-7">
        {showFrontmatter && frontmatter && <FrontmatterCard fields={frontmatter} />}
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="flex scroll-mt-6 flex-col gap-2.5">
            {!s.title ? null : s.level === 1 ? (
              <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{s.title}</h2>
            ) : s.level === 2 ? (
              <h3 className="text-[15px] font-medium tracking-[-0.01em] text-[var(--text-primary)]">{s.title}</h3>
            ) : (
              <h4 className="font-mono text-[12.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                {s.title}
              </h4>
            )}
            {s.body.map((token, i) => (
              <BodyBlock key={i} token={token} />
            ))}
          </section>
        ))}
      </article>
    );
  }

  return (
    <div className="flex min-h-0 flex-1">
      {outlineItems.length > 1 && (
        <div
          className={`hidden shrink-0 overflow-hidden border-r border-[var(--border-subtle)] transition-[width] duration-200 ease-out md:block ${
            outlineOpen ? "w-[200px]" : "w-0"
          }`}
        >
          <div className="flex h-full w-[200px] flex-col">
            <div className="flex h-9 shrink-0 items-center px-3 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
              Outline
            </div>
            <nav aria-label="Document outline" className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
              {outlineItems.map((s) => {
                const on = s.id === current;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    aria-current={on ? "true" : undefined}
                    className={`flex h-7 w-full items-center truncate rounded-md text-left text-[12.5px] transition-colors ${
                      s.level === 1 ? "pl-2" : s.level === 2 ? "pl-5" : "pl-8"
                    } pr-2 ${
                      on
                        ? "bg-[#82AAFF]/10 font-medium text-[color:var(--accent)]"
                        : "text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-[var(--border-subtle)] px-2">
          {outlineItems.length > 1 && (
            <button
              type="button"
              onClick={() => setOutlineOpen((v) => !v)}
              aria-pressed={outlineOpen}
              className="hidden h-7 w-7 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] md:inline-flex"
            >
              {outlineOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
              <span className="sr-only">Toggle outline</span>
            </button>
          )}
          {outlineItems.length > 1 && (
            <button
              type="button"
              onClick={() => setFocusMode((v) => !v)}
              aria-pressed={focusMode}
              className={`ml-auto inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[12px] transition-colors ${
                focusMode
                  ? "border-[#82AAFF]/40 bg-[#82AAFF]/10 text-[color:var(--accent)]"
                  : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Focus size={12} strokeWidth={1.75} />
              Focus
            </button>
          )}
        </div>

        {/* Focusable on purpose: a skill whose rendered body carries no links
            gives this scroller no focusable child, and a keyboard user then
            has no way to scroll it at all. */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Rendered document"
          className="min-h-0 flex-1 overflow-y-auto px-6 py-6 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)] sm:px-10"
        >
          <article className="mx-auto flex max-w-[680px] flex-col gap-8">
            {showFrontmatter && frontmatter && <FrontmatterCard fields={frontmatter} />}
            {sections.map((s) => {
              const dim = focusMode && current !== null && s.id !== current && s.title.length > 0;
              return (
                <section
                  key={s.id}
                  id={s.id}
                  onClick={() => s.title && setCurrent(s.id)}
                  className="scroll-mt-4 flex flex-col gap-2.5 transition-opacity duration-200"
                  style={{ opacity: dim ? 0.32 : 1 }}
                >
                  {!s.title ? null : s.level === 1 ? (
                    <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{s.title}</h2>
                  ) : s.level === 2 ? (
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-[var(--text-primary)]">{s.title}</h3>
                  ) : (
                    <h4 className="font-mono text-[12.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                      {s.title}
                    </h4>
                  )}
                  {s.body.map((token, i) => (
                    <BodyBlock key={i} token={token} />
                  ))}
                </section>
              );
            })}
          </article>
        </div>
      </div>
    </div>
  );
}

export default MarkdownPreview;
