---
name: cmk:repo-setup
description: Use when the user asks to "set up this repo", "bootstrap this repo", "update this repo with the devkit", "adopt the devkit", or "check repo setup". Produces one composed bootstrap, adoption, update, or verification pass over a repository against the target contract.
version: 1.0.0
---

# Repo Setup

Compose every setup facet into one pass over a repository. This skill owns no
facet's content itself — it decides which facets apply, in what order, and
folds each facet's own report into one. Read `references/target-contract.md`
for the tree a fully set-up repo produces and which facet (and verify hook)
owns each line.

## Modes

- **init** — empty directory or new subpackage: read `references/bootstrap.md` first and
  follow it. Its greenfield gate decides whether init applies at all, its stack card
  settles what the facets build, and its proof gate — install and verify commands run green,
  output shown — ends the run.
- **adopt** — existing repo: assess current structure, map it onto the
  taxonomy below, and propose a migration plan. Never bulldoze — every
  destructive move (a rename, a merge, a deletion) is proposed for approval,
  not executed unasked.
- **update** — re-run facets after the project or the kit itself has evolved,
  reconciling new pointers/files the way each facet's own Update mode does.
- **verify** — report-only; see `## Verify`.

## Workflow

1. **Assess** — read the repo: languages and ecosystems in play, existing
   layout, docs tree, CI workflows, infra packages, agent instruction files,
   MCP config. This is the evidence the plan is built from, not a guess.
2. **Plan** — decide which facets apply and in what order (below), and which
   already have something in place vs. nothing. Present the plan before
   running any facet; in adopt/update, additionally get it approved before
   mutating anything.
3. **Run facets**, in dependency order, skipping any that don't apply:
   `project-layout` → `toolchain` → `docs` (`cmk:docs`) → `agent-instructions`
   → `repo-config` → `mcp-config` → `local-stack` → `infra` → `cicd` → `agent-vendors`. Layout
   and toolchain come first because every later facet's files land inside the
   layout they establish; docs and agent-instructions come before the facets
   that point into `docs/rules/`; `repo-config` follows them because it adds its
   `## Agent skills` block to the `CLAUDE.md` agent-instructions wrote; local-stack, infra, and cicd come near the
   end because they're the most likely to be skipped entirely; `agent-vendors`
   runs last because it vendors the finished skill set. `sync` isn't part of
   this chain — it runs on demand thereafter, once a baseline is recorded at
   vendor time.
4. **Verify** — compose every facet's own checks into one report (see below).

## Facets

| Facet | Owns |
|---|---|
| `cmk:project-layout` | Role-first top-level directories, one workspace per ecosystem, library promotion, private test packages, `external/` vendoring, `scripts/` grouping. |
| `cmk:toolchain` | Explicit tool-role assignment, checked-in runtime version pins, single-root workspace config, gitignore baseline. |
| `cmk:docs` | The `docs/` taxonomy itself: per-directory navigation READMEs and baseline templates. |
| `cmk:agent-instructions` | Thin `CLAUDE.md` (symlinked as `AGENTS.md`) plus the seeded `docs/rules/common/` topic files it points into. |
| `cmk:repo-config` | `docs/agents/` (posture, team, tracker, labels, verify and release commands), the spec catalog seeds, the `## Agent skills` block in `CLAUDE.md`. |
| `cmk:mcp-config` | Checked-in, per-vendor MCP server configuration with secrets kept out of the repo. |
| `cmk:local-stack` | Worktree-isolated local dev stack(s): identity/coherence and the interactive/headless runners. |
| `cmk:infra` | Isolated IaC packages under `infra/`, first-class environments. |
| `cmk:cicd` | GitHub Actions structure: CI validation, deploy/release, policy and auth. |
| `cmk:agent-vendors` | Canonical `.agents/skills/` home, per-vendor adapters and bindings, the check-only adapter-sync CI. |
| `cmk:sync` | Upstream baseline per vendored skill (`.agents/skills.lock`) and semantic reconciliation with the kit. |

## Applicability judgment

Not every repo needs every facet. A library repo may need no `local-stack`
or `infra`; a repo with no deployable service needs no `cicd` deploy leg. The
assess step decides applicability from evidence (does anything in the repo
already deploy, run a service, or need a local topology) and the plan records,
per skipped facet, *why* it was skipped — never a silent omission.

## Verify

Report-only — never mutate:

- Compose each facet's own verify checks (each facet's `## Verify` section,
  or — for `cmk:docs` — its Verify mode) over the parts of the repo that
  facet applies to; report per-facet, not merged into one pass/fail.
- The produced tree matches `references/target-contract.md` for every facet
  judged applicable.
- No facet is left half-applied — e.g. `CLAUDE.md` exists but the
  `docs/rules/` files it points into don't, or an IaC package exists with no
  paired deploy workflow.
- Every facet judged not-applicable during assess still has its skip reason
  recorded, so a later run doesn't have to re-derive it.
- After `init`, the bootstrap proof gate held: one install command and one verify command
  run green from the repo root, with the output shown.
