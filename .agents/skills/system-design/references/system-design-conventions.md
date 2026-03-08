# System Design Conventions

## Canonical Placement

- System design entry: `docs/system-design.md`
- One system design per repository (project-level architecture)

## Status Lifecycle

- `draft` — being written, not yet agreed upon
- `active` — agreed upon, implementation in progress
- `shipped` — system is in production
- `deprecated` — system is decommissioned

## Scope Boundary

- System design owns the technical "how" at architecture level
- Product requirements belong in `docs/prd.md`
- Feature implementation detail belongs in `docs/specs/{NNNN}-{feature-name}/spec.md`
- System-wide decisions should be recorded as ADRs in `docs/adrs/`

## Document Principle

- Only document what is non-obvious, surprising, or load-bearing
- Skip anything a competent engineer would infer from the code itself
- Remove empty optional sections rather than leaving placeholders

## Usage

1. Start from `references/system-design-template.md`.
2. Populate known context first; leave unknowns in `Open Points`.
3. Keep `docs/system-design.md` current as the architecture source of truth.
4. Link upstream PRD and downstream specs in `Related Documents`.
