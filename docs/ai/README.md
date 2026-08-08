# AI Navigation

Maps from topic to source file: short what/where docs that point an agent at
the right code instead of restating it.

`ai-devkit` is a documentation-first toolkit shipped as a Claude Code / OpenCode plugin. It bundles a set of `cmk:*` skills that scaffold and maintain a `/docs` tree (requirements, design, decisions, rules, knowledge, and the rest of the canonical taxonomy), plus a `cmk:codebase-docs` skill that builds this very `docs/ai/` tree, plus a repo-setup facet family that scaffolds local dev, layout, toolchain, agent instructions, infra, CI/CD, and MCP config. It also bundles a tracker-neutral delivery family that runs tracked work end to end (context intake through spec, implementation, review, and shipping) and a knowledge family of standalone domain reference packs consulted whenever their subject comes up. The repo itself is the canonical source of those skills — there is no application runtime to document, only skill content, plugin manifests, and the docs scaffold.

For the user-facing pitch and install instructions see the root [`README.md`](../../README.md).

## Areas

- [skills/](./skills/README.md) — the `cmk:*` skill packages that ship with the plugin.
- [docs/](./docs/README.md) — the `/docs` taxonomy this repo defines, scaffolds, and dogfoods.
- [integrations/](./integrations/README.md) — how the skills are exposed to Claude Code, OpenCode, and CI.

## Conventions

- Mirror the shape of the codebase: one folder per area, each with its own
  `README.md` index.
- Name paths and packages; point at code rather than duplicating it. No ticket
  IDs, no delivery status.
- Update the affected map in the same change that moves or renames the code it
  describes.

## When to read

First, on any task — to find which source files a topic lives in.
