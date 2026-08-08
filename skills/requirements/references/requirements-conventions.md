# Requirements Conventions

## Canonical Placement

- Requirements entry: `docs/requirements/<topic>.md`
- One file per product area or feature; `docs/requirements/README.md` indexes them

## Status Lifecycle

- `draft` — being written, not yet agreed upon
- `active` — agreed upon, work in progress
- `decomposed` — broken into feature-level design docs, no longer the active working doc
- `shipped` — all downstream design docs shipped
- `deprecated` — initiative abandoned

## Scope Boundary

- Requirements documents own the product/business "what and why"
- Technical architecture belongs in `docs/design/`
- Implementation detail belongs in the design doc's feature-level variant

## Usage

1. Start from `references/requirements-template.md`.
2. Populate known context first; leave unknowns in `Open Points`.
3. Keep the requirements doc current as the product source of truth for its area.
4. Link downstream design docs in `Related Documents > Downstream Design` as they are created.
