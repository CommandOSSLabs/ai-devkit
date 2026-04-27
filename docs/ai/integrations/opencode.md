# OpenCode integration

## What
Distribution as an OpenCode plugin. The plugin is a single ESM module that registers the repo's `skills/` directory with OpenCode's skill loader via the `config` hook — no symlinks or sync step needed.

## Approach
The exported async factory `AiDevkitPlugin` resolves the absolute path to `../../skills` (relative to the plugin file) and pushes it onto `config.skills.paths` if not already present. This means OpenCode loads skills directly from `skills/<name>/SKILL.md` — the same files Claude Code reads — keeping a single source of truth across both hosts.

## Where
- Plugin entry: `.opencode/plugins/ai-devkit.js` — exported symbol `AiDevkitPlugin`, the `config:` hook does the registration.
- Install + troubleshooting docs: `.opencode/INSTALL.md`.
- Resolved skills directory at runtime: `skills/` at the repo root — same tree documented under [`docs/ai/skills/`](../skills/README.md).
