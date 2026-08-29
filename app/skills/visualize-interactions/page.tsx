import type { Metadata } from "next";
import { getSkillGraph } from "@/lib/skill-graph";
import { SkillGraphView } from "@/components/skills/skill-graph-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Visualize interactions · AI DevKit Skills",
  description:
    "How the skills in CommandOSSLabs/ai-devkit reference each other — a graph built from the cmk: handles in every SKILL.md.",
};

export default function VisualizeInteractionsPage() {
  const graph = getSkillGraph();
  const entryPoints = graph.nodes.filter((n) => n.inDegree === 0).length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Two lines and one row of counts. Three stat cards used to sit above
          the map at the same weight as the controls, which is backwards on a
          page whose subject is the map. Hidden entirely in focus mode. */}
      <div className="skills-page-head shrink-0">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          Visualize interactions
        </h1>
        <p className="mt-1 max-w-[66ch] text-[13px] leading-6 text-[var(--text-secondary)]">
          Map how skills connect. Select one to trace its incoming and outgoing references.
        </p>
        <p className="mt-1.5 font-mono text-[11.5px] tabular-nums text-[var(--text-tertiary)]">
          {graph.nodes.length} skills · {graph.edges.length} links · {entryPoints} entry points
        </p>
      </div>

      <SkillGraphView graph={graph} />
    </div>
  );
}
