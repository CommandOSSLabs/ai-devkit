# Migrations

What changed for a repo upgrading from ai-devkit 1.x to 2.0.0, and why: [ADR 0001](docs/decisions/0001-jdk-engine-cmk-shape.md). Every 1.x skill name survives; `cmk:sync` surfaces a local adaptation that an upstream change contradicts as a conflict for you to decide.

## Before you sync

1. Read this page and decide which packs you want (`skills/agent-vendors/references/packs.md`).
2. Run `cmk:sync`; resolve its conflicts.
3. Run `cmk:agent-vendors` update to add the new core skills and your packs, then `cmk:repo-config` to write `docs/agents/` (tracker, state labels, verify commands).
4. Existing `docs/requirements/<topic>.md` and `docs/design/<topic>.md` stay valid; new features use `docs/specs/`.

## Docs layout

| Path | Status |
|---|---|
| `docs/specs/<date>-<feature>/{requirements,design,tasks}.md`, `docs/specs/INDEX.md`, `docs/specs/catalog/` | New: the feature triad and catalog |
| `docs/agents/` | New: per-repo agent config written by `cmk:repo-config` |
| `docs/decisions/`, `docs/requirements/glossary.md`, `docs/design/`, `docs/rules/` | Unchanged |
| `docs/design/system.md` | Also holds the `ARCH-N` invariant spine when the project pack is used |
| `docs/design/codebase/` | New (project pack): placement, module, ownership and dependency rules |

## Replaced or merged skills

| Skill | From the Engineer Pack | What changes |
|---|---|---|
| `cmk:delivery-build` | `execute-common` (as `references/common.md`), `build-in-waves` (as `references/continuous.md`), `build-by-story` (as `references/story-unit.md`), `build-inline` (as `references/inline.md`) | New: one execution engine with continuous, story-unit and inline modes. |
| `cmk:delivery-handoff` | `write-handoff` (as `references/handoff-document.md`) | The prompt carries tried-and-rejected approaches and logged deviations. |
| `cmk:delivery-pipeline` | `deliver-issues` | No longer runs superpowers; builds through `cmk:delivery-build`. A ready ticket without a spec is sized: trivial builds, patch gets a mini-spec and **Decisions taken** in its PR, feature goes to Shaping. |
| `cmk:delivery-review` | `inspect-change`, `inspect-invariants` (as `references/invariants.md`) | Two axes (Standards, Spec) plus invariants, UI and blast-prove lanes replace the seven lenses and Quick/Targeted/Full depth tables. |
| `cmk:delivery-ship` | `land-branch` | Ship guard, owner notice, close receipt; ticks each acceptance criterion with its proof before `Closes`; stacked-PR flow moved here from `cmk:delivery-pipeline`. |
| `cmk:delivery-simplify` | `polish-diff`, `no-comments` (as `references/comments.md`) | The jdk polish pass; read-only on a teammate's branch; comment discipline in `references/comments.md`. |
| `cmk:delivery-spec-plan` | `plan-tasks` | Writes the triad's `tasks.md` (committed, `Status:` lifecycle), not a git-ignored plan. Adds `## Production readiness` and per-task `Exclusive resources`. |
| `cmk:design` | `design-solution` | Feature design is the triad's `design.md`; system and track design stay in `docs/design/` (`references/system-and-track.md`, Security section required). |
| `cmk:discover-efforts` | `publish-issues` (as `references/publish.md`) | Gains publishing (`references/publish.md`): tracer-bullet issues after the user approves the breakdown. |
| `cmk:glossary` | `define-domain` (as `references/define-domain.md`) | Gains in-conversation term work (`references/define-domain.md`). |
| `cmk:interpret` | `interpret-session` | The jdk companion card replaces the stance-on-a-pasted-reply flow; the carry-back and digest stay, asking for the user's rationale goes. |
| `cmk:repo-setup` | `bootstrap-repo` (as `references/bootstrap.md`) | `init` runs the bootstrap (greenfield gate, proven-green baseline); `cmk:repo-config` joins the facet chain; the superpowers hand-off is gone. |
| `cmk:requirements` | `specify-behavior` | Feature requirements go to the triad `docs/specs/<date>-<feature>/requirements.md` with a `Notation:` header; area docs in `docs/requirements/<topic>.md` keep being iterated in place. Drafting needs an approved scope (else `cmk:scope`). The close-package elicitation moved to `cmk:interview`. |
| `cmk:research` | `why` (as `references/rationale.md`) | New, with design-rationale questions (`references/rationale.md`). |
| `cmk:delivery-workflow` | workflow guide, triage-labels template | Owns the closed workflow (10 states, 3 human gates) and the scope-band docs bar (triad / mini-spec / none) |
| `cmk:repo-config` | `configure-repo` | New core facet; model-invoked; CLAUDE.md stays canonical with AGENTS.md symlinked; the browser daemon is opt-in |
| `cmk:delivery-intake` | — | Sizes a ticket by band; the claim (Building + assignee) moves to the build |

## New skills

| Skill | From | Tier |
|---|---|---|
| `cmk:acceptance` | `validate-feature` | pack `acceptance` |
| `cmk:acceptance-api` | `validate-api` | pack `acceptance` |
| `cmk:acceptance-ui` | `validate-ui` | pack `acceptance` |
| `cmk:amend` | `amend-feature` | core |
| `cmk:architecture-scan` | `scan-architecture` | pack `quality` |
| `cmk:backlog` | `sweep-backlog` | core |
| `cmk:board` | `board` | core |
| `cmk:catalog` | `map-features` | core |
| `cmk:debt` | `record-debt` | pack `quality` |
| `cmk:debug` | `root-cause` | core |
| `cmk:delivery-pr` | `tend-pr` | core |
| `cmk:delivery-remote` | `build-on-host` | pack `ops` |
| `cmk:delivery-reroute` | `reroute-plan` | core |
| `cmk:delivery-status` | `show-run-status` | core |
| `cmk:dogfood-plan` | `write-dogfood` | pack `acceptance` |
| `cmk:dogfood-run` | `run-dogfood` | pack `acceptance` |
| `cmk:evidence` | `prove-claim` | core |
| `cmk:explain` | `understand` | core |
| `cmk:feature-graph` | `load-subgraph` | core |
| `cmk:feedback` | `vet-feedback` | core |
| `cmk:go` | `go` | core |
| `cmk:goal` | `forge-goal` | pack `extras` |
| `cmk:idea` | `idea` | core |
| `cmk:incident` | `debug-remote` | pack `ops` |
| `cmk:interview` | `clarify-decisions` | core |
| `cmk:milestone-review` | `assess-milestone` | pack `roadmap` |
| `cmk:observability` | `assess-observability` | pack `ops` |
| `cmk:pivot` | `assess-pivot-impact` | pack `quality` |
| `cmk:progress-chart` | `chart-progress` | pack `roadmap` |
| `cmk:prompt` | `forge-prompt` | pack `extras` |
| `cmk:prose` | `speak-outer` | core |
| `cmk:realign` | `realign-spec` | core |
| `cmk:release` | `cut-release` | core |
| `cmk:repo-config` | `configure-repo` | core |
| `cmk:research` | `research` | core |
| `cmk:retro` | `reflect` | pack `maintainers` |
| `cmk:roadmap` | `plan-milestones` | pack `roadmap` |
| `cmk:roadmap-status` | `refresh-roadmap-status` | pack `roadmap` |
| `cmk:scope` | `frame-change` | core |
| `cmk:shape` | `shape` | core |
| `cmk:shipped-audit` | `audit-shipped` | pack `quality` |
| `cmk:skill-authoring` | `author-skills` | pack `maintainers` |
| `cmk:source-trust` | `vet-source` | core |
| `cmk:spike` | `run-spike` | core |
| `cmk:system-docs` | `define-system-doc` | pack `project` |
| `cmk:tdd` | `test-first` | core |
| `cmk:traceability` | `audit-trace` | core |
| `cmk:triage` | `triage` | core |
| `cmk:ui-brief` | `draft-ui` | pack `ui` |
| `cmk:ui-review` | `inspect-ui` | pack `ui` |
| `cmk:ux-brief` | `draft-ux` | pack `ui` |
| `cmk:verdict` | `record-verdict` | core |
| `cmk:vision` | `define-project` | pack `project` |
| `cmk:visualize` | `craft-page` | core |
| `cmk:working-set` | `hold-stage` | core |
| `cmk:worktree` | `isolate-workspace` | core |

## Engineer Pack skills not carried over

`pathfind` and `work-the-problem` left the Engineer Pack on 2026-10-19 (jdk `e2b5c4e`), so
2.0 has no `cmk:pathfind` or `cmk:problem`. A problem that needs framing gets the problem-lock
card of `cmk:interview`.

## Removed dependencies

- `superpowers` is no longer required: `cmk:delivery-build`, `cmk:tdd` and `cmk:debug` cover what it supplied.
