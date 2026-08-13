import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";
import { getSkillsTree } from "@/lib/skills-tree";
import SkillTreeBrowser from "@/components/skills/skill-tree-browser";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Browse Skills · AI DevKit Skills",
  description: "Every file under skills/ in CommandOSSLabs/ai-devkit, read live from the repository — SKILL.md, references, and scripts.",
};

export default function SkillsBrowsePage() {
  const tree = getSkillsTree();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-subtle)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)]">
              <Terminal size={14} className="text-[#82AAFF]" />
            </div>
            <span className="whitespace-nowrap font-mono text-[14px] font-semibold">ai-devkit</span>
          </Link>
          <Link
            href="/catalog"
            className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            <span>Back to catalog</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10">
          <h1 className="mb-3 text-[clamp(28px,4vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)]">
            Browse skills
          </h1>
          <p className="max-w-2xl text-[16px] leading-[1.6] text-[var(--text-secondary)]">
            Every file under <code className="text-[#82AAFF]">skills/</code> in{" "}
            <a
              href="https://github.com/CommandOSSLabs/ai-devkit/tree/main/skills"
              target="_blank"
              rel="noreferrer"
              className="text-[#82AAFF] underline decoration-[#82AAFF]/30 underline-offset-4 hover:decoration-[#82AAFF]"
            >
              CommandOSSLabs/ai-devkit
            </a>
            , read live from the repository — click a file to read it, not just its name and size.
          </p>
        </div>

        <SkillTreeBrowser tree={tree} />
      </main>
    </div>
  );
}
