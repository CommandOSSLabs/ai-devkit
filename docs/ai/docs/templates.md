# Templates

## What
Baseline document templates shipped under `docs/templates/`. They are the rendered shape that the doc-generating skills (`cmk:prd`, `cmk:system-design`, `cmk:feature-spec`, `cmk:adr`) target — distinct from the per-skill template snippets under `skills/<name>/references/`, which are the inputs the skill reads when filling a new doc.

## Where
- PRD template: `docs/templates/PRD.md` — produced by [`cmk:prd`](../skills/prd.md).
- System design template: `docs/templates/system-design.md` — produced by [`cmk:system-design`](../skills/system-design.md).
- Feature spec template: `docs/templates/feature-spec.md` — produced by [`cmk:feature-spec`](../skills/feature-spec.md).
- ADR template: `docs/templates/adr.md` — produced by [`cmk:adr`](../skills/adr.md).

Each template uses `Status:`, `Owner:`, `Last updated:` headers and HTML comments as section guidance. Grep for `^**Status:**` to spot-check.
