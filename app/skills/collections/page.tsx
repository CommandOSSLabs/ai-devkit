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
      "6 translucent collection folders of standout agent skills from X — vetted, paired with 23 canonical cmk:* workflows, and pinned to verified commits.",
    url: "https://skills.commandoss.com/skills/collections",
    siteName: "AI DevKit Skills",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collections · AI DevKit Skills",
    description:
      "6 translucent collection folders of standout agent skills from X — vetted, paired with 23 canonical cmk:* workflows, and pinned to verified commits.",
  },
};

export default function CollectionsPage() {
  return <CollectionsView />;
}
