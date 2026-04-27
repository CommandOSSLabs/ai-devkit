# Skill conventions

## What
Every skill under [`skills/`](../../../skills/) follows the same packaging shape — frontmatter, body, and an optional `references/` directory of templates and conventions cited by the body.

## Approach
Frontmatter declares three fields the host (Claude Code or OpenCode) reads to discover and trigger the skill:

- `name` — `cmk:<short-name>`, used as the slash command and skill ID.
- `description` — natural-language trigger phrases plus what the skill does. Used by the agent to auto-select the skill from user intent.
- `version` — currently `0.1.0` across all shipped skills.

Most skills then expose two phases — `Workflow: Create` and `Workflow: Iterate` — and offload long-form templates and placement rules into `references/*.md` so the SKILL body stays scannable. The `references/` files are loaded on demand via "Read `references/<file>.md`" lines.

The codebase-docs and worktree-dev-env skills break the pattern: they are largely self-contained in `SKILL.md` (no template files needed) and ship an `eval.json` for skill-creator evals.

## Where
- Frontmatter, on every skill: open any `skills/<name>/SKILL.md` and read lines 1–5.
- Skills with `references/`: `skills/adr/`, `skills/docs/`, `skills/feature-spec/`, `skills/learn/`, `skills/prd/`, `skills/rule/`, `skills/system-design/`.
- Skills with `eval.json`: `skills/codebase-docs/eval.json`, `skills/worktree-dev-env/eval.json`.
- The shared workflow shape: grep for `^## Workflow: Create` and `^## Workflow: Iterate` across `skills/*/SKILL.md`.
