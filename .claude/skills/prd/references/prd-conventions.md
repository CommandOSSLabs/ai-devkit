# PRD Conventions

## Canonical Placement

- PRD entry: `docs/prd.md`
- One PRD per repository (project-level product requirements)

## Status Lifecycle

- `draft` — being written, not yet agreed upon
- `active` — agreed upon, work in progress
- `decomposed` — broken into feature specs, no longer the active working doc
- `shipped` — all downstream specs shipped
- `deprecated` — initiative abandoned

## Scope Boundary

- PRDs own the product/business "what and why"
- Technical architecture belongs in `docs/system-design.md`
- Implementation detail belongs in `docs/specs/{NNNN}-{feature-name}/spec.md`

## Usage

1. Start from `references/prd-template.md`.
2. Populate known context first; leave unknowns in `Open Points`.
3. Keep `docs/prd.md` current as the product source of truth.
4. Link downstream feature specs in `Related Documents > Downstream Specs` as they are created.
