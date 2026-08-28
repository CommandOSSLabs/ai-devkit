---
name: cmk:toolchain
description: Use when the user asks to "set up gitignore", "pin the toolchain", "configure the workspace", "which tool does what", "add a formatter/linter", or needs to assign unambiguous tool roles, pin runtime versions, and establish a gitignore baseline for a repo.
version: 0.2.1
---

# Toolchain

Establish or audit a repo's toolchain: which tool owns which job, which
versions are pinned and where, and what a baseline gitignore should cover so
agents and humans never guess.

## Modes

**Init** (default) — assign every tool its role, check in runtime pins, and
seed the gitignore baseline.

**Update** — add or swap a tool or pin; keep one resolver and one
lockfile per ecosystem.

**Verify** — report-only audit against the checks under `## Verify`;
never mutates.

## Explicit tool-role assignment

Every tool in the repo has exactly one declared role, recorded where agents
actually read it — a thin commands section in the root agent-instructions
file (`CLAUDE.md` or equivalent), or a dedicated `docs/rules/` entry. Typical
roles: one runtime for repo-owned automation scripts, one package/workspace
manager per ecosystem, one formatter and one linter per language. Two tools
never share a role ambiguously — if both a package manager's own runtime and
a separate scripting runtime are present, each owns a distinct, named job
(dependency resolution vs. running repo scripts), not an unstated split.

Product packages keep whatever toolchain they already document — adopting
this skill is not license to migrate a package's runtime, formatter, or
package manager unless a migration explicitly includes it. Never introduce a
second lockfile ecosystem alongside an existing one (e.g. a second JS/TS
runtime's own lockfile dropped into a workspace a package manager already
resolves) — one resolver, one lockfile, per ecosystem.

## Runtime pins

Check in a version file for every runtime the repo depends on, at the repo
root — a JS runtime version file (`.nvmrc` or equivalent), a systems-language
toolchain manifest (`rust-toolchain.toml` or equivalent), and their analogues
for any other ecosystem in play. CI and local setup both read the same
checked-in pin — never a separately maintained version in a CI config or a
contributor's README.

## Workspace config

Each language ecosystem gets a single root workspace (shape and placement
rules belong to `cmk:project-layout`, not here). Formatter and linter configs
live at the workspace root; packages inherit them rather than each declaring
its own, unless a package's documented toolchain choice requires an
exception.

## gitignore baseline

Doing initial repo setup or auditing what's tracked? Read
`references/gitignore-baseline.md` for an annotated baseline grouped by
concern, with the rationale for each group so it can be pruned rather than
copied wholesale.

One group always applies: `.local/` — the kit-wide worktree-local root for
ephemeral state and scratch — is always ignored. See `cmk:local-stack` for
what lives under it and why it must never be tracked.

## Verify

Report-only — never mutate:

- `.local/` is ignored.
- A version file exists for every runtime in use, at the repo root, and its
  pinned version matches what workspace config (CI, package manager engines
  field, etc.) expects.
- No ecosystem has more than one lockfile.
- Every declared tool role maps to exactly one tool — no role has two
  candidates with no stated split.
- Formatter and linter configs live at each workspace's root, not duplicated
  per package without a documented reason.
