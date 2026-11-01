import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderSurfaceOgImage,
} from "@/lib/og-card";

export const alt =
  "Explore · AI DevKit Skills — Visual Gallery of Core cmk:* & Curated X Skills";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderSurfaceOgImage({
    routeBadge: "skills.commandoss.com/skills/explore",
    eyebrow: "EXPLORE VISUAL GALLERY · CMK:* + X REFS",
    title: "Discover 23 core cmk:* workflows & vetted X skills.",
    subtitle:
      "Inspect full SKILL.md references, creator @xHandle attribution, pinned commits, and 1-click install commands.",
    pills: [
      "cmk:delivery-pipeline",
      "@emilkowalski_/skills",
      "@pbakaus/impeccable",
      "@mattpocockuk/grill-me",
      "@wheresryan22/anatomy",
    ],
  });
}
