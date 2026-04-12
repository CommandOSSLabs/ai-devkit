---
name: cmk:feature-spec
description: This skill should be used when the user asks to "spec out this feature", "write up the requirements for X", "break this into a spec", "create a feature spec", "update the spec", or discusses feature scope, flows, and acceptance criteria. Covers drafting, refining, or updating feature specifications from conversation notes, local docs, external links, or direct prompts.
version: 0.1.0
---

# Feature Spec

Create or iterate feature specifications that capture implementation-level detail for a single feature. Product requirements belong in the PRD; architecture in system-design. Feature-scoped decisions stay here; system-wide decisions go in ADRs.

## References

Read `references/spec-conventions.md` for placement rules and `references/feature-spec-template.md` for section structure.

## Input

Synthesize from whatever the user provides: conversation context, local docs, external links, direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Workflow: Create

1. Normalize input into feature context: problem, users, constraints, open questions.
2. Map into template sections from `references/feature-spec-template.md`. Align to local convention if one exists.
3. Place at the repository's existing path, or fallback: `docs/specs/{NNNN}-{feature-name}/spec.md`. Determine `{NNNN}` by scanning existing specs and incrementing (start at `0001` if none exist).
4. Mark unknowns in `Open Points` — don't guess.
5. Set status to `draft`.

## Workflow: Iterate

1. Read the existing spec in full.
2. **Upstream check:** If upstream docs exist (`docs/PRD.md`, `docs/system-design.md`), scan for conflicts. Warn the user if the update contradicts upstream scope, requirements, or architecture.
3. Identify what changed and why.
4. Update affected sections in place. Preserve unchanged content.
5. Update `Last updated` date.
6. Transition status when appropriate: `draft` → `active` → `shipped`, or any → `deprecated`.

## Output

- Create: complete `spec.md` at canonical path
- Iterate: targeted updates to affected sections only
- Unresolved decisions go in `Open Points`
- Requirements are concrete and evaluable (FR and NFR)
- Flows include success and failure paths
- Boundaries clearly define owns vs does-not-own
