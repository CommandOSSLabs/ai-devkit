---
name: cmk:requirements
description: This skill should be used when the user asks to "save this as requirements", "let's define what we're building", "draft requirements", "draft a PRD", "update the requirements", or discusses product scope, success criteria, and user needs. Covers drafting, refining, or updating requirements documents under docs/requirements/ — product-wide or per-feature — from conversation notes, research, user feedback, external docs, or direct instructions.
version: 0.2.0
---

# Requirements

Create or iterate requirements documents (PRD). Requirements documents capture product/business "what and why." Technical architecture belongs in design; implementation detail lives in the design doc's feature-level variant.

## References

Read `references/requirements-conventions.md` for placement rules and `references/requirements-template.md` for section structure.

## Input

Synthesize from whatever the user provides: conversation context, user research, local docs, external links (Notion, Google Docs), direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Workflow: Create

1. Normalize input into product context: problem, timing, success criteria, user needs, scope.
2. Map into template sections from `references/requirements-template.md`. Align to local convention if one exists.
3. Place at `docs/requirements/<topic>.md` — one file per product area or feature; `docs/requirements/README.md` indexes them.
4. Mark unknowns in `Open Points` — don't guess.
5. Set status to `draft`.

## Workflow: Iterate

1. Read the existing requirements document in full.
2. Identify what changed and why.
3. Update affected sections in place. Preserve unchanged content.
4. Update `Last updated` date.
5. Transition status when appropriate: `draft` → `active` → `decomposed` → `shipped`, or any → `deprecated`.

## Output

- Create: complete requirements document at `docs/requirements/<topic>.md` with known context populated
- Iterate: targeted updates to affected sections only
- Unresolved decisions go in `Open Points`
- Problem names a specific user segment with concrete pain
- Success criteria are measurable with targets
- No technical architecture detail

## Links

Every requirements doc lists downstream links to the `docs/design/` docs that implement it, once they exist. Wording stays progress-neutral and tracker-neutral.
