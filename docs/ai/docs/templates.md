# Templates

## What
Baseline document templates shipped under `docs/templates/`. They are the rendered shape that the doc-generating skills (`cmk:requirements`, `cmk:design`, `cmk:adr`) target — distinct from the per-skill template snippets under `skills/<name>/references/`, which are the inputs the skill reads when filling a new doc.

## Where
- Requirements template: `docs/templates/requirements.md` — produced by [`cmk:requirements`](../skills/requirements.md).
- Design template: `docs/templates/design.md` — produced by [`cmk:design`](../skills/design.md); one template covers both system-wide and feature-level scope, selected via the `Scope:` header.
- ADR template: `docs/templates/adr.md` — produced by [`cmk:adr`](../skills/adr.md), rendered into `docs/decisions/`.

Each template opens with `Status:` and `Last updated:` headers (plus `Owner:` on requirements and design) and uses HTML comments as section guidance. Grep for `^**Status:**` to spot-check.
