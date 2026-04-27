## ai-devkit — AI navigation map

`ai-devkit` is a documentation-first toolkit shipped as a Claude Code / OpenCode plugin. It bundles a set of `cmk:*` skills that scaffold and maintain a `/docs` tree (PRDs, system design, feature specs, ADRs, knowledge, rules), plus a `cmk:codebase-docs` skill that builds this very `docs/ai/` tree. The repo itself is the canonical source of those skills — there is no application runtime to document, only skill content, plugin manifests, and a recommended docs scaffold.

For the user-facing pitch and install instructions see the root [`README.md`](../../README.md).

## Areas

- [skills/](./skills/README.md) — the `cmk:*` skill packages that ship with the plugin.
- [docs/](./docs/README.md) — the `/docs` scaffold this repo recommends and defines templates for.
- [integrations/](./integrations/README.md) — how the skills are exposed to Claude Code, OpenCode, and CI.
