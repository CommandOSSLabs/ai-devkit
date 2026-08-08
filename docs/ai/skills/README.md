# Skills

The fifteen `cmk:*` skill packages under [`skills/`](../../../skills/): seven docs-family skills plus eight setup-family skills. Each is a directory with a `SKILL.md` (frontmatter `name`/`description`/`version` plus the body the agent reads), and most ship a `references/` folder of templates and conventions the workflow loads on demand.

Docs-family skills follow the same shape: a "Workflow: Create" / "Workflow: Iterate" pair, with placement rules and templates kept out of `SKILL.md` itself and cited via "Read `references/<file>.md`" lines. Setup-family skills instead follow a facet shape (modes and/or a single workflow, plus a report-only `## Verify` section). See [conventions.md](./conventions.md) for the exceptions and the full breakdown.

## Docs family

- [adr.md](./adr.md) — `cmk:adr`, architecture decision records into `docs/decisions/`.
- [codebase-docs.md](./codebase-docs.md) — `cmk:codebase-docs`, this very skill — `docs/ai/` navigation tree.
- [design.md](./design.md) — `cmk:design`, system-wide and feature-level design docs.
- [docs.md](./docs.md) — `cmk:docs`, scaffolds/maintains the `/docs` directory itself.
- [learn.md](./learn.md) — `cmk:learn`, captures non-obvious knowledge into `docs/knowledge/`.
- [requirements.md](./requirements.md) — `cmk:requirements`, product requirements documents.
- [rule.md](./rule.md) — `cmk:rule`, codifies engineering standards into `docs/rules/`.

## Setup family

- [project-layout.md](./project-layout.md) — `cmk:project-layout`, role-first monorepo layout and package placement.
- [toolchain.md](./toolchain.md) — `cmk:toolchain`, tool-role assignment, runtime pins, gitignore baseline.
- [agent-instructions.md](./agent-instructions.md) — `cmk:agent-instructions`, thin root instruction file backed by `docs/rules/`.
- [mcp-config.md](./mcp-config.md) — `cmk:mcp-config`, checked-in, per-vendor MCP server configuration.
- [local-stack.md](./local-stack.md) — `cmk:local-stack`, worktree-isolated local development stacks.
- [infra.md](./infra.md) — `cmk:infra`, infrastructure-as-code packages and environment boundaries.
- [cicd.md](./cicd.md) — `cmk:cicd`, CI, deployment, and policy automation around GitHub Actions.
- [repo-setup.md](./repo-setup.md) — `cmk:repo-setup`, orchestrates every setup facet into one pass.

## Cross-cutting

- [conventions.md](./conventions.md) — shared shape across all skills (frontmatter, references folder, docs-family create/iterate pattern, setup-family facet shape).
