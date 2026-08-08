# Skill conventions

## What
Every skill under [`skills/`](../../../skills/) follows the same packaging shape — frontmatter, body, and an optional `references/` directory of templates and conventions cited by the body.

## Approach
Frontmatter declares three fields the host (Claude Code or OpenCode) reads to discover and trigger the skill:

- `name` — `cmk:<short-name>`, used as the slash command and skill ID.
- `description` — natural-language trigger phrases plus what the skill does. Used by the agent to auto-select the skill from user intent.
- `version` — `0.2.0` on most docs-taxonomy skills (`adr`, `docs`, `learn`, `requirements`) and on `cmk:local-stack`; `cmk:design` is `0.3.0` since its conflict-check revision; `0.1.0` on the rest.

Docs-family skills (`adr`, `design`, `docs`, `learn`, `requirements`, `rule`) mostly expose two phases — `Workflow: Create` and `Workflow: Iterate` — and offload long-form templates and placement rules into `references/*.md` so the SKILL body stays scannable. The `references/` files are loaded on demand via "Read `references/<file>.md`" lines.

Three docs-family skills break the create/iterate pattern: `cmk:learn` uses `Workflow: Extract` / `Workflow: Review`, `cmk:codebase-docs` uses `Bootstrap workflow` / `Update workflow`, and `cmk:docs` uses `Modes` (Init/Update/Verify) plus a single `Workflow`. `cmk:rule` adds a third phase, `Workflow: Promote`.

Setup-family skills (`agent-instructions`, `cicd`, `infra`, `local-stack`, `mcp-config`, `project-layout`, `repo-setup`, `toolchain`) don't follow create/iterate at all — each exposes `Modes` and/or a single `Workflow` for standing up or auditing its facet, and every one ends in a report-only `## Verify` section a caller (human or `cmk:repo-setup`) can run to assess whether a target repo satisfies the facet. Verify never mutates.

## Where
- Frontmatter, on every skill: open any `skills/<name>/SKILL.md` and read lines 1–5.
- Skills with `references/`: `skills/adr/`, `skills/agent-instructions/`, `skills/cicd/`, `skills/design/`, `skills/docs/`, `skills/infra/`, `skills/learn/`, `skills/local-stack/`, `skills/project-layout/`, `skills/repo-setup/`, `skills/requirements/`, `skills/rule/`, `skills/toolchain/`. Skills without one: `skills/codebase-docs/`, `skills/mcp-config/`.
- Skills with `eval.json`: `skills/codebase-docs/eval.json`, `skills/local-stack/eval.json`, `skills/repo-setup/eval.json`.
- The shared docs-family workflow shape: grep for `^## Workflow: Create` and `^## Workflow: Iterate` across `skills/*/SKILL.md`.
- The shared setup-family Verify contract: grep for `^## Verify` across `skills/*/SKILL.md`.
