import { notFound } from "next/navigation";
import { getAllSkills } from "@/lib/skills";
import SkillPageClient from "../SkillPageClient";

export const dynamic = "force-static";

const SECTIONS = {
  quickstart: {
    title: "Quickstart",
    description: "Install AI DevKit skills into your project in one command — no account, no config file.",
  },
  "how-it-works": {
    title: "How It Works",
    description: "How AI DevKit turns your repository into the shared source of truth agents and humans both read from.",
  },
  features: {
    title: "Capabilities",
    description: "What AI DevKit skills cover, from delivery workflows to documentation and testing.",
  },
  benchmarks: {
    title: "Benchmarks",
    description: "Concrete, executable proof behind every AI DevKit capability — no marketing claims.",
  },
  catalog: {
    title: "Skills",
    description: "Browse and copy every AI DevKit skill for your project.",
  },
} as const;

type SectionSlug = keyof typeof SECTIONS;

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  const section = SECTIONS[slug as SectionSlug];
  if (!section) return {};
  return {
    title: `${section.title} · AI DevKit Skills`,
    description: section.description,
  };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  if (!(slug in SECTIONS)) notFound();

  const skills = getAllSkills();
  return <SkillPageClient skills={skills} initialSection={slug} />;
}
