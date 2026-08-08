# Design: <topic>

**Status:** draft | active | shipped | deprecated
**Owner:** @[handle]
**Last updated:** YYYY-MM-DD
**Scope:** System-wide or feature-level — state which

<!-- Captures the technical "how": architecture, tech stack, components, cross-cutting concerns, or feature-level implementation detail. -->

## Mission

<!-- What the system or feature does, who it serves, why it exists. -->

## Design Principles

<!-- Opinionated principles that break ties between valid approaches. Not generic truisms. -->

- [Principle] — [why it matters for this system]

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Runtime | [e.g. Node.js 20] | [version or constraints] |
| Language | [e.g. TypeScript] | [strictness, conventions] |
| Data | [e.g. PostgreSQL 16] | [primary use case] |
| Infra | [e.g. Docker, Railway] | [deployment context] |

## Architecture

<!-- Components, boundaries, and how they communicate. -->

```mermaid
graph TD
  A[Component A] --> B[Component B]
  B --> C[Component C]
```

### [Component Name]

<!-- What it owns, exposes, and depends on. -->

## External Dependencies

<!-- Third-party services and APIs: purpose and failure behavior. -->

- [Service/API] — [purpose and failure behavior]

## Acceptance Criteria (Feature-Level Docs Only)

<!-- Functional and non-functional requirements for this feature. Each can be a one-liner or expanded with context, edge cases, and acceptance criteria — include acceptance criteria when the "done" definition isn't obvious from the requirement itself. -->

- [Requirement] — [acceptance criteria]

## Cross-Cutting Concerns

### Security

<!-- What the system trusts, where it is exposed, what gaps exist, what the plan is. -->

#### Assumptions

- [Assumption] — [what breaks if wrong]

#### Known Gaps and Risks

| Gap | Severity | Impact | Root Cause | Mitigation / Acceptance |
|---|---|---|---|---|
| [e.g. No rate limiting on public API] | high | DoS risk on auth service | Not yet implemented | Planned for v1.1; WAF provides partial coverage |

#### Controls

- [Control] — [what it protects and how]

### Data Architecture (Optional)

### Observability (Optional)

### Performance and Scalability (Optional)

### Error Handling and Resilience (Optional)

## Constraints

<!-- Givens that shape the architecture. -->

- [Constraint] — [how it shapes the architecture]

## Architecture Rationale (Optional)

<!-- Why the system is shaped this way. Connects decisions into a narrative. -->

## Open Points (Optional)

<!-- Unresolved design decisions. -->

- [Question] — context and options being considered

## Related Documents (Optional)

- [Codebase Docs](../ai/) — AI-navigable map of the repo
- [Rules](../rules/README.md) — engineering standards

## Links

- Requirements: [docs/requirements/<topic>.md](../requirements/) — what this design satisfies
- Decisions: [docs/decisions/](../decisions/) — recorded constraints this design honors
