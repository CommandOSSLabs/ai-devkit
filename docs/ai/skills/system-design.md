# cmk:system-design

## What
Skill that drafts and iterates the system design document — architecture, tech stack, components, cross-cutting concerns. The technical "how" at architecture level, distinct from product (PRD) and feature (feature-spec) layers.

## Approach
On create, links the upstream PRD in `Related Documents` if one exists. On iterate, cross-checks the change against existing ADRs and warns when a revision contradicts a previously accepted decision — the user resolves the conflict (update the ADR, supersede it, or revert the design change).

## Where
- Skill body: `skills/system-design/SKILL.md` — sections `Input`, `Workflow: Create`, `Workflow: Iterate`, `Output`.
- Placement rules: `skills/system-design/references/system-design-conventions.md`.
- Section template: `skills/system-design/references/system-design-template.md`.
- Output template (rendered shape): `docs/templates/system-design.md`.
- Default placement: `docs/system-design.md`.
