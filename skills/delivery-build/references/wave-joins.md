<!-- From cmk delivery-pipeline 0.5.3 `worktree-wave-execution.md` (ADR 0001): the join,
one-writer and thrash rules `references/continuous.md` lacks. Its lanes, WBASE and wave
gate stay the home for dispatch. -->
# Joining a parallel wave

Loaded from `SKILL.md` § Parallel waves join linearly, at step 5 of
`references/continuous.md` § the ready-set loop, in place of a plain merge.

## Join and cleanup

Integrate finished tasks one at a time, in controller-chosen order (default:
task number):

1. **Verify on the task branch.** The task's review (`references/task-lifecycle.md`)
   passed on its own branch, over the range `WBASE..task-head`.
2. **Integrate — two moves, each from the worktree that owns the branch.**
   First, *inside the task worktree*, rebase the task branch onto the current
   ticket branch tip. Then, *from the ticket worktree*, advance the ticket
   branch with `git merge --ff-only <task-branch>`. The split is not style:
   the ticket branch is checked out in the ticket worktree, so `git branch
   -f` or a push onto it is refused by git — the ff-only merge is the only
   move that advances the checked-out ref, and it can never manufacture a
   merge commit. Linear history throughout. A rebase conflict means the
   disjoint-scope assumption failed: the controller MUST record the
   conflicting paths in the ledger, `git rebase --abort` so the task branch
   survives intact, and escalate to a fix round — never auto-resolve, never
   force past it. One known-benign shape: two tasks regenerating a shared
   derived file (a lockfile, generated bindings) conflict textually but not
   semantically — the resolution is to re-run the generator on the rebased
   state and commit its output, never to hand-merge generated content.
3. **Run the combined gate.** After each integration, run the affected gate
   commands in the ticket worktree. The wave is complete only when the fully
   integrated ticket branch passes its combined gates. Record the join in
   the ledger — task ID and the ticket-branch SHA it landed as — so a
   resumed controller can tell integrated tasks from pending ones.
4. **Clean up.** Only after the ff-only merge has landed the task's commits
   on the ticket branch: `git worktree remove <path>`, then delete the task
   branch (its commits are reachable from the ticket branch, so the delete
   loses nothing — never delete the branch before the merge). If removal
   refuses because the worktree is dirty, that is unreported, uncommitted
   work — the controller MUST escalate to the worker's fix round instead of
   forcing; `--force` is reserved for explicit abandonment. A failed or escalated task MUST
   retain its worktree and branch for the fix round. `git worktree prune`
   runs at phase close.

The next wave's base is the integrated ticket branch tip.

## Shared state has one writer

The ledger and the ticket branch are controller-owned. Workers MUST commit
only to their own task branch and MUST NOT write the ledger, the plan, or any
other shared file — they report SHAs and findings for the controller to
record. This removes the write races the protocol can remove; it is a rule
workers follow, not a mechanical impossibility, and the worktrees still share
one git object database (git's own locking makes concurrent commits safe, but
refs outside a task's own branch are off-limits to workers for the same
one-writer reason). Reading the ledger under waves: lines are keyed
`Task <N>:`, so filter by task ID before taking "the last line".

## Thrash detection

The controller MUST treat these worker signals as a **scheduling fault**, not
a task fault: build output containing lock-wait markers (e.g. Cargo's
`Blocking waiting for file lock`), or repeated build/gate timeouts with no new
ledger progress across consecutive turns. Progress is the discriminator — a
cold build also runs long, but its output advances (new `Compiling <crate>`
lines, new test names) from turn to turn; thrash shows lock-wait markers or
the *same* stalled output repeating. Slow-but-advancing is not a fault.
Response to a fault: stop the affected tasks, re-serialize them or isolate
the contended resource, and record the event in the ledger. This bounds any
eligibility miss to minutes instead of hours.
