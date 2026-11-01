import type { Metadata } from "next";
import { getSkillCatalog } from "@/lib/skill-catalog";
import { ExploreView } from "@/components/skills/explore-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Explore · AI DevKit Skills",
  description:
    "Discover what's new in CommandOSS AI DevKit, starter CMK + X companion recipes, and curated community skill drops.",
  openGraph: {
    title: "Explore · AI DevKit Skills",
    description:
      "Visual gallery of 23 core cmk:* engineering workflows and vetted X companion skill references.",
    siteName: "AI DevKit",
    type: "website",
    images: [
      {
        url: "https://skills.commandoss.com/og-explore.png?v=4",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "AI DevKit is a hub for exploring your skills by craft.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore · AI DevKit Skills",
    description:
      "Visual gallery of 23 core cmk:* engineering workflows and vetted X companion skill references.",
    images: [
      {
        url: "https://skills.commandoss.com/og-explore.png?v=4",
        alt: "AI DevKit is a hub for exploring your skills by craft.",
      },
    ],
  },
};

export default function ExplorePage() {
  const skills = getSkillCatalog();
  return <ExploreView skills={skills} />;
}
