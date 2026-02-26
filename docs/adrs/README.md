# Architecture Decision Records

This directory contains system-wide architecture decisions for this repository.

## Canonical Placement

- ADR template: [`docs/templates/adr.md`](../templates/adr.md)
- ADR entry: `docs/adrs/{NNNN}-{decision-title}.md`
- Example: `docs/adrs/0001-initial-architecture-decision.md`

## File Convention

- Use one file per decision in `docs/adrs/`
- Example file: `0001-initial-architecture-decision.md`
- Keep accepted ADRs immutable; create a new ADR for superseding decisions

## How to Use

1. Copy [`docs/templates/adr.md`](../templates/adr.md) and create `docs/adrs/{NNNN}-{decision-title}.md`.
2. Fill context, choice, and rationale.
