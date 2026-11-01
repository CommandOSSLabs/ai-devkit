import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderCollectionsOgImage,
} from "@/lib/og-card";

export const alt =
  "Collections · AI DevKit Skills — 6 Curated Folders of Standout Agent Skills";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return renderCollectionsOgImage();
}
