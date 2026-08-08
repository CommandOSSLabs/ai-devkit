# cmk:delivery-ship

## What
Finalizes delivery of reviewed work: fresh verification evidence, a
review-facilitating PR against the canonical branch, tracker reconciliation
to reality, and follow-up issues for anything deferred. Phase 5 of
`cmk:delivery-pipeline`. Deliberately does not use
`superpowers:finishing-a-development-branch` — its integration menu, base
confirmation, discard path, and worktree cleanup are inadmissible
substitutes for this skill's tracking contract.

## Approach
Re-runs every gate fresh, walks acceptance criteria one final time against
actual behavior, and confirms the pre-ship review ran to completion at its
selected depth with that depth disclosed — a review that did not run, or
ran undisclosed, means this phase has not started. Rebases to a
straight-line history, opens the PR against the canonical branch (a
stacked issue's PR may target its parent's branch as a draft only), and
reconciles the owning issue: move to review state, back-fill anything
stale, file issues for deferred findings, notify stakeholders. Only this
phase may delete a phase-3 execution workspace, and only once its evidence
is durable elsewhere. The issue reaches its done state only when every
acceptance criterion is checked with reachable evidence or moved to a named
successor — merge alone is not completion.

## Where
- Skill body: `skills/delivery-ship/SKILL.md` — sections 1. Verify before
  claiming, 2. Commit and branch hygiene, 3. The pull request, 4.
  Reconcile the tracker, 5. Retire the run's scratch workspaces, 6. Done
  means delivered.
- `references/linear.md` — the skill body's conditional tracker-binding
  pointer resolves here.

## Links
Gates on `cmk:delivery-review` having run and disclosed its depth; PR
description contract lives in `cmk:delivery-workflow`'s
`references/pr-traceability.md`; stacked-PR mechanics in
`cmk:delivery-pipeline`'s `references/stacked-pr-flow.md`; produces
`cmk:delivery-pipeline`'s completion report.
