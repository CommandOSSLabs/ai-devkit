# System Design Template (Portable Baseline)

Use these sections in order unless the target repository has a stronger local convention.

## 1) Mission

- 2-4 sentences: what the system does, who it serves, why it exists.

## 2) Design Principles

- Opinionated, system-specific principles that break ties.
- Each: principle and why it matters for this system.

## 3) Tech Stack

- Table: Layer | Technology | Notes (version or constraints).

## 4) Architecture

- Components, boundaries, communication patterns.
- Include a diagram (Mermaid or equivalent).
- Per component: what it owns, exposes, and depends on.

## 5) External Dependencies

- Third-party services and APIs.
- For each: purpose and failure behavior.

## 6) Cross-Cutting Concerns

Only include subsections with something non-obvious to say:
- Security: assumptions, known gaps and risks, notable controls.
- Data Architecture (optional): data flow, storage, domain boundaries, lifecycle.
- Observability (optional): non-standard setup or notable gaps.
- Performance and Scalability (optional): hard targets, bottlenecks, scaling limits.
- Error Handling and Resilience (optional): architecture-level patterns.

## 7) Constraints

- Givens that shape the architecture and are not open for debate.

## 8) Architecture Rationale (Optional)

- Why the system is shaped this way; connects ADRs into a narrative.

## 9) Open Points (Optional)

- Unresolved architecture decisions with context and options.

## 10) Related Documents (Optional)

- Links to PRD, codebase summary, rules, ADRs.
