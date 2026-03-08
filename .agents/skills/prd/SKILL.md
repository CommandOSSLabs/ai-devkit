---
name: cmk:prd
description: Create or iterate product requirements documents. Use whenever users ask to draft, refine, or update a PRD from conversation notes, research, user feedback, or direct prompts.
metadata:
  sdl_phase: "1"
  domain: "prd"
---

# PRD

Use this skill for:
- Creating a new product requirements document
- Iterating an existing PRD

## Canonical References

- PRD conventions: `references/prd-conventions.md`
- PRD template: `references/prd-template.md`

## Supported Input Sources

Collect and synthesize from one or more of:
- Current conversation context and decisions
- User research, feedback, or support data
- Local documents (existing PRDs, specs, notes)
- External docs/links (Notion, Google Docs, product briefs)
- Direct prompt requirements from the engineer or PM

## Content Guidance

Write what matters, skip what's obvious. The template is a starting point — adapt it to fit the context.

## Scope Rule

PRDs capture the product/business "what and why." Keep technical architecture in system-design and implementation detail in feature specs.

## Workflow: Create

Use when no PRD exists.

1. Normalize input into product context:
   - Who has the problem and what it costs them
   - Why this is the right time to solve it
   - What success looks like (measurable)
   - Core user needs with concrete scenarios
   - What is in and out of scope
2. Map normalized input into template sections in `references/prd-template.md`.
   - If the target repository already has an existing PRD convention, align to that local standard.
3. Apply canonical placement:
   - Use the repository's existing PRD path when available.
   - Fallback path when no local convention exists: `docs/prd.md`
4. Mark unknowns in `Open Points` rather than guessing.
5. Set status to `draft`.

## Workflow: Iterate

Use when a PRD already exists and needs to evolve.

1. Read the existing PRD in full before making changes.
2. Identify what changed and why — from user feedback, scope decisions, market shifts, or resolved questions.
3. Apply changes to the relevant sections:
   - **Revise Problem or Why Now** — rewrite when the understanding of the problem or timing shifts
   - **Update Success Criteria** — add, remove, or adjust metrics and targets
   - **Add/revise User Needs** — add new needs with scenarios, revise existing ones after user feedback
   - **Adjust Scope** — move items between in-scope and out-of-scope with rationale
   - **Update Risks and Assumptions** — add new risks, revise likelihood/impact, mark mitigated risks
   - **Resolve Open Points** — when a product decision is made, move the outcome into the relevant section and remove from Open Points
   - **Update Downstream Specs** — link new feature specs as they are created from this PRD
4. Preserve content that is still valid — do not rewrite sections that haven't changed.
5. Update `Last updated` date.
6. Transition status when appropriate:
   - `draft` → `active` when the PRD is agreed upon and work begins
   - `active` → `decomposed` when broken into feature specs (PRD is no longer the active working doc)
   - `decomposed` → `shipped` when all downstream specs are shipped
   - Any → `deprecated` when the initiative is abandoned

## Quality Checklist

- Problem names a specific user segment and articulates concrete pain
- Success Criteria has measurable metrics with targets and measurement methods
- User Needs include concrete scenarios, not abstract statements
- Scope has explicit out-of-scope items with rationale
- Open Points only contains genuinely unresolved decisions
- No technical architecture detail (that belongs in system-design)

## Output Contract

- If creating: produce a complete PRD populated with known context at `docs/prd.md`
- If iterating: apply targeted updates to affected sections while preserving valid existing content
- Always call out unresolved decisions in `Open Points`
- Always update `Last updated` date when iterating
