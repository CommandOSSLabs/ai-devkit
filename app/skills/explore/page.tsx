import type { Metadata } from "next";
import { getSkillCatalog } from "@/lib/skill-catalog";
import { ExploreView } from "@/components/skills/explore-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Explore · AI DevKit Skills",
  description:
    "Discover what's new in CommandOSS AI DevKit, starter CMK + X companion recipes, and curated community skill drops.",
};

export default function ExplorePage() {
  const skills = getSkillCatalog();
  return <ExploreView skills={skills} />;
}
