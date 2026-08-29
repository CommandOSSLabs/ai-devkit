export type FrontmatterField = { key: string; value: string };

// Skill files open with a YAML frontmatter block (name/description/version)
// that isn't blank-line-separated from itself, so a blank-line block
// splitter swallows it whole into one run-on paragraph. Pull it out first
// and parse it as flat key: value pairs — real enough for what these files
// actually contain, not a full YAML parser. Shared by the markdown preview
// (renders it as a card) and the server-side skill-examples reader (pulls
// the quoted trigger phrases out of `description`).
export function extractFrontmatter(src: string): { frontmatter: FrontmatterField[] | null; body: string } {
  const match = src.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) return { frontmatter: null, body: src };

  const fields: FrontmatterField[] = [];
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):[ \t]?(.*)$/);
    if (m) fields.push({ key: m[1], value: m[2].trim() });
  }
  return { frontmatter: fields.length > 0 ? fields : null, body: src.slice(match[0].length) };
}
