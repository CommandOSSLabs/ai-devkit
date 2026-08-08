# Adopt-mode dry run against dopamint-arena (read-only)

**Date:** 2026-08-09
**Kit revision validated:** `dcf198d0710544c143a0eadb696ba1182f73a147`
(branch `phase-e-validation-polish`)

## What this is

An agent applied `skills/repo-setup/SKILL.md`'s adopt + verify modes, and
every facet's own `## Verify` section, against a real, large, external
production repository — **`dopamint-arena`**
(`CommandOSSLabs/dopamint-arena` on GitHub) — read-only. The goal was to
prove that assess/adopt produces a sane, non-bulldozing plan on a real
complex repo, and that every facet's Verify checks *discriminate* on real
data rather than giving a nonsensical or silent-wrong answer.

`dopamint-arena` is a Sui-based multi-language monorepo: Rust and TypeScript
services and libraries, Move contracts, Pulumi IaC, GitHub Actions CI/CD, and
its own prior agent-instructions/vendoring setup — tracked in a Linear
workspace (team DOPAN). Naming the target and its subsystems here is
sanctioned for this report only.

**Nothing was written to the target.** Every command run against it was a
read (`ls`, `find`, `grep`, `wc`, `cat`, `git status`/`log`/`diff`; three
read-only `gh api` GET calls to check branch-protection required-check names
against workflow job names). No file under the target was created, edited,
or deleted; no branch, index, worktree, or config there changed.

## Assess inventory

- **Top level**: `ui/, backend/, cli/, libs/, contracts/, infra/, scripts/,
  docs/, tests/, external/` — every directory names a role, matching
  `cmk:project-layout`'s vocabulary almost verbatim. Two stray tracked files
  sit at repo root outside any role directory (a 0-byte log file and a
  44-byte file whose content is shaped like an exported Sui private key,
  value not reproduced here) — a real secret-hygiene issue for the target's
  own maintainers, unrelated to any kit facet.
- **Toolchain**: version pins for every runtime (`.nvmrc`, `.bun-version`,
  `rust-toolchain.toml`, `.sui-version`), single lockfile per ecosystem
  (`pnpm-lock.yaml`, `Cargo.lock`), `.local/` ignored.
- **Docs tree**: a rich, mostly-overlapping taxonomy
  (`decisions/, design/, guide/, requirements/, research/, runbooks/,
  reports/, superpowers/, ai/`), but four directories lack a `README.md` and
  the root `docs/README.md` is missing entirely; no `docs/templates/`, no
  `docs/rules/`.
- **Agent instructions**: `CLAUDE.md` (504 lines) with a real
  `AGENTS.md -> CLAUDE.md` symlink, but standards (naming, doc comments,
  testing, git workflow, CLI-surface pairing, agent conduct) live fully
  inline rather than behind `docs/rules/common/` pointers; the repo instead
  points into its own `docs/guide/*.md` for detail.
- **MCP config**: no `.mcp.json` anywhere, though a semantic-navigation MCP
  server (Serena) is in active use per `.serena/project.yml`.
- **Local stack**: worktree identity derivation, a coherence guard wired
  into init, broker-assigned ports (no hardcoded ports found), both
  interactive (`mprocs.yaml`) and headless (`infra/local-llm/stack`)
  runners — a mature implementation of the facet.
- **Infra**: isolated packages per deployment concern (`infra/iac`,
  `infra/arena-iac`, `infra/local-llm`, `infra/local-tps`), no cross-package
  imports found, no embedded credentials.
- **CI/CD**: 19 workflow files, one `.github/workflows/README.md` documenting
  only 10; a required change-detection job in `ci.yml`; deploy workflows take
  an explicit `environment` input and use OIDC (`role-to-assume`), no
  long-lived key found; a GitHub ruleset pins 14+ required checks by name,
  and every pinned name was confirmed against a real workflow job name.
- **Agent vendors**: 9 skills vendored under `.agents/skills/` (mostly the
  `cmk-delivery-*` family), mirrored to Claude/Grok/Cursor adapters; no
  `.agents/bindings/` directory (each vendor instead carries its own
  `<vendor>/delivery/capabilities.md`); no `.agents/skills.lock` anywhere.

## Per-facet adoption mapping

| Facet | What exists | Adopt proposes |
|---|---|---|
| `cmk:project-layout` | Already conformant | Keep, no migration |
| `cmk:toolchain` | Already conformant | Keep, no migration |
| `cmk:docs` | Rich but incomplete navigation chain | Migrate (additive): add missing per-directory READMEs + root `docs/README.md` |
| `cmk:agent-instructions` | Large, mature `CLAUDE.md`; equivalent pattern via `docs/guide/` instead of `docs/rules/` | **Conflict — human decision**: extract standards into `docs/rules/common/` and thin `CLAUDE.md`, *or* record the existing `docs/guide/` pointer pattern as the target's own equivalent |
| `cmk:mcp-config` | No checked-in server set despite active MCP usage | Migrate: add `.mcp.json` registering the in-use server(s) |
| `cmk:local-stack` | Already conformant, close to reference implementation | Keep, no migration |
| `cmk:infra` | Already conformant | Keep, no migration |
| `cmk:cicd` | Mostly conformant; workflow table stale | Migrate (additive): add 9 missing rows to `workflows/README.md` |
| `cmk:agent-vendors` | Adapter-mirror tier works; binding-path convention diverges from the kit's current template; one vendored skill lacks the `cmk-` prefix the Verify glob checks | **Conflict — human decision** on binding-path convention and skill naming |
| `cmk:sync` | No lock exists despite 9 skills being vendored | Migrate: run baseline mode to record upstream ref + pristine hash per skill |

The two facets flagged as conflicts are the exercise's key proof point:
adopt mode routes them to a human decision instead of silently rewriting a
large, working, repo-specific asset (`CLAUDE.md`) or an ambiguous structural
choice (binding-file location) — it never bulldozes.

## Verify results

Every one of the ten facets' Verify checks was run against the target as it
stands — 44 individual checks total. **Tally: 30 PASS, 9 FAIL, 1 hybrid
FAIL/N/A, 3 pure N/A, 1 NOT EVALUABLE.** The 9 FAILs are all expected drift
on a repo that predates the kit: missing per-directory docs READMEs, 2
dangling ADR cross-references, 2 orphaned canonical docs, `CLAUDE.md` not
staying thin (504 lines with six standards sections inline), missing
`docs/rules/common/`, a missing `.local/tmp/` scratch line in `CLAUDE.md`, a
stale `workflows/README.md` (9 of 19 workflows undocumented), missing
`.agents/bindings/` files, and a missing `.agents/skills.lock`. The 1 hybrid
row is `.mcp.json`: it fails on existence (the file doesn't exist), and the
"parses" half of that same check is N/A with nothing to parse. The 3 pure
N/A rows are checks with no artifact to evaluate against (two `mcp-config`
rows once no config exists, one `sync` row once no lock exists). The 1 NOT
EVALUABLE row is `cmk:local-stack`'s "no env file references another
worktree's absolute path" — `.local/` is correctly git-ignored, so a static
checkout has no env files to check that bullet against; it's only
meaningful against a live, running instance.

No check produced a nonsensical or silently-wrong answer; every FAIL
corresponds to a real, independently-confirmed gap (e.g. the dangling ADR
link to a renamed `0020-*.md` file, and the 9 undocumented workflow files,
were both hand-verified against the actual files on disk).

### Per-facet detail

#### `cmk:project-layout` — 6/6 PASS

| Check | Result |
|---|---|
| Top-level dirs name a role | PASS |
| One workspace/lockfile per ecosystem, no nested | PASS |
| No library imported by 2+ role-areas from inside one | PASS (spot-checked `libs/`, `external/cmdawg`) |
| Private test packages own their own config | PASS (`tests/e2e/*`, `tests/parity/*` each independent) |
| `external/` packages have baseline lockfile + round-trip script | PASS (`external/cmdawg.lock.toml` + `scripts/cmdawg-external`) |
| `scripts/` root holds only stable wrappers | PASS (grouped subdirs only) |

#### `cmk:toolchain` — 5/5 PASS

| Check | Result |
|---|---|
| `.local/` ignored | PASS |
| Version file per runtime, root-level | PASS (`.nvmrc`, `.bun-version`, `rust-toolchain.toml`, `.sui-version`) |
| No ecosystem has 2+ lockfiles | PASS |
| Each tool role maps to exactly one tool | PASS |
| Formatter/linter config at workspace root | PASS (`.prettierrc`, `rustfmt.toml`, `clippy.toml` at root) |

#### `cmk:docs` (Verify mode) — 0/3 PASS

| Check | Result |
|---|---|
| Every directory has exactly one README.md | **FAIL** — `guide/`, `requirements/`, `runbooks/`, `reports/` lack one; root `docs/README.md` is missing entirely |
| Connectedness: no dangling links among canonical docs | **FAIL** (partial) — `docs/decisions/0005-*.md` links to a nonexistent `0006-genuine-two-party-only-drop-self-play.md` and a renamed `0020-self-play-tps-engine-two-party-on-top.md` (actual file: `0020-bot-fleet-topology-shared-core.md`) |
| Connectedness: no orphaned canonical docs | **FAIL** — 2 orphans found (`0099-render-dopa-open-docs-with-fumadocs-on-vite.md`, `design/dopamint-arena/dopa-predict/in-play-policy-v1.md`) |

Caveat: the orphan/dangling check here was an approximation (regex
link-scan restricted to `decisions/`, `requirements/`, `design/`, matching
the facet's own description of the check), not the kit's own automated
implementation (the skill describes the check but does not ship one) — the
2 dangling links and 2 orphans found were hand-verified as real.

#### `cmk:agent-instructions` — 2/5 PASS

| Check | Result |
|---|---|
| `CLAUDE.md` exists and stays thin | **FAIL** — 504 lines, six full standards sections inline |
| `AGENTS.md` is a symlink to `CLAUDE.md` | PASS |
| `docs/rules/common/` populated with seeded topics | **FAIL** — directory does not exist |
| Every conditional pointer resolves | PASS — all `docs/guide/*.md` pointers in `CLAUDE.md` resolve to real files |
| `.local/tmp/` scratch line present | **FAIL** — no such line in `CLAUDE.md` |

#### `cmk:mcp-config` — 0/3 PASS (1 hybrid, 2 N/A)

| Check | Result |
|---|---|
| Checked-in MCP config file exists and parses | **FAIL/N/A (hybrid)** — no `.mcp.json` exists (existence FAILs); "parses" is N/A with nothing to parse |
| No secret/token inline | N/A (no file to check) |
| Per-vendor registrations agree | N/A (no checked-in server set to compare against) |

#### `cmk:local-stack` — 5/6 PASS (+1 not evaluable)

| Check | Result |
|---|---|
| `.gitignore` covers `.local/` | PASS |
| Identity derivation exists, worktree-deterministic | PASS (`scripts/worktree-env.sh`) |
| No hardcoded ports | PASS (`docker-compose.dev.yml` fully env-interpolated) |
| Coherence guard runs before anything starts | PASS (`scripts/ensure-worktree-coherence.sh` wired into `init-worktree-dev.sh`) |
| No env file references another worktree's absolute path | **NOT EVALUABLE** — no env files exist in a static checkout; `.local/` is correctly git-ignored and only materializes at runtime |
| Each stack's state root under `.local/` | PASS by design (script targets, not observable statically) |

#### `cmk:infra` — 3/3 PASS

| Check | Result |
|---|---|
| No cross-package imports between isolated IaC packages | PASS (only doc-comment lineage references found, no `import`) |
| Every named environment has a deploy path | PASS (spot-checked `arena-iac` ↔ `deploy-arena-infra.yml`) |
| No embedded credentials | PASS |

#### `cmk:cicd` — 4/5 PASS

| Check | Result |
|---|---|
| One path-filtered CI workflow with required change-detection job | PASS (`ci.yml`, `CI change detection`) |
| Every deployable has one deploy workflow taking SHA + environment | PASS (spot-checked `deploy-arena-backend.yml`) |
| Required checks pinned by name, match job names | PASS (verified via `gh api` ruleset read against `ci.yml`/`linear-ticket-check.yml`/`pr-quality-check.yml` job names) |
| No long-lived credential where OIDC available | PASS (`role-to-assume` in every deploy workflow checked) |
| `workflows/README.md` current with workflows on disk | **FAIL** — 9 of 19 workflow files undocumented |

#### `cmk:agent-vendors` — 5/6 PASS

| Check | Result |
|---|---|
| Canonical skills have valid frontmatter | PASS (spot-checked `cmk-sui-sdk`, `cmk-delivery-pipeline`) |
| Adapter-mirror frontmatter byte-identical | PASS (`cmk-sui-sdk` Claude adapter) |
| No orphaned adapter for a removed skill | PASS (no orphans found) |
| Declared-unsupported vendor roots absent | PASS (no OpenCode dir, consistent with vendor set in use) |
| `AGENTS.md` symlink, not copy | PASS |
| Binding files exist where a skill references one | **FAIL** — no `.agents/bindings/` dir; adapters point at `<vendor>/delivery/capabilities.md` instead |

#### `cmk:sync` — 0/2 PASS (1 FAIL, 1 N/A)

| Check | Result |
|---|---|
| `.agents/skills.lock` exists and parses | **FAIL** — file does not exist |
| One lock entry per vendored skill | N/A (no lock to check) |

## Defects and disposition

No small, unambiguous skill-side bug was found that warranted a
`fix: <specific>` commit. Three open findings surfaced, all structural or
ambiguous enough to leave for a maintainer decision rather than resolve
unilaterally:

1. `cmk:local-stack`'s "no env file references another worktree's absolute
   path" Verify bullet cannot be evaluated from a static checkout (env files
   are correctly git-ignored and only exist at runtime), unlike the other
   five bullets in the same list which are all statically checkable. Left
   open — worth a maintainer call on whether to annotate it as
   runtime-only, not large enough on its own to force a wording change.
2. `cmk:agent-vendors`'s prescribed capability-binding path
   (`.agents/bindings/<vendor>.md`) doesn't match what a real, already-
   adopted repo has (`<vendor>/delivery/capabilities.md` per vendor, no
   `.agents/bindings/` at all). Ambiguous whether the target pre-dates a
   kit template change or made a deliberate choice — not resolvable
   read-only from either side.
3. A vendored skill (`linear-delivery-workflow`) carries no `cmk-` prefix,
   so it silently falls outside the agent-vendors facet's own Verify glob
   (`.agents/skills/cmk-*/`) even though it follows the same adapter-mirror
   pattern as its `cmk-*` neighbors. Left open as a scope call: widen the
   glob, or rename the skill.

Everything else that failed verify was genuine target-side drift the checks
correctly caught — the expected, desired outcome on a repo that predates the
kit.

## Statement

Nothing was written to the target repository at any point during this task.
All output is this report, committed to this repository only.
