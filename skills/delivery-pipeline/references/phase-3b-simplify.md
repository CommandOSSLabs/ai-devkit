# Phase 3b — Simplify (epilogue)

After phase 3's last task is complete and joined onto the **issue branch**,
run `cmk:delivery-simplify` once before phase 4.

## Defaults

- **Default for pre-ship.** Behavior-preserving quality cleanup (reuse,
  simplification, efficiency, altitude), then apply safe fixes. Angle
  mandates and apply/skip rules: `cmk:delivery-simplify`'s
  `references/angles.md`.
- **Whole-branch only.** Never on a per-task wave worktree — only after join
  onto the durable issue branch.
- **Not a verdict.** This is author-side polish. Phase 4 still owns lenses,
  evidence, adversarial verification, disposition, and depth disclosure.
- **Skip with a trace.** Docs-only or empty diff, or an explicit operator
  skip: record `skipped` + reason in run notes and continue to phase 4.
  Silent skip is a defect.
- **Verification.** After apply, re-run the plan's verification (or the
  issue's focused gate). A red tree does not enter phase 4.
- **Evidence.** Simplify report in scratch; run notes carry `ran` + engine
  (`fan-out` | `single-pass`) or `skipped` + reason.

## Cluster

After each issue's phase 3 join (and after a multi-feeder join onto a
combined branch), run phase 3b on that joined branch before its pre-ship
review. Cluster assurance still runs the targeted combined-diff review; 3b
does not replace it.

## Standalone

Standalone invocation of simplify (operator asks only to polish) uses
`cmk:delivery-simplify` and does not advance the pipeline.

## Roles

Phase 3b fans out angle workers on the delivery reviewer role and applies
with the delivery implementer role (or the orchestrator). It does not add a
fifth permanent delivery role.

## Completion disclosure

When phase 3b was skipped or ran single-pass instead of fan-out, the
pipeline completion report says so (issue, engine or skip reason). Detail
lives in the simplify report and run notes.
