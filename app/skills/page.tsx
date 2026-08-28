import type { Metadata } from "next";
import { FileText, Layers } from "lucide-react";
import { getCatalogCategories, getSkillCatalog } from "@/lib/skill-catalog";
import { getRepoSnapshot } from "@/lib/repo-snapshot";
import { REPO_SKILLS_TREE } from "@/lib/repo-links";
import { SkillCatalog } from "@/components/skills/skill-catalog";
import { RepoSnapshotChip } from "@/components/skills/repo-snapshot-chip";
import { GooeyTextReveal } from "@/components/motion/gooey-text-reveal";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Browse Skills · AI DevKit Skills",
  description:
    "Every skill in CommandOSSLabs/ai-devkit — what it does, when to use it, and which skills it works with. Generated from the repository at build time.",
};

const metaChipClassName =
  "flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--glass-elevated)] px-3 text-[12.5px] text-[var(--text-secondary)]";

export default function SkillsBrowsePage() {
  const skills = getSkillCatalog();
  const categories = getCatalogCategories(skills);
  const snapshot = getRepoSnapshot();
  const fileCount = skills.reduce((n, s) => n + s.files.length, 0);
  const handles = Object.fromEntries(skills.map((s) => [s.id, s.handle]));

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        {/* basis + flex-1 rather than shrink-to-fit: GooeyTextReveal re-splits
          its text whenever its own width changes, so a container sized BY that
          text re-measures on every split and the reveal restarts forever,
          leaving the heading permanently blurred out. Sizing the column from
          the row instead makes the width independent of the split. */}
        <div className="min-w-0 flex-1 basis-[340px]">
        <GooeyTextReveal
          mode="immediate"
          duration={0.9}
          stagger={0.08}
          blurAmount={0.3}
          delay={0.05}
          className="flex w-full max-w-[62ch] flex-col gap-1"
        >
          <h1 className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">Browse skills</h1>
          <p className="text-[13px] leading-[1.6] text-[var(--text-secondary)]">
            Find the right skill for the task you are working on. Every skill in{" "}
            <a
              href={REPO_SKILLS_TREE}
              target="_blank"
              rel="noreferrer"
              className="text-[#82AAFF] underline decoration-[#82AAFF]/30 underline-offset-4 hover:decoration-[#82AAFF]"
            >
              CommandOSSLabs/ai-devkit
            </a>
            : what it does, when to reach for it, and what it works with. Open one to read it, or jump straight into its
            files.
          </p>
        </GooeyTextReveal>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className={metaChipClassName}>
            <Layers size={13} aria-hidden="true" />
            <span>{skills.length} skills</span>
          </div>
          <div className={metaChipClassName}>
            <FileText size={13} aria-hidden="true" />
            <span>{fileCount} files</span>
          </div>
          <RepoSnapshotChip snapshot={snapshot} />
        </div>
      </div>

      <SkillCatalog skills={skills} categories={categories} handles={handles} />
    </div>
  );
}
