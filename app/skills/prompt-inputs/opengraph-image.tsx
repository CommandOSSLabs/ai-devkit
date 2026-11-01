import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderSurfaceOgImage,
} from "@/lib/og-card";

export const alt =
  "MCP · AI DevKit Skills — The MCP server for cmk:* skills & Collections";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderSurfaceOgImage({
    routeBadge: "skills.commandoss.com/skills/prompt-inputs",
    eyebrow: "MODEL CONTEXT PROTOCOL · MULTI-VENDOR AGENT SERVER",
    title: "The MCP server for cmk:* skills & Collections.",
    subtitle:
      "Let Claude Code, Codex, and Cursor run the 23 core cmk:* engineering skills and paired companion collections.",
    pills: [
      "Claude Code (.mcp.json)",
      "Codex (.codex/config.toml)",
      "Cursor (.cursor/mcp.json)",
      "cmk:delivery-pipeline",
      "cmk:design",
    ],
  });
}
