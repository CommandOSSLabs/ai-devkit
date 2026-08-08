# Skill conventions

## What
Every skill under [`skills/`](../../../skills/) follows the same packaging shape — frontmatter, body, and an optional `references/` directory of templates and conventions cited by the body.

## Approach
Frontmatter declares three fields the host (Claude Code or OpenCode) reads to discover and trigger the skill:

- `name` — `cmk:<short-name>`, used as the slash command and skill ID.
- `description` — natural-language trigger phrases plus what the skill does. Used by the agent to auto-select the skill from user intent.
- `version` — `0.2.0` on the docs-taxonomy skills (`adr`, `design`, `docs`, `learn`, `requirements`), still `0.1.0` on the rest.

Most skills then expose two phases — `Workflow: Create` and `Workflow: Iterate` — and offload long-form templates and placement rules into `references/*.md` so the SKILL body stays scannable. The `references/` files are loaded on demand via "Read `references/<file>.md`" lines.

Three skills break the create/iterate pattern: `cmk:learn` uses `Workflow: Extract` / `Workflow: Review`, `cmk:codebase-docs` uses `Bootstrap workflow` / `Update workflow`, and `cmk:docs` uses `Modes` (Init/Update/Verify) plus a single `Workflow`. `cmk:rule` adds a third phase, `Workflow: Promote`.

## Where
- Frontmatter, on every skill: open any `skills/<name>/SKILL.md` and read lines 1–5.
- Skills with `references/`: `skills/adr/`, `skills/design/`, `skills/docs/`, `skills/learn/`, `skills/requirements/`, `skills/rule/`.
- Skills with `eval.json`: `skills/codebase-docs/eval.json`, `skills/worktree-dev-env/eval.json`.
- The shared workflow shape: grep for `^## Workflow: Create` and `^## Workflow: Iterate` across `skills/*/SKILL.md`.
