import type { Metadata } from "next";
import { CollectionsView } from "@/components/skills/collections-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Collections · AI DevKit Skills",
  description:
    "Curated collections of standout agent skills discovered on X — vetted, paired with cmk:* workflows, and ready to shout out.",
};

export default function CollectionsPage() {
  return <CollectionsView />;
}
