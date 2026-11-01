import type { Metadata } from "next";
import { McpShowcase } from "@/components/skills/mcp-showcase";
import { getSkillExamples } from "@/lib/skill-examples";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "MCP · AI DevKit Skills",
  description:
    "The MCP server that lets Claude Code, Codex, and Cursor run the 23 core cmk:* skills and companion collections.",
  openGraph: {
    title: "MCP · AI DevKit Skills",
    description:
      "The MCP server that lets Claude Code, Codex, and Cursor run the 23 core cmk:* skills and companion collections.",
    url: "https://skills.commandoss.com/skills/prompt-inputs",
    siteName: "AI DevKit Skills",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP · AI DevKit Skills",
    description:
      "The MCP server that lets Claude Code, Codex, and Cursor run the 23 core cmk:* skills and companion collections.",
  },
};

export default function PromptInputsPage() {
  const skillExamples = getSkillExamples();

  return <McpShowcase skillExamples={skillExamples} />;
}
