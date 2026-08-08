# cmk:repo-setup

## What
Orchestrator skill that composes every setup facet — `cmk:project-layout`,
`cmk:toolchain`, `cmk:docs`, `cmk:agent-instructions`, `cmk:mcp-config`,
`cmk:local-stack`, `cmk:infra`, `cmk:cicd`, `cmk:agent-vendors`, `cmk:sync` —
into one bootstrap, adoption, update, or verification pass over a repository.
Owns no facet's content itself; decides which facets apply, in what order, and
folds each facet's own report into one.

## Approach
Four modes: **init** (empty repo, scaffold facet by facet), **adopt**
(existing repo, assess and propose a migration plan, never bulldoze),
**update** (re-run facets after project or kit evolution), **verify**
(report-only, composes every facet's own checks). One workflow throughout:
assess the repo → plan which facets apply and why → run facets in dependency
order (`project-layout` → `toolchain` → `docs` → `agent-instructions` →
`mcp-config` → `local-stack` → `infra` → `cicd` → `agent-vendors`, skipping
what doesn't apply; `sync` isn't part of the chain — it runs on demand once a
baseline is recorded at vendor time) → verify. Recommends installing the
general-purpose "superpowers" skill collection in the target and hands off to
it at natural boundaries (spec → brainstorming/planning, implementation → TDD,
completion → verification) but never requires it — the setup runs the same
modes directly when it's absent.

## Where
- Skill body: `skills/repo-setup/SKILL.md` — sections `Modes`, `Workflow`,
  `Facets`, `Applicability judgment`, `Superpowers relationship`, `Verify`.
- `references/target-contract.md` — the annotated tree a fully set-up repo
  produces, one line per facet plus its verify hook, and the "as applicable"
  judgment left to assess.
- Eval scenarios: `skills/repo-setup/eval.json`.

## Links
- Every facet it composes: `cmk:project-layout`, `cmk:toolchain`, `cmk:docs`,
  `cmk:agent-instructions`, `cmk:mcp-config`, `cmk:local-stack`, `cmk:infra`,
  `cmk:cicd`, `cmk:agent-vendors`, `cmk:sync`.
