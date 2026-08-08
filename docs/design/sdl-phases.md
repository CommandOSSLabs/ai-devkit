# SDL Phases

**Status:** active
**Owner:** ai-devkit maintainers
**Last updated:** 2026-08-08
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
- Any phase: `cmk:learn` writes non-obvious findings into `docs/knowledge/`;
  `cmk:rule` promotes them into `docs/rules/`

## Links

- Requirements: [`../requirements/`](../requirements/) — Phase 1 output
- Decisions: [`../decisions/`](../decisions/) — constraints this lifecycle honors
- Engineering rules: [`../rules/README.md`](../rules/README.md)
- Common baseline rules: [`../rules/common/README.md`](../rules/common/README.md)
