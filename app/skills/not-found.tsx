// Segment-local so it renders inside app/skills/layout.tsx's sidebar shell
// (a not-found.tsx only bypasses layouts BELOW it in the tree) — the two
// stub routes should read as "not built yet" inside the dashboard, not
// bounce out to Next's generic default 404 page.
export default function SkillsNotFound() {
  return (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-frame)] px-6 py-16 text-center">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">404</p>
        <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">Not built yet</h1>
        <p className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">
          This section doesn&apos;t have anything here yet — check back once it&apos;s scoped out.
        </p>
      </div>
    </div>
  );
}
