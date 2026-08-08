# Skills

The eight `cmk:*` skill packages under [`skills/`](../../../skills/). Each is a directory with a `SKILL.md` (frontmatter `name`/`description`/`version` plus the body the agent reads), and most ship a `references/` folder of templates and conventions the workflow loads on demand.

Every skill follows the same shape: a "Workflow: Create" / "Workflow: Iterate" pair, with placement rules and templates kept out of `SKILL.md` itself and cited via "Read `references/<file>.md`" lines.

## Skills in this repo

- [adr.md](./adr.md) — `cmk:adr`, architecture decision records into `docs/decisions/`.
- [codebase-docs.md](./codebase-docs.md) — `cmk:codebase-docs`, this very skill — `docs/ai/` navigation tree.
- [design.md](./design.md) — `cmk:design`, system-wide and feature-level design docs.
- [docs.md](./docs.md) — `cmk:docs`, scaffolds/maintains the `/docs` directory itself.
- [learn.md](./learn.md) — `cmk:learn`, captures non-obvious knowledge into `docs/knowledge/`.
- [requirements.md](./requirements.md) — `cmk:requirements`, product requirements documents.
- [rule.md](./rule.md) — `cmk:rule`, codifies engineering standards into `docs/rules/`.
- [worktree-dev-env.md](./worktree-dev-env.md) — `cmk:worktree-dev-env`, worktree-isolated local dev environments.

## Cross-cutting

- [conventions.md](./conventions.md) — shared shape across all skills (frontmatter, references folder, create/iterate workflow pattern).
