# Skills

The nine `cmk:*` skill packages under [`skills/`](../../../skills/). Each is a directory with a `SKILL.md` (frontmatter `name`/`description`/`version` plus the body the agent reads), and most ship a `references/` folder of templates and conventions the workflow loads on demand.

Every skill follows the same shape: a "Workflow: Create" / "Workflow: Iterate" pair, with placement rules and templates kept out of `SKILL.md` itself and cited via "Read `references/<file>.md>`" lines.

## Skills in this repo

- [adr.md](./adr.md) — `cmk:adr`, architecture decision records.
- [codebase-docs.md](./codebase-docs.md) — `cmk:codebase-docs`, this very skill — `docs/ai/` navigation tree.
- [docs.md](./docs.md) — `cmk:docs`, scaffolds/maintains the `/docs` directory itself.
- [feature-spec.md](./feature-spec.md) — `cmk:feature-spec`, per-feature specifications.
- [learn.md](./learn.md) — `cmk:learn`, captures non-obvious knowledge into `docs/knowledge/`.
- [prd.md](./prd.md) — `cmk:prd`, product requirements documents.
- [rule.md](./rule.md) — `cmk:rule`, codifies engineering standards into `docs/rules/`.
- [system-design.md](./system-design.md) — `cmk:system-design`, system architecture document.
- [worktree-dev-env.md](./worktree-dev-env.md) — `cmk:worktree-dev-env`, worktree-isolated local dev environments.

## Cross-cutting

- [conventions.md](./conventions.md) — shared shape across all skills (frontmatter, references folder, create/iterate workflow pattern).
