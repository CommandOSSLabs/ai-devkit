# AI Navigation

Maps from topic to source file: short what/where docs that point an agent at
the right code instead of restating it.

`ai-devkit` is a skill kit shipped as a Claude Code plugin and through standard install paths (skills.sh, vendored `.agents/skills/`). Its 93 `cmk:*` skills run a closed ticket workflow (five commands from idea to release), write the feature spec triad under `docs/specs/` and the standing docs under `docs/requirements/`, `docs/design/` and `docs/decisions/`, build and review changes test-first, set up repositories (layout, toolchain, agent instructions, agent config, infra, CI/CD, MCP, skill vendoring and sync), and ship opt-in packs for roadmaps, acceptance, UI, ops, quality, project docs, skill maintenance and extras. The repo itself is the canonical source of those skills — there is no application runtime to document beyond the skills explorer (`app/`, `components/`, `lib/`), plugin manifests, and the docs scaffold.

For the user-facing pitch and install instructions see the root [`README.md`](../../README.md).

## Areas

- [skills/](./skills/README.md) — the `cmk:*` skill packages that ship with the plugin.
- [docs/](./docs/README.md) — the `/docs` taxonomy this repo defines, scaffolds, and dogfoods.
- [integrations/](./integrations/README.md) — how the skills are exposed to Claude Code, other agents, and CI.

## Conventions

- Mirror the shape of the codebase: one folder per area, each with its own
  `README.md` index.
- Name paths and packages; point at code rather than duplicating it. No ticket
  IDs, no delivery status.
- Update the affected map in the same change that moves or renames the code it
  describes.

## When to read

First, on any task — to find which source files a topic lives in.
