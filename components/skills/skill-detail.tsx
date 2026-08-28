"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  FileText,
  ListOrdered,
  Send,
  Share2,
  Sparkles,
} from "lucide-react";
import type { SkillSummary } from "@/lib/skill-catalog";
import { REPO_SKILLS_BLOB } from "@/lib/repo-links";
import { SkillTriggers } from "./skill-triggers";

// One skill explanation, two homes: the preview panel beside the catalog and
// the standalone skill page. They are the same surface at two sizes, so they
// share this component rather than drifting into two descriptions of the same
// skill. `page` adds the rendered SKILL.md; `preview` stops before it and
// links onward, because the panel is for deciding, not for reading 8KB.

export type SkillHandles = Record<string, string>;

const labelClass =
  "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]";

function RelatedSkills({
  title,
  ids,
  handles,
  empty,
}: {
  title: string;
  ids: string[];
  handles: SkillHandles;
  empty: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={labelClass}>{title}</h3>
      {ids.length === 0 ? (
        <p className="text-[12.5px] italic text-[var(--text-disabled)]">{empty}</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {ids.map((id) => (
            <li key={id}>
              <Link
                href={`/skills/${id}`}
                className="inline-flex items-center rounded-full border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[#82AAFF]/50 hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {handles[id] ?? `cmk:${id}`}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const primaryAction =
  "inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#82AAFF] px-3.5 text-[13px] font-medium text-[#0A0B0D] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const secondaryAction =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

function Foldable({
  title,
  open,
  children,
}: {
  title: React.ReactNode;
  open: boolean;
  children: React.ReactNode;
}) {
  // <details> rather than state: it keeps keyboard and screen-reader
  // behaviour for free, and the panel needs to fold precisely because it sits
  // beside a list someone is still scanning.
  return (
    <details open={open} className="group flex flex-col gap-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] transition-colors marker:content-[''] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
        <ChevronRight
          size={12}
          strokeWidth={2}
          aria-hidden="true"
          className="shrink-0 transition-transform group-open:rotate-90"
        />
        {title}
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

export function SkillDetail({
  skill,
  handles,
  variant,
  documentSlot,
}: {
  skill: SkillSummary;
  handles: SkillHandles;
  variant: "preview" | "page";
  /**
   * The rendered SKILL.md, passed in rather than rendered here: the catalog
   * shows this component too, and importing the markdown renderer would drag
   * it (and the syntax highlighter behind it) into the catalog's bundle for a
   * document the catalog never shows.
   */
  documentSlot?: React.ReactNode;
}) {
  const isPage = variant === "page";
  const overview = skill.workflows.length > 0 ? skill.workflows : skill.sections;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[13px] font-semibold text-[color:var(--accent)]">{skill.handle}</p>
            {isPage ? (
              <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {skill.title}
              </h1>
            ) : (
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {skill.title}
              </h2>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 items-center rounded-full border border-[var(--border-subtle)] px-2.5 text-[11.5px] text-[var(--text-tertiary)]">
              {skill.categoryLabel}
            </span>
            <span className="inline-flex h-7 items-center rounded-full border border-[var(--border-subtle)] px-2.5 font-mono text-[11.5px] text-[var(--text-tertiary)]">
              v{skill.version}
            </span>
            <span className="inline-flex h-7 items-center gap-2 rounded-full border border-[var(--border-subtle)] px-2.5 text-[11.5px] tabular-nums text-[var(--text-tertiary)]">
              {skill.files.length} files
              <span aria-hidden="true" className="h-3 w-px bg-[var(--border-subtle)]" />
              {skill.referencedBy.length} refs
            </span>
          </div>
        </div>

        {skill.summary && (
          <p className="max-w-[68ch] text-[14.5px] leading-[1.65] text-[var(--text-secondary)]">{skill.summary}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/skills/${skill.id}/workspace`} className={primaryAction}>
            <FileText size={14} strokeWidth={2} />
            Open workspace
          </Link>
          {isPage ? (
            <a href="#full-skill" className={secondaryAction}>
              <Sparkles size={14} strokeWidth={1.75} />
              Read full document
            </a>
          ) : (
            <Link href={`/skills/${skill.id}`} className={secondaryAction}>
              <Sparkles size={14} strokeWidth={1.75} />
              Read full document
            </Link>
          )}
          <Link href={`/skills/visualize-interactions?skill=${skill.id}`} className={secondaryAction}>
            <Share2 size={14} strokeWidth={1.75} />
            Graph
          </Link>
          <Link href={`/skills/prompt-inputs?skill=${skill.id}`} className={secondaryAction}>
            <Send size={14} strokeWidth={1.75} />
            Use in a prompt
          </Link>
          <a
            href={`${REPO_SKILLS_BLOB}/${skill.id}/SKILL.md`}
            target="_blank"
            rel="noreferrer"
            className={secondaryAction}
          >
            <ExternalLink size={14} strokeWidth={1.75} />
            GitHub
          </a>
        </div>
      </header>

      <section
        className="flex flex-col gap-3 rounded-[14px] border border-[var(--border-subtle)] bg-[var(--glass-surface)] p-4"
        aria-labelledby={`use-when-${skill.id}`}
      >
        <h3 id={`use-when-${skill.id}`} className={labelClass}>
          Use this skill when
        </h3>
        <p className="text-[13.5px] leading-[1.65] text-[var(--text-secondary)]">{skill.description}</p>
        <SkillTriggers triggers={skill.triggers} />
      </section>


      <section
        className="grid gap-5 rounded-[14px] border border-[var(--border-subtle)] bg-[var(--glass-surface)] p-4 sm:grid-cols-2"
        aria-label="Related skills"
      >
        <RelatedSkills
          title={`References (${skill.references.length})`}
          ids={skill.references}
          handles={handles}
          empty="This skill stands alone."
        />
        <RelatedSkills
          title={`Referenced by (${skill.referencedBy.length})`}
          ids={skill.referencedBy}
          handles={handles}
          empty="Nothing points here yet."
        />
      </section>

      {overview.length > 0 && (
        <Foldable
          open={isPage}
          title={
            <>
              <ListOrdered size={12} strokeWidth={1.75} aria-hidden="true" />
              {skill.workflows.length > 0 ? "Workflow" : "What's inside"} ({overview.length})
            </>
          }
        >
          <ol className="flex flex-col gap-1.5">
            {overview.map((section) => (
              <li
                key={section.title}
                className="rounded-[12px] border border-[var(--border-subtle)] bg-[var(--glass-elevated)] px-3.5 py-2.5"
              >
                <p className="text-[13px] font-medium text-[var(--text-primary)]">{section.title}</p>
                {section.teaser && (
                  <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-[1.55] text-[var(--text-tertiary)]">
                    {section.teaser}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Foldable>
      )}


      <Foldable
        open={isPage}
        title={
          <>
            <FileText size={12} strokeWidth={1.75} aria-hidden="true" />
            Files ({skill.files.length})
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <ul className="overflow-hidden rounded-[12px] border border-[var(--border-subtle)]">
            {skill.files.map((file) => (
              <li key={file.id} className="border-b border-[var(--border-subtle)] last:border-b-0">
                <Link
                  href={`/skills/${skill.id}/workspace?file=${encodeURIComponent(file.relativePath)}`}
                  className="flex items-center gap-3 bg-[var(--glass-elevated)] px-3.5 py-2.5 transition-colors hover:bg-[var(--bg-elevated)]"
                >
                  <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-[var(--text-secondary)]">
                    {file.relativePath}
                  </span>
                  <span className="shrink-0 text-[11.5px] tabular-nums text-[var(--text-tertiary)]">{file.size}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/skills/${skill.id}/workspace`}
            className="inline-flex items-center gap-1 self-start text-[12.5px] text-[var(--text-secondary)] transition-colors hover:text-[color:var(--accent)]"
          >
            Open all in workspace
            <ArrowUpRight size={12} strokeWidth={1.75} />
          </Link>
        </div>
      </Foldable>

      {isPage && documentSlot && (
        <section id="full-skill" className="flex scroll-mt-4 flex-col gap-3" aria-labelledby={`document-${skill.id}`}>
          <h3 id={`document-${skill.id}`} className={labelClass}>
            Full document · SKILL.md
          </h3>
          <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--glass-surface)] px-5 py-6 sm:px-8">
            {documentSlot}
          </div>
        </section>
      )}
    </div>
  );
}

export default SkillDetail;
