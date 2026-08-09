# Requirements Conventions

## Canonical Placement

- Requirements entry: `docs/requirements/<topic>.md`
- One file per product area or feature; `docs/requirements/README.md` indexes them
- A large product uses a concise entry-point doc plus per-area files
  (`docs/requirements/<product>/<area>.md`), so readers load only what a task
  needs
- The shared glossary lives beside them (see `cmk:glossary`)

## Status Lifecycle

- `draft` — being written, not yet agreed upon
- `active` — agreed upon, work in progress
- `decomposed` — broken into feature-level design docs, no longer the active working doc
- `shipped` — all downstream design docs shipped
- `deprecated` — initiative abandoned

## Scope Boundary

- Requirements documents own the product "what and why" — including technical
  guarantees when the product is technical
- Architecture and mechanism belong in `docs/design/`
- Implementation detail belongs in the design doc's feature-level variant

## Usage

1. Shape the document per `references/requirements-guidance.md` — a
   directive, not a fixed form.
2. Populate known context first; leave unknowns in `Open Points`.
3. Keep the requirements doc current as the product source of truth for its area.
4. Link downstream design docs as they are created, and cascade requirement
   changes to them.
