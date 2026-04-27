# Claude Code integration

## What
Distribution as a Claude Code plugin. Users install with `claude plugin add CommandOSSLabs/ai-devkit`; Claude Code auto-discovers the skills under `skills/` once the plugin is loaded.

## Where
- Plugin manifest: `.claude-plugin/plugin.json` — fields `name: "ai-devkit"`, `version`, `description`, `author`, `repository`, `license`, `keywords`. No explicit `skills` entry — skills are discovered by convention from the `skills/` directory at the plugin root.
- Install instructions: root `README.md` (the `### Claude Code` section under `## Install`).
