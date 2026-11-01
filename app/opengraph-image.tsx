import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderSurfaceOgImage,
} from "@/lib/og-card";

export const alt = "AI DevKit Skills — Evolvable agent skills for the full SDLC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderSurfaceOgImage({
    routeBadge: "skills.commandoss.com",
    eyebrow: "AI DEVKIT · FULL SDLC AGENT SKILLS",
    title: "Evolvable agent skills. For the full SDLC.",
    subtitle:
      "23 canonical cmk:* engineering workflows, 6 curated X companion collections, and MCP support for Claude Code, Codex, and Cursor.",
    pills: [
      "cmk:delivery-pipeline",
      "cmk:design",
      "cmk:codebase-docs",
      "cmk:repo-setup",
      "6 Curated X Collections",
    ],
  });
}
