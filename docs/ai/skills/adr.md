# cmk:adr

## What
Skill that creates and updates Architecture Decision Records for system-level technical choices — databases, protocols, infrastructure patterns. Distinguishes system-wide decisions (this skill) from feature-scoped ones (which belong in a feature-level design doc). Records are short (Context / Decision / Consequences), written before the code that depends on them, and lifecycle-managed by supersession: a decision that changes direction gets a new numbered record while the old one is marked `Superseded by NNNN` and kept — never deleted.

## Where
- Skill body: `skills/adr/SKILL.md` — frontmatter `name: cmk:adr`, sections `Workflow: Create`, `Workflow: Iterate`, `Output`.
- Placement and lifecycle rules: `skills/adr/references/adr-conventions.md` — includes the index README convention (one-liner per record with supersession parentheticals).
- ADR record shape: `skills/adr/references/adr-template.md`.
- Output template (the rendered ADR shape this skill targets): `docs/templates/adr.md`.
- Default placement of generated ADRs: `docs/decisions/{NNNN}-{decision-title}.md` — see `docs/decisions/README.md`.
