import type { Metadata } from "next";
import { Share2, Link2, CircleDot } from "lucide-react";
import { getSkillGraph } from "@/lib/skill-graph";
import { SkillGraphView } from "@/components/skills/skill-graph-view";
import { BlurHighlight } from "@/components/ui/blur-highlight";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Visualize interactions · AI DevKit Skills",
  description:
    "How the skills in CommandOSSLabs/ai-devkit reference each other — a graph built from the cmk: handles in every SKILL.md.",
};

const metaChipClassName =
  "flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--glass-elevated)] px-3 text-[12.5px] text-[var(--text-secondary)] backdrop-blur-sm";

export default function VisualizeInteractionsPage() {
  const graph = getSkillGraph();
  const entryPoints = graph.nodes.filter((n) => n.inDegree === 0).length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Visualize interactions</h1>
          <BlurHighlight
            highlightedBits={["reference each other", "hub-and-spoke"]}
            highlightColor="rgba(130, 170, 255, 0.22)"
            highlightClassName="rounded-[3px] px-0.5"
            blurAmount={6}
            blurDuration={0.7}
            highlightDelay={0.5}
            viewportOptions={{ once: true, amount: 0.4 }}
            className="mt-1 text-[13px] leading-6 text-[var(--text-secondary)]"
          >
            Skills reference each other by their cmk: handle, and the result is hub-and-spoke rather than a flat list.
          </BlurHighlight>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className={metaChipClassName}>
            <CircleDot size={13} />
            <span>{graph.nodes.length} skills</span>
          </div>
          <div className={metaChipClassName}>
            <Link2 size={13} />
            <span>{graph.edges.length} references</span>
          </div>
          <div className={metaChipClassName}>
            <Share2 size={13} />
            <span>{entryPoints} entry points</span>
          </div>
        </div>
      </div>

      <SkillGraphView graph={graph} />
    </div>
  );
}
