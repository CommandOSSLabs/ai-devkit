# Design Conventions

## Canonical Placement

- Design entry: `docs/design/<topic>.md`
- System-wide design: `docs/design/system.md`
- Feature-level design: one file per feature, `docs/design/<topic>.md`

## Status Lifecycle

- `draft` — being written, not yet agreed upon
- `active` — agreed upon, implementation in progress
- `shipped` — design is in production
- `deprecated` — design is decommissioned

## Scope Boundary

- Design owns the technical "how" — system-wide architecture and
  feature-level implementation detail live in the same doc family
- Product requirements belong in `docs/requirements/`
- System-wide decisions that are costly to reverse belong in
  `docs/decisions/`

## Feature-Level Guidance

- A feature-level design doc uses the same template, scoped to one feature.
- Requirements are concrete and evaluable (functional and non-functional);
  include acceptance criteria when the "done" definition isn't obvious from
  the requirement itself.
- Flows include success and failure paths.
- Boundaries state what the feature owns and does not own, and its adjacent
  integration points.

## Document Principle

- Only document what is non-obvious, surprising, or load-bearing
- Skip anything a competent engineer would infer from the code itself
- Remove empty optional sections rather than leaving placeholders

## Usage

1. Start from `references/design-template.md`.
2. Populate known context first; leave unknowns in `Open Points`.
3. Keep `docs/design/<topic>.md` current as the design source of truth for
   its area.
4. Link the requirements it satisfies and the decisions that constrain it in
   `Links`.
