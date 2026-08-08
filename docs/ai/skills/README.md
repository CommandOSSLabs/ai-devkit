# Skills

The twenty-five `cmk:*` skill packages under [`skills/`](../../../skills/): seven docs-family skills, eight setup-family skills, eight delivery-family skills, and two knowledge-family skills. Each is a directory with a `SKILL.md` (frontmatter `name`/`description`/`version` plus the body the agent reads), and most ship a `references/` folder of templates and conventions the workflow loads on demand.

Docs-family skills follow the same shape: a "Workflow: Create" / "Workflow: Iterate" pair, with placement rules and templates kept out of `SKILL.md` itself and cited via "Read `references/<file>.md`" lines. Setup-family skills instead follow a facet shape (modes and/or a single workflow, plus a report-only `## Verify` section). Delivery-family skills follow a tracker-neutral phase/gate shape and never carry a `## Verify` section — that contract is setup-family only. Knowledge-family skills are reference packs with no create/iterate or phase shape at all. See [conventions.md](./conventions.md) for the exceptions and the full breakdown.

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

## Delivery family

- [delivery-workflow.md](./delivery-workflow.md) — `cmk:delivery-workflow`, the tracker-neutral contract every delivery skill operates inside.
- [discover-efforts.md](./discover-efforts.md) — `cmk:discover-efforts`, reconciles an uncertain body of work into a tracker issue set.
- [delivery-intake.md](./delivery-intake.md) — `cmk:delivery-intake`, context intake, branch/worktree setup, phase 1.
- [delivery-spec-plan.md](./delivery-spec-plan.md) — `cmk:delivery-spec-plan`, spec and implementation plan, phase 2.
- [delivery-review.md](./delivery-review.md) — `cmk:delivery-review`, multi-lens review with evidence and disposition, phase 4.
- [delivery-ship.md](./delivery-ship.md) — `cmk:delivery-ship`, PR, verification evidence, tracker reconciliation, phase 5.
- [delivery-handoff.md](./delivery-handoff.md) — `cmk:delivery-handoff`, relay prompt for a different agent at any phase boundary.
- [delivery-pipeline.md](./delivery-pipeline.md) — `cmk:delivery-pipeline`, end-to-end orchestration across all five phases.

## Knowledge family

- [sui-sdk.md](./sui-sdk.md) — `cmk:sui-sdk`, gRPC-first guidance for talking to a Sui full node.
- [sui-devstack.md](./sui-devstack.md) — `cmk:sui-devstack`, worktree-safe local Sui network setup for development and tests.

## Cross-cutting

- [conventions.md](./conventions.md) — shared shape across all skills (frontmatter, references folder, docs-family create/iterate pattern, setup-family facet shape, delivery-family phase/gate shape, knowledge-family reference packs).
