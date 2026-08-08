# Check-only CI convention

## Design principle

The CI check validates structure and safety, never prose — it catches what a
human cannot notice going wrong (a missing entry point, an adapter that
quietly stopped delegating, a stale vendor root). It deliberately does not
paraphrase-match policy sentences, so rewording a canonical skill never
breaks CI.

## Check-only, not write

Generation is performed by the agent following
`references/adapter-template.md`; the validator recomputes expected adapter
bodies from the same template and byte-compares them against what is
checked in. There is no write mode — a failing check names the file and
what differs, and leaves the fix to the agent.

## The check list

Mirrors the skill's `## Verify`, expressed as machine checks:

- Canonical-skill frontmatter validity.
- Adapter presence/absence per vendor tier.
- Adapter-mirror: frontmatter byte-equality between each adapter and its
  canonical skill.
- Adapter-mirror: body byte-equality between each adapter and the template
  output.
- Rule-mirror: the required frontmatter field set (`description`, `globs`,
  `alwaysApply`) is present, and the delegation body pointing at the
  canonical SKILL.md is present — a rule mirror has no template output to
  byte-compare against.
- Binding files present with their required headings when a skill
  references one.
- `AGENTS.md` symlink target.
- Unsupported vendor roots absent.
- Lock coverage — delegate this check to `cmk:sync`'s own verify, run
  alongside rather than reimplemented here.
- Cross-package path sweep over `.agents/skills/`.

## CI wiring pattern

One job, path-filtered to the vendor and canonical roots it guards
(`.agents/**`, each vendor root, the checker itself). If the checker has its
own tests, run them first, then run the checker against the tree. Path
filters must cover every vendor root the repo actually has — verify flags a
filter that has fallen behind the directory list.
