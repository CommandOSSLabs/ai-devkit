# cmk:design

## What
Skill that drafts and iterates design documents — the technical "how" as an implementation-agnostic spec: approach, mechanism, and guarantees rather than stack bindings. Covers three levels in one skill: system-wide design, sub-system/track design (multi-doc trees with a "read this tree" entry README), and feature-level design (scope, flows, acceptance criteria). Distinct from product requirements (`cmk:requirements`) and from costly-to-reverse decisions (`cmk:adr`).

## Approach
On create, links the upstream requirements doc in `Links` and interviews first when the subject is still an idea. On iterate, runs an upstream check (linked `docs/requirements/` doc for scope/success-criteria conflicts, `docs/decisions/` for constraining decisions), a system conflict check for feature-scoped docs, and a downstream cascade over sibling docs referencing the changed component — flagging conflicts rather than silently overriding them; the user resolves (update the decision, supersede it, or revert the design change).

Scope is declared in the doc's `Scope:` header rather than by directory, so a feature-level doc and a system-wide doc are the same artifact shape; the acceptance-criteria section applies to feature-level docs only.

## Where
- Skill body: `skills/design/SKILL.md` — sections `Input`, `Elicitation`, `Workflow: Create`, `Workflow: Iterate`, `Output`, `Links`.
- Placement and level rules: `skills/design/references/design-conventions.md`.
- Shaping directive (not a fixed form): `skills/design/references/design-guidance.md` — spec-over-implementation, design levels, multi-doc trees, coherence.
- Output template (baseline scaffold shape): `docs/templates/design.md`.
- Default placement: `docs/design/<topic>.md`, system-wide design at `docs/design/system.md` — see `docs/design/README.md`.
