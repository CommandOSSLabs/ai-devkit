import type { Metadata } from "next";
import { getSkillCatalog } from "@/lib/skill-catalog";
import { WorkspaceEntry } from "@/components/skills/workspace-entry";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Skill workspace · AI DevKit Skills",
  description: "Open a skill's files in the full workspace: preview, source, and local drafts.",
};

// The shareable workspace address. It resolves to the per-skill workspace
// rather than rendering one itself, because rendering here would mean shipping
// every skill's file contents (455KB of markdown) to anyone who opens the
// route, when a visitor only ever wants one skill's files.
export default function WorkspaceEntryPage() {
  return <WorkspaceEntry ids={getSkillCatalog().map((skill) => skill.id)} />;
}
