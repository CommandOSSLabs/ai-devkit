import type { Metadata } from "next";
import Link from "next/link";
import { FolderClosed, Layers, Sparkles } from "lucide-react";
import { getCatalogCategories, getSkillCatalog } from "@/lib/skill-catalog";
import { getRepoSnapshot } from "@/lib/repo-snapshot";
import { SkillCatalog } from "@/components/skills/skill-catalog";
import { RepoSnapshotChip } from "@/components/skills/repo-snapshot-chip";
import { GooeyTextReveal } from "@/components/motion/gooey-text-reveal";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "CMK Skills · AI DevKit Skills",
  description:
    "Every canonical cmk:* skill in CommandOSSLabs/ai-devkit — what it does, when to use it, and which skills it works with. Generated from the repository at build time.",
};

const metaChipClassName =
  "flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-[12.5px] text-[var(--text-secondary)]";

export default function SkillsBrowsePage() {
  const skills = getSkillCatalog();
  const categories = getCatalogCategories(skills);
  const snapshot = getRepoSnapshot();
  const handles = Object.fromEntries(skills.map((s) => [s.id, s.handle]));

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1320px] flex-col gap-5">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 basis-[340px]">
          <GooeyTextReveal
            mode="immediate"
            duration={0.9}
            stagger={0.08}
            blurAmount={0.3}
            delay={0.05}
            className="flex w-full max-w-[62ch] flex-col gap-1"
          >
            <h1 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--text-primary)]">
              CMK Skills
            </h1>
            <p className="text-[13px] leading-[1.6] text-[var(--text-secondary)]">
              Canonical CommandOSS workflows — find the right skill, inspect its files, and pair it with curated X companions.
            </p>
          </GooeyTextReveal>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Link
            href="/skills/explore"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <Sparkles size={13} className="text-[color:var(--accent)]" />
            <span>Explore new</span>
          </Link>
          <Link
            href="/skills/collections"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <FolderClosed size={13} className="text-[color:var(--accent)]" />
            <span>X Collections</span>
          </Link>
          <div className={metaChipClassName}>
            <Layers size={13} aria-hidden="true" />
            <span>{skills.length} skills</span>
          </div>
          <RepoSnapshotChip snapshot={snapshot} />
        </div>
      </div>

      <SkillCatalog skills={skills} categories={categories} handles={handles} />
    </div>
  );
}
