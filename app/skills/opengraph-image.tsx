import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderSurfaceOgImage,
} from "@/lib/og-card";

export const alt =
  "CMK Skills · AI DevKit — 23 Canonical SDLC & Engineering Skills";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderSurfaceOgImage({
    routeBadge: "skills.commandoss.com/skills",
    eyebrow: "CANONICAL CMK:* SKILLS · COMMANDOSSLABS/AI-DEVKIT",
    title: "23 Core cmk:* Engineering Skills for Coding Agents.",
    subtitle:
      "Delivery pipeline, requirements, system design, ADRs, AI codebase maps, repo setup, and Sui SDK workflows.",
    pills: [
      "cmk:delivery-pipeline",
      "cmk:design",
      "cmk:codebase-docs",
      "cmk:adr",
      "cmk:repo-setup",
      "cmk:sui-sdk",
    ],
  });
}
