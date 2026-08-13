import { getAllSkills } from "@/lib/skills";
import SkillPageClient from "./SkillPageClient";

export const dynamic = "force-static";

export default function Home() {
  const skills = getAllSkills();
  return <SkillPageClient skills={skills} />;
}
