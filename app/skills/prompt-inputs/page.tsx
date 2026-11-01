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
    siteName: "AI DevKit",
    type: "website",
    images: [
      {
        url: "https://skills.commandoss.com/og-mcp.png",
        width: 2600,
        height: 1658,
        alt: "AI DevKit is a tool for teaching your agents by feel.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP · AI DevKit Skills",
    description:
      "The MCP server that lets Claude Code, Codex, and Cursor run the 23 core cmk:* skills and companion collections.",
    images: [
      {
        url: "https://skills.commandoss.com/og-mcp.png",
        alt: "AI DevKit is a tool for teaching your agents by feel.",
      },
    ],
  },
};

export default function PromptInputsPage() {
  const skillExamples = getSkillExamples();

  return <McpShowcase skillExamples={skillExamples} />;
}
