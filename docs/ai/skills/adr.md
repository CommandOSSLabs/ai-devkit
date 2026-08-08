# cmk:adr

## What
Skill that creates and updates Architecture Decision Records for system-level technical choices — databases, protocols, infrastructure patterns. Distinguishes system-wide decisions (this skill) from feature-scoped ones (which belong in a feature-level design doc).

## Where
- Skill body: `skills/adr/SKILL.md` — frontmatter `name: cmk:adr`, sections `Workflow: Create`, `Workflow: Iterate`, `Output`.
- Placement rules: `skills/adr/references/adr-conventions.md`.
- ADR file template: `skills/adr/references/adr-template.md`.
- Output template (the rendered ADR shape this skill targets): `docs/templates/adr.md`.
- Default placement of generated ADRs: `docs/decisions/{NNNN}-{decision-title}.md` — see `docs/decisions/README.md`.
