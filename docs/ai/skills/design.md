# cmk:design

## What
Skill that drafts and iterates design documents — the technical "how". Covers both scopes in one skill: system-wide design (architecture, tech stack, components, cross-cutting concerns) and feature-level design (scope, flows, acceptance criteria). Distinct from product requirements (`cmk:requirements`) and from costly-to-reverse decisions (`cmk:adr`).

## Approach
On create, links the upstream requirements doc in `Links`. On iterate, runs an upstream check: reads the linked `docs/requirements/` doc for scope/success-criteria conflicts and `docs/decisions/` for constraining decisions, flagging conflicts rather than silently overriding them — the user resolves (update the decision, supersede it, or revert the design change).

Scope is declared in the doc's `Scope:` header rather than by directory, so a feature-level doc and a system-wide doc are the same artifact shape; the acceptance-criteria section applies to feature-level docs only.

## Where
- Skill body: `skills/design/SKILL.md` — sections `Input`, `Workflow: Create`, `Workflow: Iterate`, `Output`, `Links`.
- Placement rules: `skills/design/references/design-conventions.md`.
- Section template: `skills/design/references/design-template.md`.
- Output template (rendered shape): `docs/templates/design.md`.
- Default placement: `docs/design/<topic>.md`, system-wide design at `docs/design/system.md` — see `docs/design/README.md`.
