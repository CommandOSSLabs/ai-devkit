import type { Metadata } from "next";
import { CollectionsView } from "@/components/skills/collections-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Collections · AI DevKit Skills",
  description:
    "Curated collections of standout agent skills discovered on X — vetted, paired with cmk:* workflows, and ready to shout out.",
  openGraph: {
    title: "Collections · AI DevKit Skills",
    description:
      "Curated collections of standout agent skills discovered on X — vetted, paired with cmk:* workflows, and ready to shout out.",
    url: "https://skills.commandoss.com/skills/collections",
    siteName: "AI DevKit",
    type: "website",
    images: [
      {
        url: "https://skills.commandoss.com/og-collections.png",
        width: 2600,
        height: 1658,
        alt: "AI DevKit is a kit for curating agent skills by craft.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Collections · AI DevKit Skills",
    description:
      "Curated collections of standout agent skills discovered on X — vetted, paired with cmk:* workflows, and ready to shout out.",
    images: [
      {
        url: "https://skills.commandoss.com/og-collections.png",
        alt: "AI DevKit is a kit for curating agent skills by craft.",
      },
    ],
  },
};

export default function CollectionsPage() {
  return <CollectionsView />;
}
