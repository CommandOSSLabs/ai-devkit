# SDL Phases

**Status:** active
**Owner:** ai-devkit maintainers
**Last updated:** 2026-09-06
**Scope:** System-wide — the development lifecycle the `cmk:*` skills are shaped around

This document defines the software development lifecycle (SDL) phases the
devkit's skills serve, and which document each phase produces.

## Phase 1: Requirements

**Goal:** capture the product/business "what and why" before technical design.

- Primary output: `docs/requirements/<topic>.md`
- Scope: problem, timing, success criteria, user needs, scope boundaries
- No technical architecture detail — that belongs to Phase 2

## Phase 2: Design

**Goal:** produce the technical "how" that becomes the source of truth for
implementation.

- Primary output: `docs/design/<topic>.md` — system-wide (`system.md`) or
  feature-level
- Upstream input: the requirements doc it satisfies
- Constraints: recorded decisions in `docs/decisions/`; a design that
  contradicts one means the decision is revisited, not silently overridden

## Phase 3: Planning

**Goal:** translate the design into an execution plan.

- Primary output: implementation plan with milestones, sequencing, and
  dependencies
- The plan maps directly back to the approved design doc

## Phase 4: Implementation

**Goal:** implement code according to the design and plan.

- Primary output: code changes and supporting documentation updates
- Keep implementation aligned with the latest design decisions

## Phase 5: Testing

**Goal:** verify behavior meets requirements and success criteria.

- Primary output: test evidence (automated tests, manual verification notes
  where needed)
- Validate both expected flows and critical failure paths

## Phase 6: Code Review

**Goal:** ensure quality, maintainability, and compliance with engineering
standards.

- Primary output: reviewed and approved change set
- Review focus: simplification opportunities, security practices, formatting,
  naming conventions, and overall code quality

## Skills per Phase

- Phase 1: `cmk:requirements` — `skills/requirements/SKILL.md`
- Phase 2: `cmk:design` — `skills/design/SKILL.md`; `cmk:adr` —
  `skills/adr/SKILL.md` for decisions that constrain it
- Before Phases 1 and 2, and again at review: `cmk:capability-map` —
  `skills/capability-map/SKILL.md` — derives which capabilities already own the
  surface and what they already declined. Advisory; an absent
  `docs/capabilities/INDEX.md` is a clean no-op.
- Phases 5–6 and before any ship claim: `cmk:trace-audit` —
  `skills/trace-audit/SKILL.md` — checks that requirement IDs, the designs that
  cite them, and the capability registry still agree. Errors block
  ship-readiness; warnings are reported.
- Any phase: `cmk:learn` writes non-obvious findings into `docs/knowledge/`;
  `cmk:rule` promotes them into `docs/rules/`; `cmk:glossary` keeps the
  shared vocabulary normative — it fires whenever a term is coined,
  contested, or drifting, in any phase, not on request alone

## Links

- Capability registry: [`../capabilities/INDEX.md`](../capabilities/INDEX.md) — which capability owns what
- Shared spec knowledge: [`spec-knowledge-sharing.md`](./spec-knowledge-sharing.md)
- Requirements: [`../requirements/`](../requirements/) — Phase 1 output
- Decisions: [`../decisions/`](../decisions/) — constraints this lifecycle honors
- Engineering rules: [`../rules/README.md`](../rules/README.md)
- Common baseline rules: [`../rules/common/README.md`](../rules/common/README.md)
