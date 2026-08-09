---
name: cmk:design
description: This skill should be used when the user asks "how should we build this", "design the backend", "update the architecture", "draft a system design", "create a feature spec", "spec out this feature", or discusses architecture, tech stack changes, component design, or infrastructure layout. Covers drafting, refining, or updating distilled design documents under docs/design/ — system-wide or per-feature — checking for conflicts with upstream requirements and recorded decisions.
version: 0.4.0
---

# Design

Create or iterate design documents covering architecture, components, mechanisms, cross-cutting concerns, and feature-level detail. Design captures the technical "how" as a spec — the approach, mechanism, and guarantees, largely independent of the language or framework that will implement them — and it is thorough: distilled never means shallow. Product requirements belong in `docs/requirements/`; system-wide constraints that are costly to reverse belong in `docs/decisions/`.

## References

Read `references/design-conventions.md` for placement and level rules and `references/design-guidance.md` for how to shape the document — a directive, not a fixed form.

## Input

Synthesize from whatever the user provides: conversation context, existing requirements (`docs/requirements/<topic>.md`), local docs, external links, direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Elicitation

When the design subject is still an idea, interview before drafting: probe the constraints, failure modes, trust boundaries, and alternatives one question at a time, and distill the answers into the spec. Where an interview-driven skill is available in the session (e.g. superpowers' brainstorming/spec flow), use it as the elicitation engine; the distilled result lands here as the design doc. Generic architecture prose is a failure — the spec must be specific enough to disagree with.

## Workflow: Create

1. Normalize input into design context at the right level — system-wide architecture, sub-system/track design, or feature-level spec (see `references/design-conventions.md` § Design Levels).
2. Shape the document per `references/design-guidance.md`, aligning to local convention if one exists.
3. Place at `docs/design/<topic>.md` — system-wide design may use `docs/design/system.md`; a multi-doc design tree gets a "read this tree" entry README.
4. Use glossary terms (see `cmk:glossary`) for every system, component, and actor name; define new terms there, not inline.
5. Mark unknowns in `Open Points` — don't guess.
6. Link the requirements doc it satisfies in `Links`.
7. Set status to `draft`.

## Workflow: Iterate

1. Read the existing design doc in full.
2. **Upstream check:** read the linked doc in `docs/requirements/` and flag conflicts with scope or success criteria; check `docs/decisions/` for constraining decisions and flag conflicts rather than silently overriding.
3. **System conflict check (feature-scoped docs only):** if the `Scope:` header is narrower than system-wide, read the system-level design doc and flag any conflict with its architecture or components — surface it, never silently override system design from a feature doc.
4. **Downstream cascade:** a design change can invalidate sibling and lower-level design docs that reference the changed component — check inbound references and cascade or flag them in the same change.
5. Identify what changed and why.
6. Update affected sections in place. Preserve unchanged content.
7. Update `Last updated` date.
8. Transition status when appropriate: `draft` → `active` → `shipped`, or any → `deprecated`.

## Output

- Create: complete design doc at `docs/design/<topic>.md` with known context populated
- Iterate: targeted updates to affected sections only, cascaded to affected surfaces
- Unresolved decisions go in `Open Points`
- Design principles are opinionated and system-specific
- Mechanisms are specified independent of implementation language/framework; stack choices appear as constraints or rationale, not as the spec itself
- Architecture diagram matches component descriptions
- Security section is always present for system-wide design — includes assumptions, gaps, and controls
- Feature-level docs include acceptance criteria when the "done" definition isn't obvious from the requirement itself

## Links

Every design doc names the requirements it satisfies and the decisions that constrain it; progress-neutral, tracker-neutral wording.
