# [Product/Feature Name] — PRD

**Status:** draft | active | decomposed | shipped | deprecated
**Owner:** @[handle]
**Last updated:** YYYY-MM-DD

<!-- Captures the product/business "what and why" before technical design begins. -->

## Problem

<!--
Who has the problem, what it costs them, and how they cope today.
Be specific about the user segment and the pain — vague problems produce vague solutions.
-->

## Why Now

<!-- What changed (market, technical, business) that makes this the right time to solve this. -->

## Success Criteria

<!-- Measurable outcomes. If you can't measure it, you can't know if you shipped it. -->

| Metric | Target | Measurement Method |
|---|---|---|
| [e.g. Support ticket volume for X] | [e.g. -30% within 90 days] | [e.g. Zendesk tag filter] |

## User Needs and Scenarios

<!--
Core user needs with 1-2 concrete scenarios each.
Scenarios ground abstract needs in real usage — skip formal user-story syntax.
-->

### [Need]

<!-- What the user needs and why it matters. -->

**Scenario:** [Concrete example of a user encountering this need and the expected outcome.]

## Scope

### In Scope

- [What this PRD covers]

### Out of Scope

- [What is excluded] — [rationale]

## Risks and Assumptions (Optional)

### Risks

<!-- Product-level risks, not technical architecture risks (those belong in system-design). -->

| Risk | Likelihood | Impact | Why It Exists | Mitigation |
|---|---|---|---|---|
| [e.g. Low adoption due to workflow change] | medium | high | Requires behavior change from existing users | Gradual rollout with onboarding flow |

### Assumptions

<!-- State assumptions explicitly. Each should answer: what breaks if this is wrong? -->

- [Assumption] — [what breaks if wrong]

## Constraints (Optional)

<!-- Business, regulatory, or timeline givens that are not open for debate. -->

- [Constraint] — [how it shapes the product]

## Open Points (Optional)

<!-- Unresolved product decisions. Move to relevant sections when resolved. -->

- [Question] — context and options being considered

## Related Documents (Optional)

- [System Design](../system-design.md) — technical architecture
- [Codebase Summary](../codebase-summary.md) — repository layout

### Downstream Specs

<!-- Feature specs that implement parts of this PRD. Update as specs are created. -->

- [Spec name](../specs/NNNN-feature-name/spec.md) — what it covers
