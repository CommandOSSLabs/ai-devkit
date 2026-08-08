# cmk:delivery-pipeline

## What
Orchestrates end-to-end autonomous delivery of one tracker issue or a
dependency-aware cluster of related issues — intake, spec and plan,
implementation, review, and ship — with no human in the loop, producing a
reviewable PR, an up-to-date tracker graph, and a written record of every
material decision.

## Approach
CMK owns the tracker as delivery ledger, phase order and gates, the repo
quality bar, review lenses and disposition, and autonomy; superpowers
skills execute inside that lifecycle (implement/debug loop, spec
pressure-testing, plan authoring, completion verification). Two rules adapt
every superpowers skill used inside the pipeline: human-approval gates are
suppressed and replaced with a recorded autonomous decision, and a
superpowers skill returns control at its own boundary rather than advancing
the phase or deleting a workspace it doesn't own. Phase 0 writes run notes
once (runtime, worktree paths, execution workspace path, any explicit
review-depth override). Single-issue mode runs phases 1–5 in one worktree;
cluster mode derives or accepts a dependency graph and runs
worktree-per-issue with frontier scheduling. Ends every run with a
completion report: delivered, decisions, rescoped, deferred, blocked — each
line already recorded on its durable surface.

## Where
- Skill body: `skills/delivery-pipeline/SKILL.md` — sections Working with
  superpowers, Phase 0: run notes, The phases, Single-issue mode, Cluster
  mode, Cross-agent handoff, Completion report.
- `references/cluster-mode.md` — dependency closure, readiness gates,
  frontier scheduling, worktree-per-issue.
- `references/context-efficiency.md` — full vs. delta refresh discipline
  every phase and handoff reads.
- `references/engineering-principles.md` — autonomy, production readiness,
  the delegation contract, full-surface-change dispositions.
- `references/phase-3-execution.md` — wave dispatch and its safety fixes
  for the implement phase.
- `references/stacked-pr-flow.md` — stacked-PR retarget, ancestry
  verification, and manual fallback.
- `references/linear.md` — the skill body's conditional tracker-binding
  pointer resolves here.

## Links
Orchestrates `cmk:delivery-intake`, `cmk:delivery-spec-plan`,
`cmk:delivery-review`, `cmk:delivery-ship`, and `cmk:delivery-handoff` on
top of `cmk:delivery-workflow`; chains into `superpowers:brainstorming`,
`superpowers:writing-plans`, `superpowers:subagent-driven-development`, and
`superpowers:using-git-worktrees` — and, via `cmk:delivery-ship`,
`superpowers:verification-before-completion` — and explicitly never
chains into `superpowers:finishing-a-development-branch`.
