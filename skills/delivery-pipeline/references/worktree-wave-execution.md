# Worktree-per-task wave execution

The protocol phase 3 follows when dispatching independent tasks concurrently.
Every rule here is runtime-neutral — plain git and shell — so any harness can
implement it. A runtime binding may supply mechanics, never different rules.

Why this protocol exists: file-scope disjointness alone is not independence.
Toolchains with a shared mutable build root — Cargo is the canonical case: one
workspace-level `target/` guarded by an exclusive file lock — serialize two
"independent" tasks into lock-thrash where every worker turn blocks on
`Blocking waiting for file lock` and produces nothing. Per-task worktrees make
build state private by construction, and as a second effect give every task a
private branch, which removes the commit contamination that forced path-scoped
review packages.

## Contents

- [Wave eligibility](#wave-eligibility)
- [Dispatch](#dispatch)
- [Join and cleanup](#join-and-cleanup)
- [Reconciliation between tasks](#reconciliation-between-tasks)
- [Shared state has one writer](#shared-state-has-one-writer)
- [Thrash detection](#thrash-detection)
- [Snapshots never ship](#snapshots-never-ship)
- [Runtime bindings](#runtime-bindings)

## Wave eligibility

Tasks may share a wave only when all three hold:

1. No `Depends on:` edge between them (directly or transitively).
2. Disjoint `File scope:`. Disjointness makes independence *checkable*, not
   guaranteed — never describe it as proven.
3. No intersecting `Exclusive resources:`. Worktrees isolate build
   directories, but not shared services: the Docker daemon, a shared local
   chain or database, an external sandbox. Two tasks declaring the same
   resource never share a wave.

## Dispatch

1. **Snapshot the parent.** If the ticket worktree is dirty, the controller
   MUST create a snapshot commit on the ticket branch — subject prefixed
   `wip:`, capturing staged, unstaged, and untracked state via `git add -A`.
   Before staging, the controller MUST read the untracked list
   (`git status --porcelain`) and account for every entry: `.gitignore` keeps
   ignored state out, but it says nothing about files that were never given
   an ignore pattern — a stray credential file, key, or unexplained binary is
   exactly what this inspection exists to catch, and finding one aborts
   dispatch for explicit disposition instead of committing it. The snapshot
   is how parent WIP reaches sub-worktrees: byte-identical, but pinned to a
   SHA so every later `BASE..HEAD` computation is well-defined and nothing
   uncommitted can ship unreviewed. While any `wip:` commit exists on the
   ticket branch, the branch MUST NOT be pushed — no early draft PR, no
   backup push — because the subject-line ship gate cannot un-publish content
   that already reached a remote. A clean tree skips the snapshot. If the
   ticket worktree is mid-merge, mid-rebase, or mid-cherry-pick, dispatch
   MUST abort — snapshotting a half-resolved state pins garbage.
2. **Pin the wave base and record the wave manifest.** The wave base is the
   ticket branch tip after the snapshot. Every task in the wave branches from
   this SHA, and every task's review range starts at it. The controller MUST
   record a wave manifest in the ledger before dispatching: wave number,
   member task IDs, the wave-base SHA, and each task's worktree path and
   branch name. This manifest is what a crashed run resumes from — without
   it, a resuming controller cannot tell an already-integrated task from one
   that was never dispatched. A resuming controller MUST check the ledger for
   an incomplete wave manifest before any dispatch step and continue that
   wave from its recorded wave-base SHA — never re-snapshot or pin a new
   base while a manifest's wave is unfinished — and MUST verify each
   leftover task branch forks from that recorded base before resuming it.
3. **Create one worktree per task.**
   `git worktree add <path> -b <ticket-branch>--task-<N> <wave-base-sha>`,
   under the runtime's native worktree area — never an ad-hoc path — with the
   ticket identity embedded in `<path>` as well as the branch: a path keyed
   by task number alone collides with a concurrent ticket's task worktrees
   under cluster mode. Quote paths and branch names when running these
   commands through a shell. If a task branch or worktree from a previous
   run already exists, the controller MUST NOT silently reuse or delete it:
   inspect it, then either resume it as that task's fix-round state or record
   an explicit disposition. Git surfaces the common leftovers itself — an
   existing branch, a non-empty path, a branch checked out elsewhere all make
   `git worktree add` refuse — but an empty leftover directory does not, so
   the inspection is the guard; the git errors are only its backstop. A
   leftover found mid-rebase is an unfinished git operation, not fix-round
   state: `git rebase --abort` it, then redo that task's integration from its
   recorded branch.
4. **Initialize the environment.** Each sub-worktree runs the repo's
   worktree initialization and coherence checks, where the repo defines
   them, before any local dev. Env files are regenerated per worktree, never
   copied or sourced from a sibling.
5. **Verify build-dir isolation — never assume it.** A globally exported
   shared build directory (`CARGO_TARGET_DIR` or any equivalent) silently
   defeats per-worktree isolation and reintroduces the lock thrash. Dispatch
   MUST unset or override such variables in each sub-worktree's environment
   and MUST fail loudly if a shared build dir is still detected.
6. **Seed build caches.** Where the toolchain tolerates relocation, copy the
   parent's derived build state (for Cargo, `target/`) into the sub-worktree
   so it starts warm: prefer a copy-on-write clone (`cp -c -R` on macOS/APFS,
   `cp --reflink=auto -R` on Linux — `auto` degrades to a plain copy on
   filesystems without reflink), fall back to a plain copy, and accept a cold
   build only when copying is unattractive. Seeding MUST target a destination
   that does not exist yet: `cp -R` into an existing directory nests
   (`target/target/…`) instead of merging, silently leaving stale artifacts
   in charge — so a resumed worktree keeps the build state it already has and
   is never re-seeded. Seeding MUST happen while no build runs in the parent
   — never copy a build dir a live compiler holds locked. Warm start is an
   optimization, not a guarantee: a seed that postdates a toolchain change
   just rebuilds (compiler fingerprints invalidate it), which costs time, not
   correctness. Before a plain (non-CoW) copy, the controller MUST check free
   disk against the seed's size; wave width is chosen against host capacity —
   cores, disk, and any per-worktree port space — not just task independence.
   Run the ecosystem's dependency install per sub-worktree where required.
7. **Dispatch the worker** with its working directory set to the sub-worktree.
   The brief, gate commands, scope, and reporting contract are unchanged.

## Join and cleanup

Integrate finished tasks one at a time, in controller-chosen order (default:
task number):

1. **Verify on the task branch.** The per-task gate command passes there. The
   review package is the range `wave-base..task-head` — the branch contains
   only this task's commits, so the scope filter no longer has to *select*
   this task's work out of a shared branch; its remaining job is the overflow
   check. Build the package with the repo's review-package script where one
   exists (per `phase-3-execution.md`), giving each task an explicit per-task
   output path and the task's declared scope and its own commits. Commits a
   controller-recorded peer pull cherry-picked from another task stay out of
   that commit list: they are the source task's work, reviewed in its own
   package, and listing them under this task's disjoint scope would surface
   as a false scope violation (the scope filter already keeps their content
   out of the package body). Edits outside the declared scope are appended
   to the package for review and surfaced as a distinct non-zero exit, which
   the controller MUST handle as a scope violation — never as a generic
   failure to retry blindly.
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

The next wave's base is the integrated ticket branch tip; the snapshot step
repeats if the controller has new WIP.

## Reconciliation between tasks

- **Default: reconcile at the join.** Wave tasks are independent by
  construction; their work meets on the ticket branch, and the next wave sees
  the integrated state. Dependent tasks (`Depends on:`) simply run in a later
  wave, branching from a tip that already contains their prerequisites.
- **Mid-wave peer pull: controller-authorized only.** All worktrees share one
  git object database, so task A can cherry-pick task B's committed work at
  any moment mechanically. That move is permitted only as an explicit
  controller decision, and the ledger MUST record that A's effective base now
  includes B's commits so A's review range and reviewer context are set
  accordingly. A peer pull also constrains the join: integrate B before A,
  and verify during A's rebase that the cherry-picked commits drop as
  patch-identical duplicates — if they survive (the patch drifted after the
  pick), treat it as a conflict and escalate rather than landing B's work
  twice. If B fails, is escalated, or its work materially changes before its
  own join, A's pick is stale: the controller MUST either rewrite A's task
  branch to drop the picked commits (recorded in the ledger) or hold A's
  join until B lands — never integrate A carrying commits whose source never
  shipped. Unmediated peer merging is prohibited — it recreates the
  cross-contamination this protocol removes.

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

## Snapshots never ship

Phase 5 MUST verify that no `wip:`-prefixed commit remains in the PR range
(`git log --oneline <base>..HEAD` is clean of them); wave snapshots are
absorbed or squashed before a PR exists. Verified, not assumed. Absorption is
the **controller's** job, done on the ticket branch before anything is
pushed: finish the snapshot's content into the real commit that owns it and
rewrite the `wip:` commit away (fixup-style rebase of the ticket branch, or
reset-and-recommit when the snapshot content became one coherent change).
The no-push-while-wip rule in Dispatch step 1 is what makes this history
rewrite safe — nothing upstream has the old SHAs. With multiple snapshots
(one per wave), absorb each the same way; every one MUST be gone from the
range before the ship gate runs.

## Runtime bindings

The controller-managed `git worktree add` flow above is the reference
implementation. A runtime's native worktree convenience may substitute only
when it satisfies every observable requirement of this contract: branch from
the pinned wave-base SHA, honor the task branch name, retain the worktree on
failure, and permit cache seeding. A mechanism that picks its own base or
auto-removes worktrees does not satisfy the contract and may only be used
after verifying each point for that dispatch. Bindings record which
protections their runtime enforces versus which remain the controller's
responsibility. A runtime with no concurrent-dispatch mechanism still follows
this protocol — wave members execute one after another, each in its own
worktree from the same pinned wave base, losing wall-clock parallelism but
none of the guarantees.

Adoption is per-dispatch, not per-repo: a ticket mid-execution when this
protocol lands finishes its current wave under the rules it started with and
picks up this contract at its next dispatch. A runtime whose binding still
describes sequential execution follows its binding until the binding is
updated — the reference never silently overrides a binding already in force.
