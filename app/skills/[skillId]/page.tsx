import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getSkillCatalog, getSkillDocument } from "@/lib/skill-catalog";
import { getRepoSnapshot } from "@/lib/repo-snapshot";
import { SkillDetail } from "@/components/skills/skill-detail";
import { MarkdownPreview } from "@/components/skills/markdown-preview";
import { RepoSnapshotChip } from "@/components/skills/repo-snapshot-chip";
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
    title: `${skill.handle} · AI DevKit Skills`,
    description: skill.summary || skill.description,
  };
}

export default async function SkillDetailPage({ params }: { params: Promise<{ skillId: string }> }) {
  const { skillId } = await params;
  const skills = getSkillCatalog();
  const skill = skills.find((s) => s.id === skillId);
  if (!skill) notFound();

  const handles = Object.fromEntries(skills.map((s) => [s.id, s.handle]));
  const document = getSkillDocument(skill.id);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <RememberSkill id={skill.id} />

      <div className="mx-auto flex max-w-[880px] flex-col gap-6 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-[var(--text-tertiary)]">
            <Link
              href="/skills"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={13} strokeWidth={1.75} />
              All skills
            </Link>
            <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" className="text-[var(--border-strong)]" />
            <span className="font-mono text-[var(--text-secondary)]">{skill.id}</span>
          </nav>
          <RepoSnapshotChip snapshot={getRepoSnapshot()} />
        </div>

        <SkillDetail
          skill={skill}
          handles={handles}
          variant="page"
          documentSlot={
            document ? <MarkdownPreview content={document} variant="document" showFrontmatter={false} /> : null
          }
        />
      </div>
    </div>
  );
}
