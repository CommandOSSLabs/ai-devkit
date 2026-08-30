import { getSkillsTree, type SkillTreeNode } from "./skills-tree";
import { extractFrontmatter } from "./frontmatter";

export type SkillExample = { id: string; label: string; examples: string[] };

// The point of the Prompt Inputs demo is showing what an example prompt for
// one of this repo's real skills looks like — not invented copy. Every
// cmk-* SKILL.md's frontmatter `description` already spells out its own
// trigger phrases as a quoted list (e.g. cmk-adr: `... asks to "record this
// decision", "we decided to use X over Y", ...`), so this just reads that
// straight off the same file the Skills tab already renders, instead of
// hand-writing a second, driftable copy of the same examples.
function findSkillMd(nodes: SkillTreeNode[]) {
  return nodes.find((n): n is Extract<SkillTreeNode, { type: "file" }> => n.type === "file" && n.name === "SKILL.md");
}

export function getSkillExamples(): SkillExample[] {
  const tree = getSkillsTree();
  const results: SkillExample[] = [];

  for (const node of tree) {
    if (node.type !== "folder") continue;
    const skillFile = findSkillMd(node.children);
    if (!skillFile?.content) continue;

    const { frontmatter } = extractFrontmatter(skillFile.content);
    if (!frontmatter) continue;

    const label = frontmatter.find((f) => f.key === "name")?.value ?? node.name;
    const description = frontmatter.find((f) => f.key === "description")?.value ?? "";
    const quoted = Array.from(description.matchAll(/"([^"]+)"/g)).map((m) => m[1]);
    const examples = quoted.length > 0 ? quoted.slice(0, 4) : description ? [description] : [];

    if (examples.length > 0) results.push({ id: node.id, label, examples });
  }

  return results;
}
