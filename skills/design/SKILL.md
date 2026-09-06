---
name: cmk:design
description: Use when the user asks "how should we build this", "design the backend", "update the architecture", "draft a system design", "create a feature spec", "spec out this feature", or discusses architecture, tech stack changes, component design, or infrastructure layout. Covers drafting, refining, or updating distilled design documents under docs/design/ — system-wide or per-feature — checking for conflicts with upstream requirements and recorded decisions.
version: 0.7.1
---

# Design

Create or iterate design documents covering architecture, components, mechanisms, cross-cutting concerns, and feature-level detail. Design captures the technical "how" as a spec — the approach, mechanism, and guarantees, largely independent of the language or framework that will implement them — and it is thorough: distilled never means shallow. Product requirements belong in `docs/requirements/`; system-wide constraints that are costly to reverse belong in `docs/decisions/`.

## References

Read `cmk:capability-map`'s `references/neighbor-derivation.md` before drafting
and `references/registry-conventions.md` for the card header block — those are
the one home for each, and this skill does not restate them. Read
`references/design-conventions.md` for placement and level rules and `references/design-guidance.md` for how to shape the document — a directive, not a fixed form.

## Input

Synthesize from whatever the user provides: conversation context, existing requirements (`docs/requirements/<topic>.md`), local docs, external links, direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Neighbors before mechanism

Before writing any mechanism section, derive the capability neighbors
(`cmk:capability-map`, Workflow: Neighbors) seeded with the candidate paths this
design will touch and the subject's key terms. Report the neighbors, their owned
paths, and their declined items, citing a code plus a path or term for every
conclusion.

A neighbor that already owns a path this design claims is either a reuse
opportunity to take, or an overlap to state and justify in the doc. A declined
item this design would reverse is answered per that file's § Grounded claims.

Advisory: an empty result is reported with its coverage numbers and the work
continues.

## Elicitation

When the design subject is still an idea, interview before drafting: probe the constraints, failure modes, trust boundaries, and alternatives one question at a time, and distill the answers into the spec. Where an interview-driven skill is available in the session (e.g. superpowers' brainstorming/spec flow), use it as the elicitation engine; the distilled result lands here as the design doc. Generic architecture prose is a failure — the spec must be specific enough to disagree with.

**Upstream product lock.** For feature-level design, if there is no adequate `docs/requirements/` for the outcome (missing, unconfirmed close package, or conflicts with the ask), REQUIRED SUB-SKILL: use `cmk:requirements` before writing mechanism. Do not invent product success criteria inside the design doc to fill that gap.

## Workflow: Create

1. Normalize input into design context at the right level — system-wide architecture, sub-system/track design, or feature-level spec (see `references/design-conventions.md` § Design Levels). Confirm upstream requirements (and any close-package locks) before mechanism sections for feature-level work.
2. Shape the document per `references/design-guidance.md`, aligning to local convention if one exists.
3. **Write the card header.** A feature-level doc carries `**Capability:**`
   (the registry code), `**Owns:**` (backticked file and directory paths), and
   `**Declined:**` (pipe-separated, each entry naming the declined thing *and*
   its reason) beneath the standard header lines, per `cmk:capability-map`'s
   `references/registry-conventions.md`. `Declined` is the retrievable summary
   of `## Scope`'s out-of-scope narrative — the header is what a future spec
   author can read without opening this document. Where the subject has no
   registry row, REQUIRED SUB-SKILL: use `cmk:capability-map` (Workflow:
   Register) first; where no registry exists, skip the block.
4. Place at `docs/design/<topic>.md` — system-wide design may use `docs/design/system.md`; a multi-doc design tree gets a "read this tree" entry README.
5. Use glossary terms (see `cmk:glossary`) for every system, component, and actor name; define new terms there, not inline.
6. Mark unknowns in `Open Points` — don't guess.
7. Link the requirements doc it satisfies in `Links`. Where that doc carries IDed criteria, carry the mapping in both directions: a `Satisfies:` line on each component or section naming the IDs it answers for, and the reverse ID → component table in `## Acceptance Criteria`. The criterion's text stays in the requirements doc; the two directions must agree, and the mapping is what a later requirement change is traced through.
8. Set status to `draft`.

## Workflow: Iterate

1. Read the existing design doc in full.
2. **Upstream check:** read the linked doc in `docs/requirements/` and flag conflicts with scope or success criteria; check `docs/decisions/` for constraining decisions and flag conflicts rather than silently overriding. Where that doc carries IDed criteria, trace each changed ID through this doc's `## Acceptance Criteria` mapping to the sections that own it — the mapping is the trace path, not prose similarity.
3. **System conflict check (feature-scoped docs only):** if the `Scope:` header is narrower than system-wide, read the system-level design doc and flag any conflict with its architecture or components — surface it, never silently override system design from a feature doc.
4. **Card header check:** when the change adds or removes owned paths, or
   declines something new, update `**Owns:**` and `**Declined:**` in the same
   change and amend the registry row's surface roots
   (`cmk:capability-map`, Workflow: Amend). A declined item recorded only in
   prose is invisible to every future spec author.
5. **Downstream cascade:** a design change can invalidate sibling and lower-level design docs that reference the changed component — check inbound references and cascade or flag them in the same change.
6. Identify what changed and why.
7. Update affected sections in place. Preserve unchanged content.
8. Update `Last updated` date.
9. Transition status when appropriate: `draft` → `active` → `shipped`, or any → `deprecated`.

## Output

- Create: complete design doc at `docs/design/<topic>.md` with known context populated
- Iterate: targeted updates to affected sections only, cascaded to affected surfaces
- Unresolved decisions go in `Open Points`
- Design principles are opinionated and system-specific
- Mechanisms are specified independent of implementation language/framework; stack choices appear as constraints or rationale, not as the spec itself
- Architecture diagram matches component descriptions
- Feature-level docs carry `Capability`, `Owns`, and `Declined` header lines, and every declined entry carries its reason
- Neighbors were derived and reported before the first mechanism section, with coverage numbers
- Security section is always present for system-wide design — includes assumptions, gaps, and controls
- Feature-level docs map each IDed requirement to the component or section that satisfies it, without restating the criterion's text; where the requirements doc carries no IDs, they state the "done" definition in prose only where it isn't obvious from the requirement itself

## Links

Every design doc names the requirements it satisfies and the decisions that constrain it; progress-neutral, tracker-neutral wording.
