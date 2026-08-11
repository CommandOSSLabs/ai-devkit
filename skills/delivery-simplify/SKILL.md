---
name: cmk:delivery-simplify
description: This skill should be used when the user asks to "simplify", "clean up the diff", "polish the changed code", or "run a simplify pass" without changing behavior — and as the delivery-pipeline phase-3 epilogue (3b) after implement and before review.
version: 0.1.0
---

# Delivery Simplify

Quality cleanup of the **changed** code. Not a bug hunt, not a merge
verdict, and not a substitute for `cmk:delivery-review`.

CMK port of Claude Code's built-in `/simplify` slash command (binary
2.1.227+). Angle mandates and apply/skip rules live in
`references/angles.md` — that file is the contract; this skill is the
orchestration.

## Where it sits

| Owner | Role |
|---|---|
| `cmk:delivery-pipeline` | **When** — phase-3 epilogue (3b) after implement, before phase 4 |
| This skill | **How** — gather diff, four angles, apply, evidence |
| `cmk:delivery-review` | **Judge** — lenses and disposition after this pass (pre-ship) |

Default pipeline order:

```
3 Implement → 3b Simplify (this skill) → 4 Review → 5 Ship
```

Run once on the **joined issue branch**, never on a per-task wave worktree.
Cluster joins: run on the combined branch after join, before that branch's
pre-ship review.

## Occasion and apply policy

| Occasion | Run? | Apply fixes? |
|---|---|---|
| Pipeline pre-ship (own issue, phase 3b) | **Yes** (default) | **Yes** |
| Standalone on own branch / unpushed work | Yes when asked or as polish | **Yes** |
| Standalone on a **teammate's** PR | Only if explicitly asked | **No** — report findings only |
| Docs-only / empty diff / no code change | Skip | — |
| Operator said skip simplify | Skip | — |

Every skip is recorded in run notes (pipeline) or the simplify report
(standalone) with the reason. Silent skip is a defect.

## Contract (do not invent)

1. **Quality only.** Do not hunt correctness bugs. That is phase 4 /
   `cmk:delivery-review`.
2. **Behavior-preserving.** Change *how*, never *what*. No new features, no
   AC changes, no API renames the plan did not already require.
3. **Four angles only** — Reuse, Simplification, Efficiency, Altitude —
   per `references/angles.md`. Do not fold in security, compliance, or
   production-readiness here.
4. **Scope = the diff from Phase 0.** No drive-by cleanup outside it.

## Procedure

### Phase 0 — Gather the diff

Follow `references/angles.md` § Phase 0. Prefer the issue's merge base
against the repo's default integration branch when `@{upstream}` is missing
or wrong for this branch.

### Phase 1 — Review (four angles)

**Fan-out (preferred):** launch four independent workers in one dispatch when
the runtime supports concurrent agents. Each worker gets the same diff and
exactly one angle. Use the delivery reviewer role (or the runtime's review
role) with the angle name and the mandate text from `references/angles.md`.
Workers are **read-only** on the tree.

**Single-pass (fallback):** when fan-out is unavailable, one context walks
all four angles in turn. Do not skip an angle for lack of fan-out. The final
summary must state that the engine was single-pass.

Each finding: `file`, `line`, one-line `summary`, concrete cost.

A worker result without evidence (files read / checks run) is rejected and
re-run — same bar as other delivery roles.

### Phase 2 — Apply the fixes

Only when the occasion allows apply (table above).

1. Dedup findings that hit the same line or mechanism.
2. Fix each remaining finding directly (orchestrator or the delivery
   implementer role with file scope = the simplify finding set).
3. **Skip** per `references/angles.md` § Phase 2 (behavior change, outside
   diff, false positive) — note the skip.
4. Re-run the plan's verification command (or the issue's focused gate). If
   green fails, fix to green or revert the polish that broke it before
   leaving this skill. Never hand a red tree to phase 4.
5. Commit polish with Conventional Commits and the issue ID; report SHAs.

### Evidence artifact

Write git-ignored scratch (e.g. `docs/plans/<issue>-simplify.md`):

- engine: `fan-out` | `single-pass`
- diff range / base used
- findings (fixed / skipped / already clean), with `file:line`
- verification command + result
- commit SHAs if any

Pipeline phase 3b also records in run notes: simplify ran or skip reason,
and engine.

## Stop conditions

- Empty or docs-only diff after Phase 0 → skip, report already clean / N/A.
- Apply would require behavior change for every remaining finding → skip
  those, summarize, exit green on verification.
- Verification cannot be restored after apply → revert polish commits,
  record blocker on the issue, do not proceed as if simplified.

## Independent invocation

When the user asks only to simplify (no full pipeline), run this skill alone
with the occasion table above. Do not advance into phase 4 or ship.
