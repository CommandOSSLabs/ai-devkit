import type { Metadata } from "next";
import { getSkillGraph } from "@/lib/skill-graph";
import { SkillGraphView } from "@/components/skills/skill-graph-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "How skills connect · AI DevKit Skills",
  description:
    "Which skills to use before, after, or alongside the one you are working on, mapped from the cmk: handles in every SKILL.md.",
};

export default function VisualizeInteractionsPage() {
  const graph = getSkillGraph();

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Two lines and one row of counts. Three stat cards used to sit above
          the map at the same weight as the controls, which is backwards on a
          page whose subject is the map. The entry-point count left this line
          entirely: it is something to act on, so it lives in the start panel
          where it can be clicked, not in a statistic. */}
      <div className="skills-page-head shrink-0">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          How skills connect
        </h1>
        <p className="mt-1 max-w-[66ch] text-[13px] leading-6 text-[var(--text-secondary)]">
          See which skills to use before, after, or alongside the one you are working on.
        </p>
        <p className="mt-1.5 font-mono text-[11.5px] tabular-nums text-[var(--text-tertiary)]">
          {graph.nodes.length} skills · {graph.edges.length} connections
        </p>
      </div>

      <SkillGraphView graph={graph} />
    </div>
  );
}
