# Phase 3: execute the plan

Run `superpowers:subagent-driven-development`. Its loop, fix rounds,
escalation, five-round cap, breaker, ledger, and brief extractor all run
unmodified.

**One substitution, and it is load-bearing.** SDD's `implementer-prompt.md`
opens with `Subagent (general-purpose):`. Dispatch the role instead —
`cmk-delivery-implementer` for implementers and fix rounds, and the
runtime's review agent or `cmk-delivery-reviewer` for task reviews. The
rest of the template is used verbatim as the dispatch prompt.

The two compose because they answer different questions: the role is the
system prompt — who the worker is, which skills are already loaded, which
tools to acquire, what scope it may touch — and the template is the task
prompt: the brief path, the report path, and the four-status return.
Dispatching general-purpose instead costs every preload silently, with no
error and nothing announcing the loss.

The template's `model:` field can be omitted for a role that declares its
own model and effort; its "REQUIRED" caution exists for a stock agent that
declares neither. The role also requires the worker to report each commit
SHA, which is what the scope check below consumes.

CMK changes exactly one thing: **independent tasks run in the same wave,
each in its own worktree.** SDD serializes implementers for two reasons,
and per-task worktrees remove both: concurrent commits contaminate a
shared branch's `BASE..HEAD` review packages, and a shared mutable build
root — one Cargo `target/` and its exclusive lock — serializes
"independent" tasks into lock-thrash where every worker turn blocks and
nothing progresses.

Wave eligibility: no `Depends on:`, disjoint `File scope:`, and no
intersecting `Exclusive resources:`. Disjoint scopes make independence
*checkable*, not guaranteed — never describe it as proven.

The dispatch, join, reconciliation, and cleanup protocol — parent-WIP
snapshot commits, pinned wave base, per-task branches, cache seeding,
rebase-then-ff-only integration, retention on failure, and every guard —
is `references/worktree-wave-execution.md`. Follow it exactly; its MUSTs
are load-bearing.

Review packages are per task branch: the range `wave-base..task-head`.
SDD's own review-package assembly cannot take a pathspec and lives in a
plugin cache overwritten on update, so use the repo's review-package
script where one exists — with an explicit per-task output path (a
range-keyed default silently collides between tasks sharing a base), the
task's `File scope:`, and its commits — otherwise assemble the diff with
`git diff` over the range. Either way, check each task's commits against
its declared scope: append any overflow to the package so it still gets
reviewed, and surface the violation to the controller rather than
silently reading past it.

**Thrash detection.** Lock-wait build output or repeated no-progress
timeouts are a scheduling fault, not a task fault: stop the affected
tasks, re-serialize or isolate the contended resource, and record it in
the ledger — never let the loop tick for hours against a lock.

Reading the ledger under waves: lines are keyed `Task <N>:`, so filter by
task ID **before** taking "the last line." Sequentially, the file's last
line and a task's last line coincide; in a wave they do not, and a
controller that confuses them resumes the wrong task's loop.

Do not delete the workspace, do not run SDD's final whole-branch review
here (that is phase 4's slot), and do not chain into
`superpowers:finishing-a-development-branch`.

Where the runtime has no execution engine, run the phase inline: same
gates, same evidence, one task at a time.
