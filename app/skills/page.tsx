import type { Metadata } from "next";
import { Layers, FileText } from "lucide-react";
import { getSkillsTree, type SkillTreeNode } from "@/lib/skills-tree";
import SkillTreeBrowser from "@/components/skills/skill-tree-browser";
import { GooeyTextReveal } from "@/components/motion/gooey-text-reveal";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Browse Skills · AI DevKit Skills",
  description: "Every file under skills/ in CommandOSSLabs/ai-devkit, read live from the repository — SKILL.md, references, and scripts.",
};

function countStats(nodes: SkillTreeNode[]) {
  let skills = 0;
  let files = 0;

  function walk(list: SkillTreeNode[], depth: number) {
    for (const node of list) {
      if (node.type === "folder") {
        if (depth === 0) skills++;
        walk(node.children, depth + 1);
      } else {
        files++;
      }
    }
  }

  walk(nodes, 0);
  return { skills, files };
}

const metaChipClassName =
  "flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 text-[12.5px] text-[var(--text-secondary)]";

export default function SkillsBrowsePage() {
  const tree = getSkillsTree();
  const stats = countStats(tree);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <GooeyTextReveal
          mode="immediate"
          duration={0.9}
          stagger={0.08}
          blurAmount={0.3}
          delay={0.05}
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
        >
          <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
            Browse skills
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Every file under <code className="text-[#82AAFF]">skills/</code> in{" "}
            <a
              href="https://github.com/CommandOSSLabs/ai-devkit/tree/main/skills"
              target="_blank"
              rel="noreferrer"
              className="text-[#82AAFF] underline decoration-[#82AAFF]/30 underline-offset-4 hover:decoration-[#82AAFF]"
            >
              CommandOSSLabs/ai-devkit
            </a>
            , read live — click a file to read it.
          </p>
        </GooeyTextReveal>

        <div className="flex flex-wrap items-center gap-2">
          <div className={metaChipClassName}>
            <Layers size={13} />
            <span>{stats.skills} skills</span>
          </div>
          <div className={metaChipClassName}>
            <FileText size={13} />
            <span>{stats.files} files</span>
          </div>
          <span className="flex h-9 items-center rounded-lg bg-[#82AAFF]/10 px-3 text-[12.5px] font-medium text-[#82AAFF]">
            Live from repository
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <SkillTreeBrowser tree={tree} />
      </div>
    </div>
  );
}
