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

CMK changes exactly one thing: **independent tasks run in the same wave.**
SDD serializes implementers because concurrent commits contaminate its
`BASE..HEAD` review packages — not merely because of file conflicts. Tasks
with no `Depends on:` and disjoint `File scope:` may be dispatched together
once three things hold:

1. **Review packages are path-scoped.** SDD's own review-package assembly
   cannot take a pathspec and lives in a plugin cache that is overwritten
   on update, so use a path-scoped review-package script the repo may
   provide — appending `-- <File scope>` to the same commit range —
   otherwise assemble the diff with `git diff` scoped to the task's file
   list.
2. **Each package has its own output path.** A commit-range-only filename
   is keyed by BASE and HEAD alone, so two tasks in one wave sharing a
   range resolve to the *same file* and one silently overwrites the other.
   Give each its own name, e.g. `review-task-<N>-<base7>..<head7>.diff`.
3. **Commits are checked against the declared scope.** A path-scoped diff
   hides edits made outside that scope, so they would ship unreviewed.
   Compare each task's actual commits against its `File scope:`; append
   any overflow to the package so it still gets reviewed, and surface the
   violation to the controller rather than silently reading past it.

Disjoint scopes make independence *checkable*, not guaranteed. Never
describe it as proven.

Reading the ledger under waves: lines are keyed `Task <N>:`, so filter by
task ID **before** taking "the last line." Sequentially, the file's last
line and a task's last line coincide; in a wave they do not, and a
controller that confuses them resumes the wrong task's loop.

Do not delete the workspace, do not run SDD's final whole-branch review
here (that is phase 4's slot), and do not chain into
`superpowers:finishing-a-development-branch`.

Where the runtime has no execution engine, run the phase inline: same
gates, same evidence, one task at a time.
