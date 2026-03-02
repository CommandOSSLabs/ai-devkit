---
name: adr-workflow
description: Create or update architecture decision records for system-level technical choices. Use whenever users need to record, revise status, or supersede ADR decisions with clear trade-offs.
metadata:
  sdl_phase: "1"
  domain: "adr"
---

# ADR Workflow

Use this skill for:
- Creating a new ADR from decision discussions
- Updating ADR status and supersession history

## Canonical References

- Phase 1 baseline: `references/phase1-scope.md`
- ADR conventions: `references/adr-conventions.md`
- ADR template: `references/adr-template.md`

## Decision Scope Rule

Use ADRs only for system-level decisions that affect multiple features or core architecture.
For feature-scoped decisions, keep them in the feature `spec.md` under Technical Decisions.

## Workflow

1. Gather decision context from conversation/docs/links.
2. Validate that decision scope is system-wide.
3. Apply canonical placement:
   - New ADR: use the repository's existing canonical ADR path when available.
   - Fallback path when no local convention exists: `docs/adrs/{NNNN}-{decision-title}.md`
4. Fill template fields from `references/adr-template.md` (or local repository ADR template when present):
   - Status
   - Date
   - Chose
   - Rationale
5. Enforce ADR immutability guidance:
   - Avoid rewriting accepted ADR intent as a new decision
   - Create a new ADR to supersede prior accepted decisions

## Quality Checklist

- Decision statement is clear and implementable
- Alternatives are explicit and meaningful
- Trade-offs are concrete (cost, complexity, risk, performance)
- Supersession is linked when replacing a prior decision

## Output Contract

- If creating: produce a complete ADR file using canonical naming
- If updating: preserve historical integrity and show explicit status transitions
