import { GitCommitHorizontal } from "lucide-react";
import type { RepoSnapshot } from "@/lib/repo-snapshot";

// Every /skills page is generated from the repository at build time, so this
// says exactly that, and names the commit it read when the build environment
// exposes one. The previous "Live from repository" badge described a runtime
// fetch this page has never done.
export function RepoSnapshotChip({ snapshot }: { snapshot: RepoSnapshot }) {
  const label = snapshot.commit
    ? `Built from ${snapshot.commit}`
    : "Generated at build time";
  const source = [snapshot.branch, snapshot.commit].filter(Boolean).join(" @ ");
  const title = source
    ? `Generated from ${source} at build time, ${snapshot.generatedAt}`
    : `Generated from the repository at build time, ${snapshot.generatedAt}`;

  const body = (
    <>
      <GitCommitHorizontal size={13} strokeWidth={1.75} aria-hidden="true" />
      <span className="font-mono">{label}</span>
    </>
  );

  const className =
    "flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--glass-elevated)] px-3 text-[12px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]";

  return snapshot.commitUrl ? (
    <a href={snapshot.commitUrl} target="_blank" rel="noreferrer" title={title} className={className}>
      {body}
    </a>
  ) : (
    <span title={title} className={className}>
      {body}
    </span>
  );
}

export default RepoSnapshotChip;
