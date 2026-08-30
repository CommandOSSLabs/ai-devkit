/**
 * One reading of a skill identifier for every surface.
 *
 * Skills are named `cmk:<id>` in frontmatter and `<id>` on disk, so links
 * arrive in both forms: a graph node writes `?skill=delivery-review`, a person
 * pasting from a SKILL.md writes `?skill=cmk:delivery-review`. Catalog,
 * detail, workspace, graph and prompt inputs all resolve them here, so a URL
 * cannot mean one skill on one surface and another somewhere else.
 */
export function normalizeSkillId(value: string | null | undefined): string | null {
  if (!value) return null;
  const id = value.trim().replace(/^cmk:/, "");
  // Skill directories are lowercase kebab-case; anything else is not an id we
  // could resolve, and letting it through would only produce a 404 later.
  return /^[a-z0-9-]+$/.test(id) ? id : null;
}
