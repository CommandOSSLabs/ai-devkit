---
name: cmk:adr
description: Create or update architecture decision records for system-level technical choices. Use whenever users need to record, revise, or replace ADR decisions with clear trade-offs.
metadata:
  sdl_phase: "1"
  domain: "adr"
---

# ADR

Use this skill for:
- Creating a new ADR from decision discussions
- Updating an existing ADR when the decision evolves

## Canonical References

- ADR conventions: `references/adr-conventions.md`
- ADR template: `references/adr-template.md`

## Content Guidance

Write what matters, skip what's obvious. The template is a starting point — adapt it to fit the context.

## Decision Scope Rule

Use ADRs only for system-level decisions that affect multiple features or core architecture.
For feature-scoped decisions, keep them in the feature `spec.md` under Technical Decisions.

## Workflow: Create

Use when no ADR exists for the decision.

1. Gather decision context from conversation/docs/links.
2. Validate that decision scope is system-wide.
3. Apply canonical placement:
   - Use the repository's existing canonical ADR path when available.
   - Fallback path when no local convention exists: `docs/adrs/{NNNN}-{decision-title}.md`
4. Fill template fields from `references/adr-template.md` (or local repository ADR template when present).
5. Set status to `proposed`.

## Workflow: Iterate

Use when a decision has changed and the existing ADR needs to reflect the current state.

1. Read the existing ADR in full before making changes.
2. **Upstream check:** If `docs/system-design.md` exists, check whether the revised decision conflicts with current architecture. Warn the user if so.
3. Identify what changed and why — new constraints, better alternatives discovered, lessons from implementation.
4. Update the ADR in place:
   - **Revise Chose and Rationale** — reflect the current decision and why it shifted
   - **Update Alternatives** — add newly considered options or remove irrelevant ones
   - **Update Consequences** — revise based on actual impact observed
   - **Note what changed** — add a brief note in rationale explaining what shifted from the prior decision
5. Update `Last updated` date.
6. Transition status when appropriate:
   - `proposed` → `accepted` when the team agrees
   - `accepted` stays `accepted` when the decision evolves but remains active

## Quality Checklist

- Decision statement is clear and implementable
- Alternatives are explicit and meaningful
- Trade-offs are concrete (cost, complexity, risk, performance)
- If decision changed, rationale explains what shifted

## Output Contract

- If creating: produce a complete ADR file using canonical naming
- If iterating: update the ADR in place with current decision and rationale
