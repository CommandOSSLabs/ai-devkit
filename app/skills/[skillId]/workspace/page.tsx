import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import { getSkillCatalog } from "@/lib/skill-catalog";
import { getSkillTreeNodes } from "@/lib/skills-tree";
import { REPO_SKILLS_TREE } from "@/lib/repo-links";
import SkillTreeBrowser from "@/components/skills/skill-tree-browser";
import { RememberSkill } from "@/components/skills/remember-skill";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getSkillCatalog().map((skill) => ({ skillId: skill.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ skillId: string }>;
}): Promise<Metadata> {
  const { skillId } = await params;
  const skill = getSkillCatalog().find((s) => s.id === skillId);
  if (!skill) return {};
  return {
    title: `${skill.handle} workspace · AI DevKit Skills`,
    description: `Read and mark up every file in ${skill.handle} — SKILL.md, references, and scripts.`,
  };
}

export default async function SkillWorkspacePage({ params }: { params: Promise<{ skillId: string }> }) {
  const { skillId } = await params;
  const skill = getSkillCatalog().find((s) => s.id === skillId);
  const tree = getSkillTreeNodes(skillId);
  if (!skill || !tree) notFound();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
            <Link href="/skills" className="transition-colors hover:text-[var(--text-primary)]">
              All skills
            </Link>
            <ChevronRight size={12} strokeWidth={1.75} aria-hidden="true" className="text-[var(--border-strong)]" />
            <Link href={`/skills/${skill.id}`} className="font-mono transition-colors hover:text-[var(--text-primary)]">
              {skill.id}
            </Link>
            <ChevronRight size={12} strokeWidth={1.75} aria-hidden="true" className="text-[var(--border-strong)]" />
            <span className="text-[var(--text-secondary)]">Workspace</span>
          </nav>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-mono text-[16px] font-semibold text-[#82AAFF]">{skill.handle}</h1>
            <p className="max-w-[70ch] text-[13px] text-[var(--text-secondary)]">
              {skill.summary || skill.description}
            </p>
          </div>
          <p className="mt-1 text-[12px] text-[var(--text-tertiary)]">
            {skill.files.length} files · read, mark up locally, copy out. Edits stay in this browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/skills/${skill.id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={13} strokeWidth={1.75} />
            Skill overview
          </Link>
          <a
            href={`${REPO_SKILLS_TREE}/${skill.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <ExternalLink size={13} strokeWidth={1.75} />
            GitHub
          </a>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <RememberSkill id={skill.id} />
        <SkillTreeBrowser tree={tree} rootLabel={skill.id} />
      </div>
    </div>
  );
}
