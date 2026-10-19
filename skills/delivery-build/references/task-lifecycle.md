# Shared task lifecycle

`references/continuous.md` and `references/story-unit.md` load this file after their mode-specific
setup. The scheduler or story-unit wrapper supplies the task, lane, lease IDs,
and paths; this file owns the implementation/review barrier.

## Dispatch contract

Build `.skills/<CODE>/task-N-brief.md` from the task block plus a reference to
the canonical Global Constraints section and its content hash. Include relevant
architecture seams, prior-task interfaces, ambiguity resolutions, and the
task's requirement footer. Do not paste the entire plan or duplicate global
constraints into each reviewer prompt.

Dispatch the worker with:

- the stable role contract;
- the feature capsule path and hash;
- the task delta path and hash;
- the current lane/worker lease ID;
- the report path and explicit model tier.

Resume the worker only while the lease preflight remains clean. Start a fresh
worker context after a semantic-unit boundary or any hard rotation trigger.

## Task barrier

1. Record `BASE=$(git rev-parse HEAD)` before the task starts. In an isolated
   lane, record the lane worktree and `WBASE` as well.
2. Dispatch or resume the worker. Answer questions before implementation.
3. Require test-first implementation, a commit on `DONE`, and the report
   contract in `references/implementer-prompt.md`. The report stores compact evidence:
   command, exit code, warning/error counts, revision, duration, and content
   hash; raw logs stay on disk and are opened only when evidence is missing,
   noisy, mismatched, or needed to investigate a finding.
4. Package `git log $BASE..HEAD`, `git diff --stat $BASE HEAD`, and
   `git diff -U10 $BASE HEAD` into
   `.skills/<CODE>/review-<base7>..<head7>.diff`. Never use `HEAD~1` as base.
5. Dispatch or resume the reviewer with the task brief path, report path, diff
   package path, evidence manifest, reviewer lease ID, and explicit model, against
   the contract in `references/task-reviewer-prompt.md`. The reviewer returns separate
   Standards and Spec verdicts. A task review is independent of the whole-branch
   review.
6. Critical/Important findings go through one fix dispatch for the complete
   finding set, then a fresh re-review. Three surviving cycles stop the build
   and escalate. The controller never fixes reviewer findings directly.
7. Resolve ⚠️ items the reviewer could not prove from the diff. Only after both
   verdicts are clean append:

   `Task N: complete (commits <base7>..<head7>, review clean)`

For a unit containing exactly one task, this task's clean Standards and Spec
verdicts also close the unit. Do not dispatch a duplicate unit reviewer over
the same diff, brief, and evidence. A multi-task unit still needs unit
synthesis at its barrier.

## Lease handoff

At task completion, retain the worker and reviewer leases only if the scheduler
will continue on the same semantic lane and the lease preflight remains clean.
Otherwise write the rotation reason to the runtime sidecar and start fresh from
the feature capsule plus the next task delta.
