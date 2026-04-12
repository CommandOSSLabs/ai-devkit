---
name: cmk:prd
description: This skill should be used when the user asks to "save this as requirements", "let's define what we're building", "draft a PRD", "update the PRD", or discusses product scope, success criteria, and user needs. Covers drafting, refining, or updating product requirements documents from conversation notes, research sessions, user feedback, Notion docs, or direct instructions.
version: 0.1.0
---

# PRD

Create or iterate product requirements documents. PRDs capture product/business "what and why." Technical architecture belongs in system-design; implementation detail in feature specs.

## References

Read `references/prd-conventions.md` for placement rules and `references/prd-template.md` for section structure.

## Input

Synthesize from whatever the user provides: conversation context, user research, local docs, external links (Notion, Google Docs), direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Workflow: Create

1. Normalize input into product context: problem, timing, success criteria, user needs, scope.
2. Map into template sections from `references/prd-template.md`. Align to local convention if one exists.
3. Place at the repository's existing PRD path, or fallback: `docs/PRD.md`.
4. Mark unknowns in `Open Points` — don't guess.
5. Set status to `draft`.

## Workflow: Iterate

1. Read the existing PRD in full.
2. Identify what changed and why.
3. Update affected sections in place. Preserve unchanged content.
4. Update `Last updated` date.
5. Transition status when appropriate: `draft` → `active` → `decomposed` → `shipped`, or any → `deprecated`.

## Output

- Create: complete PRD at `docs/PRD.md` with known context populated
- Iterate: targeted updates to affected sections only
- Unresolved decisions go in `Open Points`
- Problem names a specific user segment with concrete pain
- Success criteria are measurable with targets
- No technical architecture detail
