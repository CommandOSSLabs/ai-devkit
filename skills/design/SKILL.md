---
name: cmk:design
description: This skill should be used when the user asks "how should we build this", "design the backend", "update the architecture", "draft a system design", "create a feature spec", "spec out this feature", or discusses architecture, tech stack changes, component design, or infrastructure layout. Covers drafting, refining, or updating distilled design documents under docs/design/ — system-wide or per-feature — checking for conflicts with upstream requirements and recorded decisions.
version: 0.3.0
---

# Design

Create or iterate design documents covering architecture, tech stack, components, cross-cutting concerns, and feature-level implementation detail. Captures the technical "how." Product requirements belong in `docs/requirements/`; system-wide constraints that are costly to reverse belong in `docs/decisions/`.

## References

Read `references/design-conventions.md` for placement rules and `references/design-template.md` for section structure.

## Input

Synthesize from whatever the user provides: conversation context, existing requirements (`docs/requirements/<topic>.md`), local docs, external links, direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Workflow: Create

1. Normalize input into design context: mission, principles, tech stack, components, dependencies, cross-cutting concerns, constraints — or, for a feature-level doc, scope, flows, and acceptance criteria.
2. Map into template sections from `references/design-template.md`. Align to local convention if one exists.
3. Place at `docs/design/<topic>.md` — system-wide design may use `docs/design/system.md`.
4. Mark unknowns in `Open Points` — don't guess.
5. Link the requirements doc it satisfies in `Links`.
6. Set status to `draft`.

## Workflow: Iterate

1. Read the existing design doc in full.
2. **Upstream check:** read the linked doc in `docs/requirements/` and flag conflicts with scope or success criteria; check `docs/decisions/` for constraining decisions and flag conflicts rather than silently overriding.
3. **System conflict check (feature-scoped docs only):** if the `Scope:` header is narrower than system-wide, read the system-level design doc and flag any conflict with its architecture or components — surface it, never silently override system design from a feature doc.
4. Identify what changed and why.
5. Update affected sections in place. Preserve unchanged content.
6. Update `Last updated` date.
7. Transition status when appropriate: `draft` → `active` → `shipped`, or any → `deprecated`.

## Output

- Create: complete design doc at `docs/design/<topic>.md` with known context populated
- Iterate: targeted updates to affected sections only
- Unresolved decisions go in `Open Points`
- Design principles are opinionated and system-specific
- Architecture diagram matches component descriptions
- Security section is always present for system-wide design — includes assumptions, gaps, and controls
- Feature-level docs include acceptance criteria when the "done" definition isn't obvious from the requirement itself

## Links

Every design doc names the requirements it satisfies and the decisions that constrain it; progress-neutral, tracker-neutral wording.
