# /docs scaffold

This area covers the `/docs` directory in this repo — both the live structure under [`docs/`](../../../docs/) and the file-manifest scaffold the [`cmk:docs`](../skills/docs.md) skill writes into other repositories.

The structure itself, plus baseline READMEs and templates, is documented as **content** (it is the product this repo ships) rather than as code. For the canonical structure and its conventions see [`docs/README.md`](../../../docs/README.md); every subdirectory carries its own `README.md` and nothing else routes agents.

## Areas

- [scaffold-manifest.md](./scaffold-manifest.md) — the canonical file list `cmk:docs` provisions, and where it lives.
- [templates.md](./templates.md) — baseline templates this repo ships under `docs/templates/`.
- [rules.md](./rules.md) — the engineering rules tree under `docs/rules/`.

## Populated directories in this repo

Most taxonomy directories ship as README-only scaffolding. The exceptions:

- `docs/rules/common/` — the live baseline rules (see [rules.md](./rules.md)).
- `docs/templates/` — the baseline templates (see [templates.md](./templates.md)).
- [`docs/design/sdl-phases.md`](../../design/sdl-phases.md) — the development lifecycle the `cmk:*` skills are shaped around, and which phase produces which document.
- `docs/reports/` — dated point-in-time records of this repo's own validation runs (see [`docs/reports/`](../../../docs/reports/)).
