# Integrations

How `ai-devkit` is exposed to its host environments. The same `skills/` tree is consumed by Claude Code via a plugin manifest, by OpenCode via a JS plugin that registers the skills directory, and validated by a GitHub Actions workflow.

## Hosts

- [claude-code.md](./claude-code.md) — `.claude-plugin/plugin.json`, the Claude Code marketplace manifest.
- [opencode.md](./opencode.md) — `.opencode/plugins/ai-devkit.js`, registers `skills/` via OpenCode's config hook.
- [ci.md](./ci.md) — `.github/workflows/skills-sync-check.yml`, repo-level CI.
