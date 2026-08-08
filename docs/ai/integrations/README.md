# Integrations

How `ai-devkit` is exposed to its host environments. The same `skills/` tree is consumed by Claude Code via a plugin manifest; every other agent consumes it through the standard install paths (`INSTALLATION.md`): skills.sh copies or the vendored `.agents/skills/` layout.

## Hosts

- [claude-code.md](./claude-code.md) — `.claude-plugin/plugin.json`, the Claude Code marketplace manifest.
- [ci.md](./ci.md) — ai-devkit's own CI status and the sync-check CI pattern it defines for consuming repos.
