# cmk:worktree-dev-env

## What
Skill that sets up a worktree-isolated local development environment so multiple git worktrees of the same repo can run full local stacks simultaneously without port collisions or env-file cross-contamination. Targets human developers, AI agents (headless mode), and CI.

## Approach
The skill body itself is the spec — it defines an eight-component pattern (port isolation, init script, coherence guard, env sync, mprocs/process-compose interactive runner, headless start/stop, color-coded log viewer, agent instructions in CLAUDE.md/AGENTS.md) and prescribes file paths under `scripts/` for each. The architecture is stack-agnostic; an "Adapting to Tech Stacks" table maps the per-language live-reload tooling. Unlike the doc-scaffolding skills, there are no `references/` files — everything is inline. An `eval.json` is shipped for skill-creator validation.

The `description` frontmatter contains the trigger phrases ("set up local dev", "worktree dev environment", "port conflicts between worktrees", "headless dev mode", "mprocs config", "process-compose setup").

## Where
- Skill body: `skills/worktree-dev-env/SKILL.md` — sections `The Pattern (Stack-Agnostic)` (with subsections 1–8), `Workflow: Create`, `Workflow: Iterate`, `Adapting to Tech Stacks`, `Common Pitfalls`, `File Layout Reference`.
- Eight numbered components: grep `### [1-8]\.` in `skills/worktree-dev-env/SKILL.md`.
- Eval scenarios: `skills/worktree-dev-env/eval.json`.
