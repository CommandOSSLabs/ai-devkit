import type { Metadata } from "next";
import { McpShowcase } from "@/components/skills/mcp-showcase";
import { getSkillExamples } from "@/lib/skill-examples";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "MCP · AI DevKit Skills",
  description:
    "The MCP server and canonical skill kit that lets Claude Code, Codex, and Cursor read your saved CMK skills and X references.",
};

export default function PromptInputsPage() {
  const skillExamples = getSkillExamples();

  return <McpShowcase skillExamples={skillExamples} />;
}
