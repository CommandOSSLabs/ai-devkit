# Templates

## What
Baseline document templates shipped under `docs/templates/`. They are the rendered shape that the doc-generating skills (`cmk:requirements`, `cmk:design`, `cmk:adr`) target. For ADRs the skill also carries its own record-shape snippet (`skills/adr/references/adr-template.md`); for requirements and design the skills carry shaping *guidance* files (`references/requirements-guidance.md`, `references/design-guidance.md`) rather than fixed forms — the scaffold template is the baseline shape, the guidance decides how each document earns its sections.

## Where
- Requirements template: `docs/templates/requirements.md` — produced by [`cmk:requirements`](../skills/requirements.md); opens with `Status:` / `Owner:` / `Last updated:` headers, sections are a menu, not a form.
- Design template: `docs/templates/design.md` — produced by [`cmk:design`](../skills/design.md); same headers; one template covers system-wide and feature-level scope, selected via the `Scope:` header, and frames the doc as an implementation-agnostic spec.
- ADR template: `docs/templates/adr.md` — produced by [`cmk:adr`](../skills/adr.md), rendered into `docs/decisions/`; uses the record shape `# NNNN — [short title]` with `- **Status**: Proposed | Accepted | Superseded by NNNN` and `- **Date**:` lines, then Context / Decision / Consequences (no `Last updated:` header — ADRs are superseded, not edited).

Requirements and design templates use HTML comments as section guidance; grep for `^**Status:**` to spot-check those two, and for `^# NNNN` in the ADR template.
