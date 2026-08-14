# Requirements: <topic>

**Status:** draft | active | decomposed | shipped | deprecated
**Owner:** @[handle]
**Last updated:** YYYY-MM-DD
**Notation:** ears | rfc2119
**ID prefix:** [2-12 chars, A-Z0-9, starts with a letter — e.g. BILL, AUTH, WIRE]

<!-- Captures the product/business "what and why" before technical design begins. -->
<!-- Notation and ID prefix are REQUIRED and are set once, before the first criterion.
     See requirements-guidance.md § Acceptance criteria for the two notations and
     how to choose between them. -->

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
Scenarios ground abstract needs in real usage — they stay prose, not formal
user-story syntax. The checkable statements live in Acceptance Criteria below.
-->

### [Need]

<!-- What the user needs and why it matters. -->

**Scenario:** [Concrete example of a user encountering this need and the expected outcome.]

## Acceptance Criteria

<!--
REQUIRED. Criteria follow requirements-guidance.md § What one criterion is, in
the notation named in the header. A criterion that needs "and" is usually two.

Group criteria under the need they serve; the first number is that group.
-->

### [Need above, repeated as a group heading]

- **[PREFIX]-1.1** [one statement in this document's notation]
- **[PREFIX]-1.2** [one statement in this document's notation]

## Scope

### In Scope

- [What this requirements doc covers]

### Out of Scope

- [What is excluded] — [rationale]

## Risks and Assumptions (Optional)

### Risks

<!-- Product-level risks, not technical architecture risks (those belong in design). -->

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

- [Codebase Docs](../ai/) — AI-navigable map of the repo

### Downstream Design

<!-- Design docs that implement parts of this requirements doc. Update as they are created. -->

- [Design name](../design/<topic>.md) — what it covers

## Links

- Design: [docs/design/<topic>.md](../design/) — how this is built (add when it exists)
- Decisions: constraints from [docs/decisions/](../decisions/) that shape scope
